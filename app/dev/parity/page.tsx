'use client';

import { notFound } from 'next/navigation';
import { compileSetup } from '@/lib/setup/compiler';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import { PARITY_ANSWERS } from '@/tests/fixtures/parityAnswers';

export default function ParityPage() {
  // Parity-test infrastructure only (Task 7) — never exposed in production.
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const compiled = compileSetup(marketingManagerSetup, PARITY_ANSWERS);

  return (
    <main>
      <pre data-testid="client-instruction">{compiled.instruction}</pre>
      <p data-testid="client-summary">{compiled.summary}</p>
    </main>
  );
}
