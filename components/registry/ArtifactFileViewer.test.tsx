/**
 * ArtifactFileViewer component tests.
 * Environment: jsdom (vitest.config.ts routes components/**\/*.test.tsx here).
 *
 * Tests: primary file collapse/expand, non-primary file start collapsed,
 * copy button writes exact content + shows confirmation, download controls
 * (single file vs multi-file zip).
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ArtifactFile } from '@/lib/setup/types';
import ArtifactFileViewer from './ArtifactFileViewer';

// ── Clipboard mock ────────────────────────────────────────────────────────────

// jsdom does not implement navigator.clipboard. Rather than globally stubbing the
// navigator (which is unreliable across jsdom versions), ArtifactFileViewer accepts
// a clipboardWriteFn prop. Tests pass a vi.fn() directly; production omits it
// (defaults to navigator.clipboard.writeText).

let writeTextMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  writeTextMock = vi.fn().mockResolvedValue(undefined);
  // Silence URL.createObjectURL / revokeObjectURL (not available in jsdom).
  Object.defineProperty(URL, 'createObjectURL', {
    value: vi.fn(() => 'blob:test'),
    writable: true,
    configurable: true,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
});

// ── Test fixtures ─────────────────────────────────────────────────────────────

const primaryFile: ArtifactFile = {
  name: 'CLAUDE.md',
  content: '# Project conventions\n\nTests first.',
  isPrimary: true,
};

const secondaryFile: ArtifactFile = {
  name: 'settings.json',
  content: '{ "hooks": {} }',
  isPrimary: false,
};

const thirdFile: ArtifactFile = {
  name: 'commands/tdd.md',
  content: 'Work in strict TDD.',
  isPrimary: false,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ArtifactFileViewer', () => {
  describe('primary file', () => {
    it('renders the primary file name', () => {
      render(<ArtifactFileViewer files={[primaryFile]} slug="my-setup" />);
      expect(screen.getByText(/CLAUDE\.md/)).toBeInTheDocument();
    });

    it('renders the primary file content in a pre element', () => {
      render(<ArtifactFileViewer files={[primaryFile]} slug="my-setup" />);
      expect(screen.getByText(/Tests first\./)).toBeInTheDocument();
    });

    it('primary file opens by default (details has the open attribute)', () => {
      render(<ArtifactFileViewer files={[primaryFile]} slug="my-setup" />);
      expect(screen.getByTestId('file-row-CLAUDE.md')).toHaveAttribute('open');
    });

    it('renders no separate expand/collapse button (header is the toggle)', () => {
      render(<ArtifactFileViewer files={[primaryFile]} slug="my-setup" />);
      expect(
        screen.queryByRole('button', { name: /expand|collapse/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('non-primary files', () => {
    it('renders non-primary file names', () => {
      render(
        <ArtifactFileViewer
          files={[primaryFile, secondaryFile]}
          slug="my-setup"
        />,
      );
      expect(screen.getByText(/settings\.json/)).toBeInTheDocument();
    });

    it('non-primary files start collapsed (details element lacks open attribute)', () => {
      render(
        <ArtifactFileViewer
          files={[primaryFile, secondaryFile]}
          slug="my-setup"
        />,
      );
      // The secondary file uses a <details> element that starts without the open attribute.
      const detailsEl = screen.getByTestId('file-row-settings.json');
      expect(detailsEl).not.toHaveAttribute('open');
    });
  });

  describe('copy button', () => {
    it('copy button writes the exact file content to clipboard', async () => {
      const user = userEvent.setup();
      // Pass writeTextMock directly — avoids needing to stub navigator.clipboard globally.
      render(
        <ArtifactFileViewer
          files={[primaryFile]}
          slug="my-setup"
          clipboardWriteFn={writeTextMock}
        />,
      );
      const copyBtn = screen.getByTestId('copy-btn-CLAUDE.md');
      await user.click(copyBtn);
      expect(writeTextMock).toHaveBeenCalledWith(primaryFile.content);
    });

    it('copy button shows "Copied" confirmation after a successful write', async () => {
      const user = userEvent.setup();
      render(
        <ArtifactFileViewer
          files={[primaryFile]}
          slug="my-setup"
          clipboardWriteFn={writeTextMock}
        />,
      );
      await user.click(screen.getByTestId('copy-btn-CLAUDE.md'));
      await waitFor(() => {
        expect(screen.getByTestId('copy-btn-CLAUDE.md')).toHaveTextContent(/copied/i);
      });
    });
  });

  describe('download control', () => {
    it('single-file item shows a direct download button (not zip)', () => {
      render(<ArtifactFileViewer files={[primaryFile]} slug="my-setup" />);
      const downloadBtn = screen.getByRole('button', { name: /download/i });
      expect(downloadBtn).not.toHaveTextContent(/zip/i);
    });

    it('multi-file item shows a zip download button', () => {
      render(
        <ArtifactFileViewer
          files={[primaryFile, secondaryFile, thirdFile]}
          slug="my-setup"
        />,
      );
      const downloadBtn = screen.getByRole('button', { name: /download/i });
      expect(downloadBtn).toHaveTextContent(/zip/i);
    });
  });
});
