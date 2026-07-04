/**
 * Test-drive history (Phase 4 Task 4).
 *
 * Signed-out: inline AuthPrompt. Signed-in: the user's runs (setup, scenario,
 * output snippet, cached flag, when), newest first — or the empty state.
 * Reads are owner-scoped by RLS via the request-scoped server client.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getSessionUser, createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseTestDriveHistoryStore, type TestDriveHistoryEntry } from '@/lib/saved/testDriveHistory';
import AuthPrompt from '@/components/AuthPrompt';

export const metadata: Metadata = {
  title: 'Test-drive history · Armory',
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'recently';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function TestDriveHistoryPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <main className="section-tight">
        <div className="wrap" style={{ maxWidth: 500 }}>
          <h1>Test-drive history</h1>
          <div className="form-card" style={{ marginTop: 24 }}>
            <AuthPrompt
              message="Sign in to keep a record of every test-drive you run."
              redirectTo="/my/test-drives"
            />
          </div>
        </div>
      </main>
    );
  }

  let entries: TestDriveHistoryEntry[];
  try {
    const store = createSupabaseTestDriveHistoryStore(await createSupabaseServerClient());
    entries = await store.list();
  } catch (err) {
    console.error('[my/test-drives] failed to load history:', err);
    return (
      <main className="section-tight">
        <div className="wrap">
          <div className="error-banner" role="alert" style={{ maxWidth: 540 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4 2.8 19.5h18.4z" />
              <path d="M12 10v4.5M12 17.2v.1" />
            </svg>
            <div>
              <strong>We couldn&apos;t load your test-drive history</strong>
              <p>Please try again in a moment.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (entries.length === 0) {
    return (
      <main className="section-tight">
        <div className="wrap">
          <h1 style={{ fontSize: '1.7rem', marginBottom: 28 }}>Test-drive history</h1>
          <div className="empty" data-testid="test-drive-history-empty">
            <svg
              width="80" height="64" viewBox="0 0 80 64"
              fill="none" stroke="#4f483c" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <ellipse cx="40" cy="56" rx="26" ry="4" fill="#f3ede2" stroke="none" />
              <circle cx="40" cy="28" r="18" fill="#fff" />
              <path d="M40 20v8l5 3" />
            </svg>
            <h3>No test-drives yet</h3>
            <p>
              Run a test-drive on any setup and the results will be saved here so
              you can review and compare them later.
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
        <h1 style={{ fontSize: '1.7rem', marginBottom: 28 }}>Test-drive history</h1>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="history-table" data-testid="test-drive-history-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Setup</th>
                <th>Result</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} data-testid="history-row">
                  <td>
                    <strong style={{ display: 'block' }}>{e.scenarioTitle}</strong>
                    {e.outputSnippet && (
                      <span className="small" style={{ color: 'var(--ink-soft)' }}>
                        {e.outputSnippet}
                      </span>
                    )}
                  </td>
                  <td>{e.setupName}</td>
                  <td>
                    <span className={e.cached ? 'status status-soon' : 'status status-ready'}>
                      {e.cached ? 'Cached' : 'Live'}
                    </span>
                  </td>
                  <td className="muted" style={{ whiteSpace: 'nowrap' }}>
                    {formatWhen(e.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
