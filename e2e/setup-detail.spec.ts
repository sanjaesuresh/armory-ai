import { test, expect } from '@playwright/test';

test.describe('setup detail page', () => {
  test('detail page loads with setup name and description', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    await expect(page.locator('h1')).toContainText('Marketing Manager');
    // Description appears in the detail-head; use first() to avoid strict-mode
    // violation with the overview tabpanel that also includes description text.
    await expect(page.getByText(/Configure Claude as a senior marketing/).first()).toBeVisible();
  });

  test('back link points to /catalog', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    const backLink = page.getByRole('link', { name: 'All setups' });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/catalog');
  });

  test('spec plates are rendered', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    const specRow = page.getByRole('list', { name: 'Setup specifications' });
    await expect(specRow).toBeVisible();

    // Check specific spec plate labels
    await expect(specRow.getByText('Built for')).toBeVisible();
    await expect(specRow.getByText('Works with')).toBeVisible();
    await expect(specRow.getByText('Generates')).toBeVisible();
    await expect(specRow.getByText('Time to set up')).toBeVisible();
    await expect(specRow.getByText('Best for')).toBeVisible();
  });

  test('spec plate values are derived from real setup data', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    // "Built for" = setup.role
    await expect(page.getByText('Marketing Manager').nth(1)).toBeVisible();
    // "Works with" includes claude-app target
    await expect(page.getByText('Claude Projects · ChatGPT soon')).toBeVisible();
    // "Time to set up" is the generic estimate
    await expect(page.getByText('About 5 minutes')).toBeVisible();
  });

  test('tabs render and Overview is active by default', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    const tablist = page.getByRole('tablist', { name: 'Setup details' });
    await expect(tablist).toBeVisible();

    const overviewTab = page.getByRole('tab', { name: 'Overview' });
    await expect(overviewTab).toHaveAttribute('aria-selected', 'true');

    // Overview panel is visible by default
    await expect(page.getByRole('tabpanel', { name: 'Overview' })).toBeVisible();
  });

  test("clicking \"What's included\" tab shows included panel", async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    await page.getByRole('tab', { name: "What's included" }).click();
    const includedPanel = page.getByRole('tabpanel', { name: "What's included" });
    await expect(includedPanel).toBeVisible();
    // Scope to the panel to avoid strict-mode matches in spec plates / side card
    await expect(includedPanel.getByText('Custom instructions')).toBeVisible();
  });

  test('clicking "Example scenarios" tab shows scenario Q/A', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    await page.getByRole('tab', { name: 'Example scenarios' }).click();
    const scenariosPanel = page.getByRole('tabpanel', { name: 'Example scenarios' });
    await expect(scenariosPanel).toBeVisible();
    // The marketing-manager setup has a scenario about Smart Scheduling.
    // Use .first() because both the Q and A paragraphs mention "Smart Scheduling".
    await expect(scenariosPanel.getByText(/Smart Scheduling/).first()).toBeVisible();
  });

  test('arrow-key navigation moves between tabs', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    // Focus the Overview tab
    const overviewTab = page.getByRole('tab', { name: 'Overview' });
    await overviewTab.focus();
    await expect(overviewTab).toHaveAttribute('aria-selected', 'true');

    // Arrow right → "What's included"
    await page.keyboard.press('ArrowRight');
    const includedTab = page.getByRole('tab', { name: "What's included" });
    await expect(includedTab).toHaveAttribute('aria-selected', 'true');

    // Arrow right → "Example scenarios"
    await page.keyboard.press('ArrowRight');
    const scenariosTab = page.getByRole('tab', { name: 'Example scenarios' });
    await expect(scenariosTab).toHaveAttribute('aria-selected', 'true');

    // Arrow right wraps back to Overview
    await page.keyboard.press('ArrowRight');
    await expect(overviewTab).toHaveAttribute('aria-selected', 'true');
  });

  test('"Use this setup" CTA links to the customize page', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    // There are two "Use this setup" links (head + side card)
    const ctaLinks = page.getByRole('link', { name: 'Use this setup' });
    const count = await ctaLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // All must link to /customize
    for (let i = 0; i < count; i++) {
      await expect(ctaLinks.nth(i)).toHaveAttribute(
        'href',
        '/setup/marketing-manager/customize',
      );
    }
  });

  test('"Preview setup" button activates the scenarios tab', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    await page.getByRole('button', { name: 'Preview setup' }).click();
    const scenariosTab = page.getByRole('tab', { name: 'Example scenarios' });
    await expect(scenariosTab).toHaveAttribute('aria-selected', 'true');
  });

  test('side card shows derived checklist items', async ({ page }) => {
    await page.goto('/setup/marketing-manager');

    const aside = page.locator('aside');
    await expect(aside).toBeVisible();
    await expect(aside.getByText('What you\'ll get')).toBeVisible();
    await expect(aside.getByText('Custom instructions')).toBeVisible();
    await expect(aside.getByText('Export bundle for Claude Projects')).toBeVisible();
  });

  test('unknown slug returns 404', async ({ page }) => {
    const response = await page.goto('/setup/nonexistent-slug-xyz');
    // Next.js notFound() renders a 404 page
    expect(response?.status()).toBe(404);
  });
});
