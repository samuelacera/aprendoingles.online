import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "lesson",
  title: "Lección",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título SEO",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "h1",
      title: "Título principal (H1)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "h1", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta descripción",
      type: "text",
      rows: 2,
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "description",
      title: "Descripción corta",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "course",
      title: "Curso",
      type: "reference",
      to: [{ type: "course" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "section",
      title: "Sección",
      type: "string",
      description: "Grupo temático dentro del curso (ej: Cold Outreach, Demos)",
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Orden de la lección dentro del curso (1 = primera)",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "duration",
      title: "Duración",
      type: "string",
      description: "Ej: 15 min, 20 min",
    }),
    defineField({
      name: "free",
      title: "Gratuita",
      type: "boolean",
      initialValue: false,
      description: "Las lecciones gratuitas se muestran sin bloqueo de email",
    }),
    defineField({
      name: "published",
      title: "Publicada",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "videoUrl",
      title: "Vídeo (YouTube o Vimeo)",
      type: "url",
      description: "URL del vídeo de la lección (opcional)",
    }),
    defineField({
      name: "intro",
      title: "Introducción",
      type: "text",
      rows: 4,
      description: "Texto introductorio de la lección",
    }),
    defineField({
      name: "body",
      title: "Contenido principal",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Cita", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Cursiva", value: "em" },
              { title: "Código", value: "code" },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "vocabulary",
      title: "Vocabulario",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "vocabItem",
          title: "Término",
          fields: [
            { name: "term", title: "Término en inglés", type: "string" },
            { name: "definition", title: "Definición en español", type: "text", rows: 2 },
            { name: "example", title: "Ejemplo de uso", type: "text", rows: 2 },
          ],
          preview: {
            select: { title: "term", subtitle: "definition" },
          },
        }),
      ],
    }),
    defineField({
      name: "keyPhrases",
      title: "Frases clave",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "phraseItem",
          title: "Frase",
          fields: [
            { name: "phrase", title: "Frase en inglés", type: "text", rows: 2 },
            { name: "translation", title: "Traducción al español", type: "text", rows: 2 },
            { name: "context", title: "Contexto de uso", type: "text", rows: 2 },
          ],
          preview: {
            select: { title: "phrase", subtitle: "translation" },
          },
        }),
      ],
    }),
    defineField({
      name: "exercise",
      title: "Ejercicio",
      type: "object",
      fields: [
        { name: "instruction", title: "Instrucción", type: "string" },
        {
          name: "questions",
          title: "Preguntas",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "questionItem",
              title: "Pregunta",
              fields: [
                { name: "question", title: "Pregunta", type: "text", rows: 2 },
                {
                  name: "options",
                  title: "Opciones",
                  type: "array",
                  of: [{ type: "string" }],
                  validation: (r) => r.min(2).max(4),
                },
                {
                  name: "correct",
                  title: "Respuesta correcta (índice: 0, 1, 2...)",
                  type: "number",
                },
              ],
              preview: {
                select: { title: "question" },
              },
            }),
          ],
        },
      ],
    }),
  ],
  orderings: [
    { title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: {
      title: "h1",
      subtitle: "course.h1",
      free: "free",
      published: "published",
    },
    prepare({ title, subtitle, free, published }) {
      const icons = `${published ? "" : "🔒"}${free ? "🆓" : ""}`;
      return {
        title: `${icons} ${title}`.trim(),
        subtitle,
      };
    },
  },
});
