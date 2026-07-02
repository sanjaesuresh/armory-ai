import { test, expect } from '@playwright/test';

/**
 * E2E tests for the /install page (RD-Task 7).
 *
 * The install page reads `armory-export-state` from sessionStorage,
 * shows a horizontal step rail, and walks through each installation step.
 * Tests seed sessionStorage via addInitScript so the state is present
 * before the page's first useEffect runs.
 */

const VALID_STATE = {
  slug: 'marketing-manager',
  answers: {
    brandName: 'Flowmatic Coffee Co',
    hasBrandVoice: false,
    channels: ['Email'],
    tone: 'Professional',
  },
  attachments: {},
};

// Helper: seed sessionStorage and navigate to /install
async function goToInstall(page: import('@playwright/test').Page) {
  await page.addInitScript((state) => {
    sessionStorage.setItem('armory-export-state', JSON.stringify(state));
  }, VALID_STATE);
  await page.goto('/install');
}

test.describe('/install page', () => {
  test('renders the walk-rail with 5 steps (marketing-manager has knowledge files)', async ({
    page,
  }) => {
    await goToInstall(page);

    const rail = page.getByRole('group', { name: 'Install steps' });
    await expect(rail).toBeVisible();

    // marketing-manager has knowledge files → 5 steps total
    const stepBtns = rail.getByRole('button');
    await expect(stepBtns).toHaveCount(5);

    // Step 1 is active
    await expect(stepBtns.first()).toHaveAttribute('aria-current', 'step');
    // Steps 2-5 are not active
    await expect(stepBtns.nth(1)).not.toHaveAttribute('aria-current', 'step');
  });

  test('step indicator advances on Next', async ({ page }) => {
    await goToInstall(page);

    const indicator = page.getByTestId('step-indicator');

    await expect(indicator).toContainText('Step 1 of 5');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(indicator).toContainText('Step 2 of 5');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(indicator).toContainText('Step 3 of 5');
  });

  test('walk-rail updates aria-current as steps advance', async ({ page }) => {
    await goToInstall(page);

    const rail = page.getByRole('group', { name: 'Install steps' });
    const stepBtns = rail.getByRole('button');

    // Initially step 1 is current
    await expect(stepBtns.first()).toHaveAttribute('aria-current', 'step');

    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // After one advance: step 1 is done (no aria-current), step 2 is current
    await expect(stepBtns.first()).not.toHaveAttribute('aria-current', 'step');
    await expect(stepBtns.nth(1)).toHaveAttribute('aria-current', 'step');
  });

  test('step 2 panel contains the suggested project name with the brand', async ({
    page,
  }) => {
    await goToInstall(page);

    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // The heading should say "Name your Project"
    await expect(page.getByRole('heading', { name: 'Name your Project' })).toBeVisible();

    // Body must include the brand-prefixed project name suggestion
    await expect(
      page.getByText(/Flowmatic Coffee Co — Marketing Manager/),
    ).toBeVisible();
  });

  test("final step shows the 'You're set up' heading", async ({ page }) => {
    await goToInstall(page);

    // marketing-manager has 5 steps; click Next 4 times to reach the last step.
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    }

    await expect(page.getByRole('heading', { name: "You're set up" })).toBeVisible();
  });

  test("final step has an 'Adjust your setup' link back to /customize", async ({
    page,
  }) => {
    await goToInstall(page);

    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    }

    const adjustLink = page.getByRole('link', { name: /Adjust your setup/i });
    await expect(adjustLink).toBeVisible();
    await expect(adjustLink).toHaveAttribute(
      'href',
      '/setup/marketing-manager/customize',
    );
  });

  test('back-to-export link is present and points to /export', async ({ page }) => {
    await goToInstall(page);

    const backLink = page.getByRole('link', { name: /Back to export/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/export');
  });

  test('tips section is reachable via #tips anchor', async ({ page }) => {
    await goToInstall(page);

    const tipsSection = page.locator('#tips');
    await expect(tipsSection).toBeVisible();
    await expect(tipsSection.getByRole('heading', { name: 'Tips if you get stuck' })).toBeVisible();
  });

  test('missing sessionStorage shows start-over state with /catalog link', async ({
    page,
  }) => {
    // Navigate WITHOUT seeding sessionStorage
    await page.goto('/install');

    // Start-over message must be shown
    await expect(page.getByText(/couldn't find your setup/i)).toBeVisible();

    // Must include a link to /catalog
    const catalogLink = page.getByRole('link', { name: /catalog/i });
    await expect(catalogLink).toHaveAttribute('href', '/catalog');
  });

  test('Back button on step 2 returns to step 1', async ({ page }) => {
    await goToInstall(page);

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByTestId('step-indicator')).toContainText('Step 2 of 5');

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByTestId('step-indicator')).toContainText('Step 1 of 5');

    // Back button should not be present on step 1
    await expect(page.getByRole('button', { name: 'Back' })).not.toBeVisible();
  });

  test('completing the walkthrough fires exactly one done event without user content', async ({
    page,
  }) => {
    // Sentinel: user-typed content that must never appear in the event body.
    const SENTINEL = 'Flowmatic Coffee Co';

    const capturedEvents: Record<string, unknown>[] = [];

    await page.addInitScript((state) => {
      sessionStorage.setItem('armory-export-state', JSON.stringify(state));
    }, { ...VALID_STATE, planChoice: 'pro' });

    // Capture all requests to the events endpoint.
    await page.route('**/api/events/export', (route) => {
      const rawBody = route.request().postData() ?? '';
      const body = JSON.parse(rawBody) as Record<string, unknown>;
      capturedEvents.push(body);
      // Fulfill with 204 as before
      route.fulfill({ status: 204, body: '' });
    });

    await page.goto('/install');

    // Navigate to step 4 (one before the last).
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    }

    // Click to reach the final step — triggers the done event.
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    await expect(page.getByRole('heading', { name: "You're set up" })).toBeVisible();

    // Poll until exactly one done event is captured (avoids fixed sleeps).
    await expect
      .poll(() => capturedEvents.filter((e) => e.kind === 'done').length)
      .toBe(1);

    // Filter for done events (not copy events)
    const doneEvents = capturedEvents.filter((e) => e.kind === 'done');

    // Assert exactly one done event was fired
    expect(doneEvents).toHaveLength(1);

    const doneEvent = doneEvents[0];
    expect(doneEvent.setupSlug).toBe('marketing-manager');
    expect(doneEvent.target).toBe('claude-app');
    expect(doneEvent.branch).toBe('pro');

    // The body must contain no user-typed form content.
    const rawBody = JSON.stringify(doneEvent);
    expect(rawBody).not.toContain(SENTINEL);

    // Test that re-reaching the final step does not re-fire the done event.
    const doneCountBefore = capturedEvents.filter((e) => e.kind === 'done').length;

    // Navigate back to step 4
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByTestId('step-indicator')).toContainText('Step 4 of 5');

    // Navigate forward to step 5 again
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByRole('heading', { name: "You're set up" })).toBeVisible();

    // Poll expecting the done-event count has not increased — any spurious event
    // would cause the count to exceed doneCountBefore, the poll would keep
    // retrying, and the test would correctly fail on timeout.
    await expect
      .poll(
        () => capturedEvents.filter((e) => e.kind === 'done').length,
        { timeout: 500 },
      )
      .toBe(doneCountBefore);

    // Assert done event count hasn't increased
    const doneCountAfter = capturedEvents.filter((e) => e.kind === 'done').length;
    expect(doneCountAfter).toBe(doneCountBefore);
  });
});
