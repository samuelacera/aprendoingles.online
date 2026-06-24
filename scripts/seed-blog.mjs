/**
 * Seed de 3 artículos de blog en Sanity.
 * Uso: SANITY_TOKEN=<token> node scripts/seed-blog.mjs
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

// ── Helpers de Portable Text ──
let k = 0;
const key = () => `k${k++}`;

function span(text, marks = []) {
  return { _type: "span", _key: key(), text, marks };
}
function p(...children) {
  return { _type: "block", _key: key(), style: "normal", markDefs: [], children };
}
function h2(text) {
  return { _type: "block", _key: key(), style: "h2", markDefs: [], children: [span(text)] };
}
function quote(text) {
  return { _type: "block", _key: key(), style: "blockquote", markDefs: [], children: [span(text)] };
}
function li(...children) {
  return { _type: "block", _key: key(), style: "normal", listItem: "bullet", level: 1, markDefs: [], children };
}
const b = (t) => span(t, ["strong"]);
const code = (t) => span(t, ["code"]);

// ── Artículos ──
const articles = [
  {
    slug: "expresiones-reuniones-ingles",
    categorySlug: "negocios",
    publishedAt: "2026-06-10T09:00:00Z",
    tags: ["reuniones", "business english", "expresiones"],
    title: "20 expresiones para reuniones en inglés | aprendoingles.online",
    h1: "20 expresiones imprescindibles para reuniones en inglés",
    metaDescription:
      "Las expresiones en inglés que marcan la diferencia en una reunión profesional: abrir, ceder el turno, discrepar con tacto y cerrar acuerdos.",
    excerpt:
      "Desde 'Let me walk you through...' hasta 'I'd like to push back on that'. Las frases que te hacen sonar profesional en cualquier reunión en inglés.",
    body: [
      p(span("En una reunión en inglés no basta con entender lo que se dice: hay que saber intervenir en el momento justo y con el tono adecuado. Estas 20 expresiones te permiten abrir, moderar, discrepar y cerrar como un profesional nativo.")),
      h2("Abrir y marcar la agenda"),
      p(b("Let me walk you through the agenda."), span(" Sirve para tomar el control al inicio sin sonar autoritario.")),
      li(span("\"Thanks everyone for joining. Let's get started.\"")),
      li(span("\"The main goal today is to align on the Q3 roadmap.\"")),
      li(span("\"Let me walk you through the numbers first.\"")),
      h2("Ceder y pedir el turno"),
      p(span("Gestionar los turnos de palabra con elegancia evita pisar a los demás y proyecta seguridad.")),
      li(span("\"I'd love to hear your thoughts on this.\"")),
      li(span("\"Go ahead, please — you were saying?\"")),
      li(span("\"Can I jump in here for a second?\"")),
      h2("Discrepar con tacto"),
      p(span("Aquí es donde se nota el nivel. Mostrar desacuerdo sin generar fricción es una habilidad clave.")),
      li(span("\"I see your point, but I'd push back on that slightly.\"")),
      li(span("\"I'm not entirely convinced — could you expand on that?\"")),
      li(span("\"That's fair, although I'd frame it differently.\"")),
      quote("\"I'd like to push back on that\" es la fórmula más usada en empresas anglosajonas para discrepar sin sonar agresivo."),
      h2("Cerrar y acordar próximos pasos"),
      li(span("\"So, to summarize the action items...\"")),
      li(span("\"Let's circle back on this next week.\"")),
      li(span("\"I'll follow up with an email recapping the decisions.\"")),
      p(span("Domina estas estructuras y tus reuniones en inglés dejarán de ser un examen para convertirse en una conversación que controlas.")),
    ],
  },
  {
    slug: "brief-creativo-ingles",
    categorySlug: "marketing",
    publishedAt: "2026-06-15T09:00:00Z",
    tags: ["marketing", "briefing", "copywriting"],
    title: "Cómo escribir un brief creativo en inglés | aprendoingles.online",
    h1: "Cómo escribir un brief creativo en inglés que funcione",
    metaDescription:
      "Estructura, vocabulario clave y ejemplos reales para redactar un brief creativo en inglés que agencias internacionales aprueben a la primera.",
    excerpt:
      "Estructura, vocabulario clave y ejemplos reales de briefs que agencias internacionales aprobaron a la primera.",
    body: [
      p(span("Un buen brief creativo evita semanas de idas y venidas. En inglés, además, hay un vocabulario muy concreto que las agencias esperan ver. Esta es la estructura que funciona.")),
      h2("Las secciones que no pueden faltar"),
      li(span("", []), b("Background"), span(": el contexto de negocio y por qué surge el proyecto.")),
      li(b("Objective"), span(": qué quieres conseguir, idealmente medible.")),
      li(b("Target audience"), span(": a quién te diriges, con datos y motivaciones.")),
      li(b("Key message"), span(": la única idea que el público debe recordar.")),
      li(b("Tone of voice"), span(": cómo debe sonar la marca.")),
      li(b("Deliverables"), span(": qué piezas concretas esperas recibir.")),
      h2("Vocabulario clave"),
      p(span("Estas son las palabras que verás (y deberás usar) en cualquier brief profesional:")),
      li(code("insight"), span(" — la verdad del consumidor que da pie a la idea.")),
      li(code("call to action (CTA)"), span(" — la acción que quieres provocar.")),
      li(code("deliverables"), span(" — los entregables.")),
      li(code("turnaround time"), span(" — el plazo de entrega.")),
      h2("Un ejemplo de key message"),
      quote("\"For busy professionals who struggle to find time, [brand] turns the daily commute into productive learning.\""),
      p(span("Fíjate en la estructura: ", []), b("for [target] who [problem], [brand] [benefit]"), span(". Es la fórmula clásica del posicionamiento y funciona en cualquier idioma, pero en inglés suena especialmente natural.")),
      p(span("Con esta plantilla, tu próximo brief llegará a la agencia listo para producir, sin rondas interminables de aclaraciones.")),
    ],
  },
  {
    slug: "code-reviews-ingles",
    categorySlug: "tecnologia",
    publishedAt: "2026-06-20T09:00:00Z",
    tags: ["tech english", "code review", "desarrollo"],
    title: "Cómo hacer code reviews en inglés | aprendoingles.online",
    h1: "Guía completa: cómo hacer code reviews en inglés",
    metaDescription:
      "Comentarios constructivos, pedir cambios con tacto y aprobar PRs en inglés. El inglés técnico que no te enseñan en ningún curso de idiomas.",
    excerpt:
      "Comentarios constructivos, pedir cambios con tacto y aprobar PRs. El inglés técnico que no te enseñan en ningún curso.",
    body: [
      p(span("Revisar código en inglés tiene un reto añadido: hay que ser claro y directo sin sonar brusco. La cultura del code review valora el feedback amable pero honesto. Aquí tienes las fórmulas que usan los equipos internacionales.")),
      h2("Sugerir en vez de ordenar"),
      p(span("El secreto está en suavizar la petición sin perder claridad.")),
      li(span("\"What do you think about extracting this into a helper?\"")),
      li(span("\"Nit: could we rename this for clarity?\"")),
      li(span("\"Consider using a map here to avoid the nested loop.\"")),
      p(span("La palabra ", []), code("nit"), span(" (de \"nitpick\") señala un comentario menor y opcional — úsala para que el autor sepa que no es bloqueante.")),
      h2("Pedir cambios bloqueantes"),
      p(span("Cuando algo sí debe cambiar antes de aprobar, sé directo pero explica el porqué.")),
      li(span("\"This could introduce a race condition — let's guard against it.\"")),
      li(span("\"Blocking: we need a test covering this edge case.\"")),
      h2("Aprobar"),
      li(span("\"LGTM!\" — Looks Good To Me, el sello de aprobación universal.")),
      li(span("\"Nice work, shipping this. 🚀\"")),
      quote("Regla de oro: critica el código, nunca a la persona. \"This function is confusing\" mejor que \"You wrote this confusingly\"."),
      p(span("Con estas expresiones tus code reviews serán claros, respetuosos y, sobre todo, efectivos — sin importar de qué país sea tu equipo.")),
    ],
  },
];

async function seed() {
  console.log("🚀 Creando 3 artículos de blog...\n");

  const authorId = await client.fetch(`*[_type == "author"][0]._id`);
  if (!authorId) {
    console.error("❌ No se encontró ningún autor en Sanity");
    process.exit(1);
  }

  for (const a of articles) {
    const categoryId = await client.fetch(
      `*[_type == "category" && slug.current == $slug][0]._id`,
      { slug: a.categorySlug },
    );

    await client.createOrReplace({
      _id: `blogPost-${a.slug}`,
      _type: "blogPost",
      title: a.title,
      h1: a.h1,
      slug: { _type: "slug", current: a.slug },
      metaDescription: a.metaDescription,
      excerpt: a.excerpt,
      author: { _type: "reference", _ref: authorId },
      ...(categoryId && { category: { _type: "reference", _ref: categoryId } }),
      body: a.body,
      published: true,
      publishedAt: a.publishedAt,
      tags: a.tags,
    });

    console.log(`   ✅ ${a.h1}${categoryId ? "" : "  (⚠ sin categoría)"}`);
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ ${articles.length} artículos publicados`);
  console.log(`═══════════════════════════════════════`);
}

seed().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
