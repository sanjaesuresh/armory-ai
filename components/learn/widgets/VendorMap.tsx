'use client';

import { useState } from 'react';

/**
 * VendorMap — a venn-style map of Claude vs ChatGPT concepts. Two labelled
 * regions (Claude / ChatGPT) with a shared overlap; concept chips light up
 * whichever region(s) they live in and open an aria-live panel with the
 * per-app name and an honest caveat.
 *
 * All copy is derived from data/lessons/claude-vs-chatgpt-map.ts
 * (comparisonTable rows + flipCards). "Shareable AI assistant" has no direct
 * Claude equivalent as of mid-2026, so it lights ChatGPT-only and is flagged
 * as a gap rather than forced into the overlap.
 *
 * No props — fully self-contained, deterministic, no network/model calls.
 */

type Region = 'claude' | 'chatgpt' | 'overlap';

interface Concept {
  id: string;
  /** Chip label — matches a comparisonTable row's CONCEPT column. */
  label: string;
  region: Region;
  claudeName: string;
  chatgptName: string;
  caveat: string;
  /** True when one app has no real equivalent — surfaced as an explicit gap. */
  isGap?: boolean;
}

const CONCEPTS: Concept[] = [
  {
    id: 'always-on-instructions',
    label: 'Always-on instructions',
    region: 'overlap',
    claudeName: 'Profile preferences (Settings), applied across all your chats',
    chatgptName: 'Custom Instructions, set in Settings, applied to all your chats',
    caveat:
      'Closest scope match, but Claude’s profile preferences are less structured and less prominent than Custom Instructions. Projects add a separate per-workspace instruction layer on top.',
  },
  {
    id: 'workspace-with-files',
    label: 'Workspace with files',
    region: 'overlap',
    claudeName: 'Claude Projects, a named workspace with its own instructions and files',
    chatgptName: 'Projects, a named workspace with its own files and memory',
    caveat: 'A clean mapping, names even match. Specific behavior details may differ as both products evolve.',
  },
  {
    id: 'shareable-assistant',
    label: 'Shareable AI assistant',
    region: 'chatgpt',
    claudeName: 'No direct equivalent as of mid-2026, Projects are private per-user',
    chatgptName: 'Custom GPT, build one and optionally share it publicly or with your team',
    caveat:
      'An honest gap: Custom GPTs can be shared publicly or with a team; Claude Projects are private to you.',
    isGap: true,
  },
  {
    id: 'voice-and-style',
    label: 'Voice and style control',
    region: 'overlap',
    claudeName: 'Styles, a switchable global setting that shapes how Claude writes across all chats',
    chatgptName: 'Tone guidance added inside Custom Instructions',
    caveat:
      'Imperfect mapping: Styles are a dedicated, switchable setting. ChatGPT’s tone guidance lives inside Custom Instructions and applies to all chats with no per-chat toggle.',
  },
];

export default function VendorMap() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = activeId ? CONCEPTS.find((c) => c.id === activeId) ?? null : null;

  function handleSelect(id: string) {
    setActiveId((cur) => (cur === id ? null : id));
  }

  const claudeLit = active ? active.region === 'claude' || active.region === 'overlap' : false;
  const chatgptLit = active ? active.region === 'chatgpt' || active.region === 'overlap' : false;
  const overlapLit = active ? active.region === 'overlap' : false;

  return (
    <section className="lblock wgt-vendor-map" aria-labelledby="vm-heading">
      <h2 id="vm-heading">Where does it live?</h2>
      <p>
        Claude and ChatGPT share a lot of the same ideas under different names.
        Pick a concept below to see which app it lives in, and whether the
        mapping is clean or has a gap.
      </p>

      {/* Venn diagram — decorative; region names are conveyed via the chips/panel below */}
      <div className="vm-venn" aria-hidden="true">
        <svg viewBox="0 0 320 200" className="vm-venn-svg">
          <circle
            cx="130"
            cy="100"
            r="90"
            className={`vm-circle vm-circle-claude${claudeLit ? ' vm-circle-lit' : ''}`}
          />
          <circle
            cx="190"
            cy="100"
            r="90"
            className={`vm-circle vm-circle-chatgpt${chatgptLit ? ' vm-circle-lit' : ''}`}
          />
          {overlapLit && (
            <text x="160" y="185" className="vm-overlap-tag">
              shared
            </text>
          )}
        </svg>

        {/* Claude side header + brand glyph */}
        <div className="vm-side vm-side-claude">
          <svg viewBox="0 0 24 24" className="vm-glyph" aria-hidden="true">
            {/* Simplified sunburst: eight tapered rays (slim triangles) radiating from center */}
            {Array.from({ length: 8 }).map((_, i) => (
              <path
                key={i}
                d="M12 12 L11.1 3.8 Q12 2.2 12.9 3.8 Z"
                fill="currentColor"
                transform={`rotate(${i * 45} 12 12)`}
              />
            ))}
          </svg>
          <span className="vm-side-label">Claude</span>
        </div>

        {/* ChatGPT side header + brand glyph */}
        <div className="vm-side vm-side-chatgpt">
          <svg viewBox="0 0 24 24" className="vm-glyph" aria-hidden="true">
            {/* Simplified interlocking knot: four looped petals rotated around a shared center */}
            {Array.from({ length: 4 }).map((_, i) => (
              <path
                key={i}
                d="M12 12 C12 7.5 9.5 6 8 7.5 C6.5 9 7.5 12 12 12 Z"
                fill="currentColor"
                transform={`rotate(${i * 90} 12 12)`}
              />
            ))}
          </svg>
          <span className="vm-side-label">ChatGPT</span>
        </div>
      </div>

      {/* Concept chips — single-select */}
      <div className="vm-chips" role="group" aria-label="Concepts to compare">
        {CONCEPTS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`vm-chip${activeId === c.id ? ' vm-chip-active' : ''}`}
            onClick={() => handleSelect(c.id)}
            aria-pressed={activeId === c.id}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Mapping panel — aria-live so screen readers announce the selection */}
      <div className="vm-panel" aria-live="polite" aria-atomic="true">
        {active ? (
          <>
            {active.isGap && <p className="vm-gap-flag">No direct equivalent</p>}
            <dl className="vm-panel-grid">
              <div className="vm-panel-row">
                <dt>In Claude</dt>
                <dd>{active.claudeName}</dd>
              </div>
              <div className="vm-panel-row">
                <dt>In ChatGPT</dt>
                <dd>{active.chatgptName}</dd>
              </div>
            </dl>
            <p className="vm-caveat">{active.caveat}</p>
          </>
        ) : (
          <p className="vm-panel-empty">Pick a concept above to compare it across both apps.</p>
        )}
      </div>
    </section>
  );
}
