import { client } from "./client";

// ── Types ──

export interface SanityCategory {
  name: string;
  slug: string;
  color: string;
  influences: string[];
  courses: SanityCourse[];
}

export interface SanityCourse {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  description: string;
  tags: string[];
  color: string;
  category: string;
  categorySlug: string;
  influences: string[];
  /** Number of published lessons. 0 = "Próximamente" (not yet built). */
  lessonCount: number;
}

export interface SanityLesson {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  description: string;
  duration: string;
  free: boolean;
  section: string;
  order: number;
  intro: string;
  vocabulary: { term: string; definition: string; example: string }[];
  keyPhrases: { phrase: string; translation: string; context: string }[];
  exercise: {
    instruction: string;
    questions: { question: string; options: string[]; correct: number }[];
  };
}

export interface SanityAuthor {
  name: string;
  role: string;
  bio: string;
}

export interface SanityBlogPostCard {
  slug: string;
  h1: string;
  excerpt: string;
  publishedAt: string | null;
  tags: string[];
  category: string | null;
  categoryColor: string | null;
  authorName: string | null;
  // Raw Sanity image object (or null); build the URL with urlForImage()
  featuredImage: unknown | null;
}

export interface SanityBlogPostFull extends SanityBlogPostCard {
  title: string;
  metaDescription: string;
  authorRole: string | null;
  // Portable Text blocks
  body: unknown[] | null;
}

// ── Queries ──

export async function getCategories(): Promise<SanityCategory[]> {
  return client.fetch(
    `*[_type == "category"] | order(order asc) {
      name,
      "slug": slug.current,
      color,
      "influences": coalesce(influences, []),
      "courses": *[_type == "course" && category._ref == ^._id && published == true] | order(title asc) {
        "slug": slug.current,
        title,
        h1,
        metaDescription,
        description,
        "tags": coalesce(tags, []),
        "color": ^.color,
        "category": ^.name,
        "categorySlug": ^.slug.current,
        "influences": ^.influences,
        "lessonCount": count(*[_type == "lesson" && course._ref == ^._id && published == true])
      }
    }`,
  );
}

