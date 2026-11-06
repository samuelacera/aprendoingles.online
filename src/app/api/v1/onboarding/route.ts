import { getApiUser } from "@/lib/api/auth";
import { apiError, apiOk, apiOptions, guard } from "@/lib/api/response";
import { saveLearningProfile } from "@/lib/learning-profile";

export const dynamic = "force-dynamic";
export const OPTIONS = apiOptions;

/**
 * POST /api/v1/onboarding
 *   { categorySlug, courseSlug, englishLevel, skillLevel, goal, goalDeadline,
 *     background, jobTitle, source, dailyMinutes, platform }
 *
 * Stores the answers the app collects before signup. Called right after
 * the account exists; calling it again overwrites (the user can redo the
 * onboarding). Validation lives in src/lib/learning-profile.ts, shared with
 * the web level test.
 */
export async function POST(request: Request) {
  return guard(async () => {
    const user = await getApiUser(request);
    if (!user) return apiError("unauthorized", "Inicia sesión para continuar.");

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return apiError("bad_request", "Petición incompleta.");
    }

    await saveLearningProfile(user.id, body);
    return apiOk({ ok: true });
  });
}
