import { getApiUser } from "@/lib/api/auth";
import { apiError, apiOk, apiOptions, guard } from "@/lib/api/response";
import { getCourseAccessForUser } from "@/lib/access";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseBySlug, getCourseLessons } from "@/sanity/queries";

export const dynamic = "force-dynamic";
export const OPTIONS = apiOptions;

/**
 * GET /api/v1/courses/:slug
 *
 * Course detail + its lesson index + the caller's access and progress.
 * Works logged out (everything is simply locked except free previews).
 *
 * Returns lesson METADATA only — never the lesson body. The actual content
 * is gated in /api/v1/lessons/:course/:lesson so a locked lesson can't be
 * read from this response.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  return guard(async () => {
    const { slug } = await params;

    // Logged out is a valid state here: the app shows the course page with a
    // paywall before asking anyone to sign up.
    const user = await getApiUser(request);
    const viewerEmail = user?.email ?? null;

    const course = await getCourseBySlug(slug, viewerEmail);
    if (!course) return apiError("not_found", "Curso no encontrado.");

    const lessons = await getCourseLessons(slug, viewerEmail);

    const access = user
      ? await getCourseAccessForUser(user.id, slug)
      : { userId: null, hasSubscription: false, isEnrolled: false, hasFullAccess: false };

    let progressBySlug = new Map<
      string,
      { completedAt: string | null; timeSpentSeconds: number }
    >();

    if (user) {
      const admin = createAdminClient();
      const { data: rows } = await admin
        .from("lesson_progress")
        .select("lesson_slug, completed_at, time_spent_seconds")
        .eq("user_id", user.id)
        .eq("course_slug", slug);

      progressBySlug = new Map(
        (rows ?? []).map((r) => [
          r.lesson_slug,
          {
            completedAt: r.completed_at,
            timeSpentSeconds: r.time_spent_seconds ?? 0,
          },
        ]),
      );
    }

    return apiOk({
      course: {
        slug: course.slug,
        title: course.title,
        h1: course.h1,
        description: course.description,
        metaDescription: course.metaDescription,
        tags: course.tags ?? [],
        color: course.color,
        categorySlug: course.categorySlug,
        categoryName: course.category,
        lessonCount: course.lessonCount ?? 0,
        available: (course.lessonCount ?? 0) > 0,
        celebrities: course.celebrities ?? [],
      },
      access: {
        hasFullAccess: access.hasFullAccess,
        isEnrolled: access.isEnrolled,
        hasSubscription: access.hasSubscription,
      },
      lessons: lessons.map((l) => ({
        slug: l.slug,
        title: l.title,
        h1: l.h1,
        description: l.description,
        duration: l.duration,
        section: l.section,
        order: l.order,
        free: l.free,
        chapterCount: l.chapterCount ?? 0,
        hasPractice: !!l.hasPractice,
        locked: !l.free && !access.hasFullAccess,
        progress: progressBySlug.get(l.slug) ?? null,
      })),
    });
  });
}
