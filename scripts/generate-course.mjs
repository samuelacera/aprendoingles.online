/**
 * Pipeline automatizado de creación de cursos.
 *
 *   1. Busca 5 celebridades de habla inglesa de la temática (búsqueda web en vivo)
 *   2. Extrae su conocimiento + frases, estructuras, expresiones y vocabulario
 *   3. Prepara el contenido (plan de lecciones → contenido lección a lección)
 *   4. Crea el curso en Sanity
 *
 * Uso:
 *   ANTHROPIC_API_KEY=... SANITY_TOKEN=... node scripts/generate-course.mjs <course-slug> [nLecciones]
 *
 * Ejemplo:
 *   ... node scripts/generate-course.mjs ingles-para-finanzas
 */

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@sanity/client";

// ── Config ──
const COURSE_SLUG = process.argv[2];
const LESSON_COUNT = parseInt(process.argv[3] || "16", 10);
const PUBLISH = true; // publicar directo (decisión del usuario)
const MODEL = "claude-opus-4-8";

if (!COURSE_SLUG) {
  console.error("❌ Uso: node scripts/generate-course.mjs <course-slug> [nLecciones]");
  process.exit(1);
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ Falta ANTHROPIC_API_KEY");
  process.exit(1);
}
if (!process.env.SANITY_TOKEN) {
  console.error("❌ Falta SANITY_TOKEN");
  process.exit(1);
}

const anthropic = new Anthropic();
const sanity = createClient({
  projectId: "38k6nrt4",
  dataset: "production",
  token: process.env.SANITY_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ── Helpers de Claude ──

// Llamada con búsqueda web; devuelve el texto final (concatenado). Reanuda en pause_turn.
async function researchCall(system, prompt) {
  let messages = [{ role: "user", content: prompt }];
  const tools = [{ type: "web_search_20260209", name: "web_search" }];

  for (let i = 0; i < 6; i++) {
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 16000,
      system,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      tools,
      messages,
    });

    if (res.stop_reason === "refusal") {
      throw new Error("La API rechazó la petición de investigación.");
    }
    if (res.stop_reason === "pause_turn") {
      // El bucle de búsqueda del servidor se pausó: reenviar para continuar.
      messages = [
        { role: "user", content: prompt },
        { role: "assistant", content: res.content },
      ];
      continue;
    }
    return res.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
  }
  throw new Error("La investigación no terminó tras varias reanudaciones.");
}

// Llamada con salida estructurada (JSON schema); devuelve el objeto parseado.
async function structuredCall({ system, prompt, schema, effort = "medium", maxTokens = 8000 }) {
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    thinking: { type: "adaptive" },
    output_config: { effort, format: { type: "json_schema", schema } },
    messages: [{ role: "user", content: prompt }],
  });
  if (res.stop_reason === "refusal") throw new Error("La API rechazó la generación.");
  if (res.stop_reason === "max_tokens") throw new Error("Salida truncada (sube max_tokens).");
  const text = res.content.find((b) => b.type === "text")?.text ?? "";
  return JSON.parse(text);
}

function extractJson(text) {
  // Extrae el primer bloque ```json ... ``` o el primer objeto {...} del texto.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return JSON.parse(raw);
}

// ── Esquemas de salida estructurada ──
const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    sections: { type: "array", items: { type: "string" } },
    lessons: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          slug: { type: "string" },
          title: { type: "string" },
          h1: { type: "string" },
          metaDescription: { type: "string" },
          description: { type: "string" },
          duration: { type: "string" },
          section: { type: "string" },
          order: { type: "integer" },
        },
        required: ["slug", "title", "h1", "metaDescription", "description", "duration", "section", "order"],
      },
    },
  },
  required: ["sections", "lessons"],
};

