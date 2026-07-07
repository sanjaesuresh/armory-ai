/**
 * HeroBriefcase — living brand hero (decorative, non-interactive).
 *
 * The briefcase body is a raster (`/armory-briefcase-v2.webp`); the LIGHT is
 * vector so it can flow. An inline SVG overlay draws the circuit traces, nodes
 * and emblem: flowing energy via animated stroke-dashoffset, real glow via an
 * feGaussianBlur neon filter, breathing nodes/emblem, and a drifting radial
 * ambient glow. Body + circuits share one `.land-bc-stack` so they bob together.
 *
 * All motion is gated behind prefers-reduced-motion (globals.css) → a static
 * glowing state. CLS: explicit aspect-ratio. LCP: body image is priority/eager.
 * Perf: only transform/opacity animate; the neon filter is static.
 */

import Image from 'next/image';

export default function HeroBriefcase() {
  return (
    <div className="land-bc-btn" aria-hidden="true">
      {/* ambient moving glow */}
      <span className="land-bc-glow" />

      {/* body + circuits float together as one unit */}
      <span className="land-bc-stack">
        {/* unslop-ignore: brand hero image, decorative */}
        <Image
          src="/armory-briefcase-v2.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 860px) 300px, 420px"
          className="land-bc-body"
        />

        {/* vector circuit overlay — the living light */}
        <svg
          className="land-bc-fx"
          viewBox="0 0 680 620"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="hbNeon" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="hbNeonStrong" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* travelling pulse rides the baked seam line, stopping at the badge */}
          <path className="land-bc-flow" d="M30 290 L150 290 L196 308 L253 308" />
          <path className="land-bc-flow land-bc-f2" d="M400 308 L488 308 L532 290 L650 290" />

          {/* corner accents overlay the baked diagonal dashes */}
          <path className="land-bc-accent" d="M52 530 L96 507" />
          <path className="land-bc-accent land-bc-a2" d="M584 507 L628 530" />

          {/* sparks over real baked node positions */}
          <circle className="land-bc-spark" cx="90" cy="322" r="3.2" />
          <circle className="land-bc-spark land-bc-n2" cx="590" cy="322" r="3.2" />
          <circle className="land-bc-spark land-bc-n3" cx="232" cy="352" r="2.6" />
          <circle className="land-bc-spark land-bc-n2" cx="470" cy="352" r="2.6" />

          {/* emblem chevron — centered on the badge (342, 314) */}
          <path className="land-bc-emblem" d="M306 346 L342 282 L378 346" />
        </svg>
      </span>
    </div>
  );
}
