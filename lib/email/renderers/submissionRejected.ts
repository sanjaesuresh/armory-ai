/**
 * "Submission rejected / taken down" email — sent after a moderator reject
 * or takedown transition. The moderator note is shown VERBATIM (it is the
 * author-facing explanation the moderation flow already guarantees exists).
 */

import { renderEmailShell, escapeHtml, monospaceBlockHtml, type RenderedEmail } from '@/lib/email/shell';
import type { RenderedTransactionalEmail } from '@/lib/email/renderers/yourSetup';

const INK_SOFT = '#b6b6b8';

export interface SubmissionRejectedEmailParams {
  setupName: string;
  /** Verbatim moderator note — never edited, truncated, or paraphrased. */
  note: string;
  /** Distinguishes a fresh-submission rejection from a takedown of a live setup. */
  action: 'reject' | 'takedown';
}

export function renderSubmissionRejectedEmail(
  params: SubmissionRejectedEmailParams,
): RenderedTransactionalEmail {
  const { setupName, note, action } = params;
  const heading = action === 'takedown' ? 'Your setup was taken down' : 'Your submission needs changes';
  const subject = action === 'takedown' ? `Taken down: ${setupName}` : `Changes needed: ${setupName}`;
  const intro =
    action === 'takedown'
      ? `<strong style="color:#ffffff;">${escapeHtml(setupName)}</strong> was removed from the Armory community library by a moderator.`
      : `<strong style="color:#ffffff;">${escapeHtml(setupName)}</strong> was not approved.`;
  const introText =
    action === 'takedown'
      ? `"${setupName}" was removed from the Armory community library by a moderator.`
      : `"${setupName}" was not approved.`;

  const bodyHtml = `
<p style="margin:0 0 4px 0;font-size:20px;font-weight:600;color:#ffffff;">${heading}</p>
<p style="margin:0 0 16px 0;color:${INK_SOFT};">${intro}</p>
<p style="margin:24px 0 4px 0;font-weight:600;color:#ffffff;">Moderator note</p>
${monospaceBlockHtml(note)}`;

  const bodyText = `${heading}

${introText}

Moderator note
--------------
${note}`;

  const { html, text }: RenderedEmail = renderEmailShell({
    bodyHtml,
    bodyText,
    previewText: `${heading}: "${setupName}".`,
  });

  return { subject, html, text };
}
