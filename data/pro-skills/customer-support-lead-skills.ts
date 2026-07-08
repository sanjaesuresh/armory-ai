import type { Setup } from '@/lib/setup/types';

export const customerSupportLeadSkills: Setup[] = [
  // ── 1. Macro & Canned Response Writer ────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-customer-support-lead-macro-writer-v1',
    slug: 'customer-support-lead-macro-writer',
    name: 'Macro & Canned Response Writer',
    tagline: 'Draft reusable support macros agents can paste and lightly personalize',
    description:
      'Turn a support scenario into a polished canned response macro — complete with ' +
      'subject line, greeting, body, sign-off, and bracketed placeholders for agent edits. ' +
      'Consistent tone, scannable structure, no over-promising.',
    role: 'Customer Support Lead',
    industry: 'Customer Support',
    tags: ['customer-support', 'macros', 'canned-responses', 'tickets', 'tone'],
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

    instructionTemplate: `You are a support macro writer at {{companyName}} for {{productName}}.

Draft reusable canned response macros that agents can paste and lightly edit before sending.

Tone: {{tone}}. Macros must sound natural — not robotic or templated — while staying consistent with the brand voice.

Macro type focus: {{macroType}}.

Rules:
1. Each macro includes a subject line, greeting, body, and sign-off placeholder.
2. Use [brackets] for any placeholder the agent must fill in before sending (e.g., [customer name], [order ID]).
3. Write for scanability — short paragraphs, one idea per section.
4. Never include promises about timelines, refunds, or resolutions that require a human decision.
5. Flag any content that may need legal or policy review before the macro is deployed.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name as customers know it.',
        group: 'About your company',
      },
      {
        key: 'productName',
        label: 'Product or service name',
        type: 'text',
        required: true,
        helpText: 'The primary product or service your support team handles.',
        group: 'About your company',
      },
      {
        key: 'tone',
        label: 'Support tone',
        type: 'select',
        options: [
          'Empathetic and warm',
          'Professional and neutral',
          'Friendly and casual',
          'Concise and direct',
        ],
        default: 'Empathetic and warm',
        required: true,
        helpText: 'The voice your team uses in customer-facing messages.',
        group: 'Communication style',
      },
      {
        key: 'macroType',
        label: 'Macro type',
        type: 'select',
        options: [
          'Account issue',
          'Billing dispute',
          'Feature request',
          'Technical troubleshooting',
          'Refund or return',
          'General inquiry',
        ],
        default: 'Account issue',
        required: true,
        helpText: 'The category of support situation this macro handles.',
        group: 'Macro details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Macro style guide',
        purpose:
          'A reference card of tone rules, structural conventions, and example macros. ' +
          'Claude uses this to keep every macro consistent with your team\'s voice.',
        kind: 'starter',
        content: `# Macro style guide

## About this file
This is a living reference for your support macro library. Edit the guidelines below to match your brand and policies. Claude consults this when drafting new macros.

---

## Tone guidelines
- Lead with the customer's experience before moving to the solution.
- Never start a macro with "I" or "Unfortunately."
- Avoid jargon, acronyms, and internal system names in customer-facing text.
- Keep sentences under 20 words. Short paragraphs. One idea per sentence.

---

## Macro structure

Every macro follows this order:
1. **Subject line** — direct and specific (e.g., "Re: Trouble logging in to your account")
2. **Greeting** — "Hi [Customer name]," (never "Dear Sir/Madam" or "To whom it may concern")
3. **Acknowledgment** — one sentence that names the issue the customer raised
4. **Body** — the resolution path, next steps, or information needed
5. **Sign-off** — "[Agent name] | [Company] Support"

---

## Placeholder conventions
Use [square brackets] for anything the agent must fill in before sending:
- [Customer name]
- [Order ID / Ticket #]
- [Specific error message]
- [Date/time]
- [Agent name]

---

## What to avoid
- Do NOT promise a specific timeline unless the SLA is confirmed.
- Do NOT reference internal tools, ticket IDs, or system names.
- Do NOT include a satisfaction survey link in a macro — add it separately.
- Do NOT use conditional phrasing like "if this worked" — resolve the open loop.

---

## Example macro — Account access issue

Subject: Re: Trouble accessing your account

Hi [Customer name],

Thank you for reaching out. I am sorry to hear you are having trouble accessing your account — let me help get this sorted.

Could you share the following so I can look into this quickly?

- The email address associated with your account
- Whether you see a specific error message (and if so, what it says)
- What you have already tried (e.g., password reset, different browser or device)

I will pick this up as soon as I hear back from you.

[Agent name]
[Company] Support
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'customer-support-lead-macro-writer-scenario-1',
        title: 'Draft a macro for customers who forgot their sign-up email',
        userInput:
          'We get at least 20 tickets a week from customers who can\'t log in because they forgot which email they used to sign up. I need a canned response macro that helps us handle this quickly.',
        expectedBehavior:
          'Claude should produce a complete macro with a subject line, empathetic opening, ' +
          'a clear request for the information needed (e.g., alternative email addresses to check, ' +
          'any social login used), and a sign-off with agent placeholders. The macro should not ' +
          'promise a resolution timeline or fabricate account-recovery steps.',
        mustContain: ['forgot which email', 'canned response macro', 'log in'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'customer-support-lead-macro-writer-scenario-2',
        title: 'Draft a macro for an order cancellation request within the window',
        userInput:
          'Can you write a macro for when a customer asks to cancel their order? They usually contact us within an hour of purchasing. We have a 24-hour no-questions-asked cancellation window.',
        expectedBehavior:
          'Claude should produce a macro that confirms the cancellation policy window, ' +
          'collects the information needed to process the cancellation (order ID, email), ' +
          'and sets a clear expectation for the refund timeline without overpromising a specific date. ' +
          'The macro should not commit to the cancellation being confirmed before it is processed.',
        mustContain: ['cancel their order', '24-hour', 'cancellation'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 2. Escalation Playbook ────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-customer-support-lead-escalation-playbook-v1',
    slug: 'customer-support-lead-escalation-playbook',
    name: 'Escalation Playbook',
    tagline: 'Build a clear escalation decision playbook your whole team can use under pressure',
    description:
      'Generate an escalation playbook tailored to your tier structure and the trigger types ' +
      'your team encounters most. Each trigger gets a decision rule, a handoff note format, and ' +
      'a quick-reference guide agents can consult in under 30 seconds.',
    role: 'Customer Support Lead',
    industry: 'Customer Support',
    tags: ['customer-support', 'escalation', 'playbook', 'triage', 'sop'],
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

    instructionTemplate: `You are building an escalation decision playbook for {{companyName}}.

Escalation path:
- Tier 1: {{tier1Role}}
- Tier 2: {{tier2Role}}

Escalation triggers to cover: {{escalationTriggers}}

For each trigger, provide:
1. A one-sentence decision rule stating when the trigger applies.
2. The information tier-1 must gather before escalating.
3. The handoff note format (fields: ticket ID, customer name, issue summary, steps taken, why escalating, customer sentiment).

End with a quick-reference decision tree a tier-1 agent can scan in under 30 seconds.

Rules:
1. Use plain language. No corporate jargon. The playbook must be usable under pressure.
2. Never fabricate policy details, financial thresholds, or SLA commitments. Mark any section that needs policy input with [POLICY INPUT NEEDED].
3. Sensitive situations — legal threats, data privacy requests, accessibility complaints — must always route to human review regardless of apparent resolution.
4. Do not promise resolution outcomes in escalation language; promise only that the right person will take over.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name.',
        group: 'About your company',
      },
      {
        key: 'tier1Role',
        label: 'Tier-1 role name',
        type: 'text',
        required: true,
        helpText: 'The title of your first-line support agents (e.g., Support Agent, CX Specialist).',
        group: 'Escalation path',
      },
      {
        key: 'tier2Role',
        label: 'Tier-2 role name',
        type: 'text',
        required: true,
        helpText: 'The title of your escalation team (e.g., Senior Support Specialist, Team Lead).',
        group: 'Escalation path',
      },
      {
        key: 'escalationTriggers',
        label: 'Escalation triggers to include',
        type: 'multiselect',
        options: [
          'Legal threat',
          'Data breach concern',
          'Refund over $500',
          'Media or press mention',
          'Repeated contact (3+ times on same issue)',
          'Accessibility complaint',
          'Account compromise',
          'Outage or critical bug',
        ],
        required: true,
        helpText: 'Select all trigger types your playbook should cover.',
        group: 'Escalation path',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Escalation matrix reference',
        purpose:
          'A fillable matrix of escalation triggers, responsible tiers, and response expectations. ' +
          'Claude uses this to keep playbook output aligned with your existing team structure.',
        kind: 'starter',
        content: `# Escalation matrix reference

## About this file
Complete this matrix with your team's actual escalation rules, role names, and response expectations. Claude references it when building or reviewing your escalation playbook.

---

## Escalation tiers

| Tier | Role | Handles |
|------|------|---------|
| Tier 1 | [Your tier-1 role] | First response, standard troubleshooting, routine billing |
| Tier 2 | [Your tier-2 role] | Complex issues, repeat contacts, exceptions requiring approval |
| Tier 3 | [Engineering / Legal / Management] | Bugs, legal threats, compliance issues |

---

## Trigger reference

| Trigger | Route to | Information to gather first | SLA |
|---------|----------|-----------------------------|-----|
| Legal threat | [Role] | Full contact history, customer's stated concern | [Time] |
| Data breach / privacy concern | [Role] | Ticket history, data involved, customer contact details | [Time] |
| Refund request over threshold | [Role] | Order details, prior contacts, refund policy applicability | [Time] |
| Repeated contact (3+ times) | [Role] | Full ticket history, issue summary, steps taken | [Time] |
| Account compromise | [Role] | Account details, signs of unauthorized access | [Time] |
| Media or press mention | [Role] | Screenshot or quote, customer identity, ticket history | [Time] |
| Accessibility complaint | [Role] | Nature of issue, applicable regulation if known | [Time] |
| Outage or critical bug | [Role] | Affected accounts, error details, reproduction steps | [Time] |

---

## Handoff note format

**Ticket:** [ID]
**Customer:** [Name / email]
**Issue summary:** [One sentence]
**Steps already taken:** [List]
**Why escalating:** [Trigger matched]
**Customer sentiment:** [Frustrated / Neutral / Urgent / Threatening]
**Requested by:** [Agent name]
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'customer-support-lead-escalation-playbook-scenario-1',
        title: 'Draft escalation rules for a legal threat',
        userInput:
          'A customer just emailed saying their lawyer will contact us if we don\'t respond within 48 hours. The ticket has been open 10 days. What should my tier-1 agent do right now?',
        expectedBehavior:
          'Claude should produce a clear escalation rule for legal-threat situations, including ' +
          'what tier-1 should do immediately (gather info, do not respond without approval, escalate now), ' +
          'the handoff note fields to complete, and who the ticket routes to. ' +
          'It should not advise the agent to make any commitments in response to the legal threat.',
        mustContain: ['lawyer', '48 hours', '10 days'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'customer-support-lead-escalation-playbook-scenario-2',
        title: 'Create a decision tree for repeated contact escalation',
        userInput:
          'I need a quick decision tree for agents to decide when to escalate a customer who keeps contacting us. The current rule of thumb is 3 or more contacts about the same issue.',
        expectedBehavior:
          'Claude should produce a concise decision tree with clear yes/no branches that an agent ' +
          'can follow in under 30 seconds. It should define what counts as "the same issue," ' +
          'what information to gather before escalating, and which tier receives the handoff. ' +
          'The tree should not require the agent to make a policy judgment without guidance.',
        mustContain: ['decision tree', '3 or more contacts', 'escalate'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 3. Angry Customer De-escalation ──────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-customer-support-lead-deescalation-v1',
    slug: 'customer-support-lead-deescalation',
    name: 'Angry Customer De-escalation',
    tagline: 'Draft calm, empathy-first replies to frustrated and angry customers',
    description:
      'Produce de-escalation replies that lead with genuine acknowledgment before any solution, ' +
      'stay within your refund authority, and offer one clear next step. ' +
      'Never matches the customer\'s frustration level or makes commitments beyond your authority.',
    role: 'Customer Support Lead',
    industry: 'Customer Support',
    tags: ['customer-support', 'de-escalation', 'empathy', 'angry-customers', 'cx'],
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

    instructionTemplate: `You are a customer support specialist at {{companyName}} helping to de-escalate an angry customer contact about {{productName}}.

Tone: {{tone}}. Lead every response with acknowledgment before moving to solutions. Never match the customer's frustration level.

Refund authority: {{refundAuthority}}. Do not promise any refund, credit, or compensation that exceeds this authority level without escalation approval.

Rules:
1. Open with a genuine acknowledgment that names the specific problem the customer described — not a generic "sorry for the inconvenience."
2. Avoid defensive language or explaining why the problem happened before the customer feels heard.
3. Offer one clear next step with a realistic timeframe. No vague "we'll look into it."
4. If the situation requires an exception or policy override, flag it for human review rather than making the promise yourself.
5. Never fabricate account details, order statuses, or resolution timelines you do not have confirmed information for.
6. Sensitive situations — legal threats, accessibility issues, data-privacy concerns — must be flagged for human review regardless of draft quality.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name as customers know it.',
        group: 'About your company',
      },
      {
        key: 'productName',
        label: 'Product or service name',
        type: 'text',
        required: true,
        helpText: 'The product or service the customer is contacting you about.',
        group: 'About your company',
      },
      {
        key: 'tone',
        label: 'De-escalation tone',
        type: 'select',
        options: [
          'Empathetic and warm',
          'Professional and calm',
          'Sincere and direct',
        ],
        default: 'Empathetic and warm',
        required: true,
        helpText: 'The emotional register your de-escalation replies should strike.',
        group: 'Communication style',
      },
      {
        key: 'refundAuthority',
        label: 'Agent refund authority',
        type: 'select',
        options: [
          'None — all refunds require manager approval',
          'Up to $50 without manager approval',
          'Up to $200 without manager approval',
          'Full refund authority up to 30 days',
        ],
        default: 'None — all refunds require manager approval',
        required: true,
        helpText:
          'The maximum refund or credit an agent can offer without escalation. ' +
          'Claude will stay within this limit in every draft reply.',
        group: 'Refund policy',
      },
    ],

    knowledgeFiles: [
      {
        name: 'De-escalation language bank',
        purpose:
          'Proven acknowledgment phrases, empathy openers, and de-escalation sentence starters. ' +
          'Claude draws on these to keep drafted replies human and calibrated — not scripted.',
        kind: 'starter',
        content: `# De-escalation language bank

## About this file
This is a curated bank of phrases for de-escalating angry or frustrated customers. Claude references these when drafting replies, adapting them to the specific situation rather than copying them verbatim.

---

## Acknowledgment openers (lead with these)

- "I completely understand why this is frustrating — [restate the specific problem]."
- "That is not the experience we want for you, and I am sorry this happened."
- "You are right to be concerned about [specific issue], and I want to make sure we address it."
- "I hear you. Waiting [X days] for a resolution is not acceptable, and I want to fix that now."
- "Thank you for telling me directly — I want to take ownership of this."

---

## Phrases that land badly (avoid these)

- "I understand your frustration" (generic — name the specific problem instead)
- "Unfortunately…" (leading with bad news before acknowledgment)
- "As per our policy…" (defensive, positions policy over the person)
- "I'm sorry you feel that way" (invalidates the emotion)
- "There's nothing I can do" (closes the door; always offer a next step or escalation)

---

## Transitioning to solutions

- "Here is what I can do for you right now: [action]."
- "The next step I am going to take is [specific action] — I will follow up by [timeframe]."
- "I cannot approve [X] on my own, but I am escalating this to [role] who can — you will hear back by [timeframe]."

---

## When refund authority is exceeded

- "I want to make sure this gets handled properly. I am looping in [manager/team] who can authorize the next step — I will make sure they have full context from our conversation."

---

## Closing phrases

- "I appreciate your patience while we sort this out."
- "You have been very patient, and I want to make sure the next step is clear: [action]."
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'customer-support-lead-deescalation-scenario-1',
        title: 'De-escalate a customer whose birthday gift arrived late',
        userInput:
          'A customer is furious — they ordered a gift for their daughter\'s birthday and it still hasn\'t arrived after 14 days. They say this is unacceptable and want a full refund immediately.',
        expectedBehavior:
          'Claude should draft a reply that opens with a specific acknowledgment of the delay and ' +
          'the missed occasion — not generic sympathy. It should propose a clear next step ' +
          '(investigate shipment, offer replacement, or escalate the refund depending on the stated authority level) ' +
          'without promising a full refund unless that is within the configured authority. ' +
          'The reply should not be defensive about the delay.',
        mustContain: ['birthday', '14 days', 'full refund'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'customer-support-lead-deescalation-scenario-2',
        title: 'De-escalate a customer who received the wrong item after a long hold',
        userInput:
          'Customer is extremely upset. They ordered a blue version of our product but received the red one. They say they have been on hold for 45 minutes and just want this fixed today.',
        expectedBehavior:
          'Claude should draft a reply that acknowledges both the wrong item and the 45-minute wait ' +
          'as compounding failures — not just one or the other. It should propose a specific ' +
          'resolution path (exchange, replacement shipment, or refund within authority) and commit ' +
          'to a follow-up timeframe. It should not minimize the wait or explain it away.',
        mustContain: ['blue version', 'red one', '45 minutes'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 4. Help Article Writer ────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-customer-support-lead-help-article-v1',
    slug: 'customer-support-lead-help-article',
    name: 'Help Article Writer',
    tagline: 'Turn a common support question into a polished help-center article',
    description:
      'Convert a recurring support question or topic into a structured help-center article ' +
      'matched to your audience\'s technical level. Every article covers the happy path, ' +
      'the most common failure, and ends with a "Need more help?" hook.',
    role: 'Customer Support Lead',
    industry: 'Customer Support',
    tags: ['customer-support', 'help-center', 'documentation', 'writing', 'knowledge-base'],
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

    instructionTemplate: `You are a technical writer for {{companyName}}'s help center, writing about {{productName}}.

Audience: {{audience}}. Match vocabulary and assumed knowledge to this audience exactly — no jargon with non-technical readers; no hand-holding with technical users.

Article format: {{articleFormat}}. Follow the format conventions for this type strictly.

Rules:
1. Open each article with a one-sentence summary of what it covers and who it is for.
2. Use numbered steps for procedural content; use bullet lists only for non-ordered items.
3. Every step must describe a single action — do not bundle two steps into one.
4. If a step requires a specific permission or setting, call it out in a note at the start of the article.
5. Do not fabricate feature names, UI labels, or product behavior. If you do not know the exact label, write [LABEL] as a placeholder and note that it needs verification.
6. End every article with a "Need more help?" section pointing readers to additional support.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name.',
        group: 'About your company',
      },
      {
        key: 'productName',
        label: 'Product or service name',
        type: 'text',
        required: true,
        helpText: 'The product this help article is about.',
        group: 'About your company',
      },
      {
        key: 'audience',
        label: 'Reader audience',
        type: 'select',
        options: [
          'Non-technical end users',
          'Moderately technical users',
          'Technical / developer audience',
        ],
        default: 'Non-technical end users',
        required: true,
        helpText:
          'Who will be reading this article. Affects vocabulary, assumed knowledge, and level of detail.',
        group: 'Article settings',
      },
      {
        key: 'articleFormat',
        label: 'Article format',
        type: 'select',
        options: [
          'Step-by-step guide',
          'FAQ format',
          'Troubleshooting guide',
          'Conceptual overview',
        ],
        default: 'Step-by-step guide',
        required: true,
        helpText: 'The structural format for the article.',
        group: 'Article settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Help article style guide',
        purpose:
          'Tone rules, structural conventions, and example articles for your help center. ' +
          'Claude uses this to keep every article consistent with your documentation standards.',
        kind: 'starter',
        content: `# Help article style guide

## About this file
These are the editorial standards for your help center. Edit to match your brand and product. Claude consults this whenever it drafts an article.

---

## Voice and tone
- Write in second person ("you," not "the user").
- Use active voice. "Click Save" not "The Save button should be clicked."
- Short sentences. Plain words. No jargon unless it is a feature name.
- One idea per sentence.

---

## Article structure

### Step-by-step guide
1. **Title** — verb phrase, e.g., "How to reset your password"
2. **One-sentence summary** — what the article covers and who it is for
3. **Prerequisites** — permissions, settings, or account types required (if any)
4. **Steps** — numbered, one action per step
5. **What to expect** — what happens after the last step
6. **Troubleshooting** — the two or three most common failure points
7. **Need more help?** — link to contact support

### FAQ format
1. **Title** — "Frequently asked questions about [topic]"
2. **Questions** — in bold, ordered from most to least common
3. **Answers** — 1–3 sentences each; link to a full article if more detail is needed
4. **Need more help?** — link to contact support

### Troubleshooting guide
1. **Title** — "Troubleshoot [problem]"
2. **One-sentence summary**
3. **Common causes** — bulleted list
4. **Solutions** — numbered steps per cause, clearly labeled
5. **When to contact support** — specific conditions, not "if the problem persists"

---

## What to avoid
- Screenshots with text (screen readers cannot parse them) — always add alt text or written steps.
- Phrases like "simply," "just," "obviously" — they frustrate users who are stuck.
- Vague next steps ("contact us") — always give a channel and expected response time.
- Product version-specific content mixed into a general article — use a version note at the top.

---

## Placeholder convention
Use [LABEL] for any UI element name you are not certain about. Add a note: "⚠️ Verify this label before publishing."
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'customer-support-lead-help-article-scenario-1',
        title: 'Write a help article about resetting a password',
        userInput:
          'We get dozens of tickets a week about resetting passwords. Can you write a help article that covers the standard reset flow and what to do if the reset email doesn\'t arrive?',
        expectedBehavior:
          'Claude should produce a structured help article in the configured format with a clear title, ' +
          'numbered steps for the standard reset flow, and a troubleshooting section covering the case ' +
          'where the reset email does not arrive (spam folder, wrong email address, resend option). ' +
          'It should end with a "Need more help?" section. It should not fabricate specific UI labels.',
        mustContain: ['resetting passwords', 'reset email', 'help article'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'customer-support-lead-help-article-scenario-2',
        title: 'Write an FAQ article about billing cycles',
        userInput:
          'Customers keep asking when they\'ll be charged and why their bill changes month to month. I need an FAQ article that answers these common billing questions.',
        expectedBehavior:
          'Claude should produce an FAQ-format article with clearly separated questions and concise answers. ' +
          'It should cover at minimum: when customers are charged, why amounts vary, how to view billing history, ' +
          'and what to do if a charge looks wrong. It should not fabricate billing dates or policy details ' +
          'that depend on company-specific settings.',
        mustContain: ['billing', 'FAQ', 'charged'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 5. CSAT Recovery Email ────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-customer-support-lead-csat-recovery-v1',
    slug: 'customer-support-lead-csat-recovery',
    name: 'CSAT Recovery Email',
    tagline: 'Write a personal, accountable recovery email after a low satisfaction score',
    description:
      'Draft a recovery email for a customer who gave a low CSAT score. ' +
      'Opens with the specific failure — not generic apology — takes clear accountability, ' +
      'names one concrete improvement action, and includes any authorized recovery offer last.',
    role: 'Customer Support Lead',
    industry: 'Customer Support',
    tags: ['customer-support', 'csat', 'recovery', 'email', 'cx'],
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

    instructionTemplate: `You are a customer support lead at {{companyName}} writing a CSAT recovery email for a customer who gave a low satisfaction score for {{productName}}.

Tone: {{tone}}. The email must feel personal and genuine — not a form letter.

{{#if recoveryOffer}}
Authorized recovery offer: {{recoveryOffer}}. Include this offer in the email naturally — acknowledgment and accountability always come before the offer.
{{/if}}

Rules:
1. Open by naming the specific interaction or issue the low score was about. Never use a generic "we noticed your recent experience."
2. Take clear accountability — do not deflect, minimize, or explain the problem away.
3. Describe one concrete action being taken to prevent the same problem from happening again.
4. Keep the email to three short paragraphs maximum — brevity shows respect for the customer's time.
5. Never promise a refund, credit, or specific timeline that has not been authorized. If no recovery offer is provided, do not hint that one is coming.
6. Do not include a survey link or satisfaction rating request in a recovery email.
7. Sensitive cases — accusations of discrimination, legal language, data complaints — must be flagged for human review before sending.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name as customers know it.',
        group: 'About your company',
      },
      {
        key: 'productName',
        label: 'Product or service name',
        type: 'text',
        required: true,
        helpText: 'The product or service the CSAT score relates to.',
        group: 'About your company',
      },
      {
        key: 'tone',
        label: 'Recovery email tone',
        type: 'select',
        options: [
          'Sincere and apologetic',
          'Professional and accountable',
          'Warm and personal',
        ],
        default: 'Sincere and apologetic',
        required: true,
        helpText: 'How the email should feel to the customer.',
        group: 'Communication style',
      },
      {
        key: 'recoveryOffer',
        label: 'Recovery offer (optional)',
        type: 'text',
        required: false,
        helpText:
          'Describe any authorized offer to include (e.g., "10% off next order," "one month free"). ' +
          'Leave blank if no offer is authorized — Claude will not hint at one.',
        group: 'Recovery offer',
      },
    ],

    knowledgeFiles: [
      {
        name: 'CSAT recovery email templates',
        purpose:
          'Starting-point templates for CSAT recovery emails by failure type. ' +
          'Claude adapts these to the specific situation rather than copying them directly.',
        kind: 'starter',
        content: `# CSAT recovery email templates

## About this file
These are reference templates for CSAT recovery emails. Edit the placeholders to match your company and situation. Claude uses these as structural guidance when drafting recovery emails.

---

## Template: Long response time

Subject: Following up on your recent support experience

Hi [Customer name],

I am reaching out because we saw your feedback after your recent contact with [Company] — and we owe you a better experience than you received. Waiting [X days] for a response when you needed help is not acceptable, and I am sorry that happened.

We have already [specific action taken to address the root cause — e.g., adjusted team coverage, added triage rules]. I wanted to make sure you heard that directly.

If there is anything still unresolved from your original question, please reply here and I will personally make sure it is taken care of.

[Name]
[Company] Customer Support

---

## Template: Agent interaction issue

Subject: Following up on your support experience

Hi [Customer name],

I wanted to reach out personally after seeing your feedback. The interaction you described does not reflect the standard we hold ourselves to, and I am sorry for that experience.

We have [specific action — e.g., followed up with the team, reviewed the interaction] to make sure this does not happen again.

Your experience matters to us. If you have any remaining questions or anything we can clear up, I am here.

[Name]
[Company] Customer Support

---

## Template: Issue left unresolved

Subject: Let us make this right

Hi [Customer name],

Thank you for taking the time to share your feedback. I saw that your issue was not resolved during your last contact, and I want to personally make sure that changes.

[Describe what you now know about their issue and what the next step is.]

[If an offer is authorized:] As a thank-you for your patience, [describe offer].

Please reply here and I will stay with this until it is sorted.

[Name]
[Company] Customer Support
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'customer-support-lead-csat-recovery-scenario-1',
        title: 'Write a recovery email after a long wait time complaint',
        userInput:
          'A customer gave us a 1-star CSAT after waiting 3 days for a response. They said \'no one got back to me and I had to figure it out myself.\' Write a recovery email.',
        expectedBehavior:
          'Claude should draft a three-paragraph recovery email that opens by naming the 3-day wait ' +
          'and the fact the customer had to solve it alone — not a generic apology. It should take ' +
          'accountability, mention one concrete internal action taken, and offer to help with anything ' +
          'remaining. It should not include a survey link or promise compensation that was not configured.',
        mustContain: ['1-star CSAT', '3 days', 'figure it out myself'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'customer-support-lead-csat-recovery-scenario-2',
        title: 'Write a recovery email after a rude agent complaint',
        userInput:
          'A customer gave a 2-star score and said the support agent was dismissive and unhelpful. We\'ve already spoken to the agent internally. Draft a recovery email to the customer.',
        expectedBehavior:
          'Claude should draft a recovery email that acknowledges the dismissive interaction specifically, ' +
          'takes ownership without naming or blaming the agent, and mentions that the team has followed up ' +
          'internally. It should keep the focus on the customer\'s experience and close with an offer to help ' +
          'with anything unresolved. It should not reveal internal personnel actions.',
        mustContain: ['2-star score', 'dismissive and unhelpful', 'recovery email'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 6. Ticket Summarizer ──────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-customer-support-lead-ticket-summarizer-v1',
    slug: 'customer-support-lead-ticket-summarizer',
    name: 'Ticket Summarizer',
    tagline: 'Compress any support ticket into a tight summary and clear next step',
    description:
      'Paste a ticket thread and get a concise, factual summary in your preferred format — ' +
      'prose, bullets, or structured fields. Every summary ends with the single most important ' +
      'next action, the responsible party, and any deadline to flag.',
    role: 'Customer Support Lead',
    industry: 'Customer Support',
    tags: ['customer-support', 'tickets', 'summarization', 'handoff', 'triage'],
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

    instructionTemplate: `You are a support specialist at {{companyName}} summarizing support tickets for internal handoffs and records.

Summary format: {{summaryFormat}}. Use this format for every summary — do not mix formats.

{{#if includeNextStep}}
Always end the summary with a clearly labeled "Next step:" line stating the single most important action required, the responsible party, and any deadline or SLA constraint.
{{/if}}

Rules:
1. Capture: the customer's core issue in one sentence, the steps already taken by agents, the current status, and any customer sentiment worth flagging.
2. Do not editorialize — report what happened, not a judgment on how it was handled.
3. Omit filler and repetition. If the same thing was said three times in a thread, mention it once.
4. Use plain language — avoid internal code names or system references the next agent may not recognize.
5. Never include performance commentary about an agent in a summary that may be shared externally.
6. Sensitive details — personal data, financial specifics, legal language — should be noted as present but not reproduced in full in a summary.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name.',
        group: 'About your company',
      },
      {
        key: 'summaryFormat',
        label: 'Summary format',
        type: 'select',
        options: [
          'One-paragraph prose',
          'Bullet points',
          'Structured fields (Issue / Actions Taken / Next Step)',
        ],
        default: 'Structured fields (Issue / Actions Taken / Next Step)',
        required: true,
        helpText: 'The format Claude will use for every ticket summary.',
        group: 'Format',
      },
      {
        key: 'includeNextStep',
        label: 'Always include a next step',
        type: 'boolean',
        default: true,
        required: false,
        helpText:
          'When on, every summary ends with a labeled "Next step:" line naming the action, ' +
          'owner, and any deadline.',
        group: 'Format',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Ticket summary format card',
        purpose:
          'The standard field names, section labels, and length guidelines for your ticket summaries. ' +
          'Claude uses this to keep every summary consistent across your team.',
        kind: 'starter',
        content: `# Ticket summary format card

## About this file
This card defines the fields, labels, and length standards your team uses for ticket summaries. Edit to match your internal conventions. Claude references this when summarizing tickets.

---

## Format: One-paragraph prose
- One paragraph, 3–5 sentences.
- Order: issue → steps taken → current status → sentiment flag (if notable) → next step.
- Example: "Customer reported a double charge on [date]. Agent confirmed the charge in the billing system and determined it resulted from a plan upgrade mid-cycle. Customer was frustrated but accepted the explanation after it was clarified. Ticket closed. No further action required."

---

## Format: Bullet points
- **Issue:** [One sentence — what the customer reported]
- **Steps taken:** [Bulleted list of agent actions]
- **Current status:** [Open / Escalated / Resolved / Waiting on customer]
- **Sentiment:** [Frustrated / Neutral / Satisfied / Threatening]
- **Next step:** [Action | Owner | Deadline]

---

## Format: Structured fields
| Field | Content |
|-------|---------|
| Issue | [One sentence] |
| Customer | [Name / email if relevant] |
| Contacts | [Number of customer contacts on this issue] |
| Steps taken | [Agent actions, one per row] |
| Status | [Open / Escalated / Resolved / Waiting on customer] |
| Sentiment | [Frustrated / Neutral / Satisfied / Threatening] |
| Next step | [Action — Owner — Deadline] |

---

## Length guidelines
- Prose: 3–5 sentences maximum.
- Bullets: no more than 5 bullet points per section.
- Structured fields: one row per action in "Steps taken"; cap at 5 rows.

---

## What summaries are NOT for
- Performance assessments of individual agents.
- Reproducing full customer quotes (paraphrase or note that sensitive content exists).
- Internal investigation notes (keep those in a separate internal field).
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'customer-support-lead-ticket-summarizer-scenario-1',
        title: 'Summarize a multi-day billing dispute ticket',
        userInput:
          'Summarize this ticket: Customer contacted us on Monday about a double charge. Agent A asked for account details. Customer replied Tuesday. Agent B investigated Wednesday and found the charge was valid — a plan upgrade triggered a prorated charge. Customer was confused but accepted the explanation. Ticket closed Thursday.',
        expectedBehavior:
          'Claude should produce a clean summary in the configured format that captures the core issue ' +
          '(double charge concern), the investigation finding (valid prorated charge from plan upgrade), ' +
          'and the resolution (customer accepted explanation, closed Thursday). ' +
          'It should omit the day-by-day thread structure and condense it to facts. ' +
          'If next-step mode is on, it should note no further action is required.',
        mustContain: ['double charge', 'prorated charge', 'plan upgrade'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'customer-support-lead-ticket-summarizer-scenario-2',
        title: 'Summarize a ticket escalated to engineering for handoff',
        userInput:
          'Summarize for handoff: Customer reported that the export feature stopped working 5 days ago. Agent tried three workarounds — none worked. Issue escalated to engineering yesterday. Engineering confirmed a bug affecting accounts created before 2024. Fix estimated in 2 days.',
        expectedBehavior:
          'Claude should produce a summary that clearly identifies the issue (export feature broken), ' +
          'the steps taken (three failed workarounds, escalation), the current status (engineering confirmed ' +
          'bug in pre-2024 accounts, fix in 2 days), and a next step flagging when engineering\'s fix is due ' +
          'and that the customer needs a proactive update. It should be concise enough for a fast handoff read.',
        mustContain: ['export feature', 'escalated to engineering', 'bug affecting accounts'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 7. SOP Writer ─────────────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-customer-support-lead-sop-writer-v1',
    slug: 'customer-support-lead-sop-writer',
    name: 'SOP Writer',
    tagline: 'Draft a support standard-operating-procedure from a topic and audience',
    description:
      'Produce a complete, stand-alone support SOP from a topic description and audience level. ' +
      'Covers purpose, scope, prerequisites, numbered steps, exception handling, and related resources. ' +
      'Marks any detail that needs policy verification before publishing.',
    role: 'Customer Support Lead',
    industry: 'Customer Support',
    tags: ['customer-support', 'sop', 'documentation', 'operations', 'training'],
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

    instructionTemplate: `You are a support operations writer at {{companyName}} creating a standard operating procedure (SOP).

SOP topic: {{sopTopic}}.

Audience: {{audience}}. Calibrate assumed knowledge and level of detail to this audience — new agents need every step spelled out; experienced agents need precision and brevity over hand-holding.

{{#if approvalRequired}}
This SOP requires manager or compliance sign-off before publication. End the document with an "Approval" section containing fields for: approver name, role, date, and signature line.
{{/if}}

Structure every SOP in this order:
1. Purpose — one sentence stating why this SOP exists.
2. Scope — who this applies to and what it covers.
3. Prerequisites — permissions, tools, or account types required.
4. Procedure — numbered steps, one action per step.
5. Exception handling — edge cases and what to do when the standard steps do not apply.
6. Related resources — links or file references.

Rules:
1. Each procedural step is a single action. Use numbered lists. Do not group steps.
2. Mark any step requiring a system permission with a note: [Requires: permission name].
3. Do not fabricate policy details, tool names, or approval thresholds. Use [CONFIRM] for anything that needs verification before the SOP is published.
4. The finished SOP must be usable on its own — assume the reader has no prior context.
5. Exception handling must be its own section — never buried in the main steps.
6. Sensitive processes involving customer data or financial actions must include a note about who has authority to perform each step.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name.',
        group: 'About your company',
      },
      {
        key: 'sopTopic',
        label: 'SOP topic',
        type: 'text',
        required: true,
        helpText:
          'The process this SOP covers (e.g., "Handling refund requests," "Onboarding new support agents," ' +
          '"Processing account deletions").',
        group: 'SOP details',
      },
      {
        key: 'audience',
        label: 'Intended audience',
        type: 'select',
        options: [
          'New support agents (first 30 days)',
          'Experienced agents',
          'Team leads and managers',
        ],
        default: 'New support agents (first 30 days)',
        required: true,
        helpText:
          'Who will be following this SOP. Affects the level of detail and assumed knowledge.',
        group: 'SOP details',
      },
      {
        key: 'approvalRequired',
        label: 'Requires sign-off before publishing',
        type: 'boolean',
        default: false,
        required: false,
        helpText:
          'Turn on if this SOP needs manager or compliance approval before it goes live. ' +
          'Claude will add an Approval section to the end of the document.',
        group: 'SOP details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'SOP template',
        purpose:
          'A fillable SOP skeleton with section labels, formatting conventions, and example steps. ' +
          'Claude uses this as the structural starting point for every SOP it drafts.',
        kind: 'starter',
        content: `# Support SOP template

## About this file
This template defines the standard structure and formatting conventions for support SOPs at your company. Edit the guidelines below to match your team's practices. Claude follows this structure when drafting any SOP.

---

## Standard SOP structure

### 1. Purpose
One sentence: why this SOP exists and what problem it prevents.
Example: "This SOP ensures all refund requests are processed consistently and within policy."

### 2. Scope
- Who this applies to: [role(s)]
- What it covers: [scenarios included]
- What it does NOT cover: [explicitly excluded scenarios]

### 3. Prerequisites
List everything the agent must have before starting:
- [ ] [Permission or system access]
- [ ] [Tool or account]
- [ ] [Training or certification, if applicable]

### 4. Procedure
Numbered steps. One action per step. Use [Requires: permission] notes where applicable.

1. [Action]
2. [Action]
3. [Action] [Requires: billing system access]

### 5. Exception handling
| Situation | What to do |
|-----------|------------|
| [Edge case 1] | [Action] |
| [Edge case 2] | [Escalate to: role] |
| [Situation requiring policy input] | [CONFIRM with: manager] |

### 6. Related resources
- [Link or file name: description]
- [Link or file name: description]

---

## Formatting conventions
- Use numbered lists for procedures; bullet lists for prerequisites and resources.
- Bold key terms on first use.
- Use [CONFIRM] for anything unverified. Do not publish an SOP with unresolved [CONFIRM] placeholders.
- Use [Requires: X] to mark permission-gated steps.

---

## Approval section (include when sign-off is required)

| Field | Value |
|-------|-------|
| Approver name | |
| Role | |
| Date approved | |
| Signature | |
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'customer-support-lead-sop-writer-scenario-1',
        title: 'Write a refund processing SOP for new agents',
        userInput:
          'Write an SOP for how new agents should handle refund requests. We have a 30-day refund window, refunds over $200 need manager approval, and all refunds go through our billing system called Stripe.',
        expectedBehavior:
          'Claude should produce a complete SOP with all six sections. The procedure steps should ' +
          'be granular enough for a first-week agent, including the Stripe system step with a ' +
          '[Requires: Stripe access] note. The exception handling section should cover refunds over $200 ' +
          'and requests outside the 30-day window. It should not fabricate Stripe UI details it does not know.',
        mustContain: ['refund requests', '30-day refund window', 'manager approval'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'customer-support-lead-sop-writer-scenario-2',
        title: 'Write a ticket triage SOP for experienced agents',
        userInput:
          'I need an SOP for how experienced agents should triage incoming tickets. Priority levels are P1 (outage/data loss), P2 (broken core feature), P3 (billing), P4 (general question). Response SLAs are 1h, 4h, 8h, 24h respectively.',
        expectedBehavior:
          'Claude should produce a triage SOP written for experienced agents — concise, with a clear ' +
          'priority classification table, the four SLA targets, and numbered triage steps. ' +
          'The exception section should cover ambiguous cases (e.g., when a ticket could be P1 or P2) ' +
          'and give a concrete decision rule rather than "use your judgment."',
        mustContain: ['triage', 'P1', 'outage', 'response SLAs'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 8. Refund & Policy Response ───────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-customer-support-lead-policy-response-v1',
    slug: 'customer-support-lead-policy-response',
    name: 'Refund & Policy Response',
    tagline: 'Draft a policy-grounded refund response that is empathetic but consistent',
    description:
      'Produce a customer-facing response to a refund or policy question, grounded in the ' +
      'policy you paste in. Responses confirm what is possible, explain what is not (without blame), ' +
      'and offer the next-best alternative when a request falls outside policy.',
    role: 'Customer Support Lead',
    industry: 'Customer Support',
    tags: ['customer-support', 'refunds', 'policy', 'billing', 'cx'],
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

    instructionTemplate: `You are a support specialist at {{companyName}} drafting a response to a refund or policy question about {{productName}}.

Tone: {{tone}}. Apply this tone consistently — the customer may be disappointed, so lead with empathy before explaining the policy.

Refund and return policy:
{{refundPolicy}}

Rules:
1. Ground every response in the policy above. Do not invent exceptions, extend time windows, or imply flexibility that is not stated.
2. If the request falls within policy, confirm the action clearly and state what the customer can expect next (timeline, method).
3. If the request falls outside policy, explain why without blame and offer the next-best alternative if one exists.
4. Never promise a refund or exception that requires manager approval unless it has already been authorized. If escalation is needed, say so without committing to an outcome.
5. Sensitive cases — financial hardship claims, medical or legal exceptions — must be flagged for human review before any commitment is made.
6. Never fabricate account details, transaction records, or policy terms not present in the policy text above.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name.',
        group: 'About your company',
      },
      {
        key: 'productName',
        label: 'Product or service name',
        type: 'text',
        required: true,
        helpText: 'The product or service the refund or policy question relates to.',
        group: 'About your company',
      },
      {
        key: 'refundPolicy',
        label: 'Refund and return policy',
        type: 'multiline',
        required: true,
        helpText:
          'Paste or describe your refund and return policy, including time windows, ' +
          'exceptions, non-refundable items, and any approval thresholds. Claude will stay strictly within this.',
        group: 'Policy',
      },
      {
        key: 'tone',
        label: 'Response tone',
        type: 'select',
        options: [
          'Empathetic and firm',
          'Professional and neutral',
          'Warm but consistent',
        ],
        default: 'Empathetic and firm',
        required: true,
        helpText: 'How the response should feel — empathetic and clear, not cold or mechanical.',
        group: 'Communication style',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Refund policy reference card',
        purpose:
          'A fillable summary of your refund policy, common edge cases, and approved alternatives. ' +
          'Claude checks this to keep every policy response accurate and consistent.',
        kind: 'starter',
        content: `# Refund policy reference card

## About this file
Complete the sections below with your actual refund and return policy. Claude uses this card as the authoritative policy source when drafting responses. Keep it updated whenever your policy changes.

---

## Standard refund window
- **Duration:** [e.g., 30 days from purchase date]
- **Eligibility:** [e.g., unused items in original condition; digital downloads excluded]
- **Method:** [e.g., original payment method; processing time 5–10 business days]

---

## Non-refundable items or conditions
- [e.g., Digital downloads once download link is clicked]
- [e.g., Subscription months already used]
- [e.g., Customized or personalized items]

---

## Exceptions that require manager approval
- [e.g., Refund requests outside the standard window]
- [e.g., Refunds over $[amount]]
- [e.g., Partial refunds on subscription plans]

---

## Approved alternatives when outside policy
- [e.g., Store credit for out-of-window requests]
- [e.g., Exchange instead of refund for non-refundable items]
- [e.g., Offer a free extension instead of a subscription refund]

---

## Edge cases to flag for human review
- Customer cites medical, financial hardship, or legal reasons
- Customer threatens a chargeback or bank dispute
- Request involves an amount above $[threshold]
- Customer is a high-value or enterprise account

---

## Response templates (fill in before using)

### Request within policy
"Thank you for reaching out. I have confirmed your [purchase/subscription] is within our [X]-day return window. I have [initiated your refund / started the return process], and you should see the [amount] back on your [payment method] within [X] business days."

### Request outside policy
"Thank you for letting me know. I have reviewed your account and your [purchase/request] falls outside our standard [X]-day refund window. I am sorry I cannot process this as a refund, but [alternative option if available]. If you would like to discuss this further, I can connect you with [manager/team]."
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'customer-support-lead-policy-response-scenario-1',
        title: 'Respond to a refund request just outside the policy window',
        userInput:
          'A customer is asking for a refund on a purchase made 45 days ago. Our policy is a 30-day window. They say they didn\'t realize they had a 30-day limit and the product stopped working last week.',
        expectedBehavior:
          'Claude should draft a response that acknowledges the customer\'s situation with empathy, ' +
          'clearly explains that the request is outside the 30-day policy window without sounding dismissive, ' +
          'and offers the best available alternative (store credit, exchange, or escalation to a manager ' +
          'if an exception may be warranted given the product failure). ' +
          'It should not promise an exception without flagging that escalation is needed.',
        mustContain: ['45 days', '30-day', 'product stopped working'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'customer-support-lead-policy-response-scenario-2',
        title: 'Respond to a refund request for a non-refundable digital download',
        userInput:
          'Customer wants a refund for a digital download they purchased. Our policy says digital downloads are non-refundable once the download link is clicked. The customer says they clicked by accident and never viewed the content.',
        expectedBehavior:
          'Claude should draft a response that explains the non-refundable policy for digital downloads ' +
          'after the link has been clicked, acknowledges that the customer\'s situation sounds unintentional, ' +
          'and offers a genuine alternative (e.g., account credit, exchange, or escalation for an exception). ' +
          'It should not fabricate a "viewing verification" capability the company may not have.',
        mustContain: ['digital download', 'non-refundable', 'download link'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 9. QA Review Rubric ───────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-customer-support-lead-qa-rubric-v1',
    slug: 'customer-support-lead-qa-rubric',
    name: 'QA Review Rubric',
    tagline: 'Build or apply a ticket-QA scoring rubric that all reviewers use consistently',
    description:
      'Generate a support ticket QA rubric for the dimensions and scoring scale you choose, ' +
      'with clear criteria, score-level definitions, and example passes and fails. ' +
      'Also applies the rubric to a real ticket and returns a score with cited evidence and a coaching note.',
    role: 'Customer Support Lead',
    industry: 'Customer Support',
    tags: ['customer-support', 'qa', 'quality', 'coaching', 'rubric'],
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

    instructionTemplate: `You are a support quality assurance lead at {{companyName}} building or applying a ticket QA scoring rubric.

Scoring scale: {{scoringScale}}.

Dimensions to evaluate: {{dimensions}}.

When building a rubric:
1. For each dimension, write a one-sentence definition, the criteria for each score level, and one example of a top score and a failing score.
2. Include an overall scoring guide showing what total score ranges mean (e.g., "meets standards," "needs coaching," "performance concern").
3. Flag any dimension where scoring requires a judgment call — document what to do when reviewers disagree.

When applying the rubric to a ticket:
1. Score each dimension independently before arriving at the total.
2. Cite specific phrases or actions from the ticket as evidence for each score — no unsupported scores.
3. End with a coaching note: one specific strength and one specific improvement, phrased constructively.

Safety rules:
1. Never include the agent's name or personally identifying information in a rubric output that may be shared outside the QA team.
2. Coaching language must be constructive — describe the behavior, not the person.
3. Do not fabricate quotes or ticket content that was not provided.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name.',
        group: 'About your company',
      },
      {
        key: 'scoringScale',
        label: 'Scoring scale',
        type: 'select',
        options: [
          '1–5 (numeric)',
          '0–10 (numeric)',
          'Pass / Needs Improvement / Fail',
          'Yes / No per dimension',
        ],
        default: '1–5 (numeric)',
        required: true,
        helpText: 'The scale your QA reviewers will use to score each dimension.',
        group: 'Rubric settings',
      },
      {
        key: 'dimensions',
        label: 'Dimensions to evaluate',
        type: 'multiselect',
        options: [
          'Tone and empathy',
          'Accuracy of information',
          'Policy compliance',
          'First-contact resolution',
          'Grammar and clarity',
          'Response time adherence',
          'Escalation handling',
          'Customer effort score',
        ],
        required: true,
        helpText: 'Select the dimensions your rubric should score. Choose 3–6 for best usability.',
        group: 'Rubric settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'QA rubric template',
        purpose:
          'A fillable rubric template with dimension definitions, score-level criteria, and calibration notes. ' +
          'Claude uses this as the structural foundation for every rubric it builds or updates.',
        kind: 'starter',
        content: `# QA rubric template

## About this file
This template defines the structure for your support ticket QA rubric. Edit the dimension definitions and score criteria to match your team's standards. Claude references this when building or applying a rubric.

---

## Rubric structure

### Dimension block (one per dimension)

**[Dimension name]**
Definition: [One sentence — what this dimension measures]

| Score | Criteria |
|-------|----------|
| [Top score] | [Clear, specific description of what earns this score] |
| [Middle score] | [Partial or inconsistent performance] |
| [Bottom score] | [Missing or significantly below standard] |

Example — top score: "[Specific agent behavior that earns the top score]"
Example — failing score: "[Specific agent behavior that fails this dimension]"

Calibration note: [What to do when reviewers disagree on this dimension]

---

## Overall scoring guide (1–5 numeric example)

| Total score range | Meaning |
|-------------------|---------|
| [X–Y] | Meets or exceeds standards |
| [A–B] | Developing — coaching recommended |
| [C–D] | Needs improvement — action plan required |

---

## Coaching note format

After scoring, provide:
1. **Strength:** "[Specific behavior the agent did well]"
2. **Improvement:** "[Specific behavior to change, with an example of what to do differently]"

Guidelines:
- Describe the behavior, not the person ("The response opened with policy language" not "You were cold").
- Be specific — "the empathy opener was missing" is more useful than "could be more empathetic."
- Keep each item to one sentence.

---

## Calibration rules

- Score each dimension before calculating the total — avoid anchoring on the overall impression.
- If a dimension is not applicable (e.g., escalation handling on a ticket that was not escalated), mark it N/A and exclude from the total.
- Any score of [bottom score] on a safety-critical dimension (policy compliance, escalation handling) triggers a mandatory supervisor review regardless of the total score.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'customer-support-lead-qa-rubric-scenario-1',
        title: 'Build a rubric section for tone and empathy',
        userInput:
          'Can you create a QA rubric section specifically for tone and empathy? I need clear criteria for scoring on a 1-5 scale so my QA reviewers all evaluate this the same way.',
        expectedBehavior:
          'Claude should produce a complete rubric section for the tone and empathy dimension, ' +
          'with a one-sentence definition, criteria for each of the five score levels, a top-score ' +
          'and failing-score example, and a calibration note for when reviewers disagree. ' +
          'The criteria should be specific enough that two different reviewers would arrive at the same score ' +
          'for the same ticket.',
        mustContain: ['tone and empathy', '1-5 scale', 'QA rubric'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'customer-support-lead-qa-rubric-scenario-2',
        title: 'Apply the rubric to a real ticket interaction',
        userInput:
          'Score this ticket against our rubric. The agent replied to a frustrated customer by saying \'that\'s not something we can do\' without any empathy or alternative offered. The response took 6 hours and the policy information given was correct.',
        expectedBehavior:
          'Claude should score each configured dimension independently, citing the agent\'s quoted phrase ' +
          'and the 6-hour response time as evidence. Tone and empathy should score low; ' +
          'accuracy of information should score high. The coaching note should identify the empathy failure ' +
          'specifically ("the response led with a flat refusal before acknowledging the customer\'s frustration") ' +
          'and the information accuracy as a genuine strength.',
        mustContain: ['that\'s not something we can do', '6 hours', 'empathy'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 10. Voice-of-Customer Summary ─────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-customer-support-lead-voc-summary-v1',
    slug: 'customer-support-lead-voc-summary',
    name: 'Voice-of-Customer Summary',
    tagline: 'Identify recurring themes from a batch of customer feedback in your chosen format',
    description:
      'Paste a batch of CSAT comments, ticket notes, or survey responses and get a structured ' +
      'Voice-of-Customer summary with top themes, approximate frequencies, and representative quotes. ' +
      'Facts and interpretation are kept separate; compliance flags are surfaced for human review.',
    role: 'Customer Support Lead',
    industry: 'Customer Support',
    tags: ['customer-support', 'voc', 'insights', 'feedback', 'research'],
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

    instructionTemplate: `You are a customer insights analyst at {{companyName}} synthesizing voice-of-customer (VoC) feedback about {{productName}}.

Feedback period: {{feedbackPeriod}}.

Output format: {{outputFormat}}. Follow this format exactly for every summary you produce.

Rules:
1. Identify the top recurring themes — problems, praises, and feature requests that appear across multiple pieces of feedback.
2. For each theme, note its approximate frequency (e.g., "mentioned in roughly 30% of responses reviewed").
3. Quote directly from feedback when the phrasing is vivid or representative — use exact customer language, not paraphrases.
4. Separate facts (what customers said) from interpretation (what it might mean for the business). Label interpretations clearly as "Interpretation:".
5. Do not fabricate themes, frequencies, or quotes. If the feedback batch is too small to identify a reliable pattern, say so explicitly.
6. Flag any feedback that surfaces a potential legal, safety, or compliance concern for human follow-up.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Your company name.',
        group: 'About your company',
      },
      {
        key: 'productName',
        label: 'Product or service name',
        type: 'text',
        required: true,
        helpText: 'The product or service this feedback is about.',
        group: 'About your company',
      },
      {
        key: 'feedbackPeriod',
        label: 'Feedback period',
        type: 'text',
        required: true,
        helpText: 'The time window this feedback covers (e.g., "Q2 2025," "Last 30 days," "June 2025").',
        group: 'Feedback details',
      },
      {
        key: 'outputFormat',
        label: 'Output format',
        type: 'select',
        options: [
          'Executive summary (3–5 bullets)',
          'Full themes report with sub-themes',
          'Stakeholder slide notes',
        ],
        default: 'Executive summary (3–5 bullets)',
        required: true,
        helpText: 'How the VoC summary should be structured.',
        group: 'Feedback details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'VoC summary template',
        purpose:
          'A fillable template for VoC summaries with section labels, format conventions, and example outputs. ' +
          'Claude uses this to keep every VoC report consistent and ready to share with stakeholders.',
        kind: 'starter',
        content: `# Voice-of-customer summary template

## About this file
This template defines the structure and conventions for VoC summaries at your company. Edit the format guidelines and example sections to match how your team presents feedback to stakeholders.

---

## Format: Executive summary (3–5 bullets)

**VoC Summary — [Product name] — [Period]**

Feedback reviewed: [N] responses (CSAT comments / ticket notes / survey responses)

Key themes:
- **[Theme 1]:** [One sentence — what customers said and how often]. Representative quote: "[exact quote]"
- **[Theme 2]:** ...
- **[Theme 3]:** ...

Flags for follow-up: [Any compliance, legal, or safety concerns noted]

---

## Format: Full themes report

**VoC Report — [Product name] — [Period]**
Prepared by: [Name / team]
Feedback reviewed: [N] responses

---

### Theme 1: [Theme name]
**Frequency:** Mentioned in approximately [X]% of responses.
**What customers said:** [2–3 sentence summary of the pattern]
**Representative quotes:**
- "[Exact quote 1]"
- "[Exact quote 2]"
**Interpretation:** [What this pattern might mean for the product or team — label clearly]

---

### Theme 2: [Theme name]
[Same structure]

---

### Positive themes
[List themes where customers expressed satisfaction]

### Feature requests
[List recurring feature asks with frequency]

### Flags for human review
[Any legal, safety, or compliance signals in the feedback]

---

## Format: Stakeholder slide notes

**Slide: VoC Highlights — [Product name] — [Period]**

**Headline:** [One sentence capturing the dominant signal]

**Supporting points (3 max):**
- [Point 1 with data: "X% of respondents mentioned Y"]
- [Point 2]
- [Point 3]

**One representative quote to display:** "[Exact customer quote]"

**Recommended action:** [One sentence — what stakeholders should do with this information]

**Source:** [N] customer responses, [period], reviewed [date]

---

## VoC review checklist
- [ ] Themes are supported by multiple data points, not single responses.
- [ ] Quotes are exact — no paraphrasing.
- [ ] Facts and interpretations are clearly separated.
- [ ] Any compliance or legal flags are called out separately.
- [ ] Sample size is disclosed — do not report patterns from fewer than 5 data points without a caveat.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'customer-support-lead-voc-summary-scenario-1',
        title: 'Summarize themes from a batch of CSAT comments',
        userInput:
          'Here are 10 CSAT comments from last month: \'too slow to respond\', \'agent was rude\', \'great help once I got through\', \'waited 3 days for nothing\', \'fastest support I\'ve had\', \'the chat bot is useless\', \'finally someone who knew what they were doing\', \'kept getting transferred\', \'issue still not resolved after a week\', \'really impressed with the agent\'. Summarize the themes.',
        expectedBehavior:
          'Claude should identify the main themes across the 10 comments: response time complaints, ' +
          'positive agent quality experiences, chatbot dissatisfaction, and transfer/routing friction. ' +
          'It should quote customers directly, note approximate frequency per theme, and separate ' +
          'the factual pattern from any interpretation. It should acknowledge the small sample size ' +
          'and not over-generalize.',
        mustContain: ['too slow to respond', 'agent was rude', 'chat bot is useless'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'customer-support-lead-voc-summary-scenario-2',
        title: 'Prepare stakeholder slide notes from quarterly feedback themes',
        userInput:
          'I need to present VoC themes from this quarter\'s support tickets to the product team. The main complaints are around the slow loading of the dashboard, confusing pricing tiers, and missing bulk action features. There are also positive comments about the onboarding flow. Format it as stakeholder slide notes.',
        expectedBehavior:
          'Claude should produce stakeholder slide notes in the configured format with a headline, ' +
          'three supporting points covering the three complaint themes (dashboard loading, pricing clarity, ' +
          'bulk actions) and the onboarding positive, a recommended action for the product team, ' +
          'and a source attribution. It should distinguish facts from interpretation and not promise ' +
          'specific percentages if the input does not provide them.',
        mustContain: ['slow loading', 'pricing tiers', 'bulk action features'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },
];
