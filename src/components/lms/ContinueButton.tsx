"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readLastInCourse, subscribe } from "@/lib/chapterProgress";

interface ContinueButtonProps {
  courseSlug: string;
  lessons: { slug: string; h1: string }[];
}

/**
 * "Continuar donde lo dejaste": back to the last lesson and chapter opened
 * on this device. Renders nothing for a first visit (or on the server, so
 * the static page is unchanged).
 */
export default function ContinueButton({ courseSlug, lessons }: ContinueButtonProps) {
  const last = useSyncExternalStore(
    subscribe,
    () => readLastInCourse(courseSlug),
    () => "",
  );
  if (!last) return null;

  const [lessonSlug, chapterKey] = last.split("|");
  const n = lessons.findIndex((l) => l.slug === lessonSlug);
  if (n < 0) return null;

  const chapterNumber = Number(chapterKey.match(/(\d+)$/)?.[1]);

  return (
    <Link
      href={`/cursos/${courseSlug}/${lessonSlug}?cap=${encodeURIComponent(chapterKey)}`}
      className="group mb-4 flex items-center gap-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 transition-colors hover:bg-gold/20"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path d="M6 4.5v11a.5.5 0 00.77.42l8.5-5.5a.5.5 0 000-.84l-8.5-5.5A.5.5 0 006 4.5z" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">
          Continuar donde lo dejaste
        </span>
        <span className="block truncate text-xs text-foreground/60">
          Lección {n + 1} · {lessons[n].h1}
          {Number.isFinite(chapterNumber) && chapterNumber > 0 && ` · Capítulo ${chapterNumber}`}
        </span>
      </span>
    </Link>
  );
}
