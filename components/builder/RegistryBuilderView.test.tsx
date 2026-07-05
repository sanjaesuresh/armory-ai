/**
 * RegistryBuilderView component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 *
 * The Supabase browser client is mocked so autosave (updateDraftFields) never
 * hits real network. fetch is stubbed per-test for the describe + submit routes.
 * Files are read client-side via the File API (file.text()), which jsdom
 * implements — so uploads work without touching Supabase Storage.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegistryBuilderView from './RegistryBuilderView';
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
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: vi.fn() }),
}));

// Mock the Supabase browser client so executeSave never hits real network.
vi.mock('@/lib/supabase/client', () => ({
  createSupabaseBrowserClient: () => ({}),
}));

// mockUpdateRow controls whether autosave / flush-save succeeds.
const mockUpdateRow = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

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

// ─── Fixture ────────────────────────────────────────────────────────────────

/** A fresh registry (agent) draft: registry fields empty, review_status='draft'. */
const agentDraft: SetupRow = {
  id: 'draft-reg-1',
  slug: 'draft-ab12cd34',
  name: '',
  tagline: '',
  description: '',
  role: 'developer',
  industry: null,
  category: 'engineering',
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
  targets: [],
  tier: 'core',
  instruction_template: '',
  variables: [],
  knowledge_files: [],
  scenarios: [],
  kind: 'agent',
  artifact_files: [],
  repo_url: null,
  capabilities: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// applyAccept:false is a setup-level option — it lets uploads reach the handler
// regardless of the input's `accept` attribute, so we can test our own rejection.
function makeUser() {
  return userEvent.setup({ applyAccept: false });
}

async function uploadFiles(user: ReturnType<typeof userEvent.setup>, files: File[]) {
  const input = screen.getByTestId('registry-file-input');
  await user.upload(input, files);
}

function md(name: string, content = '# Sample\nSome text.') {
  return new File([content], name, { type: 'text/markdown' });
}

/** Advance to the Listing-details step via the step rail. */
async function gotoListing(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /listing details/i }));
}

