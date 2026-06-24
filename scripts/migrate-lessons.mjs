/**
 * Migración de lecciones del curso de ventas a Sanity.
 * Uso: SANITY_TOKEN=<token> node scripts/migrate-lessons.mjs
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

const COURSE_REF = "course-ingles-para-ventas";

const lessons = [
  {
    slug: "vocabulario-cold-email",
    section: "Cold Outreach",
    title: "Vocabulario del cold email en inglés | aprendoingles.online",
    h1: "Vocabulario esencial del cold email en inglés",
    metaDescription: "Aprende el vocabulario clave para escribir cold emails en inglés: subject lines, opening lines, CTAs y follow-ups que generan respuestas.",
    description: "Subject lines, opening lines, CTAs y follow-ups. El vocabulario que necesitas para escribir cold emails en inglés que generan respuestas.",
    duration: "15 min",
    free: true,
    order: 1,
    intro: "El cold email es la herramienta más usada en ventas B2B para abrir conversaciones con desconocidos. Un buen cold email en inglés no suena a plantilla: suena a alguien que ha investigado tu empresa y tiene algo relevante que decir. En esta lección vas a aprender el vocabulario que necesitas para escribir emails fríos que no acaben en la papelera.",
    vocabulary: [
      { term: "Subject line", definition: "Asunto del email. Es lo primero que lee el destinatario y decide si abre o ignora.", example: "Your subject line should be short, specific, and curiosity-driven." },
      { term: "Opening line", definition: "Primera frase del email. Debe ser personalizada, nunca genérica.", example: "A strong opening line references something specific about the prospect's company." },
      { term: "Value proposition", definition: "Propuesta de valor. Lo que ofreces y por qué le importa al destinatario.", example: "Our value proposition is simple: we cut your sales cycle by 30%." },
      { term: "Call to action (CTA)", definition: "La acción concreta que pides al destinatario. Debe ser fácil de responder.", example: "End every cold email with a clear CTA — don't leave them guessing what to do next." },
      { term: "Follow-up", definition: "Email de seguimiento que envías si no recibes respuesta.", example: "Most deals start after the second or third follow-up, not the first email." },
      { term: "Bounce rate", definition: "Porcentaje de emails que no llegan a la bandeja de entrada.", example: "If your bounce rate is above 5%, clean your email list before sending more." },
      { term: "Open rate", definition: "Porcentaje de destinatarios que abren tu email.", example: "A good open rate for cold emails is between 40% and 60%." },
      { term: "Reply rate", definition: "Porcentaje de destinatarios que responden.", example: "We improved our reply rate by personalizing the first line of every email." },
    ],
    keyPhrases: [
      { phrase: "I came across your company while researching...", translation: "Encontré tu empresa mientras investigaba...", context: "Opening line para mostrar que has investigado, no que envías emails en masa." },
      { phrase: "I noticed that you recently...", translation: "Me fijé en que recientemente...", context: "Para conectar con algo que el prospect ha hecho: una publicación, un cambio en su web, una contratación." },
      { phrase: "Would it make sense to set up a quick call?", translation: "¿Tendría sentido agendar una llamada rápida?", context: "CTA suave y profesional. No presiona, da opción a decir que no." },
      { phrase: "I'll keep this short.", translation: "Seré breve.", context: "Señal de respeto por el tiempo del destinatario. Úsala al principio del email." },
      { phrase: "Happy to share more details if this is relevant.", translation: "Encantado de compartir más detalles si esto es relevante.", context: "Cierre que deja la puerta abierta sin ser agresivo." },
      { phrase: "Just bumping this to the top of your inbox.", translation: "Solo muevo esto arriba en tu bandeja.", context: "Follow-up casual y no agresivo. Funciona bien en el segundo o tercer email." },
    ],
    exercise: {
      instruction: "Elige la opción correcta para completar cada frase de un cold email.",
      questions: [
        { question: "I ___ your recent article about AI in sales and thought we should connect.", options: ["came across", "looked at", "watched"], correct: 0 },
        { question: "Our platform helps sales teams reduce their ___ by 40%.", options: ["revenue cycle", "sales cycle", "product cycle"], correct: 1 },
        { question: "Would it ___ to grab 15 minutes this week?", options: ["be good", "make sense", "be nice"], correct: 1 },
        { question: "I'll keep this ___. We help companies like yours close deals faster.", options: ["small", "short", "quick"], correct: 1 },
        { question: "Just ___ this to the top of your inbox in case you missed it.", options: ["pushing", "moving", "bumping"], correct: 2 },
      ],
    },
  },
  {
    slug: "estructurar-cold-call",
    section: "Cold Outreach",
    title: "Cómo estructurar un cold call en inglés | aprendoingles.online",
    h1: "Cómo estructurar un cold call en inglés",
    metaDescription: "Estructura paso a paso para hacer cold calls en inglés: apertura, pitch, manejo de objeciones iniciales y cierre de siguiente paso.",
    description: "Apertura, pitch, manejo de objeciones y cierre de siguiente paso. La estructura completa de una cold call profesional en inglés.",
    duration: "20 min", free: false, order: 2,
    intro: "Una cold call no es improvisación: es una conversación estructurada donde cada segundo cuenta. En inglés, la diferencia entre sonar profesional o sonar como spam está en las primeras 10 palabras. Esta lección te da la estructura exacta que usan los SDRs en empresas como Salesforce, HubSpot o Gong.",
    vocabulary: [
      { term: "Gatekeeper", definition: "Persona que filtra las llamadas antes de que lleguen al decisor (recepcionista, asistente).", example: "The gatekeeper said he's in a meeting — I'll try again at 4 PM." },
      { term: "Decision-maker", definition: "La persona con autoridad para comprar o aprobar la compra.", example: "Always ask to speak with the decision-maker, not just any contact." },
      { term: "Opener", definition: "Las primeras palabras de tu llamada. Deben captar atención en 5 segundos.", example: "A good opener earns you the next 30 seconds of the conversation." },
      { term: "Pitch", definition: "Presentación breve de tu producto o servicio.", example: "Keep your pitch under 30 seconds — if they're interested, they'll ask for more." },
      { term: "Pain point", definition: "Problema o frustración que tiene el prospect y que tu producto resuelve.", example: "If you don't uncover a real pain point, there's no reason for them to buy." },
      { term: "Objection", definition: "Razón que da el prospect para no avanzar.", example: "The most common objection is 'We're not interested' — it rarely means they've evaluated you." },
      { term: "Next step", definition: "La acción concreta que acuerdas al final de la llamada.", example: "Never hang up without a clear next step — a meeting, a demo, or a follow-up date." },
      { term: "Talk track", definition: "Guión o esquema de conversación que sigue el vendedor.", example: "Our talk track has three parts: opener, discovery question, and CTA." },
    ],
    keyPhrases: [
      { phrase: "Hi [name], this is [your name] from [company]. Did I catch you at a bad time?", translation: "Hola [nombre], soy [tu nombre] de [empresa]. ¿Te pillo en mal momento?", context: "Opener clásico y respetuoso." },
      { phrase: "The reason I'm calling is...", translation: "El motivo de mi llamada es...", context: "Transición directa al pitch. Evita rodeos." },
      { phrase: "A lot of [similar companies] are struggling with...", translation: "Muchas [empresas similares] tienen problemas con...", context: "Crea relevancia mencionando empresas como la del prospect." },
      { phrase: "Does that resonate with you at all?", translation: "¿Te suena algo de esto?", context: "Pregunta de validación." },
      { phrase: "I'd love to set up 15 minutes to walk you through how we help.", translation: "Me encantaría agendar 15 minutos para enseñarte cómo ayudamos.", context: "CTA de cierre." },
      { phrase: "I totally understand. When would be a better time to revisit this?", translation: "Lo entiendo perfectamente. ¿Cuándo sería mejor momento para retomar esto?", context: "Respuesta a 'ahora no es buen momento'." },
    ],
    exercise: {
      instruction: "Elige la respuesta más profesional para cada situación de una cold call.",
      questions: [
        { question: "El prospect dice 'I'm busy right now'. ¿Qué respondes?", options: ["OK, bye.", "I totally understand. When would be a better time?", "It'll only take a second."], correct: 1 },
        { question: "¿Cuál es el mejor opener para una cold call?", options: ["Hi, how are you today?", "Did I catch you at a bad time?", "I have a great offer for you."], correct: 1 },
        { question: "¿Cómo introduces tu pitch después del opener?", options: ["So basically what we do is...", "The reason I'm calling is...", "Let me tell you about our product..."], correct: 1 },
        { question: "El prospect muestra interés. ¿Cómo cierras?", options: ["So, do you want to buy?", "I'd love to set up 15 minutes to walk you through how we help.", "Let me send you our pricing."], correct: 1 },
        { question: "¿Qué pregunta valida si tu pitch es relevante?", options: ["Do you have budget?", "Does that resonate with you at all?", "Are you the decision-maker?"], correct: 1 },
      ],
    },
  },
  {
    slug: "superar-gatekeepers", section: "Cold Outreach", title: "Cómo superar gatekeepers en inglés | aprendoingles.online", h1: "Cómo superar gatekeepers en llamadas en inglés", metaDescription: "Técnicas y frases para superar gatekeepers en llamadas comerciales en inglés y conseguir hablar con el decisor.", description: "Técnicas y frases para pasar recepcionistas y asistentes, y llegar al decisor.", duration: "15 min", free: false, order: 3,
    intro: "El gatekeeper no es tu enemigo: es una persona haciendo su trabajo. En inglés, la clave para pasar filtros es sonar como alguien que ya tiene relación con el decisor, no como un vendedor frío.",
    vocabulary: [
      { term: "Gatekeeper", definition: "Persona que controla el acceso al decisor.", example: "Treat the gatekeeper as an ally, not an obstacle." },
      { term: "To put through", definition: "Pasar una llamada a otra persona.", example: "Could you put me through to Sarah in marketing?" },
      { term: "To screen calls", definition: "Filtrar llamadas para decidir cuáles pasan.", example: "Her assistant screens all calls — you need a reason to get through." },
      { term: "Extension", definition: "Número de extensión interna.", example: "Do you have his direct extension?" },
      { term: "Referral", definition: "Cuando alguien te recomienda o te da el contacto.", example: "I was referred by James in your London office." },
      { term: "Direct line", definition: "Número directo que no pasa por recepción.", example: "Getting the direct line is gold — it bypasses the gatekeeper entirely." },
    ],
    keyPhrases: [
      { phrase: "Hi, could you put me through to [name] please?", translation: "Hola, ¿podrías pasarme con [nombre] por favor?", context: "Pide con confianza y nombre exacto." },
      { phrase: "We spoke briefly at [event] and she asked me to follow up.", translation: "Hablamos brevemente en [evento] y me pidió que le llamara.", context: "Solo si es verdad." },
      { phrase: "I'm not sure who handles [topic] — could you point me in the right direction?", translation: "No estoy seguro de quién lleva [tema] — ¿podrías orientarme?", context: "Pedir ayuda en vez de acceso." },
      { phrase: "I was referred by [name] in your [department].", translation: "Me derivó [nombre] de vuestro [departamento].", context: "Un referral interno es muy efectivo." },
      { phrase: "Is there a better time to reach her?", translation: "¿Hay mejor hora para encontrarla?", context: "Obtén info para la próxima llamada." },
    ],
    exercise: {
      instruction: "Elige la mejor frase para cada situación con un gatekeeper.",
      questions: [
        { question: "La recepcionista pregunta 'What is this regarding?'. ¿Qué respondes?", options: ["I'm selling a software product.", "We've been in touch about their Q3 planning — she'll know what it's about.", "It's confidential."], correct: 1 },
        { question: "Te dicen 'She's not available'. ¿Cómo respondes?", options: ["OK, thanks.", "Is there a better time to reach her?", "Can you tell her it's urgent?"], correct: 1 },
        { question: "No sabes quién lleva compras. ¿Cómo preguntas?", options: ["Who's the boss?", "I'm not sure who handles procurement — could you point me in the right direction?", "Give me the purchasing manager."], correct: 1 },
        { question: "¿Cuál de estas técnicas es más efectiva?", options: ["Llamar antes de las 9 AM", "Decir que es personal", "Pedir con un nombre específico con confianza"], correct: 2 },
      ],
    },
  },
  {
    slug: "follow-up-emails", section: "Cold Outreach", title: "Follow-up emails de ventas en inglés | aprendoingles.online", h1: "Cómo escribir follow-up emails de ventas en inglés", metaDescription: "Aprende a escribir follow-up emails efectivos en inglés: timing, tono, estructura y plantillas para cada situación comercial.", description: "Timing, tono, estructura y plantillas. Escribe follow-ups en inglés que mantienen la conversación viva.", duration: "15 min", free: false, order: 4,
    intro: "El 80% de las ventas requieren al menos 5 follow-ups, pero el 44% de los vendedores se rinden después del primero.",
    vocabulary: [
      { term: "To follow up", definition: "Hacer seguimiento de una conversación anterior.", example: "I'm following up on the email I sent last Tuesday." },
      { term: "To circle back", definition: "Retomar un tema pendiente.", example: "I wanted to circle back on our conversation about the Q4 budget." },
      { term: "To touch base", definition: "Contactar brevemente para mantener la relación.", example: "Just touching base to see if you had any questions." },
      { term: "Cadence", definition: "Secuencia y ritmo de los emails de seguimiento.", example: "Our follow-up cadence is day 1, day 3, day 7, day 14." },
      { term: "To go dark", definition: "Cuando un prospect deja de responder.", example: "The prospect went dark after the demo." },
      { term: "Breakup email", definition: "Último email de la secuencia.", example: "The breakup email often gets the highest reply rate." },
    ],
    keyPhrases: [
      { phrase: "Just wanted to make sure this didn't get buried.", translation: "Solo quería asegurarme de que esto no se perdió.", context: "Follow-up #1, casual." },
      { phrase: "I know things get busy — just circling back on this.", translation: "Sé que las cosas se ponen ajetreadas — solo retomo esto.", context: "Follow-up #2, empático." },
      { phrase: "I've got some new data that might change the picture.", translation: "Tengo nuevos datos que podrían cambiar la perspectiva.", context: "Aporta valor nuevo." },
      { phrase: "I'll assume the timing isn't right and close your file for now.", translation: "Asumiré que no es el momento y cierro tu archivo por ahora.", context: "Breakup email." },
      { phrase: "No hard feelings either way — just let me know.", translation: "Sin problema en cualquier caso — solo hazme saber.", context: "Da permiso para decir que no." },
    ],
    exercise: {
      instruction: "Elige el follow-up más apropiado para cada situación.",
      questions: [
        { question: "Enviaste un cold email hace 3 días sin respuesta. ¿Qué escribes?", options: ["Did you get my email?", "Just wanted to make sure this didn't get buried.", "Please respond ASAP."], correct: 1 },
        { question: "El prospect no ha respondido a 4 emails. ¿Qué haces?", options: ["Enviar el mismo email otra vez.", "Enviar un breakup email.", "Llamar a su jefe."], correct: 1 },
        { question: "¿Cuál es el mejor timing para el primer follow-up?", options: ["La misma tarde", "2-3 días después", "Una semana después"], correct: 1 },
        { question: "¿Qué frase cierra mejor un breakup email?", options: ["This is my last email.", "I'll assume the timing isn't right and close your file for now.", "You're missing a great opportunity."], correct: 1 },
      ],
    },
  },
  {
    slug: "preguntas-discovery-spin-bant", section: "Discovery Calls", title: "Preguntas de discovery en inglés: SPIN y BANT | aprendoingles.online", h1: "Preguntas de discovery en inglés: SPIN y BANT", metaDescription: "Aprende a usar los frameworks SPIN Selling y BANT en inglés: preguntas clave para cualificar oportunidades.", description: "SPIN Selling y BANT aplicados a conversaciones reales en inglés.", duration: "20 min", free: false, order: 5,
    intro: "Una discovery call no es un interrogatorio: es una conversación donde haces preguntas inteligentes para entender si puedes ayudar al prospect.",
    vocabulary: [
      { term: "Discovery call", definition: "Primera llamada de cualificación.", example: "The goal of a discovery call is to understand, not to sell." },
      { term: "Qualifying", definition: "Determinar si un prospect es un buen fit.", example: "Stop pitching and start qualifying." },
      { term: "Pain point", definition: "Problema real que tiene el prospect.", example: "Until you find a real pain point, you have no deal." },
      { term: "Stakeholder", definition: "Persona con interés en la decisión de compra.", example: "Who are the other stakeholders involved?" },
      { term: "Budget", definition: "Presupuesto disponible.", example: "Do you have a budget allocated for this?" },
      { term: "Timeline", definition: "Plazo para resolver el problema.", example: "What's your timeline for making a decision?" },
      { term: "Champion", definition: "Persona que defiende tu solución internamente.", example: "Without an internal champion, deals stall." },
    ],
    keyPhrases: [
      { phrase: "Can you walk me through how you currently handle...?", translation: "¿Puedes explicarme cómo gestionáis actualmente...?", context: "SPIN: Situación." },
      { phrase: "What's the biggest challenge you're facing with...?", translation: "¿Cuál es el mayor reto que tenéis con...?", context: "SPIN: Problema." },
      { phrase: "What happens if this doesn't get solved?", translation: "¿Qué pasa si esto no se resuelve?", context: "SPIN: Implicación." },
      { phrase: "How would it impact your team if you could...?", translation: "¿Cómo impactaría a tu equipo si pudierais...?", context: "SPIN: Need-payoff." },
      { phrase: "Who else would need to sign off on this?", translation: "¿Quién más tendría que aprobar esto?", context: "BANT: Authority." },
      { phrase: "Is there a budget already allocated, or would we need to build a case?", translation: "¿Hay presupuesto asignado, o necesitaríamos construir un business case?", context: "BANT: Budget." },
    ],
    exercise: {
      instruction: "Clasifica cada pregunta en su categoría SPIN correcta.",
      questions: [
        { question: "'What tools are you currently using?' es una pregunta de...", options: ["Situation", "Problem", "Implication"], correct: 0 },
        { question: "'What happens to your revenue if this continues?' es...", options: ["Situation", "Problem", "Implication"], correct: 2 },
        { question: "'What's been the most frustrating part?' es...", options: ["Situation", "Problem", "Need-payoff"], correct: 1 },
        { question: "'How would it change things if you could automate that?' es...", options: ["Problem", "Implication", "Need-payoff"], correct: 2 },
        { question: "'Who else would need to be involved?' es...", options: ["Authority (BANT)", "Situation (SPIN)", "Need-payoff (SPIN)"], correct: 0 },
      ],
    },
  },
  {
    slug: "escucha-activa-en-ventas", section: "Discovery Calls", title: "Escucha activa en ventas en inglés | aprendoingles.online", h1: "Escucha activa en ventas en inglés", metaDescription: "Técnicas de escucha activa en inglés para ventas: parafrasear, confirmar, profundizar y mostrar empatía.", description: "Parafrasear, confirmar, profundizar y mostrar empatía. Las técnicas de active listening.", duration: "15 min", free: false, order: 6,
    intro: "Los mejores vendedores hablan menos del 40% de la llamada. El resto es escucha activa.",
    vocabulary: [
      { term: "Active listening", definition: "Escuchar con intención, procesando y respondiendo.", example: "Active listening is the number one skill that separates top performers." },
      { term: "To paraphrase", definition: "Repetir con tus propias palabras para confirmar.", example: "Let me paraphrase what you just said." },
      { term: "To mirror", definition: "Repetir las últimas 2-3 palabras del prospect.", example: "Mirroring is the simplest technique." },
      { term: "To probe", definition: "Hacer preguntas de seguimiento.", example: "When they mention a challenge, probe deeper." },
      { term: "To acknowledge", definition: "Reconocer lo que el prospect dice antes de responder.", example: "Always acknowledge their concern before jumping to your solution." },
      { term: "Talk-to-listen ratio", definition: "Proporción hablar vs escuchar.", example: "The ideal ratio in discovery is 30:70." },
    ],
    keyPhrases: [
      { phrase: "So what I'm hearing is...", translation: "Entonces, lo que entiendo es...", context: "Parafraseo." },
      { phrase: "That makes a lot of sense.", translation: "Eso tiene mucho sentido.", context: "Validación." },
      { phrase: "Can you tell me more about that?", translation: "¿Puedes contarme más sobre eso?", context: "Profundización." },
      { phrase: "How so?", translation: "¿Cómo es eso?", context: "Follow-up corto y efectivo." },
      { phrase: "I can see why that would be frustrating.", translation: "Entiendo por qué eso sería frustrante.", context: "Empatía explícita." },
      { phrase: "Just to make sure I've got this right...", translation: "Solo para asegurarme de que lo he entendido bien...", context: "Antes de parafrasear." },
    ],
    exercise: {
      instruction: "Elige la mejor técnica de escucha activa.",
      questions: [
        { question: "El prospect dice: 'Our current process takes way too long.' ¿Qué respondes?", options: ["I have the perfect solution.", "How so? Can you walk me through what it looks like?", "That's common."], correct: 1 },
        { question: "El prospect explica un problema complejo. ¿Qué haces?", options: ["Ofrecer tu solución.", "Parafrasear: 'So what I'm hearing is...'", "Cambiar a presupuesto."], correct: 1 },
        { question: "'...and that's when things fell apart.' ¿Qué técnica usas?", options: ["Mirroring: 'Things fell apart?'", "Ignorar y seguir.", "Preguntar por presupuesto."], correct: 0 },
        { question: "¿Cuál es el talk-to-listen ratio ideal en discovery?", options: ["50:50", "70:30 (tú más)", "30:70 (prospect más)"], correct: 2 },
      ],
    },
  },
  {
    slug: "cualificar-oportunidades", section: "Discovery Calls", title: "Cualificar oportunidades en inglés | aprendoingles.online", h1: "Cómo cualificar oportunidades comerciales en inglés", metaDescription: "Aprende a cualificar leads y oportunidades en inglés: preguntas de presupuesto, timeline, autoridad y necesidad.", description: "Budget, timeline, authority y need. Aprende a decidir rápido si una oportunidad merece tu tiempo.", duration: "15 min", free: false, order: 7,
    intro: "No todo lead es una oportunidad real. Cualificar bien te ahorra semanas persiguiendo deals que nunca cerrarán.",
    vocabulary: [
      { term: "Qualified lead", definition: "Lead que cumple los criterios mínimos.", example: "Only 25% of leads are qualified." },
      { term: "Disqualify", definition: "Determinar que un lead no es buen fit.", example: "It's better to disqualify early." },
      { term: "Buying committee", definition: "Grupo que participa en la decisión.", example: "The buying committee can have 6 to 10 people." },
      { term: "Business case", definition: "Justificación económica para una compra.", example: "Help your champion build a business case." },
      { term: "Deal-breaker", definition: "Requisito que descarta la oportunidad.", example: "If they need on-premise and we're cloud-only, that's a deal-breaker." },
      { term: "Pipeline", definition: "Conjunto de oportunidades en diferentes fases.", example: "A healthy pipeline has 3x your quota." },
    ],
    keyPhrases: [
      { phrase: "What's driving the urgency on this?", translation: "¿Qué está creando la urgencia en esto?", context: "Descubre si hay un deadline real." },
      { phrase: "Have you looked at other solutions?", translation: "¿Habéis mirado otras soluciones?", context: "Identifica competencia." },
      { phrase: "What does the decision-making process look like on your end?", translation: "¿Cómo es vuestro proceso de decisión?", context: "Descubre quién decide." },
      { phrase: "Is this a funded initiative, or is it still in the planning stage?", translation: "¿Es una iniciativa con presupuesto, o está en planificación?", context: "Pregunta de presupuesto elegante." },
      { phrase: "What would need to be true for you to move forward?", translation: "¿Qué tendría que ser cierto para que avanzarais?", context: "Cierre indirecto." },
    ],
    exercise: {
      instruction: "Elige la mejor forma de cualificar.",
      questions: [
        { question: "Necesitas saber si tienen presupuesto. ¿Cómo preguntas?", options: ["What's your budget?", "Is this a funded initiative, or still in planning?", "How much money do you have?"], correct: 1 },
        { question: "El prospect dice que no tiene prisa. ¿Qué haces?", options: ["Esperar.", "Preguntar: 'What would create urgency?'", "Ofrecer descuento."], correct: 1 },
        { question: "¿Mejor señal de oportunidad NO cualificada?", options: ["Hace muchas preguntas.", "No hay pain point ni urgencia.", "Quieren demo antes de comprar."], correct: 1 },
      ],
    },
  },
  {
    slug: "estructurar-demo-producto", section: "Demos y Presentaciones", title: "Cómo estructurar una demo en inglés | aprendoingles.online", h1: "Cómo estructurar una demo de producto en inglés", metaDescription: "Estructura paso a paso para demos en inglés: apertura, agenda, demostración del valor, Q&A y cierre.", description: "Apertura, agenda, demostración del valor, Q&A y next steps.", duration: "20 min", free: false, order: 8,
    intro: "Una demo no es un tour de producto: es una conversación donde demuestras cómo resuelves el problema específico del prospect.",
    vocabulary: [
      { term: "Walkthrough", definition: "Recorrido guiado por un producto.", example: "Let me give you a quick walkthrough." },
      { term: "Use case", definition: "Caso de uso real.", example: "This use case is very similar to what you described." },
      { term: "Feature", definition: "Funcionalidad específica.", example: "I'll skip the features that aren't relevant." },
      { term: "Benefit", definition: "Resultado positivo que una feature produce.", example: "The feature is automated reporting — the benefit is you save 5 hours." },
      { term: "Agenda", definition: "Plan de lo que vas a cubrir.", example: "Let me quickly set the agenda." },
      { term: "Q&A", definition: "Ronda de preguntas y respuestas.", example: "I'll leave 10 minutes for Q&A." },
      { term: "Next steps", definition: "Acciones concretas al final.", example: "Before we wrap up, let's align on next steps." },
    ],
    keyPhrases: [
      { phrase: "Before I dive in, let me quickly recap what we discussed last time.", translation: "Antes de empezar, déjame hacer un resumen rápido.", context: "Conecta con la discovery." },
      { phrase: "Based on what you told me, I'm going to focus on...", translation: "Basándome en lo que me contaste, me voy a centrar en...", context: "Personaliza la demo." },
      { phrase: "Let me show you how this works in practice.", translation: "Déjame enseñarte cómo funciona en la práctica.", context: "Transición a la demo real." },
      { phrase: "Does this align with what you're looking for?", translation: "¿Esto encaja con lo que estáis buscando?", context: "Check-in durante la demo." },
      { phrase: "What questions do you have so far?", translation: "¿Qué preguntas tenéis hasta ahora?", context: "Mejor que '¿hay preguntas?'" },
      { phrase: "So in terms of next steps, I'd suggest...", translation: "En cuanto a próximos pasos, yo sugeriría...", context: "Cierre con propuesta." },
    ],
    exercise: {
      instruction: "Elige las mejores prácticas para una demo.",
      questions: [
        { question: "¿Con qué empiezas una demo?", options: ["Mostrar el producto.", "Recapitular la discovery.", "Historia de tu empresa."], correct: 1 },
        { question: "¿Qué es mejor decir?", options: ["Our product has 47 features.", "Based on your challenge with X, let me show you how we solve that.", "This is our most popular feature."], correct: 1 },
        { question: "Prospect desconectado a mitad de demo. ¿Qué haces?", options: ["Seguir adelante.", "Preguntar: 'Does this align with what you're looking for?'", "Hablar más rápido."], correct: 1 },
        { question: "¿Cómo cierras una demo?", options: ["'Any questions?' y colgar.", "'So in terms of next steps, I'd suggest...'", "Enviar email después."], correct: 1 },
      ],
    },
  },
  {
    slug: "features-vs-beneficios", section: "Demos y Presentaciones", title: "Features vs beneficios en inglés | aprendoingles.online", h1: "Cómo conectar features con beneficios en inglés", metaDescription: "Aprende a traducir características técnicas en beneficios para el cliente en inglés.", description: "Traduce features en beneficios reales. Las fórmulas en inglés que transforman una demo técnica en valor.", duration: "15 min", free: false, order: 9,
    intro: "Nadie compra features: compran resultados. 'We have AI-powered analytics' no vende nada. 'You'll know which deals are at risk before your team does' vende mucho.",
    vocabulary: [
      { term: "Feature", definition: "Lo que tu producto HACE.", example: "Feature: real-time dashboard." },
      { term: "Benefit", definition: "Lo que tu producto SIGNIFICA para el cliente.", example: "Benefit: you'll never walk into a meeting unprepared." },
      { term: "ROI", definition: "Retorno de la inversión.", example: "Can you quantify the ROI?" },
      { term: "Outcome", definition: "Resultado final.", example: "Focus on the outcome." },
      { term: "So that...", definition: "Conector feature→beneficio.", example: "We automate your reporting, so that your team can focus on selling." },
      { term: "Which means...", definition: "Otro conector feature→beneficio.", example: "It integrates natively, which means zero manual data entry." },
    ],
    keyPhrases: [
      { phrase: "[Feature], which means [benefit].", translation: "[Feature], lo que significa [beneficio].", context: "Fórmula básica." },
      { phrase: "What this means for you is...", translation: "Lo que esto significa para ti es...", context: "Transición explícita." },
      { phrase: "So instead of [pain], you'll be able to [outcome].", translation: "Así que en vez de [dolor], podrás [resultado].", context: "Contraste antes/después." },
      { phrase: "Our customers typically see [result] within [timeframe].", translation: "Nuestros clientes suelen ver [resultado] en [plazo].", context: "Prueba social." },
      { phrase: "I know [competitor] does X, but what makes us different is...", translation: "Sé que [competidor] hace X, pero lo que nos diferencia es...", context: "Diferenciación directa." },
    ],
    exercise: {
      instruction: "Transforma cada feature en un beneficio.",
      questions: [
        { question: "'We have real-time analytics.' ¿Cuál es el beneficio?", options: ["Our analytics are very fast.", "You'll spot problems before they become crises.", "We process data in milliseconds."], correct: 1 },
        { question: "¿Qué conector funciona mejor?", options: ["And also...", "Which means...", "In addition..."], correct: 1 },
        { question: "'We integrate with 50+ tools.' ¿Mejor beneficio?", options: ["We have many integrations.", "Your team won't waste time on manual data entry.", "We support most platforms."], correct: 1 },
        { question: "¿Mejor contraste antes/después?", options: ["Our product is better.", "So instead of 3 hours on reports, your team closes deals.", "We are the market leader."], correct: 1 },
      ],
    },
  },
  {
    slug: "manejar-preguntas-dificiles", section: "Demos y Presentaciones", title: "Preguntas difíciles en demos en inglés | aprendoingles.online", h1: "Cómo manejar preguntas difíciles en demos en inglés", metaDescription: "Técnicas para responder preguntas difíciles durante demos en inglés.", description: "Ganar tiempo, redirigir y ser honesto sin perder la venta.", duration: "15 min", free: false, order: 10,
    intro: "En medio de una demo, alguien pregunta algo que no sabes responder. Cómo manejas ese momento define si cierras o pierdes el deal.",
    vocabulary: [
      { term: "Curveball", definition: "Pregunta inesperada.", example: "The CTO threw a curveball about security." },
      { term: "To deflect", definition: "Redirigir una pregunta.", example: "He tried to deflect, but the prospect pushed back." },
      { term: "To park (a question)", definition: "Dejar para más tarde.", example: "Let me park that and come back after the demo." },
      { term: "To buy time", definition: "Ganar tiempo antes de responder.", example: "Repeating the question back buys time." },
      { term: "Workaround", definition: "Alternativa cuando la feature no existe.", example: "There's a workaround using our API." },
      { term: "To circle back", definition: "Volver a un tema pendiente.", example: "Let me circle back to the security question." },
    ],
    keyPhrases: [
      { phrase: "That's a great question. Let me make sure I give you an accurate answer.", translation: "Gran pregunta. Déjame asegurarme de darte una respuesta precisa.", context: "Compra tiempo." },
      { phrase: "I want to be transparent with you — we don't have that today.", translation: "Quiero ser transparente — no tenemos eso hoy.", context: "Honestidad directa." },
      { phrase: "What we do have is..., which solves the same problem differently.", translation: "Lo que sí tenemos es..., que resuelve el mismo problema de otra forma.", context: "Redirige a lo que sí tienes." },
      { phrase: "Let me take that back to our team and get you a detailed answer by tomorrow.", translation: "Déjame llevar eso a nuestro equipo y darte respuesta mañana.", context: "Para preguntas técnicas." },
      { phrase: "Can you help me understand why that's important for your use case?", translation: "¿Puedes ayudarme a entender por qué eso es importante para vuestro caso?", context: "Devuelve la pregunta." },
    ],
    exercise: {
      instruction: "Elige la mejor respuesta para cada pregunta difícil.",
      questions: [
        { question: "Preguntan por una feature que no tienes. ¿Qué dices?", options: ["Yes, we have that.", "I want to be transparent — we don't have that today. What we do have is...", "That's on our roadmap."], correct: 1 },
        { question: "Pregunta técnica que no sabes. ¿Qué haces?", options: ["Inventar.", "Decir 'I don't know' y cambiar tema.", "'Great question. Let me take that back to our team.'"], correct: 2 },
        { question: "Piden una integración específica. ¿Qué preguntas primero?", options: ["How much would you pay?", "Can you help me understand why that's important for your use case?", "Nobody else has asked."], correct: 1 },
      ],
    },
  },
  {
    slug: "objeciones-de-precio", section: "Negociación y Objeciones", title: "Objeciones de precio en inglés | aprendoingles.online", h1: "Cómo manejar objeciones de precio en inglés", metaDescription: "Aprende a responder a 'It's too expensive' y otras objeciones de precio en inglés.", description: "'It's too expensive', 'We don't have budget'. Responde objeciones de precio sin bajar el precio.", duration: "20 min", free: false, order: 11,
    intro: "Cuando un prospect dice 'It's too expensive', casi nunca es una cuestión de precio: es una cuestión de valor percibido.",
    vocabulary: [
      { term: "Sticker shock", definition: "Reacción negativa al ver el precio.", example: "Don't panic at sticker shock." },
      { term: "To reframe", definition: "Cambiar la perspectiva del precio.", example: "Reframe the cost as an investment." },
      { term: "TCO", definition: "Coste total de propiedad.", example: "The cheaper tool has a higher TCO." },
      { term: "To anchor", definition: "Establecer referencia antes del precio.", example: "Anchor to the cost of the problem." },
      { term: "Discount", definition: "Reducción de precio.", example: "Don't offer a discount without getting something in return." },
      { term: "ROI", definition: "Retorno de la inversión.", example: "If the ROI is clear, the price objection disappears." },
    ],
    keyPhrases: [
      { phrase: "I hear you — let's break down the numbers together.", translation: "Te entiendo — vamos a desglosar los números.", context: "Acepta la preocupación." },
      { phrase: "Compared to the cost of [problem], this pays for itself in [timeframe].", translation: "Comparado con el coste de [problema], se paga solo en [plazo].", context: "Reframe clásico." },
      { phrase: "What would it mean for your team if [outcome]?", translation: "¿Qué significaría para tu equipo si [resultado]?", context: "Haz que calcule el valor." },
      { phrase: "Is it the total price, or the timing of the investment?", translation: "¿Es el precio total, o el momento de la inversión?", context: "Distingue objeciones." },
      { phrase: "If budget weren't a factor, would this be the right solution?", translation: "Si el presupuesto no fuera factor, ¿sería la solución correcta?", context: "Aísla la objeción." },
    ],
    exercise: {
      instruction: "Elige la mejor respuesta para cada objeción de precio.",
      questions: [
        { question: "'It's too expensive.' ¿Qué respondes?", options: ["20% discount.", "Compared to the problem, this pays for itself in 3 months.", "Let me know if you change your mind."], correct: 1 },
        { question: "'We don't have budget.' ¿Qué preguntas?", options: ["When will you have budget?", "Is it the total price, or the timing?", "What if I make it cheaper?"], correct: 1 },
        { question: "¿Cuándo ofrecer descuento?", options: ["Siempre que lo pidan.", "Cuando ofrezcan algo a cambio.", "Nunca."], correct: 1 },
      ],
    },
  },
  {
    slug: "objeciones-comunes", section: "Negociación y Objeciones", title: "Objeciones comunes en ventas en inglés | aprendoingles.online", h1: "Objeciones comunes en ventas en inglés y cómo responderlas", metaDescription: "Las 10 objeciones más comunes en ventas B2B en inglés y las respuestas que funcionan.", description: "'We're happy with our current solution', 'Send me an email', 'Now is not a good time'.", duration: "20 min", free: false, order: 12,
    intro: "Las objeciones no son rechazos: son preguntas disfrazadas.",
    vocabulary: [
      { term: "Objection handling", definition: "Proceso de responder a preocupaciones.", example: "Good objection handling isn't about winning arguments." },
      { term: "Pushback", definition: "Resistencia inicial.", example: "Getting pushback means they're engaged." },
      { term: "Status quo", definition: "Situación actual. Tu mayor competidor.", example: "Your biggest competitor is the status quo." },
      { term: "Brush-off", definition: "Objeción superficial para quitarte.", example: "'Send me an email' is usually a brush-off." },
      { term: "Legitimate concern", definition: "Preocupación real y válida.", example: "'How do you handle data privacy?' is legitimate." },
      { term: "To overcome", definition: "Resolver una objeción.", example: "You overcome objections by understanding." },
    ],
    keyPhrases: [
      { phrase: "That's fair. A lot of our best customers said the same thing before switching.", translation: "Es justo. Muchos de nuestros mejores clientes dijeron lo mismo.", context: "Para 'We're happy with our current solution'." },
      { phrase: "I get it — timing is everything. What would need to change for this to become a priority?", translation: "Lo entiendo. ¿Qué tendría que cambiar para que fuera prioridad?", context: "Para 'Now is not a good time'." },
      { phrase: "I'd rather not waste your time with an email — can I have 30 seconds?", translation: "Prefiero no hacerte perder el tiempo con un email — ¿me das 30 segundos?", context: "Para 'Send me an email'." },
      { phrase: "Totally understand. Out of curiosity, what made you go with [competitor]?", translation: "Totalmente comprensible. ¿Qué os hizo elegir [competidor]?", context: "Para 'We already use X'." },
      { phrase: "I wouldn't expect you to decide today — just looking to see if there's a fit.", translation: "No esperaría que decidierais hoy — solo quiero ver si encajamos.", context: "Para 'I need to think about it'." },
    ],
    exercise: {
      instruction: "Elige la mejor respuesta para cada objeción.",
      questions: [
        { question: "'We're happy with our current provider.'", options: ["Our product is better.", "That's fair — a lot of our best customers said the same before switching.", "OK, sorry."], correct: 1 },
        { question: "'Send me an email.'", options: ["Enviar email genérico.", "'I'd rather not waste your time — can I have 30 seconds?'", "Colgar."], correct: 1 },
        { question: "'I need to think about it.'", options: ["Take your time.", "'I wouldn't expect a decision today — what's your biggest hesitation?'", "What's there to think about?"], correct: 1 },
        { question: "'Now is not a good time.'", options: ["When is good?", "'What would need to change for this to become a priority?'", "Can I call next month?"], correct: 1 },
      ],
    },
  },
  {
    slug: "negociar-condiciones", section: "Negociación y Objeciones", title: "Negociar condiciones comerciales en inglés | aprendoingles.online", h1: "Cómo negociar condiciones comerciales en inglés", metaDescription: "Técnicas de negociación comercial en inglés: descuentos, plazos, términos de contrato y acuerdos win-win.", description: "Descuentos, plazos, términos de contrato. Negocia condiciones en inglés.", duration: "15 min", free: false, order: 13,
    intro: "Negociar en inglés no es regatear: es encontrar un acuerdo donde ambas partes ganan.",
    vocabulary: [
      { term: "Concession", definition: "Algo que cedes en una negociación.", example: "Never give a concession without getting something in return." },
      { term: "Leverage", definition: "Ventaja o poder de negociación.", example: "If they need to close by end of quarter, that gives you leverage." },
      { term: "Win-win", definition: "Acuerdo que beneficia a ambas partes.", example: "The best deals are win-win." },
      { term: "Terms", definition: "Condiciones del acuerdo.", example: "We can be flexible on terms for a longer contract." },
      { term: "To counter", definition: "Hacer una contraoferta.", example: "I countered with 10% off for a 2-year commitment." },
      { term: "BATNA", definition: "Tu mejor alternativa si no hay acuerdo.", example: "Know your BATNA before any negotiation." },
    ],
    keyPhrases: [
      { phrase: "I can work with that, but I'd need [something in return].", translation: "Puedo trabajar con eso, pero necesitaría [algo a cambio].", context: "Nunca cedes sin pedir algo." },
      { phrase: "What if we structured it as...?", translation: "¿Y si lo estructuramos como...?", context: "Alternativas creativas." },
      { phrase: "I want to find something that works for both of us.", translation: "Quiero encontrar algo que funcione para los dos.", context: "Tono colaborativo." },
      { phrase: "That's outside what I can approve, but let me see what I can do.", translation: "Eso está fuera de lo que puedo aprobar, pero déjame ver.", context: "Muestra disposición sin comprometerte." },
      { phrase: "If we can agree on [X], I can be more flexible on [Y].", translation: "Si podemos acordar [X], puedo ser más flexible en [Y].", context: "Intercambio explícito." },
    ],
    exercise: {
      instruction: "Elige la mejor táctica de negociación.",
      questions: [
        { question: "Piden 30% descuento. ¿Qué haces?", options: ["Aceptar.", "Contraoferta: 15% off for 2-year commitment.", "Decir que no."], correct: 1 },
        { question: "No puedes bajar precio. ¿Alternativa?", options: ["Take it or leave it.", "What if we structured payment over 12 months?", "Free t-shirt."], correct: 1 },
        { question: "Regla de oro de negociación:", options: ["El cliente siempre tiene razón.", "Never give without getting something in return.", "Cierra rápido."], correct: 1 },
      ],
    },
  },
  {
    slug: "detectar-senales-compra", section: "Closing", title: "Señales de compra en inglés | aprendoingles.online", h1: "Cómo detectar señales de compra en inglés", metaDescription: "Aprende a identificar buying signals en conversaciones en inglés.", description: "Frases, preguntas y comportamientos que indican que el prospect está listo.", duration: "15 min", free: false, order: 14,
    intro: "Un buying signal es cualquier cosa que el prospect dice o hace que indica que está avanzando hacia la compra.",
    vocabulary: [
      { term: "Buying signal", definition: "Indicación de que el prospect está listo.", example: "When they ask about implementation, that's a buying signal." },
      { term: "Trial close", definition: "Intento suave de cierre.", example: "A trial close gauges readiness." },
      { term: "Green light", definition: "Señal clara de avanzar.", example: "When the CFO asks about payment terms, that's a green light." },
      { term: "Implementation", definition: "Proceso de poner en marcha la solución.", example: "'How long does implementation take?' is a buying signal." },
      { term: "Procurement", definition: "Departamento de compras.", example: "Once procurement gets involved, the deal is real." },
    ],
    keyPhrases: [
      { phrase: "It sounds like you're ready to move forward — what would the next step look like on your end?", translation: "Parece que estáis listos — ¿cuál sería el siguiente paso por vuestra parte?", context: "Trial close suave." },
      { phrase: "Based on everything we've discussed, it seems like a strong fit. Would you agree?", translation: "Basándonos en todo, parece un buen encaje. ¿Estás de acuerdo?", context: "Busca confirmación." },
      { phrase: "When were you looking to have this up and running?", translation: "¿Para cuándo queríais tener esto funcionando?", context: "Pregunta que asume la compra." },
      { phrase: "Shall I send over the agreement?", translation: "¿Os envío el acuerdo?", context: "Cierre directo." },
    ],
    exercise: {
      instruction: "Identifica buying signals.",
      questions: [
        { question: "'How long does implementation take?' ¿Es buying signal?", options: ["No, curiosidad.", "Sí — está imaginando usarlo.", "No, es objeción."], correct: 1 },
        { question: "'Can you send me pricing?' ¿Es buying signal?", options: ["Sí — quiere evaluar números.", "No — todos piden pricing.", "Depende."], correct: 0 },
        { question: "'We'd need to involve our IT team.' ¿Es buying signal?", options: ["No — es barrera.", "Sí — piensa en cómo hacerlo funcionar.", "Ni sí ni no."], correct: 1 },
        { question: "¿Cuál NO es buying signal?", options: ["'What does onboarding look like?'", "'Can you send me some information?' (en cold call)", "'When could we start?'"], correct: 1 },
      ],
    },
  },
  {
    slug: "tecnicas-de-closing", section: "Closing", title: "Técnicas de closing en inglés | aprendoingles.online", h1: "Técnicas de closing en inglés que funcionan", metaDescription: "Las mejores técnicas de cierre: assumptive close, summary close, urgency close.", description: "Assumptive close, summary close, urgency close. Las técnicas para cerrar en inglés.", duration: "20 min", free: false, order: 15,
    intro: "Cerrar no es presionar: es guiar al prospect al siguiente paso lógico.",
    vocabulary: [
      { term: "Assumptive close", definition: "Cierre que asume la compra.", example: "'Should we start with the annual plan?' — assumptive close." },
      { term: "Summary close", definition: "Resumen de todo antes de pedir decisión.", example: "Summary close works after procesos largos." },
      { term: "Urgency close", definition: "Crear urgencia legítima.", example: "Only works if the urgency is real." },
      { term: "To ask for the business", definition: "Pedir explícitamente que se comprometa.", example: "At some point, you just have to ask." },
      { term: "To close the deal", definition: "Cerrar la venta.", example: "We closed in 23 days — a record." },
      { term: "Verbal agreement", definition: "Acuerdo verbal antes del contrato.", example: "Get a verbal agreement first." },
    ],
    keyPhrases: [
      { phrase: "Based on everything we've covered, I think we're ready to move forward. I'll send the agreement over today — does that work?", translation: "Creo que estamos listos para avanzar. Envío el acuerdo hoy — ¿os funciona?", context: "Assumptive close." },
      { phrase: "Let me recap: you need [X], by [date], and we've agreed on [terms]. Shall I draft the contract?", translation: "Déjame recapitular: necesitáis [X], para [fecha], acordamos [condiciones]. ¿Preparo el contrato?", context: "Summary close." },
      { phrase: "I want to be upfront — this pricing is valid until end of quarter.", translation: "Quiero ser directo — este precio es válido hasta fin de trimestre.", context: "Urgency close legítima." },
      { phrase: "What's holding you back from moving forward?", translation: "¿Qué te frena para avanzar?", context: "Abre la puerta a la última objeción." },
      { phrase: "Is there anything else you need from me to make a decision?", translation: "¿Necesitas algo más de mi parte para decidir?", context: "Pone la pelota en su campo." },
    ],
    exercise: {
      instruction: "Identifica la mejor técnica de closing.",
      questions: [
        { question: "2 meses de proceso, 4 reuniones, dice que encaja. ¿Técnica?", options: ["Urgency close.", "Summary close: recap y pide contrato.", "Esperar."], correct: 1 },
        { question: "Pricing especial caduca en 2 semanas (real). ¿Qué dices?", options: ["Buy now or lose it.", "I want to be upfront — pricing is valid until the 30th.", "I'll extend indefinitely."], correct: 1 },
        { question: "Todo apunta a compra pero no dan el paso. ¿Qué preguntas?", options: ["So, deal?", "What's holding you back from moving forward?", "Do I need to talk to your boss?"], correct: 1 },
      ],
    },
  },
  {
    slug: "follow-up-post-venta", section: "Closing", title: "Follow-up post-venta en inglés | aprendoingles.online", h1: "Follow-up post-venta y onboarding del cliente en inglés", metaDescription: "Cómo hacer seguimiento post-venta en inglés: emails de bienvenida, onboarding, check-ins.", description: "Emails de bienvenida, onboarding, check-ins y gestión de la relación.", duration: "15 min", free: false, order: 16,
    intro: "La venta no termina con la firma: empieza. El post-venta es donde construyes la relación que genera renewals, upsells y referrals.",
    vocabulary: [
      { term: "Onboarding", definition: "Proceso de bienvenida del cliente nuevo.", example: "A smooth onboarding sets the tone." },
      { term: "Check-in", definition: "Contacto periódico.", example: "I do a check-in 30 days after go-live." },
      { term: "Renewal", definition: "Renovación del contrato.", example: "If onboarding goes well, renewal is easy." },
      { term: "Upsell", definition: "Vender plan superior a cliente existente.", example: "Best time to upsell is after real results." },
      { term: "Referral", definition: "Recomendación de un cliente satisfecho.", example: "Happy customers are your best source of referrals." },
      { term: "NPS", definition: "Métrica de satisfacción.", example: "Our NPS went from 40 to 72 after improving onboarding." },
    ],
    keyPhrases: [
      { phrase: "Welcome aboard! Here's what to expect in the first 30 days.", translation: "¡Bienvenido! Esto es lo que puedes esperar en los primeros 30 días.", context: "Email de bienvenida." },
      { phrase: "Just checking in to see how things are going since we went live.", translation: "Solo contacto para ver cómo van las cosas.", context: "Check-in post-implementación." },
      { phrase: "Is there anything we could be doing better?", translation: "¿Hay algo que podríamos hacer mejor?", context: "Pregunta de feedback." },
      { phrase: "Based on the results you're seeing, have you considered [upsell]?", translation: "Basándome en los resultados, ¿habéis considerado [upsell]?", context: "Upsell natural." },
      { phrase: "Would you be open to sharing your experience with a colleague?", translation: "¿Estarías abierto a compartir tu experiencia con un colega?", context: "Pedir referral." },
    ],
    exercise: {
      instruction: "Elige el mejor momento y frase para cada acción post-venta.",
      questions: [
        { question: "¿Mejor momento para primer check-in?", options: ["Misma semana.", "30 días después del go-live.", "Cuando toque renovar."], correct: 1 },
        { question: "¿Cuándo pedir referral?", options: ["Justo al firmar.", "Cuando el cliente ha visto resultados.", "Nunca."], correct: 1 },
        { question: "Cliente dice que todo va bien. ¿Qué preguntas?", options: ["Nothing — bye!", "'Is there anything we could be doing better?'", "'Can I upsell you?'"], correct: 1 },
        { question: "¿Mejor forma de proponer upsell?", options: ["'We have a new product.'", "'Based on the results you're seeing, have you considered...?'", "'Your contract allows upgrades.'"], correct: 1 },
      ],
    },
  },
];

async function migrateLessons() {
  console.log("🚀 Migrando 16 lecciones de Inglés para Ventas...\n");

  for (const lesson of lessons) {
    const vocabItems = (lesson.vocabulary || []).map((v, i) => ({
      _key: `vocab-${i}`,
      _type: "vocabItem",
      term: v.term,
      definition: v.definition,
      example: v.example,
    }));

    const phraseItems = (lesson.keyPhrases || []).map((p, i) => ({
      _key: `phrase-${i}`,
      _type: "phraseItem",
      phrase: p.phrase,
      translation: p.translation,
      context: p.context,
    }));

    const questionItems = (lesson.exercise?.questions || []).map((q, i) => ({
      _key: `q-${i}`,
      _type: "questionItem",
      question: q.question,
      options: q.options,
      correct: q.correct,
    }));

    await client.createOrReplace({
      _id: `lesson-${lesson.slug}`,
      _type: "lesson",
      title: lesson.title,
      h1: lesson.h1,
      slug: { _type: "slug", current: lesson.slug },
      metaDescription: lesson.metaDescription,
      description: lesson.description,
      course: { _type: "reference", _ref: COURSE_REF },
      section: lesson.section,
      order: lesson.order,
      duration: lesson.duration,
      free: lesson.free,
      published: true,
      intro: lesson.intro,
      vocabulary: vocabItems,
      keyPhrases: phraseItems,
      exercise: {
        instruction: lesson.exercise.instruction,
        questions: questionItems,
      },
      aiTutor: {
        enabled: false,
      },
    });

    console.log(`   ✅ ${lesson.order}. ${lesson.h1}`);
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ ${lessons.length} lecciones migradas a Sanity`);
  console.log(`═══════════════════════════════════════`);
}

migrateLessons().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
