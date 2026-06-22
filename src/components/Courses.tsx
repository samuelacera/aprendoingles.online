import Link from "next/link";

const courses = [
  {
    title: "Business English",
    description:
      "Reuniones, presentaciones, negociaciones y emails corporativos. El ingles que necesitas para liderar en entornos internacionales.",
    tags: ["Directivos", "Managers", "Consultores"],
    href: "/cursos/business",
    color: "bg-blue-600",
  },
  {
    title: "Marketing English",
    description:
      "Copywriting, campanas, analytics y briefings en ingles. Domina el lenguaje del marketing digital global.",
    tags: ["CMOs", "Growth", "Content"],
    href: "/cursos/marketing",
    color: "bg-purple-600",
  },
  {
    title: "Sales English",
    description:
      "Cold calls, demos, closing y follow-ups. Aprende a vender en ingles con confianza y fluidez.",
    tags: ["Account Executives", "SDRs", "Comerciales"],
    href: "/cursos/sales",
    color: "bg-green-600",
  },
  {
    title: "Tech English",
    description:
      "Code reviews, standups, documentacion tecnica y arquitectura. El ingles del mundo del desarrollo.",
    tags: ["Developers", "PMs", "CTOs"],
    href: "/cursos/tech",
    color: "bg-orange-600",
  },
  {
    title: "Psychology English",
    description:
      "Terminologia clinica, informes, investigacion y comunicacion terapeutica en ingles.",
    tags: ["Psicologos", "Investigadores", "Terapeutas"],
    href: "/cursos/psychology",
    color: "bg-pink-600",
  },
  {
    title: "Finance English",
    description:
      "Reporting financiero, analisis de mercados, banca de inversion y compliance en ingles.",
    tags: ["Analistas", "Controllers", "Auditores"],
    href: "/cursos/finance",
    color: "bg-teal-600",
  },
  {
    title: "Legal English",
    description:
      "Contratos, litigacion, compliance y due diligence. El ingles juridico que tu despacho necesita.",
    tags: ["Abogados", "In-house", "Paralegals"],
    href: "/cursos/legal",
    color: "bg-red-600",
  },
  {
    title: "Medical English",
    description:
      "Historia clinica, diagnosticos, investigacion medica y comunicacion con pacientes en ingles.",
    tags: ["Medicos", "Enfermeros", "Investigadores"],
    href: "/cursos/medical",
    color: "bg-cyan-600",
  },
  {
    title: "HR English",
    description:
      "Recruiting, onboarding, evaluaciones de desempeno y politicas internas en ingles.",
    tags: ["HR Managers", "Recruiters", "People Ops"],
    href: "/cursos/hr",
    color: "bg-amber-600",
  },
  {
    title: "Supply Chain English",
    description:
      "Logistica internacional, procurement, aduanas y gestion de proveedores en ingles.",
    tags: ["Logistica", "Compras", "Operaciones"],
    href: "/cursos/supply-chain",
    color: "bg-indigo-600",
  },
  {
    title: "Hospitality English",
    description:
      "Atencion al cliente, reservas, reclamaciones y gestion hotelera en ingles.",
    tags: ["Hoteleros", "Turismo", "Restauracion"],
    href: "/cursos/hospitality",
    color: "bg-rose-600",
  },
  {
    title: "Architecture English",
    description:
      "Proyectos internacionales, especificaciones tecnicas, presentaciones a clientes y normativa en ingles.",
    tags: ["Arquitectos", "Interioristas", "Urbanistas"],
    href: "/cursos/architecture",
    color: "bg-slate-600",
  },
];

export default function Courses() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Cursos especializados por sector
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Elige tu profesion. Aprende el ingles exacto que necesitas. Sin relleno.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Link
              key={course.href}
              href={course.href}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all"
            >
              <div className={`w-10 h-10 ${course.color} rounded-lg flex items-center justify-center mb-4`}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
