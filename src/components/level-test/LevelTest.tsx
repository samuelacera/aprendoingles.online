"use client";

/**
 * Level test → onboarding → signup (/test-nivel).
 *
 * Flow: sector → course → skill level → goal → self-assessed level →
 * perception (speaking, accent, listening) → 12 adaptive questions →
 * listening (skippable) → minutes a day → how they found us →
 * "creating your plan" → result + signup.
 *
 * Nothing is sent until signup: the answers ride in the signup metadata
 * (see registerFromTest) and end up in learning_profiles. The result is kept
 * in localStorage so a reload, a failed signup or a login doesn't lose it.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { registerFromTest, saveTestResult } from "@/app/auth/actions";
import { LISTENING, familyOf, type Item, type ListeningItem } from "@/lib/level-test/bank";
import {
  TEST_LENGTH, TEST_VERSION, buildPlan, computeResult, getItem, listeningDone,
  listeningStart, pickItem, selectionTarget, shuffledOptions,
  type Answer, type Perception, type Scale, type TestResult,
} from "@/lib/level-test/engine";

export interface TestCategory {
  slug: string;
  name: string;
  courses: { slug: string; h1: string; lessonCount: number }[];
}

type Step =
  | "intro" | "sector" | "course" | "skill" | "goal" | "self" | "perception"
  | "test" | "listenGate" | "listening" | "minutes" | "source" | "building" | "result";

interface Profile {
  categorySlug?: string;
  courseSlug?: string;
  skillLevel?: string;
  goal?: string;
  selfLevel?: string;
  perception: Perception;
  dailyMinutes?: number;
  source?: string;
}

interface Saved {
  version: number;
  profile: Profile;
  answers: Answer[];
  listeningAnswers: Answer[];
  result: TestResult;
  takenAt: string;
}

const STORAGE_KEY = "aprendoingles:test-nivel";

const SELF_LEVELS = [
  { value: "a1", emoji: "🌱", title: "Empiezo de cero", sub: "Sé decir hello y poco más." },
  { value: "a2", emoji: "🧩", title: "Me defiendo lo justo", sub: "Entiendo frases sueltas si me hablan despacio." },
  { value: "b1", emoji: "💬", title: "Me apaño", sub: "Leo emails sin problema, pero en una call me bloqueo." },
  { value: "b2", emoji: "🚀", title: "Me desenvuelvo bien", sub: "Trabajo en inglés, aunque me faltan palabras técnicas." },
  { value: "c1", emoji: "🎩", title: "Casi nativo", sub: "Quiero pulir matices y sonar como un experto." },
];

const SKILL_LEVELS = [
  { value: "beginner", emoji: "🐣", title: "Empiezo de cero", sub: "Quiero aprenderlo desde la base." },
  { value: "practitioner", emoji: "🛠️", title: "Ya lo uso en mi trabajo", sub: "Conozco lo básico y quiero ir más a fondo." },
  { value: "expert", emoji: "🎯", title: "Soy experto", sub: "Lo domino; quiero contarlo en inglés con soltura." },
];

const GOALS = [
  { value: "promotion", emoji: "📈", title: "Ascender o cobrar más" },
  { value: "international_clients", emoji: "🌍", title: "Trabajar con clientes internacionales" },
  { value: "work_abroad", emoji: "✈️", title: "Trabajar en el extranjero" },
  { value: "career_change", emoji: "🔄", title: "Cambiar de sector o de puesto" },
  { value: "job_interview", emoji: "🤝", title: "Superar una entrevista en inglés" },
  { value: "personal", emoji: "🧠", title: "Aprender por mi cuenta" },
];

const MINUTES = [
  { value: 5, emoji: "☕", title: "5 min al día", sub: "Casual" },
  { value: 10, emoji: "🚶", title: "10 min al día", sub: "Constante" },
  { value: 15, emoji: "🏃", title: "15 min al día", sub: "En serio" },
  { value: 20, emoji: "🚀", title: "20 min al día", sub: "A tope" },
];

const SOURCES = [
  { value: "google", emoji: "🔎", title: "Google" },
  { value: "instagram", emoji: "📸", title: "Instagram" },
  { value: "linkedin", emoji: "💼", title: "LinkedIn" },
  { value: "tiktok", emoji: "🎵", title: "TikTok" },
  { value: "youtube", emoji: "▶️", title: "YouTube" },
  { value: "friend", emoji: "🫶", title: "Un amigo o compañero" },
  { value: "other", emoji: "✨", title: "Otro" },
];

const PERCEPTION: { key: keyof Perception; question: string; options: string[] }[] = [
  { key: "speaking", question: "Hablando en una reunión en inglés…", options: ["Me bloqueo", "Me cuesta", "Me apaño", "Con soltura"] },
  { key: "accent", question: "Tu acento…", options: ["Muy español", "Se nota bastante", "Se entiende bien", "Casi ni se nota"] },
  { key: "listening", question: "Escuchando a nativos en una call…", options: ["Me pierdo", "Pillo palabras sueltas", "Entiendo lo principal", "Lo pillo casi todo"] },
];

const KIND_LABEL: Record<string, string> = {
  grammar: "Gramática",
  sector: "Inglés de tu sector",
  idiom: "Expresiones y slang",
  reading: "Lectura",
  listening: "Listening",
};

/** Rough position in the whole flow, for the top bar. */
const STEP_PROGRESS: Record<Step, number> = {
  intro: 0, sector: 0.04, course: 0.08, skill: 0.12, goal: 0.16, self: 0.2, perception: 0.24,
  test: 0.28, listenGate: 0.72, listening: 0.75, minutes: 0.88, source: 0.93, building: 0.97, result: 1,
};

function readSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = raw ? (JSON.parse(raw) as Saved) : null;
    return saved?.version === TEST_VERSION && saved.result ? saved : null;
  } catch {
    return null;
  }
}

export default function LevelTest({
  categories,
  loggedIn,
  error,
}: {
  categories: TestCategory[];
  loggedIn: boolean;
  error?: string;
}) {
  const [step, setStep] = useState<Step>("intro");
  const [profile, setProfile] = useState<Profile>({ perception: {} });

  // Adaptive test
  const [theta, setTheta] = useState(2.5);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [current, setCurrent] = useState<Item | null>(null);
  const used = useRef(new Set<string>());

  // Listening
  const [lStart, setLStart] = useState(0);
  const [lIndex, setLIndex] = useState(0);
  const [lAnswers, setLAnswers] = useState<Answer[]>([]);
  const [lSkipped, setLSkipped] = useState(false);

  const [saved, setSaved] = useState<Saved | null>(null);

  // A previous result (reload, failed signup, back from login) goes straight to it.
  useEffect(() => {
    const s = readSaved();
    if (s) {
      // localStorage only exists in the browser: read once after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaved(s);
      setStep("result");
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step, current]);

  const category = categories.find((c) => c.slug === profile.categorySlug);
  const course = category?.courses.find((c) => c.slug === profile.courseSlug);

  const set = (patch: Partial<Profile>, next: Step) => {
    setProfile((p) => ({ ...p, ...patch }));
    setStep(next);
  };

  // ── Test ──
  const startTest = () => {
    const t = selectionTarget([], profile.selfLevel);
    used.current = new Set();
    const first = pickItem(0, t, familyOf(profile.categorySlug), used.current);
    used.current.add(first.id);
    setTheta(t);
    setAnswers([]);
    setCurrent(first);
    setStep("test");
  };

  const answer = (chosen: string | null) => {
    if (!current) return;
    const correct = chosen === current.options[0];
    const a: Answer = { id: current.id, kind: current.kind, level: current.level, correct, chosen: chosen ?? "" };
    const all = [...answers, a];
    const t = selectionTarget(all, profile.selfLevel);
    setAnswers(all);
    setTheta(t);
    if (all.length >= TEST_LENGTH) {
      setCurrent(null);
      setStep("listenGate");
      return;
    }
    const next = pickItem(all.length, t, familyOf(profile.categorySlug), used.current);
    used.current.add(next.id);
    setCurrent(next);
  };

  const startListening = () => {
    const start = listeningStart(theta);
    setLStart(start);
    setLIndex(start);
    setLAnswers([]);
    setLSkipped(false);
    setStep("listening");
  };

  const skipListening = () => {
    setLSkipped(true);
    setStep("minutes");
  };

  const answerListening = (chosen: string | null) => {
    const clip = LISTENING[lIndex];
    const a: Answer = { id: clip.id, kind: "listening", level: clip.level, correct: chosen === clip.options[0], chosen: chosen ?? "" };
    const all = [...lAnswers, a];
    setLAnswers(all);
    if (listeningDone(all, lIndex + 1)) setStep("minutes");
    else setLIndex(lIndex + 1);
  };

  // ── Finish ──
  const finish = (source: string) => {
    const p = { ...profile, source };
    setProfile(p);
    const result = computeResult({
      answers,
      listeningAnswers: lAnswers,
      listeningSkipped: lSkipped || lAnswers.length === 0,
      listeningStartIndex: lStart,
      selfLevel: p.selfLevel,
      perception: p.perception,
    });
    const s: Saved = { version: TEST_VERSION, profile: p, answers, listeningAnswers: lAnswers, result, takenAt: new Date().toISOString() };
    setSaved(s);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {}
    setStep("building");
  };

  const restart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSaved(null);
    setProfile({ perception: {} });
    setLSkipped(false);
    setLAnswers([]);
    setStep("intro");
  };

  const back: Partial<Record<Step, Step>> = {
    sector: "intro", course: "sector", skill: "course", goal: "skill", self: "goal", perception: "self",
  };

  return (
    <section className="bg-background text-foreground min-h-[calc(100vh-64px)] pb-16">
      {step !== "intro" && step !== "result" && (
        <div className="sticky top-16 z-10 bg-background/90 backdrop-blur border-b border-line">
          <div className="max-w-2xl mx-auto px-4 h-12 flex items-center gap-3">
            {back[step] ? (
              <button onClick={() => setStep(back[step]!)} className="text-foreground/50 hover:text-foreground text-sm shrink-0" aria-label="Atrás">
                ← Atrás
              </button>
            ) : (
              <span className="w-[52px] shrink-0" />
            )}
            <div className="flex-1 bg-overlay rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gold h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round((step === "test" ? 0.28 + (answers.length / TEST_LENGTH) * 0.44 : STEP_PROGRESS[step]) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 pt-8 sm:pt-12">
        {step === "intro" && <Intro onStart={() => setStep("sector")} />}

        {step === "sector" && (
          <Screen eyebrow="Tu perfil" title="¿En qué sector trabajas (o quieres trabajar)?" sub="Las preguntas del test usarán el inglés de tu sector.">
            <div className="grid sm:grid-cols-2 gap-2.5">
              {categories.map((c) => (
                <Choice
                  key={c.slug}
                  title={c.name}
                  selected={profile.categorySlug === c.slug}
                  onClick={() => set({ categorySlug: c.slug, courseSlug: undefined }, "course")}
                />
              ))}
            </div>
          </Screen>
        )}

        {step === "course" && category && (
          <Screen eyebrow={category.name} title="¿Qué quieres dominar en inglés?" sub="Elige lo más parecido a tu día a día.">
            <div className="space-y-2.5">
              {category.courses.map((c) => (
                <Choice
                  key={c.slug}
                  title={skillName(c.h1)}
                  sub={c.lessonCount > 0 ? "Disponible ya" : "Próximamente"}
                  selected={profile.courseSlug === c.slug}
                  onClick={() => set({ courseSlug: c.slug }, "skill")}
                />
              ))}
            </div>
          </Screen>
        )}

        {step === "skill" && (
          <Screen eyebrow="Tu perfil" title={`¿Y cuánto sabes de ${course ? lowerFirst(skillName(course.h1)) : "tu área"}?`} sub="Sin inglés de por medio: solo el oficio.">
            <div className="space-y-2.5">
              {SKILL_LEVELS.map((o) => (
                <Choice key={o.value} emoji={o.emoji} title={o.title} sub={o.sub} selected={profile.skillLevel === o.value} onClick={() => set({ skillLevel: o.value }, "goal")} />
              ))}
            </div>
          </Screen>
        )}

        {step === "goal" && (
          <Screen eyebrow="Tu perfil" title="¿Para qué quieres mejorar tu inglés?">
            <div className="space-y-2.5">
              {GOALS.map((o) => (
                <Choice key={o.value} emoji={o.emoji} title={o.title} selected={profile.goal === o.value} onClick={() => set({ goal: o.value }, "self")} />
              ))}
            </div>
          </Screen>
        )}

        {step === "self" && (
          <Screen eyebrow="Antes del test" title="¿Qué nivel de inglés crees que tienes?" sub="Sé sincero: el test empieza por aquí y se ajusta solo.">
            <div className="space-y-2.5">
              {SELF_LEVELS.map((o) => (
                <Choice key={o.value} emoji={o.emoji} title={o.title} sub={o.sub} selected={profile.selfLevel === o.value} onClick={() => set({ selfLevel: o.value }, "perception")} />
              ))}
            </div>
          </Screen>
        )}

        {step === "perception" && (
          <PerceptionStep
            value={profile.perception}
            onChange={(perception) => setProfile((p) => ({ ...p, perception }))}
            onNext={startTest}
          />
        )}

        {step === "test" && current && (
          <Question key={current.id} item={current} index={answers.length} onAnswer={answer} />
        )}

        {step === "listenGate" && (
          <Screen eyebrow="Última parte" title="Ahora, a escuchar 🎧" sub="Hasta 4 audios cortos con acentos reales de trabajo: británico, americano, australiano e indio. Cada uno se puede escuchar dos veces.">
            <div className="space-y-3">
              <button onClick={startListening} className="w-full bg-gold text-ink font-semibold py-4 rounded-xl hover:bg-gold-light transition-colors">
                Tengo cascos o puedo poner sonido
              </button>
              <button onClick={skipListening} className="w-full border border-line text-foreground/70 font-medium py-4 rounded-xl hover:bg-overlay transition-colors">
                Ahora no puedo escuchar · saltar
              </button>
              <p className="text-xs text-foreground/40 text-center">Si lo saltas, tu nivel se calcula sin listening.</p>
            </div>
          </Screen>
        )}

        {step === "listening" && (
          <ListeningQuestion
            key={LISTENING[lIndex].id}
            clip={LISTENING[lIndex]}
            index={lIndex - lStart}
            total={LISTENING.length - lStart}
            onAnswer={answerListening}
            onSkip={skipListening}
          />
        )}

        {step === "minutes" && (
          <Screen eyebrow="Ya casi" title="¿Cuánto tiempo puedes dedicarle al día?" sub="Mejor poco y todos los días que mucho un sábado.">
            <div className="space-y-2.5">
              {MINUTES.map((o) => (
                <Choice key={o.value} emoji={o.emoji} title={o.title} sub={o.sub} selected={profile.dailyMinutes === o.value} onClick={() => set({ dailyMinutes: o.value }, "source")} />
              ))}
            </div>
          </Screen>
        )}

        {step === "source" && (
          <Screen eyebrow="Última pregunta" title="¿Cómo nos has conocido?">
            <div className="grid sm:grid-cols-2 gap-2.5">
              {SOURCES.map((o) => (
                <Choice key={o.value} emoji={o.emoji} title={o.title} selected={profile.source === o.value} onClick={() => finish(o.value)} />
              ))}
            </div>
          </Screen>
        )}

        {step === "building" && saved && (
          <Building
            cefr={saved.result.cefr}
            course={course ? skillName(course.h1) : "tu área"}
            minutes={saved.profile.dailyMinutes ?? 15}
            onDone={() => setStep("result")}
          />
        )}

        {step === "result" && saved && (
          <Result saved={saved} categories={categories} loggedIn={loggedIn} error={error} onRestart={restart} />
        )}
      </div>
    </section>
  );
}

// ── Pieces ──

/** "Ventas" → "ventas", but "SEO y…" stays "SEO y…". */
function lowerFirst(text: string) {
  return /^[A-ZÁÉÍÓÚ]{2}/.test(text) ? text : text.charAt(0).toLowerCase() + text.slice(1);
}

function skillName(h1: string) {
  let name = h1.trim();
  for (const prefix of ["Curso de inglés para profesionales de ", "Curso de inglés para profesionales del ", "Curso de inglés para ", "Curso de inglés ", "Curso de "]) {
    if (name.toLowerCase().startsWith(prefix.toLowerCase())) {
      name = name.slice(prefix.length);
      break;
    }
  }
  return name ? name[0].toUpperCase() + name.slice(1) : h1;
}

function Screen({ eyebrow, title, sub, children }: { eyebrow?: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="animate-[fadeIn_.25s_ease-out]">
      {eyebrow && <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-3">{eyebrow}</p>}
      <h1 className="font-display text-2xl sm:text-4xl font-bold leading-tight mb-2">{title}</h1>
      {sub && <p className="text-foreground/60 mb-6">{sub}</p>}
      {!sub && <div className="mb-6" />}
      {children}
    </div>
  );
}

function Choice({ emoji, title, sub, selected, onClick }: { emoji?: string; title: string; sub?: string; selected?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
        selected ? "border-gold bg-gold/10" : "border-line bg-surface-2 hover:border-gold/50 hover:bg-overlay"
      }`}
    >
      {emoji && <span className="text-xl shrink-0">{emoji}</span>}
      <span className="min-w-0">
        <span className="block font-medium">{title}</span>
        {sub && <span className="block text-sm text-foreground/50">{sub}</span>}
      </span>
    </button>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center pt-6 sm:pt-10">
      <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-4">Test gratuito · 4 minutos</p>
      <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.05] mb-5">
        ¿Qué nivel de inglés tienes <span className="italic text-gold">de verdad</span>?
      </h1>
      <p className="text-foreground/60 text-lg max-w-xl mx-auto mb-8">
        Nada de «elige el verbo correcto» de libro de texto. Te ponemos el inglés que vas a oír en tu trabajo: gramática, vocabulario de tu sector, expresiones de nativos y audios con acentos reales.
      </p>
      <button onClick={onStart} className="w-full sm:w-auto bg-gold text-ink font-semibold px-10 py-4 rounded-full hover:bg-gold-light transition-colors text-lg">
        Empezar el test
      </button>
      <ul className="mt-10 grid sm:grid-cols-3 gap-3 text-sm text-left">
        {[
          ["🎯", "Adaptativo", "Sube o baja de dificultad según aciertas."],
          ["💼", "De tu sector", "Vocabulario técnico de tu profesión."],
          ["🎧", "Con listening", "Acentos reales. Si no puedes escuchar ahora, lo saltas."],
        ].map(([e, t, d]) => (
          <li key={t} className="bg-surface-2 border border-line rounded-xl p-4">
            <span className="text-xl">{e}</span>
            <p className="font-semibold mt-1">{t}</p>
            <p className="text-foreground/50">{d}</p>
          </li>
        ))}
      </ul>
      <p className="text-xs text-foreground/40 mt-6">Sin registro para hacerlo. Al final te enseñamos tu nivel y tu plan.</p>
    </div>
  );
}

function PerceptionStep({ value, onChange, onNext }: { value: Perception; onChange: (p: Perception) => void; onNext: () => void }) {
  const done = PERCEPTION.every((q) => value[q.key]);
  return (
    <Screen eyebrow="Antes del test" title="¿Cómo te ves hablando y escuchando?" sub="Esto no se puede medir en un test escrito, así que te preguntamos a ti.">
      <div className="space-y-6">
        {PERCEPTION.map((q) => (
          <div key={q.key}>
            <p className="font-medium mb-2.5">{q.question}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {q.options.map((label, i) => {
                const v = (i + 1) as Scale;
                const on = value[q.key] === v;
                return (
                  <button
                    key={label}
                    onClick={() => onChange({ ...value, [q.key]: v })}
                    className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${on ? "border-gold bg-gold/10 text-foreground" : "border-line bg-surface-2 text-foreground/70 hover:border-gold/50"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!done}
        className="mt-8 w-full bg-gold text-ink font-semibold py-4 rounded-xl hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Empezar las preguntas
      </button>
    </Screen>
  );
}

function Question({ item, index, onAnswer }: { item: Item; index: number; onAnswer: (chosen: string | null) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = shuffledOptions(item);
  const choose = (o: string | null) => {
    if (picked !== null) return;
    setPicked(o ?? "");
    setTimeout(() => onAnswer(o), 280);
  };
  return (
    <div className="animate-[fadeIn_.25s_ease-out]">
      <div className="flex items-center justify-between mb-4 text-xs">
        <span className="font-semibold text-gold uppercase tracking-[0.2em]">{KIND_LABEL[item.kind]}</span>
        <span className="text-foreground/40">Pregunta {index + 1} de {TEST_LENGTH}</span>
      </div>
      {item.context && (
        <blockquote className="bg-surface-2 border border-line rounded-xl p-4 mb-4 text-foreground/80 leading-relaxed" lang="en">
          {item.context}
        </blockquote>
      )}
      <h1 className="text-xl sm:text-2xl font-semibold leading-snug mb-6" lang="en">
        {renderGap(item.prompt)}
      </h1>
      <div className="space-y-2.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => choose(o)}
            className={`w-full text-left rounded-xl border px-4 py-3.5 transition-colors ${picked === o ? "border-gold bg-gold/10" : "border-line bg-surface-2 hover:border-gold/50 hover:bg-overlay"}`}
            lang={item.kind === "idiom" ? "es" : "en"}
          >
            {o}
          </button>
        ))}
      </div>
      <button onClick={() => choose(null)} className="mt-4 w-full text-sm text-foreground/50 hover:text-foreground py-2">
        No lo sé
      </button>
    </div>
  );
}

function renderGap(prompt: string) {
  const parts = prompt.split("___");
  if (parts.length === 1) return prompt;
  return parts.map((p, i) => (
    <span key={i}>
      {p}
      {i < parts.length - 1 && <span className="inline-block min-w-16 border-b-2 border-gold mx-1 align-baseline">&nbsp;</span>}
    </span>
  ));
}

function ListeningQuestion({ clip, index, total, onAnswer, onSkip }: { clip: ListeningItem; index: number; total: number; onAnswer: (c: string | null) => void; onSkip: () => void }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const options = shuffledOptions(clip);

  const play = () => {
    if (!audio.current || plays >= 2 || playing) return;
    audio.current.currentTime = 0;
    audio.current.play().then(() => {
      setPlays((n) => n + 1);
      setPlaying(true);
    }).catch(() => {});
  };
  const choose = (o: string | null) => {
    if (picked !== null) return;
    audio.current?.pause();
    setPicked(o ?? "");
    setTimeout(() => onAnswer(o), 280);
  };

  return (
    <div className="animate-[fadeIn_.25s_ease-out]">
      <div className="flex items-center justify-between mb-4 text-xs">
        <span className="font-semibold text-gold uppercase tracking-[0.2em]">Listening</span>
        <span className="text-foreground/40">Audio {index + 1} de {total}</span>
      </div>
      <audio ref={audio} src={clip.audio} preload="auto" onEnded={() => setPlaying(false)} />
      <div className="bg-surface-2 border border-line rounded-2xl p-5 flex items-center gap-4 mb-6">
        <button
          onClick={play}
          disabled={plays >= 2 || playing}
          className="w-14 h-14 rounded-full bg-gold text-ink flex items-center justify-center shrink-0 disabled:opacity-40"
          aria-label="Escuchar"
        >
          {playing ? (
            <span className="flex gap-1">{[0, 1, 2].map((b) => <span key={b} className="w-1 h-4 bg-ink rounded animate-pulse" style={{ animationDelay: `${b * 150}ms` }} />)}</span>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <div className="min-w-0">
          <p className="font-medium">{clip.speaker.split(" · ")[0]}</p>
          <p className="text-sm text-foreground/50">{clip.speaker.split(" · ")[1]}</p>
          <p className="text-xs text-foreground/40 mt-1">{plays === 0 ? "Pulsa para escuchar" : plays === 1 ? "Puedes escucharlo una vez más" : "Ya no quedan escuchas"}</p>
        </div>
      </div>
      <h1 className="text-xl sm:text-2xl font-semibold leading-snug mb-5" lang="en">{clip.prompt}</h1>
      <div className={`space-y-2.5 transition-opacity ${plays === 0 ? "opacity-40 pointer-events-none" : ""}`}>
        {options.map((o) => (
          <button
            key={o}
            onClick={() => choose(o)}
            className={`w-full text-left rounded-xl border px-4 py-3.5 transition-colors ${picked === o ? "border-gold bg-gold/10" : "border-line bg-surface-2 hover:border-gold/50 hover:bg-overlay"}`}
            lang="en"
          >
            {o}
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <button onClick={() => choose(null)} disabled={plays === 0} className="text-foreground/50 hover:text-foreground py-2 disabled:opacity-40">No lo he entendido</button>
        <button onClick={onSkip} className="text-foreground/50 hover:text-foreground py-2">Saltar el listening</button>
      </div>
    </div>
  );
}

function Building({ cefr, course, minutes, onDone }: { cefr: string; course: string; minutes: number; onDone: () => void }) {
  const lines = [
    "Corrigiendo tus respuestas",
    `Calculando tu nivel (${cefr})`,
    `Preparando el temario de ${course}`,
    `Ajustando el ritmo a ${minutes} min al día`,
  ];
  const [done, setDone] = useState(0);
  useEffect(() => {
    const timers = lines.map((_, i) => setTimeout(() => setDone(i + 1), (i + 1) * 750));
    timers.push(setTimeout(onDone, lines.length * 750 + 600));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="pt-10 text-center">
      <div className="w-14 h-14 mx-auto mb-6 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
      <h1 className="font-display text-3xl font-bold mb-8">Creando tu plan…</h1>
      <ul className="space-y-3 max-w-xs mx-auto text-left">
        {lines.map((l, i) => (
          <li key={l} className={`flex items-center gap-3 transition-opacity duration-300 ${i < done ? "opacity-100" : "opacity-30"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${i < done ? "bg-gold text-ink" : "bg-overlay"}`}>{i < done ? "✓" : ""}</span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Result + signup ──

const GOAL_TITLE = Object.fromEntries(GOALS.map((g) => [g.value, g.title]));

function Result({ saved, categories, loggedIn, error, onRestart }: { saved: Saved; categories: TestCategory[]; loggedIn: boolean; error?: string; onRestart: () => void }) {
  const { result, profile } = saved;
  const cat = categories.find((c) => c.slug === profile.categorySlug);
  const course = cat?.courses.find((c) => c.slug === profile.courseSlug);
  const plan = buildPlan(course?.lessonCount ?? 0, profile.dailyMinutes ?? 15);
  const next = course ? `/cursos/${course.slug}` : "/mi-cuenta";
  const mistakes = [...saved.answers, ...saved.listeningAnswers].filter((a) => !a.correct);

  const onboarding = JSON.stringify({
    platform: "web",
    categorySlug: profile.categorySlug,
    courseSlug: profile.courseSlug,
    englishLevel: result.englishLevel,
    skillLevel: profile.skillLevel,
    goal: profile.goal,
    source: profile.source,
    dailyMinutes: profile.dailyMinutes,
    selfLevel: profile.selfLevel,
    perception: profile.perception,
    levelTest: {
      version: saved.version,
      takenAt: saved.takenAt,
      cefr: result.cefr,
      theta: result.theta,
      listening: result.listening,
      skills: result.skills,
      answers: saved.answers.map(({ id, correct }) => ({ id, correct })),
      listeningAnswers: saved.listeningAnswers.map(({ id, correct }) => ({ id, correct })),
    },
  });

  return (
    <div className="animate-[fadeIn_.3s_ease-out]">
      <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-3 text-center">Tu resultado</p>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-gold bg-gold/10 mb-4">
          <span className="font-display text-5xl font-bold text-gold">{result.cefr}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
          Tu inglés profesional está en <span className="text-gold">{result.cefr}</span>
        </h1>
        <p className="text-foreground/60 mt-2">
          {result.listening.skipped ? "Calculado sin listening. " : ""}Tu siguiente meta: <strong className="text-foreground">{result.targetCefr}</strong>.
        </p>
      </div>

      <div className="bg-surface-2 border border-line rounded-2xl p-5 sm:p-6 mb-4">
        <h2 className="font-semibold mb-4">Por habilidades</h2>
        <div className="space-y-3.5">
          {result.skills.map((s) => (
            <div key={s.key}>
              <div className="flex justify-between text-sm mb-1.5">
                <span>{s.label}</span>
                <span className="font-semibold text-gold">{s.cefr}</span>
              </div>
              <div className="h-2 bg-overlay rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: `${Math.round(((s.theta - 0.5) / 5) * 100)}%` }} />
              </div>
            </div>
          ))}
          {result.listening.skipped && <p className="text-xs text-foreground/40">Listening: sin evaluar.</p>}
        </div>
        {result.insights.length > 0 && (
          <ul className="mt-5 pt-5 border-t border-line space-y-3 text-sm text-foreground/80">
            {result.insights.map((t) => (
              <li key={t} className="flex gap-2.5"><span className="text-gold shrink-0">→</span>{t}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-surface-2 border border-gold/40 rounded-2xl p-5 sm:p-6 mb-4">
        <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-2">Tu plan</p>
        <h2 className="font-display text-2xl font-bold mb-4">
          {course ? skillName(course.h1) : "Inglés profesional"} en inglés, hacia el {plan.finish}
        </h2>
        <ul className="space-y-2 text-sm">
          <li>🗣️ Tu inglés: <strong>{result.cefr} → {result.targetCefr}</strong></li>
          <li>⏱️ Ritmo: <strong>{profile.dailyMinutes ?? 15} min al día · {plan.lessonsPerWeek} {plan.lessonsPerWeek === 1 ? "lección" : "lecciones"} por semana</strong></li>
          {profile.goal && <li>🏁 Para: <strong>{GOAL_TITLE[profile.goal]}</strong></li>}
          <li>📞 Llamadas de práctica por voz con IA, con nota al terminar</li>
        </ul>
      </div>

      <div id="registro" className="bg-surface border border-line rounded-2xl p-5 sm:p-6 mb-8">
        {loggedIn ? (
          <form action={saveTestResult}>
            <input type="hidden" name="onboarding" value={onboarding} />
            <input type="hidden" name="redirectTo" value={next} />
            <h2 className="font-display text-2xl font-bold mb-2">Guarda tu plan</h2>
            <p className="text-foreground/60 text-sm mb-5">Lo guardamos en tu cuenta y empiezas por tu curso.</p>
            <Submit label="Guardar y empezar" />
          </form>
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold mb-1">Crea tu cuenta y guarda tu plan</h2>
            <p className="text-foreground/60 text-sm mb-5">Gratis y en 10 segundos: solo email y contraseña.</p>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-lg p-3 mb-4">{error}</div>
            )}
            <form action={registerFromTest} className="space-y-3">
              <input type="hidden" name="onboarding" value={onboarding} />
              <input type="hidden" name="redirectTo" value={next} />
              <Field name="email" label="Email" type="email" placeholder="tu@email.com" autoComplete="email" />
              <Field name="password" label="Contraseña" type="password" placeholder="Mínimo 6 caracteres" autoComplete="new-password" minLength={6} />
              <Submit label="Crear cuenta y ver mi plan" />
            </form>
            <p className="text-center text-sm text-foreground/50 mt-4">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login?next=/test-nivel" className="text-gold hover:text-gold-light font-medium">Inicia sesión</Link>{" "}
              y guárdalo.
            </p>
          </>
        )}
      </div>

      {mistakes.length > 0 && (
        <details className="bg-surface-2 border border-line rounded-2xl p-5 sm:p-6 mb-6 group">
          <summary className="cursor-pointer font-semibold list-none flex justify-between items-center">
            Repasa tus {mistakes.length} fallos
            <span className="text-foreground/40 group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <ul className="mt-5 space-y-5">
            {mistakes.map((m) => {
              const it = getItem(m.id);
              if (!it) return null;
              return (
                <li key={m.id} className="text-sm border-t border-line pt-4 first:border-0 first:pt-0">
                  <p className="text-foreground/80 mb-1" lang="en">{it.kind === "listening" ? `🎧 ${it.prompt}` : it.prompt.replace("___", "____")}</p>
                  {m.chosen && <p className="text-rose-400">✗ {m.chosen}</p>}
                  <p className="text-emerald-500">✓ {it.options[0]}</p>
                  <p className="text-foreground/50 mt-1">{it.why}</p>
                </li>
              );
            })}
          </ul>
        </details>
      )}

      <p className="text-center">
        <button onClick={onRestart} className="text-sm text-foreground/50 hover:text-foreground underline underline-offset-4">Repetir el test</button>
      </p>
    </div>
  );
}

function Field(props: { name: string; label: string; type: string; placeholder: string; autoComplete: string; minLength?: number }) {
  return (
    <div>
      <label htmlFor={props.name} className="block text-sm font-medium text-foreground/80 mb-1">{props.label}</label>
      <input
        id={props.name}
        name={props.name}
        type={props.type}
        required
        minLength={props.minLength}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        className="w-full bg-background border border-line text-foreground placeholder:text-foreground/30 rounded-lg px-4 py-3 text-base sm:text-sm focus:ring-2 focus:ring-gold/60 focus:border-transparent outline-none"
      />
    </div>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-gold text-ink font-semibold py-3.5 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-60">
      {pending ? "Un segundo…" : label}
    </button>
  );
}