export async function getCategoryBySlug(
  slug: string,
): Promise<SanityCategory | null> {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0] {
      name,
      "slug": slug.current,
      color,
      "influences": coalesce(influences, []),
      "courses": *[_type == "course" && category._ref == ^._id && published == true] | order(title asc) {
        "slug": slug.current,
        title,
        h1,
        metaDescription,
        description,
        "tags": coalesce(tags, []),
        "color": ^.color,
        "category": ^.name,
        "categorySlug": ^.slug.current,
        "influences": ^.influences,
        "lessonCount": count(*[_type == "lesson" && course._ref == ^._id && published == true])
      }
    }`,
    { slug },
  );
}

export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
  return client.fetch(
    `*[_type == "category"] { "slug": slug.current }`,
  );
}

export async function getAllCourses(): Promise<SanityCourse[]> {
  return client.fetch(
    `*[_type == "course" && published == true] | order(title asc) {
      "slug": slug.current,
      title,
      h1,
      metaDescription,
      description,
      "tags": coalesce(tags, []),
      "color": category->color,
      "category": category->name,
      "categorySlug": category->slug.current,
      "influences": category->influences,
      "lessonCount": count(*[_type == "lesson" && course._ref == ^._id && published == true])
    }`,
  );
}

export async function getCourseBySlug(
  slug: string,
): Promise<SanityCourse | null> {
  return client.fetch(
    `*[_type == "course" && slug.current == $slug && published == true][0] {
      "slug": slug.current,
      title,
      h1,
      metaDescription,
      description,
      "tags": coalesce(tags, []),
      "color": category->color,
      "category": category->name,
      "categorySlug": category->slug.current,
      "influences": category->influences,
      "lessonCount": count(*[_type == "lesson" && course._ref == ^._id && published == true])
    }`,
    { slug },
  );
}

export async function getCourseLessons(
  courseSlug: string,
): Promise<SanityLesson[]> {
  return client.fetch(
    `*[_type == "lesson" && course->slug.current == $courseSlug && published == true] | order(order asc) {
      "slug": slug.current,
      title,
      h1,
      metaDescription,
      description,
      duration,
      free,
      section,
      order,
      intro,
      "vocabulary": vocabulary[] { term, definition, example },
      "keyPhrases": keyPhrases[] { phrase, translation, context },
      "exercise": exercise {
        instruction,
        "questions": questions[] { question, options, correct }
      }
    }`,
    { courseSlug },
  );
}

export async function getLesson(
  courseSlug: string,
  lessonSlug: string,
): Promise<SanityLesson | null> {
  return client.fetch(
    `*[_type == "lesson" && slug.current == $lessonSlug && course->slug.current == $courseSlug && published == true][0] {
      "slug": slug.current,
      title,
      h1,
      metaDescription,
      description,
      duration,
      free,
      section,
      order,
      intro,
      "vocabulary": vocabulary[] { term, definition, example },
      "keyPhrases": keyPhrases[] { phrase, translation, context },
      "exercise": exercise {
        instruction,
        "questions": questions[] { question, options, correct }
      }
    }`,
    { courseSlug, lessonSlug },
  );
}

export async function getRelatedCourses(
  categorySlug: string,
  excludeSlug: string,
  limit = 3,
): Promise<SanityCourse[]> {
  return client.fetch(
    `*[_type == "course" && category->slug.current == $categorySlug && slug.current != $excludeSlug && published == true][0...$limit] {
      "slug": slug.current,
      title,
      h1,
      description,
      "tags": coalesce(tags, []),
      "color": category->color,
      "category": category->name,
      "lessonCount": count(*[_type == "lesson" && course._ref == ^._id && published == true])
    }`,
    { categorySlug, excludeSlug, limit: limit - 1 },
  );
}

export async function getAuthor(): Promise<SanityAuthor | null> {
  return client.fetch(
    `*[_type == "author"][0] { name, role, bio }`,
  );
}

/**
 * Server-side price lookup. Used to validate that a "free enrollment" is
 * actually for a free course — never trust the client on this.
 * Returns the price in euros (0 / null means free), or undefined if no such
 * published course exists.
 */
export async function getCoursePrice(slug: string): Promise<number | undefined> {
  const result = await client.fetch<{ price: number | null } | null>(
    `*[_type == "course" && slug.current == $slug && published == true][0] { price }`,
    { slug },
  );
  if (result === null) return undefined;
  return result.price ?? 0;
}

export async function getAllCourseSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(
    `*[_type == "course" && published == true] { "slug": slug.current }`,
  );
}

export async function getAllLessonParams(): Promise<
  { slug: string; lessonSlug: string }[]
> {
  return client.fetch(
    `*[_type == "lesson" && published == true] {
      "slug": course->slug.current,
      "lessonSlug": slug.current
    }`,
  );
}

// ── Blog ──

const BLOG_CARD_PROJECTION = `{
  "slug": slug.current,
  h1,
  excerpt,
  publishedAt,
  "tags": coalesce(tags, []),
  "category": category->name,
  "categoryColor": category->color,
  "authorName": author->name,
  featuredImage
}`;

export async function getBlogPosts(): Promise<SanityBlogPostCard[]> {
  return client.fetch(
    `*[_type == "blogPost" && published == true] | order(publishedAt desc) ${BLOG_CARD_PROJECTION}`,
  );
}

export async function getLatestBlogPosts(
  limit = 3,
): Promise<SanityBlogPostCard[]> {
  return client.fetch(
    `*[_type == "blogPost" && published == true] | order(publishedAt desc)[0...$limit] ${BLOG_CARD_PROJECTION}`,
    { limit },
  );
}

export async function getBlogPost(
  slug: string,
): Promise<SanityBlogPostFull | null> {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug && published == true][0] {
      "slug": slug.current,
      title,
      h1,
      metaDescription,
      excerpt,
      publishedAt,
      "tags": coalesce(tags, []),
      "category": category->name,
      "categoryColor": category->color,
      "authorName": author->name,
      "authorRole": author->role,
      featuredImage,
      body
    }`,
    { slug },
  );
}

export async function getAllBlogSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(
    `*[_type == "blogPost" && published == true] { "slug": slug.current }`,
  );
}

export async function getSitemapData(): Promise<
  { courseSlug: string; lessonSlugs: string[] }[]
> {
  return client.fetch(
    `*[_type == "course" && published == true] {
      "courseSlug": slug.current,
      "lessonSlugs": *[_type == "lesson" && course._ref == ^._id && published == true].slug.current
    }`,
  );
}
