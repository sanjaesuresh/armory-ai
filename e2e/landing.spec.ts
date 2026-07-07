import { test, expect } from '@playwright/test';

// Phase 5 note: hero headline changed from "AI setups that just make sense."
// to "The arsenal for your AI." (skills-first editorial relayout).
test('landing hero H1 contains the expected copy', async ({ page }) => {
  await page.goto('/');

  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
  await expect(heading).toContainText('The arsenal for your AI');
});

test('"Find my setup" hero CTA navigates to /start', async ({ page }) => {
  await page.goto('/');

  // Scope to main so we do not accidentally match a nav link with the same text
  const mainContent = page.locator('main');
  const findSetup = mainContent.getByRole('link', { name: 'Find my setup' }).first();
  await expect(findSetup).toBeVisible();
  await findSetup.click();
  await expect(page).toHaveURL('/start');
});

// Phase 5 note: primary hero CTA is now "Browse the arsenal →" (→ /professionals).
// "Browse all setups →" remains the bottom browse-all affordance in the popular section.
test('"Browse all setups" affordance navigates to /professionals', async ({ page }) => {
  await page.goto('/');

  const mainContent = page.locator('main');
  // Substring match — finds "Browse all setups →" in the popular section footer.
  const browseLink = mainContent.getByRole('link', { name: 'Browse all setups' });
  await expect(browseLink).toBeVisible();
  await browseLink.click();
  await expect(page).toHaveURL('/professionals');
});

test('role jump panel renders exactly 7 role links inside the #roles section', async ({ page }) => {
  await page.goto('/');

  const rolesSection = page.locator('#roles');
  await expect(rolesSection).toBeVisible();

  // Each of the 7 ROLES links to /professionals?role=<id>
  const roleLinks = rolesSection.locator('a[href*="/professionals?role="]');
  await expect(roleLinks).toHaveCount(7);
});

// Phase 5 note: #how section removed in the skills-first relayout — the landing
// leads directly to the "Popular this week" catalog section.
// #roles is preserved as the hero's role-jump panel (aside with id="roles").
test('#roles anchor section exists on the page', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#roles')).toBeVisible();
});
