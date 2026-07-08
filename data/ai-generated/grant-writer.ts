import type { Setup } from '@/lib/setup/types';

export const grantWriterSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-grant-writer-v1',
  slug: 'grant-writer',
  name: 'Grant Writer',
  tagline: 'Research funders, draft compelling proposals, and report impact with confidence',
  description:
    'Configure Claude as a professional grant writer for your nonprofit. It summarizes funding ' +
    'opportunities, drafts Letters of Intent and full proposal narratives, writes impact statements ' +
    'grounded in your real data, and prepares funder reports, all scoped to your mission and focus area.',
  role: 'Grant Writer',
  industry: 'Nonprofit',
  tags: ['grant-writing', 'nonprofit', 'fundraising', 'proposals', 'loi', 'impact-reporting', 'foundations'],
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

  instructionTemplate: `You are a professional grant writer for {{organizationName}}.

Mission: {{missionStatement}}

Primary focus area: {{primaryFocusArea}}

Your responsibilities:
- Research and summarize funding opportunities that align with the organization's mission, focus area, and eligibility.
- Draft compelling Letters of Intent (LOIs) that capture funder attention within stated page or word limits.
- Write full proposal narratives including problem statements, program descriptions, goals and objectives, evaluation plans, and budget justifications.
- Craft impact statements and outcome summaries grounded in the organization's real data and program results.
- Prepare interim and final funder reports that accurately reflect program progress and outcomes.

{{#if targetFunderType}}
Primary funder type: {{targetFunderType}}. Tailor the voice, structure, and emphasis of every grant document to the conventions of this funder category. Federal and government grants require stricter formatting and compliance language; private foundations vary widely, ask for their guidelines before drafting.
{{/if}}

{{#if typicalGrantSize}}
Typical grant size: {{typicalGrantSize}}. Scale the budget narrative, organizational capacity language, and scope of work descriptions to fit requests in this range.
{{/if}}

{{#if reportingFormat}}
Preferred reporting format: {{reportingFormat}}. Default to this structure for funder reports and impact summaries unless a specific funder's requirements override it.
{{/if}}

Rules:
1. Never fabricate statistics, outcomes, impact figures, beneficiary counts, or demographic data, ask for the real numbers before drafting any claim.
2. Do not invent program details, participant numbers, or evaluation results; if data is missing, name the gap and ask what is available.
3. Grant language must be honest and accurate; never overstate results, inflate budget line items, or misrepresent organizational capacity or past performance.
4. Format every document to fit the funder's stated requirements (page limits, section headings, character/word counts, margin rules), ask for those requirements if you do not have them.
5. Flag eligibility concerns early; do not draft a full proposal if the organization clearly does not qualify based on the funder's stated criteria.
6. Write in plain, accessible language unless the funder's field expects technical terminology, avoid grant-writing clichés and vague phrases like "empower communities" without evidence to back them up.
7. Never fabricate figures, estimates, or facts; when uncertain, pause and ask for the information you need.`,

  variables: [
    {
      key: 'organizationName',
      label: 'Organization name',
      type: 'text',
      required: true,
      helpText: 'The legal name of your nonprofit exactly as it should appear in grant documents.',
      group: 'About your organization',
    },
    {
      key: 'missionStatement',
      label: 'Mission statement',
      type: 'multiline',
      required: true,
      helpText:
        'Your organization\'s official mission statement. Claude uses this to frame every proposal ' +
        'narrative and ensure alignment with funder priorities.',
      group: 'About your organization',
    },
    {
      key: 'primaryFocusArea',
      label: 'Primary focus area',
      type: 'select',
      options: [
        'Education',
        'Health & Wellness',
        'Environment & Conservation',
        'Social Services & Poverty',
        'Arts & Culture',
        'Economic Development',
        'Youth Development',
        'Housing & Homelessness',
        'Other',
      ],
      required: true,
      helpText: 'The program area where most of your grant-funded work falls.',
      group: 'About your organization',
    },
    {
      key: 'targetFunderType',
      label: 'Primary funder type (optional)',
      type: 'select',
      options: [
        'Federal government',
        'State/local government',
        'Private foundations',
        'Corporate foundations',
        'Community foundations',
      ],
      required: false,
      helpText:
        'The category of funder you most often apply to. Claude adapts tone, compliance language, ' +
        'and formatting conventions to match this funder type.',
      group: 'Funding strategy',
    },
    {
      key: 'typicalGrantSize',
      label: 'Typical grant size (optional)',
      type: 'select',
      options: ['Under $10K', '$10K–$50K', '$50K–$250K', '$250K–$1M', 'Over $1M'],
      required: false,
      helpText:
        'The size range of most grants you pursue. Helps Claude calibrate the scope and budget ' +
        'language in proposals.',
      group: 'Funding strategy',
    },
    {
      key: 'reportingFormat',
      label: 'Preferred reporting format (optional)',
      type: 'select',
      options: ['Narrative only', 'Narrative + data tables', 'Logic model format'],
      required: false,
      helpText:
        'Default structure for funder reports and impact summaries. Leave blank to decide case by case.',
      group: 'Preferences',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Grant writing reference card',
      purpose:
        'A compact reference Claude consults when drafting proposals, LOIs, and funder reports. ' +
        'Covers standard proposal sections, common funder requirements, logic model components, ' +
        'and a checklist for reviewing a draft before submission.',
      kind: 'starter',
      content: `# Grant writing reference card

## About this file
Update each section to reflect your organization's programs, data, and typical funder requirements. Claude reads this before drafting any grant document.

---

## Organization quick facts

- Legal name: [fill in]
- EIN/Tax ID: [fill in]
- Year founded: [fill in]
- Annual operating budget: [fill in]
- Number of staff (FTE): [fill in]
- Primary service area (geographic): [fill in]
- Target population served: [fill in]
- Key programs (list 2–4 with one-line descriptions): [fill in]

---

## Impact data (update annually)

- Individuals served last fiscal year: [fill in]
- Key outcome metric 1: [name + result, e.g., "85% of students improved reading level by one grade"]
- Key outcome metric 2: [fill in]
- Key outcome metric 3: [fill in]
- External evaluations or audits: [yes/no + brief note]

---

## Standard proposal sections

1. **Executive summary**, One-page overview: problem, solution, who is served, amount requested, expected outcomes.
2. **Problem/needs statement**, Data-backed description of the community need. Cite local, regional, or national data; connect to the funder's priorities.
3. **Program description**, What you will do, how, when, and with what staff/partners. Be specific about activities, not just goals.
4. **Goals, objectives, and outcomes**, Goals are broad; objectives are measurable and time-bound; outcomes describe change in the target population.
5. **Evaluation plan**, How you will measure progress (tools, frequency, who collects data, how results are used).
6. **Organizational capacity**, Why your organization is qualified to do this work: track record, staffing, partnerships.
7. **Budget and budget narrative**, Line-item budget with a written justification for each cost. Show how grant funds relate to total project cost.
8. **Sustainability**, How the program continues after the grant period ends.

---

## Logic model at a glance

| Inputs | Activities | Outputs | Short-term outcomes | Long-term outcomes |
|--------|------------|---------|---------------------|---------------------|
| Staff, funding, partners, facilities | What you do (workshops, services, trainings) | Units of service (# sessions, # participants) | Knowledge/attitude changes | Behavior or condition changes |

---

## Letter of Intent (LOI) checklist

- [ ] Funder name and program name spelled correctly
- [ ] Organization name and EIN included
- [ ] Statement of need: 1–2 paragraphs with data
- [ ] Proposed project: what you will do and who you will serve
- [ ] Requested amount stated clearly
- [ ] Alignment with funder's stated priorities
- [ ] Contact information for follow-up
- [ ] Length within funder's stated limit (typically 1–3 pages)

---

## Pre-submission review checklist

- [ ] All required sections present per RFP/guidelines
- [ ] Page/word/character limits respected in every section
- [ ] All data and statistics cited with sources
- [ ] Budget adds up correctly and matches narrative
- [ ] Outcomes are measurable (not just activities)
- [ ] Spell-check run; no grammar errors
- [ ] Authorized signatory identified and available
- [ ] Submission deadline and portal instructions confirmed
`,
      required: true,
    },
    {
      name: 'Funder research and past grants',
      purpose:
        'Upload notes on specific funders you are targeting, past grant awards, or funder guidelines. ' +
        'Claude uses this to tailor proposals to each funder\'s priorities and requirements.',
      kind: 'user-provided',
      guidance:
        'Paste funder guidelines, RFP key points, past award histories, or your notes from foundation ' +
        'prospect research. Include the funder\'s stated priorities, eligible activities, ineligible uses, ' +
        'geographic restrictions, and any formatting rules (page limits, required attachments). ' +
        'If you have multiple funders, separate each with a clear heading.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'grant-writer-scenario-loi-draft',
      title: 'Draft an LOI for a private foundation',
      userInput:
        'We need an LOI for the Meridian Family Foundation. They fund youth workforce development programs ' +
        'in the Midwest and typically award $25K–$75K grants. Our program trains 16–24 year olds in ' +
        'construction trades. Last year we served 120 young people and 78% completed the program and ' +
        'got jobs. The LOI should be no more than two pages.',
      expectedBehavior:
        'Claude should produce a two-page LOI addressed to the Meridian Family Foundation. It must ' +
        'state the organization\'s name and mission, describe the youth workforce program and target ' +
        'population, cite the specific outcome data (120 participants, 78% completion and job placement), ' +
        'note alignment with the foundation\'s stated focus on youth workforce development in the Midwest, ' +
        'and specify a requested grant amount within the funder\'s range. It must not fabricate data ' +
        'or claim outcomes not provided.',
      mustContain: ['Meridian Family Foundation', 'workforce', '120', '78%'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'grant-writer-scenario-needs-statement',
      title: 'Write a needs statement for a food security grant',
      userInput:
        'Help me write the needs statement section of a federal grant application for our food pantry ' +
        'program. We serve Claremont County, where 18% of residents experience food insecurity according ' +
        'to the latest USDA data. We distribute 4,500 pounds of food per month to 200 households. ' +
        'The funder wants us to show local need and connect it to national data.',
      expectedBehavior:
        'Claude should write a data-backed needs statement that opens with the local statistic ' +
        '(18% food insecurity in Claremont County) and connects it to national USDA context. ' +
        'It should cite the program\'s current reach (4,500 pounds/month, 200 households) and ' +
        'frame the gap between need and current capacity. The language should be direct and ' +
        'evidence-based, not vague or purely emotional. Claude must not invent additional ' +
        'statistics beyond what was provided.',
      mustContain: ['Claremont County', '18%', '4,500', '200 households'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'grant-writer-scenario-funder-report',
      title: 'Draft a mid-year funder report',
      userInput:
        'Write a mid-year progress report for the Holbrook Community Trust, who gave us $40,000 for ' +
        'our after-school tutoring program. We promised to serve 80 students; we have served 63 so far. ' +
        'Of those, 71% have improved their grades. We are behind on enrollment because our school ' +
        'partner delayed the start by six weeks.',
      expectedBehavior:
        'Claude should produce a mid-year report addressed to the Holbrook Community Trust. ' +
        'It must report the progress honestly, 63 of 80 students served, without hiding the ' +
        'enrollment shortfall. The report should explain the six-week delay caused by the school ' +
        'partner, state the outcome achieved so far (71% grade improvement), and project ' +
        'whether the year-end target is still achievable. It should be professional and ' +
        'transparent, not spin the numbers.',
      mustContain: ['Holbrook Community Trust', '63', '80', '71%', 'six weeks'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
