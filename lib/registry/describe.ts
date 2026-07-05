/**
 * AI-describe pipeline (Phase 8 Task 8).
 *
 * describeArtifact(input, deps) reads uploaded artifact files and drafts
 * listing copy (name / tagline / description / capabilities) for the author to
 * review and edit before submitting. It is a convenience, never a gate.
 *
 * Design constraints (all enforced here, verified in tests):
 *   - Per-file prompt content truncated at first 20,000 characters.
 *   - Output tokens bounded at ~1,000.
 *   - name   ≤ 60 chars  (truncated if over).
 *   - tagline ≤ 120 chars (truncated if over).
 *   - capabilities ≤ 10 entries (cut if over).
 *   - One retry on unparseable output (maxRetries = 1 = one retry, two total calls).
 *   - Returns { ok:false, code:'model-failure' }  on model throw (no retry).
 *   - Returns { ok:false, code:'unparseable' }     when all attempts fail to parse.
 *   - NEVER touches the database — no network seam besides modelClient.
 *
 * SERVER ONLY — imports @/lib/testdrive/runner (server-only) for ModelClient.
 */

import type { ModelClient } from '@/lib/testdrive/runner';
import type { SetupKind, Capability } from '@/lib/setup/types';
import { estimatedCostUsd } from '@/lib/testdrive/modelConfig';

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Max characters of each file's content included in the prompt. */
export const FILE_CONTENT_TRUNCATION_CHARS = 20_000;

/** Max output tokens requested from the model. */
export const DESCRIBE_OUTPUT_TOKEN_CAP = 1_000;

/** Max characters for the generated name field (truncated if over). */
export const NAME_MAX_CHARS = 60;

/** Max characters for the generated tagline field (truncated if over). */
export const TAGLINE_MAX_CHARS = 120;

/** Max capabilities entries in the draft (cut if over). */
export const CAPABILITIES_MAX = 10;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArtifactFileInput {
  /** Plain file name (e.g. "README.md"). */
  name: string;
  /** Raw UTF-8 text content. Truncated to FILE_CONTENT_TRUNCATION_CHARS before prompting. */
  content: string;
}

export interface DescribeInput {
  /** Registry kind: 'agent', 'skill', or 'harness'. */
  kind: SetupKind;
  /** The uploaded artifact files for this item. */
  files: ArtifactFileInput[];
}

/** The AI-drafted listing fields the author edits before submitting. */
export interface DraftListing {
  name: string;
  tagline: string;
  description: string;
  capabilities: Capability[];
}

export interface DescribeDeps {
  /** The only network seam. Mocked in tests; real Anthropic SDK in prod. */
  modelClient: ModelClient;
  /** ISO UTC timestamp for "now" — injected for consistency with other pipeline deps. */
  now: string;
  /**
   * Number of retries allowed on unparseable output (default: 1).
   * Total model calls = 1 (initial) + maxRetries.
   */
  maxRetries?: number;
}

export type DescribeResult =
  | { ok: true; draft: DraftListing; spendUsd: number }
  | { ok: false; code: 'model-failure' | 'unparseable' };

// ─── Prompt assembly ──────────────────────────────────────────────────────────

const DESCRIBE_SYSTEM_PROMPT = `You are an expert at writing listing copy for Armory, a directory of AI agents, skills, and harnesses.

Given one or more artifact files for a registry item, output a JSON object with exactly these fields:
- "name": a short, clear name for this item (max 60 characters)
- "tagline": a single sentence describing what this item does (max 120 characters)
- "description": 2-4 sentences explaining what this item does and who it helps
- "capabilities": an array of objects with "command" (string) and "description" (string) fields (max 10 entries), listing the main commands or features this item exposes

Return ONLY the raw JSON object — no explanation, no markdown fences, no surrounding prose.`;

/** Builds the user message for the model, with file contents truncated. */
function buildDescribeUserMessage(input: DescribeInput): string {
  const lines: string[] = [
    `Kind: ${input.kind}`,
    '',
    'Artifact files:',
    '',
  ];

  for (const file of input.files) {
    const content =
      file.content.length > FILE_CONTENT_TRUNCATION_CHARS
        ? file.content.slice(0, FILE_CONTENT_TRUNCATION_CHARS)
        : file.content;
    lines.push(`--- ${file.name} ---`);
    lines.push(content);
    lines.push('');
  }

  lines.push('Generate the listing copy JSON for the artifact above.');
  return lines.join('\n');
}

// ─── JSON parsing ─────────────────────────────────────────────────────────────

/**
 * Strips markdown code fences and attempts to parse the model's output as a
 * DraftListing. Returns null on any parse failure or missing required fields.
 */
function parseDraftJson(raw: string): DraftListing | null {
  const trimmed = raw.trim();
  // Strip ```json … ``` or ``` … ``` wrappers the model might add.
  const stripped = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return null;
    }
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return null;
  }

  const obj = parsed as Record<string, unknown>;

  // Require all three string fields.
  if (
    typeof obj.name !== 'string' ||
    typeof obj.tagline !== 'string' ||
    typeof obj.description !== 'string'
  ) {
    return null;
  }

  // capabilities is optional — default to empty array if absent or malformed.
  const rawCaps = Array.isArray(obj.capabilities) ? obj.capabilities : [];
  const capabilities: Capability[] = rawCaps
    .filter(
      (c): c is { command: string; description: string } =>
        typeof c === 'object' &&
        c !== null &&
        typeof (c as Record<string, unknown>).command === 'string' &&
        typeof (c as Record<string, unknown>).description === 'string',
    )
    .slice(0, CAPABILITIES_MAX);

  return {
    name: obj.name.slice(0, NAME_MAX_CHARS),
    tagline: obj.tagline.slice(0, TAGLINE_MAX_CHARS),
    description: obj.description,
    capabilities,
  };
}

// ─── Main function ────────────────────────────────────────────────────────────

/**
 * Runs the AI-describe pipeline for a single registry item.
 *
 * Returns a structured result — never throws. The caller (the route handler)
 * records usage and returns the draft or drops to manual mode on failure.
 *
 * DB is never touched here; describeArtifact is a pure pipeline function with
 * a single network seam (modelClient).
 */
export async function describeArtifact(
  input: DescribeInput,
  deps: DescribeDeps,
): Promise<DescribeResult> {
  const { modelClient, maxRetries = 1 } = deps;

  const systemPrompt = DESCRIBE_SYSTEM_PROMPT;
  const userMessage = buildDescribeUserMessage(input);

  // Total attempts = 1 initial + maxRetries retries.
  const totalAttempts = 1 + maxRetries;

  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  for (let attempt = 1; attempt <= totalAttempts; attempt++) {
    const chunks: string[] = [];

    try {
      const usage = await modelClient.call({
        systemPrompt,
        userMessage,
        maxTokens: DESCRIBE_OUTPUT_TOKEN_CAP,
        onChunk: (t) => chunks.push(t),
      });
      totalInputTokens += usage.inputTokens;
      totalOutputTokens += usage.outputTokens;
    } catch {
      // Model throw → model-failure, no retry.
      return { ok: false, code: 'model-failure' };
    }

    const rawOutput = chunks.join('');
    const draft = parseDraftJson(rawOutput);

    if (draft !== null) {
      return {
        ok: true,
        draft,
        spendUsd: estimatedCostUsd(totalInputTokens, totalOutputTokens),
      };
    }
    // Unparseable — retry if attempts remain.
  }

  return { ok: false, code: 'unparseable' };
}
