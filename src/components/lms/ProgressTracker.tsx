"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface ProgressTrackerProps {
  courseSlug: string;
  lessonSlug: string;
}

const HEARTBEAT_INTERVAL_MS = 30_000;

async function post(body: Record<string, unknown>) {
  try {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // best-effort; ignore network hiccups
  }
}

/**
 * Records lesson activity for logged-in users:
 *  - "start" once on mount
 *  - "time" heartbeat every 30s, only while the tab is visible
 * Time is sent in real elapsed seconds; the server caps each call.
 */
export default function ProgressTracker({
  courseSlug,
  lessonSlug,
}: ProgressTrackerProps) {
  const accumulated = useRef(0);
  const lastTick = useRef<number>(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    function flush() {
      const now = Date.now();
      if (document.visibilityState === "visible") {
        accumulated.current += Math.round((now - lastTick.current) / 1000);
      }
      lastTick.current = now;
      if (accumulated.current > 0) {
        post({
          courseSlug,
          lessonSlug,
          action: "time",
          timeSpent: accumulated.current,
        });
        accumulated.current = 0;
      }
    }

    function onVisibility() {
      const now = Date.now();
      if (document.visibilityState === "hidden") {
        accumulated.current += Math.round((now - lastTick.current) / 1000);
        flush();
      }
      lastTick.current = now;
    }

    // Only track once we've confirmed the viewer is authenticated.
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!data.user) return;
        post({ courseSlug, lessonSlug, action: "start" });
        lastTick.current = Date.now();
        interval = setInterval(flush, HEARTBEAT_INTERVAL_MS);
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("pagehide", flush);
      });

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      if (lastTick.current) flush();
    };
  }, [courseSlug, lessonSlug]);

  return null;
}
