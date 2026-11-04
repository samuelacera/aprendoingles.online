/**
 * Sube a Sanity los escenarios de práctica por voz de
 * scripts/practice-scenarios.mjs (sobrescribe lesson.practice).
 *
 *   node --env-file=.env.local scripts/seed-practice.mjs              # todos
 *   node --env-file=.env.local scripts/seed-practice.mjs <clave>      # uno
 *   node --env-file=.env.local scripts/seed-practice.mjs --check      # solo valida
 *
 * Guía: docs/practica-voz.md
 */

import { existsSync, readFileSync } from "node:fs";
import { scenarios, imageAlts } from "./practice-scenarios.mjs";

const REQUIRED = [
  "key", "title", "brief", "mission", "characterName", "characterRole",
  "voiceId", "firstMessage", "persona", "scenario", "learnerGoal", "behaviour",
];

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const only = args.find((a) => !a.startsWith("--"));

const errors = [];
const keys = new Set();
for (const { lessonId, practice: p } of scenarios) {
  const where = `${lessonId} (${p.key ?? "sin clave"})`;
  for (const f of REQUIRED) if (!p[f] || !String(p[f]).trim()) errors.push(`${where}: falta ${f}`);
  if (p.key && !/^[a-z0-9-]+$/.test(p.key)) errors.push(`${where}: la clave solo admite a-z, 0-9 y guiones`);
  if (keys.has(p.key)) errors.push(`${where}: clave repetida`);
  keys.add(p.key);
  if (!Array.isArray(p.mustUse) || p.mustUse.length < 2 || p.mustUse.length > 5) errors.push(`${where}: mustUse debe tener de 2 a 5 frases`);
  if (!Array.isArray(p.skillCriteria) || p.skillCriteria.length < 4 || p.skillCriteria.length > 7) errors.push(`${where}: skillCriteria debe tener de 4 a 7 criterios`);
}
if (errors.length) {
  console.error("❌ Escenarios con errores:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log(`✓ ${scenarios.length} escenarios válidos`);
if (checkOnly) process.exit(0);

const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset, SANITY_TOKEN: token } = process.env;
if (!projectId || !dataset || !token) {
  console.error("❌ Faltan NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET o SANITY_TOKEN en .env.local");
  process.exit(1);
}

const selected = only ? scenarios.filter((s) => s.practice.key === only) : scenarios;
if (!selected.length) {
  console.error(`❌ No hay ningún escenario con la clave «${only}»`);
  process.exit(1);
}

// Imagen de la escena (opcional): scripts/practice-images/<clave>.jpg.
// Sanity reutiliza el asset si el archivo no ha cambiado (mismo hash).
async function uploadImage(key) {
  const file = new URL(`./practice-images/${key}.jpg`, import.meta.url);
  if (!existsSync(file)) return null;
  const up = await fetch(
    `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${dataset}?filename=${key}.jpg`,
    { method: "POST", headers: { "Content-Type": "image/jpeg", Authorization: `Bearer ${token}` }, body: readFileSync(file) },
  );
  const uj = await up.json();
  if (!up.ok) throw new Error(`imagen ${key}: ${up.status} ${JSON.stringify(uj)}`);
  return {
    _type: "image",
    asset: { _type: "reference", _ref: uj.document._id },
    ...(imageAlts[key] && { alt: imageAlts[key] }),
  };
}

const mutations = [];
for (const { lessonId, practice } of selected) {
  const image = await uploadImage(practice.key);
  mutations.push({
    patch: { id: lessonId, set: { practice: { enabled: true, ...practice, ...(image && { image }) } } },
  });
}

const r = await fetch(`https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ mutations }),
});
const j = await r.json();
if (!r.ok) {
  console.error("❌", r.status, JSON.stringify(j));
  process.exit(1);
}
const missing = (j.results ?? []).filter((x) => x.operation === "none");
for (const { lessonId, practice } of selected) {
  const img = mutations.find((m) => m.patch.id === lessonId)?.patch.set.practice.image ? " 🖼" : "";
  console.log(`✓ ${practice.key} → ${lessonId}${img}`);
}
if (missing.length) console.warn(`⚠️ ${missing.length} lecciones no existían y no se cambiaron`);
