import { getApiUser } from "@/lib/api/auth";
import { apiError, apiOk, apiOptions, guard } from "@/lib/api/response";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const OPTIONS = apiOptions;

/**
 * GET /api/v1/me
 *
 * Everything the app needs on launch: identity, entitlement state (drives
 * the paywall) and the user's courses with progress. One round trip.
 */
export async function GET(request: Request) {
  return guard(async () => {
    const user = await getApiUser(request);
    if (!user) return apiError("unauthorized", "Inicia sesión para continuar.");

    const admin = createAdminClient();

    const [{ data: profile }, { data: sub }, { data: enrollments }, { data: progress }] =
      await Promise.all([
        admin
          .from("profiles")
          .select("id, email, full_name, avatar_url, company, job_title, created_at")
          .eq("id", user.id)
          .maybeSingle(),
        admin
          .from("subscriptions")
          .select(
            "status, provider, store, product_id, entitlement, plan, current_period_end, will_renew, cancel_at_period_end",
          )
          .eq("user_id", user.id)
          .maybeSingle(),
        admin
          .from("enrollments")
          .select("course_slug, enrollment_type, provider, enrolled_at, expires_at, active")
          .eq("user_id", user.id)
          .eq("active", true)
          .order("enrolled_at", { ascending: false }),
        admin
          .from("lesson_progress")
          .select("course_slug, lesson_slug, completed_at, time_spent_seconds")
          .eq("user_id", user.id),
      ]);

    const now = Date.now();
    const activeStatuses = new Set(["active", "trialing", "in_grace_period"]);
    const subscriptionActive =
      !!sub &&
      activeStatuses.has(sub.status) &&
      (!sub.current_period_end ||
        new Date(sub.current_period_end).getTime() > now);

    // Roll progress up per course so the app can render "3/16 · 42 min"
    // without pulling every lesson row itself.
    const byCourse = new Map<
      string,
      { completedLessons: number; startedLessons: number; timeSpentSeconds: number }
    >();

    for (const row of progress ?? []) {
      const entry = byCourse.get(row.course_slug) ?? {
        completedLessons: 0,
        startedLessons: 0,
        timeSpentSeconds: 0,
      };
      entry.startedLessons += 1;
      if (row.completed_at) entry.completedLessons += 1;
      entry.timeSpentSeconds += row.time_spent_seconds ?? 0;
      byCourse.set(row.course_slug, entry);
    }

    return apiOk({
      user: {
        id: user.id,
        email: profile?.email ?? user.email ?? null,
        fullName: profile?.full_name ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        company: profile?.company ?? null,
        jobTitle: profile?.job_title ?? null,
        createdAt: profile?.created_at ?? null,
      },
      // The app's single source of truth for the paywall. RevenueCat's local
      // cache is a convenience; this is authoritative.
      entitlements: {
        allAccess: subscriptionActive,
        subscription: sub
          ? {
              status: sub.status,
              provider: sub.provider,
              store: sub.store,
              productId: sub.product_id,
              entitlement: sub.entitlement,
              plan: sub.plan,
              currentPeriodEnd: sub.current_period_end,
              willRenew: sub.will_renew,
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            }
          : null,
      },
      courses: (enrollments ?? []).map((e) => ({
        courseSlug: e.course_slug,
        enrollmentType: e.enrollment_type,
        provider: e.provider,
        enrolledAt: e.enrolled_at,
        expiresAt: e.expires_at,
        progress:
          byCourse.get(e.course_slug) ?? {
            completedLessons: 0,
            startedLessons: 0,
            timeSpentSeconds: 0,
          },
      })),
    });
  });
}
