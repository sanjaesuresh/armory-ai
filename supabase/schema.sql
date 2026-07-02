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
