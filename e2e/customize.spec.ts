import { test, expect } from '@playwright/test';

test.describe('customize page — wizard', () => {
  test('loads the wizard with step rail, form card, and live preview', async ({ page }) => {
    await page.goto('/setup/marketing-manager/customize');

    // Page-level h1 is "Make it yours"
    await expect(page.locator('h1')).toContainText('Make it yours');

    // Step rail is present and shows the correct steps
    const rail = page.getByRole('navigation', { name: 'Customization steps' });
    await expect(rail).toBeVisible();
    await expect(rail).toContainText('About your brand');
    await expect(rail).toContainText('Your channels');
    await expect(rail).toContainText('Tone & style');
    await expect(rail).toContainText('Knowledge files');
    await expect(rail).toContainText('Review');

    // Step 1 (About your brand) is the active step
    const step1Btn = page.getByRole('button', { name: /About your brand/i });
    await expect(step1Btn).toHaveAttribute('aria-current', 'step');

    // Form is visible (SetupForm renders a <form>)
    await expect(page.locator('form')).toBeVisible();

    // Back-link goes to setup detail
    const backLink = page.getByTestId('customize-back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/setup/marketing-manager');

    // Live preview panel is visible
    await expect(page.locator('[data-testid="customize-right"]')).toBeVisible();
  });

  test('back-link returns to the setup detail page', async ({ page }) => {
    await page.goto('/setup/marketing-manager/customize');
    const backLink = page.getByTestId('customize-back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/setup/marketing-manager');
  });

  test('Continue is blocked with an inline error when required field is empty', async ({ page }) => {
    await page.goto('/setup/marketing-manager/customize');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    // Do not fill brand name
    await page.getByRole('button', { name: 'Continue' }).click();

    // Should still be on step 1 — brand name field is still visible
    await expect(page.getByLabel('Brand name', { exact: false })).toBeVisible();

    // An inline validation error should appear
    const alerts = page.getByRole('alert');
    await expect(alerts.first()).toBeVisible();
  });

  test('filling the brand name and advancing through steps enables the export CTA', async ({ page }) => {
    await page.goto('/setup/marketing-manager/customize');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    // Step 1: fill brand name, continue
    await page.getByLabel('Brand name', { exact: false }).fill('Acme Corp');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 2 (Your channels) — channels have a default; continue
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 3 (Tone & style) — tone has a default; continue
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 4 (Knowledge files) — no required user-provided files; continue
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 5 (Review) — export CTA should be enabled
    const exportBtn = page.getByRole('button', { name: 'Export to Claude' });
    await expect(exportBtn).toBeEnabled();
  });

  test('editing a field on step 1 updates the live preview', async ({ page }) => {
    await page.goto('/setup/marketing-manager/customize');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    // Fill brand name to trigger a successful compile
    await page.getByLabel('Brand name', { exact: false }).fill('BlueSky Brands');

    // Live preview panel should update to show the brand name
    await expect(page.locator('[data-testid="customize-right"]')).toContainText('BlueSky Brands');
  });

  test('the export CTA on the review step is disabled until required fields filled', async ({ page }) => {
    await page.goto('/setup/marketing-manager/customize');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    // Navigate directly to review step via the rail (without filling brand name)
    await page.getByRole('button', { name: /Review/i }).click();

    // Export CTA should be disabled
    const exportBtn = page.getByRole('button', { name: 'Export to Claude' });
    await expect(exportBtn).toBeDisabled();

    // A plain-language reason should appear
    await expect(page.getByTestId('cta-reason')).toBeVisible();
    await expect(page.getByTestId('cta-reason')).not.toBeEmpty();
  });
});
