export interface Lesson {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  description: string;
  duration: string;
  free: boolean;
  section: string;
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

export interface Curriculum {
  courseSlug: string;
  lessons: Lesson[];
}

export const curricula: Record<string, Curriculum> = {
  "ingles-para-ventas": {
    courseSlug: "ingles-para-ventas",
    lessons: [
      // ── COLD OUTREACH ──
      {
        slug: "vocabulario-cold-email",
        section: "Cold Outreach",
        title: "Vocabulario del cold email en inglés | aprendoingles.online",
        h1: "Vocabulario esencial del cold email en inglés",
        metaDescription: "Aprende el vocabulario clave para escribir cold emails en inglés: subject lines, opening lines, CTAs y follow-ups que generan respuestas.",
        description: "Subject lines, opening lines, CTAs y follow-ups. El vocabulario que necesitas para escribir cold emails en inglés que generan respuestas.",
        duration: "15 min",
        free: true,
        content: {
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
      },
      {
        slug: "estructurar-cold-call",
        section: "Cold Outreach",
        title: "Cómo estructurar un cold call en inglés | aprendoingles.online",
        h1: "Cómo estructurar un cold call en inglés",
        metaDescription: "Estructura paso a paso para hacer cold calls en inglés: apertura, pitch, manejo de objeciones iniciales y cierre de siguiente paso.",
        description: "Apertura, pitch, manejo de objeciones y cierre de siguiente paso. La estructura completa de una cold call profesional en inglés.",
        duration: "20 min",
        free: false,
        content: {
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
            { phrase: "Hi [name], this is [your name] from [company]. Did I catch you at a bad time?", translation: "Hola [nombre], soy [tu nombre] de [empresa]. ¿Te pillo en mal momento?", context: "Opener clásico y respetuoso. Da al prospect la opción de decir que no, lo que paradójicamente hace que la mayoría diga 'go ahead'." },
            { phrase: "The reason I'm calling is...", translation: "El motivo de mi llamada es...", context: "Transición directa al pitch. Evita rodeos." },
            { phrase: "A lot of [similar companies] are struggling with...", translation: "Muchas [empresas similares] tienen problemas con...", context: "Crea relevancia mencionando empresas como la del prospect." },
            { phrase: "Does that resonate with you at all?", translation: "¿Te suena algo de esto?", context: "Pregunta de validación. Si dice sí, tienes permiso para seguir." },
            { phrase: "I'd love to set up 15 minutes to walk you through how we help.", translation: "Me encantaría agendar 15 minutos para enseñarte cómo ayudamos.", context: "CTA de cierre. Específica (15 min) y orientada al valor (cómo ayudamos)." },
            { phrase: "I totally understand. When would be a better time to revisit this?", translation: "Lo entiendo perfectamente. ¿Cuándo sería mejor momento para retomar esto?", context: "Respuesta a 'ahora no es buen momento'. No aceptas el no, pero respetas el timing." },
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
      },
      {
        slug: "superar-gatekeepers",
        section: "Cold Outreach",
        title: "Cómo superar gatekeepers en inglés | aprendoingles.online",
        h1: "Cómo superar gatekeepers en llamadas en inglés",
        metaDescription: "Técnicas y frases para superar gatekeepers en llamadas comerciales en inglés y conseguir hablar con el decisor.",
        description: "Técnicas y frases para pasar recepcionistas y asistentes, y llegar al decisor. Supera gatekeepers en inglés con naturalidad.",
        duration: "15 min",
        free: false,
        content: {
          intro: "El gatekeeper no es tu enemigo: es una persona haciendo su trabajo. En inglés, la clave para pasar filtros es sonar como alguien que ya tiene relación con el decisor, no como un vendedor frío. Aquí aprenderás las técnicas que usan los mejores SDRs para llegar al decisor sin mentir ni ser agresivo.",
          vocabulary: [
            { term: "Gatekeeper", definition: "Persona que controla el acceso al decisor: recepcionista, asistente ejecutivo, office manager.", example: "Treat the gatekeeper as an ally, not an obstacle." },
            { term: "To put through", definition: "Pasar una llamada a otra persona.", example: "Could you put me through to Sarah in marketing?" },
            { term: "To screen calls", definition: "Filtrar llamadas para decidir cuáles pasan.", example: "Her assistant screens all calls — you need a reason to get through." },
            { term: "Extension", definition: "Número de extensión interna de un empleado.", example: "Do you have his direct extension? I don't want to bother the front desk." },
            { term: "Referral", definition: "Cuando alguien te recomienda o te da el contacto de otra persona.", example: "I was referred by James in your London office." },
            { term: "Direct line", definition: "Número de teléfono directo que no pasa por recepción.", example: "Getting the direct line is gold — it bypasses the gatekeeper entirely." },
          ],
          keyPhrases: [
            { phrase: "Hi, could you put me through to [name] please?", translation: "Hola, ¿podrías pasarme con [nombre] por favor?", context: "Pide con confianza y nombre exacto. Sonar específico = sonar como alguien que ya tiene relación." },
            { phrase: "We spoke briefly at [event/context] and she asked me to follow up.", translation: "Hablamos brevemente en [evento] y me pidió que le llamara.", context: "Solo si es verdad. Dar contexto legítimo elimina las barreras." },
            { phrase: "I'm not sure who handles [topic] — could you point me in the right direction?", translation: "No estoy seguro de quién lleva [tema] — ¿podrías orientarme?", context: "Pedir ayuda en vez de pedir acceso. El gatekeeper se convierte en aliado." },
            { phrase: "I was referred by [name] in your [department].", translation: "Me derivó [nombre] de vuestro [departamento].", context: "Un referral interno es la forma más efectiva de pasar cualquier filtro." },
            { phrase: "Is there a better time to reach her?", translation: "¿Hay mejor hora para encontrarla?", context: "Si no puedes pasar ahora, obtén información para la próxima llamada." },
          ],
          exercise: {
            instruction: "Elige la mejor frase para cada situación con un gatekeeper.",
            questions: [
              { question: "La recepcionista pregunta 'What is this regarding?'. ¿Qué respondes?", options: ["I'm selling a software product.", "We've been in touch about their Q3 planning — she'll know what it's about.", "It's confidential."], correct: 1 },
              { question: "Te dicen 'She's not available'. ¿Cómo respondes?", options: ["OK, thanks.", "Is there a better time to reach her?", "Can you tell her it's urgent?"], correct: 1 },
              { question: "No sabes quién lleva compras. ¿Cómo preguntas?", options: ["Who's the boss?", "I'm not sure who handles procurement — could you point me in the right direction?", "Give me the purchasing manager."], correct: 1 },
              { question: "¿Cuál de estas técnicas es más efectiva para pasar un gatekeeper?", options: ["Llamar antes de las 9 AM o después de las 6 PM", "Decir que es una llamada personal", "Pedir que te pasen con un nombre específico con confianza"], correct: 2 },
            ],
          },
        },
      },
      {
        slug: "follow-up-emails",
        section: "Cold Outreach",
        title: "Follow-up emails de ventas en inglés | aprendoingles.online",
        h1: "Cómo escribir follow-up emails de ventas en inglés",
        metaDescription: "Aprende a escribir follow-up emails efectivos en inglés: timing, tono, estructura y plantillas para cada situación comercial.",
        description: "Timing, tono, estructura y plantillas. Escribe follow-ups en inglés que mantienen la conversación viva sin resultar insistente.",
        duration: "15 min",
        free: false,
        content: {
          intro: "El 80% de las ventas requieren al menos 5 follow-ups, pero el 44% de los vendedores se rinden después del primero. En inglés, la diferencia entre persistente y pesado está en el tono y el valor que aportas en cada mensaje. Esta lección te enseña a escribir secuencias de follow-up que funcionan.",
          vocabulary: [
            { term: "To follow up", definition: "Hacer seguimiento de una conversación o propuesta anterior.", example: "I'm following up on the email I sent last Tuesday." },
            { term: "To circle back", definition: "Retomar un tema que se dejó pendiente.", example: "I wanted to circle back on our conversation about the Q4 budget." },
            { term: "To touch base", definition: "Contactar brevemente para mantener la relación o actualizar.", example: "Just touching base to see if you had any questions about the proposal." },
            { term: "Cadence", definition: "Secuencia y ritmo de los emails de seguimiento.", example: "Our follow-up cadence is day 1, day 3, day 7, day 14." },
            { term: "To go dark", definition: "Cuando un prospect deja de responder.", example: "The prospect went dark after the demo — time for a breakup email." },
            { term: "Breakup email", definition: "Último email de la secuencia, avisando que no volverás a escribir.", example: "The breakup email often gets the highest reply rate in the whole sequence." },
          ],
          keyPhrases: [
            { phrase: "Just wanted to make sure this didn't get buried.", translation: "Solo quería asegurarme de que esto no se perdió.", context: "Follow-up #1, casual y sin presión. Asume que no lo vieron, no que lo ignoraron." },
            { phrase: "I know things get busy — just circling back on this.", translation: "Sé que las cosas se ponen ajetreadas — solo retomo esto.", context: "Follow-up #2, empático. Reconoces que están ocupados." },
            { phrase: "I've got some new data that might change the picture.", translation: "Tengo nuevos datos que podrían cambiar la perspectiva.", context: "Follow-up que aporta valor nuevo en vez de repetir el mismo mensaje." },
            { phrase: "I'll assume the timing isn't right and close your file for now.", translation: "Asumiré que no es el momento y cierro tu archivo por ahora.", context: "Breakup email. Crea urgencia sutil sin ser agresivo." },
            { phrase: "No hard feelings either way — just let me know.", translation: "Sin problema en cualquier caso — solo hazme saber.", context: "Da permiso explícito para decir que no. Paradójicamente, esto aumenta las respuestas." },
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
      },

      // ── DISCOVERY CALLS ──
      {
        slug: "preguntas-discovery-spin-bant",
        section: "Discovery Calls",
        title: "Preguntas de discovery en inglés: SPIN y BANT | aprendoingles.online",
        h1: "Preguntas de discovery en inglés: SPIN y BANT",
        metaDescription: "Aprende a usar los frameworks SPIN Selling y BANT en inglés: preguntas clave para cualificar oportunidades y entender al cliente.",
        description: "SPIN Selling y BANT aplicados a conversaciones reales en inglés. Las preguntas que separan a un vendedor bueno de uno excelente.",
        duration: "20 min",
        free: false,
        content: {
          intro: "Una discovery call no es un interrogatorio: es una conversación donde haces preguntas inteligentes para entender si puedes ayudar al prospect y cómo. Los frameworks SPIN (Situation, Problem, Implication, Need-payoff) y BANT (Budget, Authority, Need, Timeline) te dan estructura para no improvisar. En inglés, formular estas preguntas con el tono adecuado marca toda la diferencia.",
          vocabulary: [
            { term: "Discovery call", definition: "Primera llamada de cualificación donde exploras las necesidades del prospect.", example: "The goal of a discovery call is to understand, not to sell." },
            { term: "Qualifying", definition: "Proceso de determinar si un prospect es un buen fit para tu producto.", example: "Stop pitching and start qualifying — not every lead is worth pursuing." },
            { term: "Pain point", definition: "Problema o frustración real que tiene el prospect.", example: "Until you find a real pain point, you have no deal." },
            { term: "Stakeholder", definition: "Persona que tiene interés o influencia en la decisión de compra.", example: "Who are the other stakeholders involved in this decision?" },
            { term: "Budget", definition: "Presupuesto disponible para la solución.", example: "Do you have a budget allocated for this, or would we need to build a business case?" },
            { term: "Timeline", definition: "Plazo en el que el prospect necesita resolver el problema.", example: "What's your timeline for making a decision on this?" },
            { term: "Champion", definition: "Persona dentro de la empresa del prospect que defiende tu solución internamente.", example: "Without an internal champion, deals stall — find someone who wants this to happen." },
          ],
          keyPhrases: [
            { phrase: "Can you walk me through how you currently handle...?", translation: "¿Puedes explicarme cómo gestionáis actualmente...?", context: "SPIN: pregunta de Situación. Entiende el estado actual sin asumir." },
            { phrase: "What's the biggest challenge you're facing with...?", translation: "¿Cuál es el mayor reto que tenéis con...?", context: "SPIN: pregunta de Problema. Va directo al dolor." },
            { phrase: "What happens if this doesn't get solved?", translation: "¿Qué pasa si esto no se resuelve?", context: "SPIN: pregunta de Implicación. Hace que el prospect dimensione el coste de no actuar." },
            { phrase: "How would it impact your team if you could...?", translation: "¿Cómo impactaría a tu equipo si pudierais...?", context: "SPIN: pregunta de Need-payoff. El prospect se vende la solución a sí mismo." },
            { phrase: "Who else would need to sign off on this?", translation: "¿Quién más tendría que aprobar esto?", context: "BANT: identifica a los decisores sin preguntar '¿eres tú quien decide?'" },
            { phrase: "Is there a budget already allocated, or would we need to build a case?", translation: "¿Hay presupuesto asignado, o necesitaríamos construir un business case?", context: "BANT: pregunta de presupuesto directa pero profesional." },
          ],
          exercise: {
            instruction: "Clasifica cada pregunta en su categoría SPIN correcta.",
            questions: [
              { question: "'What tools are you currently using for this?' es una pregunta de...", options: ["Situation", "Problem", "Implication"], correct: 0 },
              { question: "'What happens to your revenue if this issue continues?' es una pregunta de...", options: ["Situation", "Problem", "Implication"], correct: 2 },
              { question: "'What's been the most frustrating part of your current process?' es una pregunta de...", options: ["Situation", "Problem", "Need-payoff"], correct: 1 },
              { question: "'How would it change things if you could automate that entirely?' es una pregunta de...", options: ["Problem", "Implication", "Need-payoff"], correct: 2 },
              { question: "'Who else would need to be involved in evaluating this?' es una pregunta de...", options: ["Authority (BANT)", "Situation (SPIN)", "Need-payoff (SPIN)"], correct: 0 },
            ],
          },
        },
      },
      {
        slug: "escucha-activa-en-ventas",
        section: "Discovery Calls",
        title: "Escucha activa en ventas en inglés | aprendoingles.online",
        h1: "Escucha activa en ventas en inglés",
        metaDescription: "Técnicas de escucha activa en inglés para ventas: parafrasear, confirmar, profundizar y mostrar empatía con el cliente.",
        description: "Parafrasear, confirmar, profundizar y mostrar empatía. Las técnicas de active listening que cierran deals.",
        duration: "15 min",
        free: false,
        content: {
          intro: "Los mejores vendedores hablan menos del 40% de la llamada. El resto es escucha activa: no solo oír, sino demostrar que entiendes y profundizar en lo que el prospect realmente quiere decir. En inglés, hay frases específicas que señalan que estás escuchando de verdad y que invitan al prospect a abrirse más.",
          vocabulary: [
            { term: "Active listening", definition: "Escuchar con intención, procesando y respondiendo a lo que dice el otro.", example: "Active listening is the number one skill that separates top performers from average reps." },
            { term: "To paraphrase", definition: "Repetir lo que dijo el prospect con tus propias palabras para confirmar.", example: "Let me paraphrase what you just said to make sure I understand." },
            { term: "To mirror", definition: "Repetir las últimas 2-3 palabras del prospect para que siga hablando.", example: "Mirroring is the simplest technique — just repeat their last few words as a question." },
            { term: "To probe", definition: "Hacer preguntas de seguimiento para profundizar.", example: "When they mention a challenge, probe deeper — ask 'how so?' or 'can you give me an example?'" },
            { term: "To acknowledge", definition: "Reconocer lo que el prospect siente o dice antes de responder.", example: "Always acknowledge their concern before jumping to your solution." },
            { term: "Talk-to-listen ratio", definition: "Proporción entre el tiempo que hablas y el que escuchas.", example: "The ideal talk-to-listen ratio in discovery is 30:70 — you should listen twice as much as you talk." },
          ],
          keyPhrases: [
            { phrase: "So what I'm hearing is...", translation: "Entonces, lo que entiendo es...", context: "Parafraseo. Confirma tu comprensión y hace que el prospect se sienta escuchado." },
            { phrase: "That makes a lot of sense.", translation: "Eso tiene mucho sentido.", context: "Validación. Simple pero poderosa para construir rapport." },
            { phrase: "Can you tell me more about that?", translation: "¿Puedes contarme más sobre eso?", context: "Profundización abierta. Invita al prospect a expandir sin dirigir la respuesta." },
            { phrase: "How so?", translation: "¿Cómo es eso? / ¿En qué sentido?", context: "La pregunta de follow-up más corta y efectiva. Funciona siempre." },
            { phrase: "I can see why that would be frustrating.", translation: "Entiendo por qué eso sería frustrante.", context: "Empatía explícita. Reconoces la emoción, no solo el dato." },
            { phrase: "Just to make sure I've got this right...", translation: "Solo para asegurarme de que lo he entendido bien...", context: "Antes de parafrasear. Señala que te importa entenderlo correctamente." },
          ],
          exercise: {
            instruction: "Elige la mejor técnica de escucha activa para cada situación.",
            questions: [
              { question: "El prospect dice: 'Our current process takes way too long.' ¿Qué respondes?", options: ["I have the perfect solution for that.", "How so? Can you walk me through what the process looks like?", "That's common — most companies have that problem."], correct: 1 },
              { question: "El prospect explica un problema complejo. ¿Qué haces antes de responder?", options: ["Ofrecer tu solución inmediatamente.", "Parafrasear: 'So what I'm hearing is...'", "Cambiar de tema a preguntas de presupuesto."], correct: 1 },
              { question: "El prospect dice: '...and that's when things really fell apart.' ¿Qué técnica usas?", options: ["Mirroring: 'Things fell apart?'", "Ignorar y seguir con tu pitch.", "Preguntar por el presupuesto."], correct: 0 },
              { question: "¿Cuál es el talk-to-listen ratio ideal en una discovery call?", options: ["50:50", "70:30 (tú hablas más)", "30:70 (el prospect habla más)"], correct: 2 },
            ],
          },
        },
      },
      {
        slug: "cualificar-oportunidades",
        section: "Discovery Calls",
        title: "Cualificar oportunidades en inglés | aprendoingles.online",
        h1: "Cómo cualificar oportunidades comerciales en inglés",
        metaDescription: "Aprende a cualificar leads y oportunidades en inglés: preguntas de presupuesto, timeline, autoridad y necesidad real.",
        description: "Budget, timeline, authority y need. Aprende a decidir rápido si una oportunidad merece tu tiempo.",
        duration: "15 min",
        free: false,
        content: {
          intro: "No todo lead es una oportunidad real. Cualificar bien te ahorra semanas persiguiendo deals que nunca cerrarán. En inglés, las preguntas de cualificación requieren tacto: no puedes preguntar '¿tienes dinero?' directamente, pero necesitas la respuesta. Esta lección te enseña a obtener la información crítica sin sonar como un interrogatorio.",
          vocabulary: [
            { term: "Qualified lead", definition: "Lead que cumple los criterios mínimos para ser una oportunidad real.", example: "Only 25% of leads are qualified — the rest shouldn't enter your pipeline." },
            { term: "Disqualify", definition: "Determinar que un lead no es un buen fit y descartarlo.", example: "It's better to disqualify early than to waste two months on a dead deal." },
            { term: "Buying committee", definition: "Grupo de personas que participan en la decisión de compra.", example: "In enterprise sales, the buying committee can have 6 to 10 people." },
            { term: "Business case", definition: "Justificación económica y estratégica para una compra.", example: "Help your champion build a business case — don't make them do it alone." },
            { term: "Deal-breaker", definition: "Requisito que, si no se cumple, descarta la oportunidad.", example: "If they need on-premise deployment and we're cloud-only, that's a deal-breaker." },
            { term: "Pipeline", definition: "Conjunto de oportunidades en diferentes fases del proceso de venta.", example: "A healthy pipeline has 3x your quota in qualified opportunities." },
          ],
          keyPhrases: [
            { phrase: "What's driving the urgency on this?", translation: "¿Qué está creando la urgencia en esto?", context: "Descubre si hay un evento o deadline que empuje la compra." },
            { phrase: "Have you looked at other solutions?", translation: "¿Habéis mirado otras soluciones?", context: "Identifica competencia y nivel de madurez del proceso de compra." },
            { phrase: "What does the decision-making process look like on your end?", translation: "¿Cómo es vuestro proceso de toma de decisiones?", context: "Descubre quién decide sin preguntar directamente '¿tú decides?'" },
            { phrase: "Is this a funded initiative, or is it still in the planning stage?", translation: "¿Es una iniciativa con presupuesto asignado, o está aún en fase de planificación?", context: "Pregunta de presupuesto elegante. Distingue entre 'tenemos dinero' y 'estamos explorando'." },
            { phrase: "What would need to be true for you to move forward?", translation: "¿Qué tendría que ser cierto para que avanzarais?", context: "Pregunta de cierre indirecta. El prospect te dice sus condiciones de compra." },
          ],
          exercise: {
            instruction: "Elige la mejor forma de cualificar en cada situación.",
            questions: [
              { question: "Necesitas saber si tienen presupuesto. ¿Cómo preguntas?", options: ["What's your budget?", "Is this a funded initiative, or still in planning?", "How much money do you have?"], correct: 1 },
              { question: "El prospect dice que le interesa pero 'no tiene prisa'. ¿Qué haces?", options: ["Esperar a que te llame.", "Preguntar: 'What's driving the urgency — or what would create urgency?'", "Ofrecer un descuento por tiempo limitado."], correct: 1 },
              { question: "¿Cuál es la mejor señal de que una oportunidad NO está cualificada?", options: ["El prospect hace muchas preguntas.", "No hay un pain point claro ni urgencia.", "Quieren una demo antes de comprar."], correct: 1 },
            ],
          },
        },
      },

      // ── DEMOS Y PRESENTACIONES ──
      {
        slug: "estructurar-demo-producto",
        section: "Demos y Presentaciones",
        title: "Cómo estructurar una demo en inglés | aprendoingles.online",
        h1: "Cómo estructurar una demo de producto en inglés",
        metaDescription: "Estructura paso a paso para demos en inglés: apertura, agenda, demostración del valor, Q&A y cierre con next steps.",
        description: "Apertura, agenda, demostración del valor, Q&A y next steps. La estructura que hace que tus demos en inglés conviertan.",
        duration: "20 min",
        free: false,
        content: {
          intro: "Una demo no es un tour de producto: es una conversación donde demuestras cómo resuelves el problema específico del prospect. Los mejores vendedores en inglés no muestran todas las features — muestran las 2 o 3 que resuelven el pain point que descubrieron en la discovery call. Aquí aprenderás la estructura que usan los AEs en empresas SaaS de primer nivel.",
          vocabulary: [
            { term: "Walkthrough", definition: "Recorrido guiado por un producto o proceso.", example: "Let me give you a quick walkthrough of how the dashboard works." },
            { term: "Use case", definition: "Caso de uso: situación real en la que el producto resuelve un problema.", example: "This use case is very similar to what you described in our last call." },
            { term: "Feature", definition: "Funcionalidad específica del producto.", example: "I'll skip the features that aren't relevant to your workflow." },
            { term: "Benefit", definition: "El resultado positivo que una feature produce para el cliente.", example: "The feature is automated reporting — the benefit is you save 5 hours a week." },
            { term: "Agenda", definition: "Índice o plan de lo que vas a cubrir en la demo.", example: "Let me quickly set the agenda so we're aligned on what we'll cover." },
            { term: "Q&A", definition: "Ronda de preguntas y respuestas al final de la presentación.", example: "I'll leave 10 minutes at the end for Q&A." },
            { term: "Next steps", definition: "Acciones concretas que se acuerdan al final de la demo.", example: "Before we wrap up, let's align on next steps." },
          ],
          keyPhrases: [
            { phrase: "Before I dive in, let me quickly recap what we discussed last time.", translation: "Antes de empezar, déjame hacer un resumen rápido de lo que hablamos la última vez.", context: "Conecta la demo con la discovery. Demuestra que escuchaste." },
            { phrase: "Based on what you told me, I'm going to focus on...", translation: "Basándome en lo que me contaste, me voy a centrar en...", context: "Personaliza la demo. No es un tour genérico, es tu solución a su problema." },
            { phrase: "Let me show you how this works in practice.", translation: "Déjame enseñarte cómo funciona esto en la práctica.", context: "Transición de explicar a mostrar. La demo real empieza aquí." },
            { phrase: "Does this align with what you're looking for?", translation: "¿Esto encaja con lo que estáis buscando?", context: "Check-in durante la demo. No esperes al final para validar." },
            { phrase: "What questions do you have so far?", translation: "¿Qué preguntas tenéis hasta ahora?", context: "Mejor que '¿hay preguntas?' porque asume que sí las hay." },
            { phrase: "So in terms of next steps, I'd suggest...", translation: "En cuanto a próximos pasos, yo sugeriría...", context: "Cierre con propuesta de acción. No dejes que la demo termine sin un 'qué hacemos ahora'." },
          ],
          exercise: {
            instruction: "Ordena y elige las mejores prácticas para una demo en inglés.",
            questions: [
              { question: "¿Con qué deberías empezar una demo?", options: ["Mostrar el producto directamente.", "Recapitular lo que aprendiste en la discovery.", "Hablar de la historia de tu empresa."], correct: 1 },
              { question: "¿Qué es mejor decir durante la demo?", options: ["Our product has 47 features.", "Based on your challenge with X, let me show you how we solve that.", "This is our most popular feature."], correct: 1 },
              { question: "El prospect parece desconectado a mitad de la demo. ¿Qué haces?", options: ["Seguir adelante y terminar la presentación.", "Preguntar: 'Does this align with what you're looking for?'", "Hablar más rápido para mantener su atención."], correct: 1 },
              { question: "¿Cómo cierras una demo correctamente?", options: ["'Any questions?' y colgar.", "'So in terms of next steps, I'd suggest...'", "Enviar un email después con un resumen."], correct: 1 },
            ],
          },
        },
      },
      {
        slug: "features-vs-beneficios",
        section: "Demos y Presentaciones",
        title: "Features vs beneficios en inglés | aprendoingles.online",
        h1: "Cómo conectar features con beneficios en inglés",
        metaDescription: "Aprende a traducir características técnicas en beneficios para el cliente en inglés. Fórmulas, expresiones y ejemplos reales.",
        description: "Traduce features en beneficios reales. Las fórmulas y expresiones en inglés que transforman una demo técnica en una conversación de valor.",
        duration: "15 min",
        free: false,
        content: {
          intro: "Nadie compra features: compran resultados. 'We have AI-powered analytics' no vende nada. 'You'll know which deals are at risk before your team does' vende mucho. En esta lección aprenderás las fórmulas en inglés que convierten características técnicas en beneficios que el prospect entiende, recuerda y quiere.",
          vocabulary: [
            { term: "Feature", definition: "Lo que tu producto HACE. Es técnico y objetivo.", example: "Feature: real-time dashboard with customizable widgets." },
            { term: "Benefit", definition: "Lo que tu producto SIGNIFICA para el cliente. Es emocional y subjetivo.", example: "Benefit: you'll never walk into a meeting unprepared again." },
            { term: "ROI (Return on Investment)", definition: "Retorno de la inversión. Cuánto gana el cliente por cada euro que gasta.", example: "Can you quantify the ROI? That's what the CFO will ask." },
            { term: "Outcome", definition: "Resultado final que consigue el cliente.", example: "Focus on the outcome: they don't care about the tool, they care about the result." },
            { term: "So that...", definition: "Conector que transforma una feature en un beneficio.", example: "We automate your reporting, so that your team can focus on selling instead of admin work." },
            { term: "Which means...", definition: "Otro conector feature→beneficio, más conversacional.", example: "It integrates with your CRM natively, which means zero manual data entry." },
          ],
          keyPhrases: [
            { phrase: "[Feature], which means [benefit for them].", translation: "[Feature], lo que significa [beneficio para ellos].", context: "La fórmula básica. Funciona siempre: 'We have automated alerts, which means your team reacts in minutes, not hours.'" },
            { phrase: "What this means for you is...", translation: "Lo que esto significa para ti es...", context: "Transición explícita de feature a beneficio. Fuerza la conexión." },
            { phrase: "So instead of [current pain], you'll be able to [desired outcome].", translation: "Así que en vez de [dolor actual], podrás [resultado deseado].", context: "Contraste antes/después. Muy efectivo porque el prospect se ve en ambos escenarios." },
            { phrase: "Our customers typically see [specific result] within [timeframe].", translation: "Nuestros clientes suelen ver [resultado específico] en [plazo].", context: "Prueba social con datos. Más creíble que 'you'll get amazing results'." },
            { phrase: "I know [competitor] does X, but what makes us different is...", translation: "Sé que [competidor] hace X, pero lo que nos diferencia es...", context: "Diferenciación directa. Solo úsala si el prospect ha mencionado al competidor." },
          ],
          exercise: {
            instruction: "Transforma cada feature en un beneficio eligiendo la mejor opción.",
            questions: [
              { question: "'We have real-time analytics.' ¿Cuál es el beneficio?", options: ["Our analytics are very fast.", "You'll spot problems before they become crises.", "We process data in milliseconds."], correct: 1 },
              { question: "¿Qué conector transforma mejor una feature en beneficio?", options: ["And also...", "Which means...", "In addition..."], correct: 1 },
              { question: "'We integrate with 50+ tools.' ¿Cuál es el mejor beneficio?", options: ["We have many integrations.", "Your team won't waste time on manual data entry ever again.", "We support most platforms."], correct: 1 },
              { question: "¿Qué frase usa mejor el contraste antes/después?", options: ["Our product is better than what you have.", "So instead of spending 3 hours on reports, your team closes deals.", "We are the market leader."], correct: 1 },
            ],
          },
        },
      },
      {
        slug: "manejar-preguntas-dificiles",
        section: "Demos y Presentaciones",
        title: "Preguntas difíciles en demos en inglés | aprendoingles.online",
        h1: "Cómo manejar preguntas difíciles en demos en inglés",
        metaDescription: "Técnicas para responder preguntas difíciles durante demos en inglés: ganar tiempo, redirigir y ser honesto sin perder la venta.",
        description: "Ganar tiempo, redirigir y ser honesto sin perder la venta. Maneja preguntas comprometidas en inglés con profesionalidad.",
        duration: "15 min",
        free: false,
        content: {
          intro: "En medio de una demo, alguien pregunta algo que no sabes responder, o peor: algo que expone una limitación real de tu producto. Cómo manejas ese momento define si cierras o pierdes el deal. En inglés hay técnicas específicas para ganar tiempo, redirigir con elegancia y ser honesto sin destruir tu credibilidad.",
          vocabulary: [
            { term: "Curveball", definition: "Pregunta inesperada o difícil que te pilla desprevenido.", example: "The CTO threw a curveball about our security certifications — I wasn't ready for that." },
            { term: "To deflect", definition: "Redirigir una pregunta sin responderla directamente.", example: "He tried to deflect, but the prospect pushed back and asked again." },
            { term: "To park (a question)", definition: "Dejar una pregunta para más tarde, prometiendo volver a ella.", example: "Great question — let me park that for now and come back to it after the demo." },
            { term: "To buy time", definition: "Ganar tiempo antes de responder.", example: "Repeating the question back is a classic way to buy time." },
            { term: "Workaround", definition: "Alternativa o solución temporal cuando la feature no existe.", example: "We don't have that natively, but there's a workaround using our API." },
            { term: "To circle back", definition: "Volver a un tema que se dejó pendiente.", example: "Let me circle back to the security question you raised earlier." },
          ],
          keyPhrases: [
            { phrase: "That's a great question. Let me make sure I give you an accurate answer.", translation: "Gran pregunta. Déjame asegurarme de darte una respuesta precisa.", context: "Compra tiempo sin parecer que no sabes. Te da 5 segundos para pensar." },
            { phrase: "I want to be transparent with you — we don't have that today.", translation: "Quiero ser transparente — no tenemos eso hoy.", context: "Honestidad directa. Más creíble que intentar esquivarlo." },
            { phrase: "What we do have is..., which solves the same problem differently.", translation: "Lo que sí tenemos es..., que resuelve el mismo problema de otra forma.", context: "Redirige a lo que sí tienes después de ser honesto sobre lo que no." },
            { phrase: "Let me take that back to our team and get you a detailed answer by tomorrow.", translation: "Déjame llevar eso a nuestro equipo y darte una respuesta detallada mañana.", context: "Para preguntas técnicas que no puedes responder en el momento." },
            { phrase: "Can you help me understand why that's important for your use case?", translation: "¿Puedes ayudarme a entender por qué eso es importante para vuestro caso?", context: "Devuelve la pregunta. A veces lo que piden no es lo que realmente necesitan." },
          ],
          exercise: {
            instruction: "Elige la mejor respuesta para cada pregunta difícil en una demo.",
            questions: [
              { question: "El prospect pregunta por una feature que no tienes. ¿Qué dices?", options: ["Yes, we have that. (mentira)", "I want to be transparent — we don't have that today. What we do have is...", "That's on our roadmap. (sin saber si es verdad)"], correct: 1 },
              { question: "Te hacen una pregunta técnica que no sabes responder. ¿Qué haces?", options: ["Inventar una respuesta.", "Decir 'I don't know' y cambiar de tema.", "'Great question. Let me take that back to our team and get you a detailed answer by tomorrow.'"], correct: 2 },
              { question: "El prospect pide una integración muy específica. ¿Qué preguntas primero?", options: ["'How much would you pay for that?'", "'Can you help me understand why that's important for your use case?'", "'Nobody else has asked for that.'"], correct: 1 },
            ],
          },
        },
      },

      // ── NEGOCIACIÓN Y OBJECIONES ──
      {
        slug: "objeciones-de-precio",
        section: "Negociación y Objeciones",
        title: "Objeciones de precio en inglés | aprendoingles.online",
        h1: "Cómo manejar objeciones de precio en inglés",
        metaDescription: "Aprende a responder a 'It's too expensive' y otras objeciones de precio en inglés. Técnicas y frases que funcionan.",
        description: "'It's too expensive', 'We don't have budget'. Aprende a responder objeciones de precio en inglés sin bajar el precio.",
        duration: "20 min",
        free: false,
        content: {
          intro: "Cuando un prospect dice 'It's too expensive', casi nunca es una cuestión de precio: es una cuestión de valor percibido. Si entienden el ROI, el precio deja de ser un problema. En esta lección aprenderás las técnicas en inglés para reencuadrar la conversación de precio a valor, y las frases exactas para responder a cada tipo de objeción económica.",
          vocabulary: [
            { term: "Sticker shock", definition: "Reacción negativa inicial al ver el precio.", example: "Don't panic at sticker shock — it's a natural reaction, not a final objection." },
            { term: "To reframe", definition: "Cambiar la perspectiva desde la que se mira el precio.", example: "Reframe the cost as an investment: 'It's not $50K — it's $50K that saves you $200K.'" },
            { term: "Total cost of ownership (TCO)", definition: "Coste total incluyendo implementación, mantenimiento, tiempo, etc.", example: "The cheaper tool has a higher TCO when you factor in the hours your team wastes on manual work." },
            { term: "To anchor", definition: "Establecer un punto de referencia antes de dar el precio.", example: "Anchor to the cost of the problem before you reveal the price of the solution." },
            { term: "Discount", definition: "Descuento o reducción de precio.", example: "Don't offer a discount unless they give you something in return — a longer contract, faster timeline, or a case study." },
            { term: "ROI", definition: "Retorno de la inversión.", example: "If the ROI is clear, the price objection disappears." },
          ],
          keyPhrases: [
            { phrase: "I hear you — let's break down the numbers together.", translation: "Te entiendo — vamos a desglosar los números juntos.", context: "Acepta la preocupación y propón analizar el valor en detalle." },
            { phrase: "Compared to the cost of [the problem], this pays for itself in [timeframe].", translation: "Comparado con el coste de [el problema], esto se paga solo en [plazo].", context: "Reframe clásico: compara el precio con el coste de no hacer nada." },
            { phrase: "What would it mean for your team if [specific outcome]?", translation: "¿Qué significaría para tu equipo si [resultado específico]?", context: "Haz que el prospect calcule el valor mentalmente." },
            { phrase: "Is it the total price that concerns you, or is it the timing of the investment?", translation: "¿Es el precio total lo que te preocupa, o es el momento de la inversión?", context: "Distingue entre 'es caro' y 'no es el momento'. Son objeciones diferentes." },
            { phrase: "If budget weren't a factor, would this be the right solution for you?", translation: "Si el presupuesto no fuera un factor, ¿sería esta la solución correcta?", context: "Aísla la objeción de precio. Si dicen sí, solo necesitas resolver el funding." },
          ],
          exercise: {
            instruction: "Elige la mejor respuesta para cada objeción de precio.",
            questions: [
              { question: "El prospect dice: 'It's too expensive.' ¿Qué respondes?", options: ["We can give you a 20% discount.", "Compared to the cost of the problem you described, this pays for itself in 3 months.", "I understand. Let me know if you change your mind."], correct: 1 },
              { question: "'We don't have budget for this right now.' ¿Qué preguntas?", options: ["When will you have budget?", "Is it the total price, or the timing of the investment?", "What if I make it cheaper?"], correct: 1 },
              { question: "¿Cuándo es apropiado ofrecer un descuento?", options: ["Siempre que el prospect lo pida.", "Cuando el prospect ofrece algo a cambio: contrato más largo, cierre más rápido, case study.", "Nunca."], correct: 1 },
            ],
          },
        },
      },
      {
        slug: "objeciones-comunes",
        section: "Negociación y Objeciones",
        title: "Objeciones comunes en ventas en inglés | aprendoingles.online",
        h1: "Objeciones comunes en ventas en inglés y cómo responderlas",
        metaDescription: "Las 10 objeciones más comunes en ventas B2B en inglés y las respuestas que mantienen la conversación abierta.",
        description: "'We're happy with our current solution', 'Send me an email', 'Now is not a good time'. Las objeciones más frecuentes y cómo responderlas.",
        duration: "20 min",
        free: false,
        content: {
          intro: "Las objeciones no son rechazos: son preguntas disfrazadas. Cuando alguien dice 'We're happy with our current provider', lo que realmente dice es 'No me has dado una razón suficiente para cambiar'. En esta lección vas a aprender las objeciones más comunes en ventas B2B en inglés y las respuestas probadas que mantienen la conversación viva.",
          vocabulary: [
            { term: "Objection handling", definition: "El proceso de responder a las preocupaciones del prospect para avanzar en la venta.", example: "Good objection handling isn't about winning arguments — it's about understanding concerns." },
            { term: "Pushback", definition: "Resistencia o rechazo inicial a una propuesta.", example: "Getting pushback is normal — it means they're engaged enough to respond." },
            { term: "Status quo", definition: "La situación actual del prospect. El mayor competidor de cualquier vendedor.", example: "Your biggest competitor isn't another vendor — it's the status quo." },
            { term: "Brush-off", definition: "Objeción superficial para quitarte de encima, no una preocupación real.", example: "'Send me an email' is usually a brush-off, not a genuine request." },
            { term: "Legitimate concern", definition: "Preocupación real y válida que merece una respuesta seria.", example: "'How do you handle data privacy?' is a legitimate concern, not a brush-off." },
            { term: "To overcome (an objection)", definition: "Resolver una objeción para que el prospect avance.", example: "You don't overcome objections by arguing — you overcome them by understanding." },
          ],
          keyPhrases: [
            { phrase: "That's fair. A lot of our best customers said the same thing before switching.", translation: "Es justo. Muchos de nuestros mejores clientes dijeron lo mismo antes de cambiar.", context: "Para 'We're happy with our current solution'. Normaliza la objeción y planta curiosidad." },
            { phrase: "I get it — timing is everything. Can I ask what would need to change for this to become a priority?", translation: "Lo entiendo — el timing lo es todo. ¿Puedo preguntar qué tendría que cambiar para que esto fuera prioridad?", context: "Para 'Now is not a good time'. Obtiene información sobre su ciclo de compra." },
            { phrase: "I'd rather not waste your time with an email you'll forget — can I have 30 seconds to explain why I called?", translation: "Prefiero no hacerte perder el tiempo con un email que olvidarás — ¿me das 30 segundos para explicar por qué llamo?", context: "Para 'Send me an email'. Asertivo pero respetuoso." },
            { phrase: "Totally understand. Out of curiosity, what made you go with [competitor]?", translation: "Totalmente comprensible. Por curiosidad, ¿qué os hizo elegir [competidor]?", context: "Para 'We already use [competitor]'. Obtiene información competitiva." },
            { phrase: "I wouldn't expect you to make a decision today — I'm just looking to see if there's a fit.", translation: "No esperaría que tomarais una decisión hoy — solo quiero ver si encajamos.", context: "Para 'I need to think about it'. Baja la presión." },
          ],
          exercise: {
            instruction: "Elige la mejor respuesta para cada objeción.",
            questions: [
              { question: "'We're happy with our current provider.' ¿Qué respondes?", options: ["Our product is better.", "That's fair — a lot of our best customers said the same thing before switching.", "OK, sorry to bother you."], correct: 1 },
              { question: "'Send me an email.' ¿Qué haces?", options: ["Enviar un email genérico.", "Decir: 'I'd rather not waste your time with an email — can I have 30 seconds?'", "Colgar y pasar al siguiente."], correct: 1 },
              { question: "'I need to think about it.' ¿Cuál es la mejor respuesta?", options: ["Take your time.", "I wouldn't expect a decision today — I'm just looking to see if there's a fit. What's your biggest hesitation?", "What's there to think about?"], correct: 1 },
              { question: "'Now is not a good time.' ¿Qué preguntas?", options: ["When is a good time?", "What would need to change for this to become a priority?", "Can I call you next month?"], correct: 1 },
            ],
          },
        },
      },
      {
        slug: "negociar-condiciones",
        section: "Negociación y Objeciones",
        title: "Negociar condiciones comerciales en inglés | aprendoingles.online",
        h1: "Cómo negociar condiciones comerciales en inglés",
        metaDescription: "Técnicas de negociación comercial en inglés: descuentos, plazos, términos de contrato y acuerdos win-win.",
        description: "Descuentos, plazos, términos de contrato. Negocia condiciones en inglés y llega a acuerdos win-win.",
        duration: "15 min",
        free: false,
        content: {
          intro: "Negociar en inglés no es regatear: es encontrar un acuerdo donde ambas partes ganan. Los mejores negociadores no ceden — intercambian. Cada concesión que haces debería venir acompañada de algo a cambio. En esta lección aprenderás el vocabulario y las tácticas de negociación comercial en inglés.",
          vocabulary: [
            { term: "Concession", definition: "Algo que cedes en una negociación.", example: "Never give a concession without getting something in return." },
            { term: "Leverage", definition: "Ventaja o poder de negociación.", example: "If they need to close by end of quarter, that gives you leverage on terms." },
            { term: "Win-win", definition: "Acuerdo que beneficia a ambas partes.", example: "The best deals are win-win — if one side feels cheated, the relationship won't last." },
            { term: "Terms", definition: "Condiciones del acuerdo: precio, plazos, pagos, etc.", example: "We can be flexible on terms if you commit to a longer contract." },
            { term: "To counter (an offer)", definition: "Hacer una contraoferta.", example: "They asked for 30% off — I countered with 10% off for a 2-year commitment." },
            { term: "BATNA", definition: "Best Alternative To a Negotiated Agreement. Tu mejor alternativa si no llegas a un acuerdo.", example: "Know your BATNA before entering any negotiation — it's your walk-away point." },
          ],
          keyPhrases: [
            { phrase: "I can work with that, but I'd need [something in return].", translation: "Puedo trabajar con eso, pero necesitaría [algo a cambio].", context: "Regla de oro: nunca cedes sin pedir algo. 'I can do 15% off, but I'd need a 2-year commitment.'" },
            { phrase: "What if we structured it as...?", translation: "¿Y si lo estructuramos como...?", context: "Propón alternativas creativas en vez de ceder en precio." },
            { phrase: "I want to find something that works for both of us.", translation: "Quiero encontrar algo que funcione para los dos.", context: "Establece tono colaborativo, no adversarial." },
            { phrase: "That's outside what I can approve, but let me see what I can do.", translation: "Eso está fuera de lo que puedo aprobar, pero déjame ver qué puedo hacer.", context: "Muestra disposición sin comprometerte. Te da tiempo para consultar." },
            { phrase: "If we can agree on [X], I can be more flexible on [Y].", translation: "Si podemos acordar [X], puedo ser más flexible en [Y].", context: "Intercambio explícito. Transparente y justo." },
          ],
          exercise: {
            instruction: "Elige la mejor táctica de negociación para cada situación.",
            questions: [
              { question: "El prospect pide un 30% de descuento. ¿Qué haces?", options: ["Aceptar para cerrar rápido.", "Contraoferta: 'I can do 15% off for a 2-year commitment.'", "Decir que no y no negociar."], correct: 1 },
              { question: "No puedes bajar el precio. ¿Qué alternativa ofreces?", options: ["Nothing — take it or leave it.", "What if we structured the payment over 12 months instead?", "I'll throw in a free t-shirt."], correct: 1 },
              { question: "¿Cuál es la regla de oro de la negociación?", options: ["El cliente siempre tiene razón.", "Never give a concession without getting something in return.", "Cierra lo más rápido posible."], correct: 1 },
            ],
          },
        },
      },

      // ── CLOSING ──
      {
        slug: "detectar-senales-compra",
        section: "Closing",
        title: "Señales de compra en inglés | aprendoingles.online",
        h1: "Cómo detectar señales de compra en inglés",
        metaDescription: "Aprende a identificar buying signals en conversaciones en inglés: frases, preguntas y comportamientos que indican que el cliente está listo.",
        description: "Frases, preguntas y comportamientos que indican que el prospect está listo para comprar. Detecta buying signals en inglés.",
        duration: "15 min",
        free: false,
        content: {
          intro: "Un buying signal es cualquier cosa que el prospect dice o hace que indica que está mentalmente avanzando hacia la compra. Puede ser una pregunta sobre implementación, una referencia al 'cuando' en vez de al 'si', o pedir hablar con su equipo sobre tu propuesta. Si no detectas estas señales, seguirás vendiendo cuando deberías estar cerrando.",
          vocabulary: [
            { term: "Buying signal", definition: "Indicación verbal o no verbal de que el prospect está listo para avanzar.", example: "When they ask about implementation timeline, that's a strong buying signal." },
            { term: "Trial close", definition: "Intento suave de cierre para medir la temperatura.", example: "A trial close helps you gauge readiness without being pushy." },
            { term: "Green light", definition: "Señal clara de que puedes avanzar.", example: "When the CFO asks about payment terms, that's a green light." },
            { term: "Implementation", definition: "Proceso de poner en marcha la solución.", example: "'How long does implementation take?' is a buying signal — they're imagining using it." },
            { term: "Procurement", definition: "Departamento o proceso de compras en una empresa.", example: "Once procurement gets involved, the deal is real — they don't waste time on maybes." },
          ],
          keyPhrases: [
            { phrase: "It sounds like you're ready to move forward — what would the next step look like on your end?", translation: "Parece que estáis listos para avanzar — ¿cuál sería el siguiente paso por vuestra parte?", context: "Trial close suave. No pides la firma, pides el proceso." },
            { phrase: "Based on everything we've discussed, it seems like this is a strong fit. Would you agree?", translation: "Basándonos en todo lo que hemos hablado, parece un buen encaje. ¿Estás de acuerdo?", context: "Busca confirmación explícita antes de proponer el cierre." },
            { phrase: "When were you looking to have this up and running?", translation: "¿Para cuándo queríais tener esto funcionando?", context: "Pregunta de timeline que asume la compra. Si responden con una fecha, están comprando." },
            { phrase: "Shall I send over the agreement?", translation: "¿Os envío el acuerdo?", context: "Cierre directo y simple. Solo funciona después de confirmar buying signals claros." },
          ],
          exercise: {
            instruction: "Identifica qué frases del prospect son buying signals.",
            questions: [
              { question: "'How long does implementation typically take?' ¿Es buying signal?", options: ["No, es solo curiosidad.", "Sí — está imaginando usar el producto.","No, es una objeción disfrazada."], correct: 1 },
              { question: "'Can you send me the pricing?' ¿Es buying signal?", options: ["Sí — quiere evaluar números reales.", "No — todo el mundo pide pricing.", "Depende del tono."], correct: 0 },
              { question: "'We'd need to involve our IT team.' ¿Es buying signal?", options: ["No — es una barrera.", "Sí — está pensando en cómo hacerlo funcionar internamente.", "Ni sí ni no."], correct: 1 },
              { question: "¿Cuál de estas frases NO es un buying signal?", options: ["'What does onboarding look like?'", "'Can you send me some information?' (en una cold call)", "'When could we start?'"], correct: 1 },
            ],
          },
        },
      },
      {
        slug: "tecnicas-de-closing",
        section: "Closing",
        title: "Técnicas de closing en inglés | aprendoingles.online",
        h1: "Técnicas de closing en inglés que funcionan",
        metaDescription: "Las mejores técnicas de cierre de ventas en inglés: assumptive close, summary close, urgency close y cómo pedir la firma.",
        description: "Assumptive close, summary close, urgency close. Las técnicas para pedir el cierre en inglés de forma natural.",
        duration: "20 min",
        free: false,
        content: {
          intro: "Cerrar no es presionar: es guiar al prospect al siguiente paso lógico cuando ambos sabéis que encaja. El problema de muchos vendedores es que nunca piden el cierre explícitamente — esperan que el prospect diga 'vale, lo compro' sin que nadie se lo pida. En inglés, hay formas profesionales y naturales de pedir el cierre sin sonar agresivo.",
          vocabulary: [
            { term: "Assumptive close", definition: "Cierre que asume que el prospect va a comprar y pasa directo a los detalles.", example: "'Should we start with the annual plan?' — that's an assumptive close." },
            { term: "Summary close", definition: "Resumen de todo lo acordado antes de pedir la decisión.", example: "The summary close works well when the sales cycle has been long and you need to reconnect all the dots." },
            { term: "Urgency close", definition: "Crear sentido de urgencia legítima para acelerar la decisión.", example: "An urgency close only works if the urgency is real — fake scarcity kills trust." },
            { term: "To ask for the business", definition: "Pedir explícitamente que el prospect se comprometa.", example: "At some point, you just have to ask for the business." },
            { term: "To close the deal", definition: "Cerrar la venta.", example: "We closed the deal in 23 days — that's a record for enterprise." },
            { term: "Verbal agreement", definition: "Acuerdo verbal antes de firmar el contrato.", example: "Get a verbal agreement first, then send the paperwork." },
          ],
          keyPhrases: [
            { phrase: "Based on everything we've covered, I think we're ready to move forward. I'll send the agreement over today — does that work?", translation: "Basándonos en todo lo que hemos cubierto, creo que estamos listos para avanzar. Envío el acuerdo hoy — ¿os funciona?", context: "Assumptive close. Suave pero directo." },
            { phrase: "Let me recap: you need [X], by [date], and we've agreed on [terms]. Shall I draft the contract?", translation: "Déjame recapitular: necesitáis [X], para [fecha], y hemos acordado [condiciones]. ¿Preparo el contrato?", context: "Summary close. Perfecto después de un proceso largo." },
            { phrase: "I want to be upfront — this pricing is valid until end of quarter.", translation: "Quiero ser directo — este precio es válido hasta fin de trimestre.", context: "Urgency close legítima. Solo si es verdad." },
            { phrase: "What's holding you back from moving forward?", translation: "¿Qué te frena para avanzar?", context: "Cuando sientes que el prospect quiere pero no se decide. Abre la puerta a la última objeción." },
            { phrase: "Is there anything else you need from me to make a decision?", translation: "¿Necesitas algo más de mi parte para tomar una decisión?", context: "Pone la pelota en su campo y te dice exactamente qué falta." },
          ],
          exercise: {
            instruction: "Identifica la mejor técnica de closing para cada situación.",
            questions: [
              { question: "Llevas 2 meses de proceso, 4 reuniones, y el prospect ha dicho que encaja. ¿Qué técnica usas?", options: ["Urgency close.", "Summary close: recap todo y pide el contrato.", "Esperar a que el prospect se decida solo."], correct: 1 },
              { question: "El pricing especial caduca en 2 semanas y es real. ¿Qué dices?", options: ["Buy now or lose the deal forever.", "I want to be upfront — this pricing is valid until the 30th.", "I'll extend the offer indefinitely."], correct: 1 },
              { question: "Todo apunta a que van a comprar pero no dan el paso. ¿Qué preguntas?", options: ["So, deal?", "What's holding you back from moving forward?", "Do I need to talk to your boss?"], correct: 1 },
            ],
          },
        },
      },
      {
        slug: "follow-up-post-venta",
        section: "Closing",
        title: "Follow-up post-venta en inglés | aprendoingles.online",
        h1: "Follow-up post-venta y onboarding del cliente en inglés",
        metaDescription: "Cómo hacer seguimiento post-venta en inglés: emails de bienvenida, onboarding, check-ins y gestión de la relación a largo plazo.",
        description: "Emails de bienvenida, onboarding, check-ins y gestión de la relación. El inglés del post-venta que fideliza y genera referrals.",
        duration: "15 min",
        free: false,
        content: {
          intro: "La venta no termina con la firma: empieza. El post-venta es donde construyes la relación que genera renewals, upsells y referrals. En inglés, los primeros 30 días después de cerrar son críticos: el tono de tus emails de onboarding, tus check-ins y tu seguimiento define si el cliente se queda años o se va al primer problema.",
          vocabulary: [
            { term: "Onboarding", definition: "Proceso de bienvenida y puesta en marcha del cliente nuevo.", example: "A smooth onboarding sets the tone for the entire relationship." },
            { term: "Check-in", definition: "Contacto periódico para ver cómo va todo.", example: "I do a check-in call 30 days after go-live to make sure everything is running smoothly." },
            { term: "Renewal", definition: "Renovación del contrato al terminar el periodo.", example: "If onboarding goes well, the renewal conversation is easy." },
            { term: "Upsell", definition: "Vender un plan superior o funcionalidades adicionales a un cliente existente.", example: "The best time to upsell is after the customer has seen real results." },
            { term: "Referral", definition: "Recomendación de un cliente satisfecho a otra empresa.", example: "Happy customers are your best source of referrals — but you have to ask." },
            { term: "NPS (Net Promoter Score)", definition: "Métrica de satisfacción del cliente.", example: "Our NPS went from 40 to 72 after we improved our onboarding process." },
          ],
          keyPhrases: [
            { phrase: "Welcome aboard! Here's what to expect in the first 30 days.", translation: "¡Bienvenido! Esto es lo que puedes esperar en los primeros 30 días.", context: "Email de bienvenida. Establece expectativas claras desde el día 1." },
            { phrase: "Just checking in to see how things are going since we went live.", translation: "Solo contacto para ver cómo van las cosas desde que arrancamos.", context: "Check-in post-implementación. Informal pero muestra que te importa." },
            { phrase: "Is there anything we could be doing better?", translation: "¿Hay algo que podríamos hacer mejor?", context: "Pregunta de feedback. Demuestra humildad y orientación al cliente." },
            { phrase: "Based on the results you're seeing, have you considered [upsell]?", translation: "Basándome en los resultados que estáis viendo, ¿habéis considerado [upsell]?", context: "Upsell natural basado en datos reales del cliente." },
            { phrase: "You mentioned things are going great — would you be open to sharing your experience with a colleague?", translation: "Mencionaste que las cosas van genial — ¿estarías abierto a compartir tu experiencia con un colega?", context: "Pedir referral. Solo cuando el cliente está genuinamente contento." },
          ],
          exercise: {
            instruction: "Elige el mejor momento y frase para cada acción post-venta.",
            questions: [
              { question: "¿Cuándo es el mejor momento para el primer check-in post-venta?", options: ["La misma semana del cierre.", "30 días después del go-live.", "Cuando toque renovar."], correct: 1 },
              { question: "¿Cuándo es apropiado pedir un referral?", options: ["Justo después de firmar el contrato.", "Cuando el cliente ha visto resultados reales y está contento.", "Nunca — es incómodo."], correct: 1 },
              { question: "El cliente dice que todo va bien en el check-in. ¿Qué preguntas?", options: ["Nothing — great, bye!", "Is there anything we could be doing better?", "Can I upsell you something?"], correct: 1 },
              { question: "¿Cuál es la mejor forma de proponer un upsell?", options: ["'We have a new product you should buy.'", "'Based on the results you're seeing, have you considered...?'", "'Your contract allows for upgrades.'"], correct: 1 },
            ],
          },
        },
      },
    ],
  },
};

export function getCurriculum(courseSlug: string): Curriculum | undefined {
  return curricula[courseSlug];
}

export function getLesson(courseSlug: string, lessonSlug: string): Lesson | undefined {
  return curricula[courseSlug]?.lessons.find((l) => l.slug === lessonSlug);
}
