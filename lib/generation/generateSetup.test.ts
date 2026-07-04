/**
 * Tests for the AI setup generation pipeline.
 *
 * All model calls are mocked — CI never hits the network. The model client and
 * insertPendingSetup are the only two network seams, both injected via deps.
 */

import { describe, it, expect } from 'vitest';
import { generateSetupFromBrief, isWithinBudget, type GenerationDeps } from './generateSetup';
import type { Brief } from './briefs';
import type { ModelClient } from '@/lib/testdrive/runner';
import type { Setup } from '@/lib/setup/types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const BRIEF_GAP_FILL: Brief = {
  kind: 'gap-fill',
  role: 'marketing-manager',
  industry: null,
  goalTags: [],
};

const BRIEF_VARIATION: Brief = {
  kind: 'variation',
  role: 'content-writer',
  industry: null,
  goalTags: ['emails'],
  sourceSlug: 'test-marketing-setup',
  vary: 'role',
};

/**
 * Builds a JSON string representing a minimal valid Setup.
 * Server-owned fields (source, author, reviewStatus, version, id, slug, timestamps)
 * are intentionally set to "model-like" values here — the pipeline must overwrite them.
 */
function makeValidSetupJson(overrides: Partial<Setup> = {}): string {
  const base: Setup = {
    id: 'model-id-001',
    slug: 'test-marketing-setup',
    name: 'Test Marketing Setup',
    tagline: 'A helpful marketing assistant for your team',
    description: 'Helps marketing teams write better content and emails.',
    role: 'Marketing Manager',
    industry: null,
    tags: ['marketing'],
    category: 'marketing',
    // These are intentionally "wrong" — the pipeline must overwrite them:
    source: 'community',
    author: 'bad-actor-id',
    version: '9.9.9',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2020-01-01T00:00:00Z',
    reviewStatus: 'approved',
    upvotes: 999,
    featured: null,
    targets: ['claude-app'],
    tier: 'core',
    instructionTemplate: 'You are a marketing assistant for {{brandName}}.',
    variables: [
      {
        key: 'brandName',
        label: 'Your Brand Name',
        type: 'text',
        required: true,
        default: 'Acme Corp',
      },
    ],
    knowledgeFiles: [],
    scenarios: [
      {
        id: 'scenario-1',
        title: 'Marketing Email',
        userInput: 'Help me write a marketing email',
        expectedBehavior: 'Write a marketing email',
        // Empty mustContain: scenario passes trivially (no assertions to check).
        mustContain: [],
      },
    ],
    ...overrides,
  };
  return JSON.stringify(base);
}

// ─── Mock builders ────────────────────────────────────────────────────────────

/** Creates a sequential model client mock: returns responses in order. */
function createMockClient(responses: Array<{ output: string; inputTokens?: number; outputTokens?: number }>): {
  client: ModelClient;
  callCount: () => number;
} {
  let index = 0;
  const client: ModelClient = {
    async call({ onChunk }) {
      const resp = responses[index] ?? { output: '', inputTokens: 100, outputTokens: 50 };
      const { output, inputTokens = 100, outputTokens = 50 } = resp;
      index++;
      onChunk(output);
      return { inputTokens, outputTokens };
    },
  };
  return { client, callCount: () => index };
}

/** Captures all rows passed to insertPendingSetup. */
function createInsertCapture(): {
  fn: GenerationDeps['insertPendingSetup'];
  rows: () => Record<string, unknown>[];
} {
  const captured: Record<string, unknown>[] = [];
  return {
    fn: async (row) => { captured.push(row); },
    rows: () => captured,
  };
}

