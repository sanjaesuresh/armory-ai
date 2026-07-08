import type { Setup } from '@/lib/setup/types';

export const businessAnalystSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-business-analyst-v1',
  slug: 'business-analyst',
  name: 'Business Analyst',
  tagline: 'Turn messy requirements into clear specs, user stories, and process maps',
  description:
    'Configure Claude as a senior Business Analyst for your project. It writes well-structured ' +
    'requirements documents and user stories with acceptance criteria, describes process flows, ' +
    'drafts gap analyses between current and future state, and composes data-request lists that ' +
    'give stakeholders exactly what they need to decide.',
  role: 'Business Analyst',
  industry: 'Consulting & Professional Services',
  tags: [
    'business-analysis',
    'requirements',
    'user-stories',
    'process-mapping',
    'gap-analysis',
    'stakeholder-management',
    'agile',
  ],
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

  instructionTemplate: `You are a senior Business Analyst working at {{organization}}, focusing on {{domain}} initiatives and following a {{methodology}} delivery approach.

Your responsibilities:
- Write requirements documents and user stories with clear, testable acceptance criteria.
- Describe current-state and future-state process flows in prose or structured step-by-step format, ready to hand off for diagramming.
- Produce gap analyses that compare as-is and to-be states, naming the specific capability, data, or process gaps that must be closed.
- Compile data-request lists and data-definition tables that give engineers and data teams precisely what they need without ambiguity.
- Facilitate requirements traceability: every requirement should be linkable to a business objective.

Your preferred requirements format is {{requirementsFormat}}. Use this format for all requirements and specifications unless the user asks for something different.

{{#if stakeholders}}
Primary stakeholders on this project: {{stakeholders}}. When writing requirements, keep this audience in mind — business-facing language for business stakeholders, technical precision for engineering and architecture stakeholders.
{{/if}}

{{#if processNotation}}
Preferred process notation: {{processNotation}}. Describe process steps in a structure that maps cleanly to this notation so the user can diagram it without rewriting.
{{/if}}

Rules:
1. Never invent business rules, data definitions, or system constraints. If you do not have enough information, ask one clarifying question before drafting.
2. Every acceptance criterion must be testable — it must have a clear pass or fail state, not a subjective descriptor like "faster" or "better."
3. When a requirement is ambiguous, flag it with an "OPEN QUESTION" label before proceeding — do not resolve ambiguity silently.
4. Gap analyses must distinguish between gaps that block launch and gaps that can be deferred — do not treat all gaps as equal.
5. Never fabricate data volumes, performance baselines, or system metrics. Note when numbers are placeholders and must be confirmed by the user.
6. Keep all project details, business rules, and stakeholder information shared in this conversation confidential.`,

  variables: [
    {
      key: 'organization',
      label: 'Organization or project name',
      type: 'text',
      required: true,
      helpText: 'The company, department, or project this BA work is for — appears in document headers and requirements IDs.',
      group: 'About the project',
    },
    {
      key: 'domain',
      label: 'Business domain',
      type: 'select',
      options: [
        'IT & systems',
        'finance & accounting',
        'operations & supply chain',
        'HR & workforce',
        'sales & CRM',
        'customer service',
        'marketing & digital',
        'compliance & risk',
      ],
      default: 'IT & systems',
      required: true,
      helpText: 'The functional area your current project covers. Claude uses this to frame requirements in domain-appropriate language.',
      group: 'About the project',
    },
    {
      key: 'methodology',
      label: 'Delivery methodology',
      type: 'select',
      options: ['Agile / Scrum', 'SAFe', 'Kanban', 'Waterfall', 'Hybrid'],
      default: 'Agile / Scrum',
      required: true,
      helpText: 'Your team\'s delivery approach — determines how Claude structures work items, sprints, and documentation artifacts.',
      group: 'About the project',
    },
    {
      key: 'requirementsFormat',
      label: 'Requirements format',
      type: 'select',
      options: ['User stories (As a / I want / So that)', 'Use cases', 'Business Requirements Document (BRD)', 'Feature specification'],
      default: 'User stories (As a / I want / So that)',
      required: true,
      helpText: 'The format your team uses for capturing requirements. Claude will produce all requirements in this format by default.',
      group: 'About the project',
    },
    {
      key: 'stakeholders',
      label: 'Primary stakeholders (optional)',
      type: 'multiselect',
      options: [
        'Business sponsor',
        'Product owner',
        'Engineering team',
        'Data / BI team',
        'Compliance / Legal',
        'End users',
        'Procurement',
      ],
      required: false,
      helpText: 'Select the main groups whose needs this project must address. Claude tailors language and detail level when drafting for each group.',
      group: 'About the project',
    },
    {
      key: 'processNotation',
      label: 'Process notation preference (optional)',
      type: 'select',
      options: ['BPMN 2.0', 'Swim-lane flowchart', 'Linear step list', 'Decision tree'],
      required: false,
      helpText: 'If you use a specific notation for process diagrams, select it here. Claude will describe processes in a structure that maps to this format.',
      group: 'Preferences',
    },
  ],

  knowledgeFiles: [
    {
      name: 'BA standards and templates reference card',
      purpose:
        'A compact reference Claude uses when writing requirements, acceptance criteria, process ' +
        'flows, and gap analyses. Covers the user story format, AC quality checklist, gap analysis ' +
        'structure, and data-request table template.',
      kind: 'starter',
      content: `# BA standards and templates reference card

## About this file
This card captures the standards and templates for this project. Update each section to match your team's conventions. Claude reads this before producing any requirements artifact.

---

## User story format

As a [role], I want [feature or capability] so that [business benefit or outcome].

### Acceptance criteria quality checklist
- [ ] Each criterion is testable (clear pass/fail — not "faster," "easier," or "better")
- [ ] Each criterion names a specific user action or specific system state
- [ ] Edge cases and error conditions appear as separate criteria
- [ ] Performance criteria include a number (e.g., "response within 2 seconds for 95% of requests")
- [ ] No implementation detail in the acceptance criteria — describe WHAT, not HOW

---

## Use case structure (when used instead of user stories)

- **Use case ID:** UC-###
- **Name:** verb + noun (e.g., "Submit expense report")
- **Primary actor:** who initiates the interaction
- **Trigger:** what starts the use case
- **Preconditions:** what must be true before this can begin
- **Main success scenario:** numbered steps (actor action → system response)
- **Extensions / alternate flows:** numbered branch points (step X.a, X.b)
- **Postconditions:** what is true when the use case completes successfully

---

## Gap analysis structure

For each capability area:

| Item | As-is (current state) | To-be (target state) | Gap | Launch blocker? | Owner |
|------|-----------------------|----------------------|-----|-----------------|-------|
| [capability] | [describe] | [describe] | [name the gap] | Yes / No / Defer | [TBD] |

Distinguish:
- **Launch blockers** — must be closed before go-live
- **Post-launch backlog** — important but not on the critical path
- **Nice-to-have / future phase** — explicitly deferred

---

## Data-request list template

| # | Data element | Source system | Format | Frequency | Owner | Notes |
|---|--------------|---------------|--------|-----------|-------|-------|
| 1 | [name] | [system] | [type, e.g., CSV / API] | [one-time / daily] | [team] | [edge cases, nulls] |

Always include:
- Null / missing value handling expectations
- Known data quality issues
- Volume estimates (rows per period)

---

## Requirements traceability — minimum viable

Each requirement should reference:
- Business objective it supports (OBJ-###)
- Epic or initiative it belongs to
- Priority (Must Have / Should Have / Could Have / Won't Have)
`,
      required: true,
    },
    {
      name: 'Current project context',
      purpose:
        'Upload the project charter, problem statement, or existing requirements baseline here. ' +
        'Claude uses this to keep all new requirements aligned with the project scope and to avoid ' +
        'suggesting work that has already been decided or descoped.',
      kind: 'user-provided',
      guidance:
        'Paste the project scope statement, a list of in-scope and out-of-scope items, any ' +
        'existing requirements that have already been agreed, and the key business objectives ' +
        'this project must satisfy. A project charter or initiative brief works well. Keep it ' +
        'to two pages or less — focused context is more useful than a full specification dump.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'business-analyst-scenario-user-stories',
      title: 'Write user stories for an expense approval workflow',
      userInput:
        'We are building a new expense approval workflow for Centrex Corp. Employees submit ' +
        'expense reports, their direct manager approves or rejects them, and Finance then does ' +
        'a final review before reimbursement. Expenses over $500 require a second approval from ' +
        'the department head. Write user stories covering these three roles with acceptance criteria.',
      expectedBehavior:
        'Claude should produce user stories for three actor roles: the employee submitting ' +
        'the expense, the manager approving or rejecting, and Finance doing the final review. ' +
        'It should also capture the $500 threshold as a separate story or acceptance criterion. ' +
        'Each story must follow the "As a / I want / So that" format and include numbered, ' +
        'testable acceptance criteria. Claude should not invent additional workflow steps or ' +
        'system behaviours beyond what was described.',
      mustContain: ['Centrex Corp', 'expense', 'manager', '$500'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'business-analyst-scenario-gap-analysis',
      title: 'Produce a gap analysis for a CRM migration',
      userInput:
        'Northbrook Financial is migrating from their legacy CRM to Salesforce. The legacy ' +
        'system handles contact management, activity logging, and basic opportunity tracking. ' +
        'The new Salesforce implementation will also add pipeline forecasting and marketing ' +
        'campaign attribution. What gaps should we expect in data, process, and capability? ' +
        'Which ones are launch blockers?',
      expectedBehavior:
        'Claude should produce a structured gap analysis covering at least three categories: ' +
        'data gaps (fields, data quality, migration mapping), process gaps (workflows that change), ' +
        'and capability gaps (features not in the legacy system). Each gap should be assessed as ' +
        'a launch blocker or post-launch backlog item with a brief rationale. Claude should not ' +
        'fabricate specific data volumes, field names, or Salesforce configuration details — it ' +
        'should flag where the user needs to confirm specifics.',
      mustContain: ['Northbrook Financial', 'Salesforce', 'legacy CRM', 'launch blocker'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'business-analyst-scenario-data-request',
      title: 'Draft a data-request list for a reporting project',
      userInput:
        'We are building a monthly sales performance dashboard for Vantage Retail. The dashboard ' +
        'needs to show total revenue by region, units sold by SKU, year-over-year growth, and ' +
        'average order value. The data lives in their ERP system and their e-commerce platform. ' +
        'Build a data-request list for the data engineering team.',
      expectedBehavior:
        'Claude should produce a structured data-request table listing each required data element: ' +
        'its name, the source system (ERP or e-commerce platform), expected format, update frequency ' +
        '(monthly), and any relevant notes such as null-handling, data quality concerns, or ' +
        'join-key requirements. It should cover all four metrics mentioned (revenue by region, ' +
        'units by SKU, YoY growth, average order value). Claude should flag fields where assumptions ' +
        'were made and the user must confirm.',
      mustContain: ['Vantage Retail', 'revenue', 'SKU', 'ERP'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
