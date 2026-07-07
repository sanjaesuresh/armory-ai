/**
 * KindCards — clickable kind tile grid for the Developers dashboard.
 *
 * Shows 4 fixed kind tiles: Agents / Skills / Harnesses / Setups.
 * Each uses KindIcon and filters the list below (same state as the left rail).
 * Clicking the active tile deselects it (resets to 'all').
 * Tiles with count=0 are rendered but dimmed (shown for context, not hidden).
 */

import type { SetupKind } from '@/lib/setup/types';
import KindIcon from '@/components/icons/KindIcon';

interface KindCardDef {
  kind: SetupKind;
  label: string;
  blurb: string;
  accent: string;
}

const KIND_CARD_DEFS: KindCardDef[] = [
  {
    kind: 'agent',
    label: 'Agents',
    blurb: 'Autonomous multi-step tasks for Claude Code',
    accent: 'var(--accent-sage)',
  },
  {
    kind: 'skill',
    label: 'Skills',
    blurb: 'Single-purpose slash commands & helpers',
    accent: 'var(--accent-sky)',
  },
  {
    kind: 'harness',
    label: 'Harnesses',
    blurb: 'Repo hooks, conventions & env wiring',
    accent: 'var(--accent-butter)',
  },
  {
    kind: 'setup',
    label: 'Setups',
    blurb: 'Curated bundles of agents, skills & harnesses',
    accent: 'var(--accent-lilac)',
  },
];

interface KindCardsProps {
  /** Item count per kind key. */
  counts: Record<string, number>;
  /** The currently active filter value ('all' = none selected). */
  activeFilter: string;
  /** Called with kind key or 'all' to deselect. */
  onSelect: (kind: string) => void;
}

export default function KindCards({ counts, activeFilter, onSelect }: KindCardsProps) {
  return (
    <section className="kind-section" aria-labelledby="kind-section-heading">
      <div className="cat-section-head">
        <h2 id="kind-section-heading" className="cat-section-title">
          Browse by kind
        </h2>
      </div>

      <div className="kind-card-grid">
        {KIND_CARD_DEFS.map(({ kind, label, blurb, accent }) => {
          const count = counts[kind] ?? 0;
          const isActive = activeFilter === kind;
          const noun = count === 1 ? 'tool' : 'tools';

          return (
            <button
              key={kind}
              type="button"
              className={`cat-card kind-card${isActive ? ' cat-card--active' : ''}${count === 0 ? ' cat-card--empty' : ''}`}
              aria-pressed={isActive}
              onClick={() => onSelect(isActive ? 'all' : kind)}
              style={{ '--cat-accent': accent } as React.CSSProperties}
            >
              <div className="cat-card-icon" aria-hidden="true">
                <KindIcon kind={kind} size={20} />
              </div>
              <strong className="cat-card-label">{label}</strong>
              <span className="cat-card-count">
                {count}&nbsp;{noun}
              </span>
              <p className="cat-card-blurb">{blurb}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
