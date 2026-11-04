import { client } from "@/sanity/client";

/**
 * Voice practice: a ≤5-minute role-play call with ONE ElevenLabs agent
 * ("aprendoingles · Roleplay de lección") that plays the character of each
 * lesson. The scenario lives in Sanity (lesson.practice); the server reads
 * it here, so the agent and the evaluator always use the CMS version, never
 * what a client sends.
 *
 * Server-only: never import from a client component.
 *
 * Flow (all under /api/v1/practice):
 *   POST /sessions                → access + limits → signed URL + variables
 *   POST /sessions/:id/complete   → link the ElevenLabs conversation,
 *                                   wait for its transcript → Claude evaluation
 *   GET  /sessions?course&lesson  → the learner's history for a lesson
 */

export const AGENT_ID =
  process.env.ELEVENLABS_PRACTICE_AGENT_ID || "agent_0901m6hbtmtaf24ata7h2g23jmh9";

export const MAX_CALL_SECONDS = 300;

/** Calls a learner can start per day (cost guard: ~0,08 € per minute). */
export const DAILY_CALLS_PER_USER = 10;

const ELEVEN = "https://api.elevenlabs.io/v1/convai";

export interface PracticeScenario {
  key: string;
  title: string;
  brief: string;
  mission: string;
  mustUse: string[];
  characterName: string;
  characterRole: string;
  voiceId: string | null;
  firstMessage: string | null;
  persona: string;
  scenario: string;
  learnerGoal: string;
  behaviour: string;
  skillCriteria: string[];
  lessonTitle: string;
  lessonFree: boolean;
  courseTitle: string;
  keyPhrases: { phrase: string; translation: string }[];
}

export async function getPracticeScenario(
  courseSlug: string,
  lessonSlug: string,
): Promise<PracticeScenario | null> {
  // Live API, not the CDN: a scenario edited in /studio reaches the next call.
  return client.withConfig({ useCdn: false }).fetch(
    `*[_type == "lesson" && slug.current == $lessonSlug && course->slug.current == $courseSlug
       && published == true && practice.enabled == true][0] {
      "key": practice.key,
      "title": practice.title,
      "brief": practice.brief,
      "mission": practice.mission,
      "mustUse": coalesce(practice.mustUse, []),
      "characterName": practice.characterName,
      "characterRole": practice.characterRole,
      "voiceId": practice.voiceId,
      "firstMessage": practice.firstMessage,
      "persona": practice.persona,
      "scenario": practice.scenario,
      "learnerGoal": practice.learnerGoal,
      "behaviour": practice.behaviour,
      "skillCriteria": coalesce(practice.skillCriteria, []),
      "lessonTitle": h1,
      "lessonFree": coalesce(free, false),
      "courseTitle": course->h1,
      "keyPhrases": coalesce(keyPhrases[] { phrase, translation }, [])
    }`,
    { courseSlug, lessonSlug },
    { cache: "no-store" },
  );
}

function elevenKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("Falta ELEVENLABS_API_KEY");
  return key;
}

/** One-use signed WebSocket URL for the agent (valid ~15 minutes). */
export async function getSignedUrl(): Promise<string> {
  const r = await fetch(
    `${ELEVEN}/conversation/get-signed-url?agent_id=${AGENT_ID}`,
    { headers: { "xi-api-key": elevenKey() }, cache: "no-store" },
  );
  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    throw new Error(`ElevenLabs get-signed-url ${r.status}: ${detail.slice(0, 200)}`);
  }
  const { signed_url } = (await r.json()) as { signed_url: string };
  return signed_url;
}

export interface ElevenConversation {
  agent_id: string;
  status: "initiated" | "in-progress" | "processing" | "done" | "failed";
  transcript: { role: "user" | "agent"; message: string | null; time_in_call_secs: number }[];
  metadata?: { call_duration_secs?: number };
  conversation_initiation_client_data?: {
    dynamic_variables?: Record<string, unknown>;
  };
}

export async function getConversation(id: string): Promise<ElevenConversation> {
  const r = await fetch(`${ELEVEN}/conversations/${encodeURIComponent(id)}`, {
    headers: { "xi-api-key": elevenKey() },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`ElevenLabs conversation ${r.status}`);
  return r.json();
}

/** Learner's English level from the onboarding (falls back to B1). */
export function cefrOrDefault(level: string | null | undefined): string {
  return level ? level.toUpperCase() : "B1";
}
