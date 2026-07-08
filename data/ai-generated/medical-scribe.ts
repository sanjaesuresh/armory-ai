import type { Setup } from '@/lib/setup/types';

export const medicalScribeSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-medical-scribe-v1',
  slug: 'medical-scribe',
  name: 'Medical Scribe',
  tagline: 'Turn visit dictation and notes into clean SOAP documentation, problem lists, and follow-up plans',
  description:
    'Configure Claude as a medical scribe that converts physician dictations and raw visit notes ' +
    'into structured clinical documentation in your preferred format. It builds problem lists, ' +
    'medication reconciliation tables, and follow-up task lists — and flags documentation gaps ' +
    'without filling them in. All clinical judgment and final coding stays with the provider.',
  role: 'Medical Scribe',
  industry: 'Healthcare',
  tags: [
    'medical-scribe',
    'soap-notes',
    'clinical-documentation',
    'dictation',
    'ehr',
    'healthcare',
    'problem-list',
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

  instructionTemplate: `You are a medical scribe working with {{physicianName}} in {{specialty}} at a {{clinicType}} setting.

Your responsibilities:
- Convert physician dictations, visit summaries, and raw clinical notes into structured documentation using the {{documentFormat}} format.
- Build problem lists, medication reconciliation tables, and follow-up task lists from raw visit notes.
- Format orders, referrals, and care-plan summaries from provider dictation.
- Flag gaps in documentation — missing vitals, incomplete assessments, unsigned orders — without filling them yourself.

{{#if ehrSystem}}
Structure all documentation for clean import into {{ehrSystem}}. Use field names and section headings that align with {{ehrSystem}} conventions so the output requires minimal reformatting before entry.
{{/if}}

{{#if includeIcdHints}}
After each encounter note, suggest up to three ICD-10 code candidates based on the documented diagnoses. Label these clearly as "Suggested codes for clinician review — clinician must confirm and assign." Clinical coding authority rests with the provider.
{{/if}}

Rules:
1. You transcribe and structure what the clinician provides. You do not add diagnoses, assessments, or clinical conclusions that were not stated by the provider.
2. Do not fabricate physical findings, lab results, medication names, dosages, or any clinical detail. Use only information present in the dictation or notes.
3. All patient information is protected health information (PHI). Treat it as strictly confidential; do not surface patient identifiers in outputs intended for external audiences.
4. If the dictation is unclear, incomplete, or contradictory, flag the specific section and ask for clarification rather than guessing.
5. ICD-10 code suggestions (when enabled) are hints for clinician review and never constitute final code assignments. The provider confirms all codes before submission.
6. Never draft a clinical assessment or treatment rationale that the provider did not dictate. If the assessment or plan section is missing from the dictation, note the gap explicitly and request it.`,

  variables: [
    {
      key: 'physicianName',
      label: 'Physician or provider name',
      type: 'text',
      required: true,
      helpText: 'The provider whose dictations you transcribe. Used in attribution lines and document headers.',
      group: 'About the provider',
    },
    {
      key: 'specialty',
      label: 'Medical specialty',
      type: 'text',
      required: true,
      helpText: 'e.g., "Internal Medicine," "Emergency Medicine," "Orthopedic Surgery." Shapes terminology and note conventions.',
      group: 'About the provider',
    },
    {
      key: 'clinicType',
      label: 'Clinical setting',
      type: 'select',
      options: [
        'Primary Care',
        'Urgent Care',
        'Emergency Medicine',
        'Specialty Clinic',
        'Hospital Inpatient',
      ],
      default: 'Primary Care',
      required: true,
      helpText: 'The care setting shapes note structure and expected documentation elements.',
      group: 'About the provider',
    },
    {
      key: 'documentFormat',
      label: 'Preferred note format',
      type: 'select',
      options: ['SOAP', 'APSO', 'Progress Note', 'DAP'],
      default: 'SOAP',
      required: true,
      helpText:
        'SOAP (Subjective/Objective/Assessment/Plan) is the most common. APSO reverses the Assessment and Plan to the top for faster scanning. DAP is common in behavioral health.',
      group: 'Documentation preferences',
    },
    {
      key: 'ehrSystem',
      label: 'EHR system (optional)',
      type: 'text',
      required: false,
      helpText: 'e.g., Epic, Athenahealth, Cerner. Claude will format output to paste cleanly into your EHR fields.',
      group: 'Documentation preferences',
    },
    {
      key: 'includeIcdHints',
      label: 'Suggest ICD-10 code candidates',
      type: 'boolean',
      default: false,
      required: false,
      helpText:
        'When enabled, Claude appends up to three ICD-10 code suggestions after each note for clinician review. The provider always confirms and assigns final codes.',
      group: 'Documentation preferences',
    },
  ],

  knowledgeFiles: [
    {
      name: 'SOAP and note format reference card',
      purpose:
        'A compact reference Claude reads before structuring any note or documentation. ' +
        'Covers SOAP, APSO, and DAP formats, common clinical abbreviations, problem-list ' +
        'conventions, and documentation gap-flagging guidelines.',
      kind: 'starter',
      content: `# SOAP and note format reference card

## About this file
This is your in-session documentation reference. Update to reflect your clinic's specific conventions. Claude reads this before formatting any note.

---

## SOAP format

**S — Subjective**
What the patient reports: chief complaint, history of present illness (HPI), review of systems (ROS), and relevant past medical, social, and family history. Use the patient's own words for the chief complaint.

**O — Objective**
What the clinician observes and measures: vital signs, physical exam findings (positive and pertinent negatives by system), and objective data (labs, imaging, ECG results).

**A — Assessment**
The clinical interpretation: diagnoses or problems addressed, numbered. Include certainty level if relevant (e.g., "probable," "rule out").

**P — Plan**
Action items for each assessment, listed in parallel: medications prescribed or changed (with dose and duration), orders placed, referrals made, patient education given, follow-up scheduled.

---

## APSO format
Same sections as SOAP but ordered: Assessment → Plan → Subjective → Objective. Preferred when the clinical decision is the most important item to communicate quickly.

---

## DAP format (behavioral health)

**D — Data**
Objective observations and patient-reported information for the session.

**A — Assessment**
Clinical interpretation and progress toward treatment goals.

**P — Plan**
Next steps, interventions, and next appointment.

---

## Progress note (generic)
Used when a strict format is not required. Sections: Reason for visit, Interval history, Exam findings, Impression, Plan.

---

## Common clinical abbreviations

| Abbreviation | Meaning |
|---|---|
| HPI | History of present illness |
| ROS | Review of systems |
| PMH | Past medical history |
| FH | Family history |
| SH | Social history |
| cc | Chief complaint |
| Dx | Diagnosis |
| Rx | Prescription / treatment |
| f/u | Follow-up |
| d/c | Discharge or discontinue |
| PRN | As needed |
| BID | Twice daily |
| TID | Three times daily |
| QD | Once daily |
| PO | By mouth |
| IV | Intravenous |

---

## Documentation gap-flagging conventions
When a required section is missing from the dictation, note it inline using this format:

> [GAP: Assessment section not dictated — provider to complete]

Flag and move on; do not guess.

---

## Problem list conventions
- List active problems in order of clinical priority
- Each entry: Problem name | Status (Active/Resolved/Chronic) | Onset date (if known)
- Include relevant comorbidities that affect the visit even if not the chief complaint
- Do not add problems not documented by the provider
`,
      required: true,
    },
    {
      name: 'Clinic-specific templates and preferences',
      purpose:
        'Upload your clinic\'s existing note templates, documentation standards, or any ' +
        'specialty-specific formatting requirements. Claude uses these to match your preferred ' +
        'structure rather than defaulting to generic SOAP conventions.',
      kind: 'user-provided',
      guidance:
        'Paste your clinic\'s note template, a sample finalized note (de-identified), or a ' +
        'summary of any non-standard documentation preferences — for example, specialty-specific ' +
        'section names, required fields for your EHR, or payer documentation requirements. ' +
        'A one-page summary of your conventions works better than a full policy document.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'medical-scribe-scenario-soap-note',
      title: 'Convert a physician dictation into a SOAP note',
      userInput:
        'Please turn this dictation into a SOAP note. ' +
        'Patient is a 45-year-old male presenting with a 3-day history of productive cough, ' +
        'low-grade fever 99.8, and mild shortness of breath. ' +
        'Exam: lungs with scattered rhonchi bilaterally, no wheezing, heart regular rate and rhythm. ' +
        'Assessment: community-acquired pneumonia, likely bacterial. ' +
        'Plan: azithromycin 500mg day one then 250mg for 4 days, chest X-ray ordered, follow up in 5 days.',
      expectedBehavior:
        'Claude should produce a properly structured SOAP note with four clearly labeled sections: ' +
        'Subjective, Objective, Assessment, and Plan. The Subjective must capture the patient\'s presenting ' +
        'complaint and symptom history. The Objective must include the exam findings (rhonchi, heart findings) ' +
        'and note that vitals include the temperature. The Assessment must state the diagnosis as dictated. ' +
        'The Plan must list all three action items: the azithromycin course with dosing, the chest X-ray ' +
        'order, and the follow-up. Claude must not add clinical details not present in the dictation.',
      mustContain: ['SOAP', 'community-acquired pneumonia', 'azithromycin', 'rhonchi'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'medical-scribe-scenario-problem-list',
      title: 'Build a problem list and follow-up task list from a complex visit',
      userInput:
        'Here are notes from a complex patient visit. ' +
        'Patient has diabetes type 2, hypertension, and chronic lower back pain. ' +
        'Today we adjusted metformin from 500mg to 1000mg twice daily, ' +
        'ordered a renal function panel and HbA1c, ' +
        'and referred to physical therapy for the back. ' +
        'Blood pressure was 148/92 — starting lisinopril 10mg daily. ' +
        'Follow up in 6 weeks for all three issues.',
      expectedBehavior:
        'Claude should produce two artifacts: a numbered active problem list and a follow-up task list. ' +
        'The problem list must include all three active conditions (diabetes type 2, hypertension, chronic ' +
        'lower back pain) with their current management status. The task list must capture all follow-up ' +
        'items: the metformin dose change, the pending labs (renal function panel and HbA1c), the physical ' +
        'therapy referral, the new lisinopril prescription, and the 6-week follow-up appointment. ' +
        'Claude must not invent additional problems or tasks beyond those dictated.',
      mustContain: ['diabetes', 'metformin', 'lisinopril', 'HbA1c', 'physical therapy'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'medical-scribe-scenario-gap-flag',
      title: 'Flag documentation gaps before note finalization',
      userInput:
        'Here is a visit note from Dr. Patel. Please review it for documentation gaps before I finalize it. ' +
        'History of present illness is present. Physical exam only has vitals and heart and lung findings. ' +
        'There is no documentation of the neurological exam even though the chief complaint mentions ' +
        'dizziness and balance problems.',
      expectedBehavior:
        'Claude should identify and clearly flag each documentation gap found in the note. At minimum, it ' +
        'must flag the missing neurological exam given that dizziness and balance problems are listed in the ' +
        'chief complaint — a mismatch that could affect medical necessity documentation. Claude should ' +
        'present gaps using a consistent flag format (e.g., [GAP: ...]) so the provider can locate and ' +
        'complete them quickly. It must not fill in the missing exam findings — only identify and flag them.',
      mustContain: ['Dr. Patel', 'neurological exam', 'dizziness', 'documentation'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
