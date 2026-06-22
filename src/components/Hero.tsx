export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-primary to-blue-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-white/15 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              Ingles profesional especializado por sector
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Aprende el ingles que tu carrera necesita
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-lg">
              Cursos de ingles disenados para profesionales. No aprendes ingles generico:
              aprendes el vocabulario, las expresiones y las situaciones reales de tu sector.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                +15 especialidades
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Desde A2 hasta C2
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
                <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                100% online
              </span>
            </div>
          </div>

          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8" id="test-nivel">
            <h2 className="text-xl font-bold mb-2">Descubre tu nivel gratis</h2>
            <p className="text-gray-500 text-sm mb-6">Test de 3 minutos. Sin compromiso.</p>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>PASO 1 DE 2</span>
                <span>TU PERFIL</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-primary h-1.5 rounded-full w-1/2" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Tu sector profesional *</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary">
                  <option value="">Selecciona tu sector</option>
                  <option>Marketing y Publicidad</option>
                  <option>Ventas y Comercial</option>
                  <option>Tecnologia y Desarrollo</option>
                  <option>Finanzas y Banca</option>
                  <option>Psicologia y Salud Mental</option>
                  <option>Derecho y Legal</option>
                  <option>Medicina y Salud</option>
                  <option>Recursos Humanos</option>
                  <option>Logistica y Supply Chain</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email *</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary"
                />
              </div>
              <button className="w-full bg-blue-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-dark transition-colors">
                Empezar test gratuito
              </button>
              <p className="text-xs text-gray-400 text-center">
                Sin spam. Solo recibes tu resultado y recomendacion de curso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
