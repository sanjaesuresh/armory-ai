/**
 * ExportView target-picker tests.
 * Environment: jsdom. No network — useExportSetup compiles client-side.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import ExportView from './ExportView';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import type { Setup } from '@/lib/setup/types';

const answers = {
  brandName: 'Acme',
  hasBrandVoice: false,
  channels: ['Email', 'Instagram'],
  tone: 'Professional',
};

function seedSession(slug: string): void {
  sessionStorage.setItem('armory-export-state', JSON.stringify({ slug, answers }));
}

const multiTarget: Setup = {
  ...marketingManagerSetup,
  id: 'multi-target-fixture',
  slug: 'multi-target-fixture',
  targets: ['claude-app', 'chatgpt'],
};

describe('ExportView — target picker', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('does not render the picker for a claude-app-only setup', async () => {
    seedSession(marketingManagerSetup.slug);
    render(<ExportView setup={marketingManagerSetup} />);
    await screen.findByRole('heading', { name: /Export to Claude/i });
    expect(screen.queryByTestId('target-picker')).toBeNull();
    // The disabled ChatGPT "coming soon" card is present in the single-target case.
    expect(screen.getByText(/Coming soon/i)).toBeTruthy();
  });

  it('renders the picker for a multi-target setup, defaulting to Claude', async () => {
    seedSession(multiTarget.slug);
    render(<ExportView setup={multiTarget} />);
    await screen.findByTestId('target-picker');
    expect(screen.getByRole('heading', { name: /Export to Claude/i })).toBeTruthy();
    // Claude plan question is shown, not the ChatGPT branch question.
    expect(screen.queryByTestId('chatgpt-branch-ask')).toBeNull();
  });

  it('switches to the ChatGPT flow when the ChatGPT target is selected', async () => {
    seedSession(multiTarget.slug);
    render(<ExportView setup={multiTarget} />);
    const chatgptInput = (await screen.findByTestId('target-chatgpt')).querySelector('input');
    expect(chatgptInput).toBeTruthy();
    await userEvent.click(chatgptInput!);

    await screen.findByRole('heading', { name: /Export to ChatGPT/i });
    expect(screen.getByTestId('chatgpt-branch-ask')).toBeTruthy();
    expect(screen.getByTestId('chatgpt-install-link')).toBeTruthy();
    // Persisted the target for InstallView.
    const saved = JSON.parse(sessionStorage.getItem('armory-export-state')!);
    expect(saved.target).toBe('chatgpt');
  });
});