const CONTENT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    intro: { type: "string" },
    vocabulary: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          term: { type: "string" },
          definition: { type: "string" },
          example: { type: "string" },
        },
        required: ["term", "definition", "example"],
      },
    },
    keyPhrases: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          phrase: { type: "string" },
          translation: { type: "string" },
          context: { type: "string" },
        },
        required: ["phrase", "translation", "context"],
      },
    },
    exercise: {
      type: "object",
      additionalProperties: false,
      properties: {
        instruction: { type: "string" },
        questions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              question: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correct: { type: "integer" },
            },
            required: ["question", "options", "correct"],
          },
        },
      },
      required: ["instruction", "questions"],
    },
  },
  required: ["intro", "vocabulary", "keyPhrases", "exercise"],
};

// ── Pipeline ──
async function main() {
  // 0. Cargar el curso desde Sanity
  const course = await sanity.fetch(
    `*[_type=="course" && slug.current==$slug][0]{_id, h1, "category": category->name}`,
    { slug: COURSE_SLUG },
  );
  if (!course) {
    console.error(`❌ No existe un curso publicado con slug "${COURSE_SLUG}".`);
    process.exit(1);
  }
  const topic = course.h1.replace(/^Curso de inglés para /i, "");
  console.log(`\n🎓 Curso: ${course.h1}  (categoría: ${course.category})`);
  console.log(`   Generando ${LESSON_COUNT} lecciones...\n`);

  // 1 + 2. Investigación: celebridades + conocimiento + lenguaje
  console.log("🔎 Paso 1-2: buscando 5 celebridades y extrayendo su conocimiento (búsqueda web)...");
  const researchText = await researchCall(
    "Eres un investigador experto que prepara material para un curso de inglés profesional especializado, dirigido a hispanohablantes. Usas búsqueda web para obtener información real y actual.",
    `Tema del curso: "${topic}" (sector: ${course.category}).

1) Encuentra 5 celebridades o referentes de habla inglesa reconocidos en este tema (autores, líderes, expertos).
2) Para el conjunto, extrae: sus conocimientos clave sobre el tema; y el inglés profesional asociado (vocabulario técnico, colocaciones, expresiones e idioms, frases útiles).

Devuelve EXCLUSIVAMENTE un bloque \`\`\`json con esta forma exacta:
{
  "celebrities": [{"name": "...", "role": "...", "whyRelevant": "...", "knownFor": "..."}],
  "insights": ["concepto o conocimiento clave del tema", ...],   // 10-15
  "vocabulary": [{"term": "término en inglés", "definition": "definición en español", "example": "frase de ejemplo en inglés"}, ...],   // 25-35
  "phrases": [{"phrase": "expresión en inglés", "translation": "traducción al español", "context": "cuándo/para qué se usa, en español"}, ...]   // 20-30
}
No añadas texto fuera del bloque JSON.`,
  );
  const research = extractJson(researchText);
  console.log(`   ✅ Celebridades: ${research.celebrities.map((c) => c.name).join(", ")}`);
  console.log(`   ✅ Material: ${research.vocabulary.length} términos, ${research.phrases.length} frases, ${research.insights.length} insights\n`);

  // 3a. Plan de lecciones
  console.log("🗂  Paso 3a: diseñando el temario...");
  const plan = await structuredCall({
    system: "Diseñas currículos de cursos de inglés profesional por sector para hispanohablantes. Sigues el estilo de LearningSEO.io: secciones temáticas coherentes y progresión lógica.",
    prompt: `Diseña el temario de "${course.h1}" con EXACTAMENTE ${LESSON_COUNT} lecciones agrupadas en 6-9 secciones temáticas.

Contexto de investigación:
- Insights del tema: ${JSON.stringify(research.insights)}
- Referentes: ${research.celebrities.map((c) => `${c.name} (${c.knownFor})`).join("; ")}

Para cada lección genera: slug (kebab-case, sin tildes, único), title (SEO, termina en " | aprendoingles.online"), h1, metaDescription (≤160 car.), description (1-2 frases), duration ("15 min"/"20 min"), section, order (1..${LESSON_COUNT}).
La lección 1 debe ser una introducción fundacional. Devuelve los ${LESSON_COUNT} en orden.`,
    schema: PLAN_SCHEMA,
    effort: "high",
    maxTokens: 8000,
  });
  const lessons = plan.lessons.slice(0, LESSON_COUNT).sort((a, b) => a.order - b.order);
  console.log(`   ✅ ${lessons.length} lecciones en ${plan.sections.length} secciones\n`);

  // 3b + 4. Contenido lección a lección + subida a Sanity
  console.log("✍️  Paso 3b-4: generando contenido y subiendo cada lección...");
  const celebLine = research.celebrities.map((c) => c.name).join(", ");
  let created = 0;

  for (const l of lessons) {
    const content = await structuredCall({
      system: "Creas lecciones de inglés profesional para hispanohablantes. La introducción va en español; el vocabulario son términos en inglés con definición en español y un ejemplo en inglés; las frases clave son expresiones en inglés con traducción y contexto en español; el ejercicio es un test de opción múltiple. Contenido riguroso, útil y con inglés natural y actual.",
      prompt: `Curso: "${course.h1}". Lección ${l.order}/${LESSON_COUNT} — sección "${l.section}".
Título: ${l.h1}
Descripción: ${l.description}

Apóyate en el conocimiento de estos referentes cuando sea natural: ${celebLine}.
Material disponible (reutiliza y adapta lo relevante, no lo copies literal):
- Vocabulario: ${JSON.stringify(research.vocabulary)}
- Frases: ${JSON.stringify(research.phrases)}

Genera:
- intro: 3-4 frases en español que introduzcan la lección y su utilidad.
- vocabulary: 7-8 términos (term en inglés, definition en español, example en inglés).
- keyPhrases: 5-6 (phrase en inglés, translation en español, context en español).
- exercise: instruction en español + 4 questions (question, options[3], correct = índice 0-based de la correcta).`,
      schema: CONTENT_SCHEMA,
      effort: "medium",
      maxTokens: 6000,
    });

    const free = l.order === 1; // primera gratis, resto de pago
    await sanity.createOrReplace({
      _id: `lesson-${COURSE_SLUG}-${l.slug}`,
      _type: "lesson",
      title: l.title,
      h1: l.h1,
      slug: { _type: "slug", current: l.slug },
      metaDescription: l.metaDescription,
      description: l.description,
      course: { _type: "reference", _ref: course._id },
      section: l.section,
      order: l.order,
      duration: l.duration,
      free,
      published: PUBLISH,
      intro: content.intro,
      vocabulary: content.vocabulary.map((v, i) => ({ _key: `vocab-${i}`, _type: "vocabItem", ...v })),
      keyPhrases: content.keyPhrases.map((p, i) => ({ _key: `phrase-${i}`, _type: "phraseItem", ...p })),
      exercise: {
        instruction: content.exercise.instruction,
        questions: content.exercise.questions.map((q, i) => ({ _key: `q-${i}`, _type: "questionItem", ...q })),
      },
      aiTutor: { enabled: false },
    });
    created++;
    console.log(`   ✅ ${l.order}. ${l.h1}${free ? "  🆓" : ""}`);
  }

  // Guardar las celebridades en el curso (para el popover "quiénes son y por qué")
  await sanity
    .patch(course._id)
    .set({
      celebrities: research.celebrities.map((c, i) => ({
        _key: `celeb-${i}`,
        _type: "celebrity",
        name: c.name,
        role: c.role,
        knownFor: c.knownFor,
        whyRelevant: c.whyRelevant,
      })),
    })
    .commit();

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ Curso generado: ${created} lecciones ${PUBLISH ? "publicadas" : "en borrador"}`);
  console.log(`   Referentes: ${celebLine}`);
  console.log(`   URL: /cursos/${COURSE_SLUG}`);
  console.log(`═══════════════════════════════════════`);
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
