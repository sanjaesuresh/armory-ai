import { NextResponse } from 'next/server';
import { compileSetup } from '@/lib/setup/compiler';
import { marketingManagerSetup } from '@/data/curated/marketing-manager';
import type { Answers } from '@/lib/setup/types';

function isAnswers(value: unknown): value is Answers {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.values(value as Record<string, unknown>).every((v) => {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      return true;
    }
    if (Array.isArray(v)) {
      return v.every((item) => typeof item === 'string');
    }
    return false;
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  // Parity-test infrastructure only (Task 7) — never exposed in production.
  // The Phase 2 test-drive endpoint will be a separate, metered route.
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || !('answers' in body)) {
    return NextResponse.json({ error: 'Missing answers field' }, { status: 400 });
  }

  const raw = (body as { answers: unknown }).answers;
  if (!isAnswers(raw)) {
    return NextResponse.json({ error: 'Invalid answers: must be a plain object mapping keys to string, number, boolean, or string[]' }, { status: 400 });
  }
  const answers: Answers = raw;

  try {
    const compiled = compileSetup(marketingManagerSetup, answers);
    return NextResponse.json(compiled);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
