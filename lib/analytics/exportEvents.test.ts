/**
 * Unit tests for lib/analytics/exportEvents.ts
 * Node environment — no DOM needed.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateExportEventPayload, recordExportEvent } from './exportEvents';

// ─── validateExportEventPayload ───────────────────────────────────────────────

describe('validateExportEventPayload', () => {
  it('rejects unknown fields', () => {
    const result = validateExportEventPayload({
      kind: 'copy',
      setupSlug: 'marketing-manager',
      target: 'claude-app',
      branch: null,
      extra: 'not-allowed',
    });
    expect(result.ok).toBe(false);
  });

  it('rejects non-string slugs', () => {
    const result = validateExportEventPayload({
      kind: 'copy',
      setupSlug: 42,
      target: 'claude-app',
      branch: null,
    });
    expect(result.ok).toBe(false);
  });

  it('rejects slugs over the length cap (128 chars)', () => {
    const result = validateExportEventPayload({
      kind: 'copy',
      setupSlug: 'a'.repeat(129),
      target: 'claude-app',
      branch: null,
    });
    expect(result.ok).toBe(false);
  });

  it('rejects empty slugs', () => {
    const result = validateExportEventPayload({
      kind: 'copy',
      setupSlug: '',
      target: 'claude-app',
      branch: null,
    });
    expect(result.ok).toBe(false);
  });

  it('rejects a target over 64 characters', () => {
    const result = validateExportEventPayload({
      kind: 'copy',
      setupSlug: 'marketing-manager',
      target: 'a'.repeat(65),
      branch: null,
    });
    expect(result.ok).toBe(false);
  });

  it('rejects an invalid kind', () => {
    const result = validateExportEventPayload({
      kind: 'view',
      setupSlug: 'marketing-manager',
      target: 'claude-app',
      branch: null,
    });
    expect(result.ok).toBe(false);
  });

  it('rejects an invalid branch value', () => {
    const result = validateExportEventPayload({
      kind: 'copy',
      setupSlug: 'marketing-manager',
      target: 'claude-app',
      branch: 'enterprise',
    });
    expect(result.ok).toBe(false);
  });

  it('accepts a well-formed copy event', () => {
    const result = validateExportEventPayload({
      kind: 'copy',
      setupSlug: 'marketing-manager',
      target: 'claude-app',
      branch: 'pro',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload).toEqual({
        kind: 'copy',
        setupSlug: 'marketing-manager',
        target: 'claude-app',
        branch: 'pro',
      });
    }
  });

  it('accepts a well-formed done event with null branch', () => {
    const result = validateExportEventPayload({
      kind: 'done',
      setupSlug: 'marketing-manager',
      target: 'claude-app',
      branch: null,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload.kind).toBe('done');
      expect(result.payload.branch).toBeNull();
    }
  });

  it('accepts a done event with free branch', () => {
    const result = validateExportEventPayload({
      kind: 'done',
      setupSlug: 'marketing-manager',
      target: 'claude-app',
      branch: 'free',
    });
    expect(result.ok).toBe(true);
  });

  it('rejects non-object input', () => {
    expect(validateExportEventPayload(null).ok).toBe(false);
    expect(validateExportEventPayload('string').ok).toBe(false);
    expect(validateExportEventPayload(42).ok).toBe(false);
  });
});

// ─── recordExportEvent ────────────────────────────────────────────────────────

describe('recordExportEvent', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends exactly the four allowed fields and nothing else', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchSpy);

    await recordExportEvent({
      kind: 'copy',
      setupSlug: 'test-setup',
      target: 'claude-app',
      branch: 'pro',
    });

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/events/export');
    const body = JSON.parse(options.body as string) as Record<string, unknown>;
    expect(Object.keys(body).sort()).toEqual(['branch', 'kind', 'setupSlug', 'target']);
    expect(body.kind).toBe('copy');
    expect(body.setupSlug).toBe('test-setup');
    expect(body.target).toBe('claude-app');
    expect(body.branch).toBe('pro');
  });

  it('sends null branch when no plan choice has been made', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchSpy);

    await recordExportEvent({
      kind: 'done',
      setupSlug: 'test-setup',
      target: 'claude-app',
      branch: null,
    });

    const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(options.body as string) as Record<string, unknown>;
    expect(body.branch).toBeNull();
  });

  it('resolves silently when the POST fails with a network error', async () => {
    const fetchSpy = vi.fn().mockRejectedValue(new Error('network error'));
    vi.stubGlobal('fetch', fetchSpy);

    await expect(
      recordExportEvent({
        kind: 'done',
        setupSlug: 'test-setup',
        target: 'claude-app',
        branch: null,
      }),
    ).resolves.toBeUndefined();
  });

  it('resolves silently when the POST returns a non-2xx status', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(null, { status: 500 }));
    vi.stubGlobal('fetch', fetchSpy);

    await expect(
      recordExportEvent({
        kind: 'copy',
        setupSlug: 'test-setup',
        target: 'claude-app',
        branch: 'free',
      }),
    ).resolves.toBeUndefined();
  });

  it('uses keepalive so the request survives navigation', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchSpy);

    await recordExportEvent({
      kind: 'done',
      setupSlug: 'test-setup',
      target: 'claude-app',
      branch: 'pro',
    });

    const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect((options as { keepalive?: boolean }).keepalive).toBe(true);
  });
});