/** Builds GenerationDeps wired with sequential responses and a captured insert. */
function makeDeps(
  responses: Array<{ output: string; inputTokens?: number; outputTokens?: number }>,
  partial: Partial<GenerationDeps> = {},
): {
  deps: GenerationDeps;
  insertCapture: ReturnType<typeof createInsertCapture>;
  callCount: () => number;
} {
  const { client, callCount } = createMockClient(responses);
  const insertCapture = createInsertCapture();
  const deps: GenerationDeps = {
    modelClient: client,
    insertPendingSetup: insertCapture.fn,
    now: '2026-01-01T00:00:00Z',
    newId: () => 'test-id-001',
    // 'test-marketing-setup' matches the slug pattern and is not reserved.
    newSlug: () => 'test-marketing-setup',
    maxRetries: 2,
    ...partial,
  };
  return { deps, insertCapture, callCount };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('generateSetupFromBrief', () => {
  it('a valid generation that passes its evals is inserted pending with source ai-generated and null author', async () => {
    // Three model calls in order:
    //   1. Generation → valid Setup JSON
    //   2. Scenario eval → output for trivial-pass scenario
    //   3. Safety screen model pass → "CLEAN"
    const { deps, insertCapture } = makeDeps([
      { output: makeValidSetupJson() },
      { output: 'Here is a marketing email for you.' },
      { output: 'CLEAN' },
    ]);

    const outcome = await generateSetupFromBrief(BRIEF_GAP_FILL, deps);

    expect(outcome.status).toBe('inserted');
    expect(outcome.brief).toBe(BRIEF_GAP_FILL);
    expect(outcome.attempts).toBe(1);
    expect(outcome.spendUsd).toBeGreaterThan(0);

    const rows = insertCapture.rows();
    expect(rows).toHaveLength(1);

    const row = rows[0];
    // Pipeline-enforced fields:
    expect(row.source).toBe('ai-generated');
    expect(row.author).toBeNull();
    expect(row.review_status).toBe('pending');
    expect(row.version).toBe('0.1.0');
    // Timestamps come from deps.now:
    expect(row.created_at).toBe('2026-01-01T00:00:00Z');
    expect(row.updated_at).toBe('2026-01-01T00:00:00Z');
    // id/slug come from injected factories:
    expect(row.id).toBe('test-id-001');
    expect(row.slug).toBe('test-marketing-setup');
  });

  it('schema-invalid model output is discarded with the validator\'s reasons and never inserted', async () => {
    // Both attempts return unparseable text.
    const { deps, insertCapture } = makeDeps([
      { output: 'This is definitely not JSON at all.' },
      { output: 'Still not JSON.' },
    ]);

    const outcome = await generateSetupFromBrief(BRIEF_GAP_FILL, deps);

    expect(outcome.status).toBe('discarded');
    expect(outcome.reason).toBeDefined();
    expect(insertCapture.rows()).toHaveLength(0);
  });

  it('schema-invalid JSON with validator errors is discarded with validator reasons', async () => {
    // JSON that parses but fails validateSetup (missing required fields).
    const invalidSetup = JSON.stringify({
      id: '',           // MISSING_REQUIRED_FIELD (empty)
      slug: '',
      name: '',
      tagline: '',
      description: '',
      role: '',
      version: '',
      createdAt: '',
      updatedAt: '',
      category: 'INVALID_CATEGORY',
      tags: [],
      instructionTemplate: 'hello',
      variables: [],
      knowledgeFiles: [],
      scenarios: [],
    });

    const { deps, insertCapture } = makeDeps([
      { output: invalidSetup },
      { output: invalidSetup },
    ]);

    const outcome = await generateSetupFromBrief(BRIEF_GAP_FILL, deps);

    expect(outcome.status).toBe('discarded');
    expect(outcome.reason).toBeDefined();
    expect(outcome.reason).toMatch(/schema invalid/i);
    expect(insertCapture.rows()).toHaveLength(0);
  });

  it('a generation failing one of its own scenarios is discarded (not inserted)', async () => {
    // Setup with mustContain assertion that the eval response won't satisfy.
    const setupWithAssertions = makeValidSetupJson({
      scenarios: [
        {
          id: 'strict-scenario',
          title: 'Strict Test',
          userInput: 'Write something',
          expectedBehavior: 'Must mention target-keyword',
          mustContain: ['target-keyword'],
        },
      ],
    });

    // Both attempts: generation passes validation + compile, but scenario eval
    // returns text that doesn't contain 'target-keyword'.
    const { deps, insertCapture } = makeDeps([
      { output: setupWithAssertions },       // attempt 1 generation
      { output: 'Generic helpful response' }, // attempt 1 eval — misses mustContain
      { output: setupWithAssertions },       // attempt 2 generation
      { output: 'Another response without it' }, // attempt 2 eval — still misses
    ]);

    const outcome = await generateSetupFromBrief(BRIEF_GAP_FILL, deps);

    expect(outcome.status).toBe('discarded');
    expect(outcome.reason).toMatch(/scenario.*assertion|assertion.*scenario/i);
    expect(insertCapture.rows()).toHaveLength(0);
  });

  it('a safety-screen flag routes to needs-attention (stored) but the row is still inserted pending — NOT auto-rejected', async () => {
    // The safety screen model pass returns FLAG; the rules pass is clean.
    const { deps, insertCapture } = makeDeps([
      { output: makeValidSetupJson() },          // generation
      { output: 'marketing email content' },     // scenario eval
      { output: 'FLAG: suspicious redirect' },   // safety screen model pass
    ]);

    const outcome = await generateSetupFromBrief(BRIEF_GAP_FILL, deps);

    // A safety flag does NOT cause discard — row is still inserted.
    expect(outcome.status).toBe('inserted');

    const rows = insertCapture.rows();
    expect(rows).toHaveLength(1);

    const row = rows[0];
    // Still pending — safety screen only flags for human attention.
    expect(row.review_status).toBe('pending');
    expect(row.review_status).not.toBe('rejected');
    expect(row.review_status).not.toBe('approved');

    // Safety screen result is stored with the row and signals needs-attention.
    const screen = row.safety_screen as { needsAttention: boolean };
    expect(screen.needsAttention).toBe(true);
  });

  it('no code path ever sets review_status to approved', async () => {
    const assertNotApproved = async (row: Record<string, unknown>): Promise<void> => {
      if (row.review_status === 'approved') {
        throw new Error('INVARIANT VIOLATED: review_status was set to approved by the pipeline');
      }
    };

    const { client } = createMockClient([
      { output: makeValidSetupJson() },
      { output: 'marketing content' },
      { output: 'CLEAN' },
    ]);

    const outcome = await generateSetupFromBrief(BRIEF_GAP_FILL, {
      modelClient: client,
      insertPendingSetup: assertNotApproved,
      now: '2026-01-01T00:00:00Z',
      newId: () => 'test-id-approved-check',
      newSlug: () => 'test-marketing-setup',
      maxRetries: 2,
    });

    // The insert ran (status=inserted) and assertNotApproved did not throw.
    expect(outcome.status).toBe('inserted');
  });

  it('retries are bounded per brief — a model that always returns invalid output stops after maxRetries attempts', async () => {
    const maxRetries = 2;
    // More responses than needed — confirms the loop stops at maxRetries.
    const { deps, insertCapture, callCount } = makeDeps(
      Array.from({ length: 10 }, () => ({ output: 'not valid json at all {broken' })),
      { maxRetries },
    );

    const outcome = await generateSetupFromBrief(BRIEF_GAP_FILL, deps);

    expect(outcome.status).toBe('discarded');
    // Exactly maxRetries model calls were made (one generation attempt per retry).
    expect(callCount()).toBe(maxRetries);
    expect(outcome.attempts).toBe(maxRetries);
    expect(insertCapture.rows()).toHaveLength(0);
  });

  // ── Fix 1: insertPendingSetup throwing yields discarded (never throws) ───────

  it('an insertPendingSetup failure returns discarded outcome — does not throw', async () => {
    const { client } = createMockClient([
      { output: makeValidSetupJson() },
      { output: 'Here is a marketing email for you.' },
      { output: 'CLEAN' },
    ]);

    const throwingInsert: GenerationDeps['insertPendingSetup'] = async () => {
      throw new Error('DB connection lost');
    };

    const outcome = await generateSetupFromBrief(BRIEF_GAP_FILL, {
      modelClient: client,
      insertPendingSetup: throwingInsert,
      now: '2026-01-01T00:00:00Z',
      newId: () => 'test-id-001',
      newSlug: () => 'test-marketing-setup',
      maxRetries: 2,
    });

    // The pipeline must return a structured outcome — never propagate the throw.
    expect(outcome.status).toBe('discarded');
    expect(outcome.reason).toMatch(/insert failed/i);
    expect(outcome.reason).toContain('DB connection lost');
  });

  // ── Fix 2: code-fence stripping handles leading whitespace ───────────────────

  it('a model reply wrapped in code fences with a leading newline parses and inserts', async () => {
    const setupJson = makeValidSetupJson();
    const fencedOutput = '\n```json\n' + setupJson + '\n```\n';

    const { deps, insertCapture } = makeDeps([
      { output: fencedOutput },
      { output: 'Here is a marketing email for you.' },
      { output: 'CLEAN' },
    ]);

    const outcome = await generateSetupFromBrief(BRIEF_GAP_FILL, deps);

    expect(outcome.status).toBe('inserted');
    expect(insertCapture.rows()).toHaveLength(1);
  });

  // ── Fix 3: generation_meta persisted with inserted row ───────────────────────

  it('a successful insert carries generation_meta with the brief and one eval entry per scenario', async () => {
    const { deps, insertCapture } = makeDeps([
      { output: makeValidSetupJson() },
      { output: 'Here is a marketing email for you.' },
      { output: 'CLEAN' },
    ]);

    const outcome = await generateSetupFromBrief(BRIEF_GAP_FILL, deps);

    expect(outcome.status).toBe('inserted');

    // Check the inserted row payload.
    const row = insertCapture.rows()[0];
    const meta = row.generation_meta as {
      brief: Brief;
      evals: Array<{ scenarioId: string; pass: boolean; outputSnippet: string }>;
    };
    expect(meta).toBeDefined();
    expect(meta.brief).toBe(BRIEF_GAP_FILL);
    // The fixture setup has exactly one scenario ('scenario-1').
    expect(meta.evals).toHaveLength(1);
    expect(meta.evals[0].scenarioId).toBe('scenario-1');
    expect(meta.evals[0].pass).toBe(true);
    expect(meta.evals[0].outputSnippet.length).toBeGreaterThan(0);

    // Also surfaced on the outcome.
    expect(outcome.generationMeta).toBeDefined();
    expect(outcome.generationMeta!.brief).toBe(BRIEF_GAP_FILL);
    expect(outcome.generationMeta!.evals).toHaveLength(1);
    expect(outcome.generationMeta!.evals[0].pass).toBe(true);
  });

  // ── Also: variation brief through the pipeline ───────────────────────────────

  it('a valid variation brief is inserted pending', async () => {
    const { deps, insertCapture } = makeDeps([
      { output: makeValidSetupJson() },
      { output: 'Here is a marketing email for you.' },
      { output: 'CLEAN' },
    ]);

    const outcome = await generateSetupFromBrief(BRIEF_VARIATION, deps);

    expect(outcome.status).toBe('inserted');
    expect(outcome.brief).toBe(BRIEF_VARIATION);
    expect(insertCapture.rows()).toHaveLength(1);

    // Server-owned fields must still be hardcoded literals regardless of brief kind.
    const row = insertCapture.rows()[0];
    expect(row.source).toBe('ai-generated');
    expect(row.author).toBeNull();
    expect(row.review_status).toBe('pending');
    expect(row.version).toBe('0.1.0');

    // generation_meta brief matches the variation brief.
    const meta = row.generation_meta as { brief: Brief; evals: unknown[] };
    expect(meta.brief).toBe(BRIEF_VARIATION);
  });
});

// ─── isWithinBudget ───────────────────────────────────────────────────────────

describe('isWithinBudget', () => {
  it('returns true when current spend is below the budget', () => {
    expect(isWithinBudget(0.25, 1.00)).toBe(true);
  });

  it('returns false when current spend equals the budget', () => {
    expect(isWithinBudget(1.00, 1.00)).toBe(false);
  });

  it('returns false when current spend exceeds the budget', () => {
    expect(isWithinBudget(1.50, 1.00)).toBe(false);
  });

  it('returns true at zero spend with any positive budget', () => {
    expect(isWithinBudget(0, 0.01)).toBe(true);
  });
});
