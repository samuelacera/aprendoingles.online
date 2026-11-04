/**
 * Chapter progress on this device: which video chapters of a lesson have
 * been watched and which one was open last.
 *
 * It lives in localStorage on purpose: it only powers navigation comforts
 * ("✓" on watched chapters, "Continuar donde lo dejaste"), never access or
 * Fundae hours, which stay server-side. Every access is wrapped in
 * try/catch because storage can be blocked (private mode, cleared data).
 */

const PREFIX = "aprendoingles:chapters:";
const CHANGE_EVENT = "aprendoingles:chapters-change";

export interface LessonChapterProgress {
  watched: string[];
  last: string | null;
  updatedAt: number;
}

const keyFor = (courseSlug: string, lessonSlug: string) =>
  `${PREFIX}${courseSlug}/${lessonSlug}`;

const EMPTY: LessonChapterProgress = { watched: [], last: null, updatedAt: 0 };

function parse(raw: string | null): LessonChapterProgress {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw);
    return {
      watched: Array.isArray(data.watched) ? data.watched : [],
      last: typeof data.last === "string" ? data.last : null,
      updatedAt: Number(data.updatedAt) || 0,
    };
  } catch {
    return EMPTY;
  }
}

/** Raw stored string, for useSyncExternalStore (stable between reads). */
export function readRaw(courseSlug: string, lessonSlug: string): string {
  try {
    return localStorage.getItem(keyFor(courseSlug, lessonSlug)) ?? "";
  } catch {
    return "";
  }
}

export function parseProgress(raw: string): LessonChapterProgress {
  return parse(raw || null);
}

function write(courseSlug: string, lessonSlug: string, p: LessonChapterProgress) {
  try {
    localStorage.setItem(keyFor(courseSlug, lessonSlug), JSON.stringify(p));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // storage blocked: navigation still works, it just isn't remembered
  }
}

/** Remembers the chapter that is open now. */
export function markOpened(courseSlug: string, lessonSlug: string, chapterKey: string) {
  const current = parse(readRaw(courseSlug, lessonSlug));
  write(courseSlug, lessonSlug, { ...current, last: chapterKey, updatedAt: Date.now() });
}

/** Marks a chapter as watched to the end. */
export function markWatched(courseSlug: string, lessonSlug: string, chapterKey: string) {
  const current = parse(readRaw(courseSlug, lessonSlug));
  const watched = current.watched.includes(chapterKey)
    ? current.watched
    : [...current.watched, chapterKey];
  write(courseSlug, lessonSlug, { ...current, watched, updatedAt: Date.now() });
}

/** The most recently touched lesson of a course, as "lessonSlug|chapterKey". */
export function readLastInCourse(courseSlug: string): string {
  try {
    const prefix = `${PREFIX}${courseSlug}/`;
    let best = "";
    let bestAt = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(prefix)) continue;
      const p = parse(localStorage.getItem(key));
      if (p.updatedAt > bestAt && p.last) {
        bestAt = p.updatedAt;
        best = `${key.slice(prefix.length)}|${p.last}`;
      }
    }
    return best;
  } catch {
    return "";
  }
}

/** Subscribe to changes from this tab and from other tabs. */
export function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function formatDuration(seconds: number | null | undefined) {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = String(Math.round(seconds % 60)).padStart(2, "0");
  return `${m}:${s}`;
}
