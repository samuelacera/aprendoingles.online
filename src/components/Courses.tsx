import Link from "next/link";
import { getCategories } from "@/data/courses";

export default function Courses() {
  const categories = getCategories();
  const featured = categories.map((cat) => cat.courses[0]);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Cursos especializados por sector
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Más de 100 cursos en {categories.length} sectores profesionales. Elige tu profesión y aprende el inglés exacto que necesitas.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured.map((course) => (
            <Link
              key={course.slug}
              href={`/cursos/${course.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all"
            >
              <div className={`w-10 h-10 ${course.color} rounded-lg flex items-center justify-center mb-4`}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-primary transition-colors">
                {course.category}
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 bg-blue-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-dark transition-colors"
          >
            Ver los {categories.reduce((acc, cat) => acc + cat.courses.length, 0)} cursos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
