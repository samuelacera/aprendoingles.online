import Link from "next/link";
import { getLatestBlogPosts } from "@/sanity/queries";
import BlogCard from "@/components/BlogCard";

export default async function Blog() {
  const posts = await getLatestBlogPosts(3);

  // Hide the section entirely until there's published content
  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-surface text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-4">
              Recursos
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">
              Últimas guías del blog
            </h2>
            <p className="text-foreground/60 mt-4 max-w-lg">
              Vocabulario, expresiones y situaciones reales para cada sector profesional.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-light transition-colors"
          >
            Ver todos
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
