/**
 * Setups-as-evals drift check (Phase 2, Task 8).
 *
 * Compiles each curated setup with its defaults, runs every scenario against
 * the REAL Anthropic API through the test-drive runner internals, checks each
 * output against the scenario's mustContain / mustNotContain assertions, prints
 * per-setup pass/fail and per-run + total cost, and exits nonzero on any failure.
 *
 * This is the live acceptance test for curated setups — the same scenarios that
 * power the in-app test-drive double as evals here (Section 9).
 *
 * SCHEDULE: manual / weekly, NEVER in CI. It spends real model credits.
 *
 * GATED: refuses to run unless RUN_EVAL=1 and ANTHROPIC_API_KEY are both set.
 *   Run with:  RUN_EVAL=1 npm run eval
 *   (npm run eval loads .env.local via --env-file, same as npm run report.)
 *
 * Runs through the runner with permissive stubs (flag on, meter always allows,
 * cache always misses) and the shared Anthropic adapter, so the compile +
 * system-prompt + model-call path is byte-identical to the production route.
 */

import { runTestDrive, type RunnerDeps } from '@/lib/testdrive/runner';
import type { FlagChecker } from '@/lib/testdrive/flags';
import type { MeterDataSource } from '@/lib/testdrive/meter';
import type { CacheDataSource } from '@/lib/testdrive/cache';
import type { CatalogDataSource } from '@/lib/catalog/repository';
import { createAnthropicModelClient } from '@/lib/testdrive/anthropicClient';
import { checkScenario } from '@/lib/testdrive/assertions';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import type { Setup, Answers } from '@/lib/setup/types';

// Keep this list in sync with CURATED_SETUPS in scripts/seed-from-curated.ts.
const CURATED_SETUPS: Setup[] = [marketingManagerSetup];

// ─── Gate ─────────────────────────────────────────────────────────────────────

function requireGate(): void {
  const problems: string[] = [];
  if (process.env.RUN_EVAL !== '1') {
    problems.push('RUN_EVAL is not set to "1" (this script spends real credits).');
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    problems.push('ANTHROPIC_API_KEY is not set.');
  }
  if (problems.length > 0) {
    console.error('Refusing to run the eval harness:');
    for (const p of problems) console.error(`  - ${p}`);
    console.error('\nRun with:  RUN_EVAL=1 npm run eval');
    process.exit(1);
  }
}

// ─── Default answers ────────────────────────────────────────────────────────

/**
 * Builds the "defaults" answer set for a setup: each variable's declared default,
 * with a type-appropriate placeholder for any required variable that has none
 * (so compilation always succeeds).
 */
function deriveDefaults(setup: Setup): Answers {
  const answers: Answers = {};
  for (const v of setup.variables) {
    if (v.default !== undefined) {
      answers[v.key] = v.default as Answers[string];
      continue;
    }
    if (!v.required) continue;
    switch (v.type) {
      case 'select':
        answers[v.key] = (v.options?.[0] ?? 'Option A') as Answers[string];
        break;
      case 'multiselect':
        answers[v.key] = (v.options ? [v.options[0]] : []) as Answers[string];
        break;
      case 'boolean':
        answers[v.key] = false as Answers[string];
        break;
      case 'number':
        answers[v.key] = 0 as Answers[string];
        break;
      default:
        answers[v.key] = 'Acme' as Answers[string];
    }
  }
  return answers;
}

// ─── Permissive stubs (bypass metering; never cache) ─────────────────────────

const flagChecker: FlagChecker = { isTestDriveEnabled: async () => true };

const meterDataSource: MeterDataSource = {
  countTokenRunsToday: async () => 0,
  countIpRunsToday: async () => 0,
  sumCostToday: async () => 0,
  recordUsage: async () => {},
  hasAlertFiredToday: async () => true,
  markAlertFiredToday: async () => {},
};

const cacheDataSource: CacheDataSource = {
  getEntry: async () => null,
  putEntry: async () => {},
};

function catalogFor(setup: Setup): CatalogDataSource {
  return {
    getSetups: async () => [setup],
    getSetupBySlug: async (slug: string) => (slug === setup.slug ? setup : null),
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  requireGate();

  const modelClient = createAnthropicModelClient();
  const now = new Date().toISOString();
  const nowMs = Date.now();

  let totalCost = 0;
  let anyFailure = false;

  for (const setup of CURATED_SETUPS) {
    console.log(`\n=== ${setup.name} (${setup.slug}) ===`);
    const answers = deriveDefaults(setup);
    const deps: RunnerDeps = {
      flagChecker,
      token: 'eval',
      ipHash: 'eval',
      meterDataSource,
      cacheDataSource,
      catalogDataSource: catalogFor(setup),
      modelClient,
      now,
      nowMs,
    };

    for (const scenario of setup.scenarios) {
      const outcome = await runTestDrive(
        { slug: setup.slug, answers, scenarioId: scenario.id },
        deps,
      );

      if (outcome.kind !== 'success') {
        anyFailure = true;
        console.log(`  ✗ ${scenario.title} — runner outcome: ${outcome.kind}`);
        if ('message' in outcome && outcome.message) {
          console.log(`      ${outcome.message}`);
        }
        continue;
      }

      const cost = outcome.result.usage.estimatedCostUsd;
      totalCost += cost;
      const check = checkScenario(outcome.result.output, scenario);

      if (check.pass) {
        const suffix = check.note ? ` (${check.note})` : '';
        console.log(`  ✓ ${scenario.title} — $${cost.toFixed(4)}${suffix}`);
      } else {
        anyFailure = true;
        console.log(`  ✗ ${scenario.title} — $${cost.toFixed(4)}`);
        for (const f of check.failures) {
          const verb = f.kind === 'mustContain' ? 'missing required phrase' : 'contains forbidden phrase';
          console.log(`      ${verb}: "${f.phrase}"`);
        }
      }
    }
  }

  console.log(`\nTotal estimated cost: $${totalCost.toFixed(4)}`);
  if (anyFailure) {
    console.error('\nEval FAILED — one or more scenarios did not pass their assertions.');
    process.exit(1);
  }
  console.log('\nEval PASSED — all curated setups meet their scenario assertions.');
}

main().catch((err) => {
  console.error('Eval harness crashed:', err);
  process.exit(1);
});
