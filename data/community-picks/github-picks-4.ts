import type { Setup } from '@/lib/setup/types';

const CREATED_AT = '2026-07-07T00:00:00.000Z';

export const githubPicks4: Setup[] = [
  // ── MCP servers, agent tools, and hook libraries (11) ────────────────────────

  {
    kind: 'harness',
    id: 'github-mcp-servers-v1',
    slug: 'github-mcp-servers',
    name: 'MCP Reference Servers',
    tagline: 'Anthropic\'s official reference MCP server implementations: Filesystem, Git, Memory, and more.',
    description:
      'The reference MCP server implementations maintained by the MCP steering group. ' +
      'Includes Filesystem, Git, Memory (knowledge graph), Sequential Thinking, Fetch, ' +
      'Time, and Everything servers — each an educational reference implementation showing ' +
      'how to build an MCP server, not a production-ready solution. Install any server in ' +
      'seconds via npx or uvx.',
    role: 'general',
    industry: null,
    tags: ['mcp', 'anthropic', 'official', 'memory', 'filesystem', 'git', 'claude-code'],
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

The MCP Reference Servers repository hosts the small set of reference implementations maintained by the MCP steering group. Each server is designed as an educational example for developers building their own MCP servers — the README explicitly notes they are not production-ready solutions.

Active reference servers:
- **Memory** — knowledge graph-based persistent memory using a local JSONL store
- **Filesystem** — secure file read/write with configurable access controls on a scoped directory
- **Git** — read, search, and manipulate git repositories via MCP tools
- **Sequential Thinking** — dynamic problem-solving through chained thought sequences
- **Fetch** — retrieve and convert web content for LLM consumption
- **Time** — time and timezone conversion tools
- **Everything** — reference/test server demonstrating prompts, resources, and tools in one package

Many formerly included servers (GitHub, Slack, PostgreSQL, Puppeteer, Google Drive, etc.) have been archived to a separate repo as of 2025.

## Install

TypeScript-based servers run directly with npx; Python-based servers use uvx or pip.

npx -y @modelcontextprotocol/server-memory

uvx mcp-server-git

## Wire into Claude Code

Add to claude_desktop_config.json or .claude/settings.json under mcpServers:

memory: command npx, args [-y, @modelcontextprotocol/server-memory]

git: command uvx, args [mcp-server-git, --repository, path/to/repo]

filesystem: command npx, args [-y, @modelcontextprotocol/server-filesystem, /path/to/allowed/files]

## When to use

Use these servers as working references when building your own MCP server — study how they handle tool registration, error handling, and stdio transport. For production use, look for maintained forks or purpose-built alternatives. The Memory server is genuinely useful for cross-session context; the Filesystem and Git servers are solid for local development.
`,
      },
    ],
    repoUrl: 'https://github.com/modelcontextprotocol/servers',
    githubStars: 50000,
    capabilities: [
      {
        command: 'npx -y @modelcontextprotocol/server-memory',
        description: 'Start the Memory MCP server, which persists entities and relations as a knowledge graph in a local JSONL file.',
      },
      {
        command: 'uvx mcp-server-git',
        description: 'Start the Git MCP server (Python), exposing git log, diff, and repo-manipulation queries as agent-callable tools.',
      },
      {
        command: 'npx -y @modelcontextprotocol/server-filesystem /path/to/dir',
        description: 'Start the Filesystem MCP server, giving the agent read/write access scoped to the specified directory.',
      },
      {
        command: 'npx -y @modelcontextprotocol/server-fetch',
        description: 'Start the Fetch MCP server, which retrieves and converts web content into LLM-friendly text.',
      },
      {
        command: 'npx -y @modelcontextprotocol/server-sequentialthinking',
        description: 'Start the Sequential Thinking MCP server, which exposes a structured multi-step reasoning tool.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-context7-v1',
    slug: 'github-context7',
    name: 'Context7 MCP',
    tagline: 'Pulls version-specific library docs into Claude\'s context on demand — no more stale API answers.',
    description:
      'An MCP server by Upstash that fetches current, version-pinned library documentation ' +
      'into the agent\'s context when needed. Eliminates the stale-training-data problem ' +
      'for fast-moving libraries: Claude answers with the real API as it exists today. ' +
      'Ships two integration modes — MCP (native tool calls) and CLI+Skills (ctx7 CLI ' +
      'commands, more token-efficient). Works with Claude Code, Cursor, and others.',
    role: 'general',
    industry: null,
    tags: ['mcp', 'documentation', 'context', 'claude-code', 'upstash', 'library-docs'],
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

Context7 resolves library documentation at request time against a live index of versioned package docs. When you append "use context7" to a prompt, or ask about a library in a session where a Context7 rule is configured, the tool fetches current docs and injects them before Claude composes its answer. The result is answers grounded in the real, current API rather than training-cutoff knowledge.

Two integration modes:
- **MCP mode** — registers a Context7 MCP server; Claude calls \`resolve-library-id\` and \`query-docs\` natively as tool calls
- **CLI+Skills mode** — installs the \`ctx7\` CLI and a skill that guides Claude to call \`ctx7 library\` and \`ctx7 docs\` commands; more token-efficient than MCP for coding agents

## Install

The fastest setup path is the interactive CLI, which authenticates via OAuth, generates an API key, and installs the appropriate mode:

npx ctx7 setup

To target Claude Code specifically: npx ctx7 setup --claude

To configure the MCP server manually in Claude Code:
claude mcp add --transport http context7 https://mcp.context7.com/mcp

A free API key (higher rate limits) is available at context7.com/dashboard. Pass it via the CONTEXT7_API_KEY header.

## MCP tools (MCP mode)

resolve-library-id — resolves a library name to a Context7-compatible ID (e.g. /vercel/next.js)

query-docs — fetches documentation for a library ID filtered to a specific query

## CLI commands (CLI+Skills mode)

ctx7 library <name> <query> — search the index by name and return matching library IDs

ctx7 docs <libraryId> <query> — retrieve documentation for a library

## When to use

Append "use context7" to any prompt asking about a library API or SDK — especially for fast-moving packages like Next.js, React, or Supabase where training data is quickly outdated. Add a CLAUDE.md rule to trigger it automatically without explicit prompting.
`,
      },
    ],
    repoUrl: 'https://github.com/upstash/context7',
    githubStars: 30000,
    capabilities: [
      {
        command: 'npx ctx7 setup --claude',
        description: 'Interactive setup: authenticates via OAuth, generates an API key, and installs Context7 for Claude Code in either MCP or CLI+Skills mode.',
      },
      {
        command: 'claude mcp add --transport http context7 https://mcp.context7.com/mcp',
        description: 'Manually register the hosted Context7 MCP HTTP endpoint in Claude Code — no local install needed.',
      },
      {
        command: 'resolve-library-id',
        description: 'MCP tool that resolves a general library name (e.g. "next.js") to a Context7-compatible library ID for use in query-docs.',
      },
      {
        command: 'query-docs',
        description: 'MCP tool that fetches up-to-date documentation for a library by its Context7 ID, filtered to a specific query.',
      },
      {
        command: 'ctx7 docs <libraryId> <query>',
        description: 'CLI command (Skills mode) that retrieves documentation for a library ID, called by the installed skill instead of MCP tools.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-playwright-mcp-v1',
    slug: 'github-playwright-mcp',
    name: 'Playwright MCP',
    tagline: 'Microsoft\'s official Playwright MCP server — 40+ browser-automation tools via accessibility-tree snapshots.',
    description:
      'The official Playwright MCP server from Microsoft, giving Claude Code 68 browser-automation ' +
      'tools that operate on the page\'s accessibility tree — no vision model needed. Covers ' +
      'navigation, clicks, form fill, keyboard input, screenshots, and network inspection. ' +
      'For high-throughput coding agents, Microsoft also offers a token-efficient Playwright CLI ' +
      'with Skills as an alternative to MCP.',
    role: 'general',
    industry: null,
    tags: ['mcp', 'playwright', 'browser-automation', 'testing', 'microsoft', 'e2e', 'claude-code'],
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

The Playwright MCP server from Microsoft exposes browser automation as 68 MCP tools Claude Code can call during a session. It operates on the page's accessibility tree rather than pixel snapshots, so no vision model is needed and tool calls are deterministic. Requires Node.js 18+.

Microsoft notes that for coding agents focused on test-writing and codebase work, their separate Playwright CLI with Skills (github.com/microsoft/playwright-cli) is more token-efficient, since it avoids loading large tool schemas and accessibility trees into the context window. The MCP server is better suited for exploratory automation, self-healing tests, and long-running agentic workflows.

## Key tools

browser_navigate — navigate to a URL

browser_click — click an element by accessibility selector or snapshot reference

browser_type — type text into an editable element

browser_fill_form — fill multiple form fields in one call

browser_take_screenshot — capture the current page as an image

browser_snapshot — return the current page's accessibility tree as structured data (use this for actions, not browser_take_screenshot)

browser_evaluate — run JavaScript in the page context

browser_press_key — press a keyboard key or chord

browser_select_option — select an option from a dropdown

browser_console_messages — return browser console output

## Install

Add to your MCP client config (claude_desktop_config.json or .claude/settings.json):

mcpServers > playwright > command: npx, args: [@playwright/mcp@latest]

Or register via Claude Code CLI:
claude mcp add playwright -- npx @playwright/mcp@latest

## When to use

Use Playwright MCP when you want Claude to drive a browser autonomously — testing UI flows, scraping structured data, or automating multi-step web tasks. Prefer CLI+Skills if you are mostly writing Playwright test code and want to conserve context window space.
`,
      },
    ],
    repoUrl: 'https://github.com/microsoft/playwright-mcp',
    githubStars: 20000,
    capabilities: [
      {
        command: 'npx @playwright/mcp@latest',
        description: 'Launch the Playwright MCP server, which registers 68 browser automation tools for Claude Code to call.',
      },
      {
        command: 'browser_navigate',
        description: 'MCP tool that navigates to a given URL in the controlled browser.',
      },
      {
        command: 'browser_click',
        description: 'MCP tool that clicks an element identified by its accessibility-tree reference or a CSS selector.',
      },
      {
        command: 'browser_type',
        description: 'MCP tool that types text into an editable element identified by its accessibility-tree reference.',
      },
      {
        command: 'browser_snapshot',
        description: 'MCP tool that returns the page\'s current accessibility tree as structured data — use this (not the screenshot) when selecting elements for subsequent actions.',
      },
      {
        command: 'browser_take_screenshot',
        description: 'MCP tool that captures the current page as an image file for visual inspection.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-exa-mcp-v1',
    slug: 'github-exa-mcp',
    name: 'Exa MCP Server',
    tagline: 'Exa\'s official MCP server: web search, research-paper search, company research, and URL crawling.',
    description:
      'The official Exa MCP server giving Claude Code access to Exa\'s semantic search ' +
      'and crawling API. Core tools: web_search_exa for general queries and web_fetch_exa ' +
      'for specific URLs; web_search_advanced_exa (off by default) adds domain/date filters ' +
      'and category targeting. Available as a hosted HTTP endpoint — no local install needed.',
    role: 'general',
    industry: null,
    tags: ['mcp', 'exa', 'search', 'research', 'web-crawl', 'claude-code'],
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

The Exa MCP server wraps Exa's semantic search and crawling API as MCP tools Claude Code can call mid-session. The primary interface is the hosted HTTP endpoint — no local install required. An Exa API key is optional for low-volume use; get one free at dashboard.exa.ai/api-keys for higher rate limits.

## Active tools (enabled by default)

web_search_exa — semantic web search returning clean, ready-to-use content for any topic

web_fetch_exa — retrieve the full content of a specific URL

## Optional tools (enable via query parameter)

web_search_advanced_exa — advanced web search with domain filters (includeDomains/excludeDomains), date ranges (startPublishedDate/endPublishedDate), category targeting (company, news, research paper, people, personal site, financial report), and result count tuning. Enable via: https://mcp.exa.ai/mcp?tools=web_search_advanced_exa

Exa Agent tools (agent_create_run, agent_wait_for_run, agent_get_run_output, agent_cancel_run) — async multi-step research runs. Enable via: https://mcp.exa.ai/mcp?tools=agent_tools

Note: older tools (company_research_exa, crawling_exa, people_search_exa, research_paper_search, get_code_context_exa) are deprecated — use web_search_exa or web_search_advanced_exa with the matching category instead.

## Install

Claude Code (hosted endpoint, no API key required for basic use):
claude mcp add --transport http exa https://mcp.exa.ai/mcp

Pass API key via the exaApiKey query param to the URL if needed, or set it in the Authorization header.

Via npm package (with API key in environment):
add to mcpServers: command npx, args [-y, exa-mcp-server], env EXA_API_KEY

## When to use

Add Exa MCP when you want Claude to search the live web, fetch specific pages, or do company/people/academic research during a session — without switching to a browser. Use web_search_advanced_exa with category: "research paper" for academic literature, category: "company" for business intelligence.
`,
      },
    ],
    repoUrl: 'https://github.com/exa-labs/exa-mcp-server',
    githubStars: 3000,
    capabilities: [
      {
        command: 'claude mcp add --transport http exa https://mcp.exa.ai/mcp',
        description: 'Register the hosted Exa MCP HTTP endpoint in Claude Code — no local process or install needed.',
      },
      {
        command: 'web_search_exa',
        description: 'MCP tool (enabled by default) that runs a semantic web search and returns clean, ready-to-use content.',
      },
      {
        command: 'web_fetch_exa',
        description: 'MCP tool (enabled by default) that fetches and extracts the full text content of a specific URL.',
      },
      {
        command: 'web_search_advanced_exa',
        description: 'MCP tool (off by default) that adds domain filters, date ranges, and category targeting (company, news, research paper, people) to web search.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-smithery-cli-v1',
    slug: 'github-smithery-cli',
    name: 'Smithery CLI',
    tagline: 'Discover, install, and configure any of 6000+ MCP servers from a central registry without hand-editing JSON.',
    description:
      'Smithery\'s official CLI for discovering and managing MCP servers and skills. ' +
      'Search a registry of thousands of servers, add one via URL, list and call individual tools, ' +
      'and publish your own server or bundle. Also surfaces the Smithery Skills Registry — ' +
      'install skills for Claude Code with a single npx command. Requires Node.js 20+.',
    role: 'general',
    industry: null,
    tags: ['mcp', 'smithery', 'cli', 'registry', 'package-manager', 'claude-code', 'devops'],
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

Smithery CLI connects coding agents to MCP servers and skills from the command line. It covers three surfaces: MCP server management (search, add by URL, list, remove), tool inspection and calling (list and invoke tools from connected servers), and skills browsing and installation.

Install globally with npm (requires Node.js 20+): npm install -g smithery@latest

## MCP server commands

smithery mcp search [term] — search the Smithery registry by keyword

smithery mcp add <url> — connect to an MCP server by its URL

smithery mcp list — list all connected MCP server connections

smithery mcp remove <ids> — remove one or more connections

smithery mcp publish <url or bundle> -n <org/server> — publish an MCP server to the registry

## Tool commands (interact with tools from connected servers)

smithery tool list [connection] — list all tools from your connected servers

smithery tool find [query] — search tools by name or intent

smithery tool get <connection> <tool> — show full details for one tool

smithery tool call <connection> <tool> [args] — call a tool with arguments

## Skills commands

npx skills add <skill> — install a skill from the Smithery Skills Registry (e.g. npx skills add smithery-ai/cli)

## Auth commands

smithery auth login — authenticate with Smithery via OAuth

smithery auth token — mint a service token for automated use

## When to use

Use Smithery CLI when you want to discover and connect to MCP servers without hand-editing JSON config files, or when you want to test-call a specific MCP tool from the command line before wiring it into an agent session.
`,
      },
    ],
    repoUrl: 'https://github.com/smithery-ai/cli',
    githubStars: 2000,
    capabilities: [
      {
        command: 'smithery mcp search [term]',
        description: 'Search the Smithery registry by keyword and return matching MCP servers.',
      },
      {
        command: 'smithery mcp add <url>',
        description: 'Connect to an MCP server by URL and register it as a named connection.',
      },
      {
        command: 'smithery mcp list',
        description: 'List all MCP server connections currently registered with the CLI.',
      },
      {
        command: 'smithery tool call <connection> <tool> [args]',
        description: 'Call a specific tool on a connected MCP server directly from the command line.',
      },
      {
        command: 'smithery tool find [query]',
        description: 'Search tools across all connected MCP servers by name or intent.',
      },
      {
        command: 'npx skills add <skill>',
        description: 'Install a skill from the Smithery Skills Registry into Claude Code.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-mem-v1',
    slug: 'github-claude-mem',
    name: 'claude-mem',
    tagline: 'Persistent memory plugin — captures every tool call and injects relevant prior context into future sessions.',
    description:
      'A Claude Code plugin that captures tool-call observations during sessions, compresses ' +
      'them into a SQLite + Chroma vector database, and injects relevant context automatically ' +
      'at the start of each new session. Three MCP search tools expose a token-efficient ' +
      '3-layer retrieval workflow: search index first, timeline for context, then full details ' +
      'by ID. Requires Node.js 20+ and Bun.',
    role: 'general',
    industry: null,
    tags: ['mcp', 'memory', 'persistence', 'claude-code', 'plugin', 'context'],
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

claude-mem is a persistent memory compression system for Claude Code. It hooks into 5 lifecycle events (SessionStart, UserPromptSubmit, PostToolUse, Stop, SessionEnd) to capture tool-call observations during a session, store them in a local SQLite database, and index them in a Chroma vector database for semantic search. At the start of each new session, the plugin injects relevant prior context automatically.

A local worker service (managed by Bun) runs as an HTTP API alongside Claude Code, providing a web viewer UI for browsing stored memories and a search API the MCP tools query.

The system uses a token-efficient 3-layer retrieval pattern:
1. search — get a compact index of matching observations (50-100 tokens per result)
2. timeline — get chronological context around interesting results
3. get_observations — fetch full details only for the IDs you filtered to (~500-1000 tokens per result)

This approach achieves roughly 10x token savings compared to fetching full observations upfront.

The plugin also supports a \<private\> tag in Claude's output to exclude sensitive content from being stored.

## Install

npx claude-mem install

Or from inside Claude Code:
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem

Restart Claude Code after installation. Requires Node.js 20+ and Bun (auto-installed if missing).

Note: npm install -g claude-mem installs the SDK library only — always use npx claude-mem install to register the plugin hooks.

## MCP tools

search — full-text search over the memory index with optional type/date/project filters; returns compact results with IDs

timeline — chronological context around a specific observation or query

get_observations — fetch full observation details by a list of IDs (batch multiple IDs for efficiency)

## When to use

Install claude-mem on any long-running project where sessions pick up where prior sessions left off — active codebases, recurring research tasks, or any project where re-explaining context at the start of each session is a significant friction point.
`,
      },
    ],
    repoUrl: 'https://github.com/thedotmack/claude-mem',
    githubStars: 2000,
    capabilities: [
      {
        command: 'npx claude-mem install',
        description: 'Install the claude-mem plugin, register its lifecycle hooks, and start the local worker service.',
      },
      {
        command: 'search',
        description: 'MCP tool: full-text search over the memory index with type/date/project filters; returns a compact ID-keyed index (~50-100 tokens per result).',
      },
      {
        command: 'timeline',
        description: 'MCP tool: retrieve chronological context around a specific observation or query to understand what was happening nearby.',
      },
      {
        command: 'get_observations',
        description: 'MCP tool: fetch full observation details by a list of IDs — always batch multiple IDs to avoid repeated round trips.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-plugins-official-v1',
    slug: 'github-claude-plugins-official',
    name: 'Anthropic Official Plugin Directory',
    tagline: 'Anthropic\'s curated directory of Claude Code plugins — internal Anthropic-built plugins plus vetted third-party partner submissions.',
    description:
      'The official Anthropic-maintained Claude Code plugin directory. ' +
      'Hosts two categories: internal plugins developed by Anthropic team members, and external ' +
      'plugins from third-party partners that meet Anthropic\'s quality and security standards. ' +
      'Plugins follow a standard structure: .claude-plugin/plugin.json manifest, optional MCP ' +
      'server config, and directories for commands, agents, and skills.',
    role: 'general',
    industry: null,
    tags: ['plugins', 'anthropic', 'official', 'lsp', 'claude-code', 'directory'],
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

The claude-plugins-official repo is the Claude Code plugin marketplace directory maintained by Anthropic. It hosts two categories of plugins:

- internal plugins — developed and maintained by Anthropic team members (see /plugins directory)
- external plugins — third-party partner contributions that have passed Anthropic's quality and security review (see /external_plugins directory)

Plugins follow a standard structure:

plugin-name/
  .claude-plugin/plugin.json   — plugin metadata (required)
  .mcp.json                    — MCP server config (optional)
  commands/                    — slash command definitions (optional)
  agents/                      — agent definitions (optional)
  skills/                      — skill definitions (optional)
  README.md

Plugin names are immutable slugs — once published, the name field cannot change without a migration entry in the renames map, since existing installs reference it. Display names can change freely.

Skill-bundle plugins (repos that ship SKILL.md files without a full plugin.json) can be included using strict: false with an explicit skills array pointing at subdirectory paths.

## Install

Browse installed plugins in Claude Code: /plugin > Discover

Install a plugin from the directory:
/plugin install {plugin-name}@claude-plugins-official

To submit an external plugin: use the plugin directory submission form at clau.de/plugin-directory-submission.

## When to use

Browse this directory when you want to extend Claude Code with vetted connectors or skills — or when you want a reference implementation of the Claude Code plugin structure to build your own plugin.
`,
      },
    ],
    repoUrl: 'https://github.com/anthropics/claude-plugins-official',
    githubStars: 3000,
    capabilities: [
      {
        command: '/plugin install {name}@claude-plugins-official',
        description: 'Install a plugin from the Anthropic official directory by its immutable slug name.',
      },
      {
        command: '/plugin > Discover',
        description: 'Browse available plugins from registered marketplaces including claude-plugins-official inside Claude Code.',
      },
      {
        command: 'plugin.json manifest',
        description: 'Standard .claude-plugin/plugin.json metadata file that defines a plugin\'s name, display name, category, and source for the Claude Code plugin loader.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-mas-sequential-thinking-v1',
    slug: 'github-mas-sequential-thinking',
    name: 'MAS Sequential Thinking',
    tagline: 'A 6-agent multi-agent sequential thinking MCP server — each agent examines a problem from a distinct cognitive angle.',
    description:
      'An advanced Sequential Thinking MCP server built on the Agno multi-agent framework. ' +
      'Every request runs through six specialized agents in parallel — Factual, Emotional, ' +
      'Critical, Optimistic, Creative, and Synthesis — then a Synthesis agent integrates ' +
      'all perspectives. Requires Python 3.10+ and an LLM API key (DeepSeek default). ' +
      'Optional Exa API key enables web research for four of the six agents.',
    role: 'general',
    industry: null,
    tags: ['mcp', 'sequential-thinking', 'multi-agent', 'reasoning', 'agno', 'claude-code'],
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

MAS Sequential Thinking replaces the standard single-chain sequential thinking MCP tool with a 6-agent panel built on the Agno framework. Every request runs the full_exploration strategy — a fixed, deterministic multi-step path — regardless of problem complexity:

1. Initial Synthesis (Synthesis agent)
2. Parallel specialist agents (Factual, Emotional, Critical, Optimistic, Creative)
3. Final Synthesis (Synthesis agent integrates all perspectives)

The six agents and their roles:
- Factual — objective facts, data verification, web research (ExaTools optional)
- Emotional — gut reactions and intuitive pattern recognition (30s quick-reaction mode)
- Critical — risk assessment, devil's advocate, counterexample research (ExaTools optional)
- Optimistic — benefits, opportunities, success story research (ExaTools optional)
- Creative — lateral thinking, cross-industry innovation research (ExaTools optional)
- Synthesis — integrates all perspectives into a coherent, actionable response

The Synthesis agent uses an enhanced model; the five specialist agents use a standard model. Four of the six agents can perform web research via optional Exa integration.

Warning: token usage is 5-10x higher than single-agent approaches due to parallel processing.

## Install

Via Smithery CLI (recommended):
npx -y @smithery/cli install @FradSer/mcp-server-mas-sequential-thinking --client claude

Requires Python 3.10+ and an LLM API key. Set in MCP config env:
LLM_PROVIDER: deepseek (default), groq, openrouter, github, anthropic, or ollama
DEEPSEEK_API_KEY (or equivalent for your chosen provider)
EXA_API_KEY (optional, enables web research for 4 agents)

## The sequentialthinking tool

The single MCP tool exposed is sequentialthinking. Parameters include thought (the current reasoning step), thoughtNumber (1-based index), totalThoughts, nextThoughtNeeded, and isRevision.

The tool returns structuredContent.should_continue — keep calling sequentialthinking in a loop until this is false.

## When to use

Use for complex architectural decisions, ambiguous design trade-offs, or any problem that benefits from multiple cognitive perspectives simultaneously. The token cost is significant; avoid for routine tasks.
`,
      },
    ],
    repoUrl: 'https://github.com/FradSer/mcp-server-mas-sequential-thinking',
    githubStars: 1000,
    capabilities: [
      {
        command: 'npx -y @smithery/cli install @FradSer/mcp-server-mas-sequential-thinking --client claude',
        description: 'Install the MAS Sequential Thinking MCP server for Claude Code via the Smithery CLI.',
      },
      {
        command: 'sequentialthinking',
        description: 'The single MCP tool exposed: routes a thought through a 6-agent parallel panel and returns synthesized analysis plus a should_continue signal for loop control.',
      },
      {
        command: 'isRevision: true',
        description: 'sequentialthinking parameter that marks a step as a revision of an earlier conclusion, allowing the agent panel to revisit and correct prior reasoning.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-dev-browser-v1',
    slug: 'github-dev-browser',
    name: 'dev-browser',
    tagline: 'Persistent browser control for Claude agents via the full Playwright API in a sandbox, with auto-connect to Chrome.',
    description:
      'A browser automation tool by sawyerhood that lets Claude Code control browsers via ' +
      'sandboxed JavaScript scripts. Scripts run in a QuickJS WASM sandbox — no host ' +
      'filesystem or network access — against persistent named pages that survive across ' +
      'script calls. Supports auto-connect to a running Chrome instance or launches ' +
      'headless Chromium. Primary interface is CLI via stdin/stdout.',
    role: 'general',
    industry: null,
    tags: ['browser-automation', 'playwright', 'plugin', 'claude-code', 'sandbox', 'testing'],
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

dev-browser is a browser automation CLI that Claude Code agents drive via stdin/stdout. Scripts run in a QuickJS WASM sandbox — meaning they have no access to the host filesystem or network — but expose the full Playwright Page API against persistent named pages. Named pages survive across script calls, so navigation state, cookies, and localStorage persist for the duration of the process.

The tool can either launch headless Chromium or connect to your already-running Chrome instance (enable remote debugging at chrome://inspect/#remote-debugging, then use --connect).

A benchmark in the repo shows dev-browser completed a standard task in 3m 53s at $0.88 vs Playwright MCP at 4m 31s at $1.45, both at 100% success rate.

## Install

npm install -g dev-browser
dev-browser install   (installs Playwright + Chromium)

## Script API (runs in QuickJS sandbox)

browser.getPage(nameOrId) — get or create a persistent named page (or connect to a Chrome tab by targetId)

browser.newPage() — create an anonymous page, cleaned up after the script ends

browser.listPages() — list all tabs: [{id, url, title, name}]

browser.closePage(name) — close a named page

Pages are full Playwright Page objects: goto, click, fill, locator, evaluate, screenshot, and more.

page.snapshotForAI({ track?, depth?, timeout? }) — AI-friendly page snapshot returning { full, incremental? }

page.cua.* — pixel/vision tier: screenshot(), click, doubleClick, drag, scroll, keypress, type at CSS coordinates

page.domCua.* — DOM-id tier: getVisibleDom() returns pseudo-HTML with node_id=N; click, doubleClick, scroll by node id

File I/O is restricted to ~/.dev-browser/tmp/ via saveScreenshot, writeFile, and readFile helpers.

## Usage modes

dev-browser --headless <<'EOF'  (script here)  EOF  — headless, pipe script via stdin

dev-browser --connect <<'EOF'  (script here)  EOF  — connect to running Chrome

## Claude Code integration

Tell Claude to run dev-browser --help — the help output includes a full LLM usage guide. To skip permission prompts, add Bash(dev-browser *) to the allow list in .claude/settings.json.

Legacy plugin install: /plugin marketplace add sawyerhood/dev-browser, then /plugin install dev-browser@sawyerhood/dev-browser.
`,
      },
    ],
    repoUrl: 'https://github.com/sawyerhood/dev-browser',
    githubStars: 1000,
    capabilities: [
      {
        command: 'npm install -g dev-browser && dev-browser install',
        description: 'Install dev-browser globally and install Playwright + Chromium for the sandboxed browser runtime.',
      },
      {
        command: 'dev-browser --headless',
        description: 'Run a browser script via stdin in headless mode — no visible window, suitable for CI.',
      },
      {
        command: 'dev-browser --connect',
        description: 'Attach to an existing Chrome instance with remote debugging enabled (chrome://inspect/#remote-debugging) and run a script against it.',
      },
      {
        command: 'browser.getPage(nameOrId)',
        description: 'Script API call to get or create a persistent named page — named pages survive across script calls, preserving navigation state and cookies.',
      },
      {
        command: 'page.snapshotForAI()',
        description: 'Script API call that returns { full, incremental? } — an AI-friendly structured page snapshot for reasoning about page content.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-code-hooks-v1',
    slug: 'github-claude-code-hooks',
    name: 'claude-code-hooks Collection',
    tagline: 'Copy-paste-ready hook scripts: protect-tests, auto-format, branch-guard, cost-tracker, tts-alerts, and more.',
    description:
      'A tested library of Claude Code hook scripts covering safety, automation, and notifications. ' +
      'Current hooks: block-dangerous-commands (blocks rm -rf ~, fork bombs, curl|sh), ' +
      'protect-secrets (prevents reading/exfiltrating .env and key files), git-safety ' +
      '(branch-aware git guardrails), auto-stage (git-adds files after edits), ' +
      'format-code (runs ruff/Prettier after writes), and notify-permission (Slack alerts).',
    role: 'general',
    industry: null,
    tags: ['hooks', 'claude-code', 'automation', 'guard', 'formatting', 'devops'],
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

claude-code-hooks is a collection of drop-in hook scripts for the Claude Code hook system (262 tests, MIT licensed). Each script handles one safety or automation concern and can be adopted independently by copying it to ~/.claude/hooks/ and wiring it in .claude/settings.json.

## Implemented hooks

PreToolUse:
- block-dangerous-commands — blocks catastrophic shell commands: rm -rf ~ and variants, fork bombs, curl|sh pipes, disk-wiping dd. Configurable safety levels: critical (catastrophic only), high (recommended, adds force push to main, secrets exposure), strict (maximum).
- protect-secrets — prevents reading, modifying, or exfiltrating sensitive files: .env, private keys, credential files.
- git-safety — branch-aware git guardrails plus protection against destructive gh CLI operations.

PostToolUse:
- auto-stage — automatically git stages files after Claude writes or edits them.
- format-code — auto-formats Python files with ruff and JS/TS/JSON/YAML/Markdown with Prettier after edits.

Notification:
- notify-permission — sends Slack webhook alerts when Claude Code is idle waiting for user input.

Utils:
- event-logger.py — logs all hook events to inspect payload structures; useful when building new hooks.

## Install

Copy a hook script to your hooks directory:
cp hook-scripts/pre-tool-use/block-dangerous-commands.js ~/.claude/hooks/

Add it to .claude/settings.json:
hooks > PreToolUse > matcher: Bash > hooks > type: command, command: node ~/.claude/hooks/block-dangerous-commands.js

Restart Claude Code.

## Configuring safety levels

Each safety hook exposes a SAFETY_LEVEL constant at the top of the file. Set to "critical", "high" (recommended), or "strict" to control how aggressively the hook blocks operations.

## When to use

Install block-dangerous-commands and protect-secrets on any project where Claude has Bash access — they are low-friction safety nets with zero false positives at the recommended "high" level. Combine with auto-stage to keep the working tree clean after Claude edits.
`,
      },
    ],
    repoUrl: 'https://github.com/karanb192/claude-code-hooks',
    githubStars: 1000,
    capabilities: [
      {
        command: 'block-dangerous-commands (PreToolUse)',
        description: 'Blocks catastrophic Bash commands — rm -rf ~, fork bombs, curl|sh pipes — before Claude executes them. Configurable safety level: critical, high, or strict.',
      },
      {
        command: 'protect-secrets (PreToolUse)',
        description: 'Intercepts Read, Edit, Write, and Bash tool calls targeting .env files, private keys, and credential files to prevent accidental exfiltration.',
      },
      {
        command: 'git-safety (PreToolUse)',
        description: 'Branch-aware git guardrails that block destructive git and gh CLI operations based on the current branch.',
      },
      {
        command: 'auto-stage (PostToolUse)',
        description: 'Automatically runs git add on files Claude has written or edited, keeping the staging area in sync without manual intervention.',
      },
      {
        command: 'format-code (PostToolUse)',
        description: 'Runs ruff on Python files and Prettier on JS/TS/JSON/YAML/Markdown automatically after every Write or Edit.',
      },
      {
        command: 'notify-permission (Notification)',
        description: 'Sends a Slack webhook alert when Claude Code is idle waiting for permission or user input.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-hooks-ts-v1',
    slug: 'github-claude-hooks-ts',
    name: 'claude-hooks (TypeScript)',
    tagline: 'TypeScript-based Claude Code hook system — full type safety, auto-completion, and npm-ecosystem access for hook logic.',
    description:
      'A TypeScript scaffolding tool for Claude Code hooks by johnlindquist. Run npx claude-hooks ' +
      'to generate .claude/hooks/index.ts with typed PreToolUse, PostToolUse, Notification, ' +
      'and Stop handlers — plus lib.ts type definitions and session.ts utilities. Write hook logic ' +
      'in TypeScript with full IntelliSense; hooks execute via Bun at runtime.',
    role: 'general',
    industry: null,
    tags: ['hooks', 'typescript', 'claude-code', 'type-safe', 'npm', 'devops'],
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

claude-hooks provides a TypeScript scaffolding system for Claude Code hooks by johnlindquist. Where the shell-script approach requires parsing raw JSON event payloads by hand, claude-hooks generates a complete typed development environment: strongly-typed payload interfaces for all four lifecycle events (PreToolUse, PostToolUse, Notification, Stop), auto-completion in any TypeScript editor, and access to the full npm ecosystem inside hook logic.

Hooks execute via Bun at runtime (required — curl -fsSL https://bun.sh/install | bash). Node.js 18+ is needed to run the CLI itself.

## Setup

npx claude-hooks

This generates:
- .claude/settings.json — hook configuration wiring
- .claude/hooks/index.ts — main handler file (edit this)
- .claude/hooks/lib.ts — type definitions and utilities
- .claude/hooks/session.ts — optional session tracking utilities

Session logs are saved to the system temp dir under claude-hooks-sessions/.

## Writing hooks (index.ts)

Four typed handler functions, one per lifecycle event:

async function preToolUse(payload: PreToolUsePayload): Promise<HookResponse>
- payload.tool_name, payload.tool_input (typed per tool)
- return { action: 'continue' } to allow, or { action: 'block', message: '...' } to reject

async function postToolUse(payload: PostToolUsePayload): Promise<void>
- payload.tool_name, payload.success, payload.tool_input, payload.tool_output

The typed WriteToolInput gives auto-completion for payload.tool_input.file_path and .content — no manual JSON parsing.

## When to use

Choose claude-hooks over shell scripts when you need npm packages in hook logic (e.g. calling an API, parsing structured data, sending Slack messages), or when you want TypeScript's type safety to catch mistakes in payload access at edit time rather than runtime.
`,
      },
    ],
    repoUrl: 'https://github.com/johnlindquist/claude-hooks',
    githubStars: 500,
    capabilities: [
      {
        command: 'npx claude-hooks',
        description: 'Scaffold the TypeScript hook system: generates .claude/settings.json, index.ts (handlers), lib.ts (types), and session.ts (tracking utilities).',
      },
      {
        command: 'PreToolUsePayload typed handler',
        description: 'TypeScript interface for the PreToolUse lifecycle event with typed tool_name and tool_input; return { action: "block" } to reject a tool call.',
      },
      {
        command: 'PostToolUsePayload typed handler',
        description: 'TypeScript interface for the PostToolUse lifecycle event with typed tool_name, success flag, tool_input, and tool_output.',
      },
      {
        command: 'npx claude-hooks init --force',
        description: 'Reinitialize the hook scaffolding, overwriting existing generated files.',
      },
    ],
  },
];
