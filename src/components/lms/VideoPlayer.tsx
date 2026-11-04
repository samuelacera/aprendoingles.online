"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SanityChapter } from "@/sanity/queries";

interface VideoPlayerProps {
  chapter: SanityChapter;
  /** Start playing on load (after an automatic jump to the next chapter). */
  autoplay: boolean;
  onEnded: () => void;
}

const VIMEO_ORIGIN = "https://player.vimeo.com";

function vimeoSrc(url: string, autoplay: boolean) {
  const src = new URL(url);
  src.searchParams.set("title", "0");
  src.searchParams.set("byline", "0");
  src.searchParams.set("portrait", "0");
  src.searchParams.set("dnt", "1");
  src.searchParams.set("color", "c8a45c");
  if (autoplay) src.searchParams.set("autoplay", "1");
  return src.toString();
}

function youtubeSrc(url: string, autoplay: boolean) {
  const id =
    url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)?.[1] ?? "";
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0${autoplay ? "&autoplay=1" : ""}`;
}

/**
 * Plays one chapter. Vimeo is driven through its postMessage API (the same
 * protocol @vimeo/player wraps), so there is no extra dependency: once the
 * player says "ready" we subscribe to "ended" and report it upwards.
 *
 * YouTube chapters play, but don't auto-advance (that would need the
 * YouTube IFrame API).
 *
 * Fullscreen is ours, not the iframe's: the WRAPPER goes fullscreen, so when
 * a chapter ends and the next iframe mounts, the viewer stays fullscreen.
 * iPhone Safari can't fullscreen a div, so there we ask Vimeo to do it.
 */
export default function VideoPlayer({ chapter, autoplay, onEnded }: VideoPlayerProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const endedRef = useRef(onEnded);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    const el = wrapper.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    if (document.fullscreenEnabled && el.requestFullscreen) {
      void el.requestFullscreen().catch(() => {});
      return;
    }
    // iPhone: only the video element can go fullscreen, via the player.
    frame.current?.contentWindow?.postMessage(
      JSON.stringify({ method: "requestFullscreen" }),
      VIMEO_ORIGIN,
    );
  }, []);

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === wrapper.current);
    // "F" toggles fullscreen, as in YouTube, unless the user is typing.
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "");
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      window.removeEventListener("keydown", onKey);
    };
  }, [toggleFullscreen]);

  useEffect(() => {
    endedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    if (chapter.platform !== "vimeo") return;

    function send(method: string, value?: string) {
      frame.current?.contentWindow?.postMessage(
        JSON.stringify(value ? { method, value } : { method }),
        VIMEO_ORIGIN,
      );
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== VIMEO_ORIGIN) return;
      if (event.source !== frame.current?.contentWindow) return;
      let data: { event?: string } = {};
      try {
        data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (data.event === "ready") send("addEventListener", "ended");
      if (data.event === "ended") endedRef.current();
    }

    window.addEventListener("message", onMessage);
    // If the player was ready before we listened, ask again.
    send("addEventListener", "ended");
    return () => window.removeEventListener("message", onMessage);
  }, [chapter.key, chapter.platform]);

  const src =
    chapter.platform === "youtube"
      ? youtubeSrc(chapter.url, autoplay)
      : vimeoSrc(chapter.url, autoplay);

  return (
    <div
      ref={wrapper}
      className="group relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-ink shadow-2xl shadow-black/40 [&:fullscreen]:aspect-auto [&:fullscreen]:rounded-none [&:fullscreen]:border-0 [&:fullscreen]:bg-black"
    >
      <iframe
        ref={frame}
        key={chapter.key}
        src={src}
        title={chapter.title}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {/* Top-right, away from the player's own control bar. */}
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa (F)"}
        title={isFullscreen ? "Salir de pantalla completa (F)" : "Pantalla completa (F)"}
        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:scale-105 hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {isFullscreen ? (
            <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
          ) : (
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          )}
        </svg>
      </button>
    </div>
  );
}
