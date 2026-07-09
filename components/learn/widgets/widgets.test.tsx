/**
 * Custom widget tests (dom project — jsdom).
 *
 * Covers: WIDGET_REGISTRY key-set parity with WIDGET_IDS, CustomWidgetBlock,
 * and the full behavior contracts for ContextMeter, AgentLoop, and SkillTrigger
 * from the Task-6 brief (Step 1 failing tests).
 */

import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { WIDGET_REGISTRY } from './index';
import ContextMeter from './ContextMeter';
import AgentLoop from './AgentLoop';
import SkillTrigger from './SkillTrigger';
import VendorMap from './VendorMap';
import InstructionSteering from './InstructionSteering';
import StyleSwitcher from './StyleSwitcher';
import ArtifactVsChat from './ArtifactVsChat';
import KnowledgeContext from './KnowledgeContext';
import GptVsProjectPicker from './GptVsProjectPicker';
import ProjectsSwitcher from './ProjectsSwitcher';
import CustomWidgetBlock from '../blocks/CustomWidgetBlock';

import { WIDGET_IDS } from '@/lib/learn/types';
import type { CustomWidgetBlock as CustomWidgetBlockData } from '@/lib/learn/types';

// ─── Registry parity ─────────────────────────────────────────────────────────

describe('WIDGET_REGISTRY', () => {
  it('key set exactly equals WIDGET_IDS', () => {
    expect(Object.keys(WIDGET_REGISTRY).sort()).toEqual([...WIDGET_IDS].sort());
  });
});

// ─── CustomWidgetBlock ────────────────────────────────────────────────────────

describe('CustomWidgetBlock', () => {
  it('renders the ContextMeter (meter element) for the context-meter id', () => {
    const block: CustomWidgetBlockData = { type: 'customWidget', widgetId: 'context-meter' };
    render(<CustomWidgetBlock block={block} />);
    expect(screen.getByRole('meter')).toBeInTheDocument();
  });

  it('renders nothing and does not crash for an unknown id', () => {
    // @ts-expect-error — testing the runtime defense; validator prevents this in production
    const block = { type: 'customWidget', widgetId: 'unknown-widget' } as CustomWidgetBlockData;
    const { container } = render(<CustomWidgetBlock block={block} />);
    expect(container.firstChild).toBeNull();
  });
});

// ─── ContextMeter ─────────────────────────────────────────────────────────────

function getMeterPct(): number {
  return parseInt(screen.getByRole('meter').getAttribute('aria-valuenow') ?? '0', 10);
}

