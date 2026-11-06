/**
 * Adaptive engine of the level test. Pure functions, no React.
 *
 * How the level is measured: item response theory (EAP). Ability theta
 * (1 = A1 … 5 = C1) is the average of a grid weighted by a prior centred on
 * the level the user says they have and by the likelihood of every answer
 * (3-parameter logistic: 20 % chance of guessing right). After each answer the
 * next question is the closest unseen one to theta + 0.3, rotating kinds
 * (grammar → sector → idioms → reading…) so every skill is sampled. Listening
 * clips (A2 → C1, stops after 2 misses) count in the same estimate.
 * Simulated with 4 500 fake users: exact level ~80 %, within one level ~99 %.
 */
import {
  CEFR, GRAMMAR, IDIOMS, LISTENING, READING, SECTOR,
  type Family, type Item, type Kind, type Level,
} from "./bank";

export const TEST_VERSION = 1;

export const SEQUENCE: Kind[] = [
  "grammar", "sector", "idiom", "sector", "grammar", "reading",
  "sector", "idiom", "grammar", "sector", "idiom", "reading",
];
export const TEST_LENGTH = SEQUENCE.length;

export interface Answer {
  id: string;
  kind: Kind;
  level: Level;
  correct: boolean;
  /** Option chosen (text), to review mistakes. */
  chosen: string;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export const LEVEL_INDEX: Record<string, number> = { a1: 1, a2: 2, b1: 3, b2: 4, c1: 5 };

export function startTheta(selfLevel?: string | null) {
  return clamp(LEVEL_INDEX[selfLevel ?? ""] ?? 2.5, 1.5, 4);
}

/** Chance of answering an item right at a given ability. */
const pCorrect = (theta: number, level: number) =>
  0.2 + 0.8 / (1 + Math.exp(-1.8 * (theta - level - 0.5)));

/** Expected ability given the answers (EAP), from 0.5 to 5.5. */
export function estimate(
  answers: Pick<Answer, "level" | "correct">[],
  selfLevel?: string | null,
  prior = startTheta(selfLevel),
  spread = 1.5,
) {
  let num = 0;
  let den = 0;
  for (let th = 0.5; th <= 5.501; th += 0.05) {
    let w = Math.exp(-((th - prior) ** 2) / (2 * spread ** 2));
    for (const a of answers) {
      const p = pCorrect(th, a.level);
      w *= a.correct ? p : 1 - p;
    }
    num += w * th;
    den += w;
  }
  return num / den;
}

/**
 * Level of the next question: a bit above the current estimate. +0.3 keeps
 * ~81 % exact level in simulation while people get about half right (+0.5
 * was as precise but felt harsher; 0 lost 4 points of precision).
 */
export const selectionTarget = (answers: Answer[], selfLevel?: string | null) =>
  estimate(answers, selfLevel) + 0.3;

const POOLS: Record<Exclude<Kind, "listening">, Item[]> = {
  grammar: GRAMMAR,
  idiom: IDIOMS,
  reading: READING,
  sector: SECTOR,
};

export function pickItem(index: number, theta: number, family: Family, used: Set<string>): Item {
  const kind = SEQUENCE[index] as Exclude<Kind, "listening">;
  let pool = POOLS[kind].filter((it) => !used.has(it.id) && (!it.family || it.family === family));
  if (pool.length === 0) pool = GRAMMAR.filter((it) => !used.has(it.id));
  const target = Math.round(theta);
  const best = Math.min(...pool.map((it) => Math.abs(it.level - target)));
  const candidates = pool.filter((it) => Math.abs(it.level - target) === best);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export const getItem = (id: string): Item | undefined =>
  [...GRAMMAR, ...IDIOMS, ...READING, ...SECTOR, ...LISTENING].find((it) => it.id === id);

/** Deterministic shuffle by item id, so options don't jump on re-render. */
export function shuffledOptions(item: Item): string[] {
  let seed = [...item.id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
  const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const out = [...item.options];
  for (let k = out.length - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1));
    [out[k], out[j]] = [out[j], out[k]];
  }
  return out;
}

// ── Listening ──

/** Index in LISTENING of the first clip: strong users skip the A2 one. */
export const listeningStart = (theta: number) => (theta >= 3.5 ? 1 : 0);

export function listeningDone(answers: Answer[], nextIndex: number) {
  const misses = answers.filter((a) => !a.correct).length;
  return misses >= 2 || nextIndex >= LISTENING.length;
}

/** Highest clip passed with no miss below it. A1 if the first one failed. */
export function listeningLevel(answers: Answer[], start: number): number {
  let level = start === 0 ? 1 : LISTENING[start].level - 1;
  for (const a of [...answers].sort((x, y) => x.level - y.level)) {
    if (!a.correct) break;
    level = a.level;
  }
  return level;
}

// ── Result ──

export type Scale = 1 | 2 | 3 | 4;

export interface Perception {
  speaking?: Scale;
  accent?: Scale;
  listening?: Scale;
}

export interface SkillScore {
  key: Kind;
  label: string;
  correct: number;
  total: number;
  /** Ability in this skill (0.5–5.5), anchored to the overall estimate. */
  theta: number;
  cefr: string;
}

export interface TestResult {
  level: number;
  cefr: string;
  englishLevel: string;
  targetCefr: string;
  theta: number;
  listening: { skipped: boolean; level: number | null };
  skills: SkillScore[];
  insights: string[];
}

const SKILL_LABELS: Record<Kind, string> = {
  grammar: "Gramática",
  sector: "Vocabulario de tu sector",
  idiom: "Expresiones y slang",
  reading: "Comprensión lectora",
  listening: "Listening",
};

export function computeResult(input: {
  answers: Answer[];
  listeningAnswers: Answer[];
  listeningSkipped: boolean;
  listeningStartIndex: number;
  selfLevel?: string | null;
  perception: Perception;
}): TestResult {
  const { answers, listeningAnswers, listeningSkipped, perception } = input;
  const counted = listeningSkipped ? answers : [...answers, ...listeningAnswers];
  const theta = estimate(counted, input.selfLevel);

  const lLevel =
    !listeningSkipped && listeningAnswers.length > 0
      ? listeningLevel(listeningAnswers, input.listeningStartIndex)
      : null;

  const level = clamp(Math.floor(theta), 1, 5);
  const cefr = CEFR[level];

  const kinds: Kind[] = ["grammar", "sector", "idiom", "reading"];
  if (lLevel !== null) kinds.push("listening");
  const all = [...answers, ...listeningAnswers];
  const skills = kinds.map((key) => {
    const mine = all.filter((a) => a.kind === key);
    // Few answers per skill: shrink towards the overall level.
    const th = estimate(mine, null, theta, 0.8);
    return {
      key,
      label: SKILL_LABELS[key],
      correct: mine.filter((a) => a.correct).length,
      total: mine.length,
      theta: Math.round(th * 100) / 100,
      cefr: CEFR[clamp(Math.floor(th), 1, 5)],
    };
  });

  const insights: string[] = [];
  const self = LEVEL_INDEX[input.selfLevel ?? ""];
  if (self) {
    if (level > self) insights.push(`Sabes más de lo que crees: te veías en ${CEFR[self]} y el test dice ${cefr}. Lo que te falta es soltura, no base.`);
    else if (level < self) insights.push(`Te veías en ${CEFR[self]} y el test marca ${cefr}. Normal: el inglés de trabajo tiene trampas que el del colegio no enseña.`);
    else insights.push(`Te conoces bien: dijiste ${cefr} y el test lo confirma.`);
  }

  // The one the test can't measure (and our voice practice fixes) goes first.
  if ((perception.speaking ?? 4) <= 2 || (perception.accent ?? 4) <= 2) {
    insights.push("Dices que hablar te cuesta más que entender. Por eso tu plan incluye llamadas de práctica por voz con IA, con nota y corrección al terminar.");
  }

  const skill = (k: Kind) => skills.find((x) => x.key === k)?.theta ?? null;
  const sector = skill("sector");
  const idiom = skill("idiom");
  const grammar = skill("grammar");
  if (sector !== null && grammar !== null && sector < grammar - 0.3) {
    insights.push("Tu gramática va por delante de tu vocabulario técnico: el curso de tu sector es justo lo que te toca.");
  }
  if (idiom !== null && idiom < theta - 0.3) {
    insights.push("Las expresiones del día a día (las que usan los nativos en reuniones y emails) son tu punto débil. Ahí está la diferencia entre entender y encajar.");
  }
  if (lLevel !== null && lLevel < level) {
    insights.push(`Tu oído (${CEFR[lLevel]}) va por detrás de tu lectura: entrenar con acentos reales te hará ganar más que otro libro de gramática.`);
  }

  return {
    level,
    cefr,
    englishLevel: cefr.toLowerCase(),
    targetCefr: level >= 5 ? "C2" : CEFR[level + 1],
    theta: Math.round(theta * 100) / 100,
    listening: { skipped: listeningSkipped, level: lLevel },
    skills,
    insights: insights.slice(0, 3),
  };
}

// ── Plan (same maths as the app: LearningPlan in onboarding_answers.dart) ──

export const LESSON_MINUTES = 15;
export const DEFAULT_LESSONS = 16;

export function buildPlan(lessons: number, dailyMinutes: number, start = new Date()) {
  const total = (lessons > 0 ? lessons : DEFAULT_LESSONS) * LESSON_MINUTES;
  const studyDays = Math.ceil(total / dailyMinutes);
  const lessonsPerWeek = clamp(Math.floor((dailyMinutes * 5) / LESSON_MINUTES), 1, 35);
  const remaining = studyDays - 1;
  const finish = new Date(start);
  finish.setDate(finish.getDate() + Math.floor(remaining / 5) * 7 + (remaining % 5));
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return { lessonsPerWeek, finish: `${finish.getDate()} de ${months[finish.getMonth()]}` };
}
