import { test, expect } from '@playwright/test';

test('landing hero H1 contains the expected copy', async ({ page }) => {
  await page.goto('/');

  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
  await expect(heading).toContainText('AI setups that just');
});

test('"Find my setup" primary hero CTA navigates to /start', async ({ page }) => {
  await page.goto('/');

  // Scope to main so we do not accidentally match a nav link with the same text
  const mainContent = page.locator('main');
  // The hero CTA appears first; .first() is explicit even though both resolve to /start
  const findSetup = mainContent.getByRole('link', { name: 'Find my setup' }).first();
  await expect(findSetup).toBeVisible();
  await findSetup.click();
  await expect(page).toHaveURL('/start');
});

test('"Browse all setups" hero CTA navigates to /professionals', async ({ page }) => {
  await page.goto('/');

  const mainContent = page.locator('main');
  const browseLink = mainContent.getByRole('link', { name: 'Browse all setups' });
  await expect(browseLink).toBeVisible();
  await browseLink.click();
  await expect(page).toHaveURL('/professionals');
});

test('role grid renders exactly 7 role links inside the #roles section', async ({ page }) => {
  await page.goto('/');

  const rolesSection = page.locator('#roles');
  await expect(rolesSection).toBeVisible();

  // Each of the 7 ROLES links to /professionals?role=<id>
  const roleLinks = rolesSection.locator('a[href*="/professionals?role="]');
  await expect(roleLinks).toHaveCount(7);
});

test('#how and #roles anchor sections exist on the page', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#how')).toBeVisible();
  await expect(page.locator('#roles')).toBeVisible();
});
