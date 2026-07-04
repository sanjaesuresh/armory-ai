/**
 * Community anonymous-gate e2e tests — Phase 5 Task 7.
 *
 * ALWAYS-ON — these run against the dev server (port 3001, no auth required).
 * They verify that community pages gate correctly for a signed-out visitor:
 * no crashes, correct AuthPrompt placement, and the 404 security wall on the
 * moderator-only route.
 *
 * The account-free guarantee (catalog + setup detail work with no session)
 * is also confirmed here to make sure no community additions broke it.
 */

import { test, expect } from '@playwright/test';

test('/build shows the inline AuthPrompt for a signed-out visitor and does not redirect', async ({
  page,
}) => {
  await page.goto('/build');

  // The AuthPrompt component renders in place — the page must not crash.
  await expect(page.getByTestId('auth-prompt')).toBeVisible();

  // URL must remain /build — no redirect to /account or elsewhere.
  await expect(page).toHaveURL('/build');
});

test('/my/submissions shows the inline AuthPrompt for a signed-out visitor', async ({
  page,
}) => {
  await page.goto('/my/submissions');

  // Signed-out visitors see AuthPrompt, not the list of submissions.
  await expect(page.getByTestId('auth-prompt')).toBeVisible();
});

test('/admin/review returns a 404 for an anonymous visitor', async ({ page }) => {
  await page.goto('/admin/review');

  // notFound() is called immediately for non-moderators and signed-out visitors.
  // The Next.js built-in 404 page renders — the route's existence is never hinted.
  await expect(page.getByText('This page could not be found.')).toBeVisible();
});

test('the anonymous catalog still works after community additions', async ({ page }) => {
  // Account-free guarantee: browse works with no session — community features
  // must not break anonymous access.
  await page.goto('/catalog');
  await expect(page.getByTestId('setup-card-marketing-manager')).toBeVisible();

  // Navigate to a setup detail page — no crash, no redirect.
  await page.goto('/setup/marketing-manager');
  await expect(page).toHaveURL('/setup/marketing-manager');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
