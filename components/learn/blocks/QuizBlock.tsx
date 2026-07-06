'use client';

import { useId, useRef, useState } from 'react';
import type { Quiz } from '@/lib/learn/types';

/**
 * QuizBlock — one question at a time. Choices are a radio group; the submit
 * control is disabled until a choice is picked. On submit the answer is marked
 * right/wrong, the correct choice is revealed and the explanation shows, and a
 * next-question control appears. After the last question a results screen shows
 * the score (N of M + percent) and a retake control. onComplete(correct, total)
 * fires exactly once each time the results screen is reached (retakes re-fire).
 */

const RING_RADIUS = 28;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ≈ 175.93

interface QuizBlockProps {
  block: Quiz;
  onComplete: (correct: number, total: number) => void;
}

function headingFor(pct: number): string {
  if (pct === 100) return 'Perfect score!';
  if (pct >= 67) return 'Great work!';
  if (pct >= 34) return 'Good effort';
  return 'Keep practicing';
}

export default function QuizBlock({ block, onComplete }: QuizBlockProps) {
  const questions = block.questions;
  const total = questions.length;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [phase, setPhase] = useState<'quiz' | 'results'>('quiz');

  const labelId = useId();
  const choiceRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (total === 0) {
    return (
      <section className="lblock">
        <p className="muted">No quiz questions for this lesson.</p>
      </section>
    );
  }

  const q = questions[current];
  const isLast = current === total - 1;
  const correctCount = answers.reduce(
    (n, sel, i) => n + (sel === questions[i].correctIndex ? 1 : 0),
    0,
  );
  const pct = Math.round((correctCount / total) * 100);

  const onRadioGroupKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (submitted) return;
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const count = q.choices.length;
    const cur = selected ?? 0;
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? (cur + 1) % count
        : (cur - 1 + count) % count;
    setSelected(next);
    choiceRefs.current[next]?.focus();
  };

  const submit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = selected;
      return next;
    });
  };

  const advance = () => {
    if (isLast) {
      setPhase('results');
      onComplete(correctCount, total);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const retake = () => {
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setAnswers([]);
    setPhase('quiz');
  };

  if (phase === 'results') {
    const arc = (pct / 100) * RING_CIRCUMFERENCE;
    return (
      <section className="lblock">
        <div className="quiz-results" role="region" aria-label="Quiz results">
          <svg className="qr-score-ring" width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
            <circle cx="36" cy="36" r={RING_RADIUS} fill="none" stroke="var(--hairline-strong)" strokeWidth="6" />
            <circle
              cx="36"
              cy="36"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--good)"
              strokeWidth="6"
              strokeDasharray={`${arc} ${RING_CIRCUMFERENCE - arc}`}
              strokeLinecap="round"
              transform="rotate(-90 36 36)"
            />
          </svg>
          <p className="qr-score-text">{pct}%</p>
          <p className="qr-score-label">
            {correctCount} of {total} correct
          </p>
          <h3 className="qr-heading">{headingFor(pct)}</h3>
          <div className="quiz-results-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={retake}>
              Retake quiz
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="lblock">
      <p className="quiz-progress">
        Question {current + 1} of {total}
      </p>
      <div className="quiz-q-block">
        <p className="quiz-q-text">{q.prompt}</p>
        <div className="quiz-choices" role="radiogroup" aria-labelledby={labelId} onKeyDown={onRadioGroupKeyDown}>
          <span id={labelId} className="sr-only">
            Answer choices for question {current + 1}
          </span>
          {q.choices.map((choice, vi) => {
            const isSelected = selected === vi;
            const isCorrect = vi === q.correctIndex;
            const cls = [
              'quiz-choice',
              !submitted && isSelected ? 'qc-selected' : '',
              submitted && isCorrect ? 'qc-correct' : '',
              submitted && isSelected && !isCorrect ? 'qc-wrong' : '',
              submitted ? 'qc-disabled' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={vi}
                ref={(el) => { choiceRefs.current[vi] = el; }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected || (selected === null && vi === 0) ? 0 : -1}
                className={cls}
                disabled={submitted}
                onClick={() => setSelected(vi)}
              >
                <span className="qc-radio" aria-hidden="true" />
                <span className="qc-text">{choice}</span>
              </button>
            );
          })}
        </div>

        {submitted ? (
          <div
            className={`quiz-feedback ${selected === q.correctIndex ? 'qf-correct' : 'qf-wrong'}`}
            aria-live="polite"
          >
            <strong>{selected === q.correctIndex ? 'Correct' : 'Not quite'}</strong>
            <p>{q.explanation}</p>
          </div>
        ) : null}
      </div>

      <div className="quiz-actions">
        {submitted ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={advance}>
            {isLast ? 'See results' : 'Next question'}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={selected === null}
            onClick={submit}
          >
            Submit answer
          </button>
        )}
      </div>
    </section>
  );
}
