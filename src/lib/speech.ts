/**
 * "Escuchar" buttons: the English of a lesson (vocabulary, examples, key
 * phrases, practice expressions) read aloud by an ElevenLabs voice.
 *
 * Shared by client and server. The URL carries only a hash of the text,
 * never the text: the server serves audio only for text that already is
 * in that published lesson, so the endpoint can't be used as a free TTS.
 * Same text → same URL → cached by the CDN and the browser, so each
 * phrase is paid once.
 */

/** FNV-1a 32-bit, hex. Tiny and identical in the browser and in Node. */
export function speechHash(text: string): string {
  const s = normalizeSpeech(text);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/** What actually gets read: no quotes, no "...", single spaces. */
export function normalizeSpeech(text: string): string {
  return text
    .replace(/[“”"«»]/g, "")
    .replace(/\.{3}|…/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function speechUrl(courseSlug: string, lessonSlug: string, text: string) {
  return `/api/v1/audio/${courseSlug}/${lessonSlug}/${speechHash(text)}`;
}
