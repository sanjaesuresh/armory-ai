/**
 * Test-drive runner (Task 6).
 *
 * Orchestrates the full test-drive flow with all dependencies injected:
 *   validate request shape → flag check → meter check → load setup →
 *   guard (curated + approved) → compile → cache lookup → input cap →
 *   model call (streamed via onChunk) → record usage → fill cache.
 *
 * Every failure maps to a typed RunnerOutcome; raw provider errors never
 * leave this module. The ModelClient interface is the only seam the real
 * Anthropic SDK sits behind — tests use an in-memory double.
 *
 * IMPORTANT: this module is server-only. It must never be imported from a
 * client component or any file that ships to the browser.
 */

import type { FlagChecker } from './flags';
import type { MeterDataSource } from './meter';
import type { CacheDataSource } from './cache';
import type { CatalogDataSource } from '@/lib/catalog/repository';
import type { Answers } from '@/lib/setup/types';
import type { MeterDenialReason } from './types';
import type { RecordRunInput } from '@/lib/saved/testDriveHistory';
import { checkMeter, recordUsage } from './meter';
import { cacheKeyFor, getCached, putCached } from './cache';
import { compileSetup } from '@/lib/setup/compiler';
import {
  MODEL_ID,
  INPUT_TOKEN_CAP,
  OUTPUT_TOKEN_CAP,
  STARTER_KNOWLEDGE_CAP_TOKENS,
  CHARS_PER_TOKEN,
  estimatedCostUsd,
} from './modelConfig';

// ─── Public interfaces ────────────────────────────────────────────────────────

/**
 * The wire shape of a test-drive request.
 * All values arrive from untrusted client input and are validated before use.
 */
export interface TestDriveRequest {
  slug: string;
  /** Untrusted: validated to ensure values are string | number | boolean | string[]. */
  answers: Record<string, unknown>;
  scenarioId: string;
}

/**
 * The token and cost snapshot for a completed (or cached) run.
 * Matches the wire contract's `usage` field.
 */
export interface TestDriveUsage {
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
}

/** A completed test-drive result (success or cache hit). */
export interface TestDriveResult {
  scenarioId: string;
  output: string;
  cached: boolean;
  usage: TestDriveUsage;
}

/**
 * Injected model client interface.
 * The real implementation wraps the Anthropic SDK; the test double is an
 * in-memory stub. CI must never call through to the network.
 */
export interface ModelClient {
  /**
   * Sends a message to the model and streams text deltas via `onChunk`.
   * Resolves with the true token counts from the API response when done.
   * Throws on provider error, timeout, or rate-limit; the caller maps these
   * to a friendly RunnerOutcome.
   */
  call(params: {
    systemPrompt: string;
    userMessage: string;
    maxTokens: number;
    onChunk: (text: string) => void;
  }): Promise<{ inputTokens: number; outputTokens: number }>;
}

/** All dependencies the runner needs — fully injectable for tests. */
export interface RunnerDeps {
  /** Flag checker (wraps env + kill-switch config row). */
  flagChecker: FlagChecker;
  /** Resolved anon-session token (already issued / validated by the route). */
  token: string;
  /** Salted HMAC-SHA-256 hex digest of the client IP (never the raw IP). */
  ipHash: string;
  /** Meter data source for cap checks and usage recording. */
  meterDataSource: MeterDataSource;
  /** Cache data source for hit lookup and result storage. */
  cacheDataSource: CacheDataSource;
  /** Catalog data source for setup loading. */
  catalogDataSource: CatalogDataSource;
  /** Model client (real SDK adapter in prod; stub in tests). */
  modelClient: ModelClient;
  /**
   * The signed-in user's id, when the run happens in a session. Drives the
   * union metering cap and history attribution. Absent for anonymous runs.
   */
  userId?: string;
  /**
   * Records signed-in test-drive history. Only used when `userId` is also set.
   * Recording is best-effort — a failure never fails the run.
   */
  historyRecorder?: HistoryRecorder;
  /** ISO UTC string for "now"; defaults to new Date().toISOString(). */
  now?: string;
  /** Epoch ms for "now"; defaults to Date.now(). */
  nowMs?: number;
}

/** Minimal seam for recording test-drive history (see lib/saved/testDriveHistory). */
export interface HistoryRecorder {
  record(input: RecordRunInput): Promise<void>;
}

// ─── Outcome union ────────────────────────────────────────────────────────────

