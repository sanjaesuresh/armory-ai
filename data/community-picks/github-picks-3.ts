import type { Setup } from '@/lib/setup/types';

const CREATED_AT = '2026-07-07T00:00:00.000Z';

export const githubPicks3: Setup[] = [
  // ── Agents (6) ──────────────────────────────────────────────────────────────

  {
    kind: 'agent',
    id: 'github-rshah515-subagents-v1',
    slug: 'github-rshah515-subagents',
    name: 'rshah515 165+ Subagents',
    tagline: '165+ specialized subagents spanning the full SDLC, mobile, marketing, and incident response.',
    description:
      'A collection of over 165 Claude Code subagents organized into categories: core, languages ' +
      '(13), frameworks (13), infrastructure (13), data/AI, databases (7), quality (11), ' +
      'mobile, web3, marketing (30), and more. Agents auto-discover on startup from ' +
      '~/.claude/agents/ or the project .claude/agents/ directory — no manual activation required.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'sdlc', 'claude-code', 'mobile', 'incident-response', 'engineering'],
    category: 'engineering',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

A collection of 165+ Claude Code subagents organized into 20+ categories covering the complete software development lifecycle. Categories include core development (architect, debugger, code-reviewer, refactorer), 13 language specialists (Python, Go, TypeScript, Rust, Java, Kotlin, Swift, and more), 13 framework experts (React, Next.js, Vue, Django, Rails, FastAPI, NestJS, Svelte, and more), 13 infrastructure agents (Terraform, Kubernetes, Ansible, GitOps, observability), 7 database specialists (PostgreSQL, MongoDB, Redis, Elasticsearch, Neo4j, Cassandra), 11 QA agents (Playwright, Cypress, Jest, k6, chaos engineering), 30 marketing specialists (SEO, GEO, email, content, PR), industry verticals (fintech, healthcare, govtech, edtech), and orchestrators (prd-writer, project-manager, tech-lead, incident-commander).

Agents auto-discover from ~/.claude/agents/ (global) or .claude/agents/ (project-local) on Claude Code startup — no manual activation step needed.

## Key agents

- architect — system design, API architecture, database schemas
- prd-writer — product requirements and user stories; recommended starting point for complex projects
- project-manager — multi-agent orchestration and task breakdown
- tech-lead — architecture decisions and code standards
- incident-commander — crisis response and emergency coordination
- terraform-expert — IaC, multi-cloud deployments, state management
- security-auditor — OWASP, penetration testing, compliance
- owasp-top10-expert — web application security review

## Install

Clone the repo to your Claude agents directory:

    cd ~/.claude/agents
    git clone https://github.com/rshah515/claude-code-subagents comprehensive-agents

Agents activate on the next Claude Code startup. Use explicit invocation ("use the architect to design...") or let Claude auto-route based on context.

## When to use

Use prd-writer first for any complex, multi-component project; then project-manager to coordinate the implementation agents. For single-domain work, invoke a specific expert directly ("have the nextjs-expert refactor this component").`,
      },
    ],
    repoUrl: 'https://github.com/rshah515/claude-code-subagents',
    githubStars: 2000,
    capabilities: [
      {
        command: 'architect',
        description: 'Designs system architecture, API contracts, and database schemas with rationale for each decision.',
      },
      {
        command: 'prd-writer',
        description: 'Generates product requirements documents and user stories; recommended starting point for complex projects.',
      },
      {
        command: 'project-manager',
        description: 'Orchestrates multi-agent workflows, breaks down tasks, and manages timelines across specialist agents.',
      },
      {
        command: 'tech-lead',
        description: 'Reviews architecture decisions, sets code standards, and provides senior technical guidance.',
      },
      {
        command: 'incident-commander',
        description: 'Coordinates crisis response and emergency procedures during production incidents.',
      },
      {
        command: 'terraform-expert',
        description: 'Plans and applies Terraform IaC changes across AWS, GCP, and Azure with state management and module design.',
      },
      {
        command: 'security-auditor',
        description: 'Reviews code against OWASP standards and produces a prioritized vulnerability report.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-0xfurai-subagents-v1',
    slug: 'github-0xfurai-subagents',
    name: '0xfurai Production Subagents',
    tagline: '100+ production-ready subagents for Terraform, Pulumi, GitHub Actions, Stripe, Auth0, OWASP, and more.',
    description:
      'Over 100 production-ready Claude Code subagents each scoped to a specific tool or ' +
      'concern: programming languages (Python, Go, Rust, TypeScript, and 18 more), web frameworks, ' +
      'databases, ORMs, testing frameworks, infrastructure tools (Terraform, Pulumi, Ansible, ' +
      'Kubernetes), messaging systems, and security (OWASP Top 10, JWT, OAuth). Each agent ' +
      'carries embedded model guidance so expensive reasoning is reserved for complex decisions.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'terraform', 'security', 'owasp', 'github-actions', 'claude-code', 'devops'],
    category: 'engineering',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

100+ production-ready Claude Code subagents each scoped to a specific tool or domain. Coverage spans:

- Languages: Python, TypeScript, JavaScript, Go, Rust, Java, C#, Kotlin, Swift, Dart, Haskell, OCaml, Erlang, Elixir, Clojure, Perl, PHP, Ruby, Scala, Lua, and Bash
- Web: React, Vue, Angular, Svelte, SolidJS, Next.js, Remix, NestJS, Express, FastAPI, Flask, Rails, Laravel, Django, Actix, Phoenix, Gin, Fiber, ASP.NET Core
- Mobile and desktop: React Native, Flutter, iOS, SwiftUI, Android, Electron, Tauri, Expo
- Databases and ORMs: PostgreSQL, MySQL, SQLite, MongoDB, Redis, Neo4j, Cassandra, CockroachDB, DynamoDB, Elasticsearch, Prisma, TypeORM, Mongoose
- Infrastructure: Docker, Kubernetes, Terraform, Pulumi, Jenkins, GitHub Actions, GitLab CI, CircleCI, Ansible
- Services: Stripe, Braintree, Auth0, Keycloak, AWS SNS/SQS, OpenAI API
- Messaging: RabbitMQ, Kafka, NATS, MQTT, WebSocket, gRPC, GraphQL, tRPC
- Testing: Jest, Vitest, Cypress, Playwright, Selenium, Puppeteer, TestCafe, Mocha, AVA
- Security: OWASP Top 10, JWT, OAuth 2.0/OIDC
- Data science/ML: Pandas, NumPy, Scikit-learn, TensorFlow, PyTorch, LangChain
- Monitoring: Prometheus, Grafana, Loki, ELK, OpenTelemetry
- Background jobs: Celery, Sidekiq, BullMQ

## Install

    cd ~/.claude
    git clone https://github.com/0xfurai/claude-code-subagents.git

Agents in the cloned ~/.claude/claude-code-subagents/agents/ directory activate automatically. You can also copy individual agent files to ~/.claude/agents/ for selective use.

## When to use

Pick the agent matching your specific tool — for example, invoke the stripe-expert for payment integration, owasp-top10-expert after implementing auth, or terraform-expert when writing infrastructure changes. Claude Code auto-routes based on context, or you can invoke explicitly ("use the pulumi-expert for this stack").`,
      },
    ],
    repoUrl: 'https://github.com/0xfurai/claude-code-subagents',
    githubStars: 2000,
    capabilities: [
      {
        command: 'terraform-expert',
        description: 'Plans and applies Terraform IaC changes with explanations of each resource decision and multi-cloud support.',
      },
      {
        command: 'owasp-top10-expert',
        description: 'Reviews code against the OWASP Top 10 and produces a prioritized vulnerability report.',
      },
      {
        command: 'stripe-expert',
        description: 'Implements Stripe payment processing, webhook handling, and subscription billing with PCI compliance guidance.',
      },
      {
        command: 'auth0-expert',
        description: 'Configures Auth0 authentication and authorization flows, including social login and RBAC.',
      },
      {
        command: 'pulumi-expert',
        description: 'Writes Pulumi infrastructure-as-code in Python, TypeScript, or Go with multi-language support.',
      },
      {
        command: 'github-actions-expert',
        description: 'Builds GitHub Actions CI/CD workflows with caching, matrix builds, and deployment gates.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-subagent-collective-v1',
    slug: 'github-subagent-collective',
    name: 'Sub-Agent Collective',
    tagline: 'NPX-installable TDD-focused collective: /van routing hub, 30+ specialists, Context7 docs lookup, enforced RED→GREEN→REFACTOR.',
    description:
      'An NPX-installable collection of 30+ TDD-focused Claude Code agents by vanzan01. A central ' +
      '/van command routes work through @task-orchestrator to the right specialist. All agents enforce ' +
      'RED→GREEN→REFACTOR — tests are written before implementation. Context7 integration pulls real ' +
      'library documentation instead of letting agents guess at APIs.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'orchestration', 'tdd', 'hub-and-spoke', 'research', 'claude-code'],
    category: 'engineering',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

An NPX-installable collection of 30+ Claude Code agents centered on TDD and Context7-powered documentation lookup. The /van entry point routes all requests through @task-orchestrator, which analyzes complexity and picks the right specialist. Every implementation agent delivers a TDD completion contract showing RED, GREEN, and REFACTOR phases with test results before handing off.

Core implementation agents: @component-implementation-agent (UI components with tests), @feature-implementation-agent (business logic with coverage), @infrastructure-implementation-agent (build systems), @testing-implementation-agent (test suites), @polish-implementation-agent (performance optimization).

Quality and validation: @quality-agent (code review), @devops-agent (CI/CD), @functional-testing-agent (Playwright browser testing), @enhanced-quality-gate, @completion-gate.

Research: @research-agent (Context7 documentation), @prd-research-agent (requirement breakdown).

Installation installs CLAUDE.md behavioral rules, .claude/settings.json with hook configuration, .claude/agents/ (30+ agent files), .claude/hooks/ (test-driven-handoff.sh, collective-metrics.sh), and .claude-collective/ (Vitest test templates, metrics).

## Install

    npx claude-code-collective init

For selective install:

    npx claude-code-collective init --minimal       # core agents only
    npx claude-code-collective init --testing-only  # testing framework only
    npx claude-code-collective init --hooks-only    # hooks and behavioral system only
    npx claude-code-collective init --interactive   # guided setup

Restart Claude Code after install — hooks require a fresh session to load.

Validate the install:

    npx claude-code-collective validate
    npx claude-code-collective status

## When to use

When you want TDD enforced automatically rather than by convention. The hook system blocks handoffs until tests exist and pass, so agents cannot skip the RED phase. Works best for greenfield features and MVP prototyping where test discipline matters from the start.`,
      },
    ],
    repoUrl: 'https://github.com/vanzan01/claude-code-sub-agent-collective',
    githubStars: 1000,
    capabilities: [
      {
        command: '/van',
        description: 'Routes a task through @task-orchestrator, which selects the right specialist and enforces TDD from the start.',
      },
      {
        command: '@task-orchestrator',
        description: 'Central routing hub that analyzes request complexity and delegates to the appropriate specialist agent.',
      },
      {
        command: '@feature-implementation-agent',
        description: 'Implements business logic with comprehensive test coverage, enforcing RED→GREEN→REFACTOR before handoff.',
      },
      {
        command: '@research-agent',
        description: 'Pulls real, current library documentation via Context7 before agents write code against an API.',
      },
      {
        command: '@functional-testing-agent',
        description: 'Runs browser-based end-to-end tests with Playwright as part of the validation pipeline.',
      },
      {
        command: 'npx claude-code-collective validate',
        description: 'Validates that all agents, hooks, and CLAUDE.md behavioral rules are correctly installed.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-claude-code-templates-v1',
    slug: 'github-claude-code-templates',
    name: 'Claude Code Templates',
    tagline: 'Node CLI and web dashboard (aitmpl.com) with 600+ agents, 200+ commands, 55+ MCP configs, 39+ hooks, and analytics tools.',
    description:
      'A Node.js CLI and companion web dashboard (aitmpl.com) by davila7 giving one-command access to ' +
      '600+ curated Claude Code agents, 200+ slash commands, 55+ MCP server configurations, and 39+ hooks. ' +
      'Includes analytics, a live conversation monitor, and a plugin dashboard. Browse interactively or ' +
      'install non-interactively via flags.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'cli', 'mcp', 'hooks', 'commands', 'claude-code', 'tooling'],
    category: 'engineering',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

A Node.js CLI and companion web dashboard at aitmpl.com giving instant access to 600+ Claude Code agents, 200+ slash commands, 55+ MCP server configs, and 39+ hooks sourced from Anthropic official releases, the community, and curated third-party collections (including K-Dense-AI scientific skills, obra superpowers, alirezarezvani role skills, and wshobson agents).

The CLI provides four additional tools beyond the template catalog:

- Analytics — real-time monitoring of Claude Code sessions with live state detection and performance metrics
- Conversation monitor — mobile-optimized interface for viewing Claude responses in real time, with optional Cloudflare Tunnel for remote access
- Health check — diagnostics ensuring your Claude Code installation is optimized
- Plugin dashboard — unified view of installed plugins, marketplaces, and permissions

## Install

Interactive TUI (browse and select):

    npx claude-code-templates@latest

Non-interactive (CI or scripts):

    npx claude-code-templates@latest --agent development-team/frontend-developer --command testing/generate-tests --mcp development/github-integration --yes

Other flags:

    npx claude-code-templates@latest --analytics       # launch session analytics
    npx claude-code-templates@latest --chats           # open conversation monitor
    npx claude-code-templates@latest --chats --tunnel  # conversation monitor with Cloudflare Tunnel
    npx claude-code-templates@latest --health-check    # run diagnostics
    npx claude-code-templates@latest --plugins         # open plugin dashboard

## When to use

Use when you want a curated starting point for Claude Code rather than assembling agents and commands from scratch. The web dashboard at aitmpl.com lets you browse the full catalog before installing. Works well as the first step when setting up a new project or when you want to add a specific capability (e.g., a security-auditor agent or a generate-tests command) without hunting for it manually.`,
      },
    ],
    repoUrl: 'https://github.com/davila7/claude-code-templates',
    githubStars: 8000,
    capabilities: [
      {
        command: 'npx claude-code-templates@latest',
        description: 'Launches an interactive TUI to browse and install agents, commands, MCP configs, and hooks into Claude Code.',
      },
      {
        command: 'npx claude-code-templates@latest --agent <name> --command <name> --mcp <name> --yes',
        description: 'Non-interactively installs a specific agent, slash command, and MCP config into .claude/ in one step.',
      },
      {
        command: 'npx claude-code-templates@latest --analytics',
        description: 'Launches real-time session analytics monitoring Claude Code state and performance metrics.',
      },
      {
        command: 'npx claude-code-templates@latest --chats',
        description: 'Opens a mobile-optimized conversation monitor for viewing Claude responses in real time.',
      },
      {
        command: 'npx claude-code-templates@latest --health-check',
        description: 'Runs comprehensive diagnostics to ensure the Claude Code installation is correctly configured.',
      },
      {
        command: 'npx claude-code-templates@latest --plugins',
        description: 'Opens the plugin dashboard for a unified view of installed plugins and marketplace options.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-hooks-mastery-v1',
    slug: 'github-hooks-mastery',
    name: 'Claude Code Hooks Mastery',
    tagline: 'Teaching repo implementing all 13 Claude Code hook events with single-file UV Python scripts, TTS alerts, 9 status line variants, and team builder/validator agents.',
    description:
      'A teaching repository by disler (IndyDevDan) that implements every one of Claude Code\'s 13 hook ' +
      'events as standalone, single-file UV Python scripts. Covers all hook types — UserPromptSubmit, ' +
      'PreToolUse, PostToolUse, Stop, SubagentStart/Stop, SessionStart/End, PermissionRequest, ' +
      'PreCompact, PostToolUseFailure, and Setup — plus 9 custom status line variants, 8 output styles, ' +
      'team-based builder/validator agents, and a meta-agent that generates new agents.',
    role: 'general',
    industry: null,
    tags: ['hooks', 'claude-code', 'python', 'automation', 'devops', 'security'],
    category: 'devops',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

A teaching repository implementing all 13 Claude Code hook events as standalone single-file UV Python scripts, wired via .claude/settings.json. UV handles per-script dependencies with no virtual environment overhead.

Hook implementations:

- user_prompt_submit.py — logs prompts, optionally validates for dangerous patterns, and injects project context before Claude sees the prompt
- pre_tool_use.py — blocks dangerous commands (rm -rf, .env access) and logs all tool calls before execution
- post_tool_use.py — logs results, converts JSONL transcripts to readable JSON
- post_tool_use_failure.py — structured error logging with timestamps and full context
- notification.py — optional TTS alerts when Claude needs input (ElevenLabs > OpenAI > pyttsx3 priority)
- stop.py — AI-generated completion messages with TTS playback after Claude finishes
- subagent_start/stop.py — subagent spawn/completion logging and optional TTS
- session_start.py — loads git status, recent issues, and context files at session start
- session_end.py — session logging and optional temp file cleanup
- permission_request.py — audits permission dialogs; auto-approves read-only ops (Read, Glob, Grep, safe Bash)
- pre_compact.py — backs up transcripts before compaction
- setup.py — repository initialization and periodic maintenance hooks

Also includes: 9 status line variants (git info, cost tracking, context window usage bar, token/cache stats, session duration, powerline style), 8 output styles (genui HTML, tables, YAML, bullet points, ultra-concise, TTS summary), team-based builder+validator agents for parallel code quality enforcement, and a meta-agent that generates new agent files from descriptions.

## Install

Requires Astral UV and Claude Code. Optional: ElevenLabs or OpenAI API keys for TTS.

Copy the .claude/ directory to your project or clone the repo and symlink. Register hooks in .claude/settings.json using $CLAUDE_PROJECT_DIR prefix for reliable path resolution:

    "PreToolUse": [{"hooks": [{"type": "command", "command": "uv run $CLAUDE_PROJECT_DIR/.claude/hooks/pre_tool_use.py"}]}]

UserPromptSubmit options: --log-only (default), --validate (enable security filtering), --context (inject project context).

## When to use

Use as a reference when building your own hooks — read the scripts, understand the exit code behavior (0 = success, 2 = block with stderr to Claude, other = non-blocking error), then copy the scripts you need. Good starting points: pre_tool_use.py for dangerous command blocking, user_prompt_submit.py for audit logging, and any status line variant for terminal context.`,
      },
    ],
    repoUrl: 'https://github.com/disler/claude-code-hooks-mastery',
    githubStars: 3000,
    capabilities: [
      {
        command: 'UserPromptSubmit hook',
        description: 'Fires before Claude sees a prompt; can log, validate for dangerous patterns, block the prompt (exit 2), or inject project context.',
      },
      {
        command: 'PreToolUse hook',
        description: 'Intercepts every tool call before execution; blocks dangerous commands (rm -rf, .env access) via exit code 2 with a stderr message to Claude.',
      },
      {
        command: 'PostToolUse hook',
        description: 'Runs after a tool returns; captures output for logging, TTS alerts, and JSONL transcript conversion.',
      },
      {
        command: 'Stop hook',
        description: 'Intercepts when Claude finishes responding; can block stoppage (exit 2) to force task completion, or generate TTS completion messages.',
      },
      {
        command: 'meta-agent',
        description: 'Generates new properly-formatted Claude Code agent files from plain-English descriptions, pulling latest docs automatically.',
      },
      {
        command: 'status_line_v6.py',
        description: 'Displays a visual context window usage bar with percentage and tokens remaining in the terminal status line.',
      },
      {
        command: '/plan_w_team',
        description: 'Meta-prompt command that generates a team plan, spawns builder and validator subagents in parallel, and self-validates output via embedded stop hooks.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-agentic-sprint-v1',
    slug: 'github-agentic-sprint',
    name: 'Agentic Sprint',
    tagline: 'Claude Code plugin running convergent spec-driven sprints: architect + implementation agents + testing agents iterate until all quality gates close.',
    description:
      'A Claude Code plugin by damienlaine (part of the Agentic Forge ecosystem) that runs ' +
      'autonomous spec-driven sprints. A project-architect agent coordinates implementation ' +
      'agents (python-dev, nextjs-dev, cicd-agent, allpurpose-agent, website-designer) and ' +
      'testing agents (qa-test-agent, ui-test-agent). The sprint loops up to 5 iterations, ' +
      'shrinking completed work from specs each pass until all gates close.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'sprint', 'spec-driven', 'orchestration', 'tdd', 'claude-code'],
    category: 'engineering',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

A Claude Code plugin implementing convergent spec-driven sprints. The /sprint command drives a self-iterating state machine: read specs.md → architect creates api-contract.md → implementation agents build in parallel → testing agents validate → architect removes completed work from specs and iterates. The picture starts noisy; each pass reduces noise until only working code remains. Most sprints converge in under 5 iterations; if they don't, the system pauses and asks what to do.

Two persistent "second brain" files anchor agent memory across sprints:
- .claude/project-goals.md — product vision and constraints (you maintain)
- .claude/project-map.md — architecture, API surface, and file layout (architect maintains)

Agents read these instead of scanning the whole codebase, keeping context focused.

Implementation agents: python-dev (FastAPI/PostgreSQL), nextjs-dev (Next.js 16/React 19), cicd-agent (GitHub Actions/Docker), allpurpose-agent (any stack), website-designer (static HTML/CSS).

Testing agents: qa-test-agent (pytest/jest/vitest), ui-test-agent (E2E via Chrome browser MCP), nextjs-diagnostics-agent (runtime monitoring for Next.js).

Manual testing mode: set "UI Testing Mode: manual" in specs.md to open a Chrome tab, interact yourself, and feed your session report back to the architect before the next iteration.

## Install

From Agentic Forge marketplace (recommended):

    /plugin marketplace add damienlaine/agentic-forge
    /plugin install sprint

For local development:

    git clone https://github.com/damienlaine/agentic-sprint.git
    claude --plugin-dir ./agentic-sprint

## When to use

Use /sprint:setup first to create project-goals.md and project-map.md, then /sprint:new to create specs.md. Keep specs small — multiple small sprints beat one large one. Commit before each sprint run so you have a rollback point. Good for: new features with clear acceptance criteria, iterative UI work with real browser validation, and full-stack features where backend and frontend need coordinated implementation.`,
      },
    ],
    repoUrl: 'https://github.com/damienlaine/agentic-sprint',
    githubStars: 500,
    capabilities: [
      {
        command: '/sprint',
        description: 'Runs the full convergent sprint loop: architect analyzes specs, implementation agents build, testing agents validate, loop repeats until all gates close.',
      },
      {
        command: '/sprint:new',
        description: 'Creates .claude/sprint/N/specs.md for the next sprint with a structured template.',
      },
      {
        command: '/sprint:setup',
        description: 'Interactive onboarding that creates project-goals.md (business vision) and project-map.md (technical architecture) through guided questions.',
      },
      {
        command: '/sprint:test',
        description: 'Opens a live browser session for manual UI testing outside of a sprint; saves a report that feeds into the next sprint run.',
      },
      {
        command: '/sprint:generate-map',
        description: 'Generates or updates project-map.md by analyzing the current codebase structure.',
      },
      {
        command: '/sprint:clean',
        description: 'Removes old sprint directories to keep the workspace tidy.',
      },
    ],
  },

  // ── Harnesses (7) ───────────────────────────────────────────────────────────

  {
    kind: 'harness',
    id: 'github-get-shit-done-v1',
    slug: 'github-get-shit-done',
    name: 'GSD Core',
    tagline: 'Five-phase context-engineering harness (Discuss → Plan → Execute → Verify → Ship) with fresh 200K-token subagent contexts per task.',
    description:
      'GSD Core (formerly "get-shit-done", now at open-gsd/gsd-core) is a context-engineering and ' +
      'spec-driven development framework that drives AI coding agents through a disciplined five-phase ' +
      'loop. Heavy research, planning, and execution run in fresh-context subagents while the main ' +
      'session stays lean. Supports Claude Code, OpenCode, Antigravity CLI, Kimi CLI, Kilo, Codex, ' +
      'Copilot, Cursor, Windsurf, and more.',
    role: 'general',
    industry: null,
    tags: ['harness', 'spec-driven', 'context-engineering', 'claude-code', 'multi-agent'],
    category: 'engineering',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

GSD Core (formerly the "get-shit-done" repo, now maintained at github.com/open-gsd/gsd-core) is a context-engineering and spec-driven development framework. It solves context rot — the quality degradation that accumulates as an AI fills its context window — by running all heavy research, planning, and execution work in fresh-context subagents while keeping the main session lean. Structured artifacts (STATE.md, CONTEXT.md) survive session boundaries so work can resume without re-explaining scope.

Each milestone repeats the same five-step phase loop:

1. Discuss — capture implementation decisions before anything is planned
2. Plan — research, decompose, and verify the plan fits a fresh context window
3. Execute — run plans in parallel waves; each executor starts with a clean 200K-token context
4. Verify — walk through what was built; diagnose and fix before declaring done
5. Ship — create the PR, archive the phase, repeat for the next milestone

## Install

    npx @opengsd/gsd-core@latest

The installer prompts for your runtime (Claude Code, OpenCode, Codex, Cursor, Windsurf, and more) and whether to install globally or locally.

Start a new project:

    /gsd-new-project   # greenfield
    /gsd-onboard       # existing codebase

## When to use

Use GSD Core when you have a multi-milestone project where context drift across long sessions is a real problem. The five-phase loop works best when milestones are scoped to a few hundred lines of change — large enough to benefit from planning, small enough for a single execute wave. The STATE.md/CONTEXT.md artifacts make it practical to pause and resume across multiple sessions without losing implementation decisions.`,
      },
    ],
    repoUrl: 'https://github.com/gsd-build/get-shit-done',
    githubStars: 59000,
    capabilities: [
      {
        command: '/gsd-new-project',
        description: 'Initializes GSD Core for a greenfield project, creating STATE.md and CONTEXT.md scaffolding.',
      },
      {
        command: '/gsd-onboard',
        description: 'Onboards an existing codebase into the GSD phase loop, analyzing the repo before the first Discuss phase.',
      },
      {
        command: 'Discuss phase',
        description: 'Captures implementation decisions in a structured session before any planning begins.',
      },
      {
        command: 'Execute phase',
        description: 'Runs plan tasks in parallel waves, each executor starting with a clean 200K-token context to prevent drift.',
      },
      {
        command: 'Verify phase',
        description: 'Walks through what was built, diagnoses failures, and generates fix plans before declaring the phase done.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-task-master-v1',
    slug: 'github-task-master',
    name: 'Claude Task Master',
    tagline: 'AI task-management system: parse a PRD into dependency-scored tasks, expose them via MCP, and let Claude Code implement them in dependency order.',
    description:
      'An AI task-management system (now called "Taskmaster", maintained by eyaltoledano and RalphEcom) that ' +
      'parses a PRD into structured tasks with dependency graphs and complexity scores, then exposes them to ' +
      'Claude Code and other editors through an MCP server. Supports Anthropic, OpenAI, Gemini, Perplexity, ' +
      'xAI, OpenRouter, Azure OpenAI, Groq, Ollama, and Claude Code CLI (no API key required).',
    role: 'general',
    industry: null,
    tags: ['harness', 'task-management', 'mcp', 'prd', 'tdd', 'claude-code', 'engineering'],
    category: 'engineering',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

Taskmaster (github.com/eyaltoledano/claude-task-master) is an AI task-management system that parses a PRD into structured tasks with dependency graphs and complexity scores, then feeds them one at a time to Claude Code through an MCP server. Claude Code calls next_task to get the next unblocked task with full context, implements it, marks it done, and repeats — always in dependency order.

Supports 36 MCP tools (configurable via TASK_MASTER_TOOLS env var), a CLI, and multiple AI providers for the main, research, and fallback models. Selectable tool loading reduces context window usage: "core" mode (7 tools) uses ~5K tokens vs "all" (36 tools) ~21K tokens.

Key MCP tools: parse_prd, next_task, get_task, set_task_status, expand_task, analyze_project_complexity, add_task, add_subtask, complexity_report, research (web-augmented fresh-context research), and move (cross-tag task movement).

Tags and workstreams let you organize tasks across parallel tracks (e.g., backlog, in-progress, done) with cross-tag movement.

## Install

Claude Code (via MCP):

    claude mcp add taskmaster-ai -- npx -y task-master-ai

Add API keys to the env section of the MCP config or your project .env. Minimum: one of ANTHROPIC_API_KEY, OPENAI_API_KEY, GOOGLE_API_KEY, or use Claude Code CLI with no key via claude-code/sonnet or claude-code/opus.

Initialize:

    task-master init
    # then in your AI chat: "Initialize taskmaster-ai in my project"

Parse a PRD:

    task-master parse-prd your-prd.txt

## When to use

Works well for projects driven from a written PRD where you want AI to respect task dependencies automatically. The complexity scorer helps prioritize which tasks need more detailed sub-task expansion before implementation. The research tool augments task context with fresh web information when working with recent APIs or rapidly-changing libraries.`,
      },
    ],
    repoUrl: 'https://github.com/eyaltoledano/claude-task-master',
    githubStars: 27000,
    capabilities: [
      {
        command: 'parse_prd',
        description: 'Parses a PRD document and generates a structured task list with dependency graph and complexity scores.',
      },
      {
        command: 'next_task',
        description: 'Returns the next unblocked task with full context so Claude Code implements tasks in dependency order.',
      },
      {
        command: 'expand_task',
        description: 'Breaks a high-complexity task into sub-tasks with their own dependency annotations.',
      },
      {
        command: 'analyze_project_complexity',
        description: 'Scores all tasks by complexity and outputs a report to guide sub-task expansion priorities.',
      },
      {
        command: 'research',
        description: 'Runs a web-augmented, fresh-context research pass to provide current documentation for a task before implementation.',
      },
      {
        command: 'task-master init',
        description: 'Initializes Taskmaster in a project, creating the .taskmaster/ directory with config and example PRD template.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-cc-sdd-v1',
    slug: 'github-cc-sdd',
    name: 'cc-sdd',
    tagline: 'Kiro-inspired spec-driven harness: /kiro-discovery routes tasks into specs or direct implementation; /kiro-impl runs TDD autonomously per task with independent review.',
    description:
      'A spec-driven-development harness (v3) by gotalab supporting 8 AI coding agents. ' +
      'A /kiro-discovery entry point evaluates task scope and routes into: extend an existing spec, ' +
      'implement directly, create one spec, decompose into multiple specs, or mixed decomposition. ' +
      '/kiro-impl then runs each task with a fresh implementer (TDD RED→GREEN), an independent reviewer, ' +
      'and auto-debug on failure. Humans approve at phase gates. Inspired by the Kiro IDE spec methodology.',
    role: 'general',
    industry: null,
    tags: ['harness', 'spec-driven', 'multi-agent', 'claude-code', 'phase-gates'],
    category: 'engineering',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

cc-sdd v3 is a spec-driven-development harness inspired by the Kiro IDE methodology. It installs 17 Agent Skills (loaded on demand) that cover a complete SDLC from discovery through autonomous implementation.

Entry point: /kiro-discovery evaluates a task or idea and routes into one of five paths — extend an existing spec, implement directly with no spec, create one new spec, decompose into multiple specs, or mixed decomposition. It writes brief.md (always) and roadmap.md (for multi-spec work), so you can resume a workstream without re-explaining scope.

Spec workflow: /kiro-spec-requirements → /kiro-spec-design (generates requirements.md and design.md with EARS-format acceptance criteria, Mermaid architecture diagrams, and a File Structure Plan) → /kiro-spec-tasks (produces tasks.md with Boundary and Depends annotations per task).

Autonomous implementation: /kiro-impl runs tasks from tasks.md one at a time. Each task gets a fresh implementer running TDD (RED→GREEN) behind a feature flag, an independent reviewer checking DoD compliance with file:line evidence, and an auto-debug pass that investigates root causes in a clean context when the reviewer rejects twice. Learnings from earlier tasks propagate forward via Implementation Notes in tasks.md.

Supports Claude Code (stable), Codex (stable), Cursor, Copilot, Windsurf, OpenCode, Gemini CLI, and Antigravity (all beta). 13 languages supported via --lang flag.

## Install

    npx cc-sdd@latest                      # Claude Code Skills (default)
    npx cc-sdd@latest --codex-skills       # Codex
    npx cc-sdd@latest --cursor-skills      # Cursor IDE
    npx cc-sdd@latest --lang ja            # Japanese docs

Then in your agent:

    /kiro-discovery Photo albums with upload, tagging, and sharing
    /kiro-spec-init photo-albums
    /kiro-spec-requirements photo-albums
    /kiro-spec-design photo-albums
    /kiro-spec-tasks photo-albums
    /kiro-impl photo-albums

## When to use

Use cc-sdd when spec boundaries are the hard problem — for example, a multi-developer feature where you need explicit interface contracts between modules before anyone writes code. The File Structure Plan and task Boundary annotations are what prevent one agent's implementation from stepping on another's. For smaller single-scope changes, /kiro-discovery will route directly to implementation, skipping the spec phase.`,
      },
    ],
    repoUrl: 'https://github.com/gotalab/cc-sdd',
    githubStars: 2000,
    capabilities: [
      {
        command: '/kiro-discovery',
        description: 'Evaluates a task or idea, writes brief.md (and roadmap.md for multi-spec work), and routes to the appropriate next command.',
      },
      {
        command: '/kiro-impl',
        description: 'Autonomously implements tasks from tasks.md: fresh implementer per task (TDD RED→GREEN), independent reviewer, auto-debug on repeated failure.',
      },
      {
        command: '/kiro-spec-requirements',
        description: 'Generates requirements.md with EARS-format requirements and acceptance criteria for a named spec.',
      },
      {
        command: '/kiro-spec-design',
        description: 'Generates design.md with Mermaid architecture diagrams and a File Structure Plan that drives task boundaries.',
      },
      {
        command: '/kiro-spec-tasks',
        description: 'Produces tasks.md with Boundary and Depends annotations per task, ready for /kiro-impl.',
      },
      {
        command: '/kiro-spec-batch',
        description: 'Turns a roadmap into multiple specs in parallel, with cross-spec review to catch contradictions and interface mismatches.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-metaswarm-v1',
    slug: 'github-metaswarm',
    name: 'MetaSwarm',
    tagline: 'Production-tested 9-phase orchestration: 18 agents, parallel 5-reviewer design gate, adversarial per-task review, BEADS task tracking, and self-learning knowledge base.',
    description:
      'A self-improving multi-agent orchestration framework by dsifry extracted from a production SaaS ' +
      'codebase. 18 specialized agent personas, a 9-phase workflow (Research → Plan → Design Review Gate ' +
      '→ Work Unit Decomposition → Orchestrated Execution → Final Review → PR Creation → PR Shepherd → ' +
      'Closure & Learning), BEADS git-native task tracking, and a JSONL knowledge base that grows with ' +
      'every PR. Works with Claude Code, Gemini CLI, and Codex CLI.',
    role: 'general',
    industry: null,
    tags: ['harness', 'orchestration', 'multi-agent', 'tdd', 'quality-gates', 'claude-code'],
    category: 'engineering',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

MetaSwarm is a production-tested multi-agent orchestration framework extracted from a SaaS codebase with 100% test coverage and hundreds of autonomous PRs. It provides:

18 agent personas: Researcher, Architect, Coder, Security Auditor, PR Shepherd, and others.

9-phase workflow: Research → Plan → Design Review Gate → Work Unit Decomposition → Orchestrated Execution (4-phase loop per task: IMPLEMENT → VALIDATE → ADVERSARIAL REVIEW → COMMIT) → Final Review → PR Creation → PR Shepherd → Closure & Learning.

Parallel Design Review Gate: 5 specialist agents (PM, Architect, Designer, Security, CTO) review in parallel with a 3-iteration cap before human escalation. The gate blocks decomposition until it passes.

Orchestrated Execution Loop: orchestrator validates independently (runs tests itself, never trusts subagent self-reports), adversarial reviewers check DoD compliance with file:line evidence, and optionally delegates IMPLEMENT or REVIEW to external models (Codex CLI, Gemini CLI) for cost savings and cross-model adversarial review.

BEADS task tracking: git-native issue/task management with dependency tracking and knowledge priming. Selective retrieval (bd prime --files ... --keywords ... --work-type ...) loads only the relevant knowledge subset before each task.

Self-learning: after every PR merge, /self-reflect analyzes reviewer comments, build failures, and architectural decisions, writing structured JSONL entries back to the knowledge base. The system also introspects the session for repeated user corrections and friction points, proposing new skills or commands.

Supports Claude Code (plugin marketplace), Gemini CLI (extension), and Codex CLI (plugin marketplace). Cross-platform installer: npx metaswarm init.

## Install

Claude Code:

    claude plugin marketplace add dsifry/metaswarm-marketplace
    claude plugin install metaswarm

Then:

    /setup

Start a task:

    /start-task Add a webhook system with retry logic, signature verification, and a delivery log UI.

## When to use

MetaSwarm is designed for team-scale AI development on production codebases where quality gates must be non-negotiable. The adversarial review pattern (writer always reviewed by a different model or agent) and mandatory TDD coverage thresholds mean it's slower than single-shot prompting but catches integration breakage before it reaches a human reviewer. Best suited for features that cross multiple modules or require security review.`,
      },
    ],
    repoUrl: 'https://github.com/dsifry/metaswarm',
    githubStars: 1000,
    capabilities: [
      {
        command: '/start-task',
        description: 'Launches the 9-phase workflow from a plain-English description; routes through Research, Plan, Design Review Gate, and into Orchestrated Execution.',
      },
      {
        command: '/setup',
        description: 'Interactive project setup that configures CLAUDE.md, AGENTS.md, knowledge base templates, and BEADS task tracking.',
      },
      {
        command: 'Design Review Gate',
        description: 'Five specialist agents (PM, Architect, Designer, Security, CTO) review the design in parallel; blocks decomposition until the gate passes or escalates to human after 3 iterations.',
      },
      {
        command: 'Orchestrated Execution Loop',
        description: 'Per-task 4-phase loop (IMPLEMENT → VALIDATE → ADVERSARIAL REVIEW → COMMIT) where the orchestrator validates independently and a different model reviews the writer\'s work.',
      },
      {
        command: '/self-reflect',
        description: 'Post-PR reflection that extracts patterns, gotchas, and anti-patterns from reviewer comments and session history, writing them to the JSONL knowledge base.',
      },
      {
        command: 'npx metaswarm init',
        description: 'Cross-platform installer that detects installed AI CLIs and installs MetaSwarm for all of them in one pass.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-git-workflow-v1',
    slug: 'github-git-workflow',
    name: 'AgenticDev (git-workflow)',
    tagline: 'Modular spec-driven SDLC: prd-authoring → spec-authoring → sprint-planner → issue-executor (TDD) → change-integrator — end to end from idea to merged PR.',
    description:
      'AgenticDev is a modular spec-driven development methodology by bodangren implemented as ' +
      'Claude Code skills. Four phases: Discovery & Planning (prd-authoring, spec-authoring), ' +
      'Organization (sprint-planner decomposes specs into GitHub Issues), Execution (issue-executor ' +
      'implements each issue via TDD with a repro-first loop; sprint-manager coordinates), and ' +
      'Integration (change-integrator promotes specs, updates the retrospective, and closes issues).',
    role: 'general',
    industry: null,
    tags: ['harness', 'git', 'github-issues', 'sprint', 'tdd', 'spec-driven', 'devops'],
    category: 'devops',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

AgenticDev (github.com/bodangren/git-workflow) is a modular spec-driven development methodology implemented as Claude Code skills. The core principle is "think before you code" — every feature starts with a written spec that must be approved before sprint planning begins.

12 skills in the catalog:

- project-init — scaffolds docs/specs/ and docs/changes/ directory structure
- project-migrate — AI-powered migration of existing brownfield projects into the AgenticDev structure
- prd-authoring — generates Product Briefs, Research Plans, and full PRDs from initial ideas
- spec-authoring — manages the Spec PR workflow (draft spec → PR → review → approval)
- doc-indexer — scans project docs and produces a just-in-time frontmatter context map for agents
- doc-validator — enforces documentation standards and catches files in wrong locations
- sprint-planner — decomposes an approved spec (epic) into atomic GitHub Issues with a milestone
- sprint-manager — orchestrates a full sprint by coordinating issue-executor sub-agents serially
- issue-executor — the core workhorse: loads context, creates a TDD plan (Repro → Fix → Verify), opens a feature branch, implements, and manages the fix loop
- change-integrator — post-merge cleanup: promotes spec to "approved," auto-summarizes learnings into RETROSPECTIVE.md, closes issues
- agent-integrator — keeps AGENTS.md updated as new skills are added
- frontend-design — specialized skill for UI/UX tasks and frontend component design

## Install

    # New project
    bash skills/project-init/scripts/init-project.sh
    bash skills/agent-integrator/scripts/update-agents-file.sh

    # Existing project
    bash skills/project-migrate/scripts/project-migrate.sh

## When to use

Works best when you want GitHub Issues as the coordination artifact — each issue maps to a TDD implementation cycle, and the milestone gives a clear progress view. The repro-first approach in issue-executor is particularly effective for bug fixes: write a script that reproduces the failure before touching the fix, then verify the script passes after. The RETROSPECTIVE.md accumulates learnings across sprints automatically.`,
      },
    ],
    repoUrl: 'https://github.com/bodangren/git-workflow',
    githubStars: 500,
    capabilities: [
      {
        command: 'prd-authoring',
        description: 'Generates Product Briefs, Research Plans, and full PRDs from initial ideas using AI.',
      },
      {
        command: 'spec-authoring',
        description: 'Manages the Spec PR workflow: drafts a detailed technical specification and analyzes PR review feedback before approval.',
      },
      {
        command: 'sprint-planner',
        description: 'Decomposes an approved spec into atomic GitHub Issues with acceptance criteria and organizes them into a milestone.',
      },
      {
        command: 'issue-executor',
        description: 'Implements a single GitHub Issue via a TDD repro-first loop: create repro script → make it fail → implement fix → verify it passes.',
      },
      {
        command: 'sprint-manager',
        description: 'Orchestrates an entire sprint by coordinating issue-executor sub-agents serially through all milestone issues.',
      },
      {
        command: 'change-integrator',
        description: 'Post-merge cleanup: promotes spec to approved, auto-summarizes learnings into RETROSPECTIVE.md, and closes related issues.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-code-workflows-v1',
    slug: 'github-code-workflows',
    name: 'Claude Code Workflows',
    tagline: 'Plugin marketplace with dev-workflows, dev-workflows-frontend, and dev-workflows-fullstack — each running specialized agents through requirements, design, implementation, and quality in fresh contexts.',
    description:
      'Production Claude Code workflows by shinpr organized as three marketplace plugins: ' +
      'dev-workflows (backend/general), dev-workflows-frontend (React/TypeScript), and ' +
      'dev-workflows-fullstack (both layers with design-sync). A requirement-analyzer routes ' +
      'tasks by complexity (small/medium/large); each phase runs in a fresh agent context. ' +
      'Includes diagnosis, reverse-engineering, and PR-review optional add-ons.',
    role: 'general',
    industry: null,
    tags: ['harness', 'workflows', 'claude-code', 'context-isolation', 'phase-based', 'engineering'],
    category: 'engineering',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

Production-grade Claude Code workflows organized as three marketplace plugins: dev-workflows (backend/general), dev-workflows-frontend (React/TypeScript), and dev-workflows-fullstack (both layers with design-sync between them). Each phase — requirements, design, implementation, QA — runs in a fresh agent context to prevent cross-phase context contamination.

The requirement-analyzer classifies task size: small (1-2 files) → direct implementation; medium (3-5 files) → codebase-analyzer + technical-designer; large (6+ files) → prd-creator + codebase-analyzer + technical-designer. Larger work generates PRDs, Architecture Decision Records, Design Docs, and acceptance test scaffolds before any code is written.

Specialist agents per plugin:

Backend (dev-workflows): prd-creator, technical-designer, codebase-analyzer, acceptance-test-generator, task-executor (TDD), quality-fixer, code-reviewer, code-verifier, scope-discoverer (for reverse engineering), investigator/verifier/solver (diagnosis loop).

Frontend (dev-workflows-frontend): ui-spec-designer (captures loading/error/empty state matrices), ui-analyzer (reads external design sources via MCP), technical-designer-frontend, task-executor-frontend (Testing Library), quality-fixer-frontend.

Shared: requirement-analyzer, work-planner, task-decomposer, document-reviewer, design-sync (cross-doc consistency), security-reviewer, rule-advisor.

All entry points use the recipe- prefix. Use tab completion (/recipe-) to see available recipes.

## Install

    claude
    /plugin marketplace add shinpr/claude-code-workflows
    /plugin install dev-workflows@claude-code-workflows   # backend
    /reload-plugins

## When to use

Use /recipe-implement for a new backend feature; /recipe-front-design then /recipe-front-build for React components; /recipe-fullstack-implement when the feature spans both layers. Use /recipe-diagnose for root cause analysis (loops between investigator and verifier until path coverage is sufficient). Use /recipe-reverse-engineer on undocumented legacy code to generate PRD and Design Docs before an AI can safely modify it. docs/plans/ is ephemeral — add it to .gitignore; docs/prd/, docs/design/, and docs/ui-spec/ should be committed.`,
      },
    ],
    repoUrl: 'https://github.com/shinpr/claude-code-workflows',
    githubStars: 1000,
    capabilities: [
      {
        command: '/recipe-implement',
        description: 'End-to-end backend feature development: routes by complexity, generates PRD/Design Doc, implements with TDD, reviews against design doc.',
      },
      {
        command: '/recipe-front-design',
        description: 'Creates a UI Spec capturing all screen states (loading/error/empty) and a frontend Design Doc with React component architecture.',
      },
      {
        command: '/recipe-fullstack-implement',
        description: 'Full-stack feature in one command: separate Design Docs per layer, design-sync for cross-layer consistency, layer-aware task routing.',
      },
      {
        command: '/recipe-diagnose',
        description: 'Diagnosis loop: investigator maps failure points, verifier checks path coverage, re-investigates if insufficient, solver produces solutions with tradeoff analysis.',
      },
      {
        command: '/recipe-reverse-engineer',
        description: 'Generates PRD and Design Docs from existing code; fullstack option covers both backend and frontend in a single workflow.',
      },
      {
        command: '/recipe-task',
        description: 'Executes a single scoped task (bug fix, small change) with quality checks and type verification — available in all three plugins.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-code-action-v1',
    slug: 'github-claude-code-action',
    name: 'Claude Code Action',
    tagline: "Anthropic's official GitHub Action: @claude mentions in PRs and issues trigger code fixes, reviews, branch creation, and structured automation outputs in CI.",
    description:
      'The official Anthropic GitHub Action for running Claude Code in CI pipelines. ' +
      'Responds to @claude mentions in pull requests and issues, performs automatic PR reviews, ' +
      'implements requested fixes, creates branches, and opens pull requests. Supports five ' +
      'authentication backends: Anthropic direct API, workload identity federation, Amazon Bedrock, ' +
      'Google Vertex AI, and Microsoft Foundry. Runs entirely on your own GitHub runner.',
    role: 'general',
    industry: null,
    tags: ['harness', 'github-actions', 'ci-cd', 'anthropic', 'official', 'devops'],
    category: 'devops',
    source: 'github',
    author: null,
    version: '1.0.0',
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
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
    artifactFiles: [
      {
        name: 'OVERVIEW.md',
        isPrimary: true,
        content: `## What it does

The official Anthropic GitHub Action that runs Claude Code inside CI. Triggered by @claude mentions in PR comments or issues, by automated prompts in workflow YAML, or by issue assignment. Claude branches, makes the requested change, runs tests, and opens a PR with a progress-tracking comment (checkboxes updated in real time). Also performs automatic PR reviews when configured.

Authentication backends: Anthropic direct API key, workload identity federation (no long-lived secrets), Amazon Bedrock, Google Vertex AI, and Microsoft Foundry.

The action runs entirely on your own GitHub runner — Anthropic API calls go to your chosen provider, no code leaves your infrastructure.

Use cases from the official Solutions Guide:

- Automatic PR code review — full review on every PR open/update
- Path-specific reviews — trigger only when critical files change
- External contributor reviews — special handling for first-time contributors
- Custom review checklists — enforce team-specific standards
- Scheduled maintenance — automated repository health checks on cron
- Issue triage and labeling — automatic categorization from issue body
- Documentation sync — keep docs updated when source files change
- Security-focused reviews — OWASP-aligned analysis on security-sensitive files
- Structured outputs — validated JSON results exposed as GitHub Action outputs for downstream automation

## Install

Quickstart via Claude Code terminal (Anthropic API only):

    /install-github-app

This guides you through installing the GitHub App and adds the workflow YAML stub to .github/workflows/.

For Bedrock, Vertex AI, or Foundry: follow docs/cloud-providers.md for manual setup.

Manual workflow file: add .github/workflows/claude.yml with the action reference and configure triggers (pull_request, issue_comment, issues, schedule, or workflow_dispatch with an explicit prompt).

## When to use

Use the @claude mention mode for on-demand fixes and answers in existing PRs — it's the lowest-friction way to get Claude to make a targeted change. Use the automation mode (explicit prompt in workflow YAML) for scheduled tasks like dependency audits, documentation sync, or security scans. Use structured outputs when you need downstream steps to consume Claude's findings as machine-readable data.`,
      },
    ],
    repoUrl: 'https://github.com/anthropics/claude-code-action',
    githubStars: 5000,
    capabilities: [
      {
        command: '/install-github-app',
        description: 'Guides setup of the Claude GitHub App and generates the .github/workflows/claude.yml stub for Anthropic direct API users.',
      },
      {
        command: '@claude <instruction>',
        description: 'Triggers Claude Code in CI from a PR or issue comment; Claude branches, implements the fix, and opens a pull request.',
      },
      {
        command: 'Automatic PR review',
        description: 'Configured via workflow YAML to review every PR on open/update, with optional path filters for critical files.',
      },
      {
        command: 'Scheduled automation',
        description: 'Runs Claude on a cron schedule for repository health checks, documentation sync, or security scans without a human trigger.',
      },
      {
        command: 'Structured outputs',
        description: 'Returns validated JSON results as GitHub Action outputs, enabling downstream steps to consume Claude findings programmatically.',
      },
    ],
  },
];
