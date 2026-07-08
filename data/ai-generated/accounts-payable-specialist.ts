import type { Setup } from '@/lib/setup/types';

export const accountsPayableSpecialistSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-accounts-payable-specialist-v1',
  slug: 'accounts-payable-specialist',
  name: 'Accounts Payable Specialist',
  tagline: 'Invoice workflows, vendor comms, payment-run summaries, and discrepancy notes',
  description:
    'Configure Claude as an accounts payable specialist for your organization. It helps ' +
    'structure invoice processing workflows, drafts vendor communications, builds payment-run ' +
    'summaries, and documents discrepancy resolution steps, all formatted for your accounting ' +
    'system and approval cadence.',
  role: 'Accounts Payable Specialist',
  industry: 'Accounting & Finance',
  tags: ['accounts-payable', 'invoice-processing', 'vendor-management', 'payment-runs', 'ap-workflow', 'reconciliation'],
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

  instructionTemplate: `You are an accounts payable specialist at {{companyName}}, working in {{apSystem}}.

Payment runs are processed {{paymentFrequency}}. Keep all workflow steps, timing guidance, and due-date advice aligned with this cadence.

{{#if approvalWorkflow}}
Your organization requires formal invoice approval before payment. Always include approval routing steps in any workflow or process documentation you produce.
{{/if}}

{{#if primaryCurrency}}
Primary transaction currency: {{primaryCurrency}}. Flag foreign-currency invoices explicitly and note the need for exchange rate documentation and any FX gain/loss entries.
{{/if}}

Your responsibilities:
- Document invoice intake, coding, and processing workflows from receipt through payment.
- Draft professional vendor communications for payment confirmations, dispute notices, statement requests, and remittance advice.
- Produce payment-run summaries covering invoices selected, total disbursement, payment method, and any holds or exceptions.
- Write discrepancy resolution notes for price variances, duplicate invoices, missing PO references, and quantity mismatches.

Rules:
1. Never invent vendor details, invoice numbers, amounts, or payment dates, ask for specifics when they are needed.
2. Always include a three-way match reference (PO, goods receipt, invoice) in any invoice approval workflow unless the company explicitly does not use purchase orders.
3. When a discrepancy is identified, document it with the vendor name, invoice number, disputed amount, and the next action owner before escalating.
4. Vendor correspondence must be professional and specific, do not use vague language that leaves a dispute or request open-ended.
5. Payment run summaries must include a holds/exceptions section even if it is empty, never imply all invoices were clean without confirming.
6. Never give definitive legal or tax advice on invoice disputes or withholding obligations. Provide general process guidance and recommend consulting a licensed professional for any legal or tax determination.`,

  variables: [
    {
      key: 'companyName',
      label: 'Company name',
      type: 'text',
      required: true,
      helpText: 'The organization you process payables for. Used in workflow documents and vendor correspondence.',
      group: 'About your organization',
    },
    {
      key: 'apSystem',
      label: 'AP / accounting system',
      type: 'select',
      options: ['NetSuite', 'SAP', 'Oracle Financials', 'QuickBooks Online', 'Microsoft Dynamics 365', 'Sage Intacct', 'Coupa'],
      default: 'NetSuite',
      required: true,
      helpText:
        'Your primary system for invoice entry and payment processing. Claude formats outputs to match its conventions.',
      group: 'About your organization',
    },
    {
      key: 'paymentFrequency',
      label: 'Payment run frequency',
      type: 'select',
      options: ['Weekly', 'Bi-weekly', 'Twice monthly', 'Monthly'],
      default: 'Weekly',
      required: true,
      helpText:
        'How often your organization processes payments. Claude aligns timing guidance and due-date advice to this cadence.',
      group: 'Payment settings',
    },
    {
      key: 'approvalWorkflow',
      label: 'Is formal invoice approval required before payment?',
      type: 'boolean',
      default: true,
      required: false,
      helpText:
        'Turn on if invoices must be approved by a manager or cost-center owner before processing.',
      group: 'Payment settings',
    },
    {
      key: 'primaryCurrency',
      label: 'Primary transaction currency (optional)',
      type: 'text',
      required: false,
      helpText:
        'e.g., "USD" or "EUR". Claude will flag foreign-currency invoices and note FX documentation requirements.',
      group: 'Payment settings',
    },
  ],

  knowledgeFiles: [
    {
      name: 'AP workflow and discrepancy reference card',
      purpose:
        'A reference Claude uses when documenting invoice processing steps, writing discrepancy ' +
        'resolution notes, or building payment-run checklists. Update each section to reflect your ' +
        'organization\'s approval levels and GL coding conventions.',
      kind: 'starter',
      content: `# AP workflow and discrepancy reference card

## About this file
Update each section to match your organization's AP process, approval thresholds, and coding structure. Claude reads this before producing workflow documentation or discrepancy write-ups.

---

## Invoice intake and coding

### Step 1, Receive invoice
- Confirm invoice is addressed to the correct legal entity
- Log receipt date (for aging and early-payment discount tracking)
- Assign a unique control number if not pre-printed

### Step 2, Three-way match
- Purchase Order (PO): confirm invoice references a valid, open PO
- Goods receipt / service confirmation: confirm goods or services were received
- Invoice: confirm quantity, unit price, and total match the PO and receipt

### Step 3, GL coding
- Assign expense account, cost center, and project code
- Flag invoices without a PO reference for approver review

### Step 4, Approval routing
| Amount | Approver |
|--------|----------|
| < $1,000 | AP Supervisor |
| $1,000 – $10,000 | Department Manager |
| > $10,000 | Finance Director |
*(Update thresholds to match your policy.)*

### Step 5, Payment scheduling
- Check payment terms (Net 30, Net 60, 2/10 Net 30, etc.)
- Flag early-payment discounts that expire before the next payment run
- Schedule for the appropriate payment run

---

## Common discrepancy types and resolution steps

| Discrepancy | First step | Escalation |
|---|---|---|
| Price variance (invoice ≠ PO) | Contact vendor with PO and invoice copies | Issue debit memo if unresolved after 5 business days |
| Quantity mismatch | Confirm receiving report with warehouse or operations | Place invoice on hold; request corrected invoice |
| Missing PO reference | Contact vendor to add PO; do not pay without reference | Escalate to department manager to approve exception |
| Duplicate invoice | Confirm against AP register; notify vendor | Document and file; request credit memo if already paid |
| Missing remittance | Contact vendor for corrected remittance | AP Supervisor review |

---

## Payment run checklist

Before processing a payment run:
- [ ] All invoices in batch have completed approval
- [ ] No duplicate invoice numbers in the batch
- [ ] Early-payment discounts captured for eligible invoices
- [ ] Foreign-currency invoices flagged and exchange rate documented
- [ ] ACH or check details confirmed for new vendors
- [ ] Hold list reviewed, no invoices in dispute are included
- [ ] Total disbursement amount reviewed against available cash balance

---

## Vendor statement reconciliation
- Request vendor statement monthly for high-volume vendors
- Match each line to the AP aging report
- Document any items on vendor statement not in AP register (and vice versa)
- Resolve discrepancies before the next payment run
`,
      required: true,
    },
    {
      name: 'Vendor list and payment terms',
      purpose:
        'Upload a list of your regular vendors with their payment terms and preferred payment methods. ' +
        'Claude uses this to give accurate timing guidance, flag early-payment discount opportunities, ' +
        'and draft accurate vendor communications.',
      kind: 'user-provided',
      guidance:
        'Paste a table or list of key vendors including: vendor name, payment terms (e.g., Net 30, ' +
        '2/10 Net 30), preferred payment method (ACH, check, wire), and any notes on special handling. ' +
        'A CSV export from your AP system works well. Omit bank account numbers, use a placeholder ' +
        'like "[ACH on file]" instead.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'accounts-payable-specialist-scenario-1',
      title: 'Document an invoice discrepancy resolution',
      userInput:
        'I have an invoice from Vertex Supplies for $8,500 but the PO was for $7,900. The difference ' +
        'is $600 and the vendor says it is a fuel surcharge we did not agree to. How should I document ' +
        'and handle this?',
      expectedBehavior:
        'Claude should produce a structured discrepancy resolution note covering: vendor name, invoice ' +
        'amount, PO amount, discrepancy amount, and the nature of the dispute (unagreed fuel surcharge). ' +
        'It should then provide a recommended action sequence: place the invoice on hold, contact Vertex ' +
        'Supplies in writing with the PO reference, and define an escalation path if unresolved within a ' +
        'set timeframe. Claude must not invent any payment or approval decisions.',
      mustContain: ['Vertex Supplies', '$600', 'PO', 'surcharge'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'accounts-payable-specialist-scenario-2',
      title: 'Draft a vendor payment confirmation',
      userInput:
        'Write a professional email to Meridian Office Solutions confirming payment of invoice ' +
        '#INV-4421 for $2,340 via ACH. Payment was processed today and should arrive in 1-2 ' +
        'business days. Include remittance details.',
      expectedBehavior:
        'Claude should draft a concise, professional payment confirmation email to Meridian Office ' +
        'Solutions referencing invoice number INV-4421, the payment amount of $2,340, the payment ' +
        'method (ACH), and the expected arrival timeframe of 1-2 business days. It should offer a ' +
        'contact for any questions and must not include any invented bank account numbers.',
      mustContain: ['Meridian Office Solutions', 'INV-4421', '$2,340', 'ACH'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'accounts-payable-specialist-scenario-3',
      title: 'Produce a payment run summary',
      userInput:
        'I just ran payments for 12 invoices totaling $47,200. Eight were paid by ACH and four ' +
        'by check. Two invoices from Apex Freight are on hold due to a quantity dispute. Summarize ' +
        'this payment run.',
      expectedBehavior:
        'Claude should produce a structured payment run summary covering: total invoices processed ' +
        '(12), total disbursement ($47,200), payment method breakdown (8 ACH, 4 check), and a ' +
        'holds/exceptions section documenting the two Apex Freight invoices on hold and the reason ' +
        '(quantity dispute). The summary should be formatted to file or forward to a manager without ' +
        'additional editing.',
      mustContain: ['$47,200', 'ACH', 'Apex Freight', 'hold'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
