import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { projectId, dataset } from "./src/sanity/env";

export default defineConfig({
  name: "aprendoingles",
  title: "aprendoingles.online",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.listItem()
              .title("Cursos")
              .schemaType("course")
              .child(S.documentTypeList("course").title("Cursos")),
            S.listItem()
              .title("Lecciones")
              .schemaType("lesson")
              .child(S.documentTypeList("lesson").title("Lecciones")),
            S.divider(),
            S.listItem()
              .title("Blog")
              .schemaType("blogPost")
              .child(S.documentTypeList("blogPost").title("Artículos")),
            S.listItem()
              .title("Guías temáticas")
              .schemaType("guide")
              .child(S.documentTypeList("guide").title("Guías")),
            S.divider(),
            S.listItem()
              .title("Categorías")
              .schemaType("category")
              .child(S.documentTypeList("category").title("Categorías")),
            S.listItem()
              .title("Autores")
              .schemaType("author")
              .child(S.documentTypeList("author").title("Autores")),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
