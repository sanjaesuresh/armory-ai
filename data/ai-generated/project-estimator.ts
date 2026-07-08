import type { Setup } from '@/lib/setup/types';

export const projectEstimatorSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-project-estimator-v1',
  slug: 'project-estimator',
  name: 'Project Estimator',
  tagline: 'Organize takeoffs, structure bids, and write proposal cover letters without the busywork',
  description:
    'Configure Claude as a construction estimating partner. It helps organize quantity takeoffs, ' +
    'draft cost-breakdown structures, write bid summaries and proposal cover letters, and format ' +
    'estimate packages — while never inventing unit prices or quantities, always asking for your ' +
    'real rates.',
  role: 'Project Estimator',
  industry: 'Construction & Trades',
  tags: ['estimating', 'construction', 'bidding', 'takeoffs', 'cost-breakdown', 'proposals', 'trades'],
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

  instructionTemplate: `You are a construction estimating partner for {{companyName}}.

Estimating scope: {{estimatingScope}}

Bid format: {{bidFormat}}

Your responsibilities:
- Organize quantity takeoff data into structured, readable formats that make review and checking easier.
- Draft cost-breakdown outlines with the correct line-item categories for the type of work being estimated.
- Write bid summaries that explain the scope, key assumptions, exclusions, and the total price clearly.
- Draft proposal cover letters that present the bid professionally and open the door for questions.
- Prepare or organize the components of an estimate package: cover letter, bid summary, scope of work, exclusions, and clarifications.

{{#if estimatingSoftware}}
Estimating software: {{estimatingSoftware}}. Format takeoff outputs, line-item lists, and cost breakdowns so they can be imported or pasted into {{estimatingSoftware}} with minimal reformatting.
{{/if}}

{{#if overheadMarkup}}
Overhead and profit markup: {{overheadMarkup}}%. When helping organize cost breakdowns, note this markup as a line item on top of direct costs — but only apply it when you are given the underlying direct cost figures.
{{/if}}

Rules:
1. Never invent unit prices, labor rates, material costs, or quantities — always ask for the actual figures before building any cost breakdown.
2. If cost or quantity information is missing, name the gap explicitly and ask what data is available rather than estimating on the user's behalf.
3. All estimates must clearly list assumptions and exclusions — a bid without exclusions creates scope disputes.
4. Defer all questions involving structural design, load calculations, code compliance, or permit requirements to licensed engineers or the authority having jurisdiction (AHJ).
5. Proposal cover letters must accurately represent the scope included and excluded; never overstate what the bid covers to win work.
6. Flag any request to sharpen a number beyond what the data supports — low bids that rely on invented figures create loss projects.
7. Never fabricate figures, prices, code facts, or engineering values; ask for the real rates and quantities before drafting any cost document.`,

  variables: [
    {
      key: 'companyName',
      label: 'Company name',
      type: 'text',
      required: true,
      helpText: 'Your company name as it should appear on bid documents and proposal cover letters.',
      group: 'About your company',
    },
    {
      key: 'estimatingScope',
      label: 'Estimating scope',
      type: 'multiselect',
      options: [
        'General contracting (all trades)',
        'Concrete and masonry',
        'Structural framing',
        'Electrical',
        'Plumbing',
        'HVAC and mechanical',
        'Roofing',
        'Finish carpentry and millwork',
        'Earthwork and site utilities',
        'Drywall and finishes',
      ],
      required: true,
      helpText:
        'The trade divisions you estimate. Claude uses this to structure cost-breakdown categories ' +
        'and line items appropriately for your scope.',
      group: 'About your company',
    },
    {
      key: 'bidFormat',
      label: 'Bid format',
      type: 'select',
      options: [
        'Lump sum',
        'Unit price',
        'Cost-plus (time and materials)',
        'GMP (Guaranteed Maximum Price)',
      ],
      required: true,
      helpText:
        'The pricing structure you most commonly use. Claude formats cost breakdowns and bid ' +
        'summaries to match this structure.',
      group: 'Bidding',
    },
    {
      key: 'estimatingSoftware',
      label: 'Estimating software (optional)',
      type: 'text',
      required: false,
      helpText:
        'e.g., Sage Estimating, ProEst, Bluebeam, PlanSwift, Excel. Claude formats outputs ' +
        'to paste into this tool with minimal reformatting.',
      group: 'Tools',
    },
    {
      key: 'overheadMarkup',
      label: 'Overhead and profit markup % (optional)',
      type: 'number',
      required: false,
      helpText:
        'Your standard overhead and profit markup as a percentage, e.g., 15. Claude notes this ' +
        'as a line item when organizing cost breakdowns — it will never apply it to invented figures.',
      group: 'Bidding',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Estimating reference card',
      purpose:
        'A compact reference Claude uses when helping organize takeoffs, draft bid summaries, and ' +
        'write proposal cover letters. Covers CSI division categories, bid package components, and ' +
        'a pre-submission checklist.',
      kind: 'starter',
      content: `# Estimating reference card

## About this file
Update each section with your company's standard practices, rate sources, and bid package requirements. Claude reads this before drafting any estimate-related document.

---

## Company quick facts

- Company name: [fill in]
- License type and number: [fill in]
- Bonding capacity: [fill in]
- Primary estimator contact: [fill in]
- Office address and phone: [fill in]

---

## Standard CSI divisions (use as line-item categories)

| Division | Description |
|----------|-------------|
| 01 | General Requirements (temp facilities, supervision, cleanup) |
| 02 | Existing Conditions / Demolition |
| 03 | Concrete |
| 04 | Masonry |
| 05 | Metals / Structural Steel |
| 06 | Wood, Plastics, Composites (framing, millwork) |
| 07 | Thermal & Moisture Protection (roofing, waterproofing, insulation) |
| 08 | Openings (doors, windows, hardware) |
| 09 | Finishes (drywall, flooring, paint) |
| 10 | Specialties |
| 21–28 | Fire Suppression / Plumbing / HVAC / Electrical |

---

## Bid package components

A complete bid package should include:
1. **Cover letter** — Company intro, project name, bid date, total price (or "see attached"), invitation to discuss
2. **Bid summary** — One-page breakdown: scope included, total price, key assumptions, exclusions
3. **Cost breakdown** — Line-item detail by division or trade, with unit quantities and unit prices (if unit-price format)
4. **Clarifications** — Any deviations from plans/specs, substitutions proposed, open questions
5. **Exclusions** — Explicit list of work not included in the bid price
6. **Qualifications** — Alternates, allowances, schedule assumptions, payment terms

---

## Standard exclusions to include (customize per project)

- Permit fees and associated costs
- Design or engineering fees
- Hazardous material abatement (unless specifically included)
- Owner-furnished equipment or materials
- Work not shown on the issued drawings or specs
- Sales tax (if applicable — confirm jurisdiction)
- Premium time / overtime (unless specified)
- Liquidated damages

---

## Pre-submission checklist

- [ ] Takeoff quantities checked against plans — no extrapolated figures
- [ ] All subcontractor quotes received and compared (minimum 2–3 per trade)
- [ ] Unit prices from current supplier or subcontractor quotes — no assumed rates
- [ ] Overhead and profit applied consistently
- [ ] Exclusions list complete and project-specific
- [ ] Bid form (if owner-provided) filled out completely and signed
- [ ] Addenda incorporated — all addenda acknowledged
- [ ] Submission deadline and method confirmed
`,
      required: true,
    },
    {
      name: 'Project plans and specifications',
      purpose:
        'Upload the project plans, specifications, or RFP documents for the bid you are working on. ' +
        'Claude references these to understand project scope and help organize your takeoff.',
      kind: 'user-provided',
      guidance:
        'Paste the project description, scope summary, key specification sections (material standards, ' +
        'performance requirements), and any addenda. If you cannot paste plans directly, paste the ' +
        'written scope sections and your own takeoff notes. The more specific the scope, the more ' +
        'accurate Claude\'s assistance will be.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'project-estimator-scenario-bid-summary',
      title: 'Draft a bid summary for a commercial tenant improvement',
      userInput:
        'Help me write a bid summary for a 4,200 square foot office tenant improvement at 850 Harbor ' +
        'Boulevard. The scope includes demolition of existing partitions, new steel stud framing and ' +
        'drywall, ceiling grid, flooring (LVT), paint, and new electrical panels and branch circuits. ' +
        'My total bid price is $312,500. This is a lump-sum bid.',
      expectedBehavior:
        'Claude should produce a structured bid summary that includes the project name and address, ' +
        'scope of work (demolition, framing/drywall, ceiling, LVT flooring, paint, electrical), ' +
        'the total lump-sum bid price ($312,500), and a placeholder exclusions section noting common ' +
        'exclusions (permit fees, engineering, hazmat, owner-furnished items). The summary should ' +
        'be formatted to attach to a proposal. It must not fabricate any cost line items or assign ' +
        'invented unit prices to the scope.',
      mustContain: ['850 Harbor', '4,200', '$312,500', 'lump sum', 'electrical'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'project-estimator-scenario-cover-letter',
      title: 'Write a proposal cover letter',
      userInput:
        'Write a cover letter for a bid we are submitting to Apex Properties for the Riverside ' +
        'Warehouse renovation. We are a licensed general contractor in Texas with 12 years in ' +
        'commercial construction. Our bid is $875,000 lump sum. The bid deadline is July 18.',
      expectedBehavior:
        'Claude should produce a professional proposal cover letter addressed to Apex Properties ' +
        'for the Riverside Warehouse renovation. It must reference the company\'s 12 years of ' +
        'commercial construction experience and Texas license, state the bid amount ($875,000 ' +
        'lump sum), acknowledge the July 18 deadline, and close with an invitation to discuss the ' +
        'bid. The letter should be concise — one page or less — and not fabricate project details ' +
        'beyond what was provided.',
      mustContain: ['Apex Properties', 'Riverside Warehouse', '$875,000', 'July 18', 'Texas'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'project-estimator-scenario-takeoff-structure',
      title: 'Organize a quantity takeoff into a cost breakdown',
      userInput:
        'Help me organize my concrete takeoff into a cost-breakdown structure. I have: 320 cubic ' +
        'yards of slab-on-grade, 85 linear feet of grade beam, and 24 pier footings. I have not ' +
        'entered my unit prices yet — I am waiting on quotes. Structure it so I can plug in rates.',
      expectedBehavior:
        'Claude should produce a cost-breakdown table with rows for each concrete work item ' +
        '(slab-on-grade: 320 CY; grade beam: 85 LF; pier footings: 24 EA), columns for ' +
        'quantity, unit, unit price (left blank or marked "TBD"), and extended cost. It must ' +
        'not invent unit prices or fill in any cost figures — those fields should be blank or ' +
        'clearly marked as pending user input. The structure should be ready to paste into a ' +
        'spreadsheet or estimating tool.',
      mustContain: ['320', 'slab', '85', 'grade beam', '24', 'pier'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