describe('ContextMeter', () => {
  it('starts empty — meter at 0% and no items in the list', () => {
    render(<ContextMeter />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('adding instructions then three messages raises the readout monotonically', () => {
    render(<ContextMeter />);

    fireEvent.click(screen.getByRole('button', { name: /instructions/i }));
    const p1 = getMeterPct();

    fireEvent.click(screen.getByRole('button', { name: /message/i }));
    const p2 = getMeterPct();
    expect(p2).toBeGreaterThan(p1);

    fireEvent.click(screen.getByRole('button', { name: /message/i }));
    const p3 = getMeterPct();
    expect(p3).toBeGreaterThan(p2);

    fireEvent.click(screen.getByRole('button', { name: /message/i }));
    const p4 = getMeterPct();
    expect(p4).toBeGreaterThan(p3);
  });

  it('adding the big file past capacity drops the oldest message and shows the overflow explanation', () => {
    render(<ContextMeter />);

    fireEvent.click(screen.getByRole('button', { name: /instructions/i }));
    fireEvent.click(screen.getByRole('button', { name: /message/i }));
    fireEvent.click(screen.getByRole('button', { name: /message/i }));
    fireEvent.click(screen.getByRole('button', { name: /message/i }));

    // 4 items before the file
    expect(screen.getAllByRole('listitem')).toHaveLength(4);

    fireEvent.click(screen.getByRole('button', { name: /big file/i }));

    // instr(10) + msg1(15) + msg2(15) + msg3(15) + file(70) = 125; dropOldest drops msg1 (→110)
    // then msg2 (→95 ≤ 100); exactly 3 remain: [instructions, msg3 (newest), file]
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    // Order-sensitive proof of drops-oldest: instructions first, newest message preserved, file last
    expect(items[0].textContent).toContain('System instructions');
    expect(items[1].textContent).toContain('A message');   // msg3 (newest) survives
    expect(items[2].textContent).toContain('A big file');
    // Overflow explanation is visible
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('exhausted-droppable: Instructions + Big file + Big file caps bar and shows overflow explanation', () => {
    render(<ContextMeter />);

    fireEvent.click(screen.getByRole('button', { name: /instructions/i }));
    fireEvent.click(screen.getByRole('button', { name: /big file/i }));
    // instr(10) + file1(70) = 80 — no overflow yet
    fireEvent.click(screen.getByRole('button', { name: /big file/i }));
    // instr(10) + file1(70) + file2(70) = 150; no droppable segments → nothing removed, isOver=true

    // aria-valuenow must be capped at 100 (ARIA requires valuenow ≤ valuemax)
    const meter = screen.getByRole('meter');
    const valuenow = parseInt(meter.getAttribute('aria-valuenow') ?? '0', 10);
    expect(valuenow).toBeLessThanOrEqual(100);
    expect(valuenow).toBe(100);

    // Overflow explanation IS visible even though droppedCount === 0
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('reset empties the bar to 0 and clears all list items', () => {
    render(<ContextMeter />);
    fireEvent.click(screen.getByRole('button', { name: /instructions/i }));
    fireEvent.click(screen.getByRole('button', { name: /message/i }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});

// ─── AgentLoop ────────────────────────────────────────────────────────────────

describe('AgentLoop', () => {
  it('the run control is present', () => {
    render(<AgentLoop />);
    expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
  });

  it('manual step walks narration through the read hop, then the edit hop, and reaches done state', () => {
    render(<AgentLoop />);
    const stepBtn = screen.getByRole('button', { name: /step/i });

    // Hop 1 — Claude decides to read the file
    fireEvent.click(stepBtn);
    expect(screen.getByText(/read the file/i)).toBeInTheDocument();

    // Hops 2 and 3 — tool runs, result returns
    fireEvent.click(stepBtn);
    fireEvent.click(stepBtn);

    // Hop 4 — Claude decides to edit the file
    fireEvent.click(stepBtn);
    expect(screen.getByText(/edit the file/i)).toBeInTheDocument();

    // Hops 5 and 6 — tool runs, edit result (done state)
    fireEvent.click(stepBtn);
    fireEvent.click(stepBtn);

    // Done state — narration contains "Fixed!"
    expect(screen.getByText(/fixed/i)).toBeInTheDocument();
  });
});

// ─── SkillTrigger ─────────────────────────────────────────────────────────────

describe('SkillTrigger', () => {
  it('the commit-message request highlights the commit-message skill card and shows a match explanation', () => {
    const { container } = render(<SkillTrigger />);
    fireEvent.click(screen.getByRole('button', { name: /commit message/i }));

    const card = container.querySelector('[data-skill-id="commit-message"]');
    expect(card).toHaveClass('st-skill-active');
    expect(screen.getByText(/matched/i)).toBeInTheDocument();
  });

  it('the code-review request highlights the code-review skill card', () => {
    const { container } = render(<SkillTrigger />);
    fireEvent.click(screen.getByRole('button', { name: /review my pr/i }));

    const card = container.querySelector('[data-skill-id="code-review"]');
    expect(card).toHaveClass('st-skill-active');
  });

  it('the no-match request shows the no-match explanation and highlights no skill card', () => {
    const { container } = render(<SkillTrigger />);
    fireEvent.click(screen.getByRole('button', { name: /regex/i }));

    expect(screen.getByText(/no skill matched/i)).toBeInTheDocument();
    expect(container.querySelector('.st-skill-active')).toBeNull();
  });
});

// ─── VendorMap ────────────────────────────────────────────────────────────────

describe('VendorMap', () => {
  it('starts with no chip selected and shows the empty panel prompt', () => {
    render(<VendorMap />);
    expect(screen.getByText(/pick a concept above/i)).toBeInTheDocument();
  });

  it('selecting "Workspace with files" marks the chip pressed and shows both app names in the panel', () => {
    render(<VendorMap />);
    const chip = screen.getByRole('button', { name: /workspace with files/i });
    fireEvent.click(chip);

    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/claude projects/i)).toBeInTheDocument();
  });

  it('selecting "Shareable AI assistant" flags it as a gap with no direct equivalent', () => {
    render(<VendorMap />);
    fireEvent.click(screen.getByRole('button', { name: /shareable ai assistant/i }));

    // "no direct equivalent" and "custom gpt" each appear in more than one node
    // (the gap badge / the ChatGPT-side name / the caveat), so match all.
    expect(screen.getAllByText(/no direct equivalent/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/custom gpt/i).length).toBeGreaterThan(0);
  });

  it('single-select swaps cleanly between chips and clicking the active chip deselects it', () => {
    render(<VendorMap />);
    const first = screen.getByRole('button', { name: /always-on instructions/i });
    const second = screen.getByRole('button', { name: /voice and style control/i });

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(second);
    expect(first).toHaveAttribute('aria-pressed', 'false');
    expect(second).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(second);
    expect(second).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(/pick a concept above/i)).toBeInTheDocument();
  });
});

// ─── InstructionSteering ──────────────────────────────────────────────────────

describe('InstructionSteering', () => {
  it('starts with the generic baseline reply and an empty active-rules summary', () => {
    render(<InstructionSteering />);
    expect(screen.getByText(/generic, one-size-fits-all reply/i)).toBeInTheDocument();
  });

  it('toggling Format: Bullet points changes the reply text and updates the active-rules summary', () => {
    render(<InstructionSteering />);
    const before = screen.getByText(/AI reply/i).closest('.is-reply-panel')!.textContent;

    fireEvent.click(screen.getByRole('button', { name: /format: bullet points/i }));

    const after = screen.getByText(/AI reply/i).closest('.is-reply-panel')!.textContent;
    expect(after).not.toEqual(before);
    expect(after).toContain('•');
    expect(screen.getByText(/Format the reply as bullet points/i)).toBeInTheDocument();
  });

  it('toggling a rule on then off returns the reply to the original baseline', () => {
    render(<InstructionSteering />);
    const btn = screen.getByRole('button', { name: /tone: professional/i });
    const before = screen.getByText(/AI reply/i).closest('.is-reply-panel')!.textContent;

    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'false');

    const after = screen.getByText(/AI reply/i).closest('.is-reply-panel')!.textContent;
    expect(after).toEqual(before);
  });

  it('Reset clears all active rules and restores the baseline reply', () => {
    render(<InstructionSteering />);
    fireEvent.click(screen.getByRole('button', { name: /persona: marketing expert/i }));
    fireEvent.click(screen.getByRole('button', { name: /audience: beginner/i }));

    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByText(/generic, one-size-fits-all reply/i)).toBeInTheDocument();
  });
});

// ─── StyleSwitcher ────────────────────────────────────────────────────────────

describe('StyleSwitcher', () => {
  it('defaults to the Default style with its answer shown', () => {
    render(<StyleSwitcher />);
    expect(screen.getByRole('radio', { name: 'Default' })).toHaveAttribute('aria-checked', 'true');
  });

  it('selecting Concise swaps the answer text and updates aria-checked', () => {
    render(<StyleSwitcher />);
    fireEvent.click(screen.getByRole('radio', { name: 'Concise' }));

    expect(screen.getByRole('radio', { name: 'Concise' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Default' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText(/Three levers this week/)).toBeInTheDocument();
  });

  it('the same fixed question is shown regardless of selected style', () => {
    render(<StyleSwitcher />);
    const question = "Give me three ways to improve this week's email open rate.";
    expect(screen.getByText(question)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: 'Explanatory' }));
    expect(screen.getByText(question)).toBeInTheDocument();
  });
});

// ─── ArtifactVsChat ───────────────────────────────────────────────────────────

describe('ArtifactVsChat', () => {
  it('starts empty with a placeholder in the side panel', () => {
    render(<ArtifactVsChat />);
    expect(screen.getByText(/your artifact will appear here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ask for an edit/i })).toBeDisabled();
  });

  it('asking for an artifact puts the body in the side panel, not a new chat bubble', () => {
    render(<ArtifactVsChat />);
    fireEvent.click(screen.getByRole('button', { name: /^document$/i }));

    expect(screen.getByText(/i've put that in an artifact/i)).toBeInTheDocument();
    expect(screen.getByText('v1')).toBeInTheDocument();
  });

  it('asking for an edit updates the same artifact in place (v1 -> v2)', () => {
    render(<ArtifactVsChat />);
    fireEvent.click(screen.getByRole('button', { name: /^document$/i }));
    fireEvent.click(screen.getByRole('button', { name: /ask for an edit/i }));

    expect(screen.getByText('v2')).toBeInTheDocument();
    expect(screen.queryByText('v1')).not.toBeInTheDocument();
  });

  it('reset returns to the empty placeholder state', () => {
    render(<ArtifactVsChat />);
    fireEvent.click(screen.getByRole('button', { name: /^code$/i }));
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByText(/your artifact will appear here/i)).toBeInTheDocument();
    expect(screen.queryByText('v1')).not.toBeInTheDocument();
  });
});

// ─── KnowledgeContext ─────────────────────────────────────────────────────────

describe('KnowledgeContext', () => {
  it('shows the unknown answer when no files are attached', () => {
    render(<KnowledgeContext />);
    expect(screen.getByText(/no files attached/i)).toBeInTheDocument();
    expect(screen.getByText(/i don't have that information/i)).toBeInTheDocument();
  });

  it('attaching the pricing sheet updates the answer to include the price', () => {
    render(<KnowledgeContext />);
    fireEvent.click(screen.getByRole('button', { name: /pricing-sheet\.xlsx/i }));
    expect(screen.getByText(/\$49\/month/i)).toBeInTheDocument();
    expect(screen.queryByText(/i don't have that information/i)).not.toBeInTheDocument();
  });

  it('detaching the pricing sheet removes the price from the answer again', () => {
    render(<KnowledgeContext />);
    const toggle = screen.getByRole('button', { name: /pricing-sheet\.xlsx/i });
    fireEvent.click(toggle);
    expect(screen.getByText(/\$49\/month/i)).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.queryByText(/\$49\/month/i)).not.toBeInTheDocument();
    expect(screen.getByText(/i don't have that information/i)).toBeInTheDocument();
  });

  it('attaching an irrelevant file alone does not unlock the answer', () => {
    render(<KnowledgeContext />);
    fireEvent.click(screen.getByRole('button', { name: /brand-guide\.pdf/i }));
    expect(screen.getByText(/i don't have that information/i)).toBeInTheDocument();
  });
});

// ─── GptVsProjectPicker ───────────────────────────────────────────────────────

describe('GptVsProjectPicker', () => {
  function answer(groupLabelPattern: RegExp, value: 'Yes' | 'No') {
    const group = screen.getByRole('group', { name: groupLabelPattern });
    fireEvent.click(within(group).getByRole('button', { name: value }));
  }

  it('starts with the neutral prompt before any answer', () => {
    render(<GptVsProjectPicker />);
    expect(screen.getByText(/answer both questions/i)).toBeInTheDocument();
  });

  it('share=yes, organize=no recommends Custom GPT', () => {
    render(<GptVsProjectPicker />);
    answer(/other people need to open/i, 'Yes');
    answer(/organizing your own ongoing chats/i, 'No');
    expect(screen.getByText('Custom GPT')).toBeInTheDocument();
  });

  it('share=no, organize=yes recommends ChatGPT Project', () => {
    render(<GptVsProjectPicker />);
    answer(/other people need to open/i, 'No');
    answer(/organizing your own ongoing chats/i, 'Yes');
    expect(screen.getByText('ChatGPT Project')).toBeInTheDocument();
  });

  it('share=yes, organize=yes shows the overlap edge case, and Start over resets', () => {
    render(<GptVsProjectPicker />);
    answer(/other people need to open/i, 'Yes');
    answer(/organizing your own ongoing chats/i, 'Yes');
    expect(screen.getByText(/both overlap here/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /start over/i }));
    expect(screen.getByText(/answer both questions/i)).toBeInTheDocument();
  });
});

// ─── ProjectsSwitcher ─────────────────────────────────────────────────────────

describe('ProjectsSwitcher', () => {
  it('shows the first Project (Marketing) instructions and files by default', () => {
    render(<ProjectsSwitcher />);
    expect(screen.getByRole('tab', { name: /marketing assistant/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/warm, confident brand voice/i)).toBeInTheDocument();
    expect(screen.getByText('brand-voice-guide.pdf')).toBeInTheDocument();
  });

  it('switching to the Research tab swaps instructions and files, old content gone', () => {
    render(<ProjectsSwitcher />);
    fireEvent.click(screen.getByRole('tab', { name: /research assistant/i }));
    expect(screen.getByText(/summarize academic sources/i)).toBeInTheDocument();
    expect(screen.getByText('literature-review-2024.pdf')).toBeInTheDocument();
    expect(screen.queryByText(/warm, confident brand voice/i)).not.toBeInTheDocument();
    expect(screen.queryByText('brand-voice-guide.pdf')).not.toBeInTheDocument();
  });

  it('arrow-right key moves selection to the next tab', () => {
    render(<ProjectsSwitcher />);
    const first = screen.getByRole('tab', { name: /marketing assistant/i });
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: /research assistant/i })).toHaveAttribute('aria-selected', 'true');
  });
});
