/**
 * Returns true when a form answer is considered empty and cannot satisfy a
 * required field.  Note the explicit non-empty cases:
 *   - `false` (boolean) → NOT empty (user chose "No")
 *   - `0`  (number)    → NOT empty (user entered zero)
 */
export function isAnswerEmpty(val: unknown): boolean {
  if (val === undefined || val === null) return true;
  if (Array.isArray(val)) return (val as unknown[]).length === 0;
  if (typeof val === 'string') return val.trim() === '';
  return false;
}
