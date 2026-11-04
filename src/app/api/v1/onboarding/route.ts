import { getApiUser } from "@/lib/api/auth";
import { apiError, apiOk, apiOptions, guard } from "@/lib/api/response";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const OPTIONS = apiOptions;

/**
 * POST /api/v1/onboarding
 *   { categorySlug, courseSlug, englishLevel, skillLevel, goal, goalDeadline,
 *     background, jobTitle, source, dailyMinutes, platform }
 *
 * Stores the answers the app collects before signup. Called right after
 * the account exists; calling it again overwrites (the user can redo the
 * onboarding). Unknown enum values are dropped, not rejected: a newer app
 * build must never fail to sign someone up because of a new option.
 */

const ENGLISH_LEVELS = new Set(["a1", "a2", "b1", "b2", "c1"]);
const SKILL_LEVELS = new Set(["beginner", "practitioner", "expert"]);

const text = (value: unknown, max = 120) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

const oneOf = (value: unknown, allowed: Set<string>) =>
  typeof value === "string" && allowed.has(value) ? value : null;

export async function POST(request: Request) {
  return guard(async () => {
    const user = await getApiUser(request);
    if (!user) return apiError("unauthorized", "Inicia sesión para continuar.");

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return apiError("bad_request", "Petición incompleta.");
    }

    const minutes = Math.floor(Number(body.dailyMinutes) || 0);

    const row = {
      user_id: user.id,
      category_slug: text(body.categorySlug),
      course_slug: text(body.courseSlug),
      english_level: oneOf(body.englishLevel, ENGLISH_LEVELS),
      skill_level: oneOf(body.skillLevel, SKILL_LEVELS),
      goal: text(body.goal, 60),
      goal_deadline: text(body.goalDeadline, 30),
      background: text(body.background, 60),
      job_title: text(body.jobTitle),
      source: text(body.source, 60),
      daily_minutes: minutes >= 1 && minutes <= 120 ? minutes : null,
      answers: body,
      platform: text(body.platform, 20),
      updated_at: new Date().toISOString(),
    };

    const admin = createAdminClient();
    const { error } = await admin.from("learning_profiles").upsert(row);
    if (error) throw error;

    return apiOk({ ok: true });
  });
}
