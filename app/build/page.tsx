/**
 * /build — community builder landing.
 *
 * Signed-out: explains what building unlocks and shows AuthPrompt.
 * Signed-in:  shows a "Start a new setup" button that creates a draft row
 *              and navigates to /build/<id> (handled by NewBuildStarter client
 *              component so refreshing /build never creates duplicate drafts).
 */

import type { Metadata } from 'next';
import { getSessionUser } from '@/lib/supabase/server';
import AuthPrompt from '@/components/AuthPrompt';
import NewBuildStarter from '@/components/builder/NewBuildStarter';

export const metadata: Metadata = {
  title: 'Build & post · Armory',
  description:
    'Author a reusable AI setup, or post an agent, skill, or harness to the developer registry.',
};

export default async function BuildPage() {
  const user = await getSessionUser();

  /* ── Signed-out ────────────────────────────────────────────── */
  if (!user) {
    return (
      <main className="section-tight">
        <div className="wrap">
          <div style={{ maxWidth: 500, margin: '40px auto 0' }}>
            <h1 style={{ fontSize: 'clamp(1.7rem,3.2vw,2.2rem)', marginBottom: 6 }}>
              Build something to share
            </h1>
            <p className="muted" style={{ marginBottom: 28, maxWidth: '38em' }}>
              Author a guided setup, or post an agent, skill, or harness to the
              developer registry. Every submission is reviewed before it goes live.
            </p>
            <div className="form-card" style={{ padding: 28 }}>
              <AuthPrompt
                message="Sign in to build and share a setup."
                redirectTo="/build"
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Signed-in ─────────────────────────────────────────────── */
  return (
    <main className="section-tight">
      <div className="wrap">
        <div style={{ paddingTop: 40, paddingBottom: 72 }}>
          <h1 style={{ fontSize: 'clamp(1.7rem,3.2vw,2.2rem)', marginBottom: 8 }}>
            Build something to share
          </h1>
          <p className="muted" style={{ marginBottom: 28, maxWidth: '44em' }}>
            Author a guided setup people can customize, or post an agent, skill,
            or harness to the developer registry. Every submission is reviewed by
            the Armory team before it goes live, we check each one for safety,
            not polish.
          </p>
          <NewBuildStarter />
        </div>
      </div>
    </main>
  );
}
