/**
 * Rellena el campo `celebrities` de los cursos ya creados a mano
 * (los nuevos lo reciben del pipeline generate-course.mjs).
 * Uso: SANITY_TOKEN=... node scripts/backfill-celebrities.mjs
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

const DATA = {
  "ingles-para-finanzas": [
    { name: "Warren Buffett", role: "CEO de Berkshire Hathaway", knownFor: "El inversor más exitoso de la historia, el 'Oráculo de Omaha'.", whyRelevant: "Su value investing y su forma clara y directa de explicar finanzas son un modelo de inglés financiero real." },
    { name: "Ray Dalio", role: "Fundador de Bridgewater Associates", knownFor: "El mayor hedge fund del mundo; autor de 'Principles'.", whyRelevant: "Su modelo de la 'máquina económica' enseña a explicar ciclos y riesgo con vocabulario preciso." },
    { name: "Benjamin Graham", role: "Economista e inversor", knownFor: "Padre del value investing; autor de 'The Intelligent Investor'.", whyRelevant: "Acuñó conceptos como 'margin of safety' y 'Mr. Market', pilares del léxico financiero en inglés." },
    { name: "Suze Orman", role: "Asesora financiera y presentadora", knownFor: "Referente mundial en finanzas personales.", whyRelevant: "Domina el inglés accesible para explicar dinero y decisiones financieras a cualquier público." },
    { name: "Jamie Dimon", role: "CEO de JPMorgan Chase", knownFor: "Lidera uno de los mayores bancos del mundo.", whyRelevant: "Sus cartas a accionistas son un modelo de inglés de banca, regulación y gestión de riesgo." },
  ],
  "ingles-para-ventas": [
    { name: "Jeb Blount", role: "Autor y formador de ventas", knownFor: "Autor de 'Fanatical Prospecting'.", whyRelevant: "Referente en prospección y llamadas en frío: el inglés del primer contacto." },
    { name: "Grant Cardone", role: "Empresario y formador", knownFor: "Autor de 'Sell or Be Sold'.", whyRelevant: "Lenguaje directo y de alta energía para el cierre de ventas." },
    { name: "Aaron Ross", role: "Autor y consultor", knownFor: "Autor de 'Predictable Revenue'; diseñó el modelo de ventas outbound de Salesforce.", whyRelevant: "Vocabulario del B2B y la venta outbound moderna." },
    { name: "Neil Rackham", role: "Investigador de ventas", knownFor: "Creador del método SPIN Selling.", whyRelevant: "Su marco define las preguntas de descubrimiento en inglés." },
    { name: "Chris Voss", role: "Ex negociador jefe del FBI", knownFor: "Autor de 'Never Split the Difference'.", whyRelevant: "Técnicas y frases de negociación de alto nivel aplicables a ventas." },
  ],
  "ingles-para-seo": [
    { name: "Rand Fishkin", role: "Cofundador de Moz y SparkToro", knownFor: "Popularizó el SEO accesible con 'Whiteboard Friday'.", whyRelevant: "Acuñó conceptos como '10x content' y el enfoque en search intent." },
    { name: "Brian Dean", role: "Fundador de Backlinko", knownFor: "Creador de la 'Skyscraper Technique'.", whyRelevant: "Su blog es la mejor fuente del inglés informal del link building." },
    { name: "Aleyda Solis", role: "Consultora de SEO internacional", knownFor: "Creadora de la guía gratuita LearningSEO.io.", whyRelevant: "Bilingüe y referencia en SEO técnico e internacional (hreflang, geotargeting)." },
    { name: "Lily Ray", role: "VP de SEO en Amsive", knownFor: "Analista de core updates y experta en E-E-A-T.", whyRelevant: "Define el vocabulario de calidad de contenido y actualizaciones de algoritmo." },
    { name: "Barry Schwartz", role: "Editor de Search Engine Roundtable", knownFor: "Casi 20 años cubriendo noticias de SEO a diario.", whyRelevant: "El inglés de las novedades y los cambios de Google en tiempo real." },
  ],
  "ingles-para-consultoria": [
    { name: "Marvin Bower", role: "Padre de la consultoría moderna", knownFor: "Dio forma a McKinsey & Company y a su ética profesional.", whyRelevant: "Definió el registro, los estándares y el lenguaje del consultor." },
    { name: "Barbara Minto", role: "Ex-McKinsey, pionera de la comunicación", knownFor: "Creadora del 'Pyramid Principle'.", whyRelevant: "Enseña a estructurar la comunicación answer-first en inglés." },
    { name: "Peter Drucker", role: "Padre del management moderno", knownFor: "El pensador de gestión más influyente del siglo XX.", whyRelevant: "Fuente del vocabulario estratégico y de management." },
    { name: "Tom Peters", role: "Consultor y autor", knownFor: "Coautor de 'In Search of Excellence'.", whyRelevant: "El lenguaje de la excelencia operativa y la gestión del cambio." },
    { name: "Clayton Christensen", role: "Profesor de Harvard Business School", knownFor: "Teoría de la innovación disruptiva.", whyRelevant: "Marco y léxico de estrategia e innovación en inglés." },
  ],
};

async function run() {
  console.log("🎭 Rellenando celebridades de los cursos completos...\n");
  for (const [slug, celebs] of Object.entries(DATA)) {
    const id = await client.fetch(`*[_type=="course" && slug.current==$slug][0]._id`, { slug });
    if (!id) {
      console.log(`   ⏭  ${slug} — no encontrado`);
      continue;
    }
    await client
      .patch(id)
      .set({
        celebrities: celebs.map((c, i) => ({ _key: `celeb-${i}`, _type: "celebrity", ...c })),
      })
      .commit();
    console.log(`   ✅ ${slug}: ${celebs.map((c) => c.name).join(", ")}`);
  }
  console.log("\n✅ Backfill completado");
}

run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
