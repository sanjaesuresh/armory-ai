'use client';

import { useState, useRef, useCallback, useId } from 'react';
import CopyBlock from './CopyBlock';
import type { ExportBlock } from '@/lib/export/claudeApp';
import type { Setup } from '@/lib/setup/types';

interface Props {
  blocks: ExportBlock[];
  setup: Setup;
  brandName?: string;
  onCopySuccess?: () => void;
}

function tabLabel(block: ExportBlock): string {
  return block.kind === 'instruction' ? 'custom-instructions.md' : block.label;
}

function copyLabel(block: ExportBlock): string {
  return block.kind === 'instruction'
    ? 'Custom instructions — paste into your Project'
    : `${block.label} — fill in the blanks, then upload`;
}

const tabStyle = (active: boolean): React.CSSProperties => ({
  font: 'inherit',
  fontSize: '0.82rem',
  fontWeight: active ? 700 : 600,
  background: 'none',
  border: 'none',
  borderBottom: active ? '2px solid var(--ink)' : '2px solid transparent',
  padding: '10px 14px',
  cursor: 'pointer',
  color: active ? 'var(--ink)' : 'var(--muted)',
  whiteSpace: 'nowrap',
  flexShrink: 0,
});

/**
 * Accessible tablist showing one tab per ExportBlock (instruction + knowledge files)
 * plus a "Project settings" summary tab. Uses roving tabindex + arrow-key navigation.
 * Rendered inside the outer .copyblock container in ExportView.
 */
export default function BundleTabs({ blocks, setup, brandName, onCopySuccess }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Unique prefix so multiple BundleTabs on the same page won't collide on ids
  const uid = useId().replace(/:/g, 'x');

  const configIdx = blocks.length; // "Project settings" tab is always last
  const totalTabs = blocks.length + 1;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      let next = idx;
      if (e.key === 'ArrowRight') next = (idx + 1) % totalTabs;
      else if (e.key === 'ArrowLeft') next = (idx - 1 + totalTabs) % totalTabs;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = totalTabs - 1;
      else return;
      e.preventDefault();
      setActiveIdx(next);
      tabRefs.current[next]?.focus();
    },
    [totalTabs],
  );

  const projectName = brandName ? `${brandName} — ${setup.name}` : setup.name;
  const knowledgeBlocks = blocks.filter((b) => b.kind === 'knowledge');

  return (
    <div className="copyblock" style={{ marginBottom: '24px' }}>
      {/* Tab strip */}
      <div
        className="bundle-tabs"
        role="tablist"
        aria-label="Bundle files"
        style={{ background: 'var(--oat)', padding: '0 4px' }}
      >
        {blocks.map((block, idx) => (
          <button
            key={idx}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            role="tab"
            id={`btab-${uid}-${idx}`}
            aria-controls={`bpanel-${uid}-${idx}`}
            aria-selected={activeIdx === idx}
            tabIndex={activeIdx === idx ? 0 : -1}
            type="button"
            onClick={() => setActiveIdx(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            style={tabStyle(activeIdx === idx)}
          >
            {tabLabel(block)}
          </button>
        ))}
        {/* Project settings tab */}
        <button
          ref={(el) => {
            tabRefs.current[configIdx] = el;
          }}
          role="tab"
          id={`btab-${uid}-${configIdx}`}
          aria-controls={`bpanel-${uid}-${configIdx}`}
          aria-selected={activeIdx === configIdx}
          tabIndex={activeIdx === configIdx ? 0 : -1}
          type="button"
          onClick={() => setActiveIdx(configIdx)}
          onKeyDown={(e) => handleKeyDown(e, configIdx)}
          style={tabStyle(activeIdx === configIdx)}
        >
          Project settings
        </button>
      </div>

      {/* Block panels (instruction + knowledge files) */}
      {blocks.map((block, idx) => (
        <div
          key={idx}
          role="tabpanel"
          id={`bpanel-${uid}-${idx}`}
          aria-labelledby={`btab-${uid}-${idx}`}
          hidden={activeIdx !== idx}
        >
          <CopyBlock label={copyLabel(block)} content={block.content} embedded onCopySuccess={onCopySuccess} />
        </div>
      ))}

      {/* Project settings panel */}
      <div
        role="tabpanel"
        id={`bpanel-${uid}-${configIdx}`}
        aria-labelledby={`btab-${uid}-${configIdx}`}
        hidden={activeIdx !== configIdx}
        style={{ padding: '20px 22px' }}
      >
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gap: '10px',
            fontSize: '0.9rem',
          }}
        >
          <li>
            <span style={{ color: 'var(--ink-soft)' }}>Project name:</span>{' '}
            <strong>{projectName}</strong>
          </li>
          <li>
            <span style={{ color: 'var(--ink-soft)' }}>Custom instructions:</span> paste{' '}
            <strong>custom-instructions.md</strong>
          </li>
          {knowledgeBlocks.map((b, i) => (
            <li key={i}>
              <span style={{ color: 'var(--ink-soft)' }}>Project knowledge:</span> upload{' '}
              <strong>{b.label}</strong>
            </li>
          ))}
        </ul>
        <p className="small" style={{ marginTop: '14px', color: 'var(--ink-soft)' }}>
          That&apos;s the whole configuration — no settings pages, no toggles.
        </p>
      </div>
    </div>
  );
}
