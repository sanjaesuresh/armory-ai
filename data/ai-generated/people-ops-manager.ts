import type { Setup } from '@/lib/setup/types';

export const peopleOpsManagerSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-people-ops-manager-v1',
  slug: 'people-ops-manager',
  name: 'People Ops Manager',
  tagline: 'Engagement surveys, process docs, manager enablement, and internal announcements',
  description:
    'Configure Claude as a People Operations Manager for your organization. It plans ' +
    'engagement survey cycles, writes process documentation, builds manager enablement ' +
    'guides, and drafts internal announcements, all scaled to your company size, work ' +
    'model, and people calendar.',
  role: 'People Ops Manager',
  industry: 'HR & People',
  tags: ['people-ops', 'engagement', 'manager-enablement', 'process-docs', 'hr-communications', 'culture'],
  category: 'hr',
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

  instructionTemplate: `You are a People Operations Manager at {{companyName}}, supporting a workforce of {{companySize}} employees.

Work model: {{workModel}}. Tailor all programs, communications, and process documentation to fit this model, remote-first teams need different engagement tactics and onboarding flows than in-office or hybrid teams.

{{#if peoplePlatform}}
People platform in use: {{peoplePlatform}}. Reference {{peoplePlatform}} workflows and terminology when documenting processes, survey cadences, or manager tools.
{{/if}}

{{#if reviewCycle}}
People calendar context: {{reviewCycle}}. Align all planning timelines, announcements, and process docs to this cycle.
{{/if}}

Your responsibilities:
- Design engagement survey plans including cadence, question sets, communication templates, and manager action-planning guides.
- Write clear, structured process documentation for people programs (onboarding, offboarding, performance cycles, promotions).
- Build manager enablement guides covering feedback conversations, check-in cadences, team engagement actions, and career development support.
- Draft internal announcements for org changes, new people programs, policy updates, and company milestones.

Rules:
1. Never disclose or reference individual employee performance, compensation, or personal data in process documentation or announcements.
2. All language must be inclusive and non-discriminatory. Avoid language that unintentionally favors in-person employees when documenting programs that apply to distributed or hybrid teams.
3. Engagement survey question sets must not ask about protected characteristics in a way that could create legal exposure, flag any question that approaches that line and recommend legal review.
4. When a process change affects compensation, employment status, or benefits eligibility, flag that HR and legal review is required before finalizing or communicating it.
5. Internal announcements should be direct and specific, avoid vague corporate-speak language that erodes employee trust.
6. Keep all employee data and case details confidential. Do not use identifiable information in templates or examples unless it was provided in this conversation.`,

  variables: [
    {
      key: 'companyName',
      label: 'Company name',
      type: 'text',
      required: true,
      helpText: 'Your organization\'s name as it should appear in announcements and program materials.',
      group: 'About your organization',
    },
    {
      key: 'companySize',
      label: 'Approximate headcount',
      type: 'select',
      options: ['1–50', '51–200', '201–1,000', '1,001–5,000', '5,000+'],
      default: '51–200',
      required: true,
      helpText:
        'Scale matters for people programs, a 30-person team runs engagement differently than a 3,000-person org.',
      group: 'About your organization',
    },
    {
      key: 'workModel',
      label: 'Work model',
      type: 'select',
      options: ['In-office', 'Remote-first', 'Hybrid'],
      default: 'Hybrid',
      required: true,
      helpText:
        'Claude adapts engagement programs, onboarding materials, and manager guides to fit your model.',
      group: 'About your organization',
    },
    {
      key: 'peoplePlatform',
      label: 'People platform (optional)',
      type: 'text',
      required: false,
      helpText:
        'e.g., Lattice, Culture Amp, Workday, Leapsome. Claude will reference its terminology when documenting processes.',
      group: 'Programs',
    },
    {
      key: 'reviewCycle',
      label: 'People calendar context (optional)',
      type: 'text',
      required: false,
      helpText:
        'e.g., "Annual reviews in December; mid-year check-in in June; engagement survey in Q1." Claude aligns planning to this cycle.',
      group: 'Programs',
    },
  ],

  knowledgeFiles: [
    {
      name: 'People programs reference card',
      purpose:
        'A structured reference covering engagement survey design, manager enablement principles, ' +
        'and announcement templates. Claude uses this as a starting point when planning a new ' +
        'program or drafting a communication. Update each section to match your organization\'s ' +
        'terminology and existing programs.',
      kind: 'starter',
      content: `# People programs reference card

## About this file
Update each section to match your organization's programs, calendar, and terminology. Claude reads this before planning new programs or drafting communications.

---

## Engagement survey design principles

### Cadence options
- **Annual pulse**, one comprehensive survey per year; good for tracking year-over-year trends
- **Quarterly pulse**, short (5–10 question) check-ins; better for fast-moving teams and timely action
- **Always-on**, triggered after key moments (onboarding at 30/60/90 days, manager change, promotion)

### Standard question categories
1. Engagement driver: "I feel motivated by the work I do."
2. Manager effectiveness: "My manager gives me useful feedback."
3. Career growth: "I have clear opportunities to grow at this company."
4. Belonging: "I feel like I belong here."
5. Workload and wellbeing: "My workload is manageable."
6. Company direction: "I understand where the company is heading."

### Question writing rules
- Use a consistent scale (e.g., 1–5 or 1–10) across the entire survey
- Keep each question to one idea, do not double-barrel ("My manager is supportive and communicates well")
- Avoid jargon or company-specific acronyms in survey questions
- Include one or two open-text questions for qualitative signal

### Results communication
- Share headline results within 2 weeks of survey close
- Acknowledge areas of strength AND areas for improvement
- Commit to a specific number of actions, not a vague "we will take action"
- Assign action owners and share a timeline

---

## Manager enablement, core topics

### Feedback conversations
- SBI model: Situation → Behavior → Impact
- Separate positive feedback from developmental feedback (do not bury it in a praise sandwich)
- Schedule recurring 1:1s; do not rely on ad-hoc feedback only

### Check-in cadence (recommended)
| Check-in type | Frequency |
|---|---|
| Weekly 1:1 | Weekly, 30 min |
| Team pulse | Monthly, 15–20 min retrospective |
| Career conversation | Quarterly, 45 min growth-focused |
| Annual review | Annually, formal documented review |

### Team engagement actions (by manager)
- Recognize contributions publicly and specifically
- Connect team members' work to company mission
- Remove blockers actively, do not wait for escalations
- Involve the team in decisions where input is genuinely welcome

---

## Internal announcement template

**Subject:** [Specific and action-oriented, not "Important Update"]

Opening: State the change or news in the first sentence. Do not bury the headline.

Context: Two or three sentences explaining why this is happening.

What it means for employees: Bullet points covering what changes, what stays the same, and when it takes effect.

Next steps: What employees need to do (if anything) and by when.

Questions: Who to contact and how.

---

## Offboarding process (standard steps)
1. Manager notifies People Ops on day of resignation or termination decision
2. IT and systems access revoke scheduled for last day
3. Final pay and PTO payout calculated per state law
4. Equipment return logistics confirmed
5. Exit interview scheduled (voluntary resignation only)
6. Knowledge transfer plan agreed with manager
7. Announcement drafted for the team (by manager, reviewed by People Ops)
`,
      required: true,
    },
    {
      name: 'Existing people programs overview',
      purpose:
        'Upload a summary of your current people programs, engagement survey results, OKRs ' +
        'for the people function, existing manager training content, or your HR calendar. Claude ' +
        'uses this to ground new program plans and communications in what your organization already does.',
      kind: 'user-provided',
      guidance:
        'Paste a summary of your current people programs: what engagement surveys you run and when, ' +
        'the current state of manager training, any OKRs or goals for the People team, and your HR ' +
        'calendar for the next two quarters. Remove any employee-specific data (individual survey scores, ' +
        'compensation details) before uploading, aggregate data and program descriptions only.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'people-ops-manager-scenario-1',
      title: 'Plan a quarterly engagement pulse survey',
      userInput:
        'We want to launch our first quarterly pulse survey next month. We have only done annual ' +
        'surveys before. We are a hybrid team of about 150 people. What should the plan look like, ' +
        'and what questions should we include?',
      expectedBehavior:
        'Claude should produce a practical quarterly pulse survey plan covering: timeline (design, ' +
        'launch, close, results share), a suggested question set of 5–8 items drawn from standard ' +
        'engagement categories, communication plan guidance, and how to keep the pulse meaningfully ' +
        'different from the annual survey. It should acknowledge the hybrid work model and include ' +
        'at least one question relevant to distributed work. It must not invent survey platform ' +
        'details or specific company programs not mentioned.',
      mustContain: ['pulse', 'questions', 'hybrid', 'results'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'people-ops-manager-scenario-2',
      title: 'Write a manager enablement guide for feedback conversations',
      userInput:
        'Our managers consistently score low on the "gives useful feedback" question in our survey. ' +
        'Write a one-page enablement guide they can reference when preparing for a feedback conversation.',
      expectedBehavior:
        'Claude should produce a concise, practical one-page guide covering: the purpose of feedback ' +
        'conversations, a concrete model for structuring feedback (such as SBI: Situation, Behavior, ' +
        'Impact), what to prepare in advance, how to open the conversation, common pitfalls to avoid, ' +
        'and a brief example of feedback delivered well versus poorly. It should be written in plain ' +
        'language a manager without HR background can apply immediately.',
      mustContain: ['feedback', 'Situation', 'Behavior', 'manager'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'people-ops-manager-scenario-3',
      title: 'Draft an internal announcement for a benefits provider change',
      userInput:
        'Draft an internal announcement letting employees know that starting September 1, the company ' +
        'is switching health insurance providers from BlueCross to Aetna. Open enrollment runs ' +
        'August 10–24. Employees need to re-enroll, coverage does not automatically roll over.',
      expectedBehavior:
        'Claude should produce a clear, direct internal announcement with the change stated upfront ' +
        '(switching from BlueCross to Aetna on September 1), open enrollment dates (August 10–24), ' +
        'a clear call to action (employees must re-enroll; coverage does not roll over), and guidance ' +
        'on where to get help. The tone should be informative without being alarming. It must not ' +
        'invent plan details, premium changes, or network information not provided.',
      mustContain: ['BlueCross', 'Aetna', 'September 1', 'August 10'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
