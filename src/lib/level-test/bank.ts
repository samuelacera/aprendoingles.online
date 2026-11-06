/**
 * Question bank of the level test (/test-nivel).
 *
 * Each item has a CEFR level (1 = A1 … 5 = C1) and a kind:
 *   grammar  — structures, tenses, conditionals
 *   idiom    — workplace slang, idioms and phrasal verbs (answers in Spanish)
 *   reading  — a short real-life text and a comprehension question
 *   sector   — technical vocabulary of the user's sector family
 *   listening — an audio clip (public/audio/test-nivel/) and a question
 *
 * The correct option is ALWAYS the first one in `options`; the UI shuffles
 * them. Edit or add items freely, but never reuse an `id`: results are stored
 * by id in learning_profiles.answers.
 */

export type Kind = "grammar" | "idiom" | "reading" | "sector" | "listening";
export type Family = "business" | "marketing" | "sales" | "tech" | "finance" | "health";
export type Level = 1 | 2 | 3 | 4 | 5;

export interface Item {
  id: string;
  level: Level;
  kind: Kind;
  family?: Family;
  /** Text shown above the prompt (an email, a message…). */
  context?: string;
  prompt: string;
  options: string[];
  /** One line in Spanish, shown when reviewing mistakes. */
  why: string;
}

export interface ListeningItem extends Item {
  kind: "listening";
  audio: string;
  speaker: string;
  transcript: string;
}

export const CEFR = ["", "A1", "A2", "B1", "B2", "C1"] as const;

/** Sanity category slug → family of sector questions. */
export const FAMILY_BY_CATEGORY: Record<string, Family> = {
  negocios: "business",
  "recursos-humanos": "business",
  "sector-publico": "business",
  transversales: "business",
  educacion: "business",
  marketing: "marketing",
  "arte-cultura": "marketing",
  ventas: "sales",
  turismo: "sales",
  tecnologia: "tech",
  ingenieria: "tech",
  ciencia: "tech",
  arquitectura: "tech",
  finanzas: "finance",
  derecho: "finance",
  salud: "health",
};

export const familyOf = (categorySlug?: string | null): Family =>
  (categorySlug && FAMILY_BY_CATEGORY[categorySlug]) || "business";

const g = (id: string, level: Level, prompt: string, options: string[], why: string): Item => ({
  id, level, kind: "grammar", prompt, options, why,
});
const i = (id: string, level: Level, prompt: string, options: string[], why: string): Item => ({
  id, level, kind: "idiom", prompt, options, why,
});
const r = (id: string, level: Level, context: string, prompt: string, options: string[], why: string): Item => ({
  id, level, kind: "reading", context, prompt, options, why,
});
const s = (family: Family) => (id: string, level: Level, prompt: string, options: string[], why: string): Item => ({
  id, level, kind: "sector", family, prompt, options, why,
});

export const GRAMMAR: Item[] = [
  g("g1", 1, "She ___ in the marketing department.", ["works", "work", "working", "is work"], "Tercera persona del presente simple: she works."),
  g("g2", 1, "___ you send me the file yesterday?", ["Did", "Do", "Have", "Were"], "Pregunta en pasado simple (yesterday): Did you send…?"),
  g("g3", 2, "I ___ for this company since 2019.", ["have worked", "work", "am working", "worked"], "Since + algo que sigue hoy → present perfect."),
  g("g4", 2, "Today's meeting was ___ than last week's.", ["longer", "more long", "longest", "more longer"], "Comparativo de un adjetivo corto: long → longer."),
  g("g5", 3, "If the client ___ the offer, we'll start next week.", ["accepts", "will accept", "accepted", "would accept"], "Primer condicional: if + presente, will + verbo."),
  g("g6", 3, "The report ___ by the finance team every month.", ["is prepared", "prepares", "is preparing", "has prepare"], "Pasiva en presente: is + participio."),
  g("g7", 4, "If we had launched earlier, we ___ more market share.", ["would have gained", "would gain", "had gained", "will have gained"], "Tercer condicional: if + had + participio, would have + participio."),
  g("g8", 4, "I'm not used to ___ presentations in English.", ["giving", "give", "gave", "have given"], "Be used to + -ing (estar acostumbrado a)."),
  g("g9", 5, "Not only ___ the deadline, but they also went over budget.", ["did they miss", "they missed", "they did miss", "missed they"], "Tras «Not only» al principio, se invierte: did they miss."),
  g("g10", 5, "It's high time we ___ our pricing strategy.", ["reviewed", "review", "will review", "have reviewed"], "It's (high) time + pasado: algo que ya deberíamos estar haciendo."),
];

