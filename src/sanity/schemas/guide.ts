import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "guide",
  title: "Guía temática",
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
      name: "excerpt",
      title: "Extracto",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "featuredImage",
      title: "Imagen destacada",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "relatedCourses",
      title: "Cursos relacionados",
      type: "array",
      of: [{ type: "reference", to: [{ type: "course" }] }],
    }),
    defineField({
      name: "body",
      title: "Contenido",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Cita", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Cursiva", value: "em" },
              { title: "Código", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                title: "Enlace",
                type: "object",
                fields: [
                  { name: "href", title: "URL", type: "url" },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Texto alternativo", type: "string" },
            { name: "caption", title: "Pie de foto", type: "string" },
          ],
        }),
      ],
    }),
    defineField({
      name: "published",
      title: "Publicada",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
    }),
  ],
  orderings: [
    { title: "Fecha", name: "date", by: [{ field: "publishedAt", direction: "desc" }] },
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
