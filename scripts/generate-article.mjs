/**
 * Generador automático de artículos largos (4000+ palabras) para el blog.
 *
 *   1. Elige un tema nuevo (evitando los ya publicados), con búsqueda web
 *   2. Genera un outline SEO (título, keyword, secciones, categoría)
 *   3. Escribe cada sección (~600 palabras) → 4000+ en total
 *   4. Convierte a Portable Text y publica el post en Sanity
 *
 * Uso:
 *   ANTHROPIC_API_KEY=... SANITY_TOKEN=... node scripts/generate-article.mjs ["tema opcional"]
 *
 * Env opcionales: MODEL (def. claude-opus-4-8), BLOG_PUBLISH (def. true), MIN_WORDS (def. 4000)
 */

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@sanity/client";

const MODEL = process.env.MODEL || "claude-opus-4-8";
const PUBLISH = process.env.BLOG_PUBLISH !== "false";
const MIN_WORDS = parseInt(process.env.MIN_WORDS || "4000", 10);
const FORCED_TOPIC = process.argv[2] || null;

if (!process.env.ANTHROPIC_API_KEY) { console.error("❌ Falta ANTHROPIC_API_KEY"); process.exit(1); }
if (!process.env.SANITY_TOKEN) { console.error("❌ Falta SANITY_TOKEN"); process.exit(1); }

const anthropic = new Anthropic();
const sanity = createClient({
  projectId: "38k6nrt4",
  dataset: "production",
  token: process.env.SANITY_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ── Claude helpers ──
async function researchCall(system, prompt) {
  let messages = [{ role: "user", content: prompt }];
  const tools = [{ type: "web_search_20260209", name: "web_search" }];
  for (let i = 0; i < 6; i++) {
    const res = await anthropic.messages.create({
      model: MODEL, max_tokens: 12000, system,
      thinking: { type: "adaptive" }, output_config: { effort: "high" },
      tools, messages,
    });
    if (res.stop_reason === "refusal") throw new Error("La API rechazó la investigación.");
    if (res.stop_reason === "pause_turn") {
      messages = [{ role: "user", content: prompt }, { role: "assistant", content: res.content }];
      continue;
    }
    return res.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  }
  throw new Error("La investigación no terminó.");
}

async function writeSection(system, prompt) {
  const res = await anthropic.messages.create({
    model: MODEL, max_tokens: 4000, system,
    thinking: { type: "adaptive" }, output_config: { effort: "medium" },
    messages: [{ role: "user", content: prompt }],
  });
  if (res.stop_reason === "refusal") throw new Error("La API rechazó una sección.");
  return res.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return JSON.parse(raw);
}

// ── Markdown → Portable Text ──
let keyN = 0;
const key = () => `k${keyN++}`;

function inlineChildren(text) {
  const children = [];
  const markDefs = [];
  // Tokeniza enlaces [txt](url), negrita **txt**, código `txt`
  const re = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)/g;
  let last = 0, m;
  const push = (t, marks = []) => { if (t) children.push({ _type: "span", _key: key(), text: t, marks }); };
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    if (m[1]) {
      const defKey = key();
      markDefs.push({ _type: "link", _key: defKey, href: m[3] });
      children.push({ _type: "span", _key: key(), text: m[2], marks: [defKey] });
    } else if (m[4]) {
      push(m[5], ["strong"]);
    } else if (m[6]) {
      push(m[7], ["code"]);
    }
    last = re.lastIndex;
  }
  push(text.slice(last));
  if (children.length === 0) push("");
  return { children, markDefs };
}

function block(style, text, extra = {}) {
  const { children, markDefs } = inlineChildren(text);
  return { _type: "block", _key: key(), style, markDefs, children, ...extra };
}

