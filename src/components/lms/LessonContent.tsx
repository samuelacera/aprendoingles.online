"use client";

import { useState } from "react";
import type { Lesson } from "@/data/curriculum";

export default function LessonContent({ lesson }: { lesson: Lesson }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const { content } = lesson;

  function handleSelect(questionIdx: number, optionIdx: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  const correctCount = content.exercise.questions.filter(
    (q, i) => answers[i] === q.correct
  ).length;

  return (
    <div className="space-y-12">
      <div>
        <p className="text-gray-600 leading-relaxed text-lg">{content.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Vocabulario clave</h2>
        <div className="grid gap-4">
          {content.vocabulary.map((v, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-bold text-gray-900 text-lg">{v.term}</span>
                <span className="text-sm text-gray-400">—</span>
                <span className="text-gray-600">{v.definition}</span>
              </div>
              <p className="text-sm text-blue-primary italic mt-1">&ldquo;{v.example}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frases y expresiones clave</h2>
        <div className="space-y-4">
          {content.keyPhrases.map((p, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-lg mb-1">&ldquo;{p.phrase}&rdquo;</p>
              <p className="text-gray-600 text-sm mb-2">{p.translation}</p>
              <p className="text-xs text-gray-400">Contexto: {p.context}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ejercicio</h2>
        <p className="text-gray-500 mb-6">{content.exercise.instruction}</p>
        <div className="space-y-6">
          {content.exercise.questions.map((q, qi) => (
            <div key={qi} className="bg-gray-50 rounded-xl p-5">
              <p className="font-medium text-gray-900 mb-3">
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let style = "border-gray-200 hover:border-blue-300";
                  if (answers[qi] === oi && !submitted) style = "border-blue-primary bg-blue-50";
                  if (submitted && oi === q.correct) style = "border-green-500 bg-green-50";
                  if (submitted && answers[qi] === oi && oi !== q.correct) style = "border-red-400 bg-red-50";

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
            disabled={Object.keys(answers).length < content.exercise.questions.length}
            className="mt-6 bg-blue-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Comprobar respuestas
          </button>
        ) : (
          <div className="mt-6 bg-gray-50 rounded-xl p-5">
            <p className="font-bold text-gray-900">
              Resultado: {correctCount}/{content.exercise.questions.length} correctas
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {correctCount === content.exercise.questions.length
                ? "Excelente! Has acertado todas."
                : "Revisa las respuestas marcadas en rojo y vuelve a intentarlo."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
