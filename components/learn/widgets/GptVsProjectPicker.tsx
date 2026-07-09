'use client';

import { useState } from 'react';

/**
 * GptVsProjectPicker — teaches the GPT-vs-Project decision from
 * data/lessons/chatgpt-gpts-vs-projects.ts by letting the learner answer two
 * yes/no questions grounded in that lesson's comparison table:
 *   - Sharing: is this for other people to open and use, or private to you?
 *   - Personal organization: does it need to group your own ongoing chats,
 *     with shared instructions/files, in one private workspace?
 *
 * The recommendation updates live once both questions are answered, and
 * handles the two edge cases the lesson itself calls out: answering "yes" to
 * both (they overlap — a shared team GPT vs. per-person private projects) and
 * "no" to both (neither fits; a one-off chat is enough, per the step-through's
 * third scenario).
 *
 * No props — fully self-contained, deterministic. All state is local.
 */

type Answer = 'yes' | 'no' | null;

interface QuestionDef {
  id: 'share' | 'organize';
  prompt: string;
}

const QUESTIONS: QuestionDef[] = [
  {
    id: 'share',
    prompt: 'Do other people need to open this and use it themselves?',
  },
  {
    id: 'organize',
    prompt:
      'Is this for organizing your own ongoing chats, privately, with shared instructions and files?',
  },
];

interface Recommendation {
  title: string;
  reason: string;
  /** Tone drives the result card's accent — neutral, single answer, or an edge case. */
  tone: 'gpt' | 'project' | 'both' | 'neither';
}

/**
 * Deterministic decision table. Mirrors the lesson's comparison table: sharing
 * is the custom-GPT axis, personal organization is the Project axis. Both true
 * or both false are named edge cases the lesson's prose already covers, so we
 * answer honestly instead of forcing a pick.
 */
function recommend(share: Answer, organize: Answer): Recommendation | null {
  if (share === null || organize === null) return null;

  if (share === 'yes' && organize === 'no') {
    return {
      title: 'Custom GPT',
      reason:
        'You configure it once and publish it, and anyone who opens it gets your instructions and files with no setup on their end.',
      tone: 'gpt',
    };
  }
  if (share === 'no' && organize === 'yes') {
    return {
      title: 'ChatGPT Project',
      reason:
        'A Project groups your own chats, instructions, and files in one private workspace. It is for you, not for publishing to others.',
      tone: 'project',
    };
  }
  if (share === 'yes' && organize === 'yes') {
    return {
      title: 'Both overlap here',
      reason:
        'Custom GPTs and Projects share the same ingredients. Publish a custom GPT for the team to open, and keep your own private Project for organizing the work behind it.',
      tone: 'both',
    };
  }
  // share === 'no' && organize === 'no'
  return {
    title: 'Neither, a plain chat is enough',
    reason:
      'Not shared and not an ongoing workspace to organize means a one-off task. Start a new chat with your global custom instructions already set, and move on.',
    tone: 'neither',
  };
}

export default function GptVsProjectPicker() {
  const [share, setShare] = useState<Answer>(null);
  const [organize, setOrganize] = useState<Answer>(null);

  const result = recommend(share, organize);
  const answeredCount = (share !== null ? 1 : 0) + (organize !== null ? 1 : 0);

  function handleAnswer(id: QuestionDef['id'], value: Answer) {
    if (id === 'share') setShare((prev) => (prev === value ? null : value));
    else setOrganize((prev) => (prev === value ? null : value));
  }

  function handleReset() {
    setShare(null);
    setOrganize(null);
  }

  return (
    <section className="lblock wgt-gpt-vs-project-picker" aria-labelledby="gp-heading">
      <h2 id="gp-heading">Custom GPT or Project?</h2>
      <p>
        Answer two questions about what you&apos;re building and get a recommendation,
        grounded in the same distinctions from the comparison above.
      </p>

      {/* Questions */}
      <div className="gp-questions">
        {QUESTIONS.map((q) => {
          const current = q.id === 'share' ? share : organize;
          return (
            <div className="gp-question" key={q.id} role="group" aria-label={q.prompt}>
              <p className="gp-question-prompt">{q.prompt}</p>
              <div className="gp-answer-row">
                <button
                  type="button"
                  className={`btn btn-sm${current === 'yes' ? ' btn-primary' : ' btn-outline'}`}
                  aria-pressed={current === 'yes'}
                  onClick={() => handleAnswer(q.id, 'yes')}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`btn btn-sm${current === 'no' ? ' btn-primary' : ' btn-outline'}`}
                  aria-pressed={current === 'no'}
                  onClick={() => handleAnswer(q.id, 'no')}
                >
                  No
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Result — aria-live so screen readers hear the recommendation as it firms up */}
      <div
        className={`gp-result${result ? ` gp-result-${result.tone}` : ' gp-result-neutral'}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {result ? (
          <>
            <p className="gp-result-title">{result.title}</p>
            <p className="gp-result-reason">{result.reason}</p>
          </>
        ) : (
          <p className="gp-result-prompt">
            {answeredCount === 0
              ? 'Answer both questions to see your recommendation.'
              : 'One more to go, answer the second question above.'}
          </p>
        )}
      </div>

      {/* Reset */}
      <div className="gp-controls">
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
          Start over
        </button>
      </div>
    </section>
  );
}
