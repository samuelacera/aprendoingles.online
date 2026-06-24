-- ══════════════════════════════════════════════════════════════
-- aprendoingles.online — Database schema
-- Auth: Supabase Auth  |  Payments: Stripe (future)
-- Fundae-compliant, server-authoritative progress tracking
--
-- SECURITY MODEL:
--   - Users can only SELECT their own rows (RLS).
--   - Users CANNOT write to any table directly (no write policies).
--   - All writes go through the server (service_role key) after the
--     server validates the action. This prevents users from forging
--     paid enrollments or tampering with Fundae activity records.
--
-- Safe to re-run on an empty database: drops and recreates everything.
-- ══════════════════════════════════════════════════════════════

-- ── Clean slate (only objects defined below) ──
drop table if exists public.activity_log cascade;
drop table if exists public.lesson_progress cascade;
drop table if exists public.enrollments cascade;
drop table if exists public.subscriptions cascade;
drop table if exists public.profiles cascade;
drop type if exists public.enrollment_type cascade;
drop type if exists public.activity_type cascade;
drop type if exists public.subscription_status cascade;

-- ══════════════════════════════════════════════════════════════
-- PROFILES — extends auth.users with app-specific data
-- ══════════════════════════════════════════════════════════════
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  company text,
  job_title text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

-- Users read and update their own profile. Insert is handled by the
-- signup trigger below (security definer), so no insert policy needed.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- ══════════════════════════════════════════════════════════════
-- ENROLLMENTS — which user has access to which course
-- Writes are server-only (free enrollment validated, paid via Stripe).
-- ══════════════════════════════════════════════════════════════
create type public.enrollment_type as enum ('free', 'individual', 'subscription');

create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_slug text not null,                 -- references a Sanity course (no FK by design)
  enrollment_type public.enrollment_type not null default 'free',
  stripe_payment_id text,
  enrolled_at timestamptz default now() not null,
  expires_at timestamptz,                    -- null = lifetime; set for time-limited access
  active boolean default true not null,
  updated_at timestamptz default now() not null,

  unique(user_id, course_slug)
);

alter table public.enrollments enable row level security;

-- Read-only for users. No write policies → only service_role can write.
create policy "enrollments_select_own"
  on public.enrollments for select
  using (auth.uid() = user_id);

create index idx_enrollments_user on public.enrollments(user_id);
create index idx_enrollments_course on public.enrollments(course_slug);

-- ══════════════════════════════════════════════════════════════
-- LESSON PROGRESS — Fundae-compliant tracking
-- Server-authoritative: users cannot write (no tampering with hours/scores).
-- ══════════════════════════════════════════════════════════════
create table public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_slug text not null,
  lesson_slug text not null,
  started_at timestamptz default now() not null,
  completed_at timestamptz,
  time_spent_seconds integer default 0 not null,
  quiz_score integer,
  quiz_total integer,
  quiz_attempts integer default 0 not null,
  last_quiz_at timestamptz,
  updated_at timestamptz default now() not null,

  unique(user_id, course_slug, lesson_slug)
);

alter table public.lesson_progress enable row level security;

create policy "progress_select_own"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

create index idx_progress_user_course on public.lesson_progress(user_id, course_slug);

-- ══════════════════════════════════════════════════════════════
-- ACTIVITY LOG — Fundae audit trail (append-only, server-written)
-- ══════════════════════════════════════════════════════════════
create type public.activity_type as enum (
  'enrollment',
  'lesson_start',
  'lesson_complete',
  'quiz_attempt',
  'quiz_pass',
  'course_complete',
  'time_update'
);

create table public.activity_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  activity public.activity_type not null,
  course_slug text not null,
  lesson_slug text,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamptz default now() not null
);

alter table public.activity_log enable row level security;

create policy "activity_select_own"
  on public.activity_log for select
  using (auth.uid() = user_id);

create index idx_activity_user on public.activity_log(user_id);
create index idx_activity_user_course on public.activity_log(user_id, course_slug);
create index idx_activity_created on public.activity_log(created_at);

-- ══════════════════════════════════════════════════════════════
-- SUBSCRIPTIONS — Stripe all-access plan (written by webhook only)
-- ══════════════════════════════════════════════════════════════
create type public.subscription_status as enum (
  'active', 'canceled', 'past_due', 'trialing', 'incomplete'
);

create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  status public.subscription_status not null default 'active',
  plan text not null default 'monthly',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create index idx_subscriptions_user on public.subscriptions(user_id);

-- ══════════════════════════════════════════════════════════════
-- TRIGGERS & FUNCTIONS
-- All functions pin search_path to '' and fully-qualify names
-- (Supabase security best practice to prevent search_path hijacking).
-- ══════════════════════════════════════════════════════════════

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Generic updated_at maintainer
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger enrollments_updated_at
  before update on public.enrollments
  for each row execute function public.set_updated_at();

create trigger lesson_progress_updated_at
  before update on public.lesson_progress
  for each row execute function public.set_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Atomic time increment (called server-side per heartbeat)
create or replace function public.increment_time_spent(
  p_user_id uuid,
  p_course_slug text,
  p_lesson_slug text,
  p_seconds integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.lesson_progress
  set time_spent_seconds = time_spent_seconds + greatest(0, p_seconds)
  where user_id = p_user_id
    and course_slug = p_course_slug
    and lesson_slug = p_lesson_slug;
end;
$$;

-- Atomic quiz attempt increment + score update
create or replace function public.increment_quiz_attempts(
  p_user_id uuid,
  p_course_slug text,
  p_lesson_slug text,
  p_score integer,
  p_total integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.lesson_progress
  set
    quiz_attempts = quiz_attempts + 1,
    quiz_score = p_score,
    quiz_total = p_total,
    last_quiz_at = now()
  where user_id = p_user_id
    and course_slug = p_course_slug
    and lesson_slug = p_lesson_slug;
end;
$$;
