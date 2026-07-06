/**
 * Lesson block component tests (dom project — jsdom).
 *
 * Deterministic: fabricated block data, no network, no router. Covers the
 * behavior contracts from Task 5's brief (Step 1). Diagram-registry parity is
 * asserted separately in components/learn/diagrams/registry.test.tsx.
 */

import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import ProseBlock from './ProseBlock';
import CalloutBlock from './CalloutBlock';
import HotspotDiagramBlock from './HotspotDiagramBlock';
import FlipCardsBlock from './FlipCardsBlock';
import StepThroughBlock from './StepThroughBlock';
import BeforeAfterBlock from './BeforeAfterBlock';
import ComparisonTableBlock from './ComparisonTableBlock';
import QuizBlock from './QuizBlock';

import { DIAGRAM_MANIFEST } from '@/lib/learn/diagramManifest';
import type {
  ProseBlock as ProseBlockData,
  CalloutBlock as CalloutBlockData,
  HotspotDiagramBlock as HotspotBlockData,
  FlipCardsBlock as FlipCardsBlockData,
  StepThroughBlock as StepBlockData,
  BeforeAfterBlock as BeforeAfterBlockData,
  ComparisonTableBlock as ComparisonBlockData,
  Quiz,
} from '@/lib/learn/types';

// ─── ProseBlock ────────────────────────────────────────────────────────────
describe('ProseBlock', () => {
  it('renders the heading and every paragraph', () => {
    const block: ProseBlockData = {
      type: 'prose',
      heading: 'What is context?',
      paragraphs: ['First para.', 'Second para.'],
    };
    render(<ProseBlock block={block} />);
    expect(screen.getByRole('heading', { name: 'What is context?' })).toBeInTheDocument();
    expect(screen.getByText('First para.')).toBeInTheDocument();
    expect(screen.getByText('Second para.')).toBeInTheDocument();
  });
});

// ─── CalloutBlock ──────────────────────────────────────────────────────────
describe('CalloutBlock', () => {
  it('tip tone renders the tip visual and the passage', () => {
    const block: CalloutBlockData = { type: 'callout', tone: 'tip', passage: 'Start fresh.' };
    render(<CalloutBlock block={block} />);
    expect(screen.getByRole('note', { name: 'Tip' })).toBeInTheDocument();
    expect(screen.getByText('Start fresh.')).toBeInTheDocument();
  });

  it('warning tone selects the warning visual', () => {
    const block: CalloutBlockData = { type: 'callout', tone: 'warning', passage: 'Careful.' };
    render(<CalloutBlock block={block} />);
    expect(screen.getByRole('note', { name: 'Warning' })).toBeInTheDocument();
  });
});

// ─── HotspotDiagramBlock ──────────────────────────────────────────────────
function hotspotBlock(): HotspotBlockData {
  return {
    type: 'hotspotDiagram',
    diagramId: 'chat-flow',
    hotspots: [
      { id: 'your-message', title: 'Your message', body: 'The prompt you send.' },
      { id: 'conversation-history', title: 'Conversation history', body: 'Past turns.' },
      { id: 'the-model', title: 'The model', body: 'Reads everything.' },
      { id: 'response', title: 'Response', body: 'What comes back.' },
    ],
  };
}

describe('HotspotDiagramBlock', () => {
  it('renders one hotspot button per manifest hotspot for its diagram', () => {
    const { container } = render(<HotspotDiagramBlock block={hotspotBlock()} />);
    const buttons = container.querySelectorAll('[data-hotspot-id]');
    expect(buttons.length).toBe(DIAGRAM_MANIFEST['chat-flow'].length);
  });

  it('opens the panel with the matching title, exposes the expanded state, and closes on second click', () => {
    const { container } = render(<HotspotDiagramBlock block={hotspotBlock()} />);
    const btn = container.querySelector('[data-hotspot-id="the-model"]') as HTMLButtonElement;

    // Idle before any click — no active panel title.
    expect(screen.queryByText('Reads everything.')).not.toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('The model')).toBeInTheDocument();
    expect(screen.getByText('Reads everything.')).toBeInTheDocument();

    // Second click on the active hotspot closes it.
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Reads everything.')).not.toBeInTheDocument();
  });

  it('keyboard Enter on a focused hotspot behaves like a click', async () => {
    const user = userEvent.setup();
    const { container } = render(<HotspotDiagramBlock block={hotspotBlock()} />);
    const btn = container.querySelector('[data-hotspot-id="response"]') as HTMLButtonElement;
    btn.focus();
    await user.keyboard('{Enter}');
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('What comes back.')).toBeInTheDocument();
  });
});

