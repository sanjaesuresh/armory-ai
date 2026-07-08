import type { Setup } from '@/lib/setup/types';

export const devExtraSkills: Setup[] = [
  // ─── 1. Refactor Skill ───────────────────────────────────────────────────────
  {
    kind: 'skill',
    id: 'curated-refactor-skill-v1',
    slug: 'refactor-skill',
    name: 'Refactor Skill',
    tagline: 'Behavior-preserving refactors with a clear, step-by-step change log',
    description:
      'A Claude Code skill that performs targeted, behavior-preserving refactors: extract ' +
      'function, rename symbol, deduplicate logic, or split an oversized module. Every ' +
      'transform is listed individually with a one-line rationale so each step is independently reviewable.',
    role: 'Engineering',
    industry: null,
    tags: ['refactoring', 'engineering', 'developer-tools', 'code-quality', 'clean-code'],
    category: 'engineering',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    repoUrl: null,
    artifactFiles: [
      {
        name: 'SKILL.md',
        isPrimary: true,
        content: `# Refactor Skill

---
slug: refactor-skill
version: 1.0.0
category: engineering
command: /refactor
---

## What it does
Performs targeted, behavior-preserving refactors on a function, file, or module.
Applies one or more transforms: extract function, inline function, rename symbol,
deduplicate repeated logic, or split a module at a clear boundary. Observable
behavior is never changed — only structure.

## Trigger
Use this skill when asked to refactor, clean up, or restructure code.
Typical invocations:
- "Refactor this function to extract the validation logic"
- "Clean up this module — it's doing too much"
- \`/refactor\` in Claude Code
- \`/refactor <target>\` where target is a function name, file, or concern

## Input
Provide one or more of:
1. The code to refactor (pasted directly or referenced by file path)
2. The specific transform wanted ("extract function", "rename X to Y", "split module")
3. The motivation ("this function is 300 lines and handles three unrelated concerns")

If no code is provided, ask for it before proceeding.

## Method

Work in this order:
1. **Identify smells** — long functions, duplicated blocks, mixed abstraction levels, names that mislead.
2. **Plan the transforms** — list each step before applying ("1. Extract lines 42–67 into validateInput()").
3. **Apply one transform at a time** — do not bundle unrelated edits.
4. **Verify behavior is unchanged** — note side effects, shared state, or external callers that must update.

### Transform rules
- Extract function: only when the block has a single clear purpose and a name you can give it.
- Rename: rename every usage site visible in the provided code; flag external callers you cannot see.
- Deduplicate: extract into a shared helper only when the duplication is substantial (not two uses of three lines).
- Split module: propose the new boundary with a rationale before splitting; never split without a clear separation of concerns.

## Output format

Produce the refactored code, then a **Changes** section:

\`\`\`
## Changes
1. Extracted <block> into \`functionName()\` — <one-line reason>.
2. Renamed \`oldName\` → \`newName\` — <one-line reason>.
3. ...
\`\`\`

Flag any step that touches shared state or changes exports with a **Risk** note on the same line.

## Example output

\`\`\`typescript
// split 80-line processOrder() into three focused functions

function validateOrder(order: Order): void {
  if (!order.items.length) throw new Error('Order has no items');
  if (order.total < 0) throw new Error('Negative total');
}

function applyDiscount(order: Order, code: string): Order {
  const rate = DISCOUNT_CODES[code] ?? 0;
  return { ...order, total: order.total * (1 - rate) };
}

async function persistOrder(order: Order): Promise<string> {
  const { data, error } = await supabase.from('orders').insert(order).select('id').single();
  if (error) throw error;
  return data.id;
}
\`\`\`

## Changes
1. Extracted lines 12–19 into \`validateOrder()\` — single responsibility; now unit-testable in isolation.
2. Extracted lines 31–37 into \`applyDiscount()\` — pure function, no side effects.
3. Extracted supabase block into \`persistOrder()\` — isolates async error handling.
4. Updated two call sites in \`checkout.ts\` to call the three functions in sequence. **Risk**: if \`processOrder\` is exported, the export name must be updated by callers outside this file.

## Commands (Claude Code)

- \`/refactor\` — Analyze the current selection or pasted code and apply behavior-preserving refactors.
- \`/refactor <target>\` — Refactor a named function, class, or file; optionally specify the transform type.
`,
      },
    ],
    capabilities: [
      {
        command: '/refactor',
        description: 'Analyze the selected or pasted code and apply behavior-preserving refactors with a step-by-step change log.',
      },
      {
        command: '/refactor <target>',
        description: 'Refactor a named function, class, or file; optionally specify the transform type (extract, rename, dedupe, split).',
      },
    ],
  },

  // ─── 2. Test Generation Skill ────────────────────────────────────────────────
  {
    kind: 'skill',
    id: 'curated-test-generation-skill-v1',
    slug: 'test-generation-skill',
    name: 'Test Generation Skill',
    tagline: 'Unit and integration tests covering happy path, edges, and failure modes',
    description:
      'A Claude Code skill that generates unit or integration tests for a function or diff. ' +
      'It derives test cases from the implementation: the happy path first, then edge cases and ' +
      'failure paths the code explicitly handles or should handle.',
    role: 'Engineering',
    industry: null,
    tags: ['testing', 'unit-tests', 'engineering', 'developer-tools', 'tdd', 'integration-tests'],
    category: 'engineering',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    repoUrl: null,
    artifactFiles: [
      {
        name: 'SKILL.md',
        isPrimary: true,
        content: `# Test Generation Skill

---
slug: test-generation-skill
version: 1.0.0
category: engineering
command: /gen-tests
---

## What it does
Generates unit or integration tests from a function signature, implementation, or diff.
Produces tests that would fail before the code was written and pass after — not tests
that are tautologically true regardless of the implementation.

## Trigger
Use this skill when asked to write, generate, or add tests.
Typical invocations:
- "Write tests for this function"
- "Generate tests for the changes in this diff"
- \`/gen-tests\` in Claude Code
- \`/gen-tests <scope>\` where scope is a function name, file, or concern

## Input
Provide one or more of:
1. The function or module to test (pasted code or file path)
2. A diff of the changes that need test coverage
3. The test framework in use (Jest, Vitest, pytest, Go testing, etc.)
4. Any existing tests to match style

If the code is not provided, ask for it before proceeding. Infer the framework from
imports or project structure if not stated.

## Method

For each function under test:
1. **Happy path** — the expected behavior when inputs are valid and preconditions are met.
2. **Edge cases** — boundary values, empty collections, zero, null/undefined, max lengths, type coercions.
3. **Failure paths** — inputs that should throw, reject, or return an error; side effects on failure.
4. **Mocks and stubs** — identify external dependencies (DB, HTTP, filesystem) and provide minimal mocks.

Do not generate tests that only verify the implementation restates itself (e.g., testing that \`add(1, 2)\` returns \`1 + 2\`). Each test must encode a business rule or constraint.

## Output format

Produce a single test file matching the detected framework's conventions.
Group tests in \`describe\` blocks by function or concern. Each test name states the rule it encodes:

\`\`\`
describe('<functionName>', () => {
  it('<plain-English rule being verified>', () => { ... });
});
\`\`\`

After the file, add a short **Coverage notes** section listing any cases you could not test
without more context (e.g., "network timeout path requires a mock HTTP server not shown here").

## Example output

\`\`\`typescript
import { describe, it, expect } from 'vitest';
import { applyDiscount } from './pricing';

describe('applyDiscount', () => {
  it('returns the original total when no discount code is provided', () => {
    expect(applyDiscount({ total: 100 }, '')).toEqual({ total: 100 });
  });

  it('reduces the total by the rate for a valid code', () => {
    expect(applyDiscount({ total: 100 }, 'SAVE20')).toEqual({ total: 80 });
  });

  it('returns zero total when the rate is 100%', () => {
    expect(applyDiscount({ total: 50 }, 'FREE100')).toEqual({ total: 0 });
  });

  it('ignores an unknown code and leaves the total unchanged', () => {
    expect(applyDiscount({ total: 100 }, 'NOTACODE')).toEqual({ total: 100 });
  });

  it('does not mutate the original order object', () => {
    const order = { total: 100 };
    applyDiscount(order, 'SAVE20');
    expect(order.total).toBe(100);
  });
});
\`\`\`

**Coverage notes**: The negative-total guard in \`validateOrder\` is not tested here because that
function is out of scope for this diff. Add a test for it in the \`validateOrder\` describe block.

## Commands (Claude Code)

- \`/gen-tests\` — Generate tests for the current selection or pasted function.
- \`/gen-tests <scope>\` — Generate tests for a named function, file, or diff; optionally specify the framework.
`,
      },
    ],
    capabilities: [
      {
        command: '/gen-tests',
        description: 'Generate unit/integration tests for the current selection or pasted function, covering happy path, edges, and failures.',
      },
      {
        command: '/gen-tests <scope>',
        description: 'Generate tests for a named function, file, or diff; optionally specify the test framework.',
      },
    ],
  },

  // ─── 3. SQL Optimizer Skill ──────────────────────────────────────────────────
  {
    kind: 'skill',
    id: 'curated-sql-optimizer-skill-v1',
    slug: 'sql-optimizer-skill',
    name: 'SQL Optimizer Skill',
    tagline: 'Rewrites slow queries with index suggestions and EXPLAIN reasoning',
    description:
      'A Claude Code skill that rewrites slow SQL: recommends indexes, fixes join order, ' +
      'eliminates N+1 patterns, and explains the reasoning using EXPLAIN output. Each ' +
      'rewrite is shown alongside the original with a before/after performance rationale.',
    role: 'Engineering',
    industry: null,
    tags: ['sql', 'database', 'performance', 'engineering', 'query-optimization', 'postgresql'],
    category: 'data',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    repoUrl: null,
    artifactFiles: [
      {
        name: 'SKILL.md',
        isPrimary: true,
        content: `# SQL Optimizer Skill

---
slug: sql-optimizer-skill
version: 1.0.0
category: data
command: /optimize-sql
---

## What it does
Analyzes a slow or poorly structured SQL query and produces an optimized rewrite.
Provides index recommendations, fixes join order, eliminates N+1 patterns, and
explains the reasoning in terms of the query planner. Works with PostgreSQL by
default; adapts to MySQL, SQLite, or BigQuery when stated.

## Trigger
Use this skill when asked to optimize, speed up, or fix a slow query.
Typical invocations:
- "This query is taking 4 seconds — optimize it"
- "Why is this JOIN so slow?"
- \`/optimize-sql\` in Claude Code
- \`/optimize-sql <context>\` where context is the table schema, EXPLAIN output, or row counts

## Input
Provide one or more of:
1. The SQL query to optimize
2. The relevant table schemas (column names, types, existing indexes)
3. EXPLAIN or EXPLAIN ANALYZE output, if available
4. Approximate row counts for the tables involved
5. The database engine (PostgreSQL, MySQL, SQLite, BigQuery — defaults to PostgreSQL)

The more schema and EXPLAIN context you provide, the more precise the recommendations.
If no query is provided, ask for it before proceeding.

## Method

1. **Parse the query** — identify SELECT, JOINs, WHERE predicates, GROUP BY, ORDER BY, LIMIT.
2. **Spot anti-patterns** — sequential scans on large tables, missing index on join keys,
   functions on indexed columns (defeating the index), SELECT *, correlated subqueries.
3. **Check for N+1** — loops that issue one query per row; consolidate into a single JOIN or
   a WHERE ... IN (...) or a lateral join.
4. **Recommend indexes** — name the column(s), the index type (B-tree, GIN, GiST, composite),
   and explain which predicate it serves.
5. **Rewrite** — produce the optimized SQL and annotate each change.

### Rules
- Never suggest an index that duplicates an existing one shown in the schema.
- When rewriting a correlated subquery as a JOIN, verify the cardinality does not change the result (flag if ambiguous).
- Prefer partial indexes when the predicate filters a minority of rows.
- For N+1 in application code, show the collapsed SQL and the application-level change together.

## Output format

Show the original query and the optimized query side by side, then a **Recommendations** section:

\`\`\`
## Recommendations
1. Add index: <DDL> — serves the WHERE predicate on <column>, estimated seq scan → index scan.
2. Rewrote correlated subquery as LEFT JOIN — eliminates one query per row.
3. Replaced SELECT * with explicit columns — avoids fetching unused JSONB column (avg 8 KB/row).
\`\`\`

## Example output

**Original**
\`\`\`sql
SELECT * FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC
LIMIT 20;
\`\`\`
EXPLAIN shows: Seq Scan on orders (cost=0.00..18432.00 rows=1200000)

**Optimized**
\`\`\`sql
SELECT id, status, total, created_at FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC
LIMIT 20;
\`\`\`

## Recommendations
1. Add index: \`CREATE INDEX orders_customer_created ON orders (customer_id, created_at DESC);\`
   — serves both the WHERE and ORDER BY in one index scan; the planner can skip the sort entirely.
2. Replace \`SELECT *\` with explicit columns — the \`metadata\` JSONB column averages 6 KB per row;
   fetching 1 200 000 rows × 6 KB is the dominant cost today.
3. After adding the index, EXPLAIN ANALYZE to confirm Index Scan replaces Seq Scan.

## Commands (Claude Code)

- \`/optimize-sql\` — Analyze and rewrite the pasted SQL query with index recommendations.
- \`/optimize-sql <context>\` — Optimize with additional context: schema DDL, EXPLAIN output, or row counts.
`,
      },
    ],
    capabilities: [
      {
        command: '/optimize-sql',
        description: 'Analyze and rewrite a slow SQL query with index suggestions and EXPLAIN reasoning.',
      },
      {
        command: '/optimize-sql <context>',
        description: 'Optimize SQL with additional context: table schema, EXPLAIN output, or row count estimates.',
      },
    ],
  },

  // ─── 4. Dockerfile Skill ─────────────────────────────────────────────────────
  {
    kind: 'skill',
    id: 'curated-dockerfile-skill-v1',
    slug: 'dockerfile-skill',
    name: 'Dockerfile Skill',
    tagline: 'Write and improve Dockerfiles: multi-stage, layer-cached, non-root, and minimal',
    description:
      'A Claude Code skill that writes or audits Dockerfiles for production use: multi-stage ' +
      'builds, layer cache ordering, minimal base images, non-root user, and HEALTHCHECK. ' +
      'Each recommendation includes the reason so you understand the tradeoff, not just the fix.',
    role: 'Engineering',
    industry: null,
    tags: ['docker', 'containers', 'devops', 'engineering', 'developer-tools', 'ci-cd'],
    category: 'devops',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    repoUrl: null,
    artifactFiles: [
      {
        name: 'SKILL.md',
        isPrimary: true,
        content: `# Dockerfile Skill

---
slug: dockerfile-skill
version: 1.0.0
category: devops
command: /dockerfile
---

## What it does
Writes a production-ready Dockerfile from a description of the stack, or audits an
existing Dockerfile and proposes improvements. Covers: multi-stage builds, layer
cache ordering, minimal base image selection, non-root user, and HEALTHCHECK.
Explains the reason for each choice.

## Trigger
Use this skill when asked to write, generate, or review a Dockerfile.
Typical invocations:
- "Write a Dockerfile for my Node.js app"
- "Audit this Dockerfile — the image is 2 GB"
- \`/dockerfile\` in Claude Code
- \`/dockerfile <stack>\` where stack is the language and runtime (e.g. "Node 20 + pnpm")

## Input
Provide one or more of:
1. An existing Dockerfile to audit
2. The application stack (language, runtime version, framework, package manager)
3. The entry point and port
4. Build-time vs. runtime dependencies (e.g., build tools needed only during compilation)
5. The target environment (cloud run, Kubernetes, Docker Compose)

If no existing Dockerfile is provided, ask for the stack before proceeding.

## Method

For a new Dockerfile, apply these patterns in order:
1. **Base image** — choose a minimal, pinned base (e.g. \`node:20-alpine\` not \`node:latest\`).
2. **Multi-stage build** — separate the build stage from the runtime stage to exclude dev tools
   and source maps from the final image.
3. **Layer cache ordering** — copy dependency manifests first, install, then copy source.
   This keeps the install layer cached unless dependencies change.
4. **Non-root user** — create an app user and switch before \`CMD\`; do not run as root in production.
5. **HEALTHCHECK** — add a minimal HTTP or process health check so orchestrators can detect hangs.
6. **.dockerignore** — list files to exclude (\`node_modules\`, \`.git\`, \`.env\`, build artifacts).

For an audit, scan for:
- Large or unpinned base image
- \`RUN apt-get install\` in the runtime stage that belongs in build only
- \`COPY . .\` before dependency install (busts cache on every source change)
- Running as root (no USER instruction)
- Missing HEALTHCHECK
- Secrets passed as ARG or ENV at build time

## Output format

Produce the Dockerfile, then a **.dockerignore** snippet, then an **Audit notes** section
(for reviews) or a **Design notes** section (for new files):

\`\`\`
## Design notes
1. Used node:20-alpine (7 MB) instead of node:20 (350 MB) — no native tooling needed at runtime.
2. Multi-stage: build stage installs devDependencies; runtime stage copies only dist/ and node_modules.
3. COPY package*.json ./ before COPY . . — keeps npm ci layer cached unless package.json changes.
4. Added USER node — alpine's built-in non-root user; no extra RUN needed.
\`\`\`

## Example output

\`\`\`dockerfile
# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app
# copy manifests first so the install layer is cached unless deps change
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile
COPY . .
RUN npm run build

# --- runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# only production dependencies; devDependencies excluded
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile --omit=dev
COPY --from=build /app/dist ./dist
# run as the built-in non-root user
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
\`\`\`

\`\`\`text
# .dockerignore
node_modules
.git
.env*
dist
*.log
\`\`\`

## Design notes
1. Two-stage build: final image contains only \`dist/\` and prod \`node_modules\`; source and dev tools are excluded.
2. \`node:20-alpine\` pins the major version and uses musl libc for a ~7 MB base.
3. Manifest-first COPY keeps the \`npm ci\` layer cached across source-only changes.
4. \`USER node\` uses Alpine's built-in non-root uid 1000 — no extra \`RUN adduser\` required.

## Commands (Claude Code)

- \`/dockerfile\` — Write a production-ready Dockerfile for the described or pasted stack.
- \`/dockerfile <stack>\` — Write or audit a Dockerfile for a specific language, runtime, and framework.
`,
      },
    ],
    capabilities: [
      {
        command: '/dockerfile',
        description: 'Write or audit a Dockerfile with multi-stage builds, layer caching, non-root user, and HEALTHCHECK.',
      },
      {
        command: '/dockerfile <stack>',
        description: 'Write or audit a Dockerfile for a specific language, runtime version, and framework.',
      },
    ],
  },

  // ─── 5. Regex Builder Skill ──────────────────────────────────────────────────
  {
    kind: 'skill',
    id: 'curated-regex-builder-skill-v1',
    slug: 'regex-builder-skill',
    name: 'Regex Builder Skill',
    tagline: 'Build and explain regular expressions from a plain-English description',
    description:
      'A Claude Code skill that builds a regular expression from a plain-English spec, with ' +
      'annotated breakdown, a table of passing and failing test cases, and notes on edge cases ' +
      'and dialect differences (JavaScript, Python, PCRE).',
    role: 'Engineering',
    industry: null,
    tags: ['regex', 'engineering', 'developer-tools', 'pattern-matching', 'validation'],
    category: 'engineering',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    repoUrl: null,
    artifactFiles: [
      {
        name: 'SKILL.md',
        isPrimary: true,
        content: `# Regex Builder Skill

---
slug: regex-builder-skill
version: 1.0.0
category: engineering
command: /regex
---

## What it does
Builds a regular expression from a plain-English description of the pattern.
Explains each part of the regex in an annotated breakdown, provides a table of
strings that should match and strings that should not, and calls out edge cases and
dialect differences (JavaScript/ECMAScript, Python re, PCRE, Go regexp).

## Trigger
Use this skill when asked to write, build, or explain a regular expression.
Typical invocations:
- "Write a regex that matches a US phone number"
- "Explain what this regex does: ^(?=.*[A-Z])(?=.*\\d).{8,}$"
- \`/regex\` in Claude Code
- \`/regex <spec>\` where spec is the plain-English description of the pattern

## Input
Provide one or more of:
1. A plain-English description of what the regex must match (and optionally what it must not match)
2. Example strings that should match
3. Example strings that should not match
4. The regex dialect (JavaScript, Python, PCRE, Go — defaults to JavaScript/ECMAScript)
5. An existing regex you want explained or improved

## Method

1. **Identify the structure** — what is the overall shape? (email, URL, date, custom token, etc.)
2. **Choose anchors** — should the pattern match the whole string (\`^\`/\`$\`) or a substring?
3. **Build the pattern** — assemble the components; prefer named groups for readability.
4. **Annotate** — break the pattern into its parts and explain each in plain English.
5. **Test cases** — produce a table of strings with expected match/no-match and the reason.
6. **Flag dialect gaps** — note any features that behave differently across dialects (lookahead support, Unicode mode, possessive quantifiers).

### Rules
- Prefer readable patterns with named capture groups over dense one-liners.
- Do not use catastrophic backtracking patterns (nested quantifiers on the same character class).
- If the spec is ambiguous (e.g., "a phone number" could be many formats), state the assumption made and offer alternatives.

## Output format

1. The regex, ready to copy
2. **Annotated breakdown** — each component on its own line
3. **Test cases** table
4. **Edge cases and dialect notes**

## Example output

**Spec**: Match a semantic version string (e.g. 1.0.0, 2.13.4) — digits only, no pre-release suffix.

**Regex** (JavaScript)
\`\`\`
/^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$/
\`\`\`

**Annotated breakdown**
\`\`\`
^                    — anchor: start of string
(0|[1-9]\\d*)        — major: 0, or a non-zero digit followed by any digits (no leading zeros)
\\.                   — literal dot
(0|[1-9]\\d*)        — minor: same rule
\\.                   — literal dot
(0|[1-9]\\d*)        — patch: same rule
$                    — anchor: end of string
\`\`\`

**Test cases**

| String   | Matches | Reason |
|----------|---------|--------|
| 1.0.0    | yes     | valid semver |
| 2.13.4   | yes     | multi-digit minor |
| 0.0.1    | yes     | zeroes allowed |
| 01.0.0   | no      | leading zero in major |
| 1.0      | no      | missing patch segment |
| 1.0.0-rc | no      | pre-release suffix not in spec |

**Edge cases**: This pattern rejects leading zeros per the semver spec. If you need to accept
\`01.02.03\` (some legacy systems use it), replace each group with \`\\d+\`.
Python's \`re\` module and PCRE behave identically here; Go's \`regexp\` package does not support
lookaheads but this pattern does not need them.

## Commands (Claude Code)

- \`/regex\` — Build a regex from a plain-English spec with breakdown and test cases.
- \`/regex <spec>\` — Build a regex for the given spec; optionally include example match/no-match strings.
`,
      },
    ],
    capabilities: [
      {
        command: '/regex',
        description: 'Build a regex from a plain-English description, with annotated breakdown and test cases.',
      },
      {
        command: '/regex <spec>',
        description: 'Build a regex for the given spec; optionally include example match and no-match strings.',
      },
    ],
  },

  // ─── 6. Changelog Skill ──────────────────────────────────────────────────────
  {
    kind: 'skill',
    id: 'curated-changelog-skill-v1',
    slug: 'changelog-skill',
    name: 'Changelog Skill',
    tagline: 'Keep-a-Changelog entries from a set of commits or a diff, grouped by type',
    description:
      'A Claude Code skill that drafts a CHANGELOG.md entry in Keep-a-Changelog format from ' +
      'a list of commits, a commit range, or a diff. Changes are grouped into Added, Changed, ' +
      'Deprecated, Removed, Fixed, and Security — with user-facing language, not internal jargon.',
    role: 'Engineering',
    industry: null,
    tags: ['changelog', 'git', 'engineering', 'release', 'developer-tools', 'documentation'],
    category: 'engineering',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    repoUrl: null,
    artifactFiles: [
      {
        name: 'SKILL.md',
        isPrimary: true,
        content: `# Changelog Skill

---
slug: changelog-skill
version: 1.0.0
category: engineering
command: /changelog
---

## What it does
Drafts a changelog entry in [Keep a Changelog](https://keepachangelog.com) format from a
set of commits, a commit range, or a diff. Groups changes into the standard sections —
Added, Changed, Deprecated, Removed, Fixed, Security — using user-facing language that
describes impact, not implementation details.

## Trigger
Use this skill when asked to write, draft, or update a changelog.
Typical invocations:
- "Write a changelog entry for version 2.4.0"
- "Draft CHANGELOG entries from these commits"
- \`/changelog\` in Claude Code
- \`/changelog <version>\` to target a specific version header

## Input
Provide one or more of:
1. A list of commit messages or \`git log --oneline\` output
2. A diff (\`git diff <base>..<head>\`)
3. The version number for the entry header
4. The release date (defaults to today if omitted)
5. The audience (end users vs. API consumers vs. developers — affects language)

If no commits or diff are provided, ask for them before proceeding.

## Method

1. **Classify each commit** — map to Keep-a-Changelog sections:
   - **Added** — new features, new endpoints, new config options
   - **Changed** — behavior changes to existing features; breaking changes must be called out
   - **Deprecated** — features still present but marked for removal
   - **Removed** — things deleted in this version
   - **Fixed** — bug fixes
   - **Security** — vulnerability fixes, auth/authz changes, dependency security updates
2. **Translate to user language** — replace internal ticket IDs and variable names with what the
   user observes. "Fix NPE in UserService.findById()" → "Fixed a crash when looking up a user by ID".
3. **Omit chore/ci/test commits** — unless they affect behavior visible to users.
4. **Flag breaking changes** — prefix with **Breaking** and describe the migration step.

## Output format

Produce a Markdown snippet ready to paste into CHANGELOG.md:

\`\`\`markdown
## [<version>] - <date>

### Added
- ...

### Changed
- ...

### Fixed
- ...
\`\`\`

Omit empty sections. Add a **Skipped** note at the end listing commits classified as
internal (chore, test, ci) that were intentionally excluded.

## Example output

\`\`\`markdown
## [2.4.0] - 2026-07-07

### Added
- Export setup bundles directly to a \`.zip\` file from the Export page.
- New "Changelog Skill" in the developer registry for generating Keep-a-Changelog entries.

### Changed
- **Breaking**: the \`/api/export\` endpoint now returns \`application/zip\` instead of \`application/json\`.
  Clients that parse the JSON response must switch to downloading the zip. See the migration guide.
- Browse page now sorts by popularity by default instead of alphabetical.

### Fixed
- Fixed a crash when opening a setup that had no knowledge files.
- Category filter no longer resets to "All" after navigating back from a setup detail page.
\`\`\`

**Skipped** (internal, no user-facing impact):
- chore: bump vitest to 2.1.0
- ci: add Node 22 to test matrix
- test: add edge-case coverage for slug validator

## Commands (Claude Code)

- \`/changelog\` — Draft a changelog entry from the pasted commits or diff.
- \`/changelog <version>\` — Draft a changelog entry for a specific version number and optional release date.
`,
      },
    ],
    capabilities: [
      {
        command: '/changelog',
        description: 'Draft a Keep-a-Changelog entry from pasted commits or a diff, grouped by Added/Changed/Fixed.',
      },
      {
        command: '/changelog <version>',
        description: 'Draft a changelog entry for a specific version number, with optional release date.',
      },
    ],
  },

  // ─── 7. Env Config Skill ─────────────────────────────────────────────────────
  {
    kind: 'skill',
    id: 'curated-env-config-skill-v1',
    slug: 'env-config-skill',
    name: 'Env Config Skill',
    tagline: 'Audit env and config files for missing vars, unsafe defaults, and secret leaks',
    description:
      'A Claude Code skill that audits environment and configuration files: flags missing ' +
      'required variables, unsafe default values, secrets hard-coded in source, and ' +
      '.env.example sync gaps. Each finding includes severity and a concrete fix.',
    role: 'Engineering',
    industry: null,
    tags: ['environment', 'config', 'security', 'engineering', 'developer-tools', 'secrets'],
    category: 'engineering',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    repoUrl: null,
    artifactFiles: [
      {
        name: 'SKILL.md',
        isPrimary: true,
        content: `# Env Config Skill

---
slug: env-config-skill
version: 1.0.0
category: engineering
command: /check-env
---

## What it does
Audits \`.env\`, \`.env.example\`, and application config files for four classes of problems:
missing required variables, unsafe or insecure default values, secrets embedded in source
code, and drift between \`.env.example\` and the actual \`.env\` in use. Every finding is rated
by severity (Critical / High / Medium / Low) and includes a concrete fix.

## Trigger
Use this skill when asked to audit, check, or review environment variables or config.
Typical invocations:
- "Check our .env.example — are we missing anything?"
- "Audit this config for secret leaks"
- \`/check-env\` in Claude Code
- \`/check-env <file>\` to target a specific config file

## Input
Provide one or more of:
1. The \`.env.example\` or \`.env\` file content (redact real secret values before pasting)
2. The application config files (e.g. \`config.ts\`, \`settings.py\`, \`application.yml\`)
3. A list of variables the app is known to require
4. The \`.gitignore\` if you want a check that \`.env\` is properly excluded

Do not paste real secrets. Redact values to \`<REDACTED>\` — the skill audits structure and names, not values.

## Method

Run four passes:

### Pass 1 — Missing required variables
Compare what \`.env.example\` declares against what application code references (via \`process.env.X\`,
\`os.environ["X"]\`, etc.). Flag any variable referenced in code but absent from \`.env.example\`.

### Pass 2 — Unsafe defaults
Look for dangerous default values:
- \`DEBUG=true\` or \`NODE_ENV=development\` in a file likely to reach production
- Empty strings for secrets (\`JWT_SECRET=""\`)
- Placeholder strings that look like real values (\`API_KEY=changeme\`, \`DB_PASSWORD=root\`)
- Ports or hosts that expose services on 0.0.0.0 without comment

### Pass 3 — Secrets in source
Scan config files for hard-coded credentials, tokens, or API keys. Patterns:
- Long alphanumeric strings assigned to variables named \`SECRET\`, \`TOKEN\`, \`KEY\`, \`PASS\`, \`PWD\`
- Bearer tokens or AWS key patterns in code (not in .env)
- Base64 blobs that decode to key material

### Pass 4 — .env.example sync
Flag variables present in \`.env.example\` but never referenced in code (dead config), and
variables present in \`.env\` but absent from \`.env.example\` (undocumented secret).

## Output format

Produce a findings list sorted by severity, then a **Summary** table:

\`\`\`
## Findings

**[Critical] JWT_SECRET has an empty default** (Pass 2)
File: .env.example, line 12
Fix: Set JWT_SECRET to a placeholder like \`JWT_SECRET=<generate with: openssl rand -hex 32>\`

**[High] DATABASE_URL referenced in db.ts but absent from .env.example** (Pass 1)
File: src/lib/db.ts:4
Fix: Add \`DATABASE_URL=postgres://user:password@localhost:5432/mydb\` to .env.example

## Summary
| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 1     |
| Medium   | 0     |
| Low      | 0     |
\`\`\`

## Example output

\`\`\`
## Findings

[Critical] STRIPE_SECRET_KEY has a placeholder that looks like a real key format
  File: .env.example, line 8: STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXXXXXXXXX
  Fix: Use a clearly fake value: STRIPE_SECRET_KEY=<your Stripe secret key>
  Why: The \`sk_live_\` prefix matches the real Stripe live-key pattern; a developer may not notice it is fake.

[High] SESSION_SECRET uses the default string "secret" (unsafe for production)
  File: config/session.ts, line 3: secret: process.env.SESSION_SECRET ?? 'secret'
  Fix: Remove the fallback; throw at startup if SESSION_SECRET is unset in production.

[Medium] REDIS_URL is in .env but not in .env.example — undocumented dependency
  Fix: Add REDIS_URL=redis://localhost:6379 to .env.example with a comment explaining its purpose.

[Low] LOG_LEVEL is declared in .env.example but never read in application code
  Fix: Remove it, or wire it up to the logger initialisation.

## Summary
| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 1     |
| Medium   | 1     |
| Low      | 1     |
\`\`\`

## Commands (Claude Code)

- \`/check-env\` — Audit the pasted .env.example and config files for all four issue classes.
- \`/check-env <file>\` — Audit a specific environment or config file by name or pasted content.
`,
      },
    ],
    capabilities: [
      {
        command: '/check-env',
        description: 'Audit .env.example and config files for missing vars, unsafe defaults, secret leaks, and sync gaps.',
      },
      {
        command: '/check-env <file>',
        description: 'Audit a specific environment or config file by name or pasted content.',
      },
    ],
  },

  // ─── 8. Error-Handling Audit Skill ───────────────────────────────────────────
  {
    kind: 'skill',
    id: 'curated-error-handling-audit-skill-v1',
    slug: 'error-handling-audit-skill',
    name: 'Error-Handling Audit Skill',
    tagline: 'Find swallowed errors, catch-alls, and silent fallbacks — then fix them',
    description:
      'A Claude Code skill that scans code for inadequate error handling: swallowed exceptions, ' +
      'empty catch blocks, silent fallbacks that hide failures, and catch-all handlers that lose ' +
      'error type and context. Each finding proposes a concrete, targeted fix.',
    role: 'Engineering',
    industry: null,
    tags: ['error-handling', 'engineering', 'code-review', 'developer-tools', 'reliability'],
    category: 'engineering',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    repoUrl: null,
    artifactFiles: [
      {
        name: 'SKILL.md',
        isPrimary: true,
        content: `# Error-Handling Audit Skill

---
slug: error-handling-audit-skill
version: 1.0.0
category: engineering
command: /audit-errors
---

## What it does
Scans a function, file, or module for inadequate error handling and proposes fixes.
Targets the most dangerous patterns: empty catch blocks, swallowed rejections,
silent fallbacks that return null/undefined on failure, and generic catch-all handlers
that erase the error type and its context.

## Trigger
Use this skill when asked to audit, review, or improve error handling.
Typical invocations:
- "Audit this file for swallowed errors"
- "Why is this function silently failing?"
- \`/audit-errors\` in Claude Code
- \`/audit-errors <file>\` to target a specific file or function

## Input
Provide one or more of:
1. The code to audit (pasted or referenced by file path)
2. The language and runtime (TypeScript/Node, Python, Go, etc.)
3. The error-handling conventions in use (custom error classes, Result types, structured logging)
4. Known failure modes you want to check specifically

## Method

Scan for these patterns, in descending severity:

### Critical
- **Empty catch block** — \`catch (e) {}\` or \`except: pass\` — error is swallowed completely.
- **Unhandled promise rejection** — \`someAsync()\` called without \`await\` or \`.catch()\`, or a
  \`Promise.all\` where one rejection silently voids the rest.
- **Ignored return value carrying an error** — Go-style \`val, _ := fn()\` where \`_\` discards an error.

### High
- **Silent null/undefined fallback** — \`catch (e) { return null; }\` where the caller cannot
  distinguish "not found" from "error".
- **Catch-all that loses type** — \`catch (e: unknown) { console.log(e); }\` without re-throw,
  error class check, or structured logging.
- **async function that never rejects or resolves** — dangling promise from a missing \`return\`.

### Medium
- **Error logged but not surfaced** — the error is logged but the function returns a success
  value, misleading the caller.
- **Stack trace discarded** — \`throw new Error(e.message)\` re-wraps without \`{ cause: e }\`,
  losing the original stack.
- **Overly broad catch** — catches \`Error\` when only \`NetworkError\` is expected; hides programming errors.

### Low
- **Inconsistent error shape** — some paths throw, others return \`{ error: string }\`; callers must handle both.
- **Missing finally** — resource (file handle, DB connection, lock) not released on error path.

## Output format

Produce a findings list sorted by severity, then a **Summary** table.
For each finding, show the problematic code snippet and the proposed fix side by side.

\`\`\`
## Findings

[Critical] Empty catch block swallows all errors from fetchUser()
  File: src/api/user.ts, line 24
  Before: catch (e) {}
  After:  catch (e) { logger.error('fetchUser failed', { userId, error: e }); throw e; }

## Summary
| Severity | Count |
|----------|-------|
| Critical | N     |
| High     | N     |
| Medium   | N     |
| Low      | N     |
\`\`\`

## Example output

\`\`\`
## Findings

[Critical] Unhandled promise rejection in background sync (src/sync.ts:41)
  Before: sync().catch(() => {})
  After:  sync().catch((e) => logger.error('Background sync failed', { error: e }));
  Why: Silently ignoring a sync failure means data loss goes undetected.

[High] fetchConfig returns null on error, caller cannot distinguish missing vs. broken (src/config.ts:18)
  Before: catch (e) { return null; }
  After:  catch (e) { throw new ConfigFetchError('Failed to load remote config', { cause: e }); }
  Why: The caller does null checks that will silently use stale config when the fetch errors.

[Medium] Error re-thrown without cause, original stack is lost (src/db.ts:55)
  Before: throw new Error(e.message)
  After:  throw new DatabaseError('Query failed', { cause: e })
  Why: Node's native error chaining (cause) preserves the original stack in logs and monitoring tools.

[Low] DB connection not closed in error path — missing finally (src/db.ts:72)
  Fix: Wrap the query block in try/finally and call conn.release() in the finally block.

## Summary
| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 1     |
| Medium   | 1     |
| Low      | 1     |
\`\`\`

## Commands (Claude Code)

- \`/audit-errors\` — Scan the selected or pasted code for error-handling problems and propose fixes.
- \`/audit-errors <file>\` — Audit a specific file or function by name or pasted content.
`,
      },
    ],
    capabilities: [
      {
        command: '/audit-errors',
        description: 'Scan code for swallowed errors, empty catch blocks, silent fallbacks, and catch-all handlers.',
      },
      {
        command: '/audit-errors <file>',
        description: 'Audit a specific file or function for error-handling problems and propose targeted fixes.',
      },
    ],
  },

  // ─── 9. API Client Generator Skill ──────────────────────────────────────────
  {
    kind: 'skill',
    id: 'curated-api-client-generator-skill-v1',
    slug: 'api-client-generator-skill',
    name: 'API Client Generator Skill',
    tagline: 'Generate a typed API client from an endpoint spec or OpenAPI document',
    description:
      'A Claude Code skill that generates a typed API client from a set of endpoint descriptions ' +
      'or an OpenAPI/Swagger document: request/response types, method wrappers, error handling, ' +
      'and a minimal usage example. TypeScript by default; adapts to Python or Go when stated.',
    role: 'Engineering',
    industry: null,
    tags: ['api', 'typescript', 'openapi', 'engineering', 'developer-tools', 'code-generation'],
    category: 'engineering',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    repoUrl: null,
    artifactFiles: [
      {
        name: 'SKILL.md',
        isPrimary: true,
        content: `# API Client Generator Skill

---
slug: api-client-generator-skill
version: 1.0.0
category: engineering
command: /gen-client
---

## What it does
Generates a typed API client from a set of endpoint descriptions or an OpenAPI/Swagger
document. Produces: request and response type definitions, one method per endpoint,
error handling with typed error classes, and a usage example. Defaults to TypeScript;
adapts to Python (httpx + dataclasses) or Go (net/http + structs) when stated.

## Trigger
Use this skill when asked to generate, write, or scaffold an API client.
Typical invocations:
- "Generate a TypeScript client for this REST API"
- "Write a typed client from this OpenAPI spec"
- \`/gen-client\` in Claude Code
- \`/gen-client <spec>\` where spec is a URL, pasted JSON/YAML, or an endpoint list

## Input
Provide one or more of:
1. An OpenAPI/Swagger document (JSON or YAML, pasted or file path)
2. A list of endpoints with method, path, request body shape, and response shape
3. The target language (TypeScript/Node, Python, Go — defaults to TypeScript)
4. The HTTP library to use (fetch, axios, httpx, net/http — defaults to fetch for TypeScript)
5. Auth scheme (Bearer token, API key header, OAuth — include if known)

If no spec is provided, ask for endpoint descriptions before proceeding.

## Method

1. **Extract types** — derive TypeScript interfaces (or Python dataclasses, Go structs) for every
   request body and response schema. Name types after the resource and operation.
2. **Generate methods** — one function per endpoint; accept typed parameters, build the URL, set headers.
3. **Handle errors** — create a typed error class that wraps HTTP errors and includes status code,
   endpoint, and the raw response body. Do not swallow errors silently.
4. **Auth** — inject the auth header in a single place (not repeated in each method).
5. **Usage example** — show three representative calls with real-looking (not placeholder) data.

### Rules
- Do not use \`any\` in TypeScript output. Use \`unknown\` and narrow explicitly.
- Keep the client thin: no caching, no retry logic, no global state unless asked.
- Group related endpoints into a namespace object or class (e.g., \`client.users.get()\`).
- If the spec has pagination, generate a typed paginated response type; do not hide it.

## Output format

Produce one file (or two for large specs: \`types.ts\` and \`client.ts\`), then a short **Usage** section.

## Example output

**Spec**: Two endpoints — GET /users/:id and POST /users

\`\`\`typescript
// types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface ApiErrorBody {
  message: string;
  code: string;
}
\`\`\`

\`\`\`typescript
// client.ts
import type { User, CreateUserRequest, ApiErrorBody } from './types';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string,
    public readonly body: ApiErrorBody,
  ) {
    super(\`\${status} \${endpoint}: \${body.message}\`);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const res = await fetch(\`\${process.env.API_BASE_URL}\${endpoint}\`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: \`Bearer \${process.env.API_TOKEN}\`,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body: ApiErrorBody = await res.json();
    throw new ApiError(res.status, endpoint, body);
  }
  return res.json() as Promise<T>;
}

export const client = {
  users: {
    get: (id: string) => apiFetch<User>(\`/users/\${id}\`),
    create: (body: CreateUserRequest) =>
      apiFetch<User>('/users', { method: 'POST', body: JSON.stringify(body) }),
  },
};
\`\`\`

**Usage**
\`\`\`typescript
const user = await client.users.get('usr_01J9XZ');
const newUser = await client.users.create({ name: 'Ada Lovelace', email: 'ada@example.com' });
\`\`\`

## Commands (Claude Code)

- \`/gen-client\` — Generate a typed API client from the pasted endpoint descriptions or OpenAPI spec.
- \`/gen-client <spec>\` — Generate a client from a specific spec file path, URL, or pasted document.
`,
      },
    ],
    capabilities: [
      {
        command: '/gen-client',
        description: 'Generate a typed API client from pasted endpoint descriptions or an OpenAPI/Swagger document.',
      },
      {
        command: '/gen-client <spec>',
        description: 'Generate a typed API client from a specific spec file, URL, or pasted OpenAPI document.',
      },
    ],
  },

  // ─── 10. Logging Cleanup Skill ───────────────────────────────────────────────
  {
    kind: 'skill',
    id: 'curated-logging-cleanup-skill-v1',
    slug: 'logging-cleanup-skill',
    name: 'Logging Cleanup Skill',
    tagline: 'Normalize logging: remove noise, add structure, enforce levels, protect PII',
    description:
      'A Claude Code skill that audits and rewrites logging calls: removes debug noise left in ' +
      'production paths, promotes ad-hoc console.log to structured logger calls, enforces ' +
      'correct log levels, adds structured fields, and flags any PII or secrets being logged.',
    role: 'Engineering',
    industry: null,
    tags: ['logging', 'engineering', 'developer-tools', 'observability', 'security', 'structured-logging'],
    category: 'engineering',
    source: 'curated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: [],
    tier: 'core',
    instructionTemplate: '',
    variables: [],
    knowledgeFiles: [],
    scenarios: [],
    repoUrl: null,
    artifactFiles: [
      {
        name: 'SKILL.md',
        isPrimary: true,
        content: `# Logging Cleanup Skill

---
slug: logging-cleanup-skill
version: 1.0.0
category: engineering
command: /clean-logs
---

## What it does
Audits logging calls in a file or module and rewrites them to be production-ready:
removes debug noise, converts ad-hoc \`console.log\` / \`print\` calls to structured
logger calls with correct levels, adds contextual fields (request ID, user ID, etc.),
and flags any PII or secrets being logged. Works with any structured logger
(pino, winston, structlog, zap, slog) — infer from imports, or ask.

## Trigger
Use this skill when asked to clean up, normalize, or audit logging.
Typical invocations:
- "Clean up the logging in this file — it's full of console.logs"
- "Make our logging structured and production-safe"
- \`/clean-logs\` in Claude Code
- \`/clean-logs <file>\` to target a specific file or module

## Input
Provide one or more of:
1. The file or module to audit (pasted code or file path)
2. The structured logger in use (pino, winston, structlog, zap, slog — will be inferred if not stated)
3. Fields that should appear on every log line (e.g. \`requestId\`, \`userId\`, \`service\`)
4. The environment context (production / development affects which levels are safe to emit)

## Method

Run four passes:

### Pass 1 — Remove debug noise
Identify and remove (or downgrade) logging that has no place in production:
- \`console.log('here')\`, \`console.log(someObject)\` left from debugging
- Logging inside tight loops (N log lines per request)
- Logging entire request or response bodies at INFO or above (should be DEBUG / TRACE only)

### Pass 2 — Promote to structured logger
Replace bare \`console.log\` / \`print\` / \`fmt.Println\` with the project's structured logger.
Convert string interpolation into structured fields:
- Before: \`console.log(\`User \${userId} signed in\`)\`
- After: \`logger.info('user signed in', { userId })\`

### Pass 3 — Enforce correct log levels

| Level | When to use |
|-------|-------------|
| \`error\` | Unexpected failures that require attention; always include the error object. |
| \`warn\` | Recoverable anomalies: retries, fallbacks, deprecated API usage. |
| \`info\` | Significant lifecycle events: server start, job complete, user action. |
| \`debug\` | Diagnostic detail useful when investigating a specific issue; not emitted in production by default. |
| \`trace\` | Highly verbose: per-request details, loop iterations. Only for deep debugging. |

Downgrade INFO to DEBUG when the event is too frequent to be actionable in production.

### Pass 4 — Flag PII and secrets
Scan log arguments for fields that may contain regulated or sensitive data:
- Email addresses, phone numbers, IP addresses (PII in most jurisdictions)
- Passwords, tokens, API keys, credit card numbers
- Full names or any field named \`password\`, \`token\`, \`secret\`, \`ssn\`, \`dob\`, \`email\`

Flag each occurrence with a recommendation to redact or omit the field.

## Output format

Produce the rewritten file, then a **Changes** section:

\`\`\`
## Changes
1. Removed 4 debug console.log calls (lines 12, 18, 34, 41) — no production value.
2. Promoted 3 string-interpolated console.log calls to logger.info with structured fields.
3. Downgraded request.body log from INFO to DEBUG (line 27) — too verbose for production.
4. [PII] logger.info at line 55 logs user.email — redact or remove this field.
\`\`\`

## Example output

**Before**
\`\`\`typescript
console.log('processing payment');
console.log('user:', user);
try {
  const result = await stripe.charge(amount);
  console.log('charge result:', result);
} catch (e) {
  console.error('stripe failed: ' + e.message);
}
\`\`\`

**After**
\`\`\`typescript
logger.info('payment processing started', { userId: user.id, amountCents: amount });
try {
  const result = await stripe.charge(amount);
  // log the charge ID, not the full result object — avoids logging card metadata
  logger.info('payment charge succeeded', { userId: user.id, chargeId: result.id });
} catch (e) {
  logger.error('payment charge failed', { userId: user.id, error: e });
}
\`\`\`

## Changes
1. Removed \`console.log('processing payment')\` — replaced with a structured INFO that includes userId and amount.
2. Removed \`console.log('user:', user)\` — logging the full user object at line 2 included user.email (PII). Use \`user.id\` only.
3. Replaced string-interpolated \`console.error\` with \`logger.error({ error: e })\` — passes the error object so stack traces appear in logs.
4. [PII warning] The original code logged \`user.email\`; the rewrite uses \`user.id\` only. Confirm this is sufficient for your debugging needs before removing the email field.

## Commands (Claude Code)

- \`/clean-logs\` — Audit and rewrite logging calls in the selected or pasted code.
- \`/clean-logs <file>\` — Audit a specific file or module for debug noise, wrong levels, and PII in logs.
`,
      },
    ],
    capabilities: [
      {
        command: '/clean-logs',
        description: 'Audit and rewrite logging calls: remove noise, add structure, enforce levels, and flag PII.',
      },
      {
        command: '/clean-logs <file>',
        description: 'Audit a specific file or module for debug noise, incorrect log levels, and PII or secrets in logs.',
      },
    ],
  },
];
