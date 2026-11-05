-- ══════════════════════════════════════════════════════════════
-- 005 — Guided practice calls
--
-- guided: the learner turned on "modo guiado" (on-screen suggestions of
-- what to say). Dashboards must tell guided calls from free ones.
-- hints_used: suggestion rounds served during the call (cost guard and
-- a signal of how much help the learner still needs).
--
-- INCREMENTAL and non-destructive; safe to re-run.
-- ══════════════════════════════════════════════════════════════

alter table public.practice_sessions
  add column if not exists guided boolean not null default false,
  add column if not exists hints_used integer not null default 0;