export const IDIOMS: Item[] = [
  i("i1", 1, "A colleague holds the door for you and you say «Cheers!». What do you mean?", ["Gracias", "Salud, brindemos", "Adiós", "Perdón"], "En Reino Unido, «cheers» se usa a diario como «gracias»."),
  i("i2", 1, "Your boss writes: «I need it ASAP». When?", ["Lo antes posible", "A final de semana", "Cuando puedas", "Mañana por la tarde"], "ASAP = as soon as possible."),
  i("i3", 2, "«OK team, let's call it a day.» What does it mean?", ["Dejémoslo por hoy", "Llamemos al cliente", "Pongamos fecha", "Hoy es un gran día"], "Call it a day: dar por terminada la jornada."),
  i("i4", 2, "«I'll touch base with you tomorrow.» What does it mean?", ["Mañana te escribo para ponernos al día", "Mañana visito la sede", "Mañana tocamos el tema en la reunión", "Mañana te mando la base de datos"], "Touch base: contactar brevemente para ponerse al día."),
  i("i5", 3, "«Can you give me a ballpark figure?» What do they want?", ["Una cifra aproximada", "El número exacto", "Las cifras del estadio", "Una cifra optimista"], "Ballpark figure: una estimación aproximada."),
  i("i6", 3, "«Let's not reinvent the wheel.» What does it mean?", ["No compliquemos lo que ya funciona", "Empecemos desde cero", "Cambiemos de proveedor", "Hagamos un producto nuevo"], "Reinvent the wheel: perder tiempo creando algo que ya existe."),
  i("i7", 4, "«We need to get our ducks in a row before the audit.» What does it mean?", ["Tenerlo todo organizado", "Contratar a más gente", "Reducir costes", "Llegar los primeros"], "Get your ducks in a row: tenerlo todo en orden."),
  i("i8", 4, "«Honestly, that proposal is a non-starter.» What does it mean?", ["No tiene ninguna posibilidad", "Es un buen punto de partida", "Todavía no ha empezado", "Es para principiantes"], "Non-starter: una idea que no va a salir adelante."),
  i("i9", 5, "«He keeps throwing me under the bus in meetings.» What is he doing?", ["Dejarme en mal lugar para salvarse él", "Ayudarme a avanzar", "Interrumpirme", "Defenderme delante del jefe"], "Throw someone under the bus: sacrificar a alguien para cubrirse."),
  i("i10", 5, "«It's not rocket science, but let's not cut corners.» What should we avoid?", ["Hacerlo mal por ahorrar tiempo o dinero", "Recortar el presupuesto", "Coger un atajo en coche", "Saltarnos una reunión"], "Cut corners: hacer algo deprisa y mal para ahorrar."),
];

export const READING: Item[] = [
  r("r1", 1, "Hi Tom, I can't come to the meeting today. I'm sick. Sorry! — Ana", "Why isn't Ana at the meeting?", ["She is ill.", "She is on holiday.", "She is late.", "She has another meeting."], "«I'm sick» = estoy enferma (ill)."),
  r("r2", 2, "Dear team, the office will be closed on Friday for maintenance. Please work from home and keep your phones on.", "What should the team do on Friday?", ["Work from home.", "Go to the office early.", "Take the day off.", "Repair the office."], "«Please work from home»: trabajar desde casa, no tener el día libre."),
  r("r3", 3, "Following our call, I've attached the revised quote. Please note that the 10% discount only applies if the order is confirmed before the end of the month.", "When does the client get the discount?", ["If they confirm the order before the month ends.", "On any order this year.", "Only on orders over 10 units.", "Right after the call."], "«Only applies if… before the end of the month»: solo si confirman antes de fin de mes."),
  r("r4", 4, "While the pilot exceeded expectations in terms of user engagement, retention figures were underwhelming, which suggests the novelty effect may have played a larger role than anticipated.", "What does the writer suggest?", ["People may have used it mainly because it was new.", "Retention was better than engagement.", "The pilot failed completely.", "The team expected low engagement."], "«Novelty effect»: la gente lo usó por la novedad, pero no se quedó."),
  r("r5", 5, "Notwithstanding the board's endorsement, the merger remains contingent upon regulatory clearance, which, given the current climate, is by no means a foregone conclusion.", "What is the status of the merger?", ["It depends on the regulators, and approval is uncertain.", "The board has cancelled it.", "It is certain to go ahead.", "The regulators have already approved it."], "«Contingent upon… by no means a foregone conclusion»: depende del regulador y no está nada claro."),
];

