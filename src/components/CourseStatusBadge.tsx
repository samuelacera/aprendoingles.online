/**
 * Shows whether a course is ready ("Disponible") or still being built
 * ("Próximamente"). A course is considered available when it has at least one
 * published lesson — so the badge updates automatically as content is added.
 */
export default function CourseStatusBadge({
  lessonCount,
  className = "",
}: {
  lessonCount: number;
  className?: string;
}) {
  const available = lessonCount > 0;

  if (available) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-400 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Disponible
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground/40 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
      Próximamente
    </span>
  );
}
