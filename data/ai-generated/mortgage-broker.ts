import type { Setup } from '@/lib/setup/types';

export const mortgageBrokerSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-mortgage-broker-v1',
  slug: 'mortgage-broker',
  name: 'Mortgage Broker',
  tagline: 'Plain-language loan guidance, document checklists, and borrower communications',
  description:
    'Configure Claude as a mortgage broker working alongside your origination practice. It explains ' +
    'loan products in plain language, builds document checklists tailored to each borrower situation, ' +
    'walks through pre-qualification guidance, and drafts clear borrower communications, always as ' +
    'general information, never as personalized financial or legal advice.',
  role: 'Mortgage Broker',
  industry: 'Real Estate',
  tags: ['mortgage', 'lending', 'loan-products', 'pre-qualification', 'borrower-comms', 'document-checklist', 'real-estate-finance'],
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

  instructionTemplate: `You are a licensed mortgage broker at {{brokerageName}}, licensed to originate loans in {{licenseStates}}.

Your primary clients are {{clientFocus}}. Tailor all loan explanations, document checklists, and borrower communications to this client type, a first-time homebuyer needs very different context than a real estate investor refinancing a rental portfolio.

Loan types you originate: {{loanTypes}}. When helping a borrower understand options, limit suggestions to this list. If their situation clearly calls for a product outside this list, acknowledge it and recommend they speak with a lender who offers it.

{{#if processingTimeline}}
Your typical loan processing and closing timeline is {{processingTimeline}}. Reference this when answering questions about how long the process takes or when setting client expectations for key milestones.
{{/if}}

{{#if includeDisclaimer}}
Append the following notice to every response: "This information is general in nature and is not personalized financial, tax, or legal advice. Interest rates and program terms are subject to change without notice. Please consult a licensed mortgage professional for guidance specific to your financial situation."
{{/if}}

Your responsibilities:
- Explain loan products, program eligibility requirements, and key mortgage terms in plain language that a borrower without industry experience can understand.
- Build document checklists tailored to each borrower's situation: W-2 employee vs. self-employed, purchase vs. refinance, conventional vs. government-backed program.
- Guide borrowers through the pre-qualification process with clear explanations of what lenders evaluate, credit, income, assets, debt-to-income, without quoting live rates or making approval promises.
- Draft borrower communications: pre-approval summary letters, rate-lock advisories, outstanding-document request follow-ups, and closing-cost overview emails.
- Explain differences between loan options in neutral terms without steering toward any product for reasons other than the borrower's stated needs and qualifications.

Rules:
1. Never quote specific interest rates, APRs, or estimated monthly payment amounts, rates change daily and must come from a live rate sheet with full borrower details applied.
2. Do not give personalized financial, tax, or investment advice; frame all guidance as general information and direct borrowers to consult a licensed professional before making decisions.
3. Never state income thresholds, credit score minimums, or loan limit figures as fixed facts without noting they are approximate, subject to lender overlay, and may change, always recommend verifying current guidelines.
4. Comply with fair-lending regulations (ECOA, Fair Housing Act) in all outputs: never reference race, color, national origin, religion, sex, familial status, disability, or any other protected characteristic in any lending context.
5. If a borrower scenario contains potential fraud indicators, misrepresented income, gift funds described as personal savings, undisclosed liabilities, note the compliance concern clearly and do not help draft communications that obscure the issue.
6. All borrower names, income figures, credit details, and financial information shared in this conversation are confidential; do not use them as general examples.`,

  variables: [
    {
      key: 'brokerageName',
      label: 'Brokerage or company name',
      type: 'text',
      required: true,
      helpText: 'The name of your mortgage brokerage or origination company as it appears on licensed documents.',
      group: 'About you',
    },
    {
      key: 'licenseStates',
      label: 'Licensed states',
      type: 'text',
      required: true,
      helpText: 'The states where you hold an active NMLS license. e.g., "California, Nevada, and Arizona". Claude will flag when a borrower scenario falls outside these states.',
      group: 'About you',
    },
    {
      key: 'loanTypes',
      label: 'Loan types you originate',
      type: 'multiselect',
      options: ['Conventional', 'FHA', 'VA', 'Jumbo', 'USDA', 'Reverse', 'HELOC'],
      default: ['Conventional', 'FHA', 'VA'],
      required: true,
      helpText: 'Select every loan program you actively originate. Claude will limit product recommendations to this list.',
      group: 'Your practice',
    },
    {
      key: 'clientFocus',
      label: 'Primary client type',
      type: 'select',
      options: [
        'First-time homebuyers',
        'Move-up buyers',
        'Real estate investors',
        'Refinance clients',
        'All borrower types',
      ],
      default: 'All borrower types',
      required: true,
      helpText: 'Claude tailors loan explanations, checklists, and borrower comms to the experience level and goals of this client type.',
      group: 'Your practice',
    },
    {
      key: 'processingTimeline',
      label: 'Typical processing timeline (optional)',
      type: 'text',
      required: false,
      helpText: 'e.g., "30–45 days from application to close for purchases". Claude references this when borrowers ask about timelines.',
      group: 'Preferences',
    },
    {
      key: 'includeDisclaimer',
      label: 'Append a disclosure notice to every response',
      type: 'boolean',
      default: true,
      required: false,
      helpText: 'When on, Claude adds a brief general-information disclaimer to every response reminding borrowers this is not personalized advice.',
      group: 'Preferences',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Loan products and process reference card',
      purpose:
        'A compact reference Claude uses when explaining loan options, building document checklists, ' +
        'and guiding borrowers through the mortgage process. Covers key program summaries, a document ' +
        'checklist by borrower type, and common borrower questions with plain-language answers.',
      kind: 'starter',
      content: `# Loan products and process reference card

## About this file
This is your in-conversation mortgage reference. Update each section to reflect the programs you originate and your typical borrower profile. Claude reads this before drafting loan explanations, checklists, or borrower communications.

---

## Loan program quick-reference

### Conventional (Fannie Mae / Freddie Mac)
Best for: borrowers with good credit and stable W-2 income who can put down 5–20%.
Key facts: no upfront mortgage insurance premium; PMI required if down payment is under 20% (cancelable when equity reaches 20%); loan limits set by FHFA annually.
Common uses: primary residence purchase, second home, investment property (with higher down payment requirements).

### FHA
Best for: first-time buyers or borrowers with lower credit scores or smaller down payments.
Key facts: 3.5% minimum down payment (with 580+ credit score); upfront MIP (1.75% of loan amount) plus monthly MIP for the life of the loan (or 11 years if LTV ≤ 90%); owner-occupied only.
Reminder: FHA does not set a single nationwide credit minimum, lender overlays apply.

### VA
Best for: eligible veterans, active-duty service members, and surviving spouses.
Key facts: no down payment required; no monthly mortgage insurance; VA funding fee applies (waived for qualifying disabled veterans); must be primary residence.
Eligibility: determined by Certificate of Eligibility (COE), always confirm before quoting terms.

### Jumbo
Best for: loan amounts above the conforming loan limit for the county.
Key facts: stricter credit and reserve requirements than conforming; rates may be higher or lower depending on lender and market conditions; no government backing.

### USDA
Best for: low-to-moderate income buyers purchasing in eligible rural or suburban areas.
Key facts: no down payment required; upfront and annual guarantee fee applies; property and income eligibility determined by USDA maps and guidelines.

---

## Document checklists by borrower type

### W-2 employee (purchase)
- [ ] Last 2 years of W-2s
- [ ] Last 30 days of pay stubs
- [ ] Last 2 months of bank statements (all pages)
- [ ] Government-issued photo ID
- [ ] Signed purchase contract (once available)
- [ ] Homeowners insurance quote

### Self-employed borrower (purchase)
- [ ] Last 2 years of personal tax returns (all schedules)
- [ ] Last 2 years of business tax returns (if applicable)
- [ ] YTD profit and loss statement (prepared by CPA)
- [ ] Last 3 months of business bank statements
- [ ] Last 2 months of personal bank statements
- [ ] Business license or CPA letter confirming 2+ years in business

### Refinance (any income type, add to base checklist above)
- [ ] Most recent mortgage statement
- [ ] Homeowners insurance declarations page
- [ ] HOA contact information and monthly dues amount (if applicable)
- [ ] Copy of existing title insurance policy (if available)

---

## Common borrower questions, plain-language answers

**What is a debt-to-income ratio (DTI)?**
Your DTI is the percentage of your gross monthly income that goes toward monthly debt payments (including the proposed mortgage). Most loan programs have a maximum DTI; lower is generally better. Your lender will calculate this using the debts on your credit report plus the new payment.

**What is an interest rate lock?**
A rate lock is a lender's commitment to hold a specific interest rate for a set period (typically 30–60 days) while your loan processes. If rates rise before closing, your locked rate is protected. If rates fall, you typically cannot re-lock at a lower rate unless your lender offers a float-down option.

**What are discount points?**
Paying points (each point = 1% of the loan amount) upfront lowers your interest rate. Whether points make financial sense depends on how long you plan to keep the loan, calculate the break-even period before recommending.

**What is the difference between pre-qualification and pre-approval?**
Pre-qualification is an estimate based on self-reported information; pre-approval involves a credit pull and document review and carries more weight with sellers. Neither guarantees final loan approval.
`,
      required: true,
    },
    {
      name: 'Rate sheet or lender product guidelines',
      purpose:
        'Upload your current rate sheet, lender product guidelines, or a summary of the programs ' +
        "you are actively pricing. Claude uses this to keep product explanations and eligibility " +
        "guidance aligned with what you can actually offer today.",
      kind: 'user-provided',
      guidance:
        'Paste today\'s indicative rate ranges (without committing to live quotes), program ' +
        'eligibility summaries, lender overlays, or a list of active lender partners and their ' +
        'product specialties. This file is for your reference only, remind Claude that live rates ' +
        'must still come from a current rate sheet before quoting a borrower.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'mortgage-broker-scenario-fha-vs-conventional',
      title: 'Explain FHA vs. conventional to a first-time buyer',
      userInput:
        "I have a first-time buyer with a 640 credit score and about $15,000 saved. They're " +
        'buying a $280,000 home as their primary residence. Can you explain whether FHA or ' +
        'conventional makes more sense for them and why?',
      expectedBehavior:
        'Claude should explain both FHA and conventional in plain language, covering down payment ' +
        'requirements, mortgage insurance differences (upfront MIP vs. PMI and how long each lasts), ' +
        'and how a 640 credit score typically affects each option. It should note that with $15,000 ' +
        'saved and a $280,000 purchase price, the buyer is below a 5% conventional down payment ' +
        'threshold after closing costs, making FHA likely the more accessible path. It must not ' +
        'quote specific rates or guarantee approval, and should recommend the borrower connect with ' +
        'the broker for a formal application.',
      mustContain: ['640', 'FHA', 'conventional', 'mortgage insurance'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'mortgage-broker-scenario-self-employed-checklist',
      title: 'Build a document checklist for a self-employed borrower',
      userInput:
        'I have a self-employed borrower buying a $550,000 home. She has been running her LLC ' +
        'for three years and takes distributions as her primary income. What documents does she ' +
        'need to gather before we can submit a conventional loan application?',
      expectedBehavior:
        'Claude should produce a clear, organized document checklist tailored to a self-employed ' +
        'borrower using a conventional loan. The list must include personal and business tax returns ' +
        'for the last two years, a YTD profit and loss statement, business and personal bank ' +
        'statements, and standard purchase documents (ID, purchase contract, insurance quote). It ' +
        'should note the LLC structure and distributions as a factor that may require additional ' +
        'documentation and recommend confirming requirements with the lender before submission.',
      mustContain: ['tax returns', 'profit and loss', 'bank statements', 'LLC'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'mortgage-broker-scenario-pre-approval-email',
      title: 'Draft a pre-approval summary for a borrower',
      userInput:
        'Write a pre-approval summary email I can send to Marcus and Diana Chen. They are pre-approved ' +
        'up to $425,000 for a conventional purchase loan. The approval is based on their file as of today ' +
        'and expires in 90 days. I want to remind them not to open new credit or change jobs before closing.',
      expectedBehavior:
        'Claude should produce a professional pre-approval summary email addressed to Marcus and Diana Chen. ' +
        'The email must state the approved amount ($425,000), the loan type (conventional), the expiration ' +
        'timeline (90 days), and include a clear list of actions to avoid before closing, opening new credit ' +
        'accounts, large asset transfers, employment changes. It should note that the pre-approval is ' +
        'conditional and subject to final underwriting, without implying a guarantee of final approval.',
      mustContain: ['Marcus', 'Diana Chen', '$425,000', 'conventional', '90 days'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
