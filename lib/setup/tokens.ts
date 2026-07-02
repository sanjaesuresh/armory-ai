/**
 * Shared Handlebars-style template tokenizer and renderer.
 *
 * Exported by lib/setup/tokens.ts and consumed by the validator (Task 4)
 * and the compiler (Task 5).
 */

/**
 * Handlebars control keywords that are never variable keys.
 * `else` appears as a bare token ({{else}}) and must not be treated as a variable.
 * `#if` and `/if` are excluded structurally by the per-regex patterns below.
 */
const CONTROL_KEYWORDS = new Set(['else']);

// ─── Shared regex patterns ────────────────────────────────────────────────────
//
// Defined at module level so collectReferencedKeys and renderTemplate always
// use the exact same patterns — the two functions can never drift.

/**
 * Plain placeholder: {{ key }}  (optional whitespace inside braces)
 * Negative lookahead for `#` and `/` excludes block helpers and closers.
 *
 * NOTE: When used with exec() in a loop, reset lastIndex before the loop.
 * String.replace() resets lastIndex automatically.
 */
const PLAIN_RE = /\{\{\s*(?![#/])([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

/**
 * Conditional opener: {{#if key}}  (one or more spaces before key; optional space before }})
 *
 * NOTE: Reset lastIndex before exec() loops.
 */
const IF_OPENER_RE = /\{\{#if\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

/**
 * Full conditional block: {{#if key}}...{{/if}}
 * Capture groups: 1 = condition key, 2 = inner content (lazy match).
 * Whitespace is tolerated inside all four brace pairs.
 */
const IF_BLOCK_RE = /\{\{#if\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}([\s\S]*?)\{\{\/if\s*\}\}/g;

// ─── collectReferencedKeys ────────────────────────────────────────────────────

/**
 * Returns the distinct variable keys referenced by {{key}} placeholders and
 * {{#if key}} conditionals in a Handlebars-style template.
 *
 * Rules:
 *  - Tolerates optional inner whitespace: `{{ key }}` and `{{#if  key }}` are valid.
 *  - Excludes control tokens: `{{/if}}` and `{{else}}` yield no key.
 *  - Variable keys must match the identifier pattern (letters, digits, underscore;
 *    not starting with a digit).
 *  - Result is de-duplicated — each key appears at most once.
 */
export function collectReferencedKeys(template: string): string[] {
  const keys = new Set<string>();

  // Reset lastIndex before exec() loops (PLAIN_RE and IF_OPENER_RE are module-level).
  PLAIN_RE.lastIndex = 0;
  IF_OPENER_RE.lastIndex = 0;

  let m: RegExpExecArray | null;
  while ((m = PLAIN_RE.exec(template)) !== null) {
    const key = m[1];
    if (!CONTROL_KEYWORDS.has(key)) {
      keys.add(key);
    }
  }

  while ((m = IF_OPENER_RE.exec(template)) !== null) {
    keys.add(m[1]);
  }

  return Array.from(keys);
}

// ─── hasNestedIfBlock ─────────────────────────────────────────────────────────

/**
 * Returns true when the template contains a {{#if}} block nested inside another.
 *
 * Nested conditionals are NOT supported: IF_BLOCK_RE lazy-matches to the first
 * {{/if}}, so a nested block would close the outer block early and leave a
 * literal `{{/if}}` in the rendered output. The validator uses this to reject
 * such templates instead of letting them render incorrectly.
 */
export function hasNestedIfBlock(template: string): boolean {
  const TOKEN_RE = /\{\{#if\b|\{\{\/if/g;
  let depth = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(template)) !== null) {
    if (m[0].startsWith('{{#if')) {
      depth++;
      if (depth > 1) return true;
    } else {
      depth = Math.max(0, depth - 1);
    }
  }
  return false;
}

// ─── formatAnswerValue ────────────────────────────────────────────────────────

/**
 * Formats a single answer value for template substitution.
 *
 * Arrays are expanded as an Oxford-comma list:
 *   - 0 items  → ""
 *   - 1 item   → "X"
 *   - 2 items  → "X and Y"
 *   - 3+ items → "X, Y, and Z"
 *
 * All other values are converted with String().
 */
export function formatAnswerValue(
  value: string | number | boolean | string[]
): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    if (value.length === 1) return value[0];
    if (value.length === 2) return `${value[0]} and ${value[1]}`;
    return `${value.slice(0, -1).join(', ')}, and ${value[value.length - 1]}`;
  }
  return String(value);
}

// ─── renderTemplate ───────────────────────────────────────────────────────────

/**
 * Returns true when a value is considered truthy for {{#if}} evaluation.
 *   - boolean true  → truthy
 *   - non-empty string → truthy
 *   - non-zero number  → truthy
 *   - non-empty array  → truthy
 *   - false, 0, '', [], undefined, null → falsy
 */
function isTruthy(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.length > 0;
  if (typeof value === 'number') return value !== 0;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

/**
 * Renders a Handlebars-style template against the supplied answers.
 *
 * Processing order (uses the same patterns as collectReferencedKeys so the two
 * can never drift):
 *
 *  1. All declared required variables are checked BEFORE rendering. A required
 *     variable with an undefined, null, empty-string, or empty-array answer
 *     throws a descriptive Error naming the variable key.
 *
 *  2. {{#if key}}...{{/if}} blocks are included when the answer is truthy,
 *     omitted (replaced with "") otherwise.
 *
 *  3. {{key}} placeholders are replaced:
 *     - Array values    → Oxford-comma list via formatAnswerValue.
 *     - Control tokens  → "" (e.g. {{else}} is swallowed, not surfaced as a key).
 *     - Missing non-required vars → "".
 *
 * This function is pure and deterministic: no I/O, no Date.now(), no randomness.
 */
export function renderTemplate(
  template: string,
  answers: Readonly<Record<string, string | number | boolean | string[]>>,
  variables: ReadonlyArray<{ key: string; required: boolean }>
): string {
  // 1. Upfront required-variable check.
  for (const v of variables) {
    if (!v.required) continue;
    const val = answers[v.key];
    if (
      val === undefined ||
      val === null ||
      val === '' ||
      (Array.isArray(val) && val.length === 0)
    ) {
      throw new Error(
        `Required variable "${v.key}" has no answer. Provide a value before compiling.`
      );
    }
  }

  // 2. Process conditional blocks.
  // IF_BLOCK_RE is module-level with `g`; String.replace() resets lastIndex automatically.
  let result = template.replace(
    IF_BLOCK_RE,
    (_match, key: string, inner: string) =>
      isTruthy(answers[key]) ? inner : ''
  );

  // 3. Replace plain placeholders (same PLAIN_RE used by collectReferencedKeys).
  result = result.replace(PLAIN_RE, (_match, key: string) => {
    if (CONTROL_KEYWORDS.has(key)) return '';
    const val = answers[key];
    if (val === undefined || val === null) return '';
    return formatAnswerValue(val as string | number | boolean | string[]);
  });

  return result;
}
