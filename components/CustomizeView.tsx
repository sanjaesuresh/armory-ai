'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Setup, Answers, KnowledgeFile } from '@/lib/setup/types';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { createSupabaseStoredFilesStore } from '@/lib/saved/storedFiles';
import SetupForm from './SetupForm';
import FileAttachment from './fields/FileAttachment';
import PreviewPanel from './PreviewPanel';
import TestDrivePanel from './TestDrivePanel';
import SaveSetupControl from './SaveSetupControl';
import ResumeNotice from './ResumeNotice';
import StepRail, { type WizardStep } from './StepRail';
import {
  type AttachmentsMap,
  setAttachment,
  removeAttachment,
  missingRequiredAttachments,
} from '@/lib/attachments/state';
import { isAnswerEmpty } from '@/lib/setup/answers';

function deriveSteps(setup: Setup): WizardStep[] {
  const seen = new Set<string>();
  const steps: WizardStep[] = [];

  // Fold any ungrouped variables into a default first step so they are never silently dropped
  const hasUngrouped = setup.variables.some((v) => !v.group);
  if (hasUngrouped) {
    steps.push({ id: 'group:__ungrouped__', label: 'Your details' });
  }

  for (const v of setup.variables) {
    if (v.group && !seen.has(v.group)) {
      seen.add(v.group);
      steps.push({ id: `group:${v.group}`, label: v.group });
    }
  }

  if ((setup.knowledgeFiles?.length ?? 0) > 0) {
    steps.push({ id: 'knowledge', label: 'Knowledge files' });
  }

  steps.push({ id: 'review', label: 'Review' });
  return steps;
}

