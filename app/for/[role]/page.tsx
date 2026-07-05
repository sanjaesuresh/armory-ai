import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ROLES } from '@/lib/catalog/roles';
import { getRoleLandingCopy } from '@/lib/catalog/roleLanding';
import { createCatalogRepository } from '@/lib/catalog/repository';
import { recommend } from '@/lib/catalog/recommender';
import SetupCard from '@/components/SetupCard';

interface Props {
  params: Promise<{ role: string }>;
}

// Any slug not in generateStaticParams → 404 (belt + suspenders with notFound() below).
export const dynamicParams = false;

export function generateStaticParams() {
  return ROLES.map((r) => ({ role: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role: roleId } = await params;
  const copy = getRoleLandingCopy(roleId);
  if (!copy) return { title: 'Not Found · Armory' };

  return {
    title: `${copy.headline} · Armory`,
    description: copy.metaDescription,
    openGraph: {
      title: `${copy.headline} · Armory`,
      description: copy.metaDescription,
      url: `/for/${roleId}`,
      type: 'website',
    },
  };
}

// ── Inline SVGs per role (line style, aria-hidden — purely decorative) ────────

function HeroIllustration({ roleId }: { roleId: string }) {
  switch (roleId) {
    case 'marketing-manager':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 64, height: 64, color: 'var(--iris)' }}>
          <path d="M3 8h9l6-4v16l-6-4H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
          <path d="M7 8v8"/>
          <path d="M18 8a4 4 0 0 1 0 8"/>
        </svg>
      );
    case 'small-business-owner':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 64, height: 64, color: 'var(--iris)' }}>
          <path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
          <path d="M3 9l2-4h14l2 4"/>
          <path d="M9 9v12M15 9v12"/>
          <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>
        </svg>
      );
    case 'customer-support':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 64, height: 64, color: 'var(--iris)' }}>
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
          <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
      );
    case 'recruiter':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 64, height: 64, color: 'var(--iris)' }}>
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      );
    case 'sales-rep':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 64, height: 64, color: 'var(--iris)' }}>
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          <path d="M2 12h20"/>
        </svg>
      );
    case 'operations':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 64, height: 64, color: 'var(--iris)' }}>
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      );
    case 'founder-generalist':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 64, height: 64, color: 'var(--iris)' }}>
          <circle cx="12" cy="12" r="10"/>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
        </svg>
      );
    default:
      return null;
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function RoleLandingPage({ params }: Props) {
  const { role: roleId } = await params;

  const roleMeta = ROLES.find((r) => r.id === roleId);
  const copy = getRoleLandingCopy(roleId);

  if (!roleMeta || !copy) {
    notFound();
  }

  const repo = createCatalogRepository();
  let allSetups: Awaited<ReturnType<typeof repo.getSetups>>;
  try {
    allSetups = await repo.getSetups();
  } catch (err) {
    console.error(`[role-landing/${roleId}] failed to load setups:`, err);
    allSetups = [];
  }

  const { topPicks } = recommend(allSetups, { role: roleId });
  const hasTailoredSetups = topPicks.length > 0;

  // Fall back to top featured setups (up to 6) when there are no role matches.
  const displaySetups = hasTailoredSetups ? topPicks : allSetups.slice(0, 6);

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="wrap">
          <div style={{ marginBottom: '20px' }}>
            <HeroIllustration roleId={roleId} />
          </div>
          <span className="eyebrow">Setup for {roleMeta.label}</span>
          <h1 style={{ maxWidth: '18em' }}>{copy.headline}</h1>
          <p className="hero-sub" style={{ maxWidth: '36em' }}>{copy.intro}</p>
          <div className="hero-ctas">
            <Link
              className="btn btn-primary btn-lg"
              href={`/professionals?role=${roleId}`}
              data-testid="role-catalog-cta"
            >
              Browse {roleMeta.label} setups
            </Link>
            <Link className="btn btn-outline btn-lg" href="/professionals">
              Browse all setups
            </Link>
          </div>
        </div>
      </section>

      {/* ── Setup cards ───────────────────────────────────────────── */}
      <section className="section-tight">
        <div className="wrap">
          {!hasTailoredSetups && allSetups.length > 0 && (
            <p className="muted" style={{ marginBottom: '24px', fontSize: '0.92rem' }}>
              Nothing tailored for {roleMeta.label} yet — here&apos;s what&apos;s popular.
            </p>
          )}

          {displaySetups.length > 0 ? (
            <div className="setup-grid">
              {displaySetups.map((setup) => (
                <SetupCard key={setup.id} setup={setup} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ color: 'var(--hairline-strong)' }}
              >
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              <h3>No setups yet</h3>
              <p>Check back soon — we&apos;re adding new setups regularly.</p>
              <Link href="/professionals" className="btn btn-outline btn-sm">
                Browse all setups
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Concrete example ──────────────────────────────────────── */}
      <section className="section section-oat">
        <div className="wrap" style={{ maxWidth: '660px' }}>
          <span className="eyebrow">What this looks like in practice</span>
          <h2 style={{ marginBottom: '16px' }}>A concrete example</h2>
          <div className="scenario-example">
            <p className="a" style={{ margin: 0 }}>{copy.example}</p>
          </div>
          <div style={{ marginTop: '28px' }}>
            <Link
              className="btn btn-primary"
              href={`/professionals?role=${roleId}`}
            >
              Find my {roleMeta.label} setup
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
