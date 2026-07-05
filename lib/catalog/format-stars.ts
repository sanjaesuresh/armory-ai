/**
 * formatStars — compact GitHub star count formatter.
 *
 * Rules:
 *   < 1 000          → integer as-is        ("268")
 *   1 000–999 999    → compact k notation   ("1.6k", "247k")
 *                      Values < 10k show one decimal place; ≥10k show integer.
 *                      Trailing ".0" is omitted (e.g. 2000 → "2k", not "2.0k").
 *   ≥ 1 000 000      → integer m notation   ("1m")
 */
export function formatStars(n: number): string {
  if (n >= 1_000_000) {
    return `${Math.round(n / 1_000_000)}m`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    if (k >= 10) {
      // Large k values: round to nearest integer
      return `${Math.round(k)}k`;
    }
    // Small k values (1–9.9): one decimal place, drop trailing .0
    const rounded = Math.round(k * 10) / 10;
    // JS number-to-string drops trailing zeros, so 2.0 → "2", 1.6 → "1.6"
    return `${rounded}k`;
  }
  return `${n}`;
}
