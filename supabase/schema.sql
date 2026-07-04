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
  -- Nightly-refreshed count of 'done' export events in the trailing 30 days.
  -- Written by scripts/refresh-popularity.ts. Existing rows default to 0.
  popularity          integer not null default 0,
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

-- ─── Phase 4: accounts & saving ───────────────────────────────────────────────
--
-- Local test setup (RLS integration tests in tests/rls.test.ts):
--   supabase start
--   supabase db reset            # applies migrations/schema + seed
--   (or apply this file to the local db, then create two test users via the
--    service-role admin API — see the header of tests/rls.test.ts)
--
-- Every table below is owner-scoped under RLS from creation: policies are
-- TO authenticated with an (select auth.uid()) = user_id ownership predicate;
-- UPDATE carries both USING and WITH CHECK so a row cannot be reassigned to
-- another user. No SECURITY DEFINER, no user_metadata in policies.

-- ─── saved_setups ─────────────────────────────────────────────────────────────
-- A signed-in user's saved customization: the setup id + version and exactly the
-- answers they entered, under a user-given name. Owner-only.

create table if not exists saved_setups (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  setup_id      text not null,
  setup_version text not null,
  name          text not null,
  answers       jsonb not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists saved_setups_user_id_idx on saved_setups (user_id);

alter table saved_setups enable row level security;

drop policy if exists "owner reads own saved setups" on saved_setups;
create policy "owner reads own saved setups"
  on saved_setups for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "owner inserts own saved setups" on saved_setups;
create policy "owner inserts own saved setups"
  on saved_setups for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "owner updates own saved setups" on saved_setups;
create policy "owner updates own saved setups"
  on saved_setups for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "owner deletes own saved setups" on saved_setups;
create policy "owner deletes own saved setups"
  on saved_setups for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ─── stored_files ─────────────────────────────────────────────────────────────
-- Metadata for a signed-in user's opt-in stored knowledge files (Task 5). The
-- bytes live in Supabase Storage under a per-user path; this row is the index.
-- Owner-only.

create table if not exists stored_files (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  knowledge_file_name text not null,
  storage_path        text not null,
  size_bytes          integer,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists stored_files_user_id_idx on stored_files (user_id);

-- One metadata row per (user, knowledge-file name) so opting in again REPLACES
-- the prior copy (the store upserts on this key).
create unique index if not exists stored_files_user_name_key
  on stored_files (user_id, knowledge_file_name);

alter table stored_files enable row level security;

drop policy if exists "owner reads own stored files" on stored_files;
create policy "owner reads own stored files"
  on stored_files for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "owner inserts own stored files" on stored_files;
create policy "owner inserts own stored files"
  on stored_files for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "owner updates own stored files" on stored_files;
create policy "owner updates own stored files"
  on stored_files for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "owner deletes own stored files" on stored_files;
create policy "owner deletes own stored files"
  on stored_files for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ─── testdrive_usage: add user_id (for the Task 4 anon → user merge) ──────────
-- Nullable: anonymous runs keep user_id null; on first sign-in a browser's rows
-- adopt the user id (idempotent merge). The existing anonymous-insert path is
-- unchanged — no anon policy is added or removed here. A signed-in user may read
-- only their own linked rows.

alter table testdrive_usage
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists testdrive_usage_user_id_idx on testdrive_usage (user_id);

drop policy if exists "owner reads own usage" on testdrive_usage;
create policy "owner reads own usage"
  on testdrive_usage for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ─── testdrive_runs ───────────────────────────────────────────────────────────
-- Signed-in test-drive history (Task 4). One row per signed-in run — cached or
-- live — recording what the user needs to review it: the setup + scenario, a
-- truncated output snippet, and the cached flag. Kept separate from
-- testdrive_usage on purpose: that table is the cost/quota ledger (non-cached
-- runs only, no content), while this one is the display log (all runs, includes
-- a snippet). Anonymous runs write no history row.
--
-- Trust boundary: the server route inserts here with the service-role key (which
-- bypasses RLS) setting the correct user_id. Reads are owner-only under RLS via
-- the user's own session. No anon access.

create table if not exists testdrive_runs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  setup_slug     text not null,
  setup_name     text not null,
  scenario_id    text not null,
  scenario_title text not null,
  output_snippet text not null,
  cached         boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists testdrive_runs_user_created_idx
  on testdrive_runs (user_id, created_at desc);

alter table testdrive_runs enable row level security;

drop policy if exists "owner reads own runs" on testdrive_runs;
create policy "owner reads own runs"
  on testdrive_runs for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "owner inserts own runs" on testdrive_runs;
create policy "owner inserts own runs"
  on testdrive_runs for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "owner deletes own runs" on testdrive_runs;
create policy "owner deletes own runs"
  on testdrive_runs for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ─── Storage: user-files bucket (Task 5) ──────────────────────────────────────
-- Private bucket holding opt-in account-stored knowledge files. Objects live at
-- `${user_id}/${filename}`; the first path segment is the RLS ownership key, so
-- a user can only read/write/delete objects inside their own folder. Nothing is
-- public; the anon role has no access.

insert into storage.buckets (id, name, public)
  values ('user-files', 'user-files', false)
  on conflict (id) do nothing;

drop policy if exists "own files read" on storage.objects;
create policy "own files read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "own files insert" on storage.objects;
create policy "own files insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "own files update" on storage.objects;
create policy "own files update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "own files delete" on storage.objects;
create policy "own files delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- ══════════════════════════════════════════════════════════════════════════════
-- Phase 5: community (authoring, review gate, moderation, upvotes)
-- ══════════════════════════════════════════════════════════════════════════════
--
-- One schema: a community submission is just a setups row with source='community'
-- and author = the author's auth uid (as text). Lifecycle lives on review_status
-- (draft → pending → approved | rejected). No auto-publish: authors can move
-- their own rows only within {draft, pending}; approved/rejected are set only by
-- moderators through the service role after an allowlist check. Public reads stay
-- approved-only (the Phase 1 policy is unchanged).

-- Operational column: the stored safety-screen result for a submission (null for
-- curated rows). Not a content field — the "one schema" constraint is about
-- content, and this is lifecycle bookkeeping like review_status/upvotes.
alter table setups add column if not exists safety_screen jsonb;

-- ─── setups: author lifecycle RLS ─────────────────────────────────────────────
-- The existing "anonymous can read approved setups" SELECT policy stays. These
-- add authenticated authors' own-row access without widening the public surface.

-- Authors read their OWN rows in any status (so drafts/pending/rejected show on
-- their submissions page); everyone still reads approved via the anon policy.
drop policy if exists "authors read own setups" on setups;
create policy "authors read own setups"
  on setups for select
  to authenticated
  using (author = (select auth.uid())::text);

-- Authors create only their own community drafts (author + source + status fixed).
drop policy if exists "authors insert own community drafts" on setups;
create policy "authors insert own community drafts"
  on setups for insert
  to authenticated
  with check (
    author = (select auth.uid())::text
    and source = 'community'
    and review_status = 'draft'
  );

-- Authors edit/submit/withdraw only their own rows, and only within {draft,
-- pending} — so they can never set approved/rejected, and never touch an
-- approved row. The content-lock (no edits while pending) is enforced in the
-- app/data-access layer: /build/[id] redirects away for non-draft rows, and
-- updateDraftFields() scopes content writes to review_status='draft'.
drop policy if exists "authors update own non-approved setups" on setups;
create policy "authors update own non-approved setups"
  on setups for update
  to authenticated
  -- USING allows acting on any non-approved row (incl. rejected, so the author
  -- can reopen it → draft). WITH CHECK forbids the resulting row from being
  -- approved OR rejected, so an author can only ever land a row in draft/pending
  -- (submit, withdraw, reopen) — never self-approve and never keep it rejected.
  using (author = (select auth.uid())::text and review_status in ('draft', 'pending', 'rejected'))
  with check (author = (select auth.uid())::text and review_status in ('draft', 'pending'));

-- Authors delete only their own non-approved rows.
drop policy if exists "authors delete own non-approved setups" on setups;
create policy "authors delete own non-approved setups"
  on setups for delete
  to authenticated
  using (author = (select auth.uid())::text and review_status <> 'approved');

-- ─── moderators ───────────────────────────────────────────────────────────────
-- Allowlist of moderator user ids. Membership is checked server-side before any
-- moderation action (which then runs via the service role). No self-service:
-- only the service role writes this table.

create table if not exists moderators (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  added_at    timestamptz not null default now()
);

alter table moderators enable row level security;
-- No anon/authenticated policies — readable/writable only via the service role.

-- ─── upvotes ──────────────────────────────────────────────────────────────────
-- One row per (user, setup); the unique pair is the source of truth. The
-- denormalized count lives in setups.upvotes, refreshed by the popularity job.

create table if not exists upvotes (
  user_id     uuid not null references auth.users(id) on delete cascade,
  setup_id    text not null references setups(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, setup_id)
);

create index if not exists upvotes_setup_idx on upvotes (setup_id);

alter table upvotes enable row level security;

-- A signed-in user manages only their own upvote rows.
drop policy if exists "owner reads own upvotes" on upvotes;
create policy "owner reads own upvotes"
  on upvotes for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "owner inserts own upvotes" on upvotes;
create policy "owner inserts own upvotes"
  on upvotes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "owner deletes own upvotes" on upvotes;
create policy "owner deletes own upvotes"
  on upvotes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ─── reports ──────────────────────────────────────────────────────────────────
-- A signed-in user reports an approved setup. The unique (reporter, setup) pair
-- rate-limits to one report per user per setup. Moderators read via the service
-- role; reporters never read others' reports.

create table if not exists reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references auth.users(id) on delete cascade,
  setup_id     text not null references setups(id) on delete cascade,
  reason       text not null,
  note         text,
  created_at   timestamptz not null default now(),
  unique (reporter_id, setup_id)
);

create index if not exists reports_setup_idx on reports (setup_id);

alter table reports enable row level security;

drop policy if exists "reporter inserts own reports" on reports;
create policy "reporter inserts own reports"
  on reports for insert
  to authenticated
  with check ((select auth.uid()) = reporter_id);

drop policy if exists "reporter reads own reports" on reports;
create policy "reporter reads own reports"
  on reports for select
  to authenticated
  using ((select auth.uid()) = reporter_id);

-- ─── review_audit ─────────────────────────────────────────────────────────────
-- One row per moderation action (approve / reject / takedown): who, what
-- transition, the note, when. Written only by the service role; no client reads.

create table if not exists review_audit (
  id            uuid primary key default gen_random_uuid(),
  setup_id      text not null,
  moderator_id  uuid not null,
  action        text not null check (action in ('approve', 'reject', 'takedown')),
  from_status   text not null,
  to_status     text not null,
  note          text,
  created_at    timestamptz not null default now()
);

create index if not exists review_audit_setup_idx on review_audit (setup_id, created_at desc);

alter table review_audit enable row level security;
-- No client policies — service-role only.

-- ─── Moderation note + report reasons + upvote-count trigger ───────────────────

-- The moderator's rejection / takedown note, shown to the author verbatim.
-- Cleared when the author reopens or resubmits (see lib/community/drafts.ts) and
-- when a setup is approved.
alter table setups add column if not exists review_note text;

-- Reports carry one of a closed set of reason categories.
alter table reports drop constraint if exists reports_reason_check;
alter table reports add constraint reports_reason_check
  check (reason in ('spam', 'harmful', 'broken', 'impersonation', 'other'));

-- Keep setups.upvotes in sync with the upvotes rows. SECURITY DEFINER so the
-- count write bypasses RLS (a user upvoting a setup they don't own must still
-- update its denormalized count).
create or replace function sync_setup_upvotes() returns trigger
  language plpgsql security definer set search_path = public as $$
declare
  target text := coalesce(new.setup_id, old.setup_id);
begin
  update setups
    set upvotes = (select count(*) from upvotes where setup_id = target)
    where id = target;
  return null;
end;
$$;

drop trigger if exists upvotes_count_sync on upvotes;
create trigger upvotes_count_sync
  after insert or delete on upvotes
  for each row execute function sync_setup_upvotes();
