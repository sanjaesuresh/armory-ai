import { test, expect } from '@playwright/test';

test("catalog shows the 'what is a setup?' description", async ({ page }) => {
  await page.goto('/catalog');
  await expect(page.getByTestId('setup-explainer')).toBeVisible();
  await expect(page.getByTestId('setup-explainer')).toContainText(
    'ready-made set of instructions',
  );
});

test('with a role param, recommended setups appear first', async ({ page }) => {
  await page.goto('/catalog?role=marketing-manager');

  const recommended = page.getByTestId('recommended-section');
  await expect(recommended).toBeVisible();
  await expect(
    recommended.getByTestId('setup-card-marketing-manager'),
  ).toBeVisible();
});

test('each setup card shows name, tagline, and links to its detail page', async ({
  page,
}) => {
  await page.goto('/catalog');

  const card = page.getByTestId('setup-card-marketing-manager');
  await expect(card).toBeVisible();
  await expect(card.getByTestId('card-name')).toBeVisible();
  await expect(card.getByTestId('card-tagline')).toBeVisible();
  await expect(card).toHaveAttribute('href', '/setup/marketing-manager');
});

test('narrowing filters to nothing shows the empty state with a clear-filters action that restores results', async ({
  page,
}) => {
  await page.goto('/catalog?role=recruiter');

  const emptyState = page.getByTestId('empty-state');
  await expect(emptyState).toBeVisible();

  const clearLink = page.getByTestId('clear-filters');
  await clearLink.click();

  await expect(page).toHaveURL('/catalog');
  await expect(page.getByTestId('setup-card-marketing-manager')).toBeVisible();
});

test('search input filters the setup list live', async ({ page }) => {
  await page.goto('/catalog');

  // The real setup should be visible initially.
  await expect(page.getByTestId('setup-card-marketing-manager')).toBeVisible();

  // A search term with no match empties the results.
  const searchInput = page.getByLabel('Search setups');
  await searchInput.fill('xyz_no_match_xyz');
  await expect(page.getByTestId('empty-state')).toBeVisible();

  // Clearing the search restores the results.
  await searchInput.clear();
  await expect(page.getByTestId('setup-card-marketing-manager')).toBeVisible();
});

test('a category chip filters results and aria-pressed toggles correctly', async ({
  page,
}) => {
  await page.goto('/catalog');

  // The Marketing chip should be present (derived from the real setup's category).
  const marketingChip = page
    .getByRole('group', { name: 'Filter by category' })
    .getByRole('button', { name: 'Marketing' });

  await expect(marketingChip).toHaveAttribute('aria-pressed', 'false');

  await marketingChip.click();

  await expect(marketingChip).toHaveAttribute('aria-pressed', 'true');
  // The marketing-manager setup should remain visible.
  await expect(page.getByTestId('setup-card-marketing-manager')).toBeVisible();
});

test('on role-empty-state, clicking a category chip filters the full catalog', async ({
  page,
}) => {
  await page.goto('/catalog?role=recruiter');

  // No setups match the recruiter role — empty state should be shown.
  await expect(page.getByTestId('empty-state')).toBeVisible();

  // Click the Marketing chip (derived from the marketing-manager setup's category).
  const marketingChip = page
    .getByRole('group', { name: 'Filter by category' })
    .getByRole('button', { name: 'Marketing' });
  await marketingChip.click();

  // The chip should now filter over the full catalog and surface the marketing setup.
  await expect(page.getByTestId('setup-card-marketing-manager')).toBeVisible();
  // Empty state must be gone — the chip did real work.
  await expect(page.getByTestId('empty-state')).not.toBeVisible();
});

test('result count updates as filters change', async ({ page }) => {
  await page.goto('/catalog');

  const count = page.getByTestId('result-count');
  await expect(count).toContainText('setup');

  // Searching for a non-matching term should show 0 setups.
  await page.getByLabel('Search setups').fill('xyz_no_match');
  await expect(count).toContainText('0 setups');

  // Clearing the search restores the count.
  await page.getByLabel('Search setups').clear();
  await expect(count).toContainText('setup');
});
