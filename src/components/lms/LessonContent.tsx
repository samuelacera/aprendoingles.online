"use client";

import { useState } from "react";
import type { SanityLesson } from "@/sanity/queries";

interface LessonContentProps {
  lesson: SanityLesson;
  courseSlug: string;
}

export default function LessonContent({
  lesson,
  courseSlug,
}: LessonContentProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSelect(questionIdx: number, optionIdx: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  }

  const correctCount = lesson.exercise.questions.filter(
    (q, i) => answers[i] === q.correct
  ).length;

  async function handleSubmit() {
    setSubmitted(true);

    // Best-effort save. The endpoint requires auth and ignores anonymous
    // callers (401), so this is a no-op for logged-out previewers.
    const total = lesson.exercise.questions.length;
    const score = lesson.exercise.questions.filter(
      (q, i) => answers[i] === q.correct
    ).length;

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          lessonSlug: lesson.slug,
          action: "quiz",
          quizScore: score,
          quizTotal: total,
        }),
      });
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          lessonSlug: lesson.slug,
          action: "complete",
        }),
      });
    } catch {
      // best-effort
    }
  }

  return (
    <div className="space-y-12 text-cream">
      <div>
        <p className="text-cream/70 leading-relaxed text-lg">{lesson.intro}</p>
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold mb-6">Vocabulario clave</h2>
        <div className="grid gap-4">
          {lesson.vocabulary.map((v, i) => (
            <div key={i} className="bg-ink-soft border border-white/10 rounded-xl p-5">
              <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                <span className="font-semibold text-cream text-lg">{v.term}</span>
                <span className="text-sm text-cream/30">—</span>
                <span className="text-cream/70">{v.definition}</span>
              </div>
              <p className="text-sm text-gold italic mt-1">&ldquo;{v.example}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold mb-6">Frases y expresiones clave</h2>
        <div className="space-y-4">
          {lesson.keyPhrases.map((p, i) => (
            <div key={i} className="border border-white/10 rounded-xl p-5">
              <p className="font-semibold text-cream text-lg mb-1">&ldquo;{p.phrase}&rdquo;</p>
              <p className="text-cream/70 text-sm mb-2">{p.translation}</p>
              <p className="text-xs text-cream/40">Contexto: {p.context}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold mb-2">Ejercicio</h2>
        <p className="text-cream/50 mb-6">{lesson.exercise.instruction}</p>
        <div className="space-y-6">
          {lesson.exercise.questions.map((q, qi) => (
            <div key={qi} className="bg-ink-soft border border-white/10 rounded-xl p-5">
              <p className="font-medium text-cream mb-3">
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let style = "border-white/10 text-cream/80 hover:border-gold/40";
                  if (answers[qi] === oi && !submitted) style = "border-gold bg-gold/10 text-cream";
                  if (submitted && oi === q.correct) style = "border-emerald-500 bg-emerald-500/10 text-cream";
                  if (submitted && answers[qi] === oi && oi !== q.correct) style = "border-rose-500 bg-rose-500/10 text-cream";

                  return (
                    <button
                      key={oi}
                      onClick={() => handleSelect(qi, oi)}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < lesson.exercise.questions.length}
            className="mt-6 bg-gold text-ink font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Comprobar respuestas
          </button>
        ) : (
          <div className="mt-6 bg-ink-elevated border border-white/10 rounded-xl p-5">
            <p className="font-semibold text-cream">
              Resultado: {correctCount}/{lesson.exercise.questions.length} correctas
            </p>
            <p className="text-sm text-cream/50 mt-1">
              {correctCount === lesson.exercise.questions.length
                ? "¡Excelente! Has acertado todas."
                : "Revisa las respuestas marcadas en rojo y vuelve a intentarlo."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
