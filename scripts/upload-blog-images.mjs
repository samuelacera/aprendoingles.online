/**
 * Sube las imágenes destacadas de los artículos del blog a Sanity y las
 * enlaza al campo featuredImage de cada post.
 *
 * Coloca las imágenes en IMAGES_DIR nombradas con el slug del artículo:
 *   expresiones-reuniones-ingles.jpg
 *   brief-creativo-ingles.png
 *   code-reviews-ingles.webp
 *
 * Uso: SANITY_TOKEN=<token> node scripts/upload-blog-images.mjs
 */

import { createClient } from "@sanity/client";
import { readdirSync, readFileSync } from "node:fs";
import { join, extname, basename } from "node:path";

const IMAGES_DIR = "/Users/samuel/Documents/MCP - Claude/aprendoingles.online/imagenes";

const SLUGS = [
  "expresiones-reuniones-ingles",
  "brief-creativo-ingles",
  "code-reviews-ingles",
];

const VALID_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

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

function findImageForSlug(files, slug) {
  return files.find((f) => {
    const ext = extname(f).toLowerCase();
    return basename(f, ext) === slug && VALID_EXT.includes(ext);
  });
}

async function run() {
  let files;
  try {
    files = readdirSync(IMAGES_DIR);
  } catch {
    console.error(`❌ No se pudo leer la carpeta:\n   ${IMAGES_DIR}`);
    process.exit(1);
  }

  console.log("🖼  Subiendo imágenes destacadas del blog...\n");
  let done = 0;

  for (const slug of SLUGS) {
    const file = findImageForSlug(files, slug);
    if (!file) {
      console.log(`   ⏭  ${slug} — sin imagen en la carpeta, lo salto`);
      continue;
    }

    const filePath = join(IMAGES_DIR, file);
    const buffer = readFileSync(filePath);

    const asset = await client.assets.upload("image", buffer, { filename: file });

    await client
      .patch(`blogPost-${slug}`)
      .set({
        featuredImage: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        },
      })
      .commit();

    console.log(`   ✅ ${slug}  ←  ${file}`);
    done++;
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ ${done} imágenes subidas y enlazadas`);
  console.log(`═══════════════════════════════════════`);
}

run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
