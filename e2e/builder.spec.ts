/**
 * Community builder e2e tests — Phase 5 Task 7.
 *
 * REQUIRES LOCAL SUPABASE — these tests are skipped in standard CI/sandbox
 * runs. To run them locally:
 *
 *   1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
 *   2. Start local Supabase: `supabase start`
 *   3. Confirm NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
 *      your .env.local match the values printed by `supabase status`.
 *   4. Sign in with a test user account (see auth.spec.ts for the OTP flow).
 *   5. Run: `npm run e2e -- e2e/builder.spec.ts`
 *
 * These tests document the intended signed-in builder flow. They do not run
 * without a live Supabase instance and an authenticated session.
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// All tests are skipped unless a local Supabase instance is running.
// Remove test.skip to run in a credentialed local environment.
// ---------------------------------------------------------------------------

test.skip('signed-out /build shows the inline AuthPrompt, not the builder', async ({
  page,
}) => {
  await page.goto('/build');

  await expect(page.getByTestId('auth-prompt')).toBeVisible();
  await expect(page.getByTestId('auth-prompt-email')).toBeVisible();
  await expect(page.getByTestId('auth-prompt-send')).toBeVisible();

  // The "Start a new setup" button must NOT be visible — it is sign-in gated.
  await expect(page.getByTestId('start-new-setup')).toHaveCount(0);
});

test.skip('a signed-in user can create a new draft and lands on /build/<id>', async ({
  page,
}) => {
  // Assumes a signed-in session is already established via auth.spec flow.
  await page.goto('/build');

  // The signed-in landing shows the "Start a new setup" action.
  await expect(page.getByTestId('start-new-setup')).toBeVisible();
  await page.getByTestId('start-new-setup').click();

  // The builder wizard opens at /build/<uuid>.
  await expect(page).toHaveURL(/\/build\/[0-9a-f-]{36}/);

  // Step 1 (Details) is active by default — the metadata editor is visible.
  await expect(page.getByTestId('metadata-editor')).toBeVisible();
});

test.skip('the builder wizard advances through all 4 steps', async ({ page }) => {
  // Assumes a draft already exists; navigate to it.
  await page.goto('/build');
  await page.getByTestId('start-new-setup').click();
  await expect(page).toHaveURL(/\/build\/[0-9a-f-]{36}/);

  // Step 0 — Details: fill required metadata fields before continuing.
  await page.getByTestId('field-name').fill('Test Setup');
  await page.getByTestId('field-tagline').fill('A one-line tagline for this test setup.');
  await page.getByTestId('field-description').fill('A description of the test setup for review.');
  // Select a role and category (use keyboard to choose the first option).
  await page.getByTestId('field-role').selectOption({ index: 1 });
  await page.getByTestId('field-category').selectOption({ index: 1 });

  await page.getByTestId('builder-continue').click();

  // Step 1 — Template & variables.
  await expect(page.getByTestId('template-editor')).toBeVisible();
  await page.getByTestId('field-template').fill('You are a helpful assistant.');
  await page.getByTestId('builder-continue').click();

  // Step 2 — Knowledge & scenarios.
  await expect(page.getByTestId('knowledge-editor')).toBeVisible();
  await page.getByTestId('builder-continue').click();

  // Step 3 — Preview & submit.
  await expect(page.getByTestId('builder-preview')).toBeVisible();
  await expect(page.getByTestId('builder-submit')).toBeVisible();
});

test.skip('metadata fields survive a page reload (autosave persists to DB)', async ({
  page,
}) => {
  // Create a draft and fill in metadata.
  await page.goto('/build');
  await page.getByTestId('start-new-setup').click();
  const draftUrl = page.url();

  await page.getByTestId('field-name').fill('Persistent Setup');
  await page.getByTestId('field-tagline').fill('Persisted after reload.');

  // Wait for the autosave indicator to confirm the save completed.
  // The save indicator shows "Saved" briefly after 1.5 s of inactivity.
  await expect(page.getByText('Saved')).toBeVisible({ timeout: 5000 });

  // Reload the page — the data must come from the DB, not sessionStorage.
  await page.goto(draftUrl);

  // Fields are restored from the saved draft row.
  await expect(page.getByTestId('field-name')).toHaveValue('Persistent Setup');
  await expect(page.getByTestId('field-tagline')).toHaveValue('Persisted after reload.');
});
