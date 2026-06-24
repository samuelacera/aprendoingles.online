import { createClient } from "@/lib/supabase/server";

/**
 * Centralized access-control logic. This is the single source of truth for
 * "can this user access this course/lesson". Do not scatter access checks
 * across components — call these helpers.
 *
 * Access rule:
 *   A lesson is viewable if:
 *     - the lesson is marked free (preview, even when logged out), OR
 *     - the user has an active subscription (all-access), OR
 *     - the user has an active enrollment for that course.
 */

export interface CourseAccess {
  userId: string | null;
  hasSubscription: boolean;
  isEnrolled: boolean;
  /** True if the user can access the full (paid) course content. */
  hasFullAccess: boolean;
}

export async function getCourseAccess(courseSlug: string): Promise<CourseAccess> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      userId: null,
      hasSubscription: false,
      isEnrolled: false,
      hasFullAccess: false,
    };
  }

  const [{ data: sub }, { data: enrollment }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("enrollments")
      .select("id, active, expires_at")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("active", true)
      .maybeSingle(),
  ]);

  const now = Date.now();
  const hasSubscription =
    !!sub &&
    (sub.status === "active" || sub.status === "trialing") &&
    (!sub.current_period_end || new Date(sub.current_period_end).getTime() > now);

  const isEnrolled =
    !!enrollment &&
    enrollment.active &&
    (!enrollment.expires_at || new Date(enrollment.expires_at).getTime() > now);

  return {
    userId: user.id,
    hasSubscription,
    isEnrolled,
    hasFullAccess: hasSubscription || isEnrolled,
  };
}

/** Whether a specific lesson is viewable given the course access + free flag. */
export function canViewLesson(access: CourseAccess, lessonIsFree: boolean): boolean {
  return lessonIsFree || access.hasFullAccess;
}
