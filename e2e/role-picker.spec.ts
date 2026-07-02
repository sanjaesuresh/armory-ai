import { test, expect } from '@playwright/test';
import { ROLES } from '@/lib/catalog/roles';

test('role picker renders one card per ROLE and an escape link', async ({ page }) => {
  await page.goto('/start');

  for (const role of ROLES) {
    await expect(page.getByTestId(`role-card-${role.id}`)).toBeVisible();
  }

  await expect(page.getByTestId('escape-link')).toBeVisible();
});

test('selecting a role navigates to the catalog filtered by that role', async ({ page }) => {
  await page.goto('/start');

  const firstRole = ROLES[0];
  await page.getByTestId(`role-card-${firstRole.id}`).click();

  await expect(page).toHaveURL(`/catalog?role=${firstRole.id}`);
});

test('the escape link navigates to the catalog with no role filter', async ({ page }) => {
  await page.goto('/start');

  await page.getByTestId('escape-link').click();

  await expect(page).toHaveURL('/catalog');
});
