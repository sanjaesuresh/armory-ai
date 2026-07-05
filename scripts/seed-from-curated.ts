/**
 * Generates supabase/seed.sql from all curated setup fixtures.
 *
 * Run with:  npm run seed
 *   (which calls: npx tsx scripts/seed-from-curated.ts)
 *
 * The generated file uses ON CONFLICT (id) DO UPDATE so it is idempotent —
 * safe to re-run after schema changes without clearing the table first.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { marketingManagerSetup } from '../data/curated/marketing-manager';
import { codeReviewAgentSetup } from '../data/curated/code-review-agent';
import { debuggingAgentSetup } from '../data/curated/debugging-agent';
import { commitMessageSkillSetup } from '../data/curated/commit-message-skill';
import { prDescriptionSkillSetup } from '../data/curated/pr-description-skill';
import { tddLoopHarnessSetup } from '../data/curated/tdd-loop-harness';
import { docsWritingHarnessSetup } from '../data/curated/docs-writing-harness';
import { githubPicks } from '../data/community-picks/github-picks';
import { toolkitItems } from '../data/member-posts/toolkit.generated';
import type { Setup } from '../lib/setup/types';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// ─── Registry ────────────────────────────────────────────────────────────────
// Add new curated setups here. Import and list them in CURATED_SETUPS.

const CURATED_SETUPS: Setup[] = [
  marketingManagerSetup,
  codeReviewAgentSetup,
  debuggingAgentSetup,
  commitMessageSkillSetup,
  prDescriptionSkillSetup,
  tddLoopHarnessSetup,
  docsWritingHarnessSetup,
];

// All seed rows: curated first, then github community picks, then toolkit member-post items.
const ALL_SETUPS: Setup[] = [...CURATED_SETUPS, ...githubPicks, ...toolkitItems];

// ─── SQL helpers ─────────────────────────────────────────────────────────────

function sqlStr(value: string | null): string {
  if (value === null) return 'NULL';
  // Escape single quotes by doubling them; use E'' for safety
  return `E'${value.replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

function sqlInt(value: number | null): string {
  return value === null ? 'NULL' : String(value);
}

function sqlArray(values: string[]): string {
  const escaped = values.map((v) => `"${v.replace(/"/g, '\\"')}"`).join(',');
  return `'{${escaped}}'`;
}

function sqlJsonb(value: unknown): string {
  return sqlStr(JSON.stringify(value));
}

function toInsert(setup: Setup): string {
  return `INSERT INTO setups (
  id, slug, name, tagline, description, role, industry,
  tags, category, source, author, version,
  created_at, updated_at, review_status, upvotes, featured,
  targets, tier, instruction_template,
  variables, knowledge_files, scenarios,
  kind, artifact_files, repo_url, capabilities,
  github_stars
) VALUES (
  ${sqlStr(setup.id)},
  ${sqlStr(setup.slug)},
  ${sqlStr(setup.name)},
  ${sqlStr(setup.tagline)},
  ${sqlStr(setup.description)},
  ${sqlStr(setup.role)},
  ${sqlStr(setup.industry)},
  ${sqlArray(setup.tags)},
  ${sqlStr(setup.category)},
  ${sqlStr(setup.source)},
  ${sqlStr(setup.author)},
  ${sqlStr(setup.version)},
  ${sqlStr(setup.createdAt)},
  ${sqlStr(setup.updatedAt)},
  ${sqlStr(setup.reviewStatus)},
  ${sqlInt(setup.upvotes)},
  ${sqlInt(setup.featured)},
  ${sqlJsonb(setup.targets)},
  ${sqlStr(setup.tier)},
  ${sqlStr(setup.instructionTemplate)},
  ${sqlJsonb(setup.variables)},
  ${sqlJsonb(setup.knowledgeFiles)},
  ${sqlJsonb(setup.scenarios)},
  ${sqlStr(setup.kind)},
  ${sqlJsonb(setup.artifactFiles)},
  ${sqlStr(setup.repoUrl)},
  ${sqlJsonb(setup.capabilities)},
  ${sqlInt(setup.githubStars ?? null)}
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  role = EXCLUDED.role,
  industry = EXCLUDED.industry,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  source = EXCLUDED.source,
  author = EXCLUDED.author,
  version = EXCLUDED.version,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at,
  review_status = EXCLUDED.review_status,
  upvotes = EXCLUDED.upvotes,
  featured = EXCLUDED.featured,
  targets = EXCLUDED.targets,
  tier = EXCLUDED.tier,
  instruction_template = EXCLUDED.instruction_template,
  variables = EXCLUDED.variables,
  knowledge_files = EXCLUDED.knowledge_files,
  scenarios = EXCLUDED.scenarios,
  kind = EXCLUDED.kind,
  artifact_files = EXCLUDED.artifact_files,
  repo_url = EXCLUDED.repo_url,
  capabilities = EXCLUDED.capabilities,
  github_stars = EXCLUDED.github_stars;`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const nonApproved = ALL_SETUPS.filter((s) => s.reviewStatus !== 'approved');
if (nonApproved.length > 0) {
  console.warn(
    'WARNING: the following setups do not have reviewStatus="approved" and ' +
      'will NOT be visible to anonymous users via RLS:\n' +
      nonApproved.map((s) => `  ${s.slug} (reviewStatus="${s.reviewStatus}")`).join('\n'),
  );
}

const inserts = ALL_SETUPS.map(toInsert).join('\n\n');
const banner = `-- Armory: seed data generated from data/curated/, data/community-picks/, and data/member-posts/
-- Generated: ${new Date().toISOString()}
-- DO NOT EDIT by hand — run \`npm run seed\` to regenerate.
-- Apply in Supabase: Database → SQL Editor → paste and run.
`;

const output = `${banner}\n${inserts}\n`;
const outPath = path.resolve(__dirname, '../supabase/seed.sql');
fs.writeFileSync(outPath, output, 'utf8');
console.log(
  `Wrote ${CURATED_SETUPS.length} curated + ${githubPicks.length} github picks + ${toolkitItems.length} toolkit items = ${ALL_SETUPS.length} total setup(s) to ${outPath}`,
);
