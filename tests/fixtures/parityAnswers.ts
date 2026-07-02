import type { Answers } from '@/lib/setup/types';

/**
 * The single fixed answers object used by all parity checks:
 *   - app/dev/parity/page.tsx   (client-side compile, browser bundle)
 *   - e2e/parity.spec.ts        (client vs. server byte-for-byte comparison)
 *   - tests/compiler-determinism.test.ts (Node-level sanity)
 *
 * One shared constant so the client page and the e2e spec can never drift —
 * a divergence would make the parity comparison silently meaningless.
 */
export const PARITY_ANSWERS: Answers = {
  brandName: 'Acme Corp',
  hasBrandVoice: false,
  channels: ['Email', 'Instagram', 'LinkedIn'],
  tone: 'Professional',
};