/** Every possible outcome of runTestDrive. Maps 1-to-1 to Section 8 states. */
export type RunnerOutcome =
  | { kind: 'flag-off' }
  | { kind: 'denied'; reason: MeterDenialReason; retryAt?: string }
  | { kind: 'validation-error'; message: string }
  | { kind: 'setup-not-found' }
  | { kind: 'setup-refused' }
  | { kind: 'input-cap'; estimatedTokens: number }
  | { kind: 'model-error'; message: string }
  | { kind: 'success'; result: TestDriveResult }
  | { kind: 'cache-hit'; result: TestDriveResult };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Conservative network-free token estimate: chars / CHARS_PER_TOKEN.
 * Deliberately under-estimates token counts to give a safe upper bound on
 * how many tokens the input will consume (shorter avg char/token → more tokens
 * predicted → safer cap enforcement).
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/**
 * Truncates `text` to at most `capTokens` tokens using the same conservative
 * char-based estimate. Returns the full text if it is within the cap.
 */
function truncateToTokenCap(text: string, capTokens: number): string {
  const maxChars = capTokens * CHARS_PER_TOKEN;
  return text.length <= maxChars ? text : text.slice(0, maxChars);
}

/**
 * Validates that the `answers` map contains only allowed value types.
 * Each value must be string | number | boolean | string[].
 * Returns the validated answers cast to the Answers type, or null on failure.
 */
function validateAnswers(raw: Record<string, unknown>): Answers | null {
  for (const value of Object.values(raw)) {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      continue;
    }
    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      continue;
    }
    return null; // Illegal value type
  }
  return raw as Answers;
}

// ─── Main runner ──────────────────────────────────────────────────────────────

/**
 * Runs one test-drive scenario end-to-end.
 *
 * @param request  - The client request (validated internally before any I/O).
 * @param deps     - All injectable dependencies.
 * @param onChunk  - Optional callback invoked for each text chunk from the model.
 *                   Only called on a live (non-cached) model run.
 * @returns        A typed RunnerOutcome — never throws.
 */
