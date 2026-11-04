"use client";

import Link from "next/link";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { SanityChapter, SanityLesson } from "@/sanity/queries";
import { createClient } from "@/lib/supabase/client";
import {
  formatDuration,
  markOpened,
  markWatched,
  parseProgress,
  readRaw,
  subscribe as subscribeProgress,
} from "@/lib/chapterProgress";
import LessonContent, { type LessonTab } from "./LessonContent";
import ProgressTracker from "./ProgressTracker";
import VideoPlayer from "./VideoPlayer";
import VoicePractice from "./VoicePractice";

export interface NavLesson {
  slug: string;
  h1: string;
  section: string;
  free: boolean;
  chapterCount: number;
}

interface LessonNavigatorProps {
  courseSlug: string;
  courseName: string;
  lessonSlug: string;
  /** Every lesson of the course, in order (metadata only). */
  lessons: NavLesson[];
  /** Video chapters. Empty when the lesson has none or is locked. */
  chapters: SanityChapter[];
  /** Full lesson when the viewer can see it; null renders [paywall]. */
  lesson: SanityLesson | null;
  paywall?: ReactNode;
}

// The open chapter lives in the URL (?cap=cap-02) so it can be shared and
// survives a reload. Read through useSyncExternalStore so the static HTML
// (rendered with the first chapter) hydrates without a mismatch.
const URL_EVENT = "aprendoingles:url-change";

function subscribeUrl(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(URL_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(URL_EVENT, callback);
  };
}

const noopSubscribe = () => () => {};

const TABS: { id: LessonTab; label: string }[] = [
  { id: "content", label: "Contenido" },
  { id: "vocabulary", label: "Vocabulario" },
  { id: "exercise", label: "Ejercicio" },
];

const PRACTICE_TAB: { id: LessonTab; label: string } = { id: "practice", label: "🎙 Práctica" };

/**
 * The lesson page's interactive shell, mirrored in the app:
 * player → chapters → tabs, a fixed bar (‹ Anterior · ☰ Índice ·
 * Siguiente ›) and the course index (sidebar on desktop, bottom sheet on
 * mobile). "Siguiente" walks chapters first, then lessons.
 */
