/**
 * Real Anthropic-backed ModelClient for the test-drive runner.
 *
 * SERVER ONLY — imports the Anthropic SDK and reads ANTHROPIC_API_KEY. Never
 * import from a client component. Shared by the live route
 * (app/api/test-drive/route.ts) and the eval harness (scripts/eval-setups.ts)
 * so both exercise the exact same model-call configuration — the drift check is
 * only meaningful if it matches production byte-for-byte.
 *
 * Thinking is disabled with low-effort output: the fastest, cheapest,
 * non-reasoning preview profile for Sonnet 4.6 (per the claude-api skill).
 */

import Anthropic from '@anthropic-ai/sdk';
import { MODEL_ID } from './modelConfig';
import type { ModelClient } from './runner';

export function createAnthropicModelClient(): ModelClient {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');

  const client = new Anthropic({ apiKey });

  return {
    async call({ systemPrompt, userMessage, maxTokens, onChunk }) {
      const stream = client.messages.stream({
        model: MODEL_ID,
        max_tokens: maxTokens,
        thinking: { type: 'disabled' },
        output_config: { effort: 'low' },
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      stream.on('text', (delta) => {
        onChunk(delta);
      });

      const finalMsg = await stream.finalMessage();
      return {
        inputTokens: finalMsg.usage.input_tokens,
        outputTokens: finalMsg.usage.output_tokens,
      };
    },
  };
}
