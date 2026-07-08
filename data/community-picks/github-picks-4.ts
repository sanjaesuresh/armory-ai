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
      'The canonical collection of MCP server implementations maintained by Anthropic and the ' +
      'Model Context Protocol community. Includes Filesystem, Git, Memory (knowledge graph), ' +
      'Sequential Thinking, Fetch, Time, and Everything servers — each a production-ready ' +
      'reference for a common integration category. Install any server in seconds via npx or uvx.',
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

Anthropic's official MCP reference server collection. Each server is a standalone process Claude Code connects to over stdio or HTTP, exposing tools the agent can call during a session. The Memory server persists entities and relations across sessions in a local JSONL knowledge graph. The Filesystem server gives Claude read/write access to a scoped directory tree. The Git server exposes git history, diffs, and log queries as tools. Sequential Thinking adds a structured multi-step reasoning tool. Fetch, Time, and Everything cover web retrieval, clock access, and an all-in-one demo server.

## Commands

\`\`\`
# start the Memory server (knowledge-graph persistence)
npx -y @modelcontextprotocol/server-memory

# start the Git server
uvx mcp-server-git

# wire any server into Claude Code
claude mcp add memory -- npx -y @modelcontextprotocol/server-memory
claude mcp add git -- uvx mcp-server-git
\`\`\`

## Example output

With the Memory server active, opening a new Claude Code session shows: "Continuing from last session — the Stripe webhook handler is complete; the confirmation email task is still pending." Claude has queried the knowledge graph and injected relevant prior context automatically.
`,
      },
    ],
    repoUrl: 'https://github.com/modelcontextprotocol/servers',
    githubStars: 50000,
    capabilities: [
      {
        command: 'npx -y @modelcontextprotocol/server-memory',
        description: 'Start the Memory MCP server, which persists entities and relations across sessions in a local JSONL knowledge graph.',
      },
      {
        command: 'uvx mcp-server-git',
        description: 'Start the Git MCP server, exposing git log, diff, and history queries as agent-callable tools.',
      },
      {
        command: 'claude mcp add <name> -- <launch-command>',
        description: 'Wire any reference MCP server into Claude Code so it appears as available tools in the current project.',
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
      'into the agent\'s context whenever you add "use context7" to a prompt. Eliminates ' +
      'the stale-training-data problem for fast-moving libraries: Claude answers with the ' +
      'real API as it exists today, not as it existed at training cutoff. Supports both a ' +
      'hosted HTTP transport and a local npx install.',
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

Context7 is an MCP server that resolves library documentation at request time against a live index of versioned package docs. When you append "use context7" to any prompt, the server intercepts the query, identifies the library and version you are asking about, fetches the current docs, and injects them as tool output before Claude composes its answer. The result is answers that use the real, current API rather than whatever was in training data.

## Commands

\`\`\`
# install via local npx (requires API key)
claude mcp add context7 -- npx -y @upstash/context7-mcp --api-key <KEY>

# or use the hosted HTTP transport (no local install)
claude mcp add --transport http context7 https://mcp.context7.com/mcp

# trigger in any prompt
"How do I use React 19 useTransition? use context7"
\`\`\`

## Example output

Prompt: "How do I use React 19 useTransition? use context7"

Context7 fetches the current React 19 docs and Claude answers: "In React 19, useTransition now returns isPending and startTransition; the API is unchanged but startTransition can now wrap async functions directly — here is the pattern..." using the actual React 19 signature rather than an older one.
`,
      },
    ],
    repoUrl: 'https://github.com/upstash/context7',
    githubStars: 30000,
    capabilities: [
      {
        command: 'claude mcp add context7 -- npx -y @upstash/context7-mcp --api-key <KEY>',
        description: 'Install Context7 locally via npx and register it in Claude Code with your Upstash API key.',
      },
      {
        command: 'claude mcp add --transport http context7 https://mcp.context7.com/mcp',
        description: 'Register the hosted Context7 HTTP endpoint in Claude Code — no local install needed.',
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
      'The official Playwright MCP server from Microsoft, giving Claude Code over 40 ' +
      'browser-automation tools without requiring a vision model. Navigation, clicks, form ' +
      'fill, screenshots, and assertion tools all operate on the page\'s accessibility tree, ' +
      'making them fast, reliable, and model-agnostic. Ideal for automated UI testing, ' +
      'end-to-end flows, and scraping tasks driven by Claude.',
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

The Playwright MCP server exposes the full Playwright browser-automation API as MCP tools Claude Code can call during a session. It operates on the page's accessibility tree rather than pixel snapshots, so it works without a vision model and is faster than screenshot-based approaches. Tools cover navigation, clicking, form filling, keyboard input, waiting for elements, taking screenshots, and reading page content. Supports Chromium, Firefox, and WebKit.

## Commands

\`\`\`
# install and register in Claude Code
claude mcp add playwright -- npx @playwright/mcp@latest

# example tool calls Claude makes during a session
browser_navigate   — go to a URL
browser_click      — click an element by a11y selector
browser_fill       — type into an input
browser_screenshot — capture the current page
browser_assert     — verify an element exists or contains text
\`\`\`

## Example output

Prompt: "Test the checkout flow on localhost:3000."

Claude navigates to the checkout page, fills the shipping form via accessibility selectors, clicks Submit, waits for the confirmation page, asserts the order number is present, and returns: "Checkout flow passed — order confirmation rendered with order #10042."
`,
      },
    ],
    repoUrl: 'https://github.com/microsoft/playwright-mcp',
    githubStars: 20000,
    capabilities: [
      {
        command: 'claude mcp add playwright -- npx @playwright/mcp@latest',
        description: 'Install and register the Playwright MCP server in Claude Code, enabling 40+ browser-automation tools.',
      },
      {
        command: 'browser_navigate',
        description: 'MCP tool that navigates to a given URL in the controlled browser.',
      },
      {
        command: 'browser_fill',
        description: 'MCP tool that types text into a form field identified by its accessibility label.',
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
      'and crawling API. Supports web search, academic paper search, company research, ' +
      'URL content retrieval, and GitHub search as discrete MCP tools. Available as a ' +
      'hosted HTTP endpoint (no install) or a local npx process.',
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

The Exa MCP server wraps Exa's semantic search API as a set of MCP tools Claude Code can call mid-session. Tools include web_search for general queries, research_paper_search for arXiv and academic sources, company_research for business intelligence, get_contents for crawling specific URLs, and github_search for code and repo discovery. Results return structured data (title, URL, text excerpt) that Claude can reason over directly.

## Commands

\`\`\`
# hosted HTTP endpoint (no install, requires Exa API key passed as header)
claude mcp add --transport http exa https://mcp.exa.ai/mcp

# or local install
npx exa-mcp-server --api-key <KEY>
claude mcp add exa -- npx exa-mcp-server --api-key <KEY>

# MCP tools available after install
web_search              — semantic web search
research_paper_search   — search arXiv and academic databases
company_research        — business intelligence lookup
get_contents            — crawl and extract a URL's content
github_search           — search GitHub repos and code
\`\`\`

## Example output

Prompt: "Find recent papers on RAG for code generation."

Claude calls research_paper_search with the query, and Exa returns 5 recent arXiv papers with titles, authors, and abstracts. Claude summarises the key findings and links the papers.
`,
      },
    ],
    repoUrl: 'https://github.com/exa-labs/exa-mcp-server',
    githubStars: 3000,
    capabilities: [
      {
        command: 'claude mcp add --transport http exa https://mcp.exa.ai/mcp',
        description: 'Register the hosted Exa MCP HTTP endpoint in Claude Code — no local process needed.',
      },
      {
        command: 'research_paper_search',
        description: 'MCP tool that searches arXiv and academic databases and returns structured paper metadata.',
      },
      {
        command: 'web_search',
        description: 'MCP tool that runs a semantic web search and returns ranked results with text excerpts.',
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
      'Smithery\'s official CLI for managing MCP servers. Replaces manual claude_desktop_config.json ' +
      'or settings.json editing with a package-manager-style interface: search a registry of ' +
      'over 6000 servers, add one with a single command, and list what is installed. The CLI ' +
      'handles config file patching, server binary resolution, and environment-variable wiring automatically.',
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

Smithery CLI is the package manager for MCP servers. It indexes a registry of 6000+ community and official MCP servers and provides search, install, and list commands that automatically patch the correct config file for your Claude client (Claude Code, Claude Desktop, etc.). No manual JSON editing is required — the CLI writes and validates the config entry, resolves the server binary, and prompts for required API keys.

## Commands

\`\`\`
# search the registry
smithery mcp search <query>
smithery mcp search "linear"

# install a server (patches config automatically)
smithery mcp add @server/name
smithery mcp add @linear/mcp

# list installed servers
smithery mcp list

# remove a server
smithery mcp remove @server/name
\`\`\`

## Example output

Running \`smithery mcp search "linear"\` returns:
  @linear/mcp — Linear issue tracker MCP (4.2k installs)
  @linearapp/mcp-server — community fork (380 installs)

Running \`smithery mcp add @linear/mcp\` patches \`.claude/settings.json\`, prompts for the Linear API key, and confirms: "Added @linear/mcp — restart Claude Code to activate."
`,
      },
    ],
    repoUrl: 'https://github.com/smithery-ai/cli',
    githubStars: 2000,
    capabilities: [
      {
        command: 'smithery mcp search <query>',
        description: 'Search the Smithery registry of 6000+ MCP servers by keyword and return ranked results.',
      },
      {
        command: 'smithery mcp add @server/name',
        description: 'Install an MCP server from the registry and automatically patch the Claude config file.',
      },
      {
        command: 'smithery mcp list',
        description: 'List all MCP servers currently configured in the active Claude client.',
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
      'A Claude Code plugin that records tool calls, compresses observations using the Agent ' +
      'SDK, and makes them retrievable via MCP tools in any future session. ' +
      'Solves the blank-slate problem: when you open a new session, prior work surfaces ' +
      'automatically rather than requiring you to re-explain context. Supports search, ' +
      'retrieve, store, and summarize MCP tools.',
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

claude-mem is a Claude Code plugin that intercepts tool calls during a session, compresses the observations via the Agent SDK, and stores them in a local persistent store. In the next session, the plugin queries the store for context relevant to the current task and injects it automatically before Claude's first response. The result is continuity across sessions without manual summarization.

Four MCP tools are exposed for direct use:
- **mem_search** — semantic search over stored observations
- **mem_retrieve** — fetch a specific memory entry by ID
- **mem_store** — manually save a fact or decision
- **mem_summarize** — compress and store the current session's observations on demand

## Commands

\`\`\`
# install as a Claude Code plugin
/plugin install thedotmack/claude-mem

# MCP tools available after install
mem_search <query>       — semantic search over stored memories
mem_retrieve <id>        — fetch a specific memory entry
mem_store <text>         — manually save a fact or note
mem_summarize            — compress and store the current session
\`\`\`

## Example output

Opening a new Claude Code session on the same project shows:

"Memory context loaded — we left off implementing the payment flow: the Stripe webhook handler is complete (committed a3f9c12), the confirmation email trigger is pending."

Claude continues without re-reading git log or asking for context.
`,
      },
    ],
    repoUrl: 'https://github.com/thedotmack/claude-mem',
    githubStars: 2000,
    capabilities: [
      {
        command: 'mem_search <query>',
        description: 'MCP tool that runs a semantic search over stored session observations and returns relevant memory entries.',
      },
      {
        command: 'mem_store <text>',
        description: 'MCP tool that manually saves a fact, decision, or note to persistent memory for future sessions.',
      },
      {
        command: 'mem_summarize',
        description: 'MCP tool that compresses the current session\'s tool-call history and stores it as a retrievable memory.',
      },
    ],
  },

  {
    kind: 'harness',
    id: 'github-claude-plugins-official-v1',
    slug: 'github-claude-plugins-official',
    name: 'Anthropic Official Plugin Directory',
    tagline: 'Anthropic\'s curated directory of 36 high-quality Claude Code plugins: LSP integrations, workflow tools, and service connectors.',
    description:
      'The official Anthropic-maintained directory of vetted Claude Code plugins. ' +
      'Covers LSP language integrations (live go-to-definition and hover types inside ' +
      'Claude Code), internal workflow tools, and connectors to external services. ' +
      'Each plugin in the directory has passed an Anthropic review and follows the ' +
      'Claude Code plugin API contract.',
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

The Anthropic Official Plugin Directory is a curated index of 36 Claude Code plugins that have passed Anthropic's review process. Categories include LSP language integrations (providing Claude Code with live go-to-definition, hover types, and diagnostics for a language server), external service connectors (Linear, Notion, GitHub, Jira), and internal workflow tools (test runners, linters, formatters wired as Claude tools). Plugins are installed by name via the Claude Code plugin command.

## Commands

\`\`\`
# install a plugin from the directory
/plugin install {name}@claude-plugins-official

# examples
/plugin install python-lsp@claude-plugins-official
/plugin install linear@claude-plugins-official
/plugin install prettier@claude-plugins-official

# list installed plugins
/plugin list

# remove a plugin
/plugin remove {name}
\`\`\`

## Example output

After installing python-lsp@claude-plugins-official, Claude Code gains live type information. Prompt: "What does pandas.DataFrame.merge return?" — Claude answers with the exact return type pulled from the LSP hover response, not from training data.
`,
      },
    ],
    repoUrl: 'https://github.com/anthropics/claude-plugins-official',
    githubStars: 3000,
    capabilities: [
      {
        command: '/plugin install {name}@claude-plugins-official',
        description: 'Install a vetted plugin from the Anthropic official directory by name.',
      },
      {
        command: '/plugin list',
        description: 'List all plugins currently installed in the Claude Code project.',
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
      'An advanced Sequential Thinking MCP server built on Agno\'s multi-agent framework. ' +
      'Where the standard sequential-thinking server uses a single chain of thought, this ' +
      'server routes each reasoning step through six specialized cognitive agents: critical, ' +
      'creative, analytical, practical, systems, and domain. The results are synthesized ' +
      'into a single answer. Particularly effective for architectural decisions and ' +
      'ambiguous design problems.',
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

MAS Sequential Thinking replaces the single-chain sequential thinking MCP tool with a 6-agent panel. When Claude calls the sequentialthinking tool, the request is dispatched in parallel to six cognitive-role agents (critical, creative, analytical, practical, systems, domain). Each agent produces a perspective, and a synthesis agent combines them into a final structured response. The output includes each agent's take plus the synthesis, giving Claude richer input for complex decisions.

## Commands

\`\`\`
# install via Smithery CLI
npx -y @smithery/cli install @FradSer/mcp-server-mas-sequential-thinking --client claude

# the tool Claude calls
sequentialthinking <problem>   — route a problem through all 6 cognitive agents and synthesize
\`\`\`

## Example output

Prompt: "Should we use event sourcing for the payments service?"

The 6 agents respond:
- **Critical**: highlights consistency risks at scale
- **Creative**: suggests a hybrid append-log approach
- **Analytical**: models query latency vs. storage tradeoff
- **Practical**: notes team familiarity gap
- **Systems**: flags replay cost at 10M events/day
- **Domain**: cites common patterns in fintech

Synthesis: "Recommend starting with a standard event log without full sourcing; revisit after the first replay need emerges."
`,
      },
    ],
    repoUrl: 'https://github.com/FradSer/mcp-server-mas-sequential-thinking',
    githubStars: 1000,
    capabilities: [
      {
        command: 'npx -y @smithery/cli install @FradSer/mcp-server-mas-sequential-thinking --client claude',
        description: 'Install the MAS Sequential Thinking MCP server for Claude Code via Smithery.',
      },
      {
        command: 'sequentialthinking',
        description: 'MCP tool that routes a problem through 6 cognitive-role agents and returns a synthesized multi-perspective analysis.',
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
      'A Claude Code plugin by sawyerhood that gives agents a persistent, sandboxed browser ' +
      'controlled via the full Playwright API. Unlike the Playwright MCP server which opens ' +
      'a new browser per session, dev-browser maintains a long-lived Chrome instance that ' +
      'agents can reconnect to, preserving cookies, local storage, and navigation state ' +
      'across Claude Code restarts.',
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

dev-browser launches a persistent Chrome process and exposes the full Playwright API to Claude Code as a plugin. The browser instance survives between Claude Code sessions, so cookies, session tokens, and navigation history persist. Claude can navigate, fill forms, click, screenshot, and assert page content using standard Playwright selectors. Supports headless mode for CI and headed mode for interactive debugging.

## Commands

\`\`\`
# install globally and register in Claude Code
npm i -g dev-browser && dev-browser install

# or install via Claude Code plugin marketplace
/plugin marketplace add sawyerhood/dev-browser

# flags
dev-browser start --headless      — run without a visible window (CI mode)
dev-browser start --connect <port> — attach to an existing Chrome DevTools session
\`\`\`

## Example output

Prompt: "Navigate to localhost:3000, fill the registration form with test data, and verify the welcome email trigger."

Claude navigates, fills the form (name, email, password), submits, checks the success message, then queries the mock email service API to confirm a welcome email was enqueued — all in one session with browser state preserved.
`,
      },
    ],
    repoUrl: 'https://github.com/sawyerhood/dev-browser',
    githubStars: 1000,
    capabilities: [
      {
        command: 'npm i -g dev-browser && dev-browser install',
        description: 'Install dev-browser globally and register it as a Claude Code plugin, launching the persistent Chrome sandbox.',
      },
      {
        command: '/plugin marketplace add sawyerhood/dev-browser',
        description: 'Install dev-browser directly from the Claude Code plugin marketplace without a separate npm step.',
      },
      {
        command: 'dev-browser start --headless',
        description: 'Start the persistent browser in headless mode for CI or server environments.',
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
      'A curated library of ready-to-use Claude Code hook scripts covering common automation ' +
      'needs. Each hook is a single self-contained script you copy into `.claude/hooks/` and ' +
      'wire to a lifecycle event in `.claude/settings.json`. Includes branch-guard (block edits ' +
      'on main), protect-tests (prevent test deletion), auto-format (run formatter after writes), ' +
      'cost-tracker, session-summary, tts-alerts, and a rate-limiter.',
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

claude-code-hooks is a collection of drop-in hook scripts for the Claude Code hook system. Each script handles one concern and can be adopted independently. The scripts hook into Claude Code's PreToolUse, PostToolUse, and Stop lifecycle events to intercept, validate, or react to Claude's tool calls.

Included hooks:
- **branch-guard** (PreToolUse) — blocks Write/Edit on the main branch
- **protect-tests** (PreToolUse) — rejects deletions of \`*.test.*\` files
- **auto-format** (PostToolUse) — runs Prettier/ESLint after every Write or Edit
- **context-snapshot** (PostToolUse) — saves the session state after each tool call
- **session-summary** (Stop) — generates a markdown summary of the session on exit
- **cost-tracker** (Stop) — logs token usage and estimated cost per session
- **tts-alerts** (Stop) — speaks a completion alert via macOS \`say\`
- **rate-limiter** (PreToolUse) — enforces a max tool-calls-per-minute ceiling

## Commands

\`\`\`
# drop a hook script into your project
cp hooks/branch-guard.sh .claude/hooks/branch-guard.sh
chmod +x .claude/hooks/branch-guard.sh

# wire it in .claude/settings.json
{
  "hooks": {
    "PreToolUse": [{ "matcher": "Write|Edit", "command": ".claude/hooks/branch-guard.sh" }]
  }
}
\`\`\`

## Example output

Attempting to edit a file while on the main branch triggers branch-guard:

Claude receives: "PreToolUse hook exited 1: Cannot edit files on the main branch. Checkout a feature branch first." The edit is blocked and Claude reports the error.
`,
      },
    ],
    repoUrl: 'https://github.com/karanb192/claude-code-hooks',
    githubStars: 1000,
    capabilities: [
      {
        command: 'branch-guard (PreToolUse hook)',
        description: 'Blocks Write and Edit tool calls when Claude is working on the main/master branch.',
      },
      {
        command: 'protect-tests (PreToolUse hook)',
        description: 'Rejects any tool call that would delete or overwrite a test file, preserving test coverage.',
      },
      {
        command: 'auto-format (PostToolUse hook)',
        description: 'Runs the project\'s formatter (Prettier, ESLint, etc.) automatically after every Write or Edit tool call.',
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
      'A TypeScript framework for writing Claude Code hooks by johnlindquist. Where the ' +
      'shell-script approach requires parsing raw JSON events by hand, claude-hooks provides ' +
      'typed interfaces for every hook lifecycle event, auto-completion in any TypeScript-aware ' +
      'editor, and access to the full npm ecosystem inside hook logic. Hooks are plain `.ts` ' +
      'files registered in the hook config.',
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

claude-hooks replaces shell-script hooks with a TypeScript system. Each hook is a \`.ts\` file that imports typed interfaces for the Claude Code hook event payload (tool name, arguments, result), implements a handler function, and can use any npm package for its logic. The framework compiles and caches hook files on first run; subsequent invocations are fast. Full type safety means mistakes in event access are caught at edit time, not runtime.

Lifecycle events supported: PreToolUse, PostToolUse, Notification, Stop.

## Commands

\`\`\`
# create a hook file
touch .claude/hooks/post-edit.ts

# minimal hook (TypeScript)
import type { PostToolUseEvent } from 'claude-hooks';
export default function handler(event: PostToolUseEvent) {
  if (event.tool === 'Write' || event.tool === 'Edit') {
    // run vitest after every file change
    return { command: 'npx vitest --run' };
  }
}

# register in .claude/settings.json
{
  "hooks": { "PostToolUse": [{ "matcher": ".*", "command": "claude-hooks run .claude/hooks/post-edit.ts" }] }
}
\`\`\`

## Example output

After Claude edits \`src/auth.ts\`, the PostToolUse hook runs vitest. The test output is appended to Claude's next message:

"Tests ran after edit — 47 passed, 1 failed: auth.test.ts > should reject expired token. Investigating..."

Claude picks up the failure immediately without a manual prompt.
`,
      },
    ],
    repoUrl: 'https://github.com/johnlindquist/claude-hooks',
    githubStars: 500,
    capabilities: [
      {
        command: 'claude-hooks run <hook-file.ts>',
        description: 'Execute a TypeScript hook file with typed access to the Claude Code lifecycle event payload.',
      },
      {
        command: 'PostToolUse typed handler',
        description: 'A TypeScript hook interface that fires after any tool call, with full type safety for tool name and arguments.',
      },
      {
        command: 'PreToolUse typed handler',
        description: 'A TypeScript hook interface that fires before a tool call, allowing the hook to block or modify the call.',
      },
    ],
  },
];
