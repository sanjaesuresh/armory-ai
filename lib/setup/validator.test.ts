import { describe, it, expect } from 'vitest';
import { validateSetup, sanitizeTag, RESERVED_SLUGS, validateCompiledForTarget } from '@/lib/setup/validator';
import {
  marketingManagerSetup,
  missingRequiredFieldSetup,
  templateReferencesUndefinedVariableSetup,
  orphanVariableSetup,
  emptyInstructionTemplateSetup,
  overLimitInstructionSetup,
} from '@/tests/fixtures/setups';
import { compileSetup } from '@/lib/setup/compiler';
import {
  CLAUDE_APP_MAX_FILES,
  CLAUDE_APP_MAX_FILE_BYTES,
  CLAUDE_APP_INSTRUCTION_MAX_CHARS,
} from '@/lib/setup/limits';
import type { Setup, CompiledSetup } from '@/lib/setup/types';

// Minimal valid setup used as a spread base for inline test fixtures.
const minimalBase: Setup = {
  id: 'test-inline',
  slug: 'test-inline',
  name: 'Inline Test Setup',
  tagline: 'Inline test',
  description: 'Inline test fixture.',
  role: 'Test Role',
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
  instructionTemplate: 'You are a helpful assistant.',
  variables: [],
  knowledgeFiles: [],
  scenarios: [],
};

describe('validateSetup', () => {
  it('valid canonical setup passes with no errors', () => {
    const result = validateSetup(marketingManagerSetup);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('missing required field is an error', () => {
    const result = validateSetup(missingRequiredFieldSetup);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('template referencing an undefined variable key is an error', () => {
    const result = validateSetup(templateReferencesUndefinedVariableSetup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'UNDEFINED_VARIABLE_REFERENCE')).toBe(true);
  });

  it('variable defined but never referenced is a warning, not an error', () => {
    const result = validateSetup(orphanVariableSetup);
    // Must be valid (warnings do not block)
    expect(result.valid).toBe(true);
    // Must NOT be an error
    expect(result.errors.some((e) => e.code === 'ORPHAN_VARIABLE')).toBe(false);
    // Must be a warning
    expect(result.warnings.some((w) => w.code === 'ORPHAN_VARIABLE')).toBe(true);
  });

  it('empty instructionTemplate is an error', () => {
    const result = validateSetup(emptyInstructionTemplateSetup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'EMPTY_INSTRUCTION_TEMPLATE')).toBe(true);
  });

  it('compiled-length-independent structural checks: unknown category is an error', () => {
    const setup: Setup = {
      ...marketingManagerSetup,
      // Cast through unknown to bypass TypeScript's type guard
      category: 'not-a-real-category' as unknown as Setup['category'],
    };
    const result = validateSetup(setup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'INVALID_CATEGORY')).toBe(true);
  });

  it('slug in reserved list is an error', () => {
    const setup: Setup = {
      ...marketingManagerSetup,
      slug: 'admin',
    };
    const result = validateSetup(setup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'RESERVED_SLUG')).toBe(true);
  });
});

describe('sanitizeTag', () => {
  it('tag with HTML is sanitized by sanitizeTag', () => {
    const input = '<script>alert("xss")</script>tag-value<b>bold</b>';
    const result = sanitizeTag(input);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).toContain('tag-value');
  });

  it('RESERVED_SLUGS includes required route roots', () => {
    for (const slug of ['api', 'admin', 'settings', 'login', 'signup', 'setup', 'export']) {
      expect(RESERVED_SLUGS).toContain(slug);
    }
  });

  it('truncates output to the 50-character length cap', () => {
    const longInput = 'a'.repeat(100);
    expect(sanitizeTag(longInput)).toHaveLength(50);
  });

  it('strips an unclosed/malformed tag leaving no < or > characters', () => {
    // An unclosed tag has no `>`, so the first-pass regex (<[^>]*>) cannot match it.
    // The second pass removes the stray `<`.
    const input = '<img src=x onerror=alert(1)';
    const result = sanitizeTag(input);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });
});

