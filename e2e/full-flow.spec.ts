import { test, expect } from '@playwright/test';

const BRAND = 'Flowmatic Coffee Co';

test('a non-technical user completes the loop', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  // ── 1. Landing → role picker ─────────────────────────────────────────────
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();

  const getStarted = page.getByRole('link', { name: 'Get started' });
  await expect(getStarted).toBeVisible();
  await getStarted.click();
  await expect(page).toHaveURL('/start');

  // ── 2. Role picker → catalog filtered by marketing-manager ───────────────
  const marketingCard = page.getByTestId('role-card-marketing-manager');
  await expect(marketingCard).toBeVisible();
  await marketingCard.click();
  await expect(page).toHaveURL('/catalog?role=marketing-manager');

  // ── 3. Catalog → setup page via the recommended card ────────────────────
  const recommendedSection = page.getByTestId('recommended-section');
  await expect(recommendedSection).toBeVisible();

  const setupCard = recommendedSection.getByTestId('setup-card-marketing-manager');
  await expect(setupCard).toBeVisible();

  // Click the card link — do NOT goto
  const cardLink = setupCard.getByTestId('card-link');
  await expect(cardLink).toHaveAttribute('href', '/setup/marketing-manager');
  await cardLink.click();
  await expect(page).toHaveURL('/setup/marketing-manager');

  // ── 4. Customize: fill required field, assert live preview, enable CTA ──
  // Playwright gives each test a fresh context (empty sessionStorage) so no
  // mid-flow clear/reload is needed — the page is already in a clean state
  // from the click-through navigation above.
  await expect(page.locator('h1')).toContainText('Marketing Manager');

  // Export button must be disabled before required fields are filled
  const exportBtn = page.getByRole('button', { name: 'Get export instructions' });
  await expect(exportBtn).toBeDisabled();

  // Fill the required brand name with our distinctive value
  await page.getByLabel('Brand name', { exact: false }).fill(BRAND);

  // Live preview should update to reflect the typed brand
  await expect(page.locator('[data-testid="customize-right"]')).toContainText(BRAND);

  // Export button is now enabled
  await expect(exportBtn).toBeEnabled();

  await exportBtn.click();
  await page.waitForURL(/\/export\?setup=marketing-manager/);

  // ── 5. Export: trust cue, Pro path, step tracker, copy seam, success ────
  // Trust cue must be visible above the walkthrough
  const trustCue = page.getByText('Curated setups are reviewed by the Armory team.');
  await expect(trustCue).toBeVisible();

  // Choose the Pro path
  const yesBtn = page.getByRole('button', { name: 'Yes' });
  await expect(yesBtn).toBeVisible();

  // Trust cue must appear above the Pro/No picker in vertical layout
  const trustCueBox = await trustCue.boundingBox();
  const yesBtnBox = await yesBtn.boundingBox();
  expect(trustCueBox).not.toBeNull();
  expect(yesBtnBox).not.toBeNull();
  expect(trustCueBox!.y).toBeLessThan(yesBtnBox!.y);

  await yesBtn.click();

  // Step 1 of M tracker appears immediately
  await expect(page.getByText(/Step 1 of/)).toBeVisible();

  // Advance: Step 1 → Step 2
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText(/Step 2 of/)).toBeVisible();

  // Advance: Step 2 → Step 3 (paste-instructions — contains instruction copy block)
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText(/Step 3 of/)).toBeVisible();

  // Scope to the step container holding the paste-instructions heading so the
  // copy-block selector is unambiguously about the instruction block, not any
  // later knowledge-file block. No data-testid exists on the step container in
  // ExportWalkthrough, so we scope via the stable heading text.
  const pasteStep = page.locator('div').filter({
    has: page.locator('h3', { hasText: 'Paste the custom instructions' }),
  });
  const instructionBlock = pasteStep.locator('[data-testid="copy-block"]').first();
  await expect(instructionBlock).toBeVisible();

  // KEY SEAM PROOF: click copy and assert clipboard contains the brand we typed
  await instructionBlock.locator('[data-testid="copy-btn"]').click();
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText).toContain(BRAND);

  // Advance through remaining steps until Next disappears
  let advanceCount = 0;
  for (let i = 0; i < 10; i++) {
    const nextBtn = page.getByRole('button', { name: 'Next', exact: true });
    const isVisible = await nextBtn.isVisible().catch(() => false);
    if (!isVisible) break;
    await nextBtn.click();
    advanceCount++;
  }
  // Guard: the loop must have actually advanced at least once (catches a silent
  // early exit that would let the "You're set up" assertion pass vacuously).
  expect(advanceCount).toBeGreaterThan(0);

  // Success state appears at the end of the walkthrough
  await expect(page.getByText("You're set up")).toBeVisible();
});
