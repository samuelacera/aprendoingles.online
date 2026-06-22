import Link from "next/link";

const posts = [
  {
    category: "Business",
    readTime: "8 min",
    title: "20 expresiones imprescindibles para reuniones en ingles",
    excerpt:
      "Desde 'Let me walk you through...' hasta 'I'd like to push back on that'. Las frases que marcan la diferencia.",
    href: "/blog/expresiones-reuniones-ingles",
  },
  {
    category: "Marketing",
    readTime: "6 min",
    title: "Como escribir un brief creativo en ingles que funcione",
    excerpt:
      "Estructura, vocabulario clave y ejemplos reales de briefs que agencias internacionales aprobaron a la primera.",
    href: "/blog/brief-creativo-ingles",
  },
  {
    category: "Tech",
    readTime: "10 min",
    title: "Guia completa: como hacer code reviews en ingles",
    excerpt:
      "Comentarios constructivos, pedir cambios con tacto y aprobar PRs. El ingles tecnico que no te ensenan en ningun curso.",
    href: "/blog/code-reviews-ingles",
  },
];

export default function Blog() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-blue-primary uppercase tracking-wide mb-3">
              Recursos
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Ultimas guias del blog
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg">
              Vocabulario, expresiones y situaciones reales para cada sector profesional.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-primary hover:underline"
          >
            Ver todos
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium bg-blue-50 text-blue-primary px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{post.readTime}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>
                <p className="text-sm font-medium text-blue-primary mt-4 flex items-center gap-1">
                  Leer articulo
                  <span aria-hidden="true">&rsaquo;</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
