import type { Setup } from '@/lib/setup/types';

export const projectManagerSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-project-manager-v1',
  slug: 'project-manager',
  name: 'Project Manager',
  tagline: 'Status reports, risk logs, and project plans, structured for how your team actually works',
  description:
    'Configure Claude as a senior project manager who knows your project, team size, and methodology. ' +
    'It drafts status reports, breaks down deliverables, surfaces risks early, and writes stakeholder ' +
    'updates pitched at the right level of detail, whether that\'s the executive team or your delivery crew.',
  role: 'Project Manager',
  industry: "Technology",
  tags: ['project-management', 'planning', 'risk-management', 'stakeholder-communication', 'operations'],
  category: 'operations',
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

  instructionTemplate: `You are a senior project manager supporting the {{projectName}} project, working with a team of {{teamSize}} people using {{methodology}}.

Your responsibilities:
- Help plan and structure work: break deliverables into tasks, identify dependencies, flag scope creep before it becomes a problem, and keep estimates realistic.
- Draft project documentation: charters, status reports, risk logs, decision records, and meeting agendas.
- Write stakeholder communications calibrated to {{stakeholderLevel}}, adjusting the level of detail, terminology, and framing to match what that audience needs.
- Surface risks and blockers early, with a named owner and a concrete mitigation recommendation for each.

{{#if hasProjectBrief}}
The project brief and supporting background materials are in the knowledge files. Read them before making any recommendations so your advice fits the actual scope, constraints, and goals of {{projectName}} rather than a generic project.
{{/if}}

Methodology: {{methodology}}

Apply the conventions of {{methodology}} when suggesting processes, ceremonies, and artifact formats. If the user's situation does not fit a textbook {{methodology}} practice, say so and suggest a pragmatic adaptation rather than forcing a poor fit.

When writing status updates and reports, calibrate depth to {{stakeholderLevel}}:
- Executives and sponsors: headline status, key decisions needed, risks requiring their attention, no task-level detail.
- Cross-functional teams and department managers: workstream progress, dependencies, and blockers, enough to coordinate.
- External clients: progress against milestones, next steps, and any decisions or inputs required from them.
- Delivery team: task assignments, priorities, and blockers, specific and actionable.

Rules:
1. Be honest about schedule and scope. Do not soften estimates to sound optimistic, flag risk with a clear reason and a mitigation option.
2. When you identify a dependency or risk, always name the owner and the earliest point at which a decision is needed.
3. Scope changes must be logged: what changed, who requested it, who approved it, and what the impact is on timeline, budget, or quality.
4. Keep meeting agendas tight, every agenda item needs an owner, a time box, and a clear objective (decision, update, or discussion).
5. When the team has {{teamSize}} people, keep overhead low, recommend only the artifacts and ceremonies that a team of this size actually needs.`,

  variables: [
    {
      key: 'projectName',
      label: 'Project name',
      type: 'text',
      required: true,
      helpText:
        'The name of the project or program. Claude uses this in all documentation headers and reports it drafts.',
      group: 'About your project',
    },
    {
      key: 'teamSize',
      label: 'Team size',
      type: 'number',
      required: true,
      helpText:
        'The number of people actively working on the project (not including stakeholders or sponsors). Claude uses this to scale its recommendations appropriately.',
      group: 'About your project',
    },
    {
      key: 'methodology',
      label: 'Project methodology',
      type: 'select',
      options: ['Agile / Scrum', 'Kanban', 'Waterfall', 'Hybrid (Agile + Waterfall)'],
      default: 'Agile / Scrum',
      required: true,
      helpText:
        'Pick the methodology your team follows. Claude will use the right terminology, ceremonies, and artifact formats for this approach.',
      group: 'How you work',
    },
    {
      key: 'stakeholderLevel',
      label: 'Primary stakeholder audience',
      type: 'select',
      options: [
        'Executive / C-suite',
        'Department managers',
        'Cross-functional delivery team',
        'External client',
      ],
      default: 'Department managers',
      required: true,
      helpText:
        'Who you communicate project status to most often. Claude will default to this audience when drafting updates, you can ask for a different audience in any specific request.',
      group: 'Communication',
    },
    {
      key: 'hasProjectBrief',
      label: 'Do you have a project brief or charter to share?',
      type: 'boolean',
      default: false,
      required: false,
      helpText:
        'Turn this on if you will upload a project brief, charter, or scope document. Claude will read it before making recommendations so its advice fits the real project constraints.',
      group: 'Project context',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Project management templates',
      purpose:
        'Standard templates for the most common project artifacts: status report, risk log, ' +
        'decision record, and meeting agenda. Claude fills these in when drafting documentation.',
      kind: 'starter',
      content: `# Project Management Templates

## Weekly status report
**Project:** [Name]
**Reporting period:** [Date range]
**Overall status:** [Green / Amber / Red], [One-sentence reason for the status]

### Progress this week
- [Milestone or deliverable], [% complete or done/in progress/not started]
- [Milestone or deliverable], [status]

### Planned for next week
- [Task or deliverable], Owner: [Name]
- [Task or deliverable], Owner: [Name]

### Risks and blockers
| Risk / Blocker | Impact | Owner | Mitigation / Next step | Due |
|----------------|--------|-------|------------------------|-----|
| [Description] | High / Med / Low | [Name] | [Action] | [Date] |

### Decisions needed
| Decision | Options | Decision owner | Deadline |
|----------|---------|----------------|----------|
| [Description] | A / B | [Name] | [Date] |

---

## Risk log entry
**Risk ID:** [e.g. R-007]
**Date identified:** [Date]
**Description:** [What could go wrong, one sentence]
**Likelihood:** High / Medium / Low
**Impact:** High / Medium / Low
**Risk score:** [High × High = Critical, etc.]
**Owner:** [Name]
**Mitigation plan:** [What will be done to reduce likelihood or impact]
**Contingency plan:** [What to do if the risk materializes]
**Status:** Open / Mitigated / Closed
**Last updated:** [Date]

---

## Decision record
**Decision ID:** [e.g. D-012]
**Date:** [Date]
**Decision:** [What was decided, one sentence]
**Made by:** [Name or group]
**Context:** [Why this decision was needed, 2–3 sentences]
**Options considered:**
- Option A: [Description], [Pros / Cons]
- Option B: [Description], [Pros / Cons]
**Rationale:** [Why the chosen option was selected]
**Impact on scope / timeline / budget:** [Note any changes]
**Open questions:** [Anything still unresolved]

---

## Meeting agenda
**Meeting:** [Title]
**Date/time:** [Date, time, location or video link]
**Facilitator:** [Name]
**Attendees:** [List]

| # | Topic | Type | Owner | Time |
|---|-------|------|-------|------|
| 1 | [Topic] | Decision / Update / Discussion | [Name] | [X min] |
| 2 | [Topic] | Decision / Update / Discussion | [Name] | [X min] |

**Pre-read:** [Any documents attendees should review beforehand]
**Parking lot:** [Topics raised but not on agenda, defer to next meeting or separate discussion]
`,
      required: true,
    },
    {
      name: 'Project brief',
      purpose:
        'Upload your project brief, charter, or scope document here so Claude can give advice ' +
        'specific to your project\'s actual goals, constraints, and timeline.',
      kind: 'user-provided',
      guidance:
        'Paste or attach your project brief or charter. At a minimum, include: the project objective, ' +
        'key deliverables and their due dates, out-of-scope items, key stakeholders and their roles, ' +
        'known constraints (budget, headcount, dependencies on other teams), and any risks already identified. ' +
        'A one-page description is enough if you do not have a formal charter.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'project-manager-scenario-status-report',
      title: 'Draft a weekly status report',
      userInput:
        'Draft a status report for the week. We completed the user research phase on time. ' +
        'The wireframe review is in progress and running two days behind because we are waiting on feedback from the design team. ' +
        'The development kickoff is still on track for next Monday.',
      expectedBehavior:
        'Claude should produce a status report in the standard format with an overall status of Amber ' +
        '(given the wireframe delay), a progress section covering each item, next week\'s planned work, ' +
        'and a risk or blocker entry for the design team feedback dependency with a named owner field and a suggested next step. ' +
        'The language should match the configured stakeholder level.',
      mustContain: ['wireframe', 'design', 'development'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'project-manager-scenario-risk-log',
      title: 'Log and assess a newly identified risk',
      userInput:
        'We just found out that our main third-party API vendor is being acquired. ' +
        'We don\'t know yet if the API will keep working after the acquisition closes in 60 days. ' +
        'Add this to the risk log and recommend what we should do.',
      expectedBehavior:
        'Claude should create a complete risk log entry with likelihood and impact rated as at least Medium, ' +
        'a mitigation plan (e.g. contact the vendor for a commitment, identify a backup API), ' +
        'and a contingency plan (what to do if the API goes down). ' +
        'It should also recommend a clear next action with an owner and a deadline given the 60-day window.',
      mustContain: ['API', 'vendor', 'acquisition'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'project-manager-scenario-task-breakdown',
      title: 'Break a deliverable into tasks',
      userInput:
        'I need to break down the deliverable "Launch the new customer portal" into tasks my team can pick up in our next sprint. ' +
        'The portal includes a login page, a dashboard showing account history, and a support ticket form.',
      expectedBehavior:
        'Claude should produce a task breakdown covering each major component, login page, dashboard, and support ticket form, ' +
        'with sub-tasks, suggested owners (role-level, not names), effort estimates as story points or T-shirt sizes, ' +
        'and any dependencies called out explicitly. ' +
        'Tasks should be sized small enough to complete within a sprint.',
      mustContain: ['login', 'dashboard', 'portal'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
