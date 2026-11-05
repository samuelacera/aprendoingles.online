"use client";

import { useCourseAccess } from "./useCourseAccess";

/**
 * Right-hand marker of a lesson row in the course syllabus:
 * "Gratis", a lock (no access) or nothing (the learner has access).
 */
export default function LessonLock({ courseSlug, free }: { courseSlug: string; free: boolean }) {
  const access = useCourseAccess(courseSlug);
  if (free && !access?.hasFullAccess) {
    return <span className="shrink-0 text-xs bg-gold/15 text-gold px-2 py-0.5 rounded-full font-medium">Gratis</span>;
  }
  if (free || access?.hasFullAccess) return null;
  return (
    <svg
      className={`w-4 h-4 shrink-0 text-foreground/20 transition-opacity ${access ? "" : "opacity-0"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-label="Necesitas el curso completo"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
