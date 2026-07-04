/**
 * Server-side model pricing and cap configuration for the test-drive runner.
 *
 * Model verified 2026-07-02 via Anthropic's API pricing page:
 *   https://www.anthropic.com/pricing#anthropic-api
 *   claude-sonnet-4-6 — $3.00 / 1M input tokens, $15.00 / 1M output tokens
 *
 * DECISION A in 06a-metering-spec.md §0A approved claude-sonnet-4-6 as the
 * runner model. Caps from 06a-metering-spec.md §2.
 *
 * If pricing or the model id changes, update this file and the comment above.
 * The runner reads only from this module — never hard-coded values elsewhere.
 */

/** Model id passed to the Anthropic API on every test-drive call. */
export const MODEL_ID = 'claude-sonnet-4-6';

/** USD charged per 1 million input tokens. */
export const INPUT_PRICE_PER_1M_USD = 3.0;

/** USD charged per 1 million output tokens. */
export const OUTPUT_PRICE_PER_1M_USD = 15.0;

/**
 * Input token cap (spec §2: 8 000 tokens).
 * Requests whose estimated system-prompt + user-message token count exceeds
 * this value are rejected before any model call.
 */
export const INPUT_TOKEN_CAP = 8_000;

/**
 * Output token cap (spec §2: 700 tokens).
 * Passed as `max_tokens` to every model call.
 */
export const OUTPUT_TOKEN_CAP = 700;

/**
 * Max tokens of starter-knowledge content appended to the system prompt
 * (spec §2: 4 000 tokens). Content is truncated to this before the total
 * input cap is checked.
 */
export const STARTER_KNOWLEDGE_CAP_TOKENS = 4_000;

/**
 * Conservative chars-per-token estimate used for the network-free input-cap
 * check (1 token ≈ 4 chars; this ratio deliberately underestimates token
 * counts to give a safe upper bound).
 */
export const CHARS_PER_TOKEN = 4;

/**
 * Output token cap for AI-generated Setup JSON (Phase 6).
 * A full Setup object is substantially larger than a test-drive reply, so it
 * gets its own higher cap distinct from the test-drive OUTPUT_TOKEN_CAP (700).
 */
export const GENERATION_OUTPUT_CAP = 4_096;

/**
 * Returns the estimated cost in USD for a completed run given true token counts.
 * Used to populate the usage row and the `estimatedCostUsd` field on results.
 */
export function estimatedCostUsd(inputTokens: number, outputTokens: number): number {
  return (inputTokens / 1e6) * INPUT_PRICE_PER_1M_USD +
         (outputTokens / 1e6) * OUTPUT_PRICE_PER_1M_USD;
}
