import { test, expect, type BrowserContext } from '@playwright/test';

// Helper: fresh browser context per test to isolate sessionStorage
async function freshContext(ctx: BrowserContext) {
  await ctx.clearCookies();
  // sessionStorage is per-page, cleared when we open a new page
}

test.describe('customize page', () => {
  test('customize page loads the setup and shows form + preview side by side', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    // Page heading
    await expect(page.locator('h1')).toContainText('Marketing Manager');

    // Form is visible (SetupForm renders a <form>)
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // PreviewPanel in incomplete state shows the placeholder text
    await expect(page.getByText('Fill in the required fields to see your preview.')).toBeVisible();

    // Two columns exist (form area left, preview area right)
    await expect(page.locator('[data-testid="customize-left"]')).toBeVisible();
    await expect(page.locator('[data-testid="customize-right"]')).toBeVisible();
  });

  test('the export action is disabled until required fields are filled, with a visible reason', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    const btn = page.getByRole('button', { name: 'Get export instructions' });
    await expect(btn).toBeDisabled();

    // A visible plain-language reason appears
    await expect(page.getByTestId('cta-reason')).toBeVisible();
    await expect(page.getByTestId('cta-reason')).not.toBeEmpty();
  });

  test('filling required fields enables the export action', async ({ page }) => {
    // Navigate first so sessionStorage is accessible, then clear to avoid bleed
    await page.goto('/setup/marketing-manager');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    // brandName is the only required field without a default
    await page.getByLabel('Brand name', { exact: false }).fill('Acme Corp');

    const btn = page.getByRole('button', { name: 'Get export instructions' });
    await expect(btn).toBeEnabled();
  });

  test('editing a field updates the live summary', async ({ page }) => {
    await page.goto('/setup/marketing-manager');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    // Fill required brand name so the preview compiles
    await page.getByLabel('Brand name', { exact: false }).fill('BlueSky Brands');

    // The preview summary should contain the brand name
    await expect(page.locator('[data-testid="customize-right"]')).toContainText('BlueSky Brands');
  });
});
