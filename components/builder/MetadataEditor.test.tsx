/**
 * MetadataEditor component tests.
 * Environment: jsdom (routed via vitest.config.ts environmentMatchGlobs).
 *
 * The Supabase browser client is never instantiated here: MetadataEditor is a
 * pure form component — it receives value/onChange/findings as props and never
 * calls Supabase directly.
 */

import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import MetadataEditor from './MetadataEditor';
import type { DraftInput } from '@/lib/community/drafts';
import { ROLES } from '@/lib/catalog/roles';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const baseDraft: DraftInput = {
  slug: 'draft-abc12345',
  name: '',
  tagline: '',
  description: '',
  role: '',
  industry: null,
  category: 'general',
  tags: [],
  targets: ['claude-app'],
  tier: 'core',
  instructionTemplate: '',
  variables: [],
  knowledgeFiles: [],
  scenarios: [],
};

const filledDraft: DraftInput = {
  ...baseDraft,
  name: 'Cold Email Writer',
  tagline: 'Personalized outreach that converts',
  description: 'Writes cold emails from a prospect role and value prop.',
  role: 'sales-rep',
  category: 'sales',
  tags: ['email', 'sales', 'outreach'],
  targets: ['claude-app', 'chatgpt'],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MetadataEditor', () => {
  it('renders without crashing and exposes key test ids', () => {
    render(<MetadataEditor value={baseDraft} onChange={vi.fn()} />);
    expect(screen.getByTestId('metadata-editor')).toBeInTheDocument();
    expect(screen.getByTestId('field-name')).toBeInTheDocument();
    expect(screen.getByTestId('field-tagline')).toBeInTheDocument();
    expect(screen.getByTestId('field-description')).toBeInTheDocument();
    expect(screen.getByTestId('field-slug')).toBeInTheDocument();
    expect(screen.getByTestId('field-role')).toBeInTheDocument();
    expect(screen.getByTestId('field-category')).toBeInTheDocument();
  });

  it('renders all ROLES as options in the role select', () => {
    render(<MetadataEditor value={baseDraft} onChange={vi.fn()} />);
    const select = screen.getByTestId('field-role');
    for (const role of ROLES) {
      expect(within(select).getByRole('option', { name: role.label })).toBeInTheDocument();
    }
  });

  it('renders all 17 category options', () => {
    render(<MetadataEditor value={baseDraft} onChange={vi.fn()} />);
    const select = screen.getByTestId('field-category');
    // 17 categories defined in CATEGORIES
    const options = within(select).getAllByRole('option');
    expect(options.length).toBe(17);
  });

  it('calls onChange with name patch when name input changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MetadataEditor value={baseDraft} onChange={onChange} />);

    const nameInput = screen.getByTestId('field-name');
    await user.type(nameInput, 'My Setup');

    // Each character fires onChange; last call should include the full typed string
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).toHaveProperty('name');
  });

  it('calls onChange with role patch when role select changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MetadataEditor value={baseDraft} onChange={onChange} />);

    const roleSelect = screen.getByTestId('field-role');
    await user.selectOptions(roleSelect, 'sales-rep');

    expect(onChange).toHaveBeenCalledWith({ role: 'sales-rep' });
  });

  it('calls onChange with category patch when category select changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MetadataEditor value={baseDraft} onChange={onChange} />);

    const catSelect = screen.getByTestId('field-category');
    await user.selectOptions(catSelect, 'marketing');

    expect(onChange).toHaveBeenCalledWith({ category: 'marketing' });
  });

  it('renders existing tags as chips with remove buttons', () => {
    render(<MetadataEditor value={filledDraft} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Remove tag email')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove tag sales')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove tag outreach')).toBeInTheDocument();
  });

  it('calls onChange with updated tags when a tag is removed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MetadataEditor value={filledDraft} onChange={onChange} />);

    await user.click(screen.getByLabelText('Remove tag email'));

    expect(onChange).toHaveBeenCalledWith({
      tags: ['sales', 'outreach'],
    });
  });

  it('adds a tag when Enter is pressed in the tag input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MetadataEditor value={baseDraft} onChange={onChange} />);

    const tagInput = screen.getByTestId('field-tag-input');
    await user.type(tagInput, 'newtag{Enter}');

    expect(onChange).toHaveBeenCalledWith({ tags: ['newtag'] });
  });

  it('renders both target checkboxes; Claude is checked by default', () => {
    render(<MetadataEditor value={baseDraft} onChange={vi.fn()} />);
    const claudeCheckbox = screen.getByTestId('target-claude');
    const chatgptCheckbox = screen.getByTestId('target-chatgpt');
    expect(claudeCheckbox).toBeChecked();
    expect(chatgptCheckbox).not.toBeChecked();
  });

  it('renders both checkboxes checked when filledDraft has both targets', () => {
    render(<MetadataEditor value={filledDraft} onChange={vi.fn()} />);
    expect(screen.getByTestId('target-claude')).toBeChecked();
    expect(screen.getByTestId('target-chatgpt')).toBeChecked();
  });

  it('calls onChange with toggled targets when a checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MetadataEditor value={baseDraft} onChange={onChange} />);

    await user.click(screen.getByTestId('target-chatgpt'));

    expect(onChange).toHaveBeenCalledWith({
      targets: ['claude-app', 'chatgpt'],
    });
  });

  it('surfaces finding messages via role="alert" elements', () => {
    const findings = [
      { field: 'name', message: '"name" is required and must be a non-empty string.' },
      { field: 'slug', message: 'Slug "draft-abc12345" must use only lowercase letters, digits, and internal hyphens.' },
    ];
    render(<MetadataEditor value={baseDraft} onChange={vi.fn()} findings={findings} />);

    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(1);
    expect(alerts[0]).toHaveTextContent('"name" is required');
  });
});
