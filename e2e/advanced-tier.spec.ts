/**
 * Advanced-tier surfacing after the Phase 8 tab split.
 *
 * The old "Show advanced setups" toggle is gone by design: advanced-tier setups
 * now live on the Developers tab, core setups on Professionals.
 *
 * The always-on tests only require the existing core seed (marketing-manager).
 * The seeded-data tests are SKIPPED until a real advanced-tier item exists.
 */

import { test, expect } from '@playwright/test';

// ── Always-on: verifiable with only the existing core seeded data ─────────────

test('neither dashboard renders the old advanced toggle', async ({ page }) => {
  await page.goto('/professionals');
  await expect(page.getByTestId('show-advanced-toggle')).toHaveCount(0);

  await page.goto('/developers');
  await expect(page.getByTestId('show-advanced-toggle')).toHaveCount(0);
});

test('the professionals dashboard shows no advanced-badge cards', async ({
  page,
}) => {
  await page.goto('/professionals');
  // Only core setups are professional items → no advanced badge.
  await expect(page.getByTestId('badge-advanced')).toHaveCount(0);
});

test('the developers dashboard loads with its own registry header', async ({
  page,
}) => {
  await page.goto('/developers');
  await expect(page.getByRole('heading', { level: 1, name: 'Developers' })).toBeVisible();
  // No advanced toggle here either.
  await expect(page.getByTestId('show-advanced-toggle')).toHaveCount(0);
});

// ── Skipped: require a seeded advanced-tier / registry item ───────────────────
// Un-skip when an advanced setup (tier='advanced') is added to the DB.

test.skip('an advanced setup is absent from Professionals and present on Developers', async ({
  page,
}) => {
  // Adjust the slug when a real advanced setup is seeded.
  await page.goto('/professionals');
  await expect(page.getByTestId('setup-card-some-advanced-setup-slug')).toHaveCount(0);

  await page.goto('/developers');
  await expect(page.getByTestId('row-some-advanced-setup-slug')).toBeVisible();
});

test.skip("an advanced setup's detail page shows the expectations block before the customize action", async ({
  page,
}) => {
  await page.goto('/setup/some-advanced-setup-slug');

  const expectations = page.getByTestId('advanced-expectations');
  const customizeBtn = page.getByRole('link', { name: 'Use this setup' }).first();

  await expect(expectations).toBeVisible();
  await expect(expectations).toContainText("tools you'll connect yourself");

  const expBox = await expectations.boundingBox();
  const btnBox = await customizeBtn.boundingBox();
  expect(expBox!.y).toBeLessThan(btnBox!.y);
});
