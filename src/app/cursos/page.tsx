import { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/sanity/queries";
import { categoryAccent } from "@/lib/categoryColors";

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

export default async function CursosPage() {
  const categories = await getCategories();
  const totalCourses = categories.reduce((acc, cat) => acc + cat.courses.length, 0);

  return (
    <div className="bg-ink text-cream">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 w-[40rem] h-[40rem] rounded-full bg-gold/10 blur-[130px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-5">
            El catálogo completo
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mb-5 leading-tight">
            Todos los cursos de inglés profesional
          </h1>
          <p className="text-lg text-cream/60 max-w-2xl mx-auto">
            {totalCourses} cursos especializados en {categories.length} sectores profesionales.
            Encuentra el inglés exacto que tu carrera necesita.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap gap-2 mb-16 justify-center">
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="text-sm border border-white/15 hover:border-gold/50 hover:text-gold text-cream/70 px-4 py-2 rounded-full transition-colors"
              >
                {cat.name}
                <span className="ml-1.5 text-cream/30">{cat.courses.length}</span>
              </a>
            ))}
          </nav>

          <div className="space-y-20">
            {categories.map((cat) => {
              const accent = categoryAccent(cat.color);
              return (
                <div key={cat.slug} id={cat.slug} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-3 h-3 rounded-full ${accent.dot}`} />
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold">{cat.name}</h2>
                    <span className="text-sm text-cream/30">{cat.courses.length} cursos</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cat.courses.map((course) => (
                      <Link
                        key={course.slug}
                        href={`/cursos/${course.slug}`}
                        className={`group relative bg-ink-soft rounded-xl border border-white/10 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accent.hoverBorder} ${accent.hoverShadow}`}
                      >
                        {/* colored dot, top-left, fades in on hover */}
                        <span className={`block w-2.5 h-2.5 rounded-full mb-3 ${accent.dot} opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300`} />
                        <h3 className={`font-display text-lg font-semibold mb-2 transition-colors ${accent.hoverText}`}>
                          {course.h1.replace("Curso de inglés para ", "")}
                        </h3>
                        <p className="text-sm text-cream/50 line-clamp-2 mb-3">{course.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {course.tags.map((tag) => (
                            <span key={tag} className="text-xs border border-white/10 text-cream/50 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
