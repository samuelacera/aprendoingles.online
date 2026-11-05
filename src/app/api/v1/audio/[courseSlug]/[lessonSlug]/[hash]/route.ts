import { client } from "@/sanity/client";
import { normalizeSpeech, speechHash } from "@/lib/speech";

/**
 * GET /api/v1/audio/:courseSlug/:lessonSlug/:hash  → audio/mpeg
 *
 * Reads aloud one English text of the lesson (see lib/speech.ts). The
 * text is looked up by hash among the lesson's own texts, then generated
 * with ElevenLabs and cached for a year by the CDN and the browser.
 */

// American voice from the account ("Eryn - Confident Corporate Training").
const VOICE_ID = process.env.ELEVENLABS_SPEECH_VOICE_ID || "8tsLeAV5vPVuzCCvqbbU";
const MODEL_ID = "eleven_v4_turbo";
const SLUG = /^[a-z0-9-]{1,120}$/;
const HASH = /^[0-9a-f]{8}$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseSlug: string; lessonSlug: string; hash: string }> },
) {
  const { courseSlug, lessonSlug, hash } = await params;
  if (!SLUG.test(courseSlug) || !SLUG.test(lessonSlug) || !HASH.test(hash)) {
    return new Response("Bad request", { status: 400 });
  }

  const lesson: {
    vocab: { term?: string; example?: string }[] | null;
    phrases: string[] | null;
    mustUse: string[] | null;
  } | null = await client.fetch(
    `*[_type == "lesson" && slug.current == $lessonSlug && course->slug.current == $courseSlug && published == true][0] {
      "vocab": vocabulary[] { term, example },
      "phrases": keyPhrases[].phrase,
      "mustUse": practice.mustUse
    }`,
    { courseSlug, lessonSlug },
  );
  if (!lesson) return new Response("Not found", { status: 404 });

  const texts = [
    ...(lesson.vocab ?? []).flatMap((v) => [v.term, v.example]),
    ...(lesson.phrases ?? []),
    ...(lesson.mustUse ?? []),
  ].filter((t): t is string => typeof t === "string" && t.trim().length > 0);
  const text = texts.find((t) => speechHash(t) === hash);
  if (!text) return new Response("Not found", { status: 404 });

  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return new Response("TTS not configured", { status: 503 });

  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_64`,
    {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ text: normalizeSpeech(text).slice(0, 400), model_id: MODEL_ID }),
      cache: "no-store",
    },
  );
  if (!r.ok) {
    console.error("[audio] ElevenLabs", r.status, (await r.text().catch(() => "")).slice(0, 200));
    return new Response("TTS error", { status: 502 });
  }

  return new Response(r.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      // Same hash = same text = same audio, forever.
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
