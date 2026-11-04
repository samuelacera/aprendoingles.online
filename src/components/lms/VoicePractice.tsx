"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import type { SanityPracticeBrief } from "@/sanity/queries";
import { ANALYSIS_EUR, euros, voiceCost } from "@/lib/practice-cost";

/**
 * "Práctica por voz": a ≤5-minute phone call with the lesson's character
 * (ElevenLabs agent), then a Claude-graded report. The server owns the
 * scenario, the access check and the evaluation; this component only
 * drives the call. Same flow the app will use (API v1).
 */

type Stage = "brief" | "connecting" | "live" | "grading" | "result";

interface Report {
  id: string;
  durationSeconds: number | null;
  overall: number | null;
  goalAchieved: boolean | null;
  cefr: string | null;
  scores: Record<ScoreKey, number> | null;
  feedback: {
    summary: string;
    strengths: string[];
    corrections: { said: string; better: string; why: string }[];
    phrases_used: string[];
    next_focus: string;
  } | null;
}

interface HistoryItem {
  id: string;
  started_at: string;
  overall_score: number | null;
  goal_achieved: boolean | null;
}

type ScoreKey = "task" | "skill" | "fluency" | "grammar" | "vocabulary" | "clarity";

const SCORE_LABELS: { key: ScoreKey; label: string; group: "skill" | "english" }[] = [
  { key: "task", label: "Misión", group: "skill" },
  { key: "skill", label: "Método", group: "skill" },
  { key: "fluency", label: "Fluidez", group: "english" },
  { key: "grammar", label: "Gramática", group: "english" },
  { key: "vocabulary", label: "Vocabulario", group: "english" },
  { key: "clarity", label: "Claridad", group: "english" },
];

interface Props {
  courseSlug: string;
  lessonSlug: string;
  practice: SanityPracticeBrief;
}

export default function VoicePractice(props: Props) {
  return (
    <ConversationProvider>
      <VoicePracticeInner {...props} />
    </ConversationProvider>
  );
}