export async function runTestDrive(
  request: TestDriveRequest,
  deps: RunnerDeps,
  onChunk?: (chunk: string) => void,
): Promise<RunnerOutcome> {
  const {
    flagChecker,
    token,
    ipHash,
    meterDataSource,
    cacheDataSource,
    catalogDataSource,
    modelClient,
    userId,
    historyRecorder,
  } = deps;

  const now = deps.now ?? new Date().toISOString();
  const nowMs = deps.nowMs ?? Date.now();

  // ── 1. Validate request answers ──────────────────────────────────────────

  const validatedAnswers = validateAnswers(request.answers);
  if (validatedAnswers === null) {
    return {
      kind: 'validation-error',
      message:
        'Answers must be a plain object whose values are string, number, boolean, or string[].',
    };
  }

  // ── 2. Flag check ────────────────────────────────────────────────────────

  const enabled = await flagChecker.isTestDriveEnabled();
  if (!enabled) {
    return { kind: 'flag-off' };
  }

  // ── 3. Meter check ───────────────────────────────────────────────────────

  const meterDecision = await checkMeter({ token, ipHash, now, dataSource: meterDataSource, userId });
  if (!meterDecision.allowed) {
    return {
      kind: 'denied',
      reason: meterDecision.reason!,
      retryAt: meterDecision.retryAt,
    };
  }

  // ── 4. Load setup ────────────────────────────────────────────────────────

  let setup;
  try {
    setup = await catalogDataSource.getSetupBySlug(request.slug);
  } catch (err) {
    console.error('[runner] catalog lookup failed:', err);
    return { kind: 'model-error', message: "Test-drive couldn't run, try again." };
  }

  if (!setup) {
    return { kind: 'setup-not-found' };
  }

  // ── 5. Guard: curated + approved only ────────────────────────────────────

  if (setup.source !== 'curated' || setup.reviewStatus !== 'approved') {
    return { kind: 'setup-refused' };
  }

  // ── 6. Validate scenarioId ───────────────────────────────────────────────

  const scenario = setup.scenarios.find((s) => s.id === request.scenarioId);
  if (!scenario) {
    return {
      kind: 'validation-error',
      message: `Scenario "${request.scenarioId}" was not found on this setup.`,
    };
  }

  // Best-effort history recording for signed-in runs (cache hit or live). Never
  // fails the run; anonymous runs (no userId / no recorder) record nothing.
  async function recordHistory(output: string, cached: boolean): Promise<void> {
    if (!userId || !historyRecorder) return;
    try {
      await historyRecorder.record({
        userId,
        setupSlug: setup!.slug,
        setupName: setup!.name,
        scenarioId: scenario!.id,
        scenarioTitle: scenario!.title,
        output,
        cached,
        createdAt: now,
      });
    } catch (err) {
      console.error('[runner] history record failed:', err);
    }
  }

  // ── 7. Compile setup ─────────────────────────────────────────────────────

  let compiled;
  try {
    compiled = compileSetup(setup, validatedAnswers);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { kind: 'validation-error', message };
  }

  // ── 8. Cache lookup ──────────────────────────────────────────────────────

  const tokenCaps = { inputCap: INPUT_TOKEN_CAP, outputCap: OUTPUT_TOKEN_CAP };
  const cacheKey = cacheKeyFor(compiled, scenario.id, MODEL_ID, tokenCaps);
  const cached = await getCached(cacheKey, cacheDataSource, nowMs);

  if (cached) {
    await recordHistory(cached.output, true);
    return {
      kind: 'cache-hit',
      result: {
        scenarioId: scenario.id,
        output: cached.output,
        cached: true,
        usage: cached.usage,
      },
    };
  }

  // ── 9. Build system prompt ───────────────────────────────────────────────

  // Append starter-knowledge content (truncated to 4k-token cap).
  // User-provided files are always excluded — they stay on the user's device.
  const starterContent = compiled.knowledgeFiles
    .filter((f) => f.kind === 'starter')
    .map((f) => f.content)
    .filter(Boolean)
    .join('\n\n');

  const truncatedKnowledge = truncateToTokenCap(starterContent, STARTER_KNOWLEDGE_CAP_TOKENS);

  const systemPrompt = truncatedKnowledge.length > 0
    ? `${compiled.instruction}\n\n${truncatedKnowledge}`
    : compiled.instruction;

  const userMessage = scenario.userInput;

  // ── 10. Input cap check (network-free, before any model call) ────────────

  const estimatedInputTokens = estimateTokens(systemPrompt + userMessage);
  if (estimatedInputTokens > INPUT_TOKEN_CAP) {
    return { kind: 'input-cap', estimatedTokens: estimatedInputTokens };
  }

  // ── 11. Model call ───────────────────────────────────────────────────────

  const chunks: string[] = [];
  let modelUsage: { inputTokens: number; outputTokens: number };

  try {
    modelUsage = await modelClient.call({
      systemPrompt,
      userMessage,
      maxTokens: OUTPUT_TOKEN_CAP,
      onChunk: (chunk) => {
        chunks.push(chunk);
        onChunk?.(chunk);
      },
    });
  } catch (err) {
    // Raw provider error never reaches the client.
    console.error('[runner] model call failed:', err);
    return { kind: 'model-error', message: "Test-drive couldn't run, try again." };
  }

  // ── 12. Record usage row ─────────────────────────────────────────────────

  const cost = estimatedCostUsd(modelUsage.inputTokens, modelUsage.outputTokens);
  const usageRow = {
    token,
    ipHash,
    inputTokens: modelUsage.inputTokens,
    outputTokens: modelUsage.outputTokens,
    estimatedCostUsd: cost,
    createdAt: now,
    // Attribute signed-in runs so union metering and the merge stay consistent.
    ...(userId ? { userId } : {}),
  };

  try {
    await recordUsage(usageRow, meterDataSource);
  } catch (err) {
    // Non-fatal: log and continue — the run succeeded even if the row failed.
    console.error('[runner] recordUsage failed:', err);
  }

  // ── 13. Fill cache ───────────────────────────────────────────────────────

  const output = chunks.join('');
  const usageSnapshot = {
    inputTokens: modelUsage.inputTokens,
    outputTokens: modelUsage.outputTokens,
    estimatedCostUsd: cost,
  };

  try {
    await putCached(
      cacheKey,
      { output, usage: usageSnapshot, createdAt: now },
      cacheDataSource,
      nowMs,
    );
  } catch (err) {
    // Non-fatal: log and continue.
    console.error('[runner] putCached failed:', err);
  }

  await recordHistory(output, false);

  return {
    kind: 'success',
    result: {
      scenarioId: scenario.id,
      output,
      cached: false,
      usage: usageSnapshot,
    },
  };
}
