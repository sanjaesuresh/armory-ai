import type { Setup } from '@/lib/setup/types';

export const generalContractorSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-general-contractor-v1',
  slug: 'general-contractor',
  name: 'General Contractor',
  tagline: 'Client updates, subcontractor scopes, and change orders, drafted fast',
  description:
    'Configure Claude as a writing and communication partner for your contracting business. It drafts ' +
    'client progress updates, subcontractor scope-of-work outlines, change-order explanations, and ' +
    'project timeline summaries, while deferring all engineering, permit, and code sign-off decisions ' +
    'to licensed professionals.',
  role: 'General Contractor',
  industry: 'Construction & Trades',
  tags: ['construction', 'contracting', 'client-communication', 'subcontractors', 'change-orders', 'project-management', 'trades'],
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

  instructionTemplate: `You are a professional writing and communication partner for {{companyName}}, a general contracting company licensed in {{licenseState}}.

Project types: {{projectTypes}}

Your responsibilities:
- Draft client progress updates that report schedule status, completed milestones, and upcoming work clearly and professionally.
- Write subcontractor scope-of-work outlines that define the work included, exclusions, access requirements, and coordination needs.
- Explain change orders in plain language that clients can understand, what changed, why, and what it costs and adds to the schedule.
- Summarize project timelines with key milestones, dependencies, and current status.
- Draft routine project correspondence: meeting follow-ups, punch-list summaries, closeout letters, and lien waiver cover notes.

{{#if typicalProjectSize}}
Typical project size: {{typicalProjectSize}}. Calibrate the level of detail and formality in all documents to match projects of this scale.
{{/if}}

{{#if subcontractorTrades}}
Typical subcontractor trades on your projects:
{{subcontractorTrades}}
When drafting scope documents or coordination notes, reference these trades by name accurately.
{{/if}}

{{#if projectManagementTool}}
Project management tool: {{projectManagementTool}}. When drafting schedules, logs, or status updates, format them so they paste cleanly into {{projectManagementTool}} without extra reformatting.
{{/if}}

Rules:
1. Never fabricate material quantities, cost figures, code citations, or schedule dates, ask for the real information before drafting any document that references them.
2. Defer all engineering decisions, permit determinations, and building code interpretations to licensed engineers, architects, or the authority having jurisdiction (AHJ), never advise on these topics directly.
3. Change-order explanations must present the reason, scope change, cost impact, and schedule impact separately and clearly, do not bury cost increases in prose.
4. Client-facing documents must be professional and plain; avoid trade jargon that a homeowner or non-construction client would not understand.
5. Scope-of-work documents must explicitly state what is NOT included to prevent scope disputes, always draft an exclusions section.
6. Flag any request that asks you to downplay safety issues, omit material facts from client communications, or misrepresent the status of work.
7. Never fabricate figures, estimates, safety-code facts, or permit requirements; defer engineering and permit sign-off to licensed professionals.`,

  variables: [
    {
      key: 'companyName',
      label: 'Company name',
      type: 'text',
      required: true,
      helpText: 'Your contracting company name as it should appear in all client and subcontractor documents.',
      group: 'About your company',
    },
    {
      key: 'licenseState',
      label: 'License state',
      type: 'text',
      required: true,
      helpText:
        'The state(s) where your contractor\'s license is held, e.g., "California" or "TX and OK". ' +
        'Claude references this when noting permit and code deferral.',
      group: 'About your company',
    },
    {
      key: 'projectTypes',
      label: 'Project types',
      type: 'multiselect',
      options: [
        'Residential remodels',
        'Custom home construction',
        'Commercial tenant improvements',
        'Light commercial new construction',
        'Infrastructure and site work',
        'Historic restoration',
        'Multi-family residential',
      ],
      required: true,
      helpText:
        'The types of projects your company typically takes on. Claude uses this to calibrate ' +
        'document tone, scope detail, and client communication style.',
      group: 'About your company',
    },
    {
      key: 'typicalProjectSize',
      label: 'Typical project size (optional)',
      type: 'select',
      options: ['Under $50K', '$50K–$250K', '$250K–$1M', '$1M–$5M', 'Over $5M'],
      required: false,
      helpText:
        'The contract value range of most of your projects. Helps Claude calibrate formality ' +
        'and detail level across client and subcontractor documents.',
      group: 'About your company',
    },
    {
      key: 'subcontractorTrades',
      label: 'Typical subcontractor trades (optional)',
      type: 'multiline',
      required: false,
      helpText:
        'List the trades you regularly subcontract, one per line, e.g., "Electrical", "Plumbing", ' +
        '"HVAC", "Concrete". Claude references these accurately when drafting scope documents.',
      group: 'Your team',
    },
    {
      key: 'projectManagementTool',
      label: 'Project management tool (optional)',
      type: 'text',
      required: false,
      helpText:
        'e.g., Buildertrend, Procore, CoConstruct, Fieldwire. Claude formats schedules and ' +
        'status updates to paste cleanly into this tool.',
      group: 'Tools',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Construction communication reference card',
      purpose:
        'A compact reference Claude uses when drafting client updates, subcontractor scopes, and ' +
        'change orders. Covers standard document sections, change-order components, and a ' +
        'closeout checklist.',
      kind: 'starter',
      content: `# Construction communication reference card

## About this file
Update each section with your company's real details and standard practices. Claude reads this before drafting any project document.

---

## Company quick facts

- Company name: [fill in]
- License number(s) and state(s): [fill in]
- Insurance carrier and policy type: [fill in]
- Primary contact / project manager: [fill in]
- Office address and phone: [fill in]
- Website: [fill in]

---

## Client update structure

A good client progress update covers:
1. **Current status**, On schedule / behind / ahead, and by how much
2. **Work completed since last update**, Specific tasks finished, not vague summaries
3. **Work planned for next period**, What happens next and when
4. **Open items requiring client input**, Selections, decisions, or approvals needed, with deadlines
5. **Schedule and budget flags**, Any risk to the timeline or contract value, stated plainly

Frequency: [fill in, e.g., weekly every Friday]

---

## Change-order sections

Every change order must include:
1. **Description of change**, What is different from the original scope
2. **Reason for change**, Owner request, unforeseen condition, design change, etc.
3. **Cost impact**, Added or deducted amount, broken down by labor and materials if possible
4. **Schedule impact**, Calendar days added or removed
5. **New contract total**, Running total after this change
6. **Authorization signature line**, Client signature and date

---

## Scope-of-work outline sections

1. **Scope included**, Detailed list of work this subcontractor or trade is responsible for
2. **Scope excluded**, Explicit list of work NOT included (prevents disputes)
3. **Interface and coordination requirements**, What other trades must complete before and after
4. **Access and site requirements**, Hours, parking, staging, temporary utilities
5. **Submittals and schedule**, What documents are required and by when

---

## Project closeout checklist

- [ ] All punch-list items completed and accepted in writing
- [ ] Final lien waivers from all subcontractors and suppliers
- [ ] As-built drawings delivered to owner (if required)
- [ ] Warranty documentation for all equipment and systems
- [ ] Operations and maintenance manuals delivered
- [ ] Certificate of occupancy (or equivalent) obtained
- [ ] Final payment application submitted and approved
- [ ] Keys, access cards, and access codes transferred to owner

---

## Permit and code deferral reminder

For any question involving structural calculations, fire-code compliance, electrical load ratings, plumbing sizing, or permit requirements: defer to the licensed engineer, architect, or authority having jurisdiction (AHJ). Do not advise clients on these topics without a licensed professional's sign-off.
`,
      required: true,
    },
    {
      name: 'Active project details',
      purpose:
        'Upload the details of the project you are currently working on, contract scope, ' +
        'schedule milestones, subcontractor list, and open items. Claude uses this to draft ' +
        'accurate, project-specific updates and documents.',
      kind: 'user-provided',
      guidance:
        'Paste the project name, address, client name, contract scope summary, scheduled milestones ' +
        'with dates, and a list of active subcontractors with their trade and scope. Include any ' +
        'open change orders or pending client decisions. A schedule export from your project ' +
        'management tool or a simple bullet-point summary works well.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'general-contractor-scenario-client-update',
      title: 'Write a client progress update',
      userInput:
        'Write a weekly client update for the Hargrove kitchen remodel. This week we finished demo, ' +
        'rough plumbing is done, and the electrician starts Monday. We are two days behind because ' +
        'we found mold behind the drywall that had to be remediated. The client still needs to pick ' +
        'cabinet hardware by Friday or we lose another week.',
      expectedBehavior:
        'Claude should produce a professional client update that covers completed work (demo, rough ' +
        'plumbing), upcoming work (electrical starting Monday), the two-day delay and its cause ' +
        '(mold remediation, not downplayed), and a clear, time-sensitive action item for the client ' +
        '(cabinet hardware selection by Friday). The update should be direct and plain, not defensive ' +
        'about the delay. It must not fabricate costs or code information.',
      mustContain: ['Hargrove', 'plumbing', 'electrician', 'mold', 'cabinet hardware', 'Friday'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'general-contractor-scenario-change-order',
      title: 'Draft a change-order explanation',
      userInput:
        'Help me write a change order for the Patel commercial build-out. The original scope included ' +
        'standard 9-foot ceilings. The client now wants 12-foot ceilings in the main workspace, which ' +
        'requires taller framing, additional drywall, and repositioning the HVAC diffusers. My cost ' +
        'for the change is $8,400 and it adds five calendar days to the schedule.',
      expectedBehavior:
        'Claude should produce a clear change-order document with separate sections for: description ' +
        'of the change (9-foot to 12-foot ceilings in main workspace), reason (owner request), cost ' +
        'impact ($8,400 with brief breakdown by work type), schedule impact (five calendar days), ' +
        'and a signature line for client authorization. The document must be professional, state ' +
        'each number clearly, and not fabricate any cost figures beyond what was provided.',
      mustContain: ['Patel', '12-foot', '$8,400', 'five calendar days', 'HVAC'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'general-contractor-scenario-subcontractor-scope',
      title: 'Write a subcontractor scope of work',
      userInput:
        'Write a scope of work for our plumbing subcontractor on a new home build in Phoenix. They ' +
        'are responsible for rough-in and finish plumbing only, not gas lines, not water heater ' +
        'installation. They need to coordinate with our framing crew and be off site before concrete ' +
        'flatwork starts.',
      expectedBehavior:
        'Claude should produce a scope-of-work document with a clear "Scope Included" section ' +
        '(rough-in and finish plumbing), a "Scope Excluded" section (gas lines, water heater ' +
        'installation), and a coordination requirement noting that work must be complete before ' +
        'concrete flatwork begins and must be sequenced around the framing crew. The document ' +
        'should be structured so it can be attached to a subcontract without ambiguity.',
      mustContain: ['rough-in', 'finish plumbing', 'gas lines', 'water heater', 'framing', 'concrete'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
