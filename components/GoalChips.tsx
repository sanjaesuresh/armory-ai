'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GOAL_TAGS } from '@/lib/catalog/roles';

interface GoalChipsProps {
  /** Role id passed from the catalog; travels back in the URL after submission. */
  role: string;
  /** Current category filter (preserved through navigation when present). */
  cat?: string;
}

/**
 * Optional goal-selection chip row shown when a role is present but the user
 * has not yet expressed any goal preferences.  Selections are committed to the
 * URL as `goals=<comma-separated-ids>` alongside `role`, so the recommender
 * (Task 6) and the catalog both receive them.
 *
 * Skip commits an empty `goals=` param so the row never re-appears on reload.
 * The browse-popular path (no role) never renders this component.
 */
export default function GoalChips({ role, cat }: GoalChipsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const router = useRouter();

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function buildUrl(goals: string): string {
    const params = new URLSearchParams({ role, goals });
    if (cat) params.set('cat', cat);
    return `/professionals?${params.toString()}`;
  }

  function submit() {
    const goals = Array.from(selected).join(',');
    router.push(buildUrl(goals));
  }

  function skip() {
    router.push(buildUrl(''));
  }

  return (
    <section
      data-testid="goal-chips"
      aria-label="What do you want help with"
      className="goal-chips"
    >
      <p className="eyebrow" style={{ marginBottom: '4px' }}>
        Optional
      </p>
      <h2
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          margin: '0 0 6px',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}
      >
        What do you want help with?
      </h2>
      <p
        className="muted small"
        style={{ marginBottom: '16px', marginTop: 0 }}
      >
        Pick any that apply, or skip to browse all setups for your role.
      </p>

      <div
        role="group"
        aria-label="Goal areas"
        className="filter-row"
        style={{ marginBottom: '16px' }}
      >
        {GOAL_TAGS.map((tag) => (
          <button
            key={tag.id}
            type="button"
            className="chip"
            aria-pressed={selected.has(tag.id)}
            onClick={() => toggle(tag.id)}
          >
            {tag.label}
          </button>
        ))}
      </div>

      <div className="goal-chips-actions">
        <button
          type="button"
          className="btn btn-iris btn-sm"
          data-testid="goal-chips-submit"
          onClick={submit}
        >
          See setups
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          data-testid="goal-chips-skip"
          onClick={skip}
        >
          Skip
        </button>
      </div>
    </section>
  );
}
