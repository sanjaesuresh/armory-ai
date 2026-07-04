/**
 * My setups (Phase 4 Task 3).
 *
 * Signed-out: inline AuthPrompt (accounts unlock saving) — never a login wall.
 * Signed-in: the user's saved setups, each reconciled against the current setup
 * version server-side, or the "Nothing saved yet" empty state.
 *
 * Reads are owner-scoped by RLS via the request-scoped server client.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getSessionUser, createSupabaseServerClient } from '@/lib/supabase/server';
import { createCatalogRepository } from '@/lib/catalog/repository';
import {
  createSupabaseSavedSetupsStore,
  reconcileAnswers,
} from '@/lib/saved/savedSetups';
import { isAnswerEmpty } from '@/lib/setup/answers';
import AuthPrompt from '@/components/AuthPrompt';
import SavedSetupsList, { type SavedRowVM } from '@/components/SavedSetupsList';

export const metadata: Metadata = {
  title: 'My setups · Armory',
};

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'recently';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function MySetupsPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <main className="section-tight">
        <div className="wrap" style={{ maxWidth: 500 }}>
          <h1>My setups</h1>
          <div className="form-card" style={{ marginTop: 24 }}>
            <AuthPrompt
              message="Sign in to save customized setups and pick them up on any device."
              redirectTo="/my/setups"
            />
          </div>
        </div>
      </main>
    );
  }

  // Load the user's saved rows (RLS-scoped) and the current catalog to reconcile.
  let rows: SavedRowVM[];
  try {
    const store = createSupabaseSavedSetupsStore(await createSupabaseServerClient());
    const [saved, setups] = await Promise.all([
      store.list(),
      createCatalogRepository().getSetups(),
    ]);
    const byId = new Map(setups.map((s) => [s.id, s]));

    rows = saved.map((row): SavedRowVM => {
      const current = byId.get(row.setupId) ?? null;
      if (!current) {
        return {
          id: row.id,
          name: row.name,
          setupName: null,
          slug: null,
          available: false,
          complete: false,
          versionChanged: false,
          droppedKeys: [],
          savedVersion: row.setupVersion,
          currentVersion: null,
          reconciledAnswers: row.answers,
          updatedLabel: formatUpdated(row.updatedAt),
          tags: [],
        };
      }
      const { answers, droppedKeys } = reconcileAnswers(
        row.answers,
        current.variables.map((v) => v.key),
      );
      const complete = current.variables
        .filter((v) => v.required)
        .every((v) => !isAnswerEmpty(answers[v.key]));
      return {
        id: row.id,
        name: row.name,
        setupName: current.name,
        slug: current.slug,
        available: true,
        complete,
        versionChanged: row.setupVersion !== current.version,
        droppedKeys,
        savedVersion: row.setupVersion,
        currentVersion: current.version,
        reconciledAnswers: answers,
        updatedLabel: formatUpdated(row.updatedAt),
        tags: current.tags,
      };
    });
  } catch (err) {
    console.error('[my/setups] failed to load saved setups:', err);
    return (
      <main className="section-tight">
        <div className="wrap">
          <div className="error-banner" role="alert" style={{ maxWidth: 540 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4 2.8 19.5h18.4z" />
              <path d="M12 10v4.5M12 17.2v.1" />
            </svg>
            <div>
              <strong>We couldn&apos;t load your saved setups</strong>
              <p>Please try again in a moment.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (rows.length === 0) {
    return (
      <main className="section-tight">
        <div className="wrap">
          <div className="lib-head">
            <h1 style={{ fontSize: '1.7rem', margin: 0 }}>My setups</h1>
            <Link className="btn btn-primary btn-sm" href="/catalog">
              Browse setups
            </Link>
          </div>
          <div className="empty" data-testid="my-setups-empty">
            <svg
              width="80" height="64" viewBox="0 0 80 64"
              fill="none" stroke="#4f483c" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <ellipse cx="40" cy="56" rx="26" ry="4" fill="#f3ede2" stroke="none" />
              <rect x="12" y="10" width="56" height="38" rx="8" fill="#fff" />
              <path d="M24 24h32M24 32h20" />
            </svg>
            <h3>Nothing saved yet</h3>
            <p>
              Customize a setup and save it — it will appear here so you can
              pick up or adjust it later.
            </p>
            <Link className="btn btn-primary btn-sm" href="/catalog">
              Browse setups
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section-tight">
      <div className="wrap">
        <div className="lib-head">
          <h1 style={{ fontSize: '1.7rem', margin: 0 }}>My setups</h1>
          <Link className="btn btn-primary btn-sm" href="/catalog">
            Browse setups
          </Link>
        </div>
        <SavedSetupsList rows={rows} />
      </div>
    </main>
  );
}
