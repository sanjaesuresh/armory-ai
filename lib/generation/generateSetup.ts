/**
 * AI setup generation pipeline (Phase 6).
 *
 * generateSetupFromBrief(brief, deps) runs the quality gauntlet in this fixed order:
 *   1. Generate  — prompt the model to author a complete Setup JSON
 *   2. Overwrite server-owned fields (source, author, reviewStatus, version, id, slug, timestamps)
 *   3. validateSetup — schema errors → discard (bounded retries)
 *   4. compileSetup with variable defaults — compile error → discard
 *   5. Own-scenario evals — any assertion failure → discard
 *   6. runSafetyScreen — a flag marks needs-attention but NEVER discards
 *   7. insertPendingSetup — persists the candidate for human review
 *
 * No code path ever sets reviewStatus='approved'. The gauntlet order is fixed.
 *
 * SERVER ONLY — all model calls go through the injected ModelClient. CI never
 * hits the network; both seams (modelClient + insertPendingSetup) are injected.
 */

import type { Brief } from './briefs';
import type { ModelClient } from '@/lib/testdrive/runner';
import type { Setup, Answers } from '@/lib/setup/types';
import type { SafetyScreenResult } from '@/lib/community/safetyScreen';
import { validateSetup } from '@/lib/setup/validator';
import { compileSetup } from '@/lib/setup/compiler';
import { checkScenario } from '@/lib/testdrive/assertions';
import { runSafetyScreen } from '@/lib/community/safetyScreen';
import { historySnippet } from '@/lib/saved/testDriveHistory';
import {
  GENERATION_OUTPUT_CAP,
  OUTPUT_TOKEN_CAP,
  STARTER_KNOWLEDGE_CAP_TOKENS,
  CHARS_PER_TOKEN,
  estimatedCostUsd,
} from '@/lib/testdrive/modelConfig';

// ─── Deps ─────────────────────────────────────────────────────────────────────

/** All injectable dependencies for the generation pipeline. */
export interface GenerationDeps {
  /** The only network seam for model calls. Mocked in tests; real SDK in the script. */
  modelClient: ModelClient;
  /** The only network seam for persistence. Mocked in tests; real Supabase in the script. */
  insertPendingSetup: (row: Record<string, unknown>) => Promise<void>;
  /** ISO UTC timestamp for "now" — injected for determinism in tests. */
  now: string;
  /** Returns a fresh unique id. Injected for determinism in tests. */
  newId: () => string;
  /** Converts a setup name to a URL-safe slug. Injected for determinism in tests. */
  newSlug: (name: string) => string;
  /**
   * Total number of attempts per brief (default: 2).
   * Design: at most 2 attempts per brief — retry at most once, then abandon.
   */
  maxRetries?: number;
}

// ─── Outcome ──────────────────────────────────────────────────────────────────

/** Per-scenario evidence captured during own-scenario evals. */
export interface EvalEntry {
  scenarioId: string;
  pass: boolean;
  /** Short snippet of model output (≤280 chars) for moderator review. */
  outputSnippet: string;
}

/** Brief + per-scenario eval evidence stored with the inserted row (P6-4 moderator queue). */
export interface GenerationMeta {
  brief: Brief;
  evals: EvalEntry[];
}

/** Structured outcome returned for each brief, regardless of pass/fail. */
export interface GenerationOutcome {
  brief: Brief;
  /** 'inserted' = gauntlet passed and a pending row was inserted for human review. */
  status: 'inserted' | 'discarded';
  /** Present only on 'discarded' — the reason from the last failed attempt. */
  reason?: string;
  /** Total attempts made (1 or maxRetries). */
  attempts: number;
  /** Total USD spend across all model calls (generation + evals + safety screen). */
  spendUsd: number;
  /** Present only on 'inserted' — brief + per-scenario eval evidence for P6-4. */
  generationMeta?: GenerationMeta;
}

// ─── Budget helper ────────────────────────────────────────────────────────────

/**
 * Returns true when the current accumulated spend is still below the batch budget.
 * The script calls this before each brief to stop at budget.
 *
 * Pure and deterministic — no I/O.
 */
