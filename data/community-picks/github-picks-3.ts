import type { Setup } from '@/lib/setup/types';

const CREATED_AT = '2026-07-07T00:00:00.000Z';

export const githubPicks3: Setup[] = [
  // ── Agents (6) ──────────────────────────────────────────────────────────────

  {
    kind: 'agent',
    id: 'github-rshah515-subagents-v1',
    slug: 'github-rshah515-subagents',
    name: 'rshah515 133+ Subagents',
    tagline: '133+ specialized subagents spanning the full SDLC, mobile, marketing, and incident response.',
    description:
      'A collection of over 133 Claude Code subagents covering every stage of the software ' +
      'development lifecycle, plus mobile (React Native, Flutter), marketing, tech leadership, ' +
      'and incident response. Agents auto-discover on startup from `~/.claude/agents/` or the ' +
      'project `.claude/agents/` directory — no manual activation required.',
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

A collection of 133+ Claude Code subagents covering the full SDLC plus mobile (React Native, Flutter), marketing, tech leadership, and incident response. Agents auto-discover on startup from \`~/.claude/agents/\` or the project \`.claude/agents/\` directory — no manual activation step needed.

## Commands

Clone the repo and copy the desired agent files to \`~/.claude/agents/\` (global) or \`.claude/agents/\` (project-local). Agents become available on the next Claude Code startup.

- \`tech-lead\`: Reviews architecture decisions and provides senior-level guidance on system design trade-offs.
- \`incident-responder\`: Follows on-call runbooks step by step to diagnose and resolve production incidents.

## Example output

Invoking \`tech-lead\` on a proposed microservices split returns a structured review: rationale for the split, identified coupling risks, recommended service boundaries, and an ASCII data-flow diagram.
`,
      },
    ],
    repoUrl: 'https://github.com/rshah515/claude-code-subagents',
    githubStars: 2000,
    capabilities: [
      {
        command: 'tech-lead',
        description: 'Reviews architecture decisions and provides senior-level guidance on system design trade-offs.',
      },
      {
        command: 'incident-responder',
        description: 'Follows on-call runbooks to diagnose and resolve production incidents step by step.',
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
      'concern: TypeScript, Python, Terraform, Pulumi, Ansible, GitHub Actions, Stripe, ' +
      'Auth0, and OWASP Top 10. Supports tiered model selection so expensive Opus reasoning ' +
      'is reserved for complex decisions while Haiku handles lighter tasks.',
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

100+ production-ready Claude Code subagents each scoped to a specific tool or domain: TypeScript, Python, Terraform, Pulumi, Ansible, GitHub Actions, Stripe, Auth0, and OWASP Top 10. Tiered model selection (Opus / Sonnet / Haiku) keeps cost proportional to task complexity.

## Commands

Clone the repo and copy the desired agent files to \`~/.claude/agents/\`. Agents activate on the next Claude Code startup.

- \`terraform-expert\`: Plans and applies Terraform infrastructure changes with a rationale for each resource decision.
- \`owasp-top10-expert\`: Reviews code against the OWASP Top 10 and produces a prioritized vulnerability report.

## Example output

Running \`terraform-expert\` on a new VPC config returns: a plan summary, a risk flag for overly permissive security group rules, a recommended fix, and the corrected HCL block ready to paste.
`,
      },
    ],
    repoUrl: 'https://github.com/0xfurai/claude-code-subagents',
    githubStars: 2000,
    capabilities: [
      {
        command: 'terraform-expert',
        description: 'Plans and applies Terraform infrastructure changes with explanations of each resource decision.',
      },
      {
        command: 'owasp-top10-expert',
        description: 'Reviews code against the OWASP Top 10 and produces a prioritized vulnerability report.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-subagent-collective-v1',
    slug: 'github-subagent-collective',
    name: 'Sub-Agent Collective',
    tagline: 'Hub-and-spoke agent coordination: a routing agent, 25+ specialists, TDD enforcement, contract-validated handoffs.',
    description:
      'A context-engineering research project by vanzan01 implementing hub-and-spoke agent ' +
      'coordination: a central routing agent dispatches work to 25+ specialist agents with ' +
      'TDD enforcement and contract-validated handoffs between each stage. Designed to study ' +
      'how structured inter-agent contracts reduce context drift on long-running tasks.',
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

A hub-and-spoke multi-agent system where a central routing agent inspects each incoming task, selects the right specialist from 25+, and passes a contract-validated context object. The TDD-enforcer agent prevents any implementation specialist from handing off until its tests pass.

## Commands

Install via \`npx\` following the repo README. The hub agent registers as a Claude Code subagent and begins routing on first invocation.

- Hub routing agent: Receives a task description, selects the appropriate specialist (architect, backend, QA, etc.), and delivers a validated handoff context.
- TDD-enforcer agent: Validates that tests exist and pass before accepting a handoff from any implementation specialist.

## Example output

"Build a user auth flow" → hub selects architect → architect returns a design contract → backend implements against the contract → QA runs tests → QA issues a signed-off handoff back to the hub.
`,
      },
    ],
    repoUrl: 'https://github.com/vanzan01/claude-code-sub-agent-collective',
    githubStars: 1000,
    capabilities: [
      {
        command: 'hub-routing-agent',
        description: 'Receives a task, selects the appropriate specialist from 25+ agents, and delivers a contract-validated handoff.',
      },
      {
        command: 'tdd-enforcer-agent',
        description: 'Validates that tests exist and pass before accepting a handoff from any implementation specialist.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-claude-code-templates-v1',
    slug: 'github-claude-code-templates',
    name: 'Claude Code Templates',
    tagline: 'Node CLI with 600+ agents, 200+ commands, 55+ MCP configs, 39+ hooks, and an interactive browser.',
    description:
      'A Node.js CLI by davila7 giving one-command access to over 600 curated Claude Code ' +
      'agents, 200+ slash commands, 55+ MCP server configurations, and 39+ hooks — all ' +
      'browsable via an interactive TUI. Run one command to drop a complete, curated setup ' +
      'into your project or global Claude Code directory.',
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

A Node.js CLI giving instant access to 600+ Claude Code agents, 200+ slash commands, 55+ MCP server configs, and 39+ hooks. Run it bare for an interactive TUI to browse and select, or pass flags to install non-interactively in CI or setup scripts.

## Commands

- \`npx claude-code-templates@latest\`: Launches the interactive TUI to browse and install agents, commands, MCP configs, and hooks.
- \`npx claude-code-templates@latest --agent development-team/frontend-developer --command testing/generate-tests --mcp development/github-integration --yes\`: Installs a specific agent, command, and MCP config non-interactively into \`.claude/\`.

## Example output

Selecting "development-team" + "github-integration" in the TUI drops a \`.claude/agents/frontend-developer.md\`, a \`generate-tests\` slash command, and a configured \`github-integration\` MCP entry — all in a single step.
`,
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
        description: 'Non-interactively installs a specific agent, slash command, and MCP config into `.claude/`.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-hooks-mastery-v1',
    slug: 'github-hooks-mastery',
    name: 'Claude Code Hooks Mastery',
    tagline: 'Teaching repo implementing all 13 Claude Code hook events with single-file UV Python scripts.',
    description:
      'A teaching repository by disler that implements every one of Claude Code\'s 13 hook ' +
      'events as standalone, single-file UV Python scripts. Covers logging, prompt-level ' +
      'control, TTS alerts, and dangerous-command blocking — each wired via ' +
      '`.claude/settings.json`. Designed to be read and selectively copied, not installed wholesale.',
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

Implements all 13 Claude Code hook events as single-file UV Python scripts: logging, prompt-level control, TTS alerts, and dangerous-command blocking. Copy the scripts you want to \`.claude/hooks/\` and wire them to the appropriate events in \`.claude/settings.json\`.

## Commands

- Copy \`.claude/hooks/*.py\` to your project: Installs individual hook scripts into your project's Claude Code config directory.
- Wire hooks in \`.claude/settings.json\`: Registers each script against its hook event (e.g., \`PreToolUse\`, \`PostToolUse\`) so Claude Code invokes it at the right moment.

## Example output

An \`rm -rf\` bash command triggers the \`PreToolUse\` hook — the script inspects the command, matches a dangerous-pattern rule, and returns a block response with a human-readable explanation before Claude Code executes the tool.
`,
      },
    ],
    repoUrl: 'https://github.com/disler/claude-code-hooks-mastery',
    githubStars: 3000,
    capabilities: [
      {
        command: 'PreToolUse hook',
        description: 'Intercepts every tool call before execution; can log, modify input, or block the call based on command content.',
      },
      {
        command: 'PostToolUse hook',
        description: 'Runs after a tool returns; captures output for logging, TTS alerts, or downstream validation.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-agentic-sprint-v1',
    slug: 'github-agentic-sprint',
    name: 'Agentic Sprint',
    tagline: 'Claude Code plugin running autonomous spec-driven sprints across 9 coordinated specialist agents.',
    description:
      'A Claude Code plugin by damienlaine that runs autonomous spec-driven sprints. Nine ' +
      'specialist agents — architect, backend, frontend, QA, UI testing, CI/CD, and others — ' +
      'coordinate in a self-iterating loop, advancing only when quality gates pass. Write a ' +
      'spec, run `/sprint`, and the agents iterate until all gates close.',
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

A Claude Code plugin that runs autonomous spec-driven sprints across 9 specialist agents (architect, backend, frontend, QA, UI testing, CI/CD). Agents self-iterate; a sprint closes only when all quality gates pass. Designed for hands-off multi-agent execution from a written spec.

## Commands

- \`/plugin marketplace add damienlaine/agentic-forge\` then \`/plugin install sprint\`: Installs the sprint plugin from the marketplace into the current Claude Code project.
- \`/sprint\`: Kicks off an autonomous sprint from the current spec file; agents coordinate and iterate until all gates return green.

## Example output

Spec "add Stripe payments" → architect designs the integration, backend implements it, QA writes and runs tests, CI/CD validates the pipeline — sprint closes automatically when all gates pass.
`,
      },
    ],
    repoUrl: 'https://github.com/damienlaine/agentic-sprint',
    githubStars: 500,
    capabilities: [
      {
        command: '/plugin install sprint',
        description: 'Installs the agentic-sprint plugin from the marketplace into the current Claude Code project.',
      },
      {
        command: '/sprint',
        description: 'Kicks off an autonomous spec-driven sprint; 9 specialist agents self-iterate until all quality gates pass.',
      },
    ],
  },

  // ── Harnesses (7) ───────────────────────────────────────────────────────────

  {
    kind: 'harness',
    id: 'github-get-shit-done-v1',
    slug: 'github-get-shit-done',
    name: 'Get Shit Done',
    tagline: 'Meta-prompting, spec-driven harness with five phases and fresh 200K-token subagent contexts per task.',
    description:
      'A meta-prompting, context-engineering, spec-driven system that runs through five ' +
      'phases — initialize, discuss, plan, execute, verify — each spawning subagents in ' +
      'fresh 200K-token contexts to avoid context pollution. Install globally with one npx ' +
      'command; slash commands drive each phase.',
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

A five-phase spec-driven harness (initialize → discuss → plan → execute → verify) where each execution task spawns a subagent in a fresh 200K-token context. Prevents context drift on long tasks by isolating each phase into its own clean agent run.

## Commands

- \`npx get-shit-done-cc@latest --claude --global\`: Installs the harness globally into Claude Code.
- \`/gsd-ship <milestone-id>\`: Runs the full five-phase flow — discuss defines requirements, plan creates atomic tasks, execute spawns fresh-context agents, verify runs tests and gates.
- \`/gsd-new-milestone\`: Starts a new milestone, triggering the discussion and planning phases before execution begins.

## Example output

\`/gsd-ship 1\` on a "user authentication" milestone: discuss phase collects requirements in a structured doc, plan creates 8 atomic tasks, execute spawns one agent per task in a fresh 200K context, verify runs the test suite and gates on green.
`,
      },
    ],
    repoUrl: 'https://github.com/gsd-build/get-shit-done',
    githubStars: 59000,
    capabilities: [
      {
        command: '/gsd-ship <milestone-id>',
        description: 'Runs the full five-phase flow for a milestone, spawning subagents in fresh 200K-token contexts for each execution task.',
      },
      {
        command: '/gsd-new-milestone',
        description: 'Starts a new milestone, triggering the discussion and planning phases before execution begins.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-task-master-v1',
    slug: 'github-task-master',
    name: 'Claude Task Master',
    tagline: 'AI task-management system: decomposes a PRD into dependency-scored tasks and feeds them to Claude Code via MCP.',
    description:
      'An AI task-management system by eyaltoledano that decomposes a product requirements ' +
      'document into structured tasks with dependency graphs and complexity scores, then ' +
      'feeds them one at a time to Claude Code through an MCP server. Supports a TDD ' +
      'autopilot loop and is used by tens of thousands of developers.',
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

Decomposes a PRD into structured tasks with dependency graphs and complexity scores, then exposes them to Claude Code through an MCP server. Claude Code calls \`next_task\` to get the next unblocked task with full context, implements it, marks it done, and repeats — always in dependency order.

## Commands

- \`claude mcp add task-master-ai --scope user -- npx -y task-master-ai@latest\`: Registers the Task Master MCP server into Claude Code's user-scope config.
- \`parse_prd\` (MCP tool): Parses a PRD document and generates a structured task list with dependency graph and complexity scores.
- \`next_task\` (MCP tool): Returns the next unblocked task with full context for Claude Code to implement.
- \`tm autopilot\`: Runs a TDD loop — fetch task, implement, run tests, mark done, repeat until all tasks are complete.

## Example output

Paste a 10-page PRD → \`parse_prd\` creates 15 tasks; \`next_task\` returns "Create user schema (complexity 3, blocked by none)"; after implementation \`set_task_status done\` advances to the next unblocked task automatically.
`,
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
        description: 'Returns the next unblocked task with full context so Claude Code can implement it in dependency order.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-cc-sdd-v1',
    slug: 'github-cc-sdd',
    name: 'cc-sdd',
    tagline: 'Minimal multi-runtime spec-driven harness: a discovery entry point routes tasks across 8 specialist agents with human phase gates.',
    description:
      'A minimal spec-driven-development harness by gotalab supporting multiple runtimes. ' +
      'A `/kiro-discovery` entry point evaluates task complexity and routes work into spec ' +
      'creation, direct implementation, or decomposition across 8 specialist agents. Humans ' +
      'approve at phase gates before the harness advances.',
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

A minimal spec-driven harness with a single discovery entry point that evaluates task complexity and routes to the right path: direct implementation for small tasks, or a gated multi-agent decomposition (8 specialists) for larger ones. Humans review and approve at each phase gate before the harness advances.

## Commands

- \`/kiro-discovery "<task>"\`: Evaluates complexity, writes brief.md and an optional roadmap.md, then routes to direct implementation or multi-agent decomposition across 8 specialists.
- Phase gate approval: The harness pauses at each phase boundary for explicit human approval, preventing autonomous runaway between stages.

## Example output

\`/kiro-discovery "add dark mode"\` → scores complexity as low → writes brief.md → direct implementation. \`/kiro-discovery "rebuild auth layer"\` → high complexity → writes brief.md + roadmap.md → 8-agent decomposition with gated phases.
`,
      },
    ],
    repoUrl: 'https://github.com/gotalab/cc-sdd',
    githubStars: 2000,
    capabilities: [
      {
        command: '/kiro-discovery "<task>"',
        description: 'Evaluates task complexity, writes brief.md and optionally roadmap.md, and routes to direct implementation or multi-agent decomposition.',
      },
      {
        command: 'phase-gate approval',
        description: 'Pauses the harness at each phase boundary for explicit human approval before advancing to the next agent stage.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-metaswarm-v1',
    slug: 'github-metaswarm',
    name: 'MetaSwarm',
    tagline: 'Self-improving multi-agent orchestration: 18 agents, 13 skills, 9-phase workflow, quality gates that block on failure.',
    description:
      'A self-improving multi-agent orchestration framework by dsifry with 18 agents, ' +
      '13 skills, 15 commands, and a 9-phase workflow: Research → Plan → Design Review Gate ' +
      '→ Decompose → Execute → Review → PR → Shepherd → Closure. TDD is enforced with ' +
      'coverage thresholds; quality gates block state transitions on failure.',
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

An 18-agent, 9-phase orchestration framework with enforced TDD coverage thresholds and blocking quality gates. The Design Review Gate prevents the Decompose phase from starting until the Architect's output passes review. Phases: Research → Plan → Design Review Gate → Decompose → Execute → Review → PR → Shepherd → Closure.

## Commands

- Install via INSTALL.md: Sets up MetaSwarm and registers all 18 agents and 15 commands in the project.
- \`/metaswarm-start <task>\`: Launches the 9-phase workflow; quality gates block phase transitions on failure and TDD coverage below the configured threshold.

## Example output

If the Design Review Gate returns FAIL, the Architect revises the design and the gate re-runs — the Decompose phase cannot begin until the gate passes. A coverage shortfall blocks the PR phase in the same way.
`,
      },
    ],
    repoUrl: 'https://github.com/dsifry/metaswarm',
    githubStars: 1000,
    capabilities: [
      {
        command: '/metaswarm-start <task>',
        description: 'Launches the 9-phase orchestration workflow; quality gates block phase transitions on failure and TDD coverage below threshold.',
      },
      {
        command: 'design-review-gate',
        description: "Blocks the Decompose phase until the Architect's design output passes the review gate; revisions loop until the gate passes.",
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-git-workflow-v1',
    slug: 'github-git-workflow',
    name: 'Spec-Driven Git Workflow',
    tagline: 'Claude Code plugin: spec to GitHub Issues to autonomous TDD execution to pull request, end to end.',
    description:
      'A Claude Code plugin by bodangren implementing a spec-driven Git workflow. Sprint ' +
      'planning decomposes approved specs into GitHub Issues, sprint-manager coordinates ' +
      'autonomous execution, issue-executor implements each issue via TDD, and ' +
      'change-integrator opens a pull request. The full cycle from spec to merged PR is ' +
      'automated.',
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

A Claude Code plugin where five specialist agents collaborate on a spec-driven Git cycle: spec-author writes the spec, sprint-planner creates GitHub Issues, sprint-manager coordinates execution, issue-executor implements each issue via TDD, and change-integrator opens the pull request.

## Commands

Install via the plugin marketplace. Each agent is invoked as a Claude Code subagent.

- \`sprint-planner\`: Decomposes an approved spec into GitHub Issues with acceptance criteria and assigns them to the current sprint.
- \`issue-executor\` (TDD): Picks up a GitHub Issue, implements it test-first, and hands off to change-integrator when tests pass.

## Example output

After a spec is approved, \`sprint-planner\` creates 8 GitHub Issues; \`issue-executor\` implements each via TDD and triggers a PR; \`change-integrator\` merges them in dependency order.
`,
      },
    ],
    repoUrl: 'https://github.com/bodangren/git-workflow',
    githubStars: 500,
    capabilities: [
      {
        command: 'sprint-planner',
        description: 'Decomposes an approved spec into GitHub Issues with acceptance criteria and assigns them to the current sprint.',
      },
      {
        command: 'issue-executor',
        description: 'Implements a single GitHub Issue via TDD and hands off to change-integrator when tests pass.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-code-workflows-v1',
    slug: 'github-code-workflows',
    name: 'Claude Code Workflows',
    tagline: 'Production workflows where each phase runs in a fresh agent context to prevent context contamination.',
    description:
      'Production-grade Claude Code workflows by shinpr where each phase — requirements, ' +
      'design, implementation, QA — runs in a fresh agent context to avoid cross-phase ' +
      'context contamination. An analyzer selects the appropriate workflow tier based on ' +
      'measured task complexity before execution begins.',
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

Phase-based production workflows where requirements, design, implementation, and QA each run in a separate fresh-context agent. An analyzer first measures task complexity and selects the right workflow tier, preventing lightweight tasks from paying the cost of a full multi-agent flow.

## Commands

- \`/plugin install dev-workflows@claude-code-workflows\`: Installs the plugin and registers all phase-based workflow commands into the current project.
- Phase workflow execution: After install, the analyzer picks the workflow tier (simple, standard, or high-complexity) and runs each phase in an isolated fresh-context agent.

## Example output

"Add user notifications" → analyzer classifies as high-complexity → writes PRD + UI spec in phase 1 → component agent runs in a fresh context → backend agent runs in a separate fresh context → testing agent validates in isolation, with no cross-phase context bleed.
`,
      },
    ],
    repoUrl: 'https://github.com/shinpr/claude-code-workflows',
    githubStars: 1000,
    capabilities: [
      {
        command: '/plugin install dev-workflows@claude-code-workflows',
        description: 'Installs the plugin and registers all phase-based workflow commands (requirements, design, implementation, QA) into the project.',
      },
      {
        command: 'phase workflow execution',
        description: 'Analyzer selects the complexity tier and runs each phase in an isolated fresh-context agent to prevent cross-phase context contamination.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-code-action-v1',
    slug: 'github-claude-code-action',
    name: 'Claude Code Action',
    tagline: "Anthropic's official GitHub Action: @claude mentions in PRs trigger fixes, reviews, and branch creation in CI.",
    description:
      'The official Anthropic GitHub Action for running Claude Code in CI pipelines. ' +
      'Responds to `@claude` mentions in pull requests and issues, auto-reviews PRs, ' +
      'implements requested fixes, creates branches, and opens pull requests. Supports ' +
      'five authentication backends.',
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

Anthropic's official GitHub Action that runs Claude Code inside CI. Triggered by \`@claude\` mentions in PR comments or issues: Claude branches, makes the requested change, runs tests, and opens a PR. Also performs automatic PR reviews when configured. Supports five auth backends (GitHub App, PAT, and others).

## Commands

- \`/install-github-app\`: Run in the terminal to install the Claude GitHub App on the repository and generate the workflow YAML stub.
- Add \`.github/workflows/claude.yml\`: Drops the workflow file into the repository to activate the Action on PR and issue events.
- \`@claude <instruction>\`: Mention Claude in a PR or issue comment to trigger a scoped fix, review, or branch + PR creation.

## Example output

Comment "@claude fix the null pointer on line 47" → Claude creates a branch, applies the fix, runs the test suite, and opens a PR with a description explaining the change — all within a single CI run.
`,
      },
    ],
    repoUrl: 'https://github.com/anthropics/claude-code-action',
    githubStars: 5000,
    capabilities: [
      {
        command: '/install-github-app',
        description: 'Installs the Claude GitHub App on the repository and generates the workflow YAML stub for `.github/workflows/`.',
      },
      {
        command: '@claude <instruction>',
        description: 'Triggers Claude Code in CI from a PR or issue comment; Claude branches, implements the fix, and opens a pull request.',
      },
    ],
  },
];
