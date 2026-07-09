/**
 * SERVER ONLY — thin Resend wrapper. Never import from a client component.
 *
 * sendEmail({to,subject,html,text})
 *   Sends via Resend using RESEND_API_KEY (server env). If the key is unset —
 *   local dev, CI, unit tests — logs the send and no-ops instead of throwing,
 *   so the rest of the app keeps working without a Resend account.
 *
 * The Resend client is created lazily (only when a key is present) so this
 * module never fails to import in a keyless environment.
 */

import { Resend } from 'resend';

/** Default From address; overridden by EMAIL_FROM. */
const DEFAULT_FROM = 'Armory <setups@send.armoryhq.dev>';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailResult {
  /** false when no-op'd because RESEND_API_KEY is unset. */
  sent: boolean;
}

let cachedClient: Resend | null = null;

function getClient(apiKey: string): Resend {
  if (!cachedClient) cachedClient = new Resend(apiKey);
  return cachedClient;
}

/**
 * Sends a single transactional email. Never throws — callers (route handlers,
 * best-effort submission hooks) are responsible for their own try/catch, but
 * this function absorbs Resend-side errors itself so a provider outage can
 * never surface as an unhandled rejection.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Keyless dev/test path: log instead of sending so local work and CI never
    // need a real Resend account. Gated to non-production and the recipient is
    // not logged verbatim — avoids leaking recipient PII if a real-but-keyless
    // environment ever runs.
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        JSON.stringify({ event: 'email.noop', reason: 'RESEND_API_KEY not set', subject: params.subject }),
      );
    }
    return { sent: false };
  }

  const from = process.env.EMAIL_FROM ?? DEFAULT_FROM;

  try {
    const result = await getClient(apiKey).emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
    if (result.error) {
      console.error('[email/client] Resend returned an error:', result.error);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error('[email/client] send failed:', err);
    return { sent: false };
  }
}
