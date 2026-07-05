import { test, expect } from '@playwright/test';

/**
 * E2E tests for the optional goal-chips input (Phase 3, Task 5).
 *
 * Coverage:
 *  1. Chips appear after a role is chosen and the step is skippable.
 *  2. Chip selections travel in the URL and persist across a reload.
 *  3. The browse-popular path (no role) never shows the chips prompt.
 */

test('chips render after picking a role and are skippable, with skip landing on the role-filtered catalog', async ({
  page,
}) => {
  // Arriving at the dashboard with a role but no goals → chip prompt visible.
  await page.goto('/professionals?role=marketing-manager');

  const goalChips = page.getByTestId('goal-chips');
  await expect(goalChips).toBeVisible();

  // Skip button must be keyboard-reachable and labelled.
  const skipBtn = page.getByTestId('goal-chips-skip');
  await expect(skipBtn).toBeVisible();

  // Clicking skip commits the step and removes the chip row.
  await skipBtn.click();

  await expect(goalChips).not.toBeVisible();

  // The role-filtered dashboard content should remain; URL still carries the role.
  await expect(page).toHaveURL(/role=marketing-manager/);
  await expect(page.getByTestId('recommended-section')).toBeVisible();
});

test('selected chips appear in the catalog URL and persist across reload', async ({
  page,
}) => {
  await page.goto('/professionals?role=marketing-manager');

  // Select one goal chip.
  const writeEmailsChip = page.getByRole('button', { name: 'Write emails' });
  await expect(writeEmailsChip).toBeVisible();
  await writeEmailsChip.click();
  await expect(writeEmailsChip).toHaveAttribute('aria-pressed', 'true');

  // Submit the selection.
  await page.getByTestId('goal-chips-submit').click();

  // URL must carry the selected goal id.
  await expect(page).toHaveURL(/goals=write-emails/);

  // Reload — goals param is in the URL so chip prompt must not reappear.
  await page.reload();
  await expect(page.getByTestId('goal-chips')).not.toBeVisible();

  // Goal param survives the reload.
  await expect(page).toHaveURL(/goals=write-emails/);
});

test('the browse-popular path never shows the chips prompt', async ({
  page,
}) => {
  // Direct dashboard browse with no role.
  await page.goto('/professionals');
  await expect(page.getByTestId('goal-chips')).not.toBeVisible();

  // "Browse popular" escape hatch on the start page (routes through the redirect).
  await page.goto('/start');
  await page.getByTestId('escape-link').click();
  await expect(page).toHaveURL('/professionals');
  await expect(page.getByTestId('goal-chips')).not.toBeVisible();
});
