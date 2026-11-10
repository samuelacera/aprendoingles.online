import { getApiUser } from "@/lib/api/auth";
import { apiError, apiOk, apiOptions, guard } from "@/lib/api/response";
import { canViewLesson, getCourseAccessForUser } from "@/lib/access";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  DAILY_CALLS_PER_USER,
  MAX_CALL_SECONDS,
  cefrOrDefault,
  getPracticeScenario,
  getSignedUrl,
} from "@/lib/practice";

export const dynamic = "force-dynamic";
export const OPTIONS = apiOptions;

const slug = (v: unknown) =>
  typeof v === "string" && /^[a-z0-9-]{1,120}$/.test(v) ? v : null;

/**
 * POST /api/v1/practice/sessions   { courseSlug, lessonSlug, platform?, guided? }
 *
 * Starts a role-play call: checks the lesson access (same rule as the
 * lesson itself), the daily limit, creates the practice_sessions row and
 * returns a one-use signed URL plus the variables the client passes to
 * the ElevenLabs SDK. The scenario comes from Sanity, never the client.
 */
export async function POST(request: Request) {
  return guard(async () => {
    const user = await getApiUser(request);
    if (!user) return apiError("unauthorized", "Inicia sesión para practicar.");

    const body = await request.json().catch(() => null);
    const courseSlug = slug(body?.courseSlug);
    const lessonSlug = slug(body?.lessonSlug);
    if (!courseSlug || !lessonSlug) return apiError("bad_request", "Petición incompleta.");

    const scenario = await getPracticeScenario(courseSlug, lessonSlug, user.email ?? null);
    if (!scenario) return apiError("not_found", "Esta lección no tiene práctica por voz.");

    const access = await getCourseAccessForUser(user.id, courseSlug);
    if (!canViewLesson(access, scenario.lessonFree)) {
      return apiError("payment_required", "Esta práctica es parte del curso completo.");
    }

    const admin = createAdminClient();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const [{ count }, profile, membership] = await Promise.all([
      admin
        .from("practice_sessions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("started_at", since),
      // Optional context: a missing table or row must never block a call.
      admin.from("learning_profiles").select("english_level").eq("user_id", user.id).maybeSingle(),
      admin
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle(),
    ]);

    if ((count ?? 0) >= DAILY_CALLS_PER_USER) {
      return apiError(
        "forbidden",
        `Has hecho ${DAILY_CALLS_PER_USER} llamadas en las últimas 24 horas. Vuelve mañana.`,
      );
    }

    const englishLevel = cefrOrDefault(profile.data?.english_level);
    const learnerName =
      (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
      (user.user_metadata?.name as string | undefined)?.split(" ")[0] ||
      "the caller";

    const guided = body?.guided === true;
    const row = {
      user_id: user.id,
      organization_id: membership.data?.organization_id ?? null,
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      scenario_key: scenario.key,
      english_level: englishLevel,
      platform: typeof body?.platform === "string" ? body.platform.slice(0, 20) : "web",
    };
    let { data: session, error } = await admin
      .from("practice_sessions")
      .insert({ ...row, guided })
      .select("id")
      .single();
    // Before migration 005 the column doesn't exist: start the call anyway.
    if (error?.code === "PGRST204") {
      ({ data: session, error } = await admin.from("practice_sessions").insert(row).select("id").single());
    }
    if (error || !session) throw error ?? new Error("No se pudo crear la sesión");

    let signedUrl: string;
    try {
      signedUrl = await getSignedUrl();
    } catch (err) {
      await admin.from("practice_sessions").update({ status: "failed" }).eq("id", session.id);
      throw err;
    }

    return apiOk({
      sessionId: session.id,
      signedUrl,
      guided,
      maxSeconds: MAX_CALL_SECONDS,
      dynamicVariables: {
        session_id: session.id,
        persona: scenario.persona,
        scenario: scenario.scenario,
        learner_goal: scenario.learnerGoal,
        behaviour: scenario.behaviour,
        learner_name: learnerName,
        english_level: englishLevel,
      },
      overrides: {
        firstMessage: scenario.firstMessage,
        voiceId: scenario.voiceId,
      },
    });
  });
}

/**
 * GET /api/v1/practice/sessions?courseSlug=&lessonSlug=
 * The learner's last evaluated calls for a lesson (newest first).
 */
export async function GET(request: Request) {
  return guard(async () => {
    const user = await getApiUser(request);
    if (!user) return apiError("unauthorized", "Inicia sesión para ver tus llamadas.");

    const url = new URL(request.url);
    const courseSlug = slug(url.searchParams.get("courseSlug"));
    const lessonSlug = slug(url.searchParams.get("lessonSlug"));
    if (!courseSlug || !lessonSlug) return apiError("bad_request", "Petición incompleta.");

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("practice_sessions")
      .select("id, started_at, duration_seconds, overall_score, goal_achieved, cefr_estimate, scores, guided:feedback->guided")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("lesson_slug", lessonSlug)
      .eq("status", "evaluated")
      .order("started_at", { ascending: false })
      .limit(10);
    if (error) throw error;

    return apiOk({ sessions: data ?? [] });
  });
}
