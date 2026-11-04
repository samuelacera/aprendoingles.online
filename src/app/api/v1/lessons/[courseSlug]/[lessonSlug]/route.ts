import { getApiUser } from "@/lib/api/auth";
import { apiError, apiOk, apiOptions, guard } from "@/lib/api/response";
import { canViewLesson, getCourseAccessForUser } from "@/lib/access";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseLessons, getLesson } from "@/sanity/queries";

export const dynamic = "force-dynamic";
export const OPTIONS = apiOptions;

/**
 * GET /api/v1/lessons/:courseSlug/:lessonSlug
 *
 * The full lesson body. THIS is the gate: if the lesson is paid and the
 * caller has no access we return 402 and never serialize the content, so a
 * tampered client cannot read it. The app turns a 402 into the paywall.
 *
 * Also returns `navigation` (position, previous and next lesson) so the web
 * and the app move through a course with exactly the same rules.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> },
) {
  return guard(async () => {
    const { courseSlug, lessonSlug } = await params;

    const [lesson, siblings] = await Promise.all([
      getLesson(courseSlug, lessonSlug),
      getCourseLessons(courseSlug),
    ]);
    if (!lesson) return apiError("not_found", "Lección no encontrada.");

    const user = await getApiUser(request);
    const access = user
      ? await getCourseAccessForUser(user.id, courseSlug)
      : { userId: null, hasSubscription: false, isEnrolled: false, hasFullAccess: false };

    if (!canViewLesson(access, lesson.free)) {
      return apiError(
        "payment_required",
        "Esta lección forma parte del contenido completo del curso.",
      );
    }

    const admin = createAdminClient();
    let progress = null;

    if (user) {
      const { data } = await admin
        .from("lesson_progress")
        .select("completed_at, time_spent_seconds, quiz_score, quiz_total, quiz_attempts")
        .eq("user_id", user.id)
        .eq("course_slug", courseSlug)
        .eq("lesson_slug", lessonSlug)
        .maybeSingle();

      progress = data
        ? {
            completedAt: data.completed_at,
            timeSpentSeconds: data.time_spent_seconds ?? 0,
            quizScore: data.quiz_score,
            quizTotal: data.quiz_total,
            quizAttempts: data.quiz_attempts ?? 0,
          }
        : null;
    }

    const index = siblings.findIndex((l) => l.slug === lesson.slug);
    const neighbour = (i: number) => {
      const l = siblings[i];
      if (!l) return null;
      return {
        slug: l.slug,
        h1: l.h1,
        section: l.section,
        locked: !l.free && !access.hasFullAccess,
      };
    };

    return apiOk({
      lesson: {
        slug: lesson.slug,
        title: lesson.title,
        h1: lesson.h1,
        description: lesson.description,
        duration: lesson.duration,
        section: lesson.section,
        order: lesson.order,
        free: lesson.free,
        intro: lesson.intro,
        vocabulary: lesson.vocabulary ?? [],
        keyPhrases: lesson.keyPhrases ?? [],
        exercise: lesson.exercise ?? null,
        chapters: lesson.chapters ?? [],
      },
      navigation: {
        index: index + 1,
        total: siblings.length,
        previous: index > 0 ? neighbour(index - 1) : null,
        next: index >= 0 ? neighbour(index + 1) : null,
      },
      progress,
    });
  });
}
