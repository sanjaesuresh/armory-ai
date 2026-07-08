/**
 * Learn AI e2e specs.
 *
 * Anonymous, DB-free (no test.skip gating needed).
 *
 * All localStorage persistence assertions live in one browser context — the
 * reload and continue-banner tests use page.reload() / continued navigation,
 * not a new context, because each browser context starts with fresh
 * localStorage.
 *
 * Signed-in Supabase sync is NOT covered here; it is unit-tested in the
 * progress store tests. Live-DB behavior (learn_progress table, RLS) is on the
 * deferred list.
 */

import { test, expect } from '@playwright/test';

// ── 1. Nav ─────────────────────────────────────────────────────────────────────

test('nav includes a "Learn AI" link pointing to /learn', async ({ page }) => {
  await page.goto('/');
  // Main nav has aria-label="Main" (see Nav.tsx)
  const mainNav = page.getByRole('navigation', { name: 'Main' });
  const link = mainNav.getByRole('link', { name: 'Learn AI' });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/learn');
});

// ── 2. Hub structure ───────────────────────────────────────────────────────────

test('/learn renders four track sections in order with sixteen lesson cards', async ({
  page,
}) => {
  await page.goto('/learn');

  // Four <section class="track-section" id="<slug>"> elements in TRACKS order
  const sections = page.locator('section.track-section');
  await expect(sections).toHaveCount(4);
  await expect(sections.nth(0)).toHaveAttribute('id', 'foundations');
  await expect(sections.nth(1)).toHaveAttribute('id', 'chatgpt');
  await expect(sections.nth(2)).toHaveAttribute('id', 'claude-app');
  await expect(sections.nth(3)).toHaveAttribute('id', 'claude-code');

  // Sixteen lesson cards (each is an <a class="lesson-card">)
  await expect(page.locator('a.lesson-card')).toHaveCount(16);
});

// ── 3. Lesson page: title and blocks ──────────────────────────────────────────

test('context-window lesson page shows its title and content blocks', async ({
  page,
}) => {
  await page.goto('/learn');

  // Navigate via the lesson card link
  const card = page.locator(
    'a.lesson-card[href="/learn/foundations/context-window"]',
  );
  await expect(card).toBeVisible();
  await card.click();
  await expect(page).toHaveURL('/learn/foundations/context-window');

  // Lesson title (h1) is visible
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    "Context: your AI's working memory",
  );

  // At least one prose-block heading is rendered
  await expect(
    page.getByRole('heading', { name: /context window is everything/i }),
  ).toBeVisible();

  // The context-meter customWidget block is rendered
  await expect(
    page.getByRole('heading', { name: 'Fill the context window' }),
  ).toBeVisible();
});

// ── 4. Flip card ───────────────────────────────────────────────────────────────

test('a flip card on how-ai-chat-works flips to its definition on click', async ({
  page,
}) => {
  await page.goto('/learn/foundations/how-ai-chat-works');

  // FlipCardsBlock renders buttons with aria-label "{term}, flip card"
  // and aria-pressed tracking the flipped state.
  const flipBtn = page
    .getByRole('button', { name: /, flip card$/i })
    .first();
  await expect(flipBtn).toBeVisible();
  await expect(flipBtn).toHaveAttribute('aria-pressed', 'false');

  await flipBtn.click();

  await expect(flipBtn).toHaveAttribute('aria-pressed', 'true');
});

// ── 5. Context-meter widget ────────────────────────────────────────────────────

test('context-meter widget on context-window lesson updates its meter on "Add a message" click', async ({
  page,
}) => {
  await page.goto('/learn/foundations/context-window');

  // The meter div has role="meter" and aria-label="Context window usage"
  const meter = page.getByRole('meter', { name: 'Context window usage' });
  await expect(meter).toBeVisible();

  // Initial state: 0% (no segments)
  await expect(meter).toHaveAttribute('aria-valuenow', '0');

  // One message segment = 15 pct points (per DEFS in ContextMeter.tsx)
  await page.getByRole('button', { name: 'Add a message' }).click();

  await expect(meter).toHaveAttribute('aria-valuenow', '15');
});

// ── 6. Quiz → results → hub completion → reload → continue banner ─────────────
//
// One browser context so the reload and continue-banner assertions share
// the same localStorage state as the quiz completion above.

