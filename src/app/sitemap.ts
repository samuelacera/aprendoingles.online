import type { MetadataRoute } from "next";
import { getSitemapData, getBlogPosts } from "@/sanity/queries";

const BASE_URL = "https://aprendoingles-online.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [coursesWithLessons, blogPosts] = await Promise.all([
    getSitemapData(),
    getBlogPosts(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/cursos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const coursePages: MetadataRoute.Sitemap = coursesWithLessons.map((c) => ({
    url: `${BASE_URL}/cursos/${c.courseSlug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const lessonPages: MetadataRoute.Sitemap = coursesWithLessons.flatMap((c) =>
    c.lessonSlugs.map((lessonSlug) => ({
      url: `${BASE_URL}/cursos/${c.courseSlug}/${lessonSlug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...staticPages, ...coursePages, ...lessonPages, ...blogPages];
}
