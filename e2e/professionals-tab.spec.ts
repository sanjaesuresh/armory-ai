/**
 * Professionals tab e2e specs.
 *
 * Covers: the /professionals dashboard's core-tier list, the Most Popular
 * shelf, Armory Approved shelf visibility rules, category chip bar, and the
 * /catalog legacy redirect.
 *
 * Always-on tests: verified with only the existing core seed (marketing-manager,
 * kind=setup, tier=core, featured=null, upvotes=0).
 *
 * Key data-path reality for the current e2e environment:
 *   - marketing-manager qualifies for the Most Popular shelf (popularShelf
 *     includes all items not in the approved set; upvotes need not be > 0).
 *   - marketing-manager does NOT qualify for the Armory Approved shelf because
 *     featured is null — so shelf-approved must be absent.
 *   - Category chips derive from seeded items' categories: at minimum 'All'
 *     and 'Marketing' (marketing-manager.category = 'marketing').
 *
 * Gated tests (test.skip): depend on a featured item being seeded.
 * Ungate after applying the Phase 8 seed.sql to the Supabase instance
 * (deferred runtime verification — same pattern as Tasks 4–7).
 */

import { test, expect } from '@playwright/test';

// ── Always-on ────────────────────────────────────────────────────────────────

test('/professionals includes the marketing-manager list-table row', async ({
  page,
}) => {
  await page.goto('/professionals');
  // ListTable renders data-testid="row-<slug>" for each item in the list.
  await expect(page.getByTestId('row-marketing-manager')).toBeVisible();
});

test('the Most Popular shelf renders on professionals with the core seed', async ({
  page,
}) => {
  await page.goto('/professionals');
  // popularShelf includes every item not already on the approved shelf.
  // With marketing-manager (featured=null → approved set is empty), it
  // qualifies and popular.length > 0, so the section renders.
  await expect(page.getByTestId('shelf-popular')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Most Popular' }),
  ).toBeVisible();
  // The core seed item is the card shown in the shelf.
  await expect(
    page.getByTestId('shelf-popular').getByTestId('setup-card-marketing-manager'),
  ).toBeVisible();
});

test('the Armory Approved shelf does not render without any featured items', async ({
  page,
}) => {
  await page.goto('/professionals');
  // marketing-manager.featured is null → approvedShelf returns [] → section
  // is not mounted at all.
  await expect(page.getByTestId('shelf-approved')).toHaveCount(0);
});

test('category chips are rendered on the professionals page', async ({
  page,
}) => {
  await page.goto('/professionals');
  const chipGroup = page.getByRole('group', { name: 'Filter by category' });
  await expect(chipGroup).toBeVisible();
  // 'All' is always first; 'Marketing' is derived from marketing-manager's category.
  await expect(chipGroup.getByRole('button', { name: 'All' })).toBeVisible();
  await expect(
    chipGroup.getByRole('button', { name: 'Marketing' }),
  ).toBeVisible();
  // 'All' is the default active chip.
  await expect(
    chipGroup.getByRole('button', { name: 'All' }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('selecting the Marketing chip keeps marketing-manager visible and toggles aria-pressed', async ({
  page,
}) => {
  await page.goto('/professionals');
  const chipGroup = page.getByRole('group', { name: 'Filter by category' });
  const marketingChip = chipGroup.getByRole('button', { name: 'Marketing' });
  // Chip starts unselected.
  await expect(marketingChip).toHaveAttribute('aria-pressed', 'false');
  await marketingChip.click();
  await expect(marketingChip).toHaveAttribute('aria-pressed', 'true');
  // marketing-manager is in the Marketing category → still in the list.
  await expect(page.getByTestId('row-marketing-manager')).toBeVisible();
});

test('/catalog redirects to /professionals preserving query params', async ({
  page,
}) => {
  // The CatalogPage permanentRedirects to /professionals with all query params.
  await page.goto('/catalog?cat=marketing');
  await expect(page).toHaveURL('/professionals?cat=marketing');
});

// ── Gated: require a seeded item with featured != null ────────────────────────
// Ungate after applying the Phase 8 seed.sql to the Supabase instance.

test.skip('the Armory Approved shelf renders when at least one item has a featured rank', async ({
  page,
}) => {
  await page.goto('/professionals');
  await expect(page.getByTestId('shelf-approved')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Armory Approved' }),
  ).toBeVisible();
});
