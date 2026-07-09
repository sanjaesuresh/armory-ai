/**
 * "Your Armory setup" email renderer.
 *
 * Pure function: compiled setup + Claude App export in, {subject,html,text}
 * out. No I/O — the route handler does the compiling/exporting and passes
 * the result in, so this stays trivially testable.
 */

import type { CompiledSetup } from '@/lib/setup/types';
import type { ClaudeAppExport } from '@/lib/export/claudeApp';
import { renderEmailShell, escapeHtml, monospaceBlockHtml, type RenderedEmail } from '@/lib/email/shell';

const ACCENT = '#3ddc80';
const INK_SOFT = '#b6b6b8';
const SITE_URL = 'https://www.armoryhq.dev';

export interface YourSetupEmailParams {
  compiled: CompiledSetup;
  claudeExport: ClaudeAppExport;
}

export interface RenderedTransactionalEmail extends RenderedEmail {
  subject: string;
}

export function renderYourSetupEmail(params: YourSetupEmailParams): RenderedTransactionalEmail {
  const { compiled, claudeExport } = params;
  const { name } = compiled.meta;

  const subject = `Your Armory setup: ${name}`;

  // ── Blocks (instruction first, then knowledge files) ────────────────────
  const blocksHtml = claudeExport.blocks
    .map((block) => {
      const label = block.kind === 'instruction' ? 'Custom instructions' : `Knowledge file: ${block.label}`;
      return `<p style="margin:24px 0 4px 0;font-weight:600;color:#ffffff;">${escapeHtml(label)}</p>${monospaceBlockHtml(block.content)}`;
    })
    .join('');

  const blocksText = claudeExport.blocks
    .map((block) => {
      const label = block.kind === 'instruction' ? 'Custom instructions' : `Knowledge file: ${block.label}`;
      return `${label}\n${'-'.repeat(label.length)}\n${block.content}`;
    })
    .join('\n\n');

  // ── Walkthrough ───────────────────────────────────────────────────────────
  const walkthroughHtml = claudeExport.walkthrough
    .map(
      (step) =>
        `<tr><td style="padding:6px 0;color:${INK_SOFT};font-size:14px;"><strong style="color:#ffffff;">${step.stepNumber}. ${escapeHtml(step.title)}</strong><br/>${escapeHtml(step.body)}</td></tr>`,
    )
    .join('');

  const walkthroughText = claudeExport.walkthrough
    .map((step) => `${step.stepNumber}. ${step.title}\n   ${step.body}`)
    .join('\n');

  const bodyHtml = `
<p style="margin:0 0 4px 0;font-size:20px;font-weight:600;color:#ffffff;">${escapeHtml(name)}</p>
<p style="margin:0 0 20px 0;color:${INK_SOFT};">${escapeHtml(compiled.summary)}</p>
${blocksHtml}
<p style="margin:24px 0 4px 0;font-weight:600;color:#ffffff;">How to use this in Claude</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${walkthroughHtml}</table>
<p style="margin:28px 0 0 0;">
<a href="${SITE_URL}" style="display:inline-block;background-color:${ACCENT};color:#0f0f10;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:8px;">Open Armory to customize further</a>
</p>`;

  const bodyText = `Your Armory setup: ${name}

${compiled.summary}

${blocksText}

How to use this in Claude
${walkthroughText}

Open Armory to customize further: ${SITE_URL}`;

  const { html, text } = renderEmailShell({
    bodyHtml,
    bodyText,
    previewText: `Your compiled "${name}" setup, ready to paste into Claude.`,
  });

  return { subject, html, text };
}