// ─── FlipCardsBlock ────────────────────────────────────────────────────────
describe('FlipCardsBlock', () => {
  const block: FlipCardsBlockData = {
    type: 'flipCards',
    cards: [
      { front: 'Token', back: 'A chunk of text.' },
      { front: 'Context window', back: 'Working memory.' },
    ],
  };

  it('renders each card as a button and flips / unflips independently', () => {
    render(<FlipCardsBlock block={block} />);
    const cardA = screen.getByRole('button', { name: /Token/ });
    const cardB = screen.getByRole('button', { name: /Context window/ });

    expect(cardA).toHaveAttribute('aria-pressed', 'false');
    expect(cardB).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(cardA);
    expect(cardA).toHaveAttribute('aria-pressed', 'true');
    expect(cardB).toHaveAttribute('aria-pressed', 'false'); // independent

    fireEvent.click(cardA);
    expect(cardA).toHaveAttribute('aria-pressed', 'false'); // unflips
  });
});

// ─── StepThroughBlock ─────────────────────────────────────────────────────
describe('StepThroughBlock', () => {
  const block: StepBlockData = {
    type: 'stepThrough',
    steps: [
      { title: 'Step one', body: 'Body one.' },
      { title: 'Step two', body: 'Body two.' },
      { title: 'Step three', body: 'Body three.' },
    ],
  };

  it('starts at step one with previous disabled, then advances the visible title', () => {
    render(<StepThroughBlock block={block} />);

    expect(screen.getByRole('heading', { name: /Step one/ })).toBeVisible();
    // The step-two panel carries the hidden attribute, so it is absent from the
    // accessibility tree (and not visible) until advanced to.
    expect(screen.queryByRole('heading', { name: /Step two/ })).toBeNull();
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();

    const prev = screen.getByRole('button', { name: /previous/i });
    expect(prev).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByRole('heading', { name: /Step two/ })).toBeVisible();
    expect(screen.queryByRole('heading', { name: /Step one/ })).toBeNull();
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
  });
});

// ─── BeforeAfterBlock ─────────────────────────────────────────────────────
describe('BeforeAfterBlock', () => {
  const block: BeforeAfterBlockData = {
    type: 'beforeAfter',
    beforeLabel: 'Without context',
    afterLabel: 'With context',
    beforeExchanges: [
      { speaker: 'user', text: 'Before user msg' },
      { speaker: 'ai', text: 'Before ai msg' },
    ],
    afterExchanges: [
      { speaker: 'user', text: 'After user msg' },
      { speaker: 'ai', text: 'After ai msg' },
    ],
  };

  it('shows only the before pane initially and swaps on toggle', () => {
    render(<BeforeAfterBlock block={block} />);

    expect(screen.getByText('Before user msg')).toBeVisible();
    expect(screen.getByText('After user msg')).not.toBeVisible();

    fireEvent.click(screen.getByRole('tab', { name: 'With context' }));

    expect(screen.getByText('After user msg')).toBeVisible();
    expect(screen.getByText('Before user msg')).not.toBeVisible();
  });
});

// ─── ComparisonTableBlock ─────────────────────────────────────────────────
describe('ComparisonTableBlock', () => {
  it('renders a table with column headers and rows', () => {
    const block: ComparisonBlockData = {
      type: 'comparisonTable',
      headers: ['Feature', 'Claude', 'ChatGPT'],
      rows: [['Context size', '200k', '128k']],
    };
    render(<ComparisonTableBlock block={block} />);

    expect(screen.getByRole('columnheader', { name: 'Feature' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Claude' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Context size' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '200k' })).toBeInTheDocument();
  });
});

// ─── QuizBlock ─────────────────────────────────────────────────────────────
function quizData(): Quiz {
  return {
    questions: [
      { prompt: 'Q1 prompt?', choices: ['a-choice', 'b-choice', 'c-choice'], correctIndex: 1, explanation: 'Because b.' },
      { prompt: 'Q2 prompt?', choices: ['x-choice', 'y-choice'], correctIndex: 0, explanation: 'Because x.' },
    ],
  };
}

