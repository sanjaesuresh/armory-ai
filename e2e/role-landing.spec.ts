import { test, expect } from '@playwright/test';

// Mirror of lib/catalog/roles.ts — hardcoded here to avoid import-resolution
// issues in the Playwright Node.js runner.
const ROLES = [
  { id: 'marketing-manager',    label: 'Marketing Manager' },
  { id: 'small-business-owner', label: 'Small Business Owner' },
  { id: 'customer-support',     label: 'Customer Support' },
  { id: 'recruiter',            label: 'Recruiter' },
  { id: 'sales-rep',            label: 'Sales Rep' },
  { id: 'operations',           label: 'Operations' },
  { id: 'founder-generalist',   label: 'Founder / Generalist' },
];

// ── Each role page: headline, setup cards, CTA ─────────────────────────────

for (const role of ROLES) {
  test(`/for/${role.id} — renders headline, at least one setup card, and role-catalog CTA`, async ({
    page,
  }) => {
    await page.goto(`/for/${role.id}`);

    // Single h1 containing the role label (as a substring of a pluralized headline).
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const heading = (await h1.textContent()) ?? '';
    expect(heading.toLowerCase()).toContain(role.label.toLowerCase());

    // At least one setup card visible.
    const firstCard = page.locator('[data-testid^="setup-card-"]').first();
    await expect(firstCard).toBeVisible();

    // CTA link to the role-filtered professionals dashboard.
    const cta = page.locator(`a[href="/professionals?role=${role.id}"]`).first();
    await expect(cta).toBeVisible();
  });
}

// ── Per-role: title and meta description contain the role name ─────────────

for (const role of ROLES) {
  test(`/for/${role.id} — page title and meta description contain the role name`, async ({
    page,
  }) => {
    await page.goto(`/for/${role.id}`);

    // Page title contains the role label (role.label is always a substring of
    // the pluralized headline used as the title).
    const title = await page.title();
    expect(title.toLowerCase()).toContain(role.label.toLowerCase());

    // Meta description contains the role label.
    const content =
      (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
    expect(content.toLowerCase()).toContain(role.label.toLowerCase());
  });
}

// ── Fallback label: fallback roles show "Nothing tailored" label ──────────

test('fallback role shows the honest popular label', async ({ page }) => {
  await page.goto('/for/recruiter');

  // Assert the fallback label is visible.
  const fallbackLabel = page.locator('text=/Nothing tailored for Recruiter yet/');
  await expect(fallbackLabel).toBeVisible();
});

test('tailored role does not show the fallback label', async ({ page }) => {
  await page.goto('/for/marketing-manager');

  // Assert the fallback label is NOT present (count 0 / not visible).
  const fallbackLabel = page.locator('text=/Nothing tailored/');
  await expect(fallbackLabel).not.toBeVisible();

  // AND assert at least one setup card is visible (so the absence isn't because the page is empty).
  const firstCard = page.locator('[data-testid^="setup-card-"]').first();
  await expect(firstCard).toBeVisible();
});

// ── Unknown role slug → 404 ────────────────────────────────────────────────

test('unknown role slug returns 404', async ({ page }) => {
  const response = await page.goto('/for/unknown-role-xyz');
  expect(response?.status()).toBe(404);
});

// ── Sitemap includes every role landing page ───────────────────────────────

test('sitemap includes every role landing page', async ({ page }) => {
  const response = await page.request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const body = await response.text();
  for (const role of ROLES) {
    expect(body).toContain(`/for/${role.id}`);
  }
});
