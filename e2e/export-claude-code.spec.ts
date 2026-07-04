/**
 * E2E for the Claude Code export target's picker and walkthrough.
 *
 * The only curated setup (marketing-manager) targets claude-app only, so the
 * real-flow assertion that involves choosing Claude Code requires a multi-target
 * setup seeded into Supabase, which this environment cannot provision. The tests
 * below that depend on such a setup are gated with test.skip — extend them when
 * a setup with targets: ['claude-app', 'claude-code'] is seeded.
 *
 * The deterministic path (component tests) is covered in:
 *   components/ExportView.test.tsx  — target-picker renders claude-code option
 *   components/InstallView.test.tsx — InstallView renders claude-code walkthrough
 *
 * When the seeded setup is available, extend this file to:
 *   1. Navigate to /export?setup=<multi-target-slug> with the target set to claude-code
 *   2. Assert the heading reads "Export to Claude Code"
 *   3. Assert the "Install in Claude Code, step by step" CTA is present
 *   4. Click through to /install and assert the Claude Code walkthrough is shown
 */

import { test, expect } from '@playwright/test';

test(
  'a setup targeting only the Claude app never shows the Claude Code target option',
  async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem(
        'armory-export-state',
        JSON.stringify({
          slug: 'marketing-manager',
          answers: {
            brandName: 'Acme',
            channels: ['Email'],
            tone: 'Professional',
          },
          attachments: {},
        }),
      );
    });
    await page.goto('/export?setup=marketing-manager');

    // Single-target setup: no picker; Claude Code option card is absent.
    await expect(page.getByRole('heading', { name: /Export to Claude/i })).toBeVisible();
    await expect(page.getByTestId('target-claude-code')).toHaveCount(0);
  },
);

// ─── Gated: needs a multi-target setup with 'claude-code' in targets ──────────
// Extend and un-skip when such a setup is seeded in the dev/staging Supabase DB.

test.skip(
  'choosing Claude Code as the target shows its walkthrough CTA and completes to the success state',
  async ({ page }) => {
    // Seed sessionStorage with a hypothetical multi-target setup slug.
    // Replace 'multi-target-setup' with the real slug when available.
    await page.addInitScript(() => {
      sessionStorage.setItem(
        'armory-export-state',
        JSON.stringify({
          slug: 'multi-target-setup',
          answers: { brandName: 'Acme' },
          attachments: {},
          target: 'claude-code',
        }),
      );
    });
    await page.goto('/export?setup=multi-target-setup');

    // Target picker must be visible
    await expect(page.getByTestId('target-picker')).toBeVisible();

    // Select the Claude Code option
    const claudeCodeInput = (await page.getByTestId('target-claude-code')).locator('input');
    await claudeCodeInput.click();

    // Heading updates
    await expect(page.getByRole('heading', { name: /Export to Claude Code/i })).toBeVisible();

    // Claude Code install CTA is present
    await expect(page.getByTestId('claude-code-install-link')).toBeVisible();

    // Navigate to /install
    await page.getByTestId('claude-code-install-link').click();
    await page.waitForURL(/\/install/);

    // InstallView shows the Claude Code walkthrough
    await expect(page.getByRole('heading', { name: /Install in Claude Code/i })).toBeVisible();
    // First step is about opening the project
    await expect(page.getByText(/Open your project in Claude Code/i)).toBeVisible();
  },
);
