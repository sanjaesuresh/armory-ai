/**
 * RepoBrowser component tests.
 * Environment: jsdom (vitest.config.ts routes components/**\/*.test.tsx here).
 *
 * All fetch calls are mocked. Tests exercise:
 * - renders nothing when repoUrl is null or invalid
 * - renders README content when found in root entries
 * - renders root file tree entries
 * - expanding a folder fetches + shows children
 * - hides the entire section on root fetch failure
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RepoBrowser from './RepoBrowser';

// ── Fetch mock helpers ────────────────────────────────────────────────────────

function makeOkResponse(data: unknown): Response {
  return {
    ok: true,
    json: () => Promise.resolve(data),
  } as unknown as Response;
}

function makeErrorResponse(): Response {
  return { ok: false } as unknown as Response;
}

// root listing with a README and one folder
const ROOT_DIR_RESPONSE = {
  ok: true,
  content: {
    type: 'dir',
    path: '',
    entries: [
      { name: 'src', path: 'src', type: 'dir' },
      { name: 'README.md', path: 'README.md', type: 'file', size: 1234 },
    ],
  },
};

const README_FILE_RESPONSE = {
  ok: true,
  content: {
    type: 'file',
    path: 'README.md',
    name: 'README.md',
    content: '# Hello world readme',
    size: 1234,
    truncated: false,
  },
};

const SRC_DIR_RESPONSE = {
  ok: true,
  content: {
    type: 'dir',
    path: 'src',
    entries: [
      { name: 'index.ts', path: 'src/index.ts', type: 'file', size: 512 },
    ],
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RepoBrowser', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when repoUrl is null', () => {
    const { container } = render(<RepoBrowser repoUrl={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when repoUrl is not a GitHub URL', () => {
    const { container } = render(<RepoBrowser repoUrl="https://gitlab.com/foo/bar" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when the root fetch fails', async () => {
    fetchMock.mockResolvedValueOnce(makeErrorResponse());
    const { container } = render(<RepoBrowser repoUrl="https://github.com/owner/repo" />);
    // wait for the async effect to complete
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
    // after failure, the entire section is absent
    await waitFor(() => {
      expect(container.querySelector('section')).toBeNull();
    });
  });

  it('renders the "Repository" label and "View on GitHub" link after loading', async () => {
    fetchMock
      .mockResolvedValueOnce(makeOkResponse(ROOT_DIR_RESPONSE))
      .mockResolvedValueOnce(makeOkResponse(README_FILE_RESPONSE));

    render(<RepoBrowser repoUrl="https://github.com/owner/repo" />);

    await waitFor(() => {
      expect(screen.getByText(/Repository/i)).toBeInTheDocument();
    });

    const link = screen.getByRole('link', { name: /View on GitHub/i });
    expect(link).toHaveAttribute('href', 'https://github.com/owner/repo');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders README content in an open <details> block', async () => {
    fetchMock
      .mockResolvedValueOnce(makeOkResponse(ROOT_DIR_RESPONSE))
      .mockResolvedValueOnce(makeOkResponse(README_FILE_RESPONSE));

    render(<RepoBrowser repoUrl="https://github.com/owner/repo" />);

    await waitFor(() => {
      expect(screen.getByText('# Hello world readme')).toBeInTheDocument();
    });

    // the details block should have open attribute by default
    const details = screen.getByText('# Hello world readme').closest('details');
    expect(details).not.toBeNull();
    expect(details?.hasAttribute('open')).toBe(true);
  });

  it('renders root tree entries including the folder and file', async () => {
    fetchMock
      .mockResolvedValueOnce(makeOkResponse(ROOT_DIR_RESPONSE))
      .mockResolvedValueOnce(makeOkResponse(README_FILE_RESPONSE));

    render(<RepoBrowser repoUrl="https://github.com/owner/repo" />);

    await waitFor(() => {
      // the folder "src" should appear in the tree (only one occurrence)
      expect(screen.getByText('src')).toBeInTheDocument();
      // README.md appears in both the file-row header and the tree entry — use getAllByText
      expect(screen.getAllByText('README.md').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('expanding a folder fetches its children and shows them', async () => {
    fetchMock
      .mockResolvedValueOnce(makeOkResponse(ROOT_DIR_RESPONSE))  // root listing
      .mockResolvedValueOnce(makeOkResponse(README_FILE_RESPONSE)) // readme
      .mockResolvedValueOnce(makeOkResponse(SRC_DIR_RESPONSE));   // src/ children

    const user = userEvent.setup();
    render(<RepoBrowser repoUrl="https://github.com/owner/repo" />);

    // wait for root to load
    await waitFor(() => {
      expect(screen.getByText('src')).toBeInTheDocument();
    });

    // the folder toggle button
    const expandBtn = screen.getByRole('button', { name: /Expand folder src/i });
    expect(expandBtn).toHaveAttribute('aria-expanded', 'false');

    await act(async () => {
      await user.click(expandBtn);
    });

    // after expand, children should appear
    await waitFor(() => {
      expect(screen.getByText('index.ts')).toBeInTheDocument();
    });

    // button aria-expanded should now be true
    const collapseBtn = screen.getByRole('button', { name: /Collapse folder src/i });
    expect(collapseBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not re-fetch a folder on second expand', async () => {
    fetchMock
      .mockResolvedValueOnce(makeOkResponse(ROOT_DIR_RESPONSE))
      .mockResolvedValueOnce(makeOkResponse(README_FILE_RESPONSE))
      .mockResolvedValueOnce(makeOkResponse(SRC_DIR_RESPONSE)); // only called once

    const user = userEvent.setup();
    render(<RepoBrowser repoUrl="https://github.com/owner/repo" />);

    await waitFor(() => screen.getByText('src'));

    const expandBtn = screen.getByRole('button', { name: /Expand folder src/i });

    // expand, then collapse, then expand again
    await act(async () => { await user.click(expandBtn); });
    await waitFor(() => screen.getByText('index.ts'));
    await act(async () => { await user.click(screen.getByRole('button', { name: /Collapse folder src/i })); });
    await act(async () => { await user.click(screen.getByRole('button', { name: /Expand folder src/i })); });

    // fetch should still only have been called 3 times (root + readme + src once)
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
