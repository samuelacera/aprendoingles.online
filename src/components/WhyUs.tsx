const reasons = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Inglés de tu sector, no genérico",
    description:
      "Cada curso está diseñado con el vocabulario, situaciones y documentos reales de tu profesión. Aprendes lo que vas a usar mañana en tu trabajo.",
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
      "Evaluaciones por módulo, seguimiento de tu avance y certificado al completar cada nivel. Sabes exactamente dónde estás.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-24 bg-ink-soft text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-4">
            Por qué elegirnos
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">
            Inglés profesional con resultados reales
          </h2>
          <p className="text-cream/60 mt-5 max-w-2xl mx-auto text-lg">
            No es otro curso de inglés. Es formación diseñada para que tu carrera avance.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="group bg-ink-elevated rounded-2xl border border-white/10 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/10"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-gold bg-gold/10 mb-6 group-hover:bg-gold group-hover:text-ink group-hover:scale-110 transition-all">
                {r.icon}
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{r.title}</h3>
              <p className="text-cream/60 text-sm leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
