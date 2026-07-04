/**
 * Community submission flow e2e tests — Phase 5 Task 7.
 *
 * REQUIRES LOCAL SUPABASE — skipped in standard CI/sandbox runs. Same setup as
 * e2e/auth.spec.ts and e2e/builder.spec.ts: `supabase start`, matching
 * .env.local, an authenticated session in place.
 *
 * These tests document the submit → review-state lifecycle as seen by the
 * author. They do not run without a live Supabase instance.
 *
 * To run: `npm run e2e -- e2e/submission.spec.ts`
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// All tests are skipped unless a local Supabase instance is running.
// Remove test.skip to run in a credentialed local environment.
// ---------------------------------------------------------------------------

test.skip('submitting a validator-clean draft lands on /my/submissions with the pending row', async ({
  page,
}) => {
  // Assumes a signed-in session and a fully-filled draft at /build/<id>.
  // (The builder.spec flow creates and fills this draft.)
  await page.goto('/build');
  await page.getByTestId('start-new-setup').click();

  // Fill the minimum required fields and advance to the submit step.
  await page.getByTestId('field-name').fill('Submit Test Setup');
  await page.getByTestId('field-tagline').fill('A tagline for submission testing.');
  await page.getByTestId('field-description').fill('Testing the submit flow end to end.');
  await page.getByTestId('field-role').selectOption({ index: 1 });
  await page.getByTestId('field-category').selectOption({ index: 1 });
  await page.getByTestId('builder-continue').click();

  await page.getByTestId('field-template').fill('You are a helpful assistant for {{topic}}.');
  await page.getByTestId('builder-continue').click();
  await page.getByTestId('builder-continue').click();

  // Submit from the final preview step.
  await expect(page.getByTestId('builder-submit')).toBeVisible();
  await page.getByTestId('builder-submit').click();

  // On success the app navigates to /my/submissions?submitted=1.
  await expect(page).toHaveURL(/\/my\/submissions\?submitted=1/);

  // The "we review every setup" banner confirms the submission.
  await expect(
    page.getByText('we review every setup before it goes live'),
  ).toBeVisible();

  // The submitted setup appears as a pending row.
  await expect(page.getByText('Pending review')).toBeVisible();
  await expect(page.getByText('Submit Test Setup')).toBeVisible();
});

test.skip('a pending submission cannot be edited — only "Withdraw to edit" changes its state', async ({
  page,
}) => {
  // Assumes a pending row exists from the previous test.
  await page.goto('/my/submissions');

  // The pending row shows the withdraw action, not an edit link.
  await expect(page.getByTestId('submission-withdraw')).toBeVisible();

  // The "Continue building" link that draft rows show must NOT be present for
  // a pending row — editing is blocked until withdrawn.
  await expect(page.getByRole('link', { name: 'Continue building' })).toHaveCount(0);

  // Withdrawing moves the row back to draft so the author can edit.
  await page.getByTestId('submission-withdraw').click();

  // The status chip changes to Draft and the "Continue building" link appears.
  await expect(page.getByText('Draft')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continue building' })).toBeVisible();
});

test.skip('a rejected row shows the moderator note verbatim and offers "Edit & resubmit"', async ({
  page,
}) => {
  // Assumes a moderator has rejected a submission with a note. The rejection
  // and note are applied via the moderation.spec flow or seeded directly.
  await page.goto('/my/submissions');

  // A rejected row displays the "Rejected" status chip.
  await expect(page.getByText('Rejected')).toBeVisible();

  // The moderator's note is shown verbatim — exactly as the moderator typed it.
  // (The note text here matches what moderation.spec seeds.)
  await expect(page.getByText('Contains off-topic instructions.')).toBeVisible();

  // The "Edit & resubmit" (reopen) action is offered.
  await expect(page.getByTestId('submission-reopen')).toBeVisible();
});
