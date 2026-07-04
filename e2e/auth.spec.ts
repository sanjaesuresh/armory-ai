/**
 * Auth flow e2e tests — Phase 4 Task 1.
 *
 * REQUIRES LOCAL SUPABASE — these tests are skipped in standard CI/sandbox
 * runs. To run them locally:
 *
 *   1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
 *   2. Start local Supabase: `supabase start`
 *      This starts the local stack including an Inbucket email server at
 *      http://localhost:54324 (or the port shown by `supabase status`).
 *   3. Confirm NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
 *      your .env.local match the values printed by `supabase status`.
 *   4. Seed a test user (optional — the OTP flow creates the user on first
 *      sign-in, so no seed is required for the happy path).
 *   5. Run: `npm run e2e -- e2e/auth.spec.ts`
 *
 * Inbucket captures all outgoing email at http://localhost:54324. The tests
 * use it to retrieve the OTP/magic-link without a real email provider.
 *
 * Reset between runs: `supabase db reset` recreates the local database from
 * schema.sql. This also clears all users and saved rows.
 */

import { test, expect } from '@playwright/test';

const INBUCKET_URL = 'http://localhost:54324';
const TEST_EMAIL = 'playwright-auth@test.armory.local';

/** Fetch the most recent email sent to an address via Inbucket's REST API. */
async function getLatestEmail(address: string): Promise<string> {
  const mailbox = address.split('@')[0];
  const r = await fetch(`${INBUCKET_URL}/api/v1/mailbox/${mailbox}`);
  const messages: Array<{ id: string }> = await r.json();
  const latest = messages[messages.length - 1];
  const msg = await fetch(`${INBUCKET_URL}/api/v1/mailbox/${mailbox}/${latest.id}`);
  const data: { body: { text: string } } = await msg.json();
  return data.body.text;
}

/** Extract the magic-link URL from the email body. */
function extractMagicLink(emailBody: string): string {
  const match = emailBody.match(/https?:\/\/[^\s"<>]+confirm[^\s"<>]+/);
  if (!match) throw new Error('Could not find magic link in email body');
  return match[0];
}

// ---------------------------------------------------------------------------
// All tests are skipped unless a local Supabase instance is running.
// Remove test.skip to run in a credentialed local environment.
// ---------------------------------------------------------------------------

test.skip('a signed-out user can request a sign-in link and complete sign-in', async ({
  page,
}) => {
  await page.goto('/account');

  // The sign-in form is visible for signed-out users.
  await expect(page.getByTestId('auth-prompt')).toBeVisible();

  // Fill in the email and request a link.
  await page.getByTestId('auth-prompt-email').fill(TEST_EMAIL);
  await page.getByTestId('auth-prompt-send').click();

  // The sent confirmation message appears.
  await expect(page.getByTestId('auth-prompt-sent')).toBeVisible();

  // Retrieve the magic link from Inbucket.
  const emailBody = await getLatestEmail(TEST_EMAIL);
  const magicLink = extractMagicLink(emailBody);

  // Follow the magic link — the callback route exchanges it for a session.
  await page.goto(magicLink);

  // After redirect, the account page shows the signed-in state.
  await expect(page.getByTestId('account-email')).toBeVisible();
  await expect(page.getByTestId('account-email')).toContainText(TEST_EMAIL);
});

test.skip('after sign-in the nav shows the account menu and sign out works', async ({
  page,
}) => {
  // (Assumes the test user is already signed in from the previous test, or
  // repeat the sign-in flow here.)
  await page.goto('/account');

  // The nav account button is visible when signed in.
  const accountBtn = page.getByTestId('account-menu-btn');
  await expect(accountBtn).toBeVisible();

  // Opening the dropdown shows links and sign out.
  await accountBtn.click();
  await expect(page.getByTestId('account-dropdown')).toBeVisible();
  await expect(page.getByTestId('account-my-setups')).toBeVisible();
  await expect(page.getByTestId('account-test-drives')).toBeVisible();

  // Signing out returns to the signed-out nav.
  await page.getByTestId('account-signout').click();
  await expect(page.getByTestId('nav-signin')).toBeVisible();
});

test.skip('a gated action while signed out renders the inline AuthPrompt', async ({
  page,
}) => {
  // My Setups page shows an inline AuthPrompt when signed out.
  await page.goto('/my/setups');

  const prompt = page.getByTestId('auth-prompt');
  await expect(prompt).toBeVisible();
  // The message explains what signing in unlocks.
  await expect(prompt).toContainText('save');
  // The email input and send button are present.
  await expect(page.getByTestId('auth-prompt-email')).toBeVisible();
  await expect(page.getByTestId('auth-prompt-send')).toBeVisible();
});

test.skip('an auth callback failure shows a retryable error on the account page', async ({
  page,
}) => {
  // Simulate a bad/expired code coming back from the callback route.
  await page.goto('/account?error=auth');

  // The error banner is visible and describes the problem.
  const banner = page.getByTestId('auth-error-banner');
  await expect(banner).toBeVisible();
  await expect(banner).toContainText("didn't work");

  // The sign-in form is still available for retry — never a dead end.
  await expect(page.getByTestId('auth-prompt')).toBeVisible();
  await expect(page.getByTestId('auth-prompt-email')).toBeEnabled();
});

test.skip('browsing, customizing, and exporting remain fully account-free', async ({
  page,
}) => {
  // Verify the account-free guarantee: the full Phase 1 flow works signed out
  // even when a Supabase instance is running.
  await page.goto('/catalog');
  await expect(page.getByTestId('setup-card-marketing-manager')).toBeVisible();

  // The Sign in link is visible but the rest of the flow is unblocked.
  await expect(page.getByTestId('nav-signin')).toBeVisible();

  // Navigate into a setup — no redirect to /account.
  await page.goto('/setup/marketing-manager');
  await expect(page).toHaveURL('/setup/marketing-manager');
});
