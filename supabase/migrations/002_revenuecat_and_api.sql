-- ══════════════════════════════════════════════════════════════
-- 002 — RevenueCat (in-app purchases) + API/webhook hardening
--
-- The original schema assumed Stripe only. The mobile app sells through
-- the App Store / Play Store via RevenueCat, so entitlements can now
-- arrive from three places: Stripe (web), App Store, Play Store.
--
-- This migration is INCREMENTAL and non-destructive: it only adds
-- columns/tables and is safe to re-run.
--
-- ⚠️  If the Supabase SQL editor complains about "ALTER TYPE ... ADD VALUE
--     cannot run inside a transaction block", run the STEP 1 block on its
--     own first, then the rest of the file.
-- ══════════════════════════════════════════════════════════════

-- ── STEP 1: new subscription states that the stores can produce ──
alter type public.subscription_status add value if not exists 'expired';
alter type public.subscription_status add value if not exists 'paused';
alter type public.subscription_status add value if not exists 'in_grace_period';

-- ── STEP 2: everything else ──

-- ══════════════════════════════════════════════════════════════
-- SUBSCRIPTIONS — now provider-agnostic
-- ══════════════════════════════════════════════════════════════
alter table public.subscriptions
  add column if not exists provider text not null default 'stripe',
  add column if not exists store text,
  add column if not exists rc_app_user_id text,
  add column if not exists product_id text,
  add column if not exists entitlement text,
  add column if not exists original_transaction_id text,
  add column if not exists environment text not null default 'production',
  add column if not exists will_renew boolean default true not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'subscriptions_provider_check'
  ) then
    alter table public.subscriptions
      add constraint subscriptions_provider_check
      check (provider in ('stripe', 'revenuecat'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'subscriptions_store_check'
  ) then
    alter table public.subscriptions
      add constraint subscriptions_store_check
      check (store is null or store in (
        'app_store', 'play_store', 'mac_app_store', 'amazon', 'stripe', 'promotional'
      ));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'subscriptions_environment_check'
  ) then
    alter table public.subscriptions
      add constraint subscriptions_environment_check
      check (environment in ('production', 'sandbox'));
  end if;
end $$;

-- RevenueCat identifies the user by app_user_id; we set it to the Supabase
-- user UUID via Purchases.logIn(), so this is a fast reverse lookup.
create index if not exists idx_subscriptions_rc_app_user
  on public.subscriptions(rc_app_user_id);

-- ══════════════════════════════════════════════════════════════
-- ENROLLMENTS — a single course can also be bought as a one-off IAP
-- ══════════════════════════════════════════════════════════════
alter table public.enrollments
  add column if not exists provider text not null default 'internal',
  add column if not exists store text,
  add column if not exists product_id text,
  add column if not exists store_transaction_id text,
  add column if not exists environment text not null default 'production';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'enrollments_provider_check'
  ) then
    alter table public.enrollments
      add constraint enrollments_provider_check
      check (provider in ('internal', 'stripe', 'revenuecat'));
  end if;
end $$;

-- ══════════════════════════════════════════════════════════════
-- WEBHOOK EVENTS — idempotency ledger
--
-- RevenueCat retries a webhook until it gets a 2xx, so the same event can
-- arrive several times. We record every event id and ignore duplicates.
-- Also doubles as an audit trail for billing disputes.
-- ══════════════════════════════════════════════════════════════
create table if not exists public.webhook_events (
  id uuid default gen_random_uuid() primary key,
  provider text not null,
  event_id text not null,
  event_type text,
  app_user_id text,
  user_id uuid references public.profiles(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz default now() not null,

  unique(provider, event_id)
);

alter table public.webhook_events enable row level security;
-- No policies at all: this table is service-role only (not even readable
-- by the owner — it can contain store/billing internals).

create index if not exists idx_webhook_events_user on public.webhook_events(user_id);
create index if not exists idx_webhook_events_created on public.webhook_events(processed_at);

-- ══════════════════════════════════════════════════════════════
-- Helper: upsert an entitlement coming from RevenueCat
--
-- Keeps the "one subscription row per user" invariant while letting the
-- webhook write whatever the store reported.
-- ══════════════════════════════════════════════════════════════
create or replace function public.upsert_rc_subscription(
  p_user_id uuid,
  p_status public.subscription_status,
  p_store text,
  p_product_id text,
  p_entitlement text,
  p_app_user_id text,
  p_original_transaction_id text,
  p_period_start timestamptz,
  p_period_end timestamptz,
  p_will_renew boolean,
  p_environment text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.subscriptions (
    user_id, provider, status, store, product_id, entitlement,
    rc_app_user_id, original_transaction_id,
    current_period_start, current_period_end, will_renew, environment, plan
  )
  values (
    p_user_id, 'revenuecat', p_status, p_store, p_product_id, p_entitlement,
    p_app_user_id, p_original_transaction_id,
    p_period_start, p_period_end, coalesce(p_will_renew, true),
    coalesce(p_environment, 'production'), coalesce(p_product_id, 'mobile')
  )
  on conflict (user_id) do update set
    provider                = 'revenuecat',
    status                  = excluded.status,
    store                   = excluded.store,
    product_id              = excluded.product_id,
    entitlement             = excluded.entitlement,
    rc_app_user_id          = excluded.rc_app_user_id,
    original_transaction_id = excluded.original_transaction_id,
    current_period_start    = excluded.current_period_start,
    current_period_end      = excluded.current_period_end,
    will_renew              = excluded.will_renew,
    environment             = excluded.environment;
end;
$$;