function markdownToPortableText(md) {
  const blocks = [];
  const chunks = md.replace(/\r/g, "").split(/\n{2,}/); // por líneas en blanco
  for (const chunk of chunks) {
    const lines = chunk.split("\n").map((l) => l.trimEnd());
    // ¿lista?
    if (lines.every((l) => /^\s*[-*]\s+/.test(l) || l === "")) {
      for (const l of lines) {
        if (!l.trim()) continue;
        blocks.push(block("normal", l.replace(/^\s*[-*]\s+/, ""), { listItem: "bullet", level: 1 }));
      }
      continue;
    }
    if (lines.every((l) => /^\s*\d+\.\s+/.test(l) || l === "")) {
      for (const l of lines) {
        if (!l.trim()) continue;
        blocks.push(block("normal", l.replace(/^\s*\d+\.\s+/, ""), { listItem: "number", level: 1 }));
      }
      continue;
    }
    const text = lines.join(" ").trim();
    if (!text) continue;
    if (/^####\s+/.test(text)) blocks.push(block("h4", text.replace(/^####\s+/, "")));
    else if (/^###\s+/.test(text)) blocks.push(block("h3", text.replace(/^###\s+/, "")));
    else if (/^##\s+/.test(text)) blocks.push(block("h2", text.replace(/^##\s+/, "")));
    else if (/^#\s+/.test(text)) blocks.push(block("h2", text.replace(/^#\s+/, ""))); // degradar H1→H2
    else if (/^>\s+/.test(text)) blocks.push(block("blockquote", text.replace(/^>\s+/, "")));
    else blocks.push(block("normal", text));
  }
  return blocks;
}

const wordCount = (md) => md.trim().split(/\s+/).filter(Boolean).length;

// ── Pipeline ──
async function main() {
  const authorId = await sanity.fetch(`*[_type=="author"][0]._id`);
  const categories = await sanity.fetch(`*[_type=="category"]{ _id, name, "slug": slug.current }`);
  const existing = await sanity.fetch(`*[_type=="blogPost"]{ h1, "slug": slug.current }`);
  const catList = categories.map((c) => `${c.slug} (${c.name})`).join(", ");
  const existingTitles = existing.map((e) => e.h1);

  console.log(`\n📰 Generando artículo de blog (mín. ${MIN_WORDS} palabras)...\n`);

  // 1 + 2. Tema + outline (con búsqueda web)
  console.log("🔎 Eligiendo tema e investigando (búsqueda web)...");
  const outlineText = await researchCall(
    "Eres editor SEO de un blog de inglés profesional por sector para hispanohablantes. Usas búsqueda web para encontrar temas con demanda real y datos actuales.",
    `Categorías disponibles (usa el slug exacto): ${catList}.
Artículos ya publicados (NO repitas tema ni ángulo): ${JSON.stringify(existingTitles)}.
${FORCED_TOPIC ? `Tema solicitado: "${FORCED_TOPIC}".` : "Elige UN tema nuevo, con búsqueda real de alto interés, útil para aprender inglés profesional de un sector."}

Devuelve EXCLUSIVAMENTE un bloque \`\`\`json:
{
  "title": "título SEO, termina en ' | aprendoingles.online'",
  "h1": "titular del artículo",
  "slug": "kebab-case-sin-tildes-unico",
  "metaDescription": "≤160 caracteres",
  "excerpt": "resumen atractivo de 1-2 frases",
  "categorySlug": "uno de los slugs de la lista",
  "targetKeyword": "palabra clave objetivo",
  "tags": ["3-5 tags"],
  "intro": "2-3 párrafos de introducción en español (markdown, sin encabezado)",
  "sections": [{ "heading": "título de sección (sin '##')", "points": ["punto clave", ...] }]   // 8-9 secciones
}
Cada sección debe dar para ~600 palabras. No añadas texto fuera del JSON.`,
  );
  const outline = extractJson(outlineText);
  const category = categories.find((c) => c.slug === outline.categorySlug) || categories[0];
  // slug único
  let slug = outline.slug;
  if (existing.some((e) => e.slug === slug)) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  console.log(`   ✅ Tema: ${outline.h1}`);
  console.log(`   ✅ Categoría: ${category.name} · keyword: ${outline.targetKeyword} · ${outline.sections.length} secciones\n`);

  // 3. Escribir cada sección
  console.log("✍️  Escribiendo secciones...");
  const parts = [outline.intro.trim()];
  for (const [i, s] of outline.sections.entries()) {
    const secMd = await writeSection(
      "Escribes artículos largos de blog sobre inglés profesional para hispanohablantes. Estilo claro y útil: explicaciones en español con ejemplos, vocabulario y expresiones en inglés (en negrita cuando aporte). Markdown: empieza con '## ' el encabezado, usa listas y **negritas** cuando ayuden. Nada de relleno.",
      `Artículo: "${outline.h1}" (keyword: ${outline.targetKeyword}).
Escribe SOLO esta sección, ~600 palabras, en markdown empezando por "## ${s.heading}".
Puntos a cubrir: ${JSON.stringify(s.points)}.
No repitas la introducción ni escribas conclusión (se añaden aparte).`,
    );
    parts.push(secMd);
    console.log(`   ✅ ${i + 1}/${outline.sections.length} · ${s.heading}`);
  }

  // Cierre con enlace interno (SEO + conversión)
  parts.push(
    `## Sigue aprendiendo\n\nDominar el inglés de tu sector es cuestión de práctica constante con contenido relevante. Si quieres dar el salto, explora nuestros [cursos de inglés para ${category.name}](/categorias/${category.slug}) y aprende el vocabulario, las expresiones y las situaciones reales de tu profesión.`,
  );

  const fullMd = parts.join("\n\n");
  const words = wordCount(fullMd);
  const body = markdownToPortableText(fullMd);
  console.log(`\n   📝 ${words} palabras${words < MIN_WORDS ? "  ⚠️ por debajo del mínimo" : ""}`);

  // 4. Publicar en Sanity
  await sanity.createOrReplace({
    _id: `blogPost-${slug}`,
    _type: "blogPost",
    title: outline.title,
    h1: outline.h1,
    slug: { _type: "slug", current: slug },
    metaDescription: outline.metaDescription,
    excerpt: outline.excerpt,
    ...(authorId && { author: { _type: "reference", _ref: authorId } }),
    category: { _type: "reference", _ref: category._id },
    body,
    published: PUBLISH,
    publishedAt: new Date().toISOString(),
    tags: outline.tags || [],
  });

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ Artículo ${PUBLISH ? "publicado" : "en borrador"}: ${outline.h1}`);
  console.log(`   ${words} palabras · /blog/${slug}`);
  console.log(`═══════════════════════════════════════`);
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
