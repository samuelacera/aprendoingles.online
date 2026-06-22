import { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/data/courses";

export const metadata: Metadata = {
  title: "Todos los cursos de inglés profesional | aprendoingles.online",
  description:
    "Más de 100 cursos de inglés especializados por sector profesional: negocios, marketing, tecnología, finanzas, derecho, medicina y mucho más. Encuentra el tuyo.",
  openGraph: {
    title: "Todos los cursos de inglés profesional | aprendoingles.online",
    description:
      "Más de 100 cursos de inglés especializados por sector profesional. Encuentra el curso exacto para tu carrera.",
    type: "website",
    locale: "es_ES",
    siteName: "aprendoingles.online",
  },
};

export default function CursosPage() {
  const categories = getCategories();
  const totalCourses = categories.reduce((acc, cat) => acc + cat.courses.length, 0);

  return (
    <>
      <section className="bg-gradient-to-br from-blue-primary to-blue-dark text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Todos los cursos de inglés profesional
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            {totalCourses} cursos especializados en {categories.length} sectores profesionales.
            Encuentra el inglés exacto que tu carrera necesita.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="text-sm bg-gray-100 hover:bg-blue-50 hover:text-blue-primary text-gray-600 px-4 py-2 rounded-full transition-colors"
              >
                {cat.name}
                <span className="ml-1.5 text-gray-400">{cat.courses.length}</span>
              </a>
            ))}
          </nav>

          <div className="space-y-16">
            {categories.map((cat) => (
              <div key={cat.slug} id={cat.slug}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <h2 className="text-2xl font-bold text-gray-900">{cat.name}</h2>
                  <span className="text-sm text-gray-400">{cat.courses.length} cursos</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {cat.courses.map((course) => (
                    <Link
                      key={course.slug}
                      href={`/cursos/${course.slug}`}
                      className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-primary transition-colors">
                        {course.h1.replace("Curso de inglés para ", "")}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{course.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {course.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
