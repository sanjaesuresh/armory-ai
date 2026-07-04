/**
 * SubmissionActions component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 *
 * Tests the withdraw and edit-&-resubmit buttons in isolation by mocking the
 * drafts module and browser Supabase client (never create real network calls).
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SubmissionActions from './SubmissionActions';

// ── Module mocks ──────────────────────────────────────────────────────────────

const mockRefresh = vi.fn();
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh, push: mockPush }),
}));

// Mock the browser Supabase client (never instantiate real clients in tests).
vi.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowserClient: () => ({}),
}));

const mockWithdraw = vi.fn();
const mockReopen = vi.fn();

vi.mock('@/lib/community/drafts', () => ({
  createSupabaseDraftsStore: () => ({}),
  withdrawSubmission: (...args: unknown[]) => mockWithdraw(...args),
  reopenRejected: (...args: unknown[]) => mockReopen(...args),
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SubmissionActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Pending row ────────────────────────────────────────────────────────────

  it('renders "Withdraw to edit" button for a pending row', () => {
    render(<SubmissionActions id="setup-1" reviewStatus="pending" />);
    expect(screen.getByTestId('submission-withdraw')).toBeInTheDocument();
    expect(screen.queryByTestId('submission-reopen')).toBeNull();
  });

  it('calls withdrawSubmission and router.refresh on withdraw success', async () => {
    mockWithdraw.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<SubmissionActions id="setup-1" reviewStatus="pending" />);
    await user.click(screen.getByTestId('submission-withdraw'));
    await waitFor(() => expect(mockWithdraw).toHaveBeenCalledOnce());
    expect(mockRefresh).toHaveBeenCalledOnce();
  });

  it('shows an error message if withdrawSubmission throws', async () => {
    mockWithdraw.mockRejectedValueOnce(new Error('network error'));
    const user = userEvent.setup();
    render(<SubmissionActions id="setup-1" reviewStatus="pending" />);
    await user.click(screen.getByTestId('submission-withdraw'));
    await waitFor(() =>
      expect(screen.getByTestId('submission-action-error')).toBeInTheDocument(),
    );
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  // ── Rejected row ────────────────────────────────────────────────────────────

  it('renders "Edit & resubmit" button for a rejected row', () => {
    render(<SubmissionActions id="setup-2" reviewStatus="rejected" />);
    expect(screen.getByTestId('submission-reopen')).toBeInTheDocument();
    expect(screen.queryByTestId('submission-withdraw')).toBeNull();
  });

  it('calls reopenRejected and router.push on reopen success', async () => {
    mockReopen.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<SubmissionActions id="setup-2" reviewStatus="rejected" />);
    await user.click(screen.getByTestId('submission-reopen'));
    await waitFor(() => expect(mockReopen).toHaveBeenCalledOnce());
    expect(mockPush).toHaveBeenCalledWith('/build/setup-2');
  });

  it('shows an error message if reopenRejected throws', async () => {
    mockReopen.mockRejectedValueOnce(new Error('rls denied'));
    const user = userEvent.setup();
    render(<SubmissionActions id="setup-2" reviewStatus="rejected" />);
    await user.click(screen.getByTestId('submission-reopen'));
    await waitFor(() =>
      expect(screen.getByTestId('submission-action-error')).toBeInTheDocument(),
    );
    expect(mockPush).not.toHaveBeenCalled();
  });
});
