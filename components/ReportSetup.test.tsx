/**
 * ReportSetup component tests.
 * Environment: jsdom (vitest.config.ts routes components/**\/*.test.tsx here).
 *
 * Tests the signed-out → AuthPrompt flow, successful report, and dedupe message.
 * Never instantiates the browser Supabase client at render time — the module is
 * mocked so any call to createSupabaseBrowserClient returns a no-op object.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReportSetup from './ReportSetup';

// ── Module mocks ──────────────────────────────────────────────────────────────

// createSupabaseBrowserClient must never be called at render time — only in the
// submit handler. The mock returns a no-op object; fileReport is mocked so no
// real Supabase calls escape.
vi.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowserClient: vi.fn(() => ({})),
}));

// Mock fileReport and createSupabaseReportsStore so tests control responses
// without real Supabase interactions. REPORT_REASONS is passed through as-is
// so the select renders its real options.
vi.mock('@/lib/community/reports', async () => {
  const actual = await vi.importActual<typeof import('@/lib/community/reports')>(
    '@/lib/community/reports',
  );
  return {
    ...actual,
    createSupabaseReportsStore: vi.fn(() => ({})),
    fileReport: vi.fn(),
  };
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getFileReportMock() {
  const mod = await import('@/lib/community/reports');
  return mod.fileReport as ReturnType<typeof vi.fn>;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ReportSetup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signed-out: clicking trigger shows AuthPrompt and does NOT call fileReport', async () => {
    const user = userEvent.setup();
    render(<ReportSetup setupId="s1" userId={null} />);

    await user.click(screen.getByTestId('report-setup-trigger'));

    expect(screen.getByTestId('auth-prompt')).toBeTruthy();
    const mock = await getFileReportMock();
    expect(mock).not.toHaveBeenCalled();
  });

  it('successful report shows success message', async () => {
    const user = userEvent.setup();
    const mock = await getFileReportMock();
    mock.mockResolvedValueOnce({ ok: true });

    render(<ReportSetup setupId="s1" userId="user-1" />);

    await user.click(screen.getByTestId('report-setup-trigger'));
    await user.click(screen.getByRole('button', { name: /submit report/i }));

    await waitFor(() => {
      expect(screen.getByTestId('report-setup-success')).toBeTruthy();
    });
  });

  it('already-reported shows dedupe message', async () => {
    const user = userEvent.setup();
    const mock = await getFileReportMock();
    mock.mockResolvedValueOnce({ ok: false, code: 'already-reported' });

    render(<ReportSetup setupId="s1" userId="user-1" />);

    await user.click(screen.getByTestId('report-setup-trigger'));
    await user.click(screen.getByRole('button', { name: /submit report/i }));

    await waitFor(() => {
      expect(screen.getByTestId('report-setup-already')).toBeTruthy();
    });
  });
});
