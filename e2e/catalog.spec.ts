import { test, expect } from '@playwright/test';

// ── The catalog moved to the Professionals dashboard (permanent redirect) ─────

test('/catalog permanently redirects to /professionals', async ({ page }) => {
  await page.goto('/catalog');
  await expect(page).toHaveURL('/professionals');
});

test('/catalog preserves query params through the redirect', async ({ page }) => {
  await page.goto('/catalog?role=marketing-manager');
  await expect(page).toHaveURL('/professionals?role=marketing-manager');
});

// ── Professionals dashboard ───────────────────────────────────────────────────

test('the professionals dashboard surfaces the marketing-manager setup', async ({
  page,
}) => {
  await page.goto('/professionals');
  // marketing-manager appears on a shelf card (list rows use row-* test ids).
  await expect(page.getByTestId('setup-card-marketing-manager')).toBeVisible();
});

test('with a role param, recommended setups appear with an honest why label', async ({
  page,
}) => {
  await page.goto('/professionals?role=marketing-manager');

  const recommended = page.getByTestId('recommended-section');
  await expect(recommended).toBeVisible();

  const card = recommended.getByTestId('setup-card-marketing-manager');
  await expect(card).toBeVisible();
  // marketing-manager role-matches deterministically → "Matches your role".
  await expect(card.getByTestId('card-why-label')).toContainText('Matches your role');
});

test('the no-role path shows no recommended section or why-labels', async ({
  page,
}) => {
  await page.goto('/professionals');

  await expect(page.getByTestId('setup-card-marketing-manager')).toBeVisible();
  await expect(page.getByTestId('recommended-section')).toHaveCount(0);
  await expect(page.getByTestId('fallback-section')).toHaveCount(0);
  await expect(page.getByTestId('card-why-label')).toHaveCount(0);
});

test('a shelf card links to its detail page', async ({ page }) => {
  await page.goto('/professionals');

  const card = page.getByTestId('setup-card-marketing-manager');
  await expect(card).toBeVisible();
  await expect(card.getByTestId('card-name')).toBeVisible();
  await expect(card.getByTestId('card-tagline')).toBeVisible();
  await expect(card).toHaveAttribute('href', '/setup/marketing-manager');
});

test('the list row links to the setup detail page', async ({ page }) => {
  await page.goto('/professionals');

  const row = page.getByTestId('row-marketing-manager');
  await expect(row).toBeVisible();
  await expect(row.getByRole('link')).toHaveAttribute('href', '/setup/marketing-manager');
});

test('search filters the list rows and the empty state can be cleared', async ({
  page,
}) => {
  await page.goto('/professionals');

  await expect(page.getByTestId('row-marketing-manager')).toBeVisible();

  const searchInput = page.getByLabel('Search setups');
  await searchInput.fill('xyz_no_match_xyz');
  await expect(page.getByTestId('empty-state')).toBeVisible();
  await expect(page.getByTestId('row-marketing-manager')).toHaveCount(0);

  // The empty-state clear action restores the list.
  await page.getByTestId('clear-filters').click();
  await expect(page.getByTestId('row-marketing-manager')).toBeVisible();
});

test('a category chip filters the list and aria-pressed toggles correctly', async ({
  page,
}) => {
  await page.goto('/professionals');

  const marketingChip = page
    .getByRole('group', { name: 'Filter by category' })
    .getByRole('button', { name: 'Marketing' });

  await expect(marketingChip).toHaveAttribute('aria-pressed', 'false');
  await marketingChip.click();
  await expect(marketingChip).toHaveAttribute('aria-pressed', 'true');

  await expect(page.getByTestId('row-marketing-manager')).toBeVisible();
});

test('result count updates as the search changes', async ({ page }) => {
  await page.goto('/professionals');

  const count = page.getByTestId('result-count');
  await expect(count).toContainText('setup');

  await page.getByLabel('Search setups').fill('xyz_no_match');
  await expect(count).toContainText('0 setups');

  await page.getByLabel('Search setups').clear();
  await expect(count).toContainText('setup');
});
