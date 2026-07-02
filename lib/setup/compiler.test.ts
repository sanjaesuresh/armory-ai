import { describe, it, expect } from 'vitest';
import { compileSetup, buildSummary } from '@/lib/setup/compiler';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import type { Answers, Setup } from '@/lib/setup/types';

// ─── Shared base fixture ───────────────────────────────────────────────────────

const base: Setup = {
  id: 'compiler-test',
  slug: 'compiler-test',
  name: 'Compiler Test Setup',
  tagline: 'For compiler tests',
  description: 'Minimal fixture for testing the compiler.',
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
  instructionTemplate: '',
  variables: [],
  knowledgeFiles: [],
  scenarios: [],
};

// ─── Golden answers for canonical fixture ──────────────────────────────────────

const goldenAnswers: Answers = {
  brandName: 'Acme Corp',
  hasBrandVoice: true,
  channels: ['Email', 'Instagram', 'LinkedIn'],
  tone: 'Professional',
};

// ─── Golden instruction ────────────────────────────────────────────────────────
//
// Derived by rendering marketingManagerSetup.instructionTemplate against
// goldenAnswers:
//  - {{#if hasBrandVoice}} is truthy → inner block is included; the block
//    markers are replaced with the inner content, which introduces 3 newlines
//    (2 blank lines) on each side of the brand-voice paragraph.
//  - {{brandName}} → "Acme Corp"
//  - {{channels}}  → "Email, Instagram, and LinkedIn"   (3-item Oxford comma)
//  - {{tone}}      → "Professional"

const GOLDEN_INSTRUCTION = `You are a senior Marketing Manager working exclusively for Acme Corp.

Your responsibilities:
- Develop and execute marketing campaigns that grow brand awareness and drive conversions.
- Write compelling copy tailored to each channel's audience and format.
- Maintain a consistent brand voice in every piece of content you produce.


Brand voice guidelines are provided in the knowledge files. Read them carefully before writing anything — every output must reflect Acme Corp's established voice, tone, and style.


Active channels for Acme Corp:
Email, Instagram, and LinkedIn

When writing for any of these channels, adapt the format, length, and tone to suit the platform while keeping the core message on-brand.

Tone of voice: Professional

Rules:
1. Never invent facts about Acme Corp, its products, or its competitors.
2. If you are uncertain about something, ask a clarifying question rather than guessing.
3. Always suggest A/B variants when writing ad copy or subject lines.
4. If asked to write for a channel not listed above, flag it and confirm before proceeding.`;

// ─── Golden summary ────────────────────────────────────────────────────────────
//
// buildSummary for marketingManagerSetup + goldenAnswers:
//  opener:   "Marketing Manager configured for Acme Corp."
//  boolean:  hasBrandVoice=true  → "Do you have brand voice guidelines?: on."
//  array:    channels            → "Active marketing channels: Email, Instagram, and LinkedIn."
//  string:   tone                → "Overall tone of voice: Professional."
//  files:    Brand quick-facts (starter), Your brand guidelines (user-provided)

