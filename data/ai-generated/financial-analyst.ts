import type { Setup } from '@/lib/setup/types';

export const financialAnalystSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-financial-analyst-v1',
  slug: 'financial-analyst',
  name: 'Financial Analyst',
  tagline: 'Draft financial analysis, models, and board-ready summaries in less time',
  description:
    'Configure Claude as a financial analyst working alongside your finance team. It structures ' +
    'variance analyses, drafts commentary for board decks, outlines models, and helps you turn ' +
    'raw numbers into clear narratives — all as working drafts for your own review.',
  role: 'Financial Analyst',
  industry: null,
  tags: ['finance', 'financial-analysis', 'modeling', 'reporting', 'board-decks'],
  category: 'finance',
  source: 'ai-generated',
  author: null,
  version: '1.0.0',
  createdAt: '2026-07-05T00:00:00Z',
  updatedAt: '2026-07-05T00:00:00Z',
  reviewStatus: 'approved',
  upvotes: 0,
  featured: null,
  targets: ['claude-app'],
  tier: 'core',

  instructionTemplate: `You are a financial analyst supporting the finance team at {{companyName}}, a company operating in the {{industry}} sector.

Your responsibilities:
- Structure and draft financial analysis: variance explanations, trend commentary, and metric summaries.
- Outline financial models (DCF, scenario analysis, budget templates) and explain the assumptions behind them.
- Draft board deck and management reporting commentary that translates numbers into plain business narrative.
- Help prepare questions and frameworks for investment or acquisition analysis.
- Review financial data for inconsistencies, outliers, or items that warrant a closer look.

Reporting currency: {{reportingCurrency}}. Use this currency for all figures unless the user specifies otherwise.

Fiscal year end: {{fiscalYearEnd}}. Align any period references (Q1, H1, YTD, full year) to this fiscal calendar.

Primary analysis types for this team: {{analysisTypes}}. Prioritize depth and structure in these areas.

{{#if hasBenchmarkData}}
Industry benchmark data is provided in the knowledge files. When assessing performance metrics, compare against those benchmarks and note clearly when a figure is above, at, or below benchmark.
{{/if}}

Important — scope and professional review:
All outputs from this setup are working drafts intended for review by a qualified finance professional before any use in decision-making, reporting, investor communications, or external disclosure. Claude assists with structuring and drafting analysis; it does not replace the judgment of a CPA, CFO, or investment professional. Any model assumptions, accounting treatments, or regulatory interpretations must be verified by a qualified person before they are relied upon.

Rules:
1. Never fabricate financial figures. If you do not have a number, say so and ask.
2. State model assumptions explicitly — do not bury them or leave them implicit.
3. When something in the data looks unusual, flag it rather than smoothing it over.
4. Use plain business language in narrative sections. Avoid jargon that obscures rather than clarifies.
5. If asked to produce analysis that requires information you do not have, list exactly what is missing before proceeding with any draft.`,

  variables: [
    {
      key: 'companyName',
      label: 'Company name',
      type: 'text',
      required: true,
      helpText: 'The organization this setup is configured for.',
      group: 'About your organization',
    },
    {
      key: 'industry',
      label: 'Industry or sector',
      type: 'text',
      required: true,
      helpText:
        'e.g., "B2B SaaS," "Retail," "Healthcare," "Manufacturing." ' +
        'Claude uses this to frame analysis and benchmarks appropriately.',
      group: 'About your organization',
    },
    {
      key: 'reportingCurrency',
      label: 'Reporting currency',
      type: 'select',
      options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'Other'],
      default: 'USD',
      required: true,
      helpText: 'The primary currency used in your financial reporting.',
      group: 'Reporting settings',
    },
    {
      key: 'fiscalYearEnd',
      label: 'Fiscal year end',
      type: 'text',
      required: true,
      helpText:
        'The last day of your fiscal year, e.g., "December 31" or "March 31." ' +
        'Claude uses this to align all period references correctly.',
      group: 'Reporting settings',
    },
    {
      key: 'analysisTypes',
      label: 'Primary analysis types',
      type: 'multiselect',
      options: [
        'Revenue and growth analysis',
        'Cost and margin analysis',
        'Cash flow and liquidity',
        'Budget vs. actuals variance',
        'Investment and acquisition analysis',
        'KPI and metrics dashboards',
        'Board and investor reporting',
      ],
      default: ['Revenue and growth analysis', 'Budget vs. actuals variance', 'Board and investor reporting'],
      required: true,
      helpText:
        'Select the types of analysis your team produces most often. Claude will go deeper in these areas.',
      group: 'Analysis scope',
    },
    {
      key: 'hasBenchmarkData',
      label: 'Will you upload industry benchmark data?',
      type: 'boolean',
      default: false,
      required: false,
      helpText:
        'Turn this on if you plan to add industry benchmark figures as a knowledge file (e.g., median gross margin, ' +
        'CAC payback period benchmarks for your sector). Claude will reference them in performance assessments.',
      group: 'Knowledge files',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Financial metrics reference card',
      purpose:
        'A compact reference covering common financial metrics, their formulas, and how to interpret them. ' +
        'Claude consults this when calculating or explaining ratios so definitions stay consistent ' +
        'across analyses.',
      kind: 'starter',
      content: `# Financial metrics reference card

## About this file
Standard definitions and formulas for common financial metrics. Update the "Company conventions" column if your team uses non-standard definitions — Claude will follow your conventions.

---

## Profitability metrics

| Metric | Formula | Interpretation | Company convention |
|--------|---------|----------------|-------------------|
| Gross Profit | Revenue − COGS | Revenue remaining after direct production costs | [Update if needed] |
| Gross Margin % | Gross Profit / Revenue × 100 | Percentage of revenue retained after COGS | [Update if needed] |
| EBITDA | Operating income + D&A | Proxy for operating cash generation before financing | [Update if needed] |
| EBITDA Margin % | EBITDA / Revenue × 100 | Operating efficiency as a percentage of revenue | [Update if needed] |
| Net Income Margin % | Net Income / Revenue × 100 | Bottom-line profitability as a percentage of revenue | [Update if needed] |

---

## Growth metrics

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| YoY Revenue Growth | (Current Period Revenue − Prior Period Revenue) / Prior Period Revenue × 100 | Year-over-year growth rate |
| MoM Revenue Growth | (Current Month Revenue − Prior Month Revenue) / Prior Month Revenue × 100 | Month-over-month growth rate |
| CAGR | (Ending Value / Beginning Value)^(1/n) − 1 | Compound annual growth rate over n years |

---

## SaaS / subscription metrics (if applicable)

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| ARR | MRR × 12 | Annualized run-rate revenue from recurring subscriptions |
| MRR | Sum of all monthly recurring charges | Monthly recurring revenue |
| Net Revenue Retention (NRR) | (Beginning MRR + Expansion − Contraction − Churn) / Beginning MRR × 100 | Retention including upsell; >100% means growth from existing customers |
| Gross Revenue Retention (GRR) | (Beginning MRR − Contraction − Churn) / Beginning MRR × 100 | Retention without expansion; bounded at 100% |
| CAC | Sales & Marketing Spend / New Customers Acquired | Cost to acquire one new customer |
| LTV | ARPU × Gross Margin % / Churn Rate | Estimated lifetime value of a customer |
| CAC Payback Period | CAC / (ARPU × Gross Margin %) | Months to recover customer acquisition cost |

---

## Cash flow and liquidity

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| Operating Cash Flow | Net income + Non-cash items + Working capital changes | Cash generated from core operations |
| Free Cash Flow | Operating Cash Flow − Capital Expenditures | Cash available after maintaining/growing assets |
| Current Ratio | Current Assets / Current Liabilities | Ability to cover short-term obligations; >1 generally healthy |
| Quick Ratio | (Cash + Short-term investments + Receivables) / Current Liabilities | Liquidity without relying on inventory |
| Days Sales Outstanding (DSO) | (Accounts Receivable / Revenue) × Days in Period | Average days to collect payment |

---

## Variance analysis conventions

When explaining a variance, always state:
1. The magnitude: absolute dollar amount and percentage change
2. The direction: favorable (F) or unfavorable (U) vs. budget or prior period
3. The primary driver: one sentence on the main cause
4. Any one-time or non-recurring items that distort the comparison

---

## Model assumption documentation standard

Every financial model shared in this setup should document:
- Data source and as-of date for all inputs
- Key growth assumptions and their basis
- Discount rate and justification (for DCF work)
- Sensitivity variables: which inputs most affect the output
- Limitations: what the model does not capture
`,
      required: true,
    },
    {
      name: 'Company financial data',
      purpose:
        'Upload your current financial statements, budget files, or key metrics data. Claude ' +
        'uses this as the factual basis for analysis rather than working from assumptions.',
      kind: 'user-provided',
      guidance:
        'Paste your P&L, balance sheet, or key metrics table — either as plain text or a copied ' +
        'spreadsheet table. Include at least the two most recent periods so Claude can calculate ' +
        'variances and trends. Redact any data that should not leave your internal systems ' +
        '(e.g., individual compensation, unreleased deal terms, material non-public information). ' +
        'If you have multiple files, prioritize the actuals and current-period budget.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'financial-analyst-scenario-revenue-variance',
      title: 'Explain a quarterly revenue variance',
      userInput:
        'Q3 revenue was $12.4M, up from $10.1M in Q2. Budget for Q3 was $11.8M. ' +
        'The variance was driven mainly by two enterprise deals that closed in September ' +
        'and were not in the original pipeline. Cost of goods sold was $7.2M. ' +
        'Draft the revenue commentary for the board deck.',
      expectedBehavior:
        'Claude should draft concise board-deck commentary covering: the Q3 revenue figure and ' +
        'QoQ growth rate, performance vs. budget (favorable, with the reason), gross margin ' +
        'for the quarter, and a note about the September enterprise deals being upside. ' +
        'The draft should flag that the enterprise deals represent non-recurring upside ' +
        'and may not repeat. Figures should be stated clearly without fabricating additional numbers.',
      mustContain: ['$12.4M', 'Q3', 'gross margin'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'financial-analyst-scenario-dcf-outline',
      title: 'Outline a DCF model for an acquisition target',
      userInput:
        'Build an outline for a DCF model to evaluate an acquisition target in the logistics sector. ' +
        'The target has $5M EBITDA, is growing at around 15% annually, and we would be paying 8x EBITDA. ' +
        'Walk me through the structure and key assumptions I need to define.',
      expectedBehavior:
        'Claude should produce a structured DCF outline covering: projection period and terminal value approach, ' +
        'key inputs needed (revenue growth rate, EBITDA margin trajectory, capex, working capital, tax rate, ' +
        'WACC/discount rate), the implied purchase price at 8x EBITDA, and the assumptions that will most ' +
        'affect the output. It should note that the discount rate and terminal growth rate are the most ' +
        'sensitive variables and that the output is a draft framework requiring review by a qualified professional.',
      mustContain: ['DCF', 'EBITDA', '8x'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'financial-analyst-scenario-budget-variance',
      title: 'Summarize budget vs. actuals for a management meeting',
      userInput:
        'Prepare a budget vs. actuals summary for October. Total spend was $3.8M against a budget of $3.5M, ' +
        'a $300K unfavorable variance. The main driver was a $220K overspend in the engineering headcount ' +
        'line due to two hires that closed ahead of schedule. Marketing came in $80K over due to a ' +
        'conference sponsorship that was not in the original budget.',
      expectedBehavior:
        'Claude should produce a clear budget vs. actuals summary with the total variance labeled as ' +
        'unfavorable (U), the two primary drivers broken out (headcount $220K, marketing $80K), ' +
        'and a brief narrative explaining each. The summary should flag whether these are one-time ' +
        'items or indicative of a run-rate issue. It should be structured for a management meeting — ' +
        'concise, fact-based, no additional fabricated figures.',
      mustContain: ['$3.8M', '$300K', 'headcount'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
