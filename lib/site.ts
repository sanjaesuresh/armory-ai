/**
 * Canonical site URL for use in robots.ts, sitemap.ts, and metadataBase.
 *
 * Set NEXT_PUBLIC_SITE_URL in .env.local (see .env.local.example) to your
 * production domain (e.g. https://www.armory.ai). Trailing slashes are
 * stripped so callers can always write `${SITE_URL}/path`.
 *
 * In production builds where the variable is unset a one-time warning is
 * emitted at module load — sitemap, robots, and OG tags will use localhost
 * until the variable is configured.
 */

const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');

if (!raw && process.env.NODE_ENV === 'production') {
  console.warn(
    '[armory] NEXT_PUBLIC_SITE_URL is not set — sitemap/robots/OG will use ' +
      'http://localhost:3000 until it is configured.',
  );
}

export const SITE_URL = raw ?? 'http://localhost:3000';
