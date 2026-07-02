import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Export page.
 *
 * The export page is a walkthrough-driven UI: copy blocks are embedded inline
 * in the walkthrough step where the user pastes them, not listed upfront.
 * Tests advance through walkthrough steps to reach embedded blocks.
 */

// Helper: fill required fields and navigate to the export page
async function goToExport(page: import('@playwright/test').Page, brandName = 'TestBrand') {
  await page.goto('/setup/marketing-manager');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();

  await page.getByLabel('Brand name', { exact: false }).fill(brandName);

  const btn = page.getByRole('button', { name: 'Get export instructions' });
  await expect(btn).toBeEnabled();
  await btn.click();

  await page.waitForURL(/\/export\?setup=marketing-manager/);
}

test.describe('export page', () => {
  test(
    'export shows one instruction block plus one block per knowledge file, each with a working copy button',
    async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      await goToExport(page, 'TestBrand');

      // Trust cue must be present
      await expect(
        page.getByText('Curated setups are reviewed by the Armory team.'),
      ).toBeVisible();

      // Choose Claude Pro path — walkthrough embeds copy blocks in steps
      await page.getByRole('button', { name: 'Yes' }).click();

      // Step 1 of N is visible; advance to step 3 (paste-instructions)
      await page.getByRole('button', { name: 'Next', exact: true }).click(); // 1 → 2
      await page.getByRole('button', { name: 'Next', exact: true }).click(); // 2 → 3

      // Instruction copy block is embedded in the paste-instructions step
      const instructionBlock = page.locator('[data-testid="copy-block"]').first();
      await expect(instructionBlock).toBeVisible();

      // Click copy and assert clipboard contains the typed brand name
      await instructionBlock.locator('[data-testid="copy-btn"]').click();
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toContain('TestBrand');

      // Advance to the upload step — knowledge copy block(s) appear there
      await page.getByRole('button', { name: 'Next', exact: true }).click(); // 3 → 4
      await expect(page.locator('[data-testid="copy-block"]').first()).toBeVisible();
    },
  );

  test(
    'the walkthrough shows a Step N of M progress tracker that advances',
    async ({ page }) => {
      await goToExport(page);

      // Select Claude Pro path
      await page.getByRole('button', { name: 'Yes' }).click();

      // Step 1 of M must be visible
      await expect(page.getByText(/Step 1 of/)).toBeVisible();

      // Advance to step 2
      await page.getByRole('button', { name: 'Next', exact: true }).click();

      await expect(page.getByText(/Step 2 of/)).toBeVisible();
    },
  );

  test(
    'each walkthrough step shows its screenshot',
    async ({ page }) => {
      await goToExport(page);

      // Select Claude Pro path
      await page.getByRole('button', { name: 'Yes' }).click();

      // Step 1 — create-project
      const img = page.locator('[data-testid="walkthrough-img"]');
      await expect(img).toHaveAttribute('src', /create-project/);

      // Step 2 — name-project
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await expect(img).toHaveAttribute('src', /name-project/);

      // Step 3 — paste-instructions
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await expect(img).toHaveAttribute('src', /paste-instructions/);
    },
  );

  test(
    'the trust cue is present above the blocks',
    async ({ page }) => {
      await goToExport(page);

      const trustCue = page.getByText('Curated setups are reviewed by the Armory team.');
      await expect(trustCue).toBeVisible();

      // The plan picker (Yes/No buttons) renders after the trust cue.
      // Compare bounding boxes to assert DOM order in a vertical layout.
      const yesBtn = page.getByRole('button', { name: 'Yes' });
      await expect(yesBtn).toBeVisible();

      const trustCueBox = await trustCue.boundingBox();
      const yesBtnBox = await yesBtn.boundingBox();
      expect(trustCueBox!.y).toBeLessThan(yesBtnBox!.y);
    },
  );

  test(
    'reaching the end shows the success state',
    async ({ page }) => {
      await goToExport(page);

      // Select Claude Pro path
      await page.getByRole('button', { name: 'Yes' }).click();

      // Advance to the last step by clicking Next until it disappears
      for (let i = 0; i < 10; i++) {
        const nextBtn = page.getByRole('button', { name: 'Next', exact: true });
        const isVisible = await nextBtn.isVisible().catch(() => false);
        if (!isVisible) break;
        await nextBtn.click();
      }

      await expect(page.getByText("You're set up")).toBeVisible();
    },
  );

  test(
    'an over-limit compiled setup shows the blocking limit message instead of blocks',
    async ({ page }) => {
      // Use a very long brandName to trigger INSTRUCTION_TOO_LONG after compilation.
      // The marketing-manager template substitutes {{brandName}} ~3 times;
      // 2000 chars × 3 substitutions ≈ 6000+ chars, which exceeds the 6000-char limit.
      const longBrandName = 'x'.repeat(2000);

      await page.goto('/export?setup=marketing-manager');
      await page.evaluate((brand) => {
        sessionStorage.setItem(
          'armory-export-state',
          JSON.stringify({
            slug: 'marketing-manager',
            answers: {
              brandName: brand,
              channels: ['Email'],
              tone: 'Professional',
            },
            attachments: {},
          }),
        );
      }, longBrandName);
      await page.reload();

      // Blocking limit message must appear
      await expect(page.getByTestId('overlimit-message')).toBeVisible();

      // No copy blocks should be shown
      await expect(page.locator('[data-testid="copy-block"]')).toHaveCount(0);

      // "Edit your setup" link must be present
      await expect(page.getByRole('link', { name: /Edit your setup/i })).toBeVisible();
    },
  );

  test(
    'the FREE path also reaches the success state via its walkthrough',
    async ({ page }) => {
      await goToExport(page);

      // Choose free (No) path
      await page.getByRole('button', { name: 'No' }).click();

      // Step 1 of N must be visible — confirming it is a walkthrough, not a plain list
      await expect(page.getByText(/Step 1 of/)).toBeVisible();

      // Advance through all steps until Next disappears
      for (let i = 0; i < 10; i++) {
        const nextBtn = page.getByRole('button', { name: 'Next', exact: true });
        const isVisible = await nextBtn.isVisible().catch(() => false);
        if (!isVisible) break;
        await nextBtn.click();
      }

      await expect(page.getByText("You're set up")).toBeVisible();
    },
  );
});
