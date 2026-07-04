'use client';

import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';
import type { Setup } from '@/lib/setup/types';
import SpecPlateRow from './SpecPlateRow';
import SetupTabs, { type TabId } from './SetupTabs';
import { getCategoryTint, getSetupIcon } from '@/lib/catalog/categoryUtils';
import UpvoteButton from './UpvoteButton';
import ReportSetup from './ReportSetup';
import TakedownControl from './admin/TakedownControl';

interface Props {
  setup: Setup;
  /** Authenticated user's ID; null/undefined = signed out. */
  userId?: string | null;
  /** Whether the current user has already upvoted this setup (queried server-side). */
  initialUpvoted?: boolean;
  /** Whether the current user is a moderator (checked server-side, service role). */
  isModerator?: boolean;
}

/* Arrow-left inline SVG (matches the mock's back-link icon) */
const ArrowLeftIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19.5 12h-15M10 6.5 4.5 12 10 17.5" />
  </svg>
);

/* Shield check icon for the trust cue */
const ShieldIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3.5 5 6v6c0 4.5 3 7.6 7 8.5 4-.9 7-4 7-8.5V6z" />
    <path d="m9 12 2 2 4-4.5" />
  </svg>
);

/*
 * Illustration SVG — ported from docs/mock/setup.html.
 * Receives a tint class for the container background.
 */
const DetailIllustration = () => (
  <svg
    viewBox="0 0 360 250"
    fill="none"
    role="img"
    aria-label="Illustration of a checklist being completed"
  >
    <circle cx="300" cy="52" r="22" fill="rgba(255,255,255,.7)" />
    <circle cx="52" cy="200" r="12" fill="rgba(255,255,255,.7)" />
    {/* clipboard */}
    <rect x="110" y="34" width="140" height="182" rx="12" fill="#fff" stroke="#272319" strokeWidth="3" />
    <rect x="152" y="24" width="56" height="20" rx="8" fill="#F3EDE2" stroke="#272319" strokeWidth="3" />
    <path d="M130 76h56M130 116h64M130 156h48" stroke="#D9D1C2" strokeWidth="5" strokeLinecap="round" />
    {/* check circles */}
    <circle cx="228" cy="74" r="9" fill="#E3F2E8" stroke="#2E7D4F" strokeWidth="2.4" />
    <path d="m224 74 3 3 5.5-6" stroke="#2E7D4F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="228" cy="114" r="9" fill="#E3F2E8" stroke="#2E7D4F" strokeWidth="2.4" />
    <path d="m224 114 3 3 5.5-6" stroke="#2E7D4F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="228" cy="154" r="9" fill="#fff" stroke="#756C5C" strokeWidth="2.4" />
    {/* pencil */}
    <path d="M256 190l44-44 14 14-44 44-18 4z" fill="#FBF1D3" stroke="#272319" strokeWidth="3" strokeLinejoin="round" />
    <path d="M294 152l14 14" stroke="#272319" strokeWidth="3" />
    <path d="M256 190l14 14" stroke="#272319" strokeWidth="3" />
    {/* iris accent dashes */}
    <path d="M84 60c6-2 12-2 18 0M76 84c8-3 16-3 24 0" stroke="#5B50C8" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export default function SetupDetail({
  setup,
  userId = null,
  initialUpvoted = false,
  isModerator = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const tabsRef = useRef<HTMLDivElement>(null);

  const tint = getCategoryTint(setup.category);
  const icon = getSetupIcon(setup.role, setup.category);

  const handlePreview = useCallback(() => {
    setActiveTab('scenarios');
    setTimeout(() => {
      tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
  }, []);

  // Side-card understand-list: custom instructions + each knowledge file + export bundle
  const sideItems = [
    'Custom instructions',
    ...setup.knowledgeFiles.map((kf) => kf.name),
    'Export bundle for Claude Projects',
  ];

  return (
    <main>
      <div className="wrap">
        {/* Back link */}
        <Link href="/catalog" className="back-link">
          <ArrowLeftIcon />
          All setups
        </Link>

        {/* Detail head */}
        <div className="detail-head">
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '10px',
              }}
            >
              <span
                className="icon-badge"
                aria-hidden="true"
                style={{ fontSize: '1.25rem' }}
              >
                {icon}
              </span>

              {setup.source === 'curated' ? (
                <span className="trust-cue">
                  <ShieldIcon />
                  Reviewed by the Armory team
                </span>
              ) : setup.source === 'community' ? (
                <span className="badge badge-community" data-testid="detail-badge-community">
                  Community
                </span>
              ) : setup.source === 'ai-generated' ? (
                <span className="badge badge-ai" data-testid="detail-badge-ai">
                  AI-generated
                </span>
              ) : null}
            </div>

            <h1 style={{ marginBottom: '8px' }}>{setup.name}</h1>

            <p
              className="muted"
              style={{ maxWidth: '36em', fontSize: '1.05rem' }}
            >
              {setup.description}
            </p>

            {/* Tags — styled by .detail-head .tags in globals.css */}
            <div className="tags">
              {setup.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="detail-ctas">
              <Link
                href={`/setup/${setup.slug}/customize`}
                className="btn btn-primary btn-lg"
              >
                Use this setup
              </Link>
              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={handlePreview}
              >
                Preview setup
              </button>
            </div>

            {/* Community meta: upvote count, author attribution */}
            <div className="detail-meta" style={{ marginTop: '18px' }}>
              <UpvoteButton
                setupId={setup.id}
                initialCount={setup.upvotes}
                initialUpvoted={initialUpvoted}
                userId={userId}
              />
              {setup.source === 'community' && setup.author && (
                <span data-testid="detail-author">
                  by{' '}
                  {setup.author.length > 24
                    ? `${setup.author.substring(0, 24)}…`
                    : setup.author}
                </span>
              )}
            </div>

            {/* Report — shown for all setups (signed-out → inline AuthPrompt) */}
            <div style={{ marginTop: '12px' }}>
              <ReportSetup setupId={setup.id} userId={userId} />
            </div>

            {/* Moderator takedown — only when: moderator + community or ai-generated + approved */}
            {isModerator &&
              (setup.source === 'community' || setup.source === 'ai-generated') &&
              setup.reviewStatus === 'approved' && (
                <div
                  style={{
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--hairline)',
                  }}
                >
                  <TakedownControl setupId={setup.id} />
                </div>
              )}
          </div>

          {/* Illustration */}
          <div className={`detail-art ${tint}`} aria-hidden="true">
            <DetailIllustration />
          </div>
        </div>

        {/* Spec plates */}
        <SpecPlateRow setup={setup} />

        {/* Tabs + sticky side card */}
        <div className="detail-cols" style={{ paddingBottom: '72px' }} ref={tabsRef}>
          <div>
            <SetupTabs
              setup={setup}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Sticky side card */}
          <aside className="card" style={{ position: 'sticky', top: '88px' }}>
            <span className="eyebrow">What you&apos;ll get</span>
            <ul className="understand-list" style={{ margin: '6px 0 18px' }}>
              {sideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link
              href={`/setup/${setup.slug}/customize`}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Use this setup
            </Link>
            <p
              className="small muted center"
              style={{ margin: '12px 0 0' }}
            >
              Free · no account needed
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
