/**
 * InstallView walkthrough-target tests.
 * Environment: jsdom. Reads target + branch from sessionStorage.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import InstallView from './InstallView';

function seed(target: string, chatGptBranch?: string): void {
  sessionStorage.setItem(
    'armory-export-state',
    JSON.stringify({
      slug: 'marketing-manager',
      answers: { brandName: 'Acme' },
      target,
      chatGptBranch,
    }),
  );
}

describe('InstallView — walkthrough per target', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('renders the Claude walkthrough by default (claude-app)', async () => {
    seed('claude-app');
    render(<InstallView />);
    await screen.findByRole('heading', { name: /Install in Claude/i });
    // Appears in both the rail label and the panel heading.
    expect(screen.getAllByText(/Create a new Project/i).length).toBeGreaterThan(0);
  });

  it('renders the ChatGPT Custom GPT walkthrough when target is chatgpt', async () => {
    seed('chatgpt', 'custom-gpt');
    render(<InstallView />);
    await screen.findByRole('heading', { name: /Install in ChatGPT/i });
    expect(screen.getAllByText(/Start a new GPT/i).length).toBeGreaterThan(0);
  });

  it('renders the no-builder walkthrough for the Custom Instructions branch', async () => {
    seed('chatgpt', 'no-builder');
    render(<InstallView />);
    await screen.findByRole('heading', { name: /Install in ChatGPT/i });
    expect(screen.getAllByText(/Open Custom Instructions/i).length).toBeGreaterThan(0);
  });
});