/** Advance to the Review step via the step rail. */
async function gotoReview(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /review & submit/i }));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('RegistryBuilderView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateRow.mockResolvedValue(undefined);
    vi.stubGlobal('fetch', vi.fn());
  });

  it('accepts a valid .md file, lists it, and marks the first file primary (changeable)', async () => {
    const user = makeUser();
    render(<RegistryBuilderView draft={agentDraft} />);

    await uploadFiles(user, [md('code-review.md'), md('examples.md')]);

    // Both files listed.
    expect(await screen.findByText('code-review.md')).toBeInTheDocument();
    expect(screen.getByText('examples.md')).toBeInTheDocument();

    // The first file is primary by default; the second is not.
    const firstPrimary = screen.getByRole('radio', {
      name: /make code-review\.md the primary file/i,
    }) as HTMLInputElement;
    const secondPrimary = screen.getByRole('radio', {
      name: /make examples\.md the primary file/i,
    }) as HTMLInputElement;
    expect(firstPrimary.checked).toBe(true);
    expect(secondPrimary.checked).toBe(false);

    // The primary marker is changeable via the control.
    await user.click(secondPrimary);
    expect(secondPrimary.checked).toBe(true);
    expect(firstPrimary.checked).toBe(false);
  });

  it('rejects an oversized file (>100 KB) inline and does not add it', async () => {
    const user = makeUser();
    render(<RegistryBuilderView draft={agentDraft} />);

    // 102,401 bytes of ASCII → one byte over the 102,400 limit.
    await uploadFiles(user, [md('big.md', 'a'.repeat(102_401))]);

    const alert = await screen.findByTestId('registry-upload-error');
    expect(alert).toHaveTextContent(/100 KB/);
    // Not added.
    expect(screen.queryByText('big.md')).toBeNull();
  });

  it('rejects an 11th file with the max-10 message', async () => {
    const user = makeUser();
    render(<RegistryBuilderView draft={agentDraft} />);

    const eleven = Array.from({ length: 11 }, (_, i) => md(`file-${i}.md`));
    await uploadFiles(user, eleven);

    const alert = await screen.findByTestId('registry-upload-error');
    expect(alert).toHaveTextContent(/10/);
    // Exactly 10 accepted → 10 primary radios.
    await waitFor(() => expect(screen.getAllByRole('radio')).toHaveLength(10));
  });

  it('rejects a disallowed extension and names the allowed types', async () => {
    const user = makeUser();
    render(<RegistryBuilderView draft={agentDraft} />);

    await uploadFiles(user, [new File(['x'], 'notes.pdf', { type: 'application/pdf' })]);

    const alert = await screen.findByTestId('registry-upload-error');
    expect(alert).toHaveTextContent(/\.md/);
    expect(screen.queryByText('notes.pdf')).toBeNull();
  });

  it('Draft with AI prefills the editable listing fields on success', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ok: true,
        draft: {
          name: 'Code Reviewer',
          tagline: 'Reviews your diffs',
          description: 'A thorough automated code reviewer.',
          capabilities: [{ command: '/review', description: 'Review a diff' }],
        },
      }),
    });

    const user = makeUser();
    render(<RegistryBuilderView draft={agentDraft} />);
    await uploadFiles(user, [md('code-review.md')]);
    await gotoListing(user);

    await user.click(screen.getByRole('button', { name: /draft with ai/i }));

    const nameInput = (await screen.findByRole('textbox', { name: 'Name' })) as HTMLInputElement;
    await waitFor(() => expect(nameInput.value).toBe('Code Reviewer'));
    expect((screen.getByRole('textbox', { name: 'Tagline' }) as HTMLInputElement).value).toBe(
      'Reviews your diffs',
    );
    expect((screen.getByRole('textbox', { name: 'Description' }) as HTMLTextAreaElement).value).toBe(
      'A thorough automated code reviewer.',
    );
    expect((screen.getByRole('textbox', { name: /capability 1 command/i }) as HTMLInputElement).value).toBe(
      '/review',
    );

    // Fields remain editable after the AI prefill.
    await user.clear(nameInput);
    await user.type(nameInput, 'My Reviewer');
    expect(nameInput.value).toBe('My Reviewer');
  });

  it('shows the AI-unavailable notice on failure and keeps the manual form usable with files intact', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('network'));

    const user = makeUser();
    render(<RegistryBuilderView draft={agentDraft} />);
    await uploadFiles(user, [md('code-review.md')]);
    await gotoListing(user);

    await user.click(screen.getByRole('button', { name: /draft with ai/i }));

    // The manual-fallback notice appears.
    expect(await screen.findByTestId('registry-ai-failed')).toBeInTheDocument();

    // The manual form is still usable.
    const nameInput = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    await user.type(nameInput, 'Manual name');
    expect(nameInput.value).toBe('Manual name');

    // The uploaded file is intact (visible again on the Files step).
    await user.click(screen.getByRole('button', { name: /^back$/i }));
    expect(screen.getByText('code-review.md')).toBeInTheDocument();
  });

  it('adds, edits, and removes capability rows', async () => {
    const user = makeUser();
    render(<RegistryBuilderView draft={agentDraft} />);
    await gotoListing(user);

    const addBtn = screen.getByRole('button', { name: /add capability/i });
    await user.click(addBtn);

    const cmd1 = screen.getByRole('textbox', { name: /capability 1 command/i }) as HTMLInputElement;
    await user.type(cmd1, '/first');
    expect(cmd1.value).toBe('/first');

    // Add a second row.
    await user.click(addBtn);
    const cmd2 = screen.getByRole('textbox', { name: /capability 2 command/i }) as HTMLInputElement;
    await user.type(cmd2, '/second');

    // Remove the first row → the remaining row now holds the second's value.
    await user.click(screen.getByRole('button', { name: /remove capability 1/i }));
    await waitFor(() =>
      expect(
        (screen.getByRole('textbox', { name: /capability 1 command/i }) as HTMLInputElement).value,
      ).toBe('/second'),
    );
    expect(screen.queryByRole('textbox', { name: /capability 2 command/i })).toBeNull();
  });

  it('accepts a GitHub HTTPS URL and shows an inline error otherwise', async () => {
    const user = makeUser();
    render(<RegistryBuilderView draft={agentDraft} />);
    await gotoListing(user);

    // Step changes move focus to the step heading via requestAnimationFrame
    // (a11y). Wait for that to settle so it doesn't steal focus mid-typing.
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Listing details' })).toHaveFocus(),
    );

    const gh = screen.getByRole('textbox', { name: /github url/i });

    await user.type(gh, 'https://github.com/acme/tool');
    expect(screen.queryByTestId('registry-github-error')).toBeNull();

    await user.clear(gh);
    await user.type(gh, 'https://gitlab.com/acme/tool');
    expect(await screen.findByTestId('registry-github-error')).toHaveTextContent(/github\.com/i);
  });

  it('surfaces the community submit route validation errors inline', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: false, errors: [{ message: 'Description is too short.' }] }),
    });

    const user = makeUser();
    render(<RegistryBuilderView draft={agentDraft} />);

    await uploadFiles(user, [md('code-review.md')]);
    await gotoListing(user);
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Reviewer');
    await user.type(screen.getByRole('textbox', { name: 'Tagline' }), 'Reviews diffs');
    await user.type(screen.getByRole('textbox', { name: 'Description' }), 'Reviews your code.');

    await gotoReview(user);
    await user.click(screen.getByTestId('registry-submit'));

    await waitFor(() =>
      expect(screen.getByTestId('registry-submit-error')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('registry-submit-error')).toHaveTextContent('Description is too short.');
    expect(mockPush).not.toHaveBeenCalled();
  });
});
