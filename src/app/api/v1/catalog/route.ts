import { apiOk, apiOptions, guard } from "@/lib/api/response";
import { getCategories } from "@/sanity/queries";

export const OPTIONS = apiOptions;
// Public catalogue: identical for everyone, so let the CDN serve it.
export const revalidate = 300;

/**
 * GET /api/v1/catalog
 *
 * The whole navigable catalogue (categories + their courses) in one call, so
 * the app can render home and browse screens offline-first after a single
 * fetch. Contains no user data — safe to cache publicly.
 */
export async function GET() {
  return guard(async () => {
    const categories = await getCategories();

    return apiOk(
      {
        categories: categories.map((c) => ({
          slug: c.slug,
          name: c.name,
          color: c.color,
          influences: c.influences ?? [],
          courses: (c.courses ?? []).map((course) => ({
            slug: course.slug,
            title: course.title,
            h1: course.h1,
            description: course.description,
            tags: course.tags ?? [],
            color: course.color,
            categorySlug: course.categorySlug ?? c.slug,
            categoryName: course.category ?? c.name,
            lessonCount: course.lessonCount ?? 0,
            // "Próximamente" in the UI: built but not yet populated.
            available: (course.lessonCount ?? 0) > 0,
          })),
        })),
      },
      { cache: "public, s-maxage=300, stale-while-revalidate=3600" },
    );
  });
}
