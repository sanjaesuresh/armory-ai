/**
 * export-report — aggregate readout of export_events from Supabase.
 *
 * Usage:
 *   npm run report           — trailing 30 days (default)
 *   npm run report -- 7      — trailing 7 days
 *   npm run report -- 90     — trailing 90 days
 *
 * Required env vars (both live in .env.local — the npm script loads it via
 * --env-file flag passed to tsx):
 *
 *   NEXT_PUBLIC_SUPABASE_URL     — your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY    — service-role key (bypasses RLS so we can
 *                                  read export_events; the anon key cannot).
 *     IMPORTANT: this key is used ONLY in scripts. Never import or reference
 *     it in app code or any Next.js module — it must never reach the browser.
 *
 * Schedule expectation: run ad-hoc or on a weekly CI cron to monitor which
 * setups are worth iterating on. Output is plain text, suitable for stdout
 * capture or piping to a file.
 */

import { createClient } from '@supabase/supabase-js';
import { summarizeExportEvents } from '../lib/analytics/summarize';
import type { ExportEventRow } from '../lib/analytics/summarize';

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

// ─── Day-window argument ─────────────────────────────────────────────────────

const dayArg = process.argv[2];
const days = dayArg !== undefined ? parseInt(dayArg, 10) : 30;

if (isNaN(days) || days < 1) {
  console.error(
    `ERROR: invalid day window "${dayArg}". Pass a positive integer (e.g. 7, 30, 90).`,
  );
  process.exit(1);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const supabase = createClient(supabaseUrl, serviceKey);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('export_events')
    .select('id, setup_slug, target, branch, kind, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('ERROR fetching export_events:', error.message);
    process.exit(1);
  }

  const summaries = summarizeExportEvents((data ?? []) as ExportEventRow[]);

  const sinceDateStr = since.slice(0, 10);
  console.log(`\nArmory export report — trailing ${days} day(s) (since ${sinceDateStr} UTC)\n`);

  if (summaries.length === 0) {
    console.log('  No export events in this window.');
    return;
  }

  // Sort: most-done first, then most-copied
  const sorted = summaries.sort((a, b) => b.dones - a.dones || b.copies - a.copies);

  const COL_SLUG = 32;
  const header =
    'Setup slug'.padEnd(COL_SLUG) +
    '  ' +
    'Copies'.padStart(6) +
    '  ' +
    'Dones'.padStart(5) +
    '  Branch (pro/free/unk)  Active days';
  console.log(header);
  console.log('─'.repeat(header.length));

  for (const s of sorted) {
    // Note: free-plan users complete inline on the export page and never reach
    // /install, so `free` dones read ~0 by design — dones measure pro-walkthrough completions.
    const branchStr =
      String(s.doneByBranch.pro).padStart(3) +
      ' / ' +
      String(s.doneByBranch.free).padStart(3) +
      ' / ' +
      String(s.doneByBranch.unknown).padStart(3);
    const activeDays = Object.keys(s.daysSeries).length;

    console.log(
      s.slug.slice(0, COL_SLUG).padEnd(COL_SLUG) +
        '  ' +
        String(s.copies).padStart(6) +
        '  ' +
        String(s.dones).padStart(5) +
        '  ' +
        branchStr.padEnd(21) +
        '  ' +
        String(activeDays),
    );

    // Per-UTC-day breakdown (indented)
    for (const [day, count] of Object.entries(s.daysSeries).sort()) {
      console.log(`    ${day}  ${String(count).padStart(4)} events`);
    }
  }

  console.log();
}

main().catch((err: unknown) => {
  console.error('ERROR:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
