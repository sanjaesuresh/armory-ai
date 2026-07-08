import type { Setup } from '@/lib/setup/types';

/**
 * Five external Claude Code toolkit repos authored as first-class Armory setup
 * catalog items (kind='setup', tier='advanced', source='community').
 *
 * These are honest operating-note layers — they describe how to route work through
 * each installed toolkit but do not reproduce any toolkit's actual prompt content.
 * The repo URL and install method live in each entry's description and starter
 * knowledge file.
 *
 * Validator contract for kind='setup': instructionTemplate non-empty, artifactFiles=[],
 * capabilities=[], repoUrl=null.
 */
export const externalToolkits: Setup[] = [
  // ── 1. affaan-m/ECC (~227k stars) ───────────────────────────────────────────
  {
    kind: 'setup',
    id: 'community-ecc-toolkit-v1',
    slug: 'ecc-toolkit',
    name: 'ECC Multi-Harness Toolkit',
    tagline: '55+ agents, skills, hooks, and workflows across Claude Code, Codex, and Cursor.',
    description:
      'Operating-instructions layer for the ECC toolkit ' +
      '(github.com/affaan-m/ECC, ~227k GitHub stars). ECC ships 55+ agents, skills, ' +
      'commands, hooks, and multi-step workflows that run across Claude Code, Codex, and ' +
      'Cursor. Agents are organized by domain and bootstrapped via install.sh / install.ps1; ' +
      'plugin extensions are published through the .claude-plugin marketplace. This Armory ' +
      'setup compiles a CLAUDE.md operating note that tells Claude how to route tasks through ' +
      'your installed ECC agents and skills.',
    role: 'Engineering',
    industry: null,
    tags: ['claude-code', 'agents', 'multi-harness', 'workflows', 'engineering', 'skills', 'hooks'],
    category: 'devops',
    source: 'community',
    author: 'affaan-m',
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-code'],
    tier: 'advanced',
    instructionTemplate: `# ECC Toolkit, Operating Instructions

You have the ECC multi-harness toolkit installed in Claude Code (github.com/affaan-m/ECC). Route all work through its bundled agents and skills before improvising a fresh approach.

## How ECC is organized

ECC bundles 55+ agents, skills, slash commands, hooks, and multi-step workflows. Agents are domain-specific and composable: pick the closest one for the task, invoke it, and let it drive. If no single agent covers the full job, chain two agents explicitly rather than bypassing them. Skills are shorter, stateless helpers, prefer them for scoped sub-tasks (code review, commit message, doc update) inside a larger agent-driven flow.

## Routing rules

- Engineering and implementation tasks → check ECC's engineering agents first.
- Workflow orchestration (multi-step build, review, release) → use ECC's workflow files.
- Hooks are passive; they fire automatically on file save, commit, or push. Do not replicate their logic in your own instructions.
- Plugin extensions arrive via the .claude-plugin marketplace. If a plugin is installed, prefer it over ad-hoc solutions for its declared domain.

{{#if primaryStack}}- Primary stack for this project: {{primaryStack}}. When no ECC agent is an exact fit, stay within the existing deps and idioms of that stack.{{/if}}

## Posture

Be precise and implementation-focused. Read actual code before advising. Keep changes tightly scoped, touch only what the task requires and follow the existing style in every file you edit.
`,
    variables: [
      {
        key: 'primaryStack',
        label: 'Primary stack (optional)',
        type: 'text',
        required: false,
        helpText:
          'e.g. "Next.js + TypeScript + Supabase". Claude will prefer its idioms when no ECC agent is an exact fit.',
        group: 'Project',
      },
    ],
    knowledgeFiles: [
      {
        name: "What's in ECC + how to install",
        purpose:
          'Overview of the ECC toolkit, what it bundles, how to bootstrap it, and how to extend it via the plugin marketplace.',
        kind: 'starter',
        content: `# ECC Multi-Harness Toolkit, install & contents

Repo: https://github.com/affaan-m/ECC
Stars: ~227k

## What it is

ECC is a multi-harness AI coding toolkit: 55+ agents, skills, slash commands, hooks,
and multi-step workflows that run on Claude Code, Codex, and Cursor. Everything is
plain markdown / config, no binaries, no telemetry.

## Install (macOS/Linux)
\`\`\`bash
git clone https://github.com/affaan-m/ECC.git
cd ECC
bash install.sh
\`\`\`

## Install (Windows PowerShell)
\`\`\`powershell
git clone https://github.com/affaan-m/ECC.git
cd ECC
powershell -ExecutionPolicy Bypass -File .\\install.ps1
\`\`\`

## Extend with plugins

Browse and install plugin extensions via the .claude-plugin marketplace:
\`\`\`bash
# list available plugins
claude plugin list

# add a plugin by name
claude plugin add <plugin-name>
\`\`\`

## Using it

Invoke agents and skills by their slash commands, or describe the task and Claude
auto-routes. Hooks run automatically on file save, commit, or push, no invocation needed.

## Paste the config

Export this setup and paste it into your project's CLAUDE.md (or ~/.claude/CLAUDE.md
for global use). It encodes how Claude should route tasks through your installed ECC agents.
`,
        required: true,
      },
    ],
    scenarios: [],
    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 2. wshobson/agents (~37.6k stars) ───────────────────────────────────────
  {
    kind: 'setup',
    id: 'community-wshobson-agents-v1',
    slug: 'wshobson-agents',
    name: 'Wshobson Agent Library',
    tagline: '194 agents, 158 skills, 106 commands, and 88 plugin packages for Claude Code.',
    description:
      'Operating-instructions layer for the Wshobson Agent Library ' +
      '(github.com/wshobson/agents, ~37.6k GitHub stars). The repo ships 194 agents, 158 skills, ' +
      '106 slash commands, and 88 plugin packages. Plugins are installed via the .claude-plugin ' +
      'marketplace; Makefile targets automate batch install and update. This Armory setup compiles ' +
      'a CLAUDE.md operating note that tells Claude how to find and invoke the right agent or skill ' +
      'from this large, well-organized collection.',
    role: 'Engineering',
    industry: null,
    tags: ['claude-code', 'agents', 'skills', 'commands', 'plugins', 'engineering', 'workflow'],
    category: 'devops',
    source: 'community',
    author: 'wshobson',
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-code'],
    tier: 'advanced',
    instructionTemplate: `# Wshobson Agent Library, Operating Instructions

You have the Wshobson Agent Library installed in Claude Code (github.com/wshobson/agents). This collection ships 194 agents, 158 skills, 106 slash commands, and 88 plugin packages. Always check whether a bundled agent or skill covers the task before building something from scratch.

## How the library is organized

Agents are role-based and broadly scoped, each handles a class of tasks end-to-end. Skills are narrower and composable; stack them inside an agent flow when you need a specific sub-task handled reliably. Commands are the invocation surface: browse the library's command index to find the right entry point, then let the agent or skill drive.

## Plugin packages

The 88 plugin packages extend base agents with domain knowledge. If a relevant plugin is installed, prefer it over the base agent alone. Install new plugins via the .claude-plugin marketplace or with the Makefile targets in the repo.

## Routing rules

- For any engineering task, scan the agents index first. Pick the closest match; do not combine two full agents when one is sufficient.
- For scoped sub-tasks (test generation, commit message, doc update), prefer a skill over spinning up a full agent.
- Respect the library's discipline: do not bypass an agent's built-in planning or review gates.

{{#if primaryStack}}- Primary stack: {{primaryStack}}. Prefer its idioms and existing dependencies when selecting or composing agents.{{/if}}

Stay tightly scoped, touch only what the task requires and match the existing code style.
`,
    variables: [
      {
        key: 'primaryStack',
        label: 'Primary stack (optional)',
        type: 'text',
        required: false,
        helpText:
          'e.g. "React + Node.js + PostgreSQL". Claude will prefer its idioms when selecting agents.',
        group: 'Project',
      },
    ],
    knowledgeFiles: [
      {
        name: "What's in the Wshobson Agent Library + how to install",
        purpose:
          'Overview of the library, 194 agents, 158 skills, 106 commands, 88 plugin packages, and the install methods.',
        kind: 'starter',
        content: `# Wshobson Agent Library, install & contents

Repo: https://github.com/wshobson/agents
Stars: ~37.6k

## What it is

A large, well-organized Claude Code library: 194 agents, 158 skills, 106 slash commands,
and 88 plugin packages. Agents are role-based; skills are composable helpers; plugin
packages extend agents with domain knowledge.

## Install via plugin marketplace

\`\`\`bash
# add individual plugin packages
claude plugin add <package-name>
\`\`\`

## Install via Makefile

\`\`\`bash
git clone https://github.com/wshobson/agents.git
cd agents
make install        # installs all agents and skills
make update         # pulls latest and re-installs
\`\`\`

## Using it

- Browse the agents/ directory for role-based agents.
- Browse the skills/ directory for composable sub-task helpers.
- Invoke via slash commands (see the command index in the repo) or describe the task.

## Paste the config

Export this Armory setup and paste it into your project's CLAUDE.md. It tells Claude how
to route tasks through the installed agents and skills.
`,
        required: true,
      },
    ],
    scenarios: [],
    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 3. alirezarezvani/claude-skills (~21.5k stars) ───────────────────────────
  {
    kind: 'setup',
    id: 'community-claude-skills-v1',
    slug: 'claude-skills',
    name: 'Claude Skills (alirezarezvani)',
    tagline: '345 skills, 30+ agents, and 70+ commands across 20+ professional domains.',
    description:
      'Operating-instructions layer for the Claude Skills collection ' +
      '(github.com/alirezarezvani/claude-skills, ~21.5k GitHub stars). The repo bundles 345 skills, ' +
      '30+ agents, and 70+ commands organized across more than 20 professional domains, engineering, ' +
      "writing, research, design, and more. Skills are installed via the .claude-plugin marketplace " +
      "following the repo's INSTALLATION.md. This Armory setup compiles a CLAUDE.md operating note " +
      'that tells Claude how to navigate and invoke the right skill or agent from this broad collection.',
    role: 'Engineering',
    industry: null,
    tags: ['claude-code', 'skills', 'agents', 'commands', 'multi-domain', 'engineering', 'professional'],
    category: 'devops',
    source: 'community',
    author: 'alirezarezvani',
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-code'],
    tier: 'advanced',
    instructionTemplate: `# Claude Skills Collection, Operating Instructions

You have the Claude Skills collection installed in Claude Code (github.com/alirezarezvani/claude-skills). This repo ships 345 skills, 30+ agents, and 70+ commands spanning 20+ professional domains. Before writing ad-hoc instructions, check whether a bundled skill or agent already handles the task.

## How the collection is organized

Skills are domain-grouped (engineering, writing, research, design, and more). Agents are higher-level orchestrators that compose skills for multi-step work. Commands are the slash-command entry points listed in the repo's command index.

## Routing rules

- Identify the domain of the task first, then look up the relevant skill group.
- Use agents when the task spans multiple sub-steps; use skills for focused, single-purpose work.
- 70+ commands are available, check the command index in the repo before using a generic approach.
- Do not duplicate a skill's logic in your own instructions. If a skill covers the task, invoke it and let it drive.

{{#if primaryStack}}- Primary stack for this project: {{primaryStack}}. Prefer skills in the engineering domain that match its idioms, and stay within existing dependencies.{{/if}}

## Posture

Stay precise and tightly scoped. Read actual code before advising. Match the existing code style and patterns in every file you edit. Verify changes by running the project's real checks, show the output as evidence.
`,
    variables: [
      {
        key: 'primaryStack',
        label: 'Primary stack (optional)',
        type: 'text',
        required: false,
        helpText:
          'e.g. "Django + React + PostgreSQL". Claude will prefer skills matching its idioms.',
        group: 'Project',
      },
    ],
    knowledgeFiles: [
      {
        name: "What's in Claude Skills + how to install",
        purpose:
          'Overview of the 345-skill collection, 30+ agents, 70+ commands, 20+ domains, and the plugin-marketplace install method.',
        kind: 'starter',
        content: `# Claude Skills (alirezarezvani), install & contents

Repo: https://github.com/alirezarezvani/claude-skills
Stars: ~21.5k

## What it is

A broad, domain-organized Claude Code skills collection: 345 skills, 30+ agents, and
70+ slash commands spanning 20+ professional domains (engineering, writing, research,
design, finance, HR, and more).

## Install via plugin marketplace

Follow the repo's INSTALLATION.md for full instructions:

\`\`\`bash
# add individual skill packages via the .claude-plugin marketplace
claude plugin add <package-name>
\`\`\`

See: https://github.com/alirezarezvani/claude-skills/blob/main/INSTALLATION.md

## Using it

- Browse the skills/ directory by domain to find the right skill.
- Invoke via slash commands (see the command index) or describe the task.
- Agents compose skills for multi-step workflows.

## Paste the config

Export this Armory setup and paste it into your CLAUDE.md. It tells Claude how to
route tasks through the installed skills and agents.
`,
        required: true,
      },
    ],
    scenarios: [],
    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 4. softaworks/agent-toolkit (~2.2k stars) ────────────────────────────────
  {
    kind: 'setup',
    id: 'community-softaworks-agent-toolkit-v1',
    slug: 'softaworks-agent-toolkit',
    name: 'Softaworks Agent Toolkit',
    tagline: '43 skills, 6 agents, and commands built exclusively for Claude Code workflows.',
    description:
      'Operating-instructions layer for the Softaworks Agent Toolkit ' +
      '(github.com/softaworks/agent-toolkit, ~2.2k GitHub stars). Unlike larger multi-harness ' +
      'collections, this toolkit is Claude Code-specific: 43 skills, 6 agents, and commands ' +
      'designed for a tight Claude Code workflow with minimal overhead. Install via the ' +
      '.claude-plugin marketplace. This Armory setup compiles a CLAUDE.md operating note that ' +
      "tells Claude how to route tasks through the toolkit's lean, focused agent-and-skill layer.",
    role: 'Engineering',
    industry: null,
    tags: ['claude-code', 'agents', 'skills', 'commands', 'engineering', 'workflow', 'lightweight'],
    category: 'devops',
    source: 'community',
    author: 'softaworks',
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-code'],
    tier: 'advanced',
    instructionTemplate: `# Softaworks Agent Toolkit, Operating Instructions

You have the Softaworks Agent Toolkit installed in Claude Code (github.com/softaworks/agent-toolkit). This is a Claude Code-native toolkit: 43 skills, 6 agents, and a focused set of commands, no multi-harness overhead, built specifically for the Claude Code workflow.

## How the toolkit is organized

Six agents cover the major engineering task types end-to-end. Forty-three skills are focused helpers meant to be composed inside an agent flow or invoked directly for scoped tasks. Commands are the primary invocation surface, see the toolkit's command index.

## Routing rules

- Choose the agent that best matches the task's scope. With only 6 agents, the mapping is intentionally clear-cut.
- Use skills for well-bounded sub-tasks (linting, test generation, doc comments, refactor helpers). Do not spin up a full agent when a skill is sufficient.
- The toolkit is Claude Code-specific, it assumes the Claude Code runtime and its file/terminal tools. Do not try to port commands to other runtimes.

{{#if primaryStack}}- Primary stack: {{primaryStack}}. When no skill exactly matches, stay within the existing stack's idioms and current dependencies, do not introduce new libraries without asking.{{/if}}

## Posture

Be precise and tightly scoped. Read the actual code before advising. Match existing style. Verify changes with real checks, show the output as evidence before claiming something works.
`,
    variables: [
      {
        key: 'primaryStack',
        label: 'Primary stack (optional)',
        type: 'text',
        required: false,
        helpText:
          'e.g. "Go + gRPC + Postgres". Claude will prefer existing idioms when no skill is an exact fit.',
        group: 'Project',
      },
    ],
    knowledgeFiles: [
      {
        name: "What's in Softaworks Agent Toolkit + how to install",
        purpose:
          'Overview of the toolkit, 43 skills, 6 agents, Claude Code-specific commands, and the plugin-marketplace install.',
        kind: 'starter',
        content: `# Softaworks Agent Toolkit, install & contents

Repo: https://github.com/softaworks/agent-toolkit
Stars: ~2.2k

## What it is

A lean, Claude Code-native toolkit: 43 skills, 6 agents, and a focused set of slash
commands. Designed specifically for the Claude Code runtime, no multi-harness
abstractions, minimal overhead.

## Install via plugin marketplace

\`\`\`bash
claude plugin add softaworks/agent-toolkit
\`\`\`

Or follow the repo's README for manual install steps.

## Using it

- 6 agents cover major engineering task types (implementation, review, refactor, test, doc, release).
- 43 skills are composable helpers for scoped sub-tasks.
- Invoke via slash commands or describe the task.

## Paste the config

Export this Armory setup and paste it into your CLAUDE.md. It tells Claude how to
route tasks through the installed agents and skills.
`,
        required: true,
      },
    ],
    scenarios: [],
    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 5. rohitg00/awesome-claude-code-toolkit (~2.3k stars) ───────────────────
  {
    kind: 'setup',
    id: 'community-awesome-claude-code-v1',
    slug: 'awesome-claude-code',
    name: 'Awesome Claude Code Toolkit',
    tagline: '135 agents, 35 skills, 42 commands, hooks, MCP configs, and rules in one bundle.',
    description:
      'Operating-instructions layer for the Awesome Claude Code Toolkit ' +
      '(github.com/rohitg00/awesome-claude-code-toolkit, ~2.3k GitHub stars). The repo bundles ' +
      '135 agents, 35 skills, 42 commands, hooks, MCP server configs, and rule sets in a single ' +
      'curated collection. Bootstrap via setup/ scripts or install individual components through ' +
      'the .claude-plugin marketplace. This Armory setup compiles a CLAUDE.md operating note that ' +
      'tells Claude how to route work through the installed agents, skills, hooks, and MCP configs.',
    role: 'Engineering',
    industry: null,
    tags: ['claude-code', 'agents', 'skills', 'hooks', 'mcp', 'rules', 'engineering', 'curated'],
    category: 'devops',
    source: 'community',
    author: 'rohitg00',
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-code'],
    tier: 'advanced',
    instructionTemplate: `# Awesome Claude Code Toolkit, Operating Instructions

You have the Awesome Claude Code Toolkit installed in Claude Code (github.com/rohitg00/awesome-claude-code-toolkit). This curated collection bundles 135 agents, 35 skills, 42 commands, hooks, MCP server configs, and rule sets. Route tasks through the installed components before writing ad-hoc logic.

## How the toolkit is organized

- Agents: 135 role-specific agents covering engineering, DevOps, data, writing, and more. Pick the closest match for the task.
- Skills: 35 focused, reusable helpers for bounded sub-tasks. Prefer them inside agent flows.
- Commands: 42 slash commands as the invocation surface, check the command index first.
- Hooks: fire automatically on file save, commit, or push. Do not replicate hook logic in your own instructions.
- MCP configs: if an MCP server is configured and relevant, prefer it over manual tool-wiring.
- Rules: global behavioral constraints from the rule sets are always in effect.

## Routing rules

- Identify the task domain, then scan the relevant agent group.
- Use skills for well-scoped sub-tasks; agents for multi-step orchestration.
- Check installed MCP configs before deciding to call an external API directly.
- Rule sets are not optional, do not bypass them.

{{#if primaryStack}}- Primary stack: {{primaryStack}}. When selecting agents or skills, prefer those that align with its idioms and stay within existing dependencies.{{/if}}

Stay tightly scoped and verify changes with real checks before claiming anything works.
`,
    variables: [
      {
        key: 'primaryStack',
        label: 'Primary stack (optional)',
        type: 'text',
        required: false,
        helpText:
          'e.g. "Python + FastAPI + Redis". Claude will favor agents and skills that match its idioms.',
        group: 'Project',
      },
    ],
    knowledgeFiles: [
      {
        name: "What's in Awesome Claude Code Toolkit + how to install",
        purpose:
          'Overview of the toolkit, 135 agents, 35 skills, 42 commands, hooks, MCP configs, rules, and the install methods.',
        kind: 'starter',
        content: `# Awesome Claude Code Toolkit, install & contents

Repo: https://github.com/rohitg00/awesome-claude-code-toolkit
Stars: ~2.3k

## What it is

A curated Claude Code collection: 135 agents, 35 skills, 42 slash commands, hooks,
MCP server configurations, and rule sets, assembled as a single ready-to-use bundle.

## Install via bootstrap scripts

\`\`\`bash
git clone https://github.com/rohitg00/awesome-claude-code-toolkit.git
cd awesome-claude-code-toolkit
bash setup/bootstrap.sh
\`\`\`

## Install via plugin marketplace

\`\`\`bash
claude plugin add rohitg00/awesome-claude-code-toolkit
\`\`\`

## Using it

- Agents and skills are invoked via slash commands or by describing the task.
- Hooks run automatically, no invocation needed.
- MCP server configs are in the mcp/ directory; activate the ones relevant to your project.
- Rule sets are applied globally once installed.

## Paste the config

Export this Armory setup and paste it into your CLAUDE.md. It tells Claude how to
route tasks through the installed agents, skills, hooks, and MCP configs.
`,
        required: true,
      },
    ],
    scenarios: [],
    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },
];
