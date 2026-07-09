import { describe, it, expect } from 'vitest';
import { renderEmailShell, escapeHtml, monospaceBlockHtml } from './shell';

describe('escapeHtml', () => {
  it('escapes the five HTML-sensitive characters', () => {
    expect(escapeHtml(`<script>alert("x")&'y'</script>`)).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&amp;&#39;y&#39;&lt;/script&gt;',
    );
  });

  it('leaves plain text unchanged', () => {
    expect(escapeHtml('Marketing Manager for Acme Co.')).toBe('Marketing Manager for Acme Co.');
  });
});

describe('monospaceBlockHtml', () => {
  it('escapes content and wraps it in a table cell', () => {
    const html = monospaceBlockHtml('You are a <helpful> assistant.');
    expect(html).toContain('&lt;helpful&gt;');
    expect(html).toContain('<table');
    expect(html).not.toContain('<helpful>');
  });

  it('preserves whitespace via pre-wrap styling (no manual newline stripping)', () => {
    const html = monospaceBlockHtml('line one\nline two');
    expect(html).toContain('line one\nline two');
    expect(html).toContain('white-space:pre-wrap');
  });
});

describe('renderEmailShell', () => {
  it('produces table-based, inline-CSS HTML with the absolute logo URL', () => {
    const { html } = renderEmailShell({
      bodyHtml: '<p>hello</p>',
      bodyText: 'hello',
      previewText: 'Preview text',
    });
    expect(html).toContain('https://www.armoryhq.dev/email/armory-logo.png');
    expect(html).toContain('<table');
    expect(html).not.toContain('<svg');
    expect(html).not.toContain('display:flex');
    expect(html).not.toContain('display:grid');
  });

  it('includes the footer brand line', () => {
    const { html } = renderEmailShell({ bodyHtml: '<p>x</p>', bodyText: 'x', previewText: 'x' });
    expect(html).toContain('Armory');
    expect(html).toContain('armoryhq.dev');
  });

  it('embeds the body fragment verbatim', () => {
    const { html } = renderEmailShell({
      bodyHtml: '<p id="marker">unique-body-fragment</p>',
      bodyText: 'unique-body-fragment',
      previewText: 'x',
    });
    expect(html).toContain('unique-body-fragment');
  });

  it('produces a plaintext fallback with the footer appended', () => {
    const { text } = renderEmailShell({ bodyHtml: '<p>x</p>', bodyText: 'Plain body text', previewText: 'x' });
    expect(text).toContain('Plain body text');
    expect(text).toContain('Armory · armoryhq.dev');
  });

  it('escapes the preview text used in <title> and the hidden preheader', () => {
    const { html } = renderEmailShell({
      bodyHtml: '<p>x</p>',
      bodyText: 'x',
      previewText: '<b>bold</b> & "quoted"',
    });
    expect(html).not.toContain('<b>bold</b>');
    expect(html).toContain('&lt;b&gt;bold&lt;/b&gt;');
  });

  it('matches the HTML snapshot', () => {
    const { html } = renderEmailShell({
      bodyHtml: '<p>Snapshot body</p>',
      bodyText: 'Snapshot body',
      previewText: 'Snapshot preview',
    });
    expect(html).toMatchSnapshot();
  });
});
