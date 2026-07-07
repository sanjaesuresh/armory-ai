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

test('the featured lead renders on professionals with the core seed', async ({
  page,
}) => {
  await page.goto('/professionals');
  // Phase 3: the featured lead replaces the old named shelves. shelf-popular
  // wraps the runner-up cards in the "Most equipped this week" section.
  // With 71+ seeded items the specific cards shown depend on upvotes/popularity;
  // the assertion is that the section and heading are present.
  await expect(page.getByTestId('shelf-popular')).toBeVisible();
  // The "Most equipped this week" heading replaced the old "Most Popular" heading.
  await expect(
    page.getByRole('heading', { name: 'Most equipped this week' }),
  ).toBeVisible();
  // marketing-manager is always visible in the index list (row testid).
  await expect(page.getByTestId('row-marketing-manager')).toBeVisible();
});

test('a hero renders from the popular fallback when no items have a featured rank', async ({
  page,
}) => {
  await page.goto('/professionals');
  // Phase 3 fix: when no item has featured != null, FeaturedLead promotes
  // popular[0] to the hero slot so shelf-approved ALWAYS renders when any
  // data exists. The old assertion (count === 0) was correct before the fix
  // but wrong now that the hero slot has an unconditional popular fallback.
  await expect(page.getByTestId('shelf-approved')).toBeVisible();
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

test.skip('the featured hero renders when at least one item has a featured rank', async ({
  page,
}) => {
  await page.goto('/professionals');
  // Phase 3: shelf-approved wraps the hero card in the featured lead section.
  await expect(page.getByTestId('shelf-approved')).toBeVisible();
  // The featured lead heading replaced the old "Armory Approved" shelf heading.
  await expect(
    page.getByRole('heading', { name: 'Most equipped this week' }),
  ).toBeVisible();
});
