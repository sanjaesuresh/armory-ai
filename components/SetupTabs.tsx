'use client';

import { useRef, useCallback, useId } from 'react';
import type { Setup } from '@/lib/setup/types';
import { getCategoryAccent } from '@/lib/catalog/categoryUtils';

export type TabId = 'overview' | 'included' | 'scenarios';

interface Props {
  setup: Setup;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'included', label: "What's included" },
  { id: 'scenarios', label: 'Example scenarios' },
];

/* Inline SVG icons */
const PenIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m14.5 5 4.5 4.5L8 20.5l-4.8 1.3L4.5 17zM12.5 7l4.5 4.5" />
  </svg>
);

const FileIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6.5 3.5h7L18.5 8v11.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z" />
    <path d="M13.5 3.5V8h4.5M9 12.5h6M9 16h6" />
  </svg>
);

const BeakerIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9.5 3.5h5M10.5 3.5v5.2L5 18.2A1.6 1.6 0 0 0 6.4 20.5h11.2a1.6 1.6 0 0 0 1.4-2.3L13.5 8.7V3.5" />
    <path d="M8 14h8" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 4v11M7 10.5l5 5 5-5M4.5 19.5h15" />
  </svg>
);

export default function SetupTabs({ setup, activeTab, onTabChange }: Props) {
  const uid = useId().replace(/:/g, 'x');
  const tabsListRef = useRef<HTMLDivElement>(null);
  const accent = getCategoryAccent(setup.category);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const navigable = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!navigable.includes(e.key)) return;
      const idx = TABS.findIndex((t) => t.id === activeTab);
      if (idx === -1) return;
      e.preventDefault();
      let next: (typeof TABS)[number];
      if (e.key === 'Home') {
        next = TABS[0];
      } else if (e.key === 'End') {
        next = TABS[TABS.length - 1];
      } else if (e.key === 'ArrowRight') {
        next = TABS[(idx + 1) % TABS.length];
      } else {
        next = TABS[(idx + TABS.length - 1) % TABS.length];
      }
      onTabChange(next.id);
      const tabEl = tabsListRef.current?.querySelector<HTMLButtonElement>(
        `[data-tabid="${next.id}"]`,
      );
      tabEl?.focus();
    },
    [activeTab, onTabChange],
  );

  return (
    <>
      {/* Tablist */}
      <div
        className="tabs"
        role="tablist"
        aria-label="Setup details"
        onKeyDown={handleKeyDown}
        ref={tabsListRef}
      >
        {TABS.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className="tab"
              role="tab"
              id={`tab-${uid}-${tab.id}`}
              aria-controls={`${tab.id}-panel-${uid}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              data-tabid={tab.id}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview */}
      <div
        id={`overview-panel-${uid}`}
        role="tabpanel"
        aria-labelledby={`tab-${uid}-overview`}
        className="tabpanel tabpanel-surface"
        hidden={activeTab !== 'overview'}
      >
        <h3>What this setup does</h3>
        <p className="muted">
          {setup.tagline ? `${setup.tagline}. ` : ''}
          {setup.description}
        </p>

        <h3 style={{ marginTop: '28px' }}>What Armory compiles for you</h3>
        <p className="muted">
          Once you fill in the customization form, Armory compiles your answers
          into a ready-to-paste instruction block — every word is deterministic
          and inspectable before you export. You also get{' '}
          {setup.knowledgeFiles.length > 0
            ? `${setup.knowledgeFiles.length} knowledge file${
                setup.knowledgeFiles.length === 1 ? '' : 's'
              }`
            : 'export instructions'}{' '}
          and a guided walkthrough for Claude Projects.
        </p>

        <h3 style={{ marginTop: '28px' }}>Who made it</h3>
        <p className="muted" style={{ marginBottom: 0 }}>
          {setup.source === 'curated'
            ? 'Curated by the Armory team and reviewed before publishing. Member-contributed setups are also available — every one passes the same review gate.'
            : 'Member-contributed setup.'}
        </p>
      </div>

      {/* What's included */}
      <div
        id={`included-panel-${uid}`}
        role="tabpanel"
        aria-labelledby={`tab-${uid}-included`}
        className="tabpanel tabpanel-surface"
        hidden={activeTab !== 'included'}
      >
        <ul className="included-list">
          <li style={{ boxShadow: `inset 3px 0 0 ${accent}` }}>
            <span className="icon-badge" aria-hidden="true">
              <PenIcon />
            </span>
            <div>
              <strong>Custom instructions</strong>
              <span>
                Compiled from your answers into one clear instruction block —
                inspect every word before you export.
              </span>
            </div>
          </li>

          {setup.knowledgeFiles.map((kf) => (
            <li key={kf.name} style={{ boxShadow: `inset 3px 0 0 ${accent}` }}>
              <span className="icon-badge" aria-hidden="true">
                <FileIcon />
              </span>
              <div>
                <strong>{kf.name}</strong>
                <span>{kf.purpose}</span>
              </div>
            </li>
          ))}

          {setup.scenarios.length > 0 && (
            <li style={{ boxShadow: `inset 3px 0 0 ${accent}` }}>
              <span className="icon-badge" aria-hidden="true">
                <BeakerIcon />
              </span>
              <div>
                <strong>
                  {setup.scenarios.length} example scenario
                  {setup.scenarios.length === 1 ? '' : 's'}
                </strong>
                <span>
                  Built-in prompts so you can see what this setup does before
                  you commit.
                </span>
              </div>
            </li>
          )}

          <li style={{ boxShadow: `inset 3px 0 0 ${accent}` }}>
            <span className="icon-badge" aria-hidden="true">
              <DownloadIcon />
            </span>
            <div>
              <strong>Export bundle for Claude Projects</strong>
              <span>
                Copy-paste blocks and a guided walkthrough. A free-plan path is
                included too.
              </span>
            </div>
          </li>
        </ul>
      </div>

      {/* Example scenarios */}
      <div
        id={`scenarios-panel-${uid}`}
        role="tabpanel"
        aria-labelledby={`tab-${uid}-scenarios`}
        className="tabpanel tabpanel-surface"
        hidden={activeTab !== 'scenarios'}
      >
        {setup.scenarios.length === 0 ? (
          <p className="muted">No example scenarios for this setup.</p>
        ) : (
          <>
            <p className="muted" style={{ marginBottom: '18px' }}>
              These are the built-in scenarios for this setup. Each shows what
              you&apos;d ask — and what a well-configured setup gives back.
            </p>
            {setup.scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="scenario-example"
                style={{ boxShadow: `inset 3px 0 0 ${accent}` }}
              >
                <p className="q">&ldquo;{scenario.userInput}&rdquo;</p>
                <p className="a">&rarr; {scenario.expectedBehavior}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
