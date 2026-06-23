import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/data/courses";
import { getCurriculum, getLesson } from "@/data/curriculum";
import LessonGate from "@/components/lms/LessonGate";
import LessonContent from "@/components/lms/LessonContent";

type Params = { slug: string; lessonSlug: string };

export function generateStaticParams() {
  const allCourses = getAllCourses();
  const params: Params[] = [];
  for (const course of allCourses) {
    const curriculum = getCurriculum(course.slug);
    if (!curriculum) continue;
    for (const lesson of curriculum.lessons) {
      params.push({ slug: course.slug, lessonSlug: lesson.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const lesson = getLesson(slug, lessonSlug);
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
  const course = getCourseBySlug(slug);
  const curriculum = getCurriculum(slug);
  const lesson = getLesson(slug, lessonSlug);

  if (!course || !curriculum || !lesson) notFound();

  const currentIndex = curriculum.lessons.findIndex((l) => l.slug === lessonSlug);
  const prev = currentIndex > 0 ? curriculum.lessons[currentIndex - 1] : null;
  const next = currentIndex < curriculum.lessons.length - 1 ? curriculum.lessons[currentIndex + 1] : null;

  const lessonContent = (
    <div className="grid lg:grid-cols-[1fr_300px] gap-10">
      <div>
        {lesson.free ? (
          <LessonContent lesson={lesson} />
        ) : (
          <LessonGate>
            <LessonContent lesson={lesson} />
          </LessonGate>
        )}

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
          {prev ? (
            <Link
              href={`/cursos/${slug}/${prev.slug}`}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-primary transition-colors"
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
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-primary transition-colors"
            >
              {next.h1}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-1">{course.h1}</h3>
            <p className="text-sm text-gray-500 mb-4">{course.description}</p>
            <Link
              href={`/cursos/${slug}`}
              className="text-sm text-blue-primary hover:underline"
            >
              Ver curso completo
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Lecciones</h4>
            <nav className="space-y-1">
              {curriculum.lessons.map((l, i) => (
                <Link
                  key={l.slug}
                  href={`/cursos/${slug}/${l.slug}`}
                  className={`flex items-center gap-2 text-sm py-1.5 rounded transition-colors ${
                    l.slug === lessonSlug
                      ? "text-blue-primary font-medium"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span className="w-5 text-right text-xs text-gray-300 shrink-0">{i + 1}</span>
                  <span className="truncate">{l.h1}</span>
                  {l.free ? (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full shrink-0">Gratis</span>
                  ) : (
                    <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <>
      <section className="bg-gradient-to-br from-blue-primary to-blue-dark text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <Link href="/cursos" className="hover:text-white transition-colors">Cursos</Link>
            <span>/</span>
            <Link href={`/cursos/${slug}`} className="hover:text-white transition-colors">{course.h1}</Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
            {lesson.h1}
          </h1>
          <p className="text-blue-100 max-w-2xl">{lesson.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-blue-200">
            <span>{lesson.duration}</span>
            <span>·</span>
            <span>{lesson.section}</span>
            {lesson.free && (
              <>
                <span>·</span>
                <span className="bg-green-500/20 text-green-200 px-2 py-0.5 rounded-full text-xs font-medium">Gratis</span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {lessonContent}
        </div>
      </section>
    </>
  );
}
