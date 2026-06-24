import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug, AUTHOR, CATEGORY_INFLUENCES } from "@/data/courses";
import { getCurriculum } from "@/data/curriculum";

export function generateStaticParams() {
  return getAllCourses().map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.metaDescription,
    openGraph: {
      title: course.title,
      description: course.metaDescription,
      type: "website",
      locale: "es_ES",
      siteName: "aprendoingles.online",
    },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const curriculum = getCurriculum(slug);
  const influences = CATEGORY_INFLUENCES[course.category] ?? [];
  const allCourses = getAllCourses();
  const related = allCourses
    .filter((c) => c.category === course.category && c.slug !== course.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.h1,
    description: course.metaDescription,
    provider: {
      "@type": "Organization",
      name: "aprendoingles.online",
      sameAs: "https://aprendoingles-online.vercel.app",
    },
    instructor: {
      "@type": "Person",
      name: AUTHOR.name,
      description: AUTHOR.bio,
    },
    inLanguage: "es",
    isAccessibleForFree: false,
    offers: {
      "@type": "Offer",
      category: "Paid",
      priceCurrency: "EUR",
    },
    ...(curriculum && {
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseSchedule: {
          "@type": "Schedule",
          repeatFrequency: "P1D",
        },
      },
      numberOfCredits: curriculum.lessons.length,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-gradient-to-br from-blue-primary to-blue-dark text-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Todos los cursos
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/15 text-sm px-3 py-1 rounded-full">{course.category}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {course.h1}
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">{course.description}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {course.tags.map((tag) => (
              <span key={tag} className="bg-white/10 text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                JS
              </div>
              <div>
                <p className="font-semibold text-sm">{AUTHOR.name}</p>
                <p className="text-xs text-blue-200">{AUTHOR.role}</p>
              </div>
            </div>
            {influences.length > 0 && (
              <div className="sm:ml-auto">
                <p className="text-xs text-blue-200 italic">
                  Contenido influenciado por los aprendizajes de {influences.slice(0, -1).join(", ")} y {influences[influences.length - 1]}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Que vas a aprender</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Vocabulario especializado de tu sector con ejemplos reales</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Expresiones y frases clave para situaciones profesionales</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Simulaciones de escenarios reales de trabajo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Documentos y plantillas profesionales en ingles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Certificado de nivel al completar el curso</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Para quien es este curso</h2>
                <p className="text-gray-600 leading-relaxed">
                  Este curso esta disenado para profesionales del sector de {course.category.toLowerCase()} que
                  necesitan comunicarse en ingles en su dia a dia laboral. No importa si tu nivel actual es
                  intermedio o avanzado: el contenido se adapta a tu punto de partida y te lleva al siguiente nivel
                  con vocabulario y situaciones 100% relevantes para tu trabajo.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Metodologia</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="font-semibold text-gray-900 mb-1">Lecciones de 15-20 min</p>
                    <p className="text-sm text-gray-500">Pensadas para profesionales con poco tiempo disponible</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="font-semibold text-gray-900 mb-1">Ejercicios practicos</p>
                    <p className="text-sm text-gray-500">Basados en situaciones reales de tu sector profesional</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="font-semibold text-gray-900 mb-1">Evaluaciones por modulo</p>
                    <p className="text-sm text-gray-500">Mide tu progreso y obtén feedback inmediato</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="font-semibold text-gray-900 mb-1">Acceso 24/7</p>
                    <p className="text-sm text-gray-500">Aprende cuando quieras, desde cualquier dispositivo</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Empieza gratis</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Haz el test de nivel y recibe una recomendacion personalizada para este curso.
                </p>
                <Link
                  href="/#test-nivel"
                  className="block w-full text-center bg-blue-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-dark transition-colors"
                >
                  Test de nivel gratis
                </Link>
                <div className="mt-6 space-y-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Sin compromiso
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Resultado en 3 minutos
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Recomendacion personalizada
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {curriculum && (() => {
        const sections = curriculum.lessons.reduce<Record<string, typeof curriculum.lessons>>((acc, lesson) => {
          const key = lesson.section;
          if (!acc[key]) acc[key] = [];
          acc[key].push(lesson);
          return acc;
        }, {});
        const sectionEntries = Object.entries(sections);
        let lessonCounter = 0;

        return (
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Temario del curso</h2>
              <p className="text-gray-500 mb-8">
                {curriculum.lessons.length} lecciones · {sectionEntries.length} secciones
              </p>
              <div className="space-y-6">
                {sectionEntries.map(([sectionName, lessons]) => (
                  <div key={sectionName} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-4 p-5 bg-gray-50/50">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-primary font-bold text-sm shrink-0">
                        {sectionEntries.findIndex(([s]) => s === sectionName) + 1}
                      </div>
                      <h3 className="font-semibold text-gray-900">{sectionName}</h3>
                      <span className="text-sm text-gray-400 ml-auto">{lessons.length} lecciones</span>
                    </div>
                    <div className="border-t border-gray-100 px-5 pb-4">
                      {lessons.map((lesson) => {
                        lessonCounter++;
                        return (
                          <Link
                            key={lesson.slug}
                            href={`/cursos/${slug}/${lesson.slug}`}
                            className="flex items-center gap-3 py-3 text-sm hover:text-blue-primary transition-colors group"
                          >
                            <span className="text-gray-300 w-6 text-right shrink-0">{lessonCounter}</span>
                            <span className="text-gray-700 group-hover:text-blue-primary flex-1">{lesson.h1}</span>
                            <span className="text-xs text-gray-400">{lesson.duration}</span>
                            {lesson.free ? (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Gratis</span>
                            ) : (
                              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {related.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Otros cursos de {course.category}
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/cursos/${r.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold text-gray-900 mb-2 hover:text-blue-primary transition-colors">
                    {r.h1.replace("Curso de inglés para ", "")}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
