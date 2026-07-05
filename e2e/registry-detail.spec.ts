/**
 * Registry detail page e2e specs.
 *
 * Data path: the same Supabase DB + Next.js dev server as all other e2e specs.
 * No registry items exist until Task 11 seeds them, so all tests that need a
 * real registry slug are gated with test.skip — Task 11 ungates them.
 *
 * Always-on tests (no registry seed needed):
 *   - /dev/[slug] with kind='setup' redirects to /setup/[slug]
 *   - /dev/[slug] for an unknown slug returns 404
 *
 * Skipped tests (ungated by Task 11, which seeds registry items):
 *   - dev detail renders name, KindBadge, capabilities
 *   - collapsed primary file is visible; expanding works
 *   - back link points to /developers
 *   - /setup/[slug] for a registry kind redirects to /dev/[slug]
 */

import { test, expect } from '@playwright/test';

// ── Always-on: verifiable with only the existing core seeded data ─────────────

test('/dev/marketing-manager cross-redirects to /setup/marketing-manager', async ({
  page,
}) => {
  // marketing-manager has kind='setup'; /dev/[slug] should redirect to /setup/[slug].
  const response = await page.goto('/dev/marketing-manager');
  // Next.js redirect resolves; Playwright follows it and lands on the setup page.
  await expect(page).toHaveURL('/setup/marketing-manager');
  // Verify the page actually loaded the setup (h1 text confirms no error boundary).
  await expect(page.getByRole('heading', { name: 'Marketing Manager' })).toBeVisible();
  // HTTP redirect status (3xx) is followed by Playwright; the final response is 200.
  expect(response?.status()).not.toBe(404);
});

test('/dev/nonexistent-slug-xyz returns 404', async ({ page }) => {
  const response = await page.goto('/dev/nonexistent-slug-xyz');
  expect(response?.status()).toBe(404);
});

// ── Skipped: require a seeded registry item ───────────────────────────────────
//
// The slug below matches the tdd-loop-harness item seeded by Task 11.
// These tests are gated because applying the regenerated seed.sql to the live
// Supabase instance is deferred runtime verification (same pattern as Tasks 4–7).
// Ungate after seed.sql is applied to Supabase (deferred runtime verification).

const REGISTRY_SLUG = 'tdd-loop-harness';

test.skip('/dev/[registry-slug] renders the item name as a heading', async ({ page }) => {
  await page.goto(`/dev/${REGISTRY_SLUG}`);
  // tdd-loop-harness is seeded with name = 'TDD Loop Harness'
  await expect(page.getByRole('heading', { level: 1, name: 'TDD Loop Harness' })).toBeVisible();
});

test.skip('/dev/[registry-slug] renders the kind badge', async ({ page }) => {
  await page.goto(`/dev/${REGISTRY_SLUG}`);
  // The KindBadge renders a pill with data-testid="kind-badge-<kind>".
  // Replace 'harness' with the actual kind from Task 11's seed.
  await expect(page.getByTestId('kind-badge-harness')).toBeVisible();
});

test.skip('/dev/[registry-slug] shows capabilities list when capabilities exist', async ({
  page,
}) => {
  await page.goto(`/dev/${REGISTRY_SLUG}`);
  await expect(page.getByText('What it does')).toBeVisible();
  // At least one capability item should be present.
  await expect(page.locator('.cap-item').first()).toBeVisible();
});

test.skip('/dev/[registry-slug] shows the primary file in collapsed state', async ({
  page,
}) => {
  await page.goto(`/dev/${REGISTRY_SLUG}`);
  // The primary file viewer block is present.
  await expect(page.locator('.fileview')).toBeVisible();
  // The Expand button is present and its aria-expanded is false.
  const expandBtn = page.getByRole('button', { name: /expand/i });
  await expect(expandBtn).toBeVisible();
  await expect(expandBtn).toHaveAttribute('aria-expanded', 'false');
});

test.skip('/dev/[registry-slug] expand button reveals full content', async ({ page }) => {
  await page.goto(`/dev/${REGISTRY_SLUG}`);
  const expandBtn = page.getByRole('button', { name: /expand/i });
  await expandBtn.click();
  await expect(expandBtn).toHaveAttribute('aria-expanded', 'true');
});

test.skip('/dev/[registry-slug] back link points to /developers', async ({ page }) => {
  await page.goto(`/dev/${REGISTRY_SLUG}`);
  const backLink = page.getByRole('link', { name: /all tools/i });
  await expect(backLink).toBeVisible();
  await expect(backLink).toHaveAttribute('href', '/developers');
});

test.skip('/setup/[registry-slug] cross-redirects to /dev/[registry-slug]', async ({
  page,
}) => {
  // A registry-kind item accessed via /setup/[slug] should redirect to /dev/[slug].
  await page.goto(`/setup/${REGISTRY_SLUG}`);
  await expect(page).toHaveURL(`/dev/${REGISTRY_SLUG}`);
});
