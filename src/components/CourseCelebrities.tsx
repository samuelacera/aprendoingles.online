"use client";

import { useState } from "react";
import type { SanityCelebrity } from "@/sanity/queries";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function CelebrityChip({ celebrity }: { celebrity: SanityCelebrity }) {
  const [open, setOpen] = useState(false); // click-to-pin (mobile / accessibility)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-overlay pl-1 pr-3 py-1 text-sm text-foreground/80 hover:border-gold/50 hover:text-gold transition-colors"
      >
        <span className="w-6 h-6 rounded-full bg-gold/15 text-gold text-[10px] font-bold flex items-center justify-center shrink-0">
          {initials(celebrity.name)}
        </span>
        {celebrity.name}
      </button>

      {open && (
        <div
          role="tooltip"
          className="absolute z-30 left-0 top-full mt-2 w-72 rounded-xl border border-line bg-surface-2 p-4 shadow-2xl text-left"
        >
          <p className="font-display font-semibold text-foreground">{celebrity.name}</p>
          {celebrity.role && (
            <p className="text-xs text-gold mb-2">{celebrity.role}</p>
          )}
          {celebrity.knownFor && (
            <p className="text-sm text-foreground/70 leading-relaxed mb-2">
              <span className="text-foreground/50">Conocido por: </span>
              {celebrity.knownFor}
            </p>
          )}
          {celebrity.whyRelevant && (
            <p className="text-sm text-foreground/70 leading-relaxed">
              <span className="text-foreground/50">Por qué en este curso: </span>
              {celebrity.whyRelevant}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function CourseCelebrities({
  celebrities,
}: {
  celebrities: SanityCelebrity[];
}) {
  if (!celebrities?.length) return null;

  return (
    <div>
      <p className="text-xs text-foreground/40 mb-3">
        Contenido inspirado en los aprendizajes de{" "}
        <span className="text-foreground/60">
          (pasa el cursor para saber quiénes son y por qué)
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {celebrities.map((c) => (
          <CelebrityChip key={c.name} celebrity={c} />
        ))}
      </div>
    </div>
  );
}
