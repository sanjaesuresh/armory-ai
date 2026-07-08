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
      'tailored for financial services use cases — analysis, summarization, and client ' +
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

An official Anthropic repository of prompts and examples built for financial-services workflows. Covers financial document analysis (earnings reports, regulatory filings, balance sheets), summarization of long-form financial texts, and drafting client-facing communications. Examples are written with the accuracy and compliance constraints typical in regulated finance environments.

## How to use it

Browse the repository on GitHub and copy the prompt that matches your task. Paste it into the Project Instructions of a Claude Project, or drop it into ChatGPT's Custom Instructions. Replace any placeholder text with your actual document content — no coding required. For recurring analysis tasks, save the prompt as a pinned Claude Project so it applies automatically every session.

## Install / access

Repository: https://github.com/anthropics/financial-services

Open the repo, navigate to the relevant prompt file, copy the contents, and paste into Claude Projects or ChatGPT Custom Instructions.`,
      },
    ],
    repoUrl: 'https://github.com/anthropics/financial-services',
    githubStars: 33228,
    capabilities: [
      {
        command: 'Copy earnings-summary prompt into Claude Projects > Project Instructions',
        description: 'Paste the earnings-summary system prompt from the repo into a Claude Project to summarize quarterly reports.',
      },
      {
        command: 'Paste ratio-analysis prompt into ChatGPT Custom Instructions',
        description: 'Use the financial ratio analysis prompt in ChatGPT to analyze balance sheets and income statements.',
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
      'workflows — transaction categorization, reconciliation, and ledger review. Part of the ' +
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

A collection of AI skill definitions from the OpenAccountant project aimed at bookkeepers handling day-to-day accounting work. Covers transaction categorization by account type, bank reconciliation checklists, ledger discrepancy review, and basic financial report summarization. Skills are structured prompts that guide Claude through each task methodically, reducing the risk of missed steps.

## How to use it

Clone the repository and copy the relevant skill file into your Claude Project instructions, or paste the skill prompt text directly into ChatGPT Custom Instructions. Each skill is a self-contained prompt you can reuse across clients. For bookkeepers managing multiple clients, create a separate Claude Project per client and pin the relevant skills to each.

## Install / access

Repository: https://github.com/openaccountant/skills

Clone or download the repo and copy the skill prompt files into your AI tool of choice.`,
      },
    ],
    repoUrl: 'https://github.com/openaccountant/skills',
    githubStars: 31,
    capabilities: [
      {
        command: 'Copy transaction-categorization skill into Claude Projects > Project Instructions',
        description: 'Paste the transaction-categorization prompt from the repo to guide Claude through categorizing ledger entries by account type.',
      },
      {
        command: 'Paste reconciliation-checklist skill into ChatGPT Custom Instructions',
        description: 'Use the bank reconciliation skill prompt in ChatGPT to step through a month-end reconciliation methodically.',
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
      'An external GitHub repository from the OpenAccountants project offering AI-assisted ' +
      'workflows for tax preparation, ledger management, and financial reporting. Provides ' +
      'prompt templates and workflow guides for tax preparers using Claude or ChatGPT.',
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

An open-source accounting toolkit providing AI-assisted workflows for tax preparation and ledger work. Includes prompt templates for reviewing tax documents, identifying common deduction categories, summarizing financial statements for filing purposes, and drafting client explanations of tax positions. Aimed at independent tax preparers and small accounting practices.

## How to use it

Visit the repository and browse the prompt templates organized by task type. Copy the prompts relevant to your current filing season — for example, the deduction-review template or the client-explanation draft. Paste them into a Claude Project or ChatGPT Custom Instructions. During client work, invoke the relevant prompt by pasting the client's documents into the conversation alongside the active instructions.

## Install / access

Repository: https://github.com/openaccountants/openaccountants

Browse and copy prompt templates from the repo directly into your AI tool's instruction or custom instructions field.`,
      },
    ],
    repoUrl: 'https://github.com/openaccountants/openaccountants',
    githubStars: 233,
    capabilities: [
      {
        command: 'Copy deduction-review prompt into Claude Projects > Project Instructions',
        description: 'Paste the deduction-review template into a Claude Project to systematically review uploaded tax documents for common deduction categories.',
      },
      {
        command: 'Paste client-explanation prompt into ChatGPT Custom Instructions',
        description: 'Use the client-explanation template to draft plain-language summaries of tax positions for client-facing communications.',
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
      'An external GitHub repository by tuanductran containing prompt templates for HR ' +
      'generalist workflows — job descriptions, interview questions, offer letters, and ' +
      'policy drafts. Designed for HR professionals who want to speed up routine writing tasks.',
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

A collection of prompt templates for HR generalist work covering the most common writing and analysis tasks: drafting job descriptions from a brief, generating role-specific interview question banks, writing offer letter language, summarizing employee feedback, and drafting policy document sections. Templates are plain text and work in any instruction-following AI tool.

## How to use it

Open the repository on GitHub and find the prompt file for the task you need. Copy the prompt text and paste it into Claude's Project Instructions or ChatGPT Custom Instructions. Then provide the specific details for your current task (role title, department, level) in the conversation. For tasks you do repeatedly — like generating interview questions for a role type — save the configured prompt as a Claude Project so it's ready next time.

## Install / access

Repository: https://github.com/tuanductran/hr-skills

Copy individual prompt files from the repo into Claude Projects or ChatGPT Custom Instructions.`,
      },
    ],
    repoUrl: 'https://github.com/tuanductran/hr-skills',
    githubStars: 23,
    capabilities: [
      {
        command: 'Copy job-description prompt into Claude Projects > Project Instructions',
        description: 'Paste the job-description template into a Claude Project to generate role-specific JDs from a brief summary.',
      },
      {
        command: 'Paste interview-questions prompt into ChatGPT Custom Instructions',
        description: 'Use the interview-questions template in ChatGPT to generate a structured question bank for a given role and level.',
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
      'An external GitHub repository by evolsb providing a SKILL.md definition for legal ' +
      'document review tasks in Claude. Covers contract clause identification, risk flagging, ' +
      'and plain-language summaries — designed for paralegals and legal support staff.',
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

A SKILL.md definition for legal document review in Claude. Guides Claude through structured contract analysis: identifying key clauses (indemnification, limitation of liability, governing law, termination), flagging potentially risky or unusual language, and producing a plain-language summary of the document's key obligations. Designed for paralegals and legal support staff reviewing standard commercial contracts.

## How to use it

Install the skill via the Claude Code plugin marketplace, or copy the SKILL.md content into your project's \`.claude/skills/\` directory. Once installed, invoke the skill when you need to review a contract — paste the contract text into the conversation and the skill guides Claude through a structured analysis. Note: this is a legal review aid, not a substitute for qualified legal advice.

## Install / access

Repository: https://github.com/evolsb/claude-legal-skill

\`\`\`
/plugin marketplace add evolsb/claude-legal-skill
\`\`\`

Or copy the SKILL.md file into \`.claude/skills/legal-review.md\` in your project.`,
      },
    ],
    repoUrl: 'https://github.com/evolsb/claude-legal-skill',
    githubStars: 363,
    capabilities: [
      {
        command: '/plugin marketplace add evolsb/claude-legal-skill',
        description: 'Install the legal review skill via the Claude Code plugin marketplace.',
      },
      {
        command: '/skill legal-review',
        description: 'Invoke the legal review skill to analyze a contract for key clauses, risk flags, and a plain-language summary.',
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
      'An external GitHub repository by phuryn providing installable SKILL.md definitions ' +
      'for project management tasks — planning, status reporting, risk management, and ' +
      'retrospectives. Designed for project managers using Claude Code or the Claude desktop app.',
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

A collection of SKILL.md definitions covering the core project management lifecycle. Skills include sprint planning (breaks down a goal into scoped tasks with estimates), status report generation (summarizes progress against milestones), risk log maintenance (identifies and categorizes project risks), and retrospective facilitation (structures a team retro into what-went-well / what-to-improve / action items). Each skill is an installable prompt that Claude loads on demand.

## How to use it

Install the collection via the Claude Code plugin marketplace. Once installed, invoke the relevant skill for each PM task — for example, \`/skill sprint-plan\` when kicking off a new sprint, or \`/skill status-report\` when preparing your weekly update. Skills can also be copied manually into \`.claude/skills/\` if you prefer not to use the marketplace.

## Install / access

Repository: https://github.com/phuryn/pm-skills

\`\`\`
/plugin marketplace add phuryn/pm-skills
\`\`\``,
      },
    ],
    repoUrl: 'https://github.com/phuryn/pm-skills',
    githubStars: 22926,
    capabilities: [
      {
        command: '/plugin marketplace add phuryn/pm-skills',
        description: 'Install the full PM skills collection — sprint planning, status reports, risk logs, and retros — via the Claude Code plugin marketplace.',
      },
      {
        command: '/skill sprint-plan',
        description: 'Invoke the sprint planning skill to break a goal into scoped tasks with estimates and a proposed sprint scope.',
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
      'An external GitHub repository by deanpeters containing prompt-based skills for ' +
      'product managers — discovery interviews, PRD drafting, roadmap prioritization, and ' +
      'launch checklists. Works as Claude Projects instructions or Claude Code skill files.',
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

A product-manager skill collection by deanpeters covering the full PM workflow. Includes skills for structuring customer discovery interviews (question banks and synthesis templates), drafting PRDs from a brief (structured spec with goals, non-goals, and success metrics), roadmap prioritization (scoring frameworks and trade-off summaries), and launch readiness checklists. Skills are plain-text prompts that work in Claude, ChatGPT, or any instruction-following model.

## How to use it

Copy the skill prompts relevant to your current work from the GitHub repository. Paste them into Claude Projects instructions for ongoing use, or keep them in a personal prompt library and paste as needed. For PRD drafting, combine the discovery-synthesis skill output with the PRD-template skill to move from raw interview notes to a structured spec in one session.

## Install / access

Repository: https://github.com/deanpeters/Product-Manager-Skills

Browse and copy skill prompt files from the repo into Claude Projects or ChatGPT Custom Instructions.`,
      },
    ],
    repoUrl: 'https://github.com/deanpeters/Product-Manager-Skills',
    githubStars: 5622,
    capabilities: [
      {
        command: 'Copy PRD-template skill into Claude Projects > Project Instructions',
        description: 'Paste the PRD-drafting skill from the repo into a Claude Project to generate structured product requirement documents from a brief.',
      },
      {
        command: 'Paste discovery-synthesis skill into ChatGPT Custom Instructions',
        description: 'Use the discovery-synthesis skill in ChatGPT to turn raw customer interview notes into structured insight summaries.',
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
      'An external GitHub repository by mohitagw15856 providing Claude skill definitions ' +
      'oriented toward business analysis work — requirements gathering, gap analysis, ' +
      'process mapping, and stakeholder communication. Useful for BAs embedded in product teams.',
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

A set of Claude skill definitions for business analysts working on software and process projects. Covers requirements elicitation (structured question frameworks for stakeholder interviews), gap analysis (comparing current-state vs future-state process flows), user story writing (given-when-then format with acceptance criteria), and stakeholder communication drafts (executive summaries of BA findings). Skills follow common BA frameworks and are usable directly in Claude Code or as Claude Projects instructions.

## How to use it

Install via the Claude Code plugin marketplace or copy individual skill prompts into Claude Projects. For requirements sessions, use the elicitation skill before a stakeholder meeting to generate a structured question set. After the meeting, pass the notes through the gap-analysis skill to identify missing requirements before writing user stories.

## Install / access

Repository: https://github.com/mohitagw15856/pm-claude-skills

\`\`\`
/plugin marketplace add mohitagw15856/pm-claude-skills
\`\`\``,
      },
    ],
    repoUrl: 'https://github.com/mohitagw15856/pm-claude-skills',
    githubStars: 1161,
    capabilities: [
      {
        command: '/plugin marketplace add mohitagw15856/pm-claude-skills',
        description: 'Install the PM/BA Claude skills collection via the Claude Code plugin marketplace.',
      },
      {
        command: '/skill requirements-elicitation',
        description: 'Invoke the requirements elicitation skill to generate a structured stakeholder interview question bank for a project scope.',
      },
    ],
  },

  // 9. zubair-trabzada/ai-marketing-claude
  {
    kind: 'skill',
    id: 'github-ai-marketing-claude-v1',
    slug: 'github-ai-marketing-claude',
    name: 'AI Marketing for Claude',
    tagline: 'AI marketing prompts for Claude — campaigns, copy, and brand analysis.',
    description:
      'An external GitHub repository by zubair-trabzada with prompt templates for marketing ' +
      'managers — campaign briefs, ad copy variations, brand voice guidelines, competitive ' +
      'analysis summaries, and email sequences. Covers B2B and B2C marketing workflows.',
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

A marketing-focused prompt collection for Claude covering common marketing manager tasks: drafting campaign briefs (objective, audience, message, channels, KPIs), generating ad copy variations for A/B testing, writing brand voice guidelines from a brief, summarizing competitive landscape from gathered inputs, and building email nurture sequences. Prompts are organized by task category and are plain text for use in any AI tool.

## How to use it

Open the repository and copy the prompt for the task you need. Paste it into Claude's Project Instructions for an ongoing marketing project, or use it as a one-off custom instruction in ChatGPT. To use the campaign-brief template, set it as your project instruction and then describe your campaign goal in the conversation — Claude will output a structured brief with all the standard sections filled in.

## Install / access

Repository: https://github.com/zubair-trabzada/ai-marketing-claude

Copy prompt templates from the repo into Claude Projects or ChatGPT Custom Instructions.`,
      },
    ],
    repoUrl: 'https://github.com/zubair-trabzada/ai-marketing-claude',
    githubStars: 2064,
    capabilities: [
      {
        command: 'Copy campaign-brief prompt into Claude Projects > Project Instructions',
        description: 'Paste the campaign-brief template into a Claude Project to generate structured briefs covering objective, audience, message, and KPIs.',
      },
      {
        command: 'Paste ad-copy-variations prompt into ChatGPT Custom Instructions',
        description: 'Use the ad-copy-variations template in ChatGPT to generate multiple headline and body-copy options for A/B testing.',
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
      'An external GitHub repository by WynterJones providing a system-prompt-based ' +
      'copywriting assistant for direct-response and ad copy. CoppieGPT configures ChatGPT ' +
      'or Claude to produce persuasive, conversion-focused copy across formats.',
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

A system-prompt-based copywriting assistant by WynterJones. CoppieGPT configures ChatGPT or Claude with the persona and instructions of an experienced direct-response copywriter, producing persuasive, conversion-focused copy for ads, landing pages, email subject lines, and product descriptions. The system prompt encodes direct-response principles (benefit-first headlines, clear CTAs, urgency without hype) so the model applies them consistently without you re-explaining each time.

## How to use it

Copy the CoppieGPT system prompt from the repository's README and paste it into ChatGPT Custom Instructions, or set it as the Project Instructions in a Claude Project. Once active, ask for the copy you need — a Facebook ad, a landing page hero, an email subject line — and the model will apply direct-response copywriting principles automatically. You can further refine by specifying your audience, offer, and tone in each message.

## Install / access

Repository: https://github.com/WynterJones/CoppieGPT

Copy the system prompt from the README and paste into ChatGPT Custom Instructions or Claude Projects.`,
      },
    ],
    repoUrl: 'https://github.com/WynterJones/CoppieGPT',
    githubStars: 159,
    capabilities: [
      {
        command: 'Paste CoppieGPT system prompt into ChatGPT Custom Instructions',
        description: 'Configure ChatGPT as a direct-response copywriter by pasting the CoppieGPT system prompt into Custom Instructions.',
      },
      {
        command: 'Copy CoppieGPT prompt into Claude Projects > Project Instructions',
        description: 'Set CoppieGPT as the instructions for a Claude Project dedicated to ad and landing-page copywriting.',
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
      'An external GitHub repository by f (Fatih Arslan), the source behind prompts.chat. ' +
      'Contains over 200 curated role-based system prompts for ChatGPT and Claude covering ' +
      'social media, marketing, writing, and dozens of other professional roles.',
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

The source repository for prompts.chat, one of the most widely referenced prompt collections for ChatGPT and Claude. Contains over 200 role-based system prompts, each configuring the model to behave as a specific expert — social media manager, SEO specialist, content strategist, copywriter, and many more. Prompts are concise and widely tested by the open-source community. Also accessible as a searchable web UI at prompts.chat.

## How to use it

Visit https://prompts.chat to browse and search prompts by role or keyword, then copy the one you want with one click. Alternatively, browse the raw GitHub repo to find prompts as plain text. Paste the chosen prompt into ChatGPT Custom Instructions or Claude Projects. For social media work, try the "Social Media Manager" or "Content Strategist" prompts to configure the model for platform-specific content creation and scheduling advice.

## Install / access

Repository: https://github.com/f/prompts.chat
Web UI: https://prompts.chat

Browse, search, and copy prompts from the website or repo directly into Claude or ChatGPT.`,
      },
    ],
    repoUrl: 'https://github.com/f/prompts.chat',
    githubStars: 165039,
    capabilities: [
      {
        command: 'Copy Social Media Manager prompt into ChatGPT Custom Instructions',
        description: "Use the prompts.chat Social Media Manager prompt to configure ChatGPT as a platform-aware social content strategist.",
      },
      {
        command: 'Paste Content Strategist prompt into Claude Projects > Project Instructions',
        description: 'Set the Content Strategist prompt from prompts.chat as a Claude Project instruction for content calendar and editorial planning tasks.',
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
      'An external GitHub repository by filip-michalsky providing an open-source AI sales ' +
      'agent framework. SalesGPT simulates context-aware sales conversations, handles ' +
      'objections, and can be configured for outbound outreach and follow-up sequences.',
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

An open-source AI sales agent framework that simulates context-aware sales conversations. SalesGPT tracks conversation stage (introduction, qualification, pitch, objection handling, close) and adapts its responses accordingly. It can be configured with your product details, ideal customer profile, and talk tracks so the agent handles common objections and moves conversations toward the next step. Designed for teams that want to draft outreach, rehearse discovery calls, or automate initial outbound sequences.

## How to use it

Install the Python package, configure it with your product description and sales playbook, and run it to generate outreach emails or rehearse sales conversations. Sales reps can also copy the system prompts from the repo directly into Claude or ChatGPT to use as a sales writing assistant without running the full framework.

## Install / access

Repository: https://github.com/filip-michalsky/SalesGPT

\`\`\`bash
pip install salesgpt
\`\`\`

Or copy the sales agent system prompt from the repo into Claude Projects for prompt-only use.`,
      },
    ],
    repoUrl: 'https://github.com/filip-michalsky/SalesGPT',
    githubStars: 2674,
    capabilities: [
      {
        command: 'pip install salesgpt',
        description: 'Install the SalesGPT Python package to run a configured AI sales agent that handles outreach and objection handling.',
      },
      {
        command: 'Copy sales-agent system prompt into Claude Projects > Project Instructions',
        description: 'Paste the SalesGPT system prompt into a Claude Project to use it as a sales writing and objection-handling assistant without running the framework.',
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
      'An external GitHub repository by Trystan-SA containing a system prompt that primes ' +
      'Claude with design-system thinking — tokens, components, accessibility, and ' +
      'consistency — for UX designers and front-end teams collaborating with Claude.',
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

A carefully crafted system prompt that configures Claude with design-system expertise. When active, Claude reasons about design tokens (spacing, color, typography), component architecture (props, variants, composition patterns), and accessibility (WCAG 2.2, ARIA roles, keyboard navigation) in every response. Useful for UX designers who want Claude to give component feedback, draft design documentation, or review designs against system rules without having to re-explain design-system concepts each session.

## How to use it

Copy the system prompt from the repository and paste it into Claude Projects instructions. Create a dedicated "Design System" project in Claude and set this as the base instruction. Then, in that project, share design specs, component descriptions, or Figma annotations and ask Claude to review them against your system guidelines or draft component documentation.

## Install / access

Repository: https://github.com/Trystan-SA/claude-design-system-prompt

Copy the system prompt from the README and paste into Claude Projects > Project Instructions.`,
      },
    ],
    repoUrl: 'https://github.com/Trystan-SA/claude-design-system-prompt',
    githubStars: 1522,
    capabilities: [
      {
        command: 'Copy design-system prompt into Claude Projects > Project Instructions',
        description: 'Configure a Claude Project with design-system expertise by pasting in the system prompt from this repo.',
      },
      {
        command: 'Paste design-system prompt into ChatGPT Custom Instructions',
        description: 'Set up ChatGPT with design-system reasoning for component feedback, token review, and accessibility checks.',
      },
    ],
  },

  // 14. aj-geddes/useful-ai-prompts
  {
    kind: 'skill',
    id: 'github-useful-ai-prompts-v1',
    slug: 'github-useful-ai-prompts',
    name: 'Useful AI Prompts',
    tagline: 'Curated AI prompts for data analysis, SQL, Python, and reporting tasks.',
    description:
      'An external GitHub repository by aj-geddes collecting practical AI prompts for data ' +
      'analysis work — SQL query generation, Python data wrangling, statistical summaries, ' +
      'and chart interpretation. Targeted at data analysts who want ready-to-use prompts.',
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

A curated collection of practical AI prompts for data analyst work. Covers SQL query generation (with context about schema and intent), Python data-wrangling tasks (pandas, reshaping, cleaning), statistical summaries (describing distributions, identifying outliers), chart interpretation (reading a chart description and extracting key insights), and ad-hoc reporting (turning raw numbers into an executive-friendly paragraph). Prompts are plain text and work in Claude, ChatGPT, or any capable model.

## How to use it

Browse the repository by task category and copy the relevant prompt. For SQL work, paste the schema description alongside the prompt into Claude Projects so the model always has your table structure available. For Python tasks, set the data-wrangling prompt as a ChatGPT Custom Instruction so every session starts with the right framing for pandas-based analysis.

## Install / access

Repository: https://github.com/aj-geddes/useful-ai-prompts

Copy prompts from the repo into Claude Projects or ChatGPT Custom Instructions.`,
      },
    ],
    repoUrl: 'https://github.com/aj-geddes/useful-ai-prompts',
    githubStars: 287,
    capabilities: [
      {
        command: 'Copy SQL-generation prompt into Claude Projects > Project Instructions',
        description: 'Set the SQL query-generation prompt as a Claude Project instruction for data analysis sessions with schema context.',
      },
      {
        command: 'Paste data-wrangling prompt into ChatGPT Custom Instructions',
        description: 'Configure ChatGPT with the data-wrangling prompt for consistent pandas-based Python analysis framing.',
      },
    ],
  },

  // 15. travistangvh/ChatGPT-Data-Science-Prompts
  {
    kind: 'skill',
    id: 'github-chatgpt-data-science-prompts-v1',
    slug: 'github-chatgpt-data-science-prompts',
    name: 'ChatGPT Data Science Prompts',
    tagline: 'Data-science ChatGPT prompts for EDA, modeling, and data storytelling.',
    description:
      'An external GitHub repository by travistangvh with a large collection of ChatGPT ' +
      'prompts for data science tasks — exploratory data analysis, feature engineering, ' +
      'model selection, and communicating results to non-technical stakeholders.',
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

A large collection of ChatGPT prompts specifically for data science workflows. Covers exploratory data analysis (summary statistics, distribution checks, outlier detection), feature engineering ideas, model selection reasoning (comparing algorithm trade-offs for a given problem), hyperparameter tuning strategies, and data storytelling (translating model outputs into plain-language business insights). Prompts work in ChatGPT, Claude, and other capable models.

## How to use it

Browse the repository by topic and copy the prompts relevant to your current project phase. For EDA, paste the EDA prompt into ChatGPT Custom Instructions so every new analysis session starts with the right framing. For model-selection discussions, copy the trade-off prompt and use it in a one-off conversation where you describe your dataset characteristics and the model will help you reason through algorithm choices.

## Install / access

Repository: https://github.com/travistangvh/ChatGPT-Data-Science-Prompts

Copy prompts from the README or topic folders into ChatGPT Custom Instructions or Claude Projects.`,
      },
    ],
    repoUrl: 'https://github.com/travistangvh/ChatGPT-Data-Science-Prompts',
    githubStars: 1616,
    capabilities: [
      {
        command: 'Paste EDA prompt into ChatGPT Custom Instructions',
        description: 'Configure ChatGPT with the exploratory data analysis prompt to frame every session with a consistent EDA approach.',
      },
      {
        command: 'Copy model-selection prompt into Claude Projects > Project Instructions',
        description: 'Use the model-selection reasoning prompt in Claude to compare algorithm trade-offs for a given dataset and prediction task.',
      },
    ],
  },

  // 16. ajhcs/healthcare-agents
  {
    kind: 'skill',
    id: 'github-healthcare-agents-v1',
    slug: 'github-healthcare-agents',
    name: 'Healthcare Agents',
    tagline: 'Claude agents designed for clinical assistant tasks and patient workflows.',
    description:
      'An external GitHub repository by ajhcs providing Claude agent definitions for ' +
      'healthcare settings — patient intake summaries, appointment coordination prompts, ' +
      'and clinical documentation aids for clinical assistants and care coordinators.',
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

A set of Claude agent definitions for healthcare support roles. Covers patient intake summarization (converting intake forms to structured clinical summaries), appointment coordination (scheduling language, reminder drafts, referral letters), and basic clinical documentation aids (structuring visit notes, organizing patient history). Intended for clinical assistants and care coordinators, not for clinical decision-making — outputs should always be reviewed by a qualified clinician.

## How to use it

Install the agent files via the Claude Code plugin marketplace or copy the agent definitions manually into \`.claude/agents/\`. Once installed, invoke the relevant agent for your current task — for example, the intake-summary agent when preparing for a patient visit. Always have a clinician review any AI-generated clinical content before it is used in patient care.

## Install / access

Repository: https://github.com/ajhcs/healthcare-agents

\`\`\`
/plugin marketplace add ajhcs/healthcare-agents
\`\`\``,
      },
    ],
    repoUrl: 'https://github.com/ajhcs/healthcare-agents',
    githubStars: 43,
    capabilities: [
      {
        command: '/plugin marketplace add ajhcs/healthcare-agents',
        description: 'Install the healthcare agent collection via the Claude Code plugin marketplace.',
      },
      {
        command: '@intake-summary',
        description: 'Invoke the intake-summary agent to convert patient intake forms into structured clinical summaries for review by a clinician.',
      },
    ],
  },

  // 17. FortaTech/prompts-for-health
  {
    kind: 'skill',
    id: 'github-prompts-for-health-v1',
    slug: 'github-prompts-for-health',
    name: 'Prompts for Health',
    tagline: 'Prompt templates for clinical documentation and health information tasks.',
    description:
      'An external GitHub repository by FortaTech providing prompt templates for health ' +
      'and clinical documentation tasks — visit note structure, medical scribe workflows, ' +
      'patient-facing summaries, and health information lookups. For use by clinical support staff.',
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

A collection of prompt templates for health-related documentation and information tasks from FortaTech. Covers medical scribe workflows (structuring SOAP notes from dictated or typed encounter summaries), patient-facing communication (plain-language explanations of diagnoses or instructions), health information lookup formatting (organizing drug information or procedure details clearly), and discharge summary drafting. All outputs require clinician review before use in patient care.

## How to use it

Copy the relevant prompt from the repository into Claude Projects instructions. For a medical scribe use case, set the SOAP-note structuring prompt as the project instruction and then paste the encounter dictation into each conversation — Claude will output a structured note ready for physician review and editing. Never use AI-generated clinical documentation without qualified clinician sign-off.

## Install / access

Repository: https://github.com/FortaTech/prompts-for-health

Copy prompt templates from the repo into Claude Projects or ChatGPT Custom Instructions.`,
      },
    ],
    repoUrl: 'https://github.com/FortaTech/prompts-for-health',
    githubStars: 29,
    capabilities: [
      {
        command: 'Copy SOAP-note prompt into Claude Projects > Project Instructions',
        description: 'Set the SOAP-note structuring prompt as a Claude Project instruction to format encounter dictations into structured notes for physician review.',
      },
      {
        command: 'Paste patient-communication prompt into ChatGPT Custom Instructions',
        description: 'Use the patient-communication template in ChatGPT to draft plain-language patient-facing summaries from clinical notes.',
      },
    ],
  },

  // 18. GarethManning/education-agent-skills
  {
    kind: 'skill',
    id: 'github-education-agent-skills-v1',
    slug: 'github-education-agent-skills',
    name: 'Education Agent Skills',
    tagline: 'Agent skills for classroom teachers: lesson planning, assessment, and feedback.',
    description:
      'An external GitHub repository by GarethManning providing agent skill definitions ' +
      'for classroom teachers — lesson plan generation, assessment rubric drafting, ' +
      'student feedback templates, and differentiation guidance for mixed-ability classes.',
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

A set of agent skill definitions for classroom teachers covering the most time-intensive planning and feedback tasks. Skills include lesson plan generation (given a learning objective, year group, and subject, produce a structured plan with activities and timings), assessment rubric drafting (generate criteria-based rubrics for a given assignment type and grade level), written feedback templates (produce differentiated feedback comments for various performance levels), and differentiation guidance (suggest modifications for students working above or below grade level).

## How to use it

Install via the Claude Code plugin marketplace or copy individual skill files into \`.claude/skills/\`. For daily planning, use the lesson-plan skill at the start of each week — provide your unit topic, year group, and any constraints (time, available resources), and the skill produces a structured plan you can adapt. For marking, use the feedback-template skill to generate differentiated comment banks that you personalise per student.

## Install / access

Repository: https://github.com/GarethManning/education-agent-skills

\`\`\`
/plugin marketplace add GarethManning/education-agent-skills
\`\`\``,
      },
    ],
    repoUrl: 'https://github.com/GarethManning/education-agent-skills',
    githubStars: 380,
    capabilities: [
      {
        command: '/plugin marketplace add GarethManning/education-agent-skills',
        description: 'Install the education agent skills collection covering lesson planning, rubrics, and student feedback.',
      },
      {
        command: '/skill lesson-plan',
        description: 'Invoke the lesson-plan skill to generate a structured lesson plan for a given topic, year group, and time allocation.',
      },
    ],
  },

  // 19. microsoft/prompts-for-edu
  {
    kind: 'skill',
    id: 'github-microsoft-prompts-for-edu-v1',
    slug: 'github-microsoft-prompts-for-edu',
    name: 'Microsoft Prompts for Education',
    tagline: "Microsoft's AI prompt library for education — classroom and admin workflows.",
    description:
      'An external GitHub repository maintained by Microsoft providing a curated prompt ' +
      'library for educators and school administrators. Covers lesson design, differentiated ' +
      'instruction, student communication, and administrative writing tasks.',
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

A prompt library for education maintained by Microsoft, covering classroom and administrative workflows. Includes prompts for lesson design (backwards-design lesson plans, inquiry-based learning structures), differentiated instruction (tiered activities for multiple ability levels), student communication (parent update drafts, meeting summaries), and administrative writing (policy document sections, grant application language, professional development plans). Prompts are cross-model and work in ChatGPT, Claude, Copilot, and other instruction-following AI tools.

## How to use it

Browse the repository by workflow category and copy the prompts that match your current tasks. Paste them into Claude Projects, ChatGPT Custom Instructions, or Microsoft Copilot's custom prompt area. For classroom teachers, the lesson-design and differentiation prompts are the most immediately useful — configure a Claude Project with these for your current unit and use it throughout the planning cycle.

## Install / access

Repository: https://github.com/microsoft/prompts-for-edu

Browse by category on GitHub and copy prompts into Claude Projects, ChatGPT Custom Instructions, or Microsoft Copilot.`,
      },
    ],
    repoUrl: 'https://github.com/microsoft/prompts-for-edu',
    githubStars: 1861,
    capabilities: [
      {
        command: 'Copy lesson-design prompt into Claude Projects > Project Instructions',
        description: 'Set the Microsoft lesson-design prompt as a Claude Project instruction to generate backwards-design lesson plans for a current unit.',
      },
      {
        command: 'Paste differentiation prompt into ChatGPT Custom Instructions',
        description: 'Configure ChatGPT with the differentiation prompt to generate tiered activities for mixed-ability classroom groups.',
      },
    ],
  },

  // 20. eseckel/ai-for-grant-writing
  {
    kind: 'skill',
    id: 'github-ai-for-grant-writing-v1',
    slug: 'github-ai-for-grant-writing',
    name: 'AI for Grant Writing',
    tagline: 'AI-assisted grant-writing prompts and templates for nonprofit fundraisers.',
    description:
      'An external GitHub repository by eseckel providing AI prompts and templates for ' +
      'grant writing — needs statements, program narratives, evaluation plans, and budget ' +
      'justifications. Built for nonprofit development staff and grant writers.',
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

A collection of AI prompts and writing templates for nonprofit grant writers. Covers the core sections of a standard grant application: needs statements (framing the problem with data and community voice), program narratives (describing activities, outputs, and outcomes in funder-facing language), evaluation plans (logic model structure, indicators, and data collection methods), and budget justifications (connecting line items to program activities). Prompts are designed to work with your organization's actual program data — you supply the specifics, the template structures the output.

## How to use it

Set up a Claude Project with your organization's mission, target population, and current programs as knowledge context. Then use the grant-section prompts from this repo as the project instructions, switching between sections as you work through an application. For needs statements, paste in your relevant data points and the prompt structures them into a compelling narrative. Always review AI-drafted grant content for accuracy and funder alignment before submission.

## Install / access

Repository: https://github.com/eseckel/ai-for-grant-writing

Copy prompt templates from the repo into Claude Projects or ChatGPT Custom Instructions alongside your organization's program details.`,
      },
    ],
    repoUrl: 'https://github.com/eseckel/ai-for-grant-writing',
    githubStars: 4144,
    capabilities: [
      {
        command: 'Copy needs-statement prompt into Claude Projects > Project Instructions',
        description: 'Paste the needs-statement template into a Claude Project to structure community problem data into a compelling grant narrative section.',
      },
      {
        command: 'Paste program-narrative prompt into ChatGPT Custom Instructions',
        description: 'Use the program-narrative template in ChatGPT to draft the activities and outcomes section of a grant application.',
      },
    ],
  },

  // 21. ahacker-1/cre-agent-skills
  {
    kind: 'skill',
    id: 'github-cre-agent-skills-v1',
    slug: 'github-cre-agent-skills',
    name: 'CRE Agent Skills',
    tagline: 'Claude skills for commercial real estate: listings, outreach, and analysis.',
    description:
      'An external GitHub repository by ahacker-1 providing Claude agent skills for ' +
      'commercial real estate professionals — property listing descriptions, prospect ' +
      'outreach drafts, market summary generation, and lease abstract review.',
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

A set of Claude skills for commercial real estate professionals. Skills cover property listing description generation (convert specs into compelling marketing copy), prospect outreach drafting (cold emails and follow-up sequences for tenants and buyers), market summary generation (structure available market data into an executive-level overview), and lease abstract review (identify key dates, obligations, and risk clauses in a lease document). Each skill is a structured prompt that guides Claude through the task methodically.

## How to use it

Install via the Claude Code plugin marketplace or copy the skill files into \`.claude/skills/\`. For listing work, invoke the listing-description skill and provide the property specs — address, size, use class, key amenities — and the skill produces marketing-ready copy. For lease review, paste the relevant lease sections into the conversation alongside the abstract-review skill.

## Install / access

Repository: https://github.com/ahacker-1/cre-agent-skills

\`\`\`
/plugin marketplace add ahacker-1/cre-agent-skills
\`\`\``,
      },
    ],
    repoUrl: 'https://github.com/ahacker-1/cre-agent-skills',
    githubStars: 64,
    capabilities: [
      {
        command: '/plugin marketplace add ahacker-1/cre-agent-skills',
        description: 'Install the CRE agent skills collection covering listings, outreach, market summaries, and lease review.',
      },
      {
        command: '/skill listing-description',
        description: 'Invoke the listing-description skill to convert raw property specs into polished marketing copy.',
      },
    ],
  },

  // 22. sgharlow/claude-code-recipes
  {
    kind: 'skill',
    id: 'github-claude-code-recipes-v1',
    slug: 'github-claude-code-recipes',
    name: 'Claude Code Recipes',
    tagline: 'Claude Code recipes covering operations, automation, and process workflows.',
    description:
      'An external GitHub repository by sgharlow containing reusable Claude Code recipes ' +
      'for operations teams — runbook generation, process automation scripts, incident ' +
      'response templates, and workflow documentation aids for operations managers.',
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

A collection of Claude Code recipes for operations teams. Covers runbook generation (convert a process description into a step-by-step runbook with decision points and escalation paths), incident response templates (structure an incident timeline and RCA draft from a log of events), process documentation (turn a verbal description of a workflow into a structured SOP), and lightweight automation scripts (shell and Python snippets for common ops tasks like log parsing and report generation).

## How to use it

Clone the repository and copy the recipes relevant to your operations stack into your Claude Code project. For runbook generation, use the recipe as a Claude Code slash command — invoke it with a description of your process and Claude produces a draft runbook you refine from there. Process-documentation recipes work well as Claude Projects instructions for an "Ops Writing" project you return to regularly.

## Install / access

Repository: https://github.com/sgharlow/claude-code-recipes

\`\`\`bash
git clone https://github.com/sgharlow/claude-code-recipes
cp claude-code-recipes/.claude/commands/*.md ~/.claude/commands/
\`\`\``,
      },
    ],
    repoUrl: 'https://github.com/sgharlow/claude-code-recipes',
    githubStars: 289,
    capabilities: [
      {
        command: '/runbook-generate',
        description: 'Invoke the runbook-generation recipe to convert a process description into a structured runbook with decision points and escalation paths.',
      },
      {
        command: '/incident-rca',
        description: 'Invoke the incident RCA recipe to structure a timeline of events into a root-cause analysis draft.',
      },
    ],
  },

  // 23. deanpeters/product-manager-prompts
  {
    kind: 'skill',
    id: 'github-deanpeters-pm-prompts-v1',
    slug: 'github-deanpeters-pm-prompts',
    name: 'Product Manager Prompts (deanpeters)',
    tagline: 'Product manager prompts that double as market research and discovery tools.',
    description:
      'An external GitHub repository by deanpeters containing prompt templates oriented ' +
      'toward the research and discovery side of product management — competitive analysis, ' +
      'customer interview synthesis, market sizing, and opportunity assessment.',
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

A collection of product-manager prompts from deanpeters focused on the research and discovery phase of product work. Includes prompts for competitive analysis (structure a comparison of competitors by feature, pricing, and positioning), customer interview synthesis (extract themes and jobs-to-be-done from interview notes), market sizing (TAM/SAM/SOM framing from available data), and opportunity assessment (frame a potential product opportunity using a standard assessment structure). Works in Claude, ChatGPT, and other capable models.

## How to use it

Copy the relevant prompt and paste into Claude Projects or ChatGPT Custom Instructions. For competitive analysis, set the prompt as a project instruction and then paste in your gathered competitor data — the prompt structures it into a comparison table and narrative summary. For interview synthesis, combine multiple interview note sets in a single conversation and the prompt extracts recurring themes and jobs-to-be-done.

## Install / access

Repository: https://github.com/deanpeters/product-manager-prompts

Copy prompt templates from the repo into Claude Projects or ChatGPT Custom Instructions.`,
      },
    ],
    repoUrl: 'https://github.com/deanpeters/product-manager-prompts',
    githubStars: 975,
    capabilities: [
      {
        command: 'Copy competitive-analysis prompt into Claude Projects > Project Instructions',
        description: 'Set the competitive-analysis prompt as a Claude Project instruction to structure competitor data into a feature-and-positioning comparison.',
      },
      {
        command: 'Paste interview-synthesis prompt into ChatGPT Custom Instructions',
        description: 'Use the interview-synthesis prompt in ChatGPT to extract themes and jobs-to-be-done from customer interview notes.',
      },
    ],
  },

  // 24. ai-boost/awesome-prompts
  {
    kind: 'skill',
    id: 'github-ai-boost-awesome-prompts-v1',
    slug: 'github-ai-boost-awesome-prompts',
    name: 'Awesome Prompts (ai-boost)',
    tagline: 'Large curated prompt collection with planning, coordination, and logistics prompts.',
    description:
      'An external GitHub repository by ai-boost curating a broad collection of AI prompts ' +
      'covering event planning, logistics, coordination, and general professional use cases. ' +
      'A well-maintained community-driven collection spanning dozens of professional roles.',
    role: 'Event Planner',
    industry: 'Hospitality & Events',
    tags: ['prompts', 'event-planning', 'logistics', 'coordination', 'collection'],
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

A broad, community-maintained collection of AI prompts curated by ai-boost, spanning professional roles and use cases. For event planners, the collection includes prompts for event brief drafting (summarizing scope, audience, budget, and logistics constraints), vendor communication (RFP templates and follow-up emails), run-of-show generation (timeline and cue sheet from an event brief), and post-event summaries. The collection covers dozens of other roles as well, making it a useful general-purpose prompt library beyond event planning.

## How to use it

Browse the repository on GitHub and use the search function to find prompts by keyword (e.g. "event", "planning", "logistics"). Copy the prompts that fit your workflow and paste them into Claude Projects or ChatGPT Custom Instructions. For recurring event types (conferences, corporate dinners, product launches), set up a dedicated Claude Project per event type with the relevant prompts pre-loaded.

## Install / access

Repository: https://github.com/ai-boost/awesome-prompts

Browse on GitHub and copy relevant prompts into Claude Projects or ChatGPT Custom Instructions.`,
      },
    ],
    repoUrl: 'https://github.com/ai-boost/awesome-prompts',
    githubStars: 8415,
    capabilities: [
      {
        command: 'Copy event-brief prompt into Claude Projects > Project Instructions',
        description: 'Paste an event-brief drafting prompt into a Claude Project to quickly structure scope, audience, and logistics for a new event.',
      },
      {
        command: 'Paste run-of-show prompt into ChatGPT Custom Instructions',
        description: 'Use a run-of-show generation prompt in ChatGPT to turn an event brief into a timed cue sheet and timeline.',
      },
    ],
  },
];
