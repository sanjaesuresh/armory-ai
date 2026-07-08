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
      'A starter template by centminmod that brings a Cline-inspired memory bank to Claude Code. ' +
      'Provides three updated CLAUDE.md template variants following Anthropic best practices ' +
      '(progressive disclosure, dual-memory architecture) plus slash commands for security audits, ' +
      'architecture review, usage cost analysis, and memory updates. Run /init once to populate ' +
      'the memory bank; use /update-memory-bank at session end to persist sprint state.',
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

A Claude Code starter config by centminmod that implements a Cline-inspired dual-memory architecture so Claude picks up exactly where the last session left off. Ships three CLAUDE.md template variants (progressive disclosure, dual-memory, standalone behavioral rules) updated to follow Anthropic best practices, a migration guide for existing users, and 20+ slash commands organized across security, architecture, documentation, and memory categories. Optional integrations for macOS Terminal-Notifier, Cloudflare/ClerkOS, and Convex database docs are included in supplementary files.

## Key commands

- /init — analyze the codebase and populate the memory bank from scratch
- /update-memory-bank — write current sprint state back to CLAUDE.md and memory files
- /security-audit — OWASP-guided security scan of the codebase with severity categories
- /secure-prompts — detect prompt injection attacks in file content or pasted text
- /check-best-practices — language-specific code quality analysis with before/after examples
- /create-release-note — generate customer-facing and technical release notes from git commits
- /ccusage-daily — parse ccusage output into a daily cost and token usage summary
- /apply-thinking-to — apply Anthropic extended thinking patterns to an existing prompt file
- /convert-to-todowrite-tasklist-prompt — convert a verbose workflow into parallel-subagent tasks (60-70% speed improvement)
- /cleanup-context — remove duplicate and obsolete memory bank content (15-25% token reduction)

## Install

Clone the repo and copy files into your project directory:

    git clone https://github.com/centminmod/my-claude-code-setup.git
    cp CLAUDE.md /path/to/your/project/
    cp -r .claude/ /path/to/your/project/

Install recommended CLI tools on macOS:

    brew install ripgrep fd jq

Then open Claude Code in your project and run /init to populate the memory bank.

## When to use

