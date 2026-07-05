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
import type { Setup, CompiledSetup, SetupKind, ArtifactFile, ExportTarget } from '@/lib/setup/types';

// Minimal valid setup used as a spread base for inline test fixtures.
const minimalBase: Setup = {
  kind: 'setup',
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
  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
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

// ─── Phase 8 Task 2: kind discriminator + registry validation ────────────────

// A minimal valid registry (agent) item. Used as a spread base.
const minimalRegistryBase: Setup = {
  kind: 'agent' as SetupKind,
  id: 'test-agent',
  slug: 'test-agent',
  name: 'Test Agent',
  tagline: 'A test agent',
  description: 'A test agent fixture.',
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
  targets: [] as ExportTarget[],
  tier: 'core',
  // Registry items: no instruction template, variables, or scenarios.
  instructionTemplate: '',
  variables: [],
  knowledgeFiles: [],
  scenarios: [],
  // Registry-specific fields.
  artifactFiles: [{ name: 'README.md', content: '# Agent readme', isPrimary: true }],
  repoUrl: null,
  capabilities: [{ command: '/help', description: 'Show usage.' }],
};

describe('validateSetup — kind discriminator + registry validation', () => {
  // (a) registry kind with zero artifact files → ARTIFACT_FILES_REQUIRED
  it('(a) registry kind with no artifact files fails with ARTIFACT_FILES_REQUIRED', () => {
    const s: Setup = { ...minimalRegistryBase, artifactFiles: [] as ArtifactFile[] };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'ARTIFACT_FILES_REQUIRED')).toBe(true);
  });

  // (b) registry item with 11 files → TOO_MANY_ARTIFACT_FILES
  it('(b) registry item with 11 artifact files fails with TOO_MANY_ARTIFACT_FILES', () => {
    const files: ArtifactFile[] = Array.from({ length: 11 }, (_, i) => ({
      name: `file-${i}.md`,
      content: '# Content',
      isPrimary: i === 0,
    }));
    const s: Setup = { ...minimalRegistryBase, artifactFiles: files };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'TOO_MANY_ARTIFACT_FILES')).toBe(true);
  });

  // (c) file content exceeds 102 400 bytes → ARTIFACT_FILE_TOO_LARGE
  it('(c) artifact file exceeding 102 400 bytes fails with ARTIFACT_FILE_TOO_LARGE', () => {
    const oversizedFile: ArtifactFile = {
      name: 'big.md',
      content: 'A'.repeat(102_401),
      isPrimary: true,
    };
    const s: Setup = { ...minimalRegistryBase, artifactFiles: [oversizedFile] };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'ARTIFACT_FILE_TOO_LARGE')).toBe(true);
  });

  // (d) file with disallowed extension → ARTIFACT_FILE_BAD_TYPE
  it('(d) artifact file with disallowed extension (.exe) fails with ARTIFACT_FILE_BAD_TYPE', () => {
    const badFile: ArtifactFile = { name: 'exploit.exe', content: '...', isPrimary: true };
    const s: Setup = { ...minimalRegistryBase, artifactFiles: [badFile] };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'ARTIFACT_FILE_BAD_TYPE')).toBe(true);
  });

  it('(d) artifact file with disallowed extension (.sh) fails with ARTIFACT_FILE_BAD_TYPE', () => {
    const badFile: ArtifactFile = { name: 'install.sh', content: '#!/bin/bash', isPrimary: true };
    const s: Setup = { ...minimalRegistryBase, artifactFiles: [badFile] };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'ARTIFACT_FILE_BAD_TYPE')).toBe(true);
  });

  // (e) file name with path separator or >100 chars → ARTIFACT_FILE_BAD_NAME
  it('(e) artifact file name with a path separator fails with ARTIFACT_FILE_BAD_NAME', () => {
    const slashedFile: ArtifactFile = { name: 'dir/evil.md', content: '# Hi', isPrimary: true };
    const s: Setup = { ...minimalRegistryBase, artifactFiles: [slashedFile] };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'ARTIFACT_FILE_BAD_NAME')).toBe(true);
  });

  it('(e) artifact file name over 100 chars fails with ARTIFACT_FILE_BAD_NAME', () => {
    const longName = 'a'.repeat(98) + '.md'; // 101 chars total — over the 100-char limit
    const s: Setup = {
      ...minimalRegistryBase,
      artifactFiles: [{ name: longName, content: '# Hi', isPrimary: true }],
    };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'ARTIFACT_FILE_BAD_NAME')).toBe(true);
  });

  // (f) no primary file → PRIMARY_FILE_REQUIRED
  it('(f) no artifact file marked primary fails with PRIMARY_FILE_REQUIRED', () => {
    const files: ArtifactFile[] = [
      { name: 'a.md', content: '# A', isPrimary: false },
      { name: 'b.md', content: '# B', isPrimary: false },
    ];
    const s: Setup = { ...minimalRegistryBase, artifactFiles: files };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'PRIMARY_FILE_REQUIRED')).toBe(true);
  });

  it('(f) two artifact files marked primary fails with PRIMARY_FILE_REQUIRED', () => {
    const files: ArtifactFile[] = [
      { name: 'a.md', content: '# A', isPrimary: true },
      { name: 'b.md', content: '# B', isPrimary: true },
    ];
    const s: Setup = { ...minimalRegistryBase, artifactFiles: files };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'PRIMARY_FILE_REQUIRED')).toBe(true);
  });

  // (g) non-empty repoUrl that is not a GitHub HTTPS URL → REPO_URL_INVALID
  it('(g) repoUrl that is non-empty but not a GitHub HTTPS URL fails with REPO_URL_INVALID', () => {
    const s: Setup = { ...minimalRegistryBase, repoUrl: 'https://gitlab.com/example/agent' };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'REPO_URL_INVALID')).toBe(true);
  });

  it('(g) null repoUrl is valid (no error)', () => {
    const s: Setup = { ...minimalRegistryBase, repoUrl: null };
    const result = validateSetup(s);
    // The only errors should NOT include REPO_URL_INVALID
    expect(result.errors.some((e) => e.code === 'REPO_URL_INVALID')).toBe(false);
  });

  // (h) capability with empty command or description → CAPABILITY_INVALID
  it('(h) capability with empty command fails with CAPABILITY_INVALID', () => {
    const s: Setup = {
      ...minimalRegistryBase,
      capabilities: [{ command: '', description: 'Does something.' }],
    };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'CAPABILITY_INVALID')).toBe(true);
  });

  it('(h) capability with empty description fails with CAPABILITY_INVALID', () => {
    const s: Setup = {
      ...minimalRegistryBase,
      capabilities: [{ command: '/help', description: '' }],
    };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'CAPABILITY_INVALID')).toBe(true);
  });

  // (i) registry item with non-empty setup-only fields → KIND_FIELD_MISMATCH
  it('(i) registry item with non-empty instructionTemplate fails with KIND_FIELD_MISMATCH', () => {
    const s: Setup = {
      ...minimalRegistryBase,
      instructionTemplate: 'You are an agent for {{topic}}.',
      variables: [{ key: 'topic', label: 'Topic', type: 'text', required: true }],
    };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'KIND_FIELD_MISMATCH')).toBe(true);
  });

  it('(i) registry item with non-empty variables array fails with KIND_FIELD_MISMATCH', () => {
    const s: Setup = {
      ...minimalRegistryBase,
      variables: [{ key: 'x', label: 'X', type: 'text', required: false }],
    };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'KIND_FIELD_MISMATCH')).toBe(true);
  });

  it('(i) registry item with non-empty scenarios array fails with KIND_FIELD_MISMATCH', () => {
    const s: Setup = {
      ...minimalRegistryBase,
      scenarios: [
        { id: 's1', title: 'T', userInput: 'Hi', expectedBehavior: 'Help' },
      ],
    };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'KIND_FIELD_MISMATCH')).toBe(true);
  });

  it('(i) registry item with non-empty targets array fails with KIND_FIELD_MISMATCH', () => {
    const s: Setup = {
      ...minimalRegistryBase,
      targets: ['claude-app'] as ExportTarget[],
    };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'KIND_FIELD_MISMATCH')).toBe(true);
  });

  // (j) setup kind with registry-only fields → KIND_FIELD_MISMATCH
  it('(j) setup kind with non-empty artifactFiles fails with KIND_FIELD_MISMATCH', () => {
    const s: Setup = {
      ...minimalBase,
      artifactFiles: [{ name: 'README.md', content: '# Hi', isPrimary: true }],
    };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'KIND_FIELD_MISMATCH')).toBe(true);
  });

  it('(j) setup kind with a non-null repoUrl fails with KIND_FIELD_MISMATCH', () => {
    const s: Setup = {
      ...minimalBase,
      repoUrl: 'https://github.com/example/repo',
    };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'KIND_FIELD_MISMATCH')).toBe(true);
  });

  it('(j) setup kind with non-empty capabilities fails with KIND_FIELD_MISMATCH', () => {
    const s: Setup = {
      ...minimalBase,
      capabilities: [{ command: '/help', description: 'Show help.' }],
    };
    const result = validateSetup(s);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'KIND_FIELD_MISMATCH')).toBe(true);
  });

  // (k) valid agent → passes
  it('(k) a valid agent with one primary .md file, capabilities, and a GitHub repoUrl passes', () => {
    const s: Setup = {
      ...minimalRegistryBase,
      repoUrl: 'https://github.com/example/my-agent',
    };
    const result = validateSetup(s);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // (l) existing valid-setup fixtures still pass once given kind:'setup' + empty registry fields
  it('(l) existing valid-setup fixtures still pass with kind:setup and empty registry fields', () => {
    // minimalBase already has kind:'setup' and empty registry fields after the Step 3 backfill.
    // Verifying marketingManagerSetup (updated in the curated data file) also passes.
    const result = validateSetup(marketingManagerSetup);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
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
