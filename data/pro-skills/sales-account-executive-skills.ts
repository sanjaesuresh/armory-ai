import type { Setup } from '@/lib/setup/types';

export const salesAccountExecutiveSkills: Setup[] = [
  // ── 1. Cold Outreach Email ──────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-sales-account-executive-cold-outreach-email-v1',
    slug: 'sales-account-executive-cold-outreach-email',
    name: 'Cold Outreach Email',
    tagline: 'Write a prospect-centric cold email in under a minute',
    description:
      'Generates one concise cold outreach email anchored to a specific prospect pain, not product ' +
      'features. Keeps the body under 150 words and ends with a single, frictionless call to action. ' +
      'Use it any time you need a first-touch email for a new prospect.',
    role: 'Sales Account Executive',
    industry: 'Sales',
    tags: ['sales', 'outreach', 'cold-email', 'prospecting', 'copywriting'],
    category: 'sales',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You write one cold outreach email targeting a {{prospectRole}}.

Your product: {{productName}}.
Prospect pain to address: {{prospectPain}}.

{{#if senderName}}
Sign the email from {{senderName}}.
{{/if}}

Rules:
1. Open with a specific observation tied to the prospect's stated pain, never a generic greeting like "Hope this finds you well."
2. Lead with the outcome {{productName}} delivers, not features; keep the body under 150 words.
3. End with exactly one call to action: {{callToAction}}.
4. Never invent prospect details, company names, or metrics not provided. All prospect information is confidential.`,

    variables: [
      {
        key: 'productName',
        label: 'Product or service you sell',
        type: 'text',
        required: true,
        helpText: 'Name of the product or service, exactly as you want it to appear in the email.',
        group: 'Your product',
      },
      {
        key: 'prospectRole',
        label: "Prospect's job title or role",
        type: 'text',
        required: true,
        helpText: 'e.g., "VP of Marketing", "Head of Operations", "CFO". Shapes the angle and tone.',
        group: 'About the prospect',
      },
      {
        key: 'prospectPain',
        label: 'Pain or problem to address',
        type: 'multiline',
        required: true,
        helpText:
          'Describe the specific business pain this prospect is likely experiencing. Be concrete, the more specific, the sharper the email.',
        group: 'About the prospect',
      },
      {
        key: 'callToAction',
        label: 'Call to action',
        type: 'select',
        options: ['Book a 15-minute call', 'Reply to this email', 'Click a link to learn more'],
        default: 'Book a 15-minute call',
        required: true,
        helpText: 'The single action you want the prospect to take.',
        group: 'Email settings',
      },
      {
        key: 'senderName',
        label: 'Your name (optional)',
        type: 'text',
        required: false,
        helpText: 'If provided, the email will be signed with this name.',
        group: 'Email settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Cold email reference card',
        purpose:
          'A quick-reference card Claude uses to calibrate your cold email style and audience. Fill in the sections that apply.',
        kind: 'starter',
        content: `# Cold email reference card

## About your product
- Product name:
- One-sentence outcome it delivers:
- Best-fit prospect profile (role, industry, company size):

## Common prospect pains you address
List 3–5 pains your product solves. Be specific, "reporting takes too long" is more useful than "inefficiency."

1.
2.
3.

## Openers that have worked for you
Paste 1–2 first lines from past emails that got replies. Claude uses these to match your voice.

## Openers and phrases to avoid
List any phrases your team has banned or that feel off-brand.

- e.g., "Hope this finds you well"
- e.g., "I wanted to reach out"
- e.g., "Per my last email"

## Default sign-off and sender details
- Sender name:
- Title:
- Company:
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'sales-account-executive-cold-outreach-email-scenario-1',
        title: 'Cold email to a VP of Marketing',
        userInput:
          'Write a cold email to the VP of Marketing at a mid-sized e-commerce brand. ' +
          'Their pain is inconsistent campaign attribution across channels.',
        expectedBehavior:
          'Claude should produce a short cold email (under 150 words) addressed to a VP of Marketing. ' +
          'The email must open with a specific observation about campaign attribution problems, ' +
          'not a generic greeting. It should connect the product outcome to fixing attribution pain ' +
          'and close with a single call to action. No feature list, no fluff.',
        mustContain: ['VP of Marketing', 'campaign attribution'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'sales-account-executive-cold-outreach-email-scenario-2',
        title: 'Cold email to a Head of Revenue Operations',
        userInput:
          'Write a cold email to a Head of Revenue Operations at a B2B SaaS company. ' +
          'They are manually reconciling CRM data every week.',
        expectedBehavior:
          'Claude should write a sub-150-word cold email for a Head of Revenue Operations. ' +
          'It must lead with the pain of manual CRM data reconciliation and pivot quickly to ' +
          'the outcome the product delivers. The closing should be a single, low-friction ask.',
        mustContain: ['Head of Revenue Operations', 'CRM data'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 2. Follow-up Sequence ───────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-sales-account-executive-followup-sequence-v1',
    slug: 'sales-account-executive-followup-sequence',
    name: 'Follow-up Sequence',
    tagline: 'Build a multi-touch follow-up cadence for any prospect',
    description:
      'Creates a structured multi-touch follow-up sequence tailored to the last interaction and goal, ' +
      'with a distinct angle for each touch so messages never feel copy-pasted. ' +
      'Use it after a cold email, a demo, or any stalled conversation.',
    role: 'Sales Account Executive',
    industry: 'Sales',
    tags: ['sales', 'follow-up', 'cadence', 'outreach', 'prospecting', 'sequences'],
    category: 'sales',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You build a multi-touch follow-up sequence for {{productName}}.

Last interaction: {{lastInteraction}}
Sequence length: {{touchCount}}
Goal: {{sequenceGoal}}

{{#if prospectName}}
Address messages to {{prospectName}}.
{{/if}}

Rules:
1. Each touch must have a distinct angle, vary between insight sharing, social proof, direct ask, and breakup framing across the sequence.
2. Keep each message under 80 words; subject lines under 8 words; label each with its suggested send day.
3. Space touches across 2–3 week windows unless the last interaction implies urgency.
4. Never fabricate prospect details, deal history, or competitive facts not provided. All deal information is confidential.`,

    variables: [
      {
        key: 'productName',
        label: 'Product or service you sell',
        type: 'text',
        required: true,
        helpText: 'Name of the product or service.',
        group: 'Your product',
      },
      {
        key: 'lastInteraction',
        label: 'Last interaction with the prospect',
        type: 'multiline',
        required: true,
        helpText:
          'Describe what happened most recently: e.g., "Sent cold email last Tuesday, opened twice, no reply."',
        group: 'Deal context',
      },
      {
        key: 'touchCount',
        label: 'Number of follow-up touches',
        type: 'select',
        options: ['3 touches', '4 touches', '5 touches'],
        default: '3 touches',
        required: true,
        helpText: 'How many follow-up messages to write in the sequence.',
        group: 'Sequence settings',
      },
      {
        key: 'sequenceGoal',
        label: 'Sequence goal',
        type: 'select',
        options: [
          'Book a discovery call',
          'Re-engage a stalled deal',
          'Share a resource and keep warm',
        ],
        default: 'Book a discovery call',
        required: true,
        helpText: 'The outcome you want this sequence to drive.',
        group: 'Sequence settings',
      },
      {
        key: 'prospectName',
        label: "Prospect's first name (optional)",
        type: 'text',
        required: false,
        helpText: 'If provided, messages will open with the prospect by name.',
        group: 'Deal context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Follow-up sequence reference card',
        purpose:
          'A reference card Claude uses to calibrate your follow-up tone, timing, and off-limits phrases.',
        kind: 'starter',
        content: `# Follow-up sequence reference card

## Your product
- Product name:
- One-line value proposition:

## Sequence rules your team follows
List any cadence rules you enforce (e.g., minimum days between touches, channel mix, breakup timing).

1.
2.
3.

## Angles that have worked for you
Describe 2–3 follow-up angles or hooks that have generated replies for your team.

1.
2.
3.

## Phrases to avoid
- e.g., "Just checking in"
- e.g., "Per my last email"
- e.g., "I wanted to circle back"

## Default sign-off
- Sender name:
- Title:
- Company:
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'sales-account-executive-followup-sequence-scenario-1',
        title: 'Follow-up after a cold email with no reply',
        userInput:
          'I sent an intro email to Sarah at Northstar Retail last week. She opened it but did not reply. ' +
          'Build a 3-touch follow-up sequence to book a discovery call.',
        expectedBehavior:
          'Claude should produce a 3-touch follow-up sequence addressed to Sarah at Northstar Retail. ' +
          'Each touch must have a distinct angle and stay under 80 words. ' +
          'The sequence should end with a breakup-style message. Subject lines must be under 8 words. ' +
          'Each message should include a suggested send day.',
        mustContain: ['Sarah', 'Northstar Retail', '3-touch'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'sales-account-executive-followup-sequence-scenario-2',
        title: 'Re-engage a prospect who went dark',
        userInput:
          'I had a discovery call with Marcus at Bellwether Tech two weeks ago and he went dark after ' +
          'promising to share it with his team. Build a follow-up sequence to re-engage him.',
        expectedBehavior:
          'Claude should build a re-engagement sequence addressed to Marcus at Bellwether Tech. ' +
          'Touches should acknowledge the prior call, add new value in each message, and include a ' +
          'polite breakup option near the end. Each message stays under 80 words with a send-day label.',
        mustContain: ['Marcus', 'Bellwether Tech', 'dark after'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 3. Discovery Call Prep ──────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-sales-account-executive-discovery-call-prep-v1',
    slug: 'sales-account-executive-discovery-call-prep',
    name: 'Discovery Call Prep',
    tagline: 'A question plan and agenda for your next discovery call',
    description:
      'Produces a structured discovery agenda, opening, discovery questions, value hypothesis, ' +
      'next steps, tailored to the prospect company, role, and your sales methodology. ' +
      'Run it 30 minutes before the call and walk in with a plan, not a blank page.',
    role: 'Sales Account Executive',
    industry: 'Sales',
    tags: ['sales', 'discovery', 'call-prep', 'questions', 'methodology'],
    category: 'sales',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You prepare a structured discovery call plan for {{productName}}.

Prospect company: {{prospectCompany}}
Prospect role: {{prospectRole}}
Sales methodology: {{salesMethodology}}

{{#if knownContext}}
Context you already have on this prospect: {{knownContext}}
{{/if}}

Rules:
1. Structure the agenda in four phases: opening (rapport + agenda-setting), discovery questions, value hypothesis, next steps.
2. Frame all discovery questions using {{salesMethodology}}, tie each question to a specific dimension of that framework; do not quote the framework name mechanically.
3. Include 3–5 questions per phase; mark the two most critical with an asterisk.
4. Never invent details about {{prospectCompany}} or {{prospectRole}} not provided. All prospect information is confidential.`,

    variables: [
      {
        key: 'productName',
        label: 'Product or service you sell',
        type: 'text',
        required: true,
        helpText: 'Name of the product or service.',
        group: 'Your product',
      },
      {
        key: 'prospectCompany',
        label: 'Prospect company name',
        type: 'text',
        required: true,
        helpText: "The company you'll be talking to.",
        group: 'About the prospect',
      },
      {
        key: 'prospectRole',
        label: "Prospect's job title or role",
        type: 'text',
        required: true,
        helpText: 'e.g., "CFO", "VP of Engineering", "Director of Operations".',
        group: 'About the prospect',
      },
      {
        key: 'salesMethodology',
        label: 'Sales methodology',
        type: 'select',
        options: ['MEDDIC', 'SPIN Selling', 'Challenger Sale', 'BANT', 'Solution Selling'],
        default: 'MEDDIC',
        required: true,
        helpText: 'The framework Claude uses to structure discovery questions.',
        group: 'Your process',
      },
      {
        key: 'knownContext',
        label: 'What you already know about this prospect (optional)',
        type: 'multiline',
        required: false,
        helpText:
          'Paste any research, LinkedIn notes, or prior interaction details. Claude folds this into the prep plan.',
        group: 'About the prospect',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Discovery call reference card',
        purpose:
          'A reference card Claude uses to sharpen discovery questions and hypotheses for your specific product and ideal customer.',
        kind: 'starter',
        content: `# Discovery call reference card

## Your product
- Product name:
- The primary business outcome it delivers:
- Typical deal size and sales cycle length:

## Ideal customer profile (ICP)
- Industry / vertical:
- Company size:
- Roles that typically buy:
- Roles that typically block or influence:

## Top 3 pains your product solves
Be specific and quantified where possible.

1.
2.
3.

## Red flags that disqualify a deal early
List 2–3 signals that suggest this is not a fit (e.g., "company below 50 employees", "no dedicated IT team").

1.
2.
3.

## Qualification criteria by methodology dimension
Fill in what a qualified deal looks like for each dimension of your methodology.

- Metrics / Business impact:
- Economic buyer:
- Decision criteria:
- Decision process:
- Identify pain:
- Champion:
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'sales-account-executive-discovery-call-prep-scenario-1',
        title: 'Discovery prep for a CFO at a logistics company',
        userInput:
          'Prep a discovery call with the CFO of Hargrove Logistics. I am selling our spend analytics platform. ' +
          'They recently expanded to three new countries.',
        expectedBehavior:
          'Claude should produce a four-phase discovery agenda for the CFO at Hargrove Logistics. ' +
          'Questions must be framed using the configured methodology and tied to a CFO\'s concerns: ' +
          'cost visibility, budget control, and financial reporting across regions. ' +
          'The expansion to new countries should inform the discovery questions. ' +
          'Critical questions must be marked clearly.',
        mustContain: ['CFO', 'Hargrove Logistics', 'spend analytics'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'sales-account-executive-discovery-call-prep-scenario-2',
        title: 'Discovery prep for a VP of Engineering',
        userInput:
          'Help me prepare for a discovery call with the VP of Engineering at Cascade Software. ' +
          'I am selling a developer productivity tool.',
        expectedBehavior:
          'Claude should build a structured discovery agenda for a VP of Engineering at Cascade Software. ' +
          'Questions should surface engineering bottlenecks, tooling pain, and team velocity concerns. ' +
          'The agenda should fit within a 30-minute call window and end with a concrete next-step proposal.',
        mustContain: ['VP of Engineering', 'Cascade Software', 'developer productivity'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 4. Objection Handler ────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-sales-account-executive-objection-handler-v1',
    slug: 'sales-account-executive-objection-handler',
    name: 'Objection Handler',
    tagline: 'Turn a stated objection into angles for advancing the deal',
    description:
      'Takes a specific objection and deal stage, then produces multiple named response angles, ' +
      'each with a script the rep can say aloud and a concrete next step. ' +
      'Treats objections as diagnostic signals rather than obstacles to overcome.',
    role: 'Sales Account Executive',
    industry: 'Sales',
    tags: ['sales', 'objection-handling', 'deal-coaching', 'negotiation', 'scripts'],
    category: 'sales',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You coach a sales rep through a specific objection for {{productName}}.

Objection: {{objection}}
Deal stage: {{dealStage}}

{{#if angleCount}}
Provide {{angleCount}} distinct response angles.
{{/if}}

Rules:
1. Acknowledge the objection before pivoting, never dismiss or override it; show you heard it.
2. For each angle, name the approach (e.g., "Reframe as cost of inaction"), give a short script the rep can say aloud, then end with one specific next step.
3. Calibrate tone and urgency to the deal stage: {{dealStage}}, early objections need education; late-stage objections need decisiveness.
4. Never invent deal specifics, pricing, or competitive intelligence not provided. All deal information is confidential.`,

    variables: [
      {
        key: 'productName',
        label: 'Product or service you sell',
        type: 'text',
        required: true,
        helpText: 'Name of the product or service.',
        group: 'Your product',
      },
      {
        key: 'objection',
        label: 'The objection you received',
        type: 'multiline',
        required: true,
        helpText:
          'Paste the exact words the prospect used, or describe the objection as closely as possible.',
        group: 'Deal context',
      },
      {
        key: 'dealStage',
        label: 'Current deal stage',
        type: 'select',
        options: [
          'Early prospecting',
          'Discovery',
          'Proposal and evaluation',
          'Late-stage negotiation',
        ],
        default: 'Discovery',
        required: true,
        helpText: 'The stage shapes the urgency and strategy of the response.',
        group: 'Deal context',
      },
      {
        key: 'angleCount',
        label: 'Number of response angles (optional)',
        type: 'number',
        required: false,
        helpText: 'How many different response angles you want. Leave blank for Claude to decide (typically 3).',
        group: 'Output settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Objection handling reference card',
        purpose:
          'A reference card Claude uses to tailor objection responses to your product, methodology, and common deal patterns.',
        kind: 'starter',
        content: `# Objection handling reference card

## Your product
- Product name:
- Top 2–3 outcomes it delivers (use buyer language, not feature names):

## Most common objections you face
For each objection, note what has worked and what has not.

### "We already have a solution."
- What has worked:
- What has not worked:

### "The price is too high."
- What has worked:
- What has not worked:

### "We do not have budget right now."
- What has worked:
- What has not worked:

### "We need to think about it."
- What has worked:
- What has not worked:

### [Add your own common objection]
- What has worked:
- What has not worked:

## Deal health signals
List signals that indicate an objection is a smokescreen vs a real blocker.
- Smokescreen signals:
- Real blocker signals:

## Red lines
List any response tactics your team does not use (e.g., "never discount to close same-day").
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'sales-account-executive-objection-handler-scenario-1',
        title: 'Competitor displacement objection in early discovery',
        userInput:
          "The prospect at Orion Systems just said 'we already have a tool for this.' " +
          'We are in early discovery. How do I handle this?',
        expectedBehavior:
          'Claude should acknowledge the objection, then provide 2–3 named response angles suited to ' +
          'early discovery, where the goal is to earn the right to a deeper conversation, not close. ' +
          'Each angle should include a short spoken script and a specific next step. ' +
          'The response should not pressure the prospect or invent competitive claims.',
        mustContain: ['Orion Systems', 'already have a tool', 'early discovery'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'sales-account-executive-objection-handler-scenario-2',
        title: 'Price objection in late-stage negotiation',
        userInput:
          'I am in final negotiations with Vantage Group and they said the price is too high. ' +
          'Close date is in two weeks.',
        expectedBehavior:
          'Claude should handle the price objection with late-stage urgency in mind. ' +
          'Angles should include ROI reframing, cost-of-inaction, and a structured negotiation path. ' +
          'Each angle must end with a specific next step that keeps the two-week close date achievable. ' +
          'Claude must not invent pricing figures or discount terms.',
        mustContain: ['Vantage Group', 'price is too high', 'two weeks'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 5. Proposal Outline ─────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-sales-account-executive-proposal-outline-v1',
    slug: 'sales-account-executive-proposal-outline',
    name: 'Proposal Outline',
    tagline: 'A structured proposal outline tailored to your deal and stakeholders',
    description:
      'Produces a section-by-section proposal outline that frames value separately for each named ' +
      'stakeholder and respects the deal context. Leaves pricing and timelines as placeholders so ' +
      'you fill in the numbers, no invented figures.',
    role: 'Sales Account Executive',
    industry: 'Sales',
    tags: ['sales', 'proposal', 'deal-closing', 'stakeholders', 'documents'],
    category: 'sales',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You draft a structured proposal outline for {{productName}}.

Prospect company: {{prospectCompany}}
Core problem to solve: {{primaryProblem}}
Key stakeholders: {{keyStakeholders}}

{{#if dealSize}}
Deal size: {{dealSize}}.
{{/if}}

Rules:
1. Include sections for: executive summary, problem statement, proposed solution, implementation plan, success metrics, pricing structure, and next steps.
2. Frame value for each named stakeholder separately, different roles have different success criteria; make that visible in the outline.
3. Mark pricing figures, timelines, and technical specs as [to be confirmed] rather than inventing them.
4. Never invent prospect data, deal terms, or stakeholder titles not provided. All deal information is confidential.`,

    variables: [
      {
        key: 'productName',
        label: 'Product or service you sell',
        type: 'text',
        required: true,
        helpText: 'Name of the product or service.',
        group: 'Your product',
      },
      {
        key: 'prospectCompany',
        label: 'Prospect company name',
        type: 'text',
        required: true,
        helpText: 'The company the proposal is for.',
        group: 'Deal context',
      },
      {
        key: 'primaryProblem',
        label: 'Core problem or initiative',
        type: 'multiline',
        required: true,
        helpText:
          'Describe the business problem or initiative in the prospect\'s own language, as you heard it in discovery.',
        group: 'Deal context',
      },
      {
        key: 'keyStakeholders',
        label: 'Key stakeholders',
        type: 'multiline',
        required: true,
        helpText:
          'List the decision-makers and influencers with their names and roles. e.g., "Dana Chen, CFO; Marcus Webb, CTO".',
        group: 'Deal context',
      },
      {
        key: 'dealSize',
        label: 'Deal size (optional)',
        type: 'text',
        required: false,
        helpText:
          'e.g., "$80K ARR". Claude uses this to calibrate the depth of the proposal outline.',
        group: 'Deal context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Proposal reference card',
        purpose:
          'A reference card Claude uses to calibrate proposal structure, tone, and value framing to your product and typical deals.',
        kind: 'starter',
        content: `# Proposal reference card

## Your product
- Product name:
- Core value proposition (one sentence):
- Three outcomes buyers care most about:
  1.
  2.
  3.

## Standard proposal structure your team uses
Note any sections you always include or always exclude.

- Always include:
- Always exclude:

## Value framing by stakeholder role
How do you typically frame value for each role?

- CEO / Owner:
- CFO / Finance:
- CTO / Engineering:
- Operations / Head of Department:
- End users:

## Pricing and terms
- Pricing model (e.g., per-seat, usage-based, flat fee):
- Standard contract lengths:
- Discount authority (what you can offer without VP approval):

## Implementation timeline
- Typical onboarding duration:
- Key milestones:
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'sales-account-executive-proposal-outline-scenario-1',
        title: 'Proposal for an expense automation deal',
        userInput:
          'Help me outline a proposal for Meridian Capital. They want to automate their expense reporting. ' +
          'Key contacts are the CFO and the Controller.',
        expectedBehavior:
          'Claude should produce a section-by-section proposal outline for Meridian Capital. ' +
          'It must address the expense reporting automation problem and frame value separately for ' +
          'the CFO (cost and efficiency) and the Controller (accuracy and compliance). ' +
          'Pricing and timelines should be marked as [to be confirmed], no invented figures.',
        mustContain: ['Meridian Capital', 'expense reporting', 'CFO'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'sales-account-executive-proposal-outline-scenario-2',
        title: 'Proposal for a hospitality technology platform',
        userInput:
          'Draft a proposal outline for Suncrest Hotels. They need a centralized booking and revenue ' +
          'management platform. The decision-makers are the CTO and VP of Revenue.',
        expectedBehavior:
          'Claude should produce a structured proposal outline for Suncrest Hotels. ' +
          'The outline must address the centralized booking and revenue management need and frame value ' +
          'for both the CTO (integration and reliability) and VP of Revenue (yield and reporting). ' +
          'Implementation plan and pricing should use [to be confirmed] placeholders.',
        mustContain: ['Suncrest Hotels', 'booking and revenue management', 'CTO'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 6. Pipeline Review ──────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-sales-account-executive-pipeline-review-v1',
    slug: 'sales-account-executive-pipeline-review',
    name: 'Pipeline Review',
    tagline: 'Diagnose pipeline health and surface risks before they cost you the quarter',
    description:
      'Assesses a set of opportunities across stakeholder access, business case strength, ' +
      'competitive position, and deal momentum, then ranks them by risk level. ' +
      'Flags stalled deals, missing economic buyers, and vague next steps before they slip.',
    role: 'Sales Account Executive',
    industry: 'Sales',
    tags: ['sales', 'pipeline', 'forecasting', 'deal-review', 'crm', 'risk-assessment'],
    category: 'sales',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You conduct a structured pipeline review for {{productName}} opportunities.

Pipeline snapshot: {{pipelineSnapshot}}
Review focus: {{reviewFocus}}

{{#if closingPeriod}}
Closing period under review: {{closingPeriod}}.
{{/if}}

Rules:
1. Assess each deal across four dimensions: stakeholder access, business case strength, competitive position, and deal momentum.
2. Flag any deal where the next step is vague, the close date lacks a champion commitment, or the economic buyer has never been engaged directly.
3. Rank output by deal risk level, highest-risk deals get the most detailed coaching commentary.
4. Never invent deal data, contact names, close amounts, or competitive positions not provided. All pipeline information is confidential.`,

    variables: [
      {
        key: 'productName',
        label: 'Product or service you sell',
        type: 'text',
        required: true,
        helpText: 'Name of the product or service.',
        group: 'Your product',
      },
      {
        key: 'pipelineSnapshot',
        label: 'Pipeline deals to review',
        type: 'multiline',
        required: true,
        helpText:
          'Paste your deals in any format: deal name, stage, amount, last activity, next step, close date. The more detail, the sharper the review.',
        group: 'Pipeline data',
      },
      {
        key: 'reviewFocus',
        label: 'Review focus',
        type: 'select',
        options: [
          'Overall health and forecast accuracy',
          'Stalled deals only',
          'Deals at risk of slipping this quarter',
        ],
        default: 'Overall health and forecast accuracy',
        required: true,
        helpText: 'Directs Claude to prioritize the most relevant deals for your current situation.',
        group: 'Review settings',
      },
      {
        key: 'closingPeriod',
        label: 'Closing period (optional)',
        type: 'text',
        required: false,
        helpText:
          'e.g., "end of Q3", "next 30 days". Claude scopes the risk analysis to this window.',
        group: 'Review settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Pipeline review reference card',
        purpose:
          'A reference card Claude uses to calibrate deal stage definitions, health criteria, and risk signals to your team\'s standards.',
        kind: 'starter',
        content: `# Pipeline review reference card

## Deal stage definitions
Define what "done" looks like to move from one stage to the next.

- Prospecting → Discovery:
- Discovery → Demo/Eval:
- Demo/Eval → Proposal:
- Proposal → Negotiation:
- Negotiation → Closed Won:

## Deal health criteria
What must be true for a deal to be in "Commit" vs "Best Case" vs "Pipeline"?

- Commit:
- Best Case:
- Pipeline:

## Risk signals your team watches for
List 3–5 early warning signs a deal may slip.

1.
2.
3.

## Qualification bar
Minimum criteria a deal must meet to stay in active pipeline.

- Economic buyer engaged: (yes/no required)
- Business impact quantified: (yes/no required)
- Decision timeline confirmed: (yes/no required)
- Other:

## Your quota and current attainment
- Quota:
- Current attainment:
- Weeks left in period:
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'sales-account-executive-pipeline-review-scenario-1',
        title: 'Q3 pipeline review across four active deals',
        userInput:
          'Review my pipeline for Q3. I have 4 deals: Axiom Pharma ($120K, Discovery), ' +
          'Sterling Retail ($85K, Proposal), Nexus Media ($200K, Negotiation, champion went quiet), ' +
          'and Polaris Tech ($50K, Demo).',
        expectedBehavior:
          'Claude should assess all four deals and rank them by risk. Nexus Media, with a silent champion ' +
          'in negotiation at the highest deal value, should receive the most urgent coaching. ' +
          'Each deal must be evaluated on stakeholder access, business case, and momentum. ' +
          'Output should end with prioritized recommended actions per deal.',
        mustContain: ['Axiom Pharma', 'Nexus Media', 'champion went quiet'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'sales-account-executive-pipeline-review-scenario-2',
        title: 'Diagnose two stalled deals',
        userInput:
          'I have two stalled deals: Ironclad Finance has been in proposal stage for 6 weeks with no reply, ' +
          'and Brightside Health went dark after a great demo. Help me diagnose what is wrong.',
        expectedBehavior:
          'Claude should diagnose each stalled deal separately. For Ironclad Finance it should surface ' +
          'likely reasons for silence at proposal stage and give specific re-engagement actions. ' +
          'For Brightside Health it should explore why a positive demo stalled and recommend a targeted ' +
          'recovery play. Both should end with a specific next step.',
        mustContain: ['Ironclad Finance', 'Brightside Health', 'great demo'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 7. LinkedIn Message Writer ──────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-sales-account-executive-linkedin-message-v1',
    slug: 'sales-account-executive-linkedin-message',
    name: 'LinkedIn Message Writer',
    tagline: 'A short, relevant LinkedIn outreach message that earns a reply',
    description:
      'Writes a concise LinkedIn InMail or connection note, under 100 words, that opens with ' +
      'something specific about the prospect rather than a generic introduction. ' +
      'Tailors the hook to the prospect\'s role and the reason for outreach.',
    role: 'Sales Account Executive',
    industry: 'Sales',
    tags: ['sales', 'linkedin', 'outreach', 'social-selling', 'prospecting', 'messaging'],
    category: 'sales',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You write a short LinkedIn outreach message for {{productName}}.

Prospect name: {{prospectName}}
Prospect role: {{prospectRole}}
Reason for reaching out: {{connectionReason}}
Message goal: {{messageGoal}}

Rules:
1. Keep the message under 100 words, LinkedIn InMail has a narrow attention window.
2. Open with something specific to {{prospectName}} or their role, drawn from the reason for outreach, not "I came across your profile" or any generic opener.
3. Tie the reason for outreach to a plausible priority or challenge for a {{prospectRole}}.
4. Never invent the prospect's work history, recent posts, or company details not provided. All prospect information is confidential.`,

    variables: [
      {
        key: 'productName',
        label: 'Product or service you sell',
        type: 'text',
        required: true,
        helpText: 'Name of the product or service.',
        group: 'Your product',
      },
      {
        key: 'prospectName',
        label: "Prospect's full name",
        type: 'text',
        required: true,
        helpText: 'Used to personalize the opening line.',
        group: 'About the prospect',
      },
      {
        key: 'prospectRole',
        label: "Prospect's job title or role",
        type: 'text',
        required: true,
        helpText: 'e.g., "Director of Demand Generation", "VP of Sales", "Head of HR".',
        group: 'About the prospect',
      },
      {
        key: 'connectionReason',
        label: 'Why you are reaching out',
        type: 'multiline',
        required: true,
        helpText:
          'Describe what prompted the outreach: a post they made, a company announcement, a shared connection, a role change, or a pain you noticed.',
        group: 'Message context',
      },
      {
        key: 'messageGoal',
        label: 'Message goal',
        type: 'select',
        options: [
          'Send a connection request with a note',
          'Introduce myself and the product',
          'Request a brief call or meeting',
        ],
        default: 'Send a connection request with a note',
        required: true,
        helpText: 'Shapes the call to action at the end of the message.',
        group: 'Message context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'LinkedIn outreach reference card',
        purpose:
          'A reference card Claude uses to match your LinkedIn outreach style, voice, and off-limits phrases.',
        kind: 'starter',
        content: `# LinkedIn outreach reference card

## Your product
- Product name:
- One-line value proposition:
- Best-fit prospect role and industry:

## Your LinkedIn profile context
Brief description of your current role and what you typically lead with on LinkedIn.

- Current title:
- Company:
- What you help prospects do (one sentence):

## Voice and tone
Describe how you want to come across: e.g., "direct and peer-to-peer, not sales-y", "warm but brief".

## Openers that have worked
Paste 1–2 opening lines from past LinkedIn messages that earned a reply.

1.
2.

## Phrases to avoid
- e.g., "I came across your profile"
- e.g., "I hope this message finds you well"
- e.g., "I'd love to connect"

## Typical call to action
What do you usually ask for in a first LinkedIn message?
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'sales-account-executive-linkedin-message-scenario-1',
        title: 'Connection request after a prospect launched a new product',
        userInput:
          'Write a LinkedIn message to Priya Sharma, Director of Demand Generation at Cloudleap, ' +
          'asking to connect. I noticed they recently launched a new product line.',
        expectedBehavior:
          'Claude should write a sub-100-word LinkedIn message addressed to Priya Sharma at Cloudleap. ' +
          'The opening must reference the new product line launch specifically, not a generic intro. ' +
          'The message should close with a connection request, not a hard pitch.',
        mustContain: ['Priya Sharma', 'Cloudleap', 'new product line'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'sales-account-executive-linkedin-message-scenario-2',
        title: 'InMail requesting a call after a relevant post',
        userInput:
          'Write a LinkedIn InMail to James Whitfield, VP of Sales at Fortuna Retail, to request a ' +
          '15-minute call. He recently posted about the challenges of sales coaching at scale.',
        expectedBehavior:
          'Claude should write a sub-100-word LinkedIn InMail to James Whitfield. ' +
          'The opener must reference his post about sales coaching at scale. ' +
          'The message should pivot from the coaching challenge to a relevant product angle and close ' +
          'with a specific ask for a 15-minute call.',
        mustContain: ['James Whitfield', 'Fortuna Retail', 'sales coaching at scale'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 8. Call Notes Summarizer ────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-sales-account-executive-call-notes-summarizer-v1',
    slug: 'sales-account-executive-call-notes-summarizer',
    name: 'Call Notes Summarizer',
    tagline: 'Turn raw call notes into clean CRM-ready records with next steps',
    description:
      'Converts messy, stream-of-consciousness call notes into structured records, contact names, ' +
      'stated pains, key decisions, open questions, and next steps with owners and dates. ' +
      'Separates facts from inferences and flags anything missing.',
    role: 'Sales Account Executive',
    industry: 'Sales',
    tags: ['sales', 'crm', 'call-notes', 'deal-documentation', 'next-steps', 'productivity'],
    category: 'sales',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You convert raw call notes into clean, structured call records for {{dealStage}} stage deals.

Raw notes: {{rawNotes}}
Output format: {{outputFormat}}

{{#if crmSystem}}
Format the output to paste cleanly into {{crmSystem}} without extra editing.
{{/if}}

Rules:
1. Extract and label each category separately: contact names and roles, stated pain points, key decisions made, open questions, and agreed next steps with owner and target date.
2. Separate facts (what the prospect said or confirmed) from inferences (what you believe it signals), label them clearly.
3. List next steps with an explicit owner and target date; if either was not discussed, write [not confirmed] rather than inventing one.
4. Never add information not present in the raw notes. All call information is confidential.`,

    variables: [
      {
        key: 'rawNotes',
        label: 'Raw call notes',
        type: 'multiline',
        required: true,
        helpText:
          'Paste your unedited call notes, voice memo transcriptions, bullet fragments, shorthand all work.',
        group: 'Call data',
      },
      {
        key: 'dealStage',
        label: 'Call stage',
        type: 'select',
        options: ['Discovery', 'Demo', 'Proposal', 'Negotiation', 'Closed-won', 'Closed-lost'],
        default: 'Discovery',
        required: true,
        helpText: 'Claude adapts what it surfaces based on the stage, e.g., discovery notes focus on pain and fit; negotiation notes focus on terms and next steps.',
        group: 'Call context',
      },
      {
        key: 'outputFormat',
        label: 'Output format',
        type: 'select',
        options: ['Structured CRM fields', 'Bullet points', 'Prose paragraph'],
        default: 'Structured CRM fields',
        required: true,
        helpText: 'Choose the format that matches how you log notes.',
        group: 'Output settings',
      },
      {
        key: 'crmSystem',
        label: 'CRM system (optional)',
        type: 'text',
        required: false,
        helpText:
          'e.g., Salesforce, HubSpot, Pipedrive. Claude formats the output to paste cleanly into your CRM fields.',
        group: 'Output settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Call notes reference card',
        purpose:
          'A reference card Claude uses to match your CRM field names, note structure, and logging standards.',
        kind: 'starter',
        content: `# Call notes reference card

## Your CRM setup
- CRM system name:
- Key fields you log after every call:
  - Contact name and role:
  - Account name:
  - Call date:
  - Pain / challenge:
  - Next steps:
  - Close date:
  - Other custom fields:

## Stage-specific logging requirements
Note anything you must capture at each stage.

- Discovery:
- Demo:
- Proposal:
- Negotiation:

## Next-step ownership rules
Who owns what by default?

- Book follow-up call: (AE or prospect?)
- Send proposal: (AE)
- Intro to technical team: (AE or champion?)

## Abbreviations you use in notes
Help Claude decode your shorthand.

- e.g., EB = Economic Buyer
- e.g., CoD = Close of Deal
- Add your own:
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'sales-account-executive-call-notes-summarizer-scenario-1',
        title: 'Summarize discovery call notes into CRM fields',
        userInput:
          "Summarize these notes from my call with Olivia Grant at Beacon Analytics: 'pain is slow " +
          "quarterly reporting, 3 people in finance team do it manually, takes 2 weeks each quarter, " +
          "budget discussion deferred to next call, she will share with her CFO by Friday.'",
        expectedBehavior:
          'Claude should extract and label the stated pain (slow quarterly reporting), the operational ' +
          'detail (3 people, 2 weeks each quarter), the open item (budget), and the agreed next step ' +
          '(sharing with CFO by Friday). Facts and inferences should be labeled separately. ' +
          'The output should be in the configured format and flag the missing budget information.',
        mustContain: ['Olivia Grant', 'Beacon Analytics', 'quarterly reporting'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'sales-account-executive-call-notes-summarizer-scenario-2',
        title: 'Summarize negotiation call notes',
        userInput:
          'Here are my raw notes from a negotiation call with Titan Logistics: ' +
          "'they pushed back on the implementation timeline, want go-live in 6 weeks not 10, " +
          "legal review starts Monday, procurement needs vendor security questionnaire.'",
        expectedBehavior:
          'Claude should extract the open negotiation item (implementation timeline), the legal and ' +
          'procurement next steps with implied dates, and flag who owns the security questionnaire. ' +
          'Next steps without an explicit owner or date must be marked [not confirmed]. ' +
          'Output should be structured and ready to paste into a CRM.',
        mustContain: ['Titan Logistics', 'implementation timeline', 'security questionnaire'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 9. Renewal & Upsell Pitch ───────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-sales-account-executive-renewal-upsell-pitch-v1',
    slug: 'sales-account-executive-renewal-upsell-pitch',
    name: 'Renewal & Upsell Pitch',
    tagline: 'Frame renewal and expansion conversations around business value, not features',
    description:
      'Builds a renewal or upsell narrative that opens with what the account has already gained, ' +
      'connects the proposed expansion to an outcome the customer cares about, and pre-empts the ' +
      'two most likely objections to expanding at contract time.',
    role: 'Sales Account Executive',
    industry: 'Sales',
    tags: ['sales', 'renewal', 'upsell', 'expansion', 'account-management', 'retention'],
    category: 'sales',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You frame a renewal or upsell conversation for {{productName}}.

Account: {{accountName}}
Target upgrade or add-on: {{upsellTarget}}

{{#if currentPlan}}
Their current plan: {{currentPlan}}.
{{/if}}

{{#if accountContext}}
Account context: {{accountContext}}
{{/if}}

Rules:
1. Open with a value summary, what the account has gained from their current setup, before introducing the upsell or renewal ask.
2. Connect the proposed expansion to a business outcome the account cares about, not product features.
3. Anticipate and address the two most likely objections to expanding at renewal; give a response for each.
4. Never invent usage data, ROI figures, or account history not provided. All account information is confidential.`,

    variables: [
      {
        key: 'productName',
        label: 'Product or service you sell',
        type: 'text',
        required: true,
        helpText: 'Name of the product or service.',
        group: 'Your product',
      },
      {
        key: 'accountName',
        label: 'Account name',
        type: 'text',
        required: true,
        helpText: 'The customer account you are renewing or expanding.',
        group: 'Account context',
      },
      {
        key: 'upsellTarget',
        label: 'Target upgrade or add-on',
        type: 'text',
        required: true,
        helpText:
          'What you want the account to add or upgrade to. e.g., "Enterprise tier", "analytics module", "5 additional seats".',
        group: 'Account context',
      },
      {
        key: 'currentPlan',
        label: 'Current plan or tier (optional)',
        type: 'text',
        required: false,
        helpText:
          'e.g., "Professional plan", "Starter tier". Helps Claude frame the upgrade contrast.',
        group: 'Account context',
      },
      {
        key: 'accountContext',
        label: 'Account context (optional)',
        type: 'multiline',
        required: false,
        helpText:
          'Any known wins, usage signals, growth events, or key contacts. e.g., "team grew from 10 to 30 users", "champion promoted to VP".',
        group: 'Account context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Renewal and upsell reference card',
        purpose:
          'A reference card Claude uses to calibrate your renewal narrative, upsell tiers, and common expansion objections.',
        kind: 'starter',
        content: `# Renewal and upsell reference card

## Your product
- Product name:
- Current tiers or plans (list from entry to highest):
  1.
  2.
  3.

## What each upgrade unlocks (outcomes, not features)
For each upgrade path, describe the business outcome the customer gains.

- Entry → Mid:
- Mid → Enterprise:
- Add-on (name it):

## Triggers that make an account ready to expand
List 3–5 signals that suggest an account is ready for a conversation about expanding.

1.
2.
3.

## Most common renewal objections and your standard responses
- "We need to reduce costs this year." →
- "We are not getting enough value yet." →
- "We need to involve our CFO." →
- [Add your own] →

## Renewal timeline
- Contract end date lead time for first renewal outreach:
- How many touchpoints before renewal date:
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'sales-account-executive-renewal-upsell-pitch-scenario-1',
        title: 'Enterprise tier upsell at renewal',
        userInput:
          'Help me pitch renewal plus an upgrade to the Enterprise tier for Radiant Health. ' +
          'They have been on our Professional plan for 18 months. I want to add the analytics module.',
        expectedBehavior:
          'Claude should build a renewal and upsell narrative for Radiant Health. ' +
          'It must open with a value summary of what 18 months on the Professional plan has delivered, ' +
          'then frame the Enterprise tier and analytics module in terms of outcomes, not features. ' +
          'It should anticipate and address the two most likely objections to upgrading at renewal.',
        mustContain: ['Radiant Health', 'Enterprise tier', 'analytics module'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'sales-account-executive-renewal-upsell-pitch-scenario-2',
        title: 'AI add-on upsell for a growing team',
        userInput:
          'I need to upsell Westfield Partners on our AI feature add-on at renewal. ' +
          'They have been happy customers for 2 years and their team has grown from 5 to 20 users.',
        expectedBehavior:
          'Claude should build an upsell pitch for Westfield Partners. ' +
          'It should reference the team\'s growth from 5 to 20 users as evidence of expanding need, ' +
          'frame the AI feature add-on around efficiency or scale outcomes relevant to a larger team, ' +
          'and pre-empt objections a finance-aware buyer might raise.',
        mustContain: ['Westfield Partners', 'AI feature add-on', 'grown from 5 to 20'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 10. Competitive Battlecard ──────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-sales-account-executive-competitive-battlecard-v1',
    slug: 'sales-account-executive-competitive-battlecard',
    name: 'Competitive Battlecard',
    tagline: 'A sharp, buyer-language battlecard against a named competitor',
    description:
      'Builds a structured battlecard, where you win, where they win, common objections and responses, ' +
      'and a recommended talk track, framed entirely in buyer outcomes rather than feature comparisons. ' +
      'Keeps the landmines section honest so reps do not get caught underselling a real competitor strength.',
    role: 'Sales Account Executive',
    industry: 'Sales',
    tags: ['sales', 'competitive', 'battlecard', 'deal-coaching', 'positioning', 'win-loss'],
    category: 'sales',
    source: 'ai-generated',
    author: null,
    version: '1.0.0',
    createdAt: '2026-07-07T00:00:00.000Z',
    updatedAt: '2026-07-07T00:00:00.000Z',
    reviewStatus: 'approved',
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: ['claude-app'],
    tier: 'core',

    instructionTemplate: `You build a competitive battlecard for {{productName}} vs {{competitorName}}.

Your product strengths: {{productStrengths}}

{{#if targetBuyer}}
Primary buyer persona in this competitive situation: {{targetBuyer}}.
{{/if}}

{{#if knownWeaknesses}}
Known competitor weaknesses to factor in: {{knownWeaknesses}}
{{/if}}

Rules:
1. Structure the battlecard as: head-to-head summary, where you win, where they win (landmines), common objections with responses, and a recommended talk track.
2. Frame every comparison in buyer outcome language, not feature names or technical specs.
3. Keep the landmines section honest; underplaying a real competitor strength loses credibility when prospects probe.
4. Never invent competitive claims, pricing, customer references, or market share data not provided. All competitive information is confidential.`,

    variables: [
      {
        key: 'productName',
        label: 'Your product or service',
        type: 'text',
        required: true,
        helpText: 'Name of the product or service you sell.',
        group: 'Your product',
      },
      {
        key: 'competitorName',
        label: 'Competitor name',
        type: 'text',
        required: true,
        helpText: 'The specific competitor this battlecard is for.',
        group: 'Competitive context',
      },
      {
        key: 'productStrengths',
        label: 'Your product strengths vs this competitor',
        type: 'multiline',
        required: true,
        helpText:
          'List the areas where your product genuinely wins. Use buyer language, e.g., "faster implementation" not "lower code complexity".',
        group: 'Competitive context',
      },
      {
        key: 'targetBuyer',
        label: 'Primary buyer persona (optional)',
        type: 'text',
        required: false,
        helpText:
          'The persona most often in this competitive situation. e.g., "VP of Sales at mid-market SaaS". Sharpens the talk track.',
        group: 'Competitive context',
      },
      {
        key: 'knownWeaknesses',
        label: 'Known competitor weaknesses (optional)',
        type: 'multiline',
        required: false,
        helpText:
          'Any confirmed competitor gaps, customer complaints, or areas of known weakness. Claude factors these into the battlecard.',
        group: 'Competitive context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Competitive battlecard reference card',
        purpose:
          'A reference card Claude uses to calibrate competitive positioning, confirmed weaknesses, and off-limits claims for your product.',
        kind: 'starter',
        content: `# Competitive battlecard reference card

## Your product
- Product name:
- Core positioning statement (one sentence):
- Three outcomes buyers choose you for:
  1.
  2.
  3.

## Known competitors and their primary positioning
List each main competitor and how they position themselves.

- [Competitor 1]:
- [Competitor 2]:
- [Competitor 3]:

## Where you consistently win
Describe the deal scenarios where you reliably beat each competitor.

- vs [Competitor 1]:
- vs [Competitor 2]:

## Where you lose (landmines)
Be honest. List the scenarios where a competitor has a genuine advantage.

- vs [Competitor 1]:
- vs [Competitor 2]:

## Claims your team never makes
List any competitive claims that are off-limits (unverifiable, legally risky, or factually wrong).

1.
2.

## Customer references for competitive deals
List any anonymized case studies or quotes that are pre-approved for use in competitive situations.

- [Reference 1]:
- [Reference 2]:
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'sales-account-executive-competitive-battlecard-scenario-1',
        title: 'Battlecard against Salesforce for a CRM deal',
        userInput:
          'Build a battlecard against Salesforce for our CRM product targeting VP of Sales buyers ' +
          'at mid-market companies.',
        expectedBehavior:
          'Claude should produce a structured battlecard covering head-to-head summary, where the product ' +
          'wins vs Salesforce, honest landmines (where Salesforce is stronger), common objections with ' +
          'responses, and a talk track for a VP of Sales at a mid-market company. ' +
          'All comparisons must use buyer outcome language, not feature names. ' +
          'Claude must not invent market share data or customer case studies.',
        mustContain: ['Salesforce', 'VP of Sales', 'mid-market'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'sales-account-executive-competitive-battlecard-scenario-2',
        title: 'Battlecard against HubSpot for a marketing team deal',
        userInput:
          'I need a battlecard against HubSpot for deals where the buyer is a Marketing Director ' +
          'at a B2B company with under 200 employees.',
        expectedBehavior:
          'Claude should build a battlecard for competing against HubSpot, scoped to a Marketing Director ' +
          'at a small B2B company. The where-you-win and landmine sections must reflect the likely ' +
          'trade-offs relevant to this buyer and company size. The talk track must be calibrated to a ' +
          'marketing leader\'s priorities: pipeline, attribution, and campaign efficiency.',
        mustContain: ['HubSpot', 'Marketing Director', '200 employees'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },
];
