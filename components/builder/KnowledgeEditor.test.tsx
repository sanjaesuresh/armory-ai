/**
 * KnowledgeEditor component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 *
 * Required tests (from brief):
 *  1. starter file without content shows the MISSING_STARTER_CONTENT error
 *  2. user-provided file without guidance shows the MISSING_USER_PROVIDED_GUIDANCE error
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KnowledgeEditor from './KnowledgeEditor';
import type { DraftInput } from '@/lib/community/drafts';
import type { KnowledgeFile } from '@/lib/setup/types';

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

const starterFileEmpty: KnowledgeFile = {
  name: 'Brand quick-facts',
  purpose: 'Quick reference',
  kind: 'starter',
  content: '',      // empty — should trigger error
  required: false,
};

const starterFileFilled: KnowledgeFile = {
  name: 'Brand quick-facts',
  purpose: 'Quick reference',
  kind: 'starter',
  content: 'Some content here.',
  required: false,
};

const userProvidedEmpty: KnowledgeFile = {
  name: 'Brand voice guide',
  purpose: 'Tone reference',
  kind: 'user-provided',
  guidance: '',     // empty — should trigger error
  required: false,
};

const userProvidedFilled: KnowledgeFile = {
  name: 'Brand voice guide',
  purpose: 'Tone reference',
  kind: 'user-provided',
  guidance: 'Upload a PDF of your brand voice guide.',
  required: false,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('KnowledgeEditor', () => {
  it('renders without crashing and exposes testid', () => {
    render(<KnowledgeEditor value={baseDraft} onChange={vi.fn()} />);
    expect(screen.getByTestId('knowledge-editor')).toBeInTheDocument();
  });

  it('starter file with empty content shows a role="alert" error (MISSING_STARTER_CONTENT)', () => {
    render(
      <KnowledgeEditor
        value={{ ...baseDraft, knowledgeFiles: [starterFileEmpty] }}
        onChange={vi.fn()}
      />,
    );

    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
    // At least one alert must mention content
    const mentionsContent = alerts.some((el) =>
      el.textContent?.toLowerCase().includes('content'),
    );
    expect(mentionsContent).toBe(true);
  });

  it('starter file with non-empty content does NOT show the content error', () => {
    render(
      <KnowledgeEditor
        value={{ ...baseDraft, knowledgeFiles: [starterFileFilled] }}
        onChange={vi.fn()}
      />,
    );

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('user-provided file with empty guidance shows a role="alert" error (MISSING_USER_PROVIDED_GUIDANCE)', () => {
    render(
      <KnowledgeEditor
        value={{ ...baseDraft, knowledgeFiles: [userProvidedEmpty] }}
        onChange={vi.fn()}
      />,
    );

    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
    // At least one alert must mention guidance
    const mentionsGuidance = alerts.some((el) =>
      el.textContent?.toLowerCase().includes('guidance'),
    );
    expect(mentionsGuidance).toBe(true);
  });

  it('user-provided file with non-empty guidance does NOT show the guidance error', () => {
    render(
      <KnowledgeEditor
        value={{ ...baseDraft, knowledgeFiles: [userProvidedFilled] }}
        onChange={vi.fn()}
      />,
    );

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders separate errors for a mixed list with both kinds missing required fields', () => {
    render(
      <KnowledgeEditor
        value={{ ...baseDraft, knowledgeFiles: [starterFileEmpty, userProvidedEmpty] }}
        onChange={vi.fn()}
      />,
    );

    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBe(2);
  });

  it('switching a starter file to user-provided emits a patch without "content" (discriminated union stays valid)', () => {
    const onChange = vi.fn();
    render(
      <KnowledgeEditor
        value={{ ...baseDraft, knowledgeFiles: [starterFileFilled] }}
        onChange={onChange}
      />,
    );

    // Change the kind select from "starter" to "user-provided"
    const select = screen.getByTestId('kf-kind-0');
    fireEvent.change(select, { target: { value: 'user-provided' } });

    expect(onChange).toHaveBeenCalledOnce();
    const patch = onChange.mock.calls[0][0] as { knowledgeFiles: KnowledgeFile[] };
    const updated = patch.knowledgeFiles[0];
    expect(updated.kind).toBe('user-provided');
    expect('content' in updated).toBe(false);
    expect('guidance' in updated).toBe(true);
    expect((updated as { guidance: string }).guidance).toBe('');
  });

  it('switching a user-provided file to starter emits a patch without "guidance" (discriminated union stays valid)', () => {
    const onChange = vi.fn();
    render(
      <KnowledgeEditor
        value={{ ...baseDraft, knowledgeFiles: [userProvidedFilled] }}
        onChange={onChange}
      />,
    );

    // Change the kind select from "user-provided" to "starter"
    const select = screen.getByTestId('kf-kind-0');
    fireEvent.change(select, { target: { value: 'starter' } });

    expect(onChange).toHaveBeenCalledOnce();
    const patch = onChange.mock.calls[0][0] as { knowledgeFiles: KnowledgeFile[] };
    const updated = patch.knowledgeFiles[0];
    expect(updated.kind).toBe('starter');
    expect('guidance' in updated).toBe(false);
    expect('content' in updated).toBe(true);
    expect((updated as { content: string }).content).toBe('');
  });
});