export function isWithinBudget(currentSpendUsd: number, budgetUsd: number): boolean {
  return currentSpendUsd < budgetUsd;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Mirrors the runner's truncation helper (runner.ts). */
function truncateToTokenCap(text: string, capTokens: number): string {
  const maxChars = capTokens * CHARS_PER_TOKEN;
  return text.length <= maxChars ? text : text.slice(0, maxChars);
}

/**
 * Assembles the system prompt for a scenario eval run.
 * Mirrors runner.ts §9 exactly: compiled instruction + truncated starter knowledge.
 */
function assembleEvalSystemPrompt(compiled: ReturnType<typeof compileSetup>): string {
  const starterContent = compiled.knowledgeFiles
    .filter((f) => f.kind === 'starter')
    .map((f) => f.content)
    .filter(Boolean)
    .join('\n\n');
  const truncatedKnowledge = truncateToTokenCap(starterContent, STARTER_KNOWLEDGE_CAP_TOKENS);
  return truncatedKnowledge.length > 0
    ? `${compiled.instruction}\n\n${truncatedKnowledge}`
    : compiled.instruction;
}

/**
 * Derives default answers for a Setup's variables — same logic as scripts/eval-setups.ts.
 * Used for the compile-with-defaults and own-scenario eval steps.
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

/**
 * Strips markdown code fences and attempts to parse the model's output as JSON.
 * Returns null on any parse failure; the caller treats null as an invalid attempt.
 */
function parseSetupJson(raw: string): unknown {
  // Trim first so leading/trailing whitespace doesn't anchor the fence regex away
  // from the start/end of the meaningful content (e.g. '\n```json\n{...}\n```\n').
  const trimmed = raw.trim();
  // Strip ```json … ``` or ``` … ``` wrappers the model might add.
  const stripped = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
  try {
    return JSON.parse(stripped);
  } catch {
    // Fall back to parsing the pre-trim text directly (model may have omitted fences).
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
}

/**
 * Builds the snake_case DB row for inserting a pending AI-generated setup.
 * Server-owned fields are set here; any model-provided values for these fields
 * were already overwritten on the parsed object before this function is called.
 */
function buildPendingRow(
  setup: Setup,
  safetyScreen: SafetyScreenResult,
  id: string,
  slug: string,
  now: string,
): Record<string, unknown> {
  return {
    id,
    slug,
    name: setup.name,
    tagline: setup.tagline,
    description: setup.description,
    role: setup.role,
    industry: setup.industry ?? null,
    category: setup.category,
    tags: setup.tags,
    // ── Pipeline-enforced fields — never model-set ────────────────────────
    source: 'ai-generated',
    author: null,
    review_status: 'pending',
    version: '0.1.0',
    // ─────────────────────────────────────────────────────────────────────
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: setup.targets,
    tier: setup.tier,
    instruction_template: setup.instructionTemplate,
    variables: setup.variables,
    knowledge_files: setup.knowledgeFiles,
    scenarios: setup.scenarios,
    safety_screen: safetyScreen,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Wraps a ModelClient to accumulate token usage across multiple calls.
 * Used to track spend from generation + scenario evals + safety screen in one place.
 */
function createTrackingClient(
  base: ModelClient,
  accumulate: (inputTokens: number, outputTokens: number) => void,
): ModelClient {
  return {
    async call(params) {
      const usage = await base.call(params);
      accumulate(usage.inputTokens, usage.outputTokens);
      return usage;
    },
  };
}

// ─── Generation prompt ────────────────────────────────────────────────────────

/**
 * System prompt sent to the model for each generation attempt.
 * Describes the complete Setup schema, the no-jargon copy rule, and the
 * structural constraints the validator enforces (so the model's output has a
 * higher chance of passing validateSetup on the first attempt).
 */
const SETUP_GENERATION_SYSTEM_PROMPT = `You are an expert AI assistant setup author for Armory. Armory helps non-technical users (marketers, small business owners, recruiters, etc.) configure AI assistants for their specific roles.

Your task is to output a COMPLETE and VALID Setup JSON object. Return ONLY the JSON object — no explanation, no markdown fences, no prose before or after.

SCHEMA (all fields required unless noted):
{
  "id": "<any non-empty string>",
  "slug": "<lowercase letters, digits, and internal hyphens — e.g. 'marketing-email-assistant'>",
  "name": "<human-readable setup name, 3-8 words>",
  "tagline": "<one clear sentence, 8-15 words, plain English, no jargon>",
  "description": "<2-3 sentences for a non-technical reader>",
  "role": "<human-readable role name>",
  "industry": null,
  "tags": ["<1-5 relevant tags>"],
  "category": "<one of: content, marketing, engineering, design, product, sales, customer-support, finance, legal, hr, operations, research, education, writing, data, devops, general>",
  "source": "ai-generated",
  "author": null,
  "version": "0.1.0",
  "createdAt": "<ISO 8601 timestamp>",
  "updatedAt": "<ISO 8601 timestamp>",
  "reviewStatus": "pending",
  "upvotes": 0,
  "featured": null,
  "targets": ["claude-app"],
  "tier": "core",
  "instructionTemplate": "<Handlebars-style template using {{variableKey}} for replacements and {{#if varKey}}...{{/if}} for conditionals. Write in first person for the AI. Plain language only — no technical jargon.>",
  "variables": [
    {
      "key": "<camelCase key matching template references>",
      "label": "<plain-English label>",
      "type": "<text | multiline | select | multiselect | number | boolean>",
      "options": ["<include when type is select or multiselect>"],
      "default": "<sensible default>",
      "required": true,
      "helpText": "<one-sentence plain-English guidance>"
    }
  ],
  "knowledgeFiles": [],
  "scenarios": [
    {
      "id": "<kebab-case id>",
      "title": "<short title>",
      "userInput": "<realistic user message>",
      "expectedBehavior": "<plain-English description>",
      "mustContain": ["<phrase that MUST appear in the response>"],
      "mustNotContain": ["<phrase that must NOT appear>"]
    }
  ]
}

RULES:
- Every {{variableKey}} in instructionTemplate must be declared in variables.
- No nested {{#if}} blocks.
- Plain English only in labels, helpText, descriptions — no 'utilize', 'leverage', 'synergy'.
- mustContain phrases must be phrases the assistant would realistically say for the given userInput.
- Include 1-3 scenarios that cover realistic tasks for the role.`;

/** Builds the user message for the model from a Brief. */
function buildGenerationUserMessage(brief: Brief): string {
  const lines = [
    `Brief kind: ${brief.kind}`,
    `Role: ${brief.role}`,
    `Industry: ${brief.industry ?? 'general'}`,
  ];
  if (brief.kind === 'variation') {
    lines.push(`Source setup slug: ${brief.sourceSlug}`);
    lines.push(`Variation dimension: ${brief.vary}`);
  }
  if (brief.goalTags.length > 0) {
    lines.push(`Goal tags: ${brief.goalTags.join(', ')}`);
  }
  lines.push('');
  lines.push('Author a complete Setup JSON for the brief above.');
  return lines.join('\n');
}

// ─── Main pipeline ─────────────────────────────────────────────────────────────

/**
 * Runs the generation pipeline for a single brief.
 *
 * Returns a structured outcome — never throws. Caller is responsible for
 * accumulating spend and stopping at batch budget (see isWithinBudget).
 *
 * The gauntlet order (validate → compile → evals → safety → insert) is fixed
 * and enforced in the loop body. No step can be skipped or reordered.
 */
export async function generateSetupFromBrief(
  brief: Brief,
  deps: GenerationDeps,
): Promise<GenerationOutcome> {
  const {
    modelClient,
    insertPendingSetup,
    now,
    newId,
    newSlug,
    maxRetries = 2,
  } = deps;

  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  // Cost-tracking wrapper counts spend from ALL calls: generation + evals + safety screen.
  const trackingClient = createTrackingClient(modelClient, (input, output) => {
    totalInputTokens += input;
    totalOutputTokens += output;
  });

  const generationSystemPrompt = SETUP_GENERATION_SYSTEM_PROMPT;
  const generationUserMessage = buildGenerationUserMessage(brief);

  let lastDiscardReason = 'no attempts completed';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // ── Step 1: Generate ─────────────────────────────────────────────────────

    const chunks: string[] = [];
    try {
      await trackingClient.call({
        systemPrompt: generationSystemPrompt,
        userMessage: generationUserMessage,
        maxTokens: GENERATION_OUTPUT_CAP,
        onChunk: (t) => chunks.push(t),
      });
    } catch (err) {
      lastDiscardReason = `model error on generation: ${err instanceof Error ? err.message : String(err)}`;
      console.error(`[generateSetup] attempt ${attempt}/${maxRetries}: ${lastDiscardReason}`);
      continue;
    }

    const rawOutput = chunks.join('');

    // ── Step 2: Parse JSON ────────────────────────────────────────────────────

    const parsed = parseSetupJson(rawOutput);
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      lastDiscardReason = 'model output could not be parsed as JSON';
      console.error(`[generateSetup] attempt ${attempt}/${maxRetries}: ${lastDiscardReason}`);
      continue;
    }

    // ── Step 3: Overwrite server-owned fields ─────────────────────────────────
    // The model MUST NOT control these. Set them from injected factories / constants.

    const id = newId();
    const candidate = parsed as Record<string, unknown>;
    const setupName = typeof candidate.name === 'string' ? candidate.name : '';
    const slug = newSlug(setupName);

    candidate.source = 'ai-generated';
    candidate.author = null;
    candidate.reviewStatus = 'pending';
    candidate.version = '0.1.0';
    candidate.id = id;
    candidate.slug = slug;
    candidate.createdAt = now;
    candidate.updatedAt = now;

    // ── Step 4: validateSetup ─────────────────────────────────────────────────

    const setup = candidate as unknown as Setup;
    const validation = validateSetup(setup);
    if (!validation.valid) {
      const reasons = validation.errors.map((e) => e.message).join('; ');
      lastDiscardReason = `schema invalid: ${reasons}`;
      console.error(`[generateSetup] attempt ${attempt}/${maxRetries}: discarded — ${lastDiscardReason}`);
      continue;
    }

    // ── Step 5: compileSetup with variable defaults ───────────────────────────

    const defaults = deriveDefaults(setup);
    let compiled: ReturnType<typeof compileSetup>;
    try {
      compiled = compileSetup(setup, defaults);
    } catch (err) {
      lastDiscardReason = `compile error: ${err instanceof Error ? err.message : String(err)}`;
      console.error(`[generateSetup] attempt ${attempt}/${maxRetries}: ${lastDiscardReason}`);
      continue;
    }

    // ── Step 6: Own-scenario evals ────────────────────────────────────────────
    // Mirror the runner's system-prompt assembly. Use assertions.ts checkScenario.
    // Any scenario failing its assertions discards this attempt.

    const evalSystemPrompt = assembleEvalSystemPrompt(compiled);
    let scenarioFailed = false;
    let scenarioFailReason = '';
    const evals: EvalEntry[] = [];

    for (const scenario of setup.scenarios) {
      const evalChunks: string[] = [];
      try {
        await trackingClient.call({
          systemPrompt: evalSystemPrompt,
          userMessage: scenario.userInput,
          maxTokens: OUTPUT_TOKEN_CAP,
          onChunk: (t) => evalChunks.push(t),
        });
      } catch (err) {
        scenarioFailed = true;
        scenarioFailReason = `scenario "${scenario.id}" model error: ${err instanceof Error ? err.message : String(err)}`;
        break;
      }

      const evalOutput = evalChunks.join('');
      const check = checkScenario(evalOutput, scenario);
      // Collect evidence regardless of pass/fail; discarded runs won't use it.
      evals.push({
        scenarioId: scenario.id,
        pass: check.pass,
        outputSnippet: historySnippet(evalOutput),
      });
      if (!check.pass) {
        scenarioFailed = true;
        const failedPhrases = check.failures
          .map((f) => `${f.kind}:"${f.phrase}"`)
          .join(', ');
        scenarioFailReason = `scenario "${scenario.id}" failed assertions: ${failedPhrases}`;
        break;
      }
    }

    if (scenarioFailed) {
      lastDiscardReason = scenarioFailReason;
      console.error(`[generateSetup] attempt ${attempt}/${maxRetries}: discarded — ${lastDiscardReason}`);
      continue;
    }

    // ── Step 7: Safety screen ─────────────────────────────────────────────────
    // A flag marks the row needs-attention for the moderator. It does NOT discard.
    // This mirrors Phase 5 community submission behaviour exactly.

    const safetyScreen = await runSafetyScreen(setup, trackingClient);

    // ── Step 8: Insert pending row ────────────────────────────────────────────

    const row = buildPendingRow(setup, safetyScreen, id, slug, now);
    // generation_meta (jsonb column on setups) carries the originating brief +
    // per-scenario eval evidence for the moderator queue to display.
    const generationMeta: GenerationMeta = { brief, evals };
    row.generation_meta = generationMeta;

    try {
      await insertPendingSetup(row);
    } catch (err) {
      // DB error on insert — structured discard so the batch never crashes.
      return {
        brief,
        status: 'discarded',
        reason: `insert failed: ${err instanceof Error ? err.message : String(err)}`,
        attempts: attempt,
        spendUsd: estimatedCostUsd(totalInputTokens, totalOutputTokens),
      };
    }

    return {
      brief,
      status: 'inserted',
      attempts: attempt,
      spendUsd: estimatedCostUsd(totalInputTokens, totalOutputTokens),
      generationMeta,
    };
  }

  // All attempts exhausted without a successful insertion.
  return {
    brief,
    status: 'discarded',
    reason: lastDiscardReason,
    attempts: maxRetries,
    spendUsd: estimatedCostUsd(totalInputTokens, totalOutputTokens),
  };
}
