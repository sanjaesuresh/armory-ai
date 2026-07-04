/**
 * ReviewQueue component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 *
 * Tests the approve / reject controls, note-required gate, and fetch calls.
 * Never instantiates real Supabase clients or network connections.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ReviewQueue, { type QueueItemData } from './ReviewQueue';

// ── Module mocks ──────────────────────────────────────────────────────────────

const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const baseItem: QueueItemData = {
  id: 'setup-1',
  name: 'SEO Blog Generator',
  author: 'abc123def456',
  submittedAt: '3 days ago',
  needsAttention: true,
  findings: [
    {
      pass: 'rules',
      code: 'instruction-override',
      message: 'Template contains "ignore future instructions".',
      path: 'instructionTemplate',
    },
  ],
  compiledInstruction: 'You are an SEO blog writer. [placeholder]',
};

const cleanItem: QueueItemData = {
  id: 'setup-2',
  name: 'Weekly Standup',
  author: 'xyz789',
  submittedAt: '2 days ago',
  needsAttention: false,
  findings: [],
  compiledInstruction: 'Summarize standups.',
};

const modelFlagItem: QueueItemData = {
  id: 'setup-3',
  name: 'Suspicious Prompter',
  author: 'badactor1',
  submittedAt: '1 hour ago',
  needsAttention: true,
  findings: [
    {
      pass: 'model',
      code: 'model-flagged',
      message: 'The grader flagged the template as acting against the installer.',
      path: 'instructionTemplate',
    },
  ],
  compiledInstruction: 'You are a helpful assistant.',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ReviewQueue', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchSpy: ReturnType<typeof vi.fn> & { mock: any };

  beforeEach(() => {
    vi.clearAllMocks();
    // Replace global fetch with a spy so we never make real network calls.
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ── Empty state ────────────────────────────────────────────────────────────

  it('renders the empty state when no items are provided', () => {
    render(<ReviewQueue items={[]} />);
    expect(screen.getByTestId('review-queue-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('review-detail')).toBeNull();
  });

  // ── Queue list ─────────────────────────────────────────────────────────────

  it('renders a queue item row for each item', () => {
    render(<ReviewQueue items={[baseItem, cleanItem]} />);
    expect(screen.getByTestId('queue-item-setup-1')).toBeInTheDocument();
    expect(screen.getByTestId('queue-item-setup-2')).toBeInTheDocument();
  });

  it('shows the "Needs attention" flag only on flagged items', () => {
    render(<ReviewQueue items={[baseItem, cleanItem]} />);
    // baseItem has needsAttention=true
    expect(screen.getByTestId('queue-item-setup-1').textContent).toContain('Needs attention');
    // cleanItem does not
    expect(screen.getByTestId('queue-item-setup-2').textContent).not.toContain('Needs attention');
  });

  // ── Note-required gate ─────────────────────────────────────────────────────

  it('reject button is disabled when note is empty', () => {
    render(<ReviewQueue items={[baseItem]} />);
    const rejectBtn = screen.getByTestId('btn-reject');
    expect(rejectBtn).toBeDisabled();
  });

  it('reject button becomes enabled when note is non-empty', async () => {
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);
    const rejectBtn = screen.getByTestId('btn-reject');
    const noteArea = screen.getByTestId('mod-note');

    expect(rejectBtn).toBeDisabled();
    await user.type(noteArea, 'Please fix the override attempt.');
    expect(rejectBtn).not.toBeDisabled();
  });

  it('reject button is disabled again if note is cleared', async () => {
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);
    const rejectBtn = screen.getByTestId('btn-reject');
    const noteArea = screen.getByTestId('mod-note');

    await user.type(noteArea, 'Some note');
    expect(rejectBtn).not.toBeDisabled();
    await user.clear(noteArea);
    expect(rejectBtn).toBeDisabled();
  });

  // ── Approve button always enabled ──────────────────────────────────────────

  it('approve button is enabled without a note', () => {
    render(<ReviewQueue items={[baseItem]} />);
    expect(screen.getByTestId('btn-approve')).not.toBeDisabled();
  });

  // ── Approve action ─────────────────────────────────────────────────────────

  it('calls fetch with action=approve and shows success on approve', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);

    await user.click(screen.getByTestId('btn-approve'));

    await waitFor(() =>
      expect(screen.getByTestId('action-success')).toBeInTheDocument(),
    );

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/admin/moderate');
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body.setupId).toBe('setup-1');
    expect(body.action).toBe('approve');
    expect(mockRefresh).toHaveBeenCalledOnce();
  });

  // ── Fix 1: busy reset on success ──────────────────────────────────────────

  it('re-enables the action buttons after a successful approve', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);

    await user.click(screen.getByTestId('btn-approve'));

    await waitFor(() =>
      expect(screen.getByTestId('action-success')).toBeInTheDocument(),
    );

    expect(screen.getByTestId('btn-approve')).not.toBeDisabled();
  });

  // ── Reject action ──────────────────────────────────────────────────────────

  it('calls fetch with action=reject and note on reject', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);

    await user.type(screen.getByTestId('mod-note'), 'Remove the override attempt.');
    await user.click(screen.getByTestId('btn-reject'));

    await waitFor(() =>
      expect(screen.getByTestId('action-success')).toBeInTheDocument(),
    );

    const body = JSON.parse(
      (fetchSpy.mock.calls[0] as [string, RequestInit])[1].body as string,
    ) as Record<string, unknown>;
    expect(body.action).toBe('reject');
    expect(body.note).toBe('Remove the override attempt.');
  });

  // ── Error handling ─────────────────────────────────────────────────────────

  it('shows an error message when the route returns ok=false', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: false, error: 'Not authorized.' }), {
        status: 403,
      }),
    );
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);

    await user.click(screen.getByTestId('btn-approve'));

    await waitFor(() =>
      expect(screen.getByTestId('action-error')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('action-error').textContent).toContain('Not authorized.');
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('shows a network error message on fetch failure', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('network error'));
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem]} />);

    await user.click(screen.getByTestId('btn-approve'));

    await waitFor(() =>
      expect(screen.getByTestId('action-error')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('action-error').textContent).toContain('Network error');
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  // ── Safety findings ────────────────────────────────────────────────────────

  it('renders a clean finding when there are no safety findings', () => {
    render(<ReviewQueue items={[cleanItem]} />);
    expect(screen.getByTestId('finding-clean')).toBeInTheDocument();
  });

  it('renders individual finding rows when findings are present', () => {
    render(<ReviewQueue items={[baseItem]} />);
    expect(screen.getByTestId('finding-0')).toBeInTheDocument();
    expect(screen.getByTestId('finding-0').textContent).toContain(
      'Template contains "ignore future instructions".',
    );
  });

  // ── Fix 2: model-pass findings rendered as flags, not clean ───────────────

  it('renders a model-pass finding with finding-flag class, not finding-ok', () => {
    render(<ReviewQueue items={[modelFlagItem]} />);
    const finding = screen.getByTestId('finding-0');
    expect(finding).toBeInTheDocument();
    expect(finding.className).toContain('finding-flag');
    expect(finding.className).not.toContain('finding-ok');
  });

  it('renders the correct label text for a model-pass finding', () => {
    render(<ReviewQueue items={[modelFlagItem]} />);
    const finding = screen.getByTestId('finding-0');
    expect(finding.textContent).toContain('Model pass — flagged.');
    expect(finding.textContent).not.toContain('Model pass.');
  });

  // ── Detail view on item selection ─────────────────────────────────────────

  it('switches the detail view when a different queue item is selected', async () => {
    const user = userEvent.setup();
    render(<ReviewQueue items={[baseItem, cleanItem]} />);

    // Initially shows the first item.
    expect(screen.getByTestId('review-detail').textContent).toContain('SEO Blog Generator');

    // Click the "Review" button for the second item.
    await user.click(screen.getByTestId('review-btn-setup-2'));

    expect(screen.getByTestId('review-detail').textContent).toContain('Weekly Standup');
    expect(screen.getByTestId('finding-clean')).toBeInTheDocument();
  });
});
