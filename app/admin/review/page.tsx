/**
 * /admin/review — moderator-only review queue.
 *
 * Security gate: if the user is not signed in OR not in the `moderators`
 * allowlist → notFound() (a 404, never a hint that this page exists).
 * Uses the service-role client to bypass RLS for the moderators table and the
 * setups table (pending setups have no SELECT policy for the public).
 *
 * SERVER ONLY — imports createSupabaseServiceClient which must never reach the
 * browser. The client component (ReviewQueue) talks to the route instead.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSessionUser } from '@/lib/supabase/server';
import { createSupabaseServiceClient } from '@/lib/supabase/serviceClient';
import { createSupabaseModerationStore } from '@/lib/community/moderation';
import { rowToSetup, type SetupRow } from '@/lib/catalog/repository';
import { compileSetup } from '@/lib/setup/compiler';
import type { SafetyScreenResult } from '@/lib/community/safetyScreen';
import type { Answers, Variable } from '@/lib/setup/types';
import { isRegistryKind } from '@/lib/setup/types';
import ReviewQueue, { type QueueItemData, type GenerationMeta } from '@/components/admin/ReviewQueue';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Review queue · Armory',
  // Exclude from search engines.
  robots: { index: false, follow: false },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Builds a default Answers map for a setup's variables so we can compile a
 * preview without any user input. Required variables without a declared default
 * get a non-empty placeholder so renderTemplate won't throw.
 */
function defaultAnswersFor(variables: Variable[]): Answers {
  const answers: Answers = {};
  for (const v of variables) {
    if (v.default !== undefined) {
      answers[v.key] = v.default;
      continue;
    }
    switch (v.type) {
      case 'text':
      case 'multiline':
        answers[v.key] = v.required ? '[placeholder]' : '';
        break;
      case 'select':
        answers[v.key] = v.options?.[0] ?? (v.required ? '[option]' : '');
        break;
      case 'multiselect':
        if (v.required) {
          answers[v.key] = v.options?.length ? [v.options[0]] : ['[option]'];
        } else {
          answers[v.key] = [];
        }
        break;
      case 'number':
        answers[v.key] = v.required ? 1 : 0;
        break;
      case 'boolean':
        // false is a valid boolean — renderTemplate won't throw for it.
        answers[v.key] = false;
        break;
    }
  }
  return answers;
}

/** Returns a human-readable relative time string, e.g. "3 days ago". */
function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 0) return 'just now';
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 2) return 'just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

// safety_screen and generation_meta are jsonb columns not typed on SetupRow
// (safety_screen was added in Phase 5, generation_meta in Phase 6).
// Read them off the raw row with this augmented type.
type RawRow = SetupRow & {
  safety_screen?: SafetyScreenResult | null;
  generation_meta?: GenerationMeta | null;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ReviewQueuePage() {
  // ── Auth + moderator gate ────────────────────────────────────────────────────
  const user = await getSessionUser();
  if (!user) return notFound();

  const serviceClient = createSupabaseServiceClient();
  const store = createSupabaseModerationStore(serviceClient);

  let isMod: boolean;
  try {
    isMod = await store.isModerator(user.id);
  } catch (err) {
    console.error('[admin/review] moderator check failed:', err);
    return notFound();
  }
  if (!isMod) return notFound();

  // ── Load pending queue ───────────────────────────────────────────────────────
  let rows: SetupRow[];
  try {
    rows = await store.listPending();
  } catch (err) {
    console.error('[admin/review] failed to load pending queue:', err);
    return (
      <main className="section-tight">
        <div className="wrap" style={{ maxWidth: 1000 }}>
          <div className="error-banner" role="alert" style={{ maxWidth: 540 }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 4 2.8 19.5h18.4z" />
              <path d="M12 10v4.5M12 17.2v.1" />
            </svg>
            <div>
              <strong>Could not load the review queue</strong>
              <p>Please try again in a moment.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Build queue item data ────────────────────────────────────────────────────
  const items: QueueItemData[] = rows.map((row) => {
    // safety_screen and generation_meta are not typed on SetupRow — read off the raw row.
    const raw = row as RawRow;
    const safetyScreen = raw.safety_screen ?? null;
    const generationMeta = raw.generation_meta ?? null;

    // Derive kind and registry fields via rowToSetup (guards unknown kind values,
    // defaults artifactFiles/capabilities/repoUrl to safe empty values).
    const setup = rowToSetup(row);
    const { kind, description, capabilities, artifactFiles, repoUrl } = setup;

    // Compile with default answers for the preview — setup kind only.
    // Registry items have no meaningful instruction template, so skip compilation.
    let compiledInstruction = '';
    if (!isRegistryKind(kind)) {
      try {
        const answers = defaultAnswersFor(setup.variables);
        const compiled = compileSetup(setup, answers);
        compiledInstruction = compiled.instruction;
      } catch {
        compiledInstruction = row.instruction_template;
      }
    }

    return {
      id: row.id,
      name: row.name || 'Untitled setup',
      author: row.author,
      submittedAt: timeAgo(row.updated_at),
      needsAttention: safetyScreen?.needsAttention ?? false,
      findings: safetyScreen?.findings ?? [],
      compiledInstruction,
      source: row.source as 'curated' | 'community' | 'ai-generated',
      ...(generationMeta ? { generationMeta } : {}),
      kind,
      description,
      capabilities,
      artifactFiles,
      repoUrl,
    };
  });

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <main className="section-tight">
      <div className="wrap" style={{ maxWidth: 1000 }}>
        <div className="lib-head">
          <div>
            <h1 style={{ fontSize: '1.7rem', marginBottom: 2 }}>Review queue</h1>
            <p className="muted small" style={{ margin: 0 }}>
              Pending submissions, oldest first. Nothing goes live without an approval here.
            </p>
          </div>
        </div>

        <ReviewQueue items={items} />
      </div>
    </main>
  );
}
