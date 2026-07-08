'use client';

import { useState } from 'react';
import type { FlipCardsBlock as FlipCardsBlockData } from '@/lib/learn/types';

/**
 * FlipCardsBlock — each card is a toggle button (aria-pressed) that flips to its
 * definition. Flipped state is per-card; the flip is a CSS transition that
 * collapses to an instant swap under prefers-reduced-motion (handled in CSS).
 */
export default function FlipCardsBlock({ block }: { block: FlipCardsBlockData }) {
  const [flipped, setFlipped] = useState<boolean[]>(() => block.cards.map(() => false));

  const toggle = (i: number) => {
    setFlipped((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <section className="lblock">
      {block.intro ? <p>{block.intro}</p> : null}
      <div className="flip-cards" role="list">
        {block.cards.map((card, i) => {
          const isFlipped = flipped[i];
          return (
            <div className="flip-card-wrap" role="listitem" key={i}>
              <button
                type="button"
                className="flip-card-btn"
                aria-pressed={isFlipped}
                aria-label={`${card.front}, flip card`}
                onClick={() => toggle(i)}
              >
                <span className="flip-card-inner">
                  <span className="flip-card-face flip-face-front" aria-hidden={isFlipped || undefined}>
                    <span className="term">{card.front}</span>
                    <span className="flip-hint">Tap to flip</span>
                  </span>
                  <span className="flip-card-face flip-face-back" aria-hidden={!isFlipped || undefined}>
                    <span className="def">{card.back}</span>
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