test(
  'completing the context-window quiz shows results, marks the card completed with a score badge, persists on reload, and shows a continue banner after a second lesson visit',
  async ({ page }) => {
    // ── 6a. Open the context-window lesson ──────────────────────────────────
    await page.goto('/learn/foundations/context-window');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      "Context: your AI's working memory",
    );

    // ── 6b. Answer all four quiz questions (all correct) ─────────────────────
    // context-window quiz correctIndexes: [1, 2, 1, 1]  (see context-window.ts)
    const correctIndexes = [1, 2, 1, 1];
    for (let q = 0; q < correctIndexes.length; q++) {
      // QuizBlock renders choices as role="radio" buttons inside a radiogroup.
      const choices = page.getByRole('radio');
      await choices.nth(correctIndexes[q]).click();
      await page.getByRole('button', { name: 'Submit answer' }).click();
      if (q < correctIndexes.length - 1) {
        await page.getByRole('button', { name: 'Next question' }).click();
      } else {
        await page.getByRole('button', { name: 'See results' }).click();
      }
    }

    // ── 6c. Results screen shows the score ───────────────────────────────────
    // QuizBlock renders: <div role="region" aria-label="Quiz results">
    const results = page.getByRole('region', { name: 'Quiz results' });
    await expect(results).toBeVisible();
    await expect(results).toContainText('100%');
    await expect(results).toContainText('4 of 4 correct');

    // ── 6d. Return to the Learn AI hub via the breadcrumb link ───────────────
    // LessonPlayer breadcrumb: <Link href="/learn#foundations">Back to Learn AI</Link>
    await page.getByRole('link', { name: 'Back to Learn AI' }).click();
    await expect(page).toHaveURL(/\/learn/);

    // ── 6e. Hub shows context-window card as completed with a score badge ─────
    // LearnHub loads from localStorage after mount (async but fast for anonymous).
    // Playwright retries the assertion until the UI re-renders.
    const contextCard = page.locator(
      'a.lesson-card[href="/learn/foundations/context-window"]',
    );
    await expect(contextCard.getByText('Completed')).toBeVisible();
    // LessonCard renders <span aria-label="Score: 100%"> when bestScorePct=100
    await expect(contextCard.locator('[aria-label="Score: 100%"]')).toBeVisible();

    // ── 6f. Foundations track ring has advanced (1 of 3 lessons done) ─────────
    // ProgressRing: <div role="img" aria-label="{completed} of {total} completed">
    const foundationsSection = page.locator('section#foundations');
    await expect(
      foundationsSection.getByRole('img', { name: '1 of 3 completed' }),
    ).toBeVisible();

    // ── 6g. Reload the hub — localStorage state persists ────────────────────
    await page.reload();

    const contextCardAfterReload = page.locator(
      'a.lesson-card[href="/learn/foundations/context-window"]',
    );
    await expect(contextCardAfterReload.getByText('Completed')).toBeVisible();
    await expect(
      contextCardAfterReload.locator('[aria-label="Score: 100%"]'),
    ).toBeVisible();

    // ── 6h. Visit a second lesson (how-ai-chat-works) ────────────────────────
    // Clicking the card navigates to the lesson; LessonPlayer.useEffect calls
    // markStarted, which saves in-progress status to localStorage synchronously.
    const secondCard = page.locator(
      'a.lesson-card[href="/learn/foundations/how-ai-chat-works"]',
    );
    await secondCard.click();
    await expect(page).toHaveURL('/learn/foundations/how-ai-chat-works');
    // Wait for the lesson to be fully rendered (markStarted fires in useEffect
    // after paint; awaiting the h1 gives the effect time to run).
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'What happens when you press send',
    );

    // ── 6i. Return to hub — continue banner names the second lesson ──────────
    // how-ai-chat-works (order 1) is now in-progress; context-window (order 2)
    // is completed. continueTarget returns the first in-progress lesson in
    // curriculum order → how-ai-chat-works.
    await page.getByRole('link', { name: 'Back to Learn AI' }).click();
    await expect(page).toHaveURL(/\/learn/);

    // The continue banner: <div aria-label="Continue where you left off">
    const banner = page.locator('[aria-label="Continue where you left off"]');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('What happens when you press send');
  },
);
