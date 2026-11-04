import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "lesson",
  title: "Lección",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "media", title: "Multimedia" },
    { name: "exercises", title: "Ejercicios" },
    { name: "practice", title: "Práctica por voz" },
    { name: "ai", title: "Tutor IA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── SEO ──
    defineField({
      name: "title",
      title: "Título SEO",
      type: "string",
      group: "seo",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "seo",
      options: { source: "h1", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta descripción",
      type: "text",
      rows: 2,
      group: "seo",
      validation: (r) => r.max(160),
    }),

    // ── CONTENIDO ──
    defineField({
      name: "h1",
      title: "Título principal (H1)",
      type: "string",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción corta",
      type: "text",
      rows: 2,
      group: "content",
    }),
    defineField({
      name: "course",
      title: "Curso",
      type: "reference",
      to: [{ type: "course" }],
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "section",
      title: "Sección",
      type: "string",
      group: "content",
      description: "Grupo temático dentro del curso (ej: Cold Outreach, Demos)",
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      group: "content",
      description: "Orden de la lección dentro del curso (1 = primera)",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "duration",
      title: "Duración",
      type: "string",
      group: "content",
      description: "Ej: 15 min, 20 min",
    }),
    defineField({
      name: "free",
      title: "Gratuita",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "published",
      title: "Publicada",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "intro",
      title: "Introducción",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Contenido principal",
      type: "array",
      group: "content",
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
            annotations: [
              {
                name: "link",
                title: "Enlace",
                type: "object",
                fields: [{ name: "href", title: "URL", type: "url" }],
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
      name: "vocabulary",
      title: "Vocabulario",
      type: "array",
      group: "content",
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
      group: "content",
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

    // ── MULTIMEDIA ──
    defineField({
      name: "chapters",
      title: "Capítulos en vídeo",
      type: "array",
      group: "media",
      description:
        "La clase en vídeo, partida en capítulos. Se ven en orden en la web y en la app; al acabar uno empieza el siguiente.",
      of: [
        defineArrayMember({
          type: "object",
          name: "chapter",
          title: "Capítulo",
          fields: [
            defineField({
              name: "title",
              title: "Título",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "platform",
              title: "Plataforma",
              type: "string",
              initialValue: "vimeo",
              options: {
                list: [
                  { title: "Vimeo", value: "vimeo" },
                  { title: "YouTube", value: "youtube" },
                ],
                layout: "radio",
              },
            }),
            defineField({
              name: "url",
              title: "URL del reproductor",
              type: "url",
              description: "Vimeo: https://player.vimeo.com/video/ID?h=HASH",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "durationSeconds",
              title: "Duración (segundos)",
              type: "number",
            }),
            defineField({
              name: "thumbnail",
              title: "Miniatura (URL)",
              type: "url",
            }),
            defineField({
              name: "summary",
              title: "Qué se ve",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: { title: "title", seconds: "durationSeconds" },
            prepare: ({ title, seconds }) => ({
              title,
              subtitle: seconds
                ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
                : undefined,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "video",
      title: "Vídeo principal",
      type: "object",
      group: "media",
      fields: [
        defineField({
          name: "platform",
          title: "Plataforma",
          type: "string",
          options: {
            list: [
              { title: "YouTube", value: "youtube" },
              { title: "Vimeo", value: "vimeo" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "url",
          title: "URL del vídeo",
          type: "url",
        }),
        defineField({
          name: "title",
          title: "Título del vídeo",
          type: "string",
        }),
        defineField({
          name: "duration",
          title: "Duración (ej: 12:30)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "additionalVideos",
      title: "Vídeos adicionales",
      type: "array",
      group: "media",
      description: "Vídeos complementarios de la lección",
      of: [
        defineArrayMember({
          type: "object",
          name: "videoItem",
          title: "Vídeo",
          fields: [
            { name: "platform", title: "Plataforma", type: "string", options: { list: [{ title: "YouTube", value: "youtube" }, { title: "Vimeo", value: "vimeo" }], layout: "radio" } },
            { name: "url", title: "URL", type: "url" },
            { name: "title", title: "Título", type: "string" },
            { name: "duration", title: "Duración", type: "string" },
            { name: "description", title: "Descripción", type: "text", rows: 2 },
          ],
          preview: {
            select: { title: "title", subtitle: "platform" },
          },
        }),
      ],
    }),
    defineField({
      name: "audio",
      title: "Audio principal",
      type: "object",
      group: "media",
      description: "Audio de la lección (pronunciación, diálogos, listening)",
      fields: [
        defineField({
          name: "file",
          title: "Archivo de audio",
          type: "file",
          options: { accept: "audio/*" },
        }),
        defineField({
          name: "externalUrl",
          title: "O URL externa (Spotify, SoundCloud, etc.)",
          type: "url",
        }),
        defineField({
          name: "title",
          title: "Título",
          type: "string",
        }),
        defineField({
          name: "duration",
          title: "Duración (ej: 5:30)",
          type: "string",
        }),
        defineField({
          name: "transcript",
          title: "Transcripción",
          type: "text",
          rows: 6,
          description: "Transcripción del audio para accesibilidad y SEO",
        }),
      ],
    }),
    defineField({
      name: "additionalAudios",
      title: "Audios adicionales",
      type: "array",
      group: "media",
      description: "Diálogos, ejercicios de listening, pronunciación",
      of: [
        defineArrayMember({
          type: "object",
          name: "audioItem",
          title: "Audio",
          fields: [
            { name: "file", title: "Archivo", type: "file", options: { accept: "audio/*" } },
            { name: "externalUrl", title: "O URL externa", type: "url" },
            { name: "title", title: "Título", type: "string" },
            { name: "duration", title: "Duración", type: "string" },
            { name: "transcript", title: "Transcripción", type: "text", rows: 4 },
            { name: "type", title: "Tipo", type: "string", options: { list: [{ title: "Diálogo", value: "dialogue" }, { title: "Pronunciación", value: "pronunciation" }, { title: "Listening", value: "listening" }, { title: "Conversación real", value: "real-conversation" }] } },
          ],
          preview: {
            select: { title: "title", subtitle: "type" },
          },
        }),
      ],
    }),

    // ── EJERCICIOS ──
    defineField({
      name: "exercise",
      title: "Ejercicio de test",
      type: "object",
      group: "exercises",
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

    // ── PRÁCTICA POR VOZ ──
    // Una llamada de máximo 5 minutos con un personaje (agente de
    // ElevenLabs «aprendoingles · Roleplay de lección»). Los campos en
    // español los ve el alumno; los de inglés solo los usa el agente y
    // el corrector. Ver docs/practica-voz.md.
    defineField({
      name: "practice",
      title: "Práctica por voz",
      type: "object",
      group: "practice",
      fields: [
        defineField({ name: "enabled", title: "Activada", type: "boolean", initialValue: false }),
        defineField({
          name: "key",
          title: "Clave del escenario",
          type: "string",
          description: "Identificador estable (ej. cold-call-logistics). No cambiarlo: agrupa el histórico de notas.",
          validation: (r) => r.regex(/^[a-z0-9-]+$/),
        }),
        defineField({ name: "title", title: "Título (ES)", type: "string", description: "Ej: Llama en frío a un director de operaciones" }),
        defineField({ name: "brief", title: "Situación para el alumno (ES)", type: "text", rows: 3 }),
        defineField({
          name: "image",
          title: "Imagen de la escena",
          type: "image",
          description: "Ilustración 16:9 de la situación, sin texto. Se ve encima de la situación.",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Texto alternativo (ES)", type: "string" })],
        }),
        defineField({ name: "mission", title: "Tu misión (ES)", type: "string", description: "El objetivo que ve el alumno. Ej: Consigue una reunión de 20 minutos." }),
        defineField({
          name: "mustUse",
          title: "Expresiones a usar (EN)",
          type: "array",
          of: [{ type: "string" }],
          description: "3 o 4 frases de la lección. El corrector comprueba si las usó.",
        }),
        defineField({ name: "characterName", title: "Nombre del personaje", type: "string" }),
        defineField({ name: "characterRole", title: "Cargo del personaje (ES)", type: "string" }),
        defineField({ name: "voiceId", title: "Voz de ElevenLabs (voice_id)", type: "string" }),
        defineField({ name: "firstMessage", title: "Primera frase del personaje (EN)", type: "string" }),
        defineField({ name: "persona", title: "Personaje (EN, para el agente)", type: "text", rows: 4 }),
        defineField({ name: "scenario", title: "Situación (EN, para el agente)", type: "text", rows: 3 }),
        defineField({ name: "learnerGoal", title: "Objetivo del alumno (EN, para el agente)", type: "text", rows: 2 }),
        defineField({
          name: "behaviour",
          title: "Cómo reacciona (EN, para el agente)",
          type: "text",
          rows: 6,
          description: "Objeciones, qué le hace abrirse, cuándo acepta y cuándo cuelga.",
        }),
        defineField({
          name: "skillCriteria",
          title: "Criterios de la habilidad (EN, para el corrector)",
          type: "array",
          of: [{ type: "string" }],
          description: "Qué hace bien una llamada de este tipo. 4-6 criterios.",
        }),
      ],
    }),

    // ── TUTOR IA ──
    defineField({
      name: "aiTutor",
      title: "Configuración del Tutor IA",
      type: "object",
      group: "ai",
      description: "Configura cómo se comporta el tutor IA en esta lección",
      fields: [
        defineField({
          name: "enabled",
          title: "Tutor IA activado",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "persona",
          title: "Rol del tutor",
          type: "string",
          description: "Ej: 'Sales coach americano', 'Recruiter de Big Four', 'Doctor de urgencias'",
        }),
        defineField({
          name: "context",
          title: "Contexto de la lección",
          type: "text",
          rows: 4,
          description: "Información que el tutor usa para contextualizar sus respuestas (tema, vocabulario clave, nivel, situación)",
        }),
        defineField({
          name: "objectives",
          title: "Objetivos de aprendizaje",
          type: "array",
          of: [{ type: "string" }],
          description: "Lo que el alumno debería conseguir con ayuda del tutor",
        }),
        defineField({
          name: "examplePrompts",
          title: "Preguntas sugeridas para el alumno",
          type: "array",
          of: [{ type: "string" }],
          description: "Aparecen como botones para que el alumno empiece la conversación",
        }),
        defineField({
          name: "scenarioMode",
          title: "Modo roleplay",
          type: "boolean",
          initialValue: false,
          description: "Activa simulación de escenarios reales (ej: cold call, negociación, entrevista)",
        }),
        defineField({
          name: "scenarioSetup",
          title: "Setup del escenario",
          type: "text",
          rows: 4,
          description: "Descripción de la situación para el roleplay (solo si modo roleplay está activado)",
          hidden: ({ parent }) => !parent?.scenarioMode,
        }),
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
