/**
 * Validates the 2026-07 developer-catalog expansion batches and guards global
 * id/slug uniqueness across every seeded source.
 *
 * The original `github-picks.ts` set is intentionally NOT run through
 * validateSetup here: those 21 items predate the artifact-file requirement and
 * are enriched separately. Everything else added in the expansion carries a
 * primary artifact and must pass validation.
 */

import { describe, it, expect } from 'vitest';
import { validateSetup } from '@/lib/setup/validator';
import { isRegistryKind } from '@/lib/setup/types';
import type { Setup } from '@/lib/setup/types';

import { githubPicks } from './github-picks';
import { githubPicks2 } from './github-picks-2';
import { githubPicks3 } from './github-picks-3';
import { githubPicks4 } from './github-picks-4';
import { professionalPicks } from './professional-picks';
import { externalToolkits } from './external-toolkits';
import { devExtraAgents } from '../curated/dev-extra-agents';
import { devExtraSkills } from '../curated/dev-extra-skills';
import { devExtraHarnesses } from '../curated/dev-extra-harnesses';
import { toolkitItems } from '../member-posts/toolkit.generated';
import { aiGeneratedSetups } from '../ai-generated';
import { proSkills } from '../pro-skills';
import { marketingManagerSetup } from '../curated/marketing-manager';
import { codeReviewAgentSetup } from '../curated/code-review-agent';
import { debuggingAgentSetup } from '../curated/debugging-agent';
import { commitMessageSkillSetup } from '../curated/commit-message-skill';
import { prDescriptionSkillSetup } from '../curated/pr-description-skill';
import { tddLoopHarnessSetup } from '../curated/tdd-loop-harness';
import { docsWritingHarnessSetup } from '../curated/docs-writing-harness';
import { claudeCodeToolkitSetup } from '../curated/claude-code-toolkit-setup';

// the newly-authored batches that must be fully validator-clean
// (github-picks was backfilled with OVERVIEW.md + capabilities so it now qualifies too)
const NEW_BATCHES: Record<string, Setup[]> = {
  'github-picks': githubPicks,
  'github-picks-2': githubPicks2,
  'github-picks-3': githubPicks3,
  'github-picks-4': githubPicks4,
  'dev-extra-agents': devExtraAgents,
  'dev-extra-skills': devExtraSkills,
  'dev-extra-harnesses': devExtraHarnesses,
  'professional-picks': professionalPicks,
};

// mirrors the assembly in scripts/seed-from-curated.ts — the full seeded catalog
const ALL_SETUPS: Setup[] = [
  marketingManagerSetup,
  codeReviewAgentSetup,
  debuggingAgentSetup,
  commitMessageSkillSetup,
  prDescriptionSkillSetup,
  tddLoopHarnessSetup,
  docsWritingHarnessSetup,
  claudeCodeToolkitSetup,
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

describe('Per-job depth skills (pro-skills)', () => {
  it('every pro-skill passes validateSetup', () => {
    for (const setup of proSkills) {
      const result = validateSetup(setup);
      expect(
        result.valid,
        `${setup.slug} failed:\n${result.errors.map((e) => `  [${e.code}] ${e.message}`).join('\n')}`,
      ).toBe(true);
    }
  });

  it('every pro-skill is a core professional setup grouped to a job via role', () => {
    for (const setup of proSkills) {
      expect(setup.kind, `${setup.slug} kind`).toBe('setup');
      expect(setup.tier, `${setup.slug} tier`).toBe('core');
      expect(setup.role.length, `${setup.slug} role`).toBeGreaterThan(0);
      expect(setup.id, `${setup.slug} id pattern`).toBe(`pro-skill-${setup.slug}-v1`);
    }
  });
});

describe('Developer catalog expansion (2026-07)', () => {
  for (const [name, batch] of Object.entries(NEW_BATCHES)) {
    it(`${name}: every item passes validateSetup`, () => {
      for (const setup of batch) {
        const result = validateSetup(setup);
        expect(
          result.valid,
          `${setup.slug} failed:\n${result.errors.map((e) => `  [${e.code}] ${e.message}`).join('\n')}`,
        ).toBe(true);
      }
    });
  }

  it('every new registry item has exactly one isPrimary artifact and >=2 capabilities', () => {
    for (const batch of Object.values(NEW_BATCHES)) {
      for (const item of batch) {
        expect(isRegistryKind(item.kind), `${item.slug} should be a registry kind`).toBe(true);
        const primary = item.artifactFiles.filter((f) => f.isPrimary).length;
        expect(primary, `${item.slug} must have exactly one isPrimary file`).toBe(1);
        expect(item.capabilities.length, `${item.slug} needs >=2 capabilities`).toBeGreaterThanOrEqual(2);
      }
    }
  });
});

describe('External toolkits (community setups)', () => {
  it('every external toolkit passes validateSetup', () => {
    for (const setup of externalToolkits) {
      const result = validateSetup(setup);
      expect(
        result.valid,
        `${setup.slug} failed:\n${result.errors.map((e) => `  [${e.code}] ${e.message}`).join('\n')}`,
      ).toBe(true);
    }
  });

  it('every external toolkit is an advanced developer setup', () => {
    for (const setup of externalToolkits) {
      expect(setup.kind, `${setup.slug} kind`).toBe('setup');
      expect(setup.tier, `${setup.slug} tier`).toBe('advanced');
    }
  });
});

describe('Professional community picks', () => {
  it('every pick is a github-sourced link-out tagged with an industry + role', () => {
    for (const setup of professionalPicks) {
      expect(setup.source, `${setup.slug} source`).toBe('github');
      expect(setup.industry, `${setup.slug} industry`).not.toBeNull();
      expect(setup.role.length, `${setup.slug} role`).toBeGreaterThan(0);
    }
  });
});

describe('Global catalog integrity', () => {
  it('all ids are unique across every source', () => {
    const seen = new Map<string, number>();
    for (const s of ALL_SETUPS) seen.set(s.id, (seen.get(s.id) ?? 0) + 1);
    const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([id]) => id);
    expect(dupes, `duplicate ids: ${dupes.join(', ')}`).toEqual([]);
  });

  it('all slugs are unique across every source', () => {
    const seen = new Map<string, number>();
    for (const s of ALL_SETUPS) seen.set(s.slug, (seen.get(s.slug) ?? 0) + 1);
    const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([slug]) => slug);
    expect(dupes, `duplicate slugs: ${dupes.join(', ')}`).toEqual([]);
  });
});
