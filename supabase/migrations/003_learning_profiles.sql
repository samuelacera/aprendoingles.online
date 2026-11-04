-- ══════════════════════════════════════════════════════════════
-- 003 — Learning profiles (answers from the app onboarding)
--
-- What the user wants to learn, their English and skill level, what
-- they want to achieve and where they come from. One row per user,
-- written only by the API (POST /api/v1/onboarding) with the service
-- role, so RLS is on with no policies: clients never touch it directly.
--
-- INCREMENTAL and non-destructive; safe to re-run.
-- ══════════════════════════════════════════════════════════════

create table if not exists public.learning_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  category_slug text,
  course_slug text,
  english_level text check (english_level in ('a1', 'a2', 'b1', 'b2', 'c1')),
  skill_level text check (skill_level in ('beginner', 'practitioner', 'expert')),
  goal text,
  goal_deadline text,
  background text,
  job_title text,
  source text,
  daily_minutes smallint check (daily_minutes between 1 and 120),
  -- Full payload as sent by the client, so new questions don't need a
  -- migration before they can be analysed.
  answers jsonb not null default '{}'::jsonb,
  platform text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.learning_profiles enable row level security;

create index if not exists learning_profiles_course_slug_idx
  on public.learning_profiles (course_slug);
