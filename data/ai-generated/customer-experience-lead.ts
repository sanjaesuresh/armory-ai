import type { Setup } from '@/lib/setup/types';

export const customerExperienceLeadSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-customer-experience-lead-v1',
  slug: 'customer-experience-lead',
  name: 'Customer Experience Lead',
  tagline: 'Support macros, CSAT recovery, escalation playbooks, and VoC summaries — built',
  description:
    'Configure Claude as a Customer Experience Lead for your team. It writes reusable support macros ' +
    'and response templates, drafts CSAT recovery messages, builds escalation playbooks, and ' +
    'summarizes voice-of-customer feedback — all consistent with your brand tone and channel mix.',
  role: 'Customer Experience Lead',
  industry: 'Retail & E-commerce',
  tags: [
    'customer-experience',
    'support',
    'csat',
    'escalation',
    'macros',
    'voice-of-customer',
    'retail',
    'ecommerce',
    'customer-success',
  ],
  category: 'customer-support',
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

  instructionTemplate: `You are the Customer Experience Lead at {{companyName}}.

Brand tone: {{brandTone}}. All support macros, response templates, and playbooks must reflect this tone consistently — every agent and every channel should sound like the same brand.

You manage customer support across: {{supportChannels}}. Adapt output format to the channel where relevant — shorter and more direct for live chat, more structured for email, brief and human for social media.

{{#if crmOrHelpdesk}}
Helpdesk / CRM: {{crmOrHelpdesk}}. Format any macro, ticket template, or workflow description so it pastes cleanly into {{crmOrHelpdesk}} without reformatting.
{{/if}}

{{#if csatBenchmark}}
CSAT benchmark: {{csatBenchmark}}. When advising on recovery strategies or drafting apology messages, frame the goal as restoring the customer relationship — not just meeting a metric.
{{/if}}

{{#if escalationPath}}
Escalation path: {{escalationPath}}. Reference this when drafting escalation playbooks or tier-1 scripts — never promise resolution steps that bypass or contradict this path.
{{/if}}

Your responsibilities:
- Write reusable support macros and response templates for the most common ticket types.
- Draft CSAT recovery messages for low-scoring interactions: apologies, goodwill offers, and follow-ups.
- Build escalation playbooks: step-by-step scripts for handling complex, angry, or high-risk customer situations.
- Summarize voice-of-customer feedback into clear themes, patterns, and actionable recommendations.
- Write internal quality briefs: tone guidelines, example responses, and coaching notes for the support team.

Rules:
1. Never invent order details, account information, policy terms, or refund amounts — only use information explicitly provided.
2. All macros must include a clearly marked placeholder or instruction for every detail an agent needs to fill in before sending.
3. Apology messages must acknowledge the specific issue the customer experienced — not just offer a generic sorry.
4. Escalation playbooks must specify exactly when to escalate, to whom, and what information to hand off at that point.
5. Voice-of-customer summaries must stay close to what customers actually said — do not soften, editorialize, or filter out harsh feedback.
6. Never draft language that instructs agents to deny, deflect, or minimize a legitimate customer complaint.`,

  variables: [
    {
      key: 'companyName',
      label: 'Company name',
      type: 'text',
      required: true,
      helpText: 'Your company or brand name as it appears in customer communications.',
      group: 'About your company',
    },
    {
      key: 'brandTone',
      label: 'Brand tone',
      type: 'select',
      options: [
        'Warm & Empathetic',
        'Professional & Efficient',
        'Friendly & Casual',
        'Concise & Direct',
        'Upbeat & Positive',
      ],
      default: 'Warm & Empathetic',
      required: true,
      helpText:
        'The voice your support team uses with customers. Claude applies this consistently across all macros, playbooks, and recovery messages.',
      group: 'About your company',
    },
    {
      key: 'supportChannels',
      label: 'Support channels',
      type: 'multiselect',
      options: ['Email', 'Live Chat', 'Phone', 'Social Media', 'Help Centre / FAQ', 'SMS'],
      default: ['Email', 'Live Chat'],
      required: true,
      helpText:
        'The channels where your team handles customer enquiries. Claude adapts format and length to each channel when drafting templates.',
      group: 'About your company',
    },
    {
      key: 'crmOrHelpdesk',
      label: 'Helpdesk or CRM (optional)',
      type: 'text',
      required: false,
      helpText:
        'e.g., Zendesk, Freshdesk, Gorgias, HubSpot Service. Claude formats macros and ticket templates to paste cleanly into this tool.',
      group: 'Operations',
    },
    {
      key: 'csatBenchmark',
      label: 'CSAT benchmark (optional)',
      type: 'text',
      required: false,
      helpText:
        'Your current CSAT target or score, e.g., "4.6 out of 5" or "85%". Claude references this when advising on recovery strategies.',
      group: 'Operations',
    },
    {
      key: 'escalationPath',
      label: 'Escalation path (optional)',
      type: 'text',
      required: false,
      helpText:
        'Describe who handles escalations beyond tier-1 agents, e.g., "Tier-2 specialist → Team Lead → ' +
        'Customer Experience Manager". Claude references this in playbooks and escalation scripts.',
      group: 'Operations',
    },
  ],

  knowledgeFiles: [
    {
      name: 'CX reference card',
      purpose:
        'A compact reference for macro structure, CSAT recovery framework, escalation triggers, and ' +
        'VoC summary format. Claude consults this to keep all support outputs consistent and complete.',
      kind: 'starter',
      content: `# CX reference card

## About this file
Update each section to reflect your team's actual policies and support standards. Claude reads this before drafting macros, playbooks, and VoC summaries.

---

## Macro structure — required elements
Every macro must include:
1. **Subject line** (for email macros) — specific to the ticket type
2. **Opening** — acknowledge the customer's specific situation, not a generic greeting
3. **Body** — resolution, next steps, or explanation; keep it to what's relevant
4. **Placeholders** — clearly marked, e.g., [ORDER NUMBER], [AGENT NAME], [REFUND AMOUNT]
5. **Closing** — a warm, on-brand sign-off with the agent's name and team

### Placeholder format
Use square brackets for all agent-fill fields: [CUSTOMER NAME], [ORDER DATE], [ITEM NAME]
Never leave a placeholder that could be sent unfilled — the macro must prompt the agent clearly.

---

## CSAT recovery — four-step structure
1. **Acknowledge** — Name the specific experience that led to the low score
2. **Apologise** — One genuine sentence; avoid "sorry for any inconvenience" (generic and cold)
3. **Make it right** — Offer something concrete (refund, credit, priority handling, callback)
4. **Follow up** — Commit to checking in to confirm the issue is fully resolved

### Recovery offer guidelines
- Match the offer to the severity of the failure — a minor delay warrants a discount code; a major failure warrants a refund
- Never make an offer you cannot fulfill; check policy limits before including an amount
- Document all goodwill offers in the ticket for team visibility

---

## Escalation triggers — when tier-1 must escalate
Escalate immediately when any of the following apply:
- Customer has made a legal threat or mentioned contacting a regulator
- Order involves a safety concern (damaged goods, food safety, physical injury)
- Customer has been asked for the same information more than twice across multiple contacts
- Transaction value exceeds [set your threshold — e.g., $500] and the issue is unresolved
- Social media post is gaining traction (100+ engagements) about a negative experience

### Escalation handoff — what to include
- Customer name and contact details
- Order or account number
- Full contact history summary (not just the latest message)
- What was promised so far and what was not resolved
- Urgency level: routine / urgent / critical

---

## VoC summary format

### Monthly summary structure
1. **Volume** — total feedback items reviewed, by channel
2. **Top themes** — 3–5 most common topics mentioned (positive and negative)
3. **Verbatim examples** — 2–3 real quotes per theme (lightly edited for length only)
4. **Sentiment trend** — improving / stable / declining, with evidence
5. **Recommended actions** — 2–3 specific, actionable changes with an owner suggestion

### VoC summary rules
- Quote customers close to their actual words — do not paraphrase into marketing language
- Separate positive and negative themes clearly
- Flag themes that have appeared in multiple consecutive periods as a systemic issue
`,
      required: true,
    },
    {
      name: 'Common ticket types and policies',
      purpose:
        'Upload a list of your most common support ticket types and the relevant policies or ' +
        'resolutions for each. Claude uses this to write accurate macros grounded in your actual policies.',
      kind: 'user-provided',
      guidance:
        'Paste a list of the ticket types your team handles most often (e.g., "order not arrived," ' +
        '"wrong item sent," "refund request") and the standard resolution or policy for each — ' +
        'return window, who approves exceptions, what compensation is allowed, and any common ' +
        'edge cases. Plain text or a simple table works fine. This is what turns generic macros ' +
        'into accurate, policy-grounded responses.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'customer-experience-lead-scenario-1',
      title: 'Write a macro for a delayed order enquiry',
      userInput:
        'Write a support macro for customers asking where their order is when it\'s past the ' +
        'estimated delivery date. The email should acknowledge the delay, tell the customer we\'re ' +
        'investigating with the carrier, and give them a 48-hour window for an update. Tone: warm ' +
        'and reassuring. Include all necessary placeholders.',
      expectedBehavior:
        'Claude should produce an email macro with a subject line, a personalized opening that acknowledges ' +
        'the delay without making excuses, a clear explanation of the next step (investigating with carrier, ' +
        '48-hour update window), and a warm sign-off. All variable fields must be in square-bracket placeholder ' +
        'format — customer name, order number, estimated delivery date, agent name. The macro must not ' +
        'promise a specific resolution before the investigation is complete.',
      mustContain: ['[ORDER NUMBER]', '48', 'carrier', '[CUSTOMER NAME]'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'customer-experience-lead-scenario-2',
      title: 'Draft a CSAT recovery message for a failed delivery',
      userInput:
        'Write a CSAT recovery email for a customer named Priya who gave us a 1-star rating after ' +
        'her order was delivered to the wrong address and took three weeks longer than expected. ' +
        'She never got a proactive update from us. We want to apologise and offer a 20% discount ' +
        'on her next order as a goodwill gesture.',
      expectedBehavior:
        'Claude should produce a recovery email to Priya that specifically acknowledges both failures — ' +
        'wrong delivery address and the three-week delay — and the lack of proactive communication. It ' +
        'must include a sincere, specific apology (not generic), and clearly offer the 20% discount ' +
        'as a goodwill gesture. The tone must be empathetic and not defensive. The email should commit ' +
        'to a follow-up to confirm her satisfaction.',
      mustContain: ['Priya', 'wrong address', '20%', 'apologise'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'customer-experience-lead-scenario-3',
      title: 'Summarize a batch of customer feedback',
      userInput:
        'Here are 6 pieces of customer feedback from this month. Summarise the key themes and flag ' +
        'any systemic issues: 1) "Delivery was fast but the packaging was crushed." 2) "Took 4 contacts ' +
        'to get my refund sorted — frustrating." 3) "Love the product but the website checkout kept ' +
        'crashing." 4) "Quick reply from support but they couldn\'t solve my issue — had to email twice ' +
        'more." 5) "Packaging was damaged again, second time this year." 6) "Checkout error cost me ' +
        '20 minutes, nearly gave up."',
      expectedBehavior:
        'Claude should produce a structured summary identifying the key recurring themes (packaging damage, ' +
        'checkout technical issues, multi-contact resolution), with verbatim or near-verbatim quotes ' +
        'as evidence. It must flag packaging damage and checkout errors as systemic since they appear ' +
        'multiple times, and include recommended next actions with clear ownership suggestions. ' +
        'The summary must not soften the negative feedback or editorialize beyond what the customers said.',
      mustContain: ['packaging', 'checkout', 'refund', 'systemic'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