Use this when you want a production-ready CLAUDE.md setup with persistent memory across sessions, a suite of security and architecture slash commands, and a structured workflow for session start and end — without building it yourself.`,
      },
    ],
    repoUrl: 'https://github.com/centminmod/my-claude-code-setup',
    githubStars: 1000,
    capabilities: [
      {
        command: '/init',
        description: 'Analyze the codebase and populate the memory bank files at the start of a project.',
      },
      {
        command: '/update-memory-bank',
        description: 'Write the current sprint state back to CLAUDE.md and memory bank files at session end.',
      },
      {
        command: '/security-audit',
        description: 'Run an OWASP-guided security scan categorizing findings by Critical, High, Medium, and Low severity.',
      },
      {
        command: '/secure-prompts',
        description: 'Detect prompt injection attacks and malicious instructions in file content or pasted text.',
      },
      {
        command: '/create-release-note',
        description: 'Generate customer-facing and technical release notes from recent git commits, interactively or by commit count.',
      },
      {
        command: '/ccusage-daily',
        description: 'Parse ccusage output into a structured daily cost, token usage, and cache efficiency report.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-zircote-dotfiles-v1',
    slug: 'github-zircote-dotfiles',
    name: 'zircote Claude Dotfiles',
    tagline: 'Personal .claude/ dotfiles: 100+ domain agents, 60+ skills, custom commands, and Opus optimizations.',
    description:
      'A personal Claude Code dotfiles repo by zircote, cloned straight into ~/.claude/. ' +
      'Ships 100+ specialized agents across 10 categories (core dev, language specialists, ' +
      'infrastructure, quality/security, data/AI, DX, specialized domains, business/product, ' +
      'meta-orchestration, research/analysis), 60+ reusable skills, custom git slash commands, ' +
      'and language/framework coding standards loaded from the includes/ directory.',
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

A personal Claude Code dotfiles repo by zircote that clones directly into ~/.claude/ and immediately makes 100+ specialist agents, 60+ reusable skills, and a suite of custom slash commands available in every project. Agents are organized across 10 categories — core development (backend, frontend, fullstack), language specialists (python-pro, typescript-pro, golang-pro, rust-engineer), infrastructure (kubernetes-specialist, terraform-engineer, cloud-architect), quality and security (security-engineer, qa-expert, penetration-tester), data and AI (ml-engineer, data-scientist, llm-architect), developer experience, specialized domains (fintech-engineer, blockchain-developer), business and product (product-manager, technical-writer), meta-orchestration (workflow-orchestrator, task-distributor), and research and analysis. Coding standards for Python, Go, React/TypeScript, Git, Testing, and MCP are in the includes/ directory and load automatically from context.

## Key commands

- /git:cm — stage all files and create a commit
- /git:cp — stage, commit, and push all changes
- /git:pr — create a pull request from the current branch
- /cr — comprehensive code review dispatching parallel specialist agents
- /cr-fx — interactive remediation of code review findings from /cr
- /explore — exhaustive codebase exploration using Opus 4.5
- /deep-research — multi-phase research protocol using Opus 4.5

Plugin: zircote/claude-spec (install via /plugin or add github:zircote/claude-spec to pluginMarketplaces):

- /cs:p — strategic project planner with Socratic requirements elicitation
- /cs:i — implementation progress tracker with PROGRESS.md checkpoints
- /cs:s — project status and portfolio manager
- /cs:c — project close-out and archival
- /cs:wt:create — create a git worktree with a Claude agent

## Install

    git clone https://github.com/zircote/.claude ~/.claude

Claude Code loads CLAUDE.md and agents automatically. Install the claude-spec plugin optionally:

    # add to settings.json
    { "pluginMarketplaces": ["github:zircote/claude-spec"] }

## When to use

Use when you want a comprehensive multi-domain Claude Code setup out of the box — specialist agents across DevOps, ML, security, and product, combined with git workflow commands and project lifecycle management from a single clone.`,
      },
    ],
    repoUrl: 'https://github.com/zircote/.claude',
    githubStars: 500,
    capabilities: [
      {
        command: '/cr',
        description: 'Run a comprehensive code review by dispatching parallel specialist agents across the diff.',
      },
      {
        command: '/cr-fx',
        description: 'Interactively remediate findings from a /cr code review run.',
      },
      {
        command: '/git:cp',
        description: 'Stage all files, create a commit, and push in one command.',
      },
      {
        command: '/explore',
        description: 'Run an exhaustive codebase exploration pass using Opus 4.5.',
      },
      {
        command: '/cs:p',
        description: 'Open the Socratic project planner from the claude-spec plugin to elicit requirements.',
      },
      {
        command: '/deep-research',
        description: 'Run a multi-phase research protocol using Opus 4.5 for in-depth topic investigation.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-code-showcase-v1',
    slug: 'github-claude-code-showcase',
    name: 'Claude Code Showcase',
    tagline: 'Reference project config: hooks, skills, agents, commands, and automated GitHub Actions in one repo.',
    description:
      'A reference project by ChrisWiles demonstrating production Claude Code configuration. ' +
      'Includes a skill-evaluation hook that auto-suggests relevant skills on every prompt, ' +
      'a code-reviewer agent, slash commands for tickets, PR review, PR summaries, and ' +
      'documentation sync, plus four GitHub Actions (automatic PR review, weekly quality sweep, ' +
      'monthly docs sync, biweekly dependency audit). Clone as a template to start with all ' +
      'plumbing pre-wired.',
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

A reference project config by ChrisWiles that shows how skills, agents, hooks, slash commands, MCP servers, and GitHub Actions fit together in one Claude Code repo. The most distinctive feature is the skill-evaluation hook system: on every prompt submission a Node.js engine scores keywords, file paths, regex patterns, and intent signals from the prompt, then surfaces ranked skill suggestions with confidence scores (HIGH/MEDIUM) so Claude applies the right skills without manual invocation. Four GitHub Actions automate quality over time — PR review fires on every pull request, weekly code quality sweeps random directories, monthly docs sync checks that documentation still matches recent commits, and biweekly dependency audits run safe updates with test verification.

## Key commands

- /onboard — deep codebase exploration to understand a task or feature area before starting
- /ticket — read a JIRA or Linear ticket via MCP, create a branch, implement, update ticket status, and open a PR
- /pr-review — run the code-reviewer agent checklist against the current pull request
- /pr-summary — generate a structured PR description from the current diff
- /code-quality — run quality checks across the project
- /docs-sync — verify that documentation still aligns with recent code changes

Hook system (UserPromptSubmit):

- skill-eval.sh / skill-eval.js — on every prompt, score keywords, file paths, regex patterns, and intent signals then suggest matched skills with confidence levels
- skill-rules.json — configure pattern rules, directory mappings, and confidence thresholds per skill

## Install

    git clone https://github.com/ChrisWiles/claude-code-showcase my-project

Copy .claude/, CLAUDE.md, and .mcp.json into your project. Add the skill-evaluation hook to settings.json UserPromptSubmit and customize skill-rules.json with your own project patterns.

## When to use

Use this as the reference when wiring up a full Claude Code project with automated PR review, skill suggestion, and scheduled maintenance workflows. The skill-evaluation hook system is especially useful for teams with multiple active skill domains.`,
      },
    ],
    repoUrl: 'https://github.com/ChrisWiles/claude-code-showcase',
    githubStars: 500,
    capabilities: [
      {
        command: '/ticket',
        description: 'Read a JIRA or Linear ticket via MCP, implement the feature, update ticket status, and open a PR.',
      },
      {
        command: '/pr-review',
        description: 'Run the code-reviewer agent checklist covering TypeScript strict mode, error handling, loading states, and mutation patterns.',
      },
      {
        command: '/pr-summary',
        description: 'Generate a structured PR description from the current diff.',
      },
      {
        command: 'skill-eval UserPromptSubmit hook',
        description: 'On every prompt, score keywords, file paths, and intent signals to surface ranked skill suggestions with HIGH/MEDIUM confidence labels.',
      },
      {
        command: 'pr-claude-code-review GitHub Action',
        description: 'Automatically post a structured Claude code review comment on every PR and respond to @claude mentions.',
      },
      {
        command: 'scheduled-claude-code-quality GitHub Action',
        description: 'Weekly automated quality sweep of random directories with auto-fix and a monthly docs-sync pass.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-code-memory-bank-v1',
    slug: 'github-claude-code-memory-bank',
    name: 'Claude Code Memory Bank',
    tagline: 'Hierarchical markdown memory bank adapted from Cline: six files, five workflow commands.',
    description:
      'A memory management system adapted from the Cline Memory Bank pattern, restructured for ' +
      'Claude Code by hudrazine. Uses six hierarchical markdown files — projectbrief, productContext, ' +
      'activeContext, systemPatterns, techContext, and progress — loaded via @import in CLAUDE.md. ' +
      'The /init-memory-bank command auto-detects technologies and creates only missing files, ' +
      'preserving any existing documentation.',
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

Brings the Cline Memory Bank pattern to Claude Code using six hierarchical markdown files stored in a memory-bank/ directory. The hierarchy flows from projectbrief.md through productContext.md and systemPatterns.md/techContext.md into activeContext.md, then into progress.md — each file builds on those above it so Claude always has a coherent picture of what the project is, how it is architected, and what is being worked on now. The core system is loaded into CLAUDE.md via @import so it is active in every session automatically.

The initialization command is smart: for a new project it prompts for details and creates all six files; for an existing project it reads package.json, README, and any existing documentation to auto-detect the technology stack and populate files without overwriting content that is already there; if a projectbrief.md already exists it reads it and uses it to populate the other five files consistently.

## Key commands

- /init-memory-bank — initialize the memory bank for the current project; detects existing state and fills only missing files
- /workflow:understand — load all six memory bank files and summarize the current project state and focus
- /workflow:plan — draft a detailed implementation strategy against the current activeContext
- /workflow:execute — implement the plan with systematic quality checks and update progress.md
- /workflow:update-memory — write the current session state back to all six memory bank files

## Install

    git clone https://github.com/hudrazine/claude-code-memory-bank.git
    cp -r claude-code-memory-bank/.claude /path/to/your/project/

Add to your project CLAUDE.md:

    @.claude/claude-memory-bank.md

Then in Claude Code run /init-memory-bank to populate the memory bank.

## When to use

Use when you want structured, hierarchical project memory that auto-detects the tech stack, preserves existing documentation, and gives Claude a consistent starting context across sessions — without the manual effort of maintaining a single flat CLAUDE.md.`,
      },
    ],
    repoUrl: 'https://github.com/hudrazine/claude-code-memory-bank',
    githubStars: 500,
    capabilities: [
      {
        command: '/init-memory-bank',
        description: 'Smart initialization: detects existing project state, auto-infers tech stack, and creates only the missing memory bank files.',
      },
      {
        command: '/workflow:understand',
        description: 'Load all six memory bank files and summarize current project state at the start of a session.',
      },
      {
        command: '/workflow:plan',
        description: 'Draft a detailed implementation strategy grounded in the current activeContext.',
      },
      {
        command: '/workflow:execute',
        description: 'Implement the plan with systematic quality checks and update progress.md.',
      },
      {
        command: '/workflow:update-memory',
        description: 'Write the current session state back to all six hierarchical memory bank files.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-code-system-prompts-v1',
    slug: 'github-claude-code-system-prompts',
    name: 'Claude Code System Prompts',
    tagline: 'Decompiled Claude Code internals: 515+ prompts — tool descriptions, sub-agent prompts, and utilities — updated within minutes of each release.',
    description:
      'A reverse-engineered collection of Claude Code\'s internal system prompts maintained by ' +
      'Piebald AI and updated within minutes of each Claude Code release. As of v2.1.204 ' +
      '(July 2026) covers 515+ strings: all built-in tool descriptions, Plan and Explore ' +
      'sub-agent prompts, slash command agents (/code-review, /batch, /security-review, etc.), ' +
      'and utility prompts for compaction, CLAUDE.md generation, and session title generation. ' +
      'Includes a CHANGELOG across 230 versions. Use tweakcc to patch any of these strings locally.',
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

A decompilation of Claude Code's internal system prompts extracted directly from the compiled source of each Claude Code release and maintained by Piebald AI. Updated within minutes of every Claude Code version bump — a GitHub release notification fires for each new version, and the CHANGELOG.md tracks prompt changes across 230 versions since v2.0.14.

As of Claude Code v2.1.204 (July 7, 2026) the repo covers 515+ prompt strings, including:

- Sub-agent prompts: Explore (871 tokens), Plan mode enhanced (715 tokens)
- Creation assistants: CLAUDE.md creation (513 tokens), statusline setup (3,230 tokens)
- Slash command agents: /batch (1,106 tokens), /code-review across 10 prompt parts, /security-review, and more
- All 27+ built-in tool descriptions (Write, Bash, TodoWrite, Read, etc.)
- Utility prompts: conversation compaction, session title generation

Because the strings are extracted from the same compiled source that Claude Code uses, they are guaranteed to be exact — not approximated.

## Key files

- system-prompts/ — all tool descriptions and utility prompt files
- system-prompts/agent-prompt-explore.md — the Explore sub-agent system prompt
- system-prompts/agent-prompt-plan-mode-enhanced.md — the Plan sub-agent system prompt
- system-prompts/agent-prompt-claudemd-creation.md — the CLAUDE.md generation agent prompt
- CHANGELOG.md — prompt diffs across 230 Claude Code versions

## Install

No install needed. Browse the repo on GitHub or star it to receive GitHub release notifications when a new Claude Code version lands.

Use tweakcc to patch any of these strings in your local Claude Code installation without editing the minified source manually.

## When to use

Use when writing CLAUDE.md behavioral rules and you want to see exactly how Claude Code phrases its built-in constraints. Use to track breaking changes to sub-agent behavior across Claude Code updates. Use as the ground truth when testing whether a custom prompt override actually changes Claude's behavior.`,
      },
    ],
    repoUrl: 'https://github.com/Piebald-AI/claude-code-system-prompts',
    githubStars: 1000,
    capabilities: [
      {
        command: 'Browse system-prompts/',
        description: 'Access all 515+ extracted tool descriptions, sub-agent prompts, and utility prompts as individual markdown files.',
      },
      {
        command: 'Browse CHANGELOG.md',
        description: 'Track exact prompt text changes across 230 Claude Code versions since v2.0.14.',
      },
      {
        command: 'GitHub release notifications',
        description: 'Star the repo to receive a notification within minutes of each new Claude Code release with a summary of what changed.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-tweakcc-v1',
    slug: 'github-tweakcc',
    name: 'tweakcc',
    tagline: 'CLI to patch a Claude Code install: custom system prompts, themes, thinking verbs, toolsets, session memory, and 20+ more features.',
    description:
      'A CLI tool by Piebald AI that patches an existing Claude Code installation — npm or native ' +
      'binary — with custom system prompts, color themes, thinking verbs, spinner animations, ' +
      'custom toolsets, user-message styling, subagent model overrides, session memory, a ' +
      '/remember skill, table format switching, and MCP startup optimization. Run npx tweakcc, ' +
      'configure via the interactive menu or ~/.tweakcc/config.json, and apply with --apply. ' +
      'Community patches installable from a URL via tweakcc adhoc-patch.',
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

tweakcc patches Claude Code's compiled cli.js (or native binary on macOS/Windows/Linux) with customizations stored in ~/.tweakcc/config.json. Supports npm-based and native binary installations, including Homebrew, nvm, fnm, volta, and Nix. After a Claude Code update overwrites the patches, running npx tweakcc --apply reapplies everything from the config file.

Features available in tweakcc 4.0.0:

- Custom system prompts: edit any of Claude Code's 515+ internal prompt strings as markdown files and patch them in (with diff/conflict management vs. Anthropic's changes)
- Themes: graphical HSL/RGB color picker to restyle every UI color; switch themes with /config
- Thinking verbs: custom words shown while Claude works ("pondering", "considering")
- Spinner animations: custom animations with configurable speed and phase
- Toolsets: define custom toolsets invokable with /toolset in a session
- Session memory and /remember skill: persist facts across sessions (opt-in)
- Subagent model overrides: configure which model each sub-agent (Plan, Explore, general) uses
- User message styling: style the gray user-message text in chat history
- Table format switching: Claude Code default, Unicode (┌─┬─┐), ASCII/markdown (|---|), or borderless
- MCP startup optimization: non-blocking parallel MCP connections, ~50% faster startup
- Opus Plan 1M mode: opusplan[1m] alias — Opus for planning, Sonnet's 1M context for execution
- Input pattern highlighters: highlight custom strings (like "ultrathink") in the input box
- AGENTS.md support, auto-accept plan mode, token count rounding, context limit control

## Install

    npx tweakcc         # interactive setup
    pnpm dlx tweakcc    # alternative

Apply community patches from a URL:

    npx tweakcc adhoc-patch --url https://gist.github.com/...

## When to use

Use when you want to customize Claude Code's UI, system prompts, or behavior without forking the source — and you want customizations to survive Claude Code updates by reapplying from a config file.`,
      },
    ],
    repoUrl: 'https://github.com/Piebald-AI/tweakcc',
    githubStars: 1000,
    capabilities: [
      {
        command: 'npx tweakcc',
        description: 'Launch the interactive configuration menu to set up themes, thinking verbs, spinners, toolsets, and system prompt patches.',
      },
      {
        command: 'npx tweakcc --apply',
        description: 'Reapply all saved customizations from ~/.tweakcc/config.json after a Claude Code update.',
      },
      {
        command: 'npx tweakcc adhoc-patch --url <url>',
        description: 'Download and apply a custom patch script from a URL without installing a separate npm package.',
      },
      {
        command: 'npx tweakcc unpack / repack',
        description: 'Extract the cli.js from a native binary installation, edit it, and repack it into the binary.',
      },
      {
        command: '/toolset',
        description: 'In Claude Code, switch to a custom toolset defined in the tweakcc configuration.',
      },
      {
        command: '/remember',
        description: 'Persist a fact or context note across Claude Code sessions (requires session memory feature enabled).',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-context-forge-v1',
    slug: 'github-context-forge',
    name: 'Context Forge',
    tagline: 'CLI wizard that scaffolds the full Claude Code surface — settings.json, agents, skills, hooks, slash commands, and PRPs — from a 10-screen TUI.',
    description:
      'A CLI tool by Jason Webdev (v4.0.0) that generates the complete modern .claude/ surface ' +
      'from an Ink TUI wizard: a schema-locked settings.json with all 8 hook lifecycle events, ' +
      '5 default sub-agents, 3 skills, 21 slash commands, 14 hook scripts, CLAUDE.md, ' +
      'Implementation.md, and Product Requirement Prompts. Supports Claude, Cursor, Windsurf, ' +
      'Cline, Roo, Gemini, and GitHub Copilot. Run npx context-forge or install globally.',
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

Context Forge (v4.0.0) is a CLI that generates the complete modern Claude Code project surface from a 10-screen Ink TUI wizard (ESC = back, Enter = advance, Ctrl-C = exit). It produces:

- CLAUDE.md — tech-stack-aware project rules with KISS/YAGNI directives and pre-commit checklist
- .claude/settings.json — schema-locked, wires all 8 Claude Code hook lifecycle events (PreToolUse, PostToolUse, SessionStart, UserPromptSubmit, PreCompact, Stop, SubagentStop, Notification) plus mcpServers, statusLine, outputStyles, and permissions
- .claude/agents/ — 5 default sub-agents: code-reviewer, test-runner, plan-architect, security-auditor, prp-executor
- .claude/skills/ — 3 default skills: testing-protocol (renders test command/framework), deployment-checklist (tailored to detected deploy target), codebase-navigation
- .claude/commands/ — 21 slash commands across 6 subdirs: PRPs/, orchestration/, checkpoints/, quality/, session/, migration/
- .claude/hooks/ — 14 bash scripts + 4 Python scripts registered through settings.json
- PRPs/ — Product Requirement Prompts, optionally AI-enhanced via Anthropic or OpenAI API
- Docs/ — staged Implementation.md, project_structure.md, UI_UX_doc.md, Bug_tracking.md

Also supports analyze (retrofit existing codebases), enhance (plan new features), migrate (plan stack migrations), validate (run quality gates), run-prp (execute a PRP end-to-end), orchestrate (deploy autonomous agent teams via tmux), and dashboard commands.

## Key commands

- context-forge init — run the 10-screen TUI wizard to scaffold the full surface
- context-forge init --no-tui — use the legacy inquirer flow for CI or non-TTY environments
- context-forge init --ai-prp — add AI-generated Product Requirement Prompts to the output
- context-forge analyze — detect an existing project's tech stack and retrofit CLAUDE.md and PRPs
- context-forge enhance — plan and scaffold a new feature with PRPs and progress-tracking commands
- context-forge migrate — plan a tech-stack migration with phased execution and rollback procedures
- context-forge validate — run the quality gate (lint, tests, coverage, build, security)
- context-forge run-prp <name> — execute a PRP end-to-end against the codebase
- /prp-create <feature> — generate a PRP for a new feature (slash command)
- /prp-execute <name> — execute an existing PRP (slash command)
- /validate — run the full validation gate from inside Claude Code
- /checkpoint-create <name> — create a named working-state checkpoint

## Install

    npm install -g context-forge
    context-forge init

Or run without installing:

    npx context-forge init

For AI-powered PRPs, set up the API key first:

    context-forge ai-keys --provider anthropic

## When to use

Use when starting a new project and you want the entire modern .claude/ surface — hooks, agents, skills, commands, PRPs — wired correctly in one command rather than assembled by hand.`,
      },
    ],
    repoUrl: 'https://github.com/webdevtodayjason/context-forge',
    githubStars: 1000,
    capabilities: [
      {
        command: 'context-forge init',
        description: 'Run the 10-screen Ink TUI wizard to scaffold CLAUDE.md, settings.json, agents, skills, hooks, commands, and PRPs.',
      },
      {
        command: 'context-forge init --ai-prp',
        description: 'Generate AI-enhanced Product Requirement Prompts using the Anthropic or OpenAI API alongside the standard scaffold.',
      },
      {
        command: 'context-forge analyze',
        description: 'Retrofit an existing codebase with CLAUDE.md, tech-stack detection, and per-feature PRPs without overwriting existing files.',
      },
      {
        command: 'context-forge run-prp <name>',
        description: 'Execute a named PRP end-to-end with validation gates between stages.',
      },
      {
        command: 'context-forge migrate',
        description: 'Plan a tech-stack migration with phased execution, dependency analysis, and rollback procedures.',
      },
      {
        command: '/validate',
        description: 'Run the full validation gate (lint, tests, coverage, build, security) from inside Claude Code.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-code-guide-v1',
    slug: 'github-claude-code-guide',
    name: 'Claude Code Guide',
    tagline: 'Community single-page reference for Claude Code: install, env vars, slash commands, MCP, hooks, sub-agents, and rarely documented flags.',
    description:
      'A community-maintained reference guide for Claude Code by zebbern, organized into eight ' +
      'sections covering installation, configuration, all slash commands, MCP integration, hooks, ' +
      'sub-agents, third-party integrations, and troubleshooting — with copy-paste examples and ' +
      'settings.json snippets throughout. Cross-linked to related repos including agent skills ' +
      'libraries, MCP configs, and Mermaid diagram templates.',
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

A community-maintained single-page reference for Claude Code by zebbern, kept up to date with the live Claude Code documentation. Organized into eight sections with jump links: Getting Started, Configuration and Environment Variables, Commands and Usage, Interface and Input, Advanced Features, Automation and Integration, Help and Troubleshooting, and Third-Party Integrations. Every section includes copy-paste examples and settings.json snippets.

Cross-referenced to related community repos maintained by the same author: a Claude Code Discord MCP, 954+ agent skills, a no-cost AI resources list, and 250+ Mermaid diagram templates.

Sections at a glance:

- Getting Started — install commands, system requirements, initial setup steps
- Configuration — complete environment variable list with accepted values and defaults; configuration file locations and precedence; settings.json structure
- Commands — all built-in slash commands with descriptions; CLI flags including rarely documented options
- MCP — how to configure MCP servers in .mcp.json; per-integration examples (JIRA, GitHub, Slack, Postgres)
- Sub-agents — how sub-agents work, how to write agent .md files with frontmatter, the Plan and Explore built-ins
- Hooks — all hook events (PreToolUse, PostToolUse, UserPromptSubmit, Stop, etc.), response format, exit codes
- --dangerously-skip-permissions — exact definition, safe-use conditions (fully sandboxed CI only), what it skips
- Third-Party Integrations — IDE plugins, status-bar integrations, GitHub Actions

## Install

No install needed. Browse the README on GitHub. Use the section links at the top for fast navigation.

## When to use

Use as the first stop for any Claude Code configuration question — environment variables, hook event names and response format, MCP server setup, or the exact behavior of a CLI flag. Faster than searching the official docs for common configuration patterns.`,
      },
    ],
    repoUrl: 'https://github.com/zebbern/claude-code-guide',
    githubStars: 5000,
    capabilities: [
      {
        command: 'Browse Getting Started section',
        description: 'Find install commands, system requirements, and initial setup steps for Claude Code.',
      },
      {
        command: 'Browse Configuration section',
        description: 'Reference all environment variables with accepted values, configuration file locations, and settings.json structure.',
      },
      {
        command: 'Browse MCP section',
        description: 'Find .mcp.json format and per-integration examples for JIRA, GitHub, Slack, and Postgres MCP servers.',
      },
      {
        command: 'Browse Hooks section',
        description: 'Reference all hook events, response format (block/message/feedback/continue), and exit code behavior.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-awesome-claude-code-v1',
    slug: 'github-awesome-claude-code',
    name: 'Awesome Claude Code',
    tagline: 'The canonical curated list for Claude Code: skills, plugins, hooks, agents, MCP, status lines, and more — with THE_RESOURCES_TABLE.csv as the machine-readable index.',
    description:
      'The canonical community-curated "awesome list" for Claude Code by hesreallyhim, covering ' +
      'resources across skills, plugins, hooks, agents, MCP integrations, status lines, memory ' +
      'and context persistence, usage monitoring, design and UI, writing tools, infrastructure, ' +
      'security, multi-agent orchestration, and more. THE_RESOURCES_TABLE.csv is the ' +
      'machine-readable index with all entries and metadata. One of the most-starred Claude ' +
      'Code community resources.',
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

The canonical community-curated list for Claude Code, hand-picked and maintained by hesreallyhim. Organized across named categories including: Start Here, From Anthropic, Documentation/Knowledge/Learning, Research and Scientific Inquiry, Providers/Runtime/Integration Infrastructure, Remote Control/Notifications/Voice I/O, Alternative Clients, Status Lines, Design and UI/UX, Writing and Prose Quality, Creative Media, Infrastructure and DevOps, Security, Multi-Agent Orchestration, Skills, Memory and Context Persistence, and Usage and Cost Monitoring.

THE_RESOURCES_TABLE.csv is the machine-readable index of every entry in a spreadsheet-friendly format with repo URLs, categories, and metadata. The repo also generates animated SVG tickers and recently-added highlight badges displayed in the README.

Resources on the list are curated for quality, security, and originality — not just volume. The README notes that resources from previous iterations not yet migrated to the new format are preserved in README_ALTERNATIVES/ and will be re-added.

## Key files

- README.md — the full categorized list with descriptions and links
- THE_RESOURCES_TABLE.csv — machine-readable index of all entries
- README_ALTERNATIVES/ — legacy resources from previous list iterations
- assets/repo-ticker.svg — animated ticker of featured projects
- assets/recently-added.svg — recently added resources badge

## Install

No install needed. Browse the repo on GitHub.

- Scroll the README to browse by category
- Download THE_RESOURCES_TABLE.csv for a machine-readable full index
- Use GitHub search within the repo to find resources by keyword
- Star the repo to track new additions

## When to use

Use as the starting point when looking for any Claude Code community resource — skills, plugins, memory systems, status lines, orchestration tools, or security utilities. THE_RESOURCES_TABLE.csv is the fastest way to bulk-search entries or build a filtered view.`,
      },
    ],
    repoUrl: 'https://github.com/hesreallyhim/awesome-claude-code',
    githubStars: 40000,
    capabilities: [
      {
        command: 'Browse THE_RESOURCES_TABLE.csv',
        description: 'Access the machine-readable index of all curated resources with repo URLs and category metadata.',
      },
      {
        command: 'Browse by category',
        description: 'Filter resources by category — skills, plugins, MCP, status lines, memory, orchestration, security, and more — in the organized README.',
      },
      {
        command: 'Browse README_ALTERNATIVES/',
        description: 'Access legacy resources from previous list iterations that are still maintained but pending format migration.',
      },
    ],
  },

  // ── Skills (5) ──────────────────────────────────────────────────────────────

  {
    kind: 'skill',
    id: 'github-composio-awesome-claude-skills-v1',
    slug: 'github-composio-awesome-claude-skills',
    name: 'Composio Awesome Claude Skills',
    tagline: '1000+ production skills across Claude Code, Codex, Cursor, Gemini, and Antigravity — plus Connect for real actions across 500+ apps.',
    description:
      'A curated collection of 1000+ production Claude Skills from Composio, organized across ' +
      'Document Processing, Development/Code Tools, Data/Analysis, Business/Marketing, ' +
      'Communication/Writing, Creative/Media, Productivity/Organization, Collaboration/PM, ' +
      'Security/Systems, and 78 App Automation skills via Composio\'s Rube MCP. The flagship ' +
      'Connect skill lets Claude send emails, post Slack messages, create GitHub issues, and ' +
      'act across 500+ services via a free Composio API key.',
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

A curated collection of 1000+ production Claude Skills from Composio, usable across Claude Code, Claude.ai, Codex, Cursor, Gemini CLI, Antigravity, and Windsurf. Organized in ten categories:

- Document Processing — docx, pdf, pptx, xlsx, EPUB converter, legal skill pack (NDA triage, citation verifier)
- Development and Code Tools — web artifacts builder, changelog generator, MCP builder, webapp testing, iOS simulator, Playwright automation, LangSmith fetch for LangChain trace debugging, great_cto (7 SDLC agents), and more
- Data and Analysis — CSV summarizer, deep research via Gemini, PostgreSQL read-only queries, recursive PhD-level research
- Business and Marketing — lead research assistant, domain brainstormer, competitive ads extractor
- Communication and Writing — content research writer, meeting insights analyzer (conflict detection, speaking ratios), NotebookLM integration
- Creative and Media — canvas design (PNG/PDF), video downloader, Slack GIF creator, image enhancer
- Productivity and Organization — file organizer, invoice organizer, tailored resume generator, n8n workflow operator
- Collaboration and PM — git-pushing, Google Workspace suite (Gmail/Calendar/Chat/Docs/Sheets/Slides/Drive)
- Security and Systems — computer forensics, metadata extraction, threat hunting with Sigma rules
- App Automation via Composio — 78 pre-built workflow skills for SaaS apps (Jira, Slack, GitHub, Notion, Salesforce, Stripe, Shopify, etc.) using the Rube MCP

The flagship Connect skill handles auth and connects to 500+ apps out of the box.

## Install

Install the Connect skill (requires a free Composio API key from dashboard.composio.dev):

    claude --plugin-dir ./connect-apps-plugin

Then in Claude Code:

    /connect-apps:setup

Install individual skills by placing the skill folder in your skills directory:

    cp -r <skill-name> ~/.config/claude-code/skills/

Or via the Claude.ai Skills interface at Settings > Capabilities.

## When to use

Use Connect when you need Claude to take real actions across external services — send an email, create a GitHub issue, post to Slack — using a single API key rather than configuring individual MCP servers. Use category skills for document processing, data analysis, or business workflows that go beyond code.`,
      },
    ],
    repoUrl: 'https://github.com/ComposioHQ/awesome-claude-skills',
    githubStars: 56000,
    capabilities: [
      {
        command: '/connect-apps:setup',
        description: 'Set up the Connect skill with a Composio API key to enable Claude to act across 500+ apps including Gmail, Slack, GitHub, and Notion.',
      },
      {
        command: 'Changelog Generator skill',
        description: 'Automatically generate user-facing changelogs from git commit history, transforming technical commits into customer-friendly release notes.',
      },
      {
        command: 'LangSmith Fetch skill',
        description: 'Debug LangChain and LangGraph agents by automatically fetching and analyzing execution traces from LangSmith Studio.',
      },
      {
        command: 'App Automation skills (78 apps)',
        description: 'Pre-built workflow skills for Jira, Slack, GitHub, Salesforce, Stripe, Notion, Shopify, and 71 more SaaS apps via the Composio Rube MCP.',
      },
      {
        command: 'great_cto skill',
        description: 'Full SDLC pipeline with 7 specialized sub-agents (tech-lead, senior-dev, qa-engineer, security-officer, devops, l3-support, project-auditor) and 13 compliance frameworks.',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-travisvn-awesome-claude-skills-v1',
    slug: 'github-travisvn-awesome-claude-skills',
    name: 'travisvn Awesome Claude Skills',
    tagline: 'Curated collection of Claude Skills covering official Anthropic skills plus notable community contributions.',
    description:
      'A curated list of Claude Skills by travisvn covering both Anthropic\'s official skills ' +
      '(docx, pdf, pptx, xlsx, algorithmic-art, canvas-design, web-artifacts-builder, ' +
      'mcp-builder, webapp-testing, skill-creator, brand-guidelines) and notable community ' +
      'contributions (obra/superpowers, iOS simulator, Playwright, D3.js, Trail of Bits security ' +
      'skills, shadcn/ui, Expo, and more). Includes a skills vs. prompts vs. subagents vs. MCP ' +
      'comparison matrix and a step-by-step creation guide.',
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

A curated list of Claude Skills maintained by travisvn, covering the full official Anthropic skills library and notable community contributions. Updated as of February 2026.

Official Anthropic skills listed:

Document skills: docx, pdf, pptx, xlsx — create, edit, analyze Office and PDF files.
Design and creative: algorithmic-art (p5.js generative art), canvas-design (PNG/PDF), slack-gif-creator.
Development: frontend-design (anti-AI-slop React/Tailwind patterns), web-artifacts-builder (React + shadcn/ui HTML artifacts), mcp-builder (guide for building MCP servers), webapp-testing (Playwright).
Communication: brand-guidelines (Anthropic brand colors/typography), internal-comms.
Skill creation: skill-creator (interactive Q&A to build new skills).

Community collections highlighted:

- obra/superpowers — 20+ battle-tested skills including TDD, debugging, collaboration patterns; installable via /plugin marketplace add obra/superpowers-marketplace
- Trail of Bits Security Skills — CodeQL/Semgrep static analysis, variant analysis, vulnerability detection
- shadcn/ui skill — component context and pattern enforcement for shadcn projects
- Expo Skills — official Expo team skills for Expo app development
- iOS Simulator skill, Playwright skill, D3.js skill, and more

Also includes: a skills vs. prompts vs. subagents vs. MCP comparison matrix, a quick-reference table for when to use each approach, security guidelines (skills can run arbitrary code), and a step-by-step skill creation guide with skill-creator and manual methods.

## Install

For Claude Code, install skills from the marketplace:

    /plugin marketplace add anthropics/skills

Or copy a skill folder to the skills directory:

    cp -r <skill-name> ~/.claude/skills/

For the obra/superpowers collection:

    /plugin marketplace add obra/superpowers-marketplace

## When to use

Use as a curated starting point for finding skills that work across Claude.ai, Claude Code, and the API. The comparison matrix is useful when deciding whether to reach for a skill, a subagent, an MCP server, or a system prompt for a given task.`,
      },
    ],
    repoUrl: 'https://github.com/travisvn/awesome-claude-skills',
    githubStars: 13500,
    capabilities: [
      {
        command: '/plugin marketplace add anthropics/skills',
        description: 'Install official Anthropic skills (docx, pdf, pptx, xlsx, canvas-design, webapp-testing, and more) from the Claude Code marketplace.',
      },
      {
        command: '/plugin marketplace add obra/superpowers-marketplace',
        description: 'Install the obra/superpowers library of 20+ battle-tested skills including TDD, debugging, and brainstorming.',
      },
      {
        command: 'Browse Skills vs. MCP comparison',
        description: 'Reference the decision matrix comparing skills, prompts, subagents, and MCP servers to pick the right tool for a given workflow.',
      },
      {
        command: 'Browse Trail of Bits Security Skills',
        description: 'Access CodeQL/Semgrep static analysis, variant analysis, and vulnerability detection skills from a professional security firm.',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-antigravity-awesome-skills-v1',
    slug: 'github-antigravity-awesome-skills',
    name: 'Antigravity Awesome Skills',
    tagline: '1,929+ SKILL.md playbooks with an npx installer targeting Claude Code, Cursor, Codex CLI, Gemini CLI, Kiro, Copilot, and more.',
    description:
      'An installable library of 1,929+ SKILL.md agentic skills (v13.12.0) by sickn33, with an ' +
      'npx installer that places skills in the correct directory for each supported tool: Claude Code, ' +
      'Cursor, Codex CLI, Autohand Code, Gemini CLI, Antigravity, Kiro, OpenCode, and GitHub ' +
      'Copilot. Includes specialized plugin bundles for web, security, data, docs, DevOps, QA, ' +
      'OSS, and agent/MCP workflows, plus role-based bundles and workflow execution playbooks.',
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

Antigravity Awesome Skills (v13.12.0) is an installable GitHub library of 1,929+ SKILL.md agentic playbooks. The npx installer handles placement for each supported tool automatically: Claude Code, Cursor, Codex CLI, Autohand Code, Gemini CLI, Antigravity, Kiro, OpenCode, and GitHub Copilot.

Skills span development, testing, security, infrastructure, product, and marketing categories. Beyond the full library, the repo also provides:

- Specialized plugin bundles: focused skill sets for web development, security, data, documentation, DevOps, QA, OSS maintenance, and agent/MCP workflows
- Role-based bundles: recommended starting sets by role
- Workflow execution playbooks: ordered sequences for planning, coding, debugging, testing, security review, infrastructure, product, and growth work

The installer uses a shallow release-pinned clone by default for faster first runs. Use --tag main only when you explicitly want the current repository tip.

## Install

Full library install to the default location (~/.agents/skills):

    npx antigravity-awesome-skills

Install for a specific tool:

    npx antigravity-awesome-skills --claude    # Claude Code: ~/.claude/skills/
    npx antigravity-awesome-skills --cursor    # Cursor: .cursor/skills/
    npx antigravity-awesome-skills --codex     # Codex CLI
    npx antigravity-awesome-skills --gemini    # Gemini CLI
    npx antigravity-awesome-skills --agy       # Antigravity CLI slash commands

Install a specialized plugin bundle (example for security):

    npx antigravity-awesome-skills --plugin security

Verify the install:

    test -d ~/.agents/skills && echo "Skills installed"

## When to use

Use when you want a large, immediately available catalog of skills for planning, debugging, testing, or security review across multiple agent tools — and you want installation handled automatically rather than copying skill folders manually. Use a specialized plugin bundle when you know the job domain and want a focused set rather than 1,929 skills at once.`,
      },
    ],
    repoUrl: 'https://github.com/sickn33/antigravity-awesome-skills',
    githubStars: 42000,
    capabilities: [
      {
        command: 'npx antigravity-awesome-skills --claude',
        description: 'Install all 1,929+ SKILL.md files into ~/.claude/skills/ so they are available in every Claude Code session.',
      },
      {
        command: 'npx antigravity-awesome-skills --plugin <domain>',
        description: 'Install a focused plugin bundle for a specific domain (web, security, data, DevOps, QA, OSS, agent/MCP).',
      },
      {
        command: 'npx antigravity-awesome-skills --cursor',
        description: 'Install the skill library into the Cursor IDE skills directory.',
      },
      {
        command: 'npx antigravity-awesome-skills --agy',
        description: 'Install skills for the Antigravity CLI slash command interface (~/.gemini/antigravity-cli/skills/).',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-rohitg00-claude-code-toolkit-v1',
    slug: 'github-rohitg00-claude-code-toolkit',
    name: 'rohitg00 Claude Code Toolkit',
    tagline: 'Comprehensive Claude Code toolkit: 135 agents, 35 skills, 42 commands, 176+ plugins, 20 hooks, 15 MCP configs — installable via plugin marketplace or one-liner.',
    description:
      'A comprehensive Claude Code toolkit from rohitg00 with multiple install paths: plugin ' +
      'marketplace, manual clone, or a one-liner curl installer. Packages 135 agents, 35 curated ' +
      'skills (+400k via SkillKit), 42 commands, 176+ plugins, 20 hooks, 15 rules, 7 templates, ' +
      '15 MCP configs, 26 companion apps, and 53 ecosystem entries. Featured plugins include ' +
      'great_cto (7 SDLC agents), agento-patronum (credential protection hooks), and ' +
      'AgentLint (AI agent compatibility checker).',
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

A comprehensive Claude Code toolkit maintained by rohitg00. The most complete single-repo collection for Claude Code as of March 2026, with 850+ files and multiple install paths.

Contents:

- 135 agents across development, infrastructure, security, data, and business domains
- 35 curated skills plus access to 400,000+ via the SkillKit integration at agenstskills.com
- 42 slash commands covering code generation, testing, documentation, and workflow management
- 176+ plugins including featured entries: great_cto (full SDLC pipeline with 7 specialist agents and 13 compliance frameworks), agento-patronum (protect .env/SSH keys/AWS credentials from Claude via hook enforcement), AgentLint (33 AI agent compatibility checks), aws-cost-saver (173 automated cost-reduction checks), and claude-agentic-coding-playbook (19+ lifecycle hooks, investigation workflows, 58-citation best practices guide)
- 20 hook scripts across all 8 Claude Code lifecycle events
- 15 MCP server configurations
- 26 companion apps and GUIs
- 53 ecosystem entries (alternative clients, status lines, monitoring tools)

## Install

Plugin marketplace (recommended):

    /plugin marketplace add rohitg00/awesome-claude-code-toolkit

Manual clone:

    git clone https://github.com/rohitg00/awesome-claude-code-toolkit.git ~/.claude/plugins/claude-code-toolkit

One-liner:

    curl -fsSL https://raw.githubusercontent.com/rohitg00/awesome-claude-code-toolkit/main/setup/install.sh | bash

## When to use

Use when you want a single source for agents, skills, commands, plugins, hooks, and MCP configs — particularly if you need the full breadth of 135 agents and 176+ plugins without assembling them from multiple repos. The plugin marketplace install is the fastest path to getting the full toolkit active.`,
      },
    ],
    repoUrl: 'https://github.com/rohitg00/awesome-claude-code-toolkit',
    githubStars: 3000,
    capabilities: [
      {
        command: '/plugin marketplace add rohitg00/awesome-claude-code-toolkit',
        description: 'Install the full toolkit (135 agents, 176+ plugins, 42 commands, 20 hooks, 15 MCP configs) via the Claude Code plugin marketplace.',
      },
      {
        command: 'agento-patronum plugin',
        description: 'Protect .env files, SSH keys, AWS credentials, and kubeconfig from unintended Claude access via hook enforcement rather than deny rules.',
      },
      {
        command: 'great_cto plugin',
        description: 'Full SDLC pipeline with 7 specialist agents, 12-angle code review, 13 compliance frameworks (SOC2/HIPAA/PCI-DSS/GDPR/ISO 27001), and Opus 4.7 escalation.',
      },
      {
        command: 'AgentLint plugin',
        description: 'Run 33 evidence-backed checks across 5 dimensions to audit your repo for AI agent compatibility.',
      },
      {
        command: 'pro-workflow plugin',
        description: 'Battle-tested Claude Code workflows: self-correcting memory, parallel worktrees, wrap-up rituals, 8 hook types, 5 agents, and the 80/20 AI coding ratio.',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-glebis-claude-skills-v1',
    slug: 'github-glebis-claude-skills',
    name: 'glebis Claude Skills',
    tagline: 'Personal Claude Code skill collection: tiered software releases, synthetic session generation, semantic vault search, CBT/DBT interventions, and interactive presentations.',
    description:
      'A personal collection of Claude Code skills from Gleb Kalinin (glebis) focused on ' +
      'specialized, well-tested workflows. Skills include: a config-driven release manager with ' +
      'tiered compatibility policy and 27-unit-test stdlib engine; a synthetic coaching/therapy ' +
      'session generator across four therapeutic modalities; a semantic Obsidian vault search ' +
      'using the qmd engine with cross-lingual retrieval; evidence-based CBT/DBT intervention ' +
      'skills; and interactive HTML presentations with ElevenLabs narration.',
    role: 'general',
    industry: null,
    tags: ['skills', 'claude-code', 'release-management', 'research', 'productivity'],
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

A personal collection of Claude Code skills by Gleb Kalinin (glebis), each built around a specific high-value workflow with a stdlib-only or minimal-dependency engine and bundled tests.

Skills in the collection:

Release (tiered compatibility) — config-driven release manager that bumps version files, runs a readiness gate, drafts a Keep-a-Changelog section from conventional commits, updates COMPATIBILITY.md with surfaces × maturity tiers (experimental/preview/stable), tags the release, and reports closed issues. A breaking change to a stable surface is forced to a major bump. Engine: 27-unit-test scripts/release.py; no third-party dependencies. Configure via release.config.json; invoke with /release minor or /release major.

Synthetic Session Generator — generate persona-consistent synthetic coaching and therapy session transcripts for evals, demos, and training data. Supports 4 modalities (ICF/GROW coaching, CBT, IFS parts-work, ACT/Motivational Interviewing), reusable persona bibles, 4 output formats (Fathom/Granola style, plain dialogue, structured JSON with eval labels, Obsidian markdown), 8 languages, and optional GPT Image 2 case-conceptualization cards. Always watermarked as synthetic.

qmd Search — semantic search over a local Obsidian vault using the on-device qmd engine (Node >= 22 or Bun). Five search modes: BM25 keyword, vector semantic, hybrid expansion+rerank, literal native-script grep, and fused (hybrid + grep). Cross-lingual retrieval (EN↔RU). Includes a smoke-test suite (18 cases) and quality evals (qmd bench).

Cognitive Toolkit (CBT/DBT) — evidence-based interventions: guided thought records, opposite action, DEAR MAN roleplay, crisis skills with HRV biofeedback. Configurable therapeutic pushback. Standalone or via Telegram.

Present — interactive HTML presentations with ElevenLabs voiceover narration synced to slides. Dual article/slides mode, scroll-reveal animations, optional GPT Image 2 illustrations, Tufte-inspired typography (EB Garamond + DM Sans).

GPT Image 2 — generate and edit images using OpenAI's GPT Image 2 model. 14 style presets, thinking mode (off/low/medium/high) for complex compositions, 8 platform presets.

## Install

    git clone https://github.com/glebis/claude-skills.git
    cp -r claude-skills/release ~/.claude/skills/
    cp -r claude-skills/synthetic-session-generator ~/.claude/skills/
    # copy whichever skills you need

For qmd-search, install qmd first:

    bun install -g @tobilu/qmd

## When to use

Use the release skill for any project that needs structured version bumping with tiered compatibility tracking. Use synthetic-session-generator for evaluation datasets or training data that requires domain-grounded fictional transcripts. Use qmd-search when you need semantic search across a local Obsidian vault without sending data to an external service.`,
      },
    ],
    repoUrl: 'https://github.com/glebis/claude-skills',
    githubStars: 200,
    capabilities: [
      {
        command: '/release minor',
        description: 'Cut a software release: bump version files, draft changelog from conventional commits, update COMPATIBILITY.md tiers, tag, and report closed issues.',
      },
      {
        command: '/synthetic-session-generator',
        description: 'Generate a persona-consistent synthetic coaching or therapy transcript in one of four therapeutic modalities (ICF/GROW, CBT, IFS, ACT/MI).',
      },
      {
        command: 'qmd-search (5 modes)',
        description: 'Semantically search a local Obsidian vault using BM25, vector, hybrid, grep, or fused mode — with cross-lingual EN↔RU retrieval.',
      },
      {
        command: '/present',
        description: 'Generate an interactive HTML presentation with ElevenLabs voiceover narration synced to slides, optional GPT Image 2 illustrations, and Tufte typography.',
      },
    ],
  },
];
