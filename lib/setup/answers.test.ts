import { describe, it, expect } from 'vitest';
import { isAnswerEmpty } from './answers';

describe('isAnswerEmpty', () => {
  it('treats undefined as empty', () => expect(isAnswerEmpty(undefined)).toBe(true));
  it('treats null as empty', () => expect(isAnswerEmpty(null)).toBe(true));
  it('treats empty string as empty', () => expect(isAnswerEmpty('')).toBe(true));
  it('treats whitespace-only string as empty', () => expect(isAnswerEmpty('   ')).toBe(true));
  it('treats empty array as empty', () => expect(isAnswerEmpty([])).toBe(true));

  it('treats false boolean as NOT empty (user chose No)', () => expect(isAnswerEmpty(false)).toBe(false));
  it('treats 0 number as NOT empty (user entered zero)', () => expect(isAnswerEmpty(0)).toBe(false));
  it('treats non-empty string as NOT empty', () => expect(isAnswerEmpty('hello')).toBe(false));
  it('treats non-empty array as NOT empty', () => expect(isAnswerEmpty(['a'])).toBe(false));
  it('treats true boolean as NOT empty', () => expect(isAnswerEmpty(true)).toBe(false));
  it('treats positive number as NOT empty', () => expect(isAnswerEmpty(42)).toBe(false));
});
