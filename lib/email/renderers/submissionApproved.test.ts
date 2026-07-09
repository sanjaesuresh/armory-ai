import { describe, it, expect } from 'vitest';
import { renderSubmissionApprovedEmail } from './submissionApproved';

describe('renderSubmissionApprovedEmail', () => {
  it('links to the setup detail page using the slug', () => {
    const rendered = renderSubmissionApprovedEmail({ setupName: 'Growth Marketer', setupSlug: 'growth-marketer' });
    expect(rendered.html).toContain('https://www.armoryhq.dev/setup/growth-marketer');
    expect(rendered.text).toContain('https://www.armoryhq.dev/setup/growth-marketer');
  });

  it('includes the setup name in the subject', () => {
    const rendered = renderSubmissionApprovedEmail({ setupName: 'Growth Marketer', setupSlug: 'growth-marketer' });
    expect(rendered.subject).toContain('Growth Marketer');
  });

  it('escapes the setup name in HTML output', () => {
    const rendered = renderSubmissionApprovedEmail({ setupName: '<b>Injected</b>', setupSlug: 'x' });
    expect(rendered.html).not.toContain('<b>Injected</b>');
  });

  it('matches the HTML snapshot', () => {
    const rendered = renderSubmissionApprovedEmail({ setupName: 'Growth Marketer', setupSlug: 'growth-marketer' });
    expect(rendered.html).toMatchSnapshot();
  });
});
