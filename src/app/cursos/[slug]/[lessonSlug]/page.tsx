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
import LessonContent from "@/components/lms/LessonContent";
import LessonPaywall from "@/components/lms/LessonPaywall";
import ProgressTracker from "@/components/lms/ProgressTracker";

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
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

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
    <div className="grid lg:grid-cols-[1fr_300px] gap-10">
      <div>
        {canView ? (
          <>
            <ProgressTracker courseSlug={slug} lessonSlug={lessonSlug} />
            <LessonContent lesson={lesson} courseSlug={slug} />
          </>
        ) : (
          <LessonPaywall
            courseSlug={slug}
            courseName={course.h1}
            loggedIn={loggedIn}
            price={price}
            next={`/cursos/${slug}/${lessonSlug}`}
          />
        )}

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-line">
          {prev ? (
            <Link
              href={`/cursos/${slug}/${prev.slug}`}
              className="flex items-center gap-2 text-sm text-foreground/50 hover:text-gold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {prev.h1}
            </Link>
          ) : <div />}
          {next ? (
            <Link
              href={`/cursos/${slug}/${next.slug}`}
              className="flex items-center gap-2 text-sm text-foreground/50 hover:text-gold transition-colors text-right"
            >
              {next.h1}
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-6">
          <div className="bg-surface-2 border border-line rounded-xl p-5">
            <h3 className="font-display font-semibold mb-1">{course.h1}</h3>
            <p className="text-sm text-foreground/50 mb-4">{course.description}</p>
            <Link
              href={`/cursos/${slug}`}
              className="text-sm text-gold hover:text-gold-light transition-colors"
            >
              Ver curso completo
            </Link>
          </div>

          <div className="bg-surface-2 border border-line rounded-xl p-5">
            <h4 className="font-semibold text-foreground text-sm mb-3">Lecciones</h4>
            <nav className="space-y-1">
              {lessons.map((l, i) => (
                <Link
                  key={l.slug}
                  href={`/cursos/${slug}/${l.slug}`}
                  className={`flex items-center gap-2 text-sm py-1.5 rounded transition-colors ${
                    l.slug === lessonSlug
                      ? "text-gold font-medium"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  <span className="w-5 text-right text-xs text-foreground/20 shrink-0">{i + 1}</span>
                  <span className="truncate">{l.h1}</span>
                  {l.free ? (
                    <span className="text-[10px] bg-gold/15 text-gold px-1.5 py-0.5 rounded-full shrink-0">Gratis</span>
                  ) : (
                    <svg className="w-3 h-3 text-foreground/20 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </div>
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-foreground/50 text-sm mb-4">
            <Link href="/cursos" className="hover:text-gold transition-colors">Cursos</Link>
            <span>/</span>
            <Link href={`/cursos/${slug}`} className="hover:text-gold transition-colors">{course.h1}</Link>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight mb-3">
            {lesson.h1}
          </h1>
          <p className="text-foreground/70 max-w-2xl">{lesson.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-foreground/50">
            <span>{lesson.duration}</span>
            <span>·</span>
            <span>{lesson.section}</span>
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

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {lessonContent}
        </div>
      </section>
    </div>
  );
}
