/**
 * Migración del curso completo "Inglés para SEO y posicionamiento web".
 * Estructura: LearningSEO.io (Módulos A-H) + capa de inglés profesional SEO.
 * Uso: SANITY_TOKEN=<token> node scripts/migrate-seo-lessons.mjs
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

const COURSE_REF = "course-ingles-para-seo";

const lessons = [
  // ─────────────────────────── FUNDAMENTOS DEL SEO ───────────────────────────
  {
    slug: "como-funciona-un-buscador",
    section: "Fundamentos del SEO",
    free: true,
    order: 1,
    duration: "15 min",
    title: "Cómo funciona un buscador en inglés | aprendoingles.online",
    h1: "Cómo funciona un buscador: crawling, indexing y serving",
    metaDescription: "Aprende en inglés cómo funciona Google: crawling, indexing y serving. El vocabulario fundamental del SEO explicado para profesionales hispanohablantes.",
    description: "Crawling, indexing y serving: el modelo de tres fases de Google y el vocabulario en inglés que necesitas para entender el SEO desde la base.",
    intro: "Antes de optimizar nada, hay que entender cómo trabaja Google. Según Google Search Central, la búsqueda funciona en tres fases: crawling (rastreo), indexing (indexación) y serving (servir resultados). En inglés, los SEOs usan estos tres verbos constantemente, así que dominarlos es el primer paso para hablar el idioma de la profesión.",
    vocabulary: [
      { term: "Crawling", definition: "Rastreo: el proceso por el que Googlebot descubre y descarga páginas siguiendo enlaces.", example: "Crawling is how Googlebot discovers new pages — there's no central registry of all the pages on the web." },
      { term: "Indexing", definition: "Indexación: Google analiza el contenido de la página y lo guarda en su índice.", example: "After crawling, indexing is when Google analyzes the content and stores it in the index." },
      { term: "Serving (results)", definition: "Servir resultados: cuando alguien busca, Google devuelve los resultados más relevantes de su índice.", example: "Serving happens at query time, when Google returns the most relevant results." },
      { term: "Crawler / spider / bot", definition: "Rastreador: el programa que recorre la web. El de Google se llama Googlebot.", example: "A crawler (also called a spider or bot) follows links from page to page." },
      { term: "Index", definition: "Índice: la enorme base de datos donde Google almacena las páginas que conoce.", example: "If your page isn't in the index, it can't appear in search results." },
      { term: "Query", definition: "Consulta: lo que el usuario escribe en el buscador.", example: "Google matches the query against pages stored in its index." },
      { term: "Ranking signals", definition: "Señales de posicionamiento: los cientos de factores que Google usa para ordenar resultados.", example: "Google uses hundreds of ranking signals, including relevance, language, and location." },
      { term: "SERP", definition: "Search Engine Results Page: la página de resultados de búsqueda. Se pronuncia 'serp'.", example: "Our page moved up three positions on the SERP this month." },
    ],
    keyPhrases: [
      { phrase: "Googlebot crawls the page by following links.", translation: "Googlebot rastrea la página siguiendo enlaces.", context: "Describe la fase de crawling. 'Crawl' es el verbo clave del SEO técnico." },
      { phrase: "The page has been crawled but not indexed yet.", translation: "La página se ha rastreado pero aún no está indexada.", context: "Distinción crítica: rastreado ≠ indexado. Muy común en informes técnicos." },
      { phrase: "Google stores the content in its index.", translation: "Google almacena el contenido en su índice.", context: "Fase de indexing. 'Store in the index' es la colocación habitual." },
      { phrase: "At query time, Google serves the most relevant results.", translation: "En el momento de la consulta, Google sirve los resultados más relevantes.", context: "Fase de serving. 'Query time' es un término muy usado." },
      { phrase: "There's no central registry of all web pages.", translation: "No existe un registro central de todas las páginas web.", context: "Frase de Google Search Central para explicar por qué el crawling es necesario." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre el funcionamiento de un buscador.",
      questions: [
        { question: "Google discovers pages by following links. This phase is called...", options: ["indexing", "crawling", "serving"], correct: 1 },
        { question: "Storing the analyzed content in a huge database is called...", options: ["indexing", "crawling", "querying"], correct: 0 },
        { question: "¿Cuál es el orden correcto del modelo de tres fases?", options: ["Serving → Indexing → Crawling", "Crawling → Indexing → Serving", "Indexing → Crawling → Serving"], correct: 1 },
        { question: "'The page was crawled but not indexed' significa que...", options: ["la página ya aparece en los resultados", "Google la visitó pero no la guardó en su índice", "la página fue penalizada"], correct: 1 },
      ],
    },
  },
  {
    slug: "crawled-indexed-ranked",
    section: "Fundamentos del SEO",
    free: false,
    order: 2,
    duration: "15 min",
    title: "Crawled, indexed, ranked: la diferencia en inglés | aprendoingles.online",
    h1: "Crawled ≠ indexed ≠ ranked: el vocabulario que confunde a todos",
    metaDescription: "Domina en inglés la diferencia entre crawled, indexed y ranked. Vocabulario y matices que distinguen a un SEO profesional al hablar con clientes y equipos.",
    description: "La diferencia entre rastreado, indexado y posicionado, y por qué confundirlos es el error más común al hablar de SEO en inglés.",
    intro: "Uno de los errores más frecuentes —incluso entre profesionales— es usar 'crawled', 'indexed' y 'ranked' como sinónimos. No lo son, y en inglés se nota mucho. Esta lección fija la diferencia y te da el vocabulario para explicarla con precisión, algo que valoran clientes y equipos internacionales.",
    vocabulary: [
      { term: "To rank", definition: "Posicionar(se): aparecer en una posición concreta para una búsqueda.", example: "We rank third for 'running shoes' in the UK." },
      { term: "To rank for (a keyword)", definition: "Posicionar para una palabra clave concreta.", example: "It took six months to rank for that competitive keyword." },
      { term: "To deindex / noindex", definition: "Desindexar / marcar para no indexar una página.", example: "We added a noindex tag to keep thin pages out of the index." },
      { term: "Relevance", definition: "Relevancia: cuánto encaja una página con la intención de la consulta.", example: "Relevance is one of the strongest ranking signals." },
      { term: "Visibility", definition: "Visibilidad: cuánto aparece un sitio en los resultados en conjunto.", example: "Our organic visibility dropped after the core update." },
      { term: "Organic results", definition: "Resultados orgánicos: los no pagados, frente a los anuncios.", example: "Organic results sit below the ads on most SERPs." },
      { term: "To climb the rankings", definition: "Subir posiciones (idiom).", example: "The post is slowly climbing the rankings." },
    ],
    keyPhrases: [
      { phrase: "Being crawled doesn't mean being indexed.", translation: "Que te rastreen no significa que te indexen.", context: "Aclaración clave al explicar problemas técnicos a un cliente." },
      { phrase: "The page is indexed but it isn't ranking for anything.", translation: "La página está indexada pero no posiciona para nada.", context: "Situación habitual de contenido 'thin' o sin intención clara." },
      { phrase: "We're trying to rank for high-intent keywords.", translation: "Intentamos posicionar para palabras clave de alta intención.", context: "Frase estratégica habitual en reuniones." },
      { phrase: "Our visibility took a hit after the update.", translation: "Nuestra visibilidad se resintió tras la actualización.", context: "'Take a hit' = sufrir un golpe. Registro informal profesional." },
      { phrase: "It's slowly climbing the rankings.", translation: "Está subiendo posiciones poco a poco.", context: "Idiom muy común para describir progreso gradual." },
    ],
    exercise: {
      instruction: "Elige la frase correcta según el matiz.",
      questions: [
        { question: "Una página aparece en el índice pero en ninguna búsqueda. Dirías:", options: ["It's not crawled.", "It's indexed but not ranking.", "It's deindexed."], correct: 1 },
        { question: "'We rank for that keyword' significa que...", options: ["aparecemos en resultados para esa palabra clave", "rastreamos esa palabra clave", "indexamos esa palabra clave"], correct: 0 },
        { question: "Para sacar páginas de baja calidad del índice usarías un...", options: ["canonical tag", "noindex tag", "anchor text"], correct: 1 },
        { question: "'Our visibility took a hit' significa que la visibilidad...", options: ["mejoró mucho", "bajó / se resintió", "se mantuvo igual"], correct: 1 },
      ],
    },
  },
  // ─────────────────────── KEYWORD RESEARCH E INTENCIÓN ───────────────────────
  {
    slug: "keyword-research-fundamentos",
    section: "Keyword Research e Intención",
    free: false,
    order: 3,
    duration: "20 min",
    title: "Keyword research en inglés: short-tail y long-tail | aprendoingles.online",
    h1: "Keyword research: short-tail vs. long-tail en inglés",
    metaDescription: "Aprende el vocabulario en inglés del keyword research: search volume, keyword difficulty, short-tail y long-tail. Habla de palabras clave como un SEO nativo.",
    description: "Search volume, keyword difficulty, head terms y long-tail. El vocabulario para investigar palabras clave en inglés.",
    intro: "El keyword research es el punto de partida de casi cualquier estrategia. En inglés, hay un vocabulario muy fijo —short-tail, long-tail, search volume, keyword difficulty— que aparece en todas las herramientas (Semrush, Ahrefs, Keyword Planner). Aprenderlo te permite leer cualquier interfaz y hablar con cualquier equipo.",
    vocabulary: [
      { term: "Keyword", definition: "Palabra clave: el término que el usuario escribe. En español a menudo se mantiene 'keyword'.", example: "We're targeting commercial keywords this quarter." },
      { term: "Short-tail / head term", definition: "Palabra clave corta y genérica, con mucho volumen y mucha competencia.", example: "'Shoes' is a head term — huge volume but very hard to rank for." },
      { term: "Long-tail keyword", definition: "Palabra clave larga y específica, con menos volumen pero más conversión.", example: "'Best waterproof running shoes for women' is a long-tail keyword." },
      { term: "Search volume", definition: "Volumen de búsqueda: cuántas veces se busca un término al mes.", example: "This keyword has a search volume of 12,000 a month." },
      { term: "Keyword difficulty", definition: "Dificultad de la palabra clave: cómo de difícil es posicionar para ella.", example: "The keyword difficulty is 78, so it'll take strong backlinks." },
      { term: "To target a keyword", definition: "Apuntar a / trabajar una palabra clave concreta.", example: "Each page should target one primary keyword." },
      { term: "Keyword mapping", definition: "Mapeo de keywords: asignar cada palabra clave a una página concreta.", example: "Keyword mapping prevents two pages from competing." },
    ],
    keyPhrases: [
      { phrase: "Let's go after some long-tail keywords first.", translation: "Vamos a por palabras clave long-tail primero.", context: "'Go after' = perseguir. Estrategia típica para sitios nuevos." },
      { phrase: "That head term is too competitive for us right now.", translation: "Ese término genérico es demasiado competitivo para nosotros ahora.", context: "Justificación habitual de priorización." },
      { phrase: "What's the search volume and difficulty on that one?", translation: "¿Qué volumen y dificultad tiene esa?", context: "Pregunta estándar al revisar keywords en una herramienta." },
      { phrase: "We should target this keyword with the pricing page.", translation: "Deberíamos trabajar esta keyword con la página de precios.", context: "Ejemplo de keyword mapping." },
      { phrase: "Long-tail keywords usually convert better.", translation: "Las palabras clave long-tail suelen convertir mejor.", context: "Argumento clásico a favor del long-tail." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre keyword research.",
      questions: [
        { question: "'Running shoes' vs 'best running shoes for flat feet'. La segunda es...", options: ["a head term", "a long-tail keyword", "a navigational query"], correct: 1 },
        { question: "'Search volume' se refiere a...", options: ["lo difícil que es posicionar", "cuántas veces se busca al mes", "cuántos enlaces tiene"], correct: 1 },
        { question: "Asignar cada keyword a una página concreta se llama...", options: ["keyword stuffing", "keyword mapping", "keyword difficulty"], correct: 1 },
        { question: "'Let's go after long-tail keywords' significa que vamos a...", options: ["evitarlas", "perseguir/trabajar esas keywords", "comprarlas"], correct: 1 },
      ],
    },
  },
  {
    slug: "search-intent-y-canibalizacion",
    section: "Keyword Research e Intención",
    free: false,
    order: 4,
    duration: "20 min",
    title: "Search intent y canibalización en inglés | aprendoingles.online",
    h1: "Search intent y keyword cannibalization en inglés",
    metaDescription: "Aprende en inglés los 4 tipos de search intent (informational, navigational, commercial, transactional) y a detectar la keyword cannibalization.",
    description: "Los 4 tipos de intención de búsqueda y la canibalización de keywords, con el vocabulario en inglés para diagnosticarlos.",
    intro: "Posicionar ya no va de repetir palabras: va de satisfacer la intención de búsqueda (search intent). Google clasifica las consultas en cuatro tipos, y entenderlos en inglés es esencial. Además veremos la keyword cannibalization, un problema que casi siempre se nombra en inglés incluso en equipos hispanohablantes.",
    vocabulary: [
      { term: "Search intent", definition: "Intención de búsqueda: qué busca realmente conseguir el usuario.", example: "Always match your content to the search intent behind the query." },
      { term: "Informational intent", definition: "Intención informativa: el usuario quiere aprender algo ('how to...').", example: "'How does SEO work' has clear informational intent." },
      { term: "Navigational intent", definition: "Intención navegacional: busca un sitio o marca concreta.", example: "'Facebook login' is a navigational query." },
      { term: "Commercial intent", definition: "Intención comercial: investiga antes de comprar ('best', 'vs', 'review').", example: "'Best CRM for startups' shows commercial investigation intent." },
      { term: "Transactional intent", definition: "Intención transaccional: listo para actuar o comprar ('buy', 'price').", example: "'Buy running shoes online' is transactional." },
      { term: "Keyword cannibalization", definition: "Canibalización: dos páginas tuyas compiten por la misma keyword.", example: "These two blog posts are cannibalizing each other." },
      { term: "To satisfy intent", definition: "Satisfacer la intención del usuario.", example: "A page ranks well when it fully satisfies the search intent." },
    ],
    keyPhrases: [
      { phrase: "What's the intent behind this query?", translation: "¿Cuál es la intención detrás de esta consulta?", context: "Pregunta de partida antes de crear cualquier contenido." },
      { phrase: "This page doesn't match the search intent.", translation: "Esta página no encaja con la intención de búsqueda.", context: "Diagnóstico habitual de por qué algo no posiciona." },
      { phrase: "These two pages are cannibalizing each other.", translation: "Estas dos páginas se están canibalizando.", context: "Hallazgo típico en una auditoría de contenido." },
      { phrase: "We need to consolidate these into one page.", translation: "Necesitamos consolidarlas en una sola página.", context: "Solución habitual a la canibalización." },
      { phrase: "The content should satisfy the user's intent.", translation: "El contenido debe satisfacer la intención del usuario.", context: "Principio central del SEO moderno." },
    ],
    exercise: {
      instruction: "Clasifica la intención de búsqueda o identifica el problema.",
      questions: [
        { question: "'Buy iPhone 15 online' tiene intención...", options: ["informational", "transactional", "navigational"], correct: 1 },
        { question: "'Best project management tools' tiene intención...", options: ["commercial", "navigational", "transactional"], correct: 0 },
        { question: "'How to tie a tie' tiene intención...", options: ["transactional", "informational", "commercial"], correct: 1 },
        { question: "Dos artículos tuyos compiten por la misma keyword. Eso es...", options: ["keyword mapping", "keyword cannibalization", "keyword difficulty"], correct: 1 },
        { question: "La solución habitual a la canibalización es...", options: ["consolidate the pages into one", "add more keywords", "buy more backlinks"], correct: 0 },
      ],
    },
  },
  // ───────────────────────── ON-PAGE Y CONTENIDO ─────────────────────────
  {
    slug: "optimizacion-on-page",
    section: "On-Page y Contenido",
    free: false,
    order: 5,
    duration: "20 min",
    title: "On-page SEO en inglés: title, meta y headers | aprendoingles.online",
    h1: "On-page optimization: title tag, meta description y headers",
    metaDescription: "Aprende el vocabulario en inglés del on-page SEO: title tag, meta description, H1/H2, URL slug y alt text. Optimiza páginas y habla con desarrolladores.",
    description: "Title tag, meta description, headers, URL slug y alt text: los elementos on-page y su vocabulario en inglés.",
    intro: "El on-page SEO es todo lo que optimizas dentro de la propia página. Son elementos con nombres muy concretos en inglés (title tag, meta description, alt text...) que se usan a diario al trabajar con redactores y desarrolladores. Dominarlos evita malentendidos y te hace sonar profesional.",
    vocabulary: [
      { term: "Title tag", definition: "Etiqueta de título: el título que aparece en la pestaña y en el SERP.", example: "Keep your title tag under about 60 characters." },
      { term: "Meta description", definition: "Meta descripción: el resumen bajo el título en el SERP.", example: "Write the meta description for readers, not for engines." },
      { term: "Header tags (H1, H2...)", definition: "Etiquetas de encabezado que estructuran el contenido.", example: "Use one H1 per page and H2s for the main sections." },
      { term: "URL slug", definition: "Slug: la parte legible de la URL.", example: "Keep the URL slug short and keyword-focused." },
      { term: "Alt text", definition: "Texto alternativo: describe una imagen para accesibilidad y SEO.", example: "Add descriptive alt text to every meaningful image." },
      { term: "Internal links", definition: "Enlaces internos: enlaces entre páginas de tu propio sitio.", example: "Internal links help Google understand your site structure." },
      { term: "Keyword stuffing", definition: "Sobreoptimización: repetir keywords de forma artificial. Práctica penalizada.", example: "Avoid keyword stuffing — it reads badly and Google ignores it." },
      { term: "Thin content", definition: "Contenido pobre o escaso, sin valor real.", example: "These thin content pages should be improved or removed." },
    ],
    keyPhrases: [
      { phrase: "Let's tweak the title tag to include the main keyword.", translation: "Vamos a ajustar el title tag para incluir la keyword principal.", context: "'Tweak' = ajustar ligeramente. Muy común en on-page." },
      { phrase: "The meta description should be compelling, not stuffed.", translation: "La meta descripción debe ser atractiva, no sobreoptimizada.", context: "Recomendación habitual de redacción." },
      { phrase: "Each page should have a single H1.", translation: "Cada página debe tener un único H1.", context: "Regla básica de estructura on-page." },
      { phrase: "We're missing alt text on most images.", translation: "Faltan textos alternativos en casi todas las imágenes.", context: "Hallazgo típico de auditoría on-page." },
      { phrase: "Avoid keyword stuffing — write for humans.", translation: "Evita la sobreoptimización: escribe para personas.", context: "Consejo clásico, alineado con Fishkin." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre on-page SEO.",
      questions: [
        { question: "El texto que describe una imagen para accesibilidad y SEO es el...", options: ["title tag", "alt text", "URL slug"], correct: 1 },
        { question: "¿Cuántos H1 debería tener idealmente una página?", options: ["uno", "tantos como secciones", "ninguno"], correct: 0 },
        { question: "Repetir una keyword de forma artificial y excesiva se llama...", options: ["internal linking", "keyword stuffing", "keyword mapping"], correct: 1 },
        { question: "'Let's tweak the title tag' significa que vamos a...", options: ["borrarlo", "ajustarlo ligeramente", "duplicarlo"], correct: 1 },
      ],
    },
  },
  {
    slug: "pillar-cluster-y-topical-authority",
    section: "On-Page y Contenido",
    free: false,
    order: 6,
    duration: "20 min",
    title: "Pillar-cluster y topical authority en inglés | aprendoingles.online",
    h1: "Pillar-cluster, topical authority y 10x content",
    metaDescription: "Aprende en inglés el modelo pillar-and-cluster, la topical authority, el 10x content de Rand Fishkin y el linkable asset de Brian Dean.",
    description: "El modelo pillar-cluster, la autoridad temática y conceptos estrella como 10x content y linkable asset.",
    intro: "Para posicionar de forma sostenible no basta con páginas sueltas: hay que construir autoridad temática (topical authority). El modelo más usado es el pillar-and-cluster. En esta lección verás también dos conceptos que acuñaron referentes del sector: el '10x content' de Rand Fishkin y el 'linkable asset' de Brian Dean.",
    vocabulary: [
      { term: "Pillar page", definition: "Página pilar: contenido amplio que cubre un tema central.", example: "The pillar page covers 'email marketing' broadly." },
      { term: "Cluster (content)", definition: "Cluster: páginas específicas que enlazan a la pilar y profundizan en subtemas.", example: "Each cluster page links back to the pillar." },
      { term: "Hub-and-spoke model", definition: "Modelo radial (otro nombre del pillar-cluster).", example: "We organize content with a hub-and-spoke model." },
      { term: "Topical authority", definition: "Autoridad temática: ser una referencia completa sobre un tema.", example: "Covering a topic in depth builds topical authority." },
      { term: "10x content", definition: "Contenido 10 veces mejor que el mejor resultado actual (Rand Fishkin).", example: "Don't just match the top result — create 10x content." },
      { term: "Linkable asset", definition: "Activo enlazable: contenido tan bueno que otros quieren enlazarlo (Brian Dean).", example: "An original study makes a great linkable asset." },
      { term: "Cornerstone content", definition: "Contenido fundamental / piedra angular del sitio.", example: "This guide is cornerstone content for our blog." },
    ],
    keyPhrases: [
      { phrase: "We're building topical authority around this subject.", translation: "Estamos construyendo autoridad temática sobre este tema.", context: "Objetivo estratégico de contenido." },
      { phrase: "Each cluster page should link back to the pillar.", translation: "Cada página cluster debería enlazar a la pilar.", context: "Regla de oro del modelo pillar-cluster." },
      { phrase: "Let's make this a 10x piece, not just another post.", translation: "Hagamos de esto una pieza 10x, no un post más.", context: "Referencia directa al concepto de Rand Fishkin." },
      { phrase: "We need a linkable asset to earn backlinks.", translation: "Necesitamos un activo enlazable para ganar backlinks.", context: "Concepto de Brian Dean, conecta contenido y link building." },
      { phrase: "This guide is our cornerstone content.", translation: "Esta guía es nuestro contenido fundamental.", context: "Forma habitual de señalar las páginas más importantes." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre estrategia de contenido.",
      questions: [
        { question: "En el modelo pillar-cluster, las páginas cluster deben...", options: ["enlazar a la página pilar", "ignorar a la pilar", "competir con la pilar"], correct: 0 },
        { question: "El '10x content' fue popularizado por...", options: ["Brian Dean", "Rand Fishkin", "Lily Ray"], correct: 1 },
        { question: "Un contenido tan bueno que otros quieren enlazarlo es un...", options: ["linkable asset", "thin content", "head term"], correct: 0 },
        { question: "Ser una referencia completa sobre un tema se llama...", options: ["keyword difficulty", "topical authority", "crawl budget"], correct: 1 },
      ],
    },
  },
  // ───────────────────────────── SEO TÉCNICO ─────────────────────────────
  {
    slug: "seo-tecnico-fundamentos",
    section: "SEO Técnico",
    free: false,
    order: 7,
    duration: "20 min",
    title: "SEO técnico en inglés: robots, sitemap y canonical | aprendoingles.online",
    h1: "SEO técnico: robots.txt, sitemaps y canonical tags",
    metaDescription: "Aprende el vocabulario en inglés del SEO técnico: robots.txt, XML sitemap, canonical tags, structured data y crawl budget. Habla con desarrolladores con soltura.",
    description: "robots.txt, XML sitemaps, canonical tags, structured data y crawl budget: el vocabulario para hablar de SEO técnico en inglés.",
    intro: "El SEO técnico es la infraestructura que permite a Google rastrear, renderizar e indexar bien tu sitio. Es la parcela donde más hablarás con desarrolladores (a menudo en inglés), así que el vocabulario preciso es oro. Verás los términos que aparecen en Search Console y en cualquier auditoría técnica.",
    vocabulary: [
      { term: "robots.txt", definition: "Archivo que da directivas de rastreo a los bots. Se dice 'robots dot t-x-t'.", example: "We accidentally blocked the whole site in robots.txt." },
      { term: "XML sitemap", definition: "Mapa del sitio en XML que lista las URLs para los buscadores.", example: "Submit your XML sitemap in Google Search Console." },
      { term: "Canonical tag", definition: "Etiqueta canónica: indica la versión 'oficial' entre páginas duplicadas.", example: "Add a canonical tag to resolve duplicate content." },
      { term: "Structured data / schema markup", definition: "Datos estructurados (normalmente JSON-LD) que habilitan rich results.", example: "We added structured data to get rich results." },
      { term: "Crawl budget", definition: "Presupuesto de rastreo: cuántas páginas rastrea Google; relevante en sitios grandes.", example: "Faceted URLs were wasting our crawl budget." },
      { term: "Mobile-first indexing", definition: "Indexación basada en la versión móvil del sitio.", example: "With mobile-first indexing, the mobile version is what counts." },
      { term: "Rich results", definition: "Resultados enriquecidos (estrellas, FAQs, etc.) en el SERP.", example: "Recipe schema can trigger rich results." },
    ],
    keyPhrases: [
      { phrase: "We're wasting crawl budget on faceted URLs.", translation: "Estamos malgastando presupuesto de rastreo en URLs facetadas.", context: "Hallazgo típico en auditoría de sitios grandes." },
      { phrase: "Let's add a canonical tag to fix the duplicates.", translation: "Añadamos una etiqueta canónica para resolver los duplicados.", context: "Solución estándar a contenido duplicado." },
      { phrase: "The sitemap hasn't been submitted to Search Console.", translation: "El sitemap no se ha enviado a Search Console.", context: "Comprobación habitual al empezar un proyecto." },
      { phrase: "Can you check what's blocked in robots.txt?", translation: "¿Puedes revisar qué hay bloqueado en robots.txt?", context: "Petición típica a un desarrollador." },
      { phrase: "We should implement schema markup on product pages.", translation: "Deberíamos implementar datos estructurados en las fichas de producto.", context: "Recomendación frecuente para conseguir rich results." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre SEO técnico.",
      questions: [
        { question: "Para indicar la versión 'oficial' entre páginas duplicadas usas un...", options: ["robots.txt", "canonical tag", "alt text"], correct: 1 },
        { question: "El archivo que da directivas de rastreo a los bots es...", options: ["el XML sitemap", "robots.txt", "el canonical"], correct: 1 },
        { question: "Los datos estructurados (schema) sirven sobre todo para...", options: ["bloquear el rastreo", "habilitar rich results", "comprar enlaces"], correct: 1 },
        { question: "'Crawl budget' es especialmente relevante en...", options: ["sitios muy grandes", "blogs de 5 páginas", "redes sociales"], correct: 0 },
      ],
    },
  },
  {
    slug: "core-web-vitals",
    section: "SEO Técnico",
    free: false,
    order: 8,
    duration: "15 min",
    title: "Core Web Vitals en inglés: LCP, INP y CLS | aprendoingles.online",
    h1: "Core Web Vitals: LCP, INP y CLS explicados en inglés",
    metaDescription: "Aprende en inglés los Core Web Vitals: LCP, INP y CLS, sus umbrales y cómo se pronuncian. INP sustituyó a FID en marzo de 2024.",
    description: "LCP, INP y CLS: las métricas de experiencia de página de Google, con sus umbrales y su pronunciación letra a letra.",
    intro: "Los Core Web Vitals miden la experiencia real de carga e interacción de una página. Son tres métricas con acrónimos que se dicen letra a letra (LCP, INP, CLS) y umbrales concretos. Importante y reciente: INP sustituyó a FID el 12 de marzo de 2024. Saber pronunciarlos y citarlos bien marca la diferencia en una reunión técnica.",
    vocabulary: [
      { term: "Core Web Vitals (CWV)", definition: "Métricas de Google sobre experiencia de página. Se dice 'core web vitals'.", example: "Core Web Vitals are part of the page experience signals." },
      { term: "LCP (Largest Contentful Paint)", definition: "Mide la carga: tiempo hasta el elemento principal. Objetivo: < 2,5 s. Se dice 'L-C-P'.", example: "Our LCP is 3.1 seconds — we need to get it under 2.5." },
      { term: "INP (Interaction to Next Paint)", definition: "Mide la interactividad. Sustituyó a FID en marzo de 2024. Buen umbral ≤ 200 ms.", example: "INP replaced FID as a Core Web Vital in March 2024." },
      { term: "CLS (Cumulative Layout Shift)", definition: "Mide la estabilidad visual. Objetivo: < 0,1. Se dice 'C-L-S'.", example: "Ads loading late were hurting our CLS." },
      { term: "Threshold", definition: "Umbral: el valor objetivo a no superar (o alcanzar).", example: "The 'good' threshold for LCP is 2.5 seconds." },
      { term: "To deprecate", definition: "Dejar obsoleto / retirar (una métrica o función).", example: "FID was deprecated when INP took over." },
      { term: "Page experience", definition: "Experiencia de página: conjunto de señales de usabilidad.", example: "Core Web Vitals feed into the page experience signals." },
    ],
    keyPhrases: [
      { phrase: "Our LCP is above the recommended threshold.", translation: "Nuestro LCP está por encima del umbral recomendado.", context: "Diagnóstico típico de rendimiento." },
      { phrase: "INP replaced FID back in March 2024.", translation: "INP sustituyó a FID en marzo de 2024.", context: "Dato reciente; demuestra estar al día." },
      { phrase: "Layout shifts are hurting our CLS score.", translation: "Los saltos de maquetación están perjudicando nuestro CLS.", context: "Causa habitual de mal CLS." },
      { phrase: "Let's get these metrics into the green.", translation: "Vamos a poner estas métricas en verde.", context: "'In the green' = dentro del rango bueno. Muy usado." },
      { phrase: "FID has been deprecated.", translation: "FID ha quedado obsoleto.", context: "'Deprecate' es vocabulario técnico clave." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre Core Web Vitals.",
      questions: [
        { question: "¿Qué métrica sustituyó a FID en marzo de 2024?", options: ["LCP", "INP", "CLS"], correct: 1 },
        { question: "El umbral 'good' de LCP es...", options: ["menos de 2,5 segundos", "menos de 0,1", "menos de 200 ms"], correct: 0 },
        { question: "Los saltos visuales en la maquetación afectan al...", options: ["LCP", "CLS", "INP"], correct: 1 },
        { question: "'To deprecate a metric' significa...", options: ["mejorarla", "dejarla obsoleta/retirarla", "duplicarla"], correct: 1 },
      ],
    },
  },
  // ──────────────────────── LINK BUILDING Y OFF-PAGE ────────────────────────
  {
    slug: "backlinks-y-link-equity",
    section: "Link Building y Off-Page",
    free: false,
    order: 9,
    duration: "20 min",
    title: "Backlinks y link equity en inglés | aprendoingles.online",
    h1: "Backlinks, link equity y 'link juice' en inglés",
    metaDescription: "Aprende el vocabulario en inglés del off-page SEO: backlinks, referring domains, anchor text, dofollow/nofollow, link equity y 'link juice'.",
    description: "Backlinks, referring domains, anchor text, dofollow/nofollow y el famoso 'link juice'. El vocabulario del off-page.",
    intro: "Los backlinks son enlaces que otros sitios apuntan al tuyo; Google los interpreta como 'votos de confianza'. El off-page SEO está lleno de vocabulario fijo y metáforas vivas como 'link juice'. Esta lección te da los términos para hablar de autoridad de enlaces con precisión.",
    vocabulary: [
      { term: "Backlink / inbound link", definition: "Enlace entrante: un enlace desde otro sitio hacia el tuyo.", example: "We earned 40 new backlinks from that study." },
      { term: "Referring domain", definition: "Dominio de referencia: un dominio distinto que te enlaza.", example: "Quality matters more than the number of referring domains." },
      { term: "Anchor text", definition: "Texto ancla: el texto visible y clicable de un enlace.", example: "Over-optimized anchor text can look spammy." },
      { term: "Dofollow / nofollow", definition: "Atributos que indican si un enlace transmite autoridad o no.", example: "This link is nofollow, so it won't pass authority." },
      { term: "Link equity / link juice", definition: "Autoridad que transmite un enlace. 'Link juice' es la versión informal.", example: "Internal links pass link equity to important pages." },
      { term: "Domain Authority (DA) / Domain Rating (DR)", definition: "Métricas de terceros (Moz/Ahrefs) que estiman la fuerza de un dominio. No son factores de Google.", example: "DA and DR are third-party metrics, not Google ranking factors." },
      { term: "Votes of confidence", definition: "'Votos de confianza': cómo Google interpreta los backlinks.", example: "Backlinks act as votes of confidence from other sites." },
    ],
    keyPhrases: [
      { phrase: "We earned some high-quality backlinks this month.", translation: "Conseguimos algunos backlinks de calidad este mes.", context: "'Earn links' suena mejor que 'get links' en registro profesional." },
      { phrase: "That link is nofollow, so it won't pass link equity.", translation: "Ese enlace es nofollow, así que no transmite autoridad.", context: "Matiz técnico habitual al evaluar enlaces." },
      { phrase: "The anchor text looks over-optimized.", translation: "El texto ancla parece sobreoptimizado.", context: "Señal de alerta en una auditoría de enlaces." },
      { phrase: "Remember, DA and DR are third-party metrics.", translation: "Recuerda, DA y DR son métricas de terceros.", context: "Aclaración importante para no confundirlas con factores de Google." },
      { phrase: "Internal links pass link equity to key pages.", translation: "Los enlaces internos transmiten autoridad a las páginas clave.", context: "Concepto que conecta on-page y off-page." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre backlinks.",
      questions: [
        { question: "Un enlace marcado 'nofollow'...", options: ["transmite toda la autoridad", "no transmite autoridad", "duplica la autoridad"], correct: 1 },
        { question: "El texto visible y clicable de un enlace es el...", options: ["referring domain", "anchor text", "canonical"], correct: 1 },
        { question: "Domain Authority (DA) y Domain Rating (DR) son...", options: ["factores oficiales de Google", "métricas de terceros (Moz/Ahrefs)", "tipos de anchor text"], correct: 1 },
        { question: "En registro profesional, lo más natural es decir que los enlaces se...", options: ["earn (se ganan)", "steal (se roban)", "print (se imprimen)"], correct: 0 },
      ],
    },
  },
  {
    slug: "estrategias-de-link-building",
    section: "Link Building y Off-Page",
    free: false,
    order: 10,
    duration: "20 min",
    title: "Estrategias de link building en inglés | aprendoingles.online",
    h1: "Skyscraper, outreach y white hat: link building en inglés",
    metaDescription: "Aprende en inglés las estrategias de link building: Skyscraper Technique, outreach, guest posting, digital PR y la diferencia white hat / black hat.",
    description: "Skyscraper Technique, outreach, guest posting, digital PR y la ética white hat vs. black hat del link building.",
    intro: "Conseguir backlinks de calidad requiere estrategia. Verás la Skyscraper Technique de Brian Dean, el outreach, el guest posting y el digital PR, además de la distinción ética clave —white hat, black hat, gray hat— y por qué evitar comprar enlaces y las PBNs.",
    vocabulary: [
      { term: "Outreach", definition: "Contacto proactivo (normalmente por email) para conseguir enlaces o colaboraciones.", example: "We sent 50 outreach emails and landed 6 links." },
      { term: "The Skyscraper Technique", definition: "Técnica de Brian Dean: encuentra contenido muy enlazado, créalo mucho mejor y pide enlaces.", example: "The Skyscraper Technique works when the original is outdated." },
      { term: "Guest posting", definition: "Publicar artículos como invitado en otros sitios para ganar enlaces.", example: "Guest posting on relevant blogs builds authority." },
      { term: "Digital PR", definition: "Relaciones públicas digitales: conseguir cobertura y enlaces de medios.", example: "Our data study got picked up through digital PR." },
      { term: "White hat / black hat / gray hat", definition: "Técnicas éticas / prohibidas / en la zona gris.", example: "We only use white hat tactics — no buying links." },
      { term: "PBN (Private Blog Network)", definition: "Red de blogs privados para manipular enlaces. Práctica de riesgo.", example: "PBNs violate Google's guidelines and can get you penalized." },
      { term: "To land a link", definition: "Conseguir un enlace (informal y muy usado).", example: "We landed a link from a major news site." },
    ],
    keyPhrases: [
      { phrase: "Let's do some outreach to relevant blogs.", translation: "Hagamos algo de outreach a blogs relevantes.", context: "Acción habitual en una campaña de enlaces." },
      { phrase: "This is a classic Skyscraper play.", translation: "Esto es una jugada clásica de Skyscraper.", context: "'Play' = jugada/estrategia. Registro informal profesional." },
      { phrase: "We only use white hat tactics.", translation: "Solo usamos tácticas white hat.", context: "Postura ética que tranquiliza al cliente." },
      { phrase: "Buying links and PBNs are too risky.", translation: "Comprar enlaces y las PBNs son demasiado arriesgados.", context: "Justificación habitual de evitar black hat." },
      { phrase: "We landed a few links from digital PR.", translation: "Conseguimos varios enlaces vía digital PR.", context: "'Land a link' es la colocación informal por excelencia." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre link building.",
      questions: [
        { question: "La Skyscraper Technique fue creada por...", options: ["Rand Fishkin", "Brian Dean", "Aleyda Solis"], correct: 1 },
        { question: "Comprar enlaces y usar PBNs se considera...", options: ["white hat", "black hat", "digital PR"], correct: 1 },
        { question: "'Outreach' se refiere a...", options: ["contactar proactivamente para conseguir enlaces", "borrar enlaces", "indexar páginas"], correct: 0 },
        { question: "'We landed a link' significa que...", options: ["perdimos un enlace", "conseguimos un enlace", "compramos un enlace"], correct: 1 },
      ],
    },
  },
  // ────────────────────────────── LOCAL SEO ──────────────────────────────
  {
    slug: "local-seo",
    section: "Local SEO",
    free: false,
    order: 11,
    duration: "15 min",
    title: "Local SEO en inglés: GBP, NAP y Map Pack | aprendoingles.online",
    h1: "Local SEO: Google Business Profile, NAP y Map Pack",
    metaDescription: "Aprende en inglés el vocabulario del Local SEO: Google Business Profile, NAP consistency, local citations, Map Pack y LocalBusiness schema.",
    description: "Google Business Profile, NAP consistency, citations y el Map Pack: el vocabulario del posicionamiento local en inglés.",
    intro: "El Local SEO es para negocios con presencia física o geográfica. Tiene su propio vocabulario, casi siempre en inglés: Google Business Profile, NAP, Map Pack... Google ordena los resultados locales según relevancia, distancia y prominencia. Esta lección te da los términos esenciales.",
    vocabulary: [
      { term: "Google Business Profile (GBP)", definition: "Ficha de empresa en Google (antes Google My Business).", example: "Claim and verify your Google Business Profile first." },
      { term: "NAP consistency", definition: "Name, Address, Phone idénticos en toda la web.", example: "NAP consistency across directories builds local trust." },
      { term: "Local citation", definition: "Mención/listado de tu negocio en directorios online.", example: "We cleaned up inconsistent local citations." },
      { term: "Map Pack / Local Pack", definition: "El bloque con los 3 resultados locales destacados del mapa.", example: "We finally broke into the Map Pack for that search." },
      { term: "Proximity / distance", definition: "Proximidad: cómo de cerca está el negocio del buscador. Factor local clave.", example: "Proximity is a strong local ranking factor." },
      { term: "Prominence", definition: "Prominencia: cómo de conocido/reputado es el negocio.", example: "Reviews and links boost local prominence." },
      { term: "LocalBusiness schema", definition: "Datos estructurados específicos para negocios locales.", example: "Add LocalBusiness schema with your address and hours." },
    ],
    keyPhrases: [
      { phrase: "Let's optimize the Google Business Profile.", translation: "Vamos a optimizar la ficha de Google Business Profile.", context: "Primer paso de casi cualquier proyecto local." },
      { phrase: "Your NAP isn't consistent across directories.", translation: "Tu NAP no es consistente en los directorios.", context: "Hallazgo habitual en una auditoría local." },
      { phrase: "We want to rank in the Map Pack.", translation: "Queremos posicionar en el Map Pack.", context: "Objetivo central del Local SEO." },
      { phrase: "Reviews help with local prominence.", translation: "Las reseñas ayudan con la prominencia local.", context: "Explica un factor de ranking local." },
      { phrase: "Proximity plays a big role in local results.", translation: "La proximidad influye mucho en los resultados locales.", context: "Matiz que distingue el Local SEO del orgánico general." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre Local SEO.",
      questions: [
        { question: "'NAP' son las siglas de...", options: ["Name, Address, Phone", "New Author Page", "No Ads Policy"], correct: 0 },
        { question: "El bloque con los 3 resultados locales del mapa es el...", options: ["Map Pack", "rich result", "canonical"], correct: 0 },
        { question: "¿Cuál de estos es un factor de ranking LOCAL específico?", options: ["proximity (distancia)", "Core Web Vitals", "anchor text"], correct: 0 },
        { question: "La ficha de empresa en Google se llama ahora...", options: ["Google Business Profile", "Google Webmaster Tools", "Google Index"], correct: 0 },
      ],
    },
  },
  // ───────────────────────── ANALÍTICA Y MEDICIÓN ─────────────────────────
  {
    slug: "metricas-kpis-search-console-ga4",
    section: "Analítica y Medición",
    free: false,
    order: 12,
    duration: "20 min",
    title: "Métricas y KPIs de SEO en inglés: GSC y GA4 | aprendoingles.online",
    h1: "Métricas vs. KPIs: Search Console y Google Analytics 4",
    metaDescription: "Aprende en inglés a medir SEO: diferencia entre metrics y KPIs, impressions, clicks, CTR, average position y los datos de Search Console y GA4.",
    description: "Metrics vs. KPIs, impressions, clicks, CTR y average position: el vocabulario para medir y reportar SEO en inglés.",
    intro: "Lo que no se mide no se mejora. Pero ojo: no todo dato es un KPI. En inglés se distingue claramente 'metric' de 'KPI'. Verás las dos herramientas gratuitas de primera parte —Google Search Console y GA4— y las métricas que reportarás a diario, con su pronunciación.",
    vocabulary: [
      { term: "Metric", definition: "Métrica: cualquier dato que puedes medir.", example: "Bounce rate is a metric, but it's not always a KPI." },
      { term: "KPI", definition: "Key Performance Indicator: la métrica que de verdad mide el éxito. Se dice 'K-P-I'.", example: "Organic conversions are our main KPI." },
      { term: "Impressions", definition: "Impresiones: cuántas veces apareció tu página en resultados.", example: "Impressions are up but clicks are flat." },
      { term: "Clicks / CTR", definition: "Clics y Click-Through Rate (ratio de clics). Se dice 'C-T-R'.", example: "A better title tag improved our CTR." },
      { term: "Average position", definition: "Posición media de tus páginas para las consultas.", example: "Our average position improved from 12 to 7." },
      { term: "Organic traffic", definition: "Tráfico orgánico: visitas desde resultados no pagados.", example: "Organic traffic grew 30% quarter over quarter." },
      { term: "Baseline", definition: "Línea base: el punto de partida con el que comparas el progreso.", example: "Set a baseline before you measure progress." },
      { term: "Branded vs. non-branded queries", definition: "Consultas con tu marca vs. sin tu marca.", example: "Non-branded queries show true SEO growth." },
    ],
    keyPhrases: [
      { phrase: "That's a metric, but it's not our KPI.", translation: "Eso es una métrica, pero no es nuestro KPI.", context: "Distinción clave al definir objetivos con un cliente." },
      { phrase: "Impressions are up, but the CTR is flat.", translation: "Las impresiones suben, pero el CTR está plano.", context: "'Flat' = sin cambios. Análisis típico de Search Console." },
      { phrase: "Let's set a baseline before we measure progress.", translation: "Fijemos una línea base antes de medir el progreso.", context: "Buena práctica al arrancar un proyecto." },
      { phrase: "Non-branded queries show our real SEO growth.", translation: "Las consultas sin marca muestran nuestro crecimiento real en SEO.", context: "Matiz importante al reportar resultados." },
      { phrase: "Let's track what maps to business goals.", translation: "Midamos lo que conecta con los objetivos de negocio.", context: "Principio de medición orientada a negocio." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre medición.",
      questions: [
        { question: "La diferencia entre 'metric' y 'KPI' es que un KPI...", options: ["es cualquier dato medible", "es la métrica que mide el éxito real", "no se puede medir"], correct: 1 },
        { question: "'Impressions are up but clicks are flat' significa que los clics...", options: ["suben mucho", "no cambian", "desaparecen"], correct: 1 },
        { question: "Para ver el crecimiento real de SEO conviene mirar las consultas...", options: ["branded (con marca)", "non-branded (sin marca)", "de pago"], correct: 1 },
        { question: "Un 'baseline' es...", options: ["el punto de partida para comparar", "una penalización", "un tipo de backlink"], correct: 0 },
      ],
    },
  },
  // ─────────────────────── SEO EN LA ERA DE LA IA ───────────────────────
  {
    slug: "eeat-y-ymyl",
    section: "SEO en la Era de la IA",
    free: false,
    order: 13,
    duration: "20 min",
    title: "E-E-A-T y YMYL en inglés | aprendoingles.online",
    h1: "E-E-A-T y YMYL: calidad de contenido en inglés",
    metaDescription: "Aprende en inglés qué son E-E-A-T (Experience, Expertise, Authoritativeness, Trust) e YMYL, y por qué Trust es el factor más importante para Google.",
    description: "E-E-A-T (con la nueva 'E' de Experience) e YMYL: el marco de calidad de Google y su vocabulario en inglés.",
    intro: "E-E-A-T es el marco con el que los quality raters de Google evalúan la calidad. La segunda 'E' (Experience) se añadió en diciembre de 2022, y Google afirma que Trust es el más importante de los cuatro. Ojo a un matiz clave: E-E-A-T es un concepto de calidad, no un factor de ranking directo. Verás también YMYL.",
    vocabulary: [
      { term: "E-E-A-T", definition: "Experience, Expertise, Authoritativeness, Trust. Se dice letra a letra.", example: "Strong E-E-A-T matters most for sensitive topics." },
      { term: "Experience (la nueva E)", definition: "Experiencia de primera mano del autor. Añadida en diciembre de 2022.", example: "A review written from real experience shows the first E in E-E-A-T." },
      { term: "Expertise", definition: "Pericia: conocimiento experto sobre el tema.", example: "Medical content needs genuine expertise." },
      { term: "Authoritativeness", definition: "Autoridad: ser reconocido como referente.", example: "Citations and mentions build authoritativeness." },
      { term: "Trust", definition: "Confianza: el factor más importante según Google.", example: "Google says Trust is the most important part of E-E-A-T." },
      { term: "YMYL (Your Money or Your Life)", definition: "Temas que afectan a salud, dinero o seguridad. Se dice letra a letra.", example: "Finance and health are classic YMYL topics." },
      { term: "Quality rater", definition: "Evaluador de calidad: personas que valoran resultados según las guidelines de Google.", example: "Quality raters don't directly change rankings." },
    ],
    keyPhrases: [
      { phrase: "Trust is the most important part of E-E-A-T.", translation: "Trust es la parte más importante de E-E-A-T.", context: "Afirmación literal de Google; cítala con seguridad." },
      { phrase: "This is a YMYL topic, so quality bar is higher.", translation: "Es un tema YMYL, así que el listón de calidad es más alto.", context: "Justificación habitual para exigir más a un contenido." },
      { phrase: "E-E-A-T isn't a direct ranking factor.", translation: "E-E-A-T no es un factor de posicionamiento directo.", context: "Matiz clave para no propagar un error común." },
      { phrase: "Let's show first-hand experience in this article.", translation: "Mostremos experiencia de primera mano en este artículo.", context: "Aplica la nueva 'E' (Experience)." },
      { phrase: "We need a credible, named author here.", translation: "Necesitamos un autor con nombre y credibilidad aquí.", context: "Táctica para reforzar autoría y confianza." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre calidad de contenido.",
      questions: [
        { question: "Según Google, el componente MÁS importante de E-E-A-T es...", options: ["Expertise", "Trust", "Authoritativeness"], correct: 1 },
        { question: "La segunda 'E' que se añadió en 2022 significa...", options: ["Engagement", "Experience", "Efficiency"], correct: 1 },
        { question: "'YMYL' se refiere a temas que afectan a...", options: ["salud, dinero o seguridad", "imágenes y vídeos", "velocidad de carga"], correct: 0 },
        { question: "Sobre E-E-A-T, lo correcto es decir que...", options: ["es un factor de ranking directo", "NO es un factor de ranking directo", "sustituye a los backlinks"], correct: 1 },
      ],
    },
  },
  {
    slug: "ai-overviews-geo-aeo",
    section: "SEO en la Era de la IA",
    free: false,
    order: 14,
    duration: "20 min",
    title: "AI Overviews, GEO y AEO en inglés | aprendoingles.online",
    h1: "AI Overviews, GEO/AEO y zero-click en inglés",
    metaDescription: "Aprende en inglés el vocabulario del SEO en la era de la IA: AI Overviews, GEO, AEO, zero-click searches y el impacto en el CTR.",
    description: "AI Overviews, GEO/AEO, zero-click y answer-first: el vocabulario nuevo (y aún en debate) del SEO en la era de la IA.",
    intro: "El SEO está cambiando con la IA. Aparecen las AI Overviews y un vocabulario nuevo —GEO, AEO— que ni los propios profesionales nativos tienen del todo asentado. Esta lección te da el cluster de términos y un dato clave: la presencia de una AI Overview se asocia a un CTR mucho menor para el primer resultado. Google, por su parte, insiste en que optimizar para IA sigue siendo SEO.",
    vocabulary: [
      { term: "AI Overview", definition: "Resumen generado por IA que aparece en la parte superior del SERP.", example: "An AI Overview often answers the query without a click." },
      { term: "GEO (Generative Engine Optimization)", definition: "Optimizar para ser citado en respuestas de IA. Término aún en debate.", example: "GEO is about getting cited inside AI answers." },
      { term: "AEO (Answer Engine Optimization)", definition: "Casi sinónimo de GEO: optimizar para motores de respuestas.", example: "Some teams say AEO, others say GEO — same idea." },
      { term: "Zero-click search", definition: "Búsqueda sin clic: el usuario obtiene la respuesta sin entrar en ninguna web.", example: "AI Overviews increase zero-click searches." },
      { term: "Answer-first / answer engine", definition: "Experiencia centrada en dar la respuesta directa (ChatGPT, Perplexity...).", example: "Answer engines like Perplexity cite their sources." },
      { term: "To get cited", definition: "Ser citado/mencionado como fuente en una respuesta de IA.", example: "The goal now is to get cited in AI answers." },
      { term: "Clickthrough rate (CTR)", definition: "Ratio de clics. Las AI Overviews tienden a reducirlo.", example: "AI Overviews correlate with a lower clickthrough rate." },
    ],
    keyPhrases: [
      { phrase: "AI Overviews are eating into our clickthrough rate.", translation: "Las AI Overviews están reduciendo nuestro CTR.", context: "'Eat into' = mermar. Preocupación muy actual." },
      { phrase: "We want to get cited in AI answers.", translation: "Queremos que nos citen en las respuestas de IA.", context: "Nuevo objetivo de la era GEO/AEO." },
      { phrase: "GEO and AEO are often used interchangeably.", translation: "GEO y AEO se usan a menudo indistintamente.", context: "Importante: el vocabulario aún no está fijado." },
      { phrase: "Optimizing for AI is still SEO, really.", translation: "Optimizar para la IA sigue siendo SEO, en realidad.", context: "Postura oficial de Google; útil para no caer en modas." },
      { phrase: "We're seeing more zero-click searches.", translation: "Vemos cada vez más búsquedas sin clic.", context: "Tendencia clave del SERP actual." },
    ],
    exercise: {
      instruction: "Elige la opción correcta sobre SEO e IA.",
      questions: [
        { question: "Una 'zero-click search' es una búsqueda en la que el usuario...", options: ["hace muchos clics", "obtiene la respuesta sin entrar en ninguna web", "compra algo"], correct: 1 },
        { question: "GEO y AEO son términos que...", options: ["significan cosas totalmente distintas", "se usan a menudo de forma intercambiable", "ya no se usan"], correct: 1 },
        { question: "Según Google, optimizar para la IA generativa...", options: ["sigue siendo SEO", "no tiene nada que ver con el SEO", "requiere un archivo llms.txt obligatorio"], correct: 0 },
        { question: "'AI Overviews are eating into our CTR' significa que el CTR...", options: ["sube", "baja / se ve mermado", "no cambia"], correct: 1 },
      ],
    },
  },
  // ───────────────────────── INGLÉS PROFESIONAL SEO ─────────────────────────
  {
    slug: "acronimos-y-pronunciacion",
    section: "Inglés Profesional SEO",
    free: false,
    order: 15,
    duration: "15 min",
    title: "Acrónimos de SEO y su pronunciación en inglés | aprendoingles.online",
    h1: "Acrónimos de SEO: cómo se pronuncian en inglés",
    metaDescription: "Aprende a pronunciar los acrónimos del SEO en inglés: SEO, SERP, CTR, E-E-A-T, GEO, hreflang y más. La lección clave para no quedar en evidencia.",
    description: "SEO, SERP, CTR, E-E-A-T, GEO, hreflang... cómo se dicen de verdad los acrónimos del SEO en inglés.",
    intro: "Pocas cosas delatan tanto a un no nativo como pronunciar mal un acrónimo. ¿'SEO' se deletrea o se dice 'sío'? ¿'SERP' es una palabra? Esta lección resuelve la pronunciación real de los acrónimos del sector. Aviso: algunas varían según el equipo o la región, así que aprende la convención común y mantén flexibilidad.",
    vocabulary: [
      { term: "SEO", definition: "Se deletrea: 'S-E-O', nunca 'sío'. 'SEOs' son los profesionales.", example: "She's one of the best SEOs (say 'S-E-Os') in the country." },
      { term: "SERP", definition: "Se dice como palabra: 'serp' (rima con 'burp'). Plural 'the SERPs'.", example: "The SERPs are getting more crowded with AI features." },
      { term: "CTR", definition: "Se deletrea: 'C-T-R' (click-through rate).", example: "Our C-T-R went up after the title change." },
      { term: "GA4 / GSC", definition: "'GA4' = 'gee-ay-four'; 'GSC' = 'G-S-C' (Search Console).", example: "Check GA4 and GSC for the full picture." },
      { term: "E-E-A-T", definition: "Se deletrea: 'E-E-A-T'. El antiguo 'E-A-T' a veces se decía 'eat'.", example: "Say each letter: E-E-A-T, not 'eat'." },
      { term: "GEO / AEO", definition: "'GEO' = 'gee-ee-oh' o 'G-E-O'; 'AEO' = 'A-E-O'.", example: "GEO (just say the letters) is the new buzzword." },
      { term: "hreflang", definition: "Se escribe en minúscula; se dice 'aitch-reflang'.", example: "We set hreflang for the Spanish and English versions." },
      { term: "SaaS", definition: "Se dice como palabra: 'sass'.", example: "Most of our clients are SaaS (say 'sass') companies." },
    ],
    keyPhrases: [
      { phrase: "She's one of the best SEOs out there.", translation: "Es una de las mejores profesionales de SEO que hay.", context: "Aquí 'SEOs' = las personas, deletreado 'S-E-Os'." },
      { phrase: "The SERPs are getting more crowded.", translation: "Los SERPs están cada vez más saturados.", context: "'SERP' se pronuncia como palabra, no se deletrea." },
      { phrase: "Let's check GA4 and GSC.", translation: "Revisemos GA4 y GSC.", context: "Pronuncia 'gee-ay-four' y 'G-S-C'." },
      { phrase: "Say each letter: E-E-A-T.", translation: "Di cada letra: E-E-A-T.", context: "Corrección habitual; evita decir 'eat'." },
      { phrase: "Pronunciation varies a bit by team.", translation: "La pronunciación varía un poco según el equipo.", context: "Reconoce que algunos acrónimos (p. ej. CRO) tienen variantes." },
    ],
    exercise: {
      instruction: "Elige la pronunciación correcta.",
      questions: [
        { question: "'SEO' se pronuncia...", options: ["'sío' (como palabra)", "deletreado: S-E-O", "'seh-oh'"], correct: 1 },
        { question: "'SERP' se pronuncia...", options: ["deletreado: S-E-R-P", "como palabra: 'serp'", "'serpi'"], correct: 1 },
        { question: "'E-E-A-T' se dice...", options: ["'eat' (como 'comer')", "letra a letra: E-E-A-T", "'eee-at'"], correct: 1 },
        { question: "'SaaS' se pronuncia...", options: ["'sass' (como palabra)", "deletreado: S-A-A-S", "'sa-as'"], correct: 0 },
      ],
    },
  },
  {
    slug: "presentar-una-auditoria",
    section: "Inglés Profesional SEO",
    free: false,
    order: 16,
    duration: "20 min",
    title: "Presentar una auditoría SEO en inglés | aprendoingles.online",
    h1: "Presentar una auditoría: impact/effort y hedging sobre Google",
    metaDescription: "Aprende a presentar una auditoría SEO en inglés: priorizar por impact/effort, quick wins, roadmap y el registro de 'hedging' para hablar de Google con cautela.",
    description: "Priorizar por impact/effort, hablar de quick wins y dominar el 'hedging' al referirte a Google: el registro profesional del SEO.",
    intro: "Saber SEO no basta: hay que comunicarlo. En inglés, las auditorías siguen un registro muy concreto: se prioriza por impacto y esfuerzo, se habla de 'quick wins' y, sobre todo, se usa un lenguaje cauto ('hedging') al hablar de Google, porque casi nada está 100% confirmado. Esta lección te da ese registro profesional.",
    vocabulary: [
      { term: "High impact, low effort", definition: "Alto impacto, bajo esfuerzo: lo primero que se prioriza.", example: "Let's start with the high impact, low effort items." },
      { term: "Quick win", definition: "Victoria rápida: mejora fácil y de efecto rápido.", example: "Fixing those title tags is a quick win." },
      { term: "To prioritize", definition: "Priorizar (por impacto/esfuerzo o ROI).", example: "We prioritize by least effort, maximum ROI." },
      { term: "Roadmap", definition: "Hoja de ruta (a menudo 30/60/90 días).", example: "Here's the 30/60/90-day roadmap." },
      { term: "Actionable", definition: "Accionable: una recomendación concreta y ejecutable.", example: "Every finding should be actionable." },
      { term: "Buy-in / stakeholders", definition: "Respaldo de las partes interesadas para ejecutar el plan.", example: "We need buy-in from the key stakeholders." },
      { term: "To hedge (a claim)", definition: "Matizar una afirmación cuando no hay certeza (registro clave con Google).", example: "Notice how SEOs hedge claims about Google." },
    ],
    keyPhrases: [
      { phrase: "I'd recommend prioritizing the quick wins first.", translation: "Recomendaría priorizar primero las quick wins.", context: "Fórmula estándar para abrir recomendaciones." },
      { phrase: "This is high impact, low effort.", translation: "Esto es de alto impacto y bajo esfuerzo.", context: "El marco de priorización por excelencia (matriz 2x2)." },
      { phrase: "It appears that the update favored fresh content.", translation: "Parece que la actualización favoreció el contenido fresco.", context: "Hedging: 'it appears that' en vez de afirmar con rotundidad." },
      { phrase: "Google hasn't confirmed this, but anecdotally...", translation: "Google no lo ha confirmado, pero según lo que vemos...", context: "Registro cauto clásico al hablar de algoritmos." },
      { phrase: "Let's connect these issues to business outcomes.", translation: "Conectemos estos problemas con los resultados de negocio.", context: "Clave para que un cliente no técnico entienda el valor." },
    ],
    exercise: {
      instruction: "Elige la opción más profesional para presentar una auditoría.",
      questions: [
        { question: "¿Qué tareas se priorizan normalmente primero?", options: ["high impact, low effort", "low impact, high effort", "las más caras"], correct: 0 },
        { question: "Una 'quick win' es...", options: ["una mejora fácil y de efecto rápido", "una penalización", "un backlink de pago"], correct: 0 },
        { question: "Para hablar de un cambio de algoritmo NO confirmado, lo profesional es decir:", options: ["'Google definitely did X.'", "'It appears that...' / 'anecdotally...'", "'Everyone knows X.'"], correct: 1 },
        { question: "Hablar con cautela y matizar afirmaciones sobre Google se llama...", options: ["stuffing", "hedging", "crawling"], correct: 1 },
        { question: "Para que un cliente no técnico entienda el valor, conviene...", options: ["usar más jerga técnica", "conectar los problemas con resultados de negocio", "evitar dar recomendaciones"], correct: 1 },
      ],
    },
  },
];

async function migrate() {
  console.log(`🚀 Migrando ${lessons.length} lecciones de Inglés para SEO...\n`);

  for (const lesson of lessons) {
    const vocabulary = (lesson.vocabulary || []).map((v, i) => ({
      _key: `vocab-${i}`,
      _type: "vocabItem",
      term: v.term,
      definition: v.definition,
      example: v.example,
    }));

    const keyPhrases = (lesson.keyPhrases || []).map((p, i) => ({
      _key: `phrase-${i}`,
      _type: "phraseItem",
      phrase: p.phrase,
      translation: p.translation,
      context: p.context,
    }));

    const questions = (lesson.exercise?.questions || []).map((q, i) => ({
      _key: `q-${i}`,
      _type: "questionItem",
      question: q.question,
      options: q.options,
      correct: q.correct,
    }));

    await client.createOrReplace({
      _id: `lesson-seo-${lesson.slug}`,
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
      vocabulary,
      keyPhrases,
      exercise: { instruction: lesson.exercise.instruction, questions },
      aiTutor: { enabled: false },
    });

    console.log(`   ✅ ${lesson.order}. ${lesson.h1}`);
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ ${lessons.length} lecciones de SEO migradas`);
  console.log(`═══════════════════════════════════════`);
}

migrate().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
