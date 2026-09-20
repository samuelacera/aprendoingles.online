import { getApiUser } from "@/lib/api/auth";
import { apiError, apiOk, apiOptions, guard } from "@/lib/api/response";
import { canViewLesson, getCourseAccessForUser } from "@/lib/access";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLesson } from "@/sanity/queries";

export const dynamic = "force-dynamic";
export const OPTIONS = apiOptions;

/**
 * POST /api/v1/progress
 *   { courseSlug, lessonSlug, action: "start"|"time"|"complete"|"quiz", ... }
 *
 * Server-authoritative progress for Fundae. The client never writes to the
 * DB; it only reports events, and every one of them is validated here:
 *
 *   - the lesson must exist in the CMS (no invented slugs in the audit log)
 *   - the caller must actually be able to view it (no clocking hours on
 *     content they never had access to)
 *   - reported time is clamped per heartbeat
 */

// Heartbeats fire ~every 30s; this bounds how much a tampered client can
// inflate time in a single call.
const MAX_HEARTBEAT_SECONDS = 90;

type Action = "start" | "time" | "complete" | "quiz";
const ACTIONS = new Set<Action>(["start", "time", "complete", "quiz"]);

export async function POST(request: Request) {
  return guard(async () => {
    const user = await getApiUser(request);
    if (!user) return apiError("unauthorized", "Inicia sesión para continuar.");

    const body = await request.json().catch(() => null);
    const { courseSlug, lessonSlug, action, timeSpent, quizScore, quizTotal } =
      body ?? {};

    if (!courseSlug || !lessonSlug || !ACTIONS.has(action)) {
      return apiError("bad_request", "Petición incompleta o acción no válida.");
    }

    // The lesson must be real, and the user must be entitled to it. Without
    // this, progress rows (and Fundae hours) could be fabricated for any slug.
    const lesson = await getLesson(courseSlug, lessonSlug);
    if (!lesson) return apiError("not_found", "Lección no encontrada.");

    const access = await getCourseAccessForUser(user.id, courseSlug);
    if (!canViewLesson(access, lesson.free)) {
      return apiError("forbidden", "No tienes acceso a esta lección.");
    }

    const admin = createAdminClient();

    // Every action needs the progress row to exist, so create it once here
    // instead of only on "start" (the app may go offline and replay events
    // out of order).
    const { data: existing } = await admin
      .from("lesson_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("lesson_slug", lessonSlug)
      .maybeSingle();

    if (!existing) {
      await admin.from("lesson_progress").insert({
        user_id: user.id,
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
      });

      await admin.from("activity_log").insert({
        user_id: user.id,
        activity: "lesson_start",
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
      });
    }

    if (action === "start") {
      return apiOk({ ok: true });
    }

    if (action === "time") {
      const seconds = Math.min(
        MAX_HEARTBEAT_SECONDS,
        Math.max(0, Math.floor(Number(timeSpent) || 0)),
      );

      await admin.rpc("increment_time_spent", {
        p_user_id: user.id,
        p_course_slug: courseSlug,
        p_lesson_slug: lessonSlug,
        p_seconds: seconds,
      });

      return apiOk({ ok: true, seconds });
    }

    if (action === "complete") {
      await admin
        .from("lesson_progress")
        .update({ completed_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("course_slug", courseSlug)
        .eq("lesson_slug", lessonSlug)
        .is("completed_at", null); // keep the original completion timestamp

      await admin.from("activity_log").insert({
        user_id: user.id,
        activity: "lesson_complete",
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
      });

      return apiOk({ ok: true });
    }

    // action === "quiz"
    const total = Math.max(0, Math.floor(Number(quizTotal) || 0));
    const score = Math.min(total, Math.max(0, Math.floor(Number(quizScore) || 0)));

    await admin.rpc("increment_quiz_attempts", {
      p_user_id: user.id,
      p_course_slug: courseSlug,
      p_lesson_slug: lessonSlug,
      p_score: score,
      p_total: total,
    });

    await admin.from("activity_log").insert({
      user_id: user.id,
      activity: total > 0 && score === total ? "quiz_pass" : "quiz_attempt",
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      metadata: { score, total },
    });

    return apiOk({ ok: true, score, total });
  });
}
