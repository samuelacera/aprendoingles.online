import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllLessonParams,
  getCourseBySlug,
  getCourseLessons,
  getLesson,
  getAuthor,
  getCoursePrice,
} from "@/sanity/queries";
import { getCourseAccess, canViewLesson } from "@/lib/access";
import LessonPaywall from "@/components/lms/LessonPaywall";
import LessonNavigator, { type NavLesson } from "@/components/lms/LessonNavigator";

type Params = { slug: string; lessonSlug: string };

export async function generateStaticParams() {
  return getAllLessonParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const lesson = await getLesson(slug, lessonSlug);
  if (!lesson) return {};
  return {
    title: lesson.title,
    description: lesson.metaDescription,
    openGraph: {
      title: lesson.title,
      description: lesson.metaDescription,
      type: "article",
      locale: "es_ES",
      siteName: "aprendoingles.online",
    },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, lessonSlug } = await params;
  const [course, lessons, lesson, author] = await Promise.all([
    getCourseBySlug(slug),
    getCourseLessons(slug),
    getLesson(slug, lessonSlug),
    getAuthor(),
  ]);

  if (!course || !lesson) notFound();

  // Free lessons render fully for everyone and read NO cookies, so they stay
  // statically generated (SEO). Only paid lessons read the session to gate
  // access, which makes just those paths dynamic.
  let canView = true;
  let loggedIn = false;
  let price = 0;
  if (!lesson.free) {
    const [access, coursePrice] = await Promise.all([
      getCourseAccess(slug),
      getCoursePrice(slug),
    ]);
    loggedIn = !!access.userId;
    price = coursePrice ?? 0;
    canView = canViewLesson(access, lesson.free);
  }

  const influences = course.influences ?? [];
  const currentIndex = lessons.findIndex((l) => l.slug === lessonSlug);

  // Metadata only: the index never carries other lessons' content.
  const navLessons: NavLesson[] = lessons.map((l) => ({
    slug: l.slug,
    h1: l.h1,
    section: l.section,
    free: l.free,
    chapterCount: l.chapterCount ?? 0,
  }));

  // Video URLs only reach the browser when the viewer can watch them.
  const chapters = canView ? lesson.chapters ?? [] : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: lesson.h1,
    description: lesson.metaDescription,
    ...(author && {
      author: { "@type": "Person", name: author.name },
    }),
    publisher: {
      "@type": "Organization",
      name: "aprendoingles.online",
    },
    inLanguage: "es",
    isPartOf: {
      "@type": "Course",
      name: course.h1,
      url: `https://aprendoingles.online/cursos/${slug}`,
    },
    isAccessibleForFree: lesson.free,
    timeRequired: `PT${parseInt(lesson.duration)}M`,
  };

  const lessonContent = (
    <LessonNavigator
      courseSlug={slug}
      courseName={course.h1}
      lessonSlug={lessonSlug}
      lessons={navLessons}
      chapters={chapters}
      lesson={canView ? lesson : null}
      paywall={
        <LessonPaywall
          courseSlug={slug}
          courseName={course.h1}
          loggedIn={loggedIn}
          price={price}
          next={`/cursos/${slug}/${lessonSlug}`}
        />
      }
    />
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav
            aria-label="Ruta"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-foreground/50 text-sm mb-4"
          >
            <Link href={`/cursos/${slug}`} className="hover:text-gold transition-colors">
              {course.h1}
            </Link>
            {lesson.section && (
              <>
                <span aria-hidden>·</span>
                <span>{lesson.section}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span className="text-gold">
              Lección {currentIndex + 1} de {lessons.length}
            </span>
          </nav>
          <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight mb-3">
            {lesson.h1}
          </h1>
          <p className="text-foreground/70 max-w-2xl">{lesson.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-foreground/50">
            <span>{lesson.duration}</span>
            {chapters.length > 0 && (
              <>
                <span>·</span>
                <span>{chapters.length} capítulos en vídeo</span>
              </>
            )}
            {lesson.free && (
              <>
                <span>·</span>
                <span className="bg-gold/15 text-gold px-2 py-0.5 rounded-full text-xs font-medium">Gratis</span>
              </>
            )}
          </div>
          {author && (
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-line">
              <div className="w-8 h-8 bg-gold/15 text-gold rounded-full flex items-center justify-center text-xs font-bold">
                JS
              </div>
              <div>
                <p className="font-medium text-sm">{author.name}</p>
                {influences.length > 0 && (
                  <p className="text-[11px] text-foreground/40 italic">
                    Contenido influenciado por los aprendizajes de {influences.slice(0, 3).join(", ")} y otros
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="pt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {lessonContent}
        </div>
      </section>
    </div>
  );
}
