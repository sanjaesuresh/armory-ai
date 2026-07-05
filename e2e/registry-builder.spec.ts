/**
 * Registry builder flow e2e tests — Phase 8 Task 9.
 *
 * REQUIRES LOCAL SUPABASE + a signed-in session — skipped in standard
 * CI/sandbox runs, mirroring e2e/auth.spec.ts and e2e/submission.spec.ts. The
 * flow creates a registry draft (RLS-scoped to the author), uploads artifact
 * files, exercises the AI-failure manual path, and submits into the moderation
 * queue — none of which works without a live database + auth.
 *
 * The AI-describe step is a convenience, never a gate: these tests drive the
 * manual fallback so they never require model spend. Where a live AI-describe
 * response is wanted, route-intercept /api/registry/describe (as the test-drive
 * specs intercept /api/test-drive).
 *
 * To run in a credentialed local environment: remove the test.skip calls and
 * `npm run e2e -- e2e/registry-builder.spec.ts`.
 */

import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';

/** Writes a small temp artifact file and returns its absolute path. */
async function writeArtifact(name: string, content: string): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'armory-artifact-'));
  const file = path.join(dir, name);
  await fs.writeFile(file, content, 'utf8');
  return file;
}

/** Starts a registry (agent) draft from the build entry kind chooser. */
async function startAgentDraft(page: Page) {
  await page.goto('/build');
  // Pick the Agent kind, then start — navigates to /build/<id>.
  await page.getByTestId('kind-option-agent').click();
  await page.getByTestId('start-new-setup').click();
  await expect(page).toHaveURL(/\/build\/[0-9a-f-]+$/);
}

// ---------------------------------------------------------------------------
// All tests are skipped unless a local Supabase instance + auth are present.
// Remove test.skip to run in a credentialed local environment.
// ---------------------------------------------------------------------------

test.skip('kind choice → upload → AI-failure manual path → submit → pending in my-submissions', async ({
  page,
}) => {
  await startAgentDraft(page);

  // ── Step 1: Files ──────────────────────────────────────────────────────────
  await expect(page.getByRole('heading', { name: 'Files' })).toBeVisible();
  const artifact = await writeArtifact(
    'code-review.md',
    '# Code Review Agent\n\nReviews diffs for correctness and clarity.',
  );
  await page.getByTestId('registry-file-input').setInputFiles(artifact);
  await expect(page.getByText('code-review.md')).toBeVisible();
  await page.getByTestId('registry-continue').click();

  // ── Step 2: Listing (drive the manual fallback) ────────────────────────────
  await expect(page.getByRole('heading', { name: 'Listing details' })).toBeVisible();

  // Force the AI-describe convenience to fail so we exercise the manual path.
  // (Route-intercept returns the "model-failure" 200 shape the builder treats
  // as manual mode — no model spend, no gate.)
  await page.route('**/api/registry/describe', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false, code: 'model-failure' }),
    }),
  );
  await page.getByTestId('registry-draft-ai').click();
  await expect(page.getByTestId('registry-ai-failed')).toBeVisible();

  // The manual form stays fully usable.
  await page.getByLabel('Name', { exact: false }).fill('Code Review Agent');
  await page.getByLabel('Tagline', { exact: false }).fill('Reviews diffs for correctness.');
  await page
    .getByLabel('Description', { exact: false })
    .fill('A thorough code-review agent that flags correctness and clarity issues.');
  await page.getByTestId('registry-continue').click();

  // ── Step 3: Review & submit ────────────────────────────────────────────────
  await expect(page.getByRole('heading', { name: 'Review & submit' })).toBeVisible();
  await page.getByTestId('registry-submit').click();

  // On success the app navigates to /my/submissions?submitted=1 with a pending row.
  await expect(page).toHaveURL(/\/my\/submissions\?submitted=1/);
  await expect(page.getByText('Code Review Agent')).toBeVisible();
  await expect(page.getByText('Pending review')).toBeVisible();
});

test.skip('the builder rejects an oversized artifact file inline without uploading it', async ({
  page,
}) => {
  await startAgentDraft(page);

  // A file just over the 100 KB (102,400-byte) limit is rejected client-side.
  const tooBig = await writeArtifact('big.md', 'a'.repeat(102_401));
  await page.getByTestId('registry-file-input').setInputFiles(tooBig);

  await expect(page.getByTestId('registry-upload-error')).toContainText('100 KB');
  await expect(page.getByText('big.md')).toHaveCount(0);
});
