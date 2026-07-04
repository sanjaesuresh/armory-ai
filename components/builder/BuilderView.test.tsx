/**
 * BuilderView component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 *
 * The Supabase browser client is never instantiated here: the Continue
 * validation path returns early (setFindings + return) before executeSave is
 * called, so no env vars are needed for the validation tests.
 *
 * Submit tests mock the Supabase store and fetch so no real network calls
 * are made.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BuilderView from './BuilderView';
import type { SetupRow } from '@/lib/catalog/repository';

// next/link needs a mock in jsdom — no Next.js routing context is available.
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockPush = vi.fn();

// next/navigation needs a mock — useRouter() throws without a mounted app router.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: vi.fn() }),
}));

// Mock the Supabase browser client so executeSave never hits real network.
vi.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowserClient: () => ({}),
}));

// mockUpdateRow controls whether executeSave (and therefore the flush save)
// succeeds or fails. Default: resolves (success). Override per-test.
const mockUpdateRow = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

// Partial mock: keep all real exports (buildDraftUpdate etc.) and only
// replace createSupabaseDraftsStore so it uses mockUpdateRow.
// BuilderView's executeSave calls updateDraftFields (content-lock); updateRow
// is kept on the mock so other store callers (status transitions) still work.
vi.mock('@/lib/community/drafts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/community/drafts')>();
  return {
    ...actual,
    createSupabaseDraftsStore: () => ({
      updateRow: mockUpdateRow,
      updateDraftFields: mockUpdateRow,
    }),
  };
});

// ─── Fixtures ────────────────────────────────────────────────────────────────

/** A draft whose metadata fields are empty — will fail step-0 validation. */
const emptyDraft: SetupRow = {
  id: 'draft-id-1',
  slug: 'draft-abc12345',
  name: '',
  tagline: '',
  description: '',
  role: '',
  industry: null,
  category: 'general',
  tags: [],
  source: 'community',
  author: 'user-1',
  version: '0.1.0',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  review_status: 'draft',
  upvotes: 0,
  featured: null,
  popularity: null,
  targets: ['claude-app'],
  tier: 'core',
  instruction_template: '',
  variables: [],
  knowledge_files: [],
  scenarios: [],
};

/**
 * A draft with all required fields filled — passes both step-0 and step-1
 * validation so it can advance to the submit step in tests.
 */
const validDraft: SetupRow = {
  id: 'draft-id-2',
  slug: 'cold-email-writer',
  name: 'Cold Email Writer',
  tagline: 'Personalized B2B cold emails.',
  description: 'Writes short, specific cold emails for sales reps.',
  role: 'sales-rep',
  industry: null,
  category: 'sales',
  tags: [],
  source: 'community',
  author: 'user-1',
  version: '0.1.0',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  review_status: 'draft',
  upvotes: 0,
  featured: null,
  popularity: null,
  targets: ['claude-app'],
  tier: 'core',
  instruction_template: 'You write cold emails. Keep them under 100 words.',
  variables: [],
  knowledge_files: [],
  scenarios: [],
};

/**
 * Clicks Continue 3 times with a valid draft to advance to the submit step.
 * Continue on each step fires a non-blocking void executeSave; we advance
 * regardless of save outcome.
 */
async function navigateToSubmitStep(user: ReturnType<typeof userEvent.setup>) {
  // Step 0 → 1
  await user.click(screen.getByTestId('builder-continue'));
  // Step 1 → 2
  await user.click(screen.getByTestId('builder-continue'));
  // Step 2 → 3 (submit step — no Continue button, submit rendered by BuilderPreview)
  await user.click(screen.getByTestId('builder-continue'));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('BuilderView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: saves succeed unless overridden in a specific test.
    mockUpdateRow.mockResolvedValue(undefined);
    vi.stubGlobal('fetch', vi.fn());
  });

  it('clicking Continue on step 0 with empty required fields populates findings and renders role="alert" errors', () => {
    render(<BuilderView draft={emptyDraft} />);

    // No inline alerts before Continue is clicked
    expect(screen.queryAllByRole('alert')).toHaveLength(0);

    fireEvent.click(screen.getByTestId('builder-continue'));

    // validateMetadata surfaces errors for the empty name, tagline, description,
    // and role fields — MetadataEditor renders each as role="alert".
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
  });

  // ── Submit: non-ok API response shows inline error ─────────────────────────

  it('handleSubmit shows the inline error banner when the API returns ok:false', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({
        ok: false,
        errors: [{ message: 'Name is too short.' }],
      }),
    });

    const user = userEvent.setup();
    render(<BuilderView draft={validDraft} />);
    await navigateToSubmitStep(user);

    // The submit button is rendered by BuilderPreview on step 3.
    await user.click(screen.getByTestId('builder-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('builder-submit-error')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('builder-submit-error')).toHaveTextContent('Name is too short.');
    // Not redirected
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('submit button is disabled while the POST is in flight', async () => {
    // Use a promise that never resolves so isSubmitting stays true.
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise(() => {}),
    );

    const user = userEvent.setup();
    render(<BuilderView draft={validDraft} />);
    await navigateToSubmitStep(user);

    await user.click(screen.getByTestId('builder-submit'));

    // Button should become disabled while submitting.
    await waitFor(() =>
      expect(screen.getByTestId('builder-submit')).toBeDisabled(),
    );
  });

  // ── H1: flush save failure aborts the submit ───────────────────────────────

  it('handleSubmit aborts without calling fetch when the flush save fails', async () => {
    // All updateRow calls throw (simulates DB/network failure).
    mockUpdateRow.mockRejectedValue(new Error('DB unavailable'));

    const user = userEvent.setup();
    render(<BuilderView draft={validDraft} />);
    await navigateToSubmitStep(user);

    await user.click(screen.getByTestId('builder-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('builder-submit-error')).toBeInTheDocument(),
    );
    // fetch must NOT have been called — the POST was aborted.
    expect(globalThis.fetch).not.toHaveBeenCalled();
    // Error message matches the save-failure copy.
    expect(screen.getByTestId('builder-submit-error')).toHaveTextContent(
      "Your changes couldn't be saved",
    );
  });
});
