import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCategorySlugs, getCategoryBySlug } from "@/sanity/queries";
import { categoryAccent } from "@/lib/categoryColors";

export async function generateStaticParams() {
  return getAllCategorySlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  const count = category.courses.length;
  return {
    title: `Cursos de inglés para ${category.name} | aprendoingles.online`,
    description: `${count} cursos de inglés especializados para profesionales de ${category.name}. Vocabulario, expresiones y situaciones reales de tu sector.`,
    alternates: { canonical: `/categorias/${slug}` },
    openGraph: {
      title: `Cursos de inglés para ${category.name}`,
      description: `${count} cursos de inglés especializados para ${category.name}.`,
      type: "website",
      locale: "es_ES",
      siteName: "aprendoingles.online",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const accent = categoryAccent(category.color);
  const influences = category.influences ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Cursos de inglés para ${category.name}`,
    inLanguage: "es",
    hasPart: category.courses.map((c) => ({
      "@type": "Course",
      name: c.h1,
      url: `https://aprendoingles-online.vercel.app/cursos/${c.slug}`,
    })),
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0">
          <div className={`absolute -top-32 left-1/4 w-[40rem] h-[40rem] rounded-full ${accent.glow} opacity-20 blur-[130px]`} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-1 text-foreground/50 hover:text-gold text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Todas las categorías
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className={`w-3 h-3 rounded-full ${accent.dot}`} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {category.courses.length} cursos
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
            Inglés para {category.name}
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl">
            Cursos especializados con el vocabulario, las expresiones y las situaciones
            reales del sector de {category.name.toLowerCase()}. Elige el tuyo y empieza hoy.
          </p>
          {influences.length > 0 && (
            <p className="text-xs text-foreground/40 italic mt-6">
              Contenido influenciado por los aprendizajes de {influences.slice(0, -1).join(", ")} y {influences[influences.length - 1]}
            </p>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.courses.map((course) => (
              <Link
                key={course.slug}
                href={`/cursos/${course.slug}`}
                className={`group relative bg-surface rounded-xl border border-line p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accent.hoverBorder} ${accent.hoverShadow}`}
              >
                <span className={`block w-2.5 h-2.5 rounded-full mb-3 ${accent.dot} opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300`} />
                <h2 className={`font-display text-lg font-semibold mb-2 transition-colors ${accent.hoverText}`}>
                  {course.h1.replace("Curso de inglés para ", "")}
                </h2>
                <p className="text-sm text-foreground/50 line-clamp-2 mb-3">{course.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {course.tags.map((tag) => (
                    <span key={tag} className="text-xs border border-line text-foreground/50 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
