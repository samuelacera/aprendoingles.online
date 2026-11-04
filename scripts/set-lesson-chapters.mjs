/**
 * Pone los capítulos en vídeo de una lección en Sanity.
 *
 * Uso (desde web/):
 *   node --env-file=.env.local scripts/set-lesson-chapters.mjs scripts/chapters/<archivo>.json [--dry-run]
 *
 * El JSON lleva { course, lesson, chapters: [{ key, title, platform, url,
 * durationSeconds, thumbnail, summary }] }. Sustituye los capítulos que
 * hubiera: el archivo es la fuente de verdad del orden.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

const [file, flag] = process.argv.slice(2);
const dryRun = flag === "--dry-run";

if (!file) {
  console.error("❌ Falta el archivo JSON de capítulos");
  process.exit(1);
}
if (!process.env.SANITY_TOKEN) {
  console.error("❌ Falta SANITY_TOKEN en .env.local");
  process.exit(1);
}

const data = JSON.parse(readFileSync(file, "utf8"));

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const lesson = await client.fetch(
  `*[_type == "lesson" && slug.current == $lesson && course->slug.current == $course][0]{ _id, h1 }`,
  { course: data.course, lesson: data.lesson },
);

if (!lesson) {
  console.error(`❌ No existe la lección ${data.course}/${data.lesson}`);
  process.exit(1);
}

const chapters = data.chapters.map(({ key, ...rest }) => ({
  _key: key,
  _type: "chapter",
  ...rest,
}));

await client
  .patch(lesson._id)
  .set({ chapters })
  .commit({ dryRun });

console.log(
  `${dryRun ? "🧪 (prueba) " : "✅ "}${lesson.h1}: ${chapters.length} capítulos`,
);
for (const c of chapters) {
  const m = Math.floor((c.durationSeconds ?? 0) / 60);
  const s = String((c.durationSeconds ?? 0) % 60).padStart(2, "0");
  console.log(`   ${c._key}  ${m}:${s}  ${c.title}`);
}
