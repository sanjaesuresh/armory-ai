import type { Setup } from '@/lib/setup/types';

const CREATED_AT = '2026-07-07T00:00:00.000Z';

export const professionalPicks: Setup[] = [
  // 1. anthropics/financial-services
  {
    kind: 'skill',
    id: 'github-anthropic-financial-services-v1',
    slug: 'github-anthropic-financial-services',
    name: 'Anthropic Financial Services Prompts',
    tagline: "Anthropic's official prompt collection for financial-services workflows.",
    description:
      'An external GitHub repository maintained by Anthropic containing prompts and examples ' +
      'tailored for financial services use cases, analysis, summarization, and client ' +
      'communication. Demonstrates best practices for using Claude in regulated finance contexts.',
    role: 'Financial Analyst',
    industry: 'Accounting & Finance',
    tags: ['finance', 'prompts', 'anthropic', 'analysis', 'compliance'],
    category: 'finance',
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

Anthropic's official reference agent and skill library for financial-services workflows. Covers investment banking (pitch decks, CIMs, buyer lists, M&A models), equity research (earnings notes, initiations, model updates), private equity (deal sourcing, IC memos, diligence checklists), wealth management (client reviews, financial plans, TLH), and fund administration (GL reconciliation, month-end close, LP statement auditing). Each named agent, Pitch Agent, Market Researcher, Earnings Reviewer, GL Reconciler, KYC Screener, and more, ships as a self-contained Claude Cowork plugin and as a Claude Managed Agent template deployable via the API.

## Key commands

Slash commands available after installing the relevant vertical plugin:

- /comps, comparable company analysis with trading multiples
- /dcf, DCF valuation with WACC and sensitivity tables
- /earnings, post-earnings quarterly update report
- /ic-memo, investment committee memo drafting
- /source, deal sourcing with CRM check and founder outreach draft
- /client-review, client meeting prep with performance and talking points
- /rebalance, allocation drift and tax-aware rebalancing analysis

## Install

Claude Code CLI:

    claude plugin marketplace add anthropics/financial-services
    claude plugin install financial-analysis@claude-for-financial-services
    claude plugin install pitch-agent@claude-for-financial-services

Claude Cowork: Settings > Plugins > Add plugin, paste the repo URL, then select agents and verticals.

Managed Agent deployment: export ANTHROPIC_API_KEY=sk-ant-... and run scripts/deploy-managed-agent.sh <agent-slug>.

## When to use

Use this when you need structured analyst work product, earnings models, pitch materials, valuation templates, reconciliation workflows, or KYC screening, and want Anthropic-maintained prompts calibrated for regulated finance. All outputs are staged for human review; the agents do not execute transactions, bind risk, or post to a ledger.`,
      },
    ],
    repoUrl: 'https://github.com/anthropics/financial-services',
    githubStars: 33228,
    capabilities: [
      {
        command: '/comps',
        description: 'Run comparable company analysis with trading multiples (financial-analysis plugin).',
      },
      {
        command: '/dcf',
        description: 'Build a DCF valuation with WACC and sensitivity analysis (financial-analysis plugin).',
      },
      {
        command: '/earnings',
        description: 'Generate a post-earnings quarterly update note from an earnings call and filing (equity-research plugin).',
      },
      {
        command: '/ic-memo',
        description: 'Draft an investment committee memo from deal materials (private-equity plugin).',
      },
      {
        command: '/client-review',
        description: 'Prep a client review meeting with performance summary and talking points (wealth-management plugin).',
      },
      {
        command: 'claude plugin install pitch-agent@claude-for-financial-services',
        description: 'Install the Pitch Agent, runs comps, precedents, and LBO analysis to produce a branded pitch deck end to end.',
      },
    ],
  },

  // 2. openaccountant/skills
  {
    kind: 'skill',
    id: 'github-openaccountant-skills-v1',
    slug: 'github-openaccountant-skills',
    name: 'Open Accountant Skills',
    tagline: 'Open-source AI skill definitions for day-to-day bookkeeping tasks.',
    description:
      'An external GitHub repository providing AI skill definitions for common bookkeeping ' +
      'workflows, transaction categorization, reconciliation, and ledger review. Part of the ' +
      'OpenAccountant project, designed for small-business bookkeepers using Claude or ChatGPT.',
    role: 'Bookkeeper',
    industry: 'Accounting & Finance',
    tags: ['bookkeeping', 'accounting', 'skills', 'small-business', 'finance'],
    category: 'finance',
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

Open Accountant Skills is a free, MIT-licensed library of 44 financial skills for AI agents, covering personal finance, small-business bookkeeping, and shared workflows. Personal finance skills include subscription-audit, debt-payoff (avalanche vs snowball), net-worth tracking, zero-based-budget, and insurance-audit. Business skills cover profit-loss statement generation, invoice-aging, cash-flow-forecast, break-even-calc, month-end-close, and runway-calculator. Shared skills include smart-categorize (auto-categorize transactions by pattern), tax-prep (IRS Schedule C), quarterly-taxes, mileage-tracker, and depreciation-schedule. Each skill works in two modes: with Wilson CLI for direct database queries, or without Wilson as step-by-step instructions for CSV/spreadsheet workflows.

## Key commands

Install a single skill:

    npx skills add openaccountant/skills --skill tax-prep

Install all 44 skills:

    npx skills add openaccountant/skills

List available skills:

    npx skills add openaccountant/skills --list

For Claude Code specifically, copy skill folders into .claude/skills/ manually:

    git clone https://github.com/openaccountant/skills.git ~/.openaccountant/skills

## Install

Works with Claude Code, Cursor, OpenAI Codex, Gemini CLI, GitHub Copilot, Pi, OpenCode, Kiro, Trae, and Rovo Dev, any agent that supports SKILL.md files.

## When to use

Use this when you do bookkeeping, freelance finance, or small-business accounting work in an AI agent and want structured, reusable skills for recurring tasks like month-end close, invoice aging review, or tax categorization. Skills work without any accounting software integration and degrade gracefully to manual CSV workflows when no database connection is available.`,
      },
    ],
    repoUrl: 'https://github.com/openaccountant/skills',
    githubStars: 31,
    capabilities: [
      {
        command: 'npx skills add openaccountant/skills --skill month-end-close',
        description: 'Install the month-end-close skill for a structured monthly bookkeeping checklist.',
      },
      {
        command: 'npx skills add openaccountant/skills --skill tax-prep',
        description: 'Install the tax-prep skill to organize expenses by IRS Schedule C categories.',
      },
      {
        command: 'npx skills add openaccountant/skills --skill cash-flow-forecast',
        description: 'Install the cash-flow-forecast skill to project future cash flow from current trends.',
      },
      {
        command: 'npx skills add openaccountant/skills --skill smart-categorize',
        description: 'Install the smart-categorize skill to auto-categorize transactions by pattern from a CSV export.',
      },
    ],
  },

  // 3. openaccountants/openaccountants
  {
    kind: 'skill',
    id: 'github-openaccountants-v1',
    slug: 'github-openaccountants',
    name: 'OpenAccountants',
    tagline: 'Open-source accounting toolkit with AI-assisted tax and ledger workflows.',
    description:
      'OpenAccountants is an open tax knowledge layer where named, licensed accountants review ' +
      'jurisdiction guides that AI agents use to answer tax questions. Covers 1,000+ guides across ' +
      '190+ jurisdictions, accessible via MCP or manual file upload. Not tax advice, outputs ' +
      'require professional review.',
    role: 'Tax Preparer',
    industry: 'Accounting & Finance',
    tags: ['tax', 'accounting', 'prompts', 'finance', 'reporting'],
    category: 'finance',
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

OpenAccountants is a public tax knowledge layer where named, licensed accountants review jurisdiction-specific guides that AI agents load when answering tax questions. The repo holds 1,000+ guides across 190+ jurisdictions, income tax, VAT/GST, payroll, SSC, entity formation, bookkeeping, and crypto tax. 13 countries have the full accounting suite (UK, Germany, Malta, Australia, Canada, India, Spain, France, Japan, Netherlands, Portugal, Belgium, US). Every guide is in one of two states: source-cited draft (written from primary legislation, not yet professionally reviewed) or accountant-reviewed (a named, licensed Partner checked the complete guide; their badge appears on every answer). An accountant-reviewed US guide (Christopher Aryee, CPA) was updated with 33 corrections for the OBBBA in July 2026.

## Key commands

Hosted MCP (1 step, always current):

    https://www.openaccountants.com/api/mcp

Local install (no clone needed):

    pip install openaccountants-mcp

Then add to your MCP config:

    { "mcpServers": { "openaccountants": { "command": "openaccountants-mcp" } } }

Manual (no MCP): download a jurisdiction package from packages/ and attach the .md files to your Claude Project or ChatGPT session.

## When to use

Use this when you need jurisdiction-aware tax guidance for a client or your own situation, income tax, VAT, payroll, or entity setup, and you want the AI to load current, source-cited rules rather than rely on training data. All outputs require review by a qualified professional before filing, payment, or action. The MCP connector is the recommended path for accountant-reviewed guides with Partner attribution.`,
      },
    ],
    repoUrl: 'https://github.com/openaccountants/openaccountants',
    githubStars: 233,
    capabilities: [
      {
        command: 'pip install openaccountants-mcp',
        description: 'Install the local MCP server, which bundles all jurisdiction guides and serves them to any MCP-compatible AI client.',
      },
      {
        command: 'MCP connector at https://www.openaccountants.com/api/mcp',
        description: 'Add the hosted MCP endpoint to get accountant-reviewed guides with Partner attribution on every answer.',
      },
      {
        command: 'request_accountant_review (MCP tool)',
        description: 'Route a completed AI working paper to a real licensed accountant for review, via the hosted MCP server.',
      },
    ],
  },

  // 4. tuanductran/hr-skills
  {
    kind: 'skill',
    id: 'github-hr-skills-v1',
    slug: 'github-hr-skills',
    name: 'HR Skills',
    tagline: 'Prompt collection for common HR generalist tasks in Claude or ChatGPT.',
    description:
      'HR Skills by tuanductran is a library of 40+ SKILL.md files covering the full HR ' +
      'lifecycle, recruiting, interviewing, job descriptions, onboarding, performance management, ' +
      'compliance, DEI, compensation, and more. Works in Claude Code (.claude/skills/) and Claude.ai ' +
      'Projects. Built for the HR/TA community.',
    role: 'HR Generalist',
    industry: 'HR & People',
    tags: ['hr', 'prompts', 'recruiting', 'policy', 'people-ops'],
    category: 'hr',
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

HR Skills is a library of 40+ agent skills covering the full HR lifecycle: recruiting, talent acquisition, interviewing, job descriptions, onboarding, offboarding, performance management, employee relations, people operations, HR analytics, HR technology, learning and development, compensation and benefits, workforce planning, compliance, DEI, and wellbeing. Each skill is a single SKILL.md file with professional instructions, workflows, decision frameworks, and prompt templates. The collection also includes Vietnam-specific HR guidance and software engineering recruiting skills across frontend, backend, fullstack, mobile, DevOps, QA, AI, and security roles.

## Key commands

Install a single skill into Claude Code:

    cp -r skills/hr-recruiting ~/.claude/skills/

Install all skills:

    cp -r skills/hr-* ~/.claude/skills/

For Claude.ai: create a Project, open Project knowledge, upload the desired SKILL.md file, then start chatting. Claude automatically applies the relevant skill when working on matching HR tasks.

Example prompts once installed:

- "Create behavioral interview questions for a Product Manager."
- "Write a 90-day onboarding plan for a Senior Backend Engineer."
- "Draft a return-to-office policy for a hybrid engineering team."

## When to use

Use this when you need structured, domain-aware help with any HR task, writing JDs, building interview scorecards, drafting onboarding plans, or creating performance review criteria. Skills load automatically in Claude Code when the task matches; in Claude.ai, upload the relevant SKILL.md to a Project.`,
      },
    ],
    repoUrl: 'https://github.com/tuanductran/hr-skills',
    githubStars: 23,
    capabilities: [
      {
        command: 'cp -r skills/hr-recruiting ~/.claude/skills/',
        description: 'Install the recruiting skill into Claude Code to generate competency-based interview questions and candidate scorecards.',
      },
      {
        command: 'cp -r skills/hr-onboarding ~/.claude/skills/',
        description: 'Install the onboarding skill to create structured 30/60/90-day onboarding plans for new hires.',
      },
      {
        command: 'cp -r skills/hr-performance-management ~/.claude/skills/',
        description: 'Install the performance management skill for performance review templates and goal-setting frameworks.',
      },
      {
        command: 'Upload hr-skills/skills/hr-job-descriptions/SKILL.md to Claude Project knowledge',
        description: 'Add the job description skill to a Claude.ai Project to generate role-specific JDs from a brief.',
      },
    ],
  },

  // 5. evolsb/claude-legal-skill
  {
    kind: 'skill',
    id: 'github-claude-legal-skill-v1',
    slug: 'github-claude-legal-skill',
    name: 'Claude Legal Skill',
    tagline: 'Installable Claude skill for legal document review and contract analysis.',
    description:
      'Contract Review is an agent skill by evolsb for legal contract analysis. Grounded in the ' +
      'CUAD dataset (41 risk categories, 510 real contracts), it provides position-aware review ' +
      'with market benchmarks, negotiability ratings, and specific redline language for NDAs, ' +
      'SaaS agreements, M&A docs, and merchant agreements.',
    role: 'Contracts Paralegal',
    industry: 'Legal',
    tags: ['legal', 'contracts', 'skill', 'document-review', 'claude-code'],
    category: 'legal',
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

Contract Review is an agent skill grounded in the CUAD dataset (41 legal risk categories from 510 real contracts). It provides position-aware contract analysis, you specify which party you are (customer, vendor, buyer, seller, receiving party) and the skill adjusts what it flags as risky. Output includes: risk assessment with severity ratings (Critical / Important / Acceptable), a red flags quick scan (uncapped indemnification, unilateral amendment rights, offshore jurisdiction), key terms table with section references, market standard benchmarks (liability cap thresholds, auto-renewal notice periods, non-compete durations by jurisdiction), negotiability ratings showing what is realistically changeable, and specific redline language rather than generic advice. Specialized checklists exist for NDA, SaaS/MSA, payment/merchant agreements, M&A, and finder/broker contracts. Outputs structured JSON redlines compatible with the companion legal-redline-tools package to produce tracked-changes Word docs and PDFs.

## Key commands

Install into Claude Code:

    git clone https://github.com/evolsb/claude-legal-skill ~/.claude/skills/contract-review

Install into OpenAI Codex:

    git clone https://github.com/evolsb/claude-legal-skill ~/.codex/skills/contract-review

Example prompts once installed:

- "Review this NDA - I'm the receiving party"
- "Analyze the indemnification in this MSA - I'm the vendor"
- "Check this merchant agreement - what's my chargeback exposure?"

## When to use

Use this for first-pass review of commercial contracts before involving legal counsel, or to prepare informed questions for attorney review. Best for NDAs, SaaS agreements, M&A documents, and merchant/payment agreements. Not a substitute for attorney review on material deals. US law focus; non-US provisions may be flagged but not fully analyzed.`,
      },
    ],
    repoUrl: 'https://github.com/evolsb/claude-legal-skill',
    githubStars: 363,
    capabilities: [
      {
        command: 'git clone https://github.com/evolsb/claude-legal-skill ~/.claude/skills/contract-review',
        description: 'Install the contract review skill into Claude Code.',
      },
      {
        command: 'Review this NDA - I\'m the receiving party',
        description: 'Trigger a position-aware NDA review with CUAD-grounded risk ratings and specific redline suggestions.',
      },
      {
        command: 'Check this merchant agreement - what\'s my chargeback exposure?',
        description: 'Run a merchant agreement review focused on reserves, chargebacks, and network rules.',
      },
      {
        command: 'pip install git+https://github.com/evolsb/legal-redline-tools.git',
        description: 'Install the companion tool to convert the skill\'s JSON redlines into tracked-changes Word docs and PDFs.',
      },
    ],
  },

  // 6. phuryn/pm-skills
  {
    kind: 'skill',
    id: 'github-phuryn-pm-skills-v1',
    slug: 'github-phuryn-pm-skills',
    name: 'PM Skills (phuryn)',
    tagline: 'SKILL.md collection covering the core project management workflow.',
    description:
      'PM Skills Marketplace by phuryn is a plugin collection of 68 PM skills and 42 chained ' +
      'workflows across 9 plugins, discovery, strategy, execution, market research, data analytics, ' +
      'GTM, marketing/growth, toolkit, and AI shipping. Works in Claude Cowork, Claude Code, and ' +
      'OpenAI Codex. Built on frameworks from Teresa Torres, Marty Cagan, and Alberto Savoia.',
    role: 'Project Manager',
    industry: 'Technology',
    tags: ['project-management', 'skills', 'planning', 'claude-code', 'pm'],
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

PM Skills Marketplace is a 9-plugin collection of 68 PM skills and 42 chained command workflows for Claude Cowork and Claude Code. Plugins cover: product discovery (/discover, /brainstorm, /interview, /setup-metrics, 13 skills including opportunity solution trees and assumption mapping); product strategy (/strategy, /business-model, /pricing, 12 skills including Lean Canvas and Porter's Five Forces); execution (/write-prd, /sprint, /pre-mortem, /red-team-prd, /write-stories, 16 skills); market research (/competitive-analysis, /research-users, 7 skills); data analytics (/write-query SQL generation, /analyze-test A/B analysis, 3 skills); go-to-market (/plan-launch, /battlecard, 6 skills); marketing/growth (/north-star, /market-product, 5 skills); toolkit (/review-resume, /draft-nda, /privacy-policy, 4 skills); and AI shipping (/ship-check, /document-app, /security-audit-static, /performance-audit-static, 2 skills). Commands chain multiple skills end to end and suggest the next relevant command when done.

## Key commands

- /discover, full discovery cycle: ideation, assumption mapping, prioritization, experiment design
- /write-prd, PRD from a feature idea or problem statement
- /strategy, 9-section Product Strategy Canvas
- /north-star, North Star Metric and supporting input metrics
- /competitive-analysis, competitive landscape analysis
- /ship-check, turn a vibe-coded repo into a reviewer-ready shipping packet

## Install

Claude Cowork: Customize > Browse plugins > Personal > + > Add marketplace from GitHub, enter phuryn/pm-skills.

Claude Code CLI:

    claude plugin marketplace add phuryn/pm-skills
    claude plugin install pm-toolkit@pm-skills
    claude plugin install pm-product-discovery@pm-skills

## When to use

Use this when you need structured PM frameworks in your AI tool rather than generic text output. Each skill encodes a proven PM methodology (Teresa Torres OSTs, Cagan product strategy, Savoia pretotypes) and walks through it step by step.`,
      },
    ],
    repoUrl: 'https://github.com/phuryn/pm-skills',
    githubStars: 22926,
    capabilities: [
      {
        command: '/discover',
        description: 'Run the full product discovery cycle: ideation, assumption mapping, prioritization, and experiment design.',
      },
      {
        command: '/write-prd',
        description: 'Generate a structured PRD from a feature idea or problem statement using the 8-section template.',
      },
      {
        command: '/strategy',
        description: 'Build a 9-section Product Strategy Canvas covering positioning, market, and defensibility.',
      },
      {
        command: '/ship-check',
        description: 'Document a vibe-coded repo, run static security and performance audits, and compile a reviewer-ready shipping packet.',
      },
      {
        command: '/red-team-prd',
        description: 'Adversarially stress-test a PRD or roadmap and rank the riskiest assumptions by cheapest test.',
      },
    ],
  },

  // 7. deanpeters/Product-Manager-Skills
  {
    kind: 'skill',
    id: 'github-pm-skills-deanpeters-v1',
    slug: 'github-pm-skills-deanpeters',
    name: 'Product Manager Skills (deanpeters)',
    tagline: 'Product-manager skills for Claude covering the full PM workflow loop.',
    description:
      'Product Manager Skills by deanpeters is a library of 55 battle-tested PM skills for ' +
      'Claude Code, Cursor, Codex, and Claude Desktop/Web. Three tiers: 6 workflow skills ' +
      '(multi-week PM processes), 23 interactive skills (3-5 questions then recommendations), ' +
      'and 23 component skills (specific PM deliverables). CC BY-NC-SA licensed.',
    role: 'Product Manager',
    industry: 'Technology',
    tags: ['product-management', 'skills', 'prd', 'roadmap', 'discovery'],
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

Product Manager Skills is a library of 55 PM skills across three tiers: 6 workflow skills for multi-week PM processes (product-strategy-session, discovery-process, roadmap-planning, prd-development), 23 interactive skills that ask 3-5 questions then give numbered recommendations (prioritization-advisor, stakeholder-engagement-advisor, director-readiness-advisor, ai-shaped-readiness-advisor, pol-probe-advisor), and 23 component skills for specific deliverables (user-story, press-release, lean-canvas, opportunity-solution-tree, stakeholder-mapping). Notable skills: problem-framing-canvas (MITRE's Look Inward / Look Outward / Reframe), business-health-diagnostic for SaaS metrics, organic-growth-advisor (McKinsey Growth Pyramid), and executive-onboarding-playbook (30-60-90 day VP/CPO playbook). A Streamlit playground lets you try skills in a browser without any agent setup.

## Key commands

Install via Claude Code plugin marketplace:

    claude /plugin marketplace add deanpeters/Product-Manager-Skills

Download for Claude Desktop/Web (upload skill ZIPs to Claude Skills):

- pm-skills-starter-pack.zip, core skills across all categories
- 02-discovery-pack.zip, 03-strategy-pack.zip, 04-delivery-pack.zip, 05-ai-pm-pack.zip

Download for Codex:

    pm-skills-codex.zip (installs .agents/skills and AGENTS.md)

Local Streamlit playground:

    pip install -r app/requirements.txt && streamlit run app/main.py

## When to use

Use this when you want PM frameworks that teach the reasoning behind each methodology, not just fill in a template. Interactive skills ask contextual questions before recommending a framework, good when you know you have a PM problem but are unsure which approach fits. Component skills are faster for cases where you know exactly what you need (a user story, a press release, a lean canvas).`,
      },
    ],
    repoUrl: 'https://github.com/deanpeters/Product-Manager-Skills',
    githubStars: 5622,
    capabilities: [
      {
        command: 'claude /plugin marketplace add deanpeters/Product-Manager-Skills',
        description: 'Install the full 55-skill PM library into Claude Code via the plugin marketplace.',
      },
      {
        command: 'prioritization-advisor skill',
        description: 'Interactive skill that asks 3-5 questions about your context and recommends the right framework (RICE, ICE, Kano, etc.).',
      },
      {
        command: 'opportunity-solution-tree skill',
        description: 'Generate an Opportunity Solution Tree (Teresa Torres), outcome, opportunities, solutions, and experiments.',
      },
      {
        command: 'stakeholder-engagement-advisor skill',
        description: 'Per-stakeholder engagement planning: diagnoses their profile and context, then delivers tailored message framing, medium, and next action.',
      },
      {
        command: 'streamlit run app/main.py',
        description: 'Launch the local Streamlit playground to browse and run skills in a browser without any agent setup.',
      },
    ],
  },

  // 8. mohitagw15856/pm-claude-skills
  {
    kind: 'skill',
    id: 'github-pm-claude-skills-v1',
    slug: 'github-pm-claude-skills',
    name: 'PM Claude Skills',
    tagline: 'Claude skills tailored for business analysis and product documentation.',
    description:
      'PM Claude Skills by mohitagw15856 is a collection of 454 professional agent skills for ' +
      'Claude, ChatGPT, Gemini, Cursor, Codex, and Hermes, covering product, business analysis, ' +
      'and operations workflows. Published in the Anthropic plugin directory. Available via npm, ' +
      'PyPI, MCP, and a free-runs playground.',
    role: 'Business Analyst',
    industry: 'Consulting & Professional Services',
    tags: ['business-analysis', 'skills', 'requirements', 'documentation', 'process'],
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

PM Claude Skills is a collection of 454 professional agent skills for product management, business analysis, and operations work. Published in the Anthropic plugin directory. The library is eval-scored (208 evaluated skills, average 4.8/5) and includes subagents for orchestrated workflows. Skills cover the full PM and BA lifecycle: requirements, discovery, roadmapping, prioritization, stakeholder management, data analysis, operations documentation, and more. Available as a sparse-skills-only clone for quick installs.

## Key commands

Install via npm (all agents):

    npx pm-claude-skills install

Install via pip:

    pip install pm-skills

Sparse skills-only clone (fastest):

    git clone --filter=blob:none --sparse https://github.com/mohitagw15856/pm-claude-skills && git sparse-checkout set skills

Claude Code plugin marketplace:

    claude plugin marketplace add mohitagw15856/pm-claude-skills

MCP remote connector (for ChatGPT and Claude.ai):

    See mcp-remote/ directory for the hosted connector config.

Free playground to try skills without setup:

    https://mohitagw15856.github.io/pm-claude-skills/

## When to use

Use this when you need a broad, multi-skill PM and BA library with eval-scored quality and multi-agent support. Good fit for Claude Code, Cursor, Codex, and Gemini CLI workflows where you want 400+ skills available and let the agent select the right one for the task.`,
      },
    ],
    repoUrl: 'https://github.com/mohitagw15856/pm-claude-skills',
    githubStars: 1161,
    capabilities: [
      {
        command: 'npx pm-claude-skills install',
        description: 'Install the full 454-skill PM/BA collection via npm.',
      },
      {
        command: 'pip install pm-skills',
        description: 'Install via PyPI for Python-based agent workflows.',
      },
      {
        command: 'git clone --filter=blob:none --sparse https://github.com/mohitagw15856/pm-claude-skills && git sparse-checkout set skills',
        description: 'Sparse-clone only the skills directory for a fast, lightweight install.',
      },
      {
        command: 'claude plugin marketplace add mohitagw15856/pm-claude-skills',
        description: 'Install via the Claude Code plugin marketplace (listed in the official Anthropic plugin directory).',
      },
    ],
  },

  // 9. zubair-trabzada/ai-marketing-claude
  {
    kind: 'skill',
    id: 'github-ai-marketing-claude-v1',
    slug: 'github-ai-marketing-claude',
    name: 'AI Marketing for Claude',
    tagline: 'AI marketing prompts for Claude, campaigns, copy, and brand analysis.',
    description:
      'AI Marketing Suite for Claude Code by zubair-trabzada is a 14-skill system with 5 parallel ' +
      'subagents that audit any website across content, conversion, SEO, competitive positioning, ' +
      'brand/trust, and growth. Includes /market audit, /market copy, /market emails, /market social, ' +
      '/market competitors, and /market report-pdf commands.',
    role: 'Marketing Manager',
    industry: 'Marketing',
    tags: ['marketing', 'prompts', 'copywriting', 'campaigns', 'brand'],
    category: 'marketing',
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

AI Marketing Suite for Claude Code is a 14-skill, 5-subagent marketing analysis and automation system. The /market audit command launches 5 parallel subagents (content/messaging, conversion optimization, SEO/discoverability, competitive positioning, brand/trust/growth) and scores a website across those six dimensions (weighted 0-100) with a full report saved to MARKETING-AUDIT.md. Other commands include /market copy (optimized copy with before/after examples), /market emails (complete email sequences, welcome, nurture, launch), /market social (30-day content calendar), /market ads (ad creative for all platforms), /market funnel (sales funnel CRO analysis), /market competitors (competitive intelligence), /market landing (landing page CRO), /market launch (product launch playbook), /market proposal (client proposal), /market report (full Markdown report), /market report-pdf (PDF requiring pip install reportlab), and /market brand (brand voice analysis).

## Install

One-command install:

    curl -fsSL https://raw.githubusercontent.com/zubair-trabzada/ai-marketing-claude/main/install.sh | bash

Or manually:

    git clone https://github.com/zubair-trabzada/ai-marketing-claude.git && cd ai-marketing-claude && ./install.sh

Optional PDF support: pip install reportlab

Uninstall: ./uninstall.sh

## When to use

Use this when you want structured, scored marketing analysis of a website from your Claude Code terminal, for a client pitch, competitor research, or your own landing page optimization. The parallel subagent architecture produces a full scored audit in one command. For simpler copy generation, use /market copy or /market emails without the full audit overhead.`,
      },
    ],
    repoUrl: 'https://github.com/zubair-trabzada/ai-marketing-claude',
    githubStars: 2064,
    capabilities: [
      {
        command: '/market audit <url>',
        description: 'Launch 5 parallel subagents to score a website across content, conversion, SEO, competitive positioning, and brand, outputs a full scored report.',
      },
      {
        command: '/market quick <url>',
        description: 'Run a 60-second marketing snapshot of a website.',
      },
      {
        command: '/market emails <topic>',
        description: 'Generate a complete email sequence (welcome, nurture, or launch) for a product or topic.',
      },
      {
        command: '/market social <topic>',
        description: 'Generate a 30-day social media content calendar.',
      },
      {
        command: '/market report-pdf <url>',
        description: 'Produce a professional PDF marketing report (requires pip install reportlab).',
      },
    ],
  },

  // 10. WynterJones/CoppieGPT
  {
    kind: 'skill',
    id: 'github-coppiegpt-v1',
    slug: 'github-coppiegpt',
    name: 'CoppieGPT',
    tagline: 'GPT-powered copywriting system for direct-response and ad copy.',
    description:
      'CoppieGPT by WynterJones configures ChatGPT or Claude as a copywriting assistant that ' +
      'applies 232 copywriting frameworks and formulas. Given any headline or content, it outputs ' +
      '6 rewrites using different frameworks, AIDA, PAS, Story Selling, StoryBrand, and hundreds ' +
      'more. Three-prompt setup, no code required.',
    role: 'Content Writer',
    industry: 'Marketing',
    tags: ['copywriting', 'content', 'direct-response', 'prompts', 'advertising'],
    category: 'content',
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

CoppieGPT is a three-prompt system that turns ChatGPT or Claude into a copywriting assistant that knows 232 frameworks and formulas. After the three-prompt setup, it picks 6 of its known frameworks for any given input and rewrites your headline or copy using each one. Frameworks span the full copywriting canon: AIDA, PAS, BAB, FAB, PASTOR, QUEST, Don Miller's StoryBrand, Eugene Schwartz's Breakthrough Advertising, David Ogilvy's How to Create Advertising that Sells, Gary Halbert's A-Pile/B-Pile, Dan Kennedy's Godfather Offer, Jeff Walker's Product Launch Formula, Russell Brunson's Dotcom Secrets, and 218 more. It randomly selects different frameworks each time to avoid repetition. Example asks: "Can you rewrite this headline" or "What's the best formula for this text?"

## Install

Three-prompt setup (paste into a new ChatGPT or Claude session in order):

1. Prompt 1: establishes the CoppieGPTv1.0 persona and role.
2. Prompt 2: knowledge dump of all 232 frameworks (this is the large block from the README).
3. Prompt 3: sets output rules, always 6 formatted variations, no preamble.

All three prompts are in the README. No code, no tools, no API key beyond the AI session you already use. Save the configured session as a Claude Project or ChatGPT Custom GPT to reuse it.

## When to use

Use this when you need to quickly generate multiple headline or body-copy variations for testing, or when you want to explore how different copywriting frameworks (emotional, story-based, feature-first, urgency-based) would frame the same offer. Not for long-form content, best for headlines, email subject lines, ad copy, and landing page above-the-fold text.`,
      },
    ],
    repoUrl: 'https://github.com/WynterJones/CoppieGPT',
    githubStars: 159,
    capabilities: [
      {
        command: 'Paste Prompt 1 (persona), Prompt 2 (232 frameworks), Prompt 3 (output rules) into ChatGPT or Claude',
        description: 'Complete the three-prompt setup to configure CoppieGPT as your copywriting framework engine.',
      },
      {
        command: 'Can you rewrite this headline, "[your headline]"',
        description: 'Get 6 rewrites of a headline using 6 different copywriting frameworks, formatted and ready to test.',
      },
      {
        command: 'What is the best formula for this text, "[your copy]"',
        description: 'Ask CoppieGPT to identify the best-fit copywriting framework for a piece of existing copy and explain why.',
      },
    ],
  },

  // 11. f/prompts.chat
  {
    kind: 'skill',
    id: 'github-prompts-chat-v1',
    slug: 'github-prompts-chat',
    name: 'Prompts.chat',
    tagline: 'The prompts.chat collection: 200+ role-based prompts for Claude and ChatGPT.',
    description:
      'prompts.chat by Fatih Arslan is the world\'s largest open-source prompt library, 143k+ ' +
      'GitHub stars, featured in Forbes, referenced by Harvard and Columbia. Contains 200+ role-based ' +
      'system prompts for ChatGPT, Claude, Gemini, and others. Also available as a Claude Code plugin, ' +
      'MCP server, and self-hostable web app.',
    role: 'Social Media Manager',
    industry: 'Marketing',
    tags: ['prompts', 'social-media', 'content', 'roles', 'chatgpt'],
    category: 'content',
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

prompts.chat is the world's largest open-source prompt library, 143k+ GitHub stars, the most-liked dataset on Hugging Face, referenced by Harvard and Columbia, and endorsed by OpenAI co-founders Greg Brockman and Wojciech Zaremba. It contains 200+ curated role-based system prompts that configure AI models to behave as specific experts: social media manager, SEO specialist, content strategist, copywriter, data analyst, advertiser, financial advisor, and many more. Prompts work with ChatGPT, Claude, Gemini, Llama, Mistral, and other models. Also available as a Claude Code plugin (install with one command), an MCP server (remote or local), a CLI, and a self-hostable web app with custom branding.

## Key commands

Browse at https://prompts.chat/prompts, copy any prompt with one click.

Claude Code plugin install:

    /plugin marketplace add f/prompts.chat
    /plugin install prompts.chat@prompts.chat

MCP server (remote, recommended):

    { "mcpServers": { "prompts.chat": { "url": "https://prompts.chat/api/mcp" } } }

MCP server (local):

    { "mcpServers": { "prompts.chat": { "command": "npx", "args": ["-y", "prompts.chat", "mcp"] } } }

CLI:

    npx prompts.chat

## When to use

Use this when you want a fast, one-click way to configure an AI model as a specific professional expert without writing the system prompt yourself. Particularly useful for social media, marketing, writing, and SEO roles. For recurring work, install the Claude Code plugin so the prompts are searchable from within your agent session.`,
      },
    ],
    repoUrl: 'https://github.com/f/prompts.chat',
    githubStars: 165039,
    capabilities: [
      {
        command: '/plugin marketplace add f/prompts.chat',
        description: 'Install the prompts.chat Claude Code plugin to search and apply 200+ role prompts from within your agent session.',
      },
      {
        command: 'MCP server at https://prompts.chat/api/mcp',
        description: 'Connect the prompts.chat MCP server to any MCP-compatible client for programmatic prompt discovery and retrieval.',
      },
      {
        command: 'npx prompts.chat',
        description: 'Browse and copy prompts from the CLI.',
      },
    ],
  },

  // 12. filip-michalsky/SalesGPT
  {
    kind: 'skill',
    id: 'github-salesgpt-v1',
    slug: 'github-salesgpt',
    name: 'SalesGPT',
    tagline: 'Open-source AI sales agent framework for outreach and conversations.',
    description:
      'SalesGPT by filip-michalsky is an open-source Python framework for context-aware AI sales ' +
      'agents. Tracks conversation stage (introduction → qualification → pitch → objection handling → ' +
      'close), searches a product catalog, generates Stripe payment links, sends emails, schedules ' +
      'Calendly meetings, and supports voice with under-1s latency.',
    role: 'Sales Account Executive',
    industry: 'Sales',
    tags: ['sales', 'outreach', 'ai-agent', 'objection-handling', 'crm'],
    category: 'sales',
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

SalesGPT is an open-source Python framework for building context-aware AI sales agents. It tracks which stage a sales conversation is in (Introduction, Qualification, Value Proposition, Needs Analysis, Solution Presentation, Objection Handling, Close) and adapts responses accordingly. Key capabilities: product catalog lookup via the ProductSearch tool, autonomous Stripe payment link generation to close orders, automated email sending, Calendly meeting scheduling, voice channel support with under-1-second round-trip latency, LangSmith tracing for debugging, and support for 50+ LLMs via LiteLLM. Configure it with your product catalog, company info, salesperson persona, and talk tracks. Run as a CLI script, Docker container, or backend API.

## Install

    pip install salesgpt

Or for full setup with a local clone:

    git clone https://github.com/filip-michalsky/SalesGPT.git && cd SalesGPT && make setup

Create a .env file with OPENAI_API_KEY (or your chosen LLM provider key). Run an example agent:

    python run.py --verbose True --config examples/example_agent_setup.json

Docker: docker-compose up -d (then access at localhost:3000/chat).

## When to use

Use this when you want a programmable sales agent that tracks conversation stage and can autonomously search your product catalog and generate payment links, beyond just drafting email templates. For simple prompt-only use (no coding, no running Python), copy the system prompt from examples/ into a Claude Project instead.`,
      },
    ],
    repoUrl: 'https://github.com/filip-michalsky/SalesGPT',
    githubStars: 2674,
    capabilities: [
      {
        command: 'pip install salesgpt',
        description: 'Install the SalesGPT Python package.',
      },
      {
        command: 'python run.py --verbose True --config examples/example_agent_setup.json',
        description: 'Run a configured AI sales agent from the command line using your product catalog and persona config.',
      },
      {
        command: 'ProductSearch tool',
        description: 'Agent tool that searches the configured product catalog to answer prospect pricing questions accurately.',
      },
      {
        command: 'GeneratePaymentLink tool',
        description: 'Agent tool that autonomously generates a Stripe payment link when a prospect is ready to buy.',
      },
    ],
  },

  // 13. Trystan-SA/claude-design-system-prompt
  {
    kind: 'skill',
    id: 'github-claude-design-system-prompt-v1',
    slug: 'github-claude-design-system-prompt',
    name: 'Claude Design System Prompt',
    tagline: 'System prompt that gives Claude working knowledge of design systems.',
    description:
      'Claude Design System Prompt by Trystan-SA is a 20-chapter system prompt and 14-skill ' +
      'library that turns Claude into an AI-slop-resistant design collaborator. Explicitly rejects ' +
      'AI design tropes (gradients, emoji decoration, Inter-everywhere) and enforces content ' +
      'discipline, visual hierarchy, WCAG accessibility, and system thinking.',
    role: 'UX Designer',
    industry: 'Media & Creative',
    tags: ['design', 'ux', 'design-system', 'accessibility', 'components'],
    category: 'design',
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

Claude Design System Prompt is a 20-chapter system prompt and 14 procedural skills that configure Claude as an opinionated, accessibility-aware, AI-slop-resistant design collaborator. The prompt explicitly rejects common AI design tropes (aggressive gradients, emoji decoration, rounded-corner-with-left-border cards, Inter-everywhere typography) and replaces them with design principles covering content discipline, visual hierarchy and rhythm, typography systems, color systems with oklch(), WCAG 2.2 accessibility, real CSS Grid, and component/token system thinking. The 14 skills group into: Production (discovery-questions, frontend-aesthetic-direction, wireframe, make-a-prototype, make-a-deck, make-tweakable, generate-variations), System (design-system-extract, component-extract), and Review (accessibility-audit, ai-slop-check, hierarchy-rhythm-review, interaction-states-pass, polish-pass). Variants exist for Claude (claude/) with subagents and for OpenAI Codex (codex/) with sequential reviews.

## Key skills

- ai-slop-check, detects gradient/emoji/font/house-style AI tropes
- accessibility-audit, WCAG, semantic HTML, keyboard, motion preferences
- frontend-aesthetic-direction, commits to a non-generic look when no brand exists
- polish-pass, umbrella final-gate review before delivery
- generate-variations, 3+ hi-fi design variations across specified axes

Typical greenfield flow: discovery-questions > frontend-aesthetic-direction > wireframe > make-a-prototype > polish-pass

## Install

Paste claude/system-prompt.md as the system prompt in any LLM that supports system prompts, Claude Projects, Claude Desktop, ChatGPT Custom Instructions, or a local model. Skills in claude/skills/ are invoked by name; the agent loads the matching skill when a task matches its description. MIT licensed.

## When to use

Use this when you want Claude to give design feedback, generate UI, or review components with a genuinely opinionated aesthetic stance rather than defaulting to generic SaaS-template output. The ai-slop-check skill is particularly useful as a pre-delivery gate on any AI-generated frontend.`,
      },
    ],
    repoUrl: 'https://github.com/Trystan-SA/claude-design-system-prompt',
    githubStars: 1522,
    capabilities: [
      {
        command: 'ai-slop-check skill',
        description: 'Detects AI-trope design patterns, gradients, emoji, generic fonts, house-style defaults, and flags them for removal.',
      },
      {
        command: 'accessibility-audit skill',
        description: 'Audits a design or component for WCAG 2.2 compliance, semantic HTML, keyboard navigation, and motion preferences.',
      },
      {
        command: 'frontend-aesthetic-direction skill',
        description: 'Commits to a non-generic visual direction with a four-directions protocol when no existing brand is present.',
      },
      {
        command: 'polish-pass skill',
        description: 'Umbrella final-gate review covering hierarchy, rhythm, accessibility, interaction states, and content discipline.',
      },
    ],
  },

  // 14. aj-geddes/useful-ai-prompts
  {
    kind: 'skill',
    id: 'github-useful-ai-prompts-v1',
    slug: 'github-useful-ai-prompts',
    name: 'Useful AI Prompts',
    tagline: '488 production-ready AI prompts and 260 Claude Code skills across 47 categories.',
    description:
      'Useful AI Prompts by aj-geddes is a production-ready library of 488 standardized prompts ' +
      'across 47 categories, 260+ Claude Code auto-triggering skills, and 7 automation hooks. ' +
      'Every prompt passes 11 quality gates (metadata complete, role-specific, measurable criteria, ' +
      'copy-paste-ready) and ships with a realistic usage example.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['data-analysis', 'sql', 'python', 'prompts', 'reporting'],
    category: 'data',
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

Useful AI Prompts is a production-ready library of 488 standardized prompts, 260+ Claude Code skills, and 7 automation hooks by aj-geddes. Each prompt follows a validated XML-tag structure: <role> (specific expert identity), <context> (situation framing), <input_handling> (required vs optional), <task> (3–7 numbered steps), <output_specification> (format and length), <quality_criteria> (measurable standards), and <constraints> (hard limits). Every prompt passes 11 quality gates before inclusion, including metadata complete, role-specific (not "I'll help you"), inputs categorized, outputs specified, and copy-paste-ready.

Prompt categories span Business & Strategy (business analysis, finance, marketing, operations, project management), Technology & Engineering (software engineering, DevOps, security, data science), Emerging Technologies (quantum computing, blockchain, biotechnology, space economy, renewable energy, healthcare digital), and Creative & Communication (design, presentations, technical writing, learning & development). The 260+ Claude Code skills auto-trigger when Claude Code detects relevant keywords, covering software development, DevOps, testing, security, API design, and database work. The 7 hooks (security-scan, pre-commit-linting, test-runner, dependency-check, auto-format, session-setup, and a post-save formatter) handle automated checks on commit and session start.

## Install

Browse prompts at https://aj-geddes.github.io/useful-ai-prompts/ with full-text search, or directly from the prompts/ directory on GitHub. Copy the ## Prompt section (including XML tags) into Claude, ChatGPT, or any capable model. For Claude Code skills, clone the repo and reference the skills/ directory.

## When to use

Use this when you need a structured, validated prompt for a professional task and don't want to write one from scratch. The 11-gate quality standard means prompts produce consistent output format rather than vague generalities. Particularly strong for business analysis, competitive intelligence, data science, and software engineering workflows.`,
      },
    ],
    repoUrl: 'https://github.com/aj-geddes/useful-ai-prompts',
    githubStars: 287,
    capabilities: [
      {
        command: 'Browse prompts at https://aj-geddes.github.io/useful-ai-prompts/',
        description: 'Search and filter 488 standardized prompts by category using the web interface, then copy the prompt block with XML tags into any AI.',
      },
      {
        command: 'Competitive analysis prompt (prompts/business/)',
        description: 'Uses a 12-year competitive strategist role with a 4-step task structure: map landscape, profile competitors, identify gaps, create action plan with timelines.',
      },
      {
        command: 'security-scan hook (hooks/security-scan/)',
        description: 'Pre-commit hook that scans for vulnerabilities and secrets before each commit.',
      },
      {
        command: 'Claude Code skills in skills/ directory',
        description: '260+ skills that auto-trigger when Claude Code detects relevant keywords across software dev, DevOps, security, API, and database domains.',
      },
    ],
  },

  // 15. travistangvh/ChatGPT-Data-Science-Prompts
  {
    kind: 'skill',
    id: 'github-chatgpt-data-science-prompts-v1',
    slug: 'github-chatgpt-data-science-prompts',
    name: 'ChatGPT Data Science Prompts',
    tagline: '60 data science prompts covering Python, SQL, ML modeling, and explainability.',
    description:
      'ChatGPT Data Science Prompts by travistangvh is a curated collection of 60 copy-paste ' +
      'prompts for data science work. Covers writing Python (ML models, AutoML, hyperparameter ' +
      'tuning, visualizations), explaining and optimizing SQL and Python code, EDA, feature ' +
      'engineering, troubleshooting, and explaining models with LIME and SHAP.',
    role: 'Data Analyst',
    industry: 'Technology',
    tags: ['data-science', 'eda', 'machine-learning', 'prompts', 'visualization'],
    category: 'data',
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

ChatGPT Data Science Prompts by travistangvh is a curated collection of 60 copy-paste prompts for data science tasks. The prompts use a consistent "I want you to act as a data scientist and [task]" pattern with clearly marked [squarebrackets] for the parts you fill in.

Categories: Write Python (train classification/time-series models, AutoML with TPOT, tune hyperparameters, visualize with matplotlib, write multithreaded functions, write unit tests, validate pandas DataFrames), Explain Code (Python, SQL, Google Sheets formulas), Optimize Code (improve time complexity, optimize pandas, simplify Python, speed up SQL), Format Code (write documentation, improve readability, format SQL), Translate Code (between DBMS dialects, Python to R, R to Python), Explain Concepts (for five-year-olds, undergrads, professors, business stakeholders, StackOverflow style), Suggest Ideas (edge cases, dataset recommendations, portfolio project ideas, feature engineering, A/B test design, career coaching), Troubleshoot (correct Python/SQL code, debug Power BI), Write SQL (running averages, LeetCode-style data problems), Write Other Code (Google Sheets formulas, R scripts, shell commands, VBA), and Misc (format tables, summarize books/papers).

## Key prompts

- Train a classification model: "Act as a data scientist. I have a dataset of [describe dataset]. Please build a machine learning model that predicts [target variable]."
- Explain model with SHAP: "Act as a data scientist. I have trained a scikit-learn XGBoost model and I would like to explain the output using a series of plots with Shap. Please write the code."
- Suggest feature engineering: "Act as a data scientist and perform feature engineering. I am working on a model that predicts [feature]. There are columns: [describe columns]. Can you suggest features?"

## Install / access

Repository: https://github.com/travistangvh/ChatGPT-Data-Science-Prompts

All 60 prompts are in the README. Replace [squarebrackets] with your specifics and paste into Claude, ChatGPT, or any capable model. A PDF of all prompts with ChatGPT response screenshots is available at chatgpt-datascience-prompt.pdf in the repo.

## When to use

Use this when you need a starting prompt for a data science coding task and don't want to write one from scratch. Particularly fast for model-building, code debugging, and model-explainability tasks. Works in Claude, ChatGPT, Gemini, and any instruction-following model.`,
      },
    ],
    repoUrl: 'https://github.com/travistangvh/ChatGPT-Data-Science-Prompts',
    githubStars: 1616,
    capabilities: [
      {
        command: 'Train classification model prompt',
        description: '"Act as a data scientist and code for me. I have a dataset of [describe dataset]. Please build a machine learning model that predicts [target variable]."',
      },
      {
        command: 'Explain model with SHAP prompt',
        description: 'Generates scikit-learn XGBoost model explanation code with SHAP plots.',
      },
      {
        command: 'AutoML with TPOT prompt',
        description: '"Act as an AutoML bot using TPOT. I am working on a model that predicts [...]. Write Python code to find the best classification model with the highest AUC score on the test set."',
      },
      {
        command: 'Suggest A/B testing steps prompt',
        description: '"Act as a statistician. [Describe context.] Please design an A/B test including concrete steps on which statistical test I should run."',
      },
    ],
  },

  // 16. ajhcs/healthcare-agents
  {
    kind: 'skill',
    id: 'github-healthcare-agents-v1',
    slug: 'github-healthcare-agents',
    name: 'Healthcare Agents',
    tagline: '51 specialist AI agents for US healthcare administration across 10 domains.',
    description:
      'Healthcare Agents by ajhcs is 51 specialist AI agents for US healthcare administration, ' +
      'covering revenue cycle, quality/compliance, clinical operations, payer relations, health IT, ' +
      'population health, pharmacy, operations, strategy, and emergency preparedness. ' +
      'Installs into Claude Code, Codex, Cursor, Copilot, and other agentic tools via npx.',
    role: 'Clinical Assistant',
    industry: 'Healthcare',
    tags: ['healthcare', 'clinical', 'agents', 'patient-care', 'documentation'],
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

Healthcare Agents by ajhcs is a model-agnostic prompt library of 51 specialist AI agents for US healthcare administration. Each agent is a long-form Markdown specialist with YAML frontmatter, role-specific source awareness (HIPAA, CMS, OIG, HEDIS, Stars, MIPS/QPP, HRSA 340B, NHSN, TEFCA, HL7/FHIR, X12, and others), compliance boundaries, operational workflows, and concrete deliverable templates. The agents span 10 administrative domains: Strategy & Advisory, Clinical Operations, Quality/Safety/Compliance, Revenue Cycle & Finance, Payer & Managed Care, Health IT & Informatics, Operations & Administration, Population Health, Pharmacy & Drug Programs, and Emergency & Preparedness.

The Workup Engine routes a plain-language healthcare admin problem to a canonical workflow, primary specialist, supporting handoffs, evidence list, and safety boundaries. Version 1.5.0 adds Operator OS, 16 workflow-specific offline evidence packs with citation cards, provenance labels, and secure-environment defaults (no live network fetching by default).

Each agent supports four output modes: quick triage (root cause analysis), workplan (owners, timeline, KPIs), audit/checklist (evidence, pass/fail criteria), and artifact/template (draft work product).

## Install

Fast path (Claude Code subagents):

    npx --yes healthcare-agents install --claude

Codex plugin:

    git clone https://github.com/ajhcs/healthcare-agents.git && cd healthcare-agents && bash scripts/install-codex-plugin.sh

Other tools (Cursor, Copilot, OpenCode, Windsurf, Aider, Gemini CLI, Cline):

    npx --yes healthcare-agents install --all

Preview without writing files: npx --yes healthcare-agents install --all --dry-run

## When to use

Use this when you need a healthcare-domain specialist that knows the correct regulatory framework for the problem. Instead of a generic "follow HIPAA" response, the revenue-cycle-specialist knows CARC/RARC, 837/835, CDM, denial mechanics, and coding. The quality-compliance-officer distinguishes HIPAA Privacy Rule from Security Rule from Breach Notification. Not for final clinical, legal, coding, billing, audit, or compliance determinations, always consult qualified professionals.`,
      },
    ],
    repoUrl: 'https://github.com/ajhcs/healthcare-agents',
    githubStars: 43,
    capabilities: [
      {
        command: 'npx --yes healthcare-agents install --claude',
        description: 'Install all 51 healthcare specialist agents as Claude Code subagents.',
      },
      {
        command: 'healthcare-agents workup "Commercial payer denial rate jumped 18% after a policy change"',
        description: 'Routes the plain-language problem to the correct specialist, handoffs, evidence to collect, red flags, and a platform-ready prompt.',
      },
      {
        command: 'revenue-cycle-specialist agent in audit/checklist mode',
        description: 'Produces an evidence-request checklist for a clean claim rate or denial problem with pass/fail criteria and remediation owners.',
      },
      {
        command: 'healthcare-agents workflows / healthcare-agents show <agent-slug>',
        description: 'Lists all 16 supported Operator OS workflows or shows full details for a specific specialist agent.',
      },
    ],
  },

  // 17. FortaTech/prompts-for-health
  {
    kind: 'skill',
    id: 'github-prompts-for-health-v1',
    slug: 'github-prompts-for-health',
    name: 'Prompts for Health',
    tagline: '12 documented healthcare prompts for SOAP notes, discharge summaries, and prior auth.',
    description:
      'Prompts for Health by FortaTech is a collection of 12 screened prompt templates for ' +
      'healthcare professionals: SOAP notes from clinical notes or transcripts, discharge ' +
      'summaries, prior authorization letters, patient message replies, differential diagnoses, ' +
      'clinical trial eligibility, and de-identification. Use with HIPAA-compliant AI services only.',
    role: 'Medical Scribe',
    industry: 'Healthcare',
    tags: ['healthcare', 'medical-scribe', 'documentation', 'prompts', 'clinical'],
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

Prompts for Health by FortaTech is a collection of 12 screened, documented prompt templates for healthcare professionals. Each prompt page includes a description, the full prompt text, and a worked example. The 12 prompts cover: De-Identify Text, Brainstorm Differential Diagnoses, Determine Patient Eligibility for a Clinical Trial, Discharge Summary from Notes, Draft Replies to Patient Messages, Explaining Health Concepts Across Cultures and Age/Education Levels, Extract Information from Forms, Generate a Framework of Questions for a Patient Visit, Generate Prior Authorization Letter, Generate SOAP Notes from Clinical Notes, Generate SOAP Notes from a Transcript, and Locate Healthcare Services.

PHI warning: only use prompts that include PHI or PII in HIPAA- and GDPR-compliant AI services. As of the repo README, OpenAI ChatGPT and ChatGPT+ are not compliant with most healthcare data security regulations. BastionGPT, Microsoft O365 Copilot, and Azure OpenAI can meet applicable regulations in most circumstances.

## Install / access

Repository: https://github.com/FortaTech/prompts-for-health

Browse to the relevant .md file (e.g. SOAP-Notes-from-Clinical-Notes.MD), copy the prompt text, and append your clinical information at the end. MIT licensed.

## When to use

Use this when you need a pre-screened, safe-use-first prompt for clinical documentation tasks. The SOAP-notes-from-transcript prompt is particularly useful for medical scribes: paste the encounter transcript at the end and receive a structured SOAP note for physician review. Always have a qualified clinician verify AI-generated clinical content before it enters an electronic medical record.`,
      },
    ],
    repoUrl: 'https://github.com/FortaTech/prompts-for-health',
    githubStars: 29,
    capabilities: [
      {
        command: 'Generate SOAP Notes from a Transcript (SOAP-Notes-from-Transcript.MD)',
        description: 'Paste an encounter transcript at the end of the prompt; Claude structures it into a SOAP note for physician review.',
      },
      {
        command: 'Generate Prior Authorization Letter (Generate-Prior-Authorization-Letter.MD)',
        description: 'Generates a prior authorization letter from clinical notes; append the relevant patient and treatment details.',
      },
      {
        command: 'Discharge Summary from Notes (Discharge-Summary-from-Notes.MD)',
        description: 'Converts clinical encounter notes into a structured discharge summary for clinician review before use.',
      },
      {
        command: 'De-Identify Text (Anonymize-Text.MD)',
        description: 'Removes or replaces PHI/PII from clinical text; verify outputs in a HIPAA-compliant environment before use.',
      },
    ],
  },

  // 18. GarethManning/education-agent-skills
  {
    kind: 'skill',
    id: 'github-education-agent-skills-v1',
    slug: 'github-education-agent-skills',
    name: 'Education Agent Skills',
    tagline: '165 evidence-based pedagogical skills across 20 domains for Claude and Codex.',
    description:
      'Education Agent Skills by GarethManning is an open-source library of 165 skills across ' +
      '20 domains grounded in named educational research. Covers memory science, metacognition, ' +
      'curriculum design, assessment, EAL/D, Montessori, systems thinking, inclusive design, ' +
      'and a student-facing domain. Installs into Claude Code, Codex, Hermes Agent, and any ' +
      'Agent Skills-compatible tool.',
    role: 'Classroom Teacher',
    industry: 'Education',
    tags: ['education', 'teaching', 'lesson-planning', 'assessment', 'skills'],
    category: 'education',
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

Education Agent Skills by GarethManning is an open-source library of 165 evidence-based pedagogical skills across 20 domains, built for Claude Code, OpenAI Codex, Hermes Agent, and any Agent Skills-compatible tool. Every skill is grounded in named research (specific authors, studies, findings) and rated by evidence strength (Strong, Moderate, Emerging, Original). Frameworks without empirical support, learning styles, VAK, are excluded; EXCLUSIONS.md documents why.

The 20 domains include: Memory & Learning Science (8 skills: retrieval practice, spacing, interleaving, cognitive load, dual coding, elaborative interrogation, feedback), Self-Regulated Learning & Metacognition (5 skills), Explicit & Direct Instruction (5 skills), Questioning & Dialogue (5 skills), Literacy/Writing/Critical Thinking (7 skills), EAL/D & Language Development (5 skills), Curriculum Design & Assessment (13 skills: backwards design, rubric generation, formative assessment, differentiation, gap analysis, learning progressions, PBL), Wellbeing/Motivation/Agency (12 skills), Professional Learning & Teacher Development (10 skills), Global & Cross-Cultural Pedagogies (9 skills), Environmental & Experiential Learning (6 skills), AI Learning Science (14 skills), AI Literacy (7 skills), Montessori & Alternative Evidence-Based Approaches (4 skills), Original Frameworks (17 skills), Curriculum Alignment (4 skills), Historical Thinking (10 skills), Systems Thinking (8 skills), Inclusive Design (3 skills), and Student-Facing Learning Skills (13 live-session skills for learners).

Each skill is a folder under skills/ containing SKILL.md with YAML frontmatter (typed inputs/outputs, evidence sources, chaining metadata, evidence strength rating). No build step, copy skill folders into any tool's skills directory.

## Install

Claude CoWork (easiest): Customize → (+) Add Plugin → paste https://github.com/GarethManning/education-agent-skills

Claude Code CLI:

    claude plugin install https://github.com/GarethManning/education-agent-skills

Codex (local):

    git clone https://github.com/GarethManning/education-agent-skills.git && cd education-agent-skills && codex plugin marketplace add "$PWD"

Hosted MCP (requires free auth token from the repo's signup form):

    { "mcpServers": { "education-skills": { "type": "streamable-http", "url": "https://mcp-server-sigma-sooty.vercel.app/mcp", "headers": { "Authorization": "Bearer <token>" } } } }

Manual: copy skill folders from skills/ into your tool's skills directory.

## When to use

Use this when you need lesson planning, rubric generation, formative assessment, or curriculum design that is grounded in actual educational research, not generic instructional templates. The spaced-practice-scheduler skill, for example, follows Cepeda et al.'s (2006) meta-analysis on optimal spacing intervals and returns a week-by-week schedule with interleaved retrieval activities. Use the student-facing domain (Domain 20) when building AI tutoring flows that adapt to learner progress in real time.`,
      },
    ],
    repoUrl: 'https://github.com/GarethManning/education-agent-skills',
    githubStars: 380,
    capabilities: [
      {
        command: 'claude plugin install https://github.com/GarethManning/education-agent-skills',
        description: 'Install all 165 education skills into Claude Code CLI.',
      },
      {
        command: 'spaced-practice-scheduler skill (skills/memory-learning-science/)',
        description: 'Generates a week-by-week spaced retrieval schedule for a topic list using Cepeda et al. (2006) optimal spacing intervals.',
      },
      {
        command: 'backwards-design skill (skills/curriculum-design-assessment/)',
        description: 'Produces a backwards-design unit plan starting from desired outcomes and working back to assessment evidence and learning activities.',
      },
      {
        command: 'student-facing skills (Domain 20, skills/student-learning/)',
        description: '13 live-session skills including retrieve-first gate, progressive hint ladder, confidence calibration check, and fading manager, for AI tutoring flows that run during a student\'s study session.',
      },
    ],
  },

  // 19. microsoft/prompts-for-edu
  {
    kind: 'skill',
    id: 'github-microsoft-prompts-for-edu-v1',
    slug: 'github-microsoft-prompts-for-edu',
    name: 'Microsoft Prompts for Education',
    tagline: "Microsoft's AI prompt library organized by role: Educators, Students, Staff, Administrators.",
    description:
      'Prompts for Education by Microsoft is a prompt library for K-12 and higher education ' +
      'organized into four role-based sections: Educators, Students, Staff, and Administrators. ' +
      'Designed for ChatGPT, Bing Chat, and Microsoft Copilot. MIT licensed. Works in any ' +
      'instruction-following AI including Claude.',
    role: 'Classroom Teacher',
    industry: 'Education',
    tags: ['education', 'microsoft', 'prompts', 'lesson-design', 'administration'],
    category: 'education',
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

Prompts for Education is a Microsoft-maintained prompt library for K-12 and higher education staff and students. The repository is organized into four role-based sections, Educators (lesson design, automating routine tasks, answering student questions), Students (exploring subjects, enhancing creativity, personalizing learning), Staff (workflow automation, communication drafts), and Administrators (policy documents, reporting, professional development plans). Prompts are designed for ChatGPT, Bing Chat/Copilot, and any capable instruction-following model including Claude.

The repository is described as a work in progress: prompt density varies by section. The Educators section is most developed and covers creating engaging lessons, answering common student inquiries, and automating routine administrative writing. MIT licensed.

## Install / access

Repository: https://github.com/microsoft/prompts-for-edu

Browse the four role folders on GitHub, Educators/, Students/, Staff/, Administrators/, and copy the relevant prompts into Claude Projects, ChatGPT Custom Instructions, or Microsoft Copilot. No install required.

## When to use

Use this when you want a Microsoft-vetted starting point for education prompts, particularly for Copilot integration in an organization already using Microsoft 365. The Educators section is most useful for lesson design and student-facing communication tasks. For deeper, research-grounded pedagogical skills with typed inputs and outputs, see GarethManning/education-agent-skills instead.`,
      },
    ],
    repoUrl: 'https://github.com/microsoft/prompts-for-edu',
    githubStars: 1861,
    capabilities: [
      {
        command: 'Educators/ section prompts',
        description: 'Prompts for creating engaging lessons, answering student questions, and automating routine classroom administrative tasks.',
      },
      {
        command: 'Students/ section prompts',
        description: 'Prompts that help students explore subjects in depth, develop writing and critical thinking skills, and personalize their learning.',
      },
      {
        command: 'Administrators/ section prompts',
        description: 'Prompts for administrative writing tasks including policy documents, professional development plans, and institutional reporting.',
      },
    ],
  },

  // 20. eseckel/ai-for-grant-writing
  {
    kind: 'skill',
    id: 'github-ai-for-grant-writing-v1',
    slug: 'github-ai-for-grant-writing',
    name: 'AI for Grant Writing',
    tagline: 'Curated AI services, prompt collections, and quick prompts for competitive grant applications.',
    description:
      'AI for Grant Writing by eseckel is a curated resource list for researchers and nonprofit ' +
      'grant writers: AI services comparison (ChatGPT, Grammarly, Grantable, Gemini, Copilot, Curie, ' +
      'Proposia), prompt engineering guides, and 20+ ready-to-copy grant-writing prompts for NIH ' +
      'Specific Aims, clarity, structure, review criteria alignment, and title generation.',
    role: 'Grant Writer',
    industry: 'Nonprofit',
    tags: ['grant-writing', 'nonprofit', 'prompts', 'fundraising', 'writing'],
    category: 'writing',
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

AI for Grant Writing by eseckel is a curated resource list for developing competitive grant applications, organized into three sections: Useful Services (a comparison table of AI tools, ChatGPT, Gemini, Copilot, Grammarly, Grantable, Curie, DeepL, Proposia, across spell/grammar, text generation, translation, mock review, and image generation), Prompt Resources (prompt collections and prompt engineering guides), and Grant Writing-Specific Resources (curated links to NIH, NSF, and academic grant-writing guides including NIH Grant Writing Tip Sheets, NSF's Guide for Proposal Writing, and peer-reviewed papers on using LLMs for grants).

The Quick Prompts section includes 20+ ready-to-copy prompts grouped by task: enhancing text clarity, making text more compelling, improving structure and flow, aligning with funding agency mission, aligning with review criteria, developing a strong grant title, identifying challenges of proposed aims, and developing a project timeline. Example:
- "Please provide feedback on my writing style and how I can make it more persuasive and compelling for the grant reviewer."
- "Suggest five potential titles for a grant proposal that will attract readers while encompassing the research question and key elements from the provided abstract [insert abstract summary]."
- "How can I better align my proposal to specifically address the [insert specific criteria] outlined in this funding announcement for [insert name of funding opportunity]?"

## Install / access

Repository: https://github.com/eseckel/ai-for-grant-writing

Browse the README and copy the relevant quick prompts directly into Claude, ChatGPT, Gemini, or Copilot. No install required. The resource links (NIH Tip Sheets, NSF Guide) are the most durable references for grounding your prompts in funder expectations.

## When to use

Use this when you need to quickly improve a grant draft's clarity, persuasiveness, or alignment with reviewer criteria. The quick prompts are especially useful for iterating on already-written sections, paste a paragraph and ask one of the review-criteria alignment prompts to identify gaps. For writing full sections from scratch, combine these prompts with your organization's actual program data and funder guidelines.`,
      },
    ],
    repoUrl: 'https://github.com/eseckel/ai-for-grant-writing',
    githubStars: 4144,
    capabilities: [
      {
        command: 'Review criteria alignment prompt',
        description: '"I am applying to [fellowship name]. Please provide me feedback on how well I am addressing this review criteria: [criteria], and suggestions for what I am missing and how I can improve."',
      },
      {
        command: 'Grant title generation prompt',
        description: '"Suggest five potential titles for a grant proposal that will attract readers while encompassing the research question and key elements from the provided abstract [insert abstract summary]."',
      },
      {
        command: 'Timeline development prompt',
        description: '"Assist in developing a detailed project timeline and milestones for my grant proposal to demonstrate feasibility using my project summary and specific aims [insert project summary]."',
      },
      {
        command: 'AI services comparison table (README)',
        description: 'Side-by-side table comparing ChatGPT, Gemini, Copilot, Grammarly, Grantable, Curie, DeepL, and Proposia across spell/grammar, text generation, translation, mock review, and image generation with free-tier indicators.',
      },
    ],
  },

  // 21. ahacker-1/cre-agent-skills
  {
    kind: 'skill',
    id: 'github-cre-agent-skills-v1',
    slug: 'github-cre-agent-skills',
    name: 'CRE Agent Skills',
    tagline: '66 standalone CRE skills across Industrial, Brokerage, Asset Management, Office, and Capital Markets.',
    description:
      'CRE Agent Skills by ahacker-1 is a collection of 66 standalone Markdown skill files for ' +
      'commercial real estate professionals. Organized into five packs, Industrial, Brokerage ' +
      'Investment Sales, Asset Management, Office, and Capital Markets, with 23 knowledge bases ' +
      'and 57 research notes. Each skill works in Claude Code, Claude Projects, Cursor, or any LLM tool.',
    role: 'Real Estate Agent',
    industry: 'Real Estate',
    tags: ['real-estate', 'cre', 'skills', 'listings', 'leasing'],
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

CRE Agent Skills by ahacker-1 is 66 standalone Markdown CRE skill files, no API keys, no dependencies, no orchestrator required. Each .md file drops into Claude Code, Claude Projects, ChatGPT, Cursor, or any LLM-powered tool and handles a specific, defined piece of CRE work.

The skills span five packs: Multifamily (original core, drawn from the CRE Acquisition Orchestrator), Industrial v1 (8 skills), Brokerage Investment Sales v1 (8 skills), Asset Management v1 (9 skills, budgets, variance, renewals, capex execution, NOI improvement, hold/sell/refi decisions, quarterly LP reviews), Office v1 (8 skills, flight-to-quality market study, rent roll and stacking plan analysis, lease abstract review, rollover and occupancy-cost analysis, TI/LC underwriting, tenant credit, financing fit, IC memo), and Capital Markets v1 (8 skills, debt maturity diagnostics, refinance proceeds gaps, extension/workout strategy, rescue capital comparison, capital stack term sheet comparison, CMBS special servicing readiness, lender update packages, recap IC memo). The Capital Markets pack is property-type-agnostic.

Each skill comes with benchmarks that trace to cited sources, organized in 23 knowledge bases. 57 research notes in research/ provide additional depth by pack and topic. 11 Claude Code plugins provide one-command installs for specific packs.

## Install

Clone the repo and copy the relevant skill file into your tool's skills or projects directory, no other setup needed:

    git clone https://github.com/ahacker-1/cre-agent-skills.git

Claude Code plugin install for a specific pack:

    /cre-capital-markets   (Capital Markets pack)
    /cre-asset-management  (Asset Management pack)
    /cre-office            (Office pack)

Apache 2.0 license.

## When to use

Use this when you have a specific piece of CRE work in front of you and want a structured, CRE-domain-aware skill rather than a generic prompt. The Asset Management pack is most useful for post-acquisition operations (budgets, variance analysis, hold/sell/refi decisions). The Capital Markets pack covers the refinance, extension, and workout decisions that cut across all asset types.`,
      },
    ],
    repoUrl: 'https://github.com/ahacker-1/cre-agent-skills',
    githubStars: 64,
    capabilities: [
      {
        command: '/cre-capital-markets Claude Code plugin',
        description: 'Installs the Capital Markets pack: debt maturity diagnostics, refinance proceeds gaps, extension/workout strategy, rescue capital comparison, CMBS special servicing readiness, and recap IC memo.',
      },
      {
        command: 'Asset Management pack skills',
        description: 'Covers post-acquisition operations: budgets, variance analysis, lease renewals, capex execution, NOI improvement, hold/sell/refi decisions, and quarterly LP reviews.',
      },
      {
        command: 'Office pack: lease abstract review skill',
        description: 'Structured skill for reviewing lease abstracts, rollover and occupancy-cost analysis, TI/LC underwriting, tenant credit, and financing fit.',
      },
      {
        command: 'Capital Markets: debt maturity diagnostics skill',
        description: 'Diagnoses debt maturity risk and models refinance proceeds gaps for a specific property or portfolio.',
      },
    ],
  },

  // 22. sgharlow/claude-code-recipes
  {
    kind: 'skill',
    id: 'github-claude-code-recipes-v1',
    slug: 'github-claude-code-recipes',
    name: 'Claude Code Recipes',
    tagline: '100 Claude Code recipes in 10 tiers for knowledge workers across all professional roles.',
    description:
      'Top 100 Claude Code Recipes for Knowledge Workers by sgharlow is a structured recipe book ' +
      'with 100 step-by-step Claude Code workflows in 10 tiers: Universal tasks, Leadership, ' +
      'Strategy & Analysis, Professional Communication, Operations & Compliance, Data & Reporting, ' +
      'HR, Sales, Project/Product Management, and Technical. Premium 200-recipe slash-command ' +
      'collection available separately.',
    role: 'Operations Manager',
    industry: 'Operations',
    tags: ['operations', 'automation', 'recipes', 'runbooks', 'process'],
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

Top 100 Claude Code Recipes for Knowledge Workers by sgharlow is a structured recipe book (Version 1.0, December 2025) with 100 step-by-step workflows for professional use of Claude Code. Each recipe has a consistent structure: The Problem, The Outcome, When to Use, Prerequisites, How Claude Helps, Step-by-Step (with prompts), Example Output, Troubleshooting, Variations, and Building Your System.

The 100 recipes span 10 tiers: Tier 1 Universal High-Frequency Wins (meeting notes to action items, weekly status reports, email drafting, document summarization, presentations, calendar optimization, research synthesis, task organization, data cleanup, quick reference guides), Tier 2 Leadership & Management (board meeting prep, high-stakes communications, performance reviews, 1:1 prep, OKRs, budget scenarios, delegation briefs), Tier 3 Strategy & Analysis (competitive intelligence, strategic planning, market research, financial analysis, risk assessment, business cases, SWOT), Tier 4 Professional Communication (proposals, RFP responses, newsletters, blog posts, case studies, executive ghostwriting, press releases, speech writing), Tier 5 Operations & Compliance (policy/procedure docs, SOPs, contract review, vendor evaluation, incident RCA, regulatory impact, audit prep, change management, SLAs), Tier 6 Data & Reporting (dashboard narratives, survey analysis, KPI commentary, customer feedback synthesis, sales pipeline), Tier 7 HR & People Operations (job descriptions, interview question banks, employee handbooks, training materials, onboarding), Tier 8 Sales & Customer Operations (sales call prep, win/loss analysis, QBR prep, sales enablement, lead scoring), Tier 9 Project & Product Management (project charters, requirements docs, sprint planning, roadmap communication, release notes), and Tier 10 Technical & Specialized (technical documentation, API docs, security assessments, knowledge bases, legal research summaries).

## Install

Free 100 recipes are in the recipes/ directory:

    git clone https://github.com/sgharlow/claude-code-recipes

10 free sample slash commands are in the premium/ folder. Install them:

    cp premium/recipe-*.md ~/.claude/commands/   # Mac/Linux

Then invoke with: /recipe-001 [your meeting notes here]

The premium collection (200 recipes as slash commands, $79.99 one-time) installs all 200 commands. See the README for the Lemon Squeezy link.

## When to use

Use this as a reference book for professional Claude Code workflows, find the recipe for the task you're facing today and follow it. The Tier 1 universal recipes (meeting notes, email drafting, document summarization, research synthesis) deliver the fastest immediate returns. The Tier 5 operations recipes (SOP writing, contract review, incident RCA, audit prep) are particularly strong for operations managers.`,
      },
    ],
    repoUrl: 'https://github.com/sgharlow/claude-code-recipes',
    githubStars: 289,
    capabilities: [
      {
        command: '/recipe-001 [meeting notes]',
        description: 'Meeting Notes to Action Items, converts raw meeting notes into organized action items, owners, and deadlines. Saves 30–60 min per meeting.',
      },
      {
        command: '/recipe-042 [process description]',
        description: 'Process Documentation and SOPs, turns a verbal or written process description into a structured SOP. Saves 4–8 hours per process.',
      },
      {
        command: '/recipe-045 [incident log]',
        description: 'Incident Analysis and Root Cause Reports, structures an incident timeline into an RCA draft. Saves 3–5 hours per incident.',
      },
      {
        command: '/recipe-021 [competitor data]',
        description: 'Competitive Intelligence Synthesis, structures competitor data into a positioning analysis with action plan. Saves 6–10 hours per report.',
      },
    ],
  },

  // 23. deanpeters/product-manager-prompts
  {
    kind: 'skill',
    id: 'github-deanpeters-pm-prompts-v1',
    slug: 'github-deanpeters-pm-prompts',
    name: 'Product Manager Prompts (deanpeters)',
    tagline: '96 prompt assets across PRD writing, workshops, market intelligence, storytelling, and loops.',
    description:
      'Product Manager Prompts by deanpeters is a community-built library of 96 prompt assets ' +
      'for AI-assisted product management. Organized into /prompts (execution-quality artifacts), ' +
      '/workshops (guided working sessions), /market-intelligence (autonomous web research), ' +
      '/storytelling, and /loops (batch and agent workflows). Works in ChatGPT, Claude, Copilot, Gemini.',
    role: 'Market Researcher',
    industry: 'Consulting & Professional Services',
    tags: ['market-research', 'discovery', 'prompts', 'competitive-analysis', 'product'],
    category: 'research',
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

Product Manager Prompts by deanpeters (v2.1, July 2026, MIT License) is a community-built library of 96 practical prompt assets for AI-assisted product management. The library uses three interaction modes: facilitation (AI asks 3–5 questions then builds the artifact), checkpointed co-construction (section-by-section with gates), and autonomous investigation (web research with citations, labeled Fact/Inference/Assumption). Every prompt carries an HTML comment block with pedagogic notes explaining why the prompt is shaped the way it is, visible by clicking Raw on GitHub.

Directory structure: /prompts, execution-quality one-pass artifacts (PRD, jobs-to-be-done, stakeholder map, premortem, user story, lean UX canvas, agent strategy canvas, session saver), /workshops, facilitated multi-step working sessions (battle card, PRD section-by-section, opportunity solution tree, feature investment, problem framing, painstorming), /market-intelligence, autonomous research prompts with evidence contracts, question budgets, and materiality bars (market landscape scan, competitive research snapshot, competitive intel watch, voice-of-customer miner, TAM/SAM/SOM, battle card builder, SWOT, Porter's Five Forces, Ansoff matrix), /storytelling, narrative and storyboard prompts (Research-to-Narrative Bridge, hero's journey, Starts-with-Why arcs), /loops, batch and agent-ready workflows with optional Jinja2 notation (story-splitting-loop, PRD section loop, epic-story batch, research synthesis loop, competitive watch routine, SWOT batch, market sizing loop).

The market-intelligence prompts run unattended, designed for agent workflows and scheduled runs with stop conditions. The CLAUDE.md / AGENTS.md in the repo defines the authoring contract for AI-assisted contributions.

## Install / access

Repository: https://github.com/deanpeters/product-manager-prompts

Copy-paste any prompt into ChatGPT, Claude, Gemini, or Copilot. No install required. A generated catalog at catalog/INDEX.md lists every asset with a one-line description. For agent workflows using the /loops prompts, run validate-prompts.py and generate-catalog.py after any prompt edits.

## When to use

Use /prompts when you know the situation and want execution-quality output in one pass. Use /workshops when the situation is fuzzy and you want a guided working session that ends in a finished deliverable. Use /market-intelligence when you need evidence about a market, not another meeting, these prompts do the fieldwork with citations.`,
      },
    ],
    repoUrl: 'https://github.com/deanpeters/product-manager-prompts',
    githubStars: 975,
    capabilities: [
      {
        command: 'prd-prompt-template (prompts/)',
        description: 'Write a PRD from your discovery notes, execution-quality output in one pass with checkpointed co-construction across sections.',
      },
      {
        command: 'market-landscape-scan (market-intelligence/)',
        description: 'Autonomous market research prompt with a search plan, real URLs, and Fact/Inference/Assumption labels, designed to run unattended in agent workflows.',
      },
      {
        command: 'opportunity-solution-tree-workshop (workshops/)',
        description: 'Facilitated working session that produces an opportunity solution tree with the first validated experiment identified.',
      },
      {
        command: 'story-splitting-loop (loops/)',
        description: 'Splits epics until nothing splits, with a configurable pass ceiling, agent-ready with optional Jinja2 control flow.',
      },
    ],
  },

  // 24. ai-boost/awesome-prompts
  {
    kind: 'skill',
    id: 'github-ai-boost-awesome-prompts-v1',
    slug: 'github-ai-boost-awesome-prompts',
    name: 'Awesome Prompts (ai-boost)',
    tagline: 'Prompt engineering resource with copy-paste prompts, frameworks, papers, and system prompt leaks.',
    description:
      'Awesome Prompts by ai-boost is a curated, engineering-biased prompt resource covering ' +
      'copy-paste prompts (coding, DevOps, AI/ML, product, legal, healthcare, writing), prompt ' +
      'engineering frameworks (DSPy, promptfoo, TextGrad, Guidance), system prompt leaks, agent ' +
      'ecosystem references, and 100+ research papers on LLM reasoning, RAG, and safety.',
    role: 'Market Researcher',
    industry: 'Technology',
    tags: ['prompts', 'prompt-engineering', 'frameworks', 'llm', 'collection'],
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

Awesome Prompts by ai-boost is a curated, engineering-biased prompt resource that covers both prompt templates and the "prompt as engineering" camp. The project explicitly separates the two: prompt templates (copy-paste recipes) and prompt engineering (compiling LM programs, testing and regressing prompts, optimizing prompts automatically).

Copy-paste ready prompts span: Coding & Development, DevOps & SRE, Data Engineering, AI & ML, Product & Strategy, Project Management, Healthcare & Clinical, Industrial & Automotive, Legal & Compliance, Knowledge & Documentation, Writing & Academic, Learning & Education, Research & Analysis, Productivity & Tasks, Safety & Compliance, Meta & Prompt Engineering, Image/Video/Audio Generation, Creative & Role-play, Game Development, Translation, and Legacy 2023-era prompts.

The Frameworks section covers the engineering camp: Prompt Programming (DSPy for LM program compilation), Automatic Prompt Optimization (TextGrad, GEPA), Eval & Testing (promptfoo), Red Team & Security (adversarial prompt testing), and Low-Code & Workflow Platforms. The System Prompt Leaks section collects leaked production system prompts from real products, useful for studying what prompt patterns deployed AI systems use. The Papers section covers 100+ LLM research papers organized into Foundations, Optimization, Reasoning, RAG, Agents, Multi-Agent, Safety, Self-Improving Agents, Tool Use, Evaluation, Memory, and Multimodal.

## Install / access

Repository: https://github.com/ai-boost/awesome-prompts

Browse sections on GitHub and copy the relevant prompts directly. No install required. The repo is best used as a reference and discovery resource rather than a structured workflow tool, it indexes and links rather than providing self-contained installation.

## When to use

Use this when you want a curated starting point for prompt engineering techniques, frameworks, or research, particularly if you are building AI-powered features or tools and need to understand what the current prompt engineering landscape looks like. The System Prompt Leaks section is genuinely useful for learning production prompt patterns. For structured, workflow-ready prompts, the /prompts section is useful but not as deep as role-specific libraries like useful-ai-prompts or product-manager-prompts.`,
      },
    ],
    repoUrl: 'https://github.com/ai-boost/awesome-prompts',
    githubStars: 8415,
    capabilities: [
      {
        command: 'Prompts section, 20+ topic categories',
        description: 'Copy-paste prompts for coding, DevOps, data engineering, AI/ML, product, healthcare, legal, and more, all open, click and copy.',
      },
      {
        command: 'Frameworks section, Prompt Programming',
        description: 'Covers DSPy (compile LM programs), TextGrad (automatic prompt optimization), promptfoo (eval & regression testing), and Guidance (structural generation control).',
      },
      {
        command: 'System Prompt Leaks section',
        description: 'Collected leaked system prompts from real production AI products, useful for understanding what prompt patterns deployed systems actually use.',
      },
      {
        command: 'Papers section',
        description: '100+ research papers on LLM foundations, optimization, reasoning, RAG, agents, multi-agent systems, safety, tool use, evaluation, memory, and multimodal, organized by topic.',
      },
    ],
  },
];
