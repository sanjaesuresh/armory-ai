-- Armory: setups table
-- Apply this in the Supabase SQL editor (Database → SQL Editor → New query).

create table if not exists setups (
  id                  text primary key,
  slug                text not null unique,
  name                text not null,
  tagline             text not null,
  description         text not null,
  role                text not null,
  industry            text,
  tags                text[] not null default '{}',
  category            text not null,
  source              text not null,
  author              text,
  version             text not null,
  created_at          timestamptz not null,
  updated_at          timestamptz not null,
  review_status       text not null,
  upvotes             integer not null default 0,
  featured            integer,
  targets             jsonb not null default '[]',
  tier                text not null,
  instruction_template text not null,
  variables           jsonb not null default '[]',
  knowledge_files     jsonb not null default '[]',
  scenarios           jsonb not null default '[]'
);

-- Row Level Security: anonymous users may SELECT approved setups only.
alter table setups enable row level security;

drop policy if exists "anonymous can read approved setups" on setups;

create policy "anonymous can read approved setups"
  on setups
  for select
  using (review_status = 'approved');

-- ─── export_events ────────────────────────────────────────────────────────────
-- Stores one row per anonymous export event (copy or done).
-- Only the four business fields are recorded; no user identifiers or content.

create table if not exists export_events (
  id          bigint primary key generated always as identity,
  setup_slug  text not null,
  target      text not null,
  branch      text,
  kind        text not null,
  created_at  timestamptz not null default now()
);

-- Check constraints (idempotent — safe to re-apply).
alter table export_events drop constraint if exists export_events_kind_check;
alter table export_events add constraint export_events_kind_check
  check (kind in ('copy', 'done'));

alter table export_events drop constraint if exists export_events_branch_check;
alter table export_events add constraint export_events_branch_check
  check (branch is null or branch in ('pro', 'free'));

alter table export_events drop constraint if exists export_events_setup_slug_length_check;
alter table export_events add constraint export_events_setup_slug_length_check
  check (char_length(setup_slug) <= 128);

alter table export_events drop constraint if exists export_events_target_length_check;
alter table export_events add constraint export_events_target_length_check
  check (char_length(target) <= 64);

-- RLS: anon key may INSERT; it may never SELECT.
-- Reads are only possible via the service key (which bypasses RLS).
alter table export_events enable row level security;

drop policy if exists "anon can insert export events" on export_events;

create policy "anon can insert export events"
  on export_events
  for insert
  to anon
  with check (true);

-- ─── runtime_config ───────────────────────────────────────────────────────────
-- Stores runtime configuration key-value pairs used by the feature-flag and
-- kill-switch mechanism.
--
-- Trust boundary: service-role only. The anon key has NO access (no RLS policy
-- for anon SELECT, INSERT, UPDATE, or DELETE). The server-side test-drive route
-- reads this table via SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS entirely.
-- This prevents any browser from reading or writing the kill-switch row.
--
-- Used by: lib/testdrive/flags.ts (key: 'testdrive.enabled', value: 'false' = off)

create table if not exists runtime_config (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

alter table runtime_config enable row level security;

-- No anon policies. Drop any previously created anon SELECT policy.
drop policy if exists "anon can read runtime config" on runtime_config;

-- Drop the now-redundant SECURITY DEFINER helper (service role writes directly).
drop function if exists testdrive_set_config(text, text);

-- ─── anon_tokens ──────────────────────────────────────────────────────────────
-- Stores one row per anonymous browser identity issued by the test-drive feature.
-- The token_id is an opaque 128-bit hex string (32 chars). No PII is stored.
--
-- Trust boundary: service-role only. No anon RLS policies. The server route
-- reads and writes this table using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
--
-- Used by: lib/testdrive/anonToken.ts

create table if not exists anon_tokens (
  token_id     text primary key check (char_length(token_id) = 32),
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

alter table anon_tokens enable row level security;

-- No anon policies. Drop any previously created SECURITY DEFINER helpers.
drop function if exists testdrive_create_anon_token(text, timestamptz);
drop function if exists testdrive_touch_anon_token(text, timestamptz);
drop function if exists testdrive_token_exists(text);

-- ─── testdrive_usage ──────────────────────────────────────────────────────────
-- Stores one row per completed (non-cached) test-drive run.
-- Raw IPs are never stored — only an HMAC-SHA-256 salted hash (ip_hash).
--
-- Trust boundary: service-role only. No anon RLS policies. The server route
-- reads and writes this table using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
--
-- Used by: lib/testdrive/meter.ts

create table if not exists testdrive_usage (
  id                  bigint primary key generated always as identity,
  token               text not null,
  ip_hash             text not null,
  input_tokens        integer not null check (input_tokens >= 0),
  output_tokens       integer not null check (output_tokens >= 0),
  estimated_cost_usd  numeric(10, 6) not null check (estimated_cost_usd >= 0),
  created_at          timestamptz not null default now()
);

create index if not exists testdrive_usage_token_created_at_idx
  on testdrive_usage (token, created_at);

create index if not exists testdrive_usage_ip_hash_created_at_idx
  on testdrive_usage (ip_hash, created_at);

create index if not exists testdrive_usage_created_at_idx
  on testdrive_usage (created_at);

alter table testdrive_usage enable row level security;

-- No anon policies. Drop the previously created SECURITY DEFINER helper.
drop function if exists testdrive_record_usage(text, text, integer, integer, numeric, timestamptz);

-- ─── testdrive_cache ──────────────────────────────────────────────────────────
-- Stores deterministic test-drive results keyed by a SHA-256 hash of all
-- inputs (compiled instruction, answers, setup id+version, scenario id, model
-- id, token caps). TTL is 30 days (enforced in application code).
-- Cache hits are free and do not decrement any meter.
--
-- Trust boundary: service-role only. No anon RLS policies. The server route
-- reads and writes this table using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
--
-- Used by: lib/testdrive/cache.ts

create table if not exists testdrive_cache (
  cache_key       text primary key,
  output          text not null,
  usage_snapshot  jsonb not null,
  created_at      timestamptz not null default now()
);

create index if not exists testdrive_cache_created_at_idx
  on testdrive_cache (created_at);

alter table testdrive_cache enable row level security;

-- No anon policies. Drop any previously created anon SELECT policy and
-- the SECURITY DEFINER write helper.
drop policy if exists "anon can read cache entries" on testdrive_cache;
drop function if exists testdrive_put_cache(text, text, jsonb, timestamptz);

-- ─── testdrive_meter_state ────────────────────────────────────────────────────
-- Tracks per-day budget-alert bookkeeping for the test-drive meter.
-- Keeps mutable per-run state out of the kill-switch runtime_config table so
-- that security-sensitive flag rows are never touched by per-run bookkeeping.
--
-- day_key: UTC midnight ISO string for the day (e.g. '2026-07-02T00:00:00.000Z').
-- alert_fired: true once the 80% budget alert has been emitted for that day.
--
-- Trust boundary: service-role only. No anon RLS policies.
--
-- Used by: lib/testdrive/meter.ts (hasAlertFiredToday / markAlertFiredToday)

create table if not exists testdrive_meter_state (
  day_key     text primary key,
  alert_fired boolean not null default false,
  updated_at  timestamptz not null default now()
);

alter table testdrive_meter_state enable row level security;

-- No anon policies — service-role only.
