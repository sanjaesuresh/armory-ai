import { test, expect } from '@playwright/test';

/**
 * E2E tests for the /export page — bundle-blocks layout.
 *
 * The export page shows a 3-column layout:
 *   Left  — "What's included" checklist
 *   Center — bundle tabs (one per block + Project settings) + plan segmented control
 *   Right  — export option-cards + Download button
 *
 * Tests use the marketing-manager setup seeded via the wizard or direct
 * sessionStorage injection.
 */

// Helper: fill wizard and navigate to /export
async function goToExport(page: import('@playwright/test').Page, brandName = 'TestBrand') {
  await page.goto('/setup/marketing-manager/customize');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();

  await page.getByLabel('Brand name', { exact: false }).fill(brandName);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  const exportBtn = page.getByRole('button', { name: 'Export to Claude' });
  await expect(exportBtn).toBeEnabled();
  await exportBtn.click();
  await page.waitForURL(/\/export\?setup=marketing-manager/);
}

// Helper: seed sessionStorage directly (faster for some tests)
async function seedAndGo(
  page: import('@playwright/test').Page,
  overrides: Record<string, unknown> = {},
) {
  const state = {
    slug: 'marketing-manager',
    answers: {
      brandName: 'TestBrand',
      channels: ['Email'],
      tone: 'Professional',
    },
    attachments: {},
    ...overrides,
  };
  await page.addInitScript((s) => {
    sessionStorage.setItem('armory-export-state', JSON.stringify(s));
  }, state);
  await page.goto('/export?setup=marketing-manager');
}

test.describe('export page — bundle tabs', () => {
  test(
    'instruction tab is active by default and its Copy button writes compiled content to clipboard',
    async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await goToExport(page, 'TestBrand');

      // Instruction tab should be selected by default
      const instructionTab = page.getByRole('tab', { name: 'custom-instructions.md' });
      await expect(instructionTab).toBeVisible();
      await expect(instructionTab).toHaveAttribute('aria-selected', 'true');

      // The visible copy block (instruction panel)
      const copyBlock = page.locator('[data-testid="copy-block"]').filter({ hasText: 'Custom instructions' });
      await expect(copyBlock).toBeVisible();

      // Click copy — assert clipboard contains the typed brand name
      await copyBlock.getByTestId('copy-btn').click();
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toContain('TestBrand');
    },
  );

  test(
    'switching to knowledge-file tab reveals that block and its Copy button',
    async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await seedAndGo(page);

      // marketing-manager's starter knowledge file name is 'Brand quick-facts'
      // so the tab label is exactly 'Brand quick-facts'
      const knowledgeTab = page.getByRole('tab', { name: 'Brand quick-facts', exact: true });
      await expect(knowledgeTab).toBeVisible();
      await knowledgeTab.click();
      await expect(knowledgeTab).toHaveAttribute('aria-selected', 'true');

      // Now the knowledge copy block is visible
      const activePanel = page.locator('[role="tabpanel"]:not([hidden])');
      await expect(activePanel.getByTestId('copy-block')).toBeVisible();
      await expect(activePanel.getByTestId('copy-btn')).toBeVisible();
    },
  );

  test(
    'Project settings tab shows project name and configuration summary',
    async ({ page }) => {
      await seedAndGo(page);

      const configTab = page.getByRole('tab', { name: 'Project settings' });
      await expect(configTab).toBeVisible();
      await configTab.click();
      await expect(configTab).toHaveAttribute('aria-selected', 'true');

      // Project name uses the brand
      const activePanel = page.locator('[role="tabpanel"]:not([hidden])');
      await expect(activePanel).toContainText('TestBrand');
      await expect(activePanel).toContainText('custom-instructions.md');
    },
  );

  test(
    'arrow keys navigate the tablist (roving tabindex)',
    async ({ page }) => {
      await seedAndGo(page);

      const instructionTab = page.getByRole('tab', { name: 'custom-instructions.md' });
      await instructionTab.focus();
      await page.keyboard.press('ArrowRight');

      // Focus moved to next tab (the knowledge file tab — 'Brand quick-facts')
      const knowledgeTab = page.getByRole('tab', { name: 'Brand quick-facts', exact: true });
      await expect(knowledgeTab).toBeFocused();
      await expect(knowledgeTab).toHaveAttribute('aria-selected', 'true');
    },
  );
});