function VoicePracticeInner({ courseSlug, lessonSlug, practice }: Props) {
  const [stage, setStage] = useState<Stage>("brief");
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [lines, setLines] = useState<{ id: number; who: "me" | "them"; text: string }[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [maxSeconds, setMaxSeconds] = useState(300);
  const [hungUpBy, setHungUpBy] = useState<"me" | "them" | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const sessionId = useRef<string | null>(null);
  const conversationId = useRef<string | null>(null);
  const startedAt = useRef(0);
  const lineId = useRef(0);
  const alive = useRef(true);

  const loadHistory = useCallback(async () => {
    const r = await fetch(
      `/api/v1/practice/sessions?courseSlug=${courseSlug}&lessonSlug=${lessonSlug}`,
      { cache: "no-store" },
    ).catch(() => null);
    if (!r?.ok) return;
    const j = await r.json();
    if (alive.current) setHistory(j.sessions ?? []);
  }, [courseSlug, lessonSlug]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const grade = useCallback(async () => {
    const id = sessionId.current;
    if (!id) return;
    setStage("grading");
    // ElevenLabs closes the transcript a few seconds after hanging up;
    // the evaluation itself takes ~10-20 s. Poll for up to ~2 minutes.
    for (let i = 0; i < 40 && alive.current; i++) {
      try {
        const r = await fetch(`/api/v1/practice/sessions/${id}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId: conversationId.current }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error?.message || "Error al evaluar");
        if (j.ready) {
          if (!alive.current) return;
          setReport(j.session);
          setStage("result");
          loadHistory();
          return;
        }
      } catch (e) {
        if (!alive.current) return;
        setError(e instanceof Error ? e.message : "No se pudo evaluar la llamada.");
        setStage("brief");
        return;
      }
      await new Promise((res) => setTimeout(res, 3000));
    }
    if (alive.current) {
      setError("La nota está tardando más de la cuenta. Recarga en un minuto: la llamada queda guardada.");
      setStage("brief");
    }
  }, [loadHistory]);
  const gradeRef = useRef(grade);
  useEffect(() => {
    gradeRef.current = grade;
  }, [grade]);

  const conv = useConversation({
    onConnect: ({ conversationId: cid }) => {
      conversationId.current = cid;
      startedAt.current = Date.now();
      setStage("live");
    },
    onDisconnect: (d) => {
      if (!alive.current || !conversationId.current) return;
      setHungUpBy(d.reason === "agent" ? "them" : d.reason === "user" ? "me" : null);
      gradeRef.current();
    },
    onError: (message) => {
      console.error("[practice]", message);
      if (alive.current) setError("Se ha cortado la llamada. Revisa tu conexión y el micrófono.");
    },
    onMessage: ({ message, role }) => {
      // Expressive TTS leaves audio tags like "[slow]" in the text.
      const text = message?.replace(/\[[a-z][a-z ]{0,24}\]\s*/gi, "").trim();
      if (!text || text === "...") return;
      setLines((l) => [
        ...l.slice(-5),
        { id: lineId.current++, who: role === "user" ? "me" : "them", text },
      ]);
    },
  });
  const convRef = useRef(conv);
  useEffect(() => {
    convRef.current = conv;
  }, [conv]);

  // Leaving the page mid-call hangs up. `alive` is set back to true on mount:
  // React (Strict Mode in dev) mounts, unmounts and remounts, and a flag that
  // stayed false would silently skip grading after the call.
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      try {
        convRef.current.endSession();
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (stage !== "live") return;
    const t = setInterval(
      () => setSeconds(Math.round((Date.now() - startedAt.current) / 1000)),
      500,
    );
    return () => clearInterval(t);
  }, [stage]);

  async function call() {
    setError(null);
    setNeedsLogin(false);
    setLines([]);
    setSeconds(0);
    setHungUpBy(null);
    setReport(null);
    sessionId.current = null;
    conversationId.current = null;
    setStage("connecting");

    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      mic.getTracks().forEach((t) => t.stop());
    } catch {
      setError("Necesito permiso para usar el micrófono. Actívalo en el navegador y vuelve a llamar.");
      return setStage("brief");
    }

    try {
      const r = await fetch("/api/v1/practice/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, lessonSlug, platform: "web" }),
      });
      const j = await r.json();
      if (r.status === 401) {
        setNeedsLogin(true);
        return setStage("brief");
      }
      if (!r.ok) throw new Error(j?.error?.message || "La llamada no está disponible ahora.");

      sessionId.current = j.sessionId;
      setMaxSeconds(j.maxSeconds ?? 300);
      conv.startSession({
        signedUrl: j.signedUrl,
        connectionType: "websocket",
        dynamicVariables: j.dynamicVariables,
        overrides: {
          ...(j.overrides?.firstMessage && { agent: { firstMessage: j.overrides.firstMessage } }),
          ...(j.overrides?.voiceId && { tts: { voiceId: j.overrides.voiceId } }),
        },
      });
    } catch (e) {
      console.error("[practice]", e);
      setError(e instanceof Error ? e.message : "La llamada no está disponible ahora.");
      setStage("brief");
    }
  }

  const remaining = Math.max(0, maxSeconds - seconds);
  const lastScore = history.find((h) => h.overall_score != null)?.overall_score ?? null;

  return (
    <section aria-labelledby="practice-title" className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold">Práctica por voz · 5 min</p>
      <h2 id="practice-title" className="mt-1 font-display text-xl font-bold sm:text-2xl">
        {practice.title}
      </h2>

      {/* ── Brief ── */}
      {(stage === "brief" || stage === "connecting") && (
        <div className="mt-5 space-y-5">
          {practice.image && (
            // eslint-disable-next-line @next/next/no-img-element -- Sanity CDN resizes it
            <img
              src={`${practice.image}?w=1200&h=675&fit=crop&auto=format`}
              alt={practice.imageAlt || ""}
              width={1200}
              height={675}
              loading="lazy"
              className="aspect-video w-full rounded-xl border border-line object-cover"
            />
          )}
          <p className="text-foreground/80">{practice.brief}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Hablas con</p>
              <p className="mt-1 font-semibold">{practice.characterName}</p>
              <p className="text-sm text-foreground/60">{practice.characterRole}</p>
            </div>
            <div className="rounded-xl border border-gold/30 bg-gold/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">Tu misión</p>
              <p className="mt-1 font-semibold">{practice.mission}</p>
            </div>
          </div>

          {practice.mustUse.length > 0 && (
            <div>
              <p className="text-sm font-semibold">Intenta usar estas expresiones</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {practice.mustUse.map((p) => (
                  <li key={p} className="rounded-full border border-line bg-surface-2 px-3 py-1 text-sm">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ul className="space-y-1 text-sm text-foreground/60">
            <li>· La llamada es en inglés y dura 5 minutos como máximo.</li>
            <li>· {practice.characterName} puede colgarte, como en la vida real.</li>
            <li>· Al terminar recibes tu nota de inglés y de la habilidad, con correcciones.</li>
          </ul>

          <CostNote>
            Cada minuto de llamada cuesta {euros(voiceCost(60))} y el análisis de tu llamada,{" "}
            {euros(ANALYSIS_EUR)}: una llamada entera sale por hasta{" "}
            {euros(voiceCost(maxSeconds) + ANALYSIS_EUR)}. Prepárala antes de marcar y aprovéchala.
          </CostNote>

          {error && (
            <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">
              {error}
            </p>
          )}
          {needsLogin && (
            <p className="rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm">
              Para practicar necesitas una cuenta gratuita.{" "}
              <Link
                href={`/login?next=/cursos/${courseSlug}/${lessonSlug}`}
                className="font-semibold text-gold underline"
              >
                Inicia sesión o regístrate
              </Link>
              .
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={call}
              disabled={stage === "connecting"}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink transition hover:bg-gold-light disabled:opacity-60"
            >
              <PhoneIcon />
              {stage === "connecting" ? "Conectando…" : history.length ? "Volver a llamar" : "Llamar ahora"}
            </button>
            {lastScore != null && (
              <span className="text-sm text-foreground/60">
                Tu última nota: <strong className="text-foreground">{lastScore}/100</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Live call ── */}
      {stage === "live" && (
        <div className="mt-5 space-y-5">
          <div className="flex items-center gap-4">
            <span
              className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold ${
                conv.isSpeaking ? "ring-4 ring-gold/40 animate-pulse" : ""
              }`}
              aria-hidden
            >
              <PhoneIcon />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{practice.characterName}</p>
              <p className="text-sm text-foreground/60">
                {conv.isSpeaking ? "Está hablando…" : "Te escucha"}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-mono text-lg tabular-nums ${remaining < 30 ? "text-red-500" : "text-foreground/70"}`}>
                {formatClock(remaining)}
              </p>
              <p
                className="mt-1 rounded-full border border-gold/40 px-2.5 py-0.5 font-mono text-xs font-bold tabular-nums text-gold"
                aria-label="Coste de IA de esta llamada"
              >
                IA: {euros(voiceCost(seconds))}
              </p>
            </div>
          </div>

          <div className="min-h-32 space-y-2 rounded-xl border border-line bg-surface-2 p-4" aria-live="polite">
            {lines.length === 0 && <p className="text-sm text-foreground/40">La conversación aparecerá aquí…</p>}
            {lines.map((l) => (
              <p key={l.id} className={`text-sm ${l.who === "me" ? "text-foreground" : "text-foreground/60"}`}>
                <span className="font-semibold">{l.who === "me" ? "Tú" : practice.characterName}:</span> {l.text}
              </p>
            ))}
          </div>

          <p className="text-sm">
            <span className="text-foreground/50">Misión:</span> {practice.mission}
          </p>

          <button
            type="button"
            onClick={() => conv.endSession()}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Colgar
          </button>
        </div>
      )}

      {/* ── Grading ── */}
      {stage === "grading" && (
        <div className="mt-8 flex flex-col items-center gap-3 py-8 text-center">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-gold/30 border-t-gold" aria-hidden />
          <p className="font-semibold">
            {hungUpBy === "them" ? `${practice.characterName} ha colgado.` : "Llamada terminada."} Corrigiendo…
          </p>
          <p className="text-sm text-foreground/60">Revisamos tu inglés y cómo has llevado la llamada. Tarda unos segundos.</p>
        </div>
      )}

      {/* ── Result ── */}
      {stage === "result" && report && (
        <ResultView
          report={report}
          practice={practice}
          hungUpBy={hungUpBy}
          fallbackSeconds={seconds}
          onRetry={() => setStage("brief")}
        />
      )}

      {history.length > 1 && stage !== "live" && (
        <div className="mt-8 border-t border-line pt-5">
          <p className="text-sm font-semibold">Tus llamadas en esta lección</p>
          <ol className="mt-3 flex flex-wrap gap-2">
            {[...history].reverse().map((h, i) => (
              <li key={h.id} className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-center text-xs">
                <span className="block text-foreground/50">#{i + 1}</span>
                <span className="block font-mono text-base font-semibold">{h.overall_score ?? "–"}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

function ResultView({
  report,
  practice,
  hungUpBy,
  fallbackSeconds,
  onRetry,
}: {
  report: Report;
  practice: SanityPracticeBrief;
  hungUpBy: "me" | "them" | null;
  fallbackSeconds: number;
  onRetry: () => void;
}) {
  const f = report.feedback;
  const secs = Math.round(report.durationSeconds ?? fallbackSeconds);
  const callCost = voiceCost(secs);
  const used = new Set((f?.phrases_used ?? []).map((p) => p.trim().toLowerCase()));
  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Nota</p>
          <p className="font-display text-5xl font-bold text-gold">
            {report.overall ?? 0}
            <span className="text-2xl text-foreground/40">/100</span>
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            report.goalAchieved ? "bg-green-500/15 text-green-500" : "bg-overlay text-foreground/60"
          }`}
        >
          {report.goalAchieved ? "✓ Misión conseguida" : "Misión no conseguida"}
        </span>
        {report.cefr && (
          <span className="rounded-full border border-line px-3 py-1 text-sm">
            Nivel en esta llamada: <strong>{report.cefr}</strong>
          </span>
        )}
        {hungUpBy === "them" && !report.goalAchieved && (
          <span className="text-sm text-foreground/60">{practice.characterName} te colgó.</span>
        )}
      </div>

      {f?.summary && <p className="text-foreground/80">{f.summary}</p>}

      {report.scores && (
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {SCORE_LABELS.map((s) => (
            <div key={s.key}>
              <div className="flex justify-between text-sm">
                <span>
                  {s.label}
                  <span className="ml-1 text-xs text-foreground/40">
                    {s.group === "skill" ? "habilidad" : "inglés"}
                  </span>
                </span>
                <span className="font-mono">{report.scores![s.key]}/10</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-overlay">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${(report.scores![s.key] ?? 0) * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {f && f.strengths.length > 0 && (
        <div>
          <h3 className="font-semibold">Lo que has hecho bien</h3>
          <ul className="mt-2 space-y-1 text-sm text-foreground/80">
            {f.strengths.map((s) => (
              <li key={s}>✓ {s}</li>
            ))}
          </ul>
        </div>
      )}

      {f && f.corrections.length > 0 && (
        <div>
          <h3 className="font-semibold">Cómo sonaría mejor</h3>
          <ul className="mt-3 space-y-3">
            {f.corrections.map((c) => (
              <li key={c.said} className="rounded-xl border border-line bg-surface-2 p-4 text-sm">
                <p className="text-foreground/50 line-through decoration-red-500/60">{c.said}</p>
                <p className="mt-1 font-semibold">{c.better}</p>
                <p className="mt-1 text-foreground/60">{c.why}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {practice.mustUse.length > 0 && (
        <div>
          <h3 className="font-semibold">Expresiones de la lección</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {practice.mustUse.map((p) => {
              const ok = used.has(p.trim().toLowerCase());
              return (
                <li key={p} className={ok ? "text-foreground" : "text-foreground/50"}>
                  {ok ? "✓" : "○"} {p}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {f?.next_focus && (
        <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm">
          <strong>Para la próxima llamada:</strong> {f.next_focus}
        </p>
      )}

      <CostNote>
        Esta llamada de {Math.floor(secs / 60)} min {secs % 60} s ha costado {euros(callCost)} y su
        análisis, {euros(ANALYSIS_EUR)}: <strong className="text-foreground">{euros(callCost + ANALYSIS_EUR)}</strong> en
        total.
      </CostNote>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink transition hover:bg-gold-light"
      >
        <PhoneIcon /> Repetir la llamada
      </button>
    </div>
  );
}

function CostNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border-[1.5px] border-dashed border-line px-4 py-3 text-sm text-foreground/70">
      <span className="mb-0.5 block text-xs font-semibold uppercase tracking-wider text-gold">Coste de IA</span>
      {children}
    </p>
  );
}

function formatClock(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
