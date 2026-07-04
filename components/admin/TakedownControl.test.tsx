/**
 * TakedownControl component tests.
 * Environment: jsdom (vitest.config.ts routes components/**\/*.test.tsx here).
 *
 * Tests that submit is blocked until note is non-empty, and that a successful
 * POST calls the route with action:'takedown' + the note and triggers a refresh.
 * Never instantiates real Supabase clients or network connections.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TakedownControl from './TakedownControl';

// ── Module mocks ──────────────────────────────────────────────────────────────

const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('TakedownControl', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchSpy: ReturnType<typeof vi.fn> & { mock: any };

  beforeEach(() => {
    vi.clearAllMocks();
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('submit button is disabled when note is empty', async () => {
    const user = userEvent.setup();
    render(<TakedownControl setupId="s1" />);

    await user.click(screen.getByTestId('takedown-open'));

    expect(screen.getByTestId('takedown-submit')).toBeDisabled();
  });

  it('submit button becomes enabled when note is non-empty', async () => {
    const user = userEvent.setup();
    render(<TakedownControl setupId="s1" />);

    await user.click(screen.getByTestId('takedown-open'));
    await user.type(screen.getByTestId('takedown-note'), 'Violates community guidelines.');

    expect(screen.getByTestId('takedown-submit')).not.toBeDisabled();
  });

  it('successful POST calls route with action:takedown + note and refreshes', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    const user = userEvent.setup();
    render(<TakedownControl setupId="s1" />);

    await user.click(screen.getByTestId('takedown-open'));
    await user.type(screen.getByTestId('takedown-note'), 'Spam content.');
    await user.click(screen.getByTestId('takedown-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('takedown-done')).toBeTruthy();
    });

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/admin/moderate');
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body.setupId).toBe('s1');
    expect(body.action).toBe('takedown');
    expect(body.note).toBe('Spam content.');
    expect(mockRefresh).toHaveBeenCalledOnce();
  });
});
