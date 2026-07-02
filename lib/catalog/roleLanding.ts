/**
 * Per-role marketing copy for the /for/[role] landing pages.
 *
 * Rules:
 *   - No technical jargon: never "system prompt", "config", "template", "AI agent".
 *   - The product noun is "setup".
 *   - Each description contains the role label so the E2E meta-description
 *     check (label.toLowerCase()) always passes.
 *   - Each headline is "Claude setup for <Pluralised Role>" so that the label
 *     ("Marketing Manager") is always a substring of the headline
 *     ("Marketing Managers").
 */

export interface RoleLandingCopy {
  /** h1 text: "Claude setup for <Pluralised Role>" */
  headline: string;
  /** Introductory paragraph shown below the h1. */
  intro: string;
  /** <meta name="description"> — must contain the role label. */
  metaDescription: string;
  /** One concrete example of what the setup does for someone in this role. */
  example: string;
}

const LANDING_COPY: Record<string, RoleLandingCopy> = {
  'marketing-manager': {
    headline: 'Claude setup for Marketing Managers',
    intro:
      'Stop writing briefs from scratch. A Marketing Manager setup gives Claude your brand voice, active channels, and tone — so it drafts campaign copy, social posts, and email subject lines that sound like you wrote them.',
    metaDescription:
      'Get a Claude setup built for Marketing Manager roles. Plan campaigns, write on-brand copy, and manage brand voice — just answer a few questions and export in minutes.',
    example:
      'Ask it to write three Instagram captions for a product launch and it will match your brand voice, not generic AI-speak.',
  },

  'small-business-owner': {
    headline: 'Claude setup for Small Business Owners',
    intro:
      'Handle the pile-up. A Small Business Owner setup teaches Claude about your business so it can draft customer emails, write product descriptions, and think through decisions — without you re-explaining who you are every single time.',
    metaDescription:
      'Get a Claude setup built for Small Business Owner roles. Draft emails, write listings, and handle customer communications — personalized to your business in minutes.',
    example:
      'Tell it a customer left a frustrated review — it will draft a thoughtful, on-brand response you can post immediately.',
  },

  'customer-support': {
    headline: 'Claude setup for Customer Support',
    intro:
      'Resolve tickets faster without sounding like a robot. A Customer Support setup gives Claude your product context and tone so it can draft replies that are genuinely helpful — and hand off to a human when it matters.',
    metaDescription:
      'Get a Claude setup built for Customer Support roles. Draft ready-to-send replies, summarize tickets, and keep customers happy with a setup that knows your product.',
    example:
      'Paste in a frustrated customer message and get a calm, accurate draft response ready to review — no more staring at a blank screen.',
  },

  recruiter: {
    headline: 'Claude setup for Recruiters',
    intro:
      'Move candidates through the pipeline without the paperwork drag. A Recruiter setup gives Claude your company context and hiring standards so it can write job descriptions, draft outreach messages, and summarize candidate notes.',
    metaDescription:
      'Get a Claude setup built for Recruiter roles. Write job descriptions, draft outreach, and summarize candidate notes — all tailored to your team and standards.',
    example:
      'Give it a job title and some team context — it will produce a full job description in the format your team prefers, ready for review.',
  },

  'sales-rep': {
    headline: 'Claude setup for Sales Reps',
    intro:
      'Write better outreach without spending an hour per prospect. A Sales Rep setup gives Claude your product, your pitch, and your style so it can draft cold emails, follow-ups, and proposal summaries that sound like you — not like a form letter.',
    metaDescription:
      'Get a Claude setup built for Sales Rep roles. Draft cold emails, follow-ups, and proposals that close deals — personalized to your product and voice.',
    example:
      "Drop in a prospect's LinkedIn summary and get a cold email that references their actual situation, not a generic opener.",
  },

  operations: {
    headline: 'Claude setup for Operations',
    intro:
      "Document it once, run it forever. An Operations setup gives Claude your team's language and process context so it can write SOPs, meeting summaries, and internal announcements that your team will actually read.",
    metaDescription:
      'Get a Claude setup built for Operations roles. Document workflows, write SOPs, and keep the team aligned with a setup that knows your process language.',
    example:
      'Describe a process verbally and it will turn your notes into a clean, step-by-step SOP formatted for your team wiki.',
  },

  'founder-generalist': {
    headline: 'Claude setup for Founder / Generalists',
    intro:
      'Context-switching is expensive. A Founder / Generalist setup teaches Claude about your company, market, and voice so it can pitch in on strategy notes, investor updates, hiring posts, and customer replies — without you re-explaining who you are each time.',
    metaDescription:
      'Get a Claude setup built for Founder / Generalist roles. Strategy, writing, research, and execution — one setup that knows your company and keeps up with you.',
    example:
      "Write a short brief about a product decision you're wrestling with and get a structured pro/con breakdown with the context that actually matters to your stage.",
  },
};

export function getRoleLandingCopy(roleId: string): RoleLandingCopy | null {
  return LANDING_COPY[roleId] ?? null;
}
