import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import type { PracticeScenario } from "@/lib/practice";

/**
 * Grades one role-play call with Claude. Two things at once, as the course
 * promises: the English (fluency, grammar, vocabulary) and the work skill
 * (did the cold call follow the method of the lesson?). Feedback is written
 * in Spanish for the learner; corrections quote their own words.
 *
 * Scores are 0-10 per dimension; `overall` is 0-100. Keep the field names
 * stable: dashboards (learner and company) read them from
 * practice_sessions.scores / .feedback.
 */

export const EVALUATOR_MODEL = "claude-opus-5-5";

const Score = z.number().int().min(0).max(10);

export const Evaluation = z.object({
  overall: z.number().int().min(0).max(100),
  goal_achieved: z.boolean(),
  cefr_estimate: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  scores: z.object({
    task: Score,
    skill: Score,
    fluency: Score,
    grammar: Score,
    vocabulary: Score,
    clarity: Score,
  }),
  summary: z.string(),
  strengths: z.array(z.string()),
  corrections: z.array(
    z.object({ said: z.string(), better: z.string(), why: z.string() }),
  ),
  phrases_used: z.array(z.string()),
  next_focus: z.string(),
});

export type EvaluationResult = z.infer<typeof Evaluation>;

const SYSTEM = `You grade short spoken role-play calls on aprendoingles.online, where Spanish-speaking professionals learn English and a work skill at the same time. A learner has just finished a phone call (max 5 minutes) with an AI character, right after a short lesson.

You receive the lesson, the scenario, the skill criteria, the expressions they were asked to use and the transcript (speech-to-text, so ignore punctuation, casing and obvious transcription noise; never penalise spelling).

Grade both halves, honestly and specifically:
- English: fluency (flow, hesitation, turn length), grammar, vocabulary (range and register for the job), clarity (would a native listener understand without effort).
- Skill: did they apply the method of the lesson (the skill criteria)? task = did they reach the mission.

Scale for each 0-10 score: 0-3 blocks communication or ignores the method, 4-5 gets by with clear gaps, 6-7 solid with some slips, 8-9 strong professional level, 10 flawless. overall (0-100) weighs skill+task 50% and English 50%. If the learner barely spoke (fewer than ~4 turns or ~40 words), score low, say so in the summary and do not invent strengths.

cefr_estimate: the CEFR level their speaking shows in THIS call.

Write summary, strengths, corrections.why and next_focus in Spanish (Spain), second person (tú), warm and direct, no fluff. summary: 2-3 sentences. strengths: 2-3 concrete things, quoting them when possible. corrections: up to 5, the ones that matter most for a professional; "said" quotes the learner verbatim from the transcript, "better" is the natural English a native professional would use, "why" one short line in Spanish. phrases_used: the requested expressions they actually used (or a close variant of), each copied exactly as written in the list, character for character. next_focus: one concrete thing to practise on the next call.`;

/** ElevenLabs' expressive TTS leaves audio tags like "[slow]" in the text. */
export function stripAudioTags(text: string) {
  return text.replace(/\[[a-z][a-z ]{0,24}\]\s*/gi, "").trim();
}

function formatTranscript(
  transcript: { role: "user" | "agent"; message: string | null; time_in_call_secs: number }[],
  characterName: string,
) {
  return transcript
    .filter((t) => t.message && t.message.trim() && t.message.trim() !== "...")
    .map((t) => `${t.role === "user" ? "LEARNER" : characterName.toUpperCase()}: ${stripAudioTags(t.message!)}`)
    .join("\n");
}

export function countLearnerWords(
  transcript: { role: "user" | "agent"; message: string | null }[],
) {
  return transcript
    .filter((t) => t.role === "user" && t.message)
    .reduce((n, t) => n + t.message!.trim().split(/\s+/).filter(Boolean).length, 0);
}

export async function evaluateCall(input: {
  scenario: PracticeScenario;
  englishLevel: string;
  transcript: { role: "user" | "agent"; message: string | null; time_in_call_secs: number }[];
  durationSeconds: number;
}): Promise<EvaluationResult> {
  const { scenario, englishLevel, transcript, durationSeconds } = input;
  const client = new Anthropic();

  const brief = [
    `Course: ${scenario.courseTitle}`,
    `Lesson: ${scenario.lessonTitle}`,
    `Learner's declared English level: ${englishLevel}`,
    `Call duration: ${durationSeconds}s`,
    "",
    `Character: ${scenario.characterName} — ${scenario.persona}`,
    `Scenario: ${scenario.scenario}`,
    `Mission: ${scenario.learnerGoal}`,
    "",
    "Skill criteria:",
    ...scenario.skillCriteria.map((c) => `- ${c}`),
    "",
    "Expressions they were asked to use:",
    ...scenario.mustUse.map((p) => `- ${p}`),
  ].join("\n");

  const response = await client.beta.messages.parse({
    model: EVALUATOR_MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-06-01"],
    fallbacks: [{ model: "claude-opus-4-8" }],
    output_config: { effort: "medium", format: betaZodOutputFormat(Evaluation) },
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `<lesson>\n${brief}\n</lesson>\n\n<transcript>\n${formatTranscript(transcript, scenario.characterName)}\n</transcript>`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("La evaluación fue rechazada por el modelo");
  }
  if (!response.parsed_output) {
    throw new Error(`Evaluación sin salida válida (stop_reason: ${response.stop_reason})`);
  }
  return response.parsed_output;
}
