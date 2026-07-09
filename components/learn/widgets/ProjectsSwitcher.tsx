'use client';

import { useRef, useState } from 'react';

/**
 * ProjectsSwitcher — teaches Project isolation ("one brain per job") by
 * letting the learner switch between sample Projects. Switching tabs swaps
 * the shown project instructions and knowledge files; nothing carries over
 * between Projects, reinforcing that each one keeps its own separate setup.
 *
 * Tabs implemented as a full WAI-ARIA tablist (manual activation via click,
 * arrow-key roving focus) so the pattern is keyboard-operable without relying
 * on aria-live announcements alone. No props — fully self-contained.
 */

interface ProjectData {
  id: string;
  name: string;
  /** Short sample of this Project's persistent instructions. */
  instructions: string;
  /** This Project's attached knowledge files. */
  files: string[];
}

const PROJECTS: ProjectData[] = [
  {
    id: 'marketing',
    name: 'Marketing assistant',
    instructions:
      'You write in a warm, confident brand voice. Keep social copy under 280 characters. Never use exclamation points in headlines. Always end blog drafts with a call to action.',
    files: ['brand-voice-guide.pdf', 'q3-campaign-brief.docx', 'competitor-positioning.md'],
  },
  {
    id: 'research',
    name: 'Research assistant',
    instructions:
      'You summarize academic sources with inline citations. Flag any claim that appears in only one source as unverified. Use plain language, avoid jargon unless the source uses it first.',
    files: ['literature-review-2024.pdf', 'citation-style-guide.md', 'source-tracker.csv'],
  },
  {
    id: 'client-x',
    name: 'Client X support',
    instructions:
      'You answer only using Client X\'s product docs. If the answer is not in the knowledge files, say so and do not guess. Match the client\'s formal support tone.',
    files: ['client-x-product-manual.pdf', 'support-macros.md'],
  },
];

export default function ProjectsSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  // Ref per tab button so arrow-key navigation can move DOM focus, matching
  // the WAI-ARIA tabs pattern (roving tabindex, manual activation).
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = PROJECTS[activeIndex];

  function selectTab(index: number) {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    // Left/Right (and Home/End) move roving focus between tabs and activate
    // immediately, per the standard tablist keyboard pattern.
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectTab((index + 1) % PROJECTS.length);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectTab((index - 1 + PROJECTS.length) % PROJECTS.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectTab(PROJECTS.length - 1);
    }
  }

  return (
    <section className="lblock wgt-projects-switcher" aria-labelledby="pj-heading">
      <h2 id="pj-heading">Switch Projects, watch the brain change</h2>
      <p>
        Each Project keeps its own instructions and knowledge files. Pick a
        different Project below, its instructions and files swap completely,
        nothing carries over from the last one.
      </p>

      {/* Tablist — one Project selected at a time, roving tabindex for arrow-key nav */}
      <div className="pj-tabs" role="tablist" aria-label="Sample Projects">
        {PROJECTS.map((project, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={project.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`pj-tab-${project.id}`}
              aria-selected={isActive}
              aria-controls={`pj-panel-${project.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`pj-tab${isActive ? ' pj-tab-active' : ''}`}
              onClick={() => selectTab(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {project.name}
            </button>
          );
        })}
      </div>

      {/* Panel — content swaps entirely on tab change; aria-live announces the switch */}
      <div
        className="pj-panel"
        role="tabpanel"
        id={`pj-panel-${active.id}`}
        aria-labelledby={`pj-tab-${active.id}`}
        aria-live="polite"
      >
        <div className="pj-panel-section">
          <p className="pj-panel-label">Project instructions</p>
          <p className="pj-instructions">{active.instructions}</p>
        </div>

        <div className="pj-panel-section">
          <p className="pj-panel-label">Knowledge files</p>
          <ul className="pj-files-list" aria-label={`Knowledge files for ${active.name}`}>
            {active.files.map((file) => (
              <li className="pj-file" key={file}>
                <span className="pj-file-icon" aria-hidden="true" />
                <span>{file}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="pj-caption">
        One brain per job: switching Projects never mixes their instructions or files.
      </p>
    </section>
  );
}
