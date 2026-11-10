# Práctica por voz (roleplay de 5 minutos)

Cada lección puede llevar una llamada de 5 minutos como máximo con un personaje. El alumno practica en inglés lo que acaba de aprender (una venta, una negociación, un pitch…) y al colgar recibe una nota doble: de **inglés** y de **la habilidad**.

## Cómo funciona
```
Lección (Sanity: lesson.practice)
  └─ pestaña «🎙 Práctica» (components/lms/VoicePractice.tsx)
       1. POST /api/v1/practice/sessions        acceso + 10 llamadas/24 h → enlace firmado + variables
       2. SDK @elevenlabs/react (1.18.0) → agente «aprendoingles · Roleplay de lección»
       3. POST /api/v1/practice/sessions/:id/complete   (sondeo cada 3 s)
            ElevenLabs cierra la transcripción → Claude (claude-opus-5-5) corrige
            → practice_sessions (Supabase) + activity_log 'practice_call' (Fundae)
```
- **Un solo agente** para todas las lecciones: `agent_0901m6hbtmtaf24ata7h2g23jmh9`. La web le pasa el personaje con variables dinámicas (`persona`, `scenario`, `learner_goal`, `behaviour`, `learner_name`, `english_level`, `session_id`) y le cambia la voz y el saludo (overrides). LLM: `gemini-3.5-flash` (con `claude-haiku-5-5` fallaba cada turno y saltaba al de reserva). 5 min como máximo, enlace firmado obligatorio, 100 llamadas al día y 5 a la vez.
- **El escenario lo lee el servidor desde Sanity**, nunca el cliente. La corrección solo acepta una conversación de nuestro agente que lleve el `session_id` de la sesión.
- **Coste**: unos 0,08 € por minuto de voz (lo medido en Brújula) más unos 0,03 € por corrección. Una llamada de 5 minutos sale por unos 0,45 €.
- **Empresas**: cada sesión copia la `organization_id` del alumno (`organization_members`). El panel de empresa leerá `practice_sessions` filtrando por organización (índice `practice_sessions_org_idx`).

## Modo guiado y audio de las expresiones (05-11-2026)
- **Modo guiado**: antes de llamar se elige «Guiada» o «Libre» (la primera llamada viene en guiada). En guiada, cada vez que habla el personaje la web pide `POST /api/v1/practice/sessions/:id/hint` y enseña 3 ideas de qué decir (inglés + pista en español) y las expresiones que aún no se han usado. Las genera `claude-haiku-5-5` (`lib/practice-hints.ts`), en unos 2,5 s, mientras el personaje aún habla. Tope: 40 rondas por llamada.
- La sesión guarda `guided` y `hints_used` (migración `005_practice_guided.sql`; el código funciona también antes de ejecutarla). La nota guarda `feedback.guided` y Claude lo tiene en cuenta al corregir. El historial marca las llamadas guiadas.
- **Escuchar**: botón ▶ (y 🐢, al 70 %) en el vocabulario, los ejemplos, las frases clave y las expresiones de la misión (`components/lms/SpeakButton.tsx`). `GET /api/v1/audio/:curso/:lección/:hash` genera el audio con ElevenLabs (voz «Eryn», `eleven_v4_turbo`) solo si el texto está en esa lección, y lo cachea un año en la CDN: cada frase se paga una vez.
- Coste enseñado (doble del real, `lib/practice-cost.ts`): 0,01 € por ronda de ideas.

