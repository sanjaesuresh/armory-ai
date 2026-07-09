'use client';

import { useState } from 'react';

/**
 * InstructionSteering — teaches that instructions steer output by letting the
 * learner toggle five instruction "rules" on/off against one fixed question.
 * The AI reply is composed deterministically from rule-driven fragments (never
 * freeform generation), so the same rule combination always produces the same
 * reply, and the learner can trace exactly which toggle changed what.
 *
 * Sample question and baseline/steered tone are drawn from the project-delay
 * email example in data/lessons/instructions-steering.ts, the canonical
 * before/after used to teach this exact concept.
 *
 * No props — fully self-contained simulation.
 */

type RuleId = 'tone' | 'format' | 'length' | 'persona' | 'audience';

interface RuleDef {
  id: RuleId;
  label: string;
  /** Shown in the "Your instructions" summary when the rule is active. */
  summary: string;
}

const RULES: RuleDef[] = [
  { id: 'tone', label: 'Tone: Professional', summary: 'Use a professional, formal tone' },
  { id: 'format', label: 'Format: Bullet points', summary: 'Format the reply as bullet points' },
  { id: 'length', label: 'Length: Concise', summary: 'Keep it concise, no filler' },
  { id: 'persona', label: 'Persona: Marketing expert', summary: 'Act as a marketing expert' },
  { id: 'audience', label: 'Audience: Beginner', summary: 'Write for a beginner, avoid jargon' },
];

const QUESTION = 'Write an update email about our project delay.';

/**
 * Reply is assembled from fragments keyed by which rules are active, not by
 * template-string interpolation, so every combination stays grammatical and
 * deterministic. Order of composition: opener (persona+audience) → tone →
 * body (format+length) → sign-off.
 */
function composeReply(active: Set<RuleId>): string {
  const hasTone = active.has('tone');
  const hasFormat = active.has('format');
  const hasLength = active.has('length');
  const hasPersona = active.has('persona');
  const hasAudience = active.has('audience');

  // No rules active — plain, generic baseline, matches the lesson's "no instructions" example.
  if (active.size === 0) {
    return 'Subject: Project Update, Timeline Adjustment\n\nHi team,\n\nI wanted to reach out with an update on our project. We have run into some delays and the original timeline will need to be adjusted. We are working hard to resolve the situation and will keep everyone informed as things progress.\n\nThank you for your patience and understanding.\n\nBest regards,\n[Your name]';
  }

  const lines: string[] = [];

  // Opener: persona frames who is "speaking"; audience shapes vocabulary.
  if (hasPersona && hasAudience) {
    lines.push('Subject: Quick update on our timeline\n');
    lines.push(
      "As the person handling our marketing rollout, here's a plain-language update on the delay, no jargon:"
    );
  } else if (hasPersona) {
    lines.push('Subject: Project Update, Timeline Adjustment\n');
    lines.push(
      'Writing this from a marketing-lead perspective: the launch plan needs a timeline adjustment.'
    );
  } else if (hasAudience) {
    lines.push('Subject: An update on our project\n');
    lines.push("Here's a simple, no-jargon update on where things stand:");
  } else {
    lines.push('Subject: Project Update, Timeline Adjustment\n');
    lines.push('Team, here is an update on the project delay.');
  }

  // Tone flips connective phrasing between formal and plain register.
  const toneOpener = hasTone
    ? 'I am writing to inform you that the project timeline requires adjustment due to unforeseen delays.'
    : "We've hit a snag and the timeline is shifting.";

  // Body content, expressed either as bullets or prose, and either concise or fuller.
  const points = hasLength
    ? ['Cause: integration took longer than scoped', 'Impact: timeline moves back', 'Next update: Friday']
    : [
        'The root cause was that a key integration took longer to complete than originally scoped, which pushed several downstream tasks back.',
        'As a result, the overall project timeline will need to shift to accommodate the additional work.',
        'We will share a fully revised schedule with specific dates by end of week, and will flag immediately if anything else changes.',
      ];

  let body: string;
  if (hasFormat) {
    body = points.map((p) => `• ${p}`).join('\n');
  } else if (hasLength) {
    body = points.join('. ') + '.';
  } else {
    body = points.join(' ');
  }

  lines.push('');
  lines.push(toneOpener);
  lines.push('');
  lines.push(body);
  lines.push('');

  // Sign-off, tone-dependent.
  lines.push(
    hasTone
      ? 'Thank you for your understanding.\n\nBest regards,\n[Your name]'
      : "Thanks for bearing with us.\n\n[Your name]"
  );

  return lines.join('\n');
}

export default function InstructionSteering() {
  const [active, setActive] = useState<Set<RuleId>>(new Set());

  function handleToggle(id: RuleId) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleReset() {
    setActive(new Set());
  }

  const activeRules = RULES.filter((r) => active.has(r.id));
  const reply = composeReply(active);

  return (
    <section className="lblock wgt-instruction-steering" aria-labelledby="is-heading">
      <h2 id="is-heading">Toggle instructions, watch the reply change</h2>
      <p>
        Same question every time. Turn instruction rules on and off below and
        watch the AI&apos;s reply update live, that&apos;s instructions steering
        output.
      </p>

      {/* Fixed sample question */}
      <div className="is-question">
        <p className="is-question-label">Your question</p>
        <p className="is-question-text">&quot;{QUESTION}&quot;</p>
      </div>

      {/* Rule toggles */}
      <div className="is-rules" role="group" aria-label="Instruction rules">
        {RULES.map((rule) => {
          const isActive = active.has(rule.id);
          return (
            <button
              key={rule.id}
              type="button"
              className={`is-chip${isActive ? ' is-chip-active' : ''}`}
              onClick={() => handleToggle(rule.id)}
              aria-pressed={isActive}
            >
              {rule.label}
            </button>
          );
        })}
        <button type="button" className="btn btn-ghost btn-sm is-reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Active-rules summary — reinforces instructions -> output */}
      <div className="is-summary">
        <p className="is-summary-label">Your instructions</p>
        {activeRules.length > 0 ? (
          <ul className="is-summary-list">
            {activeRules.map((rule) => (
              <li key={rule.id}>{rule.summary}</li>
            ))}
          </ul>
        ) : (
          <p className="is-summary-empty">
            None set, the AI falls back to a generic, one-size-fits-all reply.
          </p>
        )}
      </div>

      {/* Reply panel — aria-live so screen readers announce changes */}
      <div className="is-reply-panel">
        <p className="is-panel-label">AI reply</p>
        <pre className="is-reply-text" aria-live="polite" aria-atomic="true">
          {reply}
        </pre>
      </div>
    </section>
  );
}
