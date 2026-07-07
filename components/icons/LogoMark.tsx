interface LogoMarkProps {
  /** Icon dimensions in pixels (square). Defaults to 26 (nav size). */
  size?: number;
}

/** Armory brand mark — green upward chevron (∧) on a dark rounded-square badge.
 * Echoes the briefcase centre badge from the brand identity.
 * Stroke uses var(--iris) (#3ddc80); badge fill matches the card surface (#212122). */
export default function LogoMark({ size = 26 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* Dark rounded-square badge — echoes the briefcase centre badge */}
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="23"
        rx="5.5"
        fill="#212122"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      {/* Green upward chevron — the "A" caret form */}
      <path
        d="M5.5 17L12 8L18.5 17"
        stroke="var(--iris)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
