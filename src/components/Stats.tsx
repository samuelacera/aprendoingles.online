const stats = [
  { number: "+2.500", label: "Profesionales formados" },
  { number: "15+", label: "Especialidades" },
  { number: "96%", label: "Tasa de satisfacción" },
  { number: "24/7", label: "Acceso a contenidos" },
];

export default function Stats() {
  return (
    <section className="bg-background text-foreground py-16 border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl sm:text-5xl font-bold text-gold">{stat.number}</p>
              <p className="text-sm text-foreground/50 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
