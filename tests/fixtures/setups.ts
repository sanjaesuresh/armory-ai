/**
 * Shared test fixtures for Setup objects.
 *
 * Exports:
 *   - marketingManagerSetup  — the canonical valid curated setup (re-exported from data layer)
 *   - Five intentionally-invalid setups for the validator task tests
 */

import type { Setup } from '@/lib/setup/types';
export { marketingManagerSetup } from '@/data/curated/marketing-manager';

// ─── Helper: base for invalid fixtures ───────────────────────────────────────
// A minimal but structurally complete Setup so each invalid fixture only
// deviates from the spec in exactly the way its name describes.

const base: Setup = {
  id: 'fixture-base',
  slug: 'fixture-base',
  name: 'Base Fixture',
  tagline: 'A minimal setup for testing',
  description: 'Used as the starting point for invalid fixtures.',
  role: 'Generic Assistant',
  industry: null,
  tags: [],
  category: 'general',
  source: 'curated',
  author: null,
  version: '1.0.0',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  reviewStatus: 'draft',
  upvotes: 0,
  featured: null,
  targets: ['claude-app'],
  tier: 'core',
  instructionTemplate: 'You are a helpful assistant for {{topic}}.',
  variables: [
    {
      key: 'topic',
      label: 'Topic',
      type: 'text',
      required: true,
    },
  ],
  knowledgeFiles: [],
  scenarios: [],
};

// ─── Invalid fixture 1: missing-required-field ────────────────────────────────
// The `name` field (required on Setup) is an empty string, and `id` is missing.

export const missingRequiredFieldSetup = {
  ...base,
  id: '',        // violates: id must be a non-empty string
  name: '',      // violates: name must be a non-empty string
} satisfies Setup;

// ─── Invalid fixture 2: template-references-undefined-variable ───────────────
// The instructionTemplate references {{undefinedKey}} which has no corresponding
// Variable definition. The validator must flag this as an error.

export const templateReferencesUndefinedVariableSetup: Setup = {
  ...base,
  id: 'fixture-template-undefined-var',
  slug: 'fixture-template-undefined-var',
  instructionTemplate: 'You are an assistant for {{topic}} and {{undefinedKey}}.',
  // variables only defines `topic`, not `undefinedKey`
  variables: [
    {
      key: 'topic',
      label: 'Topic',
      type: 'text',
      required: true,
    },
  ],
};

// ─── Invalid fixture 3: orphan-variable ──────────────────────────────────────
// A variable (`unusedVar`) is defined but never referenced in the
// instructionTemplate. The validator must flag this (at minimum as a warning).

export const orphanVariableSetup: Setup = {
  ...base,
  id: 'fixture-orphan-variable',
  slug: 'fixture-orphan-variable',
  instructionTemplate: 'You are an assistant for {{topic}}.',
  variables: [
    {
      key: 'topic',
      label: 'Topic',
      type: 'text',
      required: true,
    },
    {
      key: 'unusedVar',
      label: 'Unused variable',
      type: 'text',
      required: false,
      // `unusedVar` is never referenced in the template above
    },
  ],
};

// ─── Invalid fixture 4: over-limit-instruction ───────────────────────────────
// The instructionTemplate exceeds a reasonable character limit (e.g. 20 000 chars).
// The validator must reject or warn on oversized templates.

export const overLimitInstructionSetup: Setup = {
  ...base,
  id: 'fixture-over-limit-instruction',
  slug: 'fixture-over-limit-instruction',
  instructionTemplate: 'A'.repeat(25_000), // 25 000 chars — well over any sensible limit
};

// ─── Invalid fixture 5: empty-instruction-template ───────────────────────────
// The instructionTemplate is an empty string, which must always be rejected.

export const emptyInstructionTemplateSetup: Setup = {
  ...base,
  id: 'fixture-empty-instruction-template',
  slug: 'fixture-empty-instruction-template',
  instructionTemplate: '',
};
