/**
 * Integration test for POST /api/email/setup (app/api/email/setup/route.ts).
 *
 * Colocated under lib/email/ (not app/api/**) because vitest.config.ts's node
 * project only globs tests/**, lib/**, data/** — the route module is imported
 * by path from here instead.
 *
 * Mocks: the request-scoped Supabase server client (setup lookup runs under the
 * caller's RLS), the rate-limit ledger, and the Resend-backed sendEmail()
 * wrapper. Asserts the response contract (status + ok/code) and — critically —
 * that sendEmail is called on success and NEVER on any validation/limit failure,
 * including when RLS hides a non-approved setup the caller can't read.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';

const sendEmailMock = vi.fn();
const recordSendMock = vi.fn();
let emailCountOverride = 0;
let ipCountOverride = 0;

vi.mock('@/lib/email/client', () => ({
  sendEmail: (...args: unknown[]) => sendEmailMock(...args),
}));

vi.mock('@/lib/email/rateLimiter', async () => {
  const actual = await vi.importActual<typeof import('@/lib/email/rateLimiter')>('@/lib/email/rateLimiter');
  return {
    ...actual,
    createSupabaseEmailRateLimitDataSource: () => ({
      countEmailSendsSince: async () => emailCountOverride,
      countIpSendsSince: async () => ipCountOverride,
      recordSend: recordSendMock,
    }),
  };
});

vi.mock('@/lib/testdrive/meter', async () => {
  const actual = await vi.importActual<typeof import('@/lib/testdrive/meter')>('@/lib/testdrive/meter');
  return { ...actual, saltIp: () => 'fake-ip-hash' };
});

// Supabase row shape for the marketing-manager fixture, keyed by id.
function setupRow(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: marketingManagerSetup.id,
    slug: marketingManagerSetup.slug,
    name: marketingManagerSetup.name,
    tagline: marketingManagerSetup.tagline,
    description: marketingManagerSetup.description,
    role: marketingManagerSetup.role,
    industry: marketingManagerSetup.industry,
    tags: marketingManagerSetup.tags,
    category: marketingManagerSetup.category,
    source: marketingManagerSetup.source,
    author: marketingManagerSetup.author,
    version: marketingManagerSetup.version,
    created_at: marketingManagerSetup.createdAt,
    updated_at: marketingManagerSetup.updatedAt,
    review_status: marketingManagerSetup.reviewStatus,
    upvotes: marketingManagerSetup.upvotes,
    featured: marketingManagerSetup.featured,
    targets: marketingManagerSetup.targets,
    tier: marketingManagerSetup.tier,
    instruction_template: marketingManagerSetup.instructionTemplate,
    variables: marketingManagerSetup.variables,
    knowledge_files: marketingManagerSetup.knowledgeFiles,
    scenarios: marketingManagerSetup.scenarios,
    kind: 'setup',
    artifact_files: [],
    repo_url: null,
    capabilities: [],
    ...overrides,
  };
}

let maybeSingleResult: { data: unknown; error: unknown } = { data: setupRow(), error: null };

// The route resolves the setup under the caller's RLS via the request-scoped
// server client (async). RLS filtering manifests here as `data: null` for any
// row the caller isn't allowed to read (non-approved and not theirs).
vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: async () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => maybeSingleResult,
        }),
      }),
    }),
  }),
}));

const ANSWERS = {
  brandName: 'Acme Co',
  hasBrandVoice: true,
  channels: ['Email', 'Instagram'],
  tone: 'Professional',
};

async function postRequest(body: unknown) {
  const { POST } = await import('@/app/api/email/setup/route');
  const req = new NextRequest('http://localhost/api/email/setup', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
  return POST(req);
}

describe('POST /api/email/setup', () => {
  beforeEach(() => {
    sendEmailMock.mockReset();
    sendEmailMock.mockResolvedValue({ sent: true });
    recordSendMock.mockReset();
    emailCountOverride = 0;
    ipCountOverride = 0;
    maybeSingleResult = { data: setupRow(), error: null };
    process.env.TESTDRIVE_IP_SALT = 'test-salt';
  });

  it('sends the compiled setup email and returns 200 on a valid request', async () => {
    const res = await postRequest({
      email: 'person@example.com',
      setupId: marketingManagerSetup.id,
      setupVersion: marketingManagerSetup.version,
      answers: ANSWERS,
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock.mock.calls[0][0].to).toBe('person@example.com');
  });

  it('rejects an invalid email and never sends', async () => {
    const res = await postRequest({
      email: 'not-an-email',
      setupId: marketingManagerSetup.id,
      setupVersion: marketingManagerSetup.version,
      answers: ANSWERS,
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(json.code).toBe('invalid_email');
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('rejects an unknown setupId and never sends', async () => {
    maybeSingleResult = { data: null, error: null };
    const res = await postRequest({
      email: 'person@example.com',
      setupId: 'does-not-exist',
      setupVersion: '1.0.0',
      answers: ANSWERS,
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(json.code).toBe('invalid_setup');
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('does not email a non-approved setup the caller cannot read (RLS returns null)', async () => {
    // Attacker POSTs a victim's draft/pending/rejected setupId. Under RLS the
    // request-scoped client returns no row → treated as not-found, no send.
    maybeSingleResult = { data: null, error: null };
    const res = await postRequest({
      email: 'attacker@evil.com',
      setupId: 'someone-elses-private-draft',
      setupVersion: '1',
      answers: ANSWERS,
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.code).toBe('invalid_setup');
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('rejects a version mismatch and never sends', async () => {
    const res = await postRequest({
      email: 'person@example.com',
      setupId: marketingManagerSetup.id,
      setupVersion: '99.0.0',
      answers: ANSWERS,
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.code).toBe('invalid_setup');
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('rejects malformed answers and never sends', async () => {
    const res = await postRequest({
      email: 'person@example.com',
      setupId: marketingManagerSetup.id,
      setupVersion: marketingManagerSetup.version,
      answers: { brandName: { nested: 'object' } },
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.code).toBe('invalid_answers');
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('rejects a missing required answer (compiler throws) with send_failed and never sends', async () => {
    const res = await postRequest({
      email: 'person@example.com',
      setupId: marketingManagerSetup.id,
      setupVersion: marketingManagerSetup.version,
      answers: {},
    });
    const json = await res.json();
    expect(res.status).toBe(500);
    expect(json.code).toBe('send_failed');
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('rate-limits over the per-email cap and never sends', async () => {
    emailCountOverride = 999;
    const res = await postRequest({
      email: 'person@example.com',
      setupId: marketingManagerSetup.id,
      setupVersion: marketingManagerSetup.version,
      answers: ANSWERS,
    });
    const json = await res.json();
    expect(res.status).toBe(429);
    expect(json.code).toBe('rate_limited');
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('rate-limits over the per-IP cap and never sends', async () => {
    ipCountOverride = 999;
    const res = await postRequest({
      email: 'person@example.com',
      setupId: marketingManagerSetup.id,
      setupVersion: marketingManagerSetup.version,
      answers: ANSWERS,
    });
    const json = await res.json();
    expect(res.status).toBe(429);
    expect(json.code).toBe('rate_limited');
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('records the send in the rate-limit ledger only on success', async () => {
    await postRequest({
      email: 'person@example.com',
      setupId: marketingManagerSetup.id,
      setupVersion: marketingManagerSetup.version,
      answers: ANSWERS,
    });
    expect(recordSendMock).toHaveBeenCalledTimes(1);
  });
});