const biz = s("business");
const mkt = s("marketing");
const sal = s("sales");
const tec = s("tech");
const fin = s("finance");
const hea = s("health");

export const SECTOR: Item[] = [
  // Negocios, RR. HH., sector público, educación, transversales
  biz("b1", 1, "Please send me the ___ for the meeting: what topics will we discuss?", ["agenda", "diary", "calendar", "menu"], "Agenda (inglés) = orden del día. «Diary» es la agenda donde apuntas citas."),
  biz("b2", 1, "My ___ is the person in charge of our department.", ["manager", "worker", "client", "supplier"], "Manager: tu responsable."),
  biz("b3", 2, "Can we ___ the meeting to next Tuesday? I'm travelling on Monday.", ["move", "remove", "cancel", "change of"], "Move a meeting (to): cambiarla de fecha."),
  biz("b4", 2, "We need to hire more ___ for the new office.", ["staff", "staffs", "personals", "personal"], "Staff es incontable y «personal» en inglés significa «personal/privado»."),
  biz("b5", 3, "Let's ___ the key points before we finish the call.", ["sum up", "sum on", "add up to", "put up"], "Sum up: resumir."),
  biz("b6", 3, "The new policy will be ___ in all branches from January.", ["implemented", "implicated", "impressed", "employed"], "Implement a policy: ponerla en marcha."),
  biz("b7", 4, "Nobody is responsible for this project. Someone needs to take ___ of it.", ["ownership", "owner", "owning", "property"], "Take ownership of: hacerse responsable de algo."),
  biz("b8", 4, "Our departments work in ___: nobody shares information.", ["silos", "stocks", "cells", "boxes"], "Work in silos: trabajar aislados, sin compartir."),
  biz("b9", 5, "The board decided to ___ the restructuring plan until next year.", ["shelve", "shell", "shelter", "shed"], "Shelve a plan: aparcarlo."),
  biz("b10", 5, "We need to ___ these complaints in the bud before they escalate.", ["nip", "cut", "kill", "stop"], "Nip something in the bud: cortarlo de raíz."),

  // Marketing, comunicación, cultura
  mkt("m1", 1, "We shared a new ___ on Instagram today: a photo of the product.", ["post", "poster", "letter", "page"], "Post: una publicación en redes."),
  mkt("m2", 1, "Our target ___ is young people aged 18 to 25.", ["audience", "public", "people group", "listeners"], "Target audience: público objetivo. «Public» es un falso amigo aquí."),
  mkt("m3", 2, "The ad had a high ___ rate: lots of people clicked on it.", ["click-through", "click-on", "clicking-in", "through-click"], "Click-through rate (CTR): porcentaje de clics."),
  mkt("m4", 2, "The landing page needs a clear ___ at the end, like «Start your free trial».", ["call to action", "action call", "call for act", "calling action"], "Call to action (CTA): la llamada a la acción."),
  mkt("m5", 3, "Before launching, let's ___ two headlines to see which one performs better.", ["A/B test", "double-check", "cross-test", "split up"], "A/B test: comparar dos versiones con tráfico real."),
  mkt("m6", 3, "Our brand ___ has grown: more people recognise our logo.", ["awareness", "consciousness", "knowledge", "notice"], "Brand awareness: notoriedad de marca."),
  mkt("m7", 4, "The campaign really ___ with Gen Z, but older audiences ignored it.", ["resonated", "sounded", "echoed", "rang"], "Resonate with: conectar con un público."),
  mkt("m8", 4, "We have a problem with cart ___: people add products and leave.", ["abandonment", "leaving", "dropping", "abandon"], "Cart abandonment: abandono del carrito."),
  mkt("m9", 5, "The rebrand ___ many of the company's loyal customers.", ["alienated", "alienized", "estranged off", "aliened"], "Alienate: alejar o enfadar a alguien que estaba de tu lado."),
  mkt("m10", 5, "Their message is so ___ that nobody remembers what they actually sell.", ["watered-down", "watered-up", "washed-in", "diluting"], "Watered-down: descafeinado, sin fuerza."),

  // Ventas, atención al cliente, turismo
  sal("s1", 1, "The customer wants to know the ___ of the product.", ["price", "prize", "award", "money"], "Price: precio. «Prize» es un premio."),
  sal("s2", 1, "Can I ___ you with anything else?", ["help", "helping", "to help", "helped"], "Can I + verbo sin «to»: Can I help you?"),
  sal("s3", 2, "We offer a 15% ___ on orders over 100 units.", ["discount", "descent", "deduction off", "decline"], "Discount: descuento."),
  sal("s4", 2, "I'll ___ up with an email after the call.", ["follow", "go", "keep", "come"], "Follow up: hacer seguimiento."),
  sal("s5", 3, "The client raised an ___ about the price, so I explained the long-term savings.", ["objection", "objective", "obstacle", "object"], "Raise an objection: poner una objeción."),
  sal("s6", 3, "We need more qualified ___ in the pipeline this month.", ["leads", "leaders", "leaks", "leeds"], "Leads: clientes potenciales."),
  sal("s7", 4, "She managed to ___ the deal just before the end of the quarter.", ["close", "shut", "lock", "finish up"], "Close a deal: cerrar una venta."),
  sal("s8", 4, "Our ___ rate from demo to signed contract is around 20%.", ["conversion", "conversation", "convention", "converting"], "Conversion rate: tasa de conversión."),
  sal("s9", 5, "He tends to ___ the product, so clients end up disappointed.", ["oversell", "overpass", "oversee", "overtake"], "Oversell: prometer más de lo que el producto da."),
  sal("s10", 5, "Let's not ___ ourselves: this prospect is just shopping around.", ["kid", "joke", "tease", "fool around"], "Let's not kid ourselves: no nos engañemos."),

  // Tecnología, ingeniería, ciencia, arquitectura
  tec("t1", 1, "Please ___ your password: it isn't secure.", ["change", "chance", "charge", "cheat"], "Change your password: cambiar la contraseña."),
  tec("t2", 1, "The app doesn't work. There's a ___ in the code.", ["bug", "insect", "fly", "worm"], "Bug: un error en el código."),
  tec("t3", 2, "Please ___ the latest changes from the repository before you start.", ["pull", "pick", "draw", "take on"], "Pull: traerte los últimos cambios (git pull)."),
  tec("t4", 2, "The website is ___: users can't access it.", ["down", "off", "out", "under"], "The site is down: la web está caída."),
  tec("t5", 3, "We'll ___ the new feature to production on Thursday.", ["deploy", "display", "deliver up", "unfold"], "Deploy: desplegar a producción."),
  tec("t6", 3, "I've opened a pull request. Can you do a code ___?", ["review", "revision", "check-out", "revise"], "Code review: revisión del código por otra persona."),
  tec("t7", 4, "This quick fix works for now, but it adds technical ___.", ["debt", "credit", "loan", "weight"], "Technical debt: deuda técnica."),
  tec("t8", 4, "The platform needs to ___ to millions of users.", ["scale", "climb", "grow up", "escalate"], "Scale: crecer en capacidad. «Escalate» es elevar un problema a un superior."),
  tec("t9", 5, "The outage was caused by a race ___ between two services.", ["condition", "conflict", "competition", "collision"], "Race condition: dos procesos compiten y el orden cambia el resultado."),
  tec("t10", 5, "The client keeps adding features. We need to stop the scope ___.", ["creep", "crawl", "drift", "leak"], "Scope creep: el alcance que crece sin control."),

  // Finanzas, banca, derecho
  fin("f1", 1, "I need to pay this ___ before Friday.", ["invoice", "ticket", "note", "letter"], "Invoice: factura."),
  fin("f2", 1, "The company made a ___ of two million euros this year.", ["profit", "benefit", "winning", "gaining"], "Profit: beneficio económico. «Benefit» es una ventaja."),
  fin("f3", 2, "Please sign the ___ and send it back to us.", ["contract", "contrast", "contact", "contraction"], "Contract: contrato."),
  fin("f4", 2, "Our ___ are higher than last year because of the rent.", ["expenses", "expends", "spends", "wastes"], "Expenses: gastos."),
  fin("f5", 3, "We need to cut costs to protect our ___.", ["margins", "borders", "edges", "limits"], "Margins: márgenes."),
  fin("f6", 3, "Our ___ year ends in December.", ["fiscal", "physical", "financing", "taxing"], "Fiscal year: ejercicio fiscal."),
  fin("f7", 4, "The auditors flagged several ___ in the accounts.", ["discrepancies", "disagreements", "discounts", "distortions"], "Discrepancies: diferencias que no cuadran."),
  fin("f8", 4, "Under the ___ clause, neither party may share the information.", ["confidentiality", "confidence", "confidential", "confiding"], "Confidentiality clause: cláusula de confidencialidad."),
  fin("f9", 5, "The company had to ___ the losses from the failed acquisition.", ["write off", "write out", "write over", "cross off"], "Write off: dar por perdido y sacarlo del balance."),
  fin("f10", 5, "The agreement is ___ and void if payment is not received.", ["null", "nil", "none", "nothing"], "Null and void: nulo, sin efecto legal."),

  // Salud
  hea("h1", 1, "The patient has a high ___: 39 °C.", ["temperature", "heat", "warm", "fire"], "Temperature (o fever): fiebre."),
  hea("h2", 1, "Please take this ___ twice a day.", ["medicine", "medic", "doctor", "recipe"], "Medicine: medicamento. «Recipe» es una receta de cocina."),
  hea("h3", 2, "The doctor wrote a ___ for antibiotics.", ["prescription", "recipe", "description", "subscription"], "Prescription: receta médica."),
  hea("h4", 2, "He was ___ to hospital last night.", ["admitted", "entered", "accepted", "ingressed"], "Be admitted to hospital: ingresar."),
  hea("h5", 3, "The patient is ___ to penicillin.", ["allergic", "allergy", "allergenic", "sensible"], "Be allergic to: ser alérgico a."),
  hea("h6", 3, "We need to ___ the patient's blood pressure every hour.", ["monitor", "spy", "attend", "assist"], "Monitor: vigilar de forma continua."),
  hea("h7", 4, "The symptoms ___ after two days of treatment.", ["subsided", "subsidised", "submitted", "sublimated"], "Subside: remitir, disminuir."),
  hea("h8", 4, "She was ___ with type 2 diabetes last year.", ["diagnosed", "diagnosticated", "detected", "discovered"], "Be diagnosed with: ser diagnosticado de."),
  hea("h9", 5, "The trial was stopped due to ___ adverse events.", ["unforeseen", "unforeseeing", "unseen of", "unpredicting"], "Unforeseen: imprevisto."),
  hea("h10", 5, "The prognosis is ___; we'll know more after the scan.", ["guarded", "guarding", "kept", "careful of"], "Guarded prognosis: pronóstico reservado."),
];

