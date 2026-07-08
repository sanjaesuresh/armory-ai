import type { Setup } from '@/lib/setup/types';

export const taxPreparerSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-tax-preparer-v1',
  slug: 'tax-preparer',
  name: 'Tax Preparer',
  tagline: 'Document checklists, plain-language form explanations, and client-ready comms',
  description:
    'Configure Claude as a tax preparation assistant for your practice. It builds tailored ' +
    'client document-request checklists, explains tax forms and common deductions in plain ' +
    'language, drafts client communications, and helps structure organizers — while always ' +
    'flagging when a situation requires a licensed professional\'s judgment.',
  role: 'Tax Preparer',
  industry: 'Accounting & Finance',
  tags: ['tax-preparation', 'tax-forms', 'deductions', 'client-comms', 'document-checklist', 'irs'],
  category: 'finance',
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

  instructionTemplate: `You are a tax preparation assistant at {{firmName}}, supporting the {{taxYear}} filing season.

Your client types include: {{clientTypes}}. Tailor document requests, checklists, and explanations to the specific filing situation — an individual W-2 filer needs a very different organizer than an S-Corp owner.

Your primary tax software is {{taxSoftware}}. When describing workflows, data entry steps, or review checklists, reference {{taxSoftware}} conventions where relevant.

{{#if jurisdictions}}
Jurisdictions in scope: {{jurisdictions}}. Factor in state-level filing requirements, conformity questions, and jurisdiction-specific forms alongside federal requirements.
{{/if}}

Your responsibilities:
- Build tailored document-request checklists for each client type, covering all income sources, deduction categories, and filing-specific requirements.
- Explain federal tax forms (W-2, 1099 variants, Schedule C, K-1, etc.) and common deductions in plain, client-friendly language.
- Draft client-facing emails for document requests, status updates, extension notices, and tax-due payment reminders.
- Help structure tax organizers and review checklists to catch common errors before filing.

Rules:
1. Never invent tax figures, deduction amounts, income thresholds, or specific tax law citations without flagging uncertainty — ask or note that verification is required.
2. When explaining a deduction or credit, state the general eligibility concept and explicitly recommend the client confirm applicability with a licensed tax professional.
3. Distinguish clearly between federal and state treatment when the two differ — do not imply federal rules apply at the state level without qualification.
4. Client tax data shared in this conversation is confidential. Do not reference one client's information when helping with another.
5. Flag immediately when a situation involves audit risk, amended returns, foreign income, or other complex areas where a licensed CPA or enrolled agent must review directly.
6. Never give definitive tax or legal advice. Provide general information only and always recommend consulting a licensed CPA, enrolled agent, or tax attorney for specific guidance.`,

  variables: [
    {
      key: 'firmName',
      label: 'Firm or practice name',
      type: 'text',
      required: true,
      helpText: 'The name of your tax practice. Appears in client communication drafts.',
      group: 'About your practice',
    },
    {
      key: 'taxYear',
      label: 'Tax year',
      type: 'text',
      required: true,
      helpText: 'e.g., "2024" or "2025". All date references and deadlines will be framed around this year.',
      group: 'About your practice',
    },
    {
      key: 'taxSoftware',
      label: 'Tax software',
      type: 'select',
      options: ['Drake Tax', 'ProSeries', 'Lacerte', 'UltraTax CS', 'TaxSlayer Pro', 'TurboTax Business'],
      default: 'Drake Tax',
      required: true,
      helpText:
        'Your primary preparation software. Claude references its workflow when describing data entry or review steps.',
      group: 'About your practice',
    },
    {
      key: 'clientTypes',
      label: 'Client types you serve',
      type: 'multiselect',
      options: ['Individual (W-2)', 'Self-employed / Schedule C', 'Partnership', 'S-Corp', 'C-Corp', 'Non-profit'],
      default: ['Individual (W-2)', 'Self-employed / Schedule C'],
      required: true,
      helpText:
        'Select every filing type your practice handles. Claude will tailor checklists and guidance to match.',
      group: 'Your clients',
    },
    {
      key: 'jurisdictions',
      label: 'State or local jurisdictions (optional)',
      type: 'text',
      required: false,
      helpText:
        'e.g., "California, New York" or "Texas (no state income tax)". Claude factors in state-level requirements.',
      group: 'Your clients',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Document request reference card',
      purpose:
        'A categorized checklist of commonly needed tax documents organized by client type. ' +
        'Claude uses this as a starting template when building a client-specific organizer, ' +
        'adding or removing items based on the client\'s situation.',
      kind: 'starter',
      content: `# Document request reference card

## About this file
A starting checklist of common tax documents organized by client type. Update sections to match your practice's organizer format. Claude uses this when building client-specific document request lists.

---

## Individual (W-2 filer)

### Income
- [ ] W-2 from each employer
- [ ] 1099-INT (bank interest)
- [ ] 1099-DIV (dividends)
- [ ] 1099-B (brokerage sales — include cost basis statements)
- [ ] SSA-1099 (Social Security benefits, if applicable)
- [ ] 1099-R (retirement distributions, if applicable)

### Deductions
- [ ] Mortgage interest statement (Form 1098)
- [ ] Property tax receipts
- [ ] Charitable donation receipts (cash and non-cash)
- [ ] Medical expenses (if potentially above 7.5% AGI threshold)
- [ ] Student loan interest (Form 1098-E)
- [ ] Prior-year state tax refund (1099-G)

### Credits
- [ ] Child care provider name, address, EIN, and amounts paid
- [ ] Education expenses (Form 1098-T)
- [ ] Energy-efficient home improvement receipts

---

## Self-employed / Schedule C

All items from Individual (W-2) above, plus:

### Business income
- [ ] 1099-NEC or 1099-K from clients or platforms
- [ ] Records of additional income not on a 1099

### Business expenses
- [ ] Business use of home: square footage, total home expenses
- [ ] Vehicle log: miles driven for business vs. total miles; purchase date and price if claiming depreciation
- [ ] Receipts for equipment, software, and supplies
- [ ] Health insurance premiums paid (self-employed deduction)
- [ ] Retirement contributions (SEP-IRA, Solo 401k)
- [ ] Estimated tax payments made (ES payment records)

---

## S-Corp / Partnership (additional)
- [ ] Prior-year K-1 (to confirm basis)
- [ ] Balance sheet and P&L from accounting software
- [ ] Payroll records and W-2 for officer/owner salary
- [ ] Loan agreements (shareholder loans, if any)
- [ ] Minutes documenting officer compensation and distributions

---

## Common items to verify before filing
- Social Security numbers for all dependents
- Bank routing and account number for direct deposit or debit
- Prior-year AGI (for e-file PIN verification)
- Confirmation of any IP PIN issued by the IRS
`,
      required: true,
    },
    {
      name: 'Client organizer or prior-year return notes',
      purpose:
        'Upload the client\'s completed organizer, prior-year return summary, or notes from ' +
        'the intake interview. Claude uses this to tailor document requests, flag missing items ' +
        'specific to this client, and draft accurate status communications.',
      kind: 'user-provided',
      guidance:
        'Paste the client\'s organizer answers, a summary of their prior-year return (income ' +
        'sources, filing status, key deductions), or your intake notes. Remove Social Security ' +
        'numbers and full account numbers before uploading — use last-four digits or a placeholder ' +
        'instead. Even a brief bullet list of known income sources and life changes this year is useful.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'tax-preparer-scenario-1',
      title: 'Build a document checklist for a self-employed client',
      userInput:
        'I have a new client, Marcus Webb, who is a freelance graphic designer. He earns income ' +
        'from several clients, works from a dedicated home office, and bought a new MacBook Pro ' +
        'this year for work. He also made contributions to a SEP-IRA. What documents should I ' +
        'request from him?',
      expectedBehavior:
        'Claude should produce a tailored document checklist for Marcus as a self-employed ' +
        'Schedule C filer. It should include 1099-NEC forms from clients, home office ' +
        'documentation (square footage, home expenses), vehicle log if applicable, the MacBook ' +
        'receipt for potential Section 179 or depreciation, SEP-IRA contribution records, and ' +
        'estimated tax payment records. It should note that specific deductibility of each item ' +
        'requires professional review and must not invent any dollar thresholds.',
      mustContain: ['1099', 'home office', 'SEP-IRA', 'MacBook'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'tax-preparer-scenario-2',
      title: 'Explain a K-1 to a client in plain language',
      userInput:
        'My client just called confused about a K-1 she received from a limited partnership she ' +
        'invested in. She has never received one before. Can you draft a short explanation I can ' +
        'send her?',
      expectedBehavior:
        'Claude should draft a short, plain-language client email explaining what a K-1 is (a ' +
        'tax form from a partnership, S-Corp, trust, or estate reporting the recipient\'s share ' +
        'of income, deductions, and credits), why she received it, how it affects her return, and ' +
        'what she needs to do (send it to the preparer). The explanation must not make definitive ' +
        'statements about her specific tax impact and should invite her to call the office with questions.',
      mustContain: ['K-1', 'partnership', 'income'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'tax-preparer-scenario-3',
      title: 'Draft a tax-due payment reminder',
      userInput:
        'Write a professional email to remind a client that they owe $3,800 in federal taxes ' +
        'by April 15. The client is David Park. We want to include the payment options (IRS ' +
        'Direct Pay, EFTPS, check) and let him know he can call the office if he has questions.',
      expectedBehavior:
        'Claude should produce a professional, friendly reminder email addressed to David Park ' +
        'stating the amount due ($3,800), the deadline (April 15), and three payment options with ' +
        'brief descriptions of each. It should include the firm name and an invitation to call with ' +
        'questions. It must not invent account numbers, IRS URLs, or penalty details not provided.',
      mustContain: ['David Park', '$3,800', 'April 15', 'Direct Pay'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
