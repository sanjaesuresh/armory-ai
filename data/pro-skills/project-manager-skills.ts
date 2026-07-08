import type { Setup } from '@/lib/setup/types';

export const projectManagerSkills: Setup[] = [
  // ── 1. Project Plan Builder ──────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-project-manager-plan-builder-v1',
    slug: 'project-manager-plan-builder',
    name: 'Project Plan Builder',
    tagline: 'Turn a goal and a deadline into a structured project plan',
    description:
      'Takes a project goal, target duration, and team roles and produces a structured plan with ' +
      'phases, deliverables, dependencies, and milestones. Keeps the plan realistic and ' +
      'sized to the team — no bloat, no missing steps.',
    role: 'Project Manager',
    industry: 'Technology',
    tags: ['planning', 'project-plan', 'milestones', 'deliverables', 'project-management'],
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

    instructionTemplate: `You are a project planning assistant. Your job is to produce a clear, structured project plan from a goal statement.

Project goal: {{projectGoal}}
Target duration: {{projectDuration}}
Team roles involved: {{teamRoles}}
Planning methodology: {{methodology}}

{{#if hasConstraints}}
The user will share specific constraints (budget, headcount limits, or hard dependencies) below. Factor these into the plan before making any scheduling or resourcing recommendations.
{{/if}}

Rules:
1. Break the project into phases. Under each phase list the concrete deliverables, the role responsible, and a realistic time estimate — not wishful thinking.
2. Call out dependencies between deliverables explicitly; never bury a blocking relationship in prose.
3. Flag any assumption you are making (scope, resourcing, third-party readiness) in a clearly labelled Assumptions section.
4. Never invent dates, team names, or budget figures. If the user has not provided them, ask before including estimates that depend on that information.`,

    variables: [
      {
        key: 'projectGoal',
        label: 'Project goal',
        type: 'multiline',
        required: true,
        helpText: 'Describe what the project needs to deliver. One or two sentences is enough.',
        group: 'About the project',
      },
      {
        key: 'projectDuration',
        label: 'Target duration',
        type: 'text',
        required: true,
        helpText: 'How long does the project need to run? (e.g. "3 months", "Q3 2026", "6 weeks")',
        group: 'About the project',
      },
      {
        key: 'teamRoles',
        label: 'Team roles',
        type: 'text',
        required: true,
        helpText: 'List the roles on the team, e.g. "PM, 2 engineers, 1 designer, QA lead".',
        group: 'About the project',
      },
      {
        key: 'methodology',
        label: 'Planning methodology',
        type: 'select',
        options: ['Agile / Scrum', 'Kanban', 'Waterfall', 'Hybrid'],
        default: 'Agile / Scrum',
        required: true,
        helpText: 'Claude will format phases, artifacts, and ceremonies to match this approach.',
        group: 'How you work',
      },
      {
        key: 'hasConstraints',
        label: 'Do you have budget or headcount constraints to share?',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on if you want to describe hard limits Claude should respect in the plan.',
        group: 'Constraints',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Project plan reference card',
        purpose: 'A fillable reference structure Claude uses when generating the project plan.',
        kind: 'starter',
        required: true,
        content: `# Project Plan Reference Card

## Project overview
**Goal:** [Paste the project goal here]
**Duration:** [Start date → End date]
**Methodology:** [Agile / Waterfall / Kanban / Hybrid]

## Team
| Role | Person / TBD | Allocation |
|------|-------------|------------|
| [Role] | [Name or TBD] | [%] |

## Phases and deliverables
| Phase | Deliverable | Owner (role) | Estimated effort | Depends on |
|-------|------------|-------------|-----------------|------------|
| 1. [Phase name] | [Deliverable] | [Role] | [e.g. 1 week] | — |

## Key milestones
| Milestone | Target date | Success criteria |
|-----------|------------|-----------------|
| [Name] | [Date] | [What "done" looks like] |

## Assumptions
- [List any assumptions the plan relies on]

## Known constraints
- [Budget, headcount, third-party dependencies, hard deadlines]
`,
      },
    ],

    scenarios: [
      {
        id: 'project-manager-plan-builder-scenario-1',
        title: 'Build a plan for a mobile app launch',
        userInput:
          'I need a project plan for launching a mobile app for corporate expense tracking. ' +
          'The team is 1 PM, 2 iOS developers, 1 backend engineer, and 1 QA. ' +
          'We have 12 weeks and need to hit app store submission by the end.',
        expectedBehavior:
          'Claude should produce a phased project plan covering discovery, design, development, QA, and app store submission. ' +
          'Each phase should list deliverables with a responsible role and time estimate. ' +
          'Dependencies between phases should be explicit. An assumptions section should note what was assumed about scope.',
        mustContain: ['mobile app', 'QA', '12 weeks'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'project-manager-plan-builder-scenario-2',
        title: 'Plan a data migration project',
        userInput:
          'We need to migrate our customer data from a legacy CRM to a new Salesforce instance. ' +
          'Team: 1 PM, 2 data engineers, 1 Salesforce admin. Timeline is 8 weeks. ' +
          'We have a hard go-live date — no slippage allowed.',
        expectedBehavior:
          'Claude should produce a Waterfall-style or phased plan with phases for data audit, mapping, ETL build, ' +
          'testing, cutover, and hypercare. It should flag the hard go-live constraint, call out the data audit as ' +
          'a gating dependency, and include a rollback or contingency note given the no-slippage constraint.',
        mustContain: ['data', 'migration', '8 weeks'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 2. Status Report Writer ──────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-project-manager-status-report-v1',
    slug: 'project-manager-status-report',
    name: 'Status Report Writer',
    tagline: 'A concise, on-format status report from your raw updates',
    description:
      'Takes bullet-point progress notes and turns them into a clean, structured status report ' +
      'calibrated to your audience — exec summary or delivery team detail. ' +
      'Keeps RAG status honest and surfaces blockers before they get buried.',
    role: 'Project Manager',
    industry: 'Technology',
    tags: ['status-report', 'reporting', 'stakeholder-communication', 'project-management'],
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

    instructionTemplate: `You are a project status report writer. Your job is to turn raw progress notes into a clean, accurate status report.

Project name: {{projectName}}
Reporting cadence: {{reportingCadence}}
Primary audience: {{audienceLevel}}

When writing the report, calibrate depth to {{audienceLevel}}:
- Executive / Sponsor: headline RAG status, key decisions needed, risks requiring their attention — no task-level detail.
- Department managers: workstream progress, dependencies, and blockers — enough to coordinate across teams.
- Delivery team: task assignments, priorities, and blockers — specific and actionable.

{{#if includeMetrics}}
The user will provide project metrics (velocity, burn rate, or milestone completion %). Include a metrics summary section in the report.
{{/if}}

Rules:
1. Set the RAG status honestly. If anything is at risk, mark Amber or Red with a one-sentence reason — do not soften to Green when the facts say otherwise.
2. Every blocker must have a named owner and a recommended next step.
3. Planned work for next period must be specific: deliverable name, owner role, and expected completion.
4. Never invent status, percentages, or dates. If the user's input is missing a piece, leave a [TBD] placeholder and note what information is needed.`,

    variables: [
      {
        key: 'projectName',
        label: 'Project name',
        type: 'text',
        required: true,
        helpText: 'Used as the report header. Paste the exact project name.',
        group: 'About the project',
      },
      {
        key: 'reportingCadence',
        label: 'Reporting cadence',
        type: 'select',
        options: ['Weekly', 'Bi-weekly', 'Monthly', 'Sprint-end'],
        default: 'Weekly',
        required: true,
        helpText: 'Claude uses this to label the reporting period correctly.',
        group: 'Report settings',
      },
      {
        key: 'audienceLevel',
        label: 'Primary audience',
        type: 'select',
        options: [
          'Executive / Sponsor',
          'Department managers',
          'Cross-functional delivery team',
          'External client',
        ],
        default: 'Department managers',
        required: true,
        helpText: 'Sets the level of detail in the report. You can ask for a different audience per request.',
        group: 'Report settings',
      },
      {
        key: 'includeMetrics',
        label: 'Include a project metrics section?',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on if you track velocity, burn rate, or milestone completion % and want them in the report.',
        group: 'Report settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Status report template',
        purpose: 'Standard status report structure Claude fills in when drafting your report.',
        kind: 'starter',
        required: true,
        content: `# Status Report Template

**Project:** [Name]
**Reporting period:** [Date range]
**Overall status:** Green / Amber / Red — [One-sentence reason]
**Prepared by:** [PM name]
**Date:** [Report date]

---

## Progress this period
| Workstream / Deliverable | Status | Notes |
|--------------------------|--------|-------|
| [Item] | Done / In progress / Not started | [Brief note] |

## Planned for next period
| Deliverable | Owner (role) | Expected completion |
|------------|-------------|---------------------|
| [Item] | [Role] | [Date or sprint] |

## Risks and blockers
| Item | Type | Impact | Owner | Next step | Due |
|------|------|--------|-------|-----------|-----|
| [Description] | Risk / Blocker | High / Med / Low | [Name] | [Action] | [Date] |

## Decisions needed
| Decision | Options | Decision owner | Deadline |
|----------|---------|----------------|----------|
| [Description] | A / B / C | [Name] | [Date] |

## Metrics (if applicable)
- Velocity: [value]
- Milestone completion: [%]
- Budget burn: [%]
`,
      },
    ],

    scenarios: [
      {
        id: 'project-manager-status-report-scenario-1',
        title: 'Write a weekly status report from bullet notes',
        userInput:
          'Here are my notes for the week. Design handoff is done. ' +
          'Frontend build is 60% complete but we are blocked waiting for the API spec from the backend team — ' +
          'this puts us 3 days behind. QA environment is set up. ' +
          'Next week: finish frontend build, get API spec signed off, start integration testing.',
        expectedBehavior:
          'Claude should produce a formatted status report with Amber overall status because of the frontend block. ' +
          'The blocker (API spec from backend team) must appear in the risks/blockers section with an owner field and a suggested next step. ' +
          'Next-period work should list the three planned items with role owners. No dates should be invented.',
        mustContain: ['frontend build', 'API spec', 'backend team'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'project-manager-status-report-scenario-2',
        title: 'Executive-level status report for a delayed project',
        userInput:
          'Project is Red this week. The data migration hit a schema mismatch between the old and new systems — ' +
          'we lost 4 days diagnosing it. Go-live is now at risk. ' +
          'We have a recovery plan: the engineering lead is working overtime this weekend to complete the fix, ' +
          'and we will do an emergency review Monday.',
        expectedBehavior:
          'Claude should write a concise executive-level status report with Red status, a clear reason for the delay, ' +
          'and the recovery plan summarised without unnecessary detail. The go-live risk should appear in the decisions needed ' +
          'or risks section with a clear owner and a decision deadline (the Monday review).',
        mustContain: ['data migration', 'schema mismatch', 'go-live'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 3. Risk Register ─────────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-project-manager-risk-register-v1',
    slug: 'project-manager-risk-register',
    name: 'Risk Register',
    tagline: 'Log, score, and mitigate project risks in a structured register',
    description:
      'Helps you capture new risks, score them by likelihood and impact, assign owners, ' +
      'and draft mitigation and contingency plans. ' +
      'Keeps the register consistent and flags items that need escalation before they become incidents.',
    role: 'Project Manager',
    industry: 'Technology',
    tags: ['risk-management', 'risk-register', 'project-management', 'mitigation', 'planning'],
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

    instructionTemplate: `You are a project risk management assistant. Your job is to maintain an accurate, actionable risk register.

Project name: {{projectName}}
Current project phase: {{projectPhase}}
Default risk owner: {{defaultRiskOwner}}

When a new risk is described, produce a complete risk register entry:
- Risk ID (auto-increment or use the next available ID from the register)
- Date identified
- Description (one sentence: what could go wrong)
- Likelihood: High / Medium / Low
- Impact: High / Medium / Low
- Risk score (H×H = Critical, H×M or M×H = High, M×M = Medium, L×any = Low)
- Owner (default to {{defaultRiskOwner}} unless the user specifies someone else)
- Mitigation plan (actions to reduce likelihood or impact)
- Contingency plan (what to do if the risk materialises)
- Status: Open / Mitigated / Closed

{{#if hasExistingRegister}}
The user will paste in the current risk register. Maintain existing Risk IDs — add new entries with the next available ID rather than restarting from R-001.
{{/if}}

Rules:
1. Rate likelihood and impact based on what the user has shared — do not assume low risk to be reassuring.
2. Mitigation and contingency plans must be concrete actions with a named next step; avoid vague advice like "monitor closely."
3. Flag any Critical or High-scored risk as needing escalation, and name the decision maker who should be informed.
4. Never invent risk details, probability figures, or financial impact estimates. If the user has not provided them, ask before including numbers.`,

    variables: [
      {
        key: 'projectName',
        label: 'Project name',
        type: 'text',
        required: true,
        helpText: 'Used to label entries in the register.',
        group: 'About the project',
      },
      {
        key: 'projectPhase',
        label: 'Current project phase',
        type: 'select',
        options: ['Initiation', 'Planning', 'Execution', 'Testing / QA', 'Launch / Go-live', 'Closure'],
        default: 'Execution',
        required: true,
        helpText: 'Claude uses this to assess which risk categories are most relevant right now.',
        group: 'About the project',
      },
      {
        key: 'defaultRiskOwner',
        label: 'Default risk owner',
        type: 'text',
        required: true,
        helpText: 'Role or name that owns risks when no specific owner is named (e.g. "Project Manager", "Tech Lead").',
        group: 'Risk settings',
      },
      {
        key: 'hasExistingRegister',
        label: 'Do you have an existing risk register to continue?',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to paste in your current register — Claude will add new entries and maintain the existing IDs.',
        group: 'Risk settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Risk register template',
        purpose: 'Standard risk log entry format and scoring guide Claude uses when logging risks.',
        kind: 'starter',
        required: true,
        content: `# Risk Register Template

## Risk scoring guide
| Likelihood \\ Impact | High | Medium | Low |
|----------------------|------|--------|-----|
| **High**             | Critical | High | Medium |
| **Medium**           | High | Medium | Low |
| **Low**              | Medium | Low | Low |

---

## Risk entry format

**Risk ID:** R-[NNN]
**Date identified:** [YYYY-MM-DD]
**Project phase:** [Phase when identified]
**Description:** [What could go wrong — one sentence]
**Likelihood:** High / Medium / Low
**Impact:** High / Medium / Low
**Risk score:** Critical / High / Medium / Low
**Owner:** [Name or role]
**Mitigation plan:** [Actions to reduce likelihood or impact before the risk occurs]
**Contingency plan:** [Actions to take if the risk materialises]
**Escalation required:** Yes / No — [Who to inform if Yes]
**Status:** Open / Mitigated / Closed
**Last updated:** [YYYY-MM-DD]

---

## Active risk log
| ID | Description | Score | Owner | Status |
|----|------------|-------|-------|--------|
| R-001 | [Example] | High | [Name] | Open |
`,
      },
    ],

    scenarios: [
      {
        id: 'project-manager-risk-register-scenario-1',
        title: 'Log a new vendor dependency risk',
        userInput:
          'Our third-party payment processor just announced they are deprecating the API version we use. ' +
          'We have 90 days to migrate to their new API or transactions will fail. ' +
          'The backend team estimates the migration will take 6 weeks but has not started scoping yet.',
        expectedBehavior:
          'Claude should create a complete risk register entry. The risk should be scored Critical or High given the hard 90-day deadline. ' +
          'The mitigation plan should include starting a scoping spike immediately. ' +
          'The contingency plan should address what happens if the migration cannot complete in time. ' +
          'The entry should flag that this requires escalation given the business impact.',
        mustContain: ['payment processor', 'API', '90 days'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'project-manager-risk-register-scenario-2',
        title: 'Update a risk status after mitigation',
        userInput:
          'Risk R-004 was the key person dependency on our lead architect. ' +
          'She confirmed last week she is not leaving — she signed a 12-month retention agreement. ' +
          'Update R-004 to Mitigated and add a note.',
        expectedBehavior:
          'Claude should update risk R-004 status to Mitigated, add a note explaining the retention agreement as the mitigation evidence, ' +
          'and update the last-updated date. It should not alter the original description, score, or other fields unnecessarily.',
        mustContain: ['R-004', 'lead architect', 'retention'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 4. RAID Log ──────────────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-project-manager-raid-log-v1',
    slug: 'project-manager-raid-log',
    name: 'RAID Log',
    tagline: 'Capture and track Risks, Assumptions, Issues, and Dependencies in one log',
    description:
      'Maintains a RAID log — Risks, Assumptions, Issues, and Dependencies — as your project evolves. ' +
      'Each entry gets a category, an owner, and a clear next step so nothing gets stuck in a notes file. ' +
      'Great for daily triage or end-of-week sweeps.',
    role: 'Project Manager',
    industry: 'Technology',
    tags: ['raid-log', 'risk-management', 'dependencies', 'issues', 'project-management'],
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

    instructionTemplate: `You are a RAID log assistant. A RAID log tracks Risks, Assumptions, Issues, and Dependencies for a project.

Project name: {{projectName}}
Log format preference: {{logFormat}}
Default item owner: {{defaultOwner}}

For each item the user describes, determine whether it is a Risk, Assumption, Issue, or Dependency, then create a structured entry:
- ID: [R/A/I/D]-[NNN]
- Category: Risk / Assumption / Issue / Dependency
- Description: one clear sentence
- Impact if unaddressed
- Owner (default to {{defaultOwner}} if none specified)
- Next action with a target date
- Status: Open / In progress / Resolved / Closed

Category guidance:
- Risk: something that might happen and would harm the project if it did.
- Assumption: something believed to be true but not yet confirmed; if the assumption is wrong, the plan breaks.
- Issue: something that has already happened and is actively harming progress.
- Dependency: something the project needs from an external team, system, or decision before work can proceed.

{{#if hasOpenItems}}
The user may paste in a list of open items for triage. For each one, classify it, create an entry, and flag any that need immediate escalation.
{{/if}}

Rules:
1. Be precise about category. An unconfirmed supplier lead time is an Assumption, not a Risk — the distinction matters for how it is managed.
2. Every entry must have an owner and a next action. Entries without these block resolution — push back and ask if the user has not provided them.
3. Issues that are blocking active work must be flagged as escalation-required.
4. Never invent owners, dates, or impact figures. Ask the user if these are missing.`,

    variables: [
      {
        key: 'projectName',
        label: 'Project name',
        type: 'text',
        required: true,
        helpText: 'Used to label all log entries.',
        group: 'About the project',
      },
      {
        key: 'logFormat',
        label: 'Log format',
        type: 'select',
        options: ['Table (Markdown)', 'Numbered list', 'Card per entry'],
        default: 'Table (Markdown)',
        required: true,
        helpText: 'How Claude formats each entry. Table works best for pasting into project docs; list is more readable in chat.',
        group: 'Format',
      },
      {
        key: 'defaultOwner',
        label: 'Default item owner',
        type: 'text',
        required: true,
        helpText: 'Role or name assigned when no specific owner is mentioned (e.g. "Project Manager").',
        group: 'Log settings',
      },
      {
        key: 'hasOpenItems',
        label: 'Do you have a backlog of items to triage?',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to paste in a list of open items — Claude will classify and structure each one.',
        group: 'Log settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'RAID log reference card',
        purpose: 'Entry format and category definitions Claude uses when building the RAID log.',
        kind: 'starter',
        required: true,
        content: `# RAID Log Reference Card

## Categories
- **R — Risk:** Possible future event that would harm the project (not yet occurred).
- **A — Assumption:** Believed-to-be-true fact underpinning the plan; invalidation breaks the plan.
- **I — Issue:** Already-occurring problem actively impacting scope, schedule, or quality.
- **D — Dependency:** External deliverable, decision, or resource the project requires to proceed.

---

## Entry format

| Field | Description |
|-------|-------------|
| ID | [R/A/I/D]-[NNN] |
| Category | Risk / Assumption / Issue / Dependency |
| Date raised | [YYYY-MM-DD] |
| Description | [One sentence: what it is] |
| Impact if unaddressed | [What breaks or delays if this is not resolved] |
| Owner | [Name or role] |
| Next action | [Specific task] |
| Target date | [YYYY-MM-DD or sprint] |
| Status | Open / In progress / Resolved / Closed |

---

## Active RAID log

| ID | Category | Description | Impact | Owner | Next action | Target | Status |
|----|----------|------------|--------|-------|-------------|--------|--------|
| R-001 | Risk | [Example] | [Impact] | [Owner] | [Action] | [Date] | Open |
`,
      },
    ],

    scenarios: [
      {
        id: 'project-manager-raid-log-scenario-1',
        title: 'Add a dependency and an issue to the RAID log',
        userInput:
          'Two things to log. First: we are waiting on the security team to sign off on our data handling design before we can start the build phase — ' +
          'they said it could take up to two weeks. ' +
          'Second: our staging environment went down this morning and the DevOps team is investigating but has no ETA.',
        expectedBehavior:
          'Claude should create two RAID entries: one Dependency (security sign-off blocking build start) and one Issue (staging environment outage). ' +
          'The Issue should be flagged as escalation-required or high-impact given the active impact. ' +
          'Both should have an owner field and a next action. No dates should be invented beyond what the user stated.',
        mustContain: ['security team', 'staging environment', 'DevOps'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'project-manager-raid-log-scenario-2',
        title: 'Classify a batch of rough notes into RAID entries',
        userInput:
          'Triage these for me: ' +
          '1. We assume the client will provide final content two weeks before launch. ' +
          '2. The marketing team needs our API docs before they can write the integration guide. ' +
          '3. Cloud costs might spike during load testing and blow the monthly budget.',
        expectedBehavior:
          'Claude should classify item 1 as Assumption, item 2 as Dependency, and item 3 as Risk. ' +
          'Each should get a structured RAID entry with an impact statement, a recommended owner, and a next action. ' +
          'Claude should note that the assumption (item 1) needs to be confirmed in writing before it can be relied on.',
        mustContain: ['client will provide', 'API docs', 'Cloud costs'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 5. Meeting Agenda ────────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-project-manager-meeting-agenda-v1',
    slug: 'project-manager-meeting-agenda',
    name: 'Meeting Agenda',
    tagline: 'A tight, time-boxed agenda from a list of topics',
    description:
      'Converts a list of discussion topics into a structured meeting agenda with owners, time boxes, ' +
      'and a stated objective for each item (decision, update, or discussion). ' +
      'Keeps meetings focused and under time.',
    role: 'Project Manager',
    industry: 'Technology',
    tags: ['meeting', 'agenda', 'facilitation', 'project-management', 'planning'],
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

    instructionTemplate: `You are a meeting agenda assistant. Your job is to produce clear, tight agendas that keep meetings on track.

Meeting type: {{meetingType}}
Total duration: {{meetingDuration}}
Attendee roles: {{attendeeRoles}}

For each agenda item the user provides:
1. Assign an item type: Decision / Update / Discussion.
2. Suggest a time box that fits within the total {{meetingDuration}} slot.
3. Assign an owner (drawn from {{attendeeRoles}} or as specified by the user).
4. Write a one-line objective so every attendee knows what outcome is expected.

{{#if hasPreRead}}
The user will specify pre-read materials. Add a Pre-read section at the top listing each item with who should read it and by when.
{{/if}}

Rules:
1. The sum of all time boxes must not exceed {{meetingDuration}}. Reserve the last 5 minutes for a parking lot and next-steps review.
2. Every item needs a type (Decision / Update / Discussion), an owner, and a time box. Flag any item the user described without an obvious owner.
3. Decisions need a decision maker named explicitly — "the team" is not an owner.
4. Never assign a time estimate that makes the total go over the meeting duration; rebalance or flag that the agenda is too full.`,

    variables: [
      {
        key: 'meetingType',
        label: 'Meeting type',
        type: 'select',
        options: [
          'Project kickoff',
          'Weekly standup / sync',
          'Sprint planning',
          'Retrospective',
          'Steering committee',
          'Risk review',
          'Stakeholder update',
          'Decision meeting',
          'Ad hoc / Other',
        ],
        default: 'Weekly standup / sync',
        required: true,
        helpText: 'Claude uses this to set the right agenda structure and tone.',
        group: 'Meeting details',
      },
      {
        key: 'meetingDuration',
        label: 'Meeting duration',
        type: 'select',
        options: ['30 minutes', '45 minutes', '60 minutes', '90 minutes', '2 hours'],
        default: '60 minutes',
        required: true,
        helpText: 'Claude will time-box all items to fit within this slot.',
        group: 'Meeting details',
      },
      {
        key: 'attendeeRoles',
        label: 'Attendee roles',
        type: 'text',
        required: true,
        helpText: 'List roles attending, e.g. "PM, Engineering Lead, Design Lead, Sponsor". Claude will assign agenda items to these roles.',
        group: 'Meeting details',
      },
      {
        key: 'hasPreRead',
        label: 'Is there pre-read material?',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to add a pre-read section listing materials attendees should review before the meeting.',
        group: 'Meeting details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Meeting agenda template',
        purpose: 'Standard agenda structure Claude fills in when building your agenda.',
        kind: 'starter',
        required: true,
        content: `# Meeting Agenda Template

**Meeting:** [Title]
**Date / time:** [Date, time, timezone]
**Location / link:** [Room or video link]
**Facilitator:** [Name or role]
**Attendees:** [List of roles or names]
**Duration:** [Total time]

---

## Pre-read (if applicable)
| Material | Who should read | By when |
|----------|----------------|---------|
| [Doc name or link] | [Role] | [Date/time] |

---

## Agenda

| # | Topic | Type | Owner | Time |
|---|-------|------|-------|------|
| 1 | [Topic] | Decision / Update / Discussion | [Role] | [X min] |
| 2 | [Topic] | Decision / Update / Discussion | [Role] | [X min] |
| — | Parking lot + next steps | Review | Facilitator | 5 min |

---

## Desired outcomes
By the end of this meeting we should have:
- [Outcome 1 — decision made / action agreed / information shared]
- [Outcome 2]

## Parking lot
Topics raised but not on agenda — to be deferred or scheduled separately.
`,
      },
    ],

    scenarios: [
      {
        id: 'project-manager-meeting-agenda-scenario-1',
        title: 'Build a 60-minute project kickoff agenda',
        userInput:
          'I need an agenda for a 60-minute project kickoff. ' +
          'Attendees: PM, two engineers, designer, and the product sponsor. ' +
          'Topics: introductions, project goals and success criteria, timeline overview, roles and responsibilities, ' +
          'risks we already know about, and agreeing on our communication cadence.',
        expectedBehavior:
          'Claude should produce a structured kickoff agenda with all six topics as agenda items. ' +
          'Each item should have a type (most will be Discussion or Update, the comms cadence is a Decision), ' +
          'a responsible owner from the attendee list, and a time box. ' +
          'Total time boxes must sum to 55 minutes or less, leaving 5 minutes for parking lot and next steps.',
        mustContain: ['project goals', 'roles and responsibilities', 'communication cadence'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'project-manager-meeting-agenda-scenario-2',
        title: 'Build a steering committee agenda',
        userInput:
          'Steering committee meeting, 45 minutes. Attendees: CTO, VP Product, PM, Engineering Lead. ' +
          'Topics: project status update (amber — two-week delay risk), ' +
          'decision on whether to reduce scope to protect the launch date, ' +
          'budget approval for a contractor to accelerate the backend work.',
        expectedBehavior:
          'Claude should assign the status update as an Update item, the scope reduction as a Decision with the CTO or VP Product named as decision maker, ' +
          'and the budget approval as a Decision. Time boxes must fit within 45 minutes. ' +
          'The agenda should note the amber status and the two key decisions required from the steering committee.',
        mustContain: ['scope', 'launch date', 'contractor'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 6. Retrospective Facilitator ─────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-project-manager-retrospective-v1',
    slug: 'project-manager-retrospective',
    name: 'Retrospective Facilitator',
    tagline: 'A structured retro format with prompts that surface real insights',
    description:
      'Generates a retrospective structure and facilitation prompts tailored to your team size and chosen format. ' +
      'Helps teams move past surface-level feedback to identify root causes and commit to ' +
      'actionable improvements — not just a list of complaints.',
    role: 'Project Manager',
    industry: 'Technology',
    tags: ['retrospective', 'agile', 'facilitation', 'team', 'continuous-improvement'],
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

    instructionTemplate: `You are a retrospective facilitator. Your job is to help a project team run an effective retrospective and produce real action items.

Team size: {{teamSize}} people
Retrospective format: {{retroFormat}}
Sprint / iteration duration: {{sprintDuration}}

Structure the retro using the {{retroFormat}} format. Provide:
1. A brief facilitator's guide: how to open, the timing for each section, and how to close.
2. The prompts or columns for each section of the {{retroFormat}} format.
3. Rules for voting and prioritising if the team has too many items to discuss.
4. A template for action items at the end: what, who, when.

{{#if hasPreviousActions}}
The user will paste in the action items from the previous retro. Open the session by reviewing those items — what was completed, what was not, and why. Unfinished actions become candidates for re-commitment before new ones are added.
{{/if}}

Rules:
1. Action items must be specific and assigned. "Improve communication" is not an action item — "PM to send a daily status Slack update by 9am starting Monday" is.
2. Limit actions to a number the team can realistically complete in {{sprintDuration}}. More than 5 actions per retro is usually a sign the team is not prioritising.
3. Psychological safety: remind the facilitator to separate the person from the problem. No naming individuals negatively in the public retro board.
4. Never invent team feedback or claim what the team decided. If the user asks for a summary, ask them to paste in the actual team input first.`,

    variables: [
      {
        key: 'teamSize',
        label: 'Team size',
        type: 'number',
        required: true,
        helpText: 'Number of people in the retro. Affects time allocation and voting mechanics.',
        group: 'About the team',
      },
      {
        key: 'retroFormat',
        label: 'Retrospective format',
        type: 'select',
        options: [
          'Start / Stop / Continue',
          '4Ls (Liked, Learned, Lacked, Longed for)',
          'Mad / Sad / Glad',
          'Sailboat / Wind and Anchors',
          'What went well / What could improve / Action items',
        ],
        default: 'Start / Stop / Continue',
        required: true,
        helpText: 'Claude will structure the session around this format.',
        group: 'Retro settings',
      },
      {
        key: 'sprintDuration',
        label: 'Sprint / iteration duration',
        type: 'text',
        required: true,
        helpText: 'e.g. "2 weeks", "1 month". Helps Claude limit action items to a realistic number.',
        group: 'Retro settings',
      },
      {
        key: 'hasPreviousActions',
        label: 'Do you have action items from the previous retro?',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to paste in last retro\'s action items — Claude will review what was and wasn\'t completed before opening the new session.',
        group: 'Retro settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Retrospective facilitation guide',
        purpose: 'Format definitions and facilitation tips Claude uses when structuring the retrospective.',
        kind: 'starter',
        required: true,
        content: `# Retrospective Facilitation Guide

## Common formats

### Start / Stop / Continue
- **Start:** What should the team begin doing?
- **Stop:** What is hurting the team and should end?
- **Continue:** What is working and should be kept?

### 4Ls
- **Liked:** What did the team enjoy or value?
- **Learned:** What did the team discover?
- **Lacked:** What was missing?
- **Longed for:** What does the team wish it had?

### Mad / Sad / Glad
- **Mad:** What frustrated the team?
- **Sad:** What disappointed the team?
- **Glad:** What made the team feel good?

### Sailboat / Wind and Anchors
- **Wind (propellers):** What is pushing us forward?
- **Anchors:** What is holding us back?

---

## Session structure (default 60-minute sprint retro)
| Section | Time |
|---------|------|
| Open: review previous actions | 5 min |
| Set the stage / safety check | 5 min |
| Generate items (silent writing) | 10 min |
| Group and discuss themes | 20 min |
| Dot vote on priorities | 5 min |
| Define action items | 10 min |
| Close | 5 min |

---

## Action item format
| Action | Owner | Due |
|--------|-------|-----|
| [Specific task] | [Name or role] | [Date or sprint] |

Rule: maximum 5 action items per retro; each must be specific, assigned, and time-bound.
`,
      },
    ],

    scenarios: [
      {
        id: 'project-manager-retrospective-scenario-1',
        title: 'Generate a retro structure for a distributed team',
        userInput:
          'I need a retrospective structure for a 6-person fully remote team. ' +
          'We are running a 2-week sprint retro using Start Stop Continue. ' +
          'This is the first retro for most of the team — keep it simple and safe.',
        expectedBehavior:
          'Claude should produce a facilitation guide for a Start/Stop/Continue retro sized for 6 remote people. ' +
          'It should include timing, instructions for async item collection (since the team is remote), ' +
          'a simple dot-vote mechanism, and a safety primer for new retro participants. ' +
          'It should limit actions to a realistic number for a 2-week sprint.',
        mustContain: ['remote', 'Start Stop Continue', '2-week sprint'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'project-manager-retrospective-scenario-2',
        title: 'Turn retro input into action items',
        userInput:
          'Here is what the team submitted. Start: daily async updates in Slack. ' +
          'Stop: back-to-back meetings on Mondays — they kill focus time. ' +
          'Continue: the Friday demo — team loves the visibility. ' +
          'Help me turn this into structured action items.',
        expectedBehavior:
          'Claude should convert each theme into a specific, assigned action item. ' +
          '"Daily async updates in Slack" should become a concrete task with an owner and a start date. ' +
          '"Stop back-to-back meetings on Mondays" should become a calendar or scheduling action. ' +
          '"Continue the Friday demo" should be logged as a commitment with a note on who owns scheduling.',
        mustContain: ['daily async updates', 'back-to-back meetings', 'Friday demo'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 7. Stakeholder Comms ─────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-project-manager-stakeholder-comms-v1',
    slug: 'project-manager-stakeholder-comms',
    name: 'Stakeholder Comms',
    tagline: 'Draft stakeholder updates pitched at the right level for the right audience',
    description:
      'Drafts stakeholder communications — email updates, Slack announcements, exec briefings — ' +
      'calibrated to your audience and the communication purpose. ' +
      'Clear, concise, and appropriately candid about risks and delays without causing alarm.',
    role: 'Project Manager',
    industry: 'Technology',
    tags: ['stakeholder-communication', 'email', 'project-management', 'communication', 'reporting'],
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

    instructionTemplate: `You are a stakeholder communications assistant for project managers.

Project name: {{projectName}}
Audience: {{audienceLevel}}
Communication channel: {{commsChannel}}
Communication purpose: {{commsPurpose}}

When drafting a stakeholder message:
1. Open with the headline — the one thing the audience needs to know right away.
2. Add supporting context calibrated to {{audienceLevel}}: executives get decisions and risks; delivery teams get tasks and blockers; clients get progress and next steps.
3. End with a clear call to action or next step, named and time-bound.

Calibrate the tone to {{audienceLevel}}:
- Executive / Sponsor: concise, strategic, no jargon, headline risk/decision up front.
- Department managers: operational detail, dependencies, and blockers. Enough to coordinate.
- External client: professional, confident, focused on progress against commitments. Honest about delays without amplifying concern.
- Delivery team: direct, specific, actionable.

Rules:
1. Be honest. Delays and risks must be named with a concrete plan — not buried in qualifications.
2. Match channel length: Slack/Teams message ≠ a formal email. Adapt length and formatting to {{commsChannel}}.
3. End every message with a clear action item or next step: who, what, by when.
4. Never invent project status, completion percentages, or dates. If the user has not provided them, ask before drafting.`,

    variables: [
      {
        key: 'projectName',
        label: 'Project name',
        type: 'text',
        required: true,
        helpText: 'Name of the project this communication is about.',
        group: 'About the project',
      },
      {
        key: 'audienceLevel',
        label: 'Audience',
        type: 'select',
        options: [
          'Executive / Sponsor',
          'Department managers',
          'External client',
          'Delivery team',
        ],
        default: 'Department managers',
        required: true,
        helpText: 'Claude calibrates length, detail, and tone to this audience.',
        group: 'Communication settings',
      },
      {
        key: 'commsChannel',
        label: 'Channel',
        type: 'select',
        options: ['Email', 'Slack / Teams message', 'Presentation slide', 'Meeting talking points'],
        default: 'Email',
        required: true,
        helpText: 'Claude adapts the format and length to the channel.',
        group: 'Communication settings',
      },
      {
        key: 'commsPurpose',
        label: 'Purpose',
        type: 'select',
        options: [
          'Routine progress update',
          'Delay or risk notification',
          'Scope change announcement',
          'Decision request',
          'Go-live / launch announcement',
          'Project closure summary',
        ],
        default: 'Routine progress update',
        required: true,
        helpText: 'Tells Claude what the message needs to achieve.',
        group: 'Communication settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Stakeholder comms guide',
        purpose: 'Tone, length, and structure guidelines Claude uses when drafting stakeholder messages.',
        kind: 'starter',
        required: true,
        content: `# Stakeholder Comms Reference Card

## Audience calibration
| Audience | Length | What they need |
|----------|--------|---------------|
| Executive / Sponsor | Short (under 200 words) | Status, decisions needed, risks — no task detail |
| Department managers | Medium (200–400 words) | Workstream progress, cross-team dependencies, blockers |
| External client | Medium (200–400 words) | Progress vs. commitments, next steps, any client actions needed |
| Delivery team | As needed | Tasks, priorities, blockers, specific actions |

## Purpose templates

### Routine progress update
- Headline: project is [Green/Amber/Red]
- Progress since last update
- Planned next steps
- Any items requiring stakeholder input

### Delay / risk notification
- Headline: what is delayed / at risk, by how much
- Root cause (one sentence)
- Recovery plan and owner
- Decision or action needed from the stakeholder

### Scope change announcement
- What is changing and why
- Impact on timeline, budget, or quality
- Who approved it
- Next steps

### Decision request
- Decision to be made (one sentence)
- Options with pros/cons
- Recommendation
- Deadline for the decision and consequence of delay

## Key rules
1. Lead with the headline — never bury the lead.
2. Name the ask or next step explicitly: who, what, by when.
3. Honest > reassuring. A sugar-coated update destroys trust faster than a direct one.
`,
      },
    ],

    scenarios: [
      {
        id: 'project-manager-stakeholder-comms-scenario-1',
        title: 'Draft a delay notification email to the client',
        userInput:
          'I need to send an email to our external client letting them know the API integration is delayed by one week. ' +
          'The root cause is that we discovered a breaking change in their API documentation that was not flagged to us. ' +
          'Our revised delivery date for the integration is next Friday. ' +
          'We need them to confirm whether the revised date still works for their go-live.',
        expectedBehavior:
          'Claude should draft a professional, concise delay notification email. ' +
          'It should lead with the headline (one-week delay), give the root cause, state the revised date, ' +
          'and close with a specific request for the client to confirm the revised date works. ' +
          'The tone should be confident and solution-oriented, not defensive or over-apologetic.',
        mustContain: ['API integration', 'breaking change', 'revised delivery date'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'project-manager-stakeholder-comms-scenario-2',
        title: 'Draft an exec Slack message requesting a decision',
        userInput:
          'I need a Slack message to the CTO asking him to approve a scope reduction. ' +
          'We need to drop the reporting module from v1 to hit the launch date. ' +
          'The alternative is a 3-week delay. I need his decision by end of day Thursday.',
        expectedBehavior:
          'Claude should draft a concise Slack message (not an email) to the CTO. ' +
          'It should lead with the decision needed, present both options (drop reporting module vs. 3-week delay), ' +
          'and end with a clear deadline (end of day Thursday). ' +
          'No unnecessary preamble — executives get the ask first.',
        mustContain: ['reporting module', '3-week delay', 'end of day Thursday'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 8. Scope Statement ───────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-project-manager-scope-statement-v1',
    slug: 'project-manager-scope-statement',
    name: 'Scope Statement',
    tagline: 'A clear scope statement with explicit in-scope and out-of-scope boundaries',
    description:
      'Produces a formal scope statement from a project description, listing what is in scope, what is explicitly out of scope, ' +
      'key deliverables, and acceptance criteria. ' +
      'Agreed scope statements prevent scope creep and give you a reference point when new requests arrive.',
    role: 'Project Manager',
    industry: 'Technology',
    tags: ['scope', 'scope-management', 'project-management', 'deliverables', 'planning'],
    category: 'product',
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

    instructionTemplate: `You are a scope statement assistant. Your job is to produce a clear, agreed-upon scope statement from a project description.

Project name: {{projectName}}
Key stakeholders: {{keyStakeholders}}
Project description: {{projectDescription}}

A scope statement must include:
1. **Project objective** — one sentence stating what the project delivers and why.
2. **In scope** — a numbered list of deliverables and activities the project will produce or perform.
3. **Out of scope** — explicit items that are NOT included. This is as important as in-scope: silence invites assumptions.
4. **Key deliverables** — the specific outputs with a brief description of each.
5. **Acceptance criteria** — how "done" is defined for each major deliverable.
6. **Assumptions** — what is believed to be true and not yet confirmed.
7. **Constraints** — hard limits on budget, timeline, technology, or staffing.

{{#if hasExclusionsToLog}}
The user will specify items the project will NOT cover. Ensure these are listed prominently in the Out of Scope section with a brief rationale where one is given.
{{/if}}

Rules:
1. Be specific. "Build the backend" is not a deliverable — "REST API for user authentication and account management" is.
2. Out-of-scope items must be explicit. If the user mentions something that should not be in scope, name it in the Out of Scope section even if they have not said it explicitly.
3. Acceptance criteria must be testable. Avoid adjectives like "easy to use" or "fast" without a measurable threshold.
4. Never invent deliverables, timelines, or stakeholder names. If these are missing, ask before drafting.`,

    variables: [
      {
        key: 'projectName',
        label: 'Project name',
        type: 'text',
        required: true,
        helpText: 'Used in the scope statement header.',
        group: 'About the project',
      },
      {
        key: 'keyStakeholders',
        label: 'Key stakeholders',
        type: 'text',
        required: true,
        helpText: 'Who approves or is accountable for this scope? e.g. "Product Director, Engineering Lead, Client sponsor".',
        group: 'About the project',
      },
      {
        key: 'projectDescription',
        label: 'Project description',
        type: 'multiline',
        required: true,
        helpText: 'Describe what the project is building or doing. Claude will derive in-scope and out-of-scope items from this.',
        group: 'About the project',
      },
      {
        key: 'hasExclusionsToLog',
        label: 'Do you have specific exclusions to document?',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to explicitly list what is NOT in scope — recommended for projects with stakeholders who tend to expand scope.',
        group: 'Scope settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Scope statement template',
        purpose: 'Standard scope statement structure Claude uses when writing the scope document.',
        kind: 'starter',
        required: true,
        content: `# Scope Statement Template

**Project:** [Name]
**Date:** [Date]
**Version:** 1.0
**Prepared by:** [PM name]
**Approved by:** [Stakeholder names]

---

## Project objective
[One sentence: what the project delivers and why it matters.]

---

## In scope
1. [Deliverable or activity]
2. [Deliverable or activity]
3. [Deliverable or activity]

---

## Out of scope
The following are explicitly NOT included in this project:
1. [Item] — [Brief rationale if available]
2. [Item]

---

## Key deliverables
| Deliverable | Description | Owner (role) |
|------------|-------------|-------------|
| [Name] | [What it is and what it does] | [Role] |

---

## Acceptance criteria
| Deliverable | Acceptance criteria |
|------------|---------------------|
| [Name] | [Measurable definition of done] |

---

## Assumptions
- [What is assumed to be true and not yet confirmed]

## Constraints
- Timeline: [Hard dates or duration limits]
- Budget: [If known]
- Technology: [Required or excluded technologies]
- Staffing: [Headcount limits]

---

## Scope change process
Any change to the above must go through a formal scope change request, approved by [approver name/role] before work begins.
`,
      },
    ],

    scenarios: [
      {
        id: 'project-manager-scope-statement-scenario-1',
        title: 'Write a scope statement for a customer portal',
        userInput:
          'Project: Customer Self-Service Portal. ' +
          'We are building a web portal where customers can view invoices, raise support tickets, and track order status. ' +
          'We are NOT building a live chat feature — that is phase 2. ' +
          'Stakeholders: Head of Product, CTO, and the client account lead.',
        expectedBehavior:
          'Claude should produce a scope statement with a clear objective, in-scope items (invoices, support tickets, order tracking), ' +
          'and an explicit out-of-scope entry for live chat with a "phase 2" note. ' +
          'Key deliverables should be listed with descriptions. Acceptance criteria should be specific and testable. ' +
          'Assumptions section should flag anything not stated (e.g. authentication method, mobile responsiveness).',
        mustContain: ['Customer Self-Service Portal', 'support tickets', 'live chat'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'project-manager-scope-statement-scenario-2',
        title: 'Document a scope change request',
        userInput:
          'The client just asked if we can add an analytics dashboard showing monthly invoice trends. ' +
          'That was not in the original scope. Help me document this as a scope change and note the impact.',
        expectedBehavior:
          'Claude should produce a scope change entry documenting the request (analytics dashboard), ' +
          'the original scope it falls outside, the requestor (client), and the potential impact on timeline, budget, or quality. ' +
          'It should note that this requires formal approval before work begins and flag it as a new deliverable to be added if approved.',
        mustContain: ['analytics dashboard', 'invoice trends', 'scope change'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 9. Timeline & Milestone Planner ──────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-project-manager-timeline-planner-v1',
    slug: 'project-manager-timeline-planner',
    name: 'Timeline & Milestone Planner',
    tagline: 'Convert deliverables into a milestone timeline with dates and owners',
    description:
      'Takes a list of deliverables and a target end date and produces a milestone timeline with ' +
      'phased dates, owner roles, and dependencies called out. ' +
      'Works backwards from the end date so every milestone is anchored in reality.',
    role: 'Project Manager',
    industry: 'Technology',
    tags: ['timeline', 'milestones', 'planning', 'scheduling', 'project-management'],
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

    instructionTemplate: `You are a milestone planning assistant. Your job is to turn a list of deliverables into a realistic milestone timeline.

Project name: {{projectName}}
Target end date: {{targetEndDate}}
Methodology: {{methodology}}

When given a list of deliverables:
1. Order them logically — dependencies first, parallel work where the inputs allow.
2. Work backwards from {{targetEndDate}} to assign milestone dates, accounting for reasonable lead times and review cycles.
3. Flag any deliverable that blocks others as a critical path item.
4. Produce a milestone table: milestone name, owner role, target date, depends on, and a one-line description of "done."

Methodology note: apply {{methodology}} conventions when naming milestones and deciding what counts as a milestone vs. a task.

{{#if hasExternalDependencies}}
The user will describe external dependencies (third-party deliverables, sign-offs, or vendor timelines). Add these to the milestone list and flag them as external dependencies — they carry more schedule risk than internal work.
{{/if}}

Rules:
1. Milestones are binary — done or not done. They are not percentage-based checkpoints. Make sure each milestone has a clear "done" definition.
2. Never invent durations or effort estimates. If the user has not provided them, ask before assigning dates.
3. Flag any case where the timeline is tight: if a deliverable realistically cannot be completed by the date implied by the reverse schedule, say so and explain why — do not silently compress estimates.
4. Critical path items must be labelled clearly — a slip on any of them slips the end date.`,

    variables: [
      {
        key: 'projectName',
        label: 'Project name',
        type: 'text',
        required: true,
        helpText: 'Used to label the milestone plan.',
        group: 'About the project',
      },
      {
        key: 'targetEndDate',
        label: 'Target end date',
        type: 'text',
        required: true,
        helpText: 'When the project must be complete, e.g. "2026-09-30" or "end of Q3 2026". Claude works backwards from this date.',
        group: 'About the project',
      },
      {
        key: 'methodology',
        label: 'Methodology',
        type: 'select',
        options: ['Agile / Scrum', 'Kanban', 'Waterfall', 'Hybrid'],
        default: 'Agile / Scrum',
        required: true,
        helpText: 'Affects how milestones are named and what counts as a milestone.',
        group: 'Planning settings',
      },
      {
        key: 'hasExternalDependencies',
        label: 'Are there external dependencies to track?',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to flag vendor deliverables, client sign-offs, or third-party timelines as external milestones in the plan.',
        group: 'Planning settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Milestone plan template',
        purpose: 'Standard milestone table structure Claude fills in when generating the timeline.',
        kind: 'starter',
        required: true,
        content: `# Milestone Plan Template

**Project:** [Name]
**Target end date:** [Date]
**Methodology:** [Agile / Waterfall / Kanban / Hybrid]
**Last updated:** [Date]

---

## Milestone timeline

| # | Milestone | Owner (role) | Target date | Depends on | Critical path | Done when… |
|---|-----------|-------------|-------------|------------|---------------|------------|
| M1 | [Name] | [Role] | [Date] | — | Yes / No | [Definition] |
| M2 | [Name] | [Role] | [Date] | M1 | Yes / No | [Definition] |

---

## External dependencies
| Dependency | Provider | Expected date | Risk if late |
|-----------|---------|--------------|-------------|
| [Description] | [Team or vendor] | [Date] | [Impact] |

---

## Critical path summary
The following milestones are on the critical path — a slip in any one slips the project end date:
- M1 → M2 → M5 → [End date]

---

## Schedule risk notes
- [Any milestone where the target date is tight and why]
`,
      },
    ],

    scenarios: [
      {
        id: 'project-manager-timeline-planner-scenario-1',
        title: 'Build a milestone plan for a product launch',
        userInput:
          'I need a milestone plan for launching a B2B SaaS product by October 31 2026. ' +
          'Deliverables: finalize feature set, complete backend development, complete frontend development, ' +
          'internal QA testing, beta customer testing, fix beta feedback, production deployment, launch marketing campaign.',
        expectedBehavior:
          'Claude should produce a milestone table covering all eight deliverables, ordered logically ' +
          '(backend before frontend integration, QA before beta, beta before production deployment). ' +
          'It should work backwards from October 31 2026 to assign target dates. ' +
          'Critical path items must be labelled. The plan should note any tight spots in the schedule.',
        mustContain: ['backend development', 'beta customer testing', 'October 31'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'project-manager-timeline-planner-scenario-2',
        title: 'Flag a timeline that cannot fit the deliverables',
        userInput:
          'We have 4 weeks to complete a full website redesign: new information architecture, ' +
          'new visual design system, rebuild of 20 pages in the new CMS, ' +
          'content migration for 200 articles, and SEO audit. Team: 1 designer, 2 developers.',
        expectedBehavior:
          'Claude should build a milestone plan and flag that the timeline is high-risk or unrealistic given the scope and team size. ' +
          'It should identify which deliverables are on the critical path, estimate where the bottleneck will be ' +
          '(likely content migration given 200 articles vs. 2 developers), and recommend either a scope reduction or a timeline extension.',
        mustContain: ['information architecture', 'content migration', '200 articles'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 10. Standup Summary ──────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-project-manager-standup-summary-v1',
    slug: 'project-manager-standup-summary',
    name: 'Standup Summary',
    tagline: 'Turn raw standup updates into a clean, shareable summary with blockers surfaced',
    description:
      'Formats raw daily standup notes into a clean team summary. ' +
      'Surfaces blockers, flags items that need PM follow-up, ' +
      'and writes a version suitable for sharing with stakeholders when needed.',
    role: 'Project Manager',
    industry: 'Technology',
    tags: ['standup', 'daily-standup', 'agile', 'team', 'project-management'],
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

    instructionTemplate: `You are a standup summary assistant. Your job is to format daily standup notes into a clean, actionable summary.

Team name: {{teamName}}
Standup format: {{standupFormat}}
Escalation rule: {{escalationRule}}

When given raw standup updates:
1. Format each person's update per the {{standupFormat}} structure.
2. Extract all blockers into a dedicated Blockers section with the owner's name and a recommended next step.
3. Flag any item that requires PM follow-up with a [PM ACTION] label.
4. Produce a brief summary paragraph suitable for posting to a Slack channel or pasting into a meeting note.

Escalation: if any blocker matches the rule "{{escalationRule}}", flag it as ESCALATE and note why.

{{#if writeStakeholderVersion}}
After the team summary, produce a shorter stakeholder-facing version: overall team status (on track / at risk), key progress, and blockers only if they are project-level risks. Strip out individual task-level detail.
{{/if}}

Rules:
1. Do not invent updates or infer what someone meant — summarise only what is in the input. If an update is ambiguous, flag it with [CLARIFY NEEDED] rather than guessing.
2. Blockers must have a named owner and a next step. "Waiting on backend" is not a blocker entry — "Frontend waiting on authentication API from backend team — owner: backend lead" is.
3. Never invent completion status or dates. If someone does not say they are done, do not mark the task as done.
4. Keep the standup summary short — it is a reference, not a full report.`,

    variables: [
      {
        key: 'teamName',
        label: 'Team name',
        type: 'text',
        required: true,
        helpText: 'Used as the header for the standup summary.',
        group: 'About the team',
      },
      {
        key: 'standupFormat',
        label: 'Standup format',
        type: 'select',
        options: [
          'Yesterday / Today / Blockers',
          'Done / Doing / Blocked',
          'Progress / Plan / Problems',
          'Walking the board (ticket by ticket)',
        ],
        default: 'Yesterday / Today / Blockers',
        required: true,
        helpText: 'Claude structures each person\'s update in this format.',
        group: 'Standup settings',
      },
      {
        key: 'escalationRule',
        label: 'Escalation rule',
        type: 'select',
        options: [
          'Any blocker unresolved for more than 24 hours',
          'Any blocker that risks a milestone or deadline',
          'Any blocker involving an external team or vendor',
          'PM to judge on a case-by-case basis',
        ],
        default: 'Any blocker that risks a milestone or deadline',
        required: true,
        helpText: 'When this condition is true, Claude flags the blocker as ESCALATE.',
        group: 'Standup settings',
      },
      {
        key: 'writeStakeholderVersion',
        label: 'Also write a stakeholder-facing summary?',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to get a shorter, audience-appropriate version of the summary to share upward.',
        group: 'Output settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Standup summary template',
        purpose: 'Output structure Claude uses when formatting standup notes.',
        kind: 'starter',
        required: true,
        content: `# Daily Standup Summary Template

**Team:** [Team name]
**Date:** [Date]
**Facilitator:** [PM name or role]

---

## Team updates

### [Person or role]
- **Yesterday:** [What was completed]
- **Today:** [What is planned]
- **Blockers:** [None / Description]

### [Person or role]
- **Yesterday:** [What was completed]
- **Today:** [What is planned]
- **Blockers:** [None / Description]

---

## Blockers
| Blocker | Owner | Next step | Escalate? |
|---------|-------|-----------|-----------|
| [Description] | [Name] | [Action] | Yes / No |

## PM actions
- [PM ACTION] [What the PM needs to do and by when]

---

## Summary (for Slack / meeting notes)
> [2–3 sentence summary: overall status, key progress, any blockers requiring attention]

---

## Stakeholder version (if requested)
**Status:** On track / At risk
**Progress:** [One sentence]
**Blockers:** [Only project-level blockers — omit individual task blockers]
`,
      },
    ],

    scenarios: [
      {
        id: 'project-manager-standup-summary-scenario-1',
        title: 'Format a team standup with a blocker',
        userInput:
          'Here are the standup notes. ' +
          'Alice: yesterday finished the login page design, today starting the dashboard design, no blockers. ' +
          'Bob: yesterday worked on the user auth API, today continuing — blocked waiting for the security review sign-off, ' +
          'need it before we can merge the auth PR. ' +
          'Carol: yesterday reviewed QA test cases, today writing automated tests for the login flow, no blockers.',
        expectedBehavior:
          'Claude should produce a formatted standup summary for all three team members. ' +
          'Bob\'s security review dependency should appear in the Blockers section with Bob as owner and a recommended next step (follow up with security team). ' +
          'The PM actions section should flag that the PM should chase the security review sign-off. ' +
          'The Slack summary should note the team is progressing with one active blocker.',
        mustContain: ['login page design', 'security review', 'auth PR'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'project-manager-standup-summary-scenario-2',
        title: 'Flag an escalation-worthy blocker',
        userInput:
          'Standup notes: Dev team is blocked waiting for the third-party payment API credentials from the vendor. ' +
          'We asked for them 3 days ago and have not heard back. ' +
          'Integration testing was supposed to start yesterday. ' +
          'This is now at risk of pushing the launch milestone.',
        expectedBehavior:
          'Claude should log the blocker with the dev team as owner and a next step (escalate to vendor account manager or PM). ' +
          'Since this risks a milestone, it should be flagged as ESCALATE per the escalation rule. ' +
          'The PM actions section should list a concrete action: contact the vendor account manager and confirm a date for credentials delivery.',
        mustContain: ['payment API credentials', 'integration testing', 'launch milestone'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },
];
