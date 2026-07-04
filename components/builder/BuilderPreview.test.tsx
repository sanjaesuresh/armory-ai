/**
 * BuilderPreview component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 *
 * Required tests (from brief):
 *  The preview updates when the template or a sample answer changes.
 *
 * Strategy:
 *   Template change — rerender with a different instructionTemplate and verify
 *     the preview transitions from the incomplete state to the compiled state.
 *   Sample answer change — type into a sample answer field and verify the
 *     preview transitions from the incomplete state to the compiled state.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import BuilderPreview from './BuilderPreview';
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
  knowledgeFiles: [],
  scenarios: [],
};

function makeVar(overrides: Partial<Variable>): Variable {
  return {
    key: 'company',
    label: 'Company name',
    type: 'text',
    required: true,
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('BuilderPreview', () => {
  it('renders without crashing and exposes testid', () => {
    render(<BuilderPreview value={baseDraft} onChange={vi.fn()} />);
    expect(screen.getByTestId('builder-preview')).toBeInTheDocument();
  });

  it('the submit button is always present', () => {
    render(<BuilderPreview value={baseDraft} onChange={vi.fn()} />);
    expect(screen.getByTestId('builder-submit')).toBeInTheDocument();
  });

  it('submit button is disabled when validateSetup finds errors', () => {
    // baseDraft has empty name/tagline/description/role — all required
    render(<BuilderPreview value={baseDraft} onChange={vi.fn()} />);
    const btn = screen.getByTestId('builder-submit');
    expect(btn).toBeDisabled();
  });

  it('shows validation summary when there are errors', () => {
    render(<BuilderPreview value={baseDraft} onChange={vi.fn()} />);
    expect(screen.getByTestId('builder-validation-summary')).toBeInTheDocument();
  });

  it('preview shows incomplete state when a required variable has no sample answer', () => {
    render(
      <BuilderPreview
        value={{
          ...baseDraft,
          name: 'My Setup',
          tagline: 'Does things',
          description: 'Does things well.',
          role: 'general',
          instructionTemplate: '{{company}}',
          variables: [makeVar({ required: true })],
        }}
        onChange={vi.fn()}
      />,
    );

    // PreviewPanel shows the incomplete state when compilation fails
    expect(screen.getByText(/fill in the required fields/i)).toBeInTheDocument();
  });

  it('preview updates when the template changes (template change → compiled state)', () => {
    const sharedDraft = {
      ...baseDraft,
      name: 'My Setup',
      tagline: 'Does things',
      description: 'Does things well.',
      role: 'general',
    };

    // Start: template references a required variable → incomplete state
    const { rerender } = render(
      <BuilderPreview
        value={{
          ...sharedDraft,
          instructionTemplate: '{{company}}',
          variables: [makeVar({ required: true })],
        }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText(/fill in the required fields/i)).toBeInTheDocument();

    // Rerender: new template has no variables → compilation succeeds
    rerender(
      <BuilderPreview
        value={{
          ...sharedDraft,
          instructionTemplate: 'No variables here — always compiles.',
          variables: [],
        }}
        onChange={vi.fn()}
      />,
    );

    // PreviewPanel now shows the compiled "View the full instructions" button
    expect(screen.getByText('View the full instructions')).toBeInTheDocument();
  });

  it('preview updates when a sample answer changes (answer change → compiled state)', async () => {
    const user = userEvent.setup();
    render(
      <BuilderPreview
        value={{
          ...baseDraft,
          name: 'My Setup',
          tagline: 'Does things',
          description: 'Does things well.',
          role: 'general',
          instructionTemplate: '{{company}}',
          variables: [makeVar({ required: true })],
        }}
        onChange={vi.fn()}
      />,
    );

    // Initially: required variable has no sample answer → incomplete
    expect(screen.getByText(/fill in the required fields/i)).toBeInTheDocument();

    // Type a sample answer for the "Company name" variable
    const input = screen.getByTestId('sample-company');
    await user.type(input, 'Acme Corp');

    // Preview should now show the compiled state
    expect(screen.getByText('View the full instructions')).toBeInTheDocument();
  });
});
