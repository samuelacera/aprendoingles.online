import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogSlugs, getBlogPost } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { categoryAccent } from "@/lib/categoryColors";
import PortableTextBody from "@/components/PortableTextBody";

type Params = { slug: string };

export async function generateStaticParams() {
  return getAllBlogSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      locale: "es_ES",
      siteName: "aprendoingles.online",
    },
  };
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const accent = categoryAccent(post.categoryColor ?? undefined);
  const date = formatDate(post.publishedAt);
  const heroImage = post.featuredImage
    ? urlForImage(post.featuredImage).width(1600).height(800).fit("crop").url()
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.h1,
    description: post.metaDescription,
    ...(post.authorName && { author: { "@type": "Person", name: post.authorName } }),
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    publisher: { "@type": "Organization", name: "aprendoingles.online" },
    inLanguage: "es",
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="relative overflow-hidden border-b border-line">
          <div className="pointer-events-none absolute inset-0">
            <div className={`absolute -top-32 -right-24 w-[34rem] h-[34rem] rounded-full ${accent.glow} opacity-20 blur-[130px]`} />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-foreground/50 hover:text-gold text-sm mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al blog
            </Link>
            <div className="flex items-center gap-3 mb-5 text-sm">
              {post.category && (
                <span className="inline-flex items-center gap-1.5 text-foreground/70">
                  <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                  {post.category}
                </span>
              )}
              {date && <span className="text-foreground/40">{date}</span>}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              {post.h1}
            </h1>
            {post.excerpt && <p className="text-lg text-foreground/70">{post.excerpt}</p>}
            {post.authorName && (
              <div className="mt-8 flex items-center gap-3 pt-6 border-t border-line">
                <div className="w-10 h-10 bg-gold/15 text-gold rounded-full flex items-center justify-center text-sm font-bold">
                  {post.authorName[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm">{post.authorName}</p>
                  {post.authorRole && <p className="text-xs text-foreground/50">{post.authorRole}</p>}
                </div>
              </div>
            )}
          </div>
        </header>

        {heroImage && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-px">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt={post.h1}
              className="w-full rounded-2xl border border-line mt-10 object-cover"
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {post.body && post.body.length > 0 ? (
            <PortableTextBody value={post.body} />
          ) : (
            <p className="text-foreground/50">Este artículo aún no tiene contenido.</p>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-line">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs border border-line text-foreground/50 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
