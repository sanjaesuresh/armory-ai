import { test, expect } from '@playwright/test';
import { ROLES } from '@/lib/catalog/roles';

test('role picker renders one card per ROLE with icon, label, and description', async ({
  page,
}) => {
  await page.goto('/start');

  for (const role of ROLES) {
    const card = page.getByTestId(`role-card-${role.id}`);
    await expect(card).toBeVisible();
    // Each card shows the role label.
    await expect(card).toContainText(role.label);
  }
});

test('role picker renders an escape link to professionals', async ({ page }) => {
  await page.goto('/start');
  await expect(page.getByTestId('escape-link')).toBeVisible();
});

test('selecting a role navigates to professionals filtered by that role', async ({
  page,
}) => {
  await page.goto('/start');

  const firstRole = ROLES[0];
  await page.getByTestId(`role-card-${firstRole.id}`).click();

  await expect(page).toHaveURL(`/professionals?role=${firstRole.id}`);
});

test('the escape link navigates to professionals with no role filter', async ({
  page,
}) => {
  await page.goto('/start');

  await page.getByTestId('escape-link').click();

  await expect(page).toHaveURL('/professionals');
});
