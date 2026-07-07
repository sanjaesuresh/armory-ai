/**
 * CategoryCards — clickable category tile grid for the Professionals dashboard.
 *
 * Each tile shows CategoryIcon + label + item count + one-line blurb.
 * Clicking a tile updates the category filter in DashboardView (same state
 * as the left-rail filter buttons). Clicking the active tile deselects it
 * (resets to 'All').
 *
 * Only categories with ≥1 item are passed in (filtered by DashboardView).
 */

import type { Category } from '@/lib/setup/types';
import {
  getCategoryLabel,
  getCategoryAccent,
  getCategoryBlurb,
} from '@/lib/catalog/categoryUtils';
import CategoryIcon from '@/components/icons/CategoryIcon';

interface CategoryCardsProps {
  /** Only categories with ≥1 item (pre-filtered by DashboardView). */
  categories: Category[];
  /** Item count per category key. */
  counts: Record<string, number>;
  /** The currently active filter value ('All' = none selected). */
  activeFilter: string;
  /** Called with category key or 'All' to deselect. */
  onSelect: (cat: string) => void;
}

export default function CategoryCards({
  categories,
  counts,
  activeFilter,
  onSelect,
}: CategoryCardsProps) {
  if (categories.length === 0) return null;

  return (
    <section className="cat-section" aria-labelledby="cat-section-heading">
      <div className="cat-section-head">
        <h2 id="cat-section-heading" className="cat-section-title">
          Browse by category
        </h2>
      </div>

      <div className="cat-card-grid">
        {categories.map((cat) => {
          const label = getCategoryLabel(cat);
          const accent = getCategoryAccent(cat);
          const blurb = getCategoryBlurb(cat);
          const count = counts[cat] ?? 0;
          const isActive = activeFilter === cat;
          const noun = count === 1 ? 'setup' : 'setups';

          return (
            <button
              key={cat}
              type="button"
              className={`cat-card${isActive ? ' cat-card--active' : ''}`}
              aria-pressed={isActive}
              onClick={() => onSelect(isActive ? 'All' : cat)}
              /* CSS custom property drives the accent border on :active */
              style={{ '--cat-accent': accent } as React.CSSProperties}
            >
              <div className="cat-card-icon" aria-hidden="true">
                <CategoryIcon category={cat} size={20} />
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
