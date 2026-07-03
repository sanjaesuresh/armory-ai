/**
 * Scenario assertion checker for the setups-as-evals harness (Task 8).
 *
 * Pure module — no network, no imports of the model client, no side-effects.
 * Safe to import in CI unit tests.
 */

import type { Scenario } from '@/lib/setup/types';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single unmet assertion from checkScenario. */
export interface AssertionFailure {
  /** Whether the failure is a missing mustContain or a present mustNotContain. */
  kind: 'mustContain' | 'mustNotContain';
  /** The exact phrase that failed the check. */
  phrase: string;
}

/** Result returned by checkScenario. */
export interface ScenarioCheckResult {
  /** True when all assertions passed (or when there were no assertions). */
  pass: boolean;
  /**
   * Set when there were no assertion lists — distinguishes a trivial pass
   * from one where assertions were checked and all passed.
   */
  note?: string;
  /** All unmet assertions; empty on pass. */
  failures: AssertionFailure[];
}

// ─── checkScenario ────────────────────────────────────────────────────────────

/**
 * Checks model output against a scenario's mustContain and mustNotContain lists.
 *
 * All checks are case-insensitive substring matches. A scenario with no
 * assertion lists passes trivially and carries a note to that effect.
 *
 * @param output   - The raw model output string to check.
 * @param scenario - The Scenario definition carrying the assertion lists.
 * @returns A ScenarioCheckResult with pass/fail and a list of failures.
 */
export function checkScenario(output: string, scenario: Scenario): ScenarioCheckResult {
  const hasMustContain =
    Array.isArray(scenario.mustContain) && scenario.mustContain.length > 0;
  const hasMustNotContain =
    Array.isArray(scenario.mustNotContain) && scenario.mustNotContain.length > 0;

  if (!hasMustContain && !hasMustNotContain) {
    return {
      pass: true,
      note: 'No assertion lists defined; passes trivially.',
      failures: [],
    };
  }

  const lowerOutput = output.toLowerCase();
  const failures: AssertionFailure[] = [];

  if (hasMustContain) {
    for (const phrase of scenario.mustContain!) {
      if (!lowerOutput.includes(phrase.toLowerCase())) {
        failures.push({ kind: 'mustContain', phrase });
      }
    }
  }

  if (hasMustNotContain) {
    for (const phrase of scenario.mustNotContain!) {
      if (lowerOutput.includes(phrase.toLowerCase())) {
        failures.push({ kind: 'mustNotContain', phrase });
      }
    }
  }

  return {
    pass: failures.length === 0,
    failures,
  };
}