describe('validateSetup — additional structural rules', () => {
  it('spaced {{ brandName }} token is recognised as a reference (no orphan warning)', () => {
    const setup: Setup = {
      ...minimalBase,
      instructionTemplate: 'Hello {{ brandName }}!',
      variables: [{ key: 'brandName', label: 'Brand name', type: 'text', required: true }],
    };
    const result = validateSetup(setup);
    // brandName is referenced (via spaced token), so no orphan warning
    expect(result.warnings.some((w) => w.code === 'ORPHAN_VARIABLE')).toBe(false);
  });

  it('spaced {{ missingKey }} token with no declared variable is an error', () => {
    const setup: Setup = {
      ...minimalBase,
      instructionTemplate: 'Hello {{ missingKey }}!',
      variables: [],
    };
    const result = validateSetup(setup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'UNDEFINED_VARIABLE_REFERENCE')).toBe(true);
  });

  it('slug with uppercase or underscore fires INVALID_SLUG_PATTERN', () => {
    const setup: Setup = { ...minimalBase, slug: 'Bad_Slug' };
    const result = validateSetup(setup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'INVALID_SLUG_PATTERN')).toBe(true);
  });

  it('slug with a leading hyphen fires INVALID_SLUG_PATTERN', () => {
    const setup: Setup = { ...minimalBase, slug: '-bad-slug' };
    const result = validateSetup(setup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'INVALID_SLUG_PATTERN')).toBe(true);
  });

  it('select variable with empty options array is an error', () => {
    const setup: Setup = {
      ...minimalBase,
      instructionTemplate: 'Choose {{choice}}.',
      variables: [{ key: 'choice', label: 'Choice', type: 'select', options: [], required: true }],
    };
    const result = validateSetup(setup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'MISSING_SELECT_OPTIONS')).toBe(true);
  });

  it('multiselect variable with no options array is an error', () => {
    const setup: Setup = {
      ...minimalBase,
      instructionTemplate: 'Pick {{tags}}.',
      variables: [{ key: 'tags', label: 'Tags', type: 'multiselect', required: true }],
    };
    const result = validateSetup(setup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'MISSING_SELECT_OPTIONS')).toBe(true);
  });

  it('nested {{#if}} blocks are an error (they would render incorrectly)', () => {
    const setup: Setup = {
      ...minimalBase,
      instructionTemplate: '{{#if outer}}before {{#if inner}}nested{{/if}} after{{/if}}',
      variables: [
        { key: 'outer', label: 'Outer', type: 'boolean', required: false },
        { key: 'inner', label: 'Inner', type: 'boolean', required: false },
      ],
    };
    const result = validateSetup(setup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'NESTED_IF_BLOCK')).toBe(true);
  });

  it('sequential (non-nested) {{#if}} blocks are not flagged as nested', () => {
    const setup: Setup = {
      ...minimalBase,
      instructionTemplate: '{{#if a}}one{{/if}} and {{#if b}}two{{/if}}',
      variables: [
        { key: 'a', label: 'A', type: 'boolean', required: false },
        { key: 'b', label: 'B', type: 'boolean', required: false },
      ],
    };
    const result = validateSetup(setup);
    expect(result.errors.some((e) => e.code === 'NESTED_IF_BLOCK')).toBe(false);
  });

  it('more than 10 tags is an error; exactly 10 is fine', () => {
    const tags = Array.from({ length: 11 }, (_, i) => `tag-${i}`);
    const over = validateSetup({ ...minimalBase, tags });
    expect(over.valid).toBe(false);
    expect(over.errors.some((e) => e.code === 'TOO_MANY_TAGS')).toBe(true);

    const atLimit = validateSetup({ ...minimalBase, tags: tags.slice(0, 10) });
    expect(atLimit.errors.some((e) => e.code === 'TOO_MANY_TAGS')).toBe(false);
  });

  it('starter knowledge file with empty content is an error', () => {
    const setup: Setup = {
      ...minimalBase,
      knowledgeFiles: [
        { name: 'Guide', purpose: 'Reference', kind: 'starter', content: '', required: true },
      ],
    };
    const result = validateSetup(setup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'MISSING_STARTER_CONTENT')).toBe(true);
  });

  it('user-provided knowledge file with empty guidance is an error', () => {
    const setup: Setup = {
      ...minimalBase,
      knowledgeFiles: [
        { name: 'Upload', purpose: 'User file', kind: 'user-provided', guidance: '', required: false },
      ],
    };
    const result = validateSetup(setup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'MISSING_USER_PROVIDED_GUIDANCE')).toBe(true);
  });
});

