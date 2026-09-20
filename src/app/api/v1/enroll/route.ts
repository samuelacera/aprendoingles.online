import { getApiUser } from "@/lib/api/auth";
import { apiError, apiOk, apiOptions, guard } from "@/lib/api/response";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCoursePrice } from "@/sanity/queries";

export const dynamic = "force-dynamic";
export const OPTIONS = apiOptions;

/**
 * POST /api/v1/enroll  { courseSlug }
 *
 * Free enrollment only. Paid access is NEVER granted here — it arrives
 * through the RevenueCat webhook (app) or Stripe (web). The client has no
 * write policy on `enrollments`, so this route is the only free path in.
 */
export async function POST(request: Request) {
  return guard(async () => {
    const user = await getApiUser(request);
    if (!user) return apiError("unauthorized", "Inicia sesión para continuar.");

    const body = await request.json().catch(() => null);
    const courseSlug = body?.courseSlug;

    if (!courseSlug || typeof courseSlug !== "string") {
      return apiError("bad_request", "Falta courseSlug.");
    }

    // Validate server-side that the course exists and is actually free.
    const price = await getCoursePrice(courseSlug);
    if (price === undefined) {
      return apiError("not_found", "Curso no encontrado.");
    }
    if (price > 0) {
      return apiError(
        "payment_required",
        "Este curso requiere acceso de pago.",
      );
    }

    const admin = createAdminClient();

    const { data: existing } = await admin
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .maybeSingle();

    if (existing) {
      return apiOk({ enrolled: true, alreadyEnrolled: true });
    }

    const { error } = await admin.from("enrollments").insert({
      user_id: user.id,
      course_slug: courseSlug,
      enrollment_type: "free",
      provider: "internal",
    });

    if (error) return apiError("server_error", "No se pudo completar la inscripción.");

    await admin.from("activity_log").insert({
      user_id: user.id,
      activity: "enrollment",
      course_slug: courseSlug,
      metadata: { type: "free", source: "api_v1" },
    });

    return apiOk({ enrolled: true, alreadyEnrolled: false });
  });
}
