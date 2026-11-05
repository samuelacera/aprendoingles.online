"use client";

import { useEffect, useState } from "react";

export interface ClientCourseAccess {
  loggedIn: boolean;
  hasFullAccess: boolean;
  isEnrolled: boolean;
  hasSubscription: boolean;
}

// One request per course per page view, shared by every lock on the page.
const cache = new Map<string, Promise<ClientCourseAccess | null>>();

function load(courseSlug: string) {
  let p = cache.get(courseSlug);
  if (!p) {
    p = fetch(`/api/v1/access/${courseSlug}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
    cache.set(courseSlug, p);
  }
  return p;
}

/** Forget the cached answer (e.g. right after enrolling). */
export function refreshCourseAccess(courseSlug: string) {
  cache.delete(courseSlug);
}

/**
 * The learner's access to a course, read in the browser so static pages can
 * show the right locks. `null` while loading (draw neither lock nor open).
 */
export function useCourseAccess(courseSlug: string): ClientCourseAccess | null {
  const [access, setAccess] = useState<ClientCourseAccess | null>(null);
  useEffect(() => {
    let alive = true;
    load(courseSlug).then((a) => {
      if (alive) setAccess(a ?? { loggedIn: false, hasFullAccess: false, isEnrolled: false, hasSubscription: false });
    });
    return () => {
      alive = false;
    };
  }, [courseSlug]);
  return access;
}
