interface LogoMarkProps {
  /** Icon dimensions in pixels (square). Defaults to 26 (nav size). */
  size?: number;
}

/** Armory brand mark — ink "A" chevron with three paper-craft cards fanned
 * underneath (butter / lilac / iris). Geometry and colors fitted numerically
 * to docs/brand/logo.png (pixel mismatch < 2.2%, sub-pixel edge noise). */
export default function LogoMark({ size = 26 }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 568 558" fill="none" aria-hidden="true">
      <path
        d="M48.4 456.3 L230.7 104.4 A63.5 63.5 0 0 1 343.6 104.6 L524.4 456.3"
        stroke="#2C2920"
        strokeWidth="66.4"
        strokeLinecap="round"
      />
      <path
        d="M150.4 374.2 C160.3 345.3 180.4 326.9 209.0 317.2 C198.4 383.4 185.4 449.3 181.7 516.5 C174.2 468.4 158.9 422.1 150.4 374.2 Z"
        fill="#FEDB8F"
        stroke="#FEDB8F"
        strokeWidth="17.3"
        strokeLinejoin="round"
      />
      <path
        d="M230.0 338.0 C255.5 328.2 281.0 318.4 306.5 308.6 C288.1 362.4 266.0 414.7 243.0 466.6 C238.7 423.7 234.3 380.9 230.0 338.0 Z"
        fill="#E4DEDB"
      />
      <path
        d="M251.0 287.2 C273.6 268.3 300.7 279.1 325.7 275.8 C272.2 345.2 241.8 425.3 218.2 508.5 C230.1 434.9 241.1 361.1 251.0 287.2 Z"
        fill="#BFBAE4"
        stroke="#BFBAE4"
        strokeWidth="25.2"
        strokeLinejoin="round"
      />
      <path
        d="M352.4 326.1 C414.6 349.2 434.5 405.8 457.9 459.6 C393.8 481.6 334.9 518.2 266.0 526.3 C292.3 458.5 322.9 392.6 352.4 326.1 Z"
        fill="#5047B8"
        stroke="#5047B8"
        strokeWidth="53.0"
        strokeLinejoin="round"
      />
    </svg>
  );
}
