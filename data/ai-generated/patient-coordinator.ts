import type { Setup } from '@/lib/setup/types';

export const patientCoordinatorSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-patient-coordinator-v1',
  slug: 'patient-coordinator',
  name: 'Patient Coordinator',
  tagline: 'Draft patient communications, explain insurance in plain language, and manage intake and follow-up outreach',
  description:
    'Configure Claude as a patient coordinator assistant. It drafts appointment confirmations, ' +
    'reminders, and follow-up messages; explains insurance concepts and coverage basics in plain ' +
    'language that patients can understand; prepares intake questionnaire instructions; and writes ' +
    'outreach for missed appointments and care-gap follow-ups. Clinical questions always go to the care team.',
  role: 'Patient Coordinator',
  industry: 'Healthcare',
  tags: [
    'patient-coordinator',
    'patient-communications',
    'appointment-scheduling',
    'insurance-explanation',
    'intake',
    'follow-up-outreach',
    'healthcare',
  ],
  category: 'customer-support',
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

  instructionTemplate: `You are a patient coordinator at {{practiceName}}, supporting patients through the {{specialty}} care experience.

Your responsibilities:
- Draft appointment confirmation, reminder, and follow-up messages for patients via {{communicationChannels}}.
- Explain insurance coverage concepts, co-pays, deductibles, and benefit basics in plain, jargon-free language appropriate for a patient audience.
- Prepare intake packet instructions, pre-visit questionnaires, and patient intake summaries using a {{intakeFormStyle}} approach.
- Draft outreach messages for missed appointments, care-gap reminders, and post-visit follow-up.

Patient follow-up cadence: contact patients {{followUpFrequency}} after a visit or procedure, unless the provider specifies otherwise. Use this timing as the default when drafting follow-up communications.

{{#if insuranceNetworks}}
The practice participates in the following insurance networks: {{insuranceNetworks}}. When explaining coverage, reference these networks by name when relevant, and always direct patients to contact their insurer directly to confirm their specific benefits.
{{/if}}

Rules:
1. You explain insurance concepts and general coverage information, you do not provide binding benefit determinations, coverage decisions, or out-of-pocket estimates that a patient should rely on financially. Always direct patients to call their insurer to confirm exact benefits before their visit.
2. Never include specific protected health information (PHI), diagnoses, lab results, or detailed treatment information, in patient-facing communications unless the supervising clinician has explicitly approved that content for sharing.
3. Patient communications must be empathetic, warm, and clear. Write at a 6th-to-8th-grade reading level. Avoid medical abbreviations and clinical jargon without explanation.
4. Do not fabricate insurance policy details, network status, co-pay amounts, or specific coverage terms not provided to you. If the information is not available, say so and direct the patient to the appropriate resource.
5. When a patient message contains clinical questions, symptoms, medication concerns, lab results, or requests for medical advice, do not answer. Note that the message should be escalated to the clinical team and offer to help draft an internal routing note.
6. Treat all patient information shared in this session as strictly confidential protected health information (PHI). Do not include it in any output intended for external distribution.`,

  variables: [
    {
      key: 'practiceName',
      label: 'Practice name',
      type: 'text',
      required: true,
      helpText: 'The name of your practice as it should appear in patient communications and messages.',
      group: 'About your practice',
    },
    {
      key: 'specialty',
      label: 'Medical specialty',
      type: 'text',
      required: true,
      helpText: 'e.g., "Primary Care," "Gastroenterology," "Orthopedic Surgery." Shapes the context and terminology of patient messages.',
      group: 'About your practice',
    },
    {
      key: 'communicationChannels',
      label: 'Patient communication channels',
      type: 'multiselect',
      options: ['Phone call', 'Email', 'Patient portal message', 'Text / SMS', 'Postal mail'],
      default: ['Phone call', 'Email', 'Patient portal message'],
      required: true,
      helpText: 'Select the channels your practice uses to reach patients. Claude will draft messages suited to these formats.',
      group: 'About your practice',
    },
    {
      key: 'intakeFormStyle',
      label: 'Intake form style',
      type: 'select',
      options: [
        'Comprehensive intake questionnaire',
        'Focused symptom checklist',
        'Minimal demographic and insurance only',
      ],
      default: 'Comprehensive intake questionnaire',
      required: true,
      helpText: 'How much information you collect from new patients before their first visit. Shapes intake summaries and questionnaire drafts.',
      group: 'Communication preferences',
    },
    {
      key: 'followUpFrequency',
      label: 'Standard post-visit follow-up timing',
      type: 'select',
      options: ['24–48 hours', '3–5 days', '1 week', 'At next scheduled appointment'],
      default: '3–5 days',
      required: true,
      helpText: 'How soon after a visit or procedure you typically reach out to patients. Used as the default timing in follow-up message drafts.',
      group: 'Communication preferences',
    },
    {
      key: 'insuranceNetworks',
      label: 'Insurance networks accepted (optional)',
      type: 'text',
      required: false,
      helpText: 'List the insurance networks your practice participates in, e.g., "BlueCross BlueShield PPO, Aetna, Medicare, Medicaid." Claude will reference these when helping explain coverage to patients.',
      group: 'Communication preferences',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Patient communication templates',
      purpose:
        'A set of fillable message templates Claude adapts when drafting patient communications. ' +
        'Covers appointment confirmations, reminders, follow-up messages, missed-appointment outreach, ' +
        'and plain-language explanations for common insurance terms.',
      kind: 'starter',
      content: `# Patient communication templates

## About this file
Starter templates for common patient communications. Update placeholders in [brackets] to match your practice. Claude adapts these to each specific situation, they are guides, not rigid scripts.

---

## Appointment confirmation message

Subject: Your appointment at [Practice Name], [Date] at [Time]

Hi [Patient first name],

This message confirms your upcoming appointment with [Provider Name] at [Practice Name].

**Date and time:** [Day, Month Date at Time]
**Location:** [Practice address]
**What to bring:** Your insurance card, a valid photo ID, and your list of current medications.

Please arrive [10–15] minutes early to complete any remaining intake paperwork.

If you need to reschedule, please call us at [Phone number] or reply through [portal / email] at least [24 hours] before your appointment.

We look forward to seeing you.
[Practice Name] | [Phone] | [Website]

---

## Appointment reminder message (48-hour reminder)

Hi [Patient first name],

Just a reminder that you have an appointment with [Provider Name] at [Practice Name] on [Day] at [Time].

Location: [Address]

If your plans have changed, please let us know as soon as possible at [Phone number] so we can offer your time to another patient.

See you soon!
[Practice Name]

---

## Post-visit follow-up message

Hi [Patient first name],

Thank you for visiting [Practice Name] on [Date]. We hope you are feeling well.

If you have any questions about your visit, your care plan, or your medications, please don't hesitate to reach out through [portal / phone / email].

**Your next appointment** is scheduled for [Date and time]. We will send a reminder closer to the date.

Take care,
[Practice Name] | [Phone]

---

## Missed-appointment outreach message

Hi [Patient first name],

We noticed you were unable to make your appointment at [Practice Name] on [Date]. We hope everything is okay.

It's important that we reconnect to continue your care. Please call us at [Phone number] or [reply here / log into the patient portal] to reschedule at a time that works for you.

If you are experiencing a medical emergency, please call 911 or go to your nearest emergency room.

We look forward to hearing from you.
[Practice Name] | [Phone]

---

## Plain-language insurance glossary

Use these explanations when patients ask about insurance terms:

**Deductible**
The amount you pay out of pocket for covered services before your insurance starts sharing the cost. For example, if your deductible is $1,000, you pay the first $1,000 of covered services yourself each year. After that, your insurance begins to pay.

**Co-pay**
A fixed amount you pay at each visit, for example, $30, regardless of what the visit costs. Your insurance covers the rest (after any deductible requirements are met per your plan).

**Co-insurance**
After you meet your deductible, some plans split the cost with you instead of a fixed co-pay. For example, 80/20 means insurance pays 80% and you pay 20% of the allowed amount.

**Out-of-pocket maximum**
The most you will pay in a plan year for covered services. Once you reach this limit, your insurance pays 100% of covered costs for the rest of the year.

**In-network vs. out-of-network**
In-network providers have an agreement with your insurance company to accept a negotiated rate. Out-of-network providers do not, costs are usually much higher. Always confirm our network status with your insurer before your visit.

**Prior authorization (PA)**
Your insurance company's approval before certain services, medications, or procedures are covered. We handle the PA submission on your behalf, but approval is the insurer's decision.

---

## Intake questionnaire introduction (comprehensive style)

Welcome to [Practice Name]! Please take a few minutes to complete the attached intake forms before your visit. This helps us provide you with the best care.

**What we need:**
1. Your personal and contact information
2. Insurance information (have your card ready)
3. Medical history: past diagnoses, surgeries, and hospitalizations
4. Current medications and any known allergies
5. Your reason for today's visit

If any question does not apply to you, simply write "N/A." If you are unsure, leave it blank and we will go over it together at your appointment.
`,
      required: true,
    },
    {
      name: 'Practice-specific scripts and FAQs',
      purpose:
        'Upload your standard call scripts, common patient FAQ answers, or insurance benefit summaries ' +
        'specific to your practice. Claude uses these to tailor patient communications to your ' +
        'actual policies rather than generic guidance.',
      kind: 'user-provided',
      guidance:
        'Paste your most-used call scripts, patient FAQ document, or a summary of your billing and ' +
        'scheduling policies as patients experience them, for example, your no-show policy, ' +
        'cancellation window, payment plan options, and answers to the five questions patients ask most. ' +
        'A one-to-two-page document is ideal; you do not need a full policy manual.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'patient-coordinator-scenario-appointment-reminder',
      title: 'Draft an appointment reminder for a procedure consultation',
      userInput:
        'Please draft an appointment reminder message for a patient scheduled for a colonoscopy prep consultation ' +
        'on Thursday at 2pm with Dr. Torres. Include the office address at 400 Westfield Ave, ' +
        'remind them to bring their insurance card and photo ID, and let them know to arrive 15 minutes early.',
      expectedBehavior:
        'Claude should produce a warm, clear appointment reminder message that covers all the details provided: ' +
        'the procedure type (colonoscopy prep consultation), the date and time (Thursday at 2pm), the provider ' +
        '(Dr. Torres), the address (400 Westfield Ave), the items to bring (insurance card and photo ID), ' +
        'and the arrival instruction (15 minutes early). The message should be concise, friendly, and free of ' +
        'clinical jargon. It should not include specific medical preparation instructions (like bowel prep steps) ' +
        'that were not provided, those require clinician review.',
      mustContain: ['colonoscopy', 'Dr. Torres', '400 Westfield Ave', 'insurance card'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'patient-coordinator-scenario-insurance-explanation',
      title: 'Explain insurance terms to a confused patient in plain language',
      userInput:
        'A patient called and asked me to explain what a deductible is and how it works with their co-pay. ' +
        'They are on a BlueCross PPO plan with a $1,500 deductible and a $30 co-pay after the deductible is met. ' +
        'They want to know how much they will owe for today\'s office visit.',
      expectedBehavior:
        'Claude should explain both terms, deductible and co-pay, in plain, jargon-free language at a ' +
        'level any patient could understand. It must use the specific plan details provided ($1,500 deductible, ' +
        '$30 co-pay, BlueCross PPO) to walk through two scenarios: (1) if the patient has not yet met their ' +
        'deductible, they would owe the full allowed amount up to $1,500; (2) if they have already met it, ' +
        'they would owe $30. Claude must note that it cannot tell them exactly what they owe for today\'s ' +
        'visit without knowing their deductible status, and must direct the patient to call BlueCross or ' +
        'check their online account to confirm their current deductible balance.',
      mustContain: ['deductible', 'co-pay', 'BlueCross', '$1,500'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'patient-coordinator-scenario-missed-appointment',
      title: 'Write a missed-appointment outreach message for a repeat no-show',
      userInput:
        'Draft a missed appointment outreach message for a patient who did not show for their follow-up ' +
        'visit yesterday. This was their second missed appointment in 60 days. ' +
        'Keep the tone warm but note that we need to reschedule soon as the follow-up is clinically ' +
        'important per Dr. Reyes.',
      expectedBehavior:
        'Claude should produce a patient outreach message that is warm and empathetic, not punitive, while ' +
        'conveying the importance of rescheduling. The message must acknowledge the missed appointment, note ' +
        'that Dr. Reyes considers the follow-up clinically important, and include a clear call-to-action to ' +
        'reschedule. It should not disclose specific clinical details about why the follow-up is needed. ' +
        'Given that this is the second missed appointment, the message may gently flag the pattern and offer ' +
        'to help find a convenient time, but should not use threatening or dismissive language. Claude should ' +
        'not include specific diagnoses or test results in the message.',
      mustContain: ['missed appointment', 'reschedule', 'Dr. Reyes', 'follow-up'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
