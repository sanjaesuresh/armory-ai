'use client';

/**
 * MetadataEditor — step 1 of the community builder wizard.
 *
 * Edits the catalog-metadata fields of a DraftInput: name, tagline,
 * description, slug, role, category, industry, tags, and export targets.
 *
 * Contract (for future wizard steps to match):
 *   value    — the full DraftInput
 *   onChange — called with a partial patch; BuilderView merges it into state
 *   findings — inline validation messages keyed by field name
 */

import { useState, useRef } from 'react';
import type { DraftInput } from '@/lib/community/drafts';
import type { Category } from '@/lib/setup/types';
import { ROLES } from '@/lib/catalog/roles';
import { sanitizeTag } from '@/lib/setup/validator';

// ─── Category options (mirrors VALID_CATEGORIES in lib/setup/validator.ts) ────

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'content', label: 'Content' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'sales', label: 'Sales' },
  { value: 'customer-support', label: 'Customer support' },
  { value: 'finance', label: 'Finance' },
  { value: 'legal', label: 'Legal' },
  { value: 'hr', label: 'HR' },
  { value: 'operations', label: 'Operations' },
  { value: 'research', label: 'Research' },
  { value: 'education', label: 'Education' },
  { value: 'writing', label: 'Writing' },
  { value: 'data', label: 'Data' },
  { value: 'devops', label: 'DevOps' },
  { value: 'general', label: 'General' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MetadataFinding {
  field: string;
  message: string;
}

export interface MetadataEditorProps {
  value: DraftInput;
  onChange: (patch: Partial<DraftInput>) => void;
  findings?: MetadataFinding[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function fieldError(findings: MetadataFinding[] | undefined, field: string): string | undefined {
  return findings?.find((f) => f.field === field)?.message;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MetadataEditor({ value, onChange, findings }: MetadataEditorProps) {
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const tags = value.tags ?? [];
  const targets = value.targets ?? ['claude-app'];

  // ── Tag management ──────────────────────────────────────────────────────────

  function addTag() {
    const cleaned = sanitizeTag(tagInput);
    if (!cleaned) return;
    if (tags.length >= 10) return;
    if (tags.includes(cleaned)) {
      setTagInput('');
      return;
    }
    onChange({ tags: [...tags, cleaned] });
    setTagInput('');
  }

  function removeTag(tag: string) {
    onChange({ tags: tags.filter((t) => t !== tag) });
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }

  // ── Target toggle ───────────────────────────────────────────────────────────

  function toggleTarget(target: string) {
    const next = targets.includes(target)
      ? targets.filter((t) => t !== target)
      : [...targets, target];
    onChange({ targets: next });
  }

  // ── Field errors ────────────────────────────────────────────────────────────

  const nameErr = fieldError(findings, 'name');
  const taglineErr = fieldError(findings, 'tagline');
  const descErr = fieldError(findings, 'description');
  const slugErr = fieldError(findings, 'slug');
  const roleErr = fieldError(findings, 'role');
  const catErr = fieldError(findings, 'category');

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div data-testid="metadata-editor">

      {/* Name */}
      <div className={`field${nameErr ? ' invalid' : ''}`}>
        <label htmlFor="bName">
          Name <span className="req" aria-hidden="true">*</span>
        </label>
        <p className="help">What this setup is called in the catalog.</p>
        <input
          className="input"
          id="bName"
          type="text"
          value={value.name}
          onChange={(e) => onChange({ name: e.target.value })}
          aria-describedby={nameErr ? 'bName-err' : undefined}
          autoComplete="off"
          data-testid="field-name"
        />
        {nameErr && (
          <p className="error-msg" id="bName-err" role="alert">
            {nameErr}
          </p>
        )}
      </div>

      {/* Tagline */}
      <div className={`field${taglineErr ? ' invalid' : ''}`}>
        <label htmlFor="bTagline">
          Tagline <span className="req" aria-hidden="true">*</span>
        </label>
        <p className="help">One line that says who it&apos;s for and what it does.</p>
        <input
          className="input"
          id="bTagline"
          type="text"
          value={value.tagline}
          onChange={(e) => onChange({ tagline: e.target.value })}
          aria-describedby={taglineErr ? 'bTagline-err' : undefined}
          autoComplete="off"
          data-testid="field-tagline"
        />
        {taglineErr && (
          <p className="error-msg" id="bTagline-err" role="alert">
            {taglineErr}
          </p>
        )}
      </div>

      {/* Description */}
      <div className={`field${descErr ? ' invalid' : ''}`}>
        <label htmlFor="bDesc">
          Description <span className="req" aria-hidden="true">*</span>
        </label>
        <textarea
          className="input"
          id="bDesc"
          rows={3}
          value={value.description}
          onChange={(e) => onChange({ description: e.target.value })}
          aria-describedby={descErr ? 'bDesc-err' : undefined}
          data-testid="field-description"
        />
        {descErr && (
          <p className="error-msg" id="bDesc-err" role="alert">
            {descErr}
          </p>
        )}
      </div>

      {/* Slug */}
      <div className={`field${slugErr ? ' invalid' : ''}`}>
        <label htmlFor="bSlug">
          URL slug <span className="req" aria-hidden="true">*</span>
        </label>
        <p className="help">
          Lowercase letters, digits, and hyphens only — no spaces. Example:{' '}
          <code>cold-email-writer</code>.
        </p>
        <input
          className="input"
          id="bSlug"
          type="text"
          value={value.slug}
          onChange={(e) => onChange({ slug: e.target.value })}
          aria-describedby={slugErr ? 'bSlug-err' : undefined}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          data-testid="field-slug"
        />
        {slugErr && (
          <p className="error-msg" id="bSlug-err" role="alert">
            {slugErr}
          </p>
        )}
      </div>

      {/* Role + Category (two-column) */}
      <div className={`field two-col`}>
        <div className={roleErr ? 'invalid' : ''}>
          <label htmlFor="bRole">
            Role <span className="req" aria-hidden="true">*</span>
          </label>
          <select
            className="select-el"
            id="bRole"
            value={value.role}
            onChange={(e) => onChange({ role: e.target.value })}
            aria-describedby={roleErr ? 'bRole-err' : undefined}
            data-testid="field-role"
          >
            <option value="">Select a role</option>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          {roleErr && (
            <p className="error-msg" id="bRole-err" role="alert">
              {roleErr}
            </p>
          )}
        </div>

        <div className={catErr ? 'invalid' : ''}>
          <label htmlFor="bCat">
            Category <span className="req" aria-hidden="true">*</span>
          </label>
          <select
            className="select-el"
            id="bCat"
            value={value.category}
            onChange={(e) => onChange({ category: e.target.value })}
            aria-describedby={catErr ? 'bCat-err' : undefined}
            data-testid="field-category"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {catErr && (
            <p className="error-msg" id="bCat-err" role="alert">
              {catErr}
            </p>
          )}
        </div>
      </div>

      {/* Industry (optional) */}
      <div className="field">
        <label htmlFor="bIndustry">
          Industry{' '}
          <span className="muted" style={{ fontWeight: 600 }}>
            (optional)
          </span>
        </label>
        <input
          className="input"
          id="bIndustry"
          type="text"
          value={value.industry ?? ''}
          onChange={(e) =>
            onChange({ industry: e.target.value || null })
          }
          placeholder="e.g. SaaS, agencies, real estate"
          autoComplete="off"
          data-testid="field-industry"
        />
      </div>

      {/* Tags */}
      <div className="field">
        <span className="label">
          Tags{' '}
          <span className="muted" style={{ fontWeight: 600 }}>
            (up to 10)
          </span>
        </span>
        <p className="help">
          Lowercase keywords to help people find this setup.
        </p>

        {tags.length > 0 && (
          <div
            style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}
            aria-label="Current tags"
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="tag"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => removeTag(tag)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 2px',
                    fontSize: '0.8rem',
                    lineHeight: 1,
                    color: 'var(--muted)',
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            ref={tagInputRef}
            className="input"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length >= 10 ? 'Tag limit reached' : 'Add a tag and press Enter'}
            disabled={tags.length >= 10}
            aria-label="Add a tag"
            data-testid="field-tag-input"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={addTag}
            disabled={tags.length >= 10 || !tagInput.trim()}
            aria-label="Add tag"
          >
            Add
          </button>
        </div>
      </div>

      {/* Works in (export targets) */}
      <div className="field">
        <span className="label">Works in</span>
        <div className="checks" role="group" aria-label="Export targets">
          <label className="check">
            <input
              type="checkbox"
              checked={targets.includes('claude-app')}
              onChange={() => toggleTarget('claude-app')}
              data-testid="target-claude"
            />
            <span>Claude</span>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={targets.includes('chatgpt')}
              onChange={() => toggleTarget('chatgpt')}
              data-testid="target-chatgpt"
            />
            <span>ChatGPT</span>
          </label>
        </div>
      </div>

    </div>
  );
}
