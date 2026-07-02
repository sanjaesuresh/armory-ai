import { test, expect } from '@playwright/test';

/**
 * Honesty spec: asserts that no fabricated social proof leaks onto real pages.
 * Checks for star glyphs, review/rating/install text, and dead CSS classes
 * (.stars, .avatars, .review-item) that should not be rendered.
 */

const EXPORT_STATE = {
  slug: 'marketing-manager',
  answers: {
    brandName: 'HonestyCo',
    channels: ['Email'],
    tone: 'Professional',
  },
  attachments: {},
};

async function seedExport(page: import('@playwright/test').Page) {
  await page.addInitScript((state) => {
    sessionStorage.setItem('armory-export-state', JSON.stringify(state));
  }, EXPORT_STATE);
}

const PAGES = [
  { name: 'landing', path: '/', seed: false },
  { name: 'catalog', path: '/catalog', seed: false },
  { name: 'setup-detail', path: '/setup/marketing-manager', seed: false },
  { name: 'export', path: '/export?setup=marketing-manager', seed: true },
];

for (const { name, path, seed } of PAGES) {
  test(`${name}: no star glyphs in main content`, async ({ page }) => {
    if (seed) await seedExport(page);
    await page.goto(path);
    const main = page.locator('main, [role="main"]').first();
    const text = await main.textContent().catch(() => '');
    // No star glyphs (★ U+2605 or ⭐ U+2B50)
    expect(text).not.toMatch(/[★⭐]/);
  });

  test(`${name}: no fabricated review/rating/install text`, async ({ page }) => {
    if (seed) await seedExport(page);
    await page.goto(path);
    const main = page.locator('main, [role="main"]').first();
    const text = (await main.textContent().catch(() => '')) ?? '';
    // Match plural forms only — "install" is a legitimate verb in this app's copy
    expect(text.toLowerCase()).not.toMatch(/\breviews\b/);
    expect(text.toLowerCase()).not.toMatch(/\bratings\b/);
    expect(text.toLowerCase()).not.toMatch(/\binstalls\b/);
  });

  test(`${name}: no .stars element rendered`, async ({ page }) => {
    if (seed) await seedExport(page);
    await page.goto(path);
    await expect(page.locator('.stars')).toHaveCount(0);
  });

  test(`${name}: no .avatars element rendered`, async ({ page }) => {
    if (seed) await seedExport(page);
    await page.goto(path);
    await expect(page.locator('.avatars')).toHaveCount(0);
  });

  test(`${name}: no .review-item element rendered`, async ({ page }) => {
    if (seed) await seedExport(page);
    await page.goto(path);
    await expect(page.locator('.review-item')).toHaveCount(0);
  });
}
