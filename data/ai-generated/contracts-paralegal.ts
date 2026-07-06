import type { Setup } from '@/lib/setup/types';

export const contractsParalegalSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-contracts-paralegal-v1',
  slug: 'contracts-paralegal',
  name: 'Contracts Paralegal',
  tagline: 'Review, redline, and summarize contracts faster — with attorney review built in',
  description:
    'Configure Claude as a contracts paralegal for your legal team. It summarizes contract terms, ' +
    'flags one-sided or unusual clauses, drafts redline comments, and produces review checklists — ' +
    'all as working drafts for attorney review before any use or reliance.',
  role: 'Contracts Paralegal',
  industry: null,
  tags: ['legal', 'contracts', 'redlining', 'nda', 'contract-review'],
  category: 'legal',
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

  instructionTemplate: `You are a contracts paralegal supporting the legal team at {{firmOrCompanyName}}.

Your responsibilities:
- Summarize the key terms of contracts: parties, obligations, payment terms, term and termination, limitation of liability, indemnification, governing law, and dispute resolution.
- Flag clauses that are one-sided, unusual, missing, or potentially problematic relative to standard commercial practice.
- Draft redline comments that explain what a clause says, why it is concerning, and what a revised version might look like.
- Produce contract review checklists organized by clause type.
- Identify open issues or gaps that need attorney attention before execution.

Primary jurisdictions: {{jurisdictions}}. When assessing whether a clause is standard or unusual, apply the commercial norms of these jurisdictions. Flag when a jurisdiction-specific analysis is beyond the scope of paralegal work.

Primary contract types handled: {{primaryContractTypes}}. Structure your review and checklists around these contract types.

{{#if governingLawDefault}}
Default governing law for agreements originated by this team: {{governingLawDefault}}. Note when a counterparty's paper differs from this and flag it for attorney review.
{{/if}}

{{#if hasContractTemplates}}
Standard contract templates and clause libraries for this team are provided in the knowledge files. When reviewing a counterparty's paper, compare it against these templates and note deviations clearly.
{{/if}}

Important — professional scope and attorney review:
All outputs from this setup are working drafts. Nothing produced here constitutes legal advice. Every contract summary, redline comment, and issue list must be reviewed and approved by a licensed attorney before being used to negotiate, sign, or advise on any agreement. This setup assists a paralegal working under attorney supervision — it does not replace that supervision or provide independent legal counsel to any party.

Rules:
1. Never give a legal opinion or tell the user whether to sign a contract. Flag issues for attorney review; do not recommend a course of action.
2. Do not invent clause language that was not in the document provided. If you are suggesting alternative wording, label it clearly as a suggested redline — not the current contract text.
3. When a clause is ambiguous, say so. Do not interpret ambiguity in either party's favor.
4. If a provision raises regulatory, employment, IP ownership, or data privacy issues that go beyond standard contract review, flag it specifically and note that specialist review may be needed.
5. Never share, paraphrase, or summarize any document in a way that removes the confidentiality of the underlying material.`,

  variables: [
    {
      key: 'firmOrCompanyName',
      label: 'Firm or company name',
      type: 'text',
      required: true,
      helpText:
        'The law firm or company legal team this setup supports. Used to frame whose interests are being represented.',
      group: 'About your organization',
    },
    {
      key: 'jurisdictions',
      label: 'Primary jurisdictions',
      type: 'text',
      required: true,
      helpText:
        'The legal jurisdictions where contracts are most often governed, e.g., "New York, Delaware" or ' +
        '"England and Wales, EU." Claude uses this to assess whether clauses are standard for that jurisdiction.',
      group: 'Scope of work',
    },
    {
      key: 'primaryContractTypes',
      label: 'Primary contract types',
      type: 'multiselect',
      options: [
        'NDA / Confidentiality agreements',
        'Master Service Agreements (MSA)',
        'Software License Agreements',
        'SaaS / Subscription Agreements',
        'Vendor and Supplier Agreements',
        'Employment and Contractor Agreements',
        'Partnership and Collaboration Agreements',
        'Asset Purchase or M&A agreements',
      ],
      default: ['NDA / Confidentiality agreements', 'Master Service Agreements (MSA)', 'Vendor and Supplier Agreements'],
      required: true,
      helpText:
        'Select the types of contracts your team reviews most often. Claude will structure checklists and flag issues relevant to these types.',
      group: 'Scope of work',
    },
    {
      key: 'governingLawDefault',
      label: 'Default governing law (optional)',
      type: 'text',
      required: false,
      helpText:
        'The governing law your team typically prefers for agreements, e.g., "New York law" or "English law." ' +
        'Claude will flag when a counterparty\'s paper specifies something different.',
      group: 'Review preferences',
    },
    {
      key: 'hasContractTemplates',
      label: 'Will you upload contract templates or a clause library?',
      type: 'boolean',
      default: false,
      required: false,
      helpText:
        'Turn this on if you plan to upload your standard contract templates or preferred clause language ' +
        'as a knowledge file. Claude will compare counterparty paper against your templates and note deviations.',
      group: 'Knowledge files',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Contract review checklist',
      purpose:
        'A structured checklist of clauses and issues to examine in commercial contracts. ' +
        'Claude works through this checklist when reviewing a contract to ensure nothing is missed.',
      kind: 'starter',
      content: `# Contract review checklist

## About this file
A standard checklist for reviewing commercial contracts. Work through each section when reviewing a new agreement. Update the "Notes / firm standard" column to record your team's preferred positions.

---

## Section 1: Parties and authority

- [ ] Are all parties clearly identified by their full legal name?
- [ ] Is the signatory authorized to bind the entity? (Check title; flag if unclear.)
- [ ] Are there any missing or incorrect entity names, jurisdictions of formation, or addresses?

---

## Section 2: Term and termination

| Item | Present? | Notes |
|------|----------|-------|
| Start date and end date defined | | |
| Auto-renewal clause — notice period to opt out | | |
| Termination for convenience — by either party | | |
| Termination for cause — cure period defined | | |
| Obligations that survive termination listed | | |

Watch for: auto-renewal with a short opt-out window (less than 30 days); termination for cause with no cure period; no survival clause.

---

## Section 3: Payment terms

- [ ] Fees and payment schedule clearly stated
- [ ] Currency specified
- [ ] Late payment interest or penalties defined
- [ ] Invoicing requirements stated
- [ ] Disputed invoice process described
- [ ] Price adjustment or escalation clause — on what basis and with what notice?

---

## Section 4: Intellectual property

- [ ] Ownership of work product clearly allocated
- [ ] License grants: scope (exclusive/non-exclusive), field of use, territory, duration
- [ ] Background IP retained by each party
- [ ] Any IP assignment language — is this broader than needed?
- [ ] Open-source software obligations addressed?

---

## Section 5: Confidentiality

- [ ] Confidential information defined — is the definition mutual or one-sided?
- [ ] Carve-outs standard: publicly known, independently developed, required by law
- [ ] Obligation period: how long does confidentiality last after termination?
- [ ] Return or destruction of confidential information on termination

Watch for: perpetual confidentiality obligations; no carve-out for legally compelled disclosure; definition so broad it captures non-sensitive information.

---

## Section 6: Representations and warranties

- [ ] Each party's reps and warranties listed
- [ ] Disclaimer of implied warranties present?
- [ ] Any representations that are unusually broad or difficult to verify?

---

## Section 7: Indemnification

- [ ] Indemnifying party and indemnified party clearly stated
- [ ] Scope of indemnity: IP infringement, personal injury, breach of agreement
- [ ] Mutual or one-sided?
- [ ] Indemnification process: notice, control of defense, cooperation obligations
- [ ] Cap on indemnification tied to liability cap?

Watch for: unlimited IP indemnity; one-sided indemnity; indemnitor not controlling its own defense.

---

## Section 8: Limitation of liability

- [ ] Cap on direct damages — at what amount? Is it adequate?
- [ ] Exclusion of consequential, indirect, and punitive damages — is it mutual?
- [ ] Carve-outs from the cap: death/personal injury, fraud, confidentiality breach, IP infringement
- [ ] Are the carve-outs reasonable or overly broad?

Watch for: asymmetric caps; consequential damage exclusion that favors only one side; carve-outs that swallow the cap.

---

## Section 9: Dispute resolution

- [ ] Governing law specified — is it your preferred jurisdiction?
- [ ] Venue or jurisdiction for disputes specified
- [ ] Arbitration or litigation?
- [ ] Mandatory notice and cure period before dispute escalation?
- [ ] Injunctive relief carve-out?

---

## Section 10: Miscellaneous provisions

- [ ] Assignment: can either party assign without consent? Change of control treated as assignment?
- [ ] Entire agreement / integration clause present
- [ ] Amendments require written consent of both parties
- [ ] Force majeure — definition and scope
- [ ] Notices: method, address, and timing

---

## Issues requiring attorney review (flag list)

Use this section to note items that go beyond standard paralegal review:
- Regulatory or compliance implications
- Employment classification questions
- Data privacy or security obligations (GDPR, CCPA, HIPAA)
- Unusual IP ownership or assignment provisions
- Provisions that may vary by jurisdiction in ways that need local counsel input
- Any clause where meaning is genuinely ambiguous after review
`,
      required: true,
    },
    {
      name: 'Standard contract templates',
      purpose:
        'Upload your firm or company\'s standard contract templates or preferred clause language. ' +
        'Claude compares counterparty paper against these and notes where they deviate.',
      kind: 'user-provided',
      guidance:
        'Paste your standard NDA, MSA, or other template agreements — or your preferred clause ' +
        'language for key provisions (limitation of liability, indemnification, IP ownership). ' +
        'Label each template or clause section clearly. Redact client names, deal terms, or ' +
        'any confidential information from completed agreements before uploading.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'contracts-paralegal-scenario-indemnification-review',
      title: 'Flag a one-sided indemnification clause',
      userInput:
        'Review this indemnification clause from a vendor NDA and flag any concerns: ' +
        '"Vendor shall indemnify, defend, and hold harmless Customer from any and all claims, ' +
        'damages, losses, and expenses, including reasonable attorney fees, arising out of or ' +
        'related to Vendor\'s performance under this Agreement or Vendor\'s breach of any ' +
        'representation or warranty. Customer\'s indemnification obligations are limited to ' +
        'claims arising solely from Customer\'s willful misconduct."',
      expectedBehavior:
        'Claude should identify that the clause is asymmetric: the vendor\'s indemnity is broad ' +
        '(all claims arising from performance or breach), while the customer\'s obligation is narrow ' +
        '(limited to willful misconduct only). It should flag the absence of a mutual structure, ' +
        'note the missing indemnification process (notice, control of defense, cooperation), ' +
        'and suggest that the clause be reviewed by an attorney before agreeing. ' +
        'It should not recommend whether to sign the agreement.',
      mustContain: ['indemnification', 'attorney fees', 'willful misconduct'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'contracts-paralegal-scenario-contract-summary',
      title: 'Summarize key terms of a software license agreement',
      userInput:
        'Summarize the key obligations and restrictions in this software license agreement excerpt: ' +
        '"Licensor grants Licensee a non-exclusive, non-transferable, worldwide license to use ' +
        'the Software solely for Licensee\'s internal business purposes. Licensee shall not ' +
        'sublicense, sell, resell, transfer, or otherwise make the Software available to any ' +
        'third party. Licensee shall not reverse-engineer, decompile, or disassemble the Software. ' +
        'The license term is three years from the Effective Date, renewable upon written agreement."',
      expectedBehavior:
        'Claude should produce a structured summary covering: the scope of the license grant ' +
        '(non-exclusive, non-transferable, internal use only), the key restrictions (no sublicense, ' +
        'no transfer, no reverse engineering), and the term (three years, renewable by written agreement). ' +
        'It should flag any notable gaps — for example, whether there is a price-lock on renewal, ' +
        'whether "internal business purposes" is defined, and whether the no-transfer restriction ' +
        'covers change-of-control scenarios.',
      mustContain: ['non-exclusive', 'sublicense', 'reverse'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'contracts-paralegal-scenario-liability-redline',
      title: 'Draft a redline comment on a limitation of liability clause',
      userInput:
        'Draft a redline comment for this limitation of liability clause from a counterparty\'s MSA: ' +
        '"In no event shall either party\'s aggregate liability exceed the amounts paid by Customer ' +
        'in the three months immediately preceding the claim. Neither party shall be liable for ' +
        'any indirect, incidental, consequential, or punitive damages."',
      expectedBehavior:
        'Claude should produce a redline comment that identifies the concern (three-month cap is low ' +
        'for a long-term agreement, especially relative to annual contract value), explains what a ' +
        'typical alternative looks like (e.g., 12 months of fees paid), and suggests alternative ' +
        'language clearly labeled as a proposed redline. It should also note that the consequential ' +
        'damages exclusion appears mutual, which is standard, and flag whether any carve-outs ' +
        '(e.g., indemnification, confidentiality) are missing. The comment should note it is a ' +
        'draft for attorney review.',
      mustContain: ['limitation of liability', 'three months', 'consequential damages'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
