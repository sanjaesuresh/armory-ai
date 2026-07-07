/**
 * E2E tests for the setup detail page.
 *
 * Phase 4 (2026-07-06): updated for the inspector layout.
 * The tabbed interface is replaced by flat scrollable sections per docs/mock/detail2.
 * All content is always visible — no tab interaction required to reach any section.
 *
 * Changes from the pre-Phase-4 tests:
 * - Spec plates: the 5-box SpecPlateRow is replaced by a sidebar definition list
 *   with new labels (Exports to / You answer / Setup time). Tests updated accordingly.
 * - Tabs: removed — Overview / Included / Scenarios are now always-visible sections.
 *   Tab tests replaced by section-heading checks and always-visible content checks.
 * - "Use this setup" renamed to "Equip this setup" (matches the arsenal vocabulary).
 * - "Preview setup" renamed to "Test-drive first" (scrolls to the scenarios section).
 * - Side card: now holds the primary Equip action + spec list, not a checklist.
 *   The "What you'll get" checklist is in the content column.
 */

import { test, expect } from '@playwright/test';

test.describe('setup detail page', () => {
  test('detail page loads with setup name and description', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    await expect(page.locator('h1')).toContainText('Marketing Manager');
    // Description appears in the "What it is" section.
    await expect(
      page.getByText(/Configure Claude as a senior marketing/).first(),
    ).toBeVisible();
  });

  test('back link points to /professionals for a core setup', async ({
    page,
  }) => {
    await page.goto('/setup/marketing-manager');

    const backLink = page.getByRole('link', { name: 'All setups' });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/professionals');
  });

  /**
   * The 5-box spec plate row (SpecPlateRow) is replaced by a sidebar definition
   * list with labels that match the inspector mock: Exports to / You answer / Setup time.
   * Old labels (Built for, Works with, Generates, Best for) are retired.
   */
  test('spec definition list is rendered in the sidebar', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    const specList = page.getByRole('list', { name: 'Setup specifications' });
    await expect(specList).toBeVisible();

    await expect(specList.getByText('Exports to')).toBeVisible();
    await expect(specList.getByText('You answer')).toBeVisible();
    await expect(specList.getByText('Setup time')).toBeVisible();
  });

  test('spec definition list values are derived from real setup data', async ({
    page,
  }) => {
    await page.goto('/setup/marketing-manager');

    // marketing-manager targets claude-app → "Claude Projects · ChatGPT soon"
    await expect(
      page.getByText('Claude Projects · ChatGPT soon'),
    ).toBeVisible();
    // Setup time is the generic estimate
    await expect(page.getByText('About 5 minutes')).toBeVisible();
  });

  /**
   * The inspector layout uses flat scrollable sections, not tabs.
   * All sections are always visible — no click interaction needed.
   */
  test('inspector sections are visible without tab interaction', async ({
    page,
  }) => {
    await page.goto('/setup/marketing-manager');

    await expect(
      page.getByRole('heading', { name: 'What it is' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: "What you'll get" }),
    ).toBeVisible();
  });

  /**
   * "What you'll get" is now a checklist in the content column, always visible.
   * Previously revealed by clicking the "What's included" tab.
   */
  test("'What you'll get' checklist is always visible", async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    await expect(page.getByText("What you'll get")).toBeVisible();
    await expect(page.getByText('Custom instructions')).toBeVisible();
    await expect(
      page.getByText('Export bundle for Claude Projects'),
    ).toBeVisible();
  });

  /**
   * Scenarios appear in the "Try it on" section, always visible.
   * Previously revealed by clicking "Example scenarios" tab.
   */
  test("scenarios are visible in the 'Try it on' section", async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    await expect(page.getByText('Try it on')).toBeVisible();
    // The marketing-manager setup has a scenario about Smart Scheduling.
    await expect(page.getByText(/Smart Scheduling/).first()).toBeVisible();
  });

  /**
   * Keyboard accessibility: the primary CTA is a link (not a button) so it is
   * natively keyboard-focusable via Tab. Verify it can receive focus.
   */
  test('primary Equip CTA is keyboard-accessible', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    const equipLink = page
      .getByRole('link', { name: /Equip this setup/ })
      .first();
    await equipLink.focus();
    await expect(equipLink).toBeFocused();
  });

  /**
   * CTA label changed from "Use this setup" to "Equip this setup" per the
   * arsenal vocabulary (docs/mock/detail2). The href to /customize is unchanged.
   */
  test('"Equip this setup" CTA links to the customize page', async ({
    page,
  }) => {
    await page.goto('/setup/marketing-manager');

    const ctaLinks = page.getByRole('link', { name: /Equip this setup/ });
    const count = await ctaLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < count; i++) {
      await expect(ctaLinks.nth(i)).toHaveAttribute(
        'href',
        '/setup/marketing-manager/customize',
      );
    }
  });

  /**
   * "Preview setup" is renamed to "Test-drive first" in the sidebar.
   * Since scenarios are always visible in the flat layout, the button scrolls
   * to the "Try it on" section rather than activating a tab.
   */
  test('"Test-drive first" button is visible when scenarios exist', async ({
    page,
  }) => {
    await page.goto('/setup/marketing-manager');

    // marketing-manager has scenarios, so this button must render.
    const testDriveBtn = page.getByRole('button', { name: 'Test-drive first' });
    await expect(testDriveBtn).toBeVisible();

    // Scenarios are always visible — no click needed.
    await expect(page.getByText(/Smart Scheduling/).first()).toBeVisible();
  });

  /**
   * The sidebar now holds the primary Equip action and the spec definition list.
   * "What you'll get" moved to the content column — see the checklist test above.
   */
  test('sidebar has primary action and spec definition list', async ({
    page,
  }) => {
    await page.goto('/setup/marketing-manager');

    const aside = page.locator('aside');
    await expect(aside).toBeVisible();
    await expect(
      aside.getByRole('link', { name: /Equip this setup/ }),
    ).toBeVisible();
    await expect(aside.getByText('Exports to')).toBeVisible();
  });

  test('unknown slug returns 404', async ({ page }) => {
    const response = await page.goto('/setup/nonexistent-slug-xyz');
    // Next.js notFound() renders a 404 page
    expect(response?.status()).toBe(404);
  });
});
