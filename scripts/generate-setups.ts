/**
 * AI setup generation operator script (Phase 6).
 *
 * Turns a list of briefs into candidate setups by calling the generation pipeline
 * (lib/generation/generateSetup.ts) for each brief. Each candidate runs through
 * the full quality gauntlet (validate → compile → own-scenario evals → safety screen)
 * before being inserted as a pending row for human review in the Phase 5 moderation queue.
 *
 * NO generated setup is ever auto-approved. review_status is always 'pending'.
 *
 * GATED: refuses to run without RUN_GENERATION=1 and ANTHROPIC_API_KEY.
 * NEVER run in CI — it spends real model credits.
 *
 * Usage:
 *   RUN_GENERATION=1 npx tsx --env-file=.env.local scripts/generate-setups.ts
 *
 * Optional env:
 *   RUN_GENERATION_BUDGET=<usd>  — per-batch USD budget (default: 0.50)
 */

import { randomUUID } from 'crypto';
import { generateSetupFromBrief, isWithinBudget, type GenerationOutcome } from '@/lib/generation/generateSetup';
import type { Brief } from '@/lib/generation/briefs';
import { createAnthropicModelClient } from '@/lib/testdrive/anthropicClient';
import { createSupabaseServiceClient } from '@/lib/supabase/serviceClient';

// ─── Gate ─────────────────────────────────────────────────────────────────────

function requireGate(): void {
  const problems: string[] = [];
  if (process.env.RUN_GENERATION !== '1') {
    problems.push('RUN_GENERATION is not set to "1" (this script spends real credits).');
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    problems.push('ANTHROPIC_API_KEY is not set.');
  }
  if (problems.length > 0) {
    console.error('Refusing to run the generation script:');
    for (const p of problems) console.error(`  - ${p}`);
    console.error('\nRun with:  RUN_GENERATION=1 npm run generate');
    process.exit(1);
  }
}

// ─── Slug helper ──────────────────────────────────────────────────────────────

/**
 * Converts a setup name to a URL-safe slug matching the validator's pattern.
 * Lowercases, collapses non-alphanumeric runs to a single hyphen, and trims
 * leading/trailing hyphens.
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Brief list ───────────────────────────────────────────────────────────────

/**
 * Fixed brief list for the initial run.
 *
 * In a full deployment this would be populated via selectBriefs() using the
 * catalog + demand analytics (Phase 6.2). For the first run, a small hardcoded
 * list avoids any external dependencies.
 *
 * Roles match ids in lib/catalog/roles.ts.
 */
const INITIAL_BRIEFS: Brief[] = [
  {
    kind: 'gap-fill',
    role: 'customer-support',
    industry: null,
    goalTags: ['customer-support'],
  },
  {
    kind: 'gap-fill',
    role: 'recruiter',
    industry: null,
    goalTags: ['hiring'],
  },
  {
    kind: 'gap-fill',
    role: 'small-business-owner',
    industry: null,
    goalTags: [],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  requireGate();

  const budgetUsd = parseFloat(process.env.RUN_GENERATION_BUDGET ?? '0.50');
  if (isNaN(budgetUsd) || budgetUsd <= 0) {
    console.error('Invalid RUN_GENERATION_BUDGET. Set to a positive USD amount (e.g. RUN_GENERATION_BUDGET=1.00).');
    process.exit(1);
  }

  const modelClient = createAnthropicModelClient();
  const supabase = createSupabaseServiceClient();
  const now = new Date().toISOString();

  /** Inserts a pending row into the setups table via the service role client. */
  const insertPendingSetup = async (row: Record<string, unknown>): Promise<void> => {
    const { error } = await supabase.from('setups').insert(row);
    if (error) throw new Error(`insert failed: ${error.message}`);
  };

  console.log('\nArmory — AI Setup Generation');
  console.log(`Batch budget: $${budgetUsd.toFixed(2)} USD`);
  console.log(`Briefs queued: ${INITIAL_BRIEFS.length}`);
  console.log('─'.repeat(60));

  const outcomes: GenerationOutcome[] = [];
  let totalSpend = 0;

  for (const brief of INITIAL_BRIEFS) {
    // Stop before starting a new brief when the budget is exhausted.
    if (!isWithinBudget(totalSpend, budgetUsd)) {
      const role = brief.role;
      const kind = brief.kind;
      console.log(`\nBudget $${budgetUsd.toFixed(2)} reached — stopping before: ${role} (${kind})`);
      break;
    }

    console.log(`\nGenerating: ${brief.role} [${brief.kind}]...`);

    const outcome = await generateSetupFromBrief(brief, {
      modelClient,
      insertPendingSetup,
      now,
      newId: () => randomUUID(),
      newSlug: slugify,
    });

    outcomes.push(outcome);
    totalSpend += outcome.spendUsd;

    const statusLabel = outcome.status === 'inserted'
      ? '✓  inserted-for-review'
      : '✗  discarded          ';
    const attemptLabel = `(${outcome.attempts} attempt${outcome.attempts === 1 ? '' : 's'})`;
    const costLabel = `$${outcome.spendUsd.toFixed(4)}`;
    const reasonSuffix = outcome.status === 'discarded' && outcome.reason
      ? ` — ${outcome.reason}`
      : '';
    console.log(`  ${statusLabel}  ${attemptLabel}  ${costLabel}${reasonSuffix}`);
  }

  const inserted = outcomes.filter((o) => o.status === 'inserted').length;
  const discarded = outcomes.filter((o) => o.status === 'discarded').length;

  console.log('\n' + '─'.repeat(60));
  console.log('Summary:');
  console.log(`  Inserted for review : ${inserted}`);
  console.log(`  Discarded           : ${discarded}`);
  console.log(`  Total spend         : $${totalSpend.toFixed(4)} / $${budgetUsd.toFixed(2)} budget`);

  if (inserted > 0) {
    console.log(`\n${inserted} setup${inserted === 1 ? ' is' : 's are'} pending review in the moderation queue.`);
  }
}

main().catch((err) => {
  console.error('Generation script crashed:', err);
  process.exit(1);
});
