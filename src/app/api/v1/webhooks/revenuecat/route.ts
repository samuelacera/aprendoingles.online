import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/webhooks/revenuecat
 *
 * The ONLY path through which paid access is granted. The app never tells us
 * it bought something — RevenueCat does, server to server, after the store
 * has validated the receipt.
 *
 * Contract notes:
 *   - Auth: RevenueCat sends a fixed `Authorization` header we configure in
 *     its dashboard. It is NOT a signature, so it must be a long random
 *     secret and compared in constant time.
 *   - Idempotency: RevenueCat retries until it gets a 2xx. Every event id is
 *     recorded in `webhook_events`; duplicates are acknowledged and skipped.
 *   - We answer 200 for anything we understood but chose not to act on, so
 *     RevenueCat doesn't retry forever. Only real failures return 5xx.
 *
 * The app must call Purchases.logIn(<supabase user id>) so that
 * `app_user_id` is the Supabase UUID — that's the join key.
 */

const ALL_ACCESS_ENTITLEMENT =
  process.env.RC_ALL_ACCESS_ENTITLEMENT || "all_access";

/** Store → our `store` column. */
const STORE_MAP: Record<string, string> = {
  APP_STORE: "app_store",
  MAC_APP_STORE: "mac_app_store",
  PLAY_STORE: "play_store",
  AMAZON: "amazon",
  STRIPE: "stripe",
  PROMOTIONAL: "promotional",
};

interface RcEvent {
  id: string;
  type: string;
  app_user_id?: string;
  original_app_user_id?: string;
  product_id?: string;
  entitlement_ids?: string[] | null;
  period_type?: string;
  purchased_at_ms?: number;
  expiration_at_ms?: number | null;
  store?: string;
  environment?: string;
  cancel_reason?: string | null;
  original_transaction_id?: string;
  transferred_from?: string[];
  transferred_to?: string[];
}

/** Constant-time string compare (avoids leaking the secret via timing). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Which course a one-off product unlocks.
 * Configure RC_PRODUCT_COURSE_MAP as JSON, e.g.
 *   {"ingles_ventas_lifetime":"ingles-para-ventas"}
 * Falls back to the convention `course.<slug>`.
 */
function courseSlugForProduct(productId: string | undefined): string | null {
  if (!productId) return null;

  try {
    const map = JSON.parse(process.env.RC_PRODUCT_COURSE_MAP || "{}");
    if (typeof map[productId] === "string") return map[productId];
  } catch {
    console.error("[revenuecat] RC_PRODUCT_COURSE_MAP is not valid JSON");
  }

  if (productId.startsWith("course.")) return productId.slice(7);
  return null;
}

type Status =
  | "active"
  | "trialing"
  | "canceled"
  | "past_due"
  | "expired"
  | "paused"
  | "in_grace_period";

/** Maps a RevenueCat event to the subscription status it implies. */
function statusForEvent(event: RcEvent): Status | null {
  const isTrial = event.period_type === "TRIAL";

  switch (event.type) {
    case "INITIAL_PURCHASE":
    case "RENEWAL":
    case "UNCANCELLATION":
    case "PRODUCT_CHANGE":
    case "SUBSCRIPTION_EXTENDED":
    case "TRANSFER":
      return isTrial ? "trialing" : "active";

    case "CANCELLATION":
      // A refund revokes access now; a plain cancellation keeps it until the
      // paid period ends (the store already charged for it).
      return event.cancel_reason === "CUSTOMER_SUPPORT" ||
        event.cancel_reason === "REFUND"
        ? "expired"
        : "canceled";

    case "BILLING_ISSUE":
      return "in_grace_period";

    case "SUBSCRIPTION_PAUSED":
      return "paused";

    case "EXPIRATION":
      return "expired";

    default:
      return null; // TEST, INVOICE_ISSUANCE, etc. — recorded, not acted on.
  }
}

export async function POST(request: Request) {
  // ── 1. Authenticate the caller ──
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[revenuecat] REVENUECAT_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const provided = request.headers.get("authorization") ?? "";
  if (!safeEqual(provided, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const event: RcEvent | undefined = payload?.event;

  if (!event?.id || !event?.type) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const admin = createAdminClient();

  // ── 2. Resolve the user ──
  // app_user_id is the Supabase UUID once the app has called logIn(). An
  // anonymous id ($RCAnonymousID:...) means the purchase happened before
  // login — we log it and move on; RevenueCat re-sends a TRANSFER event
  // when the purchase is later attached to a real user.
  const appUserId = event.app_user_id ?? event.original_app_user_id ?? null;
  const isUuid =
    !!appUserId &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      appUserId,
    );

  let userId: string | null = null;
  if (isUuid) {
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("id", appUserId)
      .maybeSingle();
    userId = profile?.id ?? null;
  }

  // ── 3. Idempotency: record the event, bail if already seen ──
  const { error: insertError } = await admin.from("webhook_events").insert({
    provider: "revenuecat",
    event_id: event.id,
    event_type: event.type,
    app_user_id: appUserId,
    user_id: userId,
    payload,
  });

  if (insertError) {
    // 23505 = unique_violation → we already processed this event.
    if (insertError.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error("[revenuecat] could not record event", insertError);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  if (!userId) {
    console.warn(`[revenuecat] ${event.type} for unmapped user ${appUserId}`);
    return NextResponse.json({ ok: true, ignored: "unknown_user" });
  }

  const store = STORE_MAP[event.store ?? ""] ?? null;
  const environment = event.environment === "SANDBOX" ? "sandbox" : "production";
  const periodStart = event.purchased_at_ms
    ? new Date(event.purchased_at_ms).toISOString()
    : null;
  const periodEnd = event.expiration_at_ms
    ? new Date(event.expiration_at_ms).toISOString()
    : null;

  // ── 4a. One-off purchase of a single course ──
  if (event.type === "NON_RENEWING_PURCHASE") {
    const courseSlug = courseSlugForProduct(event.product_id);

    if (!courseSlug) {
      console.warn(`[revenuecat] no course mapped to ${event.product_id}`);
      return NextResponse.json({ ok: true, ignored: "unmapped_product" });
    }

    const { error } = await admin.from("enrollments").upsert(
      {
        user_id: userId,
        course_slug: courseSlug,
        enrollment_type: "individual",
        provider: "revenuecat",
        store,
        product_id: event.product_id,
        store_transaction_id: event.original_transaction_id,
        environment,
        active: true,
        expires_at: null, // one-off = lifetime access to that course
      },
      { onConflict: "user_id,course_slug" },
    );

    if (error) {
      console.error("[revenuecat] enrollment upsert failed", error);
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }

    await admin.from("activity_log").insert({
      user_id: userId,
      activity: "enrollment",
      course_slug: courseSlug,
      metadata: { type: "individual", provider: "revenuecat", store },
    });

    return NextResponse.json({ ok: true, granted: courseSlug });
  }

  // ── 4b. Subscription lifecycle ──
  const status = statusForEvent(event);
  if (!status) {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const entitlement =
    event.entitlement_ids?.[0] ?? ALL_ACCESS_ENTITLEMENT;

  const { error } = await admin.rpc("upsert_rc_subscription", {
    p_user_id: userId,
    p_status: status,
    p_store: store,
    p_product_id: event.product_id ?? null,
    p_entitlement: entitlement,
    p_app_user_id: appUserId,
    p_original_transaction_id: event.original_transaction_id ?? null,
    p_period_start: periodStart,
    p_period_end: periodEnd,
    p_will_renew: status === "active" || status === "trialing",
    p_environment: environment,
  });

  if (error) {
    console.error("[revenuecat] subscription upsert failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status });
}
