import { defineType, defineField } from "sanity";

export default defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "color",
      title: "Color (clase Tailwind)",
      type: "string",
      description: "Ej: bg-blue-600, bg-purple-600",
    }),
    defineField({
      name: "influences",
      title: "Influencias",
      description: "Personas influyentes del sector (aparecen como claim en los cursos)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Orden en el que aparece en la web (1 = primero)",
    }),
  ],
  orderings: [
    { title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "color" },
  },
});
