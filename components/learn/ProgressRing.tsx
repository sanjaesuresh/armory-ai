/**
 * ProgressRing — circular progress indicator for a learn track.
 *
 * Renders an SVG ring with a filled arc proportional to completed/total, a
 * fractional text label inside the ring, and a visible label below. An
 * aria-label on the wrapper provides the accessible alternative reading
 * "N of M completed" (per the Task 8 spec).
 *
 * Contrast notes (on dark grey canvas):
 *   --ink-soft (#b6b6b8) on canvas: ~6:1 — WCAG AA
 *   --good (#3ddc80) fill arc: decorative, not text-carrying
 *   ring-label text: --ink-soft on canvas ≥ 4.5:1 — WCAG AA
 */

interface Props {
  completed: number;
  total: number;
}

const RADIUS = 20;
const CX = 26;
const CY = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 125.664

export default function ProgressRing({ completed, total }: Props) {
  const safeTotal = total > 0 ? total : 1;
  const fillLength = total === 0 ? 0 : (completed / safeTotal) * CIRCUMFERENCE;
  const gapLength = CIRCUMFERENCE - fillLength;

  const hasFill = fillLength > 0;
  const textLabel = total === 0 ? '–' : `${completed}/${total}`;
  const textColor = completed === 0 ? 'var(--muted)' : 'var(--ink-soft)';

  const ringLabel =
    total === 0
      ? 'No lessons yet'
      : completed === 0
        ? 'Not started'
        : completed === total
          ? `All ${completed} done`
          : `${completed} of ${total} done`;

  const accessibleText = `${completed} of ${total} completed`;

  return (
    <div
      className="track-progress"
      aria-label={accessibleText}
      role="img"
    >
      <svg
        className="qr-score-ring"
        width="52"
        height="52"
        viewBox="0 0 52 52"
        aria-hidden="true"
      >
        {/* Track (background ring) */}
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="var(--hairline-strong)"
          strokeWidth="4.5"
        />
        {/* Fill arc — only rendered when there is progress */}
        {hasFill && (
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke="var(--good)"
            strokeWidth="4.5"
            strokeDasharray={`${fillLength.toFixed(2)} ${gapLength.toFixed(2)}`}
            transform={`rotate(-90 ${CX} ${CY})`}
            strokeLinecap="round"
          />
        )}
        {/* Fraction label centred in the ring */}
        <text
          x={CX}
          y={CY + 5}
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill={textColor}
          fontFamily="inherit"
        >
          {textLabel}
        </text>
      </svg>
      <span className="ring-label">{ringLabel}</span>
    </div>
  );
}
