import Link from "next/link";
import type { SanityBlogPostCard } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import { categoryAccent } from "@/lib/categoryColors";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default function BlogCard({ post }: { post: SanityBlogPostCard }) {
  const accent = categoryAccent(post.categoryColor ?? undefined);
  const date = formatDate(post.publishedAt);
  const imageUrl = post.featuredImage
    ? urlForImage(post.featuredImage).width(800).height(450).fit("crop").url()
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col bg-ink-elevated rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${accent.hoverBorder} ${accent.hoverShadow}`}
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-white/[0.07] to-transparent">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={post.h1}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className={`w-2.5 h-2.5 rounded-full ${accent.dot}`} />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          {post.category && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cream/70">
              <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
              {post.category}
            </span>
          )}
          {date && <span className="text-xs text-cream/40">{date}</span>}
        </div>
        <h3 className={`font-display text-lg font-semibold mb-2 transition-colors ${accent.hoverText}`}>
          {post.h1}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-cream/60 leading-relaxed line-clamp-3">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
