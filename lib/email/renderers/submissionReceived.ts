/**
 * "Submission received" email — sent after a successful insert in
 * POST /api/community/submit. Confirms the setup entered the moderation
 * queue; no action needed from the author yet.
 */

import { renderEmailShell, escapeHtml, type RenderedEmail } from '@/lib/email/shell';
import type { RenderedTransactionalEmail } from '@/lib/email/renderers/yourSetup';

const INK_SOFT = '#b6b6b8';

export interface SubmissionReceivedEmailParams {
  setupName: string;
}

export function renderSubmissionReceivedEmail(
  params: SubmissionReceivedEmailParams,
): RenderedTransactionalEmail {
  const { setupName } = params;
  const subject = `We got your submission: ${setupName}`;

  const bodyHtml = `
<p style="margin:0 0 4px 0;font-size:20px;font-weight:600;color:#ffffff;">Submission received</p>
<p style="margin:0 0 16px 0;color:${INK_SOFT};">Thanks for submitting <strong style="color:#ffffff;">${escapeHtml(setupName)}</strong> to the Armory community library.</p>
<p style="margin:0;">A moderator will review it soon. We'll email you as soon as it's approved or if it needs changes.</p>`;

  const bodyText = `Submission received

Thanks for submitting "${setupName}" to the Armory community library.

A moderator will review it soon. We'll email you as soon as it's approved or if it needs changes.`;

  const { html, text }: RenderedEmail = renderEmailShell({
    bodyHtml,
    bodyText,
    previewText: `"${setupName}" is in the moderation queue.`,
  });

  return { subject, html, text };
}
