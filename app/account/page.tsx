/**
 * Account page — sign in / manage account.
 *
 * Signed-out: explains what an account unlocks (save setups, test-drive
 * history), then renders AuthPrompt for passwordless email sign-in.
 * Handles the ?error=auth recoverable state from the callback route.
 *
 * Signed-in: shows the user's email, links to /my/setups and
 * /my/test-drives, and a Sign out button.
 *
 * Account-free guarantee: this page never gates browse/customize/export/
 * test-drive — those paths are unchanged for anonymous users.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getSessionUser, createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseStoredFilesStore } from '@/lib/saved/storedFiles';
import AuthPrompt from '@/components/AuthPrompt';
import SignOutButton from '@/components/SignOutButton';
import StoredFilesManager, { type StoredFileVM } from '@/components/StoredFilesManager';

function formatBytes(bytes: number | null): string {
  if (!bytes || bytes <= 0) return ', ';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'recently';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function loadStoredFiles(): Promise<StoredFileVM[]> {
  try {
    const store = createSupabaseStoredFilesStore(await createSupabaseServerClient());
    const files = await store.list();
    return files.map((f) => ({
      id: f.id,
      knowledgeFileName: f.knowledgeFileName,
      storagePath: f.storagePath,
      sizeLabel: formatBytes(f.sizeBytes),
      updatedLabel: formatDate(f.updatedAt),
    }));
  } catch (err) {
    console.error('[account] failed to load stored files:', err);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Account · Armory',
  description: 'Sign in to save your AI setups and track your test-drive history.',
};

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function AccountPage({ searchParams }: Props) {
  const [user, params] = await Promise.all([getSessionUser(), searchParams]);
  const hasAuthError = params.error === 'auth';

  /* ---- Signed-in state ------------------------------------ */
  if (user) {
    const storedFiles = await loadStoredFiles();
    return (
      <main className="account-page">
        <div className="wrap">
          <div className="account-info-card">
            <div>
              <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Your account</h1>
              <div className="account-info-email" data-testid="account-email">
                {user.email}
              </div>
            </div>

            <nav className="account-links" aria-label="Account">
              <Link href="/my/setups" className="account-link" data-testid="link-my-setups">
                My setups
                <svg
                  width="16" height="16" viewBox="0 0 16 16"
                  fill="none" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
              <Link href="/my/test-drives" className="account-link" data-testid="link-test-drives">
                Test-drive history
                <svg
                  width="16" height="16" viewBox="0 0 16 16"
                  fill="none" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
            </nav>

            <div>
              <SignOutButton />
            </div>
          </div>

          <section className="account-info-card" style={{ marginTop: 20 }} aria-labelledby="saved-files-heading">
            <h2 id="saved-files-heading" style={{ fontSize: '1.1rem', margin: 0 }}>
              Your saved files
            </h2>
            <p className="muted small" style={{ margin: '4px 0 12px' }}>
              Knowledge files you chose to store on your account. They&apos;re used at
              export when you haven&apos;t re-attached a fresh copy. Only you can access them.
            </p>
            <StoredFilesManager files={storedFiles} />
          </section>
        </div>
      </main>
    );
  }

  /* ---- Signed-out state ----------------------------------- */
  return (
    <main className="account-page">
      <div className="wrap">
        <div className="account-sign-in-card">

          {/* Recoverable auth error from the callback (e.g. expired link) */}
          {hasAuthError && (
            <div
              className="error-banner"
              role="alert"
              data-testid="auth-error-banner"
              style={{ marginBottom: 24 }}
            >
              <svg
                width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <div>
                <strong>That sign-in link didn&apos;t work.</strong>
                <p>
                  It may have expired or already been used. Enter your email below
                  to get a fresh one.
                </p>
              </div>
            </div>
          )}

          <h1>Save your AI setups</h1>
          <p className="account-lede">
            Sign in to save customized setups, track your test-drive history, and
            pick up where you left off on any device. No password needed, we send
            a one-tap link to your email.
          </p>

          <div className="form-card" style={{ padding: '28px' }}>
            <AuthPrompt
              message="Enter your email to get a sign-in link. Works on any device."
              redirectTo="/account"
            />
          </div>

          <p className="small muted" style={{ marginTop: 20, textAlign: 'center' }}>
            Browsing, customizing, and exporting setups never require an account.
          </p>
        </div>
      </div>
    </main>
  );
}
