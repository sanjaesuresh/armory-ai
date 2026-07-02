import { getCategoryLabel } from '@/lib/catalog/categoryUtils';

interface CategoryChipsProps {
  /** Ordered list: first element should be 'All'. */
  categories: string[];
  activeCat: string;
  onChange: (category: string) => void;
}

/**
 * Presentational chip row for category filtering.
 * No "use client" needed — used exclusively inside BrowseSetups (a client
 * component), so event handlers are safe.
 */
export default function CategoryChips({
  categories,
  activeCat,
  onChange,
}: CategoryChipsProps) {
  return (
    <div
      className="filter-row"
      role="group"
      aria-label="Filter by category"
    >
      {categories.map((cat) => {
        const label = cat === 'All' ? 'All' : getCategoryLabel(cat);
        const pressed = cat === activeCat;
        return (
          <button
            key={cat}
            type="button"
            className="chip"
            aria-pressed={pressed}
            onClick={() => onChange(cat)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
