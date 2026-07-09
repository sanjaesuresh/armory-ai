'use client';

import { useState } from 'react';

/**
 * ArtifactVsChat — teaches that an artifact lives in a side panel, not the
 * message scroll, and that edits update the SAME artifact in place rather
 * than posting a new one. The learner picks one of the four artifact kinds
 * from the claude-artifacts lesson (Document / Code / Web page / Diagram),
 * then asks for an edit. Both steps append a short chat bubble; only the
 * side panel content changes, driving the lesson's core distinction home.
 *
 * Deterministic: each kind maps to a canned "v1" and "v2" body, no network,
 * no timers. No props — fully self-contained simulation.
 */

type Step = 'empty' | 'created' | 'edited';

interface ArtifactKind {
  id: string;
  label: string;
  /** Chat line the learner "sends" to request this kind. */
  askLabel: string;
  title: string;
  v1: string;
  v2: string;
}

const KINDS: ArtifactKind[] = [
  {
    id: 'document',
    label: 'Document',
    askLabel: 'Write a one-page project overview as a document',
    title: 'Project Overview.md',
    v1: '# Project Overview\n\nThis project streamlines our onboarding process end to end, reducing manual handoffs between sales and support. It covers account setup, data migration, and the first 30 days of customer support.\n\nGoals: cut onboarding time from 2 weeks to 3 days, and reduce support tickets in month one by 40%.',
    v2: '# Project Overview\n\nStreamlines onboarding, cuts time from 2 weeks to 3 days.\n\nGoal: -40% support tickets in month one.',
  },
  {
    id: 'code',
    label: 'Code',
    askLabel: 'Write a Python script that reads a CSV and prints a summary',
    title: 'summarize.py',
    v1: 'import csv\n\ndef summarize(path):\n    with open(path, newline="") as f:\n        rows = list(csv.DictReader(f))\n    print(f"Rows: {len(rows)}")\n    if rows:\n        print(f"Columns: {\', \'.join(rows[0].keys())}")\n    return rows\n\nif __name__ == "__main__":\n    summarize("data.csv")',
    v2: 'import csv\n\ndef summarize(path):\n    with open(path, newline="") as f:\n        rows = list(csv.DictReader(f))\n    print(f"Rows: {len(rows)}")\n\nsummarize("data.csv")',
  },
  {
    id: 'web-page',
    label: 'Web page',
    askLabel: 'Build a one-page site for my bakery with a header and contact form',
    title: 'index.html',
    v1: '<header>\n  <h1>Oat & Rye Bakery</h1>\n  <p>Fresh sourdough, daily.</p>\n</header>\n<form>\n  <label>Name <input name="name" /></label>\n  <label>Email <input type="email" name="email" /></label>\n  <label>Message <textarea name="message"></textarea></label>\n  <button type="submit">Send</button>\n</form>',
    v2: '<header>\n  <h1>Oat & Rye Bakery</h1>\n</header>\n<form>\n  <label>Email <input type="email" name="email" /></label>\n  <button type="submit">Send</button>\n</form>',
  },
  {
    id: 'diagram',
    label: 'Diagram',
    askLabel: "Draw a flowchart of our customer onboarding process",
    title: 'onboarding-flow',
    v1: 'Sign up\n  -> Verify email\n  -> Set up account\n  -> Import data\n  -> Schedule kickoff call\n  -> Onboarding complete',
    v2: 'Sign up\n  -> Set up account\n  -> Onboarding complete',
  },
];

const DEFAULT_KIND_INDEX = 0;

export default function ArtifactVsChat() {
  const [step, setStep] = useState<Step>('empty');
  const [kindIndex, setKindIndex] = useState(DEFAULT_KIND_INDEX);

  const kind = KINDS[kindIndex];
  const isEmpty = step === 'empty';
  const isEdited = step === 'edited';
  const version = isEdited ? 2 : 1;
  const body = isEdited ? kind.v2 : kind.v1;

  function handleCreate(index: number) {
    setKindIndex(index);
    setStep('created');
  }

  function handleEdit() {
    if (step === 'created') setStep('edited');
  }

  function handleReset() {
    setStep('empty');
  }

  return (
    <section className="lblock wgt-artifact-vs-chat" aria-labelledby="av-heading">
      <h2 id="av-heading">Artifacts live beside the chat</h2>
      <p>
        Ask for something that stands on its own and Claude opens it in a side
        panel instead of dropping it into the message scroll. Ask for a
        change and the same artifact updates in place, it doesn&apos;t get
        reposted.
      </p>

      {/* Kind picker — always visible so the learner can also switch kinds after reset */}
      <div className="av-kinds" role="group" aria-label="Artifact kinds">
        {KINDS.map((k, i) => (
          <button
            key={k.id}
            type="button"
            className={`btn btn-sm${!isEmpty && kindIndex === i ? ' btn-primary' : ' btn-outline'}`}
            onClick={() => handleCreate(i)}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="av-layout">
        {/* Chat column */}
        <div className="av-chat" aria-label="Chat">
          {isEmpty && (
            <p className="av-chat-hint">
              Pick an artifact kind above, e.g. &ldquo;{KINDS[DEFAULT_KIND_INDEX].askLabel}.&rdquo;
            </p>
          )}
          {!isEmpty && (
            <>
              <p className="chat-bub cb-user">{kind.askLabel}</p>
              <p className="chat-bub cb-ai">
                I&apos;ve put that in an artifact <span aria-hidden="true">&rarr;</span>
              </p>
            </>
          )}
          {isEdited && (
            <>
              <p className="chat-bub cb-user">Make it shorter</p>
              <p className="chat-bub cb-ai">
                Updated the artifact <span aria-hidden="true">&rarr;</span>
              </p>
            </>
          )}
        </div>

        {/* Artifact side panel — aria-live announces creation and in-place edits */}
        <div className="av-panel" aria-live="polite">
          {isEmpty ? (
            <p className="av-panel-placeholder">Your artifact will appear here</p>
          ) : (
            <div className="av-artifact">
              <div className="av-artifact-head">
                <span className="av-artifact-title">{kind.title}</span>
                <span className="av-artifact-version">v{version}</span>
              </div>
              <pre className="av-artifact-body">{body}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="av-controls">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => handleCreate(kindIndex)}
          disabled={!isEmpty}
        >
          Ask for an artifact
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleEdit}
          disabled={step !== 'created'}
        >
          Ask for an edit
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset} disabled={isEmpty}>
          Reset
        </button>
      </div>
    </section>
  );
}
