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
import { CLAUDE_CODE_INSTRUCTION_MAX_CHARS } from '@/lib/setup/limits';

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

const claudeCodeTarget: Setup = {
  ...marketingManagerSetup,
  id: 'claude-code-fixture',
  slug: 'claude-code-fixture',
  targets: ['claude-app', 'claude-code'],
};

// A claude-code-only setup whose instruction exceeds CLAUDE_CODE_INSTRUCTION_MAX_CHARS,
// used to exercise the overlimit UI path for the claude-code target.
const overLimitClaudeCode: Setup = {
  ...marketingManagerSetup,
  id: 'over-limit-claude-code',
  slug: 'over-limit-claude-code',
  targets: ['claude-code'],
  instructionTemplate: 'A'.repeat(CLAUDE_CODE_INSTRUCTION_MAX_CHARS + 1_000),
  variables: [],
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

  it('renders the Claude Code option card when the setup targets include claude-code', async () => {
    seedSession(claudeCodeTarget.slug);
    render(<ExportView setup={claudeCodeTarget} />);
    await screen.findByTestId('target-picker');
    // Claude Code option card must be present
    expect(screen.getByTestId('target-claude-code')).toBeTruthy();
  });

  it('switches to the Claude Code flow when the Claude Code target is selected', async () => {
    seedSession(claudeCodeTarget.slug);
    render(<ExportView setup={claudeCodeTarget} />);
    const claudeCodeInput = (await screen.findByTestId('target-claude-code')).querySelector('input');
    expect(claudeCodeInput).toBeTruthy();
    await userEvent.click(claudeCodeInput!);

    await screen.findByRole('heading', { name: /Export to Claude Code/i });
    // Claude Code install CTA must be present, plan-ask must not
    expect(screen.getByTestId('claude-code-install-cta')).toBeTruthy();
    expect(screen.getByTestId('claude-code-install-link')).toBeTruthy();
    expect(screen.queryByTestId('chatgpt-branch-ask')).toBeNull();
    // Persisted the target for InstallView.
    const saved = JSON.parse(sessionStorage.getItem('armory-export-state')!);
    expect(saved.target).toBe('claude-code');
  });

  it('does not show the Claude Code option card when the setup does not target claude-code', async () => {
    seedSession(multiTarget.slug);
    render(<ExportView setup={multiTarget} />);
    await screen.findByTestId('target-picker');
    // multiTarget has claude-app and chatgpt, but not claude-code
    expect(screen.queryByTestId('target-claude-code')).toBeNull();
  });

  it('does not show the ChatGPT option card when the setup targets only claude-app and claude-code', async () => {
    // Fix 2: ChatGPT card must be gated on setup.targets.includes('chatgpt').
    seedSession(claudeCodeTarget.slug);
    render(<ExportView setup={claudeCodeTarget} />);
    await screen.findByTestId('target-picker');
    // claudeCodeTarget has claude-app + claude-code, not chatgpt
    expect(screen.queryByTestId('target-chatgpt')).toBeNull();
    // Both declared targets must be present
    expect(screen.getByTestId('target-claude-app')).toBeTruthy();
    expect(screen.getByTestId('target-claude-code')).toBeTruthy();
  });

  it('overlimit UI for claude-code target renders the "Claude Code" label', async () => {
    // Fix 1 / targetLabel: the overlimit heading must name the correct target.
    sessionStorage.setItem(
      'armory-export-state',
      JSON.stringify({ slug: 'over-limit-claude-code', answers: {} }),
    );
    render(<ExportView setup={overLimitClaudeCode} />);
    const msg = await screen.findByTestId('overlimit-message');
    expect(msg.textContent).toContain('Claude Code');
  });
});
