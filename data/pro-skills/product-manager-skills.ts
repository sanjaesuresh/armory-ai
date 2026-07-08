import type { Setup } from '@/lib/setup/types';

export const productManagerSkills: Setup[] = [
  // ─── 1. PRD Writer ────────────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-product-manager-prd-writer-v1',
    slug: 'product-manager-prd-writer',
    name: 'PRD Writer',
    tagline: 'Turn a problem statement into a tight, one-pager PRD in minutes',
    description:
      'Drafts a concise Product Requirements Document from a problem statement, target user, and ' +
      'success criteria. Covers problem, solution scope, success metrics, out-of-scope items, ' +
      'open questions, and dependencies, structured so engineering can start immediately.',
    role: 'Product Manager',
    industry: 'Technology',
    tags: ['prd', 'requirements', 'product-management', 'documentation', 'planning'],
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

    instructionTemplate: `You are a product writer drafting a Product Requirements Document for {{productName}}.

Target user: {{targetUser}}

Problem to solve: {{problemStatement}}

{{#if additionalConstraints}}
Additional constraints or context: {{additionalConstraints}}
{{/if}}

Write a concise one-pager PRD with the following sections:
1. Problem statement, What is broken, for whom, and at what frequency or scale?
2. Success metrics, 2–3 measurable outcomes with specific thresholds (no vague "improve" language).
3. Proposed solution, What will be built, not how. Scope only, no implementation detail.
4. Out of scope, Explicitly list what this work does not include.
5. Open questions, Unresolved decisions, each with an owner placeholder and a target resolution date.
6. Dependencies, Other teams or systems this feature relies on.

Rules:
1. Each success metric must be testable with a number or a binary pass/fail state.
2. Keep the proposed solution neutral on implementation; do not specify technology choices.
3. If the problem statement is ambiguous, ask one clarifying question before drafting.
4. Never fabricate user research data, technical constraints, or business metrics.`,

    variables: [
      {
        key: 'productName',
        label: 'Product or feature name',
        type: 'text',
        required: true,
        helpText: 'The product or feature this PRD is for, exactly as it should appear in the document.',
        group: 'About this PRD',
      },
      {
        key: 'targetUser',
        label: 'Target user',
        type: 'text',
        required: true,
        helpText: 'Who is this feature for? E.g. "data analysts at enterprise customers."',
        group: 'About this PRD',
      },
      {
        key: 'problemStatement',
        label: 'Problem to solve',
        type: 'multiline',
        required: true,
        helpText: 'Describe the problem: what is broken, how often, and what it costs the user.',
        group: 'About this PRD',
      },
      {
        key: 'additionalConstraints',
        label: 'Additional constraints or context (optional)',
        type: 'multiline',
        required: false,
        helpText: 'Deadlines, technical constraints, stakeholder requirements, or competing priorities.',
        group: 'About this PRD',
      },
    ],

    knowledgeFiles: [
      {
        name: 'PRD one-pager reference card',
        purpose:
          'A fillable PRD template with all required sections and inline prompts so every ' +
          'document follows a consistent structure across the team.',
        kind: 'starter',
        content: `# PRD One-Pager Reference Card

## 1. Problem statement
Who is affected: [role / user segment]
What is broken: [the specific failure or gap]
How often / scale: [frequency, number of users affected, or business cost]

## 2. Success metrics
| Metric | Current baseline | Target | How measured |
|--------|-----------------|--------|--------------|
| [Metric 1] | | | |
| [Metric 2] | | | |

Rule: every metric must have a number, avoid "faster" or "better" without a threshold.

## 3. Proposed solution (scope only)
What we will build: [1–3 sentences describing the user-facing outcome, not the implementation]

## 4. Out of scope
- [Explicitly list what this work does NOT include]
- [Each item here prevents scope creep later]

## 5. Open questions
| Question | Owner | Resolve by |
|----------|-------|-----------|
| [Decision not yet made] | [name] | [date] |

## 6. Dependencies
- [Team or system name], [what is needed from them and when]

## Writing rules
- Success metrics: avoid "improve," "faster," or "more" without a number.
- Proposed solution: do not name technologies or architecture choices, that belongs in a tech spec.
- Out of scope: be explicit. If you are unsure, put it here and revisit.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'product-manager-prd-writer-scenario-1',
        title: 'Draft a PRD for a bulk CSV import feature',
        userInput:
          'Write a PRD for a bulk CSV import feature in our analytics tool. The target user is a data analyst ' +
          'who currently pastes data row by row and spends 2–3 hours building datasets manually. ' +
          'We need to ship before end of Q3.',
        expectedBehavior:
          'Claude should produce a PRD covering all six sections. The problem statement must reference ' +
          'the data analyst persona and the manual data entry pain. Success metrics must include a ' +
          'specific time reduction target (e.g., reduce dataset setup time by at least 80%). Out of scope ' +
          'must include at least one explicit exclusion. Open questions should flag anything unresolved ' +
          '(e.g., supported CSV size limit, error handling for malformed rows). ' +
          'Claude must not invent user research statistics.',
        mustContain: ['CSV import', 'data analyst', 'manually', 'Q3'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'product-manager-prd-writer-scenario-2',
        title: 'Draft a PRD for two-factor authentication',
        userInput:
          'PRD for two-factor authentication on our SaaS platform. Users are enterprise admins who are ' +
          'failing security audits because we lack 2FA support. Success metric: zero failed audits next quarter.',
        expectedBehavior:
          'Claude should structure the PRD around the security audit failure and the enterprise admins ' +
          'persona. The success metric must use the "zero failed audits" target as given, and may suggest ' +
          'a complementary metric (e.g., 2FA adoption rate among enterprise accounts). The proposed solution ' +
          'must stay scope-level, no JWT implementation details. Dependencies should flag the identity provider ' +
          'integration. Claude must not fabricate compliance data or audit statistics.',
        mustContain: ['two-factor authentication', 'enterprise admins', 'security audits', '2FA'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 2. User Story Generator ──────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-product-manager-user-story-generator-v1',
    slug: 'product-manager-user-story-generator',
    name: 'User Story Generator',
    tagline: 'Break down a feature or epic into well-scoped stories with testable acceptance criteria',
    description:
      'Decomposes a feature description or epic into individually shippable user stories, each with ' +
      'a role-based story statement and a numbered list of binary acceptance criteria. ' +
      'Includes a size estimate with rationale so sprint planning starts with clarity.',
    role: 'Product Manager',
    industry: 'Technology',
    tags: ['user-stories', 'agile', 'acceptance-criteria', 'sprint-planning', 'backlog'],
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

    instructionTemplate: `You write user stories for {{productName}}.

Feature or epic to break down: {{epicOrFeature}}

Primary user role for these stories: {{primaryUserRole}}

{{#if edgeCaseContext}}
Edge cases or constraints to account for: {{edgeCaseContext}}
{{/if}}

For each user story, write:
- Story title (5–8 words)
- Story statement: "As a [role], I want [feature] so that [benefit]."
- Acceptance criteria (numbered list; each criterion is binary, pass or fail, not subjective)
- Size estimate (XS / S / M / L / XL) with a one-sentence rationale

Rules:
1. Each acceptance criterion must be testable: "the system displays a confirmation message" passes; "users feel confident" does not.
2. Write separate stories for separate user intents, do not bundle two distinct actions into one story.
3. If the epic is too large to fit in one response, list all story titles first and ask which to expand.
4. Never fabricate user research, business metrics, or technical implementation details.`,

    variables: [
      {
        key: 'productName',
        label: 'Product name',
        type: 'text',
        required: true,
        helpText: 'The product or system these stories are written for.',
        group: 'Context',
      },
      {
        key: 'epicOrFeature',
        label: 'Feature or epic description',
        type: 'multiline',
        required: true,
        helpText: 'Describe the feature or epic to break down. Include goals, known constraints, and what "done" looks like.',
        group: 'Context',
      },
      {
        key: 'primaryUserRole',
        label: 'Primary user role',
        type: 'text',
        required: true,
        helpText: 'The main user type in the story statements, e.g. "project lead" or "enterprise admin."',
        group: 'Context',
      },
      {
        key: 'edgeCaseContext',
        label: 'Edge cases or constraints (optional)',
        type: 'multiline',
        required: false,
        helpText: 'Known edge cases, error states, or constraints that should appear as acceptance criteria.',
        group: 'Context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'User story format guide',
        purpose:
          'A compact reference for the story format, acceptance-criteria rules, and size definitions ' +
          'so every story the team writes follows the same structure.',
        kind: 'starter',
        content: `# User Story Format Guide

## Story statement
As a [role], I want [feature] so that [benefit].

- Role: the specific user type, not "user", be precise ("data analyst," "enterprise admin")
- Feature: what they want to do, not how the system does it
- Benefit: the outcome they get, tied to a goal

## Acceptance criteria rules
Each criterion must be binary, it either passes or it does not.

Good: "When the user submits the form with a missing required field, the system highlights the field in red and shows an error message."
Bad: "The form should be easy to use."

Number each criterion. Group related criteria under the same story; use separate stories for separate intents.

## Size definitions
| Size | Rough effort | When to use |
|------|-------------|-------------|
| XS | < 2 hours | Trivial copy change, config flag, tiny fix |
| S | 2–8 hours | Single, well-understood change |
| M | 1–3 days | Standard feature slice with a few states |
| L | 3–7 days | Complex feature or multiple integrations |
| XL | 1–2 weeks | Likely needs splitting before committing to a sprint |

## Splitting heuristics (when a story is too big)
- Split by user role (admin vs. end user flows)
- Split by happy path vs. error/edge states
- Split by data type handled
- Split by CRUD operation (read before write)
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'product-manager-user-story-generator-scenario-1',
        title: 'Break down a notifications center epic',
        userInput:
          'Break down the notifications center epic for our project management app. The primary user is a ' +
          'project lead who needs to see task updates, @mentions, and deadline reminders in one place ' +
          'without switching between email and the app.',
        expectedBehavior:
          'Claude should produce at least three distinct stories, one per notification type or user intent ' +
          '(task updates, @mentions, deadline reminders). Each story must follow the "As a [role], I want ' +
          '[feature] so that [benefit]" format, include a numbered list of binary acceptance criteria, and ' +
          'carry a size estimate with rationale. Stories must not be bundled into one giant story. ' +
          'Claude should not invent notification frequency data or engagement statistics.',
        mustContain: ['notifications center', 'project lead', 'task updates', '@mentions'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'product-manager-user-story-generator-scenario-2',
        title: 'Generate stories for a password reset flow',
        userInput:
          'Write user stories for a password reset flow. Our support agents report that customers are ' +
          'frequently locked out because the reset email link expires in 15 minutes, which is too short.',
        expectedBehavior:
          'Claude should produce stories covering: requesting a reset (happy path), the email link ' +
          'expiry behavior, and resetting the password successfully. The acceptance criteria must address ' +
          'the 15-minute expiry as a specific testable state (e.g., "when a user clicks an expired link, ' +
          'the system shows an error and offers to resend"). Size estimates must be realistic. ' +
          'Claude must not fabricate support ticket volume or churn statistics.',
        mustContain: ['password reset', 'support agents', 'locked out', 'email link'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 3. Feature Prioritization (RICE) ────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-product-manager-rice-prioritization-v1',
    slug: 'product-manager-rice-prioritization',
    name: 'Feature Prioritization (RICE)',
    tagline: 'Score and rank backlog items with RICE so every sprint decision has explicit reasoning',
    description:
      'Applies the RICE framework (Reach, Impact, Confidence, Effort) to a list of backlog items, ' +
      'producing a ranked table with scores and a brief written rationale for each item. ' +
      'Surfaces hidden trade-offs and flags items where missing data changes the ranking.',
    role: 'Product Manager',
    industry: 'Technology',
    tags: ['prioritization', 'rice', 'backlog', 'sprint-planning', 'product-management'],
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

    instructionTemplate: `You are a product strategist applying RICE prioritization for {{productName}}.

Quarterly goal to optimize for: {{quarterlyGoal}}

Effort unit: {{effortUnit}}

{{#if additionalCriteria}}
Additional criteria or constraints to factor in: {{additionalCriteria}}
{{/if}}

When given a list of backlog items, produce:
1. A RICE scoring table with columns: Item | Reach | Impact | Confidence | Effort | RICE Score
2. A ranked list from highest to lowest score
3. A one-to-two-sentence rationale per item explaining the score and its relationship to the quarterly goal
4. A "watch list" section flagging items where missing data materially changes the ranking

RICE formula: Score = (Reach × Impact × Confidence) / Effort
- Reach: estimated users affected per quarter (integer)
- Impact: 3 = massive / 2 = high / 1 = medium / 0.5 = low / 0.25 = minimal
- Confidence: 100% = high / 80% = medium / 50% = low (use decimals: 1.0, 0.8, 0.5)
- Effort: expressed in {{effortUnit}}

Rules:
1. Use only information provided, if Reach is unknown, state an assumption explicitly and use 50% confidence.
2. Do not let personal preference override scores, follow the formula and surface the result.
3. Flag any item where a different Reach or Effort estimate would change the top-three ranking.
4. Never fabricate user counts, business metrics, or engineering effort estimates.`,

    variables: [
      {
        key: 'productName',
        label: 'Product name',
        type: 'text',
        required: true,
        helpText: 'The product whose backlog is being prioritized.',
        group: 'Prioritization context',
      },
      {
        key: 'quarterlyGoal',
        label: 'Quarterly goal',
        type: 'text',
        required: true,
        helpText: 'The single metric or outcome this quarter is optimizing for. E.g. "increase trial-to-paid conversion by 15%."',
        group: 'Prioritization context',
      },
      {
        key: 'effortUnit',
        label: 'Effort unit',
        type: 'select',
        options: ['Person-weeks', 'Person-months', 'Story points'],
        default: 'Person-weeks',
        required: true,
        helpText: 'The unit your team uses to estimate engineering effort.',
        group: 'Prioritization context',
      },
      {
        key: 'additionalCriteria',
        label: 'Additional criteria or constraints (optional)',
        type: 'multiline',
        required: false,
        helpText: 'Strategic constraints that affect ranking, e.g. "nothing that requires a database migration this quarter."',
        group: 'Prioritization context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'RICE scoring reference card',
        purpose:
          'A quick-reference scoring guide for Reach, Impact, Confidence, and Effort so the team ' +
          'applies the framework consistently across sessions.',
        kind: 'starter',
        content: `# RICE Scoring Reference Card

## Formula
RICE Score = (Reach × Impact × Confidence) / Effort

Higher score = higher priority.

## Reach
Estimated number of users or customers affected per quarter.
Use the number directly, do not multiply or normalize.
If unknown: state an assumption, reduce confidence to 50%.

## Impact (fixed scale)
| Score | Meaning |
|-------|---------|
| 3 | Massive, transforms the experience for affected users |
| 2 | High, noticeably improves the experience |
| 1 | Medium, modest improvement |
| 0.5 | Low, slight improvement |
| 0.25 | Minimal, barely noticeable |

## Confidence
| % | Meaning |
|---|---------|
| 100% (1.0) | Strong data from research, experiments, or clear precedent |
| 80% (0.8) | Reasonable evidence; some assumptions |
| 50% (0.5) | Gut feel; little or no data |

## Effort
Estimated person-weeks (or your team's chosen unit) to design, build, and ship.
Include QA and design time. Use whole numbers or 0.5 increments.

## Watch list triggers
Flag an item on the watch list when:
- Reach is a rough guess (confidence should drop to 50%)
- Effort could vary by 2× depending on technical approach
- A dependency outside the team could delay shipping

## Common mistakes
- Using "high impact" for everything, force a ranking by using different scores
- Ignoring effort, a high-impact item with massive effort may still rank low
- Skipping the watch list, surfacing uncertainty is as valuable as the score
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'product-manager-rice-prioritization-scenario-1',
        title: 'Score five backlog items before sprint planning',
        userInput:
          'Score these five backlog items with RICE before our next sprint. Items: 1) SSO login, ' +
          '2) Bulk export to PDF, 3) In-app chat support widget, 4) Dark mode, 5) Custom dashboard builder. ' +
          'Our quarterly goal is to improve trial-to-paid conversion by 15%.',
        expectedBehavior:
          'Claude should produce a RICE scoring table for all five items with Reach, Impact, Confidence, ' +
          'Effort, and Score columns, followed by a ranked list and a rationale per item tied to the ' +
          'trial-to-paid conversion goal. Items with unclear Reach (e.g., dark mode, custom dashboard) ' +
          'should have lower confidence scores and appear on the watch list. Claude must not invent ' +
          'user counts, it should state assumptions explicitly.',
        mustContain: ['SSO login', 'Bulk export to PDF', 'trial-to-paid conversion', 'quarterly goal'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'product-manager-rice-prioritization-scenario-2',
        title: 'Rank three features tied to a churn goal',
        userInput:
          'Score these three features using RICE. Feature A: Slack integration. Feature B: Mobile app redesign. ' +
          'Feature C: Advanced search filters. Our goal this quarter is to reduce churn among power users.',
        expectedBehavior:
          'Claude should score all three features with the RICE formula, explicitly justifying each ' +
          'Reach and Impact score relative to the power-user churn goal. The mobile app redesign and ' +
          'Slack integration likely have different Reach profiles and the rationale should reflect that. ' +
          'The watch list should flag features where effort uncertainty is high (e.g., mobile redesign). ' +
          'No fabricated churn rates or user counts.',
        mustContain: ['Slack integration', 'Mobile app redesign', 'Advanced search filters', 'churn'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 4. Release Notes Writer ──────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-product-manager-release-notes-writer-v1',
    slug: 'product-manager-release-notes-writer',
    name: 'Release Notes Writer',
    tagline: 'Turn a raw changelog into polished, audience-appropriate release notes',
    description:
      'Converts a list of shipped changes, new features, bug fixes, improvements, and breaking changes, ' +
      'into clear, well-structured release notes calibrated to your audience. Outputs are ready to ' +
      'publish to a changelog page, in-app notification, or release email.',
    role: 'Product Manager',
    industry: 'Technology',
    tags: ['release-notes', 'changelog', 'communication', 'product-management', 'documentation'],
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

    instructionTemplate: `You write release notes for {{productName}}.

Release version: {{releaseVersion}}

Audience: {{audience}}

{{#if changelogFormat}}
Preferred changelog format: {{changelogFormat}}
{{/if}}

When given a list of changes, write release notes that:
1. Open with a brief summary paragraph (2–3 sentences) describing the theme of this release
2. Group changes under labeled sections matching the chosen format
3. Write each item from the user's perspective, lead with the benefit or impact, not the technical mechanism
4. Highlight any breaking changes with a clear warning and migration step if possible
5. Close with a "What's next" teaser (1 sentence) if future work is mentioned

Audience calibration:
- End users: plain language, no API or code references, focus on what they can now do
- Developers / API consumers: include method names, endpoint paths, and deprecation warnings
- Enterprise admins: emphasize security, compliance, configuration changes, and migration steps
- Internal team: full technical detail is fine; include root causes for bug fixes

Rules:
1. Do not invent changes that were not provided, if a detail is missing, flag it as [NEEDS DETAIL].
2. Breaking changes must be called out in a visually distinct section, never buried in a list.
3. Write in past tense for shipped items ("Added," "Fixed," "Removed," not "We are adding").
4. Never fabricate performance numbers, user counts, or benchmark comparisons.`,

    variables: [
      {
        key: 'productName',
        label: 'Product name',
        type: 'text',
        required: true,
        helpText: 'The product or service this release is for.',
        group: 'Release details',
      },
      {
        key: 'releaseVersion',
        label: 'Release version',
        type: 'text',
        required: true,
        helpText: 'Version number or label, e.g. "2.4.0" or "July 2026 release."',
        group: 'Release details',
      },
      {
        key: 'audience',
        label: 'Primary audience',
        type: 'select',
        options: ['End users', 'Developers / API consumers', 'Enterprise admins', 'Internal team'],
        default: 'End users',
        required: true,
        helpText: 'Who will read these notes? Claude calibrates language and detail level accordingly.',
        group: 'Release details',
      },
      {
        key: 'changelogFormat',
        label: 'Changelog format (optional)',
        type: 'select',
        options: [
          "What's New / Bug Fixes / Improvements",
          'Added / Changed / Fixed / Removed',
          'Narrative prose',
        ],
        required: false,
        helpText: 'Preferred section structure. Leave blank to let Claude choose based on audience.',
        group: 'Release details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Release notes format guide',
        purpose:
          'Reference for section structures, tone calibration by audience, and breaking-change ' +
          'callout patterns so every release follows a consistent format.',
        kind: 'starter',
        content: `# Release Notes Format Guide

## Standard section formats

### What's New / Bug Fixes / Improvements
Use for: end-user-facing releases with a mix of new features and polish.
- **What's New**, net-new capabilities
- **Improvements**, enhancements to existing features
- **Bug Fixes**, resolved defects (user-facing language, not stack traces)

### Added / Changed / Fixed / Removed
Use for: developer / API consumer audiences (follows Keep a Changelog convention).
- **Added**, new features, endpoints, or parameters
- **Changed**, behavior changes to existing features (include before → after)
- **Fixed**, resolved bugs
- **Removed**, deprecated items that are now gone (always include migration path)

### Narrative prose
Use for: high-stakes or marketing-facing releases where story matters more than structure.
- Open with the "why" of the release
- Group changes by theme, not by type
- Close with what's coming next

## Breaking changes callout
⚠️ **Breaking change**: [What changed and why]
**Migration step**: [Exactly what the user or developer must do to avoid breakage]
**Deadline**: [When the old behavior will no longer work, if applicable]

## Tone by audience
| Audience | Lead with | Avoid |
|----------|-----------|-------|
| End users | User benefit, outcome | API names, error codes, internal team names |
| Developers | Exact method/endpoint name | Marketing language, vague "improvements" |
| Enterprise admins | Compliance, config change, migration | Jargon without definition |
| Internal team | Root cause, technical detail | Sanitizing or over-simplifying |

## Writing rules
- Past tense: "Added," "Fixed," "Removed", not "We are adding"
- Lead with benefit: "Export reports 3× faster" not "Refactored the export pipeline"
- One item per bullet, do not bundle two changes
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'product-manager-release-notes-writer-scenario-1',
        title: 'Write release notes for a feature-rich update',
        userInput:
          'Write release notes for version 2.4.0 for end users. Changes: 1) Added real-time collaboration ' +
          'on documents so multiple users can edit at the same time. 2) Fixed a bug where autosave would ' +
          'fail on slow connections. 3) Improved load time of the dashboard by 40%.',
        expectedBehavior:
          'Claude should produce end-user-friendly release notes with a brief summary paragraph, then ' +
          'group the three changes into appropriate sections. Real-time collaboration should lead with the ' +
          'user benefit ("Work together without refreshing"). The autosave fix should be in Bug Fixes with ' +
          'plain language (no "race condition" jargon). The 40% load time improvement should be stated as ' +
          'given, Claude must not round up or invent a higher figure. No technical implementation details.',
        mustContain: ['real-time collaboration', 'autosave', 'load time', '2.4.0'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'product-manager-release-notes-writer-scenario-2',
        title: 'Write developer-facing notes with breaking changes',
        userInput:
          'Release notes for v3.0.0 for developers. This is a major release with breaking changes. ' +
          'We deprecated the v2 API endpoints, removed the legacy CSV export format, and added OAuth 2.0 ' +
          'support for enterprise SSO.',
        expectedBehavior:
          'Claude should produce developer-facing notes that prominently call out the breaking changes ' +
          '(v2 endpoint deprecation and CSV format removal) with a clear migration warning section. ' +
          'The OAuth 2.0 addition should appear under Added with relevant detail for developers. ' +
          'Breaking changes must not be buried in a flat list. Claude should flag any missing migration ' +
          'details with [NEEDS DETAIL] rather than fabricating endpoint paths or migration steps.',
        mustContain: ['v3.0.0', 'breaking changes', 'deprecated', 'OAuth 2.0'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 5. Roadmap Narrative ─────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-product-manager-roadmap-narrative-v1',
    slug: 'product-manager-roadmap-narrative',
    name: 'Roadmap Narrative',
    tagline: 'Wrap a roadmap in a compelling "why" story that gets stakeholders aligned',
    description:
      'Drafts a written narrative for a product roadmap, a "north star" story that explains the ' +
      'strategic theme, why now, and how the planned work connects to business goals. ' +
      'Calibrated to the audience so executives get strategy and engineers get context.',
    role: 'Product Manager',
    industry: 'Technology',
    tags: ['roadmap', 'strategy', 'communication', 'stakeholder-alignment', 'product-management'],
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

    instructionTemplate: `You write roadmap narratives for {{productName}}.

Time horizon: {{timeHorizon}}

Primary theme: {{primaryTheme}}

Audience: {{audienceType}}

Write a roadmap narrative with the following structure:
1. Where we are now (1–2 sentences grounding the reader in the current state)
2. Why this theme, why now (2–3 sentences: the business or user problem driving this direction)
3. What we are building and in what order (connect the roadmap items to the theme, do not just list features)
4. What success looks like by the end of {{timeHorizon}} (2–3 specific, observable outcomes)
5. What we are not doing and why (explicit trade-offs made to stay focused)

Audience calibration:
- Executive leadership: lead with business outcomes, revenue and retention implications; skip implementation detail
- Engineering team: include sequencing rationale and dependency context; frame as "why in this order"
- Sales team: frame around customer pain points and deal-enabling outcomes; connect to objections they hear
- All hands: balance inspiration and clarity; avoid jargon; make the "why" feel personally relevant

Rules:
1. Never fabricate roadmap items, timelines, or business metrics, use only what is provided.
2. Trade-offs in section 5 must be specific: name what is explicitly deferred, not just "other things."
3. If given a list of roadmap items, weave them into the narrative rather than listing them verbatim.
4. Never fabricate competitive data, revenue figures, or user research.`,

    variables: [
      {
        key: 'productName',
        label: 'Product name',
        type: 'text',
        required: true,
        helpText: 'The product this roadmap narrative is for.',
        group: 'Roadmap context',
      },
      {
        key: 'timeHorizon',
        label: 'Time horizon',
        type: 'select',
        options: ['Next quarter', 'Next 6 months', 'Next 12 months', 'Next 18 months'],
        default: 'Next quarter',
        required: true,
        helpText: 'The planning window this narrative covers.',
        group: 'Roadmap context',
      },
      {
        key: 'primaryTheme',
        label: 'Primary theme',
        type: 'text',
        required: true,
        helpText: 'The single strategic theme tying this roadmap together, e.g. "user onboarding" or "platform stability."',
        group: 'Roadmap context',
      },
      {
        key: 'audienceType',
        label: 'Audience',
        type: 'select',
        options: ['Executive leadership', 'Engineering team', 'Sales team', 'All hands'],
        default: 'Executive leadership',
        required: true,
        helpText: 'Who will read this narrative? Claude calibrates language and emphasis accordingly.',
        group: 'Roadmap context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Roadmap narrative framework',
        purpose:
          'A five-section narrative template with audience calibration notes and trade-off framing ' +
          'so every roadmap tell is structured, strategic, and audience-appropriate.',
        kind: 'starter',
        content: `# Roadmap Narrative Framework

## Five-section structure

### 1. Where we are now
Ground the reader quickly, no jargon. One or two sentences on the current product state, user base, or business position that makes the theme feel necessary.

### 2. Why this theme, why now
The forcing function. What changed, user behavior, competition, a strategic bet, or a business target, that makes this the right direction at this moment? This is where you earn credibility.

### 3. What we are building and in what order
Do not list features. Connect the work to the theme:
"We start with X because it unblocks Y; once Y is in place, we can ship Z with real user data behind it."

Sequencing rationale is the differentiator between a list and a narrative.

### 4. What success looks like
2–3 observable outcomes at the end of the horizon. Observable means you can point to a dashboard or user behavior:
- "Trial-to-paid conversion reaches 18% (up from 12%)"
- "Time-to-first-value drops below 2 days for 80% of new signups"

Avoid: "users will love the product," "significant improvement in retention."

### 5. What we are not doing
Naming what is deferred is as important as naming what ships. It:
- Shows the trade-off was deliberate, not missed
- Prevents stakeholders from assuming it is "coming soon"
- Protects the team from scope creep

Format: "We are not building [X] this [horizon] because [reason]. It is queued for [future state]."

## Audience calibration

| Audience | Emphasize | Tone |
|----------|-----------|------|
| Executive leadership | Business outcome, revenue, retention, risk | Concise, no technical detail |
| Engineering team | Sequencing rationale, dependencies, "why this order" | Collaborative, respectful of trade-offs |
| Sales team | Customer pain, deal-enabling outcomes, objection responses | Action-oriented, customer-language |
| All hands | Inspiration + clarity, personal relevance | Warm, jargon-free |
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'product-manager-roadmap-narrative-scenario-1',
        title: 'Write an executive roadmap narrative for an onboarding theme',
        userInput:
          'Write a roadmap narrative for Q2 and Q3. The primary theme is user onboarding, we want to ' +
          'cut time-to-first-value from 7 days to under 2 days. I am presenting this to executive leadership ' +
          'next week. Planned work: guided setup wizard, in-app checklist, empty-state templates.',
        expectedBehavior:
          'Claude should produce a five-section narrative written for executives, business-outcome led, ' +
          'no technical implementation detail. Section 2 must explain why onboarding is the bottleneck now ' +
          '(using only provided context). Section 4 must use the specific 7-to-under-2-day metric as a ' +
          'target. Section 5 must explicitly name something deferred. Claude must not fabricate activation ' +
          'rates, churn data, or competitive context.',
        mustContain: ['Q2 and Q3', 'user onboarding', 'time-to-first-value', 'executive leadership'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'product-manager-roadmap-narrative-scenario-2',
        title: 'Write an engineering team roadmap narrative for a stability theme',
        userInput:
          'Write a roadmap narrative for the next 6 months for the engineering team. The theme is ' +
          'platform stability, we have had too many incidents and need to invest in reliability ' +
          'before adding new features.',
        expectedBehavior:
          'Claude should write for an engineering audience, the sequencing rationale in section 3 ' +
          'should explain why reliability work ships before new features (e.g., incidents reduce velocity ' +
          'more than pausing feature work does). Section 5 must name specific feature work that is ' +
          'deferred and why. The tone should be collaborative and technically grounded. Claude must not ' +
          'fabricate incident counts, SLA figures, or engineering velocity metrics.',
        mustContain: ['next 6 months', 'engineering team', 'platform stability', 'incidents'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 6. Competitive Analysis ──────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-product-manager-competitive-analysis-v1',
    slug: 'product-manager-competitive-analysis',
    name: 'Competitive Analysis',
    tagline: 'Structure competitor observations into a product-focused analysis with clear takeaways',
    description:
      'Takes raw observations about a competitor, feature lists, pricing signals, positioning copy, ' +
      'user reviews, and structures them into a product-focused competitive analysis. ' +
      'Identifies positioning gaps and surfaces three specific product actions you can take.',
    role: 'Product Manager',
    industry: 'Technology',
    tags: ['competitive-analysis', 'positioning', 'product-strategy', 'market-research', 'product-management'],
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

    instructionTemplate: `You are a product strategist analyzing a competitor for {{myProductName}}.

My product's positioning: {{myProductPositioning}}

Competitor being analyzed: {{competitorName}}

{{#if focusDimension}}
Focus this analysis on: {{focusDimension}}
{{/if}}

When given competitor observations, produce a structured analysis with:
1. Competitor positioning summary (how they describe themselves and who they target, one paragraph)
2. Feature comparison (what they have that we lack; what we have that they lack; what overlaps)
3. Target customer signals (who their content, pricing, and messaging implies they are optimizing for)
4. Weaknesses and gaps (specific things they are doing poorly or not covering)
5. Product opportunities (3 specific, actionable product decisions we should consider based on this analysis)

Rules:
1. Work only with the observations provided, do not invent feature capabilities, pricing, or user data.
2. Label inferences clearly: "Based on their homepage copy, they appear to target…"
3. Product opportunities must be specific to our product and grounded in the gap analysis, not generic advice.
4. Never fabricate revenue figures, market share data, or user counts.`,

    variables: [
      {
        key: 'myProductName',
        label: 'Your product name',
        type: 'text',
        required: true,
        helpText: 'Your product, the one doing the analyzing.',
        group: 'Products',
      },
      {
        key: 'myProductPositioning',
        label: 'Your product positioning',
        type: 'multiline',
        required: true,
        helpText: 'Brief description of what you build, who it is for, and your key differentiator.',
        group: 'Products',
      },
      {
        key: 'competitorName',
        label: 'Competitor name',
        type: 'text',
        required: true,
        helpText: 'The competitor being analyzed.',
        group: 'Products',
      },
      {
        key: 'focusDimension',
        label: 'Analysis focus (optional)',
        type: 'select',
        options: ['Product features', 'Pricing and packaging', 'Target customer', 'Full overview'],
        required: false,
        helpText: 'Narrow the analysis to one dimension, or leave blank for a full overview.',
        group: 'Analysis',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Competitive analysis framework',
        purpose:
          'A structured template for capturing and analyzing competitor observations so every ' +
          'analysis covers the same dimensions and surfaces product-actionable takeaways.',
        kind: 'starter',
        content: `# Competitive Analysis Framework

## What to gather before analyzing
- Homepage hero: headline + subheading + primary CTA
- Pricing page: tiers, price points, what's included at each tier
- Feature list or comparison page (if public)
- 5–10 recent G2, Capterra, or App Store reviews, especially 2–3 star reviews (they reveal real pain)
- 3–5 recent LinkedIn or blog posts (reveals who they are trying to reach)
- Any public changelog or "What's new" page (reveals roadmap direction)

## Analysis sections

### 1. Positioning summary
Answer: What category do they claim to own? Who is their hero customer? What is their main promise?

### 2. Feature comparison
| Dimension | Us | Competitor |
|-----------|-----|-----------|
| [Feature area] | | |

Columns: "Only us," "Only them," "Both," "Neither (opportunity)"

### 3. Target customer signals
- Job title / role their content addresses most:
- Company size their pricing implies:
- Pain point they repeat most in messaging:

### 4. Weaknesses and gaps
Pull these from negative reviews and from what they conspicuously avoid talking about.
Each weakness should be: [Observable gap], [Evidence from observations]

### 5. Product opportunities (for us)
Each opportunity must be:
- Specific to our product (not generic "improve UX" advice)
- Grounded in a gap or weakness identified above
- Actionable within 1–2 quarters

Format: [Action], because [competitor gap or user pain], priority: High / Medium / Low

## Inference labeling
Always prefix inferred conclusions with:
- "Based on their pricing page, they appear to…"
- "Their reviews suggest, but do not confirm, that…"
- "Inferred from ad creative: they may be targeting…"
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'product-manager-competitive-analysis-scenario-1',
        title: 'Analyze a competitor from homepage copy and reviews',
        userInput:
          'Analyze our competitor, Notion. Our product is Basecamp, a simple team communication and ' +
          'project management tool for small businesses. Notion homepage: "The all-in-one workspace. ' +
          'Write, plan, and get organized." Their G2 reviews mention it is too complex to set up and ' +
          'has a steep learning curve for non-technical users.',
        expectedBehavior:
          'Claude should produce analysis across all five sections. Positioning summary should capture ' +
          'the "all-in-one" claim and infer enterprise or tech-savvy target. Feature comparison should ' +
          'note what Basecamp has that Notion lacks (simplicity, opinionated structure). Weaknesses should ' +
          'reference the G2 review evidence about complexity. Product opportunities must be specific to ' +
          'Basecamp, e.g., "double down on onboarding simplicity as a differentiator." No fabricated ' +
          'user counts or revenue data.',
        mustContain: ['Notion', 'Basecamp', 'all-in-one workspace', 'learning curve'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'product-manager-competitive-analysis-scenario-2',
        title: 'Analyze a competitor with a feature focus',
        userInput:
          'Competitive analysis of Linear vs. our product, Shortcut. Focus on product features. ' +
          'Linear recent changelog shows: AI-powered issue triage, keyboard-shortcut-first design, ' +
          'and native Git integration. Their social posts show developers love the speed.',
        expectedBehavior:
          'Claude should focus the analysis on the product features dimension as requested. Feature ' +
          'comparison must identify the AI-powered issue triage and native Git integration as specific ' +
          'gaps to evaluate for Shortcut. Target customer signals should pick up on the developer-centric ' +
          'positioning from the social posts. Product opportunities must be grounded in the feature gaps, ' +
          'not generic "add AI" advice. No fabricated Linear metrics or user counts.',
        mustContain: ['Linear', 'Shortcut', 'AI-powered issue triage', 'keyboard-shortcut'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 7. User Interview Guide ──────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-product-manager-user-interview-guide-v1',
    slug: 'product-manager-user-interview-guide',
    name: 'User Interview Guide',
    tagline: 'A structured interview script that uncovers real user behavior, not surface opinions',
    description:
      'Generates a complete user interview guide, opening framing, behavior-first questions, probing ' +
      'follow-ups, and a closing, designed to surface actual user workflows and pain points rather than ' +
      'hypothetical feature requests. Timed to fit your session length.',
    role: 'Product Manager',
    industry: 'Technology',
    tags: ['user-research', 'interviews', 'discovery', 'product-management', 'ux-research'],
    category: 'research',
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

    instructionTemplate: `You write user interview guides for {{productName}}.

Core research question: {{researchQuestion}}

Participant type: {{participantType}}

Interview duration: {{interviewDuration}}

Write a complete interview guide with the following structure:
1. Introduction script (2–3 minutes): how to open, set expectations, get consent to record, and warm up the participant
2. Warm-up questions (2–3 questions, 5 minutes): context-setting about their role and current workflow, no product mention yet
3. Core behavior questions (the bulk of the time): open-ended, past-tense questions about actual behavior, not hypotheticals
4. Probing follow-ups: a bank of 5–8 probing questions to go deeper on any answer (suitable for any section)
5. Closing (2–3 minutes): thank participant, ask if they have questions, explain next steps

Format each question section with:
- The question text
- A one-sentence note on what you are listening for
- An estimated time allocation

Rules:
1. All core questions must be past-tense and behavior-based ("Tell me about the last time you…"), no hypotheticals ("Would you use…?").
2. Questions must avoid leading language that implies a correct answer.
3. Scale the number of core questions to fit {{interviewDuration}}, a 30-minute guide has fewer questions than a 60-minute one.
4. Never fabricate interview findings, participant quotes, or user data.`,

    variables: [
      {
        key: 'productName',
        label: 'Product name',
        type: 'text',
        required: true,
        helpText: 'The product this research is about.',
        group: 'Research context',
      },
      {
        key: 'researchQuestion',
        label: 'Core research question',
        type: 'multiline',
        required: true,
        helpText: 'The single most important thing you need to understand from these interviews. E.g. "Why do new users abandon onboarding before completing their profile?"',
        group: 'Research context',
      },
      {
        key: 'participantType',
        label: 'Participant type',
        type: 'text',
        required: true,
        helpText: 'Who you are interviewing, be specific. E.g. "new signups who churned in their first 30 days."',
        group: 'Research context',
      },
      {
        key: 'interviewDuration',
        label: 'Interview duration',
        type: 'select',
        options: ['30 minutes', '45 minutes', '60 minutes'],
        default: '45 minutes',
        required: true,
        helpText: 'Total session length including intro and close. Claude scales question count accordingly.',
        group: 'Research context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'User interview best practices',
        purpose:
          'A reference card for question types, common facilitation mistakes, and probing techniques ' +
          'so every interview stays behavior-focused and produces usable data.',
        kind: 'starter',
        content: `# User Interview Best Practices

## The core rule
Ask about what people DID, not what they WOULD DO.

Good: "Tell me about the last time you had to pull together a report under a tight deadline. Walk me through what you did."
Bad: "If we added a one-click report feature, would you use it?"

## Question types

### Behavior questions (use most)
"Tell me about the last time you [did the thing we care about]."
"Walk me through what happened when [trigger event]."
"What did you do first? Then what?"

### Context questions (use in warm-up)
"How long have you been in this role?"
"What tools do you use day-to-day for [task area]?"

### Probing questions (use freely throughout)
- "Can you say more about that?"
- "What did you do then?"
- "How did that make you feel?"
- "What were you trying to accomplish?"
- "Was that typical, or unusual?"
- "What would you have done if that option wasn't available?"
- "How does that compare to how you handled it before?"

## Common facilitation mistakes
- Suggesting answers: "Was it frustrating?" → better: "What was that like?"
- Accepting the first answer: always probe once more
- Talking too much: aim for 80/20, participant talks 80% of the time
- Jumping to solutions: if a participant says "you should build X," ask "what would that help you accomplish?"

## Timing guide
| Interview length | Intro | Warm-up | Core questions | Probing buffer | Close |
|-----------------|-------|---------|----------------|----------------|-------|
| 30 minutes | 3 min | 5 min | 15 min | 5 min | 2 min |
| 45 minutes | 3 min | 5 min | 28 min | 7 min | 2 min |
| 60 minutes | 3 min | 7 min | 38 min | 10 min | 2 min |

## After the interview
- Write notes immediately, memory fades within 30 minutes
- Note direct quotes verbatim; label inferences as such
- Use a consistent tag system (e.g., #pain, #workaround, #job-to-be-done) across all sessions
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'product-manager-user-interview-guide-scenario-1',
        title: 'Guide for onboarding drop-off research',
        userInput:
          'Create a 45-minute user interview guide to understand why new users abandon our onboarding flow ' +
          'before completing their profile. Participants are new signups who dropped off in the first 3 days.',
        expectedBehavior:
          'Claude should produce a complete guide with an intro script, 2–3 warm-up questions, core behavior ' +
          'questions scaled to fit 45 minutes, a probing follow-up bank, and a close. Core questions must ' +
          'be past-tense behavior questions about the actual drop-off moment, not hypotheticals about what ' +
          'would have helped. The guide should not mention the product by name in early questions to avoid ' +
          'priming. Claude must not fabricate drop-off rates or interview findings.',
        mustContain: ['45-minute', 'onboarding flow', 'completing their profile', 'first 3 days'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'product-manager-user-interview-guide-scenario-2',
        title: 'Guide for power-user workflow research',
        userInput:
          'Write a 30-minute interview guide to learn how power users currently manage their reporting workflow. ' +
          'We want to know what workarounds they use, what is most painful, and what a dramatically better ' +
          'tool would look like.',
        expectedBehavior:
          'Claude should produce a 30-minute guide with fewer core questions than a 60-minute version. ' +
          'Warm-up questions should establish the participant as a power user without leading them. ' +
          'Core questions must probe for actual workarounds ("Tell me about a time you had to work around ' +
          'the tool to get your report done") rather than hypothetical feature wish lists. The probing bank ' +
          'should include follow-ups for when a workaround is mentioned. No fabricated pain point data.',
        mustContain: ['30-minute', 'power users', 'reporting workflow', 'workarounds'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 8. Metrics & KPI Definer ─────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-product-manager-metrics-kpi-definer-v1',
    slug: 'product-manager-metrics-kpi-definer',
    name: 'Metrics & KPI Definer',
    tagline: 'Define the right metrics for your product stage so you measure what actually matters',
    description:
      'Recommends a focused set of KPIs for a product feature or initiative, calibrated to the ' +
      'product stage and primary goal. Each metric includes a definition, a measurement method, ' +
      'and a rationale for why it matters at this stage, not at every stage.',
    role: 'Product Manager',
    industry: 'Technology',
    tags: ['metrics', 'kpis', 'analytics', 'product-management', 'data'],
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

    instructionTemplate: `You define product metrics and KPIs for {{productName}}.

Product stage: {{productStage}}

Primary goal: {{primaryGoal}}

Reporting cadence: {{reportingCadence}}

When given a feature or initiative to measure, recommend a focused metric set with:
1. North star metric (one metric that best captures whether the primary goal is being achieved)
2. Supporting metrics (3–5 metrics that explain movements in the north star)
3. Guardrail metrics (1–2 metrics that should NOT regress even as you optimize the north star)
4. Anti-metrics (1–2 things that are easy to measure and tempting to track but would lead the team in the wrong direction at this stage)

For each metric include:
- Definition (precisely what it measures, no ambiguity)
- How to measure it (data source or event to track)
- Reporting cadence: {{reportingCadence}}
- Stage fit rationale (why this metric matters in the {{productStage}} stage specifically)

Rules:
1. Tailor metrics to the stated product stage, a Discovery metric set looks very different from a Maturity set.
2. Limit the north star to exactly one metric, do not offer multiple options without ranking them.
3. Anti-metrics must be specific and explained, do not just say "avoid vanity metrics."
4. Never fabricate benchmarks, industry averages, or target numbers without flagging them as estimates.`,

    variables: [
      {
        key: 'productName',
        label: 'Product or feature name',
        type: 'text',
        required: true,
        helpText: 'The product or feature these metrics are for.',
        group: 'Metrics context',
      },
      {
        key: 'productStage',
        label: 'Product stage',
        type: 'select',
        options: ['Discovery', 'Growth', 'Maturity', 'Sunset'],
        default: 'Growth',
        required: true,
        helpText: 'Discovery = finding PMF; Growth = scaling; Maturity = defending market share; Sunset = winding down.',
        group: 'Metrics context',
      },
      {
        key: 'primaryGoal',
        label: 'Primary goal',
        type: 'text',
        required: true,
        helpText: 'The single most important outcome this feature or initiative needs to move. E.g. "increase weekly active users who run at least one report per week."',
        group: 'Metrics context',
      },
      {
        key: 'reportingCadence',
        label: 'Reporting cadence',
        type: 'select',
        options: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'],
        default: 'Weekly',
        required: true,
        helpText: 'How often you will review these metrics. Affects whether daily-volatile metrics are appropriate.',
        group: 'Metrics context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Metrics framework reference card',
        purpose:
          'A stage-calibrated guide to north star metrics, supporting metrics, guardrails, and ' +
          'anti-metrics so the team tracks the right things at the right stage.',
        kind: 'starter',
        content: `# Metrics Framework Reference Card

## Four metric tiers

### North star metric
One metric that, if it moves in the right direction, means the primary goal is being achieved.
It should be:
- Sensitive to the work the team is doing (not a lagging indicator months away)
- Meaningful to the user (not a system event they are unaware of)
- Unambiguous (one definition, agreed by all stakeholders)

### Supporting metrics
Explain WHY the north star moved. Usually 3–5 metrics covering:
- Input metrics (actions users take that drive the north star)
- Process metrics (health of the funnel or workflow)
- Quality metrics (user satisfaction signals, not pure volume)

### Guardrail metrics
Things that must NOT regress as you optimize the north star.
Example: if your north star is "reports generated per week," a guardrail is "time to generate a report should not increase."

### Anti-metrics
Easy to measure, tempting to track, but misleading at your current stage.
- Page views during Discovery, you are trying to learn, not drive traffic
- Total registered users during Maturity, you care about retention, not new signups
- Support tickets opened during Growth, could indicate normal adoption growing pains, not quality problems

## Stage-appropriate north star examples

| Stage | Example north star |
|-------|-------------------|
| Discovery | "% of target users who complete the core workflow once" |
| Growth | "Weekly active users who complete the core action at least 3× per week" |
| Maturity | "Net revenue retention (NRR) among existing customers" |
| Sunset | "% of users successfully migrated to the replacement product" |

## Common metric definition mistakes
- "Active users" without defining "active" (what action, in what time window?)
- "Engagement" without specifying the event
- Tracking the average when the median tells a different story (especially for load time, revenue)
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'product-manager-metrics-kpi-definer-scenario-1',
        title: 'Define metrics for a new analytics feature in Growth stage',
        userInput:
          'Define the key metrics and KPIs for our new analytics feature. We are in the Growth stage ' +
          'and the primary goal is increasing weekly active users who run at least one report per week.',
        expectedBehavior:
          'Claude should recommend a north star metric closely tied to the "weekly active users who run ' +
          'at least one report" goal, 3–5 supporting metrics that explain what drives report usage, ' +
          '1–2 guardrails (e.g., report generation time should not increase), and specific anti-metrics ' +
          'for Growth stage (e.g., total report count is an anti-metric because a single power user could ' +
          'skew it). Each metric must include a definition and measurement method. No fabricated benchmarks.',
        mustContain: ['analytics feature', 'Growth stage', 'weekly active users', 'report per week'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'product-manager-metrics-kpi-definer-scenario-2',
        title: 'Define metrics for an enterprise onboarding flow in Discovery stage',
        userInput:
          'What metrics should we track for our enterprise onboarding flow? We are in Discovery stage, ' +
          'primary goal is validating that admins can fully configure the product without support help.',
        expectedBehavior:
          'Claude should select a north star appropriate for Discovery, something that confirms the ' +
          'core workflow is learnable without assistance, such as "% of enterprise admins who complete ' +
          'full configuration within their first session without contacting support." Anti-metrics should ' +
          'call out what NOT to track at this stage (e.g., total configured accounts is a vanity metric ' +
          'when you have few accounts). Stage fit rationale must reference Discovery specifically. ' +
          'No fabricated enterprise benchmark data.',
        mustContain: ['enterprise onboarding', 'Discovery stage', 'configure the product', 'support help'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 9. Stakeholder Update ────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-product-manager-stakeholder-update-v1',
    slug: 'product-manager-stakeholder-update',
    name: 'Stakeholder Update',
    tagline: 'Write a clear, honest stakeholder update that surfaces risks without burying the lead',
    description:
      'Drafts a concise stakeholder update for a product initiative, covering delivery status, ' +
      'what shipped or was decided, what is coming next, risks, and decisions needed. ' +
      'Calibrated to the audience so executives get the essentials and peers get the context.',
    role: 'Product Manager',
    industry: 'Technology',
    tags: ['stakeholder-communication', 'product-management', 'status-update', 'roadmap', 'reporting'],
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

    instructionTemplate: `You write stakeholder updates for {{productName}}.

Delivery status: {{deliveryStatus}}

Audience: {{audienceLevel}}

{{#if openDecision}}
Open decision that needs input: {{openDecision}}
{{/if}}

Write a structured stakeholder update with the following sections:
1. Status line, one line: "Status: [On track / At risk / Blocked / Shipped], [one-sentence summary]"
2. This period, what shipped, was decided, or progressed (bullet list; 3–5 items maximum)
3. Next period, what is planned for the coming period (bullet list; 3–5 items maximum)
4. Risks, what could slip, and why (be specific about the risk and its impact; do not soften blockers)
5. Decisions needed, any outstanding decisions, each with an owner placeholder and a target date

Audience calibration:
- Executive leadership: compress to 5–7 bullets total; lead with business impact; skip implementation detail
- Cross-functional peers: full detail is appropriate; include context they need to do their part
- Engineering team: focus on what is changing, what is needed from them, and what blockers they can help unblock
- Mixed: prioritize the status line and risks; let each group drill into the sections they need

Rules:
1. Never bury a blocker inside the "next period" section, blockers belong in "Risks" with full context.
2. Do not soften the status color to avoid uncomfortable conversations, use the accurate status.
3. Decisions needed must name a specific owner placeholder and a date, not just "TBD."
4. Never fabricate metrics, delivery dates, or team decisions that were not provided.`,

    variables: [
      {
        key: 'productName',
        label: 'Product or initiative name',
        type: 'text',
        required: true,
        helpText: 'The product or initiative this update is about.',
        group: 'Update context',
      },
      {
        key: 'deliveryStatus',
        label: 'Delivery status',
        type: 'select',
        options: ['On track', 'At risk', 'Blocked', 'Shipped'],
        required: true,
        helpText: 'The accurate current delivery status. Choose "At risk" if there is any meaningful chance of slipping.',
        group: 'Update context',
      },
      {
        key: 'audienceLevel',
        label: 'Audience',
        type: 'select',
        options: ['Executive leadership', 'Cross-functional peers', 'Engineering team', 'Mixed'],
        default: 'Cross-functional peers',
        required: true,
        helpText: 'Who will read this update? Claude calibrates detail level and emphasis accordingly.',
        group: 'Update context',
      },
      {
        key: 'openDecision',
        label: 'Open decision needing input (optional)',
        type: 'text',
        required: false,
        helpText: 'A specific decision that needs stakeholder input. E.g. "whether to delay launch by one week to include accessibility fixes."',
        group: 'Update context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Stakeholder update template',
        purpose:
          'A fillable status update template with section definitions and audience calibration notes ' +
          'so every update follows the same structure regardless of who writes it.',
        kind: 'starter',
        content: `# Stakeholder Update Template

## Status line
Status: [On track / At risk / Blocked / Shipped], [one sentence: what this means right now]

## This period
- [What shipped, was decided, or materially progressed]
- [Keep to 3–5 bullets maximum, if there are more, summarize by theme]

## Next period
- [What is planned for the coming week / sprint / month]
- [Be specific: "Ship X to beta users" not "continue development"]

## Risks
- [Risk name]: [What could go wrong, the probability or signal you are seeing, and the impact if it does]
- [If the project is Blocked: name the specific blocker, who owns it, and what unblocks it]

## Decisions needed
| Decision | Owner | By when |
|----------|-------|---------|
| [Decision that needs a yes/no or a choice] | [Name or role] | [Date] |

---

## Audience calibration cheat sheet

**Executive leadership**: compress to 5–7 total bullets; lead with business impact ("launch slips = Q3 revenue miss"); skip technology names.

**Cross-functional peers**: full detail; include what you need FROM them; call out dependencies explicitly.

**Engineering team**: focus on what is changing in scope or timeline; name the specific technical decisions that need their input.

**Mixed audience**: put the status line and risks first; let each group read into the sections they care about.

---

## Common mistakes
- Softening "At risk" to "On track" to avoid a difficult conversation, this is how slips become surprises
- Burying a blocker inside "Next period", blockers always go in Risks
- Leaving "Decisions needed" without an owner and a date, these never get resolved
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'product-manager-stakeholder-update-scenario-1',
        title: 'Write an at-risk update for a slipped deadline',
        userInput:
          'Write a stakeholder update for the checkout redesign project. Status is At risk, we are ' +
          'two weeks behind because the payment gateway integration took longer than estimated. ' +
          'Audience is executive leadership.',
        expectedBehavior:
          'Claude should produce a concise executive-level update that leads with the At risk status and ' +
          'immediately states the two-week slip. The Risks section must name the payment gateway integration ' +
          'as the root cause with the business impact (revised launch date). It must not bury the slip in ' +
          '"This period" or soften the status. Decisions needed should flag whether to revise the launch ' +
          'date or reduce scope. No fabricated metrics or exact revised dates.',
        mustContain: ['checkout redesign', 'At risk', 'two weeks behind', 'payment gateway'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'product-manager-stakeholder-update-scenario-2',
        title: 'Write an on-track update for cross-functional peers',
        userInput:
          'Write an update on the mobile app relaunch for cross-functional peers. We are on track, just ' +
          'finished the beta with 200 testers, launch is still set for March 15th. The main open question ' +
          'is whether marketing has the campaign assets ready.',
        expectedBehavior:
          'Claude should produce a cross-functional peer update with full detail appropriate for peers. ' +
          'This period should include the beta completion. Next period should reference the March 15th ' +
          'launch. Decisions needed must include the marketing campaign assets question with an owner ' +
          'placeholder and a date before March 15th. The update should stay On track and not hedge ' +
          'unnecessarily. No fabricated beta feedback data.',
        mustContain: ['mobile app relaunch', 'on track', 'beta with 200 testers', 'March 15th'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 10. Bug Triage Summary ───────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-product-manager-bug-triage-summary-v1',
    slug: 'product-manager-bug-triage-summary',
    name: 'Bug Triage Summary',
    tagline: 'Convert a raw bug list into a structured triage summary with severity rankings and action owners',
    description:
      'Transforms a list of open bugs into a structured triage document: severity-ranked, grouped by ' +
      'user impact, with a recommended action (fix now / schedule / defer / close) for each item. ' +
      'Surfaces patterns across the bug set that point to a systemic root cause.',
    role: 'Product Manager',
    industry: 'Technology',
    tags: ['bug-triage', 'quality', 'product-management', 'incident-management', 'prioritization'],
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

    instructionTemplate: `You run bug triage for {{productName}}.

Triage period: {{triagePeriod}}

Severity scale in use: {{severityScale}}

{{#if includeWorkarounds}}
Include a known workaround for each bug where one exists.
{{/if}}

When given a list of bugs, produce a structured triage summary with:
1. Triage overview, total bugs, breakdown by severity, trend vs. last period (if data provided)
2. Severity-ranked bug table, columns: Bug | Severity | Users Affected | Recommended Action | Owner placeholder
3. Recommended actions, for each bug: Fix now (this sprint) / Schedule (next sprint) / Defer (backlog) / Close (not a bug or duplicate)
4. Pattern analysis, 2–3 observations about what the bug set reveals as a systemic issue, if any patterns exist
5. Top 3 bugs to escalate, the three items that need a decision or owner before the next triage cycle

Rules:
1. Severity assignments must use the {{severityScale}} scale, do not invent new severity levels.
2. Recommended actions must be justified by user impact, not just severity score alone.
3. If user count is unknown for a bug, flag it as [USER COUNT UNKNOWN] rather than guessing.
4. Never fabricate bug counts, crash rates, or error frequency data not provided.`,

    variables: [
      {
        key: 'productName',
        label: 'Product name',
        type: 'text',
        required: true,
        helpText: 'The product whose bugs are being triaged.',
        group: 'Triage context',
      },
      {
        key: 'triagePeriod',
        label: 'Triage period',
        type: 'select',
        options: ['Weekly', 'Sprint end', 'Monthly', 'Ad hoc'],
        default: 'Weekly',
        required: true,
        helpText: 'How often triage runs. Affects how the summary is framed and trended.',
        group: 'Triage context',
      },
      {
        key: 'severityScale',
        label: 'Severity scale',
        type: 'select',
        options: ['P0 / P1 / P2 / P3', 'Critical / High / Medium / Low', 'Severity 1–4'],
        default: 'P0 / P1 / P2 / P3',
        required: true,
        helpText: 'The severity framework your team uses. Claude will apply this scale consistently.',
        group: 'Triage context',
      },
      {
        key: 'includeWorkarounds',
        label: 'Include known workarounds',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to include a workaround note for each bug where one is known, so support can use the triage doc directly.',
        group: 'Triage context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Bug triage framework',
        purpose:
          'Severity definitions, recommended action criteria, and escalation triggers so every ' +
          'triage session applies the same logic and produces a consistent, actionable output.',
        kind: 'starter',
        content: `# Bug Triage Framework

## Severity definitions

### P0 / Critical / Severity 1
- Product is unusable for a significant user segment OR
- Data loss or security vulnerability is occurring OR
- Core revenue flow is broken
Action: Fix now, regardless of sprint. Escalate immediately.

### P1 / High / Severity 2
- Major feature broken for many users, with no workaround OR
- Significant performance degradation affecting user retention
Action: Fix now (this sprint) or start hotfix process.

### P2 / Medium / Severity 3
- Feature degraded but workaround exists OR
- Affects a minority of users with a clear edge case
Action: Schedule for next sprint.

### P3 / Low / Severity 4
- Minor cosmetic issue OR
- Edge case that affects very few users with low impact
Action: Add to backlog; review monthly.

## Recommended action definitions

| Action | When to use |
|--------|------------|
| Fix now | P0 or P1; no workaround; blocking users or revenue |
| Schedule | P2 or important P3; plan for next sprint |
| Defer | Low impact, low frequency; add to backlog for later |
| Close | Not reproducible, duplicate, or working as designed |

## Escalation triggers
Escalate a bug (to engineering lead or product leadership) when:
- It is P0 with no owner after 2 hours
- A P1 has been open for more than one sprint
- 3+ bugs in the same component suggest a systemic issue
- A bug is generating external customer complaints or NPS detractors

## Pattern analysis heuristics
Look for:
- Same component appearing in 3+ bugs → likely a systemic issue
- Same user segment affected repeatedly → onboarding or permissions problem
- Spike in P2/P3 after a recent release → release introduced regressions
- User count unknown on high-severity bugs → instrumentation gap
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'product-manager-bug-triage-summary-scenario-1',
        title: 'Triage a weekly bug list with a mix of severities',
        userInput:
          'Summarize this week\'s bug triage. Bugs: 1) Users cannot log in with SSO on Chrome v123, ' +
          'affects 800 enterprise users. 2) PDF export appends a blank page at the end. ' +
          '3) Search returns no results when query contains a colon. ' +
          '4) Email notifications send twice if user has multiple accounts.',
        expectedBehavior:
          'Claude should produce a triage summary with the overview, a severity-ranked table, a recommended ' +
          'action for each bug, pattern analysis, and a top-3 escalation list. The SSO login bug affecting ' +
          '800 enterprise users should be rated the highest severity (P0 or Critical) and flagged for immediate ' +
          'action. The duplicate email notification and search bug are likely P2. The PDF blank page is ' +
          'likely P3. Pattern analysis should note that 2 of 4 bugs relate to edge cases in data format ' +
          'handling. Claude must not fabricate user counts beyond what is provided.',
        mustContain: ['SSO on Chrome', 'PDF export', 'blank page', 'notifications send twice'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'product-manager-bug-triage-summary-scenario-2',
        title: 'Sprint-end triage with open and closed counts',
        userInput:
          'Write a sprint-end bug triage summary. Opened this sprint: 12 bugs. Closed: 8. Still open: ' +
          'P0, checkout crashes on iOS 17 when using Apple Pay. ' +
          'P1, CSV export cuts off rows after row 1000. ' +
          'P2, date picker shows wrong month on Safari.',
        expectedBehavior:
          'Claude should produce a sprint-end summary that leads with the triage overview (12 opened, ' +
          '8 closed, 4 still open). The checkout crash on iOS 17 with Apple Pay must be called out as ' +
          'the top escalation item, a P0 that is still open at sprint end requires immediate attention. ' +
          'The CSV export row limit bug is P1 and should be scheduled for the next sprint as a top priority. ' +
          'The Safari date picker is P2 and can be scheduled normally. Pattern analysis should note the ' +
          'concentration of issues in third-party integrations (Apple Pay, Safari). No fabricated data.',
        mustContain: ['sprint-end', 'checkout crashes on iOS 17', 'CSV export cuts off', 'Apple Pay'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },
];
