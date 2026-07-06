/**
 * RankBadge — a small pill showing a rank number (#1, #2, …).
 *
 * When used inside a compact SetupCard, the card provides position: relative
 * and CSS places this badge at top-right absolutely.
 *
 * The badge is aria-hidden because the containing Link already provides a
 * meaningful label; the accessible rank text is rendered as a visually-hidden
 * sibling so screen readers get the information without redundancy.
 */

interface RankBadgeProps {
  rank: number;
}

export default function RankBadge({ rank }: RankBadgeProps) {
  return (
    <>
      {/* Visible badge — decorative, hidden from AT */}
      <span className="rank-badge" aria-hidden="true">
        #{rank}
      </span>
      {/* Accessible rank text for screen readers */}
      <span className="sr-only">Ranked #{rank}</span>
    </>
  );
}
