import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "course",
  title: "Curso",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título SEO",
      type: "string",
      description: "Aparece en la pestaña del navegador y en Google",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "h1",
      title: "Título principal (H1)",
      type: "string",
      description: "El título grande que se ve en la página",
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
      description: "Texto que aparece en Google debajo del título (máx 160 caracteres)",
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "description",
      title: "Descripción corta",
      type: "text",
      rows: 2,
      description: "Se muestra en las tarjetas de listado de cursos",
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "price",
      title: "Precio (€)",
      type: "number",
      description: "Dejar en 0 o vacío para curso gratuito",
    }),
    defineField({
      name: "published",
      title: "Publicado",
      type: "boolean",
      initialValue: false,
      description: "Solo los cursos publicados aparecen en la web",
    }),
    defineField({
      name: "featuredImage",
      title: "Imagen destacada",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "celebrities",
      title: "Celebridades / referentes",
      type: "array",
      description: "Referentes de habla inglesa cuyo conocimiento inspira el curso (autogenerado por el pipeline).",
      of: [
        defineArrayMember({
          type: "object",
          name: "celebrity",
          fields: [
            { name: "name", title: "Nombre", type: "string" },
            { name: "role", title: "Rol / cargo", type: "string" },
            { name: "knownFor", title: "Conocido por", type: "text", rows: 2 },
            { name: "whyRelevant", title: "Por qué en este curso", type: "text", rows: 2 },
          ],
          preview: { select: { title: "name", subtitle: "role" } },
        }),
      ],
    }),
  ],
  orderings: [
    { title: "Título", name: "title", by: [{ field: "title", direction: "asc" }] },
  ],
  preview: {
    select: {
      title: "h1",
      subtitle: "category.name",
      published: "published",
      media: "featuredImage",
    },
    prepare({ title, subtitle, published, media }) {
      return {
        title: `${published ? "" : "🔒 "}${title}`,
        subtitle,
        media,
      };
    },
  },
});
