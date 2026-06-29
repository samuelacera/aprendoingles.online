import Link from "next/link";

const footerLinks = {
  Cursos: [
    { name: "Negocios", href: "/categorias/negocios" },
    { name: "Marketing", href: "/categorias/marketing" },
    { name: "Ventas", href: "/categorias/ventas" },
    { name: "Tecnología", href: "/categorias/tecnologia" },
    { name: "Finanzas", href: "/categorias/finanzas" },
    { name: "Ver todos", href: "/cursos" },
  ],
  Recursos: [
    { name: "Blog", href: "/blog" },
    { name: "Test de nivel", href: "/#test-nivel" },
    { name: "Guías gratuitas", href: "/blog" },
  ],
  Empresa: [
    { name: "Sobre nosotros", href: "/sobre-nosotros" },
    { name: "Contacto", href: "/contacto" },
    { name: "Política de privacidad", href: "/privacidad" },
    { name: "Términos de uso", href: "/terminos" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-background text-foreground/50 border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-lg font-bold text-foreground">aprendo</span>
              <span className="text-lg font-bold text-gold">inglés</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/50">
              Cursos de inglés especializados por sector profesional. Aprende el inglés que tu
              carrera necesita.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-[0.15em] mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href + link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-gold transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-line mt-12 pt-8 text-sm text-center text-foreground/40">
          &copy; {new Date().getFullYear()} aprendoingles.online. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
