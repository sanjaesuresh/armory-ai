/**
 * repoContent — grounded GitHub repo browsing for registry detail pages.
 *
 * Pure, testable helpers (parseRepoUrl / sanitizeRepoPath / normalizeEntries)
 * plus fetchRepoContent, which proxies the GitHub Contents API server-side.
 *
 * SERVER ONLY for fetchRepoContent (reads GITHUB_TOKEN). The pure helpers are
 * safe anywhere. The API route (app/api/repo-content) is the only caller.
 *
 * Security: the client sends only owner / repo / path — never a URL. We rebuild
 * the api.github.com URL from validated parts (strict owner/repo charset, path
 * segments rejected on `..` or unexpected characters), so a caller cannot point
 * the fetch at an arbitrary host (SSRF) or traverse outside the repo.
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface RepoEntry {
  name: string;
  path: string;
  type: 'dir' | 'file';
  /** bytes, files only */
  size?: number;
}

export type RepoContent =
  | { type: 'dir'; path: string; entries: RepoEntry[] }
  | { type: 'file'; path: string; name: string; content: string; size: number; truncated: boolean };

// ── Validation / pure helpers ───────────────────────────────────────────────────

// GitHub owner + repo allow letters, digits, hyphen, underscore, dot.
const NAME_RE = /^[A-Za-z0-9._-]{1,100}$/;
// One path segment: no slashes here (we split first); no `..`; conservative charset.
const SEGMENT_RE = /^[A-Za-z0-9._ ()+-]{1,255}$/;

/** Parse a github.com repo URL into {owner, repo}. Returns null if not a valid GitHub repo URL. */
export function parseRepoUrl(url: string | null | undefined): { owner: string; repo: string } | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (u.hostname !== 'github.com' && u.hostname !== 'www.github.com') return null;
  const parts = u.pathname.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  const owner = parts[0];
  // strip a trailing .git if present on the repo segment
  const repo = parts[1].replace(/\.git$/, '');
  if (!NAME_RE.test(owner) || !NAME_RE.test(repo)) return null;
  return { owner, repo };
}

/**
 * Sanitize a client-supplied repo path. Returns the cleaned path (may be '')
 * or null if any segment is unsafe. Rejects `..`, control chars, and segments
 * outside the conservative charset.
 */
export function sanitizeRepoPath(path: string | null | undefined): string | null {
  if (!path) return '';
  if (path.length > 400) return null;
  const segments = path.split('/').filter(Boolean);
  for (const seg of segments) {
    if (seg === '..' || seg === '.') return null;
    if (!SEGMENT_RE.test(seg)) return null;
  }
  return segments.join('/');
}

/** Normalize + sort a GitHub dir listing: directories first, then files, alpha within each. Capped. */
export function normalizeEntries(
  raw: Array<{ name: string; path: string; type: string; size?: number }>,
  cap = 400,
): RepoEntry[] {
  const mapped: RepoEntry[] = raw
    .filter((e) => e.type === 'dir' || e.type === 'file')
    .map((e) => ({
      name: e.name,
      path: e.path,
      type: e.type === 'dir' ? ('dir' as const) : ('file' as const),
      ...(e.type === 'file' && typeof e.size === 'number' ? { size: e.size } : {}),
    }));
  mapped.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return mapped.slice(0, cap);
}

// ── Server fetch ────────────────────────────────────────────────────────────────

/** Max decoded file size we return to the client (README-scale, not lockfiles). */
const MAX_FILE_BYTES = 256 * 1024;

/**
 * Fetch a repo path from the GitHub Contents API. Returns a directory listing,
 * a decoded text file, or null when the path is missing / the upstream errors.
 * Responses are cached for an hour (next revalidate) to stay well under rate limits.
 */
export async function fetchRepoContent(
  owner: string,
  repo: string,
  path: string,
  fetchImpl: typeof fetch = fetch,
): Promise<RepoContent | null> {
  // path is already sanitized by the caller; encode each segment for the URL.
  const encodedPath = path.split('/').filter(Boolean).map(encodeURIComponent).join('/');
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'armory-registry',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetchImpl(url, { headers, next: { revalidate: 3600 } } as RequestInit);
  } catch {
    return null; // network / DNS failure — caller hides the section
  }
  if (!res.ok) return null; // 404 / 403 (rate limit) / 5xx — hide gracefully

  const data: unknown = await res.json();

  // Directory → array of entries.
  if (Array.isArray(data)) {
    return { type: 'dir', path, entries: normalizeEntries(data as RepoEntry[]) };
  }

  // File → object with base64 content.
  if (data && typeof data === 'object' && (data as { type?: string }).type === 'file') {
    const f = data as { name: string; path: string; size: number; content?: string; encoding?: string };
    if (f.encoding !== 'base64' || !f.content || f.size > MAX_FILE_BYTES) {
      // too large or binary — return metadata with empty content, flagged truncated
      return { type: 'file', path: f.path, name: f.name, content: '', size: f.size, truncated: true };
    }
    const decoded = Buffer.from(f.content, 'base64').toString('utf8');
    return { type: 'file', path: f.path, name: f.name, content: decoded, size: f.size, truncated: false };
  }

  return null;
}
