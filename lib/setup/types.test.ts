import { it, expect, describe } from 'vitest';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';

describe('Setup types and canonical curated fixture', () => {
  it('canonical curated setup conforms to Setup type and required fields', () => {
    // instructionTemplate must be non-empty
    expect(marketingManagerSetup.instructionTemplate).toBeTruthy();
    expect(marketingManagerSetup.instructionTemplate.length).toBeGreaterThan(0);

    // Must have at least two variables
    expect(marketingManagerSetup.variables.length).toBeGreaterThanOrEqual(2);

    // Must cover at least three distinct variable types
    const distinctTypes = new Set(
      marketingManagerSetup.variables.map((v) => v.type)
    );
    expect(distinctTypes.size).toBeGreaterThanOrEqual(3);

    // Must include at least one starter knowledge file (with content)
    const starterFiles = marketingManagerSetup.knowledgeFiles.filter(
      (kf) => kf.kind === 'starter'
    );
    expect(starterFiles.length).toBeGreaterThanOrEqual(1);
    // Starter file must have non-empty content
    for (const kf of starterFiles) {
      if (kf.kind === 'starter') {
        expect(kf.content.length).toBeGreaterThan(0);
      }
    }

    // Must have at least one scenario with mustContain set and non-empty
    const scenariosWithMustContain = marketingManagerSetup.scenarios.filter(
      (s) => Array.isArray(s.mustContain) && s.mustContain.length > 0
    );
    expect(scenariosWithMustContain.length).toBeGreaterThanOrEqual(1);
  });

  it('canonical fixture uses {{brandName}} placeholder in instructionTemplate', () => {
    expect(marketingManagerSetup.instructionTemplate).toContain('{{brandName}}');
  });

  it('canonical fixture uses a {{#if hasBrandVoice}} conditional block', () => {
    expect(marketingManagerSetup.instructionTemplate).toContain('{{#if hasBrandVoice}}');
    expect(marketingManagerSetup.instructionTemplate).toContain('{{/if}}');
  });

  it('canonical fixture uses {{channels}} multiselect placeholder', () => {
    expect(marketingManagerSetup.instructionTemplate).toContain('{{channels}}');
  });

  it('canonical fixture has both a starter and a user-provided knowledge file', () => {
    const kinds = marketingManagerSetup.knowledgeFiles.map((kf) => kf.kind);
    expect(kinds).toContain('starter');
    expect(kinds).toContain('user-provided');
  });
});
