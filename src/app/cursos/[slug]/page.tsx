import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/data/courses";

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

  const allCourses = getAllCourses();
  const related = allCourses
    .filter((c) => c.category === course.category && c.slug !== course.slug)
    .slice(0, 3);

  return (
    <>
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
