import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  canViewPrivateCourse,
  getPrivateCourseAllowlist,
} from "@/sanity/private";

/**
 * Centralized access-control logic. This is the single source of truth for
 * "can this user access this course/lesson". Do not scatter access checks
 * across components — call these helpers.
 *
 * Access rule:
 *   A lesson is viewable if:
 *     - the lesson is marked free (preview, even when logged out), OR
 *     - the user has an active subscription (all-access), OR
 *     - the user has an active enrollment for that course, OR
 *     - the course is private and the user's email is on its list.
 *
 * A subscription may come from Stripe (web) or from RevenueCat (App Store /
 * Play Store). Both land in `subscriptions`, so the rule is provider-agnostic.
 */

export interface CourseAccess {
  userId: string | null;
  hasSubscription: boolean;
  isEnrolled: boolean;
  /** True if the user can access the full (paid) course content. */
  hasFullAccess: boolean;
}

/** Subscription states that grant access. 'past_due' does NOT. */
const ACTIVE_STATUSES = new Set([
  "active",
  "trialing",
  "in_grace_period",
]);

const NO_ACCESS: CourseAccess = {
  userId: null,
  hasSubscription: false,
  isEnrolled: false,
  hasFullAccess: false,
};

/**
 * Access check for a known user id. Used by the v1 API (where the caller is
 * identified by a Bearer token, so there is no cookie-bound client).
 *
 * Reads through the service-role client: RLS is a safety net for direct DB
 * access, but here the server has already authenticated the user, and we
 * must be able to read rows written by webhooks.
 */
export async function getCourseAccessForUser(
  userId: string,
  courseSlug: string,
): Promise<CourseAccess> {
  const admin = createAdminClient();

  const [{ data: sub }, { data: enrollment }] = await Promise.all([
    admin
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", userId)
      .maybeSingle(),
    admin
      .from("enrollments")
      .select("id, active, expires_at")
      .eq("user_id", userId)
      .eq("course_slug", courseSlug)
      .eq("active", true)
      .maybeSingle(),
  ]);

  const now = Date.now();

  const hasSubscription =
    !!sub &&
    ACTIVE_STATUSES.has(sub.status) &&
    // A store subscription keeps access until the period it paid for ends,
    // even after the user cancels — that's the contract with the store.
    (!sub.current_period_end ||
      new Date(sub.current_period_end).getTime() > now);

  const isEnrolled =
    !!enrollment &&
    enrollment.active &&
    (!enrollment.expires_at ||
      new Date(enrollment.expires_at).getTime() > now);

  // Private course (sanity/private.ts): its allowed accounts get full
  // access. Only checked when nothing else grants it.
  let isAllowedPrivate = false;
  if (!hasSubscription && !isEnrolled && (await getPrivateCourseAllowlist(courseSlug))) {
    const { data } = await admin.auth.admin.getUserById(userId);
    isAllowedPrivate = await canViewPrivateCourse(courseSlug, data.user?.email);
  }

  return {
    userId,
    hasSubscription,
    isEnrolled,
    hasFullAccess: hasSubscription || isEnrolled || isAllowedPrivate,
  };
}

/** Access check for the current web session (cookie-bound). */
export async function getCourseAccess(
  courseSlug: string,
): Promise<CourseAccess> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NO_ACCESS;

  return getCourseAccessForUser(user.id, courseSlug);
}

/**
 * Whether the user holds an all-access subscription, independent of any
 * particular course. Used by /api/v1/me to drive the app's paywall.
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (!sub || !ACTIVE_STATUSES.has(sub.status)) return false;
  return (
    !sub.current_period_end ||
    new Date(sub.current_period_end).getTime() > Date.now()
  );
}

/** Whether a specific lesson is viewable given the course access + free flag. */
export function canViewLesson(
  access: CourseAccess,
  lessonIsFree: boolean,
): boolean {
  return lessonIsFree || access.hasFullAccess;
}
