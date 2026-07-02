import { describe, it, expect } from 'vitest';
import { compileSetup } from '@/lib/setup/compiler';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import { PARITY_ANSWERS } from '@/tests/fixtures/parityAnswers';

// Node-level determinism/sanity checks for compileSetup.
// The client/server parity guarantee is tested in e2e/parity.spec.ts (browser bundle).

describe('compileSetup determinism sanity (Node)', () => {
  it('returns a non-empty instruction', () => {
    const compiled = compileSetup(marketingManagerSetup, PARITY_ANSWERS);
    expect(compiled.instruction.length).toBeGreaterThan(0);
    expect(compiled.instruction).toContain('Acme Corp');
  });

  it('returns a non-empty summary', () => {
    const compiled = compileSetup(marketingManagerSetup, PARITY_ANSWERS);
    expect(compiled.summary.length).toBeGreaterThan(0);
    expect(compiled.summary).toContain('Marketing Manager');
  });

  it('is deterministic — same inputs produce identical output', () => {
    const first = compileSetup(marketingManagerSetup, PARITY_ANSWERS);
    const second = compileSetup(marketingManagerSetup, PARITY_ANSWERS);
    expect(first.instruction).toBe(second.instruction);
    expect(first.summary).toBe(second.summary);
  });
});
