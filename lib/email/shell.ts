/**
 * Shared branded email shell — every transactional email renders through
 * renderEmailShell() so the brand (dark card, green-a logo, footer) stays in
 * one place. Table layout + all-inline CSS + no flexbox/grid/inline-SVG:
 * email clients (Outlook in particular) do not reliably support those.
 *
 * Logo is referenced by an ABSOLUTE production URL (armoryhq.dev) — email
 * clients cannot resolve relative or localhost URLs.
 */

const LOGO_URL = 'https://www.armoryhq.dev/email/armory-logo.png';
const SITE_URL = 'https://www.armoryhq.dev';

// Brand tokens (mirrored from app/globals.css — email CSS must be inline, so
// these are duplicated here rather than imported).
const PAPER = '#212122';
const INK = '#f0f0f1';
const INK_SOFT = '#b6b6b8';
const ACCENT = '#3ddc80';

export interface EmailShellParams {
  /** Rendered inside the card body. Must already be table/inline-CSS safe. */
  bodyHtml: string;
  /** Plaintext body (no shell chrome needed — plaintext clients don't need branding). */
  bodyText: string;
  /** Used as the HTML <title> and preheader text. */
  previewText: string;
}

export interface RenderedEmail {
  html: string;
  text: string;
}

/** Escapes the handful of characters that matter inside inline HTML text nodes. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Wraps `content` in a monospace box for compiled instructions / prompt text. */
export function monospaceBlockHtml(content: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;"><tr><td style="background-color:#18181a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:13px;line-height:1.6;color:${INK};white-space:pre-wrap;word-break:break-word;">${escapeHtml(content)}</td></tr></table>`;
}

/**
 * Renders the full brand shell around a body fragment.
 * Every email renders through this — no ad hoc HTML documents elsewhere.
 */
export function renderEmailShell(params: EmailShellParams): RenderedEmail {
  const { bodyHtml, bodyText, previewText } = params;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(previewText)}</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f10;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<!-- Preheader: hidden preview text for the inbox list. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f10;padding:32px 16px;">
<tr>
<td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${PAPER};border-radius:16px;overflow:hidden;">
<tr>
<td style="padding:32px 32px 0 32px;" align="left">
<img src="${LOGO_URL}" width="40" height="40" alt="Armory" style="display:block;border:0;border-radius:9px;" />
</td>
</tr>
<tr>
<td style="padding:24px 32px 32px 32px;color:${INK};font-size:15px;line-height:1.6;">
${bodyHtml}
</td>
</tr>
<tr>
<td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);color:${INK_SOFT};font-size:12px;">
Armory &middot; <a href="${SITE_URL}" style="color:${ACCENT};text-decoration:none;">armoryhq.dev</a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;

  const text = `${bodyText}\n\n—\nArmory · armoryhq.dev`;

  return { html, text };
}