test.describe('export page — plan segmented control', () => {
  test(
    'choosing Pro reveals "Install in Claude, step by step" CTA linking to /install',
    async ({ page }) => {
      await seedAndGo(page);

      const proBtn = page.getByRole('group', { name: 'Claude plan' }).getByRole('button', {
        name: 'Yes, I have Pro',
      });
      await proBtn.click();
      await expect(proBtn).toHaveAttribute('aria-pressed', 'true');

      const installLink = page.getByRole('link', { name: /Install in Claude/i });
      await expect(installLink).toBeVisible();
      await expect(installLink).toHaveAttribute('href', '/install');
    },
  );

  test(
    'choosing free plan reveals inline 3-step instructions (no navigation)',
    async ({ page }) => {
      await seedAndGo(page);

      const freeBtn = page.getByRole('group', { name: 'Claude plan' }).getByRole('button', {
        name: 'No, free plan',
      });
      await freeBtn.click();
      await expect(freeBtn).toHaveAttribute('aria-pressed', 'true');

      // Three inline steps visible — no walkthrough, no "Step N of M"
      await expect(page.getByText(/paste it at the start of a new Claude conversation/i)).toBeVisible();
      await expect(page.getByText(/Paste the knowledge-file content/i)).toBeVisible();
      await expect(page.getByText(/Send your first request/i)).toBeVisible();

      // No "Step N of M" tracker (that was the old walkthrough UI)
      await expect(page.getByText(/Step 1 of/)).not.toBeVisible();
    },
  );
});

test.describe('export page — download', () => {
  test(
    'Download bundle (.md) button triggers a download named armory-{slug}-bundle.md',
    async ({ page }) => {
      await seedAndGo(page);

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByTestId('download-btn').click(),
      ]);

      expect(download.suggestedFilename()).toBe('armory-marketing-manager-bundle.md');
    },
  );
});

test.describe('export page — blocking states', () => {
  test(
    'over-limit compiled setup shows blocking message naming the excess, no copy blocks',
    async ({ page }) => {
      // 2000-char brand name × ~3 substitutions ≈ 6000+ chars → INSTRUCTION_TOO_LONG
      const longBrandName = 'x'.repeat(2000);

      await page.goto('/export?setup=marketing-manager');
      await page.evaluate((brand) => {
        sessionStorage.setItem(
          'armory-export-state',
          JSON.stringify({
            slug: 'marketing-manager',
            answers: { brandName: brand, channels: ['Email'], tone: 'Professional' },
            attachments: {},
          }),
        );
      }, longBrandName);
      await page.reload();

      // Blocking message must appear
      await expect(page.getByTestId('overlimit-message')).toBeVisible();

      // No copy blocks rendered
      await expect(page.locator('[data-testid="copy-block"]')).toHaveCount(0);

      // "Edit your setup" link must be present and point to /customize
      const editLink = page.getByRole('link', { name: /Edit your setup/i });
      await expect(editLink).toBeVisible();
      await expect(editLink).toHaveAttribute('href', /\/customize$/);
    },
  );

  test(
    'missing sessionStorage shows start-over state with a link to /catalog',
    async ({ page }) => {
      // Navigate without seeding sessionStorage
      await page.goto('/export?setup=marketing-manager');

      // Should show a start-over message, not a walkthrough or copy blocks
      await expect(page.getByText(/couldn't find your answers/i)).toBeVisible();
      // Scope to main to avoid nav/footer links
      await expect(page.locator('main').getByRole('link', { name: /Browse setups/i })).toBeVisible();
      await expect(page.locator('[data-testid="copy-block"]')).toHaveCount(0);
    },
  );
});

test.describe('export page — layout', () => {
  test(
    'trust cue is visible and contains the Armory team review statement',
    async ({ page }) => {
      await seedAndGo(page);

      await expect(page.getByTestId('trust-cue')).toBeVisible();
      await expect(page.getByTestId('trust-cue')).toContainText('Armory team');
    },
  );

  test(
    'What\'s included checklist shows custom instructions and project configuration',
    async ({ page }) => {
      await seedAndGo(page);

      // Scope to the checklist to avoid matching the bundle-tabs copy block labels
      const checklist = page.locator('.side-checklist');
      await expect(checklist.getByText('Custom instructions', { exact: true })).toBeVisible();
      await expect(checklist.getByText('Project configuration', { exact: true })).toBeVisible();
    },
  );

  test(
    'export target shows Claude Projects as recommended and ChatGPT as coming soon',
    async ({ page }) => {
      await seedAndGo(page);

      // Scope to option-cards to avoid matching other text on the page
      const cards = page.locator('.option-card');
      await expect(cards.filter({ hasText: 'Claude Projects' }).first()).toBeVisible();
      await expect(cards.filter({ hasText: 'ChatGPT Custom Instructions' }).first()).toBeVisible();
      await expect(page.locator('.status-soon').first()).toBeVisible();
    },
  );
});
