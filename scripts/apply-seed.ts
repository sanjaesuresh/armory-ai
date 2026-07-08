/**
 * Applies the full catalog to Supabase via the PostgREST bulk-upsert API,
 * bypassing the SQL Editor size limit (seed.sql is ~2MB / 266 rows).
 *
 * Idempotent: upsert on `id` (onConflict), additive — never deletes rows.
 * Uses the service-role key so it bypasses RLS. Run with:
 *   npx tsx --env-file=.env.local scripts/apply-seed.ts
 *
 * Reuses the exact same setup assembly as scripts/seed-from-curated.ts so the
 * API rows match what the generated seed.sql would insert.
 */

import { createClient } from '@supabase/supabase-js';
import type { Setup } from '../lib/setup/types';

import { marketingManagerSetup } from '../data/curated/marketing-manager';
import { claudeCodeToolkitSetup } from '../data/curated/claude-code-toolkit-setup';
import { codeReviewAgentSetup } from '../data/curated/code-review-agent';
import { debuggingAgentSetup } from '../data/curated/debugging-agent';
import { commitMessageSkillSetup } from '../data/curated/commit-message-skill';
import { prDescriptionSkillSetup } from '../data/curated/pr-description-skill';
import { tddLoopHarnessSetup } from '../data/curated/tdd-loop-harness';
import { docsWritingHarnessSetup } from '../data/curated/docs-writing-harness';
import { devExtraAgents } from '../data/curated/dev-extra-agents';
import { devExtraSkills } from '../data/curated/dev-extra-skills';
import { devExtraHarnesses } from '../data/curated/dev-extra-harnesses';
import { githubPicks } from '../data/community-picks/github-picks';
import { githubPicks2 } from '../data/community-picks/github-picks-2';
import { githubPicks3 } from '../data/community-picks/github-picks-3';
import { githubPicks4 } from '../data/community-picks/github-picks-4';
import { professionalPicks } from '../data/community-picks/professional-picks';
import { externalToolkits } from '../data/community-picks/external-toolkits';
import { toolkitItems } from '../data/member-posts/toolkit.generated';
import { aiGeneratedSetups } from '../data/ai-generated';
import { proSkills } from '../data/pro-skills';

const ALL_SETUPS: Setup[] = [
  marketingManagerSetup,
  claudeCodeToolkitSetup,
  codeReviewAgentSetup,
  debuggingAgentSetup,
  commitMessageSkillSetup,
  prDescriptionSkillSetup,
  tddLoopHarnessSetup,
  docsWritingHarnessSetup,
  ...devExtraAgents,
  ...devExtraSkills,
  ...devExtraHarnesses,
  ...githubPicks,
  ...githubPicks2,
  ...githubPicks3,
  ...githubPicks4,
  ...professionalPicks,
  ...externalToolkits,
  ...toolkitItems,
  ...aiGeneratedSetups,
  ...proSkills,
];

// camelCase Setup → snake_case DB columns (matches supabase/schema.sql)
function toRow(s: Setup) {
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    description: s.description,
    role: s.role,
    industry: s.industry,
    tags: s.tags,
    category: s.category,
    source: s.source,
    author: s.author,
    version: s.version,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
    review_status: s.reviewStatus,
    upvotes: s.upvotes,
    featured: s.featured,
    popularity: s.popularity ?? 0,
    targets: s.targets,
    tier: s.tier,
    instruction_template: s.instructionTemplate,
    variables: s.variables,
    knowledge_files: s.knowledgeFiles,
    scenarios: s.scenarios,
    kind: s.kind,
    artifact_files: s.artifactFiles,
    repo_url: s.repoUrl,
    capabilities: s.capabilities,
    github_stars: s.githubStars ?? null,
  };
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (run with --env-file=.env.local)');
  }

  const db = createClient(url, key, { auth: { persistSession: false } });

  // introspect the live table so we only send columns that actually exist —
  // the deployed schema may lag behind supabase/schema.sql (e.g. popularity).
  const { data: sample, error: sampleErr } = await db.from('setups').select('*').limit(1);
  if (sampleErr) throw new Error(`schema introspection failed: ${sampleErr.message}`);
  const liveCols = sample && sample.length > 0 ? new Set(Object.keys(sample[0])) : null;

  const rows = ALL_SETUPS.map(toRow).map((r) => {
    if (!liveCols) return r;
    const filtered: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(r)) if (liveCols.has(k)) filtered[k] = v;
    return filtered;
  });

  if (liveCols) {
    const dropped = Object.keys(toRow(ALL_SETUPS[0])).filter((k) => !liveCols.has(k));
    if (dropped.length) console.log(`live schema missing columns (skipped): ${dropped.join(', ')}`);
  }

  // guard against a duplicate id slipping through — upsert would silently merge
  const ids = new Set<string>();
  for (const s of ALL_SETUPS) {
    if (ids.has(s.id)) throw new Error(`duplicate id in payload: ${s.id}`);
    ids.add(s.id);
  }

  const BATCH = 50;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { error } = await db.from('setups').upsert(chunk, { onConflict: 'id' });
    if (error) {
      throw new Error(`batch ${i / BATCH + 1} failed: ${error.message} (${error.details ?? ''})`);
    }
    console.log(`upserted ${Math.min(i + BATCH, rows.length)}/${rows.length}`);
  }

  const { count, error: countErr } = await db
    .from('setups')
    .select('id', { count: 'exact', head: true });
  if (countErr) throw new Error(`count failed: ${countErr.message}`);

  const { count: approved } = await db
    .from('setups')
    .select('id', { count: 'exact', head: true })
    .eq('review_status', 'approved');

  console.log(`\nDone. Upserted ${rows.length} rows. Table now has ${count} total (${approved} approved).`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
