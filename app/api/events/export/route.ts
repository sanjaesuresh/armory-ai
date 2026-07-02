import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/client';
import { validateExportEventPayload } from '@/lib/analytics/exportEvents';

/**
 * POST /api/events/export
 *
 * Records an anonymous export event. Validates with validateExportEventPayload,
 * inserts into export_events via the anon-key Supabase client (RLS allows INSERT),
 * returns 204 with no body. Any insert error is swallowed — the export flow must
 * never be disrupted by analytics.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const result = validateExportEventPayload(body);
  if (!result.ok) {
    return new NextResponse(null, { status: 400 });
  }

  const { payload } = result;

  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from('export_events').insert({
      setup_slug: payload.setupSlug,
      target: payload.target,
      branch: payload.branch,
      kind: payload.kind,
    });
    if (error) {
      console.error('[export-events] insert error:', error.message);
    }
  } catch (err) {
    console.error('[export-events] unexpected error:', err);
  }

  return new NextResponse(null, { status: 204 });
}