/**
 * Listening: one clip per level from A2 to C1, with different accents (as at
 * work). Audio is generated with scripts/generate-test-audio.mjs.
 */
export const LISTENING: ListeningItem[] = [
  {
    id: "l1", level: 2, kind: "listening", audio: "/audio/test-nivel/l1.mp3",
    speaker: "Emma · acento británico, despacio",
    transcript: "Hi, this is Emma from the London office. Just a quick message: the meeting on Thursday is moved to Friday at ten. Please bring the sales report. Thanks, bye!",
    prompt: "When is the meeting now?",
    options: ["On Friday at 10.", "On Thursday at 10.", "On Friday at 2.", "It's cancelled."],
    why: "«The meeting on Thursday is moved to Friday at ten.»",
  },
  {
    id: "l2", level: 3, kind: "listening", audio: "/audio/test-nivel/l2.mp3",
    speaker: "Eric · acento americano",
    transcript: "Quick update on the project. We're running about a week behind, because the supplier still hasn't delivered the parts. I've asked them for a firm date, and as soon as I hear back, I'll let you know. In the meantime, let's focus on testing.",
    prompt: "Why is the project late?",
    options: ["The supplier hasn't delivered the parts.", "The testing took too long.", "The team was on holiday.", "The client changed the plan."],
    why: "«The supplier still hasn't delivered the parts.»",
  },
  {
    id: "l3", level: 4, kind: "listening", audio: "/audio/test-nivel/l3.mp3",
    speaker: "Charlie · acento australiano, informal",
    transcript: "Look, I'm not gonna sugarcoat it. The numbers this quarter are a bit of a mixed bag. Sales are up, but our margins took a hit, mostly because we've been throwing discounts around like confetti. So, going forward, no more discounts without my sign-off. Fair enough?",
    prompt: "What does the speaker want to change?",
    options: ["Discounts will need his approval.", "The team must sell more.", "Prices will go up next quarter.", "Discounts will be bigger."],
    why: "«No more discounts without my sign-off»: sin su aprobación, no hay descuentos.",
  },
  {
    id: "l4", level: 5, kind: "listening", audio: "/audio/test-nivel/l4.mp3",
    speaker: "Anika · acento indio, rápido",
    transcript: "To be honest, I'd hold off on signing anything just yet. The proposal looks solid on paper, but the liability clause is pretty vague, and if things go south, we'd be the ones footing the bill. Let's loop in legal before we commit.",
    prompt: "What is the speaker's main concern?",
    options: ["If something goes wrong, they might have to pay.", "The proposal is too expensive.", "Legal is too slow.", "The deadline is too short."],
    why: "«If things go south, we'd be the ones footing the bill»: si sale mal, pagarían ellos.",
  },
];
