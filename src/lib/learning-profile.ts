import { createAdminClient } from "@/lib/supabase/admin";

/**
 * learning_profiles: what the user wants to learn and their level. Written by
 * the app onboarding (POST /api/v1/onboarding) and by the web level test
 * (/test-nivel). Unknown enum values are dropped, not rejected: a newer client
 * must never fail to sign someone up because of a new option.
 */

const ENGLISH_LEVELS = new Set(["a1", "a2", "b1", "b2", "c1"]);
const SKILL_LEVELS = new Set(["beginner", "practitioner", "expert"]);

const text = (value: unknown, max = 120) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

const oneOf = (value: unknown, allowed: Set<string>) =>
  typeof value === "string" && allowed.has(value) ? value : null;

export function buildProfileRow(userId: string, body: Record<string, unknown>) {
  const minutes = Math.floor(Number(body.dailyMinutes) || 0);
  return {
    user_id: userId,
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
}

/** Writes (or overwrites) the profile. */
export async function saveLearningProfile(userId: string, body: Record<string, unknown>) {
  const admin = createAdminClient();
  const { error } = await admin.from("learning_profiles").upsert(buildProfileRow(userId, body));
  if (error) throw error;
}

/** Parses the JSON the level test posts; null if it isn't an object. */
export function parseOnboarding(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== "string" || raw.length > 20000) return null;
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * After the email confirmation: the level test answers travel in the user
 * metadata (there is no session at signup). Saved once; later logins or a
 * password reset don't overwrite a newer profile.
 */
export async function saveProfileFromMetadata(user: {
  id: string;
  user_metadata?: Record<string, unknown>;
}) {
  const onboarding = user.user_metadata?.onboarding;
  if (!onboarding || typeof onboarding !== "object") return;
  const admin = createAdminClient();
  const { error } = await admin
    .from("learning_profiles")
    .upsert(buildProfileRow(user.id, onboarding as Record<string, unknown>), {
      onConflict: "user_id",
      ignoreDuplicates: true,
    });
  if (error) console.error("learning_profiles from metadata:", error.message);
}
