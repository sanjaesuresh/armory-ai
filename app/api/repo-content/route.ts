/**
 * GET /api/repo-content?owner=&repo=&path=
 *
 * SERVER ONLY — reads GITHUB_TOKEN. Proxies the GitHub Contents API so the
 * registry detail page can show a repo's README + an expandable file tree
 * grounded in the real repo, without storing repo blobs in our catalog.
 *
 * Query params (client sends parts, never a URL — see repoContent.ts security note):
 *   owner  required  — validated charset
 *   repo   required  — validated charset
 *   path   optional  — sanitized; '' = repo root
 *
 * Responses:
 *   200 { ok: true,  content: RepoContent }   — dir listing or decoded file
 *   400 { ok: false, error }                  — missing/invalid owner|repo|path
 *   404 { ok: false, error }                  — path missing or upstream unavailable
 *
 * The client treats any non-200 as "hide the Repository section" — it is
 * additive and must never break the page.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { parseRepoUrl, sanitizeRepoPath, fetchRepoContent } from '@/lib/registry/repoContent';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const rawPath = searchParams.get('path');

  // reuse parseRepoUrl's validated charset by round-tripping through a synthetic URL
  const parsed = parseRepoUrl(`https://github.com/${owner}/${repo}`);
  if (!parsed) {
    return NextResponse.json({ ok: false, error: 'invalid owner or repo' }, { status: 400 });
  }

  const path = sanitizeRepoPath(rawPath);
  if (path === null) {
    return NextResponse.json({ ok: false, error: 'invalid path' }, { status: 400 });
  }

  const content = await fetchRepoContent(parsed.owner, parsed.repo, path);
  if (!content) {
    return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, content });
}
