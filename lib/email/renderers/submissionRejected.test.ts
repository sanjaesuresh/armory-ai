import { describe, it, expect } from 'vitest';
import { renderSubmissionRejectedEmail } from './submissionRejected';

describe('renderSubmissionRejectedEmail', () => {
  it('carries the moderator note verbatim in the plaintext body', () => {
    const note = 'This duplicates an existing setup. Please add unique knowledge files.';
    const rendered = renderSubmissionRejectedEmail({ setupName: 'Growth Marketer', note, action: 'reject' });
    expect(rendered.text).toContain(note);
  });

  it('carries the moderator note verbatim (HTML-escaped, not altered) for takedown', () => {
    const note = 'Violates the community content policy.';
    const rendered = renderSubmissionRejectedEmail({ setupName: 'Growth Marketer', note, action: 'takedown' });
    expect(rendered.html).toContain(note);
    expect(rendered.subject).toContain('Taken down');
  });

  it('uses a different subject/heading for reject vs takedown', () => {
    const reject = renderSubmissionRejectedEmail({ setupName: 'X', note: 'n', action: 'reject' });
    const takedown = renderSubmissionRejectedEmail({ setupName: 'X', note: 'n', action: 'takedown' });
    expect(reject.subject).not.toBe(takedown.subject);
  });

  it('escapes HTML-hostile characters in the note (never renders raw markup)', () => {
    const note = '<script>alert(1)</script>';
    const rendered = renderSubmissionRejectedEmail({ setupName: 'X', note, action: 'reject' });
    expect(rendered.html).not.toContain('<script>alert(1)</script>');
    expect(rendered.html).toContain('&lt;script&gt;');
  });

  it('matches the HTML snapshot', () => {
    const rendered = renderSubmissionRejectedEmail({
      setupName: 'Growth Marketer',
      note: 'Please revise the tone guidance.',
      action: 'reject',
    });
    expect(rendered.html).toMatchSnapshot();
  });
});
