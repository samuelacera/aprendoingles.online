import Link from "next/link";

const footerLinks = {
  Cursos: [
    { name: "Business English", href: "/cursos/business" },
    { name: "Marketing English", href: "/cursos/marketing" },
    { name: "Sales English", href: "/cursos/sales" },
    { name: "Tech English", href: "/cursos/tech" },
    { name: "Finance English", href: "/cursos/finance" },
    { name: "Ver todos", href: "/cursos" },
  ],
  Recursos: [
    { name: "Blog", href: "/blog" },
    { name: "Test de nivel", href: "#test-nivel" },
    { name: "Guias gratuitas", href: "/blog" },
  ],
  Empresa: [
    { name: "Sobre nosotros", href: "/sobre-nosotros" },
    { name: "Contacto", href: "/contacto" },
    { name: "Politica de privacidad", href: "/privacidad" },
    { name: "Terminos de uso", href: "/terminos" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-white">aprendo</span>
              <span className="text-xl font-bold text-blue-400">ingles.online</span>
            </div>
            <p className="text-sm leading-relaxed">
              Cursos de ingles especializados por sector profesional. Aprende el ingles que tu
              carrera necesita.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href + link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          &copy; {new Date().getFullYear()} aprendoingles.online. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
