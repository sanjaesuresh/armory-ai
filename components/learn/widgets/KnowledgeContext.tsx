'use client';

import { useState } from 'react';

/**
 * KnowledgeContext — teaches knowledge-file attachment by letting the learner
 * toggle three files on/off and watch a fixed sample question get answered
 * differently depending on what's attached. Only the pricing file contains
 * the price the question asks about, so the answer is deterministic: attach
 * pricing → the model quotes the number; detach it → the model honestly says
 * it doesn't have that information, even if other files are attached.
 *
 * No props — fully self-contained simulation. No network, no randomness.
 */

interface KnowledgeFile {
  id: string;
  name: string;
  description: string;
  /** Whether this file's content is relevant to the sample question. */
  hasAnswer: boolean;
}

const FILES: KnowledgeFile[] = [
  {
    id: 'brand-guide',
    name: 'brand-guide.pdf',
    description: 'Voice, tone, and visual identity rules.',
    hasAnswer: false,
  },
  {
    id: 'pricing-sheet',
    name: 'pricing-sheet.xlsx',
    description: 'Current plan tiers and prices.',
    hasAnswer: true,
  },
  {
    id: 'product-spec',
    name: 'product-spec.docx',
    description: 'Feature list and technical requirements.',
    hasAnswer: false,
  },
];

const SAMPLE_QUESTION = 'What does the Pro plan cost per month?';

const ANSWER_WITH_PRICING =
  'According to pricing-sheet.xlsx, the Pro plan costs $49/month.';

const ANSWER_WITHOUT_PRICING =
  "I don't have that information. None of the attached files mention pricing, attach pricing-sheet.xlsx to answer this.";

export default function KnowledgeContext() {
  // Files start detached, mirrors a fresh project with no knowledge attached yet.
  const [attached, setAttached] = useState<Set<string>>(new Set());

  const attachedFiles = FILES.filter((f) => attached.has(f.id));
  // The answer depends only on whether the pricing file is attached, other
  // files change what the model *could* see but not this particular answer.
  const canAnswer = attachedFiles.some((f) => f.hasAnswer);

  function handleToggle(id: string) {
    setAttached((prev) => {
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
    setAttached(new Set());
  }

  return (
    <section className="lblock wgt-knowledge-context" aria-labelledby="kc-heading">
      <h2 id="kc-heading">Attach files, change the answer</h2>
      <p>
        Toggle the knowledge files below. The model can only use what&apos;s
        attached, watch the answer change as you attach and detach the
        pricing sheet.
      </p>

      {/* File toggles */}
      <ul className="kc-file-list" role="list" aria-label="Knowledge files">
        {FILES.map((file) => {
          const isAttached = attached.has(file.id);
          return (
            <li key={file.id} className="kc-file-row">
              <button
                type="button"
                className={`kc-file-toggle${isAttached ? ' kc-file-attached' : ''}`}
                aria-pressed={isAttached}
                onClick={() => handleToggle(file.id)}
              >
                <span className="kc-file-check" aria-hidden="true">
                  {isAttached ? '✓' : ''}
                </span>
                <span className="kc-file-info">
                  <span className="kc-file-name">{file.name}</span>
                  <span className="kc-file-desc">{file.description}</span>
                </span>
                <span className="kc-file-state" aria-hidden="true">
                  {isAttached ? 'Attached' : 'Not attached'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* What the AI can see — live-updating summary of assembled context */}
      <div className="kc-context-panel">
        <p className="kc-panel-label">What the AI can see</p>
        {attachedFiles.length > 0 ? (
          <ul className="kc-context-list" aria-live="polite" aria-relevant="additions removals">
            {attachedFiles.map((f) => (
              <li key={f.id}>{f.name}</li>
            ))}
          </ul>
        ) : (
          <p className="kc-context-empty" aria-live="polite">
            No files attached, the model sees only your question.
          </p>
        )}
      </div>

      {/* Sample question + answer */}
      <div className="kc-qa">
        <p className="kc-question">
          <span className="kc-qa-label">Question:</span> {SAMPLE_QUESTION}
        </p>
        <p
          className={`kc-answer${canAnswer ? ' kc-answer-known' : ' kc-answer-unknown'}`}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="kc-qa-label">Answer:</span>{' '}
          {canAnswer ? ANSWER_WITH_PRICING : ANSWER_WITHOUT_PRICING}
        </p>
      </div>

      <p className="kc-caption">
        The model only knows what&apos;s in its context, attaching a file puts
        it within reach; detaching one takes it away, even if the model
        answered from it a moment ago.
      </p>

      <div className="kc-controls">
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
          Reset
        </button>
      </div>
    </section>
  );
}
