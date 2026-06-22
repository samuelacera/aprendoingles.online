export interface Lesson {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  description: string;
  duration: string;
  free: boolean;
  content: {
    intro: string;
    vocabulary: { term: string; definition: string; example: string }[];
    keyPhrases: { phrase: string; translation: string; context: string }[];
    exercise: {
      instruction: string;
      questions: { question: string; options: string[]; correct: number }[];
    };
  };
}

export interface Module {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  description: string;
  lessons: Lesson[];
}

export interface Curriculum {
  courseSlug: string;
  modules: Module[];
}

const placeholderContent = (topic: string): Lesson["content"] => ({
  intro: `En esta lección aprenderás el vocabulario y las expresiones esenciales de ${topic} en inglés. Contenido en desarrollo — próximamente disponible con ejemplos reales, diálogos y ejercicios interactivos.`,
  vocabulary: [
    { term: "Placeholder term 1", definition: "Definición pendiente", example: "Example sentence pending." },
    { term: "Placeholder term 2", definition: "Definición pendiente", example: "Example sentence pending." },
    { term: "Placeholder term 3", definition: "Definición pendiente", example: "Example sentence pending." },
    { term: "Placeholder term 4", definition: "Definición pendiente", example: "Example sentence pending." },
    { term: "Placeholder term 5", definition: "Definición pendiente", example: "Example sentence pending." },
  ],
  keyPhrases: [
    { phrase: "Placeholder phrase 1", translation: "Traducción pendiente", context: "Contexto pendiente" },
    { phrase: "Placeholder phrase 2", translation: "Traducción pendiente", context: "Contexto pendiente" },
    { phrase: "Placeholder phrase 3", translation: "Traducción pendiente", context: "Contexto pendiente" },
  ],
  exercise: {
    instruction: "Elige la opción correcta para completar cada frase.",
    questions: [
      { question: "Placeholder question 1: ___", options: ["Option A", "Option B", "Option C"], correct: 0 },
      { question: "Placeholder question 2: ___", options: ["Option A", "Option B", "Option C"], correct: 1 },
      { question: "Placeholder question 3: ___", options: ["Option A", "Option B", "Option C"], correct: 2 },
    ],
  },
});

