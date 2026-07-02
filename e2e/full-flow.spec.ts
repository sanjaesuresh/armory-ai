import { test, expect } from '@playwright/test';

const BRAND = 'Flowmatic Coffee Co';

test('a non-technical user completes the loop', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  // ── 1. Landing → role picker ─────────────────────────────────────────────
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();

  // Scope to main; use the hero "Find my setup" CTA (first occurrence avoids export section)
  const findSetup = page.locator('main').getByRole('link', { name: 'Find my setup' }).first();
  await expect(findSetup).toBeVisible();
  await findSetup.click();
  await expect(page).toHaveURL('/start');

  // ── 2. Role picker → catalog filtered by marketing-manager ───────────────
  const marketingCard = page.getByTestId('role-card-marketing-manager');
  await expect(marketingCard).toBeVisible();
  await marketingCard.click();
  await expect(page).toHaveURL('/catalog?role=marketing-manager');

  // ── 3. Catalog → setup detail page via the recommended card ─────────────
  const recommendedSection = page.getByTestId('recommended-section');
  await expect(recommendedSection).toBeVisible();

  const setupCard = recommendedSection.getByTestId('setup-card-marketing-manager');
  await expect(setupCard).toBeVisible();

  // The card itself is the link — check href and click.
  await expect(setupCard).toHaveAttribute('href', '/setup/marketing-manager');
  await setupCard.click();
  await expect(page).toHaveURL('/setup/marketing-manager');

  // ── 4. Detail page: assert, then navigate to customize ──────────────────
  await expect(page.locator('h1')).toContainText('Marketing Manager');

  // Detail page shows spec plates and tabs — not the form
  await expect(
    page.getByRole('list', { name: 'Setup specifications' }),
  ).toBeVisible();
  await expect(
    page.getByRole('tablist', { name: 'Setup details' }),
  ).toBeVisible();

  // Click "Use this setup" to reach the customize page
  const useSetupLink = page
    .locator('.detail-ctas')
    .getByRole('link', { name: 'Use this setup' });
  await expect(useSetupLink).toBeVisible();
  await useSetupLink.click();
  await expect(page).toHaveURL('/setup/marketing-manager/customize');

  // ── 5. Customize wizard: fill required field, assert live preview, advance ─
  // The customize page now shows "Make it yours" as h1
  await expect(page.locator('h1')).toContainText('Make it yours');

  // Step 1 — About your brand: fill the brand name
  await page.getByLabel('Brand name', { exact: false }).fill(BRAND);

  // Live preview should update to reflect the typed brand
  await expect(page.locator('[data-testid="customize-right"]')).toContainText(BRAND);

  // Continue through all wizard steps to reach the Review step
  // Step 1 → 2 (Your channels — has defaults, valid)
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 2 → 3 (Tone & style — has default, valid)
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 3 → 4 (Knowledge files — no required user-provided files, valid)
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 4 → 5 (Review)
  await page.getByRole('button', { name: 'Continue' }).click();

  // On the Review step, the export CTA must now be enabled
  const exportBtn = page.getByRole('button', { name: 'Export to Claude' });
  await expect(exportBtn).toBeEnabled();

  await exportBtn.click();
  await page.waitForURL(/\/export\?setup=marketing-manager/);

  // ── 6. Export: 3-column bundle layout — trust cue, tabs, copy, Pro → /install ─

  // Trust cue (in left "What's included" column) must be visible
  await expect(page.getByTestId('trust-cue')).toBeVisible();
  await expect(page.getByTestId('trust-cue')).toContainText('Armory team');

  // Bundle tabs must be present; instruction tab is active by default
  const instructionTab = page.getByRole('tab', { name: 'custom-instructions.md' });
  await expect(instructionTab).toBeVisible();
  await expect(instructionTab).toHaveAttribute('aria-selected', 'true');

  // The instruction copy block is visible in the default active panel
  const instructionBlock = page
    .locator('[data-testid="copy-block"]')
    .filter({ hasText: 'Custom instructions' });
  await expect(instructionBlock).toBeVisible();

  // KEY SEAM PROOF: click copy and assert clipboard contains the brand we typed
  await instructionBlock.getByTestId('copy-btn').click();
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText).toContain(BRAND);

  // Choose Pro path via segmented control
  const proBtn = page
    .getByRole('group', { name: 'Claude plan' })
    .getByRole('button', { name: 'Yes, I have Pro' });
  await expect(proBtn).toBeVisible();
  await proBtn.click();
  await expect(proBtn).toHaveAttribute('aria-pressed', 'true');

  // "Install in Claude" CTA appears → navigate to /install
  const installLink = page.getByRole('link', { name: /Install in Claude/i });
  await expect(installLink).toBeVisible();
  await installLink.click();
  await expect(page).toHaveURL('/install');

  // ── 7. /install walk-rail: advance to final "You're set up" ─────────────
  // The walk-rail is present (marketing-manager has 5 steps)
  const rail = page.getByRole('group', { name: 'Install steps' });
  await expect(rail).toBeVisible();

  // Advance through all steps until Next disappears
  let advanceCount = 0;
  for (let i = 0; i < 10; i++) {
    const nextBtn = page.getByRole('button', { name: 'Next', exact: true });
    const isVisible = await nextBtn.isVisible().catch(() => false);
    if (!isVisible) break;
    await nextBtn.click();
    advanceCount++;
  }
  // Guard: must have advanced at least once
  expect(advanceCount).toBeGreaterThan(0);

  // Final step shows "You're set up" heading
  await expect(page.getByRole('heading', { name: "You're set up" })).toBeVisible();
});
