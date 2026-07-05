/**
 * Structural integrity tests for all curated data items.
 *
 * Written before the six registry items exist (Step 1 in T11).
 * Run `npm test` — this file will fail (imports resolve to non-existent modules)
 * until the six registry items are authored in Step 3.
 */

import { describe, it, expect } from 'vitest';
import { validateSetup } from '@/lib/setup/validator';
import { isRegistryKind } from '@/lib/setup/types';
import { marketingManagerSetup } from './marketing-manager';
import { codeReviewAgentSetup } from './code-review-agent';
import { debuggingAgentSetup } from './debugging-agent';
import { commitMessageSkillSetup } from './commit-message-skill';
import { prDescriptionSkillSetup } from './pr-description-skill';
import { tddLoopHarnessSetup } from './tdd-loop-harness';
import { docsWritingHarnessSetup } from './docs-writing-harness';

const ALL_CURATED = [
  marketingManagerSetup,
  codeReviewAgentSetup,
  debuggingAgentSetup,
  commitMessageSkillSetup,
  prDescriptionSkillSetup,
  tddLoopHarnessSetup,
  docsWritingHarnessSetup,
];

describe('Curated data integrity', () => {
  it('every curated item passes validateSetup (no validation errors)', () => {
    for (const setup of ALL_CURATED) {
      const result = validateSetup(setup);
      expect(
        result.valid,
        `${setup.slug} validation failed:\n${result.errors.map((e) => `  [${e.code}] ${e.message}`).join('\n')}`,
      ).toBe(true);
    }
  });

  it('all three registry kinds are represented (agent, skill, harness)', () => {
    const registryItems = ALL_CURATED.filter((s) => isRegistryKind(s.kind));
    const kinds = new Set(registryItems.map((s) => s.kind));
    expect(kinds.has('agent'), 'expected at least one agent').toBe(true);
    expect(kinds.has('skill'), 'expected at least one skill').toBe(true);
    expect(kinds.has('harness'), 'expected at least one harness').toBe(true);
  });

  it('at least three registry items have a non-null featured rank (Armory Approved shelf)', () => {
    const registryItems = ALL_CURATED.filter((s) => isRegistryKind(s.kind));
    const featured = registryItems.filter((s) => s.featured !== null);
    expect(featured.length).toBeGreaterThanOrEqual(3);
  });

  it('featured ranks among registry items are distinct (no duplicates)', () => {
    const registryItems = ALL_CURATED.filter((s) => isRegistryKind(s.kind));
    const ranks = registryItems
      .map((s) => s.featured)
      .filter((r): r is number => r !== null);
    const uniqueRanks = new Set(ranks);
    expect(uniqueRanks.size).toBe(ranks.length);
  });

  it('tdd-loop-harness exists with kind=harness (required by e2e spec)', () => {
    const tdd = ALL_CURATED.find((s) => s.slug === 'tdd-loop-harness');
    expect(tdd).toBeDefined();
    expect(tdd?.kind).toBe('harness');
  });

  it('all registry items have repoUrl=null (first-party items)', () => {
    const registryItems = ALL_CURATED.filter((s) => isRegistryKind(s.kind));
    for (const item of registryItems) {
      expect(item.repoUrl, `${item.slug} should have repoUrl=null`).toBeNull();
    }
  });

  it('all registry items have exactly one isPrimary artifact file', () => {
    const registryItems = ALL_CURATED.filter((s) => isRegistryKind(s.kind));
    for (const item of registryItems) {
      const primaryCount = item.artifactFiles.filter((f) => f.isPrimary).length;
      expect(primaryCount, `${item.slug} must have exactly one isPrimary file`).toBe(1);
    }
  });
});
