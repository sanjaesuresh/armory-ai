/**
 * E2E for the ChatGPT export target's picker in the real flow.
 *
 * The only curated setup (marketing-manager) targets claude-app only, so the
 * real-flow assertion here is that a single-target setup never shows the target
 * picker. The multi-target flow (choosing ChatGPT → ChatGPT walkthrough) is
 * verified deterministically by the component tests
 * (components/ExportView.test.tsx, components/InstallView.test.tsx), because a
 * full real-flow test needs a multi-target setup seeded into Supabase, which
 * this environment cannot provision. When such a setup exists, extend this file
 * to click the ChatGPT target and assert the ChatGPT walkthrough.
 */

import { test, expect } from '@playwright/test';

test('a setup targeting only the Claude app never shows the target picker', async ({ page }) => {
  await page.goto('/setup/marketing-manager/customize');
  await expect(page.locator('h1')).toContainText('Make it yours');

  // Fill the one required field with no default, then advance to the review step.
  await page.getByLabel('Brand name', { exact: false }).fill('Acme');
  const continueBtn = page.getByRole('button', { name: 'Continue' });
  for (let i = 0; i < 4; i++) {
    if (await continueBtn.isVisible().catch(() => false)) {
      await continueBtn.click();
    }
  }

  const exportBtn = page.getByRole('button', { name: 'Export to Claude' });
  await expect(exportBtn).toBeEnabled();
  await exportBtn.click();
  await page.waitForURL(/\/export\?setup=marketing-manager/);

  // Single-target setup: no picker; the ChatGPT "coming soon" card is shown instead.
  await expect(page.getByRole('heading', { name: /Export to Claude/i })).toBeVisible();
  await expect(page.getByTestId('target-picker')).toHaveCount(0);
  await expect(page.getByTestId('target-chatgpt')).toHaveCount(0);
});
