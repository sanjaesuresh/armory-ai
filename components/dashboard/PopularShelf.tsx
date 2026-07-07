/**
 * PopularShelf — horizontal ranked card row for the "Most Popular" section.
 *
 * Shows up to N items (passed in, pre-filtered by the parent) with rank badges.
 * Each card links to the detail page and carries data-testid="setup-card-{slug}"
 * so existing assertions on shelf-popular still pass.
 */

import Link from 'next/link';
import type { Category, Setup } from '@/lib/setup/types';
import { getCategoryAccent } from '@/lib/catalog/categoryUtils';
import { detailPathFor } from '@/lib/catalog/dashboard';
import CategoryIcon from '@/components/icons/CategoryIcon';
import KindIcon from '@/components/icons/KindIcon';

type Variant = 'developers' | 'professionals';

interface PopularShelfProps {
  items: Setup[];
  variant: Variant;
}

export default function PopularShelf({ items, variant }: PopularShelfProps) {
  if (items.length === 0) return null;

  const isDev = variant === 'developers';

  return (
    <div className="pop-shelf">
      <div className="pop-shelf-head">
        <h2 className="pop-shelf-title">Most Popular</h2>
        <span className="pop-shelf-sub">Ranked by upvotes</span>
      </div>

      <div className="pop-shelf-track" role="list" aria-label="Most popular items">
        {items.map((setup, i) => {
          const href = detailPathFor(setup);
          const accent = getCategoryAccent(setup.category as Category);

          return (
            <Link
              key={setup.slug}
              href={href}
              className="pop-card"
              data-testid={`setup-card-${setup.slug}`}
              role="listitem"
            >
              {/* Rank badge */}
              <span className="pop-card-rank" aria-label={`Ranked #${i + 1}`}>
                #{i + 1}
              </span>

              {/* Icon */}
              <div
                className="pop-card-icon"
                style={{ color: accent }}
                aria-hidden="true"
              >
                {isDev
                  ? <KindIcon kind={setup.kind} size={18} />
                  : <CategoryIcon category={setup.category as Category} size={18} />}
              </div>

              {/* Content */}
              <strong className="pop-card-name">{setup.name}</strong>
              <p className="pop-card-tagline">{setup.tagline}</p>

              {setup.upvotes > 0 && (
                <span
                  className="pop-card-votes"
                  aria-label={`${setup.upvotes} upvotes`}
                >
                  ▲{setup.upvotes}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
