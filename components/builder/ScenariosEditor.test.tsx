/**
 * ScenariosEditor component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 *
 * Required test (from brief):
 *  A scenario needs title + userInput + expectedBehavior to count as complete;
 *  surface an inline hint when any of those three fields is missing.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ScenariosEditor from './ScenariosEditor';
import type { DraftInput } from '@/lib/community/drafts';
import type { Scenario } from '@/lib/setup/types';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const baseDraft: DraftInput = {
  slug: 'test-slug',
  name: 'Test Setup',
  tagline: 'A test tagline',
  description: 'A test description.',
  role: 'general',
  category: 'general',
  instructionTemplate: '',
  variables: [],
  knowledgeFiles: [],
  scenarios: [],
};

const completeScenario: Scenario = {
  id: 'sc1',
  title: 'Write a launch post',
  userInput: 'Write a launch post for our new feature.',
  expectedBehavior: 'Two platform-ready drafts in the configured tone.',
};

function makeScenario(overrides: Partial<Scenario>): Scenario {
  return { ...completeScenario, ...overrides };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ScenariosEditor', () => {
  it('renders without crashing and exposes testid', () => {
    render(<ScenariosEditor value={baseDraft} onChange={vi.fn()} />);
    expect(screen.getByTestId('scenarios-editor')).toBeInTheDocument();
  });

  it('a complete scenario shows no incomplete hint', () => {
    render(
      <ScenariosEditor
        value={{ ...baseDraft, scenarios: [completeScenario] }}
        onChange={vi.fn()}
      />,
    );

    expect(screen.queryByTestId('scenario-incomplete-0')).toBeNull();
  });

  it('a scenario missing title shows the incomplete hint', () => {
    render(
      <ScenariosEditor
        value={{ ...baseDraft, scenarios: [makeScenario({ title: '' })] }}
        onChange={vi.fn()}
      />,
    );

    const hint = screen.getByTestId('scenario-incomplete-0');
    expect(hint).toBeInTheDocument();
  });

  it('a scenario missing userInput shows the incomplete hint', () => {
    render(
      <ScenariosEditor
        value={{ ...baseDraft, scenarios: [makeScenario({ userInput: '' })] }}
        onChange={vi.fn()}
      />,
    );

    const hint = screen.getByTestId('scenario-incomplete-0');
    expect(hint).toBeInTheDocument();
  });

  it('a scenario missing expectedBehavior shows the incomplete hint', () => {
    render(
      <ScenariosEditor
        value={{ ...baseDraft, scenarios: [makeScenario({ expectedBehavior: '' })] }}
        onChange={vi.fn()}
      />,
    );

    const hint = screen.getByTestId('scenario-incomplete-0');
    expect(hint).toBeInTheDocument();
  });

  it('only incomplete scenarios show the hint; complete ones do not', () => {
    render(
      <ScenariosEditor
        value={{
          ...baseDraft,
          scenarios: [
            makeScenario({ id: 'sc1', title: '' }),         // incomplete
            { ...completeScenario, id: 'sc2' },             // complete
          ],
        }}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('scenario-incomplete-0')).toBeInTheDocument();
    expect(screen.queryByTestId('scenario-incomplete-1')).toBeNull();
  });

  it('the incomplete hint text mentions all three required fields', () => {
    render(
      <ScenariosEditor
        value={{ ...baseDraft, scenarios: [makeScenario({ title: '' })] }}
        onChange={vi.fn()}
      />,
    );

    const hint = screen.getByTestId('scenario-incomplete-0');
    // Should reference title, user message / input, and expected behavior
    expect(hint.textContent?.toLowerCase()).toMatch(/title/);
    expect(hint.textContent?.toLowerCase()).toMatch(/message|input/);
    expect(hint.textContent?.toLowerCase()).toMatch(/expected|behavior/);
  });

  it('entering "foo\\nbar" in the mustContain textarea yields [\'foo\',\'bar\'] in the patch (parseLines round-trip)', () => {
    const onChange = vi.fn();
    render(
      <ScenariosEditor
        value={{ ...baseDraft, scenarios: [completeScenario] }}
        onChange={onChange}
      />,
    );

    const mustContainTextarea = screen.getByTestId('scenario-must-0');
    fireEvent.change(mustContainTextarea, { target: { value: 'foo\nbar' } });

    expect(onChange).toHaveBeenCalledOnce();
    const patch = onChange.mock.calls[0][0] as { scenarios: Scenario[] };
    expect(patch.scenarios[0].mustContain).toEqual(['foo', 'bar']);
  });
});