describe('QuizBlock', () => {
  it('disables submit until a choice is selected', () => {
    render(<QuizBlock block={quizData()} onComplete={vi.fn()} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('radio', { name: 'a-choice' }));
    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
  });

  it('a wrong answer reveals the correct choice and shows the explanation', () => {
    render(<QuizBlock block={quizData()} onComplete={vi.fn()} />);

    fireEvent.click(screen.getByRole('radio', { name: 'a-choice' })); // wrong
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Because b.')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'b-choice' })).toHaveClass('qc-correct');
    expect(screen.getByRole('radio', { name: 'a-choice' })).toHaveClass('qc-wrong');
  });

  it('advancing through all questions reaches results with the right N-of-M and fires onComplete once', () => {
    const onComplete = vi.fn();
    render(<QuizBlock block={quizData()} onComplete={onComplete} />);

    // Q1 — answer wrong.
    fireEvent.click(screen.getByRole('radio', { name: 'a-choice' }));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Q2 — answer correct.
    fireEvent.click(screen.getByRole('radio', { name: 'x-choice' }));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /result/i }));

    expect(screen.getByText(/1 of 2 correct/i)).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(1, 2);
  });

  // ── Roving tabindex (ARIA radio-group keyboard pattern) ──────────────────

  it('initially the first choice has tabIndex 0 and the rest have -1', () => {
    render(<QuizBlock block={quizData()} onComplete={vi.fn()} />);
    const choices = screen.getAllByRole('radio');
    expect(choices[0]).toHaveAttribute('tabindex', '0');
    choices.slice(1).forEach((c) => expect(c).toHaveAttribute('tabindex', '-1'));
  });

  it('after selecting choice 2 (b-choice) tabIndex 0 moves to it and off the others', () => {
    render(<QuizBlock block={quizData()} onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole('radio', { name: 'b-choice' })); // index 1
    const choices = screen.getAllByRole('radio');
    expect(choices[1]).toHaveAttribute('tabindex', '0');
    [0, 2].forEach((i) => expect(choices[i]).toHaveAttribute('tabindex', '-1'));
  });

  it('ArrowDown from choice 1 focuses and selects choice 2', () => {
    render(<QuizBlock block={quizData()} onComplete={vi.fn()} />);
    const group = screen.getByRole('radiogroup');
    fireEvent.click(screen.getAllByRole('radio')[0]); // select a-choice (index 0)
    fireEvent.keyDown(group, { key: 'ArrowDown' });
    const choices = screen.getAllByRole('radio');
    expect(choices[1]).toHaveAttribute('aria-checked', 'true');
    expect(document.activeElement).toBe(choices[1]);
  });

  it('ArrowDown wraps from the last choice to the first', () => {
    render(<QuizBlock block={quizData()} onComplete={vi.fn()} />);
    const group = screen.getByRole('radiogroup');
    const choices = screen.getAllByRole('radio');
    fireEvent.click(choices[2]); // select c-choice (index 2, last)
    fireEvent.keyDown(group, { key: 'ArrowDown' });
    expect(choices[0]).toHaveAttribute('aria-checked', 'true');
    expect(document.activeElement).toBe(choices[0]);
  });

  it('arrow keys are ignored after the answer is submitted', () => {
    render(<QuizBlock block={quizData()} onComplete={vi.fn()} />);
    const group = screen.getByRole('radiogroup');
    fireEvent.click(screen.getByRole('radio', { name: 'a-choice' })); // select index 0
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.keyDown(group, { key: 'ArrowDown' }); // should no-op
    const choices = screen.getAllByRole('radio');
    expect(choices[0]).toHaveAttribute('aria-checked', 'true');
    expect(choices[1]).toHaveAttribute('aria-checked', 'false');
  });

  it('retake returns to question one and re-fires onComplete on the next results reach', () => {
    const onComplete = vi.fn();
    render(<QuizBlock block={quizData()} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('radio', { name: 'a-choice' }));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('radio', { name: 'x-choice' }));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /result/i }));

    fireEvent.click(screen.getByRole('button', { name: /retake/i }));

    // Back to question one, submit disabled again.
    expect(screen.getByText('Q1 prompt?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

    // Reach results again — onComplete re-fires (now 2 total).
    fireEvent.click(screen.getByRole('radio', { name: 'b-choice' })); // correct
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('radio', { name: 'x-choice' })); // correct
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /result/i }));

    expect(onComplete).toHaveBeenCalledTimes(2);
    expect(onComplete).toHaveBeenLastCalledWith(2, 2);
  });
});
