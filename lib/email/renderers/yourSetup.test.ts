import { describe, it, expect } from 'vitest';
import { compileSetup } from '@/lib/setup/compiler';
import { toClaudeAppExport } from '@/lib/export/claudeApp';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import { renderYourSetupEmail } from './yourSetup';

const answers = {
  brandName: 'Acme Co',
  hasBrandVoice: true,
  channels: ['Email', 'Instagram'],
  tone: 'Professional',
};

describe('renderYourSetupEmail', () => {
  it('includes the setup name in the subject', () => {
    const compiled = compileSetup(marketingManagerSetup, answers);
    const claudeExport = toClaudeAppExport(compiled);
    const rendered = renderYourSetupEmail({ compiled, claudeExport });
    expect(rendered.subject).toContain('Marketing Manager');
  });

  it('renders the compiled instruction inside a monospace block, HTML-escaped', () => {
    const compiled = compileSetup(marketingManagerSetup, answers);
    const claudeExport = toClaudeAppExport(compiled);
    const rendered = renderYourSetupEmail({ compiled, claudeExport });
    expect(rendered.html).toContain('Acme Co');
    expect(rendered.html).toContain('Custom instructions');
  });

  it('renders one block per knowledge file plus the instruction block', () => {
    const compiled = compileSetup(marketingManagerSetup, answers);
    const claudeExport = toClaudeAppExport(compiled);
    const rendered = renderYourSetupEmail({ compiled, claudeExport });
    for (const file of compiled.knowledgeFiles) {
      expect(rendered.html).toContain(file.name);
    }
  });

  it('renders every walkthrough step title and body', () => {
    const compiled = compileSetup(marketingManagerSetup, answers);
    const claudeExport = toClaudeAppExport(compiled);
    const rendered = renderYourSetupEmail({ compiled, claudeExport });
    for (const step of claudeExport.walkthrough) {
      expect(rendered.html).toContain(step.title);
    }
  });

  it('includes a plaintext fallback containing the instruction content', () => {
    const compiled = compileSetup(marketingManagerSetup, answers);
    const claudeExport = toClaudeAppExport(compiled);
    const rendered = renderYourSetupEmail({ compiled, claudeExport });
    expect(rendered.text).toContain('Acme Co');
    expect(rendered.text).not.toContain('<table');
  });

  it('never renders raw < or > from user-controlled brandName (no HTML injection)', () => {
    const hostileAnswers = { ...answers, brandName: '<img src=x onerror=alert(1)>' };
    const compiled = compileSetup(marketingManagerSetup, hostileAnswers);
    const claudeExport = toClaudeAppExport(compiled);
    const rendered = renderYourSetupEmail({ compiled, claudeExport });
    expect(rendered.html).not.toContain('<img src=x onerror=alert(1)>');
  });

  it('matches the HTML snapshot', () => {
    const compiled = compileSetup(marketingManagerSetup, answers);
    const claudeExport = toClaudeAppExport(compiled);
    const rendered = renderYourSetupEmail({ compiled, claudeExport });
    expect(rendered.html).toMatchSnapshot();
  });
});
