import Link from "next/link";

/** Home teaser of the level test. The test itself lives at /test-nivel. */
export default function TestNivel() {
  return (
    <section id="test-nivel" className="bg-surface text-foreground py-24 border-t border-line">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-4">
              Test gratuito · 4 minutos
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-5">
              ¿Qué nivel de inglés tienes de verdad?
            </h2>
            <p className="text-foreground/60 text-lg leading-relaxed">
              Un test adaptativo con el inglés que vas a oír en tu trabajo: gramática,
              vocabulario de tu sector, expresiones de nativos y audios con acentos reales.
              Al final, tu nivel y un plan a tu medida.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Se adapta a ti: sube o baja según aciertas",
                "Preguntas de tu sector, no de libro de texto",
                "Listening con 4 acentos (si no puedes escuchar ahora, lo saltas)",
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

          <div className="bg-surface-2 border border-line rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between text-[11px] uppercase tracking-wider mb-4">
              <span className="text-gold font-semibold">Expresiones y slang</span>
              <span className="text-foreground/40">Pregunta 3 de 12</span>
            </div>
            <p className="text-lg font-semibold mb-5" lang="en">
              «Can you give me a ballpark figure?» What do they want?
            </p>
            <div className="space-y-2 mb-6">
              {["El número exacto", "Una cifra aproximada", "Las cifras del estadio"].map((o) => (
                <div key={o} className="rounded-lg border border-line px-4 py-3 text-sm text-foreground/70">
                  {o}
                </div>
              ))}
            </div>
            <Link
              href="/test-nivel"
              className="block text-center w-full bg-gold text-ink font-semibold py-3.5 rounded-lg hover:bg-gold-light transition-colors"
            >
              Empezar el test gratis
            </Link>
            <p className="text-xs text-foreground/40 text-center mt-3">
              Sin registro para hacerlo. Te enseñamos tu nivel al terminar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
