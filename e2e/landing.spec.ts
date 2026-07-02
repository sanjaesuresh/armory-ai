import { test, expect } from '@playwright/test';

test('landing shows a one-line explanation, one example, and a single primary Get started button that navigates to the role picker route', async ({
  page,
}) => {
  await page.goto('/');

  // One-line explanation visible in the heading — assert the actual
  // non-technical copy so a jargon regression would fail this test.
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText(/Pick a ready-made AI setup for your role/i);

  // One concrete example line
  const example = page.getByTestId('example-line');
  await expect(example).toBeVisible();

  // Exactly one primary CTA
  const ctas = page.getByRole('link', { name: 'Get started' });
  await expect(ctas).toHaveCount(1);

  // Clicking it navigates to the role picker URL
  await ctas.click();
  await expect(page).toHaveURL('/start');
});
