import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate bg-ink text-cream overflow-hidden min-h-[88vh] flex items-center">
      {/* Cinematic background: layered glows + vignette */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/4 w-[55rem] h-[55rem] rounded-full bg-gold/10 blur-[140px]" />
        <div className="absolute bottom-[-20rem] -right-40 w-[50rem] h-[50rem] rounded-full bg-blue-primary/15 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-8">
          Inglés profesional especializado por sector
        </span>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] font-bold leading-[1.02] tracking-tight mb-8">
          Aprende el inglés que
          <br className="hidden sm:block" /> tu{" "}
          <span className="italic text-gold">carrera</span> necesita
        </h1>
        <p className="text-lg sm:text-xl text-cream/70 mb-10 max-w-2xl mx-auto leading-relaxed">
          No aprendes inglés genérico. Aprendes el vocabulario, las expresiones y
          las situaciones reales de tu profesión — diseñado por expertos de tu sector.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#test-nivel"
            className="w-full sm:w-auto bg-gold text-ink font-semibold px-8 py-4 rounded-full hover:bg-gold-light transition-colors text-lg"
          >
            Descubre tu nivel gratis
          </Link>
          <Link
            href="/cursos"
            className="w-full sm:w-auto border border-white/20 text-cream font-semibold px-8 py-4 rounded-full hover:bg-white/5 transition-colors text-lg"
          >
            Explorar cursos
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12 text-sm text-cream/50">
          {["+15 especialidades", "Desde A2 hasta C2", "100% online", "Certificado al completar"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/30">
        <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
