import type { MetadataRoute } from "next";
import { getAllCourses } from "@/data/courses";
import { getCurriculum } from "@/data/curriculum";

const BASE_URL = "https://aprendoingles-online.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const allCourses = getAllCourses();

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
  ];

  const coursePages: MetadataRoute.Sitemap = allCourses.map((course) => ({
    url: `${BASE_URL}/cursos/${course.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const lessonPages: MetadataRoute.Sitemap = allCourses.flatMap((course) => {
    const curriculum = getCurriculum(course.slug);
    if (!curriculum) return [];
    return curriculum.lessons.map((lesson) => ({
      url: `${BASE_URL}/cursos/${course.slug}/${lesson.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  });

  return [...staticPages, ...coursePages, ...lessonPages];
}