## Cómo se crea un escenario nuevo
1. Añade un objeto a `scripts/practice-scenarios.mjs` (`lessonId` de Sanity y `practice`) y súbelo con `node --env-file=.env.local scripts/seed-practice.mjs <clave>`. Con `--check` solo se valida. También se puede editar a mano en `/studio` → lección → pestaña «Práctica por voz», pero entonces el archivo deja de ser la fuente: mejor el archivo.
2. Campos que **ve el alumno** (en español): título, situación, misión, expresiones a usar (en inglés, sacadas de las frases clave de la lección), nombre y cargo del personaje.
3. Campos **para el agente** (en inglés): personaje, situación, objetivo del alumno y cómo reacciona. En «cómo reacciona» van siempre:
   - dos objeciones fijas, en orden;
   - qué le hace abrirse (y que se abra poco a poco, un dato por buena pregunta);
   - las condiciones exactas para decir que sí;
   - cuándo cuelga.
4. **Criterios de la habilidad** (en inglés, de 4 a 6): el método de la lección convertido en comprobaciones. Son los que usa el corrector.
5. **Imagen de la escena**: ilustración 16:9 sin texto, mismo estilo que las demás (prompt base: «Wide 16:9 editorial illustration, warm semi-realistic painterly style with soft grain and golden-hour lighting, no text… Split scene with a thin golden diagonal divider, linked by a dotted golden sound-wave line… Left side: the learner in a bright co-working space in Spain… Right side: the character in their office… Palette: deep navy, warm amber and gold accents, off-white»). Se genera con ElevenLabs (gpt-image-2.5, unos 3 céntimos), se guarda como `scripts/practice-images/<clave>.jpg` y su texto alternativo va en `imageAlts` de `practice-scenarios.mjs`. El script de subida la sube sola.
6. La voz: un `voice_id` que ya esté en la cuenta de ElevenLabs (prediseñadas o añadidas) y que encaje con el personaje (acento y edad).
7. `key` estable (p. ej. `cold-call-logistics`): agrupa el histórico de notas. No se cambia nunca.
8. Pruébalo con una simulación de ElevenLabs (un alumno bueno y otro flojo: ver «Pruebas») y, después, de viva voz.

## Escenarios (03-11-2026)
| Clave | Curso · lección | Personaje | Habilidad |
|---|---|---|---|
| `cold-call-logistics` | Ventas · Cómo estructurar un cold call | Mike Carter, VP Operations (EE. UU.) | Llamada en frío hasta cerrar reunión |
| `gatekeeper-saas-cfo` | Ventas · Superar gatekeepers | Emily Ross, asistente de la CFO (EE. UU.) | Pasar el filtro |
| `discovery-hr-platform` | Ventas · Preguntas de discovery (SPIN y BANT) | Dan Reyes, HR Director (EE. UU.) | Discovery y cualificación |
| `price-objection-procurement` | Ventas · Objeciones de precio | Rachel Brooks, Procurement (EE. UU.) | Negociar sin regalar descuentos |
| `consulting-cfo-challenge` | Consultoría · Manejar el challenge del cliente | Graham Whitfield, CFO (Reino Unido) | Defender una recomendación |
| `consulting-kickoff-scope-creep` | Consultoría · Kickoff y scoping | Sophie Bennett, COO (Reino Unido) | Poner límites al alcance |
| `seo-audit-cmo` | SEO · Presentar una auditoría | Lauren Mitchell, CMO (EE. UU.) | Explicar sin jerga y priorizar |

Ideas para los siguientes: elevator pitch a un inversor (cuando haya lecciones en «Inglés para emprendedores»), entrevista de trabajo, queja de un cliente, small talk en un evento, presentar resultados al jefe y daily con un equipo de fuera.

## Escenarios de cursos privados
Los escenarios de un curso privado no van en `scripts/practice-scenarios.mjs` (este repo es público): viven con el contenido del curso, fuera del repo. Ver `docs/cursos-privados.md`.

## Pruebas
Simulaciones en ElevenLabs (pestaña Tests del agente): un alumno simulado por Claude habla con el personaje y otro modelo comprueba las condiciones (no sale del personaje, no corrige, objeciones, no regala la misión…). Hay tres: `aprendoingles · cold call · alumno bueno`, `· alumno flojo` y `· precio · descuento regalado`. Para un escenario nuevo, copia una y cambia las variables.
