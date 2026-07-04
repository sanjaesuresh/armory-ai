interface PlugIconProps {
  /** Icon dimensions in pixels (square). Defaults to 10. */
  size?: number;
}

/** Plug icon — signals "connects to tools"; used on the advanced-tier badge. */
export default function PlugIcon({ size = 10 }: PlugIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22v-5" />
      <path d="M9 7V2" />
      <path d="M15 7V2" />
      <path d="M6 13a6 6 0 0 0 12 0V7H6z" />
    </svg>
  );
}