function isStepValid(
  stepId: string,
  setup: Setup,
  answers: Answers,
  attachments: AttachmentsMap,
): boolean {
  if (stepId.startsWith('group:')) {
    const groupName = stepId.slice(6);
    const isUngrouped = groupName === '__ungrouped__';
    return setup.variables
      .filter((v) => (isUngrouped ? !v.group : v.group === groupName) && v.required)
      .every((v) => !isAnswerEmpty(answers[v.key]));
  }
  if (stepId === 'knowledge') {
    return missingRequiredAttachments(setup.knowledgeFiles ?? [], attachments).length === 0;
  }
  return true; // review step has no "next"
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  setup: Setup;
  /** Whether the test-drive feature flag is on (sourced server-side). */
  testDriveEnabled?: boolean;
  /** Whether a user session exists (sourced server-side). Gates "Save my setup". */
  signedIn?: boolean;
  /** The signed-in user's id, when present. */
  userId?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CustomizeView({
  setup,
  testDriveEnabled = false,
  signedIn = false,
  userId,
}: Props) {
  const router = useRouter();
  const steps = deriveSteps(setup);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  // Bumped when the preview's "Test-drive with your answers" button is clicked,
  // to trigger a run inside TestDrivePanel for the setup's first scenario.
  const [externalRun, setExternalRun] = useState<{ scenarioId: string; key: number } | null>(null);
  const [attachments, setAttachments] = useState<AttachmentsMap>({});
  const [validateNow, setValidateNow] = useState(0);
  const [knowledgeError, setKnowledgeError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  // Existing account-stored copies keyed by knowledge-file name (signed-in only).
  const [storedByName, setStoredByName] = useState<Record<string, { id: string; storagePath: string }>>({});

  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  // Load the user's stored knowledge files once, so the attachment fields can
  // show which are already saved. Signed-in only; failures are non-fatal.
  useEffect(() => {
    if (!signedIn) return;
    let active = true;
    (async () => {
      try {
        const store = createSupabaseStoredFilesStore(createSupabaseBrowserClient());
        const files = await store.list();
        if (!active) return;
        const map: Record<string, { id: string; storagePath: string }> = {};
        for (const f of files) map[f.knowledgeFileName] = { id: f.id, storagePath: f.storagePath };
        setStoredByName(map);
      } catch {
        // Stored files are optional — ignore load failures.
      }
    })();
    return () => {
      active = false;
    };
  }, [signedIn]);

  // ── Answers handler ────────────────────────────────────────────────────────

  const handleAnswersChange = useCallback(
    (nextAnswers: Answers, _validity: { complete: boolean }) => {
      setAnswers(nextAnswers);
    },
    [],
  );

  // ── Navigation ─────────────────────────────────────────────────────────────

  function goToStep(i: number) {
    const clamped = Math.max(0, Math.min(steps.length - 1, i));
    setCurrentStep(clamped);
    // Move focus to the step heading for keyboard/SR users
    requestAnimationFrame(() => {
      stepHeadingRef.current?.focus();
    });
  }

  function handleContinue() {
    const step = steps[currentStep];

    if (step.id === 'knowledge') {
      const missing = missingRequiredAttachments(setup.knowledgeFiles ?? [], attachments);
      if (missing.length > 0) {
        setKnowledgeError(
          missing.length === 1
            ? `Attach the required file "${missing[0]}" before continuing.`
            : `Attach the required files before continuing: ${missing.join(', ')}.`,
        );
        return;
      }
      setKnowledgeError(null);
    } else if (step.id.startsWith('group:')) {
      if (!isStepValid(step.id, setup, answers, attachments)) {
        // Trigger SetupForm to mark visible required empty fields as touched
        setValidateNow((n) => n + 1);
        return;
      }
    }

    goToStep(currentStep + 1);
  }

  // ── Export ─────────────────────────────────────────────────────────────────

  function handleExport() {
    try {
      sessionStorage.setItem(
        'armory-export-state',
        JSON.stringify({ slug: setup.slug, answers, attachments }),
      );
    } catch {
      setExportError('Your attached file is too large to carry over. Try a smaller file.');
      return;
    }
    setExportError(null);
    router.push('/export?setup=' + setup.slug);
  }

  // ── Derived state ──────────────────────────────────────────────────────────

  const missingAttachments = missingRequiredAttachments(setup.knowledgeFiles ?? [], attachments);
  const allVariablesComplete = setup.variables
    .filter((v) => v.required)
    .every((v) => !isAnswerEmpty(answers[v.key]));
  const canExport = allVariablesComplete && missingAttachments.length === 0;

  let exportDisabledReason: string | null = null;
  if (!allVariablesComplete) {
    exportDisabledReason = 'Fill in all required fields to continue.';
  } else if (missingAttachments.length > 0) {
    exportDisabledReason =
      missingAttachments.length === 1
        ? `Attach the required file "${missingAttachments[0]}" to continue.`
        : `Attach the required files to continue: ${missingAttachments.join(', ')}.`;
  }

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const currentGroupName = step.id.startsWith('group:') ? step.id.slice(6) : null;

  const starterFiles = (setup.knowledgeFiles ?? []).filter((f) => f.kind === 'starter');
  const userProvidedFiles = (setup.knowledgeFiles ?? []).filter(
    (f): f is KnowledgeFile & { kind: 'user-provided' } => f.kind === 'user-provided',
  );

  const stepHeadingText =
    step.id === 'review' ? 'Review your setup' : step.label;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Page header */}
      <Link
        href={`/setup/${setup.slug}`}
        className="back-link"
        data-testid="customize-back-link"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19.5 12h-15M10 6.5 4.5 12 10 17.5" />
        </svg>
        Back to {setup.name}
      </Link>
      <h1 style={{ fontSize: 'clamp(1.7rem,3.2vw,2.2rem)', marginBottom: '4px' }}>
        Make it yours
      </h1>
      <p className="muted" style={{ marginBottom: 0, maxWidth: '40em' }}>
        A few short questions, plain English, no jargon. Your answers become
        Claude&apos;s standing instructions.
      </p>

      {/* One-time notice after resuming a saved setup whose version drifted */}
      <ResumeNotice slug={setup.slug} />

      {/* 3-column wizard layout */}
      <div className="cust-layout">

        {/* Left: step rail — raised surface card with iris active accent */}
        <div className="step-rail-card">
          <StepRail steps={steps} currentIndex={currentStep} onNavigate={goToStep} />
        </div>

        {/* Center: form card */}
        <div className="form-card" data-testid="customize-left">
          <h2
            ref={stepHeadingRef}
            tabIndex={-1}
            style={{ outline: 'none' }}
          >
            {stepHeadingText}
          </h2>

          {/* ── Variable-group step ───────────────────────────────────────── */}
          {currentGroupName && (
            <SetupForm
              slug={setup.slug}
              variables={setup.variables}
              onAnswersChange={handleAnswersChange}
              activeGroup={currentGroupName}
              validateNow={validateNow}
            />
          )}

          {/* ── Knowledge files step ──────────────────────────────────────── */}
          {step.id === 'knowledge' && (
            <div>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', marginBottom: '20px' }}>
                Reference material Claude keeps at hand. Starter files are always included;
                your own guide is optional.
              </p>

              {/* Starter files (always included) */}
              {starterFiles.map((kf) => (
                <div key={kf.name} className="file-included" style={{ marginBottom: '12px' }}>
                  <span className="icon-badge" style={{ background: 'var(--sage)', width: '36px', height: '36px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6.5 3.5h7L18.5 8v11.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z" />
                      <path d="M13.5 3.5V8h4.5M9 12.5h6M9 16h6" />
                    </svg>
                  </span>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '0.94rem' }}>{kf.name}</strong>
                    <br />
                    <span className="small" style={{ color: 'var(--ink-soft)' }}>
                      Included · {kf.purpose.slice(0, 80)}{kf.purpose.length > 80 ? '…' : ''}
                    </span>
                  </div>
                  <span className="status status-ready">Included</span>
                </div>
              ))}

              {/* User-provided files */}
              {userProvidedFiles.map((kf) => (
                <FileAttachment
                  key={kf.name}
                  knowledgeFile={kf}
                  value={attachments[kf.name]}
                  onChange={(content) => {
                    if (content === null) {
                      setAttachments((prev) => removeAttachment(prev, kf.name));
                    } else {
                      setAttachments((prev) => setAttachment(prev, kf.name, content));
                    }
                    setKnowledgeError(null);
                  }}
                  signedIn={signedIn}
                  userId={userId}
                  savedMeta={storedByName[kf.name] ?? null}
                />
              ))}

              {/* Knowledge step validation error */}
              {knowledgeError && (
                <p
                  role="alert"
                  style={{
                    color: 'var(--bad)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginTop: '12px',
                  }}
                >
                  {knowledgeError}
                </p>
              )}
            </div>
          )}

          {/* ── Review step ───────────────────────────────────────────────── */}
          {step.id === 'review' && (
            <div>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', marginBottom: '20px' }}>
                Here&apos;s what Armory will compile. Hop back to any step to change an answer.
              </p>

              <ul className="understand-list" style={{ marginBottom: '24px' }}>
                {setup.variables.map((v) => {
                  const val = answers[v.key];
                  const empty = isAnswerEmpty(val);
                  let text = v.label;
                  let ok = false;
                  if (!empty) {
                    ok = true;
                    if (typeof val === 'boolean') {
                      text = `${v.label}: ${val ? 'Yes' : 'No'}`;
                    } else {
                      const fmtd = Array.isArray(val)
                        ? (val as string[]).join(', ')
                        : String(val);
                      text = `${v.label}: ${fmtd}`;
                    }
                  }
                  return (
                    <li key={v.key} className={ok ? '' : 'pending'}>
                      {text}
                    </li>
                  );
                })}
              </ul>

              {canExport ? (
                <div className="success-note" style={{ margin: '0 0 20px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                  Your setup is ready to export.
                </div>
              ) : (
                <p
                  data-testid="cta-reason"
                  role="alert"
                  style={{
                    color: 'var(--bad)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    marginBottom: '16px',
                  }}
                >
                  {exportDisabledReason}
                </p>
              )}

              <button
                type="button"
                className="btn btn-primary btn-lg"
                disabled={!canExport}
                aria-disabled={!canExport}
                onClick={handleExport}
              >
                Export to Claude
              </button>

              {exportError && (
                <p
                  role="alert"
                  data-testid="export-error"
                  style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--bad)' }}
                >
                  {exportError}
                </p>
              )}

              {/* Save my setup — optional, account-gated inline (never blocks export) */}
              <SaveSetupControl
                setupId={setup.id}
                setupVersion={setup.version}
                setupName={setup.name}
                slug={setup.slug}
                answers={answers}
                signedIn={signedIn}
                userId={userId}
              />
            </div>
          )}

          {/* Form nav: Back / Continue */}
          <div className="form-nav">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => goToStep(currentStep - 1)}
              style={{ visibility: isFirstStep ? 'hidden' : 'visible' }}
            >
              Back
            </button>
            {!isLastStep && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleContinue}
              >
                Continue
              </button>
            )}
          </div>
        </div>

        {/* Right: live preview — elevated so the column reads as the result */}
        <div data-testid="customize-right" className="preview-elevated">
          <PreviewPanel
            setup={setup}
            answers={answers}
            testDriveEnabled={testDriveEnabled}
            onTestDrive={(scenarioId) =>
              setExternalRun((prev) => ({ scenarioId, key: (prev?.key ?? 0) + 1 }))
            }
          />
          {testDriveEnabled && (
            <TestDrivePanel
              setup={setup}
              answers={answers}
              canRun={canExport}
              runDisabledReason={exportDisabledReason}
              externalRun={externalRun}
            />
          )}
        </div>

      </div>
    </>
  );
}
