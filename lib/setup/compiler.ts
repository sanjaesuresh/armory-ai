/**
 * Deterministic setup compiler.
 *
 * compileSetup(setup, answers, target?)
 *   Renders a Setup's instructionTemplate against the supplied Answers and
 *   assembles a CompiledSetup ready for export. Pure and deterministic — no
 *   network, no filesystem, no Date.now(), no Math.random().
 *
 * buildSummary(setup, answers)
 *   Returns a plain-English summary string for a non-technical reader.
 *   Also called internally by compileSetup.
 */

import type { Setup, Answers, CompiledSetup, ExportTarget } from '@/lib/setup/types';
import { renderTemplate, formatAnswerValue } from '@/lib/setup/tokens';

// ─── buildSummary ─────────────────────────────────────────────────────────────

/**
 * Produces a plain-English summary of the compiled setup.
 *
 * Structure:
 *  1. Role (and brand name if the answers contain a "brandName" key).
 *  2. One sentence per variable (in declaration order), skipping:
 *     - the "brandName" key (already in the opener), and
 *     - boolean variables whose answer is false (disabled toggles aren't worth
 *       mentioning to a non-technical reader).
 *  3. Knowledge files (name and kind).
 */
export function buildSummary(setup: Setup, answers: Answers): string {
  const parts: string[] = [];

  // 1. Opener: role + optional brand name.
  // CONVENTION: the literal variable key "brandName" is special-cased here.
  // A setup whose primary entity uses another key (companyName, clientName, …)
  // gets the generic "{role} setup." opener. Curated setups should name their
  // primary-entity variable "brandName" to get the personalized opener, or a
  // schema-level primaryVariableKey should replace this if the convention
  // stops fitting.
  const brandName = answers['brandName'];
  if (typeof brandName === 'string' && brandName.length > 0) {
    parts.push(`${setup.role} configured for ${brandName}.`);
  } else {
    parts.push(`${setup.role} setup.`);
  }

  // 2. Variable choices (declaration order).
  for (const variable of setup.variables) {
    if (variable.key === 'brandName') continue; // already in opener

    const value = answers[variable.key];
    if (value === undefined || value === null) continue;

    if (typeof value === 'boolean') {
      if (value) {
        parts.push(`${variable.label}: on.`);
      }
      // false → skip (disabled toggles are not surfaced)
      continue;
    }

    const formatted = formatAnswerValue(value as string | number | string[]);
    if (formatted.length > 0) {
      parts.push(`${variable.label}: ${formatted}.`);
    }
  }

  // 3. Knowledge files.
  if (setup.knowledgeFiles.length > 0) {
    const names = setup.knowledgeFiles
      .map((f) => `${f.name} (${f.kind})`)
      .join(', ');
    parts.push(`Knowledge files: ${names}.`);
  }

  return parts.join(' ');
}

// ─── compileSetup ─────────────────────────────────────────────────────────────

/**
 * Compiles a Setup against the supplied Answers into a CompiledSetup.
 *
 * @param setup   - The Setup definition (instructionTemplate, variables, knowledgeFiles).
 * @param answers - User-supplied variable values. Required variables with no
 *                  answer cause an Error to be thrown (naming the key).
 * @param target  - Export target; defaults to 'claude-app'.
 * @returns A CompiledSetup. Given the same inputs the output is always deeply equal.
 *
 * @throws {Error} When a required variable has no answer (undefined / empty).
 */
export function compileSetup(
  setup: Setup,
  answers: Answers,
  target: ExportTarget = 'claude-app'
): CompiledSetup {
  // Render the instruction template (throws if a required variable is missing).
  const instruction = renderTemplate(
    setup.instructionTemplate,
    answers,
    setup.variables
  );

  // Build the knowledge-file output array.
  // Starter files carry their bundled content through.
  // User-provided files always have empty content here — the client injects the
  // user's upload after export (that is a later task).
  const knowledgeFiles = setup.knowledgeFiles.map((f) => {
    if (f.kind === 'starter') {
      return { name: f.name, content: f.content, kind: 'starter' as const };
    }
    return { name: f.name, content: '', kind: 'user-provided' as const };
  });

  return {
    instruction,
    knowledgeFiles,
    summary: buildSummary(setup, answers),
    meta: {
      setupId: setup.id,
      name: setup.name,
      version: setup.version,
      target,
    },
    inputs: { ...answers },
  };
}
