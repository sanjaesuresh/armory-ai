'use client';

/**
 * RegistryBuilderView — client-side wizard for posting a registry item
 * (agent / skill / harness) to the developer registry.
 *
 * The kind is fixed at draft creation (chosen on the /build entry page) and is
 * NOT editable here — it is shown read-only. The three steps mirror
 * docs/mock/dev-submit.html:
 *   1. Files    — upload artifact files (read client-side via the File API;
 *                 NO Supabase Storage). Server limits from ARTIFACT_FILE_LIMITS
 *                 are mirrored here for UX; the server remains authoritative.
 *   2. Listing  — an optional "Draft with AI" convenience that prefills the
 *                 editable form, plus name / tagline / description, a
 *                 capabilities editor, and an optional GitHub URL.
 *   3. Review   — a read-back plus the moderation explanation and Submit.
 *
 * Persistence mirrors BuilderView: debounced autosave (1.5 s) via the browser
 * Supabase client, a save-state indicator, and a pre-submit flush-save whose
 * failure aborts the POST. buildDraftUpdate never receives `kind` (fixed at
 * creation), so the DraftInput held here omits it.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { SetupRow } from '@/lib/catalog/repository';
import type { ArtifactFile, Capability, SetupKind } from '@/lib/setup/types';
import { ARTIFACT_FILE_LIMITS } from '@/lib/setup/types';
import {
  type DraftInput,
  buildDraftUpdate,
  createSupabaseDraftsStore,
} from '@/lib/community/drafts';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import KindBadge from '@/components/KindBadge';

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg
    width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true"
  >
    <path d="M19.5 12h-15M10 6.5 4.5 12 10 17.5" />
  </svg>
);

const FileIcon = () => (
  <svg
    width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true"
  >
    <path d="M14 3v5h5" />
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
  </svg>
);

const AlertIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true"
  >
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true"
  >
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true"
    style={{ color: 'var(--iris)' }}
  >
    <path d="M12 3.5 5 6v6c0 4.5 3 7.6 7 8.5 4-.9 7-4 7-8.5V6z" />
    <path d="m9 12 2 2 4-4.5" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Maps a draft row → the editable DraftInput (never carries `kind`). */
function rowToRegistryInput(row: SetupRow): DraftInput {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    role: row.role,
    industry: row.industry,
    category: row.category,
    tags: row.tags,
    // Registry drafts never carry a template.
    instructionTemplate: '',
    artifactFiles: (row.artifact_files as ArtifactFile[] | undefined) ?? [],
    repoUrl: row.repo_url ?? null,
    capabilities: (row.capabilities as Capability[] | undefined) ?? [],
  };
}

const KIND_ARTICLE: Record<'agent' | 'skill' | 'harness', string> = {
  agent: 'an agent',
  skill: 'a skill',
  harness: 'a harness',
};

/** repoUrl rule mirrored from the server validator. Returns an error, or null. */
function repoUrlError(url: string | null | undefined): string | null {
  if (url == null || url.trim() === '') return null;
  if (!url.startsWith('https://github.com/')) {
    return 'Enter a URL that starts with https://github.com/, or leave it blank.';
  }
  return null;
}

/** Human-readable byte size for the file rows. */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const ALLOWED_LABEL = ARTIFACT_FILE_LIMITS.allowedExtensions.join(', ');

/** True if the name ends with one of the allowed extensions (case-insensitive). */
function hasAllowedExtension(name: string): boolean {
  const lower = name.toLowerCase();
  return (ARTIFACT_FILE_LIMITS.allowedExtensions as ReadonlyArray<string>).some((ext) =>
    lower.endsWith(ext),
  );
}

/** Drops capability rows that are entirely blank so they don't trip the validator. */
function cleanCapabilities(caps: Capability[] | undefined): Capability[] {
  return (caps ?? []).filter(
    (c) => c.command.trim() !== '' || c.description.trim() !== '',
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 'files', label: 'Files' },
  { id: 'listing', label: 'Listing details' },
  { id: 'review', label: 'Review & submit' },
] as const;

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type DraftAiState = 'idle' | 'drafting' | 'failed';

interface Finding {
  field: string;
  message: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  draft: SetupRow;
}

