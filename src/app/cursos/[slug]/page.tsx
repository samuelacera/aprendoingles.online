import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCourseSlugs,
  getCourseBySlug,
  getCourseLessons,
  getRelatedCourses,
  getAuthor,
  getCoursePrice,
} from "@/sanity/queries";
import EnrollButton from "@/components/lms/EnrollButton";
import { categoryAccent } from "@/lib/categoryColors";

export async function generateStaticParams() {
  const courses = await getAllCourseSlugs();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
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
  const [course, lessons, author, price] = await Promise.all([
    getCourseBySlug(slug),
    getCourseLessons(slug),
    getAuthor(),
    getCoursePrice(slug),
  ]);
  if (!course) notFound();

  const influences = course.influences ?? [];
  const accent = categoryAccent(course.color);
  const related = await getRelatedCourses(course.categorySlug, slug);

  const hasFree = lessons.some((l) => l.free);
  const isFreeCourse = (price ?? 0) <= 0;
  const priceLabel = isFreeCourse ? "Gratis" : `${price} €`;
  const ctaTitle = isFreeCourse ? "Empieza gratis" : "Accede al curso";

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
    ...(author && {
      instructor: {
        "@type": "Person",
        name: author.name,
        description: author.bio,
      },
    }),
    inLanguage: "es",
    isAccessibleForFree: false,
    offers: {
      "@type": "Offer",
      category: "Paid",
      priceCurrency: "EUR",
    },
    ...(lessons.length > 0 && {
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseSchedule: {
          "@type": "Schedule",
          repeatFrequency: "P1D",
        },
      },
      numberOfCredits: lessons.length,
    }),
  };

  const sections = lessons.reduce<Record<string, typeof lessons>>(
    (acc, lesson) => {
      const key = lesson.section;
      if (!acc[key]) acc[key] = [];
      acc[key].push(lesson);
      return acc;
    },
    {},
  );
  const sectionEntries = Object.entries(sections);

  return (
    <div className="bg-ink text-cream pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className={`absolute -top-32 -right-24 w-[34rem] h-[34rem] rounded-full ${accent.glow} opacity-20 blur-[130px]`} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-1 text-cream/50 hover:text-gold text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Todos los cursos
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 border border-white/15 text-cream/80 text-sm px-3 py-1 rounded-full">
              <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
              {course.category}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {course.h1}
          </h1>
          <p className="text-lg text-cream/70 max-w-2xl">{course.description}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {course.tags.map((tag) => (
              <span key={tag} className="border border-white/10 text-cream/60 text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          {author && (
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/15 text-gold rounded-full flex items-center justify-center text-sm font-bold">
                  JS
                </div>
                <div>
                  <p className="font-semibold text-sm">{author.name}</p>
                  <p className="text-xs text-cream/50">{author.role}</p>
                </div>
              </div>
              {influences.length > 0 && (
                <div className="sm:ml-auto">
                  <p className="text-xs text-cream/40 italic">
                    Contenido influenciado por los aprendizajes de {influences.slice(0, -1).join(", ")} y {influences[influences.length - 1]}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-10">
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">Qué vas a aprender</h2>
                <ul className="space-y-3">
                  {[
                    "Vocabulario especializado de tu sector con ejemplos reales",
                    "Expresiones y frases clave para situaciones profesionales",
                    "Simulaciones de escenarios reales de trabajo",
                    "Documentos y plantillas profesionales en inglés",
                    "Certificado de nivel al completar el curso",
                  ].map((item) => (
                    <li key={item} className="group flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-ink transition-colors">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-cream/70 group-hover:text-cream transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">Para quién es este curso</h2>
                <p className="text-cream/70 leading-relaxed">
                  Este curso está diseñado para profesionales del sector de {course.category.toLowerCase()} que
                  necesitan comunicarse en inglés en su día a día laboral. No importa si tu nivel actual es
                  intermedio o avanzado: el contenido se adapta a tu punto de partida y te lleva al siguiente nivel
                  con vocabulario y situaciones 100% relevantes para tu trabajo.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">Metodología</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: "Lecciones de 15-20 min", desc: "Pensadas para profesionales con poco tiempo disponible" },
                    { title: "Ejercicios prácticos", desc: "Basados en situaciones reales de tu sector profesional" },
                    { title: "Evaluaciones por módulo", desc: "Mide tu progreso y obtén feedback inmediato" },
                    { title: "Acceso 24/7", desc: "Aprende cuando quieras, desde cualquier dispositivo" },
                  ].map((m) => (
                    <div key={m.title} className="bg-ink-soft border border-white/10 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
                      <p className="font-semibold text-cream mb-1">{m.title}</p>
                      <p className="text-sm text-cream/50">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="sticky top-24 relative overflow-hidden bg-ink-elevated border border-gold/30 rounded-2xl p-6 shadow-2xl shadow-gold/10">
                {/* warm glow inside the CTA card */}
                <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gold/20 blur-3xl" />
                <div className="relative">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-display text-lg font-semibold">{ctaTitle}</h3>
                    <span className={`font-display text-2xl font-bold ${isFreeCourse ? "text-gold" : "text-cream"}`}>
                      {priceLabel}
                    </span>
                  </div>
                  <p className="text-sm text-cream/50 mb-6">
                    {lessons.length} lecciones · {hasFree ? "Primera lección gratuita" : "Acceso completo al temario"}
                  </p>
                  <EnrollButton courseSlug={slug} courseName={course.h1} free={hasFree} />
                  <div className="mt-6 space-y-3 text-sm text-cream/50">
                    {["Sin compromiso", "Acceso desde cualquier dispositivo", "Certificado al completar"].map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {lessons.length > 0 && (
        <section className="py-16 bg-ink-soft border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold mb-2">Temario del curso</h2>
            <p className="text-cream/50 mb-8">
              {lessons.length} lecciones · {sectionEntries.length} secciones
            </p>
            <div className="space-y-6">
              {(() => {
                let lessonCounter = 0;
                return sectionEntries.map(([sectionName, sectionLessons]) => (
                  <div key={sectionName} className="bg-ink-elevated border border-white/10 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-4 p-5 bg-white/[0.02]">
                      <div className="w-10 h-10 bg-gold/15 rounded-lg flex items-center justify-center text-gold font-bold text-sm shrink-0">
                        {sectionEntries.findIndex(([s]) => s === sectionName) + 1}
                      </div>
                      <h3 className="font-semibold text-cream">{sectionName}</h3>
                      <span className="text-sm text-cream/30 ml-auto">{sectionLessons.length} lecciones</span>
                    </div>
                    <div className="border-t border-white/10 px-5 pb-4">
                      {sectionLessons.map((lesson) => {
                        lessonCounter++;
                        return (
                          <Link
                            key={lesson.slug}
                            href={`/cursos/${slug}/${lesson.slug}`}
                            className="flex items-center gap-3 py-3 text-sm transition-colors group"
                          >
                            <span className="text-cream/20 w-6 text-right shrink-0">{lessonCounter}</span>
                            <span className="text-cream/70 group-hover:text-gold flex-1 transition-colors">{lesson.h1}</span>
                            <span className="text-xs text-cream/30">{lesson.duration}</span>
                            {lesson.free ? (
                              <span className="text-xs bg-gold/15 text-gold px-2 py-0.5 rounded-full font-medium">Gratis</span>
                            ) : (
                              <svg className="w-4 h-4 text-cream/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-16 bg-ink border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold mb-8">
              Otros cursos de {course.category}
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/cursos/${r.slug}`}
                  className={`group bg-ink-soft rounded-xl border border-white/10 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accent.hoverBorder} ${accent.hoverShadow}`}
                >
                  <h3 className={`font-display font-semibold mb-2 transition-colors ${accent.hoverText}`}>
                    {r.h1.replace("Curso de inglés para ", "")}
                  </h3>
                  <p className="text-sm text-cream/50 line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky CTA — stays visible during scroll */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-ink/95 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-cream text-sm leading-tight">{ctaTitle}</p>
            <p className="text-xs text-cream/50">
              {lessons.length} lecciones · <span className={isFreeCourse ? "text-gold" : "text-cream/70"}>{priceLabel}</span>
            </p>
          </div>
          <div className="w-40 shrink-0">
            <EnrollButton courseSlug={slug} courseName={course.h1} free={hasFree} />
          </div>
        </div>
      </div>
    </div>
  );
}
