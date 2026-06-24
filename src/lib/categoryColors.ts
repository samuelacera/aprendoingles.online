/**
 * Maps each category's Tailwind bg token (from Sanity) to a coordinated set of
 * accent classes. Classes are written out in FULL — never built by string
 * concatenation — so Tailwind's compiler detects and includes them.
 *
 * Use this to give each sector a distinct color identity on hover (border,
 * glow, title tint) while keeping the dark cinematic base.
 */
export interface CategoryAccent {
  /** Bright solid dot / chip background. */
  dot: string;
  /** Title color on card hover. */
  hoverText: string;
  /** Card border on hover. */
  hoverBorder: string;
  /** Colored glow on hover (pair with `hover:shadow-2xl`). */
  hoverShadow: string;
  /** Soft glow blob behind cinematic cards (use as bg + blur). */
  glow: string;
  /** Cinematic scrim gradient (use as `bg-gradient-to-t from-… via-…`). */
  gradient: string;
}

const ACCENTS: Record<string, CategoryAccent> = {
  "bg-blue-600":    { dot: "bg-blue-500",    hoverText: "group-hover:text-blue-300",    hoverBorder: "hover:border-blue-500/60",    hoverShadow: "hover:shadow-blue-500/20",    glow: "bg-blue-600",    gradient: "from-blue-900/80 via-blue-950/40" },
  "bg-purple-600":  { dot: "bg-purple-500",  hoverText: "group-hover:text-purple-300",  hoverBorder: "hover:border-purple-500/60",  hoverShadow: "hover:shadow-purple-500/20",  glow: "bg-purple-600",  gradient: "from-purple-900/80 via-purple-950/40" },
  "bg-green-600":   { dot: "bg-green-500",   hoverText: "group-hover:text-green-300",   hoverBorder: "hover:border-green-500/60",   hoverShadow: "hover:shadow-green-500/20",   glow: "bg-green-600",   gradient: "from-green-900/80 via-green-950/40" },
  "bg-emerald-600": { dot: "bg-emerald-500", hoverText: "group-hover:text-emerald-300", hoverBorder: "hover:border-emerald-500/60", hoverShadow: "hover:shadow-emerald-500/20", glow: "bg-emerald-600", gradient: "from-emerald-900/80 via-emerald-950/40" },
  "bg-teal-600":    { dot: "bg-teal-500",    hoverText: "group-hover:text-teal-300",    hoverBorder: "hover:border-teal-500/60",    hoverShadow: "hover:shadow-teal-500/20",    glow: "bg-teal-600",    gradient: "from-teal-900/80 via-teal-950/40" },
  "bg-cyan-600":    { dot: "bg-cyan-500",    hoverText: "group-hover:text-cyan-300",    hoverBorder: "hover:border-cyan-500/60",    hoverShadow: "hover:shadow-cyan-500/20",    glow: "bg-cyan-600",    gradient: "from-cyan-900/80 via-cyan-950/40" },
  "bg-indigo-600":  { dot: "bg-indigo-500",  hoverText: "group-hover:text-indigo-300",  hoverBorder: "hover:border-indigo-500/60",  hoverShadow: "hover:shadow-indigo-500/20",  glow: "bg-indigo-600",  gradient: "from-indigo-900/80 via-indigo-950/40" },
  "bg-violet-600":  { dot: "bg-violet-500",  hoverText: "group-hover:text-violet-300",  hoverBorder: "hover:border-violet-500/60",  hoverShadow: "hover:shadow-violet-500/20",  glow: "bg-violet-600",  gradient: "from-violet-900/80 via-violet-950/40" },
  "bg-fuchsia-600": { dot: "bg-fuchsia-500", hoverText: "group-hover:text-fuchsia-300", hoverBorder: "hover:border-fuchsia-500/60", hoverShadow: "hover:shadow-fuchsia-500/20", glow: "bg-fuchsia-600", gradient: "from-fuchsia-900/80 via-fuchsia-950/40" },
  "bg-pink-600":    { dot: "bg-pink-500",    hoverText: "group-hover:text-pink-300",    hoverBorder: "hover:border-pink-500/60",    hoverShadow: "hover:shadow-pink-500/20",    glow: "bg-pink-600",    gradient: "from-pink-900/80 via-pink-950/40" },
  "bg-rose-600":    { dot: "bg-rose-500",    hoverText: "group-hover:text-rose-300",    hoverBorder: "hover:border-rose-500/60",    hoverShadow: "hover:shadow-rose-500/20",    glow: "bg-rose-600",    gradient: "from-rose-900/80 via-rose-950/40" },
  "bg-red-600":     { dot: "bg-red-500",     hoverText: "group-hover:text-red-300",     hoverBorder: "hover:border-red-500/60",     hoverShadow: "hover:shadow-red-500/20",     glow: "bg-red-600",     gradient: "from-red-900/80 via-red-950/40" },
  "bg-orange-600":  { dot: "bg-orange-500",  hoverText: "group-hover:text-orange-300",  hoverBorder: "hover:border-orange-500/60",  hoverShadow: "hover:shadow-orange-500/20",  glow: "bg-orange-600",  gradient: "from-orange-900/80 via-orange-950/40" },
  "bg-amber-600":   { dot: "bg-amber-500",   hoverText: "group-hover:text-amber-300",   hoverBorder: "hover:border-amber-500/60",   hoverShadow: "hover:shadow-amber-500/20",   glow: "bg-amber-600",   gradient: "from-amber-900/80 via-amber-950/40" },
  "bg-slate-600":   { dot: "bg-slate-400",   hoverText: "group-hover:text-slate-200",   hoverBorder: "hover:border-slate-400/60",   hoverShadow: "hover:shadow-slate-400/20",   glow: "bg-slate-500",   gradient: "from-slate-800/80 via-slate-900/40" },
  "bg-gray-600":    { dot: "bg-gray-400",    hoverText: "group-hover:text-gray-200",    hoverBorder: "hover:border-gray-400/60",    hoverShadow: "hover:shadow-gray-400/20",    glow: "bg-gray-500",    gradient: "from-gray-800/80 via-gray-900/40" },
};

const FALLBACK = ACCENTS["bg-blue-600"];

export function categoryAccent(color: string | undefined): CategoryAccent {
  return (color && ACCENTS[color]) || FALLBACK;
}
