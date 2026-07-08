import type { Setup } from '@/lib/setup/types';

const CREATED_AT = '2026-07-05T00:00:00.000Z';

export const githubPicks: Setup[] = [
  // ── Skills (5) ──────────────────────────────────────────────────────────────

  {
    kind: 'skill',
    id: 'github-superpowers-v1',
    slug: 'github-superpowers',
    name: 'Superpowers Skills',
    tagline: 'Canonical agentic-skills framework: installable SKILL.md workflows for the full SDLC.',
    description:
      'A complete software development methodology by Jesse Vincent (Prime Radiant). ' +
      'Installs 13+ composable skills, brainstorming, writing-plans, TDD, systematic-debugging, ' +
      'code-review, and subagent-driven-development, that activate automatically at the right ' +
      'phase so the agent stays on track through the full development lifecycle.',
    role: 'general',
    industry: null,
    tags: ['skills', 'sdlc', 'claude-code', 'workflows', 'engineering'],
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

Superpowers is a complete software development methodology built on composable SKILL.md files. When you start a coding session the agent does not jump straight into writing code, it steps back, asks what you are really trying to build, teases out a spec, shows it to you in digestible sections, and only starts after you sign off. From there it runs a subagent-driven loop where fresh agents work through each task with two-stage review (spec compliance then code quality) and can run autonomously for hours without drifting from the plan.

The skills activate automatically, you do not invoke them by name. The agent checks for relevant skills before any task.

## Key skills

- **brainstorming**, Socratic design refinement; saves a design doc and feeds it into downstream skills.
- **using-git-worktrees**, Creates an isolated branch and verifies a clean test baseline before touching code.
- **writing-plans**, Breaks the approved design into bite-sized tasks (2–5 minutes each) with exact file paths and verification steps.
- **subagent-driven-development**, Dispatches a fresh agent per task with spec-compliance then code-quality review; can run multi-hour autonomous sessions.
- **test-driven-development**, Enforces RED-GREEN-REFACTOR: write the failing test, watch it fail, write minimal code, watch it pass, commit.
- **systematic-debugging**, Four-phase root-cause process before any fix attempt.
- **finishing-a-development-branch**, Verifies tests, presents merge/PR/keep/discard options, cleans the worktree.

## Install

**Claude Code (official marketplace):**

\`\`\`
/plugin install superpowers@claude-plugins-official
\`\`\`

**Superpowers marketplace:**

\`\`\`
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
\`\`\`

Also available for Cursor, Codex App, Codex CLI, Antigravity, Factory Droid, GitHub Copilot CLI, Kimi Code, OpenCode, and Pi.

## When to use

Any project where you want the agent to plan before it codes, run true TDD, and complete work without constant hand-holding. Especially useful for multi-hour autonomous sessions where you cannot watch every step.`,
      },
    ],
    repoUrl: 'https://github.com/obra/superpowers',
    githubStars: 246793,
    capabilities: [
      {
        command: '/plugin install superpowers@claude-plugins-official',
        description: 'Install Superpowers from the official Claude plugin marketplace.',
      },
      {
        command: 'brainstorming skill',
        description: 'Auto-activates before coding to refine ideas through questions, explore alternatives, and save a design doc.',
      },
      {
        command: 'subagent-driven-development skill',
        description: 'Dispatches a fresh subagent per task with two-stage review (spec compliance then code quality).',
      },
      {
        command: 'test-driven-development skill',
        description: 'Enforces RED-GREEN-REFACTOR on every implementation task, write failing test first, then minimal code.',
      },
      {
        command: 'systematic-debugging skill',
        description: 'Four-phase root-cause debugging process that runs before any fix attempt.',
      },
      {
        command: 'finishing-a-development-branch skill',
        description: 'Verifies tests pass, presents merge/PR/keep/discard options, and cleans the worktree.',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-karpathy-skills-v1',
    slug: 'github-karpathy-skills',
    name: 'Karpathy LLM-Coding Skills',
    tagline: 'Behavioral guardrails distilled from Karpathy\'s LLM-coding pitfalls.',
    description:
      'A single CLAUDE.md encoding four principles from Andrej Karpathy\'s public writing: ' +
      'Think Before Coding (surface assumptions and tradeoffs), Simplicity First (minimum code, nothing speculative), ' +
      'Surgical Changes (touch only what the task requires), and Goal-Driven Execution (define success criteria and ' +
      'loop until verified). Installable as a Claude Code plugin or per-project CLAUDE.md.',
    role: 'general',
    industry: null,
    tags: ['skills', 'guardrails', 'llm-coding', 'best-practices'],
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

A single CLAUDE.md file encoding four behavioral guardrails derived from Andrej Karpathy's public writing about LLM-coding failure modes. The four principles address the problems he identified directly:

**Think Before Coding**, The model must state its assumptions explicitly, present multiple interpretations when ambiguous, push back if a simpler approach exists, and stop rather than guess when confused.

**Simplicity First**, Minimum code that solves the problem. No features beyond what was asked, no abstractions for single-use code, no speculative error handling, no "flexibility" that wasn't requested. If 200 lines could be 50, rewrite it.

**Surgical Changes**, Touch only what the task requires. Do not improve adjacent code, comments, or formatting. Match existing style even if you'd do it differently. Every changed line must trace directly to the user's request.

**Goal-Driven Execution**, Transform imperative instructions into verifiable goals. Instead of "add validation," write a test for invalid inputs then make it pass. For multi-step tasks, state a plan with a verification check for each step so the model can loop independently.

From Karpathy: "LLMs are exceptionally good at looping until they meet specific goals. Don't tell it what to do, give it success criteria and watch it go."

## Install

**Plugin (recommended, works across all projects):**

\`\`\`
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills
\`\`\`

**Per-project CLAUDE.md (new project):**

\`\`\`bash
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md
\`\`\`

**Per-project CLAUDE.md (append to existing):**

\`\`\`bash
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md >> CLAUDE.md
\`\`\`

Also includes a Cursor rule at .cursor/rules/karpathy-guidelines.mdc for use in Cursor.

## When to use

Any project where you find Claude over-complicating code, making silent assumptions, touching unrelated files, or producing changes that need constant correction. These guardrails bias toward caution over speed, appropriate for non-trivial work, not every single-line fix.`,
      },
    ],
    repoUrl: 'https://github.com/multica-ai/andrej-karpathy-skills',
    githubStars: 187979,
    capabilities: [
      {
        command: '/plugin marketplace add forrestchang/andrej-karpathy-skills',
        description: 'Register the Karpathy skills marketplace in Claude Code.',
      },
      {
        command: '/plugin install andrej-karpathy-skills@karpathy-skills',
        description: 'Install the Karpathy guardrail CLAUDE.md as a plugin that applies across all projects.',
      },
      {
        command: 'Think Before Coding principle',
        description: 'Forces the model to state assumptions explicitly, present multiple interpretations, and stop rather than guess.',
      },
      {
        command: 'Simplicity First principle',
        description: 'Minimum code that solves the problem, no speculative features, abstractions, or over-engineering.',
      },
      {
        command: 'Surgical Changes principle',
        description: 'Every changed line traces to the user request; no drive-by improvements to adjacent code.',
      },
      {
        command: 'Goal-Driven Execution principle',
        description: 'Transform tasks into verifiable goals with test-first success criteria so the model can loop independently.',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-anthropic-skills-v1',
    slug: 'github-anthropic-skills',
    name: 'Anthropic Official Skills',
    tagline: 'Anthropic\'s official Agent Skills repository.',
    description:
      'The official skills collection maintained by Anthropic. Includes document-processing skills ' +
      'for PDF, DOCX, PPTX, and XLSX files (source-available, used in production by Claude.ai), ' +
      'plus example skills across creative, technical, and enterprise domains. Installable as ' +
      'Claude Code plugins or usable directly via the Claude.ai web interface and Claude API.',
    role: 'general',
    industry: null,
    tags: ['skills', 'anthropic', 'official', 'agents', 'reference'],
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

The official skills collection maintained by Anthropic. Skills are folders containing a SKILL.md with YAML frontmatter and instructions that Claude loads dynamically for specialized tasks. This repository serves two purposes: reference implementations showing proven skill patterns, and the actual document-processing skills that power Claude.ai's built-in document capabilities.

**Document skills (source-available):** The skills/docx, skills/pdf, skills/pptx, and skills/xlsx folders contain the production implementations used by Claude.ai's document creation feature. These handle real format-specific operations, extracting structured content from PDFs, working with Word documents, building PowerPoint presentations, and reading Excel data. Source-available means you can read and learn from them but they are not Apache 2.0.

**Example skills (open source, Apache 2.0):** Cover creative applications (art, music, design), technical tasks (web app testing, MCP server generation), and enterprise workflows (communications, branding). Intended as inspiration and starting points for your own skills.

## Install

**Register the marketplace and install skill bundles via Claude Code:**

\`\`\`
/plugin marketplace add anthropics/skills
\`\`\`

Then browse and install:

\`\`\`
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills
\`\`\`

**Claude.ai:** Document skills are available to paid plans directly, no installation needed. To use skills from this repo or upload custom skills, follow the Claude.ai skills setup guide.

**Claude API:** Use Anthropic's pre-built skills or upload custom skills via the Skills API. See the Skills API Quickstart for the creating-a-skill flow.

## When to use

- You need to extract structured content from PDFs, Word docs, PowerPoints, or Excel files without writing parsing code.
- You want a reference for how Anthropic structures production-quality SKILL.md files.
- You are building custom skills and want validated patterns to follow.`,
      },
    ],
    repoUrl: 'https://github.com/anthropics/skills',
    githubStars: 158412,
    capabilities: [
      {
        command: '/plugin marketplace add anthropics/skills',
        description: 'Register the Anthropic skills marketplace in Claude Code.',
      },
      {
        command: '/plugin install document-skills@anthropic-agent-skills',
        description: 'Install the document-processing skill set (PDF, DOCX, PPTX, XLSX) used in production by Claude.ai.',
      },
      {
        command: '/plugin install example-skills@anthropic-agent-skills',
        description: 'Install the open-source example skills covering creative, technical, and enterprise domains.',
      },
      {
        command: 'PDF skill',
        description: 'Extract structured content from PDF files, sections, headings, tables, and body text.',
      },
      {
        command: 'DOCX skill',
        description: 'Read and create Word documents with formatting, styles, and structured content.',
      },
      {
        command: 'XLSX skill',
        description: 'Read and write Excel spreadsheets, work with formulas, and process tabular data.',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-planning-with-files-v1',
    slug: 'github-planning-with-files',
    name: 'Planning With Files',
    tagline: 'Persistent file-based planning and a completion gate for long-running agents.',
    description:
      'A skill that encodes the Manus AI context-engineering pattern: write task_plan.md, ' +
      'findings.md, and progress.md to disk so the agent survives context resets and crashes. ' +
      'Hooks re-inject the plan before each tool call. A completion gate prevents the agent from ' +
      'stopping until all phases are checked off. Supports 18+ platforms via the Agent Skills standard.',
    role: 'general',
    industry: null,
    tags: ['skills', 'planning', 'persistence', 'long-running-agents'],
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

Planning With Files encodes the context-engineering pattern that made Manus AI worth $2B: treat the filesystem as working memory rather than stuffing everything into the context window.

For every complex task the agent creates three files:

- **task_plan.md**, Phases with checkboxes, dependencies, and acceptance criteria.
- **findings.md**, Research, discoveries, and reusable knowledge accumulated during the task.
- **progress.md**, Session log, test results, and error history so the same mistake is never repeated.

Lifecycle hooks re-inject the active plan at the start of each turn (UserPromptSubmit), remind the agent to update progress after file writes (PostToolUse), and verify completion before the agent stops (Stop hook). If the session is interrupted or context is cleared, the agent reads the plan files from disk and recovers its state automatically.

**Benchmark (v2.21.0, claude-sonnet-4-6):** 96.7% pass rate on 30 file-pattern fidelity assertions vs 6.7% without the skill. Blind A/B wins: 3/3. Competitive benchmark: 2.7x faster recovery than 6 other planning methods.

## Install

**One-line install (works on Claude Code, Cursor, Codex, Gemini CLI, and 18+ platforms):**

\`\`\`bash
npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g
\`\`\`

**Claude Code plugin (adds /plan and /plan:status slash commands):**

\`\`\`
/plugin marketplace add OthmanAdi/planning-with-files
/plugin install planning-with-files@planning-with-files
\`\`\`

## Key slash commands (after plugin install)

| Command | Description |
|---------|-------------|
| /planning-with-files:plan | Start a planning session, creates task_plan.md, findings.md, and progress.md |
| /planning-with-files:status | Show current planning progress at a glance |
| /plan-attest | Lock task_plan.md with a SHA-256; hooks block injection on tampering |

## When to use

Multi-step tasks (3+ steps), research tasks, building/creating projects, or any task spanning many tool calls. Skip for simple questions, single-file edits, and quick lookups.`,
      },
    ],
    repoUrl: 'https://github.com/OthmanAdi/planning-with-files',
    githubStars: 24649,
    capabilities: [
      {
        command: 'npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g',
        description: 'Install the skill globally via npx, works across Claude Code, Cursor, Codex, Gemini CLI, and 18+ other platforms.',
      },
      {
        command: '/planning-with-files:plan',
        description: 'Start a planning session: creates task_plan.md, findings.md, and progress.md in the project directory.',
      },
      {
        command: '/planning-with-files:status',
        description: 'Show current planning progress, phases complete, phases remaining, and active plan file.',
      },
      {
        command: '/plan-attest',
        description: 'Lock the active task_plan.md with a SHA-256 attestation; hooks reject injection if the file is tampered.',
      },
      {
        command: 'PreToolUse hook (plan injection)',
        description: 'Re-injects the active plan before each tool call so the agent never loses its goal context mid-task.',
      },
      {
        command: 'Stop hook (completion gate)',
        description: 'Blocks the agent from stopping until all phases in task_plan.md are checked off.',
      },
    ],
  },

  {
    kind: 'skill',
    id: 'github-alireza-claude-skills-v1',
    slug: 'github-alireza-claude-skills',
    name: 'Alireza Claude Skills',
    tagline: 'Large multi-platform pack of skills, agents, and commands.',
    description:
      '355 production-ready Claude Code skills, 99 agents, 7 personas, and 109 slash commands ' +
      'across 18 domains, engineering, DevOps, marketing, compliance, C-level advisory, ' +
      'academic research, and more. Works natively on Claude Code, Codex, Gemini CLI, Cursor, ' +
      'and 9 other platforms. Ships with 602 stdlib-only Python CLI tools.',
    role: 'general',
    industry: null,
    tags: ['skills', 'agents', 'commands', 'multi-platform', 'collection'],
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

355 production-ready skills across 18 domains, 99 subagents, 7 cross-domain personas, 109 slash commands, and 602 stdlib-only Python CLI tools, the most comprehensive open-source Claude Code skills library. Works natively on 13 platforms including Claude Code, OpenAI Codex, Gemini CLI, OpenClaw, Hermes Agent, Mistral Vibe, Cursor, Aider, Windsurf, Kilo Code, OpenCode, Augment, and Antigravity.

**Domain highlights:**

- **Engineering, Core (52 skills):** Architecture, frontend, backend, fullstack, QA, DevOps, SecOps, AI/ML, Playwright Pro, self-improving agent, security suite, a11y audit.
- **Engineering, POWERFUL (81 skills):** Agent designer, RAG architect, MCP builder, zero-hallucination-coder, agent-harness, Kubernetes, Terraform, ship-gate, CI/CD builder.
- **C-Level Advisory (68 skills):** Full C-suite (CEO/CTO/CFO/CMO/CRO/CPO/COO/CHRO/CISO/GC/CDO/CAIO/CCO/VPE) + 21 /cs:* slash commands.
- **Marketing (48 skills):** Content, SEO + AEO (citation tracking across 5 LLMs), CRO, Growth, Intelligence, Sales.
- **Academic Research (9 skills):** litreview, grants, patent, syllabus, notebooklm, deep-research.
- **Regulatory & QM (19 skills):** ISO 13505, MDR 2017/745, FDA, ISO 27001, GDPR, SOC 2, CAPA.

## Install

**Claude Code (install by domain):**

\`\`\`
/plugin marketplace add alirezarezvani/claude-skills

/plugin install engineering-skills@claude-code-skills
/plugin install engineering-advanced-skills@claude-code-skills
/plugin install c-level-skills@claude-code-skills
/plugin install marketing-skills@claude-code-skills
\`\`\`

**Convert to other tools:**

\`\`\`bash
git clone https://github.com/alirezarezvani/claude-skills.git
cd claude-skills
./scripts/convert.sh --tool all          # convert all 345 skills to 9 tools
./scripts/install.sh --tool cursor --target /path/to/project
\`\`\`

**Gemini CLI:**

\`\`\`bash
git clone https://github.com/alirezarezvani/claude-skills.git
cd claude-skills && ./scripts/gemini-install.sh
\`\`\`

## When to use

When you need specialized domain expertise, from ISO compliance to C-suite advisory to SEO/AEO, without building skills from scratch. Install only the domain folders you need; nothing is mandatory.`,
      },
    ],
    repoUrl: 'https://github.com/alirezarezvani/claude-skills',
    githubStars: 20465,
    capabilities: [
      {
        command: '/plugin marketplace add alirezarezvani/claude-skills',
        description: 'Register the claude-skills marketplace in Claude Code to enable domain-specific plugin installs.',
      },
      {
        command: '/plugin install engineering-advanced-skills@claude-code-skills',
        description: 'Install 81 POWERFUL-tier engineering skills including agent-designer, RAG-architect, MCP-builder, and zero-hallucination-coder.',
      },
      {
        command: '/plugin install c-level-skills@claude-code-skills',
        description: 'Install 68 C-suite advisory skills covering CEO, CTO, CFO, CMO, CISO, and 9 other executive personas with 21 /cs:* commands.',
      },
      {
        command: 'skill-security-auditor',
        description: 'Scan any skill for command injection, code execution, data exfiltration, and prompt injection risks before installation.',
      },
      {
        command: './scripts/convert.sh --tool all',
        description: 'Convert all 355 skills to native formats for Cursor, Aider, Kilo Code, Windsurf, OpenCode, Augment, Hermes, and Mistral Vibe.',
      },
      {
        command: 'Python CLI tools',
        description: '602 stdlib-only Python scripts (zero pip installs) for SaaS metrics, tech debt scoring, RICE prioritization, brand voice analysis, and more.',
      },
    ],
  },

  // ── Agents (7) ──────────────────────────────────────────────────────────────

  {
    kind: 'agent',
    id: 'github-wshobson-agents-v1',
    slug: 'github-wshobson-agents',
    name: 'wshobson Agents',
    tagline: 'Specialized subagents packaged as Claude Code plugins.',
    description:
      'An agentic plugin marketplace with 90 plugins, 199 agents, 161 skills, 106 commands, ' +
      'and 16 multi-agent orchestrators. Single Markdown source builds to five harnesses: ' +
      'Claude Code, Codex CLI, Cursor, OpenCode, and Gemini CLI. Includes a tiered model ' +
      'strategy (Fable/Opus/Sonnet/Haiku) and a three-layer plugin-eval quality framework.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'plugins', 'claude-code', 'engineering'],
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

An agentic plugin marketplace with 90 plugins, 199 agents, 161 skills, 106 commands, and 16 orchestrators, all from a single Markdown source that builds to five harnesses natively. Installing a plugin loads only its components into context, not the entire marketplace.

**What each plugin contains:**

Each plugin is a directory with a plugin.json manifest, agents/, commands/, and skills/ subdirectories. Example: the python-development plugin ships 3 Python agents (python-pro, django-pro, fastapi-pro), 1 scaffolding command, and 16 specialized skills covering async, testing, packaging, and more.

**Tiered model strategy:** Each agent specifies a model in frontmatter. Fable 5 for longest-horizon autonomous work, Opus for architecture/security/code review, Sonnet for everyday coding, Haiku for fast operational tasks like SEO and deployment.

**Multi-harness support:** Claude Code is the source of truth. Codex and Cursor install from committed registries. Gemini and OpenCode install via clone + make generate. A \`make generate-all\` command builds all five harnesses from the single Markdown source.

**Plugin eval framework:** Three-layer evaluation, static structural analysis (<2s), LLM Judge across 4 dimensions (~30s), and Monte Carlo reliability via 50–100 simulated runs (~2–5 min). Run \`uv run plugin-eval certify path/to/skill\` to certify a plugin.

## Install

**Claude Code:**

\`\`\`
/plugin marketplace add wshobson/agents
/plugin install python-development
/plugin install security-scanning
/plugin install ml-engineering
\`\`\`

**Codex CLI:**

\`\`\`bash
npx codex-marketplace add wshobson/agents
\`\`\`

**Gemini / OpenCode (via clone):**

\`\`\`bash
gh repo clone wshobson/agents ~/agents && cd ~/agents
make generate HARNESS=gemini && gemini extensions install .
\`\`\`

## When to use

When you want composable, independently installable agents with a proven quality-eval pipeline and a model routing strategy already baked in. Install only the domain plugins you need.`,
      },
    ],
    repoUrl: 'https://github.com/wshobson/agents',
    githubStars: 37547,
    capabilities: [
      {
        command: '/plugin marketplace add wshobson/agents',
        description: 'Register the wshobson plugin marketplace in Claude Code.',
      },
      {
        command: '/plugin install python-development',
        description: 'Install the python-development plugin (3 agents: python-pro, django-pro, fastapi-pro; 16 skills; 1 command).',
      },
      {
        command: 'make generate-all',
        description: 'Build all five harness-native artifact sets (Claude Code, Codex, Cursor, OpenCode, Gemini) from the single Markdown source.',
      },
      {
        command: 'uv run plugin-eval certify path/to/skill',
        description: 'Run the three-layer evaluation (static + LLM judge + Monte Carlo) to certify a plugin for quality.',
      },
      {
        command: 'orchestrator plugins (16)',
        description: 'Multi-agent coordination workflows for full-stack, security, ML, and incident response scenarios.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-voltagent-subagents-v1',
    slug: 'github-voltagent-subagents',
    name: 'VoltAgent 154+ Subagents',
    tagline: '154+ installable subagents across ten categories.',
    description:
      'A curated collection of 154+ Claude Code subagents organized across ten categories: ' +
      'core development, language specialists (30+ frameworks), infrastructure, quality & security, ' +
      'data & AI, developer experience, specialized domains, business & product, meta-orchestration, ' +
      'and research & analysis. Each agent is independently installable as a Claude Code plugin.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'collection', 'claude-code', 'multi-category'],
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

154+ Claude Code subagents organized across ten categories. Each agent is a standalone markdown file you copy to ~/.claude/agents/ and it is immediately available in every session. Smart model routing is built into each agent's frontmatter: Opus for deep reasoning (security-auditor, architect-reviewer, fintech-engineer), Sonnet for everyday coding (python-pro, backend-developer), Haiku for fast operational tasks (documentation-engineer, seo-specialist).

**Category overview:**

- **Core Development (11):** api-designer, backend-developer, frontend-developer, fullstack-developer, graphql-architect, microservices-architect, mobile-developer, ui-designer, websocket-engineer, electron-pro, design-bridge.
- **Language Specialists (30+):** typescript-pro, react-specialist, nextjs-developer, vue-expert, angular-architect, python-pro, golang-pro, rust-engineer, java-architect, swift-expert, rails-expert, django-developer, fastapi-developer, laravel-specialist, symfony-specialist, kotlin-specialist, flutter-expert, expo-react-native-expert, spring-boot-engineer, and more.
- **Infrastructure (16):** cloud-architect, devops-engineer, kubernetes-specialist, terraform-engineer, docker-expert, sre-engineer, security-engineer, azure-infra-engineer, terragrunt-expert, windows-infra-admin.
- **Quality & Security (17):** security-auditor, penetration-tester, code-reviewer, architect-reviewer, qa-expert, accessibility-tester, ai-writing-auditor, gdpr-ccpa-compliance, performance-engineer.
- **Meta & Orchestration:** agent-installer, multi-agent-coordinator, workflow-orchestrator, codebase-orchestrator, context-manager.

## Install

**Claude Code plugin (by category):**

\`\`\`
claude plugin marketplace add VoltAgent/awesome-claude-code-subagents
claude plugin install voltagent-lang        # Language specialists
claude plugin install voltagent-infra       # Infrastructure & DevOps
claude plugin install voltagent-qa-sec      # Quality & Security
claude plugin install voltagent-core-dev    # Core Development
\`\`\`

**Interactive installer (no clone required):**

\`\`\`bash
curl -sO https://raw.githubusercontent.com/VoltAgent/awesome-claude-code-subagents/main/install-agents.sh
chmod +x install-agents.sh && ./install-agents.sh
\`\`\`

## When to use

When you want a large catalog of purpose-built specialists with smart model routing already configured. Install by category to avoid loading the entire collection.`,
      },
    ],
    repoUrl: 'https://github.com/VoltAgent/awesome-claude-code-subagents',
    githubStars: 22908,
    capabilities: [
      {
        command: 'claude plugin install voltagent-lang',
        description: 'Install 30+ language specialist agents (TypeScript, React, Next.js, Python, Go, Rust, Rails, Django, etc.).',
      },
      {
        command: 'claude plugin install voltagent-qa-sec',
        description: 'Install quality and security agents including security-auditor, penetration-tester, code-reviewer, and accessibility-tester.',
      },
      {
        command: '@security-auditor',
        description: 'Invoke the security auditor subagent (runs on Opus) to review code for vulnerabilities with severity ratings and remediation steps.',
      },
      {
        command: '@react-specialist',
        description: 'Invoke the React 18+ specialist for modern hooks, state management, and performance optimization patterns.',
      },
      {
        command: '/subagent-catalog:search <query>',
        description: 'Search the catalog by name, description, or category to find the right agent for your task.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-contains-studio-agents-v1',
    slug: 'github-contains-studio-agents',
    name: 'contains.studio Agents',
    tagline: 'The subagents contains.studio uses in production.',
    description:
      'Production subagents from contains.studio\'s internal engineering setup, covering ' +
      'their full development workflow: rapid-prototyper, frontend-developer, backend-architect, ' +
      'ai-engineer, devops-automator, test-writer-fixer, trend-researcher, sprint-prioritizer, ' +
      'brand-guardian, whimsy-injector, and more, organized across engineering, design, product, ' +
      'marketing, and operations departments.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'production', 'engineering', 'real-world'],
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

Production subagents from contains.studio shared directly from their internal engineering setup. The studio operates on 6-day sprints and these agents encode the workflows their team runs repeatedly at speed.

**Directory structure by department:**

- **engineering/**, ai-engineer, backend-architect, devops-automator, frontend-developer, mobile-app-builder, rapid-prototyper, test-writer-fixer.
- **product/**, feedback-synthesizer (transforms complaints into features), sprint-prioritizer (ship max value in 6 days), trend-researcher (identify viral opportunities).
- **marketing/**, app-store-optimizer, content-creator, growth-hacker, instagram-curator, reddit-community-builder, tiktok-strategist, twitter-engager.
- **design/**, brand-guardian, ui-designer, ux-researcher, visual-storyteller, whimsy-injector (adds delight to every interaction).
- **project-management/**, experiment-tracker, project-shipper, studio-producer.
- **studio-operations/**, analytics-reporter, finance-tracker, infrastructure-maintainer, legal-compliance-checker, support-responder.
- **testing/**, api-tester, performance-benchmarker, test-results-analyzer, tool-evaluator, workflow-optimizer.

Four proactive agents trigger automatically in specific contexts: studio-coach (when complex multi-agent tasks begin), test-writer-fixer (after any code change), whimsy-injector (after UI/UX changes), and experiment-tracker (when feature flags are added).

## Install

\`\`\`bash
git clone https://github.com/contains-studio/agents.git
cp -r agents/* ~/.claude/agents/
\`\`\`

Restart Claude Code to load the agents.

## When to use

When you want a complete agency-style agent team organized by function, not just engineering specialists. The 6-day sprint philosophy is baked into every agent's system prompt: ship maximum value quickly, not perfectly.`,
      },
    ],
    repoUrl: 'https://github.com/contains-studio/agents',
    githubStars: 12399,
    capabilities: [
      {
        command: 'rapid-prototyper',
        description: 'Build MVPs in days, not weeks, optimized for the 6-day sprint philosophy.',
      },
      {
        command: 'test-writer-fixer',
        description: 'Auto-triggered after implementing features, fixing bugs, or modifying code to write tests that catch real bugs.',
      },
      {
        command: 'whimsy-injector',
        description: 'Auto-triggered after UI/UX changes to add delight and micro-interactions to every user-facing surface.',
      },
      {
        command: 'trend-researcher',
        description: 'Identifies viral opportunities worth building, surfaces what is trending that your team could ship.',
      },
      {
        command: 'feedback-synthesizer',
        description: 'Transforms user complaints, reviews, and support tickets into prioritized feature opportunities.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-vijay-agents-v1',
    slug: 'github-vijay-agents',
    name: 'Awesome Claude Agents (vijaythecoder)',
    tagline: 'An orchestrated sub-agent development team.',
    description:
      '24 specialized Claude subagents that function as a development team: a tech-lead-orchestrator ' +
      'breaks down requests and routes to framework specialists (Laravel, Django, Rails, React, Vue, ' +
      'Next.js), universal experts, a code-archaeologist, code-reviewer, and performance-optimizer. ' +
      'Auto-configured for your stack via the team-configurator agent.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'orchestration', 'dev-team', 'multi-agent'],
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

24 specialized Claude subagents that function as a complete AI development team. The tech-lead-orchestrator at the top analyzes your request, detects your technology stack, selects the right specialists, and coordinates their output.

**Team structure:**

- **Orchestrators (3):** tech-lead-orchestrator (senior technical lead), project-analyst (stack detection), team-configurator (CLAUDE.md auto-setup).
- **Framework Specialists (13):** Laravel (backend-expert, eloquent-expert), Django (backend-expert, api-developer, orm-expert), Rails (backend-expert, api-developer, activerecord-expert), React (component-architect, nextjs-expert), Vue (component-architect, nuxt-expert, state-manager).
- **Universal Experts (4):** backend-developer, frontend-developer, api-architect, tailwind-css-expert.
- **Core Team (4):** code-archaeologist (explores unfamiliar codebases), code-reviewer (security-aware severity-tagged reports), performance-optimizer, documentation-specialist.

**Auto-configuration workflow:** Run \`claude "use @agent-team-configurator and optimize my project"\`, the configurator inspects your package.json, composer.json, requirements.txt, go.mod, and Gemfile, then writes a timestamped CLAUDE.md section with a Task/Agent/Notes mapping table.

## Install

\`\`\`bash
git clone https://github.com/vijaythecoder/awesome-claude-agents.git
mkdir -p ~/.claude/agents
# Option A: symlink (auto-updates)
ln -sf "$(pwd)/awesome-claude-agents/agents/" ~/.claude/agents/awesome-claude-agents
# Option B: copy (static)
cp -r awesome-claude-agents/agents ~/.claude/agents/awesome-claude-agents
\`\`\`

Verify: run \`claude /agents\`, should show all 24 agents.

## When to use

Projects using specific frameworks where a specialist agent outperforms a generalist, or when you want the team-configurator to automatically wire the right agents to your stack.`,
      },
    ],
    repoUrl: 'https://github.com/vijaythecoder/awesome-claude-agents',
    githubStars: 4329,
    capabilities: [
      {
        command: '@agent-tech-lead-orchestrator',
        description: 'Break down a feature request, detect your stack, select specialists, and coordinate implementation with a tech-lead mindset.',
      },
      {
        command: '@agent-team-configurator',
        description: 'Detect your tech stack and write a CLAUDE.md Task/Agent/Notes mapping table so the right agents are used automatically.',
      },
      {
        command: '@agent-code-archaeologist',
        description: 'Explore, document, and build a mental model of an unfamiliar or legacy codebase.',
      },
      {
        command: '@agent-code-reviewer',
        description: 'Security-aware code review with findings tagged by severity (critical/high/medium/low) and file/line references.',
      },
      {
        command: 'Framework specialists (13)',
        description: 'Dedicated experts for Laravel, Django, Rails, React/Next.js, and Vue/Nuxt, each with deep current framework knowledge.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-lst97-subagents-v1',
    slug: 'github-lst97-subagents',
    name: 'lst97 Full-stack Subagents',
    tagline: 'Full-stack development subagents for Claude Code.',
    description:
      '33 Claude Code subagents organized across Development, Infrastructure, Quality & Testing, ' +
      'Data & AI, Security, Specialization, and Business, plus an agent-organizer master orchestrator. ' +
      'Includes language specialists (Python, Go, TypeScript, React, Next.js), cloud/DevOps, ' +
      'database optimization, LLM/RAG engineering, and a security auditor.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'full-stack', 'claude-code', 'web-development'],
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

33 Claude Code subagents organized into logical categories covering the full software development lifecycle, plus an agent-organizer that orchestrates them for complex multi-step projects.

**Development (18 agents):** frontend-developer, ui-designer, ux-designer, react-pro, nextjs-pro, backend-architect, full-stack-developer, python-pro, golang-pro, typescript-pro, mobile-developer, electron-pro, dx-optimizer, legacy-modernizer.

**Infrastructure (5 agents):** cloud-architect, deployment-engineer, devops-incident-responder, incident-responder, performance-engineer.

**Quality & Testing (5 agents):** code-reviewer, architect-reviewer, qa-expert, test-automator, debugger.

**Data & AI (8 agents):** data-engineer, data-scientist, database-optimizer, postgres-pro, graphql-architect, ai-engineer, ml-engineer, prompt-engineer.

**Security (1 agent):** security-auditor (OWASP compliance, vulnerability detection).

**Specialization (2 agents):** api-documenter (OpenAPI/Swagger), documentation-expert.

**Business (1 agent):** product-manager (roadmap planning, stakeholder alignment).

**Meta-Orchestration:** agent-organizer, analyzes project requirements, detects technology stack, assembles an optimal 1–3 agent team, manages multi-phase collaboration with quality gates and validation checkpoints.

Common orchestration patterns: \`architect → implement → test → review\` for features; \`debugger → specialist → validator\` for bugs; \`performance-engineer + database-optimizer → validation\` for optimization.

## Install

\`\`\`bash
mkdir -p ~/.claude/agents/lst97
cp /path/to/repo/agents/*.md ~/.claude/agents/lst97
\`\`\`

Or clone to Claude's directory directly:

\`\`\`bash
cd ~/.claude
git clone https://github.com/lst97/claude-code-sub-agents.git
\`\`\`

Verify: "List all available subagents" in Claude Code, look for lst97/* entries.

## When to use

Complex multi-step projects where you want intelligent agent routing (auto-delegation based on context keywords) and a master orchestrator to coordinate specialists without manually managing handoffs.`,
      },
    ],
    repoUrl: 'https://github.com/lst97/claude-code-sub-agents',
    githubStars: 1606,
    capabilities: [
      {
        command: 'agent-organizer',
        description: 'Master orchestrator: detects stack, assembles an optimal 1–3 agent team, and manages multi-phase collaboration with quality gates.',
      },
      {
        command: 'backend-architect',
        description: 'Design RESTful APIs, microservice boundaries, and database schemas.',
      },
      {
        command: 'database-optimizer',
        description: 'Optimize SQL queries, design efficient indexes, and plan database migrations.',
      },
      {
        command: 'security-auditor',
        description: 'Review code for vulnerabilities and ensure OWASP compliance.',
      },
      {
        command: 'ai-engineer',
        description: 'Build LLM applications, RAG systems, and prompt pipelines.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-pentest-agents-v1',
    slug: 'github-pentest-agents',
    name: 'Pentest AI Agents',
    tagline: 'Offensive-security / pentest subagents.',
    description:
      '50 Claude Code subagents for authorized penetration testing, organized across recon, ' +
      'web, Active Directory, cloud, mobile, wireless, C2 operations, payload crafting, ' +
      'reverse engineering, forensics, and reporting. Tier 1 agents are advisory (you run the ' +
      'tools); Tier 2 agents can execute tools directly against declared in-scope targets. ' +
      'For authorized security testing only.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'security', 'pentest', 'offensive-security'],
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

50 Claude Code subagents for authorized penetration testing. Each agent carries deep domain knowledge in a specific area. Claude routes to the right specialist automatically based on your task description, no explicit invocation needed.

**Offensive operations (38 agents):** engagement-planner, recon-advisor, osint-collector, web-hunter, api-security, ad-attacker, cloud-security, mobile-pentester, wireless-pentester, social-engineer, phishing-operator, c2-operator, payload-crafter, reverse-engineer, exploit-chainer, attack-planner, poc-validator, llm-redteam, ai-recon, container-breakout, opsec-anonymizer, lateral-movement, persistence-planner, evasion-specialist, data-exfiltrator, scada-attacker, iot-pentester, credential-tester, password-auditor, database-attacker, network-attacker, traffic-analyzer, business-logic-hunter, cicd-redteam, bug-bounty, ctf-solver, vulnerability-scanner, swarm-orchestrator.

**Defense and analysis (8 agents):** detection-engineer (Sigma/Splunk/Elastic/Sentinel rules), threat-modeler (STRIDE/DREAD), forensics-analyst, malware-analyst, stig-analyst, code-auditor (Semgrep/CodeQL/gitleaks), crypto-analyzer, traffic-analyzer.

**Reporting (4 agents):** report-generator (CVSS scoring, remediation roadmaps), compliance-mapper (PCI/NIST/ISO/CIS), risk-scorer (CVSS 3.1/4.0 + EPSS + CISA KEV), engagement-planner.

**Tier 1 vs Tier 2:** All agents provide advisory guidance (Tier 1). Select agents can also compose and execute commands directly (Tier 2), recon-advisor, vuln-scanner, web-hunter, ad-attacker, exploit-chainer, poc-validator, database-attacker, network-attacker, ai-recon. Tier 2 requires a declared scope; the agent validates every target before executing any command.

## Install

\`\`\`bash
# One-line install
curl -fsSL https://raw.githubusercontent.com/0xSteph/pentest-ai-agents/main/install.sh | bash

# Or as a Claude Code plugin
/plugin marketplace add 0xSteph/pentest-ai-agents
/plugin install pentest-ai-agents@pentest-ai-agents
\`\`\`

## Legal

For authorized security testing only. Requires signed rules of engagement and defined scope.`,
      },
    ],
    repoUrl: 'https://github.com/0xSteph/pentest-ai-agents',
    githubStars: 1947,
    capabilities: [
      {
        command: 'engagement-planner',
        description: 'Generate phased pentest plans with MITRE ATT&CK mappings, time estimates, and rules-of-engagement templates.',
      },
      {
        command: 'recon-advisor (Tier 2)',
        description: 'Parse Nmap/Nessus/BloodHound output, prioritize targets, and execute recon tools directly against declared in-scope hosts.',
      },
      {
        command: 'ad-attacker (Tier 2)',
        description: 'Drive BloodHound, Impacket, CrackMapExec, and Certipy for Kerberos, delegation, ACL, and certificate-abuse attacks.',
      },
      {
        command: 'detection-engineer',
        description: 'Generate Sigma, Splunk SPL, Elastic KQL, and Sentinel KQL detection rules with false-positive tuning.',
      },
      {
        command: '/recommend "task description"',
        description: 'Slash command that routes to the right agent and returns concrete next commands for any pentest task.',
      },
      {
        command: 'db/doctor.sh',
        description: 'Audit which underlying CLI tools (nmap, nuclei, BloodHound, Impacket, etc.) are installed on your machine, grouped by agent.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-nycu-devteam-v1',
    slug: 'github-nycu-devteam',
    name: 'Claude Dev Team (NYCU)',
    tagline: 'An engineering team in a box: 12 agents plus hooks.',
    description:
      '12 Claude subagents representing distinct engineering roles (planner, fullstack-engineer, ' +
      'refactor-specialist, migration-engineer, frontend-designer, critic, vuln-verifier, debugger, ' +
      'db-expert, onboarder, tool-expert, web-researcher) plus 15 automation hooks and the ' +
      'P7/P9/P10 methodology that enforces closure, fact-driven reviews, and exhaustiveness.',
    role: 'general',
    industry: null,
    tags: ['subagents', 'dev-team', 'hooks', 'orchestration', 'engineering'],
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

12 Claude subagents representing distinct engineering roles, 15 automation hooks, and the P7/P9/P10 methodology, a discipline system borrowed from Chinese big-tech engineering culture that enforces closure, fact-driven reviews, and exhaustiveness.

**The 12 agents:**

| Role | Agent | What they do |
|------|-------|--------------|
| Tech Lead | planner | Breaks fuzzy requirements into parallelizable Task Prompts with a 6-element contract. Never writes code. |
| Senior Engineer | fullstack-engineer | Ships features via P7: read reality → design → impact analysis → implement → 3-question self-review → [P7-COMPLETION]. |
| Refactor Lead | refactor-specialist | Large-scale safe refactors across 10+ files with atomic commits and single-revert rollback. |
| Migration Lead | migration-engineer | Framework/library major-version upgrades with changelog-based incremental execution. |
| Designer | frontend-designer | Builds landing pages and dashboards that refuse generic AI-slop output. |
| Code Reviewer | critic | Finds bugs, security holes, and edge cases with file path + line number on every finding. |
| Pentester | vuln-verifier | Takes critic findings and writes actual PoC tests, proves the vulnerability is real, not theoretical. |
| Debug Engineer | debugger | Reads logs, constructs hypotheses, verifies, fixes. Never guesses. |
| DB Specialist | db-expert | Paranoid about data loss, reviews schemas, migrations, queries for locks and race conditions. |
| Onboarder | onboarder | First-time codebase exploration producing a structured mental model. |
| Tool Expert | tool-expert | Picks and chains MCP tools, troubleshoots tool failures. |
| Researcher | web-researcher | Fetches official docs and API specs to prevent hallucination. |

**15 hooks:** cost-tracker, commit-quality (blocks debugger statements and hardcoded secrets), mcp-health, config-protection, design-quality, check-console, audit-log, batch-format, suggest-compact, accumulator, log-error, test-runner, branch-protection (blocks force-push to main), large-file-warner, session-summary.

**P7/P9/P10 modes:** P7 (single feature, senior engineer), P9 (3+ files, tech lead decomposition, coding forbidden, output is Task Prompts), P10 (CTO, strategy docs only).

## Install

\`\`\`
/plugin marketplace add NYCU-Chung/my-claude-devteam
/plugin install devteam@my-claude-devteam
\`\`\`

Restart Claude Code, all 12 agents and 15 hooks register automatically.`,
      },
    ],
    repoUrl: 'https://github.com/NYCU-Chung/my-claude-devteam',
    githubStars: 268,
    capabilities: [
      {
        command: '/plugin install devteam@my-claude-devteam',
        description: 'Install all 12 agents and 15 hooks via the Claude Code plugin marketplace.',
      },
      {
        command: 'critic agent',
        description: 'Finds 20–30 issues on mid-sized modules with file path and line number on every finding. No "looks good to me" verdicts.',
      },
      {
        command: 'vuln-verifier agent',
        description: 'Writes actual PoC tests to prove security findings are real, attack input AND baseline control input required.',
      },
      {
        command: 'debugger agent',
        description: 'Traces root cause through logs and code before any fix. Stops after 3 failed hypotheses rather than retrying the same approach.',
      },
      {
        command: 'commit-quality hook',
        description: 'Pre-commit hook that blocks commits containing debugger statements or hardcoded secrets in JS/TS/Python files.',
      },
      {
        command: 'P7/P9/P10 methodology',
        description: 'Three red lines enforced in every agent: closure discipline (clear Definition of Done), fact-driven (cite file + line), and exhaustiveness (no silent skips).',
      },
    ],
  },

  // ── Harnesses (9) ───────────────────────────────────────────────────────────

  {
    kind: 'harness',
    id: 'github-gstack-v1',
    slug: 'github-gstack',
    name: 'gstack',
    tagline: 'Garry Tan\'s open-source software factory: 23+ specialist skills for the full sprint lifecycle.',
    description:
      'Garry Tan\'s personal Claude Code setup, open-sourced. 23+ slash-command skills covering ' +
      'the full sprint: /office-hours (6 forcing questions), /plan-ceo-review, /plan-eng-review, ' +
      '/design-shotgun, /review, /qa (real browser), /cso (OWASP + STRIDE), /ship, and more. ' +
      'Works across Claude Code, Codex, Cursor, OpenCode, and Factory.',
    role: 'general',
    industry: null,
    tags: ['harness', 'claude-code', 'role-commands', 'engineering-team'],
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

gstack is Garry Tan's open-source software factory, the setup he uses to ship 3 production services and 40+ features in 60 days while running Y Combinator full time. 23+ slash-command skills organized as a sprint process: Think → Plan → Build → Review → Test → Ship → Reflect. Each skill feeds into the next.

**The sprint skills:**

| Skill | Your specialist | What they do |
|-------|----------------|--------------|
| /office-hours | YC Office Hours | Six forcing questions that reframe your product before you write code. Challenges premises, extracts capabilities you didn't realize you were describing. |
| /plan-ceo-review | CEO / Founder | Rethink the problem. Find the 10-star product. Four modes: Expansion, Selective Expansion, Hold Scope, Reduction. |
| /plan-eng-review | Eng Manager | ASCII diagrams, data flow, state machines, edge cases, test matrix, failure modes. |
| /plan-design-review | Senior Designer | Rates each design dimension 0-10, explains what a 10 looks like, then edits the plan to get there. AI slop detection. |
| /review | Staff Engineer | Find bugs that pass CI but blow up in production. Auto-fixes obvious ones, flags the rest. |
| /investigate | Debugger | Iron Law: no fixes without investigation. Traces data flow, tests hypotheses, stops after 3 failed fixes. |
| /qa | QA Lead | Opens a real Chromium browser, clicks through flows, finds and fixes bugs, generates regression tests. |
| /cso | Chief Security Officer | OWASP Top 10 + STRIDE threat model. 17 false-positive exclusions, 8/10+ confidence gate, independent finding verification. |
| /ship | Release Engineer | Sync main, run tests, audit coverage, push, open PR. Bootstraps test frameworks if you don't have one. |
| /autoplan | Review Pipeline | One command: CEO → design → eng review automatically. Surfaces only taste decisions for your approval. |
| /design-shotgun | Design Explorer | Generates 4-6 mockup variants, opens a comparison board in your browser, iterates. |
| /retro | Eng Manager | Per-person breakdowns, shipping streaks, test health trends. /retro global runs across all projects and AI tools. |

## Install (30 seconds)

Paste in Claude Code:

\`\`\`
Install gstack: run git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
\`\`\`

Then follow prompts. Works on Claude Code, Codex, OpenCode, Cursor, Factory, Kiro, and Hermes.

## When to use

When you want a structured sprint process, not just individual tools. The skills run in sprint order: each one feeds into the next, nothing falls through the cracks.`,
      },
    ],
    repoUrl: 'https://github.com/garrytan/gstack',
    githubStars: 119663,
    capabilities: [
      {
        command: '/office-hours',
        description: 'Six forcing questions that reframe your product before you write code, challenges premises and extracts the real user pain.',
      },
      {
        command: '/review',
        description: 'Staff Engineer skill: finds bugs that pass CI but blow up in production; auto-fixes obvious ones, flags blockers.',
      },
      {
        command: '/qa',
        description: 'Opens a real Chromium browser, clicks through your app flows, finds and fixes bugs, and generates regression tests.',
      },
      {
        command: '/cso',
        description: 'OWASP Top 10 + STRIDE threat model audit with 17 false-positive exclusions and independent finding verification.',
      },
      {
        command: '/ship',
        description: 'Sync main, run tests, audit coverage, push, and open PR, bootstraps test frameworks if the project has none.',
      },
      {
        command: '/autoplan',
        description: 'One command runs CEO → design → eng review automatically and surfaces only the taste decisions that need your approval.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-ruflo-v1',
    slug: 'github-ruflo',
    name: 'Ruflo',
    tagline: 'Multi-agent swarm orchestrator (formerly claude-flow).',
    description:
      'An agent meta-harness (formerly claude-flow) that adds 100+ specialized agents, coordinated swarms, ' +
      'self-learning HNSW memory, agent federation across machines, and 35 Claude Code plugins to Claude Code ' +
      'and Codex. Install via `npx ruflo init` for the full loop or individual plugins via the Claude Code marketplace.',
    role: 'general',
    industry: null,
    tags: ['harness', 'swarm', 'orchestration', 'multi-agent', 'devops'],
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

Ruflo (formerly claude-flow) is an agent meta-harness, the execution layer around Claude Code and Codex that adds 100+ specialized agents, coordinated swarms, self-learning memory, agent federation across machines, and enterprise security guardrails. After \`npx ruflo init\`, you use Claude Code normally, hooks automatically route tasks, learn from successful patterns, and coordinate agents in the background.

**Core capabilities:**

- **100+ agents:** coders, testers, reviewers, architects, security auditors organized by domain.
- **Swarm coordination:** Hierarchical, mesh, and adaptive topologies with consensus protocols (Raft, Byzantine, Gossip).
- **HNSW vector memory:** AgentDB, persistent memory across sessions, measured ~1.9x faster at N=20k vs brute force. Agents recall past solutions via vector search.
- **Self-learning:** SONA neural patterns and ReasoningBank learn from every task; intelligent routing achieves 89% accuracy.
- **Agent federation:** Zero-trust cross-machine collaboration. Agents on different machines or orgs discover each other via mTLS + ed25519, exchange work with PII stripped before transmission, and build behavioral trust scores over time.
- **Background workers:** 12 auto-triggered workers (audit, optimize, testgaps, etc.) run without user intervention.

**35 Claude Code plugins include:** ruflo-core, ruflo-swarm, ruflo-sparc (SPARC methodology), ruflo-rag-memory, ruflo-intelligence, ruflo-security-audit, ruflo-aidefence, ruflo-browser, ruflo-testgen, ruflo-ddd, ruflo-adr, ruflo-cost-tracker, ruflo-neural-trader, and more.

## Install

**Two paths:**

**Path A, Claude Code plugins (slash commands only, no MCP):**

\`\`\`
/plugin marketplace add ruvnet/ruflo
/plugin install ruflo-core@ruflo
/plugin install ruflo-swarm@ruflo
\`\`\`

**Path B, Full CLI install (MCP server, hooks, daemon, all 98 agents):**

\`\`\`bash
npx ruflo@latest init wizard
\`\`\`

Add as MCP server:

\`\`\`bash
claude mcp add ruflo -- npx ruflo@latest mcp start
\`\`\`

## When to use

Large parallel workloads where sequential execution is too slow, refactors across many files, documentation at scale, multi-hour autonomous sessions with cross-machine agent collaboration.`,
      },
    ],
    repoUrl: 'https://github.com/ruvnet/ruflo',
    githubStars: 63130,
    capabilities: [
      {
        command: 'npx ruflo@latest init wizard',
        description: 'Interactive setup wizard that installs the full Ruflo loop: 98 agents, 60+ commands, MCP server, hooks, and background workers.',
      },
      {
        command: 'claude mcp add ruflo -- npx ruflo@latest mcp start',
        description: 'Register Ruflo as an MCP server so memory_store, swarm_init, agent_spawn, and other tools are callable from Claude.',
      },
      {
        command: '/plugin install ruflo-swarm@ruflo',
        description: 'Install the swarm plugin to coordinate multiple agents as a team with hierarchical, mesh, or adaptive topologies.',
      },
      {
        command: '/plugin install ruflo-sparc@ruflo',
        description: 'Install the SPARC methodology plugin: Specification, Pseudocode, Architecture, Refinement, Completion, a five-phase structured agentic development workflow.',
      },
      {
        command: 'ruflo federation init',
        description: 'Initialize zero-trust agent federation with mTLS + ed25519 keypair for cross-machine agent collaboration.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-superclaude-v1',
    slug: 'github-superclaude',
    name: 'SuperClaude Framework',
    tagline: 'Enhances Claude Code with commands, personas, and methodologies.',
    description:
      'A meta-programming configuration framework that adds 30 /sc:* slash commands, 20 specialized ' +
      'agents, 7 behavioral modes, and 8 MCP server integrations to Claude Code. Installed via ' +
      '`pipx install superclaude && superclaude install`. Covers brainstorming, deep web research, ' +
      'implementation, testing, project management, and security audits.',
    role: 'general',
    industry: null,
    tags: ['harness', 'claude-code', 'commands', 'personas', 'framework'],
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

SuperClaude is a meta-programming configuration framework that extends Claude Code with 30 slash commands, 20 specialized AI agents, 7 behavioral modes, and 8 MCP server integrations, installed by a Python package that copies CLAUDE.md and command files into your project.

**30 /sc:* commands organized by phase:**

- **Planning & Design (4):** /sc:brainstorm, /sc:design, /sc:estimate, /sc:spec-panel.
- **Development (5):** /sc:implement, /sc:build, /sc:improve, /sc:cleanup, /sc:explain.
- **Testing & Quality (4):** /sc:test, /sc:analyze, /sc:troubleshoot, /sc:reflect.
- **Research (2):** /sc:research (deep autonomous web research), /sc:business-panel.
- **Project Management (3):** /sc:pm, /sc:task, /sc:workflow.
- **Utilities (9):** /sc:agent, /sc:spawn (parallel tasks), /sc:save, /sc:load, /sc:recommend, and more.

**7 behavioral modes:** Brainstorming, Business Panel (multi-expert analysis), Deep Research (autonomous web with multi-hop reasoning), Orchestration, Token-Efficiency (30–50% context savings), Task Management, Introspection.

**Deep Research capability:** /sc:research supports 4 depth levels (Quick/Standard/Deep/Exhaustive), up to 5 iterative search hops, case-based learning across sessions, and confidence scoring (0.0–1.0). Integrates Tavily for web search, Context7 for official docs, Sequential for multi-step reasoning.

**8 optional MCP servers:** Tavily (primary web search), Context7 (official docs), Sequential-Thinking, Serena (memory), Playwright (browser automation), Magic (UI generation), Morphllm-Fast-Apply (code modifications), Chrome DevTools. Without MCPs the framework is fully functional; with MCPs you get 2–3x faster execution and 30–50% fewer tokens.

## Install

\`\`\`bash
pipx install superclaude
superclaude install                              # install all 30 commands
superclaude mcp --servers tavily --servers context7  # optional MCP servers
superclaude doctor                               # verify installation
\`\`\`

## When to use

When you want a structured framework with defined workflows for each development phase, autonomous web research, and team-style multi-expert analysis, without manually defining slash commands.`,
      },
    ],
    repoUrl: 'https://github.com/SuperClaude-Org/SuperClaude_Framework',
    githubStars: 23489,
    capabilities: [
      {
        command: 'superclaude install',
        description: 'Install all 30 /sc:* slash commands into Claude Code via the Python package.',
      },
      {
        command: '/sc:research',
        description: 'Autonomous deep web research with multi-hop reasoning, confidence scoring, and case-based learning across sessions.',
      },
      {
        command: '/sc:implement',
        description: 'Guided feature implementation with verification gates at each step.',
      },
      {
        command: '/sc:brainstorm',
        description: 'Structured brainstorming that asks the right questions before any code is written.',
      },
      {
        command: '/sc:spawn',
        description: 'Execute tasks in parallel across multiple independent workstreams.',
      },
      {
        command: '/sc:business-panel',
        description: 'Multi-expert strategic analysis from multiple business perspectives simultaneously.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-ccpm-v1',
    slug: 'github-ccpm',
    name: 'CCPM',
    tagline: 'Project management via GitHub Issues and git worktrees for parallel agents.',
    description:
      'A spec-driven project management skill (agentskills.io standard) that turns ideas into PRDs, ' +
      'PRDs into GitHub issues, and issues into parallel agent workstreams. Enforces a no-vibe-coding ' +
      'discipline: every line of code traces back to a specification. Triggers via natural language, ' +
      'no special syntax. Works with Claude Code, Factory, Codex, Amp, OpenCode, Cursor, and more.',
    role: 'general',
    industry: null,
    tags: ['harness', 'project-management', 'git-worktrees', 'parallel-agents', 'github-issues'],
    category: 'operations',
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

CCPM (Claude Code Project Manager) is a spec-driven development skill built on the agentskills.io open standard. It enforces a five-phase discipline, Brainstorm → Document → Plan → Execute → Track, where every line of code traces back to a written specification. No vibe coding.

**The workflow:**

1. **Plan**, Guided brainstorming + PRD creation saved to .claude/prds/. Say "I want to build X" to start.
2. **Structure**, PRD → technical epic at .claude/epics/ with architecture decisions, task breakdown (7–10 tasks per epic), and dependency/parallel markers.
3. **Sync**, "sync the X epic to GitHub" creates an epic issue, sub-issues, and a dedicated git worktree.
4. **Execute**, "start working on issue N" analyzes the issue for parallel work streams and launches multiple agents simultaneously in the same worktree. Each agent commits with Issue #N: description.
5. **Track**, "standup" / "what's blocked" / "what's next" run instant bash scripts from .claude/epics/, no LLM overhead.

**Why GitHub Issues:** Issues serve as the source of truth so multiple agents (or humans) can work simultaneously with real-time visible progress. No separate project management tool needed.

**Parallel execution math:** A single "Implement user authentication" issue might spawn 5 parallel streams (database tables, service layer, API endpoints, UI components, tests). CCPM analyzes the issue and launches them simultaneously, 5x faster than serial execution.

**Benchmark:** 100% eval score on structured tests (vs 27.7% without CCPM).

## Install

\`\`\`bash
git clone https://github.com/automazeio/ccpm.git

# Factory / Droid
ln -s /path/to/ccpm/skill/ccpm ~/.factory/skills/ccpm

# Claude Code
ln -s /path/to/ccpm/skill/ccpm .claude/skills/ccpm
\`\`\`

Prerequisites: git, gh CLI (authenticated: gh auth login).

## When to use

When you want every code change traceable to a specification, parallel agent workstreams for fast delivery, and GitHub Issues as the shared source of truth for human-agent collaboration.`,
      },
    ],
    repoUrl: 'https://github.com/automazeio/ccpm',
    githubStars: 8244,
    capabilities: [
      {
        command: '"I want to build X" (natural language trigger)',
        description: 'Start guided brainstorming and PRD creation, CCPM detects PM intent and activates automatically.',
      },
      {
        command: '"parse the X PRD" / "create an epic for X"',
        description: 'Convert a completed PRD to a technical epic with architecture decisions, task breakdown, and dependency metadata.',
      },
      {
        command: '"sync the X epic to GitHub"',
        description: 'Create an epic GitHub issue, sub-issues for each task, and a dedicated git worktree for isolation.',
      },
      {
        command: '"start working on issue N"',
        description: 'Analyze issue N for parallel work streams and launch multiple agents simultaneously in the worktree.',
      },
      {
        command: '"standup" / "what\'s blocked"',
        description: 'Run instant bash scripts from .claude/epics/ to report progress, no LLM token cost.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-spec-kit-v1',
    slug: 'github-spec-kit',
    name: 'Spec-Kit',
    tagline: 'Spec-Driven Development toolkit (cross-model).',
    description:
      'GitHub\'s open-source Spec-Driven Development toolkit. Install via `uv tool install specify-cli`, ' +
      'then `specify init` to scaffold a project with 6 /speckit.* slash commands. Works across 30+ ' +
      'AI coding agents. Enforces Spec → Plan → Tasks → Implement with each stage gating the next. ' +
      'Extensible via community extensions, presets, and bundles.',
    role: 'general',
    industry: null,
    tags: ['harness', 'spec-driven', 'cross-model', 'engineering', 'specifications'],
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

Spec-Kit is GitHub's open-source Spec-Driven Development toolkit. It flips the script on traditional AI-assisted development: specifications become executable, directly generating working implementations instead of just guiding them. Every line of code traces back to a written specification.

**The 6 core /speckit.* commands:**

| Command | What it does |
|---------|-------------|
| /speckit.constitution | Create or update project governing principles that guide all subsequent development |
| /speckit.specify | Define what you want to build, requirements and user stories. Focus on the what and why, not the tech stack. |
| /speckit.clarify | Structured clarification of underspecified areas before planning (prevents rework downstream) |
| /speckit.plan | Create a technical implementation plan with your chosen tech stack and architecture |
| /speckit.tasks | Generate an actionable task list from the implementation plan with dependency ordering |
| /speckit.implement | Execute all tasks to build the feature according to the plan |

**Optional:** /speckit.analyze (cross-artifact consistency), /speckit.checklist (quality validation), /speckit.converge (assess codebase against spec and append remaining work).

**Cross-model and cross-agent:** Works with 30+ AI coding agents including Claude Code, GitHub Copilot, Codex CLI, Gemini CLI, Cursor, Kiro, OpenCode, and more. Pass --integration <agent> to init for agent-native slash commands.

**Extensibility:** Community extensions add new commands; presets customize existing template formats; bundles provision a complete role-based setup in one command.

## Install

\`\`\`bash
# Install the CLI (requires uv)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z

# Initialize a project for Claude Code
specify init my-project --integration copilot   # or: --integration claude, codex, gemini
cd my-project

# In Claude Code, use the workflow
/speckit.constitution Create principles focused on code quality and testing standards
/speckit.specify Build X application with Y features
/speckit.plan Use React + TypeScript + PostgreSQL
/speckit.tasks
/speckit.implement
\`\`\`

## When to use

When you want every implementation decision traceable to a requirement, when you are building from scratch (0-to-1) or iterating on existing features (brownfield), and when you want a workflow that works the same way across multiple AI coding tools.`,
      },
    ],
    repoUrl: 'https://github.com/github/spec-kit',
    githubStars: 118142,
    capabilities: [
      {
        command: 'specify init my-project --integration copilot',
        description: 'Scaffold a new project with Spec-Kit structure, CLAUDE.md, and native slash commands for your chosen AI coding agent.',
      },
      {
        command: '/speckit.constitution',
        description: 'Create or update project governing principles (saved to .specify/memory/constitution.md) that guide all subsequent development.',
      },
      {
        command: '/speckit.specify',
        description: 'Define what you want to build using requirements and user stories, focus on the what and why, not the tech stack.',
      },
      {
        command: '/speckit.plan',
        description: 'Create a technical implementation plan with your chosen tech stack. Produces spec.md, plan.md, data-model.md, and API contracts.',
      },
      {
        command: '/speckit.tasks',
        description: 'Break the implementation plan into ordered, atomic tasks with parallel execution markers and dependency tracking.',
      },
      {
        command: '/speckit.implement',
        description: 'Execute all tasks in order, respecting dependencies and parallel markers, to build the feature according to the approved plan.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-bmad-method-v1',
    slug: 'github-bmad-method',
    name: 'BMAD Method',
    tagline: 'Agile AI-driven development method (agent-agnostic).',
    description:
      'The Breakthrough Method for Agile AI-Driven Development. Installs via `npx bmad-method install`. ' +
      '12+ domain-expert agents (PM, Architect, Developer, UX, QA Lead, and more), 34+ structured ' +
      'workflows, Party Mode for multi-agent collaboration, and web bundles for Gemini Gems and ' +
      'ChatGPT GPTs. Scale-adaptive: adjusts planning depth from bug fixes to enterprise systems.',
    role: 'general',
    industry: null,
    tags: ['harness', 'agile', 'methodology', 'agent-agnostic', 'product'],
    category: 'product',
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

The Breakthrough Method for Agile AI-Driven Development. BMad agents act as expert collaborators who guide you through structured agile workflows, they bring out your best thinking rather than doing the thinking for you. Scale-adaptive intelligence automatically adjusts planning depth from a quick bug fix to an enterprise system.

**Key capabilities:**

- **12+ specialized agents:** PM, Architect, Developer, UX Researcher, QA Lead, Business Analyst, Security Analyst, and more, each with domain-specific knowledge and distinct communication styles.
- **34+ structured workflows:** Grounded in agile best practices across brainstorming, requirements, architecture, user stories, sprint planning, and implementation.
- **Party Mode:** Bring multiple agent personas into one session to collaborate, debate, and reach decisions together.
- **bmad-help skill:** Invoke at any time to get guidance on what to do next, what's optional, and what the current state of your project is.
- **Scale-adaptive:** Single-feature P7 mode uses a lightweight engineer workflow; multi-module P9 mode decomposes to Task Prompts; enterprise P10 mode produces CTO-level strategy docs.

**Modules (extend BMad with specialist domains):**

- BMad Builder (BMB), create custom BMad agents and workflows.
- Test Architect (TEA), risk-based test strategy and automation.
- Game Dev Studio (BMGD), Unity, Unreal, Godot workflows.
- Creative Intelligence Suite (CIS), innovation, brainstorming, design thinking.

**Web bundles:** Package selected BMad skills as Google Gemini Gems or ChatGPT Custom GPTs for upfront planning work, brainstorming, product briefs, PRDs, PRFAQs, UX specs, on a flat-rate subscription before bringing artifacts into the IDE for metered implementation.

## Install

\`\`\`bash
# Prerequisites: Node.js v20.12+, Python 3.10+, uv
npx bmad-method install

# Non-interactive (for CI/CD)
npx bmad-method install --directory /path/to/project --modules bmm --tools claude-code --yes
\`\`\`

Follow the installer prompts, then open Claude Code in your project folder.

## When to use

Agile-style product development where you want the AI to act as domain-expert collaborators (not just a code generator) across the full lifecycle from brainstorming to deployment.`,
      },
    ],
    repoUrl: 'https://github.com/bmad-code-org/BMAD-METHOD',
    githubStars: 50095,
    capabilities: [
      {
        command: 'npx bmad-method install',
        description: 'Install the BMad Method framework interactively, detects your project type and configures the right modules and tools.',
      },
      {
        command: 'bmad-help skill',
        description: 'Invoke at any time to get guidance on what step to do next, what is optional, and the current project state.',
      },
      {
        command: 'Party Mode',
        description: 'Bring multiple BMad agent personas into one session to collaborate, debate, and reach decisions together.',
      },
      {
        command: '12+ specialized agents',
        description: 'PM, Architect, Developer, UX Researcher, QA Lead, Business Analyst, each with domain-specific knowledge and communication style.',
      },
      {
        command: 'Web bundles (Gemini Gems / ChatGPT GPTs)',
        description: 'Package BMad planning skills for Gemini or ChatGPT to do PRDs, PRFAQs, and UX specs on flat-rate subscriptions before moving to metered IDE tokens.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-oneredoak-workflows-v1',
    slug: 'github-oneredoak-workflows',
    name: 'OneRedOak Claude Code Workflows',
    tagline: 'Applied Claude Code workflows and configs.',
    description:
      'Three production-tested Claude Code workflow systems from OneRedOak, each with slash commands ' +
      'and GitHub Actions: a code-review workflow (dual-loop architecture for syntax, completeness, ' +
      'style, and bug detection), a security-review workflow (OWASP Top 10, severity-classified ' +
      'findings), and a design-review workflow (Playwright MCP browser automation for UI/UX audits).',
    role: 'general',
    industry: null,
    tags: ['harness', 'claude-code', 'workflows', 'configs', 'devops'],
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

Three production-tested Claude Code workflow systems from an AI-native startup. Each workflow ships slash commands for on-demand use and GitHub Actions for automated PR checks.

**Code Review Workflow (code-review/):** Inspired by Anthropic's own Claude Code development process. Implements dual-loop architecture where AI agents handle the "blocking and tackling" of code review, syntax, completeness, style guide adherence, and bug detection. Frees the team to focus on strategic thinking and architectural alignment.

**Security Review Workflow (security-review/):** Automated security review based on Anthropic's security-focused approach and OWASP Top 10 standards. Proactively identifies vulnerabilities, exposed secrets, and potential attack vectors. Returns severity-classified findings (critical/high/medium/low) with clear remediation guidance. Includes on-demand slash commands and automated PR security checks via GitHub Actions.

**Design Review Workflow (design-review/):** Automated UI/UX review using Microsoft's open-source Playwright MCP for browser automation. Specialized Claude Code agents ensure UI/UX consistency, accessibility compliance, and adherence to world-class design standards. Catches visual issues before they reach production.

Each workflow is documented with a video tutorial on Patrick Ellis' YouTube channel.

## Install

\`\`\`bash
git clone https://github.com/OneRedOak/claude-code-workflows
\`\`\`

Copy the workflow folder(s) you want into your project's .claude/ directory and configure the GitHub Actions as needed. Each workflow directory is self-contained with its own slash commands and CI configuration.

## When to use

When you want AI-driven code, security, or design review wired into both your local Claude Code workflow (slash commands) and your CI/CD pipeline (GitHub Actions) without building the integration from scratch.`,
      },
    ],
    repoUrl: 'https://github.com/OneRedOak/claude-code-workflows',
    githubStars: 3866,
    capabilities: [
      {
        command: 'Code Review workflow',
        description: 'Dual-loop AI architecture for syntax, completeness, style adherence, and bug detection, with slash commands and GitHub Actions.',
      },
      {
        command: 'Security Review workflow',
        description: 'OWASP Top 10–based review that identifies vulnerabilities, exposed secrets, and attack vectors with severity-classified findings.',
      },
      {
        command: 'Design Review workflow',
        description: 'Playwright MCP browser automation for UI/UX consistency, accessibility compliance, and visual quality checks before production.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-pimzino-spec-workflow-v1',
    slug: 'github-pimzino-spec-workflow',
    name: 'Pimzino Spec Workflow',
    tagline: 'Spec-driven Req→Design→Tasks→Impl workflow automation.',
    description:
      'An npm package that installs 10 slash commands (5 spec workflow + 5 bug fix), 4 specialized ' +
      'agents, a real-time dashboard, and steering documents into Claude Code. Spec workflow: ' +
      '/spec-create gates the agent through Requirements → Design → Tasks → Implementation. ' +
      'Bug fix workflow: /bug-create → /bug-analyze → /bug-fix → /bug-verify.',
    role: 'general',
    industry: null,
    tags: ['harness', 'spec-driven', 'workflow', 'requirements', 'claude-code'],
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

An npm package that installs a complete spec-driven development system into Claude Code: 10 slash commands, 4 specialized agents, a real-time dashboard, and steering documents that provide persistent project context.

**Spec workflow (new features):**

\`/spec-create feature-name "Description"\`, runs the complete workflow in one command:
1. Requirements → user stories and acceptance criteria
2. Design → technical architecture
3. Tasks → atomic agent-friendly task breakdown
4. Commands → auto-generated per-task slash commands (optional)

Then execute tasks individually with \`/spec-execute 1 feature-name\` or the auto-generated \`/feature-name-task-1\`.

**Bug fix workflow:**

| Command | Purpose |
|---------|---------|
| /bug-create issue-name "Description" | Document the bug with structured format |
| /bug-analyze | Investigate root cause |
| /bug-fix | Implement targeted solution |
| /bug-verify | Confirm resolution |

**Steering documents (persistent project context):** /spec-steering-setup creates product.md (vision, target users, key features), tech.md (stack, tools, constraints), and structure.md (file organization, naming conventions). Claude reads these at session start for consistent code generation without repeated explanations.

**4 specialized agents:** spec-task-executor, spec-requirements-validator, spec-design-validator, spec-task-validator. All optional, everything works with built-in fallbacks.

**Real-time dashboard:**

\`\`\`bash
npx -p @pimzino/claude-code-spec-workflow claude-spec-dashboard
\`\`\`

Live progress tracking via WebSocket with git integration. Optional tunnel for sharing with external stakeholders.

**Context optimization:** 60–80% token reduction via bulk document loading (get-steering-context, get-spec-context, get-template-context) and session-based caching.

## Install

\`\`\`bash
npm i -g @pimzino/claude-code-spec-workflow
claude-code-spec-workflow          # run setup in your project directory
\`\`\`

Restart Claude Code. The /spec-* and /bug-* commands are immediately available.

**Tip:** Use Opus for /spec-create (spec generation) and Sonnet for /spec-execute (implementation) for best cost-to-quality ratio.`,
      },
    ],
    repoUrl: 'https://github.com/Pimzino/claude-code-spec-workflow',
    githubStars: 3786,
    capabilities: [
      {
        command: '/spec-create feature-name "Description"',
        description: 'Run the complete spec workflow: Requirements → Design → Tasks → auto-generated implementation commands.',
      },
      {
        command: '/spec-execute task-id feature-name',
        description: 'Execute a specific task from the approved spec with full steering + specification context loaded.',
      },
      {
        command: '/spec-steering-setup',
        description: 'Create product.md, tech.md, and structure.md as persistent project context that reduces repeated explanations.',
      },
      {
        command: '/bug-create issue-name "Description"',
        description: 'Document a bug in structured format as the starting point for the /bug-analyze → /bug-fix → /bug-verify workflow.',
      },
      {
        command: 'claude-spec-dashboard',
        description: 'Real-time WebSocket dashboard for tracking spec and bug fix progress, with optional secure tunnel for stakeholder sharing.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claudekit-v1',
    slug: 'github-claudekit',
    name: 'claudekit',
    tagline: 'Custom commands, hooks, and utilities for Claude Code.',
    description:
      'An npm-installed kit of smart guardrails, workflow commands, and AI subagents for Claude Code. ' +
      'Real-time hooks catch TypeScript errors, lint violations, leaked secrets, and test failures as ' +
      'Claude works. Slash commands cover code review (/code-review with 6 parallel agents), git workflows, ' +
      'spec creation, and checkpoint management. Ships 30+ domain-expert subagents.',
    role: 'general',
    industry: null,
    tags: ['harness', 'claude-code', 'hooks', 'utilities', 'commands'],
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

claudekit is a smart guardrails and workflow automation kit for Claude Code. It acts as a safety net: hooks catch errors in real time as Claude edits, commands automate routine workflows, and domain-expert subagents handle specialized analysis in parallel.

**Real-time hooks (the core value):**

- **file-guard**, Blocks AI access to sensitive files (.env, AWS credentials, SSH keys, etc.) using 195+ patterns across 12 categories. Advanced bash command analysis detects risky constructs like \`find -name '*.env' | xargs cat\`.
- **typecheck-changed**, Runs TypeScript type checking on changed files immediately after edits.
- **lint-changed**, Runs Biome/ESLint on changed files before they accumulate.
- **test-changed**, Runs relevant tests for changed files so failures surface immediately.
- **check-any-changed**, Blocks \`any\` types in TypeScript files as Claude edits.
- **commit-quality**, Pre-commit hook blocking debugger statements and hardcoded secrets.
- **create-checkpoint**, Auto-saves a git checkpoint when Claude stops (enables easy rollback).
- **codebase-map**, Injects a structured project map once per session so Claude navigates without file-by-file exploration.

**Slash commands:**

- /code-review, 6 parallel specialized agents (architecture, security, performance, testing, quality, documentation) with prioritized findings.
- /git:commit, Smart commit following your project's conventions.
- /git:status, Intelligent git analysis grouped by change type.
- /git:checkout, Branch creation with conventional naming.
- /git:ignore-init, AI-safe .gitignore patterns for 195+ sensitive file types.
- /spec:create, Research codebase and generate comprehensive specifications.
- /spec:execute, Implement specifications via iterative 6-phase workflow.
- /checkpoint:create / /checkpoint:restore, Manual checkpoint management.
- /validate-and-fix, Run all quality checks and fix issues.
- /research, Deep parallel research with specialized subagents.

**30+ AI subagents** including code-review-expert (the 6-agent parallel reviewer), typescript-expert, react-expert, testing-expert, database-expert, security-expert, oracle (deep debugging), refactoring-expert, ai-sdk-expert, nestjs-expert, and more.

## Install

\`\`\`bash
npm install -g claudekit
claudekit setup              # interactive setup
claudekit setup --yes        # quick setup with defaults
claudekit setup --all        # install everything including all agents
\`\`\`

Verify: \`claudekit doctor\`

## Key config

Hooks are configured in .claude/settings.json and .claudekit/config.json. Run \`claudekit list\` to see all installed components and \`claudekit-hooks profile\` to measure hook execution time and output size.`,
      },
    ],
    repoUrl: 'https://github.com/carlrannaberg/claudekit',
    githubStars: 732,
    capabilities: [
      {
        command: 'claudekit setup',
        description: 'Interactive setup wizard that installs selected hooks, commands, and agents into your project.',
      },
      {
        command: '/code-review',
        description: '6 parallel specialized agents analyze architecture, security, performance, testing, quality, and documentation simultaneously.',
      },
      {
        command: 'file-guard hook',
        description: 'Blocks AI access to sensitive files using 195+ patterns, detects risky bash constructs like find-pipe-xargs-cat before execution.',
      },
      {
        command: '/checkpoint:restore',
        description: 'Restore the working tree to the last auto-saved git checkpoint, one-command undo for any Claude session.',
      },
      {
        command: '/spec:create',
        description: 'Research the codebase and generate a comprehensive spec document ready for /spec:execute.',
      },
      {
        command: 'claudekit-hooks profile',
        description: 'Profile all configured hooks for execution time and output size, identifies slow hooks and those approaching Claude\'s context limits.',
      },
    ],
  },
];
