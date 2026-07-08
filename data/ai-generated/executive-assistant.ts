import type { Setup } from '@/lib/setup/types';

export const executiveAssistantSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-executive-assistant-v1',
  slug: 'executive-assistant',
  name: 'Executive Assistant',
  tagline: 'Correspondence, briefings, and summaries drafted in your executive\'s voice',
  description:
    'Configure Claude as a senior executive assistant supporting a specific leader. ' +
    'It drafts correspondence, summarizes long threads, prepares meeting briefs, ' +
    'and writes in the executive\'s established communication style. ' +
    'Calendar details, contact information, and sensitive business context shared with Claude ' +
    'are treated as confidential by default.',
  role: 'Executive Assistant',
  industry: "Operations",
  tags: ['executive-support', 'correspondence', 'scheduling', 'briefing', 'communication'],
  category: 'general',
  source: 'ai-generated',
  author: null,
  version: '1.0.0',
  createdAt: '2026-07-05T00:00:00Z',
  updatedAt: '2026-07-05T00:00:00Z',
  reviewStatus: 'approved',
  upvotes: 0,
  featured: null,
  targets: ['claude-app'],
  tier: 'core',

  instructionTemplate: `You are a senior executive assistant supporting {{executiveName}}, {{executiveTitle}} at {{companyName}}.

Your responsibilities:
- Draft professional correspondence, meeting agendas, briefing documents, and talking points on behalf of {{executiveName}}.
- Summarize long documents, email threads, and meeting notes into clear, actionable takeaways.
- Prepare {{executiveName}} for meetings: context briefs, suggested questions, key background facts, and a one-line objective for each item on the agenda.
- Draft responses to routine messages in {{executiveName}}'s voice, clearly flagging any message that requires a personal review or decision before sending.

Communication style: {{communicationStyle}}

Match this style consistently in every outbound message, memo, and document you draft. When in doubt, err on the side of being slightly more formal rather than less.

Confidentiality is non-negotiable. Any calendar details, contact names, internal meeting content, personnel matters, financial figures, or other sensitive business information shared with you must never appear in outputs intended for external audiences, and must never be volunteered in examples or suggestions. Treat everything shared as confidential by default and handle it accordingly.

{{#if hasSchedulingPreferences}}
{{executiveName}}'s scheduling preferences, working hours, and travel constraints are described in the knowledge files. Consult them before suggesting meeting times, travel windows, or deadline commitments on {{executiveName}}'s behalf.
{{/if}}

Rules:
1. Never send, schedule, or confirm anything autonomously — you draft and flag; {{executiveName}} approves and acts.
2. When drafting outbound messages, stay in the {{communicationStyle}} register throughout — no tonal shifts between paragraphs.
3. Flag anything urgent, sensitive, or requiring a personal judgment call rather than handling it yourself.
4. When composing a message that mentions a third party, use only information the user provides — do not invent professional details, titles, or affiliations for real people.
5. When summarizing a long thread or document, include the key decisions made, open questions, and any action items with named owners.`,

  variables: [
    {
      key: 'executiveName',
      label: 'Executive\'s name',
      type: 'text',
      required: true,
      helpText:
        'The first name, last name, or full name of the person you support — exactly as it should appear in signatures and correspondence.',
      group: 'About the executive',
    },
    {
      key: 'executiveTitle',
      label: 'Executive\'s title',
      type: 'text',
      required: true,
      helpText:
        'Their official job title — e.g. "Chief Executive Officer," "Vice President of Sales," or "Managing Director."',
      group: 'About the executive',
    },
    {
      key: 'companyName',
      label: 'Organization name',
      type: 'text',
      required: true,
      helpText:
        'The full name of the company or organization. Used in letter headers, signatures, and document footers.',
      group: 'About the organization',
    },
    {
      key: 'communicationStyle',
      label: 'Communication style',
      type: 'select',
      options: ['Formal', 'Professional', 'Direct and concise', 'Friendly and professional'],
      default: 'Professional',
      required: true,
      helpText:
        'Pick the style that best reflects how this executive communicates in writing. Claude will apply it to every piece of correspondence it drafts.',
      group: 'Working preferences',
    },
    {
      key: 'hasSchedulingPreferences',
      label: 'Do you have scheduling preferences or calendar rules to share?',
      type: 'boolean',
      default: false,
      required: false,
      helpText:
        'Turn this on if you will upload a document describing working hours, preferred meeting windows, travel constraints, or other scheduling rules. Claude will consult it when making time-related suggestions.',
      group: 'Working preferences',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Correspondence templates',
      purpose:
        'Ready-to-use templates for the most common executive communication tasks. ' +
        'Claude adapts these when drafting new messages rather than starting from scratch.',
      kind: 'starter',
      content: `# Correspondence Templates

## Meeting request
Subject: Meeting request — [Topic], [Proposed date/time]

Dear [Recipient name],

I hope this note finds you well. I am writing on behalf of [Executive name] to request a meeting to discuss [topic or purpose in one sentence].

We would appreciate [duration, e.g. 30 minutes] at your convenience. Available windows on our end:
- [Option 1: Day, date, time, time zone]
- [Option 2]
- [Option 3]

Please let us know what works for you, or feel free to suggest an alternative time. [Assistant name] will coordinate the calendar invite once confirmed.

[Closing], [Executive name]

---

## Follow-up after a meeting
Subject: Follow-up — [Meeting topic], [Date]

[Recipient name],

Thank you for meeting with [Executive name / us] on [date]. I wanted to capture the key outcomes:

**Decisions made:**
- [Decision 1]

**Action items:**
| Action | Owner | Due date |
|--------|-------|----------|
| [Action 1] | [Name] | [Date] |

**Open questions:**
- [Any unresolved items]

Please let us know if anything above is incorrect or if there is anything you would like to add.

[Closing], [Executive name]

---

## Decline or reschedule
Subject: Re: [Original subject]

[Recipient name],

Thank you for reaching out. Unfortunately, [Executive name] has a prior commitment at that time and is unable to attend.

[If rescheduling:] We would welcome the opportunity to reconnect — [assistant name] will follow up to find an alternative time.

[If declining:] We appreciate the invitation and hope to connect on another occasion.

[Closing], [Executive name]

---

## Meeting briefing format (internal)
**Meeting:** [Title]
**Date/time:** [Date, time, location or video link]
**Attendees:** [List]
**Objective:** [One sentence — what needs to be decided or accomplished]

**Background:**
[2–3 sentences of context the executive needs to know going in]

**Key points to cover:**
1. [Point 1]
2. [Point 2]

**Decisions needed from [Executive name]:**
- [Decision 1 — options: A / B]

**Potential sensitivities:**
- [Anything to handle carefully]
`,
      required: true,
    },
    {
      name: 'Scheduling preferences and calendar rules',
      purpose:
        'Upload the executive\'s scheduling preferences here so Claude can make accurate time-related suggestions.',
      kind: 'user-provided',
      guidance:
        'Describe the executive\'s scheduling preferences in plain text. Include: preferred meeting hours, ' +
        'days or times that are blocked, any standing meetings that cannot be moved, preferred buffer time ' +
        'between meetings, travel blackout windows, and any rules about back-to-back scheduling. ' +
        'A bulleted list is fine. Do not include personal contact details — focus on scheduling rules only.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'executive-assistant-scenario-follow-up-email',
      title: 'Draft a follow-up email after a meeting',
      userInput:
        'Draft a follow-up email to Sarah Chen at Meridian Partners after our meeting yesterday. ' +
        'We discussed a potential partnership on their logistics software. ' +
        'We agreed to share a product overview deck by Friday and schedule a technical call in two weeks.',
      expectedBehavior:
        'Claude should draft a professional follow-up email in the configured communication style, ' +
        'addressed to Sarah Chen. It should reference the logistics software discussion, ' +
        'confirm the two action items (sharing the deck by Friday, scheduling a technical call), ' +
        'and close with a clear next step. No details should be invented beyond what the user provided.',
      mustContain: ['Sarah Chen', 'logistics', 'partnership'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'executive-assistant-scenario-email-summary',
      title: 'Summarize a long email thread',
      userInput:
        'Here is a 15-message email thread about the budget reallocation for the Q3 marketing campaign. ' +
        'Summarize the key decisions, any open disagreements, and the action items with owners.',
      expectedBehavior:
        'Claude should produce a structured summary with three sections: decisions made, open questions or disagreements, ' +
        'and action items with named owners and due dates where mentioned. ' +
        'The summary should be brief enough to read in under two minutes. ' +
        'It should not add information not present in the thread.',
      mustContain: ['budget', 'Q3', 'marketing'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'executive-assistant-scenario-meeting-brief',
      title: 'Prepare a meeting briefing document',
      userInput:
        'Prepare a briefing for a board presentation next Thursday on our annual revenue results and the growth strategy for next year.',
      expectedBehavior:
        'Claude should produce a concise meeting brief in the standard format: objective, background context, ' +
        'key points to cover, decisions needed from the executive, and any sensitivities to be aware of. ' +
        'It should flag clearly that specific figures and strategy details need to be filled in by the user ' +
        'rather than invented.',
      mustContain: ['revenue', 'board', 'strategy'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
