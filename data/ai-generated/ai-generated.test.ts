/**
 * Structural integrity tests for the AI-generated Professionals setups.
 *
 * Mirrors data/curated/curated.test.ts, plus the invariants specific to this
 * batch: every entry is a core-tier setup (so it appears on the Professionals
 * tab), carries source='ai-generated', and collides with nothing else in the
 * seed catalog.
 */

import { describe, it, expect } from 'vitest';
import { validateSetup } from '@/lib/setup/validator';
import { isProfessionalItem } from '@/lib/catalog/dashboard';
import { githubPicks } from '@/data/community-picks/github-picks';
import { toolkitItems } from '@/data/member-posts/toolkit.generated';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import { codeReviewAgentSetup } from '@/data/curated/code-review-agent';
import { debuggingAgentSetup } from '@/data/curated/debugging-agent';
import { commitMessageSkillSetup } from '@/data/curated/commit-message-skill';
import { prDescriptionSkillSetup } from '@/data/curated/pr-description-skill';
import { tddLoopHarnessSetup } from '@/data/curated/tdd-loop-harness';
import { docsWritingHarnessSetup } from '@/data/curated/docs-writing-harness';
import { aiGeneratedSetups } from './index';

const ALL_CURATED = [
  marketingManagerSetup,
  codeReviewAgentSetup,
  debuggingAgentSetup,
  commitMessageSkillSetup,
  prDescriptionSkillSetup,
  tddLoopHarnessSetup,
  docsWritingHarnessSetup,
];

const WHOLE_SEED_CATALOG = [...ALL_CURATED, ...githubPicks, ...toolkitItems, ...aiGeneratedSetups];

describe('AI-generated data integrity', () => {
  it('contains exactly 15 setups', () => {
    expect(aiGeneratedSetups.length).toBe(15);
  });

  it('every ai-generated item passes validateSetup (no validation errors)', () => {
    for (const setup of aiGeneratedSetups) {
      const result = validateSetup(setup);
      expect(
        result.valid,
        `${setup.slug} validation failed:\n${result.errors.map((e) => `  [${e.code}] ${e.message}`).join('\n')}`,
      ).toBe(true);
    }
  });

  it('every item appears on the Professionals tab (kind=setup, tier=core)', () => {
    for (const setup of aiGeneratedSetups) {
      expect(setup.kind, `${setup.slug} must be kind=setup`).toBe('setup');
      expect(setup.tier, `${setup.slug} must be tier=core`).toBe('core');
      expect(isProfessionalItem(setup), `${setup.slug} must pass isProfessionalItem`).toBe(true);
    }
  });

  it('every item carries the pinned seed invariants', () => {
    for (const setup of aiGeneratedSetups) {
      expect(setup.source, `${setup.slug} source`).toBe('ai-generated');
      expect(setup.reviewStatus, `${setup.slug} reviewStatus`).toBe('approved');
      expect(setup.author, `${setup.slug} author`).toBeNull();
      expect(setup.id, `${setup.slug} id pattern`).toBe(`ai-generated-${setup.slug}-v1`);
      expect(setup.upvotes, `${setup.slug} upvotes`).toBe(0);
      expect(setup.featured, `${setup.slug} featured (no fabricated ranks)`).toBeNull();
      expect(setup.artifactFiles, `${setup.slug} artifactFiles`).toEqual([]);
      expect(setup.capabilities, `${setup.slug} capabilities`).toEqual([]);
      expect(setup.repoUrl, `${setup.slug} repoUrl`).toBeNull();
    }
  });

  it('ids and slugs are unique across the whole seed catalog', () => {
    const ids = WHOLE_SEED_CATALOG.map((s) => s.id);
    const slugs = WHOLE_SEED_CATALOG.map((s) => s.slug);
    expect(new Set(ids).size, 'duplicate id in seed catalog').toBe(ids.length);
    expect(new Set(slugs).size, 'duplicate slug in seed catalog').toBe(slugs.length);
  });

  it('roles are distinct and none duplicates the curated Marketing Manager', () => {
    const roles = aiGeneratedSetups.map((s) => s.role);
    expect(new Set(roles).size, 'duplicate role among ai-generated setups').toBe(roles.length);
    expect(roles).not.toContain(marketingManagerSetup.role);
  });

  it('scenario ids are unique across all ai-generated setups', () => {
    const scenarioIds = aiGeneratedSetups.flatMap((s) => s.scenarios.map((sc) => sc.id));
    expect(new Set(scenarioIds).size, 'duplicate scenario id').toBe(scenarioIds.length);
  });
});
