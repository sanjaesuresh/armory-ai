import type { Setup } from '@/lib/setup/types';

export const marketingManagerSkills: Setup[] = [
  // ─── 1. Campaign Brief Writer ─────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-marketing-manager-campaign-brief-writer-v1',
    slug: 'marketing-manager-campaign-brief-writer',
    name: 'Campaign Brief Writer',
    tagline: 'Turn goals, audience notes, and a budget into a structured campaign brief',
    description:
      'Generates a complete campaign brief from your stated goals, target audience, timeline, and budget. ' +
      'The output follows a standard brief format, objective, audience, key messages, channels, success ' +
      'metrics, and budget allocation, so stakeholders and agency partners can act on it immediately.',
    role: 'Marketing Manager',
    industry: 'Marketing',
    tags: ['campaign-planning', 'brief', 'strategy', 'stakeholder-alignment', 'budget'],
    category: 'marketing',
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

    instructionTemplate: `You are a senior marketing strategist helping write a campaign brief for {{brandName}}.

Campaign objective: {{campaignObjective}}

Target audience: {{targetAudience}}

Budget: {{campaignBudget}}

{{#if additionalContext}}
Additional context: {{additionalContext}}
{{/if}}

Write a complete campaign brief with the following sections:
1. Campaign objective (one clear sentence)
2. Target audience (demographics, psychographics, pain points)
3. Key messages (primary message + 2-3 supporting points)
4. Recommended channels (with rationale for each)
5. Success metrics (2-4 KPIs with target values where possible)
6. Rough budget allocation by channel (as percentages)
7. Timeline milestones

Rules:
1. Do not invent audience data or market statistics, use only what is provided; flag gaps.
2. Keep messaging recommendations grounded in the stated objective; do not suggest channels that contradict the budget.
3. If the objective is vague, ask one clarifying question before writing the brief.
4. Never fabricate brand facts, product claims, or benchmark metrics.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand or product name',
        type: 'text',
        required: true,
        helpText: 'The exact brand or product this campaign is for.',
        group: 'Campaign basics',
      },
      {
        key: 'campaignObjective',
        label: 'Campaign objective',
        type: 'multiline',
        required: true,
        helpText: 'What does this campaign need to achieve? Include any targets (e.g., "grow trial signups by 20% in Q3").',
        group: 'Campaign basics',
      },
      {
        key: 'targetAudience',
        label: 'Target audience',
        type: 'multiline',
        required: true,
        helpText: 'Describe who you are trying to reach, role, industry, age range, pain points, or whatever you know.',
        group: 'Campaign basics',
      },
      {
        key: 'campaignBudget',
        label: 'Total campaign budget',
        type: 'text',
        required: true,
        helpText: 'E.g. "$50,000" or "under $10k". This guides channel and production recommendations.',
        group: 'Campaign basics',
      },
      {
        key: 'additionalContext',
        label: 'Additional context (optional)',
        type: 'multiline',
        required: false,
        helpText: 'Any constraints, past campaign learnings, brand guidelines, or competitive context worth knowing.',
        group: 'Campaign basics',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Campaign brief reference card',
        purpose:
          'A fillable reference card with the standard brief structure and example content ' +
          'so every brief follows the same format across campaigns.',
        kind: 'starter',
        content: `# Campaign Brief Reference Card

## Standard sections

### 1. Campaign objective
One sentence: verb + measurable outcome + timeframe.
Example: "Increase free-trial signups by 25% in Q3 2026 via paid and owned channels."

### 2. Target audience
- Primary: [role / demo / firmographic]
- Pain point: [what problem they have that we solve]
- Where they spend time: [channels / communities]

### 3. Key messages
- Primary (one sentence a prospect should remember): ___
- Supporting 1: ___
- Supporting 2: ___

### 4. Channels
| Channel | Rationale | Est. % of budget |
|---------|-----------|-----------------|
|         |           |                 |

### 5. Success metrics (KPIs)
| Metric | Target | Measurement method |
|--------|--------|--------------------|
|        |        |                    |

### 6. Timeline
| Milestone | Date |
|-----------|------|
| Brief approved | |
| Creative ready | |
| Campaign live | |
| Mid-flight review | |
| Campaign end | |

### 7. Budget summary
Total budget: $___
Breakdown by channel: see table in section 4.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'marketing-manager-campaign-brief-writer-scenario-1',
        title: 'Write a brief for a SaaS product launch',
        userInput:
          'Write a campaign brief for launching our new project-management SaaS, TaskFlow. ' +
          'Goal: 500 free-trial signups in the first 30 days. Budget: $30,000. ' +
          'Audience: operations managers at companies with 50-500 employees.',
        expectedBehavior:
          'Claude should produce a structured brief covering all seven sections: objective, audience, ' +
          'key messages, channels, KPIs, budget allocation, and timeline. It should recommend channels ' +
          'suited to the audience (e.g., LinkedIn, search, email) and budget size, and set the 500 ' +
          'trial-signup target as the primary KPI. It must not fabricate benchmark CTR or CPL figures.',
        mustContain: ['TaskFlow', 'trial', 'operations', '30,000'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'marketing-manager-campaign-brief-writer-scenario-2',
        title: 'Write a brief with a tight budget and vague audience',
        userInput:
          'Brief for a brand-awareness push for our organic snack brand, NatureSnap. ' +
          'Budget is $5,000. Audience is "health-conscious people." Run it next month.',
        expectedBehavior:
          'Claude should ask one clarifying question about the audience before writing (the description ' +
          'is too vague to set credible KPIs), or proceed with explicit assumptions labeled as such. ' +
          'It must acknowledge the tight budget and recommend channels realistic at $5k (e.g., organic ' +
          'social, micro-influencer, email). It should not suggest TV or large-scale paid search.',
        mustContain: ['NatureSnap', 'budget', 'audience'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 2. Social Post Generator ─────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-marketing-manager-social-post-generator-v1',
    slug: 'marketing-manager-social-post-generator',
    name: 'Social Post Generator',
    tagline: 'Platform-tailored social posts from a topic or announcement in seconds',
    description:
      'Takes a topic, announcement, or key message and produces ready-to-publish posts for ' +
      'the social platforms you select. Each post respects that platform\'s character limits, ' +
      'tone conventions, and hashtag norms so you never have to reformat manually.',
    role: 'Marketing Manager',
    industry: 'Marketing',
    tags: ['social-media', 'content-creation', 'copywriting', 'linkedin', 'instagram', 'twitter'],
    category: 'marketing',
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

    instructionTemplate: `You write social media posts for {{brandName}}.

Brand voice: {{brandVoice}}

Platforms to write for: {{platforms}}

{{#if callToAction}}
Call to action for every post: {{callToAction}}
{{/if}}

When given a topic or announcement, write one post per platform. Follow these rules per platform:
- LinkedIn: up to 300 words, professional tone, 3-5 relevant hashtags at the end, optional hook line.
- Instagram: up to 150 words, conversational or aspirational tone, 10-15 hashtags in a separate block.
- X (Twitter): 280 characters maximum, punchy, 1-2 hashtags inline, no em-dashes.
- Facebook: up to 200 words, friendly community tone, optional 2-3 hashtags.

Rules:
1. Write only for the platforms listed above.
2. Do not invent product features, prices, statistics, or testimonials.
3. Adapt the hook and CTA for each platform's audience expectations.
4. Never fabricate brand facts, engagement data, or follower counts.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'The brand or product name as it should appear in posts.',
        group: 'Brand',
      },
      {
        key: 'brandVoice',
        label: 'Brand voice',
        type: 'select',
        options: ['Professional', 'Friendly and casual', 'Bold and edgy', 'Inspirational', 'Educational'],
        required: true,
        helpText: 'Pick the voice that best matches how your brand sounds on social.',
        group: 'Brand',
      },
      {
        key: 'platforms',
        label: 'Platforms',
        type: 'multiselect',
        options: ['LinkedIn', 'Instagram', 'X (Twitter)', 'Facebook'],
        required: true,
        helpText: 'Select every platform you need posts for. One post will be written per platform.',
        group: 'Platforms',
      },
      {
        key: 'callToAction',
        label: 'Call to action (optional)',
        type: 'text',
        required: false,
        helpText: 'E.g. "Visit the link in bio" or "Comment below." Leave blank to let Claude choose.',
        group: 'Content',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Social platform cheat sheet',
        purpose:
          'Quick reference for character limits, hashtag norms, and tone conventions per ' +
          'platform so every post is formatted correctly without manual lookups.',
        kind: 'starter',
        content: `# Social Platform Cheat Sheet

## LinkedIn
- Optimal length: 150–300 words (longer posts get "see more" truncated after ~210 chars)
- Hook: first line must stand alone, it's what appears before "see more"
- Hashtags: 3–5 relevant tags at the very end
- Tone: professional, insight-driven, first-person story performs well
- Avoid: excessive exclamation marks, sales-heavy copy, generic motivational quotes

## Instagram
- Caption length: 125 chars visible before "more"; 2,200 char max
- Hashtags: 10–15 in a separate block (line break after caption); niche > generic
- Tone: visual, aspirational, or community-focused
- Include: a question or prompt to drive comments

## X (Twitter)
- Hard limit: 280 characters per post (count carefully)
- Hashtags: 1–2 max, inline within the text
- Tone: direct, witty, or bold, no em-dashes, minimal punctuation
- Threads: lead with the strongest tweet; number each if multi-part

## Facebook
- Optimal length: 40–80 words for standard posts; up to 200 for long-form
- Hashtags: 2–3 max; less is more on Facebook
- Tone: warm, community-friendly, conversational
- CTA: questions and polls perform well; "Comment below" outperforms "Click here"

## Universal rules
- Never open with "We are excited to announce…"
- Lead with the reader benefit or a provocative question
- One idea per post, do not pack multiple messages
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'marketing-manager-social-post-generator-scenario-1',
        title: 'Generate posts for a product feature launch',
        userInput:
          'Topic: we just launched a real-time collaboration feature in our design tool, PixelDrop. ' +
          'Multiple designers can now work on the same canvas simultaneously. Write posts for LinkedIn and Instagram.',
        expectedBehavior:
          'Claude should produce two distinct posts: a LinkedIn post (professional, 150-300 words, ' +
          '3-5 hashtags at the end) and an Instagram caption (conversational, 10-15 hashtags in a ' +
          'separate block). Both should lead with the user benefit (real-time collaboration) rather ' +
          'than a generic "we are excited" opener. Neither should invent performance statistics.',
        mustContain: ['PixelDrop', 'collaboration', 'LinkedIn', 'Instagram'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'marketing-manager-social-post-generator-scenario-2',
        title: 'Generate an X post under the character limit',
        userInput:
          'Write an X (Twitter) post announcing our Black Friday sale: 40% off all annual plans for our ' +
          'email marketing tool, MailBlast. Sale runs Nov 29-Dec 1.',
        expectedBehavior:
          'Claude should produce a single X post at or under 280 characters that includes the discount ' +
          '(40%), the product name (MailBlast), and the date range. It should include 1-2 hashtags and ' +
          'have a direct, punchy tone. The character count should be explicitly under 280.',
        mustContain: ['MailBlast', '40%', 'Nov 29'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 3. SEO Content Audit ─────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-marketing-manager-seo-content-audit-v1',
    slug: 'marketing-manager-seo-content-audit',
    name: 'SEO Content Audit',
    tagline: 'Identify SEO gaps in a page or topic and get a prioritized fix list',
    description:
      'Reviews a page URL, topic, or pasted content against SEO best practices and surfaces ' +
      'specific gaps: missing keyword coverage, weak headings, thin sections, internal-link ' +
      'opportunities, and metadata issues. Outputs a prioritized list of fixes you can hand to a writer or developer.',
    role: 'Marketing Manager',
    industry: 'Marketing',
    tags: ['seo', 'content-audit', 'keyword-research', 'on-page-seo', 'organic-growth'],
    category: 'marketing',
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

    instructionTemplate: `You are an SEO content strategist auditing content for {{websiteName}}.

Primary keyword or topic to audit: {{primaryKeyword}}

Target audience searching for this topic: {{searchAudience}}

Competitor context (optional): {{competitorContext}}

When given a page URL or pasted content, audit it and return:
1. Title tag and meta description assessment (present, length, keyword inclusion)
2. Heading structure (H1/H2/H3 hierarchy, keyword presence, gaps)
3. Keyword coverage gaps (related terms and intent variants missing from the content)
4. Thin or missing sections (topics the searcher expects but the page skips)
5. Internal linking opportunities (types of related pages that should be linked)
6. Readability notes (sentence length, passive voice, jargon density)
7. Prioritized fix list (ranked: High / Medium / Low impact)

Rules:
1. Base all findings on the content provided, do not fabricate keyword volumes, rankings, or competitor data.
2. Flag when you cannot assess something without access to the live page (e.g., page speed, structured data).
3. Each fix in the prioritized list must name the specific element to change, not a generic recommendation.
4. Never fabricate brand facts, search volumes, or ranking positions.`,

    variables: [
      {
        key: 'websiteName',
        label: 'Website or brand name',
        type: 'text',
        required: true,
        helpText: 'The site or brand being audited.',
        group: 'Audit scope',
      },
      {
        key: 'primaryKeyword',
        label: 'Primary keyword or topic',
        type: 'text',
        required: true,
        helpText: 'The main search term or topic this page should rank for.',
        group: 'Audit scope',
      },
      {
        key: 'searchAudience',
        label: 'Target search audience',
        type: 'text',
        required: true,
        helpText: 'Who is searching for this topic? E.g. "small business owners looking to automate invoicing."',
        group: 'Audit scope',
      },
      {
        key: 'competitorContext',
        label: 'Competitor context (optional)',
        type: 'multiline',
        required: false,
        helpText: 'Paste any competitor page titles or topic outlines you want compared against. Leave blank to skip.',
        group: 'Audit scope',
      },
    ],

    knowledgeFiles: [
      {
        name: 'SEO audit checklist',
        purpose:
          'A structured checklist of on-page SEO elements and common content gaps used as ' +
          'the audit framework so every audit covers the same criteria consistently.',
        kind: 'starter',
        content: `# SEO Content Audit Checklist

## On-page metadata
- [ ] Title tag: present, 50–60 chars, primary keyword near the start
- [ ] Meta description: present, 150–160 chars, includes keyword + CTA
- [ ] URL slug: short, includes keyword, no stop words

## Heading structure
- [ ] Exactly one H1 that includes the primary keyword
- [ ] H2s cover the main subtopics a searcher expects
- [ ] H3s used for sub-points under H2s (not for decoration)
- [ ] No heading jumps (H1 → H3 without H2)

## Keyword coverage
- [ ] Primary keyword in H1, first 100 words, and at least 2–3 H2s
- [ ] Semantic variants and related terms present (LSI keywords)
- [ ] Question-based variants covered (who, what, how, why)
- [ ] Missing intent variants noted (informational vs. transactional)

## Content depth
- [ ] Word count appropriate for the topic (informational: 1,000+; transactional: 500+)
- [ ] Thin sections: any section under 100 words that a user would expect more from
- [ ] Missing sections: topics competitors cover that this page skips

## Internal linking
- [ ] Links to relevant pillar/hub pages
- [ ] Links from high-authority pages to this page (check manually)
- [ ] Anchor text is descriptive, not "click here"

## Readability
- [ ] Sentences mostly under 25 words
- [ ] Passive voice under 10% of sentences
- [ ] No unexplained industry jargon in the first 200 words

## Impact classification
- High: directly affects crawlability, indexing, or search intent match
- Medium: improves ranking signal or user experience
- Low: nice-to-have polish
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'marketing-manager-seo-content-audit-scenario-1',
        title: 'Audit a pasted blog post for SEO gaps',
        userInput:
          'Audit this blog post for SEO gaps. Primary keyword: "project management software for remote teams." ' +
          'Here is the content: [H1: Managing Remote Teams in 2024] [Intro: Remote work is becoming common...] ' +
          '[H2: Communication Tips] [H2: Tools to Use] [H2: Conclusion]. The post is about 600 words and has ' +
          'no meta description. Target audience: team leads at tech startups.',
        expectedBehavior:
          'Claude should identify concrete gaps: the H1 does not include the primary keyword, ' +
          'no meta description is present, the heading structure skips "software" intent entirely, ' +
          'and 600 words is thin for a competitive informational query. It should produce a prioritized ' +
          'fix list with at least 3 High-impact items. It must not fabricate keyword volumes.',
        mustContain: ['H1', 'meta description', 'keyword', 'remote'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'marketing-manager-seo-content-audit-scenario-2',
        title: 'Identify missing topic sections vs. search intent',
        userInput:
          'My page targets "how to write a press release." Here are the current H2s: ' +
          '"What is a press release," "Press release format," "Tips for writing." ' +
          'What key sections is my page missing compared to what a searcher expects?',
        expectedBehavior:
          'Claude should list the sections a searcher on this query typically expects that are absent' +
          ', likely: a worked example or template, distribution channels, "when to send" guidance, and ' +
          'common mistakes to avoid. Each missing section should be justified by what the query intent implies. ' +
          'No fabricated search volumes.',
        mustContain: ['press release', 'missing', 'section'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 4. Ad Copy A/B Generator ─────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-marketing-manager-ad-copy-ab-generator-v1',
    slug: 'marketing-manager-ad-copy-ab-generator',
    name: 'Ad Copy A/B Generator',
    tagline: 'Multiple ad-copy variants with distinct angles, ready to split-test',
    description:
      'Produces two to four distinct ad-copy variants for a campaign, each using a different ' +
      'persuasion angle, benefit-led, fear-of-missing-out, social proof, or direct offer. ' +
      'Each variant stays within the character limits of the specified ad format.',
    role: 'Marketing Manager',
    industry: 'Marketing',
    tags: ['ad-copy', 'ab-testing', 'paid-media', 'copywriting', 'conversion'],
    category: 'marketing',
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

    instructionTemplate: `You write paid ad copy for {{brandName}}.

Product or offer: {{productDescription}}

Ad format and platform: {{adFormat}}

Number of variants to generate: {{variantCount}}

{{#if targetAudience}}
Target audience: {{targetAudience}}
{{/if}}

For each variant:
- Label it "Variant A", "Variant B", etc.
- Name the persuasion angle used (e.g., Benefit-led, FOMO, Social proof, Direct offer, Problem-agitate-solve).
- Write the headline(s) and body copy, staying within the character limits for the specified format.
- Add a one-sentence rationale explaining what you are testing vs. the other variants.

Character limits by format (apply strictly):
- Google Search: Headline 30 chars × 3; Description 90 chars × 2
- Meta (Facebook/Instagram) single image: Primary text 125 chars; Headline 27 chars
- LinkedIn single-image ad: Introductory text 150 chars; Headline 70 chars; Description 100 chars

Rules:
1. Each variant must use a meaningfully different angle, do not write the same concept with synonyms.
2. Do not invent testimonials, star ratings, or specific performance claims unless provided.
3. Stay within character limits, count carefully.
4. Never fabricate brand facts, product specifications, or conversion rates.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'The brand or product name as it should appear in ads.',
        group: 'Ad basics',
      },
      {
        key: 'productDescription',
        label: 'Product or offer',
        type: 'multiline',
        required: true,
        helpText: 'Describe what you are advertising: the product, offer, or promotion. Include key differentiators.',
        group: 'Ad basics',
      },
      {
        key: 'adFormat',
        label: 'Ad format and platform',
        type: 'select',
        options: [
          'Google Search',
          'Meta (Facebook/Instagram) single image',
          'LinkedIn single-image ad',
        ],
        required: true,
        helpText: 'Select the ad format to write for. Character limits will be applied automatically.',
        group: 'Ad basics',
      },
      {
        key: 'variantCount',
        label: 'Number of variants',
        type: 'select',
        options: ['2', '3', '4'],
        default: '2',
        required: true,
        helpText: 'How many distinct copy variants do you want to test?',
        group: 'Ad basics',
      },
      {
        key: 'targetAudience',
        label: 'Target audience (optional)',
        type: 'text',
        required: false,
        helpText: 'Who will see this ad? Knowing the audience helps Claude pick relevant angles.',
        group: 'Ad basics',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Ad copy angles and character limits',
        purpose:
          'Reference card for persuasion angles and hard character limits per platform so ' +
          'every variant is both distinct and within spec.',
        kind: 'starter',
        content: `# Ad Copy Reference Card

## Persuasion angles (use one per variant)
- **Benefit-led**, lead with the primary outcome the customer gets. "Get your report in 10 minutes, not 10 days."
- **FOMO**, scarcity or deadline. "Offer ends Friday. Don't miss your 40% discount."
- **Problem-agitate-solve**, name the pain, make it vivid, offer relief. "Still chasing invoices? There's a better way."
- **Social proof**, numbers, authority, or peer validation. "Trusted by 12,000 marketing teams."
- **Direct offer**, price, feature, or promotion front and centre. "Start free. No credit card needed."
- **Curiosity**, open a loop. "Most marketers skip this step. Here's what it costs them."

## Platform character limits (hard limits, count every character including spaces)

### Google Search Ads
- Headline 1 / 2 / 3: 30 characters each
- Description 1 / 2: 90 characters each

### Meta (Facebook/Instagram) Single Image
- Primary text: 125 characters (more text is allowed but truncated in most placements)
- Headline: 27 characters
- Description (below headline): 27 characters

### LinkedIn Single-Image Ad
- Introductory text: 150 characters
- Headline: 70 characters
- Description: 100 characters

## A/B testing hygiene
- Test one variable at a time when possible (angle, headline, CTA).
- Label variants clearly (A, B, C) and record which angle each tests.
- Run until statistical significance, do not call a winner on < 100 conversions per variant.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'marketing-manager-ad-copy-ab-generator-scenario-1',
        title: 'Write 2 Google Search ad variants for a SaaS tool',
        userInput:
          'Write 2 Google Search ad variants for our time-tracking software, Clockly. ' +
          'It auto-tracks time in the background, no timers to start or stop. ' +
          'Target audience: freelancers who forget to log hours.',
        expectedBehavior:
          'Claude should produce Variant A and Variant B, each with 3 headlines (max 30 chars each) ' +
          'and 2 descriptions (max 90 chars each). Each variant must name its persuasion angle and include ' +
          'a one-sentence rationale. The angles must be meaningfully different. No fabricated testimonials.',
        mustContain: ['Clockly', 'Variant A', 'Variant B', 'Headline'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'marketing-manager-ad-copy-ab-generator-scenario-2',
        title: 'Write 3 Meta ad variants for a flash sale',
        userInput:
          'Write 3 Meta (Facebook/Instagram) single-image ad variants for a 48-hour flash sale. ' +
          'Brand: LuxeHome. Product: premium bed linen sets, now 35% off. Audience: homeowners aged 30-50.',
        expectedBehavior:
          'Claude should produce three variants each with primary text (max 125 chars), headline (max 27 chars), ' +
          'and a named persuasion angle. Angles should differ meaningfully, for example, FOMO (48-hour deadline), ' +
          'benefit-led (sleep quality), and direct offer (35% off). No invented star ratings or fabricated reviews.',
        mustContain: ['LuxeHome', '35%', 'Variant A', 'Variant B', 'Variant C'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 5. Email Sequence Builder ────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-marketing-manager-email-sequence-builder-v1',
    slug: 'marketing-manager-email-sequence-builder',
    name: 'Email Sequence Builder',
    tagline: 'Design a multi-step nurture or promo email sequence with subject lines and body copy',
    description:
      'Builds a complete email sequence, from welcome or lead-nurture to promotional close, ' +
      'with subject lines, preview text, and body copy for each email. Each step has a clear ' +
      'goal and a logical handoff to the next, so the sequence reads as a cohesive journey.',
    role: 'Marketing Manager',
    industry: 'Marketing',
    tags: ['email-marketing', 'email-sequence', 'nurture', 'drip-campaign', 'copywriting'],
    category: 'marketing',
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

    instructionTemplate: `You write email sequences for {{brandName}}.

Sequence type: {{sequenceType}}

Number of emails: {{emailCount}}

Goal of the sequence: {{sequenceGoal}}

Target subscriber: {{targetSubscriber}}

{{#if tonePreference}}
Tone preference: {{tonePreference}}
{{/if}}

For each email in the sequence, output:
- Email number and send timing (e.g., "Email 1, Day 0: send immediately")
- Subject line (≤50 chars)
- Preview text (≤90 chars, complements the subject line, do not repeat it)
- Body copy (include a clear single CTA per email)
- Step goal (one sentence: what this email is trying to make the reader do or feel)

Rules:
1. Each email must have a single, clear CTA, do not stack multiple actions.
2. Subject lines must not use ALL CAPS, excessive punctuation, or spam-trigger phrases.
3. Do not fabricate open-rate benchmarks, case studies, or customer names.
4. The sequence arc must be logical: each email builds on the previous one.
5. Never fabricate brand facts, product claims, or success metrics.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'The brand sending these emails.',
        group: 'Sequence basics',
      },
      {
        key: 'sequenceType',
        label: 'Sequence type',
        type: 'select',
        options: ['Welcome / onboarding', 'Lead nurture', 'Promotional / sales', 'Re-engagement', 'Post-purchase'],
        required: true,
        helpText: 'What kind of sequence is this? This determines the arc and tone.',
        group: 'Sequence basics',
      },
      {
        key: 'emailCount',
        label: 'Number of emails',
        type: 'select',
        options: ['3', '4', '5', '6', '7'],
        default: '4',
        required: true,
        helpText: 'How many emails in the sequence?',
        group: 'Sequence basics',
      },
      {
        key: 'sequenceGoal',
        label: 'Goal of the sequence',
        type: 'multiline',
        required: true,
        helpText: 'What should the subscriber do by the end of the sequence? E.g. "Book a demo" or "Complete their first purchase."',
        group: 'Sequence basics',
      },
      {
        key: 'targetSubscriber',
        label: 'Target subscriber',
        type: 'text',
        required: true,
        helpText: 'Who is on this list? E.g. "small business owners who signed up for a free trial."',
        group: 'Sequence basics',
      },
      {
        key: 'tonePreference',
        label: 'Tone preference (optional)',
        type: 'select',
        options: ['Conversational and warm', 'Professional and concise', 'Bold and direct', 'Friendly and educational'],
        required: false,
        helpText: 'Leave blank to let Claude match the sequence type.',
        group: 'Sequence basics',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Email sequence framework',
        purpose:
          'A reference for sequence arc patterns, subject line formulas, and CTA best practices ' +
          'used as the structural guide for every sequence.',
        kind: 'starter',
        content: `# Email Sequence Framework

## Sequence arc by type

### Welcome / onboarding (3–5 emails)
1. Warm welcome + confirm what they signed up for + single next step
2. Deliver the first value moment (tip, resource, or quick win)
3. Show how others use the product / brand story
4. Overcome the most common early objection
5. Soft CTA to upgrade, book a call, or explore a feature

### Lead nurture (4–7 emails)
1. Acknowledge the problem they signalled interest in
2. Education email: why this matters (no pitch)
3. Social proof or case study (light touch)
4. Deepen the problem / raise stakes
5. Introduce the solution with evidence
6. Objection-handling email
7. Direct offer or CTA

### Promotional / sales (3–5 emails)
1. Announce the offer with the deadline
2. Highlight the key benefit (not all features)
3. Social proof / FAQ
4. Last-chance email (24 hours before deadline)
5. Offer extended (optional, use sparingly)

## Subject line formulas
- Question: "Are you making this mistake?"
- Curiosity gap: "The one thing our best customers do differently"
- Benefit-led: "3 hours back in your week, here's how"
- Direct: "Your 40% discount expires tomorrow"
- Personalized: "Your free report is ready, [First Name]"

## CTA rules
- One CTA per email, do not give readers two options
- Button label: verb + outcome ("Book your demo", not "Click here")
- Place CTA above the fold AND at the end for longer emails

## Send cadence guidelines
- Welcome: Email 1 immediately; Email 2 on Day 2; rest every 2–3 days
- Nurture: every 3–5 days
- Promo: Day 0, Day 3, Day 6, Day 7 (last chance)
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'marketing-manager-email-sequence-builder-scenario-1',
        title: 'Build a 4-email welcome sequence for a SaaS trial',
        userInput:
          'Build a 4-email welcome sequence for new free-trial users of TaskFlow, our project-management tool. ' +
          'Goal: get them to complete their first project before day 7. Subscriber: operations managers at SMBs.',
        expectedBehavior:
          'Claude should produce 4 emails, each with send timing (Day 0, Day 2, Day 4, Day 6 or similar), ' +
          'a subject line under 50 chars, preview text under 90 chars, body copy with a single CTA, and a ' +
          'step goal. The arc should progress from welcome → first value → deeper engagement → urgency. ' +
          'No fabricated open rates or testimonials.',
        mustContain: ['TaskFlow', 'Email 1', 'Email 2', 'Subject line', 'CTA'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'marketing-manager-email-sequence-builder-scenario-2',
        title: 'Build a 3-email promo sequence for a flash sale',
        userInput:
          'Write a 3-email promo sequence for LuxeHome\'s Black Friday sale: 35% off all orders, ' +
          'Nov 28–30 only. Subscribers are past customers who haven\'t bought in 6 months.',
        expectedBehavior:
          'Claude should produce 3 emails: launch email (Day 0), reminder (Day 1 or 2), and last-chance ' +
          '(Day 2 or 3 with deadline urgency). Each must include subject line, preview text, body copy, ' +
          'and CTA. Subject lines should convey urgency without ALL CAPS or spam phrases. ' +
          'No fabricated customer testimonials.',
        mustContain: ['LuxeHome', '35%', 'Nov 28', 'last'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 6. Buyer Persona Builder ─────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-marketing-manager-buyer-persona-builder-v1',
    slug: 'marketing-manager-buyer-persona-builder',
    name: 'Buyer Persona Builder',
    tagline: 'Turn customer inputs into a detailed, actionable buyer persona document',
    description:
      'Synthesizes the information you have about your customers, demographics, job role, goals, ' +
      'pain points, buying triggers, and objections, into a structured persona document. ' +
      'The output is ready to share with content, product, and sales teams.',
    role: 'Marketing Manager',
    industry: 'Marketing',
    tags: ['buyer-persona', 'customer-research', 'audience-definition', 'go-to-market', 'targeting'],
    category: 'research',
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

    instructionTemplate: `You are a market research strategist building a buyer persona for {{brandName}}.

Product or service being marketed: {{productOrService}}

Customer data or observations available: {{customerData}}

{{#if additionalInsights}}
Additional insights or hypotheses: {{additionalInsights}}
{{/if}}

Build a detailed buyer persona document with the following sections:
1. Persona name and one-line archetype (give the persona a realistic first name)
2. Demographics and role (age range, job title, industry, company size)
3. Day-in-the-life snapshot (2–3 sentences on a typical workday)
4. Primary goals (3–5 goals this person is trying to achieve at work or in life)
5. Pain points and frustrations (3–5 specific, named problems, not generic)
6. Buying triggers (what event or situation makes them start looking for a solution)
7. Evaluation criteria (what they look for when comparing options)
8. Common objections (2–3 reasons they might not buy)
9. Preferred channels (where they discover products and get information)
10. Messaging guidance (2–3 principles for how to talk to this persona)

Rules:
1. Clearly label any section where you are making an inference rather than using provided data.
2. Do not invent demographic statistics or market-size figures.
3. Keep pain points specific to the product category, avoid generic "too busy" filler.
4. Never fabricate brand facts, survey data, or customer quotes.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand or product name',
        type: 'text',
        required: true,
        helpText: 'The product or brand this persona is for.',
        group: 'Persona inputs',
      },
      {
        key: 'productOrService',
        label: 'Product or service',
        type: 'multiline',
        required: true,
        helpText: 'Describe what you sell and who it is for at a high level.',
        group: 'Persona inputs',
      },
      {
        key: 'customerData',
        label: 'Customer data or observations',
        type: 'multiline',
        required: true,
        helpText: 'Paste any data you have: interview notes, survey responses, CRM demographics, support tickets, or anecdotal observations.',
        group: 'Persona inputs',
      },
      {
        key: 'additionalInsights',
        label: 'Additional insights or hypotheses (optional)',
        type: 'multiline',
        required: false,
        helpText: 'Any hunches, competitor intel, or context that might shape the persona.',
        group: 'Persona inputs',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Buyer persona template',
        purpose:
          'A fillable persona template with all sections pre-structured so outputs are ' +
          'consistent and shareable across teams without reformatting.',
        kind: 'starter',
        content: `# Buyer Persona Template

## Persona overview
**Name:** [First name, make it realistic]
**Archetype:** [One sentence: "The pragmatic ops lead who needs fewer tools, not more."]

## Demographics and role
- Age range: ___
- Job title(s): ___
- Industry: ___
- Company size: ___
- Seniority / decision authority: [Individual contributor / Manager / Director / VP / C-suite]

## Day-in-the-life snapshot
[2–3 sentences on a typical workday, meetings attended, tools used, decisions made.]

## Primary goals
1. ___
2. ___
3. ___

## Pain points and frustrations
1. [Specific pain, name the tool, process, or situation causing it]
2. ___
3. ___

## Buying triggers
[What event or situation makes them start looking for a solution? E.g., "New headcount approved," "Current tool sunsets," "Missed a quarterly target."]

## Evaluation criteria (what they look for when comparing options)
1. ___
2. ___
3. ___

## Common objections
1. "We already have a tool that does X."
2. ___
3. ___

## Preferred channels
- Discovery: [Where they first hear about new tools, LinkedIn, G2, peer recommendation, etc.]
- Research: [Where they go deep, docs, YouTube, trials, analyst reports]
- Community: [Slack groups, subreddits, industry forums]

## Messaging guidance
1. [Lead with ___]
2. [Avoid language like ___]
3. [This persona responds to ___ proof type]
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'marketing-manager-buyer-persona-builder-scenario-1',
        title: 'Build a persona from customer interview notes',
        userInput:
          'Build a buyer persona for TaskFlow, our project-management SaaS. ' +
          'From interviews: most customers are operations managers at 100-300 person companies. ' +
          'They are frustrated that their team uses 3+ different tools and nothing syncs. ' +
          'They evaluate tools by ease of onboarding and Slack integration. ' +
          'They usually start looking after a new project fails due to miscommunication.',
        expectedBehavior:
          'Claude should produce a full persona document with all 10 sections, giving the persona ' +
          'a realistic first name (e.g., "Sarah"). Pain points must be specific to multi-tool fragmentation, ' +
          'not generic. The buying trigger section should reference the "failed project" insight. ' +
          'Any sections with insufficient data should be labeled as inferences.',
        mustContain: ['operations manager', 'Slack', 'onboarding', 'pain'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'marketing-manager-buyer-persona-builder-scenario-2',
        title: 'Flag gaps when customer data is thin',
        userInput:
          'Build a persona for our B2C organic skincare brand, PureGlow. ' +
          'All I know: most buyers are women, they care about ingredients, and they found us on Instagram.',
        expectedBehavior:
          'Claude should build the persona with the available information and explicitly flag ' +
          'every section where it is making inferences due to thin data (e.g., age range, income, ' +
          'company context not applicable). It should not fabricate demographics or buying behavior beyond ' +
          'what was stated. It should suggest what additional data would strengthen the persona.',
        mustContain: ['PureGlow', 'Instagram', 'inference'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 7. Competitor Teardown ───────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-marketing-manager-competitor-teardown-v1',
    slug: 'marketing-manager-competitor-teardown',
    name: 'Competitor Teardown',
    tagline: 'Structure a competitor marketing teardown you can act on in a week',
    description:
      'Takes observations about a competitor, messaging, pricing, channels, content, positioning, ' +
      'and structures them into a teardown with clear takeaways for your own marketing. ' +
      'Separates what they are doing well from what you can exploit.',
    role: 'Marketing Manager',
    industry: 'Marketing',
    tags: ['competitive-analysis', 'positioning', 'market-research', 'strategy', 'go-to-market'],
    category: 'research',
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

    instructionTemplate: `You are a competitive strategy analyst helping {{myBrandName}} analyze a competitor.

My brand's product: {{myProductDescription}}

Competitor being analyzed: {{competitorName}}

Competitor observations to work with: {{competitorObservations}}

{{#if focusArea}}
Focus area for this teardown: {{focusArea}}
{{/if}}

Produce a structured competitor teardown with the following sections:
1. Positioning summary (how the competitor positions themselves in one paragraph)
2. Messaging analysis (primary message, tone, language they use vs. avoid)
3. Audience signals (who their content and channels suggest they are targeting)
4. Channel presence (where they are active and what content types they prioritize)
5. Pricing and offer signals (any public pricing, trial offers, or packaging clues)
6. Strengths (what they are doing well that we should learn from)
7. Weaknesses and gaps (what they are missing or doing poorly)
8. Opportunities for us (3 specific actions we can take based on this analysis)

Rules:
1. Work only with the observations provided, do not invent metrics, rankings, or funding data.
2. Label any inference clearly (e.g., "Based on their ad creative, they appear to target…").
3. Keep "Opportunities for us" specific and actionable, not generic marketing advice.
4. Never fabricate brand facts, revenue figures, or market share data.`,

    variables: [
      {
        key: 'myBrandName',
        label: 'Your brand name',
        type: 'text',
        required: true,
        helpText: 'Your brand, the one doing the analysis.',
        group: 'Brands',
      },
      {
        key: 'myProductDescription',
        label: 'Your product or service',
        type: 'multiline',
        required: true,
        helpText: 'Brief description of what you sell, who it\'s for, and your main differentiator.',
        group: 'Brands',
      },
      {
        key: 'competitorName',
        label: 'Competitor name',
        type: 'text',
        required: true,
        helpText: 'The competitor being torn down.',
        group: 'Brands',
      },
      {
        key: 'competitorObservations',
        label: 'Competitor observations',
        type: 'multiline',
        required: true,
        helpText: 'Paste your notes: homepage copy, ad examples, pricing page text, G2 reviews, LinkedIn posts, etc. The more detail, the better.',
        group: 'Analysis',
      },
      {
        key: 'focusArea',
        label: 'Focus area (optional)',
        type: 'select',
        options: ['Messaging and positioning', 'Content and SEO', 'Paid advertising', 'Pricing', 'Full overview'],
        required: false,
        helpText: 'Narrow the teardown to a specific area, or leave blank for a full overview.',
        group: 'Analysis',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Competitor teardown framework',
        purpose:
          'A structured teardown template and analysis prompts so every competitive review ' +
          'follows the same rigorous format and surfaces actionable takeaways.',
        kind: 'starter',
        content: `# Competitor Teardown Framework

## What to capture before you start
- Homepage hero copy (headline + subheading + CTA)
- About page or mission statement
- Pricing page (tiers, prices, what's included)
- 3–5 recent ads (from Meta Ad Library or LinkedIn Ad Library)
- 3–5 recent blog posts or content pieces
- G2 / Capterra / Trustpilot reviews (especially negative ones)
- LinkedIn and Twitter/X bio and recent posts

## Teardown sections

### 1. Positioning summary
One paragraph: What category do they say they own? Who is the implied customer? What is their hero claim?

### 2. Messaging analysis
- Primary message (the claim they repeat most):
- Tone (formal/casual, fear-based/aspiration-based, feature-led/outcome-led):
- Language they avoid (jargon, price, comparison):

### 3. Audience signals
- Who the content implies: [role / seniority / company size / industry]
- What pain points they address most:

### 4. Channel presence
| Channel | Active? | Content type | Frequency |
|---------|---------|--------------|-----------|
| LinkedIn | | | |
| Meta ads | | | |
| SEO / blog | | | |
| YouTube | | | |

### 5. Pricing and offer signals
- Pricing model (freemium / trial / demo-gated / price on page):
- Anchoring strategy (what the "most popular" plan is):

### 6. Strengths (learn from these)
1.
2.
3.

### 7. Weaknesses and gaps (exploit these)
1.
2.
3.

### 8. Opportunities for us (3 specific, dated actions)
1. [Action], Owner: ___, By: ___
2.
3.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'marketing-manager-competitor-teardown-scenario-1',
        title: 'Teardown a competitor from homepage copy and ads',
        userInput:
          'Analyze our competitor, ProjectBase. Our product is TaskFlow, a simple project-management tool for SMBs. ' +
          'ProjectBase homepage: "Enterprise project management that scales with your team. Trusted by Fortune 500 companies." ' +
          'Their ads: "Finally, a PM tool your IT team will approve." ' +
          'Their G2 reviews complain it\'s too complex for small teams.',
        expectedBehavior:
          'Claude should structure the teardown across all 8 sections. Key findings should include: ' +
          'ProjectBase positions for enterprise (creating an opportunity for TaskFlow to own "simple SMB"), ' +
          'their messaging targets IT buyers not end users, and negative reviews reveal a complexity gap ' +
          'that TaskFlow can exploit. Opportunities must be specific (e.g., "target SMB search terms ' +
          'ProjectBase ignores"), not generic.',
        mustContain: ['ProjectBase', 'enterprise', 'SMB', 'Opportunities'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'marketing-manager-competitor-teardown-scenario-2',
        title: 'Identify content gaps from a competitor blog analysis',
        userInput:
          'Competitive teardown focused on content and SEO. Competitor: ContentPeak. ' +
          'Their recent blog posts cover: "10 LinkedIn post templates," "How to write a content calendar," ' +
          '"B2B content strategy guide." They have no posts about AI tools, video content, or repurposing content.',
        expectedBehavior:
          'Claude should structure a teardown focused on content and SEO (sections 2–4 and 7–8 most relevant). ' +
          'It should identify the gap in AI, video, and repurposing content as a specific opportunity. ' +
          'The "Opportunities for us" section should name at least 2 content topics or series to publish. ' +
          'No fabricated traffic numbers or domain authority scores.',
        mustContain: ['ContentPeak', 'AI', 'content', 'gap'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 8. Landing Page Copy ─────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-marketing-manager-landing-page-copy-v1',
    slug: 'marketing-manager-landing-page-copy',
    name: 'Landing Page Copy',
    tagline: 'Conversion-focused landing page copy from offer details and audience notes',
    description:
      'Writes a complete set of landing page copy sections, hero headline, subheading, value propositions, ' +
      'features/benefits, social proof placeholders, objection-handling, and CTA, structured to guide ' +
      'a visitor from awareness to action.',
    role: 'Marketing Manager',
    industry: 'Marketing',
    tags: ['landing-page', 'conversion', 'copywriting', 'cro', 'sales-page'],
    category: 'marketing',
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

    instructionTemplate: `You write conversion-focused landing page copy for {{brandName}}.

Product or offer on this landing page: {{productOffer}}

Primary call to action: {{primaryCTA}}

Target visitor: {{targetVisitor}}

{{#if mainObjection}}
Main objection to overcome: {{mainObjection}}
{{/if}}

Write the following landing page copy sections in order:
1. Hero headline (≤10 words, outcome-focused, do not start with the brand name)
2. Hero subheading (1–2 sentences expanding the headline; mention who it's for)
3. Three value proposition bullets (benefit + brief "so that" clause each)
4. Features/benefits section (3 features; for each: feature name + "What it means for you:" 1 sentence)
5. Social proof placeholders (write 2 testimonial templates with placeholders for name, title, company, and quote, label them as placeholders)
6. Objection-handling section (address the main objection provided; 2–3 sentences)
7. CTA block (headline + supporting line + button text)

Rules:
1. Do not open the hero headline with the brand name, "Introducing," or "Welcome to."
2. Write the hero headline for the visitor's desired outcome, not the product's features.
3. Testimonials must be clearly marked as placeholders, do not write them as real quotes.
4. Never fabricate brand facts, real customer names, or performance metrics.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'The brand or product this landing page is for.',
        group: 'Page basics',
      },
      {
        key: 'productOffer',
        label: 'Product or offer',
        type: 'multiline',
        required: true,
        helpText: 'What are you selling or promoting? Include the key benefit or differentiator.',
        group: 'Page basics',
      },
      {
        key: 'primaryCTA',
        label: 'Primary call to action',
        type: 'text',
        required: true,
        helpText: 'What do you want the visitor to do? E.g. "Start free trial," "Book a demo," "Buy now."',
        group: 'Page basics',
      },
      {
        key: 'targetVisitor',
        label: 'Target visitor',
        type: 'text',
        required: true,
        helpText: 'Who is landing on this page? E.g. "Freelancers who lose track of billable hours."',
        group: 'Page basics',
      },
      {
        key: 'mainObjection',
        label: 'Main objection to overcome (optional)',
        type: 'text',
        required: false,
        helpText: 'The single biggest reason a visitor might not convert. E.g. "It looks too complex to set up."',
        group: 'Page basics',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Landing page copy structure',
        purpose:
          'A reference for landing page section order, headline formulas, and copy rules ' +
          'so every page follows a proven conversion structure.',
        kind: 'starter',
        content: `# Landing Page Copy Structure

## Section order (follow this sequence)
1. **Hero**, captures attention and states the outcome. Above the fold.
2. **Social proof bar**, logos or a stat (e.g., "Trusted by 5,000+ teams"). Optional but high-trust.
3. **Value propositions**, 3 bullets: what the visitor gets and why it matters.
4. **Features/benefits**, specific capabilities translated into visitor outcomes.
5. **Social proof (testimonials)**, real words from real customers.
6. **Objection handling / FAQ**, address the top 1–3 reasons people don't convert.
7. **CTA block**, repeat the primary CTA; make the next step obvious.

## Hero headline formulas
- **Outcome formula:** "[Do X] without [the thing they hate]." → "Ship faster without the late-night firefights."
- **Before/after:** "Stop [bad thing]. Start [good thing]."
- **Specificity:** "[Number] [unit] to [outcome]." → "14 days to a fully automated reporting stack."
- **Audience-led:** "Built for [specific person] who [specific situation]."

## Value proposition bullet formula
[Feature or benefit], so you can [desired outcome].
Example: "Auto-syncs with Slack, so your team always knows where a project stands."

## Testimonial placeholder format
> "[Quote placeholder, one sentence on the outcome they got, one sentence on how easy it was.]"
>, [Full Name], [Job Title] at [Company Name]

## CTA block formula
Headline: "Ready to [achieve the outcome on the hero]?"
Supporting: "No [common barrier]. [Reinforcement of the primary benefit]."
Button: "[Verb] [outcome]" → "Start tracking" / "Book my demo" / "Get instant access"

## Copy rules
- Lead with outcomes, not features (features live in section 4)
- Active voice throughout, passive voice kills momentum
- One idea per section, do not explain everything at once
- Avoid "powerful," "seamless," "robust," "comprehensive"
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'marketing-manager-landing-page-copy-scenario-1',
        title: 'Write a full landing page for a SaaS time tracker',
        userInput:
          'Write landing page copy for Clockly, an automatic time-tracking tool for freelancers. ' +
          'CTA: "Start free, no card needed." Target visitor: freelancers who forget to log hours. ' +
          'Main objection: "I already have a timer app."',
        expectedBehavior:
          'Claude should produce all 7 sections in order: hero headline (≤10 words, outcome-focused), ' +
          'subheading, 3 value prop bullets, features/benefits (3 features), 2 testimonial placeholders ' +
          'clearly labeled as such, objection-handling addressing "I already have a timer app," and a ' +
          'CTA block. The hero should not open with "Clockly" or "Introducing." No real testimonials invented.',
        mustContain: ['Clockly', 'Hero', 'testimonial placeholder', 'objection'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'marketing-manager-landing-page-copy-scenario-2',
        title: 'Write a hero and value props for a B2B webinar registration page',
        userInput:
          'Write the hero headline, subheading, and 3 value proposition bullets for a webinar registration ' +
          'landing page. Webinar: "How to Cut Content Production Time by 50% Using AI." ' +
          'Hosted by MarketEdge. Audience: content managers at B2B SaaS companies. CTA: Register free.',
        expectedBehavior:
          'Claude should write a hero headline (≤10 words) that leads with the outcome (50% time reduction or ' +
          'faster content production), a subheading naming the audience, and 3 value prop bullets each ' +
          'ending with a "so you can" clause. Headlines must not open with "Introducing" or the brand name. ' +
          'No fabricated speaker credentials or attendance figures.',
        mustContain: ['MarketEdge', 'content', 'AI', 'value'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 9. Press Release Writer ──────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-marketing-manager-press-release-writer-v1',
    slug: 'marketing-manager-press-release-writer',
    name: 'Press Release Writer',
    tagline: 'Turn an announcement into a publication-ready press release',
    description:
      'Converts your announcement details into a structured press release that follows the AP Style ' +
      'format journalists expect: dateline, inverted-pyramid structure, quote block, and boilerplate. ' +
      'Handles product launches, partnerships, funding rounds, and executive hires.',
    role: 'Marketing Manager',
    industry: 'Marketing',
    tags: ['press-release', 'pr', 'media-relations', 'announcements', 'writing'],
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

    instructionTemplate: `You write press releases for {{companyName}}.

Announcement type: {{announcementType}}

Announcement details: {{announcementDetails}}

Spokesperson name and title: {{spokespersonInfo}}

{{#if boilerplate}}
Company boilerplate: {{boilerplate}}
{{/if}}

Write a publication-ready press release with:
1. FOR IMMEDIATE RELEASE header (or "EMBARGO UNTIL [date]" if appropriate)
2. Headline (≤80 chars, newswire style, verb in present tense, no hype words)
3. Subheadline (one sentence expanding on the headline)
4. Dateline (CITY, Month Day, Year, )
5. Lead paragraph (who, what, when, where, why in ≤60 words; the most newsworthy fact first)
6. Second paragraph (context, background, significance)
7. Quote block (one attributed quote from the spokesperson; 2–3 sentences; avoid generic praise)
8. Supporting details paragraph (additional facts, features, or timeline)
9. Boilerplate ("About [Company Name]"), use the provided boilerplate or write a placeholder
10. Contact block (Media contact: Name | Email | Phone, use placeholders if not provided)

Rules:
1. Do not use hype words: revolutionary, game-changing, best-in-class, groundbreaking, disruptive.
2. Every fact must come from the announcement details provided, do not invent figures, dates, or context.
3. The lead paragraph must start with the most newsworthy fact, not background context.
4. Never fabricate brand facts, funding amounts, or customer counts.`,

    variables: [
      {
        key: 'companyName',
        label: 'Company name',
        type: 'text',
        required: true,
        helpText: 'The company issuing the press release.',
        group: 'Company',
      },
      {
        key: 'announcementType',
        label: 'Announcement type',
        type: 'select',
        options: ['Product launch', 'Partnership', 'Funding round', 'Executive hire', 'Award or recognition', 'Event', 'Other'],
        required: true,
        helpText: 'What kind of announcement is this?',
        group: 'Announcement',
      },
      {
        key: 'announcementDetails',
        label: 'Announcement details',
        type: 'multiline',
        required: true,
        helpText: 'Paste all the facts: what is being announced, when it happens, key figures or people involved, and why it matters.',
        group: 'Announcement',
      },
      {
        key: 'spokespersonInfo',
        label: 'Spokesperson name and title',
        type: 'text',
        required: true,
        helpText: 'The person being quoted. E.g. "Jane Smith, CEO of Acme Corp."',
        group: 'Announcement',
      },
      {
        key: 'boilerplate',
        label: 'Company boilerplate (optional)',
        type: 'multiline',
        required: false,
        helpText: 'Your standard "About [Company]" paragraph. If blank, Claude will write a placeholder.',
        group: 'Company',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Press release style guide',
        purpose:
          'AP Style conventions, press release structure rules, and word choices to avoid ' +
          'so every release meets journalistic standards.',
        kind: 'starter',
        content: `# Press Release Style Guide

## Format at a glance
\`\`\`
FOR IMMEDIATE RELEASE

[HEADLINE IN TITLE CASE, MAX 80 CHARS]
[Subheadline: one sentence, sentence case]

CITY, Month Day, Year, [Lead paragraph]

[Second paragraph: context]

[Quote block]

[Supporting details]

About [Company Name]
[Boilerplate]

###

Media Contact:
[Name]
[Title]
[Email]
[Phone]
\`\`\`

## Headline rules
- Present tense verbs: "Launches," "Announces," "Appoints," "Raises"
- No hype: no "Revolutionary," "Groundbreaking," "Game-changing"
- Include the company name or the newsworthy noun
- Under 80 characters

## Lead paragraph (who / what / when / where / why)
- Most newsworthy fact first, do not bury the news in context
- Include company name in full on first reference
- Under 60 words

## Quote rules
- Must be attributed to a named person with their title
- Should add perspective or significance, not repeat the lead
- Avoid generic: "We are thrilled to announce…" → rewrite as a specific claim
- 2–3 sentences maximum

## Words and phrases to avoid
| Avoid | Use instead |
|-------|-------------|
| Revolutionary | New / redesigned / rebuilt |
| Game-changing | Significant / notable |
| Best-in-class | Industry-leading (only with evidence) |
| Disruptive | Use the actual change it makes |
| Excited / thrilled / proud | Use a specific claim or outcome |
| Solutions | Name the actual product or feature |

## Date and dateline format
CITY, Month Day, Year, (AP Style: spell out months when standing alone; abbreviate Jan., Feb., Aug., Sept., Oct., Nov., Dec. in dates)
Example: SAN FRANCISCO, July 7, 2026, 

## End mark
Use ### centered to indicate end of release.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'marketing-manager-press-release-writer-scenario-1',
        title: 'Write a press release for a product launch',
        userInput:
          'Write a press release for TaskFlow launching a new AI-powered task prioritization feature. ' +
          'Launch date: July 15, 2026. It uses AI to score tasks by deadline, stakeholder priority, and ' +
          'team capacity. Available to all paid plans at no extra cost. ' +
          'Spokesperson: Alex Rivera, Chief Product Officer at TaskFlow.',
        expectedBehavior:
          'Claude should produce a full press release with all 10 sections. The headline must be ≤80 chars, ' +
          'use a present-tense verb, and avoid hype words. The lead paragraph must open with the product news, ' +
          'not company background. The quote from Alex Rivera must be specific, not generic. ' +
          'No invented customer counts or revenue figures.',
        mustContain: ['TaskFlow', 'Alex Rivera', 'July 15', 'FOR IMMEDIATE RELEASE'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'marketing-manager-press-release-writer-scenario-2',
        title: 'Write a press release for a funding round',
        userInput:
          'Write a press release for MarketEdge raising a $12M Series A led by Horizon Ventures. ' +
          'The funds will be used to expand the sales team and launch in Europe. ' +
          'Company: MarketEdge (B2B content marketing platform). CEO: Priya Nair.',
        expectedBehavior:
          'Claude should produce a full press release with the funding amount and lead investor in the headline or lead. ' +
          'The structure must follow inverted pyramid: funding news first, then use of funds, then company background. ' +
          'Priya Nair\'s quote should state what the raise enables, not just express excitement. ' +
          'No invented investor names or fund details beyond what was provided.',
        mustContain: ['MarketEdge', '$12M', 'Horizon Ventures', 'Priya Nair'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 10. Content Calendar Planner ────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-marketing-manager-content-calendar-planner-v1',
    slug: 'marketing-manager-content-calendar-planner',
    name: 'Content Calendar Planner',
    tagline: 'Plan a themed, channel-mapped content calendar for any time period',
    description:
      'Generates a structured content calendar with themes, content types, and publish dates for the ' +
      'channels and period you specify. Each entry includes a working title and the intent (awareness, ' +
      'consideration, or conversion) so your team knows what to write and why.',
    role: 'Marketing Manager',
    industry: 'Marketing',
    tags: ['content-calendar', 'content-planning', 'editorial', 'content-strategy', 'scheduling'],
    category: 'content',
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

    instructionTemplate: `You are a content strategist building a content calendar for {{brandName}}.

Industry or niche: {{industryNiche}}

Content channels to plan for: {{channels}}

Planning period: {{planningPeriod}}

Content goal for this period: {{contentGoal}}

{{#if keyThemeOrCampaign}}
Key theme or campaign to center the calendar on: {{keyThemeOrCampaign}}
{{/if}}

Build a content calendar table with the following columns:
| Week / Date | Channel | Content type | Working title | Intent (Awareness / Consideration / Conversion) | Notes |

Rules:
1. Distribute content across the channels provided, do not concentrate everything on one channel.
2. Balance intent stages: aim for roughly 50% awareness, 30% consideration, 20% conversion.
3. Working titles must be specific enough that a writer can start without a brief, not "Blog post about X."
4. Flag any weeks that align with industry events, holidays, or seasonal moments relevant to the niche.
5. Never fabricate brand facts, search volumes, or publishing benchmarks.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'The brand this calendar is for.',
        group: 'Calendar basics',
      },
      {
        key: 'industryNiche',
        label: 'Industry or niche',
        type: 'text',
        required: true,
        helpText: 'What industry or topic area does this content cover? E.g. "B2B SaaS for HR teams" or "organic skincare."',
        group: 'Calendar basics',
      },
      {
        key: 'channels',
        label: 'Content channels',
        type: 'multiselect',
        options: ['Blog / long-form', 'LinkedIn', 'Instagram', 'X (Twitter)', 'Email newsletter', 'YouTube', 'Podcast'],
        required: true,
        helpText: 'Select all channels this calendar should cover.',
        group: 'Calendar basics',
      },
      {
        key: 'planningPeriod',
        label: 'Planning period',
        type: 'select',
        options: ['2 weeks', '4 weeks', '6 weeks', '8 weeks', '3 months'],
        default: '4 weeks',
        required: true,
        helpText: 'How far ahead should the calendar be planned?',
        group: 'Calendar basics',
      },
      {
        key: 'contentGoal',
        label: 'Content goal for this period',
        type: 'multiline',
        required: true,
        helpText: 'What should the content achieve? E.g. "Drive trial signups for our new feature" or "Build authority in the HR tech space."',
        group: 'Calendar basics',
      },
      {
        key: 'keyThemeOrCampaign',
        label: 'Key theme or campaign (optional)',
        type: 'text',
        required: false,
        helpText: 'E.g. "Q3 product launch," "Back to school," or "AI in marketing series." Leave blank for evergreen planning.',
        group: 'Calendar basics',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Content calendar template',
        purpose:
          'A ready-to-fill calendar table and intent-stage guide so every plan follows ' +
          'the same structure and the team can track coverage at a glance.',
        kind: 'starter',
        content: `# Content Calendar Template

## Intent stage guide
| Stage | Goal | Example content types |
|-------|------|----------------------|
| Awareness | Reach new audiences; build brand/topic authority | Blog posts, social educational posts, podcast episodes, YouTube explainers |
| Consideration | Help prospects evaluate; deepen trust | Case studies, comparison guides, webinars, email nurture, how-to content |
| Conversion | Drive a specific action | Product demos, free-trial CTAs, limited offers, testimonial posts |

**Target mix:** 50% Awareness / 30% Consideration / 20% Conversion.

## Content calendar table (copy and fill)

| Week / Date | Channel | Content type | Working title | Intent | Notes |
|-------------|---------|--------------|---------------|--------|-------|
| Week 1 / [date] | | | | | |
| Week 1 / [date] | | | | | |
| Week 2 / [date] | | | | | |
| ... | | | | | |

## Working title guidelines
A strong working title answers: who is this for + what will they learn/do?
- Weak: "Blog post about email marketing"
- Strong: "5 Email Subject Line Formulas That Doubled Our Open Rate (With Templates)"

## Publish frequency guidelines by channel
| Channel | Recommended frequency |
|---------|-----------------------|
| Blog / long-form | 1–2x per week |
| LinkedIn | 3–5x per week |
| Instagram | 4–7x per week |
| X (Twitter) | 1–3x per day |
| Email newsletter | 1–2x per week |
| YouTube | 1x per week |
| Podcast | 1x per week |

## Seasonal moments to check
- Industry conferences (note 2–3 weeks of "pre-event" content)
- National awareness days relevant to your niche
- Quarter-end (good for conversion pushes)
- Product launch dates (build a 4-week pre-launch drumbeat)
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'marketing-manager-content-calendar-planner-scenario-1',
        title: 'Plan a 4-week calendar for a SaaS product launch',
        userInput:
          'Plan a 4-week content calendar for TaskFlow\'s launch of its new AI prioritization feature on July 15. ' +
          'Channels: LinkedIn, Blog, Email newsletter. Goal: build awareness and drive trial signups. ' +
          'Key theme: "Work smarter, not harder with AI."',
        expectedBehavior:
          'Claude should produce a table with entries for all 3 channels across 4 weeks, with working titles ' +
          'specific enough to hand to a writer. Week 1-2 should lean toward awareness (explaining the problem ' +
          'AI solves), Week 3 toward consideration (how the feature works), and Week 4 toward conversion ' +
          '(launch week CTAs). The July 15 launch date should anchor Week 3 or 4.',
        mustContain: ['TaskFlow', 'LinkedIn', 'Blog', 'Email', 'July 15'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'marketing-manager-content-calendar-planner-scenario-2',
        title: 'Plan a 2-week evergreen calendar for a B2B blog',
        userInput:
          'Plan a 2-week content calendar for MarketEdge, a B2B content marketing platform. ' +
          'Channels: Blog and LinkedIn. Goal: build authority in the content marketing space. ' +
          'No specific campaign, evergreen topics.',
        expectedBehavior:
          'Claude should produce a 2-week table with blog and LinkedIn entries. Each blog post should have ' +
          'a specific working title (not "blog post about content marketing"). LinkedIn posts should include ' +
          'a mix of formats (list post, question, tip). The calendar should aim for 50% awareness content. ' +
          'No invented engagement statistics.',
        mustContain: ['MarketEdge', 'Blog', 'LinkedIn', 'Awareness'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },
];
