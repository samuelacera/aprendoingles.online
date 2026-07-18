/**
 * Nueva guía de blog: inglés para consultores.
 * Uso: SANITY_TOKEN=<token> node scripts/seed-blog-consultor.mjs
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "38k6nrt4",
  dataset: "production",
  token: process.env.SANITY_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

if (!process.env.SANITY_TOKEN) {
  console.error("❌ Falta SANITY_TOKEN");
  process.exit(1);
}

let k = 0;
const key = () => `k${k++}`;
const span = (text, marks = []) => ({ _type: "span", _key: key(), text, marks });
const p = (...children) => ({ _type: "block", _key: key(), style: "normal", markDefs: [], children });
const h2 = (text) => ({ _type: "block", _key: key(), style: "h2", markDefs: [], children: [span(text)] });
const quote = (text) => ({ _type: "block", _key: key(), style: "blockquote", markDefs: [], children: [span(text)] });
const li = (...children) => ({ _type: "block", _key: key(), style: "normal", listItem: "bullet", level: 1, markDefs: [], children });
const b = (t) => span(t, ["strong"]);

const article = {
  slug: "expresiones-ingles-consultores",
  categorySlug: "negocios",
  publishedAt: "2026-06-30T09:00:00Z",
  tags: ["consultoría", "business english", "expresiones", "reuniones"],
  title: "12 expresiones en inglés para consultores | aprendoingles.online",
  h1: "12 expresiones en inglés que todo consultor debería dominar",
  metaDescription:
    "Las expresiones en inglés que usan los consultores de McKinsey, BCG y las Big Four: desde 'let's align on scope' hasta el arte del hedging con clientes.",
  excerpt:
    "Desde 'let's align on scope' hasta 'I'd gently push back on that'. Las expresiones que separan a un consultor que suena profesional en inglés del que no.",
  body: [
    p(span("En consultoría, la forma de decir las cosas importa tanto como el análisis. Un consultor que domina el registro adecuado en inglés genera confianza; uno que traduce literalmente del español, no. Estas son doce expresiones que oirás a diario en proyectos internacionales, agrupadas por el momento del proyecto en que las necesitas.")),

    h2("Al arrancar el proyecto"),
    p(span("El inicio marca las expectativas. Aquí el objetivo es acotar y consensuar.")),
    li(b("Let's align on scope and deliverables."), span(" — El verbo "), b("align"), span(" ('consensuar') es probablemente el más usado en consultoría. Mejor que 'let's agree', suena más colaborativo.")),
    li(b("That's out of scope for this phase."), span(" — La fórmula educada para frenar el "), b("scope creep"), span(" (la ampliación incontrolada del alcance) sin decir 'no' de forma tajante.")),
    li(b("Let's walk through the timeline."), span(" — "), b("Walk through"), span(" significa 'repasar paso a paso'. Se usa constantemente para revisar planes, slides y datos.")),

    h2("Durante el análisis"),
    p(span("Aquí es donde se nota el pensamiento estructurado. El vocabulario refleja el método.")),
    li(b("Let's break this down into MECE buckets."), span(" — Descomponer un problema en categorías "), b("MECE"), span(" (mutuamente excluyentes, colectivamente exhaustivas) sin solapamientos ni huecos.")),
    li(b("OK, but what's the 'so what' here?"), span(" — La pregunta más temida y más útil de la profesión: obliga a pasar del dato a su implicación para el cliente.")),
    li(b("Our leading hypothesis is that..."), span(" — Presentar la hipótesis principal con la que arrancas antes de validarla con datos.")),

    h2("Al presentar resultados"),
    p(span("Los consultores no cuentan las cosas en orden cronológico: empiezan por la respuesta. Es el principio "), b("answer-first"), span(" de la pirámide de Minto.")),
    li(b("Let me walk you through this exhibit."), span(" — Forma estándar de introducir un gráfico ("), b("exhibit"), span(") dentro de una presentación ("), b("deck"), span(").")),
    li(b("The bottom line is..."), span(" — Ir directo a la conclusión esencial. Perfecto para el "), b("executive summary"), span(".")),
    li(b("We'd recommend starting with the quick wins."), span(" — Priorizar por impacto y esfuerzo, empezando por las victorias rápidas ("), b("high impact, low effort"), span(").")),

    h2("El arte del hedging (matizar con cautela)"),
    p(span("Quizá el rasgo más característico del inglés profesional: rara vez se afirma con rotundidad algo que no está confirmado. Se "), b("matiza"), span(" (hedging). Esto proyecta rigor y evita comprometerse de más.")),
    li(b("Based on what we've seen so far, it appears that..."), span(" — En lugar de 'this is the cause', un cauto 'parece que...'.")),
    li(b("I'd gently push back on that."), span(" — Discrepar con tacto. "), b("Push back"), span(" es discrepar; "), b("gently"), span(" lo suaviza sin quitarle firmeza.")),
    li(b("Let me circle back to you on that."), span(" — Cuando no tienes la respuesta ahora: 'déjame volver a ti con eso', mucho mejor que improvisar una cifra.")),

    quote("Regla de oro del consultor: sé claro con los hechos y cauto con las conclusiones. En inglés, el hedging no es debilidad — es credibilidad."),

    h2("Cómo practicarlas"),
    p(span("No basta con memorizarlas: hay que usarlas en contexto. La forma más rápida de interiorizarlas es simular situaciones reales — un kickoff, una discovery call, la presentación a un steering committee — hasta que salgan solas. Ese es exactamente el enfoque de nuestro "), b("curso de inglés para consultoría"), span(", donde cada expresión va acompañada de su traducción, su contexto de uso y un ejercicio.")),
    p(span("Domina estas doce y ya sonarás notablemente más profesional en tu próximo proyecto internacional.")),
  ],
};

async function seed() {
  console.log("🚀 Creando guía de blog para consultores...\n");

  const authorId = await client.fetch(`*[_type == "author"][0]._id`);
  const categoryId = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]._id`,
    { slug: article.categorySlug },
  );

  await client.createOrReplace({
    _id: `blogPost-${article.slug}`,
    _type: "blogPost",
    title: article.title,
    h1: article.h1,
    slug: { _type: "slug", current: article.slug },
    metaDescription: article.metaDescription,
    excerpt: article.excerpt,
    ...(authorId && { author: { _type: "reference", _ref: authorId } }),
    ...(categoryId && { category: { _type: "reference", _ref: categoryId } }),
    body: article.body,
    published: true,
    publishedAt: article.publishedAt,
    tags: article.tags,
  });

  console.log(`   ✅ ${article.h1}`);
  console.log(`\n✅ Guía publicada (categoría: ${categoryId ? "negocios" : "⚠ sin categoría"})`);
}

seed().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
