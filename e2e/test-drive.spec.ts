/**
 * E2E tests for the test-drive UI (Task 7).
 *
 * All API calls are intercepted via page.route() — CI never calls the real
 * /api/test-drive endpoint or spends any model credits.
 *
 * Flag gating: the TestDrivePanel renders only when TESTDRIVE_ENABLED=true on
 * the server. Tests that need the panel use a beforeEach guard and skip when
 * the flag is off. The "flag off" test works in the opposite environment.
 *
 * To run the flag-on tests locally, set TESTDRIVE_ENABLED=true in .env.local
 * before starting the dev server.
 */

import { test, expect, type Page } from '@playwright/test';

// ─── SSE body builders ────────────────────────────────────────────────────────

function sseChunk(text: string): string {
  return `event: chunk\ndata: ${JSON.stringify(text)}\n\n`;
}

function sseDone(cached = false): string {
  return (
    `event: done\ndata: ${JSON.stringify({
      cached,
      usage: { inputTokens: 100, outputTokens: 50, estimatedCostUsd: 0.001 },
    })}\n\n`
  );
}

function sseError(
  code: string,
  message: string,
  retryAt?: string,
): string {
  return (
    `event: error\ndata: ${JSON.stringify({
      code,
      message,
      ...(retryAt ? { retryAt } : {}),
    })}\n\n`
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Navigate to the marketing-manager customize page and wait for load. */
async function goToCustomize(page: Page) {
  await page.goto('/setup/marketing-manager/customize');
  // Wait for the main heading to confirm page load
  await expect(page.locator('h1')).toContainText('Make it yours');
}

/** Fill the brand name so the run/export gate is satisfied. */
async function fillRequiredFields(page: Page) {
  await page.getByLabel('Brand name', { exact: false }).fill('TestBrand');
}

/** Check whether the test-drive panel is present (flag is on). */
async function isPanelVisible(page: Page): Promise<boolean> {
  const panel = page.getByTestId('test-drive-panel');
  return panel.isVisible().catch(() => false);
}

// ─── Shared beforeEach for flag-on tests ─────────────────────────────────────

async function requireFlagOn(page: Page) {
  await goToCustomize(page);
  const visible = await isPanelVisible(page);
  if (!visible) {
    // Panel absent ⇒ TESTDRIVE_ENABLED is off; skip the test.
    test.skip(true, 'TestDrivePanel not rendered — start the dev server with TESTDRIVE_ENABLED=true');
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('test-drive — flag off', () => {
  /**
   * When TESTDRIVE_ENABLED is not "true", the panel never mounts.
   * This test skips when the flag IS on, to avoid a false failure.
   */
  test('no test-drive entry point exists on customize or preview when flag is off', async ({ page }) => {
    await goToCustomize(page);

    const panelVisible = await isPanelVisible(page);
    if (panelVisible) {
      // Flag is on in this environment — this test verifies the opposite case.
      test.skip(true, 'TESTDRIVE_ENABLED=true — flag-off behavior verified by unit tests and absence of data-testids');
      return;
    }

    // Flag is off: no test-drive buttons should exist anywhere on the page.
    await expect(page.getByTestId('test-drive-panel')).toHaveCount(0);
    await expect(page.getByTestId('test-drive-run-btn')).toHaveCount(0);
    await expect(page.getByTestId('test-drive-preview-btn')).toHaveCount(0);
  });
});

test.describe('test-drive — streaming run', () => {
  test('running a scenario streams output next to the expected behavior', async ({ page }) => {
    await requireFlagOn(page);

    // Mock the API to return a streamed response
    await page.route('**/api/test-drive', async (route) => {
      const body =
        sseChunk('Hello from ') +
        sseChunk('your setup!') +
        sseDone(false);
      await route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
        body,
      });
    });

    // Fill required fields so the run button is enabled
    await fillRequiredFields(page);

    // Select the first scenario card
    const scenarioCards = page.locator('.scenario-card');
    await expect(scenarioCards.first()).toBeVisible();
    await scenarioCards.first().click();
    await expect(scenarioCards.first()).toHaveAttribute('aria-pressed', 'true');

    // Run button should now be enabled
    const runBtn = page.getByTestId('test-drive-run-btn');
    await expect(runBtn).toBeEnabled();
    await runBtn.click();

    // Output region renders and accumulates streamed text
    const outputRegion = page.getByTestId('test-drive-output');
    await expect(outputRegion).toBeVisible();
    await expect(outputRegion).toContainText('Hello from your setup!', { timeout: 10_000 });

    // Expected-behavior column is shown side by side
    const expectedRegion = page.getByTestId('test-drive-expected');
    await expect(expectedRegion).toBeVisible();
    // marketing-manager first scenario expectedBehavior mentions "Instagram" and "LinkedIn"
    await expect(expectedRegion).toContainText('Instagram');
  });
});

test.describe('test-drive — cancel', () => {
  test('cancel stops the stream and re-enables the run button', async ({ page }) => {
    await requireFlagOn(page);

    // Mock the API to hang for a few seconds before responding
    await page.route('**/api/test-drive', async (route) => {
      // Delay long enough for the test to click Cancel
      await new Promise<void>((resolve) => setTimeout(resolve, 4000));
      await route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
        body: sseDone(false),
      }).catch(() => {
        // Request may be aborted before we fulfill — ignore
      });
    });

    await fillRequiredFields(page);
    await page.locator('.scenario-card').first().click();

    const runBtn = page.getByTestId('test-drive-run-btn');
    await expect(runBtn).toBeEnabled();
    await runBtn.click();

    // Cancel button should appear while streaming
    const cancelBtn = page.getByTestId('test-drive-cancel-btn');
    await expect(cancelBtn).toBeVisible({ timeout: 5_000 });

    // Click cancel
    await cancelBtn.click();

    // Run button re-enables; cancel button disappears
    await expect(runBtn).toBeVisible({ timeout: 5_000 });
    await expect(runBtn).toBeEnabled();
    await expect(cancelBtn).toHaveCount(0);
  });
});

