import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative bg-ink-soft text-cream overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[30rem] rounded-full bg-gold/10 blur-[120px]" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5 leading-tight">
          ¿Listo para hablar inglés en tu trabajo?
        </h2>
        <p className="text-cream/70 text-lg mb-10 max-w-xl mx-auto">
          Haz el test de nivel gratuito en 3 minutos y descubre qué curso especializado
          es el mejor para tu carrera.
        </p>
        <Link
          href="#test-nivel"
          className="inline-block bg-gold text-ink font-semibold px-8 py-4 rounded-full hover:bg-gold-light transition-colors text-lg"
        >
          Hacer test de nivel gratis
        </Link>
      </div>
    </section>
  );
}
