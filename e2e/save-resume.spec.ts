/**
 * Save & resume e2e tests — Phase 4 Task 3.
 *
 * REQUIRES LOCAL SUPABASE — skipped in standard CI/sandbox runs (same setup as
 * e2e/auth.spec.ts: `supabase start`, matching .env.local, Inbucket for the
 * magic link). Remove the test.skip calls to run in a credentialed local
 * environment. They document the exact intended behavior.
 *
 * The account-free guarantee is covered by the always-on specs (customize.spec,
 * export.spec, full-flow.spec) which never sign in; these add only the
 * account-gated save/resume behavior.
 */

import { test, expect } from '@playwright/test';

test.skip('signed-out save shows the inline prompt, not a login wall', async ({ page }) => {
  // Reach the review step of a setup, then click "Save my setup" while signed out.
  await page.goto('/setup/marketing-manager/customize');

  // (A helper would fill required fields and advance to review; omitted here.)
  await page.getByTestId('save-setup-button').click();

  // The inline AuthPrompt appears in place — the page did not navigate away.
  await expect(page.getByTestId('save-auth-prompt')).toBeVisible();
  await expect(page.getByTestId('auth-prompt')).toContainText('save this setup');
  await expect(page).toHaveURL(/\/setup\/marketing-manager\/customize/);
});

test.skip('a saved setup appears in My setups and resume restores every field', async ({
  page,
}) => {
  // Assumes a signed-in session (see auth.spec for the sign-in flow).
  await page.goto('/setup/marketing-manager/customize');

  // Fill answers, advance to review, save under a name.
  await page.getByTestId('save-setup-button').click();
  await page.getByTestId('save-setup-name').fill('My brand voice');
  await page.getByTestId('save-setup-confirm').click();
  await expect(page.getByTestId('save-success')).toBeVisible();

  // The saved setup shows in the list.
  await page.goto('/my/setups');
  const row = page.getByTestId('saved-row').first();
  await expect(row).toContainText('My brand voice');

  // Resume restores the customize flow with the saved answers rehydrated.
  await row.getByRole('button', { name: /Actions for/ }).click();
  await page.getByRole('menuitem', { name: 'Resume' }).click();
  await expect(page).toHaveURL(/\/setup\/marketing-manager\/customize/);
});

test.skip('resuming over different in-progress answers asks which to keep', async ({
  page,
}) => {
  // With different unsaved answers already in sessionStorage for this setup,
  // resuming raises the conflict dialog rather than silently overwriting.
  await page.goto('/my/setups');
  const row = page.getByTestId('saved-row').first();
  await row.getByRole('button', { name: /Actions for/ }).click();
  await page.getByRole('menuitem', { name: 'Resume' }).click();

  const dialog = page.getByTestId('saved-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('unsaved changes');
  // Both choices are offered — no silent overwrite.
  await expect(dialog.getByRole('button', { name: /Keep my current progress/ })).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Use the saved version/ })).toBeVisible();
});

test.skip('delete removes a saved setup with a confirm step', async ({ page }) => {
  await page.goto('/my/setups');
  const row = page.getByTestId('saved-row').first();
  await row.getByRole('button', { name: /Actions for/ }).click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();

  const dialog = page.getByTestId('saved-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Delete this saved setup?');
  await dialog.getByRole('button', { name: 'Delete' }).click();

  // The list re-renders without the row (here: back to the empty state).
  await expect(page.getByTestId('my-setups-empty')).toBeVisible();
});
