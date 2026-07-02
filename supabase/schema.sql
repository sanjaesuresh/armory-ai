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
