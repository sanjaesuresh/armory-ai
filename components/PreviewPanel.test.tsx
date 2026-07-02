/**
 * PreviewPanel component tests.
 * Environment: jsdom (routed via vitest.config.ts dom project).
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PreviewPanel from './PreviewPanel';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import type { Answers } from '@/lib/setup/types';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const fullAnswers: Answers = {
  brandName: 'AcmeCo',
  channels: ['Email', 'Instagram'],
  tone: 'Professional',
  hasBrandVoice: false,
};

// A phrase present in the compiled instruction but never in the summary.
// From the instructionTemplate: "Never invent facts about {{brandName}}, its products..."
const instructionOnlyPhrase = /Never invent facts about/;

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('PreviewPanel', () => {
  it('summary updates live when answers change', () => {
    const { rerender } = render(
      <PreviewPanel setup={marketingManagerSetup} answers={fullAnswers} />,
    );

    // First render: AcmeCo appears in summary
    expect(screen.getByText(/AcmeCo/)).toBeInTheDocument();

    // Rerender with a different brand name
    const updated: Answers = { ...fullAnswers, brandName: 'BetaCorp' };
    rerender(<PreviewPanel setup={marketingManagerSetup} answers={updated} />);

    expect(screen.getByText(/BetaCorp/)).toBeInTheDocument();
    // AcmeCo must be gone now (not a stale render)
    expect(screen.queryByText(/AcmeCo/)).not.toBeInTheDocument();
  });

  it('the static example question and answer from the setup are shown', () => {
    render(<PreviewPanel setup={marketingManagerSetup} answers={fullAnswers} />);

    const scenario = marketingManagerSetup.scenarios[0];
    expect(screen.getByText(scenario.userInput)).toBeInTheDocument();
    expect(screen.getByText(scenario.expectedBehavior)).toBeInTheDocument();
  });

  it('full instructions are hidden behind a toggle and revealed on expand', () => {
    render(<PreviewPanel setup={marketingManagerSetup} answers={fullAnswers} />);

    // The toggle button must exist
    const toggle = screen.getByRole('button', { name: /view the full instructions/i });
    expect(toggle).toBeInTheDocument();

    // Before clicking: instruction-only content is absent
    expect(screen.queryByText(instructionOnlyPhrase)).not.toBeInTheDocument();

    // Expand
    fireEvent.click(toggle);

    // After clicking: instruction text is rendered
    expect(screen.getByText(instructionOnlyPhrase)).toBeInTheDocument();
  });

  it('the panel never shows raw instructions before the toggle is opened', () => {
    render(<PreviewPanel setup={marketingManagerSetup} answers={fullAnswers} />);

    // A phrase that only appears in the compiled instruction, not in summary or scenario text
    expect(screen.queryByText(instructionOnlyPhrase)).not.toBeInTheDocument();
  });

  it('collapses the disclosure when compile recovers from failure', () => {
    const { rerender } = render(
      <PreviewPanel setup={marketingManagerSetup} answers={fullAnswers} />,
    );

    // Expand the disclosure
    const toggle = screen.getByRole('button', { name: /view the full instructions/i });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(instructionOnlyPhrase)).toBeInTheDocument();

    // Break compile by removing required answers — placeholder renders
    rerender(<PreviewPanel setup={marketingManagerSetup} answers={{}} />);
    expect(screen.queryByRole('button', { name: /view the full instructions/i })).not.toBeInTheDocument();

    // Restore complete answers — compile succeeds; disclosure must be collapsed
    rerender(<PreviewPanel setup={marketingManagerSetup} answers={fullAnswers} />);
    const toggleAfter = screen.getByRole('button', { name: /view the full instructions/i });
    expect(toggleAfter).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(instructionOnlyPhrase)).not.toBeInTheDocument();
  });

  it('shows a gentle placeholder when required answers are missing', () => {
    render(<PreviewPanel setup={marketingManagerSetup} answers={{}} />);

    expect(
      screen.getByText(/Fill in the required fields to see your preview/),
    ).toBeInTheDocument();

    // None of the three layers should appear
    expect(screen.queryByText(/AcmeCo/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /view the full instructions/i })).not.toBeInTheDocument();
  });
});