// ─── Target-limit tests ───────────────────────────────────────────────────────

const goldenAnswers = {
  brandName: 'Acme Corp',
  hasBrandVoice: true,
  channels: ['Email', 'Instagram', 'LinkedIn'],
  tone: 'Professional',
};

describe('validateCompiledForTarget', () => {
  it('instruction exceeding the Claude char limit is a target error', () => {
    // overLimitInstructionSetup has a 25,000-char template; its `topic` variable
    // is required, so supply a value to let it compile without throwing.
    const compiled = compileSetup(overLimitInstructionSetup, { topic: 'test' });
    const result = validateCompiledForTarget(compiled, 'claude-app');
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'INSTRUCTION_TOO_LONG')).toBe(true);

    // Message must state how much over the limit the instruction is.
    const err = result.errors.find((e) => e.code === 'INSTRUCTION_TOO_LONG')!;
    const excessChars = compiled.instruction.length - CLAUDE_APP_INSTRUCTION_MAX_CHARS;
    expect(excessChars).toBeGreaterThan(0);
    expect(err.message).toMatch(/over the/);
    expect(err.message).toContain(String(excessChars));
  });

  it('more knowledge files than the Claude file-count limit is a target error', () => {
    const tooManyFiles: CompiledSetup['knowledgeFiles'] = Array.from(
      { length: CLAUDE_APP_MAX_FILES + 1 },
      (_, i) => ({ name: `file-${i}.txt`, content: 'ok', kind: 'starter' as const })
    );
    const compiled: CompiledSetup = {
      ...compileSetup(marketingManagerSetup, goldenAnswers),
      knowledgeFiles: tooManyFiles,
    };
    const result = validateCompiledForTarget(compiled, 'claude-app');
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'TOO_MANY_FILES')).toBe(true);
  });

  it('within-limit compiled output passes target validation', () => {
    const compiled = compileSetup(marketingManagerSetup, goldenAnswers);
    const result = validateCompiledForTarget(compiled, 'claude-app');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('a single knowledge file exceeding the byte limit is a FILE_TOO_LARGE error', () => {
    // Build a minimal CompiledSetup by hand — no compiler needed.
    // The file content is ASCII 'A' repeated one byte beyond the limit (1 byte per char).
    // Instruction is short to avoid INSTRUCTION_TOO_LONG; one file to avoid TOO_MANY_FILES.
    const compiled: CompiledSetup = {
      instruction: 'You are a helpful assistant.',
      knowledgeFiles: [
        {
          name: 'oversized.txt',
          content: 'A'.repeat(CLAUDE_APP_MAX_FILE_BYTES + 1),
          kind: 'starter',
        },
      ],
      summary: 'Test summary.',
      meta: {
        setupId: 'test-file-too-large',
        name: 'Test Setup',
        version: '1.0.0',
        target: 'claude-app',
      },
      inputs: {},
    };
    const result = validateCompiledForTarget(compiled, 'claude-app');
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'FILE_TOO_LARGE')).toBe(true);

    // Message must state how much over the byte limit the file is (here, 1 byte).
    const err = result.errors.find((e) => e.code === 'FILE_TOO_LARGE')!;
    expect(err.message).toMatch(/over the/);
    expect(err.message).toContain('1');
  });
});
