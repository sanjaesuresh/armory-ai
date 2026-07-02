/**
 * Anonymous export-event capture.
 *
 * Two exports:
 *  - validateExportEventPayload — used by both this client helper and the API
 *    route to ensure only the four allowed fields are present and valid.
 *  - recordExportEvent — fire-and-forget POST to /api/events/export. Never
 *    throws; any network or server failure is swallowed silently.
 */

const SLUG_MAX = 128;
const TARGET_MAX = 64;
const ALLOWED_FIELDS = new Set(['kind', 'setupSlug', 'target', 'branch']);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExportEventPayload {
  kind: 'copy' | 'done';
  setupSlug: string;
  target: string;
  branch: 'pro' | 'free' | null;
}

type ValidationResult =
  | { ok: true; payload: ExportEventPayload }
  | { ok: false; reason: string };

// ─── Validator ────────────────────────────────────────────────────────────────

export function validateExportEventPayload(input: unknown): ValidationResult {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { ok: false, reason: 'payload must be a plain object' };
  }

  const obj = input as Record<string, unknown>;

  // Reject unknown fields
  for (const key of Object.keys(obj)) {
    if (!ALLOWED_FIELDS.has(key)) {
      return { ok: false, reason: `unknown field: ${key}` };
    }
  }

  // kind
  if (obj.kind !== 'copy' && obj.kind !== 'done') {
    return { ok: false, reason: 'kind must be "copy" or "done"' };
  }

  // setupSlug
  if (typeof obj.setupSlug !== 'string') {
    return { ok: false, reason: 'setupSlug must be a string' };
  }
  if (obj.setupSlug.length === 0 || obj.setupSlug.length > SLUG_MAX) {
    return { ok: false, reason: `setupSlug must be 1–${SLUG_MAX} characters` };
  }

  // target
  if (typeof obj.target !== 'string' || obj.target.length === 0) {
    return { ok: false, reason: 'target must be a non-empty string' };
  }
  if (obj.target.length > TARGET_MAX) {
    return { ok: false, reason: `target must be 1–${TARGET_MAX} characters` };
  }

  // branch
  if (obj.branch !== 'pro' && obj.branch !== 'free' && obj.branch !== null) {
    return { ok: false, reason: 'branch must be "pro", "free", or null' };
  }

  return {
    ok: true,
    payload: {
      kind: obj.kind,
      setupSlug: obj.setupSlug,
      target: obj.target,
      branch: obj.branch,
    },
  };
}

// ─── Fire-and-forget POST ─────────────────────────────────────────────────────

export async function recordExportEvent(payload: ExportEventPayload): Promise<void> {
  // Send only the four allowed fields — no extra data.
  const body: ExportEventPayload = {
    kind: payload.kind,
    setupSlug: payload.setupSlug,
    target: payload.target,
    branch: payload.branch,
  };

  try {
    await fetch('/api/events/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Fire-and-forget: failures are silent; export flow is never disrupted.
  }
}
