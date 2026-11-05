import { getApiUser } from "@/lib/api/auth";
import { apiOk, apiOptions, guard } from "@/lib/api/response";
import { getCourseAccessForUser } from "@/lib/access";

export const dynamic = "force-dynamic";
export const OPTIONS = apiOptions;

/**
 * GET /api/v1/access/:courseSlug → { loggedIn, hasFullAccess, isEnrolled, hasSubscription }
 *
 * Lightweight check for statically rendered pages (course page, lesson
 * index): they draw locks and CTAs in the browser with the same rule the
 * server uses to gate a lesson (lib/access.ts).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseSlug: string }> },
) {
  return guard(async () => {
    const { courseSlug } = await params;
    const user = await getApiUser(request);
    if (!user || !/^[a-z0-9-]{1,120}$/.test(courseSlug)) {
      return apiOk({ loggedIn: !!user, hasFullAccess: false, isEnrolled: false, hasSubscription: false });
    }
    const a = await getCourseAccessForUser(user.id, courseSlug);
    return apiOk({
      loggedIn: true,
      hasFullAccess: a.hasFullAccess,
      isEnrolled: a.isEnrolled,
      hasSubscription: a.hasSubscription,
    });
  });
}
