/**
 * TemplateEditor + VariablesEditor component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 *
 * All five tests required by the brief:
 *  1. a placeholder with no matching variable shows the error naming the key
 *  2. defining that variable clears the error
 *  3. an unreferenced variable shows the warning
 *  4. a select variable with no options blocks with an inline message
 *  5. duplicate keys rejected
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TemplateEditor from './TemplateEditor';
import VariablesEditor from './VariablesEditor';
import type { DraftInput } from '@/lib/community/drafts';
import type { Variable } from '@/lib/setup/types';

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
};

function makeVar(overrides: Partial<Variable>): Variable {
  return {
    key: 'test_var',
    label: 'Test Var',
    type: 'text',
    required: false,
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TemplateEditor', () => {
  it('a placeholder with no matching variable shows the error naming the key', () => {
    render(
      <TemplateEditor
        value={{ ...baseDraft, instructionTemplate: '{{company_name}}', variables: [] }}
        onChange={vi.fn()}
        findings={[]}
      />,
    );

    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
    // At least one alert must mention the undeclared key
    const mentionsKey = alerts.some((el) => el.textContent?.includes('company_name'));
    expect(mentionsKey).toBe(true);
  });

  it('defining that variable clears the error', () => {
    render(
      <TemplateEditor
        value={{
          ...baseDraft,
          instructionTemplate: '{{company_name}}',
          variables: [makeVar({ key: 'company_name', label: 'Company Name' })],
        }}
        onChange={vi.fn()}
        findings={[]}
      />,
    );

    // No error alerts when the variable is declared
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('an unreferenced variable shows the warning', () => {
    render(
      <TemplateEditor
        value={{
          ...baseDraft,
          instructionTemplate: 'Hello, this template has no placeholders.',
          variables: [makeVar({ key: 'unused_var', label: 'Unused' })],
        }}
        onChange={vi.fn()}
        findings={[]}
      />,
    );

    // testid is now keyed by the variable key (template-warning-<key>)
    const warning = screen.getByTestId('template-warning-unused_var');
    expect(warning).toHaveTextContent('unused_var');
  });

  it('findings error for an empty template renders a visible role="alert"', () => {
    render(
      <TemplateEditor
        value={{ ...baseDraft, instructionTemplate: '' }}
        onChange={vi.fn()}
        findings={[
          { field: 'instructionTemplate', message: 'The instruction template cannot be empty.' },
        ]}
      />,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('The instruction template cannot be empty.');
  });
});

describe('VariablesEditor', () => {
  it('a select variable with no options blocks with an inline message', () => {
    render(
      <VariablesEditor
        value={{
          ...baseDraft,
          variables: [makeVar({ key: 'tone', label: 'Tone', type: 'select' })],
        }}
        onChange={vi.fn()}
        findings={[]}
      />,
    );

    // The inline error on the options field must have role="alert"
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/options/i);
  });

  it('duplicate keys rejected', () => {
    render(
      <VariablesEditor
        value={{
          ...baseDraft,
          variables: [
            makeVar({ key: 'foo', label: 'Foo' }),
            makeVar({ key: 'foo', label: 'Foo 2' }),
          ],
        }}
        onChange={vi.fn()}
        findings={[]}
      />,
    );

    // Both duplicate items should each show a role="alert" for the dup key error
    const alerts = screen.getAllByRole('alert');
    const dupErrors = alerts.filter((el) =>
      el.textContent?.toLowerCase().includes('duplicate'),
    );
    expect(dupErrors.length).toBeGreaterThan(0);
  });
});
