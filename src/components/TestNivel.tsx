export default function TestNivel() {
  return (
    <section id="test-nivel" className="bg-surface text-foreground py-24 border-t border-line">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-4">
              Test gratuito
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-5">
              Descubre tu nivel en 3 minutos
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed">
              Responde unas preguntas rápidas y recibe una recomendación personalizada
              del curso especializado ideal para tu sector y tu nivel actual.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Evaluación adaptada a tu sector profesional",
                "Resultado inmediato, sin compromiso",
                "Recomendación de curso a tu medida",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-foreground/70">
                  <span className="w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-2 border border-line rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <div className="flex justify-between text-[11px] uppercase tracking-wider text-foreground/40 mb-2">
                <span>Paso 1 de 2</span>
                <span>Tu perfil</span>
              </div>
              <div className="w-full bg-overlay rounded-full h-1">
                <div className="bg-gold h-1 rounded-full w-1/2" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Tu sector profesional *</label>
                <select className="w-full bg-background border border-line rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/60">
                  <option value="">Selecciona tu sector</option>
                  <option>Negocios y Management</option>
                  <option>Marketing y Comunicación</option>
                  <option>Ventas y Comercial</option>
                  <option>Tecnología y Desarrollo</option>
                  <option>Finanzas y Banca</option>
                  <option>Derecho y Legal</option>
                  <option>Salud y Medicina</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email *</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-background border border-line rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-gold/60"
                />
              </div>
              <button className="w-full bg-gold text-ink font-semibold py-3 rounded-lg hover:bg-gold-light transition-colors">
                Empezar test gratuito
              </button>
              <p className="text-xs text-foreground/40 text-center">
                Sin spam. Solo recibes tu resultado y recomendación de curso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
