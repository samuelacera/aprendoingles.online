# Cursos privados

Un curso que solo ven unas cuentas concretas (por ejemplo, un curso hecho a medida para una persona o una empresa).

## Cómo funciona
- El dataset de Sanity es público: cualquiera puede consultarlo sin token. Por eso un curso privado no se «despublica», sino que sus documentos van bajo la ruta de ID `private.`, que Sanity solo devuelve a peticiones con token:
  - curso: `_id = "private.course-<slug>"`, con `allowedEmails` (lista de emails con acceso);
  - lecciones: `_id = "private.lesson-…"`, con `course → private.course-<slug>`.
- El **slug** empieza siempre por `privado-`. `src/proxy.ts` sirve `/cursos/privado-…` desde `app/privado/`, que es dinámico y puede leer la sesión (las páginas públicas de curso son estáticas).
- El cliente público nunca ve esos documentos: catálogo, sitemap, categorías y API pública los dejan fuera sin filtros extra.
- `src/sanity/private.ts` lee con token solo si el slug es privado **y** el email de quien mira está en `allowedEmails`. Las funciones de `sanity/queries.ts` (curso, lecciones, lección), `lib/practice.ts` (escenario de la llamada) y `lib/access.ts` (acceso completo para esas cuentas) pasan por ahí.
- Las páginas privadas llevan `noindex`.

## Requisitos
- `SANITY_READ_TOKEN` en el servidor (token «Viewer» de Sanity: manage.sanity.io → proyecto → API → Tokens). Sin él, los cursos privados dan 404 (falla cerrado). En local vale también `SANITY_TOKEN`.

## Crear uno
1. El contenido **no** va en este repo (es público): guárdalo fuera, con su propio script de subida que cree los documentos con IDs `private.…`. Ejemplo: `~/MiClaude/isyfuCLAUDE/LAB/aprendoingles/curso-ceo-isyfu/subir.mjs`.
2. Slug `privado-<nombre>` y `allowedEmails` en el curso.
3. Comprueba que sin token no se ve: `count(*[_id in path("private.**")])` contra la API pública debe dar 0.
