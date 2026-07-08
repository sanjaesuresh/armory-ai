import type { Setup } from '@/lib/setup/types';

export const devExtraHarnesses: Setup[] = [
  // ── 1. CI Pipeline Harness ─────────────────────────────────────────────────
  {
    kind: 'harness',
    id: 'curated-ci-pipeline-harness-v1',
    slug: 'ci-pipeline-harness',
    name: 'CI Pipeline Harness',
    tagline: 'Scaffold and enforce lint→typecheck→test→build gates in every CI session',
    description:
      'A Claude Code project config and instruction guide that structures a CI pipeline from ' +
      'scratch: ordered gates (lint, typecheck, test, build), fail-fast behaviour, and ' +
      'dependency caching. The settings.json wires permissions so only pipeline-relevant ' +
      'commands are allowed, keeping Claude focused on CI concerns rather than ad-hoc fixes.',
    role: 'Engineering',
    industry: null,
    tags: ['ci', 'pipeline', 'automation', 'engineering', 'claude-code', 'harness', 'devops', 'testing'],
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
        name: 'README.md',
        isPrimary: true,
        content: `# CI Pipeline Harness

A Claude Code project configuration for scaffolding and enforcing a staged CI pipeline.

## What it does

When this harness is active, Claude Code operates as a CI pipeline engineer. It follows a
strict gate order, lint → typecheck → test → build, and refuses to advance a gate until
the previous one is green. The workflow is instruction-driven: Claude reads this README and
treats it as the working contract for the session.

- **Fail-fast:** The first failing gate halts the pipeline and surfaces the output before
  continuing, so failures don't cascade.
- **Caching:** Claude proposes caching strategies for dependencies and build artefacts at
  setup time, scoped to the runner and toolchain.
- **Settings gate:** The \`settings.json\` permits only pipeline-relevant bash commands,
  preventing off-task tool use during a CI session.

## Files in this harness

| File | Purpose |
|------|---------|
| \`README.md\` | This guide, Claude reads it as its working instructions |
| \`settings.json\` | Claude Code project settings, copy to \`.claude/settings.json\` |

## Setup

1. Copy \`settings.json\` to \`.claude/settings.json\` in your project root.
2. Open your project in Claude Code. The permission gates take effect immediately.
3. Tell Claude which package manager and CI platform you are targeting, e.g.:
   "We use pnpm on GitHub Actions."

Claude will scaffold a pipeline file (e.g. \`.github/workflows/ci.yml\`) and a local
\`Makefile\` or \`package.json\` scripts block that mirrors the same gate order.

## Workflow reference

### Scaffolding a new pipeline
Tell Claude: "Set up a CI pipeline for this project."

Claude will:
1. Inspect \`package.json\` (or equivalent) for existing lint/test/build scripts.
2. Propose the four gates with concrete commands for each.
3. Draft the CI config file with fail-fast enabled and dependency caching.
4. Run the gates locally in order so you can confirm each one passes before committing.

### Adding a gate
Tell Claude: "Add a \`security-audit\` gate after \`test\`."

Claude will insert the gate in the correct position in both the CI config and the local
script block, and verify it runs without breaking the existing pipeline.

### Debugging a gate failure
Tell Claude: "Gate 2 (typecheck) is failing in CI but passes locally."

Claude will diff the CI environment against local (Node version, env vars, installed
packages) and propose the most likely fix before touching any code.

## Commands

- \`/ci-setup\`, Scaffold a full lint→typecheck→test→build pipeline for the current
  project, including a CI config file and local script equivalents.
- \`/ci-gate <gate-name>\`, Run a single gate (e.g. \`/ci-gate lint\`) and report
  pass/fail with the raw output.
- \`/ci-debug <gate-name>\`, Diagnose a failing gate: diff CI vs local environment,
  pinpoint the root cause, and propose a fix.

## Allowed bash commands

The harness permits pipeline-related commands only:

- \`Bash(npm run lint*)\`, \`Bash(npx eslint*)\`, lint gate
- \`Bash(npx tsc*)\`, typecheck gate
- \`Bash(npm test*)\`, \`Bash(npx vitest*)\`, \`Bash(npx jest*)\`, test gate
- \`Bash(npm run build*)\`, \`Bash(npx next build*)\`, build gate
- \`Bash(git diff*)\`, \`Bash(git status*)\`, \`Bash(git log*)\`, inspect state

Destructive commands (\`rm -rf\`, \`git push\`, \`git reset --hard\`) are blocked.

## Known limitations

- The harness does not auto-detect your CI platform; tell Claude which one you use at
  the start of the session.
- Caching config is proposed, not generated automatically, Claude needs to know your
  runner OS and lockfile location to produce valid cache keys.
`,
      },
      {
        name: 'settings.json',
        isPrimary: false,
        content: `{
  "permissions": {
    "allow": [
      "Read(**)",
      "Write(**)",
      "Edit(**)",
      "Bash(npm run lint*)",
      "Bash(npx eslint*)",
      "Bash(npx tsc*)",
      "Bash(npm test*)",
      "Bash(npx vitest*)",
      "Bash(npx jest*)",
      "Bash(npm run build*)",
      "Bash(npx next build*)",
      "Bash(pnpm run*)",
      "Bash(git diff*)",
      "Bash(git status*)",
      "Bash(git log*)"
    ],
    "deny": [
      "Bash(git push*)",
      "Bash(git reset --hard*)",
      "Bash(git restore*)",
      "Bash(git clean*)",
      "Bash(rm -rf*)"
    ]
  }
}
`,
      },
    ],
    capabilities: [
      {
        command: '/ci-setup',
        description: 'Scaffold a full lint→typecheck→test→build pipeline with CI config and local scripts.',
      },
      {
        command: '/ci-gate',
        description: 'Run a single named pipeline gate and report pass/fail with raw output.',
      },
      {
        command: '/ci-debug',
        description: 'Diagnose a failing gate by diffing CI vs local environment and proposing a fix.',
      },
    ],
  },

  // ── 2. Load-Test Harness ───────────────────────────────────────────────────
  {
    kind: 'harness',
    id: 'curated-load-test-harness-v1',
    slug: 'load-test-harness',
    name: 'Load-Test Harness',
    tagline: 'Define load scenarios, ramp profiles, and SLO thresholds, then get a pass/fail verdict',
    description:
      'A Claude Code project config and guide for authoring load and stress tests: scenario ' +
      'definitions, virtual-user ramp profiles, SLO thresholds for latency and error rate, ' +
      'and a structured pass/fail report. The harness keeps Claude focused on test design ' +
      'and analysis rather than ad-hoc scripting.',
    role: 'Engineering',
    industry: null,
    tags: ['load-testing', 'performance', 'slo', 'engineering', 'claude-code', 'harness', 'devops', 'stress-testing'],
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
        name: 'README.md',
        isPrimary: true,
        content: `# Load-Test Harness

A Claude Code project configuration for designing, running, and evaluating load and stress tests.

## What it does

When this harness is active, Claude Code acts as a performance-testing engineer. It helps
you define realistic load scenarios, shape ramp profiles, set SLO thresholds, execute a
run, and produce a pass/fail report against those thresholds.

- **Scenario definitions:** Claude prompts you for endpoints, payloads, and concurrency
  targets before generating any script, so the test reflects real traffic patterns.
- **Ramp profiles:** Supports constant load, step ramps, and spike/soak variants. Claude
  explains the trade-off of each before you choose.
- **SLO gates:** You specify p95/p99 latency budgets and max error-rate; the report marks
  each SLO as PASS or FAIL against the measured values.
- **Tool focus:** The \`settings.json\` restricts bash to load-test runners and read-only
  commands, so Claude stays in test-analysis mode.

## Files in this harness

| File | Purpose |
|------|---------|
| \`README.md\` | This guide, Claude reads it as its working instructions |
| \`settings.json\` | Claude Code project settings, copy to \`.claude/settings.json\` |

## Setup

1. Copy \`settings.json\` to \`.claude/settings.json\` in your project root.
2. Open your project in Claude Code.
3. Tell Claude which load-testing tool you use and where the target service runs, e.g.:
   "We use k6 against a staging server at https://api-staging.example.com."

Claude will scaffold a scenario script, a \`slo.json\` thresholds file, and a run command.

## Workflow reference

### Defining a scenario
Tell Claude: "Define a load scenario for the \`POST /orders\` endpoint."

Claude will ask:
- What does a realistic request payload look like?
- What virtual-user count represents typical peak traffic?
- Are there authentication headers or session state to simulate?

Then it generates a k6/Locust/Artillery script and a companion \`slo.json\`.

### Running a test
Tell Claude: "Run the orders scenario at 50 VUs for 5 minutes."

Claude will execute the script, stream live metrics, and produce a structured summary
when the run completes.

### Evaluating results
Tell Claude: "Evaluate the last run against our SLOs."

Claude reads the test output, compares each metric against \`slo.json\`, and returns
a report with a PASS or FAIL verdict for each threshold and an overall go/no-go.

## Example output

\`\`\`
SLO Report, POST /orders, 2026-07-07
──────────────────────────────────────
p95 latency   target: ≤ 300 ms   measured: 218 ms   ✓ PASS
p99 latency   target: ≤ 800 ms   measured: 540 ms   ✓ PASS
error rate    target: ≤ 0.1 %    measured: 0.03 %   ✓ PASS
throughput    target: ≥ 200 rps  measured: 312 rps  ✓ PASS

Overall verdict: PASS
\`\`\`

## Commands

- \`/loadtest <scenario>\`, Run a named scenario and stream live metrics until completion.
- \`/define-slo\`, Interactively define SLO thresholds (latency, error rate, throughput)
  and write them to \`slo.json\`.
- \`/slo-report\`, Evaluate the most recent test run against \`slo.json\` and return a
  structured PASS/FAIL report.

## Allowed bash commands

The harness permits load-test runners and read-only inspection:

- \`Bash(npx k6*)\`, \`Bash(k6*)\`, k6 load tests
- \`Bash(locust*)\`, Locust load tests
- \`Bash(npx artillery*)\`, Artillery load tests
- \`Bash(curl*)\`, health-check the target before a run
- \`Bash(git diff*)\`, \`Bash(git status*)\`, \`Bash(cat*)\`, inspect scripts and results

Destructive commands and pushes are blocked.

## Known limitations

- The harness does not provision infrastructure; the target service must already be running.
- Distributed load (multiple load-generators) requires manual setup outside the harness.
`,
      },
      {
        name: 'settings.json',
        isPrimary: false,
        content: `{
  "permissions": {
    "allow": [
      "Read(**)",
      "Write(**)",
      "Edit(**)",
      "Bash(npx k6*)",
      "Bash(k6*)",
      "Bash(locust*)",
      "Bash(npx artillery*)",
      "Bash(artillery*)",
      "Bash(curl*)",
      "Bash(git diff*)",
      "Bash(git status*)",
      "Bash(git log*)",
      "Bash(cat*)"
    ],
    "deny": [
      "Bash(git push*)",
      "Bash(git reset --hard*)",
      "Bash(git restore*)",
      "Bash(git clean*)",
      "Bash(rm -rf*)"
    ]
  }
}
`,
      },
    ],
    capabilities: [
      {
        command: '/loadtest',
        description: 'Run a named load scenario and stream live metrics to completion.',
      },
      {
        command: '/define-slo',
        description: 'Interactively define SLO thresholds and write them to slo.json.',
      },
      {
        command: '/slo-report',
        description: 'Evaluate the latest test run against slo.json and return a PASS/FAIL report.',
      },
    ],
  },

  // ── 3. Contract-Test Harness ───────────────────────────────────────────────
  {
    kind: 'harness',
    id: 'curated-contract-test-harness-v1',
    slug: 'contract-test-harness',
    name: 'Contract-Test Harness',
    tagline: 'Consumer-driven contract testing between services, break the build on API drift',
    description:
      'A Claude Code project config and guide for consumer-driven contract testing: define ' +
      'contracts from the consumer side, verify the provider against them, and fail the build ' +
      'automatically when the provider drifts from what consumers expect. Works with Pact or ' +
      'a plain JSON contract format.',
    role: 'Engineering',
    industry: null,
    tags: ['contract-testing', 'api', 'pact', 'microservices', 'engineering', 'claude-code', 'harness', 'testing'],
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
        name: 'README.md',
        isPrimary: true,
        content: `# Contract-Test Harness

A Claude Code project configuration for consumer-driven contract testing between services.

## What it does

When this harness is active, Claude Code follows a contract-first discipline for API
interactions between services. The consumer defines what it expects; the provider must
prove it delivers exactly that, or the build breaks.

- **Consumer side:** Claude helps you write a contract file (Pact JSON or a plain schema)
  that describes the requests your service sends and the responses it needs.
- **Provider verification:** Claude runs the contract against the live or mocked provider
  and reports which interactions pass and which fail.
- **Drift detection:** When a provider changes a response shape, status code, or required
  field, the verification step catches it before the change reaches production.
- **CI integration:** The settings gate keeps bash scoped to contract tools so the harness
  is safe to run in a CI context without broad permissions.

## Files in this harness

| File | Purpose |
|------|---------|
| \`README.md\` | This guide, Claude reads it as its working instructions |
| \`settings.json\` | Claude Code project settings, copy to \`.claude/settings.json\` |

## Setup

1. Copy \`settings.json\` to \`.claude/settings.json\` in your project root.
2. Open your project in Claude Code.
3. Tell Claude which services are involved and which tool you use, e.g.:
   "The \`orders\` service consumes the \`inventory\` service API. We use Pact."

Claude will scaffold a contracts directory, a consumer test file, and a provider
verification script.

## Workflow reference

### Defining a contract
Tell Claude: "Define a contract for how \`orders\` calls \`GET /products/:id\`."

Claude will:
1. Ask what fields the consumer actually uses from the response (not just what the
   provider returns, only what the consumer reads matters).
2. Generate a Pact interaction or JSON schema scoped to those fields.
3. Write a consumer test that records the interaction and asserts it matches the contract.

### Verifying the provider
Tell Claude: "Verify the \`inventory\` provider against the \`orders\` consumer contracts."

Claude will run the provider verification script against the contract files and report
each interaction as PASS or FAIL.

### Detecting drift
Tell Claude: "The \`inventory\` team changed the \`/products/:id\` response. Check for drift."

Claude reruns verification, highlights every broken interaction, and explains what changed
and which consumer fields are affected.

## Commands

- \`/contract <consumer> <provider> <endpoint>\`, Scaffold a consumer contract for a
  specific interaction, scoped to only the fields the consumer reads.
- \`/verify-provider <provider>\`, Run provider verification against all consumer contracts
  and report PASS/FAIL per interaction.
- \`/contract-drift\`, Rerun verification after a provider change and summarise every
  broken interaction with the field-level diff.

## Allowed bash commands

The harness permits contract-testing tools:

- \`Bash(npx pact*)\`, \`Bash(pact*)\`, Pact consumer and provider tests
- \`Bash(npm test*)\`, \`Bash(npx vitest*)\`, \`Bash(npx jest*)\`, run consumer tests
  that generate Pact files
- \`Bash(curl*)\`, probe the provider before a verification run
- \`Bash(git diff*)\`, \`Bash(git status*)\`, \`Bash(git log*)\`, inspect changes

Destructive commands and pushes are blocked.

## Known limitations

- Pact broker integration (publishing and fetching contracts from a broker) requires
  broker credentials; tell Claude your broker URL at session start.
- The harness covers HTTP/REST contracts; message-queue contracts need the Pact message
  provider setup, which Claude can scaffold if you describe your message format.
`,
      },
      {
        name: 'settings.json',
        isPrimary: false,
        content: `{
  "permissions": {
    "allow": [
      "Read(**)",
      "Write(**)",
      "Edit(**)",
      "Bash(npx pact*)",
      "Bash(pact*)",
      "Bash(npm test*)",
      "Bash(npx vitest*)",
      "Bash(npx jest*)",
      "Bash(curl*)",
      "Bash(git diff*)",
      "Bash(git status*)",
      "Bash(git log*)"
    ],
    "deny": [
      "Bash(git push*)",
      "Bash(git reset --hard*)",
      "Bash(git restore*)",
      "Bash(git clean*)",
      "Bash(rm -rf*)"
    ]
  }
}
`,
      },
    ],
    capabilities: [
      {
        command: '/contract',
        description: 'Scaffold a consumer contract for a specific endpoint, scoped to fields the consumer reads.',
      },
      {
        command: '/verify-provider',
        description: 'Run provider verification against all consumer contracts and report PASS/FAIL per interaction.',
      },
      {
        command: '/contract-drift',
        description: 'Detect drift after a provider change and summarise every broken interaction.',
      },
    ],
  },

  // ── 4. Release-Checklist Harness ───────────────────────────────────────────
  {
    kind: 'harness',
    id: 'curated-release-checklist-harness-v1',
    slug: 'release-checklist-harness',
    name: 'Release-Checklist Harness',
    tagline: 'Gate every release: green tests, changelog, version bump, rollback plan, go/no-go verdict',
    description:
      'A Claude Code project config and runbook that enforces a pre-release checklist before ' +
      'any version ships: all tests green, changelog entry present, version bumped consistently, ' +
      'rollback plan documented, and post-release monitoring confirmed. Claude delivers a ' +
      'go/no-go verdict with a per-item status before any release action is taken.',
    role: 'Engineering',
    industry: null,
    tags: ['release', 'checklist', 'changelog', 'devops', 'engineering', 'claude-code', 'harness', 'versioning'],
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
        name: 'README.md',
        isPrimary: true,
        content: `# Release-Checklist Harness

A Claude Code project configuration for gating releases with a structured pre-flight checklist.

## What it does

When this harness is active, Claude Code acts as a release gatekeeper. Before any version
ships, it walks through every item on the checklist below, assigns a PASS or FAIL to each,
and delivers a go/no-go verdict. No release proceeds until all blocking items are green.

**Checklist items (in order):**

1. **Tests green**, the full test suite passes in CI on the release commit.
2. **Changelog updated**, a \`CHANGELOG.md\` or equivalent entry exists for this version,
   listing every user-visible change.
3. **Version bumped**, \`package.json\` (and any other version sources: \`pyproject.toml\`,
   \`Cargo.toml\`, etc.) agree on the new version and follow semver.
4. **Rollback plan documented**, a rollback procedure is written and reachable (inline
   comment, wiki page, or runbook) before deployment starts.
5. **Monitoring confirmed**, at least one alerting rule covers the release's key metrics;
   the on-call engineer is aware.

Any FAIL blocks the release. Claude reports which items need attention before asking you
to proceed.

## Files in this harness

| File | Purpose |
|------|---------|
| \`README.md\` | This guide, Claude reads it as its working instructions |
| \`settings.json\` | Claude Code project settings, copy to \`.claude/settings.json\` |

## Setup

1. Copy \`settings.json\` to \`.claude/settings.json\` in your project root.
2. Open your project in Claude Code.
3. Tell Claude the version you want to release and the deployment target, e.g.:
   "We are releasing v2.4.0 to production on Render."

Claude will run through the checklist and report status before taking any further action.

## Workflow reference

### Running a full release check
Tell Claude: "Run the release checklist for v2.4.0."

Claude will:
1. Run the test suite and confirm it is green on the release commit.
2. Check \`CHANGELOG.md\` for a v2.4.0 entry and flag it if missing.
3. Read \`package.json\` and any other version files and verify they all say \`2.4.0\`.
4. Ask you to confirm or provide a rollback procedure.
5. Ask whether monitoring is in place for this release.
6. Output the verdict table and, if all green, give an explicit go-ahead.

### Generating a rollback plan
Tell Claude: "Write a rollback plan for v2.4.0."

Claude will draft a numbered runbook: how to revert the deployment, what config changes
need to be undone, and how to verify the rollback succeeded.

### Bumping the version
Tell Claude: "Bump to v2.4.0."

Claude will update every version source consistently and prompt you to review the diff
before committing.

## Example output

\`\`\`
Release checklist, v2.4.0
────────────────────────────────────────────
✓ Tests            all 312 tests pass on commit a3f9c1d
✓ Changelog        CHANGELOG.md entry found for v2.4.0
✓ Version bump     package.json, Dockerfile ARG, all say 2.4.0
✗ Rollback plan    no rollback procedure found, blocking
✓ Monitoring       Grafana alert "error-rate-high" covers /api/*

Overall verdict: NO-GO  (1 blocking item)
\`\`\`

## Commands

- \`/release-check <version>\`, Run the full pre-release checklist for the given version
  and output a per-item PASS/FAIL table with an overall go/no-go verdict.
- \`/rollback-plan <version>\`, Draft a numbered rollback runbook for the release,
  covering deployment revert, config rollback, and verification steps.
- \`/bump-version <version>\`, Update every version source in the repo to the given
  version consistently, then show the diff for review.

## Allowed bash commands

The harness permits test runners, version inspection, and read-only git:

- \`Bash(npm test*)\`, \`Bash(npx vitest*)\`, \`Bash(npx jest*)\`, run the test suite
- \`Bash(npx tsc*)\`, typecheck before release
- \`Bash(npm version*)\`, bump version in package.json
- \`Bash(git diff*)\`, \`Bash(git status*)\`, \`Bash(git log*)\`, \`Bash(git tag*)\`, inspect state
- \`Bash(cat*)\`, read version files and changelog

Destructive commands and remote pushes are blocked.

## Known limitations

- The harness does not execute the deployment itself; it only gates the release.
- Monitoring confirmation is a human-in-the-loop step: Claude asks you to confirm rather
  than querying your alerting platform directly.
`,
      },
      {
        name: 'settings.json',
        isPrimary: false,
        content: `{
  "permissions": {
    "allow": [
      "Read(**)",
      "Write(**)",
      "Edit(**)",
      "Bash(npm test*)",
      "Bash(npx vitest*)",
      "Bash(npx jest*)",
      "Bash(npx tsc*)",
      "Bash(npm version*)",
      "Bash(git diff*)",
      "Bash(git status*)",
      "Bash(git log*)",
      "Bash(git tag*)",
      "Bash(cat*)"
    ],
    "deny": [
      "Bash(git push*)",
      "Bash(git reset --hard*)",
      "Bash(git restore*)",
      "Bash(git clean*)",
      "Bash(rm -rf*)"
    ]
  }
}
`,
      },
    ],
    capabilities: [
      {
        command: '/release-check',
        description: 'Run the full pre-release checklist and output a per-item PASS/FAIL verdict.',
      },
      {
        command: '/rollback-plan',
        description: 'Draft a numbered rollback runbook covering deployment revert and verification.',
      },
      {
        command: '/bump-version',
        description: 'Update every version source in the repo consistently and show the diff.',
      },
    ],
  },

  // ── 5. Monorepo Task Harness ───────────────────────────────────────────────
  {
    kind: 'harness',
    id: 'curated-monorepo-task-harness-v1',
    slug: 'monorepo-task-harness',
    name: 'Monorepo Task Harness',
    tagline: 'Build and test only the packages affected by your change, with a task graph and caching',
    description:
      'A Claude Code project config and guide for orchestrating build and test tasks across ' +
      'a monorepo. Claude computes the affected package set from the change, maps the task ' +
      'dependency graph, runs only what needs running, and skips cached outputs, so you ' +
      'pay only for the work that actually changed.',
    role: 'Engineering',
    industry: null,
    tags: ['monorepo', 'task-graph', 'caching', 'devops', 'engineering', 'claude-code', 'harness', 'build'],
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
        name: 'README.md',
        isPrimary: true,
        content: `# Monorepo Task Harness

A Claude Code project configuration for running build and test tasks scoped to the packages
affected by a change in a monorepo.

## What it does

When this harness is active, Claude Code acts as a monorepo task orchestrator. It computes
which packages are affected by the current change, builds the dependency graph between them,
and runs only the necessary tasks in the correct order, using cached outputs wherever
possible.

- **Affected detection:** Claude uses \`git diff\` to identify changed files, maps them to
  packages, and follows the dependency graph to include any downstream packages that must
  be rebuilt or retested.
- **Task graph:** Claude makes the dependency order explicit, if \`pkg-b\` depends on
  \`pkg-a\`, it builds \`pkg-a\` first, regardless of the order packages appear in the workspace.
- **Caching:** Claude checks for existing build outputs (dist/, .turbo/, .nx-cache/) before
  running a task, and skips any package whose inputs have not changed since the last run.
- **Tool focus:** The \`settings.json\` scopes bash to monorepo toolchains (Turborepo, Nx,
  Lerna, pnpm workspaces) and read-only git.

## Files in this harness

| File | Purpose |
|------|---------|
| \`README.md\` | This guide, Claude reads it as its working instructions |
| \`settings.json\` | Claude Code project settings, copy to \`.claude/settings.json\` |

## Setup

1. Copy \`settings.json\` to \`.claude/settings.json\` in your project root.
2. Open your project in Claude Code.
3. Tell Claude which monorepo toolchain you use and where packages live, e.g.:
   "We use Turborepo. Packages are in \`packages/\` and apps in \`apps/\`."

Claude will read the workspace manifest and build an internal dependency map for the session.

## Workflow reference

### Finding affected packages
Tell Claude: "Which packages are affected by the changes on this branch?"

Claude will run \`git diff\` against the base branch, map changed files to package roots,
and traverse the dependency graph to list every package that needs to be rebuilt or retested.

### Running affected tasks
Tell Claude: "Build and test only the affected packages."

Claude will:
1. Compute the affected set.
2. Order tasks by dependency (topological sort).
3. Skip packages with unchanged inputs and valid cached outputs.
4. Run build then test for each remaining package, in order.
5. Report the per-package result and total time saved by cache hits.

### Visualising the task graph
Tell Claude: "Show me the task graph for this change."

Claude outputs a dependency tree showing which packages run in which order, which are
cached, and which are the critical-path bottlenecks.

## Example output

\`\`\`
Affected packages (4 of 12):
  pkg-utils    ← changed directly
  pkg-api      ← depends on pkg-utils
  pkg-client   ← depends on pkg-api
  app-web      ← depends on pkg-client

Task graph (build → test):
  pkg-utils    build ✓ (cache hit)   test ✓ (cache hit)
  pkg-api      build ✓ (ran 4s)      test ✓ (ran 12s)
  pkg-client   build ✓ (ran 6s)      test ✓ (ran 8s)
  app-web      build ✓ (ran 22s)     test ✓ (ran 15s)

Cache saved: ~68s  Total: 67s
\`\`\`

## Commands

- \`/affected\`, Compute and list the packages affected by the current branch's changes,
  including downstream dependents.
- \`/task-graph\`, Show the dependency graph for the affected packages: order, critical
  path, and which tasks will be cache hits.
- \`/cache-status\`, Report which packages have valid cached outputs and which need a
  fresh run based on current file hashes.

## Allowed bash commands

The harness permits monorepo toolchain commands and read-only git:

- \`Bash(npx turbo*)\`, \`Bash(turbo*)\`, Turborepo task runner
- \`Bash(npx nx*)\`, \`Bash(nx*)\`, Nx task runner
- \`Bash(pnpm run*)\`, \`Bash(pnpm --filter*)\`, pnpm workspace commands
- \`Bash(lerna*)\`, Lerna lifecycle commands
- \`Bash(npm run*)\`, fallback workspace scripts
- \`Bash(git diff*)\`, \`Bash(git status*)\`, \`Bash(git log*)\`, change detection

Destructive commands and remote pushes are blocked.

## Known limitations

- Affected detection relies on \`git diff\` against the base branch; detached-HEAD states
  may need you to tell Claude the comparison ref explicitly.
- Remote caching (Turborepo Remote Cache, Nx Cloud) is not configured by this harness;
  it handles local caching only.
`,
      },
      {
        name: 'settings.json',
        isPrimary: false,
        content: `{
  "permissions": {
    "allow": [
      "Read(**)",
      "Write(**)",
      "Edit(**)",
      "Bash(npx turbo*)",
      "Bash(turbo*)",
      "Bash(npx nx*)",
      "Bash(nx*)",
      "Bash(pnpm run*)",
      "Bash(pnpm --filter*)",
      "Bash(lerna*)",
      "Bash(npm run*)",
      "Bash(git diff*)",
      "Bash(git status*)",
      "Bash(git log*)"
    ],
    "deny": [
      "Bash(git push*)",
      "Bash(git reset --hard*)",
      "Bash(git restore*)",
      "Bash(git clean*)",
      "Bash(rm -rf*)"
    ]
  }
}
`,
      },
    ],
    capabilities: [
      {
        command: '/affected',
        description: 'List packages affected by the current branch changes, including downstream dependents.',
      },
      {
        command: '/task-graph',
        description: 'Show the dependency graph for affected packages with order and cache-hit predictions.',
      },
      {
        command: '/cache-status',
        description: 'Report which packages have valid cached outputs and which need a fresh run.',
      },
    ],
  },
];
