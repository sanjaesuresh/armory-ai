/**
 * Function-chip mapping for the Developers dashboard.
 *
 * Each chip maps a human-readable function label to a set of qualifying item
 * tags. A chip is rendered only when ≥1 developer item's tags intersect its
 * tag set. Order follows FUNCTION_CHIP_DEFS.
 *
 * Pure helpers — no I/O, no side effects.
 */

import type { Setup } from '@/lib/setup/types';

// ─── Chip definitions ─────────────────────────────────────────────────────────

export interface FunctionChipDef {
  label: string;
  tags: readonly string[];
}

/** Ordered list of function chip definitions. */
export const FUNCTION_CHIP_DEFS: readonly FunctionChipDef[] = [
  {
    label: 'Review',
    tags: [
      'code-review',
      'quality',
      'security',
      'ai-slop-cleanup',
      'ai-slop-detector',
      'architecture-reviewer',
      'scope-guardian',
      'migration-risk-reviewer',
      'pre-pr-review',
    ],
  },
  {
    label: 'Debug',
    tags: ['debugging', 'root-cause', 'error-analysis', 'debugging-incident-review'],
  },
  {
    label: 'Test',
    tags: ['tdd', 'testing', 'test-gap-analysis', 'test-strategist'],
  },
  {
    label: 'Plan',
    tags: ['kickoff', 'implementation-plan', 'writing-plans', 'spec'],
  },
  {
    label: 'Build',
    tags: ['software-engineer', 'frontend-engineer', 'full-stack', 'web-development'],
  },
  {
    label: 'Document',
    tags: ['documentation', 'docs-as-code', 'writing', 'pr-description'],
  },
  {
    label: 'Git',
    tags: ['git', 'commits', 'conventional-commits', 'pull-requests', 'split-commit'],
  },
  {
    label: 'Research',
    tags: [
      'researcher',
      'deep-researcher',
      'learn-codebase',
      'learn-from-review',
      'onboarding-map',
      'codebase-teacher',
      'deep-codebase-audit',
      'product-strategist',
    ],
  },
  {
    label: 'Refactor',
    tags: ['safe-refactor-plan', 'migration-risk-reviewer'],
  },
  {
    label: 'Orchestrate',
    tags: ['devops', 'orchestration', 'multi-agent', 'swarm', 'workflows'],
  },
];

// ─── Computed chip ────────────────────────────────────────────────────────────

export interface FunctionChip {
  label: string;
  tags: Set<string>;
  count: number;
}

/**
 * Computes which function chips should be shown for a set of items.
 * Only chips where ≥1 item has at least one matching tag are included.
 * Order follows FUNCTION_CHIP_DEFS.
 * Does not mutate the input array.
 */
export function computeFunctionChips(items: Setup[]): FunctionChip[] {
  return FUNCTION_CHIP_DEFS
    .map(({ label, tags }) => {
      const tagSet = new Set(tags);
      const count = items.filter((item) =>
        item.tags.some((t) => tagSet.has(t)),
      ).length;
      return { label, tags: tagSet, count };
    })
    .filter((chip) => chip.count > 0);
}

/**
 * Returns the tag set for a given chip label.
 * Returns an empty Set when the label is not recognized.
 */
export function getChipTags(label: string): Set<string> {
  const def = FUNCTION_CHIP_DEFS.find((d) => d.label === label);
  return def ? new Set(def.tags) : new Set<string>();
}
