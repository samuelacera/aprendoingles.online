import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-primary to-blue-dark text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Listo para hablar ingles en tu trabajo?
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
          Haz el test de nivel gratuito en 3 minutos y descubre que curso especializado
          es el mejor para tu carrera.
        </p>
        <Link
          href="#test-nivel"
          className="inline-block bg-white text-blue-primary font-semibold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg"
        >
          Hacer test de nivel gratis
        </Link>
      </div>
    </section>
  );
}
