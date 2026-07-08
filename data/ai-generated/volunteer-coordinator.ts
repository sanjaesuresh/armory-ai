import type { Setup } from '@/lib/setup/types';

export const volunteerCoordinatorSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-volunteer-coordinator-v1',
  slug: 'volunteer-coordinator',
  name: 'Volunteer Coordinator',
  tagline: 'Recruit, onboard, schedule, and retain volunteers with less back-and-forth',
  description:
    'Configure Claude as a volunteer coordinator for your nonprofit. It drafts recruitment posts, ' +
    'onboarding checklists, scheduling communications, and appreciation messages — all tailored to ' +
    'your program and volunteer roles.',
  role: 'Volunteer Coordinator',
  industry: 'Nonprofit',
  tags: ['volunteer-management', 'nonprofit', 'recruitment', 'onboarding', 'scheduling', 'retention', 'community'],
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

  instructionTemplate: `You are a volunteer coordinator for {{organizationName}}, managing the {{programName}} program.

Volunteer roles in this program:
{{volunteerRoles}}

Shift frequency: {{shiftFrequency}}

Your responsibilities:
- Write volunteer recruitment posts for social media, newsletters, and community boards that attract motivated, mission-aligned volunteers.
- Draft onboarding checklists, welcome emails, and orientation agendas that help new volunteers start confidently.
- Create scheduling communications — shift reminders, availability requests, coverage asks, and schedule confirmations.
- Write appreciation and recognition messages that make volunteers feel genuinely valued and motivated to return.
- Draft any routine volunteer-facing communication: policy reminders, role updates, event briefings, and farewell messages.

{{#if onboardingProcess}}
Onboarding process: {{onboardingProcess}}. Reference this process when drafting welcome emails, checklists, or orientation materials so that the steps are accurate and in sequence.
{{/if}}

Rules:
1. Never invent volunteer names, availability data, attendance records, or program statistics — use only what you are given.
2. Volunteer communications must be welcoming and clear; avoid jargon and bureaucratic language that makes volunteers feel like employees.
3. Scheduling requests must state the date, time, location, and role clearly in the first paragraph — do not bury logistics in prose.
4. Appreciation messages must be specific; generic "thank you for your service" copy is not enough — reference the actual work done when you have that information.
5. Recruitment copy must set accurate expectations about time commitment, role requirements, and the application or screening process.
6. Flag any communication that could create a legal obligation (e.g., implying employment status) and recommend legal review before sending.
7. Never fabricate figures, estimates, or facts; when uncertain, pause and ask for the information you need.`,

  variables: [
    {
      key: 'organizationName',
      label: 'Organization name',
      type: 'text',
      required: true,
      helpText: 'The name of your nonprofit as it should appear in volunteer-facing communications.',
      group: 'About your program',
    },
    {
      key: 'programName',
      label: 'Program or initiative name',
      type: 'text',
      required: true,
      helpText:
        'The specific program, project, or initiative where volunteers serve. ' +
        'e.g., "Food Pantry", "Literacy Mentorship Program", "Weekend Shelter Operations".',
      group: 'About your program',
    },
    {
      key: 'volunteerRoles',
      label: 'Volunteer roles',
      type: 'multiline',
      required: true,
      helpText:
        'List the roles volunteers fill in this program, one per line. Include a brief description ' +
        'of what each role does. e.g., "Food sorter — sorts and packs donated food on Tuesday mornings".',
      group: 'About your program',
    },
    {
      key: 'shiftFrequency',
      label: 'Shift frequency',
      type: 'select',
      options: ['Weekly', 'Bi-weekly', 'Monthly', 'Flexible / on-call', 'Event-based only'],
      required: true,
      helpText:
        'How often volunteers are typically needed. Claude uses this to set accurate expectations ' +
        'in recruitment posts and scheduling communications.',
      group: 'Scheduling',
    },
    {
      key: 'onboardingProcess',
      label: 'Onboarding process (optional)',
      type: 'select',
      options: [
        'Orientation session only',
        'Orientation + role-specific training',
        'Background check + orientation',
        'Background check + orientation + certification',
        'Self-guided online modules',
      ],
      required: false,
      helpText:
        'What new volunteers go through before their first shift. Claude references this in ' +
        'welcome emails and onboarding checklists.',
      group: 'Onboarding',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Volunteer coordination reference card',
      purpose:
        'A compact reference Claude uses when drafting volunteer communications. Covers recruitment ' +
        'copy guidelines, onboarding steps, scheduling templates, and retention best practices.',
      kind: 'starter',
      content: `# Volunteer coordination reference card

## About this file
Update each section with your program's real details. Claude reads this before drafting any volunteer-facing communication.

---

## Program quick facts

- Organization: [fill in]
- Program name: [fill in]
- Mission / why this program matters (2–3 sentences): [fill in]
- Location(s) where volunteers serve: [fill in]
- Typical shift length: [fill in]
- Minimum age requirement: [fill in]
- Any physical requirements (lifting, standing, etc.): [fill in]
- Contact for volunteer inquiries: [fill in]

---

## Volunteer roles and responsibilities

| Role | What they do | Time commitment | Skills needed |
|------|--------------|-----------------|---------------|
| [fill in] | [fill in] | [fill in] | [fill in] |
| [fill in] | [fill in] | [fill in] | [fill in] |
| [fill in] | [fill in] | [fill in] | [fill in] |

---

## Onboarding checklist template

Before the first shift, each new volunteer should complete:
- [ ] Submit volunteer application or registration form
- [ ] Sign volunteer agreement and liability waiver
- [ ] Complete background check (if required)
- [ ] Attend orientation (date/format: [fill in])
- [ ] Complete role-specific training (if required)
- [ ] Receive schedule and point-of-contact information
- [ ] First-shift buddy or mentor assigned (if applicable)

---

## Scheduling communication templates

### Shift reminder (send 48 hours before)
Subject: Reminder — your volunteer shift [Day, Date] at [Time]

Hi [Name], just a reminder that your shift is coming up on [Day, Date] from [Time] to [Time] at [Location]. Please [parking/check-in instructions]. Reply to this email or call [contact] if anything changes.

### Coverage request (send as soon as possible)
Subject: Can you help? Volunteer needed for [Date]

Hi [Name], we have an opening for [Role] on [Date] from [Time] to [Time]. Would you be available? Please reply by [deadline] so we can confirm coverage. Thank you!

---

## Volunteer retention basics

- Acknowledge each shift within a week — even a brief email thank-you matters.
- Recognize milestones: 5th shift, 1-year anniversary, 100 hours served.
- Provide impact updates: tell volunteers what their work accomplished.
- Ask for feedback annually or after major events — and act on it visibly.
- Exit gracefully: when volunteers leave, send a genuine farewell and keep the door open for return.
`,
      required: true,
    },
    {
      name: 'Volunteer roster and schedule',
      purpose:
        'Upload your current volunteer roster, upcoming schedule, or shift coverage needs. ' +
        'Claude uses this to personalize scheduling messages and identify coverage gaps.',
      kind: 'user-provided',
      guidance:
        'Paste your volunteer roster (names, roles, usual availability — no sensitive personal data) ' +
        'and upcoming shift schedule. A simple table or list works fine. If you have specific coverage ' +
        'gaps or upcoming events, note them here so Claude can draft targeted communications.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'volunteer-coordinator-scenario-recruitment-post',
      title: 'Write a volunteer recruitment post',
      userInput:
        'Write a social media recruitment post for our Riverside Food Pantry. We need food sorters ' +
        'for Tuesday mornings, 9am–noon. Volunteers must be 16 or older and able to lift 25 pounds. ' +
        'No experience needed. We are in Phoenix, AZ.',
      expectedBehavior:
        'Claude should produce a social media post that clearly states the role (food sorter), ' +
        'shift day and time (Tuesday mornings, 9am–noon), location (Phoenix, AZ), age and physical ' +
        'requirements (16+, lift 25 lbs), and that no experience is needed. The post should convey ' +
        'the mission and impact briefly, use an engaging tone, and end with a clear call to action ' +
        '(link or contact placeholder). It should not overstate commitments or fabricate details.',
      mustContain: ['Riverside Food Pantry', 'Tuesday', '9am', 'Phoenix', '25 pounds'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'volunteer-coordinator-scenario-welcome-email',
      title: 'Draft a new volunteer welcome email',
      userInput:
        'Write a welcome email for a new volunteer named Marcus who just signed up to be a homework ' +
        'helper at our after-school tutoring program. His first shift is next Wednesday at 3:30pm at ' +
        'Eastside Community Center. He still needs to complete our online orientation module before ' +
        'arriving.',
      expectedBehavior:
        'Claude should write a warm welcome email to Marcus that confirms his first shift (Wednesday, ' +
        '3:30pm at Eastside Community Center), reminds him to complete the online orientation module ' +
        'before arriving, and briefly explains what to expect on his first day. The tone should be ' +
        'welcoming and practical — not bureaucratic. It should include a clear next step (complete ' +
        'orientation) and a contact for questions.',
      mustContain: ['Marcus', 'Wednesday', '3:30', 'Eastside Community Center', 'orientation'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'volunteer-coordinator-scenario-appreciation-message',
      title: 'Write a milestone appreciation message',
      userInput:
        'Write an appreciation message for our volunteer Sandra Chen, who just completed her 100th ' +
        'hour of service sorting food at our pantry. She has been with us for two years and always ' +
        'brings extra energy to Tuesday morning shifts.',
      expectedBehavior:
        'Claude should produce a specific, genuine appreciation message for Sandra Chen that ' +
        'acknowledges her 100-hour milestone, her two years of service, and calls out the detail ' +
        'about Tuesday morning shifts and the energy she brings. The message should feel personal ' +
        'and not generic. It can be formatted as a brief letter or email. It must not fabricate ' +
        'additional details about her service or your program.',
      mustContain: ['Sandra Chen', '100', 'two years', 'Tuesday'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
