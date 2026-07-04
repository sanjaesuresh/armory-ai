/**
 * Advanced-tier catalog surfacing — e2e tests.
 *
 * Test 1 is ALWAYS-ON: it only requires the existing core setups (marketing-manager)
 * and verifies the default-hidden behavior plus toggle presence.
 *
 * Tests 2 and 3 are SKIPPED: they need a seeded advanced-tier setup in the DB,
 * which does not exist yet (the connector amendment that introduces advanced setups
 * is deferred). Un-skip them when a real advanced setup is seeded.
 */

import { test, expect } from '@playwright/test';

// ── Always-on: verifiable with only the existing core seeded data ─────────────

test('the default catalog shows no advanced-badge cards and the toggle exists', async ({
  page,
}) => {
  await page.goto('/catalog');

  // The "Show advanced setups" toggle must always be present (a11y: labeled checkbox)
  const toggle = page.getByTestId('show-advanced-toggle');
  await expect(toggle).toBeVisible();
  await expect(toggle).not.toBeChecked();

  // With only core setups seeded, no advanced badge should appear by default
  await expect(page.getByTestId('badge-advanced')).toHaveCount(0);

  // Toggling on should not crash the page (it just reveals zero advanced setups)
  await toggle.click();
  await expect(toggle).toBeChecked();
  // Still no advanced badge (no advanced setups in DB), but no error either
  await expect(page.getByTestId('badge-advanced')).toHaveCount(0);
});

// ── Skipped: require a seeded advanced setup ──────────────────────────────────
// Un-skip when an advanced-tier setup is added to the DB.

test.skip('the show-advanced control reveals advanced setups with the Advanced badge', async ({
  page,
}) => {
  await page.goto('/catalog');

  // By default, no advanced setups visible
  await expect(page.getByTestId('badge-advanced')).toHaveCount(0);

  // Toggle on
  const toggle = page.getByTestId('show-advanced-toggle');
  await toggle.click();

  // At least one advanced badge should now appear
  await expect(page.getByTestId('badge-advanced').first()).toBeVisible();
});

test.skip("an advanced setup's detail page shows the expectations block before the customize action", async ({
  page,
}) => {
  // Navigate to a seeded advanced setup (update slug when one is added)
  await page.goto('/setup/some-advanced-setup-slug');

  const expectations = page.getByTestId('advanced-expectations');
  const customizeBtn = page.getByRole('link', { name: 'Use this setup' }).first();

  await expect(expectations).toBeVisible();
  await expect(expectations).toContainText("tools you'll connect yourself");

  // The expectations block must appear before the customize button in DOM order
  const expBox = await expectations.boundingBox();
  const btnBox = await customizeBtn.boundingBox();
  expect(expBox!.y).toBeLessThan(btnBox!.y);
});
