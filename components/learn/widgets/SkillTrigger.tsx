'use client';

import { useState } from 'react';

/**
 * SkillTrigger — teaches how Claude Code skills trigger by letting the learner
 * pick one of three example requests. Two skill cards are always shown; choosing
 * a request highlights which skill's description matches (or shows "no match"
 * for the third). When a skill triggers, its instructions file is shown loading
 * into context — tying back to the context-window lesson.
 *
 * Matching is keyword-based, mimicking how a skill's SKILL.md description
 * determines when it activates. All state is local. No props.
 */

interface SkillData {
  id: string;
  title: string;
  description: string;
  /** Keywords that trigger this skill (checked against the request, case-insensitive). */
  triggers: string[];
  /** Excerpt from the skill's instructions file, shown in the context panel. */
  instructionPreview: string;
}

const SKILLS: SkillData[] = [
  {
    id: 'commit-message',
    title: 'commit-message',
    description:
      'Generates a conventional commit message from a git diff or staged changes.',
    triggers: ['commit message', 'commit msg'],
    instructionPreview:
      '# commit-message skill\n\nWhen the user asks for a commit message,\nanalyze the diff and produce a conventional\ncommit: type(scope): short description.',
  },
  {
    id: 'code-review',
    title: 'code-review',
    description: 'Reviews staged changes for code quality, bugs, and style issues.',
    triggers: ['review', 'code review', 'pr review'],
    instructionPreview:
      '# code-review skill\n\nWhen the user asks to review changes,\nanalyze the diff and provide feedback on\nquality, potential bugs, and style.',
  },
];

interface RequestDef {
  label: string;
}

const REQUESTS: RequestDef[] = [
  { label: 'Write a commit message for my changes' },
  { label: 'Review my PR changes for quality issues' },
  { label: 'Help me write a regex pattern' },
];

function matchSkill(req: string): SkillData | null {
  const lower = req.toLowerCase();
  for (const skill of SKILLS) {
    if (skill.triggers.some((t) => lower.includes(t))) return skill;
  }
  return null;
}

export default function SkillTrigger() {
  const [selectedReq, setSelectedReq] = useState<string | null>(null);

  const matchedSkill = selectedReq ? matchSkill(selectedReq) : null;
  const hasSelection = selectedReq !== null;

  function handleRequest(label: string) {
    setSelectedReq(label);
  }

  return (
    <section className="lblock wgt-skill-trigger" aria-labelledby="st-heading">
      <h2 id="st-heading">Which skill fires?</h2>
      <p>
        Each skill has a description. Claude Code reads the request and checks
        whether it matches any skill's description. Pick a request to see which
        skill activates, and what gets loaded into context.
      </p>

      {/* Request picker */}
      <div className="st-requests" role="group" aria-label="Example requests">
        {REQUESTS.map((req) => (
          <button
            key={req.label}
            type="button"
            className={`btn btn-sm${selectedReq === req.label ? ' btn-primary' : ' btn-outline'}`}
            onClick={() => handleRequest(req.label)}
            aria-pressed={selectedReq === req.label}
          >
            {req.label}
          </button>
        ))}
      </div>

      {/* Skill cards — always shown; active one highlighted when matched */}
      <div className="st-skills">
        {SKILLS.map((skill) => {
          const isActive = matchedSkill?.id === skill.id;
          return (
            <div
              key={skill.id}
              className={`st-skill-card${isActive ? ' st-skill-active' : ''}`}
              data-skill-id={skill.id}
            >
              <p className="st-skill-title">{skill.title}</p>
              <p className="st-skill-desc">{skill.description}</p>
            </div>
          );
        })}
      </div>

      {/* Why explanation — aria-live so screen readers hear the match result */}
      {hasSelection && (
        <p
          className={`st-why${matchedSkill ? '' : ' st-no-match'}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {matchedSkill
            ? `Matched: the ${matchedSkill.title} skill handles this kind of request.`
            : 'No skill matched this request, Claude handles it with no extra context.'}
        </p>
      )}

      {/* Context panel — shows the triggered skill's instructions file */}
      {matchedSkill && (
        <div className="st-context-panel">
          <p className="st-panel-label">
            Loading {matchedSkill.title}/SKILL.md into context
          </p>
          <pre>{matchedSkill.instructionPreview}</pre>
        </div>
      )}
    </section>
  );
}
