/**
 * refresh-github-stars — fetch current stargazer counts from the GitHub REST
 * API and write them to setups.github_stars for all source='github' items.
 *
 * Usage:
 *   npm run github-stars        — run against the dev/prod DB
 *
 * Required env vars (live in .env.local — the npm script loads it via
 * the --env-file flag passed to tsx):
 *
 *   NEXT_PUBLIC_SUPABASE_URL     — your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY    — service-role key (bypasses RLS so we can
 *                                  update any row; the anon key cannot).
 *     IMPORTANT: this key is used ONLY in scripts. Never import or reference
 *     it in app code or any Next.js module — it must never reach the browser.
 *
 * Optional env var:
 *   GITHUB_TOKEN                 — a personal access token or fine-grained PAT.
 *                                  Without it, the GitHub API is rate-limited
 *                                  to 60 requests/hour per IP; with it, 5000/hour.
 *
 * What it does:
 *   1. Reads all setups where source = 'github' (these carry a repoUrl).
 *   2. For each item, derives owner/repo from the repoUrl.
 *   3. Fetches stargazers_count from https://api.github.com/repos/{owner}/{repo}.
 *   4. Updates setups.github_stars if the value changed.
 *   5. Logs each change so the diff is visible in CI output.
 *
 * The script is idempotent — running it multiple times on the same data
 * produces the same result (last writer wins, no incremental accumulation).
 */

import { createClient } from '@supabase/supabase-js';

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Derive "owner/repo" from a GitHub HTTPS URL.
 * Supports both https://github.com/owner/repo and
 * https://github.com/owner/repo/tree/... variants.
 * Returns null when the URL cannot be parsed as a GitHub repo URL.
 */
function ownerRepoFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== 'github.com') return null;
    const parts = u.pathname.replace(/^\//, '').split('/');
    if (parts.length < 2 || !parts[0] || !parts[1]) return null;
    return `${parts[0]}/${parts[1].replace(/\.git$/, '')}`;
  } catch {
    return null;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const supabase = createClient(supabaseUrl, serviceKey);
  const githubToken = process.env.GITHUB_TOKEN;

  console.log('\nArmory refresh-github-stars\n');

  // ── 1. Fetch all source='github' setups ────────────────────────────────────

  const { data: rows, error: fetchError } = await supabase
    .from('setups')
    .select('slug, repo_url, github_stars')
    .eq('source', 'github');

  if (fetchError) {
    console.error('ERROR fetching setups:', fetchError.message);
    process.exit(1);
  }

  const setups = (rows ?? []) as Array<{
    slug: string;
    repo_url: string | null;
    github_stars: number | null;
  }>;

  console.log(`Found ${setups.length} source='github' item(s).\n`);

  // ── 2–4. For each item, fetch stars and update if changed ─────────────────

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (githubToken) headers['Authorization'] = `Bearer ${githubToken}`;

  let changed = 0;
  let unchanged = 0;
  let skipped = 0;

  for (const setup of setups) {
    if (!setup.repo_url) {
      console.warn(`  SKIP ${setup.slug} — no repo_url`);
      skipped += 1;
      continue;
    }

    const ownerRepo = ownerRepoFromUrl(setup.repo_url);
    if (!ownerRepo) {
      console.warn(`  SKIP ${setup.slug} — cannot parse repo URL: ${setup.repo_url}`);
      skipped += 1;
      continue;
    }

    let newStars: number;
    try {
      const res = await fetch(`https://api.github.com/repos/${ownerRepo}`, { headers });
      if (!res.ok) {
        console.warn(`  SKIP ${setup.slug} — GitHub API ${res.status} for ${ownerRepo}`);
        skipped += 1;
        continue;
      }
      const data = (await res.json()) as { stargazers_count: number };
      newStars = data.stargazers_count;
    } catch (err) {
      console.warn(
        `  SKIP ${setup.slug} — fetch error for ${ownerRepo}:`,
        err instanceof Error ? err.message : String(err),
      );
      skipped += 1;
      continue;
    }

    const oldStars = setup.github_stars;

    if (newStars === oldStars) {
      unchanged += 1;
      continue;
    }

    const { error: updateError } = await supabase
      .from('setups')
      .update({ github_stars: newStars })
      .eq('slug', setup.slug);

    if (updateError) {
      console.error(
        `  ERROR updating github_stars for "${setup.slug}":`,
        updateError.message,
      );
      // Continue to attempt remaining rows.
      continue;
    }

    const oldLabel = oldStars === null ? 'null' : String(oldStars);
    console.log(
      `  ${setup.slug.padEnd(40)} ${oldLabel.padStart(8)} → ${String(newStars).padStart(8)}`,
    );
    changed += 1;
  }

  // ── 5. Summary ──────────────────────────────────────────────────────────────

  console.log(
    `\nDone. ${changed} updated, ${unchanged} unchanged, ${skipped} skipped, ${setups.length} total.\n`,
  );
}

main().catch((err: unknown) => {
  console.error('ERROR:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