const GOLDEN_SUMMARY =
  'Marketing Manager configured for Acme Corp. ' +
  'Do you have brand voice guidelines?: on. ' +
  'Active marketing channels: Email, Instagram, and LinkedIn. ' +
  'Overall tone of voice: Professional. ' +
  'Knowledge files: Brand quick-facts (starter), Your brand guidelines (user-provided).';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('compileSetup', () => {
  it('resolves {{key}} placeholders with answer values', () => {
    // Uses the canonical fixture + goldenAnswers and asserts the exact golden
    // instruction string (the primary golden check for placeholder resolution).
    const result = compileSetup(marketingManagerSetup, goldenAnswers);
    expect(result.instruction).toBe(GOLDEN_INSTRUCTION);
  });

  it('includes an {{#if}} block only when the condition value is truthy and omits it otherwise', () => {
    const setup: Setup = {
      ...base,
      instructionTemplate: 'Start.{{#if flag}} Middle.{{/if}} End.',
      variables: [{ key: 'flag', label: 'Flag', type: 'boolean', required: false }],
    };

    // Truthy: block included.
    expect(compileSetup(setup, { flag: true }).instruction).toBe('Start. Middle. End.');
    // False: block omitted.
    expect(compileSetup(setup, { flag: false }).instruction).toBe('Start. End.');
    // Absent (not in answers): block omitted.
    expect(compileSetup(setup, {}).instruction).toBe('Start. End.');
  });

  it("expands a multiselect answer as a comma list with 'and' before the last item", () => {
    const setup: Setup = {
      ...base,
      instructionTemplate: 'Channels: {{channels}}.',
      variables: [
        {
          key: 'channels',
          label: 'Channels',
          type: 'multiselect',
          options: ['A', 'B', 'C'],
          required: true,
        },
      ],
    };

    expect(compileSetup(setup, { channels: ['A'] }).instruction).toBe('Channels: A.');
    expect(compileSetup(setup, { channels: ['A', 'B'] }).instruction).toBe('Channels: A and B.');
    expect(compileSetup(setup, { channels: ['A', 'B', 'C'] }).instruction).toBe('Channels: A, B, and C.');
  });

  it('unresolved required variable produces a thrown compile error naming the variable key', () => {
    const setup: Setup = {
      ...base,
      instructionTemplate: 'Hello {{requiredKey}}.',
      variables: [
        { key: 'requiredKey', label: 'Required Key', type: 'text', required: true },
      ],
    };

    // No answers → required variable is absent → must throw and name the key.
    expect(() => compileSetup(setup, {})).toThrow('requiredKey');
    // Empty string answer → also absent → must throw.
    expect(() => compileSetup(setup, { requiredKey: '' })).toThrow('requiredKey');
  });

  it('idempotent: compiling the same setup+answers twice yields deeply equal output', () => {
    const result1 = compileSetup(marketingManagerSetup, goldenAnswers);
    const result2 = compileSetup(marketingManagerSetup, goldenAnswers);
    expect(result1).toEqual(result2);
  });

  it('summary names the role, the key choices, and any attached knowledge in plain English', () => {
    const result = compileSetup(marketingManagerSetup, goldenAnswers);
    expect(result.summary).toBe(GOLDEN_SUMMARY);
  });

  it('CompiledSetup.inputs equals the answers passed in', () => {
    const result = compileSetup(marketingManagerSetup, goldenAnswers);
    expect(result.inputs).toEqual(goldenAnswers);
  });

  it('CompiledSetup.inputs is a snapshot independent of the caller answers object', () => {
    const answers: Answers = { ...goldenAnswers };
    const result = compileSetup(marketingManagerSetup, answers);
    // Mutate the caller's object after compilation.
    answers['brandName'] = 'Mutated Corp';
    // The compiled result must not reflect the mutation.
    expect(result.inputs['brandName']).toBe('Acme Corp');
  });

  it('meta block carries setupId, name, version from the setup and target defaults to claude-app', () => {
    const result = compileSetup(marketingManagerSetup, goldenAnswers);
    expect(result.meta.setupId).toBe(marketingManagerSetup.id);
    expect(result.meta.name).toBe(marketingManagerSetup.name);
    expect(result.meta.version).toBe(marketingManagerSetup.version);
    expect(result.meta.target).toBe('claude-app');
  });

  it('meta.target reflects an explicit target argument', () => {
    const result = compileSetup(marketingManagerSetup, goldenAnswers, 'claude-app');
    expect(result.meta.target).toBe('claude-app');
  });

  it('required multiselect variable given an empty array causes compileSetup to throw', () => {
    const setup: Setup = {
      ...base,
      instructionTemplate: 'Channels: {{channels}}.',
      variables: [
        {
          key: 'channels',
          label: 'Active channels',
          type: 'multiselect',
          options: ['A', 'B', 'C'],
          required: true,
        },
      ],
    };

    // Empty array counts as missing for required multiselect vars.
    expect(() => compileSetup(setup, { channels: [] })).toThrow('channels');
  });

  it('starter knowledge files pass through with their content; user-provided files appear with kind user-provided and empty content when none supplied', () => {
    const result = compileSetup(marketingManagerSetup, goldenAnswers);

    const starter = result.knowledgeFiles.find((f) => f.kind === 'starter');
    const userProvided = result.knowledgeFiles.find((f) => f.kind === 'user-provided');

    // Starter file must carry its bundled content through unchanged.
    expect(starter).toBeDefined();
    const sourceStarter = marketingManagerSetup.knowledgeFiles.find(
      (f) => f.kind === 'starter'
    );
    expect(starter!.content).toBe((sourceStarter as { content: string }).content);

    // User-provided file must appear with empty content (injected client-side later).
    expect(userProvided).toBeDefined();
    expect(userProvided!.content).toBe('');
    expect(userProvided!.kind).toBe('user-provided');
  });
});

describe('buildSummary', () => {
  it('returns the same summary string as compileSetup.summary (standalone usage)', () => {
    const standalone = buildSummary(marketingManagerSetup, goldenAnswers);
    const compiled = compileSetup(marketingManagerSetup, goldenAnswers);
    expect(standalone).toBe(compiled.summary);
  });

  it('omits a boolean variable whose answer is false', () => {
    // hasBrandVoice=false → its label must not appear in the summary at all.
    const answersWithFalse: Answers = {
      ...goldenAnswers,
      hasBrandVoice: false,
    };
    const summary = buildSummary(marketingManagerSetup, answersWithFalse);
    const boolVar = marketingManagerSetup.variables.find((v) => v.key === 'hasBrandVoice');
    expect(summary).not.toContain(boolVar!.label);
  });
});
