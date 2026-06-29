import Link from "next/link";
import { getCategories } from "@/sanity/queries";
import { categoryAccent } from "@/lib/categoryColors";

export default async function Courses() {
  const categories = await getCategories();
  const featured = categories
    .map((cat) => ({ cat, course: cat.courses[0] }))
    .filter((x) => x.course);
  const total = categories.reduce((acc, cat) => acc + cat.courses.length, 0);

  return (
    <section className="py-24 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div>
            <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-4">
              El catálogo
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">
              Cursos especializados por sector
            </h2>
          </div>
          <p className="text-foreground/60 max-w-sm">
            Más de {total} cursos en {categories.length} sectores. Elige tu profesión
            y aprende el inglés exacto que necesitas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featured.map(({ cat, course }) => {
            const accent = categoryAccent(cat.color);
            return (
              <Link
                key={cat.slug}
                href={`/categorias/${cat.slug}`}
                className={`group relative aspect-[3/4] rounded-xl overflow-hidden border border-line transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${accent.hoverBorder} ${accent.hoverShadow}`}
              >
                {/* Base tone + cinematic scrim (color intensifies on hover) */}
                <div className={`absolute inset-0 ${cat.color} opacity-25 group-hover:opacity-45 transition-opacity duration-500`} />
                <div className={`absolute inset-0 bg-gradient-to-t ${accent.gradient} to-transparent`} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/60 mb-2`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                    {cat.courses.length} cursos
                  </span>
                  <h3 className={`font-display text-2xl font-semibold leading-tight mb-3 transition-colors ${accent.hoverText}`}>
                    {cat.name}
                  </h3>
                  <p className="text-sm text-foreground/60 line-clamp-2 max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-0 transition-all duration-300">
                    {course.description}
                  </p>
                </div>

                <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-overlay border border-line flex items-center justify-center text-foreground/70 group-hover:bg-gold group-hover:text-ink group-hover:scale-110 transition-all">
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 border border-gold/40 text-gold font-semibold px-7 py-3.5 rounded-full hover:bg-gold hover:text-ink transition-colors"
          >
            Ver los {total} cursos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
