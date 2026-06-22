import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, getLesson, getCurriculum } from "@/data/curriculum";
import LessonContent from "@/components/lms/LessonContent";
import LessonGate from "@/components/lms/LessonGate";

type Params = Promise<{ slug: string; moduleSlug: string; lessonSlug: string }>;

export async function generateStaticParams() {
  const { curricula } = await import("@/data/curriculum");
  const params: { slug: string; moduleSlug: string; lessonSlug: string }[] = [];
  for (const [courseSlug, curriculum] of Object.entries(curricula)) {
    for (const mod of curriculum.modules) {
      for (const lesson of mod.lessons) {
        params.push({ slug: courseSlug, moduleSlug: mod.slug, lessonSlug: lesson.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, moduleSlug, lessonSlug } = await params;
  const lesson = getLesson(slug, moduleSlug, lessonSlug);
  if (!lesson) return {};
  return {
    title: lesson.title,
    description: lesson.metaDescription,
    openGraph: { title: lesson.title, description: lesson.metaDescription, type: "website", locale: "es_ES", siteName: "aprendoingles.online" },
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { slug, moduleSlug, lessonSlug } = await params;
  const mod = getModule(slug, moduleSlug);
  const lesson = getLesson(slug, moduleSlug, lessonSlug);
  if (!mod || !lesson) notFound();

  const curriculum = getCurriculum(slug);
  const lessonIndex = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = lessonIndex > 0 ? mod.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < mod.lessons.length - 1 ? mod.lessons[lessonIndex + 1] : null;

  const sidebar = curriculum?.modules ?? [];

  return (
    <>
      <section className="bg-gradient-to-br from-blue-primary to-blue-dark text-white py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
            <Link href={`/cursos/${slug}`} className="hover:text-white">Inglés para ventas</Link>
            <span>/</span>
            <Link href={`/cursos/${slug}/${moduleSlug}`} className="hover:text-white">{mod.h1.replace(/^Módulo \d+: /, "").split("—")[0].trim()}</Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{lesson.h1}</h1>
          <p className="text-blue-100 mt-3 max-w-2xl">{lesson.description}</p>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-blue-200 text-sm">{lesson.duration}</span>
            {lesson.free ? (
              <span className="bg-green-500/20 text-green-200 text-xs px-2.5 py-0.5 rounded-full font-medium">Lección gratuita</span>
            ) : (
              <span className="bg-white/10 text-blue-200 text-xs px-2.5 py-0.5 rounded-full">Requiere cuenta gratuita</span>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3">
              {lesson.free ? (
                <LessonContent lesson={lesson} />
              ) : (
                <LessonGate>
                  <LessonContent lesson={lesson} />
                </LessonGate>
              )}

              <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-8">
                {prevLesson ? (
                  <Link
                    href={`/cursos/${slug}/${moduleSlug}/${prevLesson.slug}`}
                    className="text-sm text-blue-primary hover:underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Lección anterior
                  </Link>
                ) : (
                  <Link
                    href={`/cursos/${slug}/${moduleSlug}`}
                    className="text-sm text-gray-400 hover:text-blue-primary flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Volver al módulo
                  </Link>
                )}
                {nextLesson ? (
                  <Link
                    href={`/cursos/${slug}/${moduleSlug}/${nextLesson.slug}`}
                    className="text-sm text-blue-primary hover:underline flex items-center gap-1"
                  >
                    Siguiente lección
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                ) : <div />}
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Contenido del curso</h3>
                  <nav className="space-y-4">
                    {sidebar.map((m) => (
                      <div key={m.slug}>
                        <Link
                          href={`/cursos/${slug}/${m.slug}`}
                          className={`text-xs font-semibold uppercase tracking-wide block mb-2 ${m.slug === moduleSlug ? "text-blue-primary" : "text-gray-400 hover:text-gray-600"}`}
                        >
                          {m.h1.replace(/^Módulo \d+: /, "")}
                        </Link>
                        <ul className="space-y-1">
                          {m.lessons.map((l) => (
                            <li key={l.slug}>
                              <Link
                                href={`/cursos/${slug}/${m.slug}/${l.slug}`}
                                className={`text-sm block py-1 pl-3 border-l-2 transition-colors ${
                                  l.slug === lessonSlug && m.slug === moduleSlug
                                    ? "border-blue-primary text-blue-primary font-medium"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                              >
                                {l.h1.replace(/^Lección \d+: /, "")}
                                {l.free && <span className="ml-1 text-green-500 text-xs">●</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
