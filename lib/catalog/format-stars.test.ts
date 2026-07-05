/**
 * Tests for lib/catalog/format-stars.ts — compact star count formatter.
 *
 * TDD step 1: written before the implementation module exists.
 * Running this file with the module absent is the RED state.
 */

import { describe, it, expect } from 'vitest';
import { formatStars } from './format-stars';

describe('formatStars', () => {
  it('renders 246793 as "247k"', () => {
    expect(formatStars(246793)).toBe('247k');
  });

  it('renders 1606 as "1.6k"', () => {
    expect(formatStars(1606)).toBe('1.6k');
  });

  it('renders 268 as "268"', () => {
    expect(formatStars(268)).toBe('268');
  });

  it('renders 1000000 as "1m"', () => {
    expect(formatStars(1000000)).toBe('1m');
  });
});
