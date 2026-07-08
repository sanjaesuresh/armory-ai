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
      'The original SKILL.md framework by Jesse Vincent. Provides installable workflow files ' +
      'covering the full software development lifecycle — from kickoff and planning through ' +
      'implementation, testing, and review. Each skill is a structured prompt that Claude loads ' +
      'on demand.',
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

The original SKILL.md framework by Jesse Vincent. Provides installable workflow files covering the full software development lifecycle — kickoff, planning, implementation, testing, review, and retrospective. Each skill is a structured prompt that Claude loads on demand via the plugin system. Skills compose cleanly: a kickoff skill can hand off to an implementation skill once planning is complete, keeping the agent on track through each phase.

## Commands

Install the collection via the Claude Code plugin marketplace:

\`\`\`
/plugin marketplace add obra/superpowers
\`\`\`

Then invoke individual skills:

- \`/skill kickoff\` — run a structured project kickoff with goal alignment
- \`/skill implement\` — guided implementation with verification gates
- \`/skill review\` — structured code review checklist

## Example output

After \`/skill kickoff\`, Claude produces a structured brief saved to \`docs/kickoff.md\`: goals, open assumptions, top risks, and a proposed implementation order — ready to share with teammates or paste into a GitHub Issue.`,
      },
    ],
    repoUrl: 'https://github.com/obra/superpowers',
    githubStars: 246793,
    capabilities: [
      {
        command: '/plugin marketplace add obra/superpowers',
        description: 'Install the full Superpowers skill collection via the Claude Code plugin marketplace.',
      },
      {
        command: '/skill kickoff',
        description: 'Run a structured project kickoff skill that produces a goals-and-risks brief saved to disk.',
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
      'Skills derived from Andrej Karpathy\'s public writing and talks on LLM-assisted coding. ' +
      'Encodes the common failure modes and guardrails he identified — over-reliance on ' +
      'boilerplate, hallucinated APIs, and skipping verification — as installable SKILL.md files.',
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

Encodes Andrej Karpathy's documented LLM-coding guardrails as installable SKILL.md files and a CLAUDE.md. Covers the failure modes he identified publicly: over-relying on boilerplate the model doesn't understand, accepting hallucinated API signatures, skipping post-generation verification, and letting the model drift from the original spec. The CLAUDE.md sets project-level defaults; skills can be invoked for specific coding phases to reinforce the guardrails at the right moment.

## Commands

Option 1 — install via the plugin marketplace:

\`\`\`
/plugin marketplace add multica-ai/andrej-karpathy-skills
\`\`\`

Option 2 — copy the CLAUDE.md directly into your project root:

\`\`\`bash
git clone https://github.com/multica-ai/andrej-karpathy-skills
cp andrej-karpathy-skills/CLAUDE.md ./CLAUDE.md
\`\`\`

## Example output

With the skills active, when you ask Claude to call an external API it first confirms the method signature against the official docs rather than guessing, and flags any unverified assumption with a comment before writing the implementation.`,
      },
    ],
    repoUrl: 'https://github.com/multica-ai/andrej-karpathy-skills',
    githubStars: 187979,
    capabilities: [
      {
        command: '/plugin marketplace add multica-ai/andrej-karpathy-skills',
        description: 'Install Karpathy-derived LLM-coding guardrail skills via the Claude Code plugin marketplace.',
      },
      {
        command: '/skill verify',
        description: 'Run the verification guardrail skill to check generated code against the original spec before committing.',
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
      'The official skills collection maintained by Anthropic. Contains reference ' +
      'implementations of common agent capabilities intended as building blocks for ' +
      'Claude-based workflows across a range of use cases.',
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

The official skills collection maintained by Anthropic, serving as reference implementations and validated building blocks for Claude-based workflows. Includes document-processing skills for docx, pdf, pptx, and xlsx files — Claude can extract, summarize, or transform structured content from each format without manual parsing. Additional skills cover common agentic patterns that the Anthropic team has validated against real workloads.

## Commands

Install the full collection:

\`\`\`
/plugin marketplace add anthropics/skills
\`\`\`

Install just the document-processing skills:

\`\`\`
/plugin install document-skills@anthropic-agent-skills
\`\`\`

## Example output

After installing document-skills, dropping a PDF into Claude Code and running \`/skill extract-pdf\` returns structured JSON with sections, headings, and body text — ready for downstream summarization or search indexing without writing any parsing code.`,
      },
    ],
    repoUrl: 'https://github.com/anthropics/skills',
    githubStars: 158412,
    capabilities: [
      {
        command: '/plugin marketplace add anthropics/skills',
        description: 'Install the full Anthropic official skills collection via the Claude Code plugin marketplace.',
      },
      {
        command: '/plugin install document-skills@anthropic-agent-skills',
        description: 'Install only the document-processing skill set (pdf, docx, pptx, xlsx extraction) from the Anthropic skills repo.',
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
      'A skill that enforces file-based planning before execution. The agent writes a plan ' +
      'to disk, gets confirmation, and only then proceeds. Provides a completion gate so ' +
      'long-running tasks can be paused and resumed without losing context.',
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

Enforces a write-plan-before-execute discipline for long-running agents. Before taking any significant action the agent writes a plan to a markdown file on disk, waits for user confirmation, and only then proceeds step by step. A completion gate prevents the agent from marking work done until every planned step is checked off. If the session is interrupted, the plan file on disk records exactly where things were left so the next session picks up without re-deriving context.

## Commands

Install via the plugin marketplace:

\`\`\`
/plugin marketplace add OthmanAdi/planning-with-files
\`\`\`

Or copy the SKILL.md manually into your project's \`.claude/skills/\` directory:

\`\`\`bash
git clone https://github.com/OthmanAdi/planning-with-files
cp planning-with-files/SKILL.md .claude/skills/planning-with-files.md
\`\`\`

## Example output

Claude writes \`plan-2026-07-07.md\` with a checklist of steps, awaits your confirmation, then works through each item in order — marking each \`[x]\` as it completes and stopping at the completion gate to report the final status before closing the task.`,
      },
    ],
    repoUrl: 'https://github.com/OthmanAdi/planning-with-files',
    githubStars: 24649,
    capabilities: [
      {
        command: '/plugin marketplace add OthmanAdi/planning-with-files',
        description: 'Install the planning-with-files skill so the agent writes a plan to disk and awaits confirmation before executing.',
      },
      {
        command: '/plan',
        description: 'Invoke the planning skill to write a step-by-step plan file before the agent begins any execution.',
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
      'A broad collection of Claude Code skills, subagents, and slash commands covering ' +
      'development, research, writing, and operations workflows. Targets multiple platforms ' +
      'including Claude Code and the Claude desktop app.',
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

A broad skill pack covering development, research, writing, and operations workflows across both Claude Code and the Claude desktop app. Skills are organized into domain folders. Development skills include code-review, refactor, and debug patterns. Research skills cover literature-search and synthesis. Writing skills include structured draft and edit flows. Operations skills cover runbook generation and incident-response templates. The collection can be installed selectively — copy only the domain folders you need.

## Commands

Clone the repo and copy the domain folders you want:

\`\`\`bash
git clone https://github.com/alirezarezvani/claude-skills
cp -r claude-skills/dev/.claude/commands/*.md ~/.claude/commands/
cp -r claude-skills/research/.claude/commands/*.md ~/.claude/commands/
\`\`\`

Or install via the plugin marketplace:

\`\`\`
/plugin marketplace add alirezarezvani/claude-skills
\`\`\`

## Example output

After copying the code-review skill, running \`/review\` prompts Claude to check the current diff for security issues, performance problems, and style violations, returning a structured report grouped by severity with line references.`,
      },
    ],
    repoUrl: 'https://github.com/alirezarezvani/claude-skills',
    githubStars: 20465,
    capabilities: [
      {
        command: '/plugin marketplace add alirezarezvani/claude-skills',
        description: 'Install the full Alireza skill collection covering dev, research, writing, and ops workflows.',
      },
      {
        command: '/review',
        description: 'Run the code-review skill to check the current diff for security, performance, and style issues.',
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
      'A set of focused Claude Code subagents by wshobson, each packaged as a standalone ' +
      'plugin. Covers common engineering workflows such as code review, testing, and ' +
      'documentation — installable individually or as a collection.',
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

A set of focused Claude Code subagents by wshobson, each packaged as a standalone plugin in a multi-harness plugin marketplace covering 190+ agents, skills, and commands. Covers common engineering workflows including Python development, code review, test writing, and documentation generation. Each agent is scoped to one concern so they compose without interfering with each other, and you install only the ones you need.

## Commands

Install the full collection:

\`\`\`
/plugin marketplace add wshobson/agents
\`\`\`

Install specific agents:

\`\`\`
/plugin install python-development
/plugin install code-review
/plugin install test-writer
\`\`\`

## Example output

After \`/plugin install python-development\`, Claude operates in a Python-specialist mode: it prefers idiomatic patterns, checks for missing type annotations, and suggests pytest-compatible test structures for any new functions it writes.`,
      },
    ],
    repoUrl: 'https://github.com/wshobson/agents',
    githubStars: 37547,
    capabilities: [
      {
        command: '/plugin marketplace add wshobson/agents',
        description: 'Install the full wshobson agent collection (190+ agents, skills, and commands) via the Claude Code plugin marketplace.',
      },
      {
        command: '/plugin install python-development',
        description: 'Install the Python development specialist agent for idiomatic Python, type annotations, and pytest test generation.',
      },
    ],
  },

  {
    kind: 'agent',
    id: 'github-voltagent-subagents-v1',
    slug: 'github-voltagent-subagents',
    name: 'VoltAgent 100+ Subagents',
    tagline: '100+ installable subagents across ten categories.',
    description:
      'A curated collection of over 100 Claude Code subagents organized across ten categories ' +
      'including frontend, backend, DevOps, security, and data. Each agent is independently ' +
      'installable via the Claude Code plugin system.',
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

Over 100 Claude Code subagents curated by the VoltAgent team and organized across ten categories: frontend, backend, DevOps, security, data, testing, documentation, architecture, AI/ML, and operations. Each agent is an independent markdown file you drop into \`~/.claude/agents/\` and it is immediately available in every Claude Code session. The repo is updated regularly with new specialists; categories are structured so you can install only the domains you work in.

## Commands

Clone the repo and copy the agent categories you need:

\`\`\`bash
git clone https://github.com/VoltAgent/awesome-claude-code-subagents
cp awesome-claude-code-subagents/agents/frontend/*.md ~/.claude/agents/
cp awesome-claude-code-subagents/agents/security/*.md ~/.claude/agents/
\`\`\`

Invoke installed agents in Claude Code:

- \`@react-specialist\` — React component architecture and hooks
- \`@security-auditor\` — security review and vulnerability triage

## Example output

\`@security-auditor please review my auth module\` returns a prioritized list of vulnerabilities with file-and-line references, severity ratings, and specific remediation suggestions — organized from critical to informational.`,
      },
    ],
    repoUrl: 'https://github.com/VoltAgent/awesome-claude-code-subagents',
    githubStars: 22908,
    capabilities: [
      {
        command: '@react-specialist',
        description: 'Invoke the React specialist subagent for component architecture, hooks, and state management guidance.',
      },
      {
        command: '@security-auditor',
        description: 'Invoke the security auditor subagent to review code for vulnerabilities with severity ratings and remediation steps.',
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
      'Production subagents from contains.studio, shared as-is from their internal engineering ' +
      'setup. Covers tasks their team runs repeatedly — code review, migration checks, and ' +
      'documentation — with the rough edges of real production use included.',
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

Production subagents from contains.studio shared directly from their internal engineering setup. Covers the tasks their team runs repeatedly: opinionated code review with style enforcement, database migration safety checks, and API documentation generation. These agents reflect real production use — including edge cases and guardrails the team encountered and patched over time — rather than idealized examples.

## Commands

Clone and copy agents into your \`.claude/agents/\` directory:

\`\`\`bash
git clone https://github.com/contains-studio/agents
cp contains-studio/agents/*.md ~/.claude/agents/
\`\`\`

Invoke agents in Claude Code:

- \`@code-reviewer\` — opinionated review matching contains.studio's internal style guide
- \`@migration-checker\` — check database migrations for irreversible changes and missing indexes

## Example output

\`@code-reviewer\` on a pull request returns: "Line 47: avoid mutating the prop directly — use a local copy. Line 83: this fetch has no error boundary — wrap in try/catch. Overall verdict: approve after fixes."`,
      },
    ],
    repoUrl: 'https://github.com/contains-studio/agents',
    githubStars: 12399,
    capabilities: [
      {
        command: '@code-reviewer',
        description: 'Invoke the contains.studio code reviewer for opinionated style-guide-aware code review with line-level comments.',
      },
      {
        command: '@migration-checker',
        description: 'Invoke the migration checker to flag irreversible database changes, missing indexes, and unsafe defaults.',
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
      'A set of coordinated Claude subagents that function as a development team: separate ' +
      'agents handle planning, implementation, testing, and review, with an orchestrator ' +
      'directing the workflow.',
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

A set of coordinated Claude subagents that function as an AI development team with a tech-lead orchestrator at the top. The orchestrator breaks a feature request into steps and routes each step to the appropriate specialist — planner, implementer, tester, or reviewer — then assembles the results into a coherent output. This separation prevents any one agent from drifting out of its lane while keeping the overall workflow coordinated across the full development cycle.

## Commands

Clone the repo and install the agents:

\`\`\`bash
git clone https://github.com/vijaythecoder/awesome-claude-agents
cp awesome-claude-agents/.claude/agents/*.md ~/.claude/agents/
\`\`\`

Start a feature with the orchestrator:

\`\`\`
@tech-lead build a user authentication module with JWT refresh tokens
\`\`\`

## Example output

\`@tech-lead\` breaks the request into four tasks, dispatches \`@planner\` to write a design doc, \`@implementer\` to write the code, \`@tester\` to write tests, and \`@reviewer\` to check the diff — then returns a summary with all four outputs linked and any blocking issues flagged.`,
      },
    ],
    repoUrl: 'https://github.com/vijaythecoder/awesome-claude-agents',
    githubStars: 4329,
    capabilities: [
      {
        command: '@tech-lead',
        description: 'Invoke the tech-lead orchestrator to break a feature request into steps and coordinate planner, implementer, tester, and reviewer agents.',
      },
      {
        command: '@implementer',
        description: 'Invoke the implementer agent directly to write code for a scoped task handed off from the tech-lead.',
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
      'Claude Code subagents from lst97 covering the full web stack — frontend, backend, ' +
      'database, and deployment. Each agent is scoped to one layer and can be combined for ' +
      'end-to-end feature work.',
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

Claude Code subagents from lst97 covering all four layers of a web stack. The frontend agent understands component architecture and state management. The backend agent handles API design, validation, and business logic. The database agent covers schema design, migrations, and query optimization. The deployment agent generates CI configs and Dockerfile templates. Agents can be invoked independently for single-layer work or chained together for end-to-end feature delivery.

## Commands

Clone and install the agents:

\`\`\`bash
git clone https://github.com/lst97/claude-code-sub-agents
cp claude-code-sub-agents/agents/*.md ~/.claude/agents/
\`\`\`

Invoke layer-specific agents in Claude Code:

- \`@frontend-agent\` — React/Vue component and state management
- \`@backend-agent\` — REST/GraphQL API design and implementation
- \`@database-agent\` — schema design, migrations, and query optimization
- \`@deployment-agent\` — CI/CD configs and Dockerfile generation

## Example output

\`@database-agent add a posts table with soft-delete\` returns a migration file with \`created_at\`, \`updated_at\`, and \`deleted_at\` columns, an index on \`deleted_at\`, and a scoped query helper that excludes soft-deleted rows by default.`,
      },
    ],
    repoUrl: 'https://github.com/lst97/claude-code-sub-agents',
    githubStars: 1606,
    capabilities: [
      {
        command: '@frontend-agent',
        description: 'Invoke the frontend specialist agent for React/Vue component architecture and state management tasks.',
      },
      {
        command: '@database-agent',
        description: 'Invoke the database agent for schema design, migration generation, and query optimization.',
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
      'Subagents specialized for offensive security work: reconnaissance, vulnerability ' +
      'scanning, exploit research, and report generation. Built for security professionals ' +
      'doing authorized penetration testing.',
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

Subagents specialized for authorized penetration testing across the standard pentest phases: passive and active reconnaissance, service enumeration, vulnerability scanning, exploit research, and structured report generation. Built for security professionals doing authorized testing on systems they own or have written permission to assess. Agents encode common methodology patterns from frameworks such as OWASP Testing Guide and PTES, and include guardrails that scope actions to authorized targets only.

## Commands

Clone and install the agents:

\`\`\`bash
git clone https://github.com/0xSteph/pentest-ai-agents
cp pentest-ai-agents/agents/*.md ~/.claude/agents/
\`\`\`

Invoke phase-specific agents in Claude Code:

- \`@recon-agent\` — passive and active reconnaissance on an authorized target
- \`@vuln-scanner\` — structured vulnerability enumeration from gathered data
- \`@report-writer\` — generate a structured pentest report from agent findings

## Example output

\`@recon-agent target example.com\` returns a structured brief covering DNS records, open ports from Shodan, identified tech stack, and a prioritized attack surface list — scoped to passive techniques only, with active probing gated behind an explicit confirmation prompt.`,
      },
    ],
    repoUrl: 'https://github.com/0xSteph/pentest-ai-agents',
    githubStars: 1947,
    capabilities: [
      {
        command: '@recon-agent',
        description: 'Invoke the recon agent to run passive and active reconnaissance on an authorized target and produce an attack-surface brief.',
      },
      {
        command: '@report-writer',
        description: 'Invoke the report-writer agent to compile agent findings into a structured penetration testing report.',
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
      'Twelve Claude subagents representing distinct engineering roles (architect, frontend, ' +
      'backend, QA, etc.) plus a set of git hooks and helper scripts that wire them into ' +
      'a coordinated local development team.',
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

Twelve Claude subagents representing distinct engineering roles — architect, tech-lead, frontend, backend, QA, DevOps, database, security, performance, documentation, product-manager, and code-reviewer — plus a set of git hooks and helper scripts that wire them into a coordinated local development team. A pre-commit hook fires the QA agent before every commit to check for missing tests; a post-merge hook can trigger the architect agent for impact assessment on large diffs.

## Commands

Clone and set up the dev team:

\`\`\`bash
git clone https://github.com/NYCU-Chung/my-claude-devteam
cp my-claude-devteam/agents/*.md ~/.claude/agents/
cp my-claude-devteam/hooks/* .git/hooks/
chmod +x .git/hooks/*
\`\`\`

Invoke role-based agents in Claude Code:

- \`@architect\` — system design, ADR authoring, and impact assessment
- \`@qa-agent\` — test coverage analysis and edge-case identification

## Example output

On every \`git commit\`, the pre-commit hook fires \`@qa-agent\` which scans the staged diff, identifies uncovered paths, and blocks the commit with a list of missing test cases — releasing it once coverage meets the project threshold.`,
      },
    ],
    repoUrl: 'https://github.com/NYCU-Chung/my-claude-devteam',
    githubStars: 268,
    capabilities: [
      {
        command: '@architect',
        description: 'Invoke the architect agent for system design decisions, ADR authoring, and large-diff impact assessment.',
      },
      {
        command: '@qa-agent',
        description: 'Invoke the QA agent (also triggered by pre-commit hook) to check test coverage and identify edge cases in staged changes.',
      },
    ],
  },

  // ── Harnesses (9) ───────────────────────────────────────────────────────────

  {
    kind: 'harness',
    id: 'github-gstack-v1',
    slug: 'github-gstack',
    name: 'gstack',
    tagline: 'Garry Tan\'s Claude Code setup as a full engineering team of role commands.',
    description:
      'Garry Tan\'s personal Claude Code configuration, published as a reusable harness. ' +
      'Defines a set of role-based slash commands (architect, engineer, reviewer, etc.) that ' +
      'collectively behave like a small engineering team working in a single repo.',
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

Garry Tan's personal Claude Code configuration published as a reusable harness. Defines a set of role-based slash commands — architect, engineer, reviewer, and shipper — that collectively behave like a small engineering team working in a single repo. Each command carries a focused system context so Claude switches perspective cleanly: architect thinks in systems and trade-offs, engineer writes implementation, reviewer hunts for bugs, shipper prepares the deployment checklist.

## Commands

Clone and install:

\`\`\`bash
git clone https://github.com/garrytan/gstack
cp gstack/.claude/commands/*.md ~/.claude/commands/
cp gstack/CLAUDE.md ./CLAUDE.md  # adapt project-specific fields
\`\`\`

Invoke role commands in Claude Code:

- \`/architect\` — design a system or propose an architecture change
- \`/engineer\` — implement a feature or fix with engineering judgment
- \`/reviewer\` — review the current diff for correctness and style issues

## Example output

\`/architect design a rate limiter for our API\` returns a design doc with two options (token bucket vs sliding window), a recommendation with trade-off reasoning, and the three files that would need to change to implement the preferred approach.`,
      },
    ],
    repoUrl: 'https://github.com/garrytan/gstack',
    githubStars: 119663,
    capabilities: [
      {
        command: '/architect',
        description: 'Switch to the architect role to design systems, evaluate trade-offs, and propose architecture changes.',
      },
      {
        command: '/reviewer',
        description: 'Switch to the reviewer role to check the current diff for bugs, style issues, and correctness problems.',
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
      'A multi-agent orchestration harness, formerly known as claude-flow, that coordinates ' +
      'parallel Claude agents as a swarm. Manages task distribution, inter-agent communication, ' +
      'and result aggregation for large parallel workloads.',
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

A multi-agent orchestration harness formerly known as claude-flow. Coordinates parallel Claude agents as a swarm: tasks are decomposed into independent units, distributed across agents running in parallel, and aggregated into a unified result. Also implements the SPARC workflow (Specification, Pseudocode, Architecture, Refinement, Completion) for structured agentic development on complex tasks. Best suited for large parallel workloads — refactors across many files, generating documentation at scale — where sequential execution would be too slow.

## Commands

Install globally with npm:

\`\`\`bash
npm install -g ruflo
\`\`\`

Run a swarm on a task:

\`\`\`bash
ruflo swarm "implement a CRUD API for a blog with posts and comments"
\`\`\`

Use the SPARC structured workflow:

\`\`\`bash
ruflo sparc "build a user authentication service"
\`\`\`

## Example output

\`ruflo swarm "add dark mode to the UI"\` fans out to three parallel agents — one updating CSS variables, one updating component toggle logic, one updating the theme switcher component — then merges the three diffs into a single coherent change ready for review.`,
      },
    ],
    repoUrl: 'https://github.com/ruvnet/ruflo',
    githubStars: 63130,
    capabilities: [
      {
        command: 'ruflo swarm',
        description: 'Decompose a task and fan it out across parallel Claude agents, then aggregate the results into a unified output.',
      },
      {
        command: 'ruflo sparc',
        description: 'Run the SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) structured workflow on a complex task.',
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
      'A configuration framework that extends Claude Code with a structured set of slash ' +
      'commands, specialist personas, and development methodologies. Covers common engineering ' +
      'workflows and provides a consistent project-level setup.',
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

A configuration framework that extends Claude Code with structured slash commands, specialist personas, and development methodologies. Adds \`/implement\` for guided feature work, \`/build\` for project scaffolding, \`/design\` for architecture documents, and \`/analyze\` for code review. Personas (--architect, --frontend, --backend, --security) shift Claude's focus and communication style for the task at hand. Installed by a Python script that copies CLAUDE.md and command files into your project.

## Commands

Install with pipx:

\`\`\`bash
pipx install superclaude
superclaude install
\`\`\`

Use the framework commands in Claude Code:

- \`/implement add a rate limiter\` — step-by-step guided feature implementation
- \`/build --react new-project\` — scaffold a new React project with conventions
- \`/design --architect microservice layout\` — produce an architecture document

## Example output

\`/implement add JWT refresh tokens\` produces a step-by-step plan, then generates the middleware, route handlers, and test files sequentially — checking for conflicts with existing auth code at each step and pausing for confirmation before writing each file.`,
      },
    ],
    repoUrl: 'https://github.com/SuperClaude-Org/SuperClaude_Framework',
    githubStars: 23489,
    capabilities: [
      {
        command: '/implement',
        description: 'Run the guided implementation command to build a feature step-by-step with conflict checks at each stage.',
      },
      {
        command: '/build',
        description: 'Scaffold a new project with SuperClaude conventions (e.g. /build --react new-project).',
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
      'A Claude Code project management harness that uses GitHub Issues as a task board and ' +
      'git worktrees to run multiple agents on separate tasks in parallel. Designed for ' +
      'multi-agent projects where tasks need clear isolation and tracking.',
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

A Claude Code project management harness that uses GitHub Issues as a task board and git worktrees to run multiple agents on separate tasks in parallel. Each open GitHub Issue labeled for Claude becomes a task; CCPM creates a dedicated worktree for it, launches an agent, and closes the issue automatically when the agent completes. Designed for multi-agent projects where task isolation, audit trails in the issue tracker, and parallel throughput all matter.

## Commands

Install and configure:

\`\`\`bash
git clone https://github.com/automazeio/ccpm
cd ccpm && npm install
cp .env.example .env  # add GITHUB_TOKEN and repository details
\`\`\`

Run the project manager:

\`\`\`bash
npm run ccpm start    # pick up open issues and dispatch agents
npm run ccpm status   # show current worktree and agent status
\`\`\`

## Example output

\`npm run ccpm start\` reads open GitHub Issues labeled \`claude-code\`, creates a worktree for each one, and logs: "Started agent for issue #12 (Add dark mode) in worktree ./worktrees/issue-12." Issues close automatically with a completion comment once each agent finishes.`,
      },
    ],
    repoUrl: 'https://github.com/automazeio/ccpm',
    githubStars: 8244,
    capabilities: [
      {
        command: 'npm run ccpm start',
        description: 'Pick up open GitHub Issues labeled for Claude, create git worktrees, and dispatch agents to work on each task in parallel.',
      },
      {
        command: 'npm run ccpm status',
        description: 'Show the current status of all active worktrees and the agents running inside them.',
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
      'GitHub\'s Spec-Driven Development toolkit. Provides a structured workflow for writing ' +
      'specifications before implementation, then generating and validating code against those ' +
      'specs. Works across Claude, GPT, and other models.',
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

GitHub's Spec-Driven Development toolkit. Enforces a four-stage workflow — write a specification, generate a plan from it, break the plan into tasks, then implement — with each stage gating the next. Implementation cannot begin until a spec and plan are approved. Works across Claude, GPT, and other instruction-following models. Reduces drift between intent and output by keeping a traceable chain from requirement to code.

## Commands

Clone and install the command files:

\`\`\`bash
git clone https://github.com/github/spec-kit
cp spec-kit/.claude/commands/*.md ~/.claude/commands/
\`\`\`

Run the SDD workflow in Claude Code:

- \`/spec write\` — author a specification document for the feature
- \`/spec plan\` — generate an implementation plan traceable to spec requirements
- \`/spec tasks\` — break the plan into atomic, independently executable tasks
- \`/spec implement\` — implement the next open task from the task list

## Example output

\`/spec write add a CSV export to the reports page\` produces a structured spec with functional requirements, explicit out-of-scope items, and a definition of done. \`/spec plan\` then generates a five-step implementation plan with each step linked back to the originating requirement.`,
      },
    ],
    repoUrl: 'https://github.com/github/spec-kit',
    githubStars: 118142,
    capabilities: [
      {
        command: '/spec write',
        description: 'Author a specification document for a feature, including requirements, out-of-scope items, and a definition of done.',
      },
      {
        command: '/spec implement',
        description: 'Implement the next open task from the approved spec plan, gated by prior write and plan stages.',
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
      'The Breakthrough Method for Agile AI-Driven Development. An agent-agnostic methodology ' +
      'that applies agile principles to AI-assisted development: stories, sprints, personas, ' +
      'and retrospectives adapted for working with LLM agents.',
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

The Breakthrough Method for Agile AI-Driven Development. An agent-agnostic methodology that applies agile principles to AI-assisted development: user stories, sprint planning, persona-based agent prompts, and retrospectives adapted for LLM workflows. Provides persona prompt files (Product Manager, Architect, Developer, QA Lead) and a process document explaining how to run a sprint with AI agents. Works with Claude, GPT, Gemini, or any instruction-following model.

## Commands

Clone and install the personas and commands:

\`\`\`bash
git clone https://github.com/bmad-code-org/BMAD-METHOD
cp BMAD-METHOD/.claude/commands/*.md ~/.claude/commands/
cp BMAD-METHOD/.claude/agents/*.md ~/.claude/agents/
\`\`\`

Run BMAD workflows in Claude Code:

- \`/bmad sprint-plan\` — create a sprint plan from a backlog of user stories
- \`/bmad story\` — break a story into tasks with acceptance criteria and an estimate

## Example output

\`/bmad story "add dark mode to the settings page"\` returns a user story with three acceptance criteria, a two-point story-point estimate, and four implementation tasks — formatted as a GitHub Issue body ready to paste directly into the tracker.`,
      },
    ],
    repoUrl: 'https://github.com/bmad-code-org/BMAD-METHOD',
    githubStars: 50095,
    capabilities: [
      {
        command: '/bmad sprint-plan',
        description: 'Create a sprint plan from a backlog of user stories using the BMAD agile methodology.',
      },
      {
        command: '/bmad story',
        description: 'Break a user story into tasks with acceptance criteria, a point estimate, and a GitHub Issue-ready format.',
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
      'A collection of practical Claude Code workflows and configuration files from OneRedOak. ' +
      'Covers common project setup patterns, CLAUDE.md templates, and shell helpers for ' +
      'day-to-day development tasks.',
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

A grab-bag of practical Claude Code workflows, CLAUDE.md templates, and shell helpers from OneRedOak. Includes a design-review workflow that checks a proposed UI change against design-system rules, CLAUDE.md starter templates for React, Node, and Python projects, and shell helpers for common git tasks. Intended as a pick-what-you-need toolkit rather than a prescriptive framework — copy only the pieces that fit your project.

## Commands

Clone and copy what you need:

\`\`\`bash
git clone https://github.com/OneRedOak/claude-code-workflows
cp claude-code-workflows/CLAUDE-templates/react.md ./CLAUDE.md
cp claude-code-workflows/.claude/commands/*.md ~/.claude/commands/
\`\`\`

Invoke workflows in Claude Code:

- \`/design-review\` — check a UI change against design-system tokens and WCAG rules
- \`/project-init\` — scaffold a CLAUDE.md for a new project from the appropriate template

## Example output

\`/design-review\` on a new button component checks that color values match the design-token list, spacing uses the 4-px grid, and focus states meet WCAG 2.2 AA contrast — then returns a pass/fail report with specific token replacements for any failing values.`,
      },
    ],
    repoUrl: 'https://github.com/OneRedOak/claude-code-workflows',
    githubStars: 3866,
    capabilities: [
      {
        command: '/design-review',
        description: 'Check a UI change against design-system tokens and WCAG 2.2 AA contrast rules, with a pass/fail report.',
      },
      {
        command: '/project-init',
        description: 'Scaffold a CLAUDE.md for a new project using the React, Node, or Python template from the collection.',
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
      'A Claude Code harness implementing a four-stage spec-driven workflow: requirements ' +
      'capture, design, task breakdown, and implementation. Each stage gates the next, ' +
      'keeping the agent on track through structured documents.',
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

A Claude Code harness implementing a four-stage spec-driven workflow: requirements capture with \`/spec-create\`, design, task breakdown, and implementation. Each stage writes a document to disk and gates the next stage — the agent cannot start writing code before a spec exists, and cannot begin implementation before tasks are broken down and confirmed. The npm package installs the slash commands globally so they work in any Claude Code project without per-project setup.

## Commands

Install globally with npm:

\`\`\`bash
npm i -g @pimzino/claude-code-spec-workflow
\`\`\`

Then in any Claude Code session:

- \`/spec-create add a password reset flow\` — capture requirements and write a spec document to disk
- \`/spec-execute\` — read the spec document and run through design, task breakdown, and implementation stages sequentially

## Example output

\`/spec-create add a password reset flow\` generates \`specs/password-reset.md\` with functional requirements, out-of-scope items, and a definition of done. \`/spec-execute\` reads that file, produces a design doc, breaks the work into six atomic tasks, and implements them one at a time with a confirmation prompt between each stage.`,
      },
    ],
    repoUrl: 'https://github.com/Pimzino/claude-code-spec-workflow',
    githubStars: 3786,
    capabilities: [
      {
        command: '/spec-create',
        description: 'Capture requirements for a feature and write a structured spec document to disk before any design or implementation begins.',
      },
      {
        command: '/spec-execute',
        description: 'Read the existing spec document and run through design, task breakdown, and implementation stages sequentially with gating between each.',
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
      'A lightweight kit of custom slash commands, git hooks, and shell utilities for Claude ' +
      'Code by Carl Rannaberg. Focused on small, composable helpers rather than a full ' +
      'framework — drop in only what you need.',
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

A lightweight kit of custom slash commands, git hooks, and shell utilities for Claude Code by Carl Rannaberg. Focused on small, composable helpers rather than a full framework: \`/spec-workflow\` runs a spec-to-implementation pipeline, \`/codebase-map\` generates a structured map of the project that Claude reads at session start for fast navigation, and a file-guard hook prevents Claude from writing outside designated directories. Drop in only the pieces you need — nothing is mandatory.

## Commands

Clone and run the installer:

\`\`\`bash
git clone https://github.com/carlrannaberg/claudekit
cd claudekit && ./install.sh  # copies selected commands and hooks to ~/.claude/
\`\`\`

Available commands in Claude Code:

- \`/spec-workflow\` — run a spec-to-implementation pipeline gated by user confirmation
- \`/codebase-map\` — generate a structured project map for Claude's session context
- file-guard hook — installed via \`./install.sh\`, blocks writes outside allowed directories

## Example output

\`/codebase-map\` produces a markdown file listing every module, its purpose, and its key exports — which Claude reads at session start to navigate the project without exploring file by file. \`/spec-workflow "add rate limiting"\` writes \`spec-rate-limiting.md\`, awaits confirmation, then implements the feature following the approved spec.`,
      },
    ],
    repoUrl: 'https://github.com/carlrannaberg/claudekit',
    githubStars: 732,
    capabilities: [
      {
        command: '/codebase-map',
        description: 'Generate a structured project map (modules, purposes, key exports) for Claude to read at session start instead of exploring file by file.',
      },
      {
        command: '/spec-workflow',
        description: 'Run a spec-to-implementation pipeline: write spec to disk, await confirmation, then implement following the approved spec.',
      },
    ],
  },
];
