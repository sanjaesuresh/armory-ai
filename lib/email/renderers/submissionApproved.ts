/**
 * "Submission approved" email — sent after a moderator approve transition.
 * Links back to the now-public setup page.
 */

import { renderEmailShell, escapeHtml, type RenderedEmail } from '@/lib/email/shell';
import type { RenderedTransactionalEmail } from '@/lib/email/renderers/yourSetup';

const ACCENT = '#3ddc80';
const INK_SOFT = '#b6b6b8';
const SITE_URL = 'https://www.armoryhq.dev';

export interface SubmissionApprovedEmailParams {
  setupName: string;
  /** Setup slug — used to link to the public detail page. */
  setupSlug: string;
}

export function renderSubmissionApprovedEmail(
  params: SubmissionApprovedEmailParams,
): RenderedTransactionalEmail {
  const { setupName, setupSlug } = params;
  const setupUrl = `${SITE_URL}/setup/${setupSlug}`;
  const subject = `Your setup is live: ${setupName}`;

  const bodyHtml = `
<p style="margin:0 0 4px 0;font-size:20px;font-weight:600;color:#ffffff;">Your setup is live</p>
<p style="margin:0 0 16px 0;color:${INK_SOFT};"><strong style="color:#ffffff;">${escapeHtml(setupName)}</strong> was approved and is now live in the Armory community library. Anyone can find and use it.</p>
<p style="margin:20px 0 0 0;">
<a href="${setupUrl}" style="display:inline-block;background-color:${ACCENT};color:#0f0f10;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:8px;">View your setup</a>
</p>`;

  const bodyText = `Your setup is live

"${setupName}" was approved and is now live in the Armory community library. Anyone can find and use it.

View your setup: ${setupUrl}`;

  const { html, text }: RenderedEmail = renderEmailShell({
    bodyHtml,
    bodyText,
    previewText: `"${setupName}" is now live in the community library.`,
  });

  return { subject, html, text };
}
