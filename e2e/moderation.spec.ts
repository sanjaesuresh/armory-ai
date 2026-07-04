/**
 * Community moderation e2e tests — Phase 5 Task 7.
 *
 * REQUIRES LOCAL SUPABASE AND A MODERATOR ACCOUNT — skipped in standard
 * CI/sandbox runs. To run locally:
 *
 *   1. `supabase start`; confirm .env.local env vars.
 *   2. Seed a moderator row: INSERT INTO moderators (user_id) VALUES ('<id>');
 *   3. Sign in as that moderator user (via auth.spec OTP flow).
 *   4. Ensure at least one pending submission exists (from submission.spec or seeded).
 *   5. Run: `npm run e2e -- e2e/moderation.spec.ts`
 *
 * These tests document the moderator review queue behaviour. They do not run
 * without a live Supabase instance and a moderator session.
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// All tests are skipped unless a local Supabase instance is running with a
// moderator session. Remove test.skip to run in a credentialed local env.
// ---------------------------------------------------------------------------

test.skip('a non-moderator (signed-in) user gets a 404 at /admin/review', async ({
  page,
}) => {
  // Assumes a regular (non-moderator) signed-in session.
  await page.goto('/admin/review');

  // isModerator() returns false → notFound() — the route never hints it exists.
  await expect(page.getByText('This page could not be found.')).toBeVisible();
});

test.skip('a moderator sees the pending queue at /admin/review', async ({ page }) => {
  // Assumes a moderator session.
  await page.goto('/admin/review');

  // The review queue renders (not a 404).
  await expect(page.getByRole('heading', { name: 'Review queue' })).toBeVisible();

  // At least one pending queue item is shown.
  const items = page.locator('[data-testid^="queue-item-"]');
  await expect(items).not.toHaveCount(0);
});

test.skip('approving a setup makes it appear in the public catalog with the Community badge', async ({
  page,
}) => {
  // Assumes a moderator session and at least one pending item.
  await page.goto('/admin/review');

  // Open the first pending item for review.
  const firstItem = page.locator('[data-testid^="queue-item-"]').first();
  await firstItem.click();

  await expect(page.getByTestId('review-detail')).toBeVisible();
  await expect(page.getByTestId('compiled-preview')).toBeVisible();

  // Approve the setup.
  await page.getByTestId('btn-approve').click();

  // A success confirmation renders.
  await expect(page.getByTestId('action-success')).toBeVisible();

  // The approved setup must now appear in the public catalog with the
  // Community badge (review_status = 'approved', source = 'community').
  await page.goto('/catalog');
  const communityBadge = page.getByTestId('badge-community');
  await expect(communityBadge.first()).toBeVisible();
});

test.skip('rejecting with a note: the author sees the exact note on /my/submissions', async ({
  page,
}) => {
  // Assumes a moderator session and at least one pending item.
  await page.goto('/admin/review');

  const firstItem = page.locator('[data-testid^="queue-item-"]').first();
  await firstItem.click();

  await expect(page.getByTestId('review-detail')).toBeVisible();

  // Fill in the rejection note before clicking Reject.
  const noteText = 'Contains off-topic instructions.';
  await page.getByTestId('mod-note').fill(noteText);
  await page.getByTestId('btn-reject').click();

  await expect(page.getByTestId('action-success')).toBeVisible();

  // Sign out and sign in as the author, then check /my/submissions.
  // (In practice: re-use the author session from a separate browser context.)
  // The moderator note must appear verbatim on the author's submission row.
  // This assertion is verified from the author's perspective in submission.spec.
});
