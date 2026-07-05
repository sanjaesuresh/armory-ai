import type { Setup } from '@/lib/setup/types';
import SetupCard from '../SetupCard';

interface ShelfRowProps {
  items: Setup[];
  /** Accessible label for the horizontal shelf region. */
  ariaLabel: string;
  /** Optional why-labels keyed by setup id (only used by the recommender strip). */
  whyLabels?: Record<string, string[]>;
  /** Test hook for the enclosing shelf region. */
  testId?: string;
}

/**
 * A horizontally-scrolling shelf of setup cards. Reuses SetupCard so shelf
 * cards match the rest of the catalog exactly (source badge, kind badge,
 * upvotes, tags). Renders nothing when there are no items so an empty shelf
 * never leaves a bare heading behind.
 */
export default function ShelfRow({ items, ariaLabel, whyLabels, testId }: ShelfRowProps) {
  if (items.length === 0) return null;

  return (
    <div className="shelf" aria-label={ariaLabel} data-testid={testId}>
      {items.map((setup) => (
        <SetupCard key={setup.slug} setup={setup} whyLabels={whyLabels?.[setup.id]} />
      ))}
    </div>
  );
}
