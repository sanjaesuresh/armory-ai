import type { Setup } from '@/lib/setup/types';

export const bookkeeperSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-bookkeeper-v1',
  slug: 'bookkeeper',
  name: 'Bookkeeper',
  tagline: 'Transaction categorization, reconciliation, and clean month-end closes',
  description:
    'Configure Claude as a bookkeeper for your business. It guides transaction ' +
    'categorization decisions, walks through bank and credit card reconciliation ' +
    'step by step, structures month-end close checklists, and drafts client-friendly ' +
    'financial summaries, all grounded in your accounting software and reporting rhythm.',
  role: 'Bookkeeper',
  industry: 'Accounting & Finance',
  tags: ['bookkeeping', 'accounting', 'reconciliation', 'month-end', 'transactions', 'financial-reporting'],
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

  instructionTemplate: `You are a bookkeeper for {{companyName}}, working in {{accountingSoftware}}.

Your responsibilities:
- Guide transaction categorization decisions using chart-of-accounts logic and standard accounting conventions.
- Walk through bank and credit card reconciliation step by step, flagging unmatched items and suggesting resolution paths.
- Provide month-end close checklists covering journal entries, accruals, prepaid amortization, and balance confirmation.
- Draft {{reportingPeriod}} financial summaries that highlight key movements in income, expenses, and cash position.

Fiscal year end: {{fiscalYearEnd}}. Reference this when discussing year-end adjustments, accrual timing, and comparative reporting periods.

{{#if clientFacing}}
Outputs will be shared directly with clients. Use plain language, avoid jargon, and explain any accounting concept a non-accountant might not recognize.
{{/if}}

Rules:
1. Never invent account balances, transaction amounts, or vendor names, ask when you need that information.
2. When a categorization decision is ambiguous, present two or three options with the reasoning for each rather than silently picking one.
3. Always flag transactions that may have tax implications and note that the client should confirm treatment with their tax preparer or CPA before considering it settled.
4. Format journal entries, reconciliation summaries, and reports so they paste cleanly into {{accountingSoftware}} without reformatting.
5. Separate bookkeeping guidance (what to record and how) from tax advice (what deductions or treatments to take), you handle the former.
6. Never give definitive tax or legal advice. Provide general information only and always recommend consulting a licensed CPA or tax professional for specific guidance.`,

  variables: [
    {
      key: 'companyName',
      label: 'Company name',
      type: 'text',
      required: true,
      helpText: 'The business whose books you manage. Used in summaries and client reports.',
      group: 'About the business',
    },
    {
      key: 'accountingSoftware',
      label: 'Accounting software',
      type: 'select',
      options: ['QuickBooks Online', 'QuickBooks Desktop', 'Xero', 'FreshBooks', 'Wave', 'Sage'],
      default: 'QuickBooks Online',
      required: true,
      helpText:
        'The platform you record transactions in. Claude formats outputs to fit its conventions and terminology.',
      group: 'About the business',
    },
    {
      key: 'reportingPeriod',
      label: 'Reporting period',
      type: 'select',
      options: ['Monthly', 'Quarterly'],
      default: 'Monthly',
      required: true,
      helpText: 'How often you prepare financial summaries for this business.',
      group: 'Reporting preferences',
    },
    {
      key: 'fiscalYearEnd',
      label: 'Fiscal year end',
      type: 'text',
      required: true,
      helpText: 'e.g., "December 31" or "March 31". Used for year-end close and accrual timing guidance.',
      group: 'Reporting preferences',
    },
    {
      key: 'clientFacing',
      label: 'Are outputs shared directly with clients?',
      type: 'boolean',
      default: false,
      required: false,
      helpText:
        'Turn on to have Claude use plain language and explain accounting concepts for non-accountant readers.',
      group: 'Reporting preferences',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Month-end close reference card',
      purpose:
        'A structured checklist Claude uses when walking through a month-end close, covering ' +
        'reconciliation steps, required journal entries, and a final sign-off review. Update ' +
        'each section to match your chart of accounts and workflow.',
      kind: 'starter',
      content: `# Month-end close reference card

## About this file
Update each section to match your chart of accounts, software settings, and client requirements. Claude reads this file before helping with reconciliation or close tasks.

---

## Pre-close checklist

### Transaction entry
- [ ] All bank and credit card feeds imported or manually entered
- [ ] All bills and vendor invoices entered
- [ ] All customer invoices and payments recorded
- [ ] Petty cash log reconciled

### Reconciliation
- [ ] Bank accounts reconciled to statement ending balance
- [ ] Credit card accounts reconciled to statement balance
- [ ] Loans and line-of-credit balances confirmed against statements
- [ ] Payroll liability accounts cleared

---

## Standard journal entries

### Accruals
- Record unpaid expenses where service was received but invoice has not yet arrived
- Reverse prior-month accruals that are now invoiced

### Prepaid amortization
- Identify prepaid balances (insurance, subscriptions, rent deposits)
- Amortize monthly portion to the appropriate expense account

### Depreciation
- Post monthly depreciation from the fixed-asset schedule

---

## Balance confirmation

| Account type | Check |
|---|---|
| Accounts receivable | Aging matches AR sub-ledger |
| Accounts payable | Aging matches AP sub-ledger |
| Payroll liabilities | Zero balance or matches next payroll |
| Sales tax payable | Matches sales tax report |
| Retained earnings | Ties to prior year-end balance |

---

## Common categorization rules

- Owner draws or distributions → Equity (not expense)
- Loan principal repayments → Liability reduction (not expense)
- Loan interest payments → Interest expense
- Credit card payments → Asset transfer (expense was recorded at purchase)
- Refunds from vendors → Reduce original expense category

---

## Close sign-off
Before marking the period closed:
- [ ] P&L reviewed against prior period, large variances explained
- [ ] Balance sheet reviewed, no unexpected negative balances
- [ ] Bank feeds current and no unreviewed transactions outstanding
- [ ] Backup or export saved per firm policy
`,
      required: true,
    },
    {
      name: 'Chart of accounts',
      purpose:
        'Upload the client\'s chart of accounts or a summary of account names and numbers. ' +
        'Claude uses this to give categorization guidance that matches the actual account structure ' +
        'rather than suggesting generic account names.',
      kind: 'user-provided',
      guidance:
        'Export the chart of accounts from your accounting software as a CSV or paste it as ' +
        'a plain text list. Include the account number, account name, and account type (asset, ' +
        'liability, equity, income, expense). You do not need every sub-account, the top-level ' +
        'accounts are enough for most categorization guidance.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'bookkeeper-scenario-1',
      title: 'Categorize an ambiguous mixed-use transaction',
      userInput:
        'I have a $1,200 charge from Adobe on the business credit card. The business uses Adobe ' +
        'Creative Cloud for marketing materials, but the owner also uses Photoshop personally at home. ' +
        'How should I categorize this?',
      expectedBehavior:
        'Claude should present clear options rather than picking one silently: full business expense ' +
        'if documented as business-only, a partial expense with a personal-use adjustment, or a ' +
        'distribution for the personal portion. It should explain what documentation each approach ' +
        'requires, flag the tax implication risk, and recommend the client confirm the treatment ' +
        'with their CPA before the period is closed. It must not invent specific deduction percentages.',
      mustContain: ['Adobe', 'personal', 'CPA'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'bookkeeper-scenario-2',
      title: 'Troubleshoot a bank reconciliation discrepancy',
      userInput:
        'My bank reconciliation for October is off by $340. The bank statement ending balance is ' +
        '$12,450 and my QuickBooks balance is $12,110. I have already confirmed all cleared ' +
        'transactions match. Where should I look to find the difference?',
      expectedBehavior:
        'Claude should provide a systematic troubleshooting sequence: check for outstanding checks ' +
        'or deposits in transit that appear in QuickBooks but not on the statement, look for bank ' +
        'fees or interest that posted on the statement but were not entered, check for duplicate or ' +
        'transposed entries, and verify the opening balance matches last month\'s reconciliation. ' +
        'The response should be step-by-step and reference the $340 discrepancy specifically.',
      mustContain: ['$340', 'outstanding', 'bank fees'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'bookkeeper-scenario-3',
      title: 'Draft a monthly financial summary for a client',
      userInput:
        'Write a short financial summary for Greenfield Catering for October. Revenue was $48,000 ' +
        '(up 12% from September). Cost of goods was $21,000. Operating expenses were $14,500. ' +
        'Net income was $12,500. Cash on hand is $31,000.',
      expectedBehavior:
        'Claude should produce a concise, professional financial summary suitable for sharing with ' +
        'a business owner. It should present the key figures clearly, note the revenue increase, ' +
        'calculate gross and net margins, and highlight the cash position. Language should be plain ' +
        'since this is a client-facing output. It must not invent any figures not provided.',
      mustContain: ['Greenfield Catering', '$48,000', '$12,500', 'October'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
