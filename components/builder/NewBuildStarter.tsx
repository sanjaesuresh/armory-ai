'use client';

/**
 * NewBuildStarter — the build-entry kind chooser on /build.
 *
 * Offers four kinds: a guided **Setup** (the existing instruction/knowledge
 * builder) or a registry **Agent / Skill / Harness** (user-posted developer
 * tools). Choosing a kind and pressing start creates the draft row via the
 * browser Supabase client (RLS enforces the author field), fixing `kind` at
 * creation, then navigates to /build/<id> — which branches to BuilderView
 * (setup) or RegistryBuilderView (registry kinds).
 *
 * Using a button (rather than creating on-load) avoids duplicate drafts if the
 * user refreshes /build.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { SetupKind } from '@/lib/setup/types';
import { isRegistryKind } from '@/lib/setup/types';
import {
  buildDraftRow,
  createSupabaseDraftsStore,
  type DraftInput,
} from '@/lib/community/drafts';

// ─── Kind options ─────────────────────────────────────────────────────────────

interface KindOption {
  kind: SetupKind;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const SparkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6.3 6.3 3.5 3.5M20.5 20.5l-2.8-2.8M17.7 6.3l2.8-2.8M3.5 20.5l2.8-2.8" />
  </svg>
);
const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const TerminalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const KIND_OPTIONS: KindOption[] = [
  {
    kind: 'setup',
    label: 'Setup',
    description: 'A guided instruction + knowledge setup people customize and export.',
    icon: <SparkIcon />,
  },
  {
    kind: 'agent',
    label: 'Agent',
    description: 'A single agent-definition file other developers drop into Claude.',
    icon: <CodeIcon />,
  },
  {
    kind: 'skill',
    label: 'Skill',
    description: 'A SKILL.md folder, instructions plus any supporting files.',
    icon: <BookIcon />,
  },
  {
    kind: 'harness',
    label: 'Harness',
    description: 'A Claude Code environment: settings, hooks, slash commands, conventions.',
    icon: <TerminalIcon />,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewBuildStarter() {
  const router = useRouter();
  const [selectedKind, setSelectedKind] = useState<SetupKind>('setup');
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setStarting(true);
    setError(null);
    try {
      // Client created only inside the handler — not at module/render time.
      const client = createSupabaseBrowserClient();
      const {
        data: { user },
        error: authError,
      } = await client.auth.getUser();
      if (authError || !user) throw new Error('Not signed in.');

      const id = crypto.randomUUID();
      // Seed a valid placeholder slug: draft-<8 hex chars>
      const shortHex = id.replace(/-/g, '').slice(0, 8);
      const now = new Date().toISOString();
      const registry = isRegistryKind(selectedKind);

      const initialInput: DraftInput = {
        // kind is fixed at creation and can never change afterwards.
        kind: selectedKind,
        slug: `draft-${shortHex}`,
        name: '',
        tagline: '',
        description: '',
        // Registry items are developer tools; role/category aren't collected in
        // the registry flow, so seed valid defaults that pass validation.
        role: registry ? 'developer' : '',
        industry: null,
        category: registry ? 'engineering' : 'general',
        tags: [],
        targets: registry ? [] : ['claude-app'],
        tier: 'core',
        instructionTemplate: '',
        variables: [],
        knowledgeFiles: [],
        scenarios: [],
        // Registry-only starting fields (buildDraftRow forces these empty for
        // setup kinds anyway).
        artifactFiles: [],
        repoUrl: null,
        capabilities: [],
      };

      const store = createSupabaseDraftsStore(client);
      await store.insertRow(
        buildDraftRow({ id, authorId: user.id, now, input: initialInput }),
      );
      router.push(`/build/${id}`);
    } catch {
      setError('Could not start a new build. Check your connection and try again.');
      setStarting(false);
    }
  }

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="What are you building?"
        style={{ maxWidth: 560, marginBottom: 24 }}
      >
        {KIND_OPTIONS.map((opt) => {
          const checked = selectedKind === opt.kind;
          return (
            <label
              key={opt.kind}
              className={`option-card${checked ? ' selected' : ''}`}
              data-testid={`kind-option-${opt.kind}`}
            >
              <input
                type="radio"
                name="build-kind"
                value={opt.kind}
                checked={checked}
                onChange={() => setSelectedKind(opt.kind)}
              />
              <strong>
                {opt.icon} {opt.label}
              </strong>
              <p>{opt.description}</p>
            </label>
          );
        })}
      </div>

      <button
        type="button"
        className="btn btn-primary btn-lg"
        onClick={handleStart}
        disabled={starting}
        aria-disabled={starting}
        data-testid="start-new-setup"
      >
        {starting
          ? 'Starting…'
          : selectedKind === 'setup'
            ? 'Start a new setup'
            : `Start a new ${selectedKind}`}
      </button>
      {error && (
        <p
          role="alert"
          style={{ color: 'var(--bad)', fontSize: '0.9rem', marginTop: 12 }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
