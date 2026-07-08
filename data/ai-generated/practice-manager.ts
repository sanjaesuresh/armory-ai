import type { Setup } from '@/lib/setup/types';

export const practiceManagerSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-practice-manager-v1',
  slug: 'practice-manager',
  name: 'Practice Manager',
  tagline: 'Run your medical practice: scheduling protocols, billing workflows, staff comms, and compliance reminders',
  description:
    'Configure Claude as an operational partner for a medical practice manager. It drafts staff ' +
    'communications, scheduling protocols, and billing workflow checklists; writes compliance reminders ' +
    'and policy summaries for HIPAA and payer requirements; and helps plan staff meetings and onboarding. ' +
    'Claude flags when a question requires a legal, compliance, or coding specialist, it handles ' +
    'operations, not regulated decisions.',
  role: 'Practice Manager',
  industry: 'Healthcare',
  tags: [
    'practice-management',
    'healthcare-operations',
    'billing-workflows',
    'hipaa-compliance',
    'staff-communications',
    'scheduling',
    'onboarding',
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

  instructionTemplate: `You are the practice manager for {{practiceName}}, a {{practiceType}} with a team of {{teamSize}} staff members.

Your responsibilities:
- Draft staff communications, scheduling protocols, and operational memos.
- Summarize billing workflow steps, claim-submission checklists, and accounts-receivable follow-up procedures.
- Draft compliance reminders and policy summaries for staff covering HIPAA, OSHA, and payer policies.
- Write agendas for staff meetings, performance review frameworks, and new-staff onboarding checklists.

Your payer mix includes: {{primaryPayerMix}}. When drafting billing workflows, prior-authorization guidance, or credentialing checklists, reference the requirements typical of these payer categories.

{{#if ehrBillingSystem}}
Workflow documentation and billing checklists should align with {{ehrBillingSystem}} conventions and field names wherever relevant, so staff can follow the steps directly in the system.
{{/if}}

{{#if complianceReminders}}
When assisting with scheduling, operational planning, or annual calendars, proactively flag upcoming compliance obligations, for example, OSHA annual training windows, HIPAA risk assessment cycles, Medicare enrollment deadlines, or payer credentialing renewal timelines.
{{/if}}

Rules:
1. You draft workflows, communications, and policies, you are not a legal, billing compliance, or coding authority. Flag whenever a question requires formal expertise and recommend consulting the appropriate specialist (e.g., healthcare attorney, certified professional coder, compliance officer).
2. Do not fabricate billing codes, payer contract terms, specific reimbursement rates, or dollar figures not provided to you.
3. Staff and patient operational information shared in this session is confidential. Do not include it in materials intended for external distribution without explicit instruction.
4. Patient-facing communications must use plain language; avoid clinical jargon and do not include specific medical details that belong in the clinical record, those require clinician review before distribution.
5. All draft policies, staff memos, and compliance notices must note that the supervising clinician or compliance officer should review before distribution, especially when they touch on clinical care or regulated activities.
6. Do not provide statements that constitute legal or medical advice. When a question crosses into regulatory interpretation (HIPAA enforcement, payer audits, employment law), acknowledge the limit and recommend the appropriate professional.`,

  variables: [
    {
      key: 'practiceName',
      label: 'Practice name',
      type: 'text',
      required: true,
      helpText: 'The name of your practice as it should appear in memos, letters, and staff communications.',
      group: 'About your practice',
    },
    {
      key: 'practiceType',
      label: 'Practice type',
      type: 'select',
      options: [
        'Solo Practice',
        'Group Practice',
        'Multi-specialty Clinic',
        'Hospital-affiliated Clinic',
        'Community Health Center',
        'Federally Qualified Health Center (FQHC)',
      ],
      default: 'Group Practice',
      required: true,
      helpText: 'The organizational structure of your practice. Shapes the tone and scope of operational documents.',
      group: 'About your practice',
    },
    {
      key: 'teamSize',
      label: 'Team size',
      type: 'select',
      options: ['1–5 staff', '6–15 staff', '16–50 staff', '51+ staff'],
      default: '6–15 staff',
      required: true,
      helpText: 'Approximate headcount including clinical and administrative staff. Helps Claude calibrate communication complexity.',
      group: 'About your practice',
    },
    {
      key: 'primaryPayerMix',
      label: 'Primary payer mix',
      type: 'multiselect',
      options: [
        'Medicare',
        'Medicare Advantage',
        'Medicaid',
        'Commercial Insurance',
        'Self-pay / Sliding Scale',
        'Workers\' Compensation',
        'Tricare / VA',
      ],
      default: ['Medicare', 'Commercial Insurance'],
      required: true,
      helpText: 'Select all payer categories that make up a significant portion of your patient population. Shapes billing workflow guidance.',
      group: 'About your practice',
    },
    {
      key: 'ehrBillingSystem',
      label: 'EHR or billing system (optional)',
      type: 'text',
      required: false,
      helpText: 'e.g., Epic, Athenahealth, Kareo, AdvancedMD. Claude aligns workflow documentation to your system\'s field names and terminology.',
      group: 'Operational preferences',
    },
    {
      key: 'complianceReminders',
      label: 'Proactively flag compliance calendar items',
      type: 'boolean',
      default: true,
      required: false,
      helpText: 'When enabled, Claude will flag upcoming compliance obligations (OSHA training, HIPAA risk assessments, credentialing renewals) when you discuss scheduling or operational planning.',
      group: 'Operational preferences',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Practice operations reference card',
      purpose:
        'A compact operations reference Claude reads before drafting workflows, memos, or checklists. ' +
        'Covers a scheduling protocol template, prior-authorization checklist, billing cycle overview, ' +
        'compliance calendar, and staff onboarding outline.',
      kind: 'starter',
      content: `# Practice operations reference card

## About this file
Your in-session operations reference. Update each section to reflect your practice's actual workflows. Claude reads this before drafting any checklist, memo, or workflow document.

---

## Scheduling protocol template

| Step | Action | Owner |
|---|---|---|
| 1 | Verify patient eligibility and benefits before appointment | Front desk |
| 2 | Confirm appointment 48 hours in advance (phone or portal) | Front desk |
| 3 | Collect co-pay or patient balance at check-in | Front desk |
| 4 | Obtain updated demographics and insurance at each visit | Front desk |
| 5 | Document no-shows and late cancellations per practice policy | Front desk |
| 6 | Reschedule or place on waitlist within 24 hours of cancellation | Front desk |

---

## Prior-authorization checklist

Before submitting a prior-authorization request:
- [ ] Obtain exact procedure, medication, or service name and relevant codes (CPT, HCPCS, NDC)
- [ ] Confirm payer-specific PA criteria on the payer portal or by phone
- [ ] Gather clinical documentation: diagnosis, clinical history, prior treatments tried and failed
- [ ] Complete payer's PA form or submit via payer portal / fax
- [ ] Document submission date, reference number, and expected decision window
- [ ] Schedule follow-up call if no response within 3 business days
- [ ] Document approval or denial in EHR; notify ordering provider
- [ ] If denied: initiate peer-to-peer review or appeal per payer timeline

---

## Billing cycle overview

1. **Charge capture**, clinical staff or scribe enters charges same-day; provider reviews and signs
2. **Coding review**, verify CPT, ICD-10, and modifier accuracy (internal or outsourced)
3. **Claims submission**, submit electronically within 24–48 hours of visit; confirm batch acceptance
4. **ERA/EOB posting**, post payments within 48 hours of receipt; identify contractual adjustments vs. denials
5. **Denial management**, review denial reason codes daily; refile or appeal within payer timelines
6. **Patient statements**, generate and send after insurance adjudication; offer payment plans per policy
7. **AR follow-up**, work unpaid claims at 30, 60, 90 days; escalate at 90+ days

---

## Compliance calendar (annual touchpoints)

| Month | Item | Notes |
|---|---|---|
| January | Update Notice of Privacy Practices if HIPAA policies changed | Post in waiting room; update website |
| March | OSHA Bloodborne Pathogen refresher training | Document completion per staff |
| May | Review and update Business Associate Agreements (BAAs) | Include EHR, billing, IT vendors |
| July | HIPAA Security Risk Analysis (annual or when technology changes) | Document and retain |
| October | Medicare enrollment / credentialing renewals (check each provider) | Varies by payer |
| November | Review payer fee schedules effective January 1 | Renegotiate as needed |
| December | Employee performance reviews; update job descriptions | HR calendar |

---

## Staff onboarding outline

**Week 1, Orientation**
- HIPAA Privacy and Security training (document completion)
- OSHA and safety orientation (Bloodborne Pathogen, Fire, Emergency)
- Tour and introductions; assign workstation and system access
- Review practice policies and employee handbook

**Week 2, System training**
- EHR and billing system login and workflow walkthroughs
- Scheduling module: new patient, follow-up, cancellation procedures
- Patient check-in and check-out process

**Week 3, Supervised practice**
- Shadow experienced staff for each core workflow
- Handle real tasks with supervision; document questions

**30-day check-in**
- Review onboarding progress; address open questions
- Set 60-day and 90-day performance milestones
`,
      required: true,
    },
    {
      name: 'Practice policies and payer contracts',
      purpose:
        'Upload your current HR policies, payer contract summaries, credentialing requirements, ' +
        'or standing operating procedures. Claude uses these to tailor workflow documents and ' +
        'compliance reminders to your actual contracts and policies rather than generic guidance.',
      kind: 'user-provided',
      guidance:
        'Paste relevant policy excerpts or payer-specific requirements as plain text. ' +
        'Good candidates: your no-show policy, current payer contract fee schedules (if shareable), ' +
        'credentialing requirements by payer, or your HIPAA policies and procedures summary. ' +
        'Remove any sensitive financial terms you are not authorized to share outside your organization. ' +
        'A two-to-three-page summary of your most-referenced policies is more useful than a full manual.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'practice-manager-scenario-staff-memo',
      title: 'Draft a staff memo announcing an extended-hours change',
      userInput:
        'I need a staff memo announcing that starting August 1st, we are extending our Tuesday hours ' +
        'until 7pm to add evening appointments. ' +
        'This affects front desk staff, medical assistants, and the billing team. ' +
        'We need volunteers for the extended shift and will offer a $3 shift differential per hour.',
      expectedBehavior:
        'Claude should produce a professional, clearly written staff memo that covers all key information: ' +
        'the effective date (August 1st), the specific day affected (Tuesday), the new closing time (7pm), ' +
        'the teams impacted, the call for volunteers, and the shift differential amount ($3 per hour). ' +
        'The memo should have a clear subject line, an opening that states the change, the details in ' +
        'the body, and a call-to-action for staff who want to volunteer. The tone should be informative ' +
        'and positive, not bureaucratic. Claude should not invent additional policy terms not provided.',
      mustContain: ['Tuesday', 'August 1st', 'shift differential', 'evening appointments'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'practice-manager-scenario-prior-auth-workflow',
      title: 'Draft a prior-authorization workflow checklist for MRI requests',
      userInput:
        'Please draft a prior authorization workflow checklist for our Medicare Advantage patients ' +
        'requesting MRI imaging. Include steps from the initial order through submission, ' +
        'follow-up calls, and documenting the outcome in the chart. We use Athenahealth.',
      expectedBehavior:
        'Claude should produce a numbered, step-by-step prior-authorization checklist tailored to ' +
        'Medicare Advantage MRI requests. The checklist must cover: receiving and verifying the ' +
        'imaging order, gathering clinical documentation to support medical necessity, submitting the ' +
        'PA request through the appropriate channel, following up within the payer\'s response window, ' +
        'and documenting the approval or denial in Athenahealth. Each step should be specific enough ' +
        'for a front-office staff member to follow without additional guidance. Claude should note that ' +
        'specific PA criteria vary by Medicare Advantage plan and recommend verifying requirements ' +
        'with each plan\'s portal.',
      mustContain: ['Medicare Advantage', 'MRI', 'Athenahealth', 'prior authorization'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'practice-manager-scenario-onboarding-checklist',
      title: 'Create a new medical assistant onboarding checklist',
      userInput:
        'Create an onboarding checklist for a newly hired medical assistant joining our practice next Monday. ' +
        'Include HIPAA training, EHR access setup, clinic orientation, shadowing schedule, ' +
        'and a 30-day check-in milestone.',
      expectedBehavior:
        'Claude should produce a structured onboarding checklist organized by timeframe (e.g., Day 1, ' +
        'Week 1, Week 2, 30-day milestone). The checklist must include all five elements requested: ' +
        'HIPAA training with a documentation reminder, EHR access setup steps, clinic orientation ' +
        'activities, a shadowing schedule for core clinical workflows, and a 30-day check-in milestone ' +
        'with suggested agenda items. Each checklist item should include a brief description of what it ' +
        'involves and who is responsible. Claude should not invent specific software names, trainer names, ' +
        'or policy details not provided.',
      mustContain: ['HIPAA', 'medical assistant', 'onboarding', '30-day'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