export default function LessonNavigator({
  courseSlug,
  courseName,
  lessonSlug,
  lessons,
  chapters,
  lesson,
  paywall,
}: LessonNavigatorProps) {
  const search = useSyncExternalStore(
    subscribeUrl,
    () => window.location.search,
    () => "",
  );
  const progressRaw = useSyncExternalStore(
    subscribeProgress,
    () => readRaw(courseSlug, lessonSlug),
    () => "",
  );
  const progress = useMemo(() => parseProgress(progressRaw), [progressRaw]);
  // False while hydrating (server snapshot), true once the browser's URL and
  // storage have been read.
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const [autoplay, setAutoplay] = useState(false);
  const [tab, setTab] = useState<LessonTab>("content");
  const [indexOpen, setIndexOpen] = useState(false);
  const [videosDone, setVideosDone] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Current chapter: the URL wins; otherwise where they left off.
  const requested = new URLSearchParams(search).get("cap") ?? progress.last;
  const found = chapters.findIndex((c) => c.key === requested);
  const chapterIndex = found >= 0 ? found : 0;
  const chapter: SanityChapter | undefined = chapters[chapterIndex];

  const lessonIndex = lessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex >= 0 && lessonIndex < lessons.length - 1
      ? lessons[lessonIndex + 1]
      : null;

  const goToChapter = useCallback(
    (i: number, opts: { autoplay?: boolean } = {}) => {
      const target = chapters[i];
      if (!target) return;
      const url = new URL(window.location.href);
      url.searchParams.set("cap", target.key);
      window.history.replaceState(null, "", url);
      window.dispatchEvent(new Event(URL_EVENT));
      setAutoplay(!!opts.autoplay);
      setIndexOpen(false);
    },
    [chapters],
  );

  // Remember the open chapter for "Continuar donde lo dejaste". Not during
  // hydration: that render shows chapter 1 by default and would overwrite
  // where the student really left off.
  useEffect(() => {
    if (hydrated && chapter) markOpened(courseSlug, lessonSlug, chapter.key);
  }, [hydrated, courseSlug, lessonSlug, chapter]);

  // Completed lessons come from the server (RLS: own rows only). Logged-out
  // visitors simply see no ticks.
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user || cancelled) return;
      const { data: rows } = await supabase
        .from("lesson_progress")
        .select("lesson_slug, completed_at")
        .eq("course_slug", courseSlug);
      if (cancelled) return;
      setCompleted(
        new Set((rows ?? []).filter((r) => r.completed_at).map((r) => r.lesson_slug)),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

  // Close the sheet with Escape.
  useEffect(() => {
    if (!indexOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIndexOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [indexOpen]);

  function onChapterEnded() {
    if (!chapter) return;
    markWatched(courseSlug, lessonSlug, chapter.key);
    if (chapterIndex < chapters.length - 1) {
      goToChapter(chapterIndex + 1, { autoplay: true });
    } else {
      // Last video: hand over to the exercise.
      setVideosDone(true);
      setTab("exercise");
    }
  }

  const watched = new Set(progress.watched);
  const hasPrevChapter = chapters.length > 0 && chapterIndex > 0;
  const hasNextChapter = chapters.length > 0 && chapterIndex < chapters.length - 1;

  const index = (
    <CourseIndex
      courseSlug={courseSlug}
      courseName={courseName}
      lessons={lessons}
      currentSlug={lessonSlug}
      completed={completed}
      chapters={chapters}
      chapterIndex={chapterIndex}
      watched={watched}
      onChapter={(i) => goToChapter(i)}
    />
  );

  return (
    <>
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            {index}
          </div>
        </aside>

        <div className="min-w-0">
          {chapter && (
            <div className="mb-10">
              <VideoPlayer chapter={chapter} autoplay={autoplay} onEnded={onChapterEnded} />

              <div className="mt-6 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-xl font-semibold">Capítulos</h2>
                <span className="text-sm text-foreground/50">
                  {chapterIndex + 1} de {chapters.length}
                </span>
              </div>
              <ol className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
                {chapters.map((c, i) => {
                  const current = i === chapterIndex;
                  const seen = watched.has(c.key);
                  return (
                    <li key={c.key}>
                      <button
                        type="button"
                        onClick={() => goToChapter(i)}
                        aria-current={current ? "true" : undefined}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                          current ? "bg-gold/10" : "hover:bg-overlay"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                            current
                              ? "bg-gold text-ink"
                              : seen
                                ? "bg-gold/15 text-gold"
                                : "bg-overlay text-foreground/50"
                          }`}
                        >
                          {seen && !current ? <CheckIcon /> : current ? <PlayIcon /> : i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm ${
                              current ? "font-semibold text-foreground" : "text-foreground/80"
                            }`}
                          >
                            {c.title}
                          </span>
                          {current && c.summary && (
                            <span className="mt-1 block text-xs text-foreground/50">{c.summary}</span>
                          )}
                        </span>
                        <span className="shrink-0 font-mono text-xs text-foreground/40">
                          {formatDuration(c.durationSeconds)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              {videosDone && (
                <p className="mt-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-foreground">
                  ✓ Has visto todos los capítulos. Ahora, pon a prueba lo aprendido en el ejercicio.
                </p>
              )}
            </div>
          )}

          {lesson ? (
            <>
              <ProgressTracker courseSlug={courseSlug} lessonSlug={lessonSlug} />
              <div
                role="tablist"
                className="mb-8 flex gap-1 rounded-xl border border-line bg-surface p-1"
              >
                {(lesson.practice ? [...TABS, PRACTICE_TAB] : TABS).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      tab === t.id
                        ? "bg-gold text-ink"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <LessonContent lesson={lesson} courseSlug={courseSlug} tab={tab} />
              {lesson.practice && (
                // Always mounted (just hidden) so switching tabs never cuts a call.
                <div className={tab === "practice" ? "" : "hidden"}>
                  <VoicePractice
                    courseSlug={courseSlug}
                    lessonSlug={lessonSlug}
                    practice={lesson.practice}
                  />
                </div>
              )}
            </>
          ) : (
            paywall
          )}

          {/* Fixed navigation bar */}
          <nav
            aria-label="Navegación de la lección"
            className="sticky bottom-0 z-30 -mx-4 mt-12 border-t border-line bg-background/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-t-xl sm:border-x"
          >
            <div className="flex items-center justify-between gap-2">
              {hasPrevChapter ? (
                <NavButton onClick={() => goToChapter(chapterIndex - 1)} dir="prev">
                  Capítulo anterior
                </NavButton>
              ) : prevLesson ? (
                <NavLink href={`/cursos/${courseSlug}/${prevLesson.slug}`} dir="prev">
                  Lección anterior
                </NavLink>
              ) : (
                <span className="w-28" />
              )}

              <button
                type="button"
                onClick={() => setIndexOpen(true)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/70 transition-colors hover:text-gold lg:hidden"
              >
                <MenuIcon />
                Índice
              </button>
              <span className="hidden text-xs text-foreground/40 lg:block">
                Lección {lessonIndex + 1} de {lessons.length}
                {chapters.length > 0 && ` · Capítulo ${chapterIndex + 1} de ${chapters.length}`}
              </span>

              {hasNextChapter ? (
                <NavButton onClick={() => goToChapter(chapterIndex + 1)} dir="next" primary>
                  Siguiente capítulo
                </NavButton>
              ) : nextLesson ? (
                <NavLink
                  href={`/cursos/${courseSlug}/${nextLesson.slug}`}
                  dir="next"
                  primary
                  locked={!nextLesson.free}
                >
                  Siguiente lección
                </NavLink>
              ) : (
                <span className="text-sm text-foreground/40">Fin del curso</span>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile index: bottom sheet */}
      {indexOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Índice del curso">
          <button
            type="button"
            aria-label="Cerrar índice"
            onClick={() => setIndexOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-2xl border-t border-line bg-surface-2 px-5 pb-8 pt-3 shadow-2xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-foreground/20" />
            {index}
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────

function CourseIndex({
  courseSlug,
  courseName,
  lessons,
  currentSlug,
  completed,
  chapters,
  chapterIndex,
  watched,
  onChapter,
}: {
  courseSlug: string;
  courseName: string;
  lessons: NavLesson[];
  currentSlug: string;
  completed: Set<string>;
  chapters: SanityChapter[];
  chapterIndex: number;
  watched: Set<string>;
  onChapter: (i: number) => void;
}) {
  const sections: { name: string; items: { lesson: NavLesson; n: number }[] }[] = [];
  lessons.forEach((lesson, i) => {
    const last = sections[sections.length - 1];
    if (last && last.name === lesson.section) last.items.push({ lesson, n: i + 1 });
    else sections.push({ name: lesson.section, items: [{ lesson, n: i + 1 }] });
  });

  return (
    <div>
      <Link
        href={`/cursos/${courseSlug}`}
        className="font-display text-base font-semibold leading-snug transition-colors hover:text-gold"
      >
        {courseName}
      </Link>
      <p className="mt-1 text-xs text-foreground/40">
        {completed.size} de {lessons.length} lecciones completadas
      </p>

      <div className="mt-5 space-y-5">
        {sections.map((section) => (
          <div key={`${section.name}-${section.items[0].n}`}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gold">
              {section.name}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ lesson, n }) => {
                const current = lesson.slug === currentSlug;
                const done = completed.has(lesson.slug);
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={`/cursos/${courseSlug}/${lesson.slug}`}
                      aria-current={current ? "page" : undefined}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                        current
                          ? "bg-gold/10 font-medium text-gold"
                          : "text-foreground/60 hover:bg-overlay hover:text-foreground"
                      }`}
                    >
                      <span className="w-5 shrink-0 text-right text-xs text-foreground/30">{n}</span>
                      <span className="min-w-0 flex-1 truncate">{lesson.h1}</span>
                      {done ? (
                        <span className="text-gold"><CheckIcon /></span>
                      ) : !lesson.free ? (
                        <span className="text-foreground/25"><LockIcon /></span>
                      ) : lesson.chapterCount > 0 ? (
                        <span className="text-foreground/30"><PlayIcon /></span>
                      ) : null}
                    </Link>

                    {current && chapters.length > 0 && (
                      <ul className="mb-2 ml-7 mt-1 border-l border-line pl-3">
                        {chapters.map((c, i) => (
                          <li key={c.key}>
                            <button
                              type="button"
                              onClick={() => onChapter(i)}
                              className={`flex w-full items-center gap-2 py-1 text-left text-xs transition-colors ${
                                i === chapterIndex
                                  ? "font-semibold text-foreground"
                                  : "text-foreground/50 hover:text-foreground"
                              }`}
                            >
                              <span className={watched.has(c.key) ? "text-gold" : "text-foreground/30"}>
                                {watched.has(c.key) ? <CheckIcon /> : `${i + 1}.`}
                              </span>
                              <span className="min-w-0 flex-1 truncate">{c.title}</span>
                              <span className="font-mono text-foreground/30">
                                {formatDuration(c.durationSeconds)}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const navClasses = (primary?: boolean) =>
  `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    primary
      ? "bg-gold text-ink hover:bg-gold-light"
      : "text-foreground/70 hover:text-gold"
  }`;

function NavButton({
  children,
  onClick,
  dir,
  primary,
}: {
  children: ReactNode;
  onClick: () => void;
  dir: "prev" | "next";
  primary?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className={navClasses(primary)}>
      {dir === "prev" && <ChevronIcon dir="prev" />}
      <span className="hidden sm:inline">{children}</span>
      <span className="sm:hidden">{dir === "prev" ? "Anterior" : "Siguiente"}</span>
      {dir === "next" && <ChevronIcon dir="next" />}
    </button>
  );
}

function NavLink({
  children,
  href,
  dir,
  primary,
  locked,
}: {
  children: ReactNode;
  href: string;
  dir: "prev" | "next";
  primary?: boolean;
  locked?: boolean;
}) {
  return (
    <Link href={href} className={navClasses(primary)}>
      {dir === "prev" && <ChevronIcon dir="prev" />}
      <span className="hidden sm:inline">{children}</span>
      <span className="sm:hidden">{dir === "prev" ? "Anterior" : "Siguiente"}</span>
      {locked && <LockIcon />}
      {dir === "next" && <ChevronIcon dir="next" />}
    </Link>
  );
}

function ChevronIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={dir === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-label="Visto">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path d="M6 4.5v11a.5.5 0 00.77.42l8.5-5.5a.5.5 0 000-.84l-8.5-5.5A.5.5 0 006 4.5z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Bloqueada">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
