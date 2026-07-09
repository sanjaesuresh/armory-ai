import { describe, it, expect } from 'vitest';
import { renderSubmissionReceivedEmail } from './submissionReceived';

describe('renderSubmissionReceivedEmail', () => {
  it('includes the setup name in the subject and body', () => {
    const rendered = renderSubmissionReceivedEmail({ setupName: 'Growth Marketer' });
    expect(rendered.subject).toContain('Growth Marketer');
    expect(rendered.html).toContain('Growth Marketer');
    expect(rendered.text).toContain('Growth Marketer');
  });

  it('escapes the setup name in HTML output', () => {
    const rendered = renderSubmissionReceivedEmail({ setupName: '<b>Injected</b>' });
    expect(rendered.html).not.toContain('<b>Injected</b>');
    expect(rendered.html).toContain('&lt;b&gt;Injected&lt;/b&gt;');
  });

  it('matches the HTML snapshot', () => {
    const rendered = renderSubmissionReceivedEmail({ setupName: 'Growth Marketer' });
    expect(rendered.html).toMatchSnapshot();
  });
});