test.describe('test-drive — quota exhausted', () => {
  test('session-cap response shows the friendly cap state with its reset time', async ({ page }) => {
    await requireFlagOn(page);

    const midnight = new Date();
    midnight.setUTCHours(24, 0, 0, 0);
    const retryAt = midnight.toISOString();

    await page.route('**/api/test-drive', async (route) => {
      await route.fulfill({
        status: 429,
        headers: { 'Content-Type': 'text/event-stream' },
        body: sseError('session-cap', "You've used your free test-drives for today.", retryAt),
      });
    });

    await fillRequiredFields(page);
    await page.locator('.scenario-card').first().click();
    await page.getByTestId('test-drive-run-btn').click();

    // Quota error state renders
    const quotaError = page.getByTestId('test-drive-quota-error');
    await expect(quotaError).toBeVisible({ timeout: 8_000 });
    // Names the reset timing
    await expect(quotaError).toContainText('midnight UTC');
    // Run button stays visible but is disabled (runs-left counter hits 0).
    const runBtn = page.getByTestId('test-drive-run-btn');
    if (await runBtn.isVisible()) {
      await expect(runBtn).toBeDisabled();
    }
  });
});

test.describe('test-drive — budget busy', () => {
  test('global-budget response shows the try-later state', async ({ page }) => {
    await requireFlagOn(page);

    await page.route('**/api/test-drive', async (route) => {
      await route.fulfill({
        status: 503,
        headers: { 'Content-Type': 'text/event-stream' },
        body: sseError('global-budget', 'Test-drives are busy right now — try again in a little while.'),
      });
    });

    await fillRequiredFields(page);
    await page.locator('.scenario-card').first().click();
    await page.getByTestId('test-drive-run-btn').click();

    // Budget-busy state renders
    const budgetError = page.getByTestId('test-drive-budget-error');
    await expect(budgetError).toBeVisible({ timeout: 8_000 });
    await expect(budgetError).toContainText('busy right now');
    // A retry button is available (it re-enables after budget clears)
    await expect(page.getByTestId('test-drive-retry-btn')).toBeVisible();
  });
});

test.describe('test-drive — cached result', () => {
  test('a cached response is labeled as an instant example', async ({ page }) => {
    await requireFlagOn(page);

    // Cache hit: no chunk events — only the done event with cached: true
    await page.route('**/api/test-drive', async (route) => {
      await route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
        body: sseDone(true),
      });
    });

    await fillRequiredFields(page);
    await page.locator('.scenario-card').first().click();
    await page.getByTestId('test-drive-run-btn').click();

    // "Instant example" label should appear
    await expect(page.getByText('Instant example')).toBeVisible({ timeout: 8_000 });

    // Expected-behavior column is still shown
    await expect(page.getByTestId('test-drive-expected')).toBeVisible();
  });
});

test.describe('test-drive — run button gate', () => {
  test('run button is disabled until required fields are filled (same gate as export)', async ({ page }) => {
    await requireFlagOn(page);

    // Do NOT fill required fields
    // Select a scenario
    const firstCard = page.locator('.scenario-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Run button should be disabled (canRun = false because fields are empty)
    const runBtn = page.getByTestId('test-drive-run-btn');
    await expect(runBtn).toBeVisible();
    await expect(runBtn).toBeDisabled();

    // A "why disabled" note should appear
    await expect(page.getByRole('status')).toContainText(/fill in|required/i);
  });

  test('preview panel "Test-drive with your answers" button is present and wired', async ({ page }) => {
    await requireFlagOn(page);
    await fillRequiredFields(page);

    // The preview panel button renders when testDriveEnabled is true
    const previewBtn = page.getByTestId('test-drive-preview-btn');
    await expect(previewBtn).toBeVisible();
    await expect(previewBtn).toContainText('Test-drive with your answers');
  });
});
