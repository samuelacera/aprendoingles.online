const reasons = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Ingles de tu sector, no generico",
    description:
      "Cada curso esta disenado con el vocabulario, situaciones y documentos reales de tu profesion. Aprendes lo que vas a usar manana en tu trabajo.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Aprende a tu ritmo",
    description:
      "Contenido disponible 24/7. Lecciones de 15-20 minutos pensadas para profesionales con agenda apretada. Sin horarios fijos.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Progreso medible",
    description:
      "Evaluaciones por modulo, seguimiento de tu avance y certificado al completar cada nivel. Sabes exactamente donde estas.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-primary uppercase tracking-wide mb-3">
            Por que elegirnos
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Ingles profesional con resultados reales
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            No es otro curso de ingles. Es formacion disenada para que tu carrera avance.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-light rounded-lg flex items-center justify-center text-blue-primary mb-5">
                {r.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{r.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
