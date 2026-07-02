import { describe, it, expect } from 'vitest';
import { collectReferencedKeys } from '@/lib/setup/tokens';

describe('collectReferencedKeys', () => {
  it('plain {{key}} placeholder yields the key', () => {
    expect(collectReferencedKeys('Hello {{name}}!')).toContain('name');
  });

  it('spaced {{ key }} placeholder yields the key', () => {
    expect(collectReferencedKeys('Hello {{ name }}!')).toContain('name');
  });

  it('{{#if key}} conditional yields the key', () => {
    expect(collectReferencedKeys('{{#if hasFoo}}yes{{/if}}')).toContain('hasFoo');
  });

  it('spaced {{#if  key }} conditional yields the key', () => {
    expect(collectReferencedKeys('{{#if  hasFoo }}')).toContain('hasFoo');
  });

  it('{{/if}} closer yields no key', () => {
    expect(collectReferencedKeys('{{/if}}')).toHaveLength(0);
  });

  it('{{else}} yields no key', () => {
    expect(collectReferencedKeys('{{else}}')).toHaveLength(0);
  });

  it('full if/else/endif block yields only the condition key', () => {
    const result = collectReferencedKeys('{{#if x}}a{{else}}b{{/if}}');
    expect(result).toEqual(['x']);
  });

  it('a key referenced twice appears only once (de-duplication)', () => {
    const result = collectReferencedKeys('{{name}} and {{name}}');
    expect(result.filter((k) => k === 'name')).toHaveLength(1);
  });

  it('a key used in both a plain placeholder and an #if appears only once', () => {
    const result = collectReferencedKeys('{{#if topic}}{{topic}}{{/if}}');
    expect(result.filter((k) => k === 'topic')).toHaveLength(1);
  });

  it('multiple distinct keys are all returned', () => {
    const result = collectReferencedKeys('{{a}} and {{b}} and {{c}}');
    expect(result).toContain('a');
    expect(result).toContain('b');
    expect(result).toContain('c');
    expect(result).toHaveLength(3);
  });
});
