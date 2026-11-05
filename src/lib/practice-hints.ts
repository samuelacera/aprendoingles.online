import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import type { PracticeScenario } from "@/lib/practice";

/**
 * "Modo guiado": while the character talks, suggest 3 short things the
 * learner could say next. Speed matters more than depth (the learner is
 * on the phone), so it runs on Haiku with a tiny output.
 *
 * Server-only.
 */

export const HINT_MODEL = "claude-haiku-5-5";

/** Suggestion rounds per call (cost guard: a 5-minute call has ~15 turns). */
export const MAX_HINTS_PER_CALL = 40;

const Hints = z.object({
  suggestions: z
    .array(
      z.object({
        en: z.string().describe("What to say, in natural spoken English, max ~18 words"),
        es: z.string().describe("Pista en español: para qué sirve, máximo 8 palabras"),
      }),
    )
    .min(1)
    .max(3),
});
export type HintResult = z.infer<typeof Hints>;

const SYSTEM = `You coach a Spanish-speaking professional live, during a short English phone role-play. They can see your suggestions on screen while the other person talks.

Give exactly 3 different options for what the learner could say NEXT, as the learner (first person), in natural spoken English a native professional would use. Each one moves the call towards the mission using the method of the lesson. Make them distinct: e.g. one safe, one that asks a question, one that pushes to the next step. Keep each under ~18 words, easy to read aloud at a glance, at about the learner's level. Prefer the lesson's expressions when they fit and haven't been used yet. Reply to what the other person actually just said.

"es" is a very short hint in Spanish (Spain) about what the option does, e.g. "Pide permiso", "Responde a la objeción", "Propón día y hora".`;

export async function suggestNext(input: {
  scenario: PracticeScenario;
  englishLevel: string;
  learnerName: string;
  lines: { who: "me" | "them"; text: string }[];
}): Promise<HintResult> {
  const { scenario, englishLevel, learnerName, lines } = input;
  const client = new Anthropic();

  const context = [
    `Learner's first name (use it if they introduce themselves): ${learnerName}`,
    `Learner's English level: ${englishLevel}`,
    `The learner is talking to: ${scenario.characterName}, ${scenario.characterRole}`,
    `Situation (learner's side): ${scenario.brief}`,
    `Mission: ${scenario.mission}`,
    "Method of the lesson:",
    ...scenario.skillCriteria.map((c) => `- ${c}`),
    "Lesson expressions:",
    ...scenario.mustUse.map((p) => `- ${p}`),
  ].join("\n");

  const transcript = lines.length
    ? lines
        .map((l) => `${l.who === "me" ? "LEARNER" : scenario.characterName.toUpperCase()}: ${l.text}`)
        .join("\n")
    : "(The call is just connecting. Nobody has spoken yet.)";

  const response = await client.beta.messages.parse({
    model: HINT_MODEL,
    max_tokens: 1500,
    thinking: { type: "disabled" },
    output_config: { format: betaZodOutputFormat(Hints) },
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `<lesson>\n${context}\n</lesson>\n\n<call_so_far>\n${transcript}\n</call_so_far>`,
      },
    ],
  });

  if (!response.parsed_output) {
    throw new Error(`Sugerencias sin salida válida (stop_reason: ${response.stop_reason})`);
  }
  return response.parsed_output;
}
