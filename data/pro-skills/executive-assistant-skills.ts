import type { Setup } from '@/lib/setup/types';

export const executiveAssistantSkills: Setup[] = [
  // ─── 1. Email Drafting ────────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-executive-assistant-email-drafting-v1',
    slug: 'executive-assistant-email-drafting',
    name: 'Email Drafting',
    tagline: 'Draft polished outbound emails in the executive\'s voice from notes or a topic',
    description:
      'Takes a topic, raw notes, or a thread to respond to and produces a ready-to-send email ' +
      'in the executive\'s established communication style. Flags anything that requires personal ' +
      'review or a judgment call before sending, and never fabricates commitments or contact details.',
    role: 'Executive Assistant',
    industry: 'Operations',
    tags: ['email', 'correspondence', 'executive-support', 'writing', 'communication'],
    category: 'writing',
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

    instructionTemplate: `You draft professional emails on behalf of {{executiveName}} at {{companyName}}.

Communication style: {{communicationStyle}}

{{#if recipientContext}}
Recipient and relationship context: {{recipientContext}}
{{/if}}

When given a topic, subject line, raw notes, or an email thread to reply to, produce a polished, ready-to-send email in the {{communicationStyle}} register. Apply that style consistently — no tonal shifts between paragraphs.

Rules:
1. Never send or confirm anything autonomously — you draft for review; {{executiveName}} approves and acts.
2. Flag any message that requires a personal judgment call, contains sensitive information, or makes a commitment on {{companyName}}'s behalf.
3. Use only the recipient details and context the user provides — do not invent titles, affiliations, or professional details for real people.
4. Keep all executive and company information confidential; never volunteer internal details in ways that could reach unintended audiences.`,

    variables: [
      {
        key: 'executiveName',
        label: 'Executive\'s name',
        type: 'text',
        required: true,
        helpText: 'The name that should appear in signatures and sign-offs — e.g. "Sarah Chen" or "Sarah."',
        group: 'About the executive',
      },
      {
        key: 'companyName',
        label: 'Organization name',
        type: 'text',
        required: true,
        helpText: 'The company or organization name used in signatures, headers, and context.',
        group: 'About the executive',
      },
      {
        key: 'communicationStyle',
        label: 'Communication style',
        type: 'select',
        options: ['Formal', 'Professional', 'Direct and concise', 'Friendly and professional'],
        default: 'Professional',
        required: true,
        helpText: 'Pick the style that best reflects how this executive communicates in writing.',
        group: 'Preferences',
      },
      {
        key: 'recipientContext',
        label: 'Recipient and relationship context (optional)',
        type: 'multiline',
        required: false,
        helpText: 'Describe the key contacts and their relationships to the executive — e.g. "Board chair: formal tone required; CEO of key partner: friendly but professional." Claude will reference this when drafting.',
        group: 'Preferences',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Email drafting reference card',
        purpose:
          'Fillable templates for the most common email types — meeting requests, follow-ups, ' +
          'declines, and quick acknowledgements — so every draft follows a consistent format.',
        kind: 'starter',
        content: `# Email Drafting Reference Card

## Sign-off formats
- Formal: "Yours sincerely, [Executive name]"
- Professional: "Best regards, [Executive name]"
- Direct: "Thanks, [Executive name]"
- Friendly: "Warmly, [Executive name]"

## Common templates

### Meeting request
Subject: Meeting request — [Topic], [Proposed dates]

Dear [Recipient],

I am writing on behalf of [Executive name] to request a brief meeting to discuss [topic].

We would appreciate [duration] at your convenience. Available windows:
- [Option 1]
- [Option 2]

[Sign-off], [Executive name]

---

### Follow-up after a meeting
Subject: Follow-up — [Topic], [Date]

[Recipient],

Thank you for meeting with [Executive name] on [date]. Key outcomes:

Decisions: [List]
Action items: [Owner — Item — Due date]
Open questions: [List]

[Sign-off], [Executive name]

---

### Decline or defer
Subject: Re: [Original subject]

[Recipient],

Thank you for reaching out. [Executive name] has a prior commitment at that time and is unable to [attend / participate].

[If rescheduling:] We will follow up to find an alternative time.

[Sign-off], [Executive name]

---

## Tone reminders
- Open with the recipient's interest or a warm acknowledgement, not "I."
- State the purpose in the first sentence.
- Close with a clear next step or action owner.
- Never open with "I hope this email finds you well" unless the relationship warrants it.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'executive-assistant-email-drafting-scenario-1',
        title: 'Draft a vendor extension request',
        userInput:
          'Draft an email to our vendor GlobalSupply requesting a 30-day extension on our Q3 payment terms ' +
          'due to delayed project milestones on our end. Keep it professional and acknowledge the inconvenience.',
        expectedBehavior:
          'Claude should produce a complete, ready-to-send email addressed to GlobalSupply in the configured ' +
          'communication style. It should clearly request the 30-day extension, reference the delayed project ' +
          'milestones as the reason, acknowledge the inconvenience to the vendor, and close with a clear next step. ' +
          'No commitments beyond what the user described should be invented.',
        mustContain: ['GlobalSupply', 'extension', 'payment'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'executive-assistant-email-drafting-scenario-2',
        title: 'Draft a post-meeting thank-you',
        userInput:
          'Write a thank-you email to Jennifer Park at Accenture for the introductory call we had today ' +
          'about their consulting proposal. We agreed to share our internal roadmap by end of week and ' +
          'schedule a second meeting in two weeks.',
        expectedBehavior:
          'Claude should draft a polished thank-you email addressed to Jennifer Park at Accenture. ' +
          'It should acknowledge the call, confirm the two agreed next steps (sharing the roadmap and scheduling ' +
          'a follow-up), and close warmly. It must not invent any proposal details or commitments beyond what was stated.',
        mustContain: ['Jennifer Park', 'Accenture', 'thank'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 2. Meeting Agenda Builder ────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-executive-assistant-meeting-agenda-builder-v1',
    slug: 'executive-assistant-meeting-agenda-builder',
    name: 'Meeting Agenda Builder',
    tagline: 'Turn a topic list and duration into a crisp, timed meeting agenda',
    description:
      'Takes the meeting purpose, participants, available time, and topic list and produces a ' +
      'structured agenda with timed blocks and clear owners. Every agenda includes an objective ' +
      'and a decision or outcome for each item so participants arrive prepared.',
    role: 'Executive Assistant',
    industry: 'Operations',
    tags: ['meeting', 'agenda', 'scheduling', 'executive-support', 'operations'],
    category: 'operations',
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

    instructionTemplate: `You build meeting agendas for {{executiveName}}.

Default meeting duration: {{meetingDuration}}

Agenda style: {{agendaStyle}}

{{#if meetingContext}}
Standing context about recurring meetings or key participants: {{meetingContext}}
{{/if}}

When given a meeting title, participants, topics, and any timing constraints, build a complete agenda in the {{agendaStyle}} format. Each item should have an allocated time (total must not exceed {{meetingDuration}}), a named discussion owner, and a one-line goal (decision needed, update, or action to assign).

Rules:
1. Always include an opening objective (one sentence: what the meeting must accomplish) and a closing wrap-up slot.
2. Allocate realistic time — do not compress a complex decision into two minutes or pad a simple update.
3. Flag any topic that seems too large for the available time and suggest splitting it across sessions.
4. Keep all executive and company information confidential; never fabricate attendee titles or decisions.`,

    variables: [
      {
        key: 'executiveName',
        label: 'Executive\'s name',
        type: 'text',
        required: true,
        helpText: 'The person whose meetings you are supporting.',
        group: 'About the executive',
      },
      {
        key: 'meetingDuration',
        label: 'Default meeting duration',
        type: 'select',
        options: ['30 minutes', '45 minutes', '1 hour', '90 minutes', '2 hours'],
        default: '1 hour',
        required: true,
        helpText: 'The most common meeting length. You can override this in each request.',
        group: 'Preferences',
      },
      {
        key: 'agendaStyle',
        label: 'Agenda style',
        type: 'select',
        options: ['Timed blocks', 'Numbered sections', 'Bullet list'],
        default: 'Timed blocks',
        required: true,
        helpText: 'How the agenda should be formatted.',
        group: 'Preferences',
      },
      {
        key: 'meetingContext',
        label: 'Standing meeting context (optional)',
        type: 'multiline',
        required: false,
        helpText: 'Describe any recurring meetings, standard attendees, or standing agenda items Claude should know about when building agendas.',
        group: 'Preferences',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Agenda building reference card',
        purpose:
          'Templates and time-allocation guidelines for common meeting types so every agenda ' +
          'follows a consistent structure and stays within the allotted time.',
        kind: 'starter',
        content: `# Agenda Building Reference Card

## Standard agenda structure
1. Opening (2–5 min) — Welcome, objective, ground rules
2. Topic blocks — see time guidelines below
3. Open discussion / Q&A (5–10 min, if needed)
4. Wrap-up (5 min) — Recap decisions, confirm action items and owners, confirm next meeting

## Time guidelines by topic type
| Topic type | Time allocation |
|------------|----------------|
| Status update (one person) | 5–10 min |
| Decision item (requires discussion) | 15–20 min |
| Deep-dive / presentation | 20–30 min |
| Brainstorming session | 20–30 min |
| Quick announcement / FYI | 2–5 min |

## Agenda item template
**[Time]** [Topic title]
- Owner: [Name]
- Goal: [Decision needed / Update / Action to assign]
- Materials: [Pre-read, deck, or document — if applicable]

## Common meeting types
- **Weekly leadership sync** — status updates + blockers + decisions; 30–45 min
- **Project kickoff** — scope, timeline, roles, open questions; 60–90 min
- **1:1 check-in** — priorities, blockers, career; 30 min
- **Board / executive update** — report-out, key decisions, Q&A; 60–90 min
- **Offsite / strategy session** — themes not agenda items; 2–4 hour blocks

## Rules
- Never schedule a decision item in the last 5 minutes — move it to its own agenda slot.
- Mark pre-read materials as required or optional; attendees treat unmarked items as optional.
- End with action items named: [Owner] will [action] by [date].
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'executive-assistant-meeting-agenda-builder-scenario-1',
        title: 'Build a project kickoff agenda',
        userInput:
          'Build an agenda for a 1-hour project kickoff meeting with the marketing, engineering, and legal teams. ' +
          'Topics: project overview and goals, timeline and milestones, team roles and decision rights, open questions.',
        expectedBehavior:
          'Claude should produce a complete 1-hour agenda in the configured style with timed blocks that add up ' +
          'to 60 minutes. It should include an opening objective, allocated time for each of the four topics with ' +
          'named owners or groups, and a 5-minute wrap-up to capture action items. No topic should be allocated ' +
          'unrealistically short time for its complexity.',
        mustContain: ['agenda', 'kickoff', 'marketing'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'executive-assistant-meeting-agenda-builder-scenario-2',
        title: 'Build a weekly 1:1 check-in agenda',
        userInput:
          'Create a 30-minute agenda for a weekly 1:1 between the COO and the finance director. ' +
          'Standing items: budget review, blockers, and upcoming decisions needing COO sign-off.',
        expectedBehavior:
          'Claude should build a 30-minute agenda with the three standing items allocated realistic time ' +
          '(e.g., budget review 10 min, blockers 10 min, decisions 8 min, wrap 2 min). Each item should ' +
          'name an owner and a one-line goal. The structure should fit a timed or numbered format per the ' +
          'configured preference.',
        mustContain: ['check-in', 'budget', 'blockers'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 3. Meeting Minutes Summarizer ───────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-executive-assistant-meeting-minutes-summarizer-v1',
    slug: 'executive-assistant-meeting-minutes-summarizer',
    name: 'Meeting Minutes Summarizer',
    tagline: 'Turn raw meeting notes into clean minutes with decisions and action items',
    description:
      'Takes raw notes, bullet points, or a transcript and produces structured meeting minutes ' +
      'with clearly separated decisions made, action items with owners and due dates, and open ' +
      'questions. Output is ready to distribute without further editing.',
    role: 'Executive Assistant',
    industry: 'Operations',
    tags: ['meeting-minutes', 'notes', 'executive-support', 'operations', 'action-items'],
    category: 'operations',
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

    instructionTemplate: `You summarize meeting notes into clean, distributable minutes for {{executiveName}}.

Output format: {{outputFormat}}

{{#if distributionList}}
These minutes will be distributed to: {{distributionList}}
{{/if}}

When given raw notes, bullet points, or a transcript, produce minutes that include:
1. Meeting header (title, date, attendees — use what the user provides)
2. Decisions made (numbered list; each decision is a single clear sentence)
3. Action items (table: Owner | Action | Due date — use "TBD" if no date given)
4. Open questions (items raised but not resolved)
5. Next steps or next meeting date (if mentioned)

Rules:
1. Do not invent names, dates, or decisions not present in the source notes.
2. If the notes are ambiguous about who owns an action, flag it with "[Owner: confirm]" rather than guessing.
3. Keep decisions and action items separated — a decision is what was agreed; an action is what must be done next.
4. Keep all executive and company information confidential; never fabricate outcomes or commitments.`,

    variables: [
      {
        key: 'executiveName',
        label: 'Executive\'s name',
        type: 'text',
        required: true,
        helpText: 'The executive whose meetings you are documenting.',
        group: 'About the executive',
      },
      {
        key: 'outputFormat',
        label: 'Minutes format',
        type: 'select',
        options: ['Structured bullet points', 'Narrative summary', 'Action-item table only'],
        default: 'Structured bullet points',
        required: true,
        helpText: 'How the finished minutes should be laid out.',
        group: 'Preferences',
      },
      {
        key: 'distributionList',
        label: 'Distribution list (optional)',
        type: 'text',
        required: false,
        helpText: 'Who receives these minutes — e.g. "All attendees + CFO." Claude will include a header line noting the audience.',
        group: 'Preferences',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Minutes template and field guide',
        purpose:
          'A fillable minutes template and field-by-field guidance so every set of minutes ' +
          'follows the same structure and is immediately usable by recipients.',
        kind: 'starter',
        content: `# Meeting Minutes Template

## Header
**Meeting:** [Title]
**Date:** [Date]
**Attendees:** [Name, Name, Name]
**Absent:** [Name (if applicable)]
**Minutes prepared by:** [Your name]

---

## Decisions made
1. [Decision — one sentence, past tense: "The team agreed to…"]
2. ...

---

## Action items
| Owner | Action | Due date |
|-------|--------|----------|
| [Name] | [What they will do] | [Date or TBD] |

---

## Open questions
- [Question raised but not resolved — flag with owner if assigned]

---

## Next meeting
**Date/time:** [If confirmed]
**Agenda items carried forward:** [List]

---

## Field guide
- **Decision** — a choice that was finalized in the meeting; use past tense ("agreed," "approved," "rejected").
- **Action item** — a task assigned to a named person with a deadline; "TBD" is acceptable but should be flagged for follow-up.
- **Open question** — raised but left unresolved; always note whether someone owns the answer and by when.
- **Absent** — list only those who were expected but did not attend; do not list people not invited.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'executive-assistant-meeting-minutes-summarizer-scenario-1',
        title: 'Summarize product roadmap sync notes',
        userInput:
          'Summarize these meeting notes from today\'s product roadmap sync: ' +
          'Attendees: Sarah (Product), Mike (Engineering), Alex (Design). ' +
          'Decisions: delay Feature X to Q4, fast-track the onboarding redesign. ' +
          'Action items: Sarah to update the roadmap doc by Friday; Mike to brief the engineering team Monday; ' +
          'Alex to share three wireframe options by next Wednesday.',
        expectedBehavior:
          'Claude should produce structured minutes with a header (meeting title, date, attendees), ' +
          'a decisions section listing the two decisions clearly, an action-item table with three rows ' +
          '(Sarah/Mike/Alex with their respective actions and due dates), and an empty open-questions section ' +
          'if none were raised. No information should be added beyond what was provided.',
        mustContain: ['roadmap', 'Feature X', 'Sarah'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'executive-assistant-meeting-minutes-summarizer-scenario-2',
        title: 'Extract decisions and action items from board meeting notes',
        userInput:
          'Here are the raw notes from our board meeting yesterday. ' +
          'Pull out the key decisions made, all action items with owners, and any items tabled for the next meeting.',
        expectedBehavior:
          'Claude should produce minutes with clearly separated sections for decisions made, action items ' +
          'with owners (flagging any with no named owner as "[Owner: confirm]"), and a section for tabled items. ' +
          'Because the notes are described as "raw," Claude should note any gaps where information is unclear ' +
          'rather than filling them in.',
        mustContain: ['board', 'decisions', 'action items'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 4. Calendar & Scheduling Helper ─────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-executive-assistant-calendar-scheduling-helper-v1',
    slug: 'executive-assistant-calendar-scheduling-helper',
    name: 'Calendar & Scheduling Helper',
    tagline: 'Propose meeting times, resolve conflicts, and draft scheduling communications',
    description:
      'Helps manage the executive\'s calendar by proposing meeting slots, flagging conflicts, ' +
      'and drafting scheduling communications. Works within the stated time zone, buffer preferences, ' +
      'and scheduling rules — never confirms meetings autonomously.',
    role: 'Executive Assistant',
    industry: 'Operations',
    tags: ['scheduling', 'calendar', 'executive-support', 'time-management', 'operations'],
    category: 'operations',
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

    instructionTemplate: `You assist with scheduling and calendar management for {{executiveName}}.

Primary time zone: {{timeZone}}

Scheduling preferences: {{schedulingPreferences}}

Preferred buffer between meetings: {{bufferPreference}}

When given scheduling requests, calendar conflicts, or time-management questions, propose options that respect the preferences above. Always present at least two or three alternative slots when proposing times, and flag any hard constraint that cannot be accommodated with the information provided.

Rules:
1. Never confirm, accept, or block calendar events autonomously — you propose options for {{executiveName}} to approve.
2. When time zones are involved, state times in both the relevant zone and {{timeZone}}.
3. Flag back-to-back meetings that violate the {{bufferPreference}} buffer and suggest which to move.
4. Keep all executive and company scheduling information confidential; never fabricate availability or commitments.`,

    variables: [
      {
        key: 'executiveName',
        label: 'Executive\'s name',
        type: 'text',
        required: true,
        helpText: 'The person whose calendar you are managing.',
        group: 'About the executive',
      },
      {
        key: 'timeZone',
        label: 'Primary time zone',
        type: 'text',
        required: true,
        helpText: 'E.g. "Eastern Time (ET)" or "Central European Time (CET)." Used for all scheduling suggestions.',
        group: 'Calendar rules',
      },
      {
        key: 'schedulingPreferences',
        label: 'Scheduling preferences',
        type: 'multiline',
        required: true,
        helpText: 'Describe working hours, blocked times, meeting-free days, travel windows, and any standing rules. E.g. "No meetings before 9am or after 5pm; Fridays are deep-work days; no back-to-back calls."',
        group: 'Calendar rules',
      },
      {
        key: 'bufferPreference',
        label: 'Preferred buffer between meetings',
        type: 'select',
        options: ['No buffer needed', '15-minute buffer', '30-minute buffer', '45-minute buffer'],
        default: '15-minute buffer',
        required: true,
        helpText: 'Minimum gap to maintain between consecutive meetings.',
        group: 'Calendar rules',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Scheduling rules and calendar reference card',
        purpose:
          'A fillable reference card capturing the executive\'s scheduling rules, standing meetings, ' +
          'and time-zone contacts so every scheduling decision respects their calendar norms.',
        kind: 'starter',
        content: `# Scheduling Rules and Calendar Reference Card

## Core rules
- Working hours: [Start time] – [End time], [Time zone]
- Meeting-free blocks: [e.g., "Fridays before noon," "12–1pm daily lunch"]
- Travel windows: [Dates or recurring windows when travel is expected]
- Back-to-back policy: [Maximum consecutive meetings before a required break]

## Standing meetings (do not move without approval)
| Meeting | Day/time | Attendees | Duration |
|---------|----------|-----------|----------|
| [Name] | [e.g., Mon 9am ET] | [Names] | [30 min] |

## Time-zone contacts
| Contact | Location | Their working hours (local) | Overlap with executive |
|---------|----------|----------------------------|------------------------|
| [Name] | [City] | [9am–5pm CET] | [3pm–5pm ET] |

## Scheduling communication templates

### Propose a meeting
"We have the following windows available for a [duration] call: [Option 1], [Option 2], [Option 3]. Please let us know which works for you, or suggest an alternative."

### Reschedule request
"Due to a scheduling conflict, we need to move our [meeting title] on [date]. Could we reschedule to [proposed alternative]? We apologize for any inconvenience."

### Decline with hold for future
"[Executive name] is unavailable at that time but would welcome the opportunity to connect. We will reach out to propose an alternative window."

## Prioritization rules (when conflicts arise)
1. Board / investor commitments
2. External client commitments (confirmed)
3. Internal leadership meetings
4. Internal team meetings
5. Administrative tasks
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'executive-assistant-calendar-scheduling-helper-scenario-1',
        title: 'Propose cross-time-zone meeting slots',
        userInput:
          'I need to schedule a 45-minute call with our London team (they\'re in GMT). ' +
          'Find a slot that works within my 9am–5pm EST working hours and avoid blocking my 12–1pm lunch. ' +
          'Propose three options for next Tuesday or Wednesday.',
        expectedBehavior:
          'Claude should propose three specific time slots that fall within 9am–5pm EST, avoid the 12–1pm lunch block, ' +
          'and state each time in both EST and GMT so the London team can confirm. It should acknowledge the ' +
          'buffer preference when placing options and flag any constraints it cannot resolve with the information given.',
        mustContain: ['London', 'GMT', 'EST'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'executive-assistant-calendar-scheduling-helper-scenario-2',
        title: 'Resolve overlapping meeting requests',
        userInput:
          'I have three meeting requests that all overlap on Thursday afternoon: ' +
          '2pm board prep with Sarah, 3pm vendor call with Orbit Systems, and 2:30pm team standup. ' +
          'Help me prioritize and suggest how to handle the conflicts.',
        expectedBehavior:
          'Claude should apply a prioritization logic (board prep likely highest priority; team standup may be ' +
          'delegatable or reschedulable), flag that the 2pm and 2:30pm overlap, and propose concrete resolutions ' +
          'for each conflict — e.g., rescheduling the standup, sending a delegate to one meeting, or asking ' +
          'Orbit Systems for an alternative time. It must not confirm any reschedule autonomously.',
        mustContain: ['Thursday', 'board', 'Orbit Systems'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 5. Travel Itinerary Builder ──────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-executive-assistant-travel-itinerary-builder-v1',
    slug: 'executive-assistant-travel-itinerary-builder',
    name: 'Travel Itinerary Builder',
    tagline: 'Build day-by-day business travel itineraries with logistics and contingency notes',
    description:
      'Takes travel dates, destinations, meetings, and preferences and produces a structured ' +
      'day-by-day itinerary covering flights, ground transport, hotel, meals, and meeting prep. ' +
      'Includes contingency notes for common disruptions and flags anything needing confirmation.',
    role: 'Executive Assistant',
    industry: 'Operations',
    tags: ['travel', 'itinerary', 'executive-support', 'logistics', 'operations'],
    category: 'operations',
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

    instructionTemplate: `You build detailed travel itineraries for {{travelerName}}.

Preferred travel class: {{travelClass}}

{{#if loyaltyPrograms}}
Loyalty programs and membership numbers: {{loyaltyPrograms}}
{{/if}}

{{#if dietaryRestrictions}}
Dietary restrictions or preferences: {{dietaryRestrictions}}
{{/if}}

When given travel dates, destination, purpose, and any meeting schedule, produce a day-by-day itinerary that includes:
- Day headers with the date and city
- Flight or transport segments (departure time, carrier, arrival time, confirmation placeholder)
- Hotel check-in and check-out
- Scheduled meetings (time, location, contact, purpose)
- Ground transport between venues
- Meal recommendations or reservations to make
- A brief contingency note for each travel day (e.g., alternate flight window, backup hotel)

Rules:
1. Flag any logistical gap — e.g., insufficient transit time between a flight arrival and a meeting start.
2. Do not invent flight numbers, prices, or hotel room rates — use placeholders and note what needs to be booked.
3. Use local time for all times in the itinerary; note time zone explicitly.
4. Keep all executive and company travel information confidential; never fabricate bookings or commitments.`,

    variables: [
      {
        key: 'travelerName',
        label: 'Traveler\'s name',
        type: 'text',
        required: true,
        helpText: 'The person travelling — used in the itinerary header and any booking placeholders.',
        group: 'About the traveler',
      },
      {
        key: 'travelClass',
        label: 'Preferred travel class',
        type: 'select',
        options: ['Economy', 'Business', 'First Class'],
        default: 'Business',
        required: true,
        helpText: 'The default cabin class for flight and train bookings.',
        group: 'Travel preferences',
      },
      {
        key: 'loyaltyPrograms',
        label: 'Loyalty programs (optional)',
        type: 'text',
        required: false,
        helpText: 'List loyalty programs and member numbers — e.g. "United MileagePlus #UA12345, Marriott Bonvoy #MB67890." Claude will include these in booking placeholders.',
        group: 'Travel preferences',
      },
      {
        key: 'dietaryRestrictions',
        label: 'Dietary restrictions or preferences (optional)',
        type: 'text',
        required: false,
        helpText: 'E.g. "Vegetarian," "Gluten-free," "No shellfish." Claude will flag meal bookings and in-flight meal requests accordingly.',
        group: 'Travel preferences',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Travel itinerary reference card',
        purpose:
          'A day-by-day itinerary template and logistics checklist so every trip plan follows ' +
          'the same format and covers the same categories without gaps.',
        kind: 'starter',
        content: `# Travel Itinerary Reference Card

## Day template
---
**[Day], [Date] — [City]**

| Time (local) | Item | Details |
|--------------|------|---------|
| [Time] | Depart [Origin Airport, Terminal] | Flight [Airline, Flight #] to [Destination] — Confirmation: [TBK] |
| [Time] | Arrive [Destination Airport] | Allow [X min] for baggage + customs |
| [Time] | Ground transport | [Car service / Taxi / Train] to [Hotel / Venue] — Est. time: [X min] |
| [Time] | Hotel check-in | [Hotel name, address, confirmation: TBK] |
| [Time] | [Meeting title] | [Address, contact name, purpose] |
| [Time] | Dinner | [Restaurant / TBD — dietary note if applicable] |

**Contingency:** [Alternative flight if missed / backup hotel contact / nearest urgent care]

---

## Booking checklist
- [ ] Outbound flight booked (confirmation: ___)
- [ ] Return flight booked (confirmation: ___)
- [ ] Hotel booked — all nights (confirmation: ___)
- [ ] Ground transport arranged (arrival + departure)
- [ ] Meals or restaurant reservations (for client-facing dinners)
- [ ] Loyalty numbers applied to all bookings
- [ ] In-flight meal preference requested (if applicable)
- [ ] Travel insurance / corporate card travel benefits checked

## Logistics rules
- Allow minimum 90 min between domestic flight arrival and first meeting.
- Allow minimum 3 hrs between international flight arrival and first meeting.
- Always note local emergency contact and nearest hospital/clinic.
- Confirm hotel accepts loyalty card before booking.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'executive-assistant-travel-itinerary-builder-scenario-1',
        title: 'Build a 3-day domestic business trip itinerary',
        userInput:
          'Build a travel itinerary for a 3-day business trip to Chicago, departing Monday morning from New York (JFK). ' +
          'Meetings: Monday afternoon downtown, Tuesday all-day conference at the Marriott, ' +
          'Wednesday morning client breakfast, returning Wednesday afternoon.',
        expectedBehavior:
          'Claude should produce a day-by-day itinerary covering Monday through Wednesday with flight segments ' +
          '(placeholders for confirmation numbers), hotel at or near the Marriott, time-stamped meeting blocks, ' +
          'ground transport notes between venues, and a contingency note for the return travel day. ' +
          'It should flag if any transition times look tight and note what still needs to be booked.',
        mustContain: ['Chicago', 'JFK', 'Marriott'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'executive-assistant-travel-itinerary-builder-scenario-2',
        title: 'Build an international investor trip itinerary',
        userInput:
          'I need a travel plan for our CEO flying to London Heathrow next Thursday for a Friday morning investor meeting, ' +
          'returning Sunday. Include hotel suggestions near Canary Wharf and ground transport options.',
        expectedBehavior:
          'Claude should produce a Thursday–Sunday itinerary: Thursday outbound flight with Heathrow arrival details, ' +
          'hotel near Canary Wharf (named suggestions with "to be confirmed" caveat), Friday morning investor meeting block, ' +
          'free Friday afternoon and Saturday, Sunday return flight. Ground transport options (Heathrow Express + taxi, ' +
          'or car service) should be noted for both airport transfers. The investor meeting time zone (GMT/BST) should ' +
          'be stated explicitly.',
        mustContain: ['London', 'Heathrow', 'investor'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 6. Task Prioritizer ──────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-executive-assistant-task-prioritizer-v1',
    slug: 'executive-assistant-task-prioritizer',
    name: 'Task Prioritizer',
    tagline: 'Triage a backlog of tasks into a realistic, ordered work plan for the day or week',
    description:
      'Takes a list of tasks, deadlines, and competing demands and produces a prioritized, ' +
      'time-aware work order using the executive\'s preferred framework. Flags overloaded days, ' +
      'items that can be delegated, and anything with a hard deadline at risk.',
    role: 'Executive Assistant',
    industry: 'Operations',
    tags: ['prioritization', 'task-management', 'executive-support', 'productivity', 'operations'],
    category: 'operations',
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

    instructionTemplate: `You help prioritize tasks and manage workload for {{executiveName}}.

Prioritization framework: {{priorityFramework}}

Available working hours per day: {{workingHoursPerDay}}

{{#if escalationThreshold}}
Escalation rule — flag immediately if: {{escalationThreshold}}
{{/if}}

When given a task list, inbox items, or competing demands, apply the {{priorityFramework}} framework to produce:
1. A prioritized, ordered task list with a suggested working sequence
2. Time estimates for each item (mark items where the estimate is uncertain)
3. An "At risk" flag on any item with a hard deadline that cannot be met in the remaining {{workingHoursPerDay}} per day
4. A "Delegate" recommendation for items that do not require the executive's personal involvement

Rules:
1. Do not pad estimates — if a task is unclear, flag it as "estimate uncertain" and ask for clarification rather than guessing.
2. Do not move, drop, or reassign tasks autonomously — surface options for {{executiveName}} to decide.
3. If the total estimated time exceeds {{workingHoursPerDay}}, flag the overflow clearly and suggest what to defer or delegate.
4. Keep all executive and company information confidential; never fabricate task details or commitments.`,

    variables: [
      {
        key: 'executiveName',
        label: 'Executive\'s name',
        type: 'text',
        required: true,
        helpText: 'The person whose task list you are managing.',
        group: 'About the executive',
      },
      {
        key: 'priorityFramework',
        label: 'Prioritization framework',
        type: 'select',
        options: ['Urgency-Impact matrix', 'Deadline-first', 'Energy-based (peak/low focus)', 'Stakeholder-led'],
        default: 'Urgency-Impact matrix',
        required: true,
        helpText: 'The framework Claude will use to order tasks. Urgency-Impact ranks by how urgent AND important each task is.',
        group: 'Preferences',
      },
      {
        key: 'workingHoursPerDay',
        label: 'Available working hours per day',
        type: 'select',
        options: ['4 hours', '6 hours', '8 hours', '10 hours'],
        default: '8 hours',
        required: true,
        helpText: 'The realistic productive hours per day after meetings. Used to flag overloaded schedules.',
        group: 'Preferences',
      },
      {
        key: 'escalationThreshold',
        label: 'Escalation rule (optional)',
        type: 'text',
        required: false,
        helpText: 'Describe any condition that should trigger an immediate flag — e.g. "Any task involving the board, legal matters, or media inquiries should be flagged before acting."',
        group: 'Preferences',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Task prioritization reference card',
        purpose:
          'A quick reference for common prioritization frameworks and delegation guidelines ' +
          'so every triage session applies a consistent, explainable logic.',
        kind: 'starter',
        content: `# Task Prioritization Reference Card

## Urgency-Impact matrix (2×2)
| | High urgency | Low urgency |
|---|---|---|
| **High impact** | Do first — block time today | Schedule — plan a focused session |
| **Low impact** | Delegate or batch — do quickly | Drop or defer — revisit next week |

## Deadline-first approach
1. List all hard deadlines (external, contractual, or committed to a named person).
2. Work backwards: what must be done today to meet each deadline?
3. Assign the first available work block to the nearest deadline.

## Energy-based approach
- **Peak focus time** (e.g., 9–11am): complex decisions, writing, analysis
- **Medium focus** (e.g., 1–3pm): meetings, calls, reviews
- **Low focus** (e.g., 4–5pm): admin, email triage, expense reports

## Stakeholder-led approach
Priority order: Board → Investors → C-suite → Key clients → Internal teams → Personal admin

## Delegation signals (consider delegating if any apply)
- The task does not require the executive's personal judgment or authority.
- A direct report or team member has the context to handle it.
- The task is repeatable and could be templated for future use.
- Doing it personally costs more in opportunity time than the task is worth.

## Time estimate benchmarks
| Task type | Typical estimate |
|-----------|-----------------|
| Quick email reply | 5–10 min |
| Complex email draft | 20–30 min |
| Document review (10 pages) | 30–45 min |
| Preparing remarks or talking points | 45–90 min |
| Decision requiring research | 60–120 min |
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'executive-assistant-task-prioritizer-scenario-1',
        title: 'Prioritize a mixed daily task list',
        userInput:
          'Here is my task list for today: ' +
          '1) Respond to board chair email about Friday board deck (deadline: EOD today), ' +
          '2) Review legal contract draft (due Thursday), ' +
          '3) Prepare talking points for 2pm all-hands, ' +
          '4) Book travel for next week\'s conference, ' +
          '5) Follow up on three vendor proposals (no hard deadline). ' +
          'Prioritize these and suggest a working order.',
        expectedBehavior:
          'Claude should apply the configured framework (e.g., Urgency-Impact) and produce a ranked list. ' +
          'The board chair email and all-hands prep should rank highest given the same-day deadlines. ' +
          'The legal contract review ranks next (Thursday deadline). Travel booking and vendor follow-ups are ' +
          'lower urgency and may be delegated or deferred. Claude should flag if the total estimated time ' +
          'exceeds the available working hours.',
        mustContain: ['board', 'all-hands', 'vendor'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'executive-assistant-task-prioritizer-scenario-2',
        title: 'Triage a heavily overloaded week',
        userInput:
          'I have 12 items on my plate this week and I\'m already behind. ' +
          'My CEO has a board presentation Friday that I need to support, there are two urgent HR matters, ' +
          'and I have a backlog of expense reports. Help me triage.',
        expectedBehavior:
          'Claude should ask for the full list if not provided, or work with the categories described. ' +
          'It should flag that board presentation support (Friday deadline) and HR matters (described as urgent) ' +
          'are top priority. Expense reports can likely be batched into a single low-focus slot or delegated. ' +
          'It should explicitly flag that with 12 items and limited hours, some tasks must be deferred or delegated, ' +
          'and prompt the user to decide.',
        mustContain: ['board presentation', 'HR', 'expense'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 7. Expense Report Organizer ─────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-executive-assistant-expense-report-organizer-v1',
    slug: 'executive-assistant-expense-report-organizer',
    name: 'Expense Report Organizer',
    tagline: 'Categorize, format, and flag expenses ready for finance submission',
    description:
      'Takes a raw list of expenses — receipts, transaction notes, or card statements — and ' +
      'organizes them into a submission-ready report by category and period. Flags items that ' +
      'need receipts, approvals, or a business-purpose note before submission.',
    role: 'Executive Assistant',
    industry: 'Operations',
    tags: ['expense-report', 'finance', 'executive-support', 'operations', 'accounting'],
    category: 'finance',
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

    instructionTemplate: `You organize expense reports for {{executiveName}} at {{companyName}}.

Approved expense categories: {{expenseCategories}}

Reporting period: {{reportingPeriod}}

When given a list of expenses, receipts, or transaction notes, produce a formatted expense report with:
1. A summary table — Category | Description | Date | Amount | Receipt status
2. Category subtotals and a grand total
3. A flag list — items missing a receipt, business purpose, or approval note
4. A submission checklist of what still needs to be provided before the report can be filed

Rules:
1. Categorize using only the approved categories above — flag any expense that does not fit clearly and suggest the closest match.
2. Do not invent amounts, dates, or business purposes — use only what is provided and mark gaps with "[Required: confirm]".
3. Flag any single expense over a common approval threshold (e.g., meals over $75 per person, gifts over $50) for manager review.
4. Keep all executive and company financial information confidential; never fabricate totals or receipts.`,

    variables: [
      {
        key: 'executiveName',
        label: 'Executive\'s name',
        type: 'text',
        required: true,
        helpText: 'The person submitting expenses.',
        group: 'About the executive',
      },
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'Used in the expense report header.',
        group: 'About the executive',
      },
      {
        key: 'expenseCategories',
        label: 'Approved expense categories',
        type: 'multiselect',
        options: [
          'Meals & Entertainment',
          'Travel & Lodging',
          'Transportation',
          'Office Supplies',
          'Client Gifts',
          'Professional Development',
          'Technology',
        ],
        required: true,
        helpText: 'Select every category your company uses. Claude will categorize expenses using only these.',
        group: 'Report settings',
      },
      {
        key: 'reportingPeriod',
        label: 'Reporting period',
        type: 'select',
        options: ['Weekly', 'Monthly', 'Per-trip', 'Quarterly'],
        default: 'Monthly',
        required: true,
        helpText: 'How expenses are grouped and submitted.',
        group: 'Report settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Expense report template and policy reference',
        purpose:
          'A fillable expense report template and common policy thresholds so every report ' +
          'is formatted consistently and flags the right items for approval before submission.',
        kind: 'starter',
        content: `# Expense Report Template and Policy Reference

## Report header
**Employee:** [Executive name]
**Department:** [Department]
**Reporting period:** [Start date] – [End date]
**Submitted by:** [Assistant name]
**Date submitted:** [Date]
**Manager for approval:** [Name]

---

## Expense table
| Date | Category | Description / Business purpose | Amount | Receipt? |
|------|----------|-------------------------------|--------|----------|
| [Date] | [Category] | [Purpose — include attendees for meals] | $[Amount] | Yes / No / Digital |

---

## Summary
| Category | Subtotal |
|----------|---------|
| Meals & Entertainment | $_ |
| Travel & Lodging | $_ |
| Transportation | $_ |
| [Other categories] | $_ |
| **Grand total** | **$_** |

---

## Flag list (must be resolved before submission)
- [ ] Missing receipt: [Item description, amount]
- [ ] Missing business purpose: [Item]
- [ ] Exceeds approval threshold: [Item — needs manager sign-off]
- [ ] Category unclear: [Item — suggest: ___]

---

## Common policy thresholds (fill in your company's rules)
- Meals: per-person limit $[___]; group meals require attendee list
- Client gifts: limit $[___] per recipient per year
- Single-item approval threshold: $[___]
- Alcohol: reimbursable / not reimbursable (circle one)
- Receipt required for all items over: $[___]
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'executive-assistant-expense-report-organizer-scenario-1',
        title: 'Organize a business trip expense list',
        userInput:
          'Organize these expenses from my San Francisco trip (March 10–12): ' +
          'Uber to JFK $47, flight $620, hotel 2 nights at $289/night, ' +
          'client dinner at Bix restaurant $340 (4 people), office supplies at Staples $23, ' +
          'coffee meeting with investor $18. Format as an expense report.',
        expectedBehavior:
          'Claude should produce a structured expense table categorizing each item (Transportation, Travel & Lodging, ' +
          'Meals & Entertainment, Office Supplies) with subtotals and a grand total. It should flag the client dinner ' +
          '($340 for 4 = $85/person, over the typical $75 threshold) for approval, and flag that no business purpose ' +
          'was given for the Staples purchase. The hotel should be shown as two line items or one with a note.',
        mustContain: ['San Francisco', 'hotel', 'client dinner'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'executive-assistant-expense-report-organizer-scenario-2',
        title: 'Categorize a mixed monthly expense batch',
        userInput:
          'I have a mixed batch of expenses from this month: two team lunches, a conference registration fee, ' +
          'a flight for a site visit, and three Uber receipts. ' +
          'Help me sort them into the right categories and flag anything that might need a receipt scan or manager approval.',
        expectedBehavior:
          'Claude should assign categories (Meals & Entertainment for lunches, Professional Development for the conference, ' +
          'Travel & Lodging or Transportation for the flight, Transportation for the Uber rides). It should note that ' +
          'amounts are missing and prompt the user to add them. It should flag that the conference fee and flight are ' +
          'likely to require receipts and may exceed single-item approval thresholds depending on amount.',
        mustContain: ['conference', 'flight', 'receipts'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 8. Briefing Doc Prep ─────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-executive-assistant-briefing-doc-prep-v1',
    slug: 'executive-assistant-briefing-doc-prep',
    name: 'Briefing Doc Prep',
    tagline: 'Prepare concise briefing documents that get the executive ready for any meeting or event',
    description:
      'Takes the topic, participants, and available background context and produces a structured ' +
      'briefing document in the chosen format — one-page summary, detailed brief, talking points, ' +
      'or Q&A prep. Flags gaps where more information is needed before the briefing can be finalized.',
    role: 'Executive Assistant',
    industry: 'Operations',
    tags: ['briefing', 'executive-support', 'meeting-prep', 'writing', 'operations'],
    category: 'writing',
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

    instructionTemplate: `You prepare briefing documents for {{executiveName}}.

Briefing format: {{briefingFormat}}

Audience for this briefing: {{audienceContext}}

Sensitivity level: {{sensitivityLevel}}

When given a meeting topic, event, or situation to brief for, produce a {{briefingFormat}} covering:
- Objective (what {{executiveName}} needs to achieve or decide)
- Background (context the executive needs to walk in knowing)
- Key points or talking points (what to cover or say)
- Decisions needed from {{executiveName}}
- Potential sensitivities or risks to be aware of

For {{sensitivityLevel}} briefings, ensure that sensitive details are clearly marked and not included in sections intended for external distribution.

Rules:
1. Flag any section where critical information is missing and specify what is needed to complete it.
2. Do not fabricate facts, figures, or biographical details about third parties — use only what the user provides.
3. Distinguish clearly between facts (stated by the user) and inferences or assumptions (labeled as such).
4. Keep all executive and company information confidential; never fabricate commitments or outcomes.`,

    variables: [
      {
        key: 'executiveName',
        label: 'Executive\'s name',
        type: 'text',
        required: true,
        helpText: 'The person being briefed.',
        group: 'About the executive',
      },
      {
        key: 'briefingFormat',
        label: 'Briefing format',
        type: 'select',
        options: ['One-page summary', 'Detailed brief', 'Talking points only', 'Q&A prep format'],
        default: 'One-page summary',
        required: true,
        helpText: 'Choose the output format. One-page summary is best for time-constrained situations; Detailed brief for high-stakes meetings.',
        group: 'Format',
      },
      {
        key: 'audienceContext',
        label: 'Meeting or event audience',
        type: 'text',
        required: true,
        helpText: 'Who will be in the room or on the call — e.g. "Board of directors," "Potential acquisition target — CTO and CFO," "Press interviewer."',
        group: 'Format',
      },
      {
        key: 'sensitivityLevel',
        label: 'Sensitivity level',
        type: 'select',
        options: ['Public-facing', 'Internal only', 'Confidential'],
        default: 'Internal only',
        required: true,
        helpText: 'Controls how Claude handles sensitive details in the output. Confidential briefings will be flagged for restricted distribution.',
        group: 'Format',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Briefing document template',
        purpose:
          'A standard briefing template with all sections pre-defined so every brief covers ' +
          'the same categories and can be completed or updated quickly before a meeting.',
        kind: 'starter',
        content: `# Briefing Document Template

## Header
**For:** [Executive name]
**Meeting / Event:** [Title]
**Date / Time:** [Date, time, location or video link]
**Attendees:** [Names and titles]
**Sensitivity:** [Public-facing / Internal only / Confidential]
**Prepared by:** [Assistant name], [Date prepared]

---

## Objective
[One sentence: what {{executiveName}} needs to achieve, decide, or convey in this meeting.]

---

## Background
[2–4 sentences of essential context. What is the history? Why does this meeting matter now?]

---

## Key points / Talking points
1. [Point — what to say or cover]
2. [Point]
3. [Point]

---

## Decisions needed from [Executive name]
| Decision | Options | Recommendation | Deadline |
|----------|---------|----------------|---------|
| [What must be decided] | [A / B] | [Suggested option] | [Date] |

---

## Potential sensitivities
- [Risk or sensitive topic to handle carefully — suggest approach]

---

## What is still missing (flag for completion)
- [ ] [Information gap — specify what is needed and from whom]

---

## Quick reference
| Name | Role | Key fact or relationship note |
|------|------|-------------------------------|
| [Name] | [Title, Company] | [One-line note] |
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'executive-assistant-briefing-doc-prep-scenario-1',
        title: 'Prepare an acquisition exploration briefing',
        userInput:
          'Prepare a briefing for our COO\'s meeting with a potential acquisition target, TechFlow Labs. ' +
          'They build workflow automation software. ' +
          'Meeting goal: explore partnership vs. acquisition fit. ' +
          'Attendees: our CFO, COO, and M&A advisor.',
        expectedBehavior:
          'Claude should produce a briefing in the configured format with a clear objective (explore fit), ' +
          'background section on TechFlow Labs (based on what was provided, noting gaps for further research), ' +
          'talking points covering partnership vs. acquisition framing, decisions needed from the COO, ' +
          'and a sensitivities section (e.g., do not signal acquisition intent prematurely). ' +
          'It should flag that more detail on TechFlow Labs\' financials and product fit is needed.',
        mustContain: ['TechFlow Labs', 'acquisition', 'COO'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'executive-assistant-briefing-doc-prep-scenario-2',
        title: 'Prepare an earnings call Q&A briefing',
        userInput:
          'Brief our CEO for tomorrow\'s earnings call with analysts. ' +
          'Key results: Q3 revenue up 18% YoY, operating margin improved to 22%, ' +
          'new product launch delayed to Q1 next year. ' +
          'Anticipated questions: guidance revision, competitive pressure, headcount plans.',
        expectedBehavior:
          'Claude should produce a Q&A prep format briefing with the key financial results as background, ' +
          'and then structured Q&A pairs for each anticipated analyst question — guidance revision, ' +
          'competitive pressure, and headcount. Each answer frame should acknowledge the question, ' +
          'state what can be confirmed, and note what should be deferred to the CFO or flagged as forward-looking. ' +
          'No invented figures beyond what the user provided.',
        mustContain: ['Q3 revenue', 'earnings', 'guidance'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 9. Follow-up Tracker ─────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-executive-assistant-follow-up-tracker-v1',
    slug: 'executive-assistant-follow-up-tracker',
    name: 'Follow-up Tracker',
    tagline: 'Track pending items, draft reminders, and flag what\'s overdue or at risk',
    description:
      'Takes a set of open action items, sent emails, or commitments and produces a status ' +
      'tracker with outstanding items, recommended follow-up messages, and escalation flags for ' +
      'anything that has passed the response window.',
    role: 'Executive Assistant',
    industry: 'Operations',
    tags: ['follow-up', 'tracking', 'executive-support', 'operations', 'action-items'],
    category: 'operations',
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

    instructionTemplate: `You manage follow-up tracking and reminder drafts for {{executiveName}}.

Follow-up style: {{followUpStyle}}

Escalation window — flag as overdue if no response after: {{escalationWindow}}

{{#if trackingContext}}
Context about current projects and key relationships: {{trackingContext}}
{{/if}}

When given a list of pending items, sent emails, or action items from meetings, produce:
1. A status tracker table — Item | Owner / Recipient | Date sent or assigned | Status | Days outstanding | Action recommended
2. Draft follow-up messages (in the {{followUpStyle}} style) for any item that has passed the {{escalationWindow}} window
3. An escalation flag for items that are both overdue AND high-stakes — label these as "Escalate: needs {{executiveName}}'s direct attention"

Rules:
1. Do not send any follow-up messages autonomously — you draft for review and approval.
2. Keep follow-up tone proportionate to the relationship and the stakes — a first reminder should be collegial, not accusatory.
3. If an item has no clear due date, prompt the user to set one rather than defaulting to "no action needed."
4. Keep all executive and company information confidential; never fabricate commitments or response statuses.`,

    variables: [
      {
        key: 'executiveName',
        label: 'Executive\'s name',
        type: 'text',
        required: true,
        helpText: 'The person whose follow-ups you are tracking.',
        group: 'About the executive',
      },
      {
        key: 'followUpStyle',
        label: 'Follow-up message style',
        type: 'select',
        options: ['Concise and friendly', 'Professional and direct', 'Formal escalation'],
        default: 'Concise and friendly',
        required: true,
        helpText: 'The tone to use for follow-up messages. Start with Concise and friendly; move to Formal escalation for genuinely time-sensitive or high-stakes items.',
        group: 'Preferences',
      },
      {
        key: 'escalationWindow',
        label: 'Escalation window',
        type: 'select',
        options: ['24 hours', '48 hours', '3 business days', '1 week'],
        default: '3 business days',
        required: true,
        helpText: 'How long before a non-response is flagged as overdue.',
        group: 'Preferences',
      },
      {
        key: 'trackingContext',
        label: 'Project and relationship context (optional)',
        type: 'multiline',
        required: false,
        helpText: 'Describe the current priority projects and key external relationships. Claude will use this to calibrate which overdue items to escalate vs. gently nudge.',
        group: 'Preferences',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Follow-up tracker template and message guide',
        purpose:
          'A fillable tracker template and ready-to-adapt follow-up message templates so ' +
          'every pending item is visible and every follow-up hits the right tone.',
        kind: 'starter',
        content: `# Follow-up Tracker Template

## Status tracker
| # | Item / Subject | Owner or Recipient | Date sent | Due date | Days out | Status | Action |
|---|---------------|-------------------|-----------|----------|----------|--------|--------|
| 1 | [Description] | [Name] | [Date] | [Date or TBD] | [N] | Pending / Responded / Overdue | Follow up / Escalate / No action |

---

## Follow-up message templates

### First reminder — Concise and friendly
Subject: Quick follow-up — [Original subject]

Hi [Name],

Just following up on my note from [date] regarding [topic]. Wanted to make sure it didn't get buried.

[One sentence on what you need and by when.]

Thanks so much — let me know if you have any questions.

[Executive name]

---

### Second reminder — Professional and direct
Subject: Following up — [Original subject] [Date reference]

[Name],

I wanted to follow up once more on [topic]. This is now [N] days outstanding and we have a deadline of [date].

Could you confirm your position / share the document / confirm attendance by [date]?

Thank you.

[Executive name]

---

### Formal escalation
Subject: URGENT: Response needed — [Original subject]

Dear [Name],

I am following up on behalf of [Executive name] on the matter of [topic], originally sent on [date] and followed up on [date].

We require a response by [date] to avoid [consequence]. Please treat this as time-sensitive.

If there is a blocker on your end, please let us know immediately so we can assist.

[Executive name] / [Assistant name] on behalf of [Executive name]

---

## Escalation criteria
Escalate immediately if:
- Deadline is within 24–48 hours with no response
- The item involves a board, legal, financial, or regulatory commitment
- Non-response creates a risk to a client relationship or contract
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'executive-assistant-follow-up-tracker-scenario-1',
        title: 'Draft follow-ups for unresponsive vendors',
        userInput:
          'I sent proposals to three vendors on Monday: Apex Logistics, CoreTech, and BluePrint Consulting. ' +
          'It\'s now Thursday and none have responded. ' +
          'Draft follow-up emails for each and flag which should be escalated.',
        expectedBehavior:
          'Claude should produce a status tracker showing all three vendors as overdue (3+ business days) ' +
          'and draft a follow-up email for each in the configured style. If no hard deadline was given, ' +
          'it should note the absence of a deadline and ask the user whether any of the three should be ' +
          'treated as time-sensitive for escalation purposes. No fabricated details about the proposals.',
        mustContain: ['Apex Logistics', 'CoreTech', 'follow-up'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'executive-assistant-follow-up-tracker-scenario-2',
        title: 'Chase overdue post-meeting action items',
        userInput:
          'After last Tuesday\'s board meeting, we had 7 action items assigned to 5 different people. ' +
          'I need to check which are overdue and draft polite but firm reminders for the owners who haven\'t reported back.',
        expectedBehavior:
          'Claude should ask for or work with the list of action items if provided. It should flag all items ' +
          'as overdue against the configured escalation window (e.g., 3 business days since last Tuesday). ' +
          'It should draft reminders for each owner who has not reported back, using the configured follow-up style, ' +
          'and identify any items that should be escalated based on their stakes (e.g., board commitments).',
        mustContain: ['board meeting', 'action items', 'overdue'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 10. Event Coordination Notes ────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-executive-assistant-event-coordination-notes-v1',
    slug: 'executive-assistant-event-coordination-notes',
    name: 'Event Coordination Notes',
    tagline: 'Build vendor checklists, run-of-show documents, and coordination notes for any event',
    description:
      'Takes the event purpose, format, attendee count, and key requirements and produces a ' +
      'complete coordination package: a pre-event checklist, a run-of-show timeline, a vendor ' +
      'contact sheet, and an on-the-day logistics brief. Flags gaps and decisions still outstanding.',
    role: 'Executive Assistant',
    industry: 'Operations',
    tags: ['event-coordination', 'executive-support', 'operations', 'logistics', 'planning'],
    category: 'operations',
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

    instructionTemplate: `You prepare event coordination notes and checklists for {{executiveName}}.

Event type: {{eventType}}

Expected attendees: {{attendeeCount}}

{{#if budgetRange}}
Approximate budget: {{budgetRange}}
{{/if}}

When given an event date, purpose, and key requirements, produce a coordination package with:
1. Pre-event checklist — tasks organized by how far in advance they must be completed (6+ weeks, 4 weeks, 2 weeks, 1 week, day before, day-of)
2. Vendor checklist — category, vendor name (or TBD), contact, deliverable, and confirmation status
3. Run-of-show — a timestamped schedule from setup through close-out
4. Open decisions — items that need sign-off before the event can proceed

Scale recommendations for space, catering, and AV to the {{attendeeCount}} size. Flag any requirement that is unrealistic for the {{eventType}} given the budget or timeline provided.

Rules:
1. Do not confirm or book vendors autonomously — you produce planning documents for review.
2. Flag any logistical gap: insufficient lead time, missing decision, or a vendor category with no named supplier.
3. Use placeholders ("TBD" / "To be confirmed") for anything not yet decided rather than inventing details.
4. Keep all executive and company event information confidential; never fabricate costs or vendor commitments.`,

    variables: [
      {
        key: 'executiveName',
        label: 'Executive\'s name',
        type: 'text',
        required: true,
        helpText: 'The executive sponsoring or hosting the event.',
        group: 'About the executive',
      },
      {
        key: 'eventType',
        label: 'Event type',
        type: 'select',
        options: [
          'Internal team event',
          'Client-facing event',
          'Board meeting',
          'Conference or summit',
          'Offsite retreat',
        ],
        required: true,
        helpText: 'The category of event. This determines the planning checklist and formality level.',
        group: 'Event details',
      },
      {
        key: 'attendeeCount',
        label: 'Expected attendees',
        type: 'select',
        options: ['Under 10', '10–25', '26–50', '51–100', 'Over 100'],
        required: true,
        helpText: 'Used to scale venue, catering, and AV recommendations.',
        group: 'Event details',
      },
      {
        key: 'budgetRange',
        label: 'Approximate budget (optional)',
        type: 'text',
        required: false,
        helpText: 'E.g. "$5,000" or "up to $20,000." Claude will flag requirements that are unlikely to fit the budget.',
        group: 'Event details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Event coordination reference card',
        purpose:
          'A master planning checklist, vendor sheet template, and run-of-show skeleton ' +
          'so every event starts from a complete planning baseline.',
        kind: 'starter',
        content: `# Event Coordination Reference Card

## Planning timeline (work backwards from event date)
| Lead time | Tasks |
|-----------|-------|
| 6+ weeks | Confirm date and venue; set budget; draft guest list; identify vendors |
| 4 weeks | Send invitations; confirm catering; book AV/tech; arrange travel for out-of-towners |
| 2 weeks | Confirm all RSVPs; finalize run-of-show; send pre-read materials |
| 1 week | Confirm vendor delivery times; prepare name badges, materials, signage |
| Day before | Venue walk-through; confirm catering count; test AV; prepare on-site kit |
| Day of | Set up; greet vendors; manage run-of-show; designated contact for issues |

---

## Vendor checklist template
| Category | Vendor | Contact | Deliverable | Confirmed? | Notes |
|----------|--------|---------|-------------|-----------|-------|
| Venue | [Name] | [Phone/email] | Room for [N], setup [time] | Yes / No | |
| Catering | [Name] | | [Menu, dietary], served at [time] | | |
| AV / Tech | [Name] | | [Projector, mics, Zoom setup] | | |
| Photography | [Name] | | [Hours, deliverables] | | |
| Decor / signage | [Name] | | | | |

---

## Run-of-show skeleton
| Time | Activity | Owner | Notes |
|------|----------|-------|-------|
| [Time] | Venue opens / setup begins | [Coordinator] | |
| [Time] | Catering arrives | | |
| [Time] | AV check | | |
| [Time] | Guests arrive / registration | | |
| [Time] | Welcome / opening remarks | [Executive name] | |
| [Time] | [Main program] | | |
| [Time] | Networking / meal | | |
| [Time] | Close / thank-you | | |
| [Time] | Venue clear | | |

---

## RSVP tracking format
| Name | Organization | RSVP status | Dietary note | Special requirements |
|------|-------------|-------------|--------------|----------------------|
| | | Yes / No / TBC | | |

## Common attendee-count benchmarks
- Under 10: boardroom; no formal AV; simple catering
- 10–25: conference room or small private dining; lavalier mic optional
- 26–50: mid-size event space; full AV recommended; buffet or plated
- 51–100: hotel ballroom or event venue; full AV required; professional catering
- Over 100: conference-grade venue; dedicated AV vendor; event manager recommended
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'executive-assistant-event-coordination-notes-scenario-1',
        title: 'Coordinate a leadership offsite',
        userInput:
          'Coordinate a Q4 leadership offsite for 20 people, two days in mid-November. ' +
          'We need a venue within 90 minutes of NYC, catered meals, AV setup for presentations, ' +
          'and one team-building activity. Budget is roughly $15,000.',
        expectedBehavior:
          'Claude should produce a pre-event checklist (with tasks bucketed by lead time), a vendor checklist ' +
          'covering venue, catering, AV, and team-building activity (with TBD placeholders for unconfirmed vendors), ' +
          'and a two-day run-of-show outline. It should flag that $15,000 for 20 people over two days is approximately ' +
          '$750/person and note which items are most likely to strain the budget (venue + catering). ' +
          'Open decisions (venue selection, team-building activity type) should be listed.',
        mustContain: ['offsite', 'venue', 'catered'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'executive-assistant-event-coordination-notes-scenario-2',
        title: 'Plan a client appreciation dinner',
        userInput:
          'Help me build coordination notes for our annual client appreciation dinner next month. ' +
          'Around 40 clients, formal seated dinner, downtown hotel ballroom. ' +
          'I need a run-of-show, vendor checklist, and RSVP tracking format.',
        expectedBehavior:
          'Claude should produce all three requested documents: a run-of-show with timestamped slots ' +
          '(arrival, cocktail hour, seated dinner, speeches, close), a vendor checklist covering venue, ' +
          'catering, AV, and florals/décor, and an RSVP tracking table. It should flag the one-month lead time ' +
          'as tight for a 40-person formal event and note which tasks are most time-sensitive (venue confirmation, ' +
          'catering headcount, invitations).',
        mustContain: ['client appreciation', 'dinner', 'RSVP'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },
];
