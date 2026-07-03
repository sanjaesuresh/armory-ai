/**
 * refresh-popularity — recompute popularity scores and write them to setups.
 *
 * Usage:
 *   npm run popularity        — run against the dev/prod DB
 *
 * Required env vars (both live in .env.local — the npm script loads it via
 * the --env-file flag passed to tsx):
 *
 *   NEXT_PUBLIC_SUPABASE_URL     — your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY    — service-role key (bypasses RLS so we can
 *                                  read export_events; the anon key cannot).
 *     IMPORTANT: this key is used ONLY in scripts. Never import or reference
 *     it in app code or any Next.js module — it must never reach the browser.
 *
 * Schedule: run nightly (e.g. a daily CI cron or a scheduled Supabase Edge
 * Function). Manual invocation is acceptable until a scheduler exists.
 * The script is idempotent — running it multiple times on the same data
 * produces the same result.
 *
 * What it does:
 *   1. Reads all export_events rows from the trailing 30-day window.
 *   2. Computes per-slug popularity counts with the pure aggregation from
 *      lib/catalog/popularity.ts (only 'done'-kind events are counted).
 *   3. Reads all setup slugs from the setups table.
 *   4. For each setup, upserts the popularity column (0 for no events).
 *   5. Logs every change so the diff is visible in CI output.
 *
 * Phase 5 note: when upvotes land, add their per-slug count as a second term
 * to the same Map before writing, following the extension point in
 * lib/catalog/popularity.ts's JSDoc.
 */

import { createClient } from '@supabase/supabase-js';
import { computePopularity, type PopularityEventRow } from '../lib/catalog/popularity';

// ─── Guard: require service key before doing anything else ───────────────────

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

if (!serviceKey) {
  console.error(
    'ERROR: SUPABASE_SERVICE_ROLE_KEY is not set.\n' +
      'Add it to .env.local (see .env.local.example) or export it in your shell.\n' +
      'This key is only used by scripts — never in app or browser code.',
  );
  process.exit(1);
}

if (!supabaseUrl) {
  console.error(
    'ERROR: NEXT_PUBLIC_SUPABASE_URL is not set.\n' +
      'Add it to .env.local (see .env.local.example).',
  );
  process.exit(1);
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WINDOW_DAYS = 30;

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const supabase = createClient(supabaseUrl, serviceKey);
  const now = new Date();
  const since = new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();

  console.log(
    `\nArmory refresh-popularity — trailing ${WINDOW_DAYS} days (since ${since.slice(0, 10)} UTC)\n`,
  );

  // ── 1. Fetch export events ──────────────────────────────────────────────────

  const { data: events, error: eventsError } = await supabase
    .from('export_events')
    .select('setup_slug, kind, created_at')
    .gte('created_at', since);

  if (eventsError) {
    console.error('ERROR fetching export_events:', eventsError.message);
    process.exit(1);
  }

  // ── 2. Fetch all setup slugs ────────────────────────────────────────────────

  const { data: setupRows, error: setupsError } = await supabase
    .from('setups')
    .select('slug, popularity');

  if (setupsError) {
    console.error('ERROR fetching setups:', setupsError.message);
    process.exit(1);
  }

  const allSlugs: string[] = (setupRows ?? []).map((r: { slug: string }) => r.slug);
  const currentBySlug = new Map<string, number>(
    (setupRows ?? []).map((r: { slug: string; popularity: number | null }) => [
      r.slug,
      r.popularity ?? 0,
    ]),
  );

  // ── 3. Compute popularity ───────────────────────────────────────────────────

  const counts = computePopularity(
    (events ?? []) as PopularityEventRow[],
    now,
    allSlugs,
  );

  // ── 4. Write changed values ─────────────────────────────────────────────────

  let changed = 0;
  let unchanged = 0;

  for (const slug of allSlugs) {
    const newCount = counts.get(slug) ?? 0;
    const oldCount = currentBySlug.get(slug) ?? 0;

    if (newCount === oldCount) {
      unchanged += 1;
      continue;
    }

    const { error: updateError } = await supabase
      .from('setups')
      .update({ popularity: newCount })
      .eq('slug', slug);

    if (updateError) {
      console.error(`ERROR updating popularity for "${slug}":`, updateError.message);
      // Continue to attempt remaining slugs.
      continue;
    }

    console.log(`  ${slug.padEnd(40)} ${String(oldCount).padStart(4)} → ${String(newCount).padStart(4)}`);
    changed += 1;
  }

  // ── 5. Summary ──────────────────────────────────────────────────────────────

  console.log(
    `\nDone. ${changed} setup(s) updated, ${unchanged} unchanged, ${allSlugs.length} total.\n`,
  );
}

main().catch((err: unknown) => {
  console.error('ERROR:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
