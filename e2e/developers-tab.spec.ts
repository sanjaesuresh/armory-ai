/**
 * Developers tab e2e specs.
 *
 * Covers: nav tab links (Professionals / Developers / Learn AI), the
 * /developers page header, and the developer-specific kind-filter chip bar.
 *
 * Always-on tests: verified with only the existing core seed (marketing-manager).
 * In the current e2e environment the six Phase 8 registry items (agents / skills /
 * harnesses) are NOT seeded in the live Supabase DB, so /developers renders an
 * empty list.  The kind-filter chips and h1 still render regardless.
 *
 * Gated tests (test.skip): depend on the Phase 8 registry items.
 * Ungate after applying the Phase 8 seed.sql to the Supabase instance
 * (deferred runtime verification — same pattern as Tasks 4–7).
 */

import { test, expect } from '@playwright/test';

// ── Always-on ────────────────────────────────────────────────────────────────

test('nav renders Professionals and Developers tab links with correct hrefs', async ({
  page,
}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main' });
  const proLink = nav.getByRole('link', { name: 'Professionals' });
  const devLink = nav.getByRole('link', { name: 'Developers' });
  await expect(proLink).toHaveAttribute('href', '/professionals');
  await expect(devLink).toHaveAttribute('href', '/developers');
});

test('nav contains Developers, Professionals, and Learn AI entries', async ({
  page,
}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main' });
  await expect(nav.getByRole('link', { name: 'Professionals' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Developers' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Learn AI' })).toBeVisible();
});

test('/developers loads the Developers h1 heading', async ({ page }) => {
  await page.goto('/developers');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Developers' }),
  ).toBeVisible();
});

test('kind-filter chips are rendered on the developers page', async ({
  page,
}) => {
  await page.goto('/developers');
  const kindGroup = page.getByRole('group', { name: 'Filter by kind' });
  await expect(kindGroup).toBeVisible();
  // All five chips defined in KIND_CHIPS must be present.
  for (const label of ['All', 'Agents', 'Skills', 'Harnesses', 'Setups']) {
    await expect(kindGroup.getByRole('button', { name: label })).toBeVisible();
  }
  // 'All' is the default selection.
  await expect(
    kindGroup.getByRole('button', { name: 'All' }),
  ).toHaveAttribute('aria-pressed', 'true');
});

// ── Gated: require the Phase 8 registry items ─────────────────────────────────
// Ungate after applying seed.sql to the Supabase instance.

// The slug below matches the tdd-loop-harness item seeded in Task 11.
const REGISTRY_SLUG = 'tdd-loop-harness';

test.skip('both Armory Approved and Most Popular shelves render with seeded registry items', async ({
  page,
}) => {
  await page.goto('/developers');
  await expect(page.getByTestId('shelf-approved')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Armory Approved' }),
  ).toBeVisible();
  await expect(page.getByTestId('shelf-popular')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Most Popular' }),
  ).toBeVisible();
});

test.skip('selecting a kind chip narrows the list to items of that kind', async ({
  page,
}) => {
  await page.goto('/developers');
  const kindGroup = page.getByRole('group', { name: 'Filter by kind' });
  const harnessesChip = kindGroup.getByRole('button', { name: 'Harnesses' });
  await harnessesChip.click();
  await expect(harnessesChip).toHaveAttribute('aria-pressed', 'true');
  // tdd-loop-harness is a harness kind; its row must be visible after narrowing.
  await expect(page.getByTestId(`row-${REGISTRY_SLUG}`)).toBeVisible();
  // Result count must reflect the narrowed set (not zero).
  await expect(page.getByTestId('result-count')).not.toContainText('0 tools');
});

test.skip('a list row on developers navigates to the registry detail page', async ({
  page,
}) => {
  await page.goto('/developers');
  const row = page.getByTestId(`row-${REGISTRY_SLUG}`);
  await expect(row).toBeVisible();
  // detailPathFor produces /dev/<slug> for registry kinds.
  await row.getByRole('link').click();
  await expect(page).toHaveURL(`/dev/${REGISTRY_SLUG}`);
});
