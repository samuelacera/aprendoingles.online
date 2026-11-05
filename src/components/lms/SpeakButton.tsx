"use client";

import { useEffect, useState } from "react";
import { speechUrl } from "@/lib/speech";

/**
 * ▶ / 🐢: plays one English text of the lesson (normal or slow).
 * One shared <audio> for the whole page, so a new phrase stops the last.
 */

let player: HTMLAudioElement | null = null;
let current: string | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function play(url: string, rate: number, id: string) {
  if (!player) {
    player = new Audio();
    player.addEventListener("ended", () => {
      current = null;
      notify();
    });
    player.addEventListener("error", () => {
      current = null;
      notify();
    });
  }
  if (current === id) {
    player.pause();
    current = null;
    return notify();
  }
  if (player.src !== new URL(url, location.href).href) player.src = url;
  player.currentTime = 0;
  player.playbackRate = rate;
  current = id;
  notify();
  player.play().catch(() => {
    current = null;
    notify();
  });
}

export default function SpeakButton({
  courseSlug,
  lessonSlug,
  text,
  className = "",
}: {
  courseSlug: string;
  lessonSlug: string;
  text: string;
  className?: string;
}) {
  const url = speechUrl(courseSlug, lessonSlug, text);
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const btn =
    "inline-flex h-11 min-w-11 items-center justify-center rounded-full border transition sm:h-9 sm:min-w-9";
  const on = "border-gold bg-gold text-ink";
  const off = "border-line bg-surface-2 text-foreground/70 hover:border-gold/50 hover:text-gold";

  return (
    <span className={`inline-flex shrink-0 gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={() => play(url, 1, url)}
        className={`${btn} ${current === url ? on : off}`}
        aria-label={`Escuchar: ${text}`}
        title="Escuchar"
      >
        {current === url ? <StopIcon /> : <PlayIcon />}
      </button>
      <button
        type="button"
        onClick={() => play(url, 0.7, `${url}#slow`)}
        className={`${btn} px-2 text-sm ${current === `${url}#slow` ? on : off}`}
        aria-label={`Escuchar despacio: ${text}`}
        title="Escuchar despacio"
      >
        <span aria-hidden>🐢</span>
      </button>
    </span>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
