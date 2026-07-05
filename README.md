# Armory

Pick a proven AI setup for your role, customize it with plain-language forms, test-drive it against real scenarios, and export a config bundle you paste into your own Claude or ChatGPT.

**We generate the setup. We don't host or run your agent.**

## Why

The bottleneck to useful AI isn't model quality — it's the setup. Most people have Claude or ChatGPT but never touch custom instructions, projects, or knowledge files, because the setup is too fiddly and full of jargon. Armory removes that friction: choose a ready-made setup for your role, answer a few plain-language questions, and walk away with something that works in your own AI tool.

Three pillars:

- **A library of setups** — reusable, role-based templates. When one person builds a great setup, it becomes reusable by everyone. Curated, AI-generated, and community-contributed setups all share one schema.
- **A recommender** — surfaces the handful of setups relevant to your role and tools, so you don't have to browse to find what fits.
- **Test-drive** — run a setup against built-in scenarios and see real output before you trust it.

## How it works

Pick your role → get recommendations → choose a setup → fill in a short form → the compiler produces the finished config → optionally test-drive it → export and paste it into your own Claude or ChatGPT.

The compiler (`setup + your answers → finished config`) is pure, deterministic, and inspectable. AI is used only at the edges: test-drives and generating new setup templates (which go through the same review gate as everything else).

## What's in the app

- **Catalog** — browse and filter curated, AI-generated, and community setups.
- **Customization forms** — schema-driven, no chatbox. File attachments stay in your browser; they never hit our servers.
- **Export targets** — the Claude app (Projects, with a free-plan fallback), ChatGPT, and Claude Code, each with a step-by-step install walkthrough.
- **Test-drive** — metered scenario runs against the live model, with rate limits, token caps, and a global budget.
- **Accounts** — save customized setups, test-drive history, and stored files (Supabase auth).
- **Community** — submit your own setups through the builder; everything passes a review-before-publish gate (structural validation, injection/safety screen, moderation) before it's listed. Upvotes and category browsing.
- **Developer hub** — a registry of agents, skills, and harnesses, with dashboards for developers and professionals.

## Stack

Next.js (App Router) + TypeScript + React. Supabase for database, auth, and file storage. API routes proxy the Anthropic API server-side — the model key never reaches the browser, and every model call is metered.

## Getting started

Prerequisites: Node 20+, a [Supabase](https://supabase.com) project, and an Anthropic API key (only needed for test-drive and AI-generation features).

1. Install dependencies:

   ```
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and fill it in. The main variables:

   | Variable | Purpose |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Server-side scripts and admin jobs |
   | `ANTHROPIC_API_KEY` | Test-drive and setup-generation model calls |
   | `NEXT_PUBLIC_SITE_URL` | Canonical site URL (sitemap, metadata) |
   | `TESTDRIVE_ENABLED` | Feature flag / kill switch for test-drive |
   | `TESTDRIVE_IP_SALT` | Salt for anonymized test-drive metering |

3. Apply the database schema and seed the curated setups — follow [`supabase/README.md`](supabase/README.md) (paste `supabase/schema.sql`, then `supabase/seed.sql` into the Supabase SQL editor). Regenerate the seed file any time the curated fixtures change:

   ```
   npm run seed
   ```

4. Run the dev server:

   ```
   npm run dev
   ```

## Testing

```
npm test        # unit tests (Vitest)
npm run e2e     # end-to-end tests (Playwright)
```

## Docs

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — the phased build order and what each phase proves.
- [`docs/design/`](docs/design/README.md) — the ten design sections (data model, export format, recommender, forms, test-drive, community, and more). The source of truth for behavior.
- [`docs/mock/`](docs/mock/README.md) — static HTML mocks; the visual source of truth for all UI.
- [`docs/plans/`](docs/plans/) — per-phase implementation plans.

## Status

Phases 1–8 of the [roadmap](docs/ROADMAP.md) are implemented: the curated core (browse → customize → export), test-drive, the scored recommender, accounts and saving, community submissions with the review gate, AI-generated setups behind the same gate, the Claude Code export target, and the developer hub. MCP/connector support (the rest of the advanced tier) is deferred.
