import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurriculum, getModule } from "@/data/curriculum";

type Params = Promise<{ slug: string; moduleSlug: string }>;

export async function generateStaticParams() {
  const { curricula } = await import("@/data/curriculum");
  const params: { slug: string; moduleSlug: string }[] = [];
  for (const [courseSlug, curriculum] of Object.entries(curricula)) {
    for (const mod of curriculum.modules) {
      params.push({ slug: courseSlug, moduleSlug: mod.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, moduleSlug } = await params;
  const mod = getModule(slug, moduleSlug);
  if (!mod) return {};
  return {
    title: mod.title,
    description: mod.metaDescription,
    openGraph: { title: mod.title, description: mod.metaDescription, type: "website", locale: "es_ES", siteName: "aprendoingles.online" },
  };
}

export default async function ModulePage({ params }: { params: Params }) {
  const { slug, moduleSlug } = await params;
  const mod = getModule(slug, moduleSlug);
  if (!mod) notFound();

  const curriculum = getCurriculum(slug);
  const currentIndex = curriculum?.modules.findIndex((m) => m.slug === moduleSlug) ?? 0;

  return (
    <>
      <section className="bg-gradient-to-br from-blue-primary to-blue-dark text-white py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/cursos/${slug}`}
            className="inline-flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al curso
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">{mod.h1}</h1>
          <p className="text-blue-100 max-w-2xl">{mod.description}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Lecciones del módulo</h2>
          <div className="space-y-4">
            {mod.lessons.map((lesson, i) => (
              <Link
                key={lesson.slug}
                href={`/cursos/${slug}/${moduleSlug}/${lesson.slug}`}
                className="group flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${lesson.free ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-primary transition-colors">
                      {lesson.h1}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{lesson.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">{lesson.duration}</span>
                    {lesson.free ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Gratis</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Requiere cuenta</span>
                    )}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-primary shrink-0 mt-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          {curriculum && curriculum.modules.length > 1 && (
            <div className="mt-12 flex items-center justify-between">
              {currentIndex > 0 ? (
                <Link
                  href={`/cursos/${slug}/${curriculum.modules[currentIndex - 1].slug}`}
                  className="text-sm text-blue-primary hover:underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Módulo anterior
                </Link>
              ) : <div />}
              {currentIndex < curriculum.modules.length - 1 ? (
                <Link
                  href={`/cursos/${slug}/${curriculum.modules[currentIndex + 1].slug}`}
                  className="text-sm text-blue-primary hover:underline flex items-center gap-1"
                >
                  Siguiente módulo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              ) : <div />}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
