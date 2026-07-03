/**
 * Tests for the scenario assertion checker (Task 8).
 * Pure module — no network, no model client.
 */

import { describe, it, expect } from 'vitest';
import { checkScenario } from './assertions';
import type { Scenario } from '@/lib/setup/types';

/** Builds a Scenario with optional assertion lists; other fields are filler. */
function makeScenario(partial: Partial<Scenario>): Scenario {
  return {
    id: 'scenario-1',
    title: 'Test scenario',
    userInput: 'Write a launch email.',
    expectedBehavior: 'A friendly email.',
    ...partial,
  };
}

describe('checkScenario', () => {
  it('passes when all mustContain phrases are present', () => {
    const scenario = makeScenario({ mustContain: ['Instagram', 'LinkedIn'] });
    const result = checkScenario('Post to Instagram and LinkedIn today.', scenario);
    expect(result.pass).toBe(true);
    expect(result.failures).toEqual([]);
  });

  it('fails naming each missing mustContain phrase', () => {
    const scenario = makeScenario({ mustContain: ['Instagram', 'TikTok'] });
    const result = checkScenario('Post to Instagram only.', scenario);
    expect(result.pass).toBe(false);
    expect(result.failures).toEqual([{ kind: 'mustContain', phrase: 'TikTok' }]);
  });

  it('fails naming each present mustNotContain phrase', () => {
    const scenario = makeScenario({ mustNotContain: ['discount', 'free'] });
    const result = checkScenario('Enjoy this free trial.', scenario);
    expect(result.pass).toBe(false);
    expect(result.failures).toEqual([{ kind: 'mustNotContain', phrase: 'free' }]);
  });

  it('is case-insensitive for both list kinds', () => {
    const scenario = makeScenario({
      mustContain: ['instagram'],
      mustNotContain: ['SPAM'],
    });
    const result = checkScenario('Post to INSTAGRAM. Not spam.', scenario);
    // "instagram" present (case-insensitive) → mustContain ok;
    // "spam" present (case-insensitive) → mustNotContain violated.
    expect(result.pass).toBe(false);
    expect(result.failures).toEqual([{ kind: 'mustNotContain', phrase: 'SPAM' }]);
  });

  it('passes trivially with a note when there are no assertion lists', () => {
    const result = checkScenario('anything at all', makeScenario({}));
    expect(result.pass).toBe(true);
    expect(result.failures).toEqual([]);
    expect(result.note).toBeTruthy();
  });

  it('reports both a missing mustContain and a present mustNotContain together', () => {
    const scenario = makeScenario({
      mustContain: ['LinkedIn'],
      mustNotContain: ['clickbait'],
    });
    const result = checkScenario('This is pure clickbait.', scenario);
    expect(result.pass).toBe(false);
    expect(result.failures).toEqual([
      { kind: 'mustContain', phrase: 'LinkedIn' },
      { kind: 'mustNotContain', phrase: 'clickbait' },
    ]);
  });
});
