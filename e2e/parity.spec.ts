import { test, expect } from '@playwright/test';
import type { CompiledSetup } from '@/lib/setup/types';
import { PARITY_ANSWERS } from '@/tests/fixtures/parityAnswers';

test('/api/compile rejects malformed answers with 400', async ({ request }) => {
  const nullResponse = await request.post('/api/compile', {
    data: { answers: null },
  });
  expect(nullResponse.status()).toBe(400);

  const stringResponse = await request.post('/api/compile', {
    data: { answers: 'nope' },
  });
  expect(stringResponse.status()).toBe(400);
});

test('client and server compileSetup produce identical instruction and summary', async ({
  page,
  request,
}) => {
  // 1. Navigate to the client parity page and read browser-rendered output.
  await page.goto('/dev/parity');
  const clientInstruction = await page.getByTestId('client-instruction').innerText();
  const clientSummary = await page.getByTestId('client-summary').innerText();

  // 2. Call the server route with the same answers.
  const response = await request.post('/api/compile', {
    data: { answers: PARITY_ANSWERS },
  });
  expect(response.ok()).toBeTruthy();
  const compiled = (await response.json()) as CompiledSetup;

  // 3. Assert byte-for-byte equality.
  expect(clientInstruction).toBe(compiled.instruction);
  expect(clientSummary).toBe(compiled.summary);
});
