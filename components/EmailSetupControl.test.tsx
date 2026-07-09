/**
 * EmailSetupControl component tests.
 * Environment: jsdom (vitest.config.ts routes components/**\/*.test.tsx here).
 *
 * fetch is mocked so no real network call escapes; covers the states named in
 * the Email My Setup plan: sending → success, invalid_email (400), and
 * rate_limited (429).
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EmailSetupControl from './EmailSetupControl';

const baseProps = {
  setupId: 'setup-1',
  setupVersion: '1',
  answers: { role: 'marketing' },
};

function mockFetchOnce(status: number, body: unknown) {
  return vi.fn().mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

describe('EmailSetupControl', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('submit succeeds and shows the sent confirmation naming the address', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchOnce(200, { ok: true });
    vi.stubGlobal('fetch', fetchMock);

    render(<EmailSetupControl {...baseProps} />);

    await user.type(screen.getByTestId('email-setup-address'), 'me@example.com');
    await user.click(screen.getByTestId('email-setup-send'));

    await waitFor(() => {
      expect(screen.getByTestId('email-setup-sent')).toBeTruthy();
    });
    expect(screen.getByTestId('email-setup-sent').textContent).toContain('me@example.com');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/email/setup',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'me@example.com',
          setupId: baseProps.setupId,
          setupVersion: baseProps.setupVersion,
          answers: baseProps.answers,
        }),
      }),
    );
  });

  it('400 invalid_email shows the inline error', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      mockFetchOnce(400, {
        ok: false,
        error: 'Enter a valid email address.',
        code: 'invalid_email',
      }),
    );

    render(<EmailSetupControl {...baseProps} />);

    await user.type(screen.getByTestId('email-setup-address'), 'not-an-email');
    await user.click(screen.getByTestId('email-setup-send'));

    await waitFor(() => {
      expect(screen.getByTestId('email-setup-invalid')).toBeTruthy();
    });
    expect(screen.queryByTestId('email-setup-sent')).toBeNull();
  });

  it('429 rate_limited shows the friendly rate-limit copy', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      mockFetchOnce(429, {
        ok: false,
        error: 'Too many emails sent recently.',
        code: 'rate_limited',
      }),
    );

    render(<EmailSetupControl {...baseProps} />);

    await user.type(screen.getByTestId('email-setup-address'), 'me@example.com');
    await user.click(screen.getByTestId('email-setup-send'));

    await waitFor(() => {
      expect(screen.getByTestId('email-setup-rate-limited')).toBeTruthy();
    });
    expect(screen.getByTestId('email-setup-rate-limited').textContent).toMatch(
      /try again in a bit/i,
    );
  });

  it('500 send_failed shows a generic error, never the raw provider message', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      mockFetchOnce(500, {
        ok: false,
        error: 'Resend API key invalid',
        code: 'send_failed',
      }),
    );

    render(<EmailSetupControl {...baseProps} />);

    await user.type(screen.getByTestId('email-setup-address'), 'me@example.com');
    await user.click(screen.getByTestId('email-setup-send'));

    await waitFor(() => {
      expect(screen.getByTestId('email-setup-server-error')).toBeTruthy();
    });
    expect(screen.getByTestId('email-setup-server-error').textContent).not.toContain(
      'Resend API key invalid',
    );
  });
});
