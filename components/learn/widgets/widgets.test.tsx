/**
 * Custom widget tests (dom project — jsdom).
 *
 * Covers: WIDGET_REGISTRY key-set parity with WIDGET_IDS, CustomWidgetBlock,
 * and the full behavior contracts for ContextMeter, AgentLoop, and SkillTrigger
 * from the Task-6 brief (Step 1 failing tests).
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { WIDGET_REGISTRY } from './index';
import ContextMeter from './ContextMeter';
import AgentLoop from './AgentLoop';
import SkillTrigger from './SkillTrigger';
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