export const curricula: Record<string, Curriculum> = {
  "ingles-para-ventas": {
    courseSlug: "ingles-para-ventas",
    modules: [
      {
        slug: "modulo-1-cold-outreach",
        title: "Cold Outreach: emails y llamadas en frío en inglés | aprendoingles.online",
        h1: "Módulo 1: Cold Outreach — Emails y llamadas en frío en inglés",
        metaDescription: "Aprende a escribir cold emails y hacer llamadas en frío en inglés. Vocabulario, expresiones y técnicas para el primer contacto comercial.",
        description: "Domina el primer contacto comercial en inglés: cold emails que generan respuestas, llamadas en frío efectivas y cómo superar gatekeepers.",
        lessons: [
          {
            slug: "leccion-1-vocabulario-cold-email",
            title: "Vocabulario esencial del cold email en inglés | aprendoingles.online",
            h1: "Lección 1: Vocabulario esencial del cold email en inglés",
            metaDescription: "Aprende el vocabulario clave para escribir cold emails en inglés: subject lines, opening lines, CTAs y follow-ups que convierten.",
            description: "Subject lines, opening lines, CTAs y follow-ups. El vocabulario que necesitas para escribir cold emails en inglés que generan respuestas.",
            duration: "15 min",
            free: true,
            content: placeholderContent("cold emails en ventas"),
          },
          {
            slug: "leccion-2-estructurar-cold-call",
            title: "Cómo estructurar un cold call en inglés | aprendoingles.online",
            h1: "Lección 2: Cómo estructurar un cold call en inglés",
            metaDescription: "Estructura paso a paso para hacer cold calls en inglés: apertura, pitch, manejo de objeciones iniciales y cierre de siguiente paso.",
            description: "Apertura, pitch, manejo de objeciones y cierre de siguiente paso. La estructura completa de una cold call en inglés.",
            duration: "20 min",
            free: false,
            content: placeholderContent("cold calls en ventas"),
          },
          {
            slug: "leccion-3-superar-gatekeepers",
            title: "Cómo superar gatekeepers en inglés | aprendoingles.online",
            h1: "Lección 3: Cómo superar gatekeepers en llamadas en inglés",
            metaDescription: "Técnicas y frases para superar gatekeepers (recepcionistas, asistentes) en llamadas comerciales en inglés y llegar al decisor.",
            description: "Técnicas y frases para pasar recepcionistas y asistentes, y llegar al decisor. Supera gatekeepers en inglés con naturalidad.",
            duration: "15 min",
            free: false,
            content: placeholderContent("superar gatekeepers en ventas"),
          },
          {
            slug: "leccion-4-follow-up-emails",
            title: "Follow-up emails en ventas en inglés | aprendoingles.online",
            h1: "Lección 4: Cómo escribir follow-up emails de ventas en inglés",
            metaDescription: "Aprende a escribir follow-up emails efectivos en inglés: timing, tono, estructura y plantillas para cada situación comercial.",
            description: "Timing, tono, estructura y plantillas. Escribe follow-ups en inglés que mantienen la conversación viva sin resultar insistente.",
            duration: "15 min",
            free: false,
            content: placeholderContent("follow-up emails en ventas"),
          },
        ],
      },
      {
        slug: "modulo-2-discovery-calls",
        title: "Discovery Calls: preguntas de descubrimiento en inglés | aprendoingles.online",
        h1: "Módulo 2: Discovery Calls — Preguntas de descubrimiento en inglés",
        metaDescription: "Domina las discovery calls en inglés: frameworks SPIN y BANT, preguntas abiertas, escucha activa y cómo cualificar oportunidades.",
        description: "Cualifica oportunidades en inglés: frameworks de preguntas (SPIN, BANT), escucha activa y cómo entender las necesidades reales del cliente.",
        lessons: [
          {
            slug: "leccion-1-frameworks-spin-bant",
            title: "Frameworks SPIN y BANT en inglés para ventas | aprendoingles.online",
            h1: "Lección 1: Frameworks SPIN y BANT en inglés",
            metaDescription: "Aprende a usar los frameworks SPIN Selling y BANT en inglés: preguntas clave, vocabulario y cómo cualificar oportunidades comerciales.",
            description: "SPIN Selling y BANT en inglés: las preguntas clave para cualificar oportunidades y entender al cliente.",
            duration: "20 min",
            free: false,
            content: placeholderContent("frameworks de discovery en ventas"),
          },
          {
            slug: "leccion-2-escucha-activa",
            title: "Active listening en ventas en inglés | aprendoingles.online",
            h1: "Lección 2: Active listening — Escucha activa en ventas en inglés",
            metaDescription: "Técnicas de escucha activa en inglés para ventas: parafrasear, confirmar, profundizar y mostrar empatía con el cliente.",
            description: "Parafrasear, confirmar, profundizar y mostrar empatía. Las técnicas de escucha activa en inglés que cierran deals.",
            duration: "15 min",
            free: false,
            content: placeholderContent("escucha activa en ventas"),
          },
          {
            slug: "leccion-3-cualificar-oportunidades",
            title: "Cómo cualificar oportunidades en inglés | aprendoingles.online",
            h1: "Lección 3: Cómo cualificar oportunidades comerciales en inglés",
            metaDescription: "Aprende a cualificar leads y oportunidades en inglés: preguntas de presupuesto, timeline, autoridad y necesidad real.",
            description: "Budget, timeline, authority y need. Aprende a cualificar oportunidades en inglés para no perder el tiempo.",
            duration: "15 min",
            free: false,
            content: placeholderContent("cualificación de oportunidades"),
          },
        ],
      },
      {
        slug: "modulo-3-demos-presentaciones",
        title: "Demos y presentaciones de producto en inglés | aprendoingles.online",
        h1: "Módulo 3: Demos y presentaciones de producto en inglés",
        metaDescription: "Aprende a hacer demos y presentaciones de producto en inglés: estructura, storytelling, manejo de preguntas y cómo conectar features con beneficios.",
        description: "Estructura tu demo, conecta features con beneficios y maneja preguntas difíciles. Presenta tu producto en inglés con impacto.",
        lessons: [
          {
            slug: "leccion-1-estructura-demo",
            title: "Cómo estructurar una demo de producto en inglés | aprendoingles.online",
            h1: "Lección 1: Cómo estructurar una demo de producto en inglés",
            metaDescription: "Estructura paso a paso para demos en inglés: apertura, agenda, demostración del valor, manejo de Q&A y cierre con next steps.",
            description: "Apertura, agenda, demostración del valor, Q&A y next steps. La estructura que hace que tus demos en inglés conviertan.",
            duration: "20 min",
            free: false,
            content: placeholderContent("demos de producto en ventas"),
          },
          {
            slug: "leccion-2-features-vs-beneficios",
            title: "Conectar features con beneficios en inglés | aprendoingles.online",
            h1: "Lección 2: Cómo conectar features con beneficios en inglés",
            metaDescription: "Aprende a traducir características técnicas en beneficios para el cliente en inglés. Fórmulas, expresiones y ejemplos reales.",
            description: "Traduce características técnicas en beneficios reales. Las fórmulas y expresiones en inglés que venden.",
            duration: "15 min",
            free: false,
            content: placeholderContent("features vs beneficios"),
          },
          {
            slug: "leccion-3-manejar-preguntas",
            title: "Manejar preguntas difíciles en demos en inglés | aprendoingles.online",
            h1: "Lección 3: Cómo manejar preguntas difíciles en demos en inglés",
            metaDescription: "Técnicas para responder preguntas difíciles durante demos en inglés: ganar tiempo, redirigir, ser honesto sin perder la venta.",
            description: "Ganar tiempo, redirigir y ser honesto sin perder la venta. Maneja preguntas comprometidas en inglés con profesionalidad.",
            duration: "15 min",
            free: false,
            content: placeholderContent("preguntas difíciles en demos"),
          },
        ],
      },
      {
        slug: "modulo-4-negociacion-objeciones",
        title: "Negociación y objeciones en ventas en inglés | aprendoingles.online",
        h1: "Módulo 4: Negociación y manejo de objeciones en inglés",
        metaDescription: "Domina la negociación comercial en inglés: manejo de objeciones de precio, timing y competencia, y técnicas de negociación avanzadas.",
        description: "Precio, timing, competencia. Aprende a manejar las objeciones más comunes en inglés y negociar condiciones con seguridad.",
        lessons: [
          {
            slug: "leccion-1-objeciones-precio",
            title: "Manejar objeciones de precio en inglés | aprendoingles.online",
            h1: "Lección 1: Cómo manejar objeciones de precio en inglés",
            metaDescription: "Aprende a responder a 'It's too expensive' y otras objeciones de precio en inglés. Técnicas, frases y reframes que funcionan.",
            description: "'It's too expensive', 'We don't have budget'. Aprende a responder objeciones de precio en inglés sin bajar el precio.",
            duration: "20 min",
            free: false,
            content: placeholderContent("objeciones de precio"),
          },
          {
            slug: "leccion-2-objeciones-comunes",
            title: "Objeciones comunes en ventas en inglés | aprendoingles.online",
            h1: "Lección 2: Objeciones comunes en ventas en inglés y cómo responderlas",
            metaDescription: "Las 10 objeciones más comunes en ventas B2B en inglés y las respuestas que mantienen la conversación abierta.",
            description: "'We're happy with our current solution', 'Send me an email'. Las objeciones más comunes y cómo responderlas.",
            duration: "20 min",
            free: false,
            content: placeholderContent("objeciones comunes en ventas"),
          },
          {
            slug: "leccion-3-negociar-condiciones",
            title: "Negociar condiciones comerciales en inglés | aprendoingles.online",
            h1: "Lección 3: Cómo negociar condiciones comerciales en inglés",
            metaDescription: "Técnicas de negociación comercial en inglés: descuentos, plazos, términos de contrato y cómo llegar a un acuerdo win-win.",
            description: "Descuentos, plazos, términos de contrato. Negocia condiciones en inglés y llega a acuerdos win-win.",
            duration: "15 min",
            free: false,
            content: placeholderContent("negociación de condiciones"),
          },
        ],
      },
      {
        slug: "modulo-5-closing-follow-ups",
        title: "Closing y follow-ups en ventas en inglés | aprendoingles.online",
        h1: "Módulo 5: Closing y follow-ups — Cerrar ventas en inglés",
        metaDescription: "Aprende a cerrar ventas en inglés: técnicas de closing, señales de compra, cómo pedir el cierre y follow-ups post-venta.",
        description: "Señales de compra, técnicas de cierre y seguimiento post-venta. Cierra deals en inglés con confianza.",
        lessons: [
          {
            slug: "leccion-1-senales-compra",
            title: "Señales de compra en inglés: cómo detectarlas | aprendoingles.online",
            h1: "Lección 1: Cómo detectar señales de compra en inglés",
            metaDescription: "Aprende a identificar buying signals en conversaciones en inglés: frases, preguntas y comportamientos que indican que el cliente está listo.",
            description: "Frases, preguntas y comportamientos que indican que el cliente está listo. Detecta buying signals en inglés.",
            duration: "15 min",
            free: false,
            content: placeholderContent("señales de compra"),
          },
          {
            slug: "leccion-2-tecnicas-closing",
            title: "Técnicas de closing en ventas en inglés | aprendoingles.online",
            h1: "Lección 2: Técnicas de closing en inglés que funcionan",
            metaDescription: "Las mejores técnicas de cierre de ventas en inglés: assumptive close, urgency close, summary close y cómo pedir la firma.",
            description: "Assumptive close, urgency close, summary close. Las técnicas para pedir el cierre en inglés de forma natural.",
            duration: "20 min",
            free: false,
            content: placeholderContent("técnicas de closing"),
          },
          {
            slug: "leccion-3-post-venta",
            title: "Follow-up post-venta en inglés | aprendoingles.online",
            h1: "Lección 3: Follow-up post-venta y onboarding en inglés",
            metaDescription: "Cómo hacer seguimiento post-venta en inglés: emails de bienvenida, onboarding del cliente, upselling y gestión de la relación.",
            description: "Emails de bienvenida, onboarding, upselling y gestión de la relación. El inglés del post-venta que fideliza.",
            duration: "15 min",
            free: false,
            content: placeholderContent("follow-up post-venta"),
          },
        ],
      },
    ],
  },
};

export function getCurriculum(courseSlug: string): Curriculum | undefined {
  return curricula[courseSlug];
}

export function getModule(courseSlug: string, moduleSlug: string): Module | undefined {
  return curricula[courseSlug]?.modules.find((m) => m.slug === moduleSlug);
}

export function getLesson(courseSlug: string, moduleSlug: string, lessonSlug: string): Lesson | undefined {
  return getModule(courseSlug, moduleSlug)?.lessons.find((l) => l.slug === lessonSlug);
}
