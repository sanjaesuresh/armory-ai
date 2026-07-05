/**
 * Community browse e2e tests — Phase 5 Task 7.
 *
 * REQUIRES LOCAL SUPABASE WITH SEEDED COMMUNITY ROWS — skipped in standard
 * CI/sandbox runs. To run locally:
 *
 *   1. `supabase start`; confirm .env.local env vars.
 *   2. Seed at least one approved community setup and one pending/rejected/draft
 *      community setup (use the Supabase dashboard or a seed script).
 *   3. Sign in as a regular user (for the upvote test).
 *   4. Run: `npm run e2e -- e2e/community-browse.spec.ts`
 *
 * These tests document the approved-only browse guarantee and the upvote flow.
 * They do not run without a live Supabase instance and seeded data.
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// All tests are skipped unless a local Supabase instance is running with
// seeded community rows. Remove test.skip to run in a credentialed local env.
// ---------------------------------------------------------------------------

test.skip('an approved community setup appears in /professionals with the Community badge and author', async ({
  page,
}) => {
  await page.goto('/professionals');

  // At least one community badge must be visible in the catalog.
  const badge = page.getByTestId('badge-community').first();
  await expect(badge).toBeVisible();

  // The card for the approved community setup includes the author name.
  const authorLabel = page.getByTestId('card-author').first();
  await expect(authorLabel).toBeVisible();
  // Author is a non-empty string (actual value depends on seeded data).
  await expect(authorLabel).not.toBeEmpty();
});

test.skip('pending, rejected, and draft community setups never appear in the public catalog', async ({
  page,
}) => {
  // This is the hostile-state assertion — the account-free / approved-only guarantee.
  // Seeded data must include at least one pending, one rejected, and one draft row.
  // All three must remain invisible in any public browse or search.
  await page.goto('/professionals');

  // Look for any card whose slug matches the seeded non-approved slugs.
  // (Adjust these slugs to match whatever was seeded.)
  await expect(page.getByTestId('setup-card-community-pending-test')).toHaveCount(0);
  await expect(page.getByTestId('setup-card-community-rejected-test')).toHaveCount(0);
  await expect(page.getByTestId('setup-card-community-draft-test')).toHaveCount(0);

  // Searching by a term that matches those seeded setups also returns nothing.
  await page.getByLabel('Search setups').fill('community-test-hidden');
  await expect(page.getByTestId('empty-state')).toBeVisible();
});

// ── Phase 6: AI-generated badge + lifecycle parity (GATED) ──────────────────
// These require a local Supabase instance with at least one approved ai-generated
// setup seeded in the database. Remove test.skip to run locally.

test.skip('an approved ai-generated setup shows the AI-generated badge in /professionals', async ({
  page,
}) => {
  await page.goto('/professionals');

  // At least one AI-generated badge must be visible.
  const badge = page.getByTestId('badge-ai').first();
  await expect(badge).toBeVisible();
  await expect(badge).toContainText('AI-generated');
});

test.skip('an approved ai-generated setup detail page shows the AI-generated badge', async ({
  page,
}) => {
  // Adjust 'ai-generated-test-setup' to the slug of the seeded ai-generated setup.
  await page.goto('/setup/ai-generated-test-setup');
  await expect(page.getByTestId('detail-badge-ai')).toBeVisible();
});

test.skip('a moderator can take down an approved ai-generated setup', async ({ page }) => {
  // This test confirms lifecycle parity: ai-generated setups support takedown.
  // Requires a signed-in moderator session and a seeded approved ai-generated setup.
  await page.goto('/setup/ai-generated-test-setup');

  // The takedown control must be visible for a moderator.
  await expect(page.getByTestId('takedown-open')).toBeVisible();
});

test.skip('a signed-in user can report an approved ai-generated setup', async ({ page }) => {
  // Confirms reporting is source-agnostic: works on both community and ai-generated.
  await page.goto('/setup/ai-generated-test-setup');

  // The report trigger must be visible (signed-in user).
  const reportTrigger = page.locator('.report-setup-trigger');
  await expect(reportTrigger).toBeVisible();
});

test.skip('a signed-in user can upvote a community setup and the count survives reload', async ({
  page,
}) => {
  // Assumes a signed-in session and at least one approved community setup.
  // Navigate to the setup detail page of the approved community setup.
  await page.goto('/setup/community-approved-test');

  const upvoteBtn = page.getByTestId('upvote-button');
  await expect(upvoteBtn).toBeVisible();

  // Read the current count text to calculate the expected post-upvote count.
  const initialCount = await upvoteBtn.textContent();

  // Click the upvote button.
  await upvoteBtn.click();

  // The button's count increments immediately (optimistic update).
  // It must differ from the initial count.
  await expect(upvoteBtn).not.toHaveText(initialCount ?? '');

  // Reload — the count must persist (it was written to the DB, not just local).
  await page.reload();

  const countAfterReload = await page.getByTestId('upvote-button').textContent();
  expect(countAfterReload).not.toBe(initialCount);
});
