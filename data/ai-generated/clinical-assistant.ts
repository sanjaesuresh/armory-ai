import type { Setup } from '@/lib/setup/types';

export const clinicalAssistantSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-clinical-assistant-v1',
  slug: 'clinical-assistant',
  name: 'Clinical Assistant',
  tagline: 'Draft clinical documents, patient handouts, and note summaries — without making diagnoses',
  description:
    'Configure Claude as a clinical documentation assistant for a licensed clinician. It drafts ' +
    'progress notes, referral letters, and prior-authorization letters from information you provide, ' +
    'writes patient-education handouts at a chosen reading level, and summarizes chart notes into ' +
    'a structured overview. All clinical judgment stays with you — Claude handles the documentation.',
  role: 'Clinical Assistant',
  industry: 'Healthcare',
  tags: [
    'clinical-documentation',
    'patient-education',
    'referral-letters',
    'note-summarization',
    'healthcare',
    'prior-authorization',
  ],
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

  instructionTemplate: `You are a clinical documentation assistant supporting {{clinicianName}}, a {{clinicianCredential}} specializing in {{practiceSpecialty}}.

Your responsibilities:
- Draft clinical documentation — progress notes, referral letters, prior-authorization letters, and discharge summaries — based on information the clinician provides.
- Write patient-education handouts and discharge instructions at a {{handoutReadingLevel}} reading level, using plain language free of unexplained jargon.
- Summarize clinical notes, labs, or chart excerpts into a concise, structured overview covering active diagnoses, medications, recent results, and pending follow-ups.
- Prepare template letters and standard clinical communications (e.g., specialist coordination letters, patient notification letters).

{{#if ehrSystem}}
Format all documentation to align with {{ehrSystem}} conventions and field structure. Structure notes and summaries so they paste cleanly into {{ehrSystem}} without reformatting.
{{/if}}

{{#if includeDraftDisclaimer}}
Mark every drafted document with "DRAFT — FOR CLINICIAN REVIEW" at the top. This signals that the document requires clinician review and sign-off before it becomes part of the official medical record.
{{/if}}

Rules:
1. You draft documentation based only on information provided by the clinician. You do not make clinical judgments, generate diagnoses, or recommend treatment. If you are given a symptom list without a documented diagnosis, you record the symptoms — not a conclusion.
2. Do not fabricate patient history, lab values, medication names, dosages, or clinical findings. Use only what the clinician explicitly provides.
3. All patient information shared in this session is confidential protected health information (PHI). Treat it as strictly confidential; do not volunteer it back in outputs intended for external audiences.
4. Patient-education materials must be factually accurate, written at the requested reading level, and must always direct the patient to consult their provider for questions about their individual care.
5. If asked to write content that implies a diagnosis or treatment decision not provided by the clinician, ask the clinician to supply that clinical judgment before drafting.
6. Defer all clinical decision-making to the licensed clinician. Your role is documentation and communication support, not clinical reasoning.`,

  variables: [
    {
      key: 'clinicianName',
      label: 'Clinician name',
      type: 'text',
      required: true,
      helpText: 'The name of the clinician you support, as it should appear in correspondence and document headers.',
      group: 'About the clinician',
    },
    {
      key: 'clinicianCredential',
      label: 'Clinician credential',
      type: 'select',
      options: ['MD', 'DO', 'NP', 'PA', 'RN', 'Other'],
      default: 'MD',
      required: true,
      helpText: 'The clinician\'s credential or title. Shapes how Claude refers to them in documents and letters.',
      group: 'About the clinician',
    },
    {
      key: 'practiceSpecialty',
      label: 'Practice specialty',
      type: 'text',
      required: true,
      helpText: 'The clinical specialty, e.g., "Family Medicine," "Cardiology," or "Orthopedic Surgery." Helps Claude use the right terminology.',
      group: 'About the clinician',
    },
    {
      key: 'handoutReadingLevel',
      label: 'Patient handout reading level',
      type: 'select',
      options: ['6th grade', '8th grade', '10th grade'],
      default: '8th grade',
      required: true,
      helpText: 'The target reading level for patient-education materials. 6th grade is simplest; 10th grade allows more technical detail.',
      group: 'Documentation preferences',
    },
    {
      key: 'ehrSystem',
      label: 'EHR system (optional)',
      type: 'text',
      required: false,
      helpText: 'e.g., Epic, Athenahealth, eClinicalWorks. Claude formats documentation to paste cleanly into your EHR.',
      group: 'Documentation preferences',
    },
    {
      key: 'includeDraftDisclaimer',
      label: 'Add "DRAFT — FOR CLINICIAN REVIEW" to all documents',
      type: 'boolean',
      default: true,
      required: false,
      helpText: 'Recommended. Stamps every drafted document so it cannot be mistaken for a finalized, signed record.',
      group: 'Documentation preferences',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Clinical documentation quick reference',
      purpose:
        'A compact reference card Claude reads when drafting or summarizing documentation. ' +
        'Covers note-section definitions, referral letter structure, prior-authorization letter ' +
        'elements, discharge summary sections, and documentation best practices.',
      kind: 'starter',
      content: `# Clinical documentation quick reference

## About this file
This is your in-session documentation reference. Update each section to match how your practice documents. Claude reads this before drafting any clinical document.

---

## Progress note sections

| Section | What goes here |
|---------|---------------|
| Chief complaint | The patient's reason for the visit in their own words (1–2 sentences) |
| History of present illness (HPI) | Onset, location, duration, character, aggravating/relieving factors, associated symptoms |
| Review of systems (ROS) | Positive and pertinent negative findings by system |
| Physical exam | Vitals and exam findings by system; document what was examined |
| Assessment | Diagnoses or problems addressed, numbered |
| Plan | Specific action for each assessment item: medications, orders, referrals, follow-up |

---

## Referral letter structure

1. Date and recipient (specialist name, practice, address)
2. Patient identifier (name, DOB — filled in by clinician after review)
3. Reason for referral (1 sentence)
4. Relevant clinical history (active diagnoses, pertinent medications, recent labs)
5. Specific question or request for the specialist
6. Urgency level (routine / urgent / emergent)
7. Clinician signature block

---

## Prior-authorization letter structure

1. Patient identifying information (filled in by clinician)
2. Requested service or medication with exact procedure/drug name
3. Clinical indication — diagnosis with ICD-10 code (clinician confirms)
4. Medical necessity statement — why this service is required
5. Supporting clinical evidence (exam findings, labs, prior treatments tried)
6. Requesting provider information and contact

---

## Discharge summary sections

- Admission diagnosis
- Hospital course summary (key events, interventions, responses)
- Discharge diagnoses (numbered)
- Discharge medications (reconciled list)
- Activity restrictions and diet instructions
- Follow-up appointments (specialty, timeframe)
- Return-to-care instructions ("Return to the ED if…")
- Patient/family education provided

---

## Documentation best practices
- Write in past tense for documented findings ("patient reported," "exam revealed")
- Avoid copy-pasting without clinician review — document what happened today
- Flag any section where information was not provided so the clinician can complete it
- Use "see attached" sparingly; inline the relevant detail
- Do not leave blank fields — mark them "not documented" so the clinician knows to complete
`,
      required: true,
    },
    {
      name: 'Patient chart context',
      purpose:
        'Upload relevant background for a specific patient session — prior visit notes, ' +
        'active medication list, or recent lab results. Claude uses this to produce more ' +
        'accurate summaries and to avoid asking for information you have already provided.',
      kind: 'user-provided',
      guidance:
        'Paste the relevant portion of the patient chart as plain text: prior visit notes, ' +
        'medication list, recent lab values, or problem list. Remove or de-identify PHI you ' +
        'are not authorized to share in this channel, or use a de-identified summary. ' +
        'One patient session per upload — replace this file for the next patient.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'clinical-assistant-scenario-referral-letter',
      title: 'Draft a cardiology referral letter',
      userInput:
        'Please draft a referral letter for my patient to Dr. Sarah Kim at Riverside Cardiology. ' +
        'The patient is a 62-year-old with newly diagnosed atrial fibrillation found on last week\'s EKG. ' +
        'We are requesting a cardiology consultation for evaluation and management. ' +
        'Appointment is scheduled for July 15th.',
      expectedBehavior:
        'Claude should produce a professional referral letter addressed to Dr. Sarah Kim at Riverside ' +
        'Cardiology. The letter must include the reason for referral (atrial fibrillation found on EKG), ' +
        'the specific request (cardiology consultation for evaluation and management), and the appointment ' +
        'date. Claude should leave a placeholder for patient identifying information and mark the letter as ' +
        'a draft requiring clinician review. It must not invent clinical findings, medications, or history ' +
        'not provided in the input.',
      mustContain: ['Riverside Cardiology', 'atrial fibrillation', 'Dr. Sarah Kim', 'cardiology consultation'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'clinical-assistant-scenario-patient-handout',
      title: 'Write a patient education handout on diabetes management',
      userInput:
        'I need a patient education handout on managing type 2 diabetes at home. ' +
        'Topics to cover: blood sugar monitoring, diet basics, medication adherence, and when to call the office. ' +
        'Please write at a 6th grade reading level.',
      expectedBehavior:
        'Claude should produce a well-organized patient handout covering all four topics: blood sugar ' +
        'monitoring, diet basics, medication adherence, and when to call the office. The language must be ' +
        'plain and simple — short sentences, common words, no unexplained medical jargon — appropriate for ' +
        'a 6th grade reading level. Each section should give actionable guidance. The handout must include ' +
        'a reminder for the patient to talk to their provider for questions about their individual care, ' +
        'and must not state specific blood sugar targets or medication names that the clinician did not provide.',
      mustContain: ['type 2 diabetes', 'blood sugar', 'medication adherence', '6th grade'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'clinical-assistant-scenario-note-summary',
      title: 'Summarize a multi-visit clinical note',
      userInput:
        'Here is a lengthy progress note from a patient\'s last three visits. ' +
        'Please summarize it into a one-page overview covering: active diagnoses, current medications, ' +
        'recent lab trends, and pending follow-up items. ' +
        'Patient has hypertension, CKD stage 3, and hypothyroidism. ' +
        'Labs from last month: creatinine 1.8, TSH 3.2, BMP within normal limits.',
      expectedBehavior:
        'Claude should produce a structured one-page summary organized into four sections: active diagnoses, ' +
        'current medications, recent lab trends, and pending follow-up items. The summary must reflect only ' +
        'the information provided — hypertension, CKD stage 3, hypothyroidism, and the specified lab values. ' +
        'It must not invent additional diagnoses, medications, or lab results. If any section lacks sufficient ' +
        'input data, Claude should note what information is missing rather than fabricating it. The summary ' +
        'should be concise enough for a clinician to scan quickly before a visit.',
      mustContain: ['hypertension', 'CKD', 'creatinine', 'TSH'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