export default function RegistryBuilderView({ draft }: Props) {
  const router = useRouter();
  const kind = (draft.kind ?? 'agent') as SetupKind;
  const registryKind = kind as 'agent' | 'skill' | 'harness';

  const [input, setInput] = useState<DraftInput>(() => rowToRegistryInput(draft));
  const [currentStep, setCurrentStep] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [findings, setFindings] = useState<Finding[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [draftAi, setDraftAi] = useState<DraftAiState>('idle');
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [submitErrors, setSubmitErrors] = useState<Array<{ message: string; path?: string }>>([]);

  const inputRef = useRef<DraftInput>(input);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveFailedRef = useRef(false);

  inputRef.current = input;

  const files = input.artifactFiles ?? [];
  const capabilities = input.capabilities ?? [];

  // Clear pending timers on unmount so no state update fires after teardown.
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  // ── Persistence ─────────────────────────────────────────────────────────────

  const executeSave = useCallback(
    async (currentInput: DraftInput) => {
      setSaveState('saving');
      saveFailedRef.current = false;
      try {
        const client = createSupabaseBrowserClient();
        const store = createSupabaseDraftsStore(client);
        const toSave: DraftInput = {
          ...currentInput,
          capabilities: cleanCapabilities(currentInput.capabilities),
        };
        // buildDraftUpdate throws if `kind` is present — toSave never carries it.
        await store.updateDraftFields(
          draft.id,
          buildDraftUpdate(toSave, new Date().toISOString()),
        );
        setSaveState('saved');
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setSaveState('idle'), 2000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (/duplicate key|already exists|unique constraint/i.test(msg)) {
          setFindings([{ field: 'slug', message: 'That slug is already taken, choose another.' }]);
        }
        setSaveState('error');
        saveFailedRef.current = true;
      }
    },
    [draft.id],
  );

  function scheduleSave() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void executeSave(inputRef.current);
    }, 1500);
  }

  function handleChange(patch: Partial<DraftInput>) {
    setInput((prev) => ({ ...prev, ...patch }));
    scheduleSave();
  }

  // ── File uploads (client-side; no Storage) ────────────────────────────────────

  async function handleFiles(selected: File[]) {
    const errors: string[] = [];
    const accepted: ArtifactFile[] = [];
    const existingCount = inputRef.current.artifactFiles?.length ?? 0;

    for (const file of selected) {
      if (!hasAllowedExtension(file.name)) {
        errors.push(`“${file.name}”, unsupported type. Allowed: ${ALLOWED_LABEL}.`);
        continue;
      }
      if (existingCount + accepted.length >= ARTIFACT_FILE_LIMITS.maxFiles) {
        errors.push(
          `“${file.name}”, you can attach at most ${ARTIFACT_FILE_LIMITS.maxFiles} files.`,
        );
        continue;
      }
      // Read text client-side via the File API — never uploaded to Storage.
      let content: string;
      try {
        content = await file.text();
      } catch {
        errors.push(`“${file.name}”, couldn’t be read. Try a plain-text file.`);
        continue;
      }
      // Mirror the server's byte limit (use encoded byte length, not char count).
      const byteLength = new TextEncoder().encode(content).length;
      if (byteLength > ARTIFACT_FILE_LIMITS.maxBytesPerFile) {
        errors.push(
          `“${file.name}”, too large (${formatBytes(byteLength)}). Files must be under 100 KB.`,
        );
        continue;
      }
      accepted.push({ name: file.name, content, isPrimary: false });
    }

    if (accepted.length > 0) {
      setInput((prev) => {
        const combined = [...(prev.artifactFiles ?? []), ...accepted];
        if (combined.length > 0 && !combined.some((f) => f.isPrimary)) {
          combined[0] = { ...combined[0], isPrimary: true };
        }
        return { ...prev, artifactFiles: combined };
      });
      scheduleSave();
    }
    setUploadErrors(errors);
  }

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    void handleFiles(Array.from(list));
    // Reset so selecting the same file again re-triggers change.
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const list = e.dataTransfer.files;
    if (!list || list.length === 0) return;
    void handleFiles(Array.from(list));
  }

  function setPrimary(index: number) {
    handleChange({
      artifactFiles: files.map((f, i) => ({ ...f, isPrimary: i === index })),
    });
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((f) => f.isPrimary)) {
      next[0] = { ...next[0], isPrimary: true };
    }
    handleChange({ artifactFiles: next });
  }

  // ── Capabilities editor ───────────────────────────────────────────────────────

  function addCapability() {
    handleChange({ capabilities: [...capabilities, { command: '', description: '' }] });
  }

  function updateCapability(index: number, patch: Partial<Capability>) {
    handleChange({
      capabilities: capabilities.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    });
  }

  function removeCapability(index: number) {
    handleChange({ capabilities: capabilities.filter((_, i) => i !== index) });
  }

  // ── Draft with AI (convenience — never a gate) ────────────────────────────────

  async function draftWithAi() {
    const current = inputRef.current.artifactFiles ?? [];
    if (current.length === 0) return;
    setDraftAi('drafting');
    try {
      const res = await fetch('/api/registry/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: registryKind,
          files: current.map((f) => ({ name: f.name, content: f.content })),
        }),
      });
      const data: unknown = await res.json();
      const json = data as {
        ok?: boolean;
        draft?: {
          name?: string;
          tagline?: string;
          description?: string;
          capabilities?: Array<{ command?: string; description?: string }>;
        };
      };
      if (res.ok && json.ok && json.draft) {
        const d = json.draft;
        const drafted = Array.isArray(d.capabilities)
          ? d.capabilities.map((c) => ({
              command: String(c.command ?? ''),
              description: String(c.description ?? ''),
            }))
          : undefined;
        setInput((prev) => ({
          ...prev,
          name: d.name ?? prev.name,
          tagline: d.tagline ?? prev.tagline,
          description: d.description ?? prev.description,
          capabilities:
            drafted && drafted.length > 0 ? drafted : prev.capabilities,
        }));
        setDraftAi('idle');
        scheduleSave();
      } else {
        // 200 { ok:false, code } or any non-200 → drop to manual mode.
        setDraftAi('failed');
      }
    } catch {
      // Network / parse failure → manual mode. Files stay intact.
      setDraftAi('failed');
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  function goToStep(index: number) {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, index));
    setCurrentStep(clamped);
    setFindings([]);
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  function validateFilesStep(): Finding[] {
    if ((inputRef.current.artifactFiles?.length ?? 0) === 0) {
      return [{ field: 'files', message: 'Add at least one file before continuing.' }];
    }
    return [];
  }

  function validateListingStep(): Finding[] {
    const v = inputRef.current;
    const errs: Finding[] = [];
    if (!v.name?.trim()) errs.push({ field: 'name', message: 'Give your tool a name.' });
    if (!v.tagline?.trim()) errs.push({ field: 'tagline', message: 'Add a one-line tagline.' });
    if (!v.description?.trim()) {
      errs.push({ field: 'description', message: 'Describe what it does.' });
    }
    const repoErr = repoUrlError(v.repoUrl);
    if (repoErr) errs.push({ field: 'repoUrl', message: repoErr });
    return errs;
  }

  function handleContinue() {
    if (currentStep === 0) {
      const errs = validateFilesStep();
      if (errs.length > 0) {
        setFindings(errs);
        return;
      }
    }
    if (currentStep === 1) {
      const errs = validateListingStep();
      if (errs.length > 0) {
        setFindings(errs);
        return;
      }
    }
    setFindings([]);
    void executeSave(inputRef.current);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    goToStep(currentStep + 1);
  }

  // ── Submit ────────────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSubmitState('submitting');
    setSubmitErrors([]);

    void (async () => {
      try {
        await executeSave(inputRef.current);
        if (saveFailedRef.current) {
          setSubmitState('error');
          setSubmitErrors([
            { message: "Your changes couldn't be saved, check your connection and try again." },
          ]);
          return;
        }

        const res = await fetch('/api/community/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ setupId: draft.id }),
        });
        const data: unknown = await res.json();
        const json = data as {
          ok: boolean;
          errors?: Array<{ message: string; path?: string }>;
          error?: string;
        };

        if (json.ok) {
          router.push('/my/submissions?submitted=1');
        } else {
          setSubmitState('error');
          setSubmitErrors(
            json.errors ?? [{ message: json.error ?? 'Submit failed. Please try again.' }],
          );
        }
      } catch {
        setSubmitState('error');
        setSubmitErrors([{ message: 'Could not connect. Check your connection and try again.' }]);
      }
    })();
  }

  // ── Derived ────────────────────────────────────────────────────────────────────

  const isFirstStep = currentStep === 0;
  const step = STEPS[currentStep];
  const fieldError = (name: string) => findings.find((f) => f.field === name)?.message;
  const filesErr = fieldError('files');
  const nameErr = fieldError('name');
  const taglineErr = fieldError('tagline');
  const descErr = fieldError('description');
  const repoErr = fieldError('repoUrl');
  const liveRepoErr = repoUrlError(input.repoUrl);
  const cleanCaps = cleanCapabilities(capabilities);

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      <Link href="/developers" className="back-link" data-testid="registry-back-link">
        <ArrowLeftIcon />
        Developers
      </Link>

      <h1 style={{ fontSize: 'clamp(1.7rem,3.2vw,2.2rem)', marginBottom: 4 }}>
        Post to the registry
      </h1>
      <p className="muted" style={{ marginBottom: 0, maxWidth: '44em' }}>
        Share an agent, skill, or harness other developers can drop into their own
        Claude. Every submission is reviewed by the Armory team for safety before
        it goes live.
      </p>

      <div className="cust-layout">
        {/* Left: step rail */}
        <nav className="steps-rail" aria-label="Submission steps">
          {STEPS.map((s, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <button
                key={s.id}
                type="button"
                className={`rail-step${isDone ? ' done' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => goToStep(i)}
              >
                <span className="n" aria-hidden="true">
                  {isDone ? <CheckIcon size={12} /> : i + 1}
                </span>
                {s.label}
                {isDone && <span className="sr-only"> (completed)</span>}
              </button>
            );
          })}
        </nav>

        {/* Center: form card */}
        <form
          className="form-card"
          onSubmit={(e) => e.preventDefault()}
          noValidate
          aria-label={`Submission step: ${step.label}`}
        >
          <h2 ref={stepHeadingRef} tabIndex={-1} style={{ outline: 'none' }}>
            {step.label}
          </h2>

          {/* ── Step 0: Files ── */}
          {step.id === 'files' && (
            <>
              <p className="lede">
                Drop in the files that make up your {registryKind}. We&apos;ll read
                them right here in your browser, nothing is uploaded until you submit.
              </p>

              <div className="field">
                <span className="label">Kind</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <KindBadge kind={kind} />
                  <span className="small muted" style={{ fontWeight: 600 }}>
                    You&apos;re posting {KIND_ARTICLE[registryKind]}.
                  </span>
                </div>
              </div>

              <div className="field">
                <span className="label" id="files-label">
                  Files <span className="req" aria-hidden="true">*</span>
                </span>
                <div
                  className="file-slot"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                >
                  <strong>Drop files here, or browse</strong>
                  up to {ARTIFACT_FILE_LIMITS.maxFiles} files, 100 KB each · text
                  formats ({ALLOWED_LABEL})
                  <div style={{ marginTop: 12 }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse files
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ARTIFACT_FILE_LIMITS.allowedExtensions.join(',')}
                    onChange={onFileInputChange}
                    data-testid="registry-file-input"
                    aria-labelledby="files-label"
                    className="sr-only"
                  />
                </div>

                {uploadErrors.length > 0 && (
                  <div
                    className="inline-warning"
                    role="alert"
                    data-testid="registry-upload-error"
                    style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    {uploadErrors.map((msg, i) => (
                      <span key={i}>{msg}</span>
                    ))}
                  </div>
                )}

                {files.length > 0 && (
                  <div
                    role="radiogroup"
                    aria-label="Primary file"
                    style={{ marginTop: 14 }}
                  >
                    {files.map((f, i) => {
                      const bytes = new TextEncoder().encode(f.content).length;
                      return (
                        <div className="file-included" key={`${f.name}-${i}`}>
                          <span className="icon-badge" aria-hidden="true">
                            <FileIcon />
                          </span>
                          <div className="fx">
                            <strong>{f.name}</strong>
                            <span>{formatBytes(bytes)}</span>
                          </div>
                          <label className="file-primary">
                            <input
                              type="radio"
                              name="registry-primary"
                              checked={f.isPrimary}
                              onChange={() => setPrimary(i)}
                              aria-label={`Make ${f.name} the primary file`}
                            />
                            <span>Primary</span>
                          </label>
                          <button
                            type="button"
                            className="file-remove"
                            onClick={() => removeFile(i)}
                            aria-label={`Remove ${f.name}`}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {filesErr && (
                  <p className="error-msg" role="alert" style={{ display: 'block', marginTop: 8 }}>
                    {filesErr}
                  </p>
                )}
              </div>
            </>
          )}

          {/* ── Step 1: Listing details ── */}
          {step.id === 'listing' && (
            <>
              <p className="lede">
                Draft it with AI from your files, then edit anything before it goes to
                review.
              </p>

              <div style={{ marginBottom: 22 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => void draftWithAi()}
                  disabled={draftAi === 'drafting'}
                  data-testid="registry-draft-ai"
                >
                  {draftAi === 'drafting' ? 'Drafting…' : 'Draft with AI'}
                </button>
                <p className="help" style={{ margin: '8px 0 0' }}>
                  Optional. We read your files and suggest a listing, you review and
                  edit everything.
                </p>
              </div>

              {draftAi === 'drafting' && (
                <div className="drafting" role="status" data-testid="registry-drafting">
                  <span className="spinner" aria-hidden="true" />
                  <h3>AI is drafting your listing…</h3>
                  <p>Reading your files and writing a name, tagline, description, and capabilities.</p>
                </div>
              )}

              {draftAi === 'failed' && (
                <div className="notice" role="alert" data-testid="registry-ai-failed">
                  <AlertIcon size={18} />
                  <div>
                    <strong>We couldn&apos;t draft this one automatically.</strong>
                    <p>
                      No draft credit was used. Fill in the details yourself, the form
                      below is ready, and review works exactly the same.
                    </p>
                  </div>
                </div>
              )}

              {draftAi !== 'drafting' && (
                <>
                  <div className={`field${nameErr ? ' invalid' : ''}`}>
                    <label htmlFor="rName">
                      Name <span className="req" aria-hidden="true">*</span>
                    </label>
                    <input
                      className="input"
                      id="rName"
                      type="text"
                      value={input.name}
                      onChange={(e) => handleChange({ name: e.target.value })}
                      aria-describedby={nameErr ? 'rName-err' : undefined}
                      autoComplete="off"
                    />
                    {nameErr && (
                      <p className="error-msg" id="rName-err" role="alert">
                        {nameErr}
                      </p>
                    )}
                  </div>

                  <div className={`field${taglineErr ? ' invalid' : ''}`}>
                    <label htmlFor="rTagline">
                      Tagline <span className="req" aria-hidden="true">*</span>
                    </label>
                    <input
                      className="input"
                      id="rTagline"
                      type="text"
                      value={input.tagline}
                      onChange={(e) => handleChange({ tagline: e.target.value })}
                      aria-describedby={taglineErr ? 'rTagline-err' : undefined}
                      autoComplete="off"
                    />
                    {taglineErr && (
                      <p className="error-msg" id="rTagline-err" role="alert">
                        {taglineErr}
                      </p>
                    )}
                  </div>

                  <div className={`field${descErr ? ' invalid' : ''}`}>
                    <label htmlFor="rDesc">
                      Description <span className="req" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      className="input"
                      id="rDesc"
                      rows={4}
                      value={input.description}
                      onChange={(e) => handleChange({ description: e.target.value })}
                      aria-describedby={descErr ? 'rDesc-err' : undefined}
                    />
                    {descErr && (
                      <p className="error-msg" id="rDesc-err" role="alert">
                        {descErr}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <span className="label">What it does</span>
                    <p className="help">Each capability is a command or trigger, plus what it does.</p>
                    <div>
                      {capabilities.map((cap, i) => (
                        <div className="cap-edit" key={i}>
                          <input
                            className="input mono"
                            type="text"
                            value={cap.command}
                            placeholder="/command"
                            onChange={(e) => updateCapability(i, { command: e.target.value })}
                            aria-label={`Capability ${i + 1} command`}
                          />
                          <input
                            className="input"
                            type="text"
                            value={cap.description}
                            placeholder="What it does"
                            onChange={(e) => updateCapability(i, { description: e.target.value })}
                            aria-label={`Capability ${i + 1} description`}
                          />
                          <button
                            type="button"
                            className="file-remove"
                            onClick={() => removeCapability(i)}
                            aria-label={`Remove capability ${i + 1}`}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={addCapability}
                    >
                      <PlusIcon /> Add capability
                    </button>
                  </div>

                  <div className={`field${repoErr || liveRepoErr ? ' invalid' : ''}`} style={{ marginBottom: 0 }}>
                    <label htmlFor="rGithub">
                      GitHub URL{' '}
                      <span className="muted" style={{ fontWeight: 600 }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      className="input"
                      id="rGithub"
                      type="text"
                      inputMode="url"
                      placeholder="https://github.com/…"
                      value={input.repoUrl ?? ''}
                      onChange={(e) =>
                        handleChange({ repoUrl: e.target.value === '' ? null : e.target.value })
                      }
                      aria-describedby={liveRepoErr ? 'rGithub-err' : undefined}
                    />
                    {(liveRepoErr || repoErr) && (
                      <p
                        className="error-msg"
                        id="rGithub-err"
                        role="alert"
                        data-testid="registry-github-error"
                      >
                        {liveRepoErr ?? repoErr}
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── Step 2: Review & submit ── */}
          {step.id === 'review' && (
            <>
              <p className="lede">
                Here&apos;s what reviewers will see. Nothing is published until it&apos;s
                approved.
              </p>
              <ul className="review-summary">
                <li>
                  <span className="k">Name</span>
                  <span className="v">{input.name || <em className="muted">, </em>}</span>
                </li>
                <li>
                  <span className="k">Kind</span>
                  <span className="v">
                    <KindBadge kind={kind} />
                  </span>
                </li>
                <li>
                  <span className="k">Tagline</span>
                  <span className="v">{input.tagline || <em className="muted">, </em>}</span>
                </li>
                <li>
                  <span className="k">Files</span>
                  <span className="v">
                    {files.length} file{files.length === 1 ? '' : 's'}
                  </span>
                </li>
                <li>
                  <span className="k">What it does</span>
                  <span className="v">
                    {cleanCaps.length > 0 ? (
                      cleanCaps.map((c) => c.command || c.description).join(', ')
                    ) : (
                      <em className="muted">No capabilities listed</em>
                    )}
                  </span>
                </li>
                <li>
                  <span className="k">GitHub</span>
                  <span className="v">
                    {input.repoUrl ? input.repoUrl : <em className="muted">None</em>}
                  </span>
                </li>
              </ul>

              <div
                className="notice"
                style={{
                  background: 'var(--sky)',
                  color: 'var(--ink-soft)',
                  borderColor: 'var(--hairline-strong)',
                }}
              >
                <ShieldIcon />
                <div>
                  <strong>Goes to moderation first.</strong>
                  <p>
                    Every submission is checked by the Armory team for safety before it
                    appears in the registry, usually within a day. It sits under
                    “Pending” in your library until then.
                  </p>
                </div>
              </div>

              {submitState === 'error' && submitErrors.length > 0 && (
                <div
                  style={{
                    background: 'var(--bad-tint)',
                    border: '1px solid rgba(179,64,47,0.2)',
                    borderRadius: 'var(--r-md)',
                    padding: '16px 20px',
                    marginTop: 16,
                  }}
                  role="alert"
                  data-testid="registry-submit-error"
                >
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--bad)', margin: '0 0 8px' }}>
                    Your submission could not be sent
                  </p>
                  <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'grid', gap: 4 }}>
                    {submitErrors.map((e, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', color: 'var(--bad)' }}>
                        {e.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Form nav */}
          <div className="form-nav">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => goToStep(currentStep - 1)}
              style={{ visibility: isFirstStep ? 'hidden' : 'visible' }}
              aria-hidden={isFirstStep}
            >
              Back
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {saveState === 'saving' && (
                <span className="save-indicator save-indicator--saving" aria-live="polite">
                  Saving…
                </span>
              )}
              {saveState === 'saved' && (
                <span className="save-indicator save-indicator--saved" aria-live="polite">
                  <CheckIcon size={13} /> Saved
                </span>
              )}
              {saveState === 'error' && (
                <span className="save-indicator save-indicator--error" role="alert">
                  Could not save, check your connection
                </span>
              )}

              {step.id !== 'review' ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleContinue}
                  data-testid="registry-continue"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={submitState === 'submitting'}
                  data-testid="registry-submit"
                >
                  <CheckIcon size={16} /> Submit for review
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Right: what happens next */}
        <aside className="live-panel" aria-label="What happens next">
          <div className="live-card">
            <h3>
              <ShieldIcon /> Before it goes live
            </h3>
            <ul className="understand-list">
              <li>Structural check, required fields and readable files</li>
              <li>Automated safety screen, no hidden or hostile instructions</li>
              <li className="pending">Human review by the Armory team</li>
            </ul>
            <p className="small muted" style={{ margin: '10px 0 0' }}>
              Nothing you submit is published automatically.
            </p>
          </div>
          <div className="live-card">
            <h3>File limits</h3>
            <ul className="understand-list">
              <li>Up to {ARTIFACT_FILE_LIMITS.maxFiles} files per submission</li>
              <li>100 KB each</li>
              <li>Text formats, {ALLOWED_LABEL}</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
