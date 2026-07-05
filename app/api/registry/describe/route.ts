/**
 * POST /api/registry/describe
 *
 * SERVER ONLY — reads ANTHROPIC_API_KEY and SUPABASE_SERVICE_ROLE_KEY.
 * Never import this file into a client component.
 *
 * Drafts listing copy (name / tagline / description / capabilities) from
 * uploaded artifact files. The author reviews and edits the draft before
 * submitting. This is a convenience, never a gate.
 *
 * ─── Request body ────────────────────────────────────────────────────────────
 *
 *   {
 *     kind: 'agent' | 'skill' | 'harness',
 *     files: Array<{ name: string; content: string }>
 *   }
 *
 * ─── Response contract (consumed verbatim by Task 9's builder UI) ─────────────
 *
 *   401  { ok: false, error: string }                            — not signed in
 *   400  { ok: false, error: string }                            — body violates limits
 *   429  { ok: false, error: string }                            — meter denied
 *   200  { ok: true,  draft: { name, tagline, description, capabilities } }
 *   200  { ok: false, code: 'model-failure' | 'unparseable' }   — model path failed
 *        (builder drops to manual mode; not an HTTP error)
 *
 * ─── Order ──────────────────────────────────────────────────────────────────
 *
 *   auth → body validation → meter → model → record usage → response
 */

import { type NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/supabase/server';
import { describeArtifact } from '@/lib/registry/describe';
import {
  checkDescribeMeter,
  recordDescribeUsage,
  createSupabaseDescribeStore,
} from '@/lib/registry/describeMeter';
import { createAnthropicModelClient } from '@/lib/testdrive/anthropicClient';
import { ARTIFACT_FILE_LIMITS, REGISTRY_KINDS } from '@/lib/setup/types';

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. Auth ────────────────────────────────────────────────────────────────
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Sign in to use AI-describe.' },
      { status: 401 },
    );
  }

  // ── 2. Parse body ──────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { ok: false, error: 'Request body must be a JSON object.' },
      { status: 400 },
    );
  }

  const { kind, files } = body as Record<string, unknown>;

  // Validate kind.
  if (
    typeof kind !== 'string' ||
    !(REGISTRY_KINDS as ReadonlyArray<string>).includes(kind)
  ) {
    return NextResponse.json(
      { ok: false, error: `kind must be one of: ${REGISTRY_KINDS.join(', ')}.` },
      { status: 400 },
    );
  }

  // Validate files array.
  if (!Array.isArray(files)) {
    return NextResponse.json(
      { ok: false, error: 'files must be an array.' },
      { status: 400 },
    );
  }

  if (files.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'At least one file is required.' },
      { status: 400 },
    );
  }

  if (files.length > ARTIFACT_FILE_LIMITS.maxFiles) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many files. Maximum is ${ARTIFACT_FILE_LIMITS.maxFiles} files.`,
      },
      { status: 400 },
    );
  }

  // Validate each file entry.
  const { maxBytesPerFile, allowedExtensions } = ARTIFACT_FILE_LIMITS;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (typeof file !== 'object' || file === null) {
      return NextResponse.json(
        { ok: false, error: `files[${i}] must be an object with name and content.` },
        { status: 400 },
      );
    }
    const { name, content } = file as Record<string, unknown>;
    if (typeof name !== 'string' || typeof content !== 'string') {
      return NextResponse.json(
        { ok: false, error: `files[${i}]: name and content must both be strings.` },
        { status: 400 },
      );
    }

    // Extension check.
    const hasAllowedExt = (allowedExtensions as ReadonlyArray<string>).some((ext) =>
      name.endsWith(ext),
    );
    if (!hasAllowedExt) {
      return NextResponse.json(
        {
          ok: false,
          error: `files[${i}] ("${name}"): extension not allowed. Allowed: ${allowedExtensions.join(', ')}.`,
        },
        { status: 400 },
      );
    }

    // Byte-size check.
    const byteLength = Buffer.byteLength(content, 'utf8');
    if (byteLength > maxBytesPerFile) {
      return NextResponse.json(
        {
          ok: false,
          error: `files[${i}] ("${name}") is ${byteLength} bytes, which exceeds the ${maxBytesPerFile}-byte limit (100 KB per file).`,
        },
        { status: 400 },
      );
    }
  }

  // ── 3. Meter check ─────────────────────────────────────────────────────────
  const now = new Date().toISOString();
  const store = createSupabaseDescribeStore();

  const meter = await checkDescribeMeter(user.id, store, now);
  if (!meter.allowed) {
    const message =
      meter.reason === 'global-budget'
        ? 'AI-describe is busy right now — try again in a little while.'
        : "You've used your daily AI-describe allowance — it resets at midnight UTC.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 429 },
    );
  }

  // ── 4. Model call ──────────────────────────────────────────────────────────
  const modelClient = createAnthropicModelClient();
  const result = await describeArtifact(
    {
      kind: kind as 'agent' | 'skill' | 'harness',
      files: (files as Array<{ name: string; content: string }>).map((f) => ({
        name: f.name,
        content: f.content,
      })),
    },
    { modelClient, now },
  );

  // ── 5. Record usage (only on success) ──────────────────────────────────────
  if (result.ok) {
    try {
      await recordDescribeUsage(
        { userId: user.id, spendUsd: result.spendUsd, createdAt: now },
        store,
      );
    } catch (err) {
      // Usage recording is best-effort — never block the response.
      console.error('[registry/describe] usage recording failed:', err);
    }
  }

  // ── 6. Response ────────────────────────────────────────────────────────────
  if (result.ok) {
    return NextResponse.json({ ok: true, draft: result.draft });
  }

  // Model-path failure: 200 so the builder can drop to manual mode.
  return NextResponse.json({ ok: false, code: result.code });
}
