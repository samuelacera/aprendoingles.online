import { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/sanity/queries";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog | aprendoingles.online",
  description:
    "Guías, vocabulario y expresiones de inglés profesional por sector: negocios, marketing, ventas, tecnología, finanzas y más.",
  openGraph: {
    title: "Blog de inglés profesional | aprendoingles.online",
    description:
      "Guías, vocabulario y expresiones de inglés profesional para cada sector.",
    type: "website",
    locale: "es_ES",
    siteName: "aprendoingles.online",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 w-[40rem] h-[40rem] rounded-full bg-gold/10 blur-[130px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-5">
            Recursos
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mb-5 leading-tight">
            El blog de inglés profesional
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Guías, vocabulario y expresiones reales para comunicarte con soltura
            en tu sector. Aprende algo nuevo en cada artículo.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="max-w-md mx-auto text-center bg-surface border border-line rounded-2xl p-10">
              <div className="w-12 h-12 bg-gold/15 rounded-xl flex items-center justify-center mx-auto mb-4 text-gold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-semibold mb-2">Próximamente</h2>
              <p className="text-foreground/60 text-sm mb-6">
                Estamos preparando los primeros artículos. Mientras tanto, explora
                nuestros cursos especializados.
              </p>
              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 bg-gold text-ink font-semibold px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
              >
                Ver cursos
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
