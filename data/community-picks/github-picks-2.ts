import type { Setup } from '@/lib/setup/types';

const CREATED_AT = '2026-07-07T00:00:00.000Z';

export const githubPicks2: Setup[] = [
  // ── Project Configs / Setups (9) ─────────────────────────────────────────────

  {
    kind: 'harness',
    id: 'github-my-claude-code-setup-v1',
    slug: 'github-my-claude-code-setup',
    name: 'My Claude Code Setup',
    tagline: 'Cline-inspired dual-memory bank so Claude retains context across sessions.',
    description:
      'A shared starter template that adds a Cline-inspired memory bank to Claude Code: four ' +
      'structured markdown files (CLAUDE-activeContext.md, CLAUDE-patterns.md, ' +
      'CLAUDE-decisions.md, CLAUDE-troubleshooting.md) persist sprint goals, patterns, and ' +
      'decisions between sessions. Fork the repo, copy the files, and run /init to populate ' +
      'the bank. At session start Claude reads CLAUDE-activeContext.md and already knows the ' +
      'current sprint goals and recent decisions.',
    role: 'general',
    industry: null,
    tags: ['memory-bank', 'claude-code', 'context-persistence', 'dotfiles', 'setup'],
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

Adds a Cline-inspired dual-memory bank to Claude Code via four structured markdown files: CLAUDE-activeContext.md, CLAUDE-patterns.md, CLAUDE-decisions.md, and CLAUDE-troubleshooting.md. At the start of each session Claude reads these files and picks up exactly where the previous session ended. The /init command populates the bank from the current project state.

## Commands

- Fork the repo and copy the memory bank files into your project root.
- Run \`/init\` in Claude Code to populate the memory bank from the current project.
- Run \`/update-memory\` at session end to write the current sprint state back to the files.

## Example output

At session start Claude reads CLAUDE-activeContext.md and responds: "I see we're mid-sprint on the auth refactor — last session we landed the JWT middleware and the next step is wiring the refresh-token endpoint. Picking up from there."`,
      },
    ],
    repoUrl: 'https://github.com/centminmod/my-claude-code-setup',
    githubStars: 1000,
    capabilities: [
      {
        command: '/init',
        description: 'Populate the memory bank files at session start by reading CLAUDE-activeContext.md and related docs.',
      },
      {
        command: '/update-memory',
        description: 'Write the current sprint state to CLAUDE-activeContext.md and CLAUDE-decisions.md at session end.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-zircote-dotfiles-v1',
    slug: 'github-zircote-dotfiles',
    name: 'zircote Claude Dotfiles',
    tagline: 'Personal .claude/ dotfiles: domain-specific agents, custom commands, and Opus optimizations.',
    description:
      'A personal Claude Code dotfiles repo by zircote, cloned straight into ~/.claude/. ' +
      'Ships domain-specific agents (frontend-developer, backend-developer, python-pro, ' +
      'typescript-pro, devops-engineer, kubernetes-specialist, terraform-engineer), custom ' +
      'slash commands, and Opus-tuned system prompt snippets. Agents auto-load after clone; ' +
      'invoke any specialist directly from a Claude Code session.',
    role: 'general',
    industry: null,
    tags: ['dotfiles', 'claude-code', 'agents', 'specialist-agents', 'devops'],
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

A personal Claude Code dotfiles repo that ships domain-specific specialist agents, custom slash commands, and Opus optimizations in a single clone. Agents include frontend-developer, backend-developer, python-pro, typescript-pro, devops-engineer, kubernetes-specialist, and terraform-engineer. After cloning into ~/.claude/, all agents are available immediately in every Claude Code session.

## Commands

\`\`\`bash
git clone https://github.com/zircote/.claude ~/.claude
\`\`\`

Agents auto-load from ~/.claude/. Invoke specialists with:

- \`/frontend-developer\` — frontend domain context and Opus optimizations
- \`/backend-developer\` — API and server-side specialist context
- \`/devops-engineer\` — infrastructure and CI/CD specialist

## Example output

Running \`/backend-developer\` before an API design task: Claude switches to the backend-developer agent context, applies Opus optimizations, and opens with a summary of the API patterns declared in the agent's domain knowledge before proceeding with the task.`,
      },
    ],
    repoUrl: 'https://github.com/zircote/.claude',
    githubStars: 500,
    capabilities: [
      {
        command: '/frontend-developer',
        description: 'Invoke the frontend-developer specialist agent with domain-specific context and Opus optimizations.',
      },
      {
        command: '/backend-developer',
        description: 'Invoke the backend-developer specialist agent for API and server-side tasks.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-code-showcase-v1',
    slug: 'github-claude-code-showcase',
    name: 'Claude Code Showcase',
    tagline: 'Reference project config: hooks, skills, agents, commands, and a PR-review GitHub Action in one repo.',
    description:
      'A reference project by ChrisWiles demonstrating how to combine Claude Code hooks, ' +
      'skills, subagents, custom slash commands, and a GitHub Action into a single repo. ' +
      'Provides /ticket and /pr-review slash commands plus a git-workflow subagent and ' +
      'pre-commit hooks. Clone as a template to start a new project with the full ' +
      'configuration already wired up.',
    role: 'general',
    industry: null,
    tags: ['claude-code', 'hooks', 'slash-commands', 'github-actions', 'reference'],
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

A reference project config showing how hooks, skills, subagents, custom commands, and a GitHub Action fit together in one Claude Code repo. Provides /ticket and /pr-review slash commands, a git-workflow subagent, and pre-commit hooks wired up and working. Clone it as a template to start a new project with all the plumbing in place.

## Commands

Clone as a template:

\`\`\`bash
git clone https://github.com/ChrisWiles/claude-code-showcase my-project
\`\`\`

Key commands available after setup:

- \`/ticket\` — reads a ticket ID and creates a branch plus an implementation plan
- \`/pr-review\` — triggers a Claude code review on the current pull request

## Example output

On PR open, the GitHub Action posts a structured review comment with findings grouped by severity. Running \`/ticket PROJ-42\` reads the ticket, creates a branch named \`feature/proj-42\`, and writes a plan file outlining the implementation steps.`,
      },
    ],
    repoUrl: 'https://github.com/ChrisWiles/claude-code-showcase',
    githubStars: 500,
    capabilities: [
      {
        command: '/ticket',
        description: 'Read a ticket and create a branch plus an implementation plan.',
      },
      {
        command: '/pr-review',
        description: 'Post a structured Claude code review comment on the current pull request.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-code-memory-bank-v1',
    slug: 'github-claude-code-memory-bank',
    name: 'Claude Code Memory Bank',
    tagline: 'Hierarchical markdown memory bank adapted from Cline: five files, four workflow commands.',
    description:
      'A memory management system adapted from the Cline Memory Bank pattern, restructured ' +
      'for Claude Code. Uses five hierarchical markdown files — projectbrief, productContext, ' +
      'systemPatterns, activeContext, and progress — to preserve full project context across ' +
      'sessions. Copy the workflow command files into .claude/commands/workflow/ and run ' +
      '/update-memory at the end of each session.',
    role: 'general',
    industry: null,
    tags: ['memory-bank', 'claude-code', 'context-persistence', 'cline', 'workflow'],
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

Brings the Cline Memory Bank pattern to Claude Code using five hierarchical markdown files: projectbrief, productContext, systemPatterns, activeContext, and progress. Each session starts by reading these files so Claude knows exactly what was last worked on and what the system design decisions are. Four workflow commands handle the full session lifecycle.

## Commands

Copy the workflow files into your project:

\`\`\`bash
cp -r .claude/commands/workflow/ ~/.claude/commands/workflow/
\`\`\`

Workflow commands available in Claude Code:

- \`/understand\` — load and summarize the projectbrief and productContext files
- \`/plan\` — draft an implementation plan against the current activeContext
- \`/execute\` — implement the plan and update the progress file
- \`/update-memory\` — write the current session state back to all memory files

## Example output

Running \`/understand\` at session start: Claude reads all five memory files and responds with a one-paragraph summary of the project, the last completed milestone, and the next task — without any context re-explanation needed.`,
      },
    ],
    repoUrl: 'https://github.com/hudrazine/claude-code-memory-bank',
    githubStars: 500,
    capabilities: [
      {
        command: '/update-memory',
        description: 'Write the current session state back to all five memory bank markdown files.',
      },
      {
        command: '/understand',
        description: 'Load and summarize the projectbrief and productContext memory files at session start.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-code-system-prompts-v1',
    slug: 'github-claude-code-system-prompts',
    name: 'Claude Code System Prompts',
    tagline: 'Decompiled Claude Code internals: 27 tool descriptions and Plan/Explore/Task agent prompts, updated each release.',
    description:
      'A reverse-engineered collection of Claude Code\'s internal system prompts maintained ' +
      'by Piebald AI and updated with each Claude Code release. Contains the 27 tool ' +
      'descriptions, the Plan, Explore, and Task agent prompts, and utility prompts used ' +
      'internally. Used as a reference for understanding and customizing Claude Code behavior.',
    role: 'general',
    industry: null,
    tags: ['claude-code', 'system-prompts', 'reference', 'internals', 'customization'],
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

A decompilation of Claude Code's internal system prompts, maintained by Piebald AI and updated with each release. Covers the 27 built-in tool descriptions, the Plan, Explore, and Task sub-agent prompts, and utility prompts used internally by Claude Code. Used as a reference when customizing CLAUDE.md behavior or writing your own tool descriptions.

## Commands

No install required. Browse the repo directory:

- \`system-prompts/\` — all 27 tool descriptions and utility prompts
- \`system-prompts/agents/\` — Plan, Explore, and Task agent prompt files

Reference the files directly when customizing your own CLAUDE.md or writing tool descriptions.

## Example output

Opening \`system-prompts/agents/security-review.md\` reveals the exact wording and structure of the built-in security-review agent prompt, which you can adapt or override in your project's CLAUDE.md to tighten or relax the security review scope.`,
      },
    ],
    repoUrl: 'https://github.com/Piebald-AI/claude-code-system-prompts',
    githubStars: 1000,
    capabilities: [
      {
        command: 'Browse system-prompts/',
        description: 'Reference all 27 tool descriptions and utility prompts used internally by Claude Code.',
      },
      {
        command: 'Browse system-prompts/agents/',
        description: 'Access the Plan, Explore, and Task agent prompt definitions to understand or override Claude Code sub-agent behavior.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-tweakcc-v1',
    slug: 'github-tweakcc',
    name: 'tweakcc',
    tagline: 'CLI to patch a Claude Code install with custom prompts, themes, thinking verbs, and toolsets.',
    description:
      'A CLI tool by Piebald AI that patches an existing Claude Code installation with ' +
      'custom system prompts, color themes, thinking verbs, spinners, and custom toolsets. ' +
      'Customizations live in per-tool markdown files you edit directly; apply them with a ' +
      'single command. Community patches are installable directly from a URL.',
    role: 'general',
    industry: null,
    tags: ['claude-code', 'customization', 'cli', 'themes', 'system-prompts'],
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

tweakcc patches a Claude Code installation with custom system prompts, color themes, thinking verbs, spinners, and custom toolsets. Customizations live in per-tool markdown files that you edit directly. Apply changes with a single CLI command; community patches are installable from a URL without manual editing.

## Commands

\`\`\`bash
# Install tweakcc
npm install -g tweakcc

# Apply a community patch from a URL
tweakcc apply --patch <url>

# After editing per-tool markdown files locally, push changes
tweakcc apply
\`\`\`

## Example output

After \`tweakcc apply --patch https://example.com/dark-theme.json\`, Claude Code displays a custom color theme, swapped thinking verbs ("pondering" instead of "thinking"), and a custom spinner — all reflected immediately on next launch.`,
      },
    ],
    repoUrl: 'https://github.com/Piebald-AI/tweakcc',
    githubStars: 1000,
    capabilities: [
      {
        command: 'tweakcc apply',
        description: 'Push edited per-tool markdown customizations into the current Claude Code installation.',
      },
      {
        command: 'tweakcc apply --patch <url>',
        description: 'Download and apply a community patch from a URL to swap themes, verbs, spinners, or tool descriptions.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-context-forge-v1',
    slug: 'github-context-forge',
    name: 'Context Forge',
    tagline: 'CLI wizard that scaffolds CLAUDE.md, PRPs, and project structure from a short questionnaire.',
    description:
      'A CLI tool by Jason Webdev that scaffolds context-engineering documents from a short ' +
      'wizard: it generates a structured CLAUDE.md with a staged plan and validation ' +
      'checklist, a PRP (Product Requirements Prompt), and a project directory layout. ' +
      'Run via npx or install globally; the --ai-prp flag adds an AI-generated requirements ' +
      'document to the output.',
    role: 'general',
    industry: null,
    tags: ['claude-code', 'context-engineering', 'cli', 'scaffolding', 'claude-md'],
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

Context Forge is a CLI wizard that generates context-engineering documents for Claude Code from a short questionnaire. It writes a structured CLAUDE.md with a staged implementation plan and validation checklist, a PRP (Product Requirements Prompt), and a project directory scaffold. The --ai-prp flag adds an AI-generated requirements document to the output.

## Commands

\`\`\`bash
# Run without installing
npx context-forge

# Or install globally and run
npm install -g context-forge
context-forge init

# Add AI-generated PRPs to the output
context-forge init --ai-prp
\`\`\`

## Example output

\`context-forge init\` prompts for project type (e.g. "Next.js API + React frontend"), then writes a CLAUDE.md with a 5-stage implementation plan and per-stage validation gates, a PRPs/initial.md with structured requirements, and a suggested directory layout matching the selected project type.`,
      },
    ],
    repoUrl: 'https://github.com/webdevtodayjason/context-forge',
    githubStars: 1000,
    capabilities: [
      {
        command: 'npx context-forge',
        description: 'Run the context-engineering scaffold wizard without installing, generating CLAUDE.md, PRPs, and project structure.',
      },
      {
        command: 'context-forge init --ai-prp',
        description: 'Initialize the scaffold and add an AI-generated Product Requirements Prompt to the output docs.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-code-guide-v1',
    slug: 'github-claude-code-guide',
    name: 'Claude Code Guide',
    tagline: 'Single-page current reference for Claude Code: install, env vars, slash commands, MCP, hooks, subagents.',
    description:
      'A community-maintained single-page reference guide for Claude Code by zebbern, ' +
      'covering install commands, environment variables, slash commands, MCP integrations, ' +
      'hooks, and subagents with copy-paste examples and settings.json snippets. Aimed at ' +
      'developers who want a one-stop answer for any Claude Code configuration question ' +
      'including rarely documented flags and safe-use conditions.',
    role: 'general',
    industry: null,
    tags: ['claude-code', 'reference', 'documentation', 'mcp', 'hooks'],
    category: 'general',
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

A community-maintained single-page reference for Claude Code covering install, environment variables, every slash command, MCP configuration, hooks, and subagents — with copy-paste examples and settings.json snippets throughout. Written to be the one-stop answer for any Claude Code configuration question, including rarely documented flags and safe-use conditions.

## Commands

No install needed. Browse the guide on GitHub for:

- Slash command reference with descriptions and examples
- Environment variable list with accepted values
- MCP server configuration examples (settings.json snippets)
- Hook examples (pre-tool, post-tool, notification)
- \`--dangerously-skip-permissions\` flag definition and safe-use conditions

## Example output

Looking up \`--dangerously-skip-permissions\`: the guide explains the flag skips all permission prompts, is safe only in fully sandboxed CI environments with no network access to sensitive services, and should never be used in a shared development environment.`,
      },
    ],
    repoUrl: 'https://github.com/zebbern/claude-code-guide',
    githubStars: 5000,
    capabilities: [
      {
        command: 'Browse slash commands section',
        description: 'Reference all built-in slash commands with descriptions and copy-paste examples.',
      },
      {
        command: 'Browse env vars section',
        description: 'Find all supported environment variables with accepted values and settings.json snippets.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-awesome-claude-code-v1',
    slug: 'github-awesome-claude-code',
    name: 'Awesome Claude Code',
    tagline: 'The canonical curated list for Claude Code: skills, plugins, hooks, agents, MCP, and more across 11 categories.',
    description:
      'The canonical community-curated "awesome list" for Claude Code by hesreallyhim, ' +
      'organized across 11 categories: skills, plugins, hooks, agents, MCP integrations, ' +
      'status lines, tooling, and more. THE_RESOURCES_TABLE.csv is the machine-readable ' +
      'index. One of the most-starred Claude Code community resources.',
    role: 'general',
    industry: null,
    tags: ['claude-code', 'awesome-list', 'reference', 'community', 'collection'],
    category: 'general',
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

The canonical community-curated list for Claude Code, organized across 11 categories: skills, plugins, hooks, agents, MCP integrations, status lines, tooling, and more. Maintained by hesreallyhim and one of the most-starred Claude Code community resources. THE_RESOURCES_TABLE.csv is the machine-readable index with all entries and metadata.

## Commands

No install needed. Browse the repo on GitHub:

- Scroll the README to browse by category
- Download \`THE_RESOURCES_TABLE.csv\` for a machine-readable index of all entries
- Use GitHub search to find resources by keyword across the repo

## Example output

Searching for "memory" in THE_RESOURCES_TABLE.csv returns a filtered list of all memory-bank, context-persistence, and session-management resources across skills, plugins, and harness categories — with repo URLs and star counts in a spreadsheet-friendly format.`,
      },
    ],
    repoUrl: 'https://github.com/hesreallyhim/awesome-claude-code',
    githubStars: 40000,
    capabilities: [
      {
        command: 'Browse THE_RESOURCES_TABLE.csv',
        description: 'Access the machine-readable index of all curated resources across 11 categories.',
      },
      {
        command: 'Browse by category',
        description: 'Filter resources by category (skills, plugins, hooks, agents, MCP, status-lines, tooling) in the organized README.',
      },
    ],
  },

  // ── Skills (5) ──────────────────────────────────────────────────────────────

  {
    kind: 'skill',
    id: 'github-composio-awesome-claude-skills-v1',
    slug: 'github-composio-awesome-claude-skills',
    name: 'Composio Awesome Claude Skills',
    tagline: '1000+ production skills including Connect — Claude acting across Slack, email, GitHub, and 1000+ services.',
    description:
      'A curated collection of 1000+ production Claude Skills from Composio, including the ' +
      'flagship Connect skill that lets Claude send emails, post Slack messages, create GitHub ' +
      'issues, and act across 1000+ third-party services via a Composio API key. Each skill ' +
      'is installable individually via the Claude plugin system.',
    role: 'general',
    industry: null,
    tags: ['skills', 'composio', 'integrations', 'slack', 'email', 'github', 'automation'],
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

A curated collection of 1000+ production Claude Skills from Composio. The flagship Connect skill lets Claude send emails, post Slack messages, create GitHub issues, and act across 1000+ services using a Composio API key. Skills are installable individually via the Claude plugin system; Connect requires a Composio API key set in the Claude Code environment.

## Commands

\`\`\`bash
# Install the Connect skill (requires a Composio API key)
/plugin install connect@composiohq/awesome-claude-skills

# Install any other skill from the 1000+ collection
/plugin install <skill>@composiohq/awesome-claude-skills
\`\`\`

## Example output

After installing Connect: "Send a Slack message to #deploys summarizing the last 3 commits" → Claude fetches the git log, formats a summary, and posts it to #deploys via the Slack connector — confirmed with a delivery receipt in the response.`,
      },
    ],
    repoUrl: 'https://github.com/ComposioHQ/awesome-claude-skills',
    githubStars: 56000,
    capabilities: [
      {
        command: '/plugin install connect@composiohq/awesome-claude-skills',
        description: 'Install the Connect skill to let Claude act across 1000+ services (Slack, email, GitHub, etc.) via Composio.',
      },
      {
        command: '/plugin install <skill>@composiohq/awesome-claude-skills',
        description: 'Install any of the 1000+ production skills by replacing <skill> with the skill name.',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-travisvn-awesome-claude-skills-v1',
    slug: 'github-travisvn-awesome-claude-skills',
    name: 'travisvn Awesome Claude Skills',
    tagline: 'Community-curated 100+ Claude Skills for dev, productivity, and creative workflows.',
    description:
      'A community-curated list of 100+ Claude Skills focused on Claude Code, spanning ' +
      'development, productivity, and creative domains. Each skill has a dedicated directory ' +
      'with a per-skill install command. Browse the skills directory to find what fits, then ' +
      'install with a single /plugin install command.',
    role: 'general',
    industry: null,
    tags: ['skills', 'claude-code', 'community', 'productivity', 'collection'],
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

A community-curated list of 100+ Claude Skills covering development, productivity, and creative workflows in Claude Code. Each skill is in its own directory with a README and a per-skill install command. Browse the skills directory to find relevant skills, then install with a single command.

## Commands

\`\`\`bash
# Install a skill by name
/plugin install <skill>@travisvn/awesome-claude-skills
\`\`\`

Browse the \`skills/\` directory on GitHub to see available skills with descriptions and per-skill READMEs before installing.

## Example output

Installing a code-review skill: \`/plugin install code-review@travisvn/awesome-claude-skills\` drops the skill into the project and makes it available. On next invocation Claude follows the skill's structured review protocol across correctness, security, and readability categories.`,
      },
    ],
    repoUrl: 'https://github.com/travisvn/awesome-claude-skills',
    githubStars: 13500,
    capabilities: [
      {
        command: '/plugin install <skill>@travisvn/awesome-claude-skills',
        description: 'Install any of the 100+ curated community skills by replacing <skill> with the skill name.',
      },
      {
        command: 'Browse skills/',
        description: 'Explore the skills directory to find per-skill READMEs and install commands across dev, productivity, and creative domains.',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-antigravity-awesome-skills-v1',
    slug: 'github-antigravity-awesome-skills',
    name: 'Antigravity 1900+ Awesome Skills',
    tagline: '1900+ agent skills with an npx installer targeting Claude Code, Codex, Cursor, Gemini, and Antigravity.',
    description:
      'An installable library of 1900+ agent skills from sickn33, with an npx installer ' +
      'that places skills in the correct location for each supported tool: Claude Code, Codex, ' +
      'Cursor, Gemini, and Antigravity. After install, /skills lists all available skills; ' +
      'invoking one auto-loads its SKILL.md.',
    role: 'general',
    industry: null,
    tags: ['skills', 'multi-platform', 'claude-code', 'cursor', 'collection', 'installer'],
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

A library of 1900+ agent skills with an npx installer that places skills in the right location for each supported tool. Pass the tool flag and the installer handles placement automatically. Supports Claude Code, Codex, Cursor, Gemini, and Antigravity. After install, invoking a skill auto-loads its SKILL.md.

## Commands

\`\`\`bash
# Install into Claude Code
npx antigravity-awesome-skills --claude

# Install into other supported tools
npx antigravity-awesome-skills --codex
npx antigravity-awesome-skills --cursor
npx antigravity-awesome-skills --gemini
\`\`\`

After install in Claude Code, run \`/skills\` to list all 1900+ available skills.

## Example output

After \`npx antigravity-awesome-skills --claude\`, \`/skills\` returns a categorized list of 1900+ skills. Invoking \`/skills/test-driven-development\` loads the TDD SKILL.md and Claude begins the red-green-refactor workflow for the current task.`,
      },
    ],
    repoUrl: 'https://github.com/sickn33/antigravity-awesome-skills',
    githubStars: 42000,
    capabilities: [
      {
        command: 'npx antigravity-awesome-skills --claude',
        description: 'Install all 1900+ skills into Claude Code with one command, placing SKILL.md files where Claude Code expects them.',
      },
      {
        command: '/skills',
        description: 'After installation, list all 1900+ available skills and their descriptions.',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-rohitg00-claude-code-toolkit-v1',
    slug: 'github-rohitg00-claude-code-toolkit',
    name: 'rohitg00 Claude Code Toolkit',
    tagline: 'Opinionated one-command toolkit: 135 agents, 35 skills, 42 commands, 176+ plugins, hooks, and MCP configs.',
    description:
      'An opinionated Claude Code toolkit from rohitg00 with a one-command npx installer. ' +
      'Packages 135 agents, 35 curated skills, 42 commands, 176+ plugins, 20 hooks, and 14 ' +
      'MCP server configs. The installer accepts flags to select specific agents, commands, ' +
      'and MCP integrations and drops a production-ready .claude/ directory with curated ' +
      'agents, main-branch-guard hooks, and MCP servers.',
    role: 'general',
    industry: null,
    tags: ['skills', 'agents', 'commands', 'mcp', 'hooks', 'toolkit', 'installer'],
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

An opinionated toolkit for Claude Code with a one-command npx installer. Packages 135 agents, 35 curated skills, 42 commands, 176+ plugins, 20 hooks, and 14 MCP server configs. Select specific components with installer flags; the result is a production-ready .claude/ with curated agents, main-branch-guard hooks, and configured MCP servers — no additional setup needed.

## Commands

\`\`\`bash
# Full install selecting specific components
npx claude-code-templates@latest \\
  --agent development-team/frontend-developer \\
  --command testing/generate-tests \\
  --mcp development/github-integration \\
  --yes

# Install a single agent by name
npx claude-code-templates@latest --agent <name> --yes
\`\`\`

## Example output

After running the installer with the development-team agent and github-integration MCP, the project's .claude/ directory contains the frontend-developer agent, a generate-tests command, a main-branch-guard pre-commit hook, and a configured GitHub MCP server — ready to use without additional configuration.`,
      },
    ],
    repoUrl: 'https://github.com/rohitg00/awesome-claude-code-toolkit',
    githubStars: 3000,
    capabilities: [
      {
        command: 'npx claude-code-templates@latest --agent development-team/frontend-developer --command testing/generate-tests --mcp development/github-integration --yes',
        description: 'One-command install: selects agents, commands, and MCP configs and drops a production-ready .claude/ directory.',
      },
      {
        command: 'npx claude-code-templates@latest --agent <name> --yes',
        description: 'Install a single agent from the 135-agent library by name.',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-glebis-claude-skills-v1',
    slug: 'github-glebis-claude-skills',
    name: 'glebis Claude Skills',
    tagline: 'Personal Claude Code skill collection: structured code review, ADRs, and debugging frameworks.',
    description:
      'A personal collection of Claude Code skills from glebis focused on enhancing dev ' +
      'workflows. Skills include structured code review with severity labels, architectural ' +
      'decision records (ADRs), and debugging frameworks that guide systematic root-cause ' +
      'analysis. Install via the plugin marketplace or copy skill folders directly.',
    role: 'general',
    industry: null,
    tags: ['skills', 'claude-code', 'code-review', 'adr', 'debugging'],
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

A personal collection of Claude Code skills by glebis for structured development workflows. Covers structured code review with severity labels, architectural decision records (ADRs) that document design choices in a standard format, and debugging frameworks that guide Claude through systematic root-cause analysis.

## Commands

Install via the plugin marketplace:

\`\`\`bash
/plugin install <skill>@glebis/claude-skills
\`\`\`

Or copy skill folders manually into your project:

\`\`\`bash
cp -r skills/<skill-name>/ .claude/skills/
\`\`\`

## Example output

After installing the code-review skill and running it on a diff, Claude returns a structured review with findings grouped as BLOCKER, WARNING, or SUGGESTION — each with the exact file and line number. The ADR skill prompts for context and writes a standard ADR markdown file to \`docs/decisions/\`.`,
      },
    ],
    repoUrl: 'https://github.com/glebis/claude-skills',
    githubStars: 200,
    capabilities: [
      {
        command: '/plugin install <skill>@glebis/claude-skills',
        description: 'Install an individual skill from the collection via the plugin marketplace.',
      },
      {
        command: 'Copy skill folders to .claude/skills/',
        description: 'Manually copy individual skill folders as an alternative to plugin install.',
      },
    ],
  },
];
