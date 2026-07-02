import { test, expect } from '@playwright/test';

test("catalog shows the 'what is a setup?' frame", async ({ page }) => {
  await page.goto('/catalog');
  await expect(page.getByTestId('setup-explainer')).toBeVisible();
});

test('with a role param, recommended setups appear first', async ({ page }) => {
  await page.goto('/catalog?role=marketing-manager');

  const recommended = page.getByTestId('recommended-section');
  await expect(recommended).toBeVisible();
  await expect(recommended.getByTestId('setup-card-marketing-manager')).toBeVisible();
});

test('each setup card shows name, tagline, and links to its customize page', async ({ page }) => {
  await page.goto('/catalog');

  const card = page.getByTestId('setup-card-marketing-manager');
  await expect(card).toBeVisible();
  await expect(card.getByTestId('card-name')).toBeVisible();
  await expect(card.getByTestId('card-tagline')).toBeVisible();

  const link = card.getByTestId('card-link');
  await expect(link).toHaveAttribute('href', '/setup/marketing-manager');
});

test('narrowing filters to nothing shows the empty state with a clear-filters action that restores results', async ({ page }) => {
  await page.goto('/catalog?role=recruiter');

  const emptyState = page.getByTestId('empty-state');
  await expect(emptyState).toBeVisible();

  const clearLink = page.getByTestId('clear-filters');
  await clearLink.click();

  await expect(page).toHaveURL('/catalog');
  await expect(page.getByTestId('setup-card-marketing-manager')).toBeVisible();
});
