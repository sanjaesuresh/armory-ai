/**
 * SetupForm component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SetupForm from './SetupForm';
import type { Variable } from '@/lib/setup/types';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const textVar: Variable = {
  key: 'brandName',
  label: 'Brand name',
  type: 'text',
  required: true,
  helpText: 'The exact name of your brand.',
};

const multilineVar: Variable = {
  key: 'bio',
  label: 'Short bio',
  type: 'multiline',
  required: false,
  helpText: 'A brief description.',
};

const selectVar: Variable = {
  key: 'tone',
  label: 'Tone of voice',
  type: 'select',
  options: ['Professional', 'Conversational', 'Playful'],
  default: 'Professional',
  required: true,
};

const multiselectVar: Variable = {
  key: 'channels',
  label: 'Active channels',
  type: 'multiselect',
  options: ['Email', 'Instagram', 'LinkedIn'],
  default: ['Email', 'Instagram'],
  required: true,
};

const numberVar: Variable = {
  key: 'teamSize',
  label: 'Team size',
  type: 'number',
  default: 5,
  required: false,
};

const booleanVar: Variable = {
  key: 'hasBrandVoice',
  label: 'Do you have brand voice guidelines?',
  type: 'boolean',
  default: false,
  required: false,
};

const groupedVars: Variable[] = [
  { key: 'a', label: 'Alpha', type: 'text', required: false, group: 'Section B' },
  { key: 'b', label: 'Beta', type: 'text', required: false, group: 'Section A' },
  { key: 'c', label: 'Gamma', type: 'text', required: false },
];

// ─── Global teardown ─────────────────────────────────────────────────────────

afterEach(() => {
  sessionStorage.clear();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderForm(
  variables: Variable[],
  slug = 'test-setup',
  onChange = vi.fn(),
) {
  return render(
    <SetupForm slug={slug} variables={variables} onAnswersChange={onChange} />,
  );
}

// ─── Suites ──────────────────────────────────────────────────────────────────

describe('SetupForm — correct widget per variable type', () => {
  it('renders a text input for type=text', () => {
    renderForm([textVar]);
    expect(screen.getByLabelText('Brand name')).toBeInTheDocument();
    expect(screen.getByLabelText('Brand name').tagName).toBe('INPUT');
    expect(screen.getByLabelText('Brand name')).toHaveAttribute('type', 'text');
  });

  it('renders a textarea for type=multiline', () => {
    renderForm([multilineVar]);
    expect(screen.getByLabelText('Short bio').tagName).toBe('TEXTAREA');
  });

  it('renders a select dropdown for type=select', () => {
    renderForm([selectVar]);
    const el = screen.getByLabelText('Tone of voice');
    expect(el.tagName).toBe('SELECT');
  });

  it('renders checkboxes for type=multiselect', () => {
    renderForm([multiselectVar]);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(3); // Email, Instagram, LinkedIn
  });

  it('renders a number input for type=number', () => {
    renderForm([numberVar]);
    const el = screen.getByLabelText('Team size');
    expect(el).toHaveAttribute('type', 'number');
  });

  it('renders a toggle/checkbox for type=boolean', () => {
    renderForm([booleanVar]);
    // Should be labelled and accessible as a checkbox or switch
    const el = screen.getByLabelText('Do you have brand voice guidelines?');
    expect(el.tagName).toBe('INPUT');
    expect(el).toHaveAttribute('type', 'checkbox');
  });
});

describe('SetupForm — defaults are pre-filled on first render', () => {
  it('pre-fills text default', () => {
    const v: Variable = { ...textVar, default: 'Acme Corp' };
    renderForm([v]);
    expect(screen.getByLabelText('Brand name')).toHaveValue('Acme Corp');
  });

  it('pre-fills select default', () => {
    renderForm([selectVar]);
    expect(screen.getByLabelText('Tone of voice')).toHaveValue('Professional');
  });

  it('pre-fills multiselect defaults — checked boxes', () => {
    renderForm([multiselectVar]);
    const emailBox = screen.getByRole('checkbox', { name: 'Email' });
    const igBox = screen.getByRole('checkbox', { name: 'Instagram' });
    const liBox = screen.getByRole('checkbox', { name: 'LinkedIn' });
    expect(emailBox).toBeChecked();
    expect(igBox).toBeChecked();
    expect(liBox).not.toBeChecked();
  });

  it('pre-fills number default', () => {
    renderForm([numberVar]);
    expect(screen.getByLabelText('Team size')).toHaveValue(5);
  });

  it('pre-fills boolean default = false → unchecked', () => {
    renderForm([booleanVar]);
    expect(screen.getByLabelText('Do you have brand voice guidelines?')).not.toBeChecked();
  });

  it('pre-fills boolean default = true → checked', () => {
    const v: Variable = { ...booleanVar, default: true };
    renderForm([v]);
    expect(screen.getByLabelText('Do you have brand voice guidelines?')).toBeChecked();
  });
});

describe('SetupForm — editing a field emits updated answers via onAnswersChange', () => {
  it('emits updated text value when user types', async () => {
    const onChange = vi.fn();
    renderForm([textVar], 'test', onChange);
    const input = screen.getByLabelText('Brand name');
    await userEvent.clear(input);
    await userEvent.type(input, 'Nike');
    // Last call should have key=brandName set to 'Nike'
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0]).toMatchObject({ brandName: 'Nike' });
  });

  it('emits updated boolean value when toggled', async () => {
    const onChange = vi.fn();
    renderForm([booleanVar], 'test', onChange);
    const toggle = screen.getByLabelText('Do you have brand voice guidelines?');
    await userEvent.click(toggle);
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0]).toMatchObject({ hasBrandVoice: true });
  });

  it('emits updated multiselect array when a checkbox is toggled', async () => {
    const onChange = vi.fn();
    renderForm([multiselectVar], 'test', onChange);
    const liBox = screen.getByRole('checkbox', { name: 'LinkedIn' });
    await userEvent.click(liBox);
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect((lastCall[0].channels as string[])).toContain('LinkedIn');
  });

  it('emits second argument with complete=true when all required fields filled', async () => {
    const onChange = vi.fn();
    renderForm([textVar], 'test', onChange);
    await userEvent.type(screen.getByLabelText('Brand name'), 'Acme');
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[1]).toMatchObject({ complete: true });
  });

  it('emits complete=false when a required field is empty', () => {
    const onChange = vi.fn();
    renderForm([textVar], 'test', onChange);
    // Initial render with no default → required field empty → complete=false
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ brandName: '' }),
      { complete: false },
    );
  });
});

describe('SetupForm — required field empty shows inline validation message and marks incomplete', () => {
  it('shows an inline message when a required text field is empty', async () => {
    const onChange = vi.fn();
    renderForm([textVar], 'test', onChange);
    const input = screen.getByLabelText('Brand name');
    // Clear and blur to trigger validation display
    await userEvent.clear(input);
    fireEvent.blur(input);
    // Should show some kind of required message
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });

  it('does not block other fields from being editable', async () => {
    const vars: Variable[] = [textVar, numberVar];
    renderForm(vars, 'test');
    const numInput = screen.getByLabelText('Team size');
    // Even though brandName is required and empty, the number field is editable
    await userEvent.clear(numInput);
    await userEvent.type(numInput, '10');
    expect(numInput).toHaveValue(10);
  });
});

describe('SetupForm — variables are grouped under their group headers', () => {
  it('renders group header text as headings', () => {
    renderForm(groupedVars);
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('Section B')).toBeInTheDocument();
  });

  it('renders ungrouped variables before group headers', () => {
    renderForm(groupedVars);
    // "Gamma" (ungrouped) should appear before "Section A" and "Section B"
    const gammaEl = screen.getByLabelText('Gamma');
    const sectionAEl = screen.getByText('Section A');
    expect(
      gammaEl.compareDocumentPosition(sectionAEl) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

describe('SetupForm — session storage persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('restores answers from sessionStorage on remount', async () => {
    const onChange = vi.fn();
    const { unmount } = renderForm([textVar], 'my-setup', onChange);
    const input = screen.getByLabelText('Brand name');
    await userEvent.clear(input);
    await userEvent.type(input, 'Persisted Brand');
    unmount();
    // Re-mount
    renderForm([textVar], 'my-setup', vi.fn());
    expect(screen.getByLabelText('Brand name')).toHaveValue('Persisted Brand');
  });
});

describe('SetupForm — help text is rendered', () => {
  it('shows helpText beneath the field', () => {
    renderForm([textVar]);
    expect(screen.getByText('The exact name of your brand.')).toBeInTheDocument();
  });
});

describe('SetupForm — multiselect blur/touched tracking', () => {
  const requiredMultiselectVar: Variable = {
    key: 'platforms',
    label: 'Platforms',
    type: 'multiselect',
    options: ['Web', 'Mobile', 'Desktop'],
    required: true,
    // no default — starts empty
  };

  it('shows inline error after blur with no selection', async () => {
    renderForm([requiredMultiselectVar]);
    // No error before interaction
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // Focus a checkbox then blur away from the fieldset
    const webCheckbox = screen.getByRole('checkbox', { name: 'Web' });
    fireEvent.focus(webCheckbox);
    fireEvent.blur(webCheckbox);

    // Error message should now be visible
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/please select at least one option/i)).toBeInTheDocument();
  });

  it('clears inline error once an option is selected after blur', async () => {
    renderForm([requiredMultiselectVar]);

    const webCheckbox = screen.getByRole('checkbox', { name: 'Web' });
    fireEvent.focus(webCheckbox);
    fireEvent.blur(webCheckbox);

    // Error is showing
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Select an option
    await userEvent.click(webCheckbox);

    // Error should be gone
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
