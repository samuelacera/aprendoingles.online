-- ══════════════════════════════════════════════════════════════
-- 004 — Voice practice (role-play calls) + organizations (B2B)
--
-- practice_sessions: one row per role-play call with the ElevenLabs
-- agent. The API creates it before the call (status 'started'), links
-- the ElevenLabs conversation id when the call connects, and stores the
-- Claude evaluation when it ends (status 'evaluated'). It is the
-- proprietary dataset: transcript + scores per skill, per lesson, over
-- time.
--
-- organizations / organization_members: a company that buys seats and
-- follows its employees. A practice session copies the learner's
-- organization at creation time, so a manager's dashboard is a single
-- indexed query and history survives the employee leaving.
--
-- All writes go through the API with the service role; RLS is on.
-- Learners can read their own sessions; managers read their org's via
-- the API (no direct policy yet).
--
-- INCREMENTAL and non-destructive; safe to re-run.
-- ══════════════════════════════════════════════════════════════

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  -- Seats bought. null = unlimited (pilot).
  seats integer check (seats is null or seats > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'manager')),
  team text,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create index if not exists organization_members_user_idx
  on public.organization_members (user_id);

create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  organization_id uuid references public.organizations (id) on delete set null,
  course_slug text not null,
  lesson_slug text not null,
  scenario_key text not null,
  english_level text,
  platform text,
  status text not null default 'started'
    check (status in ('started', 'connected', 'ended', 'evaluated', 'failed')),
  elevenlabs_conversation_id text unique,
  duration_seconds integer,
  -- [{ role: 'user' | 'agent', text, t }] as returned by ElevenLabs.
  transcript jsonb,
  -- 0-100 overall, plus the breakdown the UI and dashboards read.
  overall_score smallint check (overall_score between 0 and 100),
  goal_achieved boolean,
  cefr_estimate text,
  -- { task, fluency, grammar, vocabulary, pronunciation_clarity, skill } 0-10
  scores jsonb,
  -- { summary, strengths[], corrections[{ said, better, why }], next_focus }
  feedback jsonb,
  evaluator_model text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  evaluated_at timestamptz
);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.practice_sessions enable row level security;

drop policy if exists "own practice sessions" on public.practice_sessions;
create policy "own practice sessions" on public.practice_sessions
  for select using (auth.uid() = user_id);

create index if not exists practice_sessions_user_idx
  on public.practice_sessions (user_id, started_at desc);
create index if not exists practice_sessions_lesson_idx
  on public.practice_sessions (user_id, course_slug, lesson_slug, started_at desc);
create index if not exists practice_sessions_org_idx
  on public.practice_sessions (organization_id, started_at desc)
  where organization_id is not null;

-- Fundae audit: every evaluated call is also logged as activity (time spent).
alter type public.activity_type add value if not exists 'practice_call';
