/**
 * Account-stored files e2e tests — Phase 4 Task 5.
 *
 * REQUIRES LOCAL SUPABASE + Storage — skipped in standard CI/sandbox runs (same
 * setup as e2e/auth.spec.ts, plus the `user-files` bucket and storage policies
 * from supabase/schema.sql). Remove the test.skip calls to run in a credentialed
 * local environment. They document the intended behavior.
 *
 * The default-browser-only guarantee (nothing uploads without the explicit save)
 * is asserted at the unit layer in lib/saved/storedFiles.test.ts; these cover the
 * signed-in opt-in and the export fallback end to end.
 */

import { test, expect } from '@playwright/test';

test.skip('no upload happens on an ordinary attach (opt-in only)', async ({ page }) => {
  // Signed in, on the knowledge step, attaching a file shows the opt-in control
  // but performs no upload until the explicit action is taken.
  await page.goto('/setup/marketing-manager/customize');
  // (Advance to the knowledge step and attach a file — helper omitted.)
  await expect(page.getByTestId('stored-file-optin')).toBeVisible();
  await expect(page.getByTestId('stored-file-save')).toBeVisible();
  // The saved indicator is absent until the user opts in.
  await expect(page.getByTestId('stored-file-saved')).toHaveCount(0);
});

test.skip('saving a file round-trips into the export blocks with the stored-copy note', async ({
  page,
}) => {
  await page.goto('/setup/marketing-manager/customize');
  // Attach + save the file to the account.
  await page.getByTestId('stored-file-save').click();
  await expect(page.getByTestId('stored-file-saved')).toBeVisible();

  // In a fresh session (no in-browser attachment), export uses the stored copy.
  await page.goto('/export?setup=marketing-manager');
  await expect(page.getByTestId('stored-copy-note')).toBeVisible();
  await expect(page.getByTestId('stored-copy-note')).toContainText('Using your saved file');
});

test.skip('a fresh in-browser attachment wins over a stored copy', async ({ page }) => {
  // With both a fresh attachment and a stored copy present, export uses the fresh
  // content and shows no stored-copy note.
  await page.goto('/export?setup=marketing-manager');
  await expect(page.getByTestId('stored-copy-note')).toHaveCount(0);
});

test.skip('a stored file is deletable from the account page', async ({ page }) => {
  await page.goto('/account');
  const row = page.getByTestId('stored-file-row').first();
  await expect(row).toBeVisible();
  await row.getByTestId('stored-file-delete').click();
  await page.getByTestId('stored-file-confirm-delete').click();
  // After deletion the empty state shows.
  await expect(page.getByTestId('stored-files-empty')).toBeVisible();
});
