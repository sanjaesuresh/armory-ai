import type { Setup } from '@/lib/setup/types';

export const contentWriterSkills: Setup[] = [
  // ─── 1. Blog Post Draft ───────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-content-writer-blog-post-draft-v1',
    slug: 'content-writer-blog-post-draft',
    name: 'Blog Post Draft',
    tagline: 'Draft a complete blog post from topic and audience notes',
    description:
      'Takes a topic, target reader, desired length, and tone preference, then drafts a ' +
      'complete blog post with a hook opening, structured body sections, and a clear conclusion. ' +
      'Flags any claim that needs a source rather than inventing one.',
    role: 'Content Writer',
    industry: 'Media & Creative',
    tags: ['blog', 'drafting', 'long-form', 'writing', 'content-creation'],
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

    instructionTemplate: `You are a content writer drafting a blog post for {{targetAudience}}.

Topic: {{topic}}

Writing tone: {{writingTone}}

Target length: {{wordCountTarget}}

{{#if includeStructureSuggestions}}
Before writing the body, list the proposed subheadings and their order so the structure is clear. Then proceed directly to the full draft, noting any structural choices you made.
{{/if}}

Draft a complete blog post with:
1. A hook opening, the first 1–2 sentences must earn the reader's attention
2. Context or problem setup explaining why this topic matters to the target reader
3. Body sections separated by descriptive subheadings (use one every 200+ words)
4. A clear conclusion with exactly one call to action

Rules:
1. Do not open with "In today's world," a dictionary definition, or the brand name.
2. Use subheadings to break up any body section longer than 200 words.
3. Flag any statistic or claim that needs a source with [CITE NEEDED], do not invent figures.
4. Never fabricate quotes, statistics, studies, or named examples.`,

    variables: [
      {
        key: 'topic',
        label: 'Blog post topic or working title',
        type: 'text',
        required: true,
        helpText: 'What is the post about? A working title or a one-line description is fine.',
        group: 'Post basics',
      },
      {
        key: 'targetAudience',
        label: 'Target reader',
        type: 'text',
        required: true,
        helpText: 'Who is this post for? E.g. "freelance designers looking for client management tips."',
        group: 'Post basics',
      },
      {
        key: 'wordCountTarget',
        label: 'Target word count',
        type: 'select',
        options: ['400–600 words', '700–1,000 words', '1,100–1,500 words', '1,600–2,500 words'],
        default: '700–1,000 words',
        required: true,
        helpText: 'Choose a range that fits your format. Short posts suit newsletters; longer ones suit SEO and thought leadership.',
        group: 'Post basics',
      },
      {
        key: 'writingTone',
        label: 'Writing tone',
        type: 'select',
        options: ['Conversational', 'Journalistic', 'Authoritative', 'Storytelling'],
        default: 'Conversational',
        required: true,
        helpText:
          'Conversational = approachable, second person; Journalistic = direct and fact-led; ' +
          'Authoritative = confident expert voice; Storytelling = narrative-driven, anecdotes first.',
        group: 'Voice',
      },
      {
        key: 'includeStructureSuggestions',
        label: 'Suggest structure before drafting',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to have Claude list the section structure before writing the body, so you can adjust the angle before the full draft.',
        group: 'Voice',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Blog post drafting reference card',
        purpose:
          'A quick-reference card with blog post structure patterns, hook formulas, and a ' +
          'pre-publish checklist so every draft starts with clear scaffolding and ends fully checked.',
        kind: 'starter',
        content: `# Blog Post Drafting Reference Card

## Opening hook formulas (pick one per post)
- **Bold claim:** "Most editorial calendars fail within 60 days, and the fix is not more planning."
- **Vivid scene:** "It was 11 p.m. when the client messaged asking for the 'final' version. Again."
- **Provocative question:** "What if the biggest drag on your writing time isn't procrastination?"
- **Surprising stat:** "Readers decide whether to keep reading in the first two sentences." [CITE NEEDED]
- **Counter-intuition:** "The best SEO blog posts are written for people who will never search for them."

## Standard blog post structures

### Problem / Solution (most versatile)
Hook > Problem statement > Why it matters now > Solution overview > Evidence or steps > Conclusion + CTA

### How-to / Tutorial
Hook > Who this is for > Prerequisites > Steps (numbered, one action per step) > Common mistakes > Conclusion + next resource

### Listicle
Hook > Brief intro (why this list matters) > Items 1–N (each with a subheading and 1–3 supporting sentences) > Conclusion

### Opinion / Thought leadership
Hook > Position statement > Counter-argument acknowledged > Evidence for your position > Practical implication > Conclusion

## Subheading rules
- Every subheading should make sense to a reader who only skims headings.
- Use a subheading before any block of text longer than 200 words.
- Write subheadings as phrases or short sentences, not single nouns.

## Pre-publish checklist
- [ ] Does the headline match what the post actually delivers?
- [ ] Does the first sentence stand alone as a hook?
- [ ] Is every [CITE NEEDED] flag resolved before publishing?
- [ ] Is there exactly one CTA in the conclusion?
- [ ] Does the word count fall within the target range?
- [ ] Read the post aloud once, if you stumble, the reader will too.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'content-writer-blog-post-draft-scenario-1',
        title: 'Draft a conversational blog post on freelance rate-setting',
        userInput:
          'Draft a 700–1,000 word blog post for freelance copywriters who feel uncomfortable ' +
          'raising their rates. Topic: how to raise your freelance rates without losing clients. ' +
          'Tone: conversational. I want a hook that opens with a relatable scenario, ' +
          'three practical steps in the body, and a conclusion that encourages action.',
        expectedBehavior:
          'Claude should produce a complete draft, hook, context setup, three numbered or ' +
          'subheaded steps, and a conclusion with a single CTA. The hook should be a relatable ' +
          'scene or situation, not a definition or "In today\'s world." Each step should be ' +
          'concrete and actionable for the stated audience of freelance copywriters. Any statistic ' +
          'should be flagged [CITE NEEDED]. Word count should fall in the 700–1,000 range.',
        mustContain: ['freelance', 'rates', 'clients', 'copywriter'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'content-writer-blog-post-draft-scenario-2',
        title: 'Draft a journalistic post on remote onboarding practices',
        userInput:
          'Draft a 1,100–1,500 word blog post for HR managers at distributed tech companies. ' +
          'Topic: why most remote onboarding programs fail in the first two weeks, and what to ' +
          'do instead. Tone: journalistic. Structure should follow a problem/solution pattern.',
        expectedBehavior:
          'Claude should produce a journalistic-toned draft with a direct, fact-led opening. ' +
          'The problem section should name specific failure points relevant to remote onboarding ' +
          '(not generic management issues). The solution section should offer concrete practices. ' +
          'The post should use the problem/solution structure, hook, problem, why it matters, ' +
          'solution, conclusion with CTA. Any statistics should carry [CITE NEEDED]. ' +
          'Word count should be in the 1,100–1,500 range.',
        mustContain: ['remote onboarding', 'HR', 'two weeks', 'tech companies'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 2. Headline Generator ────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-content-writer-headline-generator-v1',
    slug: 'content-writer-headline-generator',
    name: 'Headline Generator',
    tagline: 'Generate multiple headline options with angles and a top recommendation',
    description:
      'Produces a set of headline options for a content piece, each labeled with the persuasion ' +
      'angle it uses, benefit-led, question, how-to, data-driven, or curiosity gap. ' +
      'Ends with a starred recommendation and a one-sentence rationale so you can decide quickly.',
    role: 'Content Writer',
    industry: 'Media & Creative',
    tags: ['headlines', 'copywriting', 'content-creation', 'seo', 'click-through'],
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

    instructionTemplate: `You write headlines for {{contentType}} content.

Topic: {{contentTopic}}

Target reader: {{targetReader}}

Number of headlines to generate: {{headlineCount}}

{{#if headlineAngle}}
Preferred angle: {{headlineAngle}}. Vary execution within this angle where possible, rather than repeating the same formula.
{{/if}}

For each headline:
- Number it (1, 2, 3…)
- Label the angle used (e.g., Benefit-led, Question, How-to, Curiosity gap, Data-driven, Counter-intuition)
- Write the headline in title case

After the numbered list, add:
★ Recommended: [headline number and text], [one sentence explaining why this one is the strongest pick for the stated reader and content type]

Rules:
1. Every headline must be deliverable by the actual content, no clickbait that the body cannot support.
2. Avoid "Ultimate Guide," "Game-changer," "Revolutionary," and vague superlatives.
3. Do not invent statistics or data points in a headline unless the user supplies real figures.
4. Never fabricate expert names, case study results, or performance claims.`,

    variables: [
      {
        key: 'contentTopic',
        label: 'Content topic',
        type: 'text',
        required: true,
        helpText: 'The subject of the piece you need headlines for.',
        group: 'Content',
      },
      {
        key: 'contentType',
        label: 'Content type',
        type: 'select',
        options: ['Blog post', 'Newsletter', 'White paper', 'Case study', 'Landing page', 'Email subject line'],
        required: true,
        helpText: 'The format shapes the optimal headline length and style.',
        group: 'Content',
      },
      {
        key: 'targetReader',
        label: 'Target reader',
        type: 'text',
        required: true,
        helpText: 'Who will read this piece? E.g. "startup founders who have never raised funding."',
        group: 'Content',
      },
      {
        key: 'headlineCount',
        label: 'Number of headlines',
        type: 'select',
        options: ['5', '10', '15'],
        default: '10',
        required: true,
        helpText: '5 is a tight shortlist; 10 gives variety for testing; 15 works when you want to explore multiple angles.',
        group: 'Output',
      },
      {
        key: 'headlineAngle',
        label: 'Preferred angle (optional)',
        type: 'select',
        options: ['Benefit-led', 'Question', 'How-to', 'Data-driven', 'Mixed angles'],
        required: false,
        helpText: 'Leave blank to get a mix of angles. Choose one to concentrate on a specific style.',
        group: 'Output',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Headline angles and formulas reference card',
        purpose:
          'A reference card of proven headline angles with example formulas so every generation ' +
          'session draws from a consistent, battle-tested set of patterns.',
        kind: 'starter',
        content: `# Headline Angles and Formulas Reference Card

## Core angles

### Benefit-led
Lead with the concrete outcome the reader gets.
- Formula: [Outcome] + [Timeframe or condition]
- Example: "How to Cut Your Editorial Review Time in Half"

### Question
Open a loop the reader wants to close.
- Formula: [Provocative question the target reader asks themselves]
- Example: "Are You Setting Your Freelance Rates Too Low?"

### How-to
Promise a skill or process.
- Formula: How to [achieve X] [without / even if / when]
- Example: "How to Write Case Studies That Close Deals, Even Without a Designer"

### Data-driven
Lead with a specific, surprising number. Only use real, citable figures.
- Formula: [Number] + [Surprising finding or claim]
- Example: "3 in 5 Blog Posts Never Get a Second Reader, Here's Why"

### Curiosity gap
Hint at something the reader does not know but wants to.
- Formula: [Context] + teased unknown
- Example: "The One Structural Change That Doubled a Newsletter's Click Rate"

### Counter-intuition
Contradict a common assumption.
- Formula: Why [common belief] is [wrong / costing you / misunderstood]
- Example: "Why Writing More Often Makes Your Blog Worse"

## Headline quality checklist
- [ ] Can the content actually deliver on this headline?
- [ ] Is it specific enough that a reader knows what they will get?
- [ ] Is it free of vague superlatives ("best," "ultimate," "game-changer")?
- [ ] Is it the right length for the content type? (Blog: 6–12 words; Email subject: ≤50 chars)
- [ ] Would the target reader feel this was written for them?
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'content-writer-headline-generator-scenario-1',
        title: 'Generate 10 headlines for a blog post on content repurposing',
        userInput:
          'Generate 10 headlines for a blog post about how to repurpose one long-form piece of ' +
          'content into five social posts, a newsletter, and a short video script. ' +
          'Target reader: content marketers at B2B SaaS companies. Mixed angles please.',
        expectedBehavior:
          'Claude should produce 10 numbered headlines, each with a labeled angle. The headlines ' +
          'should cover a variety of angles (benefit-led, how-to, question, curiosity gap, etc.). ' +
          'They should be specific to the stated topic, repurposing long-form into social, newsletter, ' +
          'and video, not generic content marketing advice. The recommendation section should name ' +
          'a specific headline and give a one-sentence rationale. No fabricated statistics.',
        mustContain: ['repurpos', 'social', 'newsletter', 'content marketer'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'content-writer-headline-generator-scenario-2',
        title: 'Generate 5 benefit-led headlines for an email subject line',
        userInput:
          'Generate 5 benefit-led email subject line headlines for a newsletter issue about ' +
          'overcoming writer\'s block. Target reader: freelance copywriters. ' +
          'Keep each headline under 50 characters.',
        expectedBehavior:
          'Claude should produce exactly 5 subject lines, all labeled Benefit-led, each under ' +
          '50 characters, each specific to the freelance copywriter audience. Subject lines should ' +
          'focus on the outcome (getting unstuck, writing faster, finishing the brief) rather than ' +
          'generic motivational language. The recommended pick should be clear and justified. ' +
          'No invented statistics.',
        mustContain: ['writer\'s block', 'freelance', 'subject line', '50 characters'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 3. Outline Builder ───────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-content-writer-outline-builder-v1',
    slug: 'content-writer-outline-builder',
    name: 'Outline Builder',
    tagline: 'Build a detailed content outline with section goals and per-section word counts',
    description:
      'Produces a structured content outline with a working headline, H2 and H3 sections, ' +
      'estimated word counts per section, and optional research prompts. ' +
      'Each section has a clear purpose so a writer can start any section without rereading the brief.',
    role: 'Content Writer',
    industry: 'Media & Creative',
    tags: ['outline', 'content-strategy', 'structure', 'planning', 'long-form'],
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

    instructionTemplate: `You are a content strategist building an outline for a {{contentType}} about {{topic}}.

Target audience: {{targetAudience}}

Target word count: {{wordCountGoal}}

{{#if researchGuidance}}
After each H2 section in the outline, add a "Research prompts:" note with 1–2 questions or source types to investigate before writing that section.
{{/if}}

Produce a detailed content outline with:
1. A working headline and a one-sentence purpose statement (what the reader should know, feel, or do after reading)
2. All major H2 sections with descriptive headings (not generic section names like "Introduction")
3. H3 sub-points under each H2 that name the specific ideas to cover
4. An estimated word count per H2 section that sums close to the overall target
5. A conclusion section that names the core takeaway and the call-to-action type

Rules:
1. Each H2 must have a distinct purpose, do not cover the same idea in two sections.
2. Estimated word counts must add up to within 10% of the stated target.
3. Flag any section that will need external research or data with [RESEARCH NEEDED].
4. Never fabricate supporting statistics or claim specific figures in the outline.`,

    variables: [
      {
        key: 'topic',
        label: 'Content topic',
        type: 'text',
        required: true,
        helpText: 'What is this content piece about? A working title or a clear topic description.',
        group: 'Content basics',
      },
      {
        key: 'contentType',
        label: 'Content type',
        type: 'select',
        options: ['Blog post', 'White paper', 'eBook', 'Case study', 'Newsletter', 'Video script'],
        required: true,
        helpText: 'The content type shapes the structure, a white paper needs an executive summary; a newsletter does not.',
        group: 'Content basics',
      },
      {
        key: 'targetAudience',
        label: 'Target audience',
        type: 'text',
        required: true,
        helpText: 'Who is this content for? Be specific, role, industry, and the main thing they want to learn or do.',
        group: 'Content basics',
      },
      {
        key: 'wordCountGoal',
        label: 'Target word count',
        type: 'select',
        options: ['Under 800 words', '800–1,500 words', '1,500–3,000 words', '3,000–5,000 words', '5,000+ words'],
        required: true,
        helpText: 'The outline\'s per-section estimates will add up to this range.',
        group: 'Content basics',
      },
      {
        key: 'researchGuidance',
        label: 'Add research prompts per section',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to add 1–2 research questions under each H2 so a writer or researcher knows what to find before drafting that section.',
        group: 'Output options',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Content outline reference card',
        purpose:
          'Standard outline structures for common content types and a set of section-purpose ' +
          'prompts so every outline is specific enough for a writer to start any section without re-reading the brief.',
        kind: 'starter',
        content: `# Content Outline Reference Card

## Standard structures by content type

### Blog post (800–1,500 words)
1. [H2] Hook + problem setup (~150 words)
2. [H2] Core argument or key point 1 (~250 words)
3. [H2] Core argument or key point 2 (~250 words)
4. [H2] Core argument or key point 3 (~250 words)
5. [H2] Practical takeaway or next step (~150 words)
6. [H2] Conclusion + CTA (~100 words)

### White paper (3,000–5,000 words)
1. Executive summary (~300 words, written last, listed first)
2. [H2] Problem context and scope (~500 words)
3. [H2] Research or data overview (~600 words) [RESEARCH NEEDED]
4. [H2] Analysis / main argument (~800 words)
5. [H2] Recommendations (3–5 specific actions) (~600 words)
6. [H2] Conclusion + CTA (~200 words)
7. References

### eBook (5,000+ words)
- Chapter list up front
- Each chapter: intro > key point > evidence > practical takeaway > transition

### Case study (600–1,200 words)
1. Client overview (~100 words)
2. The challenge (~200 words)
3. The solution (~250 words)
4. Results (~200 words) [RESEARCH NEEDED, confirm figures with client]
5. Key takeaway + CTA (~100 words)

## Section-purpose prompt (ask this for every H2)
"What does the reader know after reading this section that they did not know before?"
If you cannot answer in one sentence, the section is too vague or too broad.

## Word count distribution guide
- No single section should exceed 40% of the total word count.
- Introduction and conclusion together: 15–20% of total.
- The most evidence-heavy section gets the largest word count.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'content-writer-outline-builder-scenario-1',
        title: 'Build an outline for a white paper on AI adoption in HR',
        userInput:
          'Build a detailed outline for a white paper on AI adoption in HR departments at ' +
          'mid-size companies (200–1,000 employees). Target audience: HR directors and CHRO-level leaders. ' +
          'Target word count: 3,000–5,000 words. Add research prompts for each section.',
        expectedBehavior:
          'Claude should produce a white paper outline with the standard structure: executive summary, ' +
          'problem context, research/data section, analysis, recommendations, and conclusion. ' +
          'Each H2 should have a descriptive heading specific to AI adoption in HR (not generic). ' +
          'Research prompts should appear under each H2. Per-section word counts should total ' +
          '3,000–5,000. Sections that need external data should be flagged [RESEARCH NEEDED]. ' +
          'No fabricated statistics or adoption figures.',
        mustContain: ['HR', 'AI adoption', 'executive summary', 'mid-size'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'content-writer-outline-builder-scenario-2',
        title: 'Build an outline for a blog post on onboarding new freelance clients',
        userInput:
          'Build a detailed outline for a blog post aimed at experienced freelancers who want to ' +
          'improve how they onboard new clients. Topic: the first 7 days of a new client engagement. ' +
          'Target word count: 800–1,500 words. No research prompts needed.',
        expectedBehavior:
          'Claude should produce a blog post outline with a working headline, descriptive H2 and H3 ' +
          'headings, and per-section word count estimates that total 800–1,500 words. ' +
          'The sections should map to the first 7 days of client onboarding, not generic freelancing advice. ' +
          'The purpose statement should name what the reader learns. No fabricated data.',
        mustContain: ['freelancer', 'onboard', '7 days', 'client'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 4. SEO Meta Writer ───────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-content-writer-seo-meta-writer-v1',
    slug: 'content-writer-seo-meta-writer',
    name: 'SEO Meta Writer',
    tagline: 'Write title tags and meta descriptions within character limits, with intent alignment',
    description:
      'Produces an SEO title tag and meta description for a page or post, both within hard ' +
      'character limits and aligned to the specified search intent. ' +
      'Outputs exact character counts so you know immediately if they fit.',
    role: 'Content Writer',
    industry: 'Media & Creative',
    tags: ['seo', 'meta-description', 'title-tag', 'on-page-seo', 'search-intent'],
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

    instructionTemplate: `You write SEO metadata for a {{pageType}}.

Page topic: {{pageTopic}}

Primary keyword: {{primaryKeyword}}

Search intent: {{searchIntent}}

Write the following for this page:
1. **Title tag**, 50–60 characters, includes the primary keyword near the start, matches the search intent, ends with the brand name if one is provided
2. **Meta description**, 145–160 characters, includes the primary keyword, states a clear benefit, ends with a soft call to action
3. **Intent alignment note**, one sentence explaining how both meta elements are aligned to the stated search intent

After each element, show the exact character count in parentheses: (Title tag: XX chars) / (Meta description: XXX chars).

Rules:
1. Stay within the character limits, count every character including spaces and punctuation.
2. Do not use ALL CAPS, excessive exclamation marks, or keyword stuffing.
3. Never promise in the meta description something the page cannot deliver.
4. Never fabricate brand names, product claims, or search ranking positions.`,

    variables: [
      {
        key: 'pageTopic',
        label: 'Page topic',
        type: 'text',
        required: true,
        helpText: 'What is this page or post about? A one-line description is enough.',
        group: 'Page details',
      },
      {
        key: 'primaryKeyword',
        label: 'Primary keyword',
        type: 'text',
        required: true,
        helpText: 'The main search term you want this page to rank for. Use the exact phrasing you are targeting.',
        group: 'Page details',
      },
      {
        key: 'pageType',
        label: 'Page type',
        type: 'select',
        options: ['Blog post', 'Product page', 'Landing page', 'Category page', 'About page'],
        required: true,
        helpText: 'The page type affects the expected meta description tone and CTA style.',
        group: 'Page details',
      },
      {
        key: 'searchIntent',
        label: 'Search intent',
        type: 'select',
        options: ['Informational', 'Transactional', 'Navigational', 'Commercial investigation'],
        required: true,
        helpText:
          'Informational = the searcher wants to learn; Transactional = ready to buy; ' +
          'Navigational = looking for a specific site; Commercial investigation = comparing options before buying.',
        group: 'SEO context',
      },
    ],

    knowledgeFiles: [
      {
        name: 'SEO metadata reference card',
        purpose:
          'Hard character limits, intent-aligned phrasing guidance, and common meta-writing mistakes ' +
          'so every title tag and meta description passes both the technical and intent-match tests.',
        kind: 'starter',
        content: `# SEO Metadata Reference Card

## Character limits (hard limits, every character counts, including spaces)
| Element | Minimum | Target | Maximum |
|---------|---------|--------|---------|
| Title tag | 40 chars | 50–60 chars | 60 chars |
| Meta description | 120 chars | 145–160 chars | 160 chars |

Note: Google truncates titles at ~60 chars and descriptions at ~160 chars in standard SERPs.

## Title tag formulas by intent
- **Informational:** [Primary keyword], [What the reader learns] | [Brand]
  - "Content Repurposing Guide: Turn One Post Into 10 | ContentBase"
- **Transactional:** [Primary keyword], [Offer or differentiator] | [Brand]
  - "Buy Ergonomic Office Chairs, Free Delivery Over $100 | SitWell"
- **Commercial investigation:** [Primary keyword] vs. [Alternatives] | [Brand]
  - "Best Project Management Software for Freelancers 2026 | TaskFlow"
- **Navigational:** [Brand], [Primary keyword or page label]
  - "Armory, Import Your Existing Claude Setup"

## Meta description structure
[Primary keyword or synonym] + [core benefit] + [secondary detail] + [soft CTA]
- Informational: "Learn how to repurpose a single blog post into 10 pieces of content, without starting from scratch. Step-by-step guide inside."
- Transactional: "Shop ergonomic office chairs with lumbar support and free next-day delivery. Find your fit with our 30-day trial."

## Common meta-writing mistakes
- Starting the title tag with the brand name (keyword should come first)
- Repeating the exact title tag text as the meta description
- Using ALL CAPS or excessive exclamation marks (perceived as spam)
- Keyword stuffing (e.g., "cheap flights cheap flights buy cheap flights")
- Over-promising: saying "guaranteed" or "best" without evidence
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'content-writer-seo-meta-writer-scenario-1',
        title: 'Write meta tags for an informational blog post on email list growth',
        userInput:
          'Write the title tag and meta description for a blog post about how to grow an email ' +
          'list from zero to 1,000 subscribers. Primary keyword: "how to grow an email list." ' +
          'Page type: blog post. Search intent: informational.',
        expectedBehavior:
          'Claude should produce a title tag (50–60 chars) containing the primary keyword near ' +
          'the start and a meta description (145–160 chars) with the keyword, a clear benefit, ' +
          'and a soft informational CTA (e.g., "Read the step-by-step guide"). Both should ' +
          'match informational intent, no transactional language like "buy now." ' +
          'Exact character counts must be shown. No fabricated brand names.',
        mustContain: ['email list', 'informational', 'title tag', 'meta description'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'content-writer-seo-meta-writer-scenario-2',
        title: 'Write meta tags for a transactional landing page for a SaaS product',
        userInput:
          'Write the title tag and meta description for a landing page for a time-tracking SaaS, ' +
          'Clockly. Primary keyword: "time tracking software for freelancers." ' +
          'Page type: landing page. Search intent: transactional.',
        expectedBehavior:
          'Claude should produce a title tag (50–60 chars) that puts the primary keyword first ' +
          'and includes the brand name Clockly at or near the end. The meta description (145–160 chars) ' +
          'should have transactional language (try, start, sign up) and a clear benefit for freelancers. ' +
          'Both must stay within character limits with counts shown. ' +
          'No fabricated conversion rates or user counts.',
        mustContain: ['Clockly', 'time tracking software', 'freelancer', 'transactional'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 5. Newsletter Draft ──────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-content-writer-newsletter-draft-v1',
    slug: 'content-writer-newsletter-draft',
    name: 'Newsletter Draft',
    tagline: 'Draft a complete newsletter issue with subject line, hook, body, and sign-off',
    description:
      'Produces a full newsletter issue, subject line, preview text, opening hook, body, ' +
      'and sign-off, for a single focused topic. Each section follows the conventions that ' +
      'work for mobile readers: short paragraphs, one topic, one CTA.',
    role: 'Content Writer',
    industry: 'Media & Creative',
    tags: ['newsletter', 'email-writing', 'content-creation', 'audience-building', 'writing'],
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

    instructionTemplate: `You are drafting a newsletter issue for {{publicationName}}.

Reader persona: {{readerPersona}}

Issue theme: {{issueTheme}}

Tone: {{newsletterTone}}

{{#if hasCTA}}
End the newsletter with a clear call to action, a link, question, or next step the reader can take immediately.
{{/if}}

Structure the draft as follows:
1. **Subject line** (≤50 characters, must not open with the publication name or the word "Newsletter")
2. **Preview text** (≤90 characters, complements, does not repeat, the subject line)
3. **Opening hook** (1–2 sentences that earn the reader's attention without summarizing the whole issue)
4. **Body** (cover the issue theme; one core topic only; paragraphs of ≤4 lines for mobile readability)
5. **Sign-off** (brief, in the publication's established voice)

Rules:
1. One subject line, one core topic, do not pack multiple stories into a single issue draft.
2. Keep every paragraph to 4 lines or fewer; readers scan newsletters on phones.
3. Do not invent statistics, named sources, quotes, or external data.
4. Never fabricate subscriber counts, open rates, or publication claims.`,

    variables: [
      {
        key: 'publicationName',
        label: 'Newsletter or publication name',
        type: 'text',
        required: true,
        helpText: 'The name of the newsletter or publication this issue belongs to.',
        group: 'Newsletter basics',
      },
      {
        key: 'issueTheme',
        label: 'Issue theme or main topic',
        type: 'text',
        required: true,
        helpText: 'The single topic or angle for this issue. One topic produces a more readable issue than multiple.',
        group: 'Newsletter basics',
      },
      {
        key: 'readerPersona',
        label: 'Reader persona',
        type: 'text',
        required: true,
        helpText: 'Who subscribes to this newsletter? E.g. "independent designers who want to grow a freelance practice."',
        group: 'Newsletter basics',
      },
      {
        key: 'newsletterTone',
        label: 'Tone',
        type: 'select',
        options: ['Conversational and warm', 'Expert and analytical', 'Curated and brief', 'Opinionated'],
        default: 'Conversational and warm',
        required: true,
        helpText:
          'Conversational = friendly, second person; Expert = insight-led, data-referenced; ' +
          'Curated = short and link-forward; Opinionated = takes a clear stance, no hedging.',
        group: 'Voice',
      },
      {
        key: 'hasCTA',
        label: 'Include a call to action',
        type: 'boolean',
        default: true,
        required: false,
        helpText: 'Turn on to end the issue with a link, prompt, or next step. Turn off for purely editorial issues.',
        group: 'Voice',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Newsletter drafting reference card',
        purpose:
          'Subject line formulas, opening hook patterns, body formatting rules, and a pre-send ' +
          'checklist so every issue is readable on mobile and opens with something worth reading.',
        kind: 'starter',
        content: `# Newsletter Drafting Reference Card

## Subject line formulas (≤50 chars)
- Question: "Is your content calendar already broken?"
- Curiosity gap: "The one thing most writers skip"
- Benefit-led: "3 edits that tighten any draft in 10 min"
- Direct: "This week: a better way to outline"
- Counter-intuition: "Why publishing less often works"

Avoid: starting with the publication name, using ALL CAPS, or making a promise the issue cannot keep.

## Preview text rules (≤90 chars)
- Complement the subject line, do not repeat it.
- Tease the next detail or add a second hook.
- Write it as a continuation, not a summary.
- Example: Subject: "The one thing most writers skip" → Preview: "It takes under two minutes and it fixes most structural problems."

## Opening hook patterns
- **Anecdote:** A specific moment or scene, not a general statement.
- **Surprising claim:** A counter-intuitive point the rest of the issue will explain.
- **Direct question:** One question the reader will want answered before they stop reading.
- **Vivid observation:** A concrete detail that sets a scene.

Avoid: "Welcome to another issue of…" / "This week we're covering…" / "I hope you're having a great week."

## Body formatting rules
- Max 4 lines per paragraph, newsletters are read on phones.
- One topic per issue, do not stack multiple unrelated stories.
- Short sentences: aim for ≤25 words. Vary length for rhythm.
- Bold sparingly: highlight key terms or takeaways, not decoration.

## Sign-off patterns
- Warm close: "Until next week, [Name]"
- Editorial sign-off: "As always, [Name]"
- CTA close: "Hit reply if this resonated. I read every response."

## Pre-send checklist
- [ ] Subject line ≤50 chars and opens with something other than the pub name?
- [ ] Preview text ≤90 chars and does not repeat the subject line?
- [ ] Opening hook earns attention in 1–2 sentences?
- [ ] No paragraph longer than 4 lines?
- [ ] Single topic? No mid-issue topic pivots?
- [ ] CTA is one action only?
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'content-writer-newsletter-draft-scenario-1',
        title: 'Draft a conversational newsletter issue on beating creative block',
        userInput:
          'Draft a newsletter issue for "The Brief," a weekly newsletter for freelance copywriters. ' +
          'Issue theme: practical ways to beat creative block on a deadline. ' +
          'Reader persona: freelance copywriters with 2–5 years of experience. ' +
          'Tone: conversational and warm. Include a call to action.',
        expectedBehavior:
          'Claude should produce a complete newsletter issue with a subject line (≤50 chars), ' +
          'preview text (≤90 chars), an opening hook that is specific and avoids "welcome to another issue," ' +
          'a body covering creative block tactics in short paragraphs of ≤4 lines, and a sign-off. ' +
          'The CTA should be a single, specific next step. No fabricated statistics or named studies.',
        mustContain: ['The Brief', 'creative block', 'freelance copywriter', 'deadline'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'content-writer-newsletter-draft-scenario-2',
        title: 'Draft an opinionated newsletter issue on AI writing tools',
        userInput:
          'Draft a newsletter issue for "Signal & Noise," a biweekly newsletter for content ' +
          'strategists and editorial leads. Issue theme: why AI writing tools are most useful ' +
          'for research and least useful for voice. Tone: opinionated. No call to action.',
        expectedBehavior:
          'Claude should produce a complete issue with a subject line (≤50 chars), preview text ' +
          '(≤90 chars), an opinionated opening that states a clear position, a body that argues ' +
          'the AI-for-research vs. AI-for-voice distinction without hedging, and a sign-off. ' +
          'No CTA should be included. The tone should be confident and direct. ' +
          'No fabricated AI product data or user statistics.',
        mustContain: ['Signal & Noise', 'AI writing', 'research', 'voice'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 6. Case Study Writer ─────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-content-writer-case-study-writer-v1',
    slug: 'content-writer-case-study-writer',
    name: 'Case Study Writer',
    tagline: 'Turn client challenge and outcome notes into a structured case study',
    description:
      'Takes the challenge, solution, and outcome details you provide and structures them into ' +
      'a complete case study with a client overview, problem framing, solution narrative, and ' +
      'results section. Flags any figure that needs client confirmation before publishing.',
    role: 'Content Writer',
    industry: 'Media & Creative',
    tags: ['case-study', 'storytelling', 'b2b-content', 'proof-content', 'results'],
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

    instructionTemplate: `You are writing a case study featuring {{clientName}}.

Challenge: {{challengeDescription}}

Solution applied: {{solutionApplied}}

Outcomes: {{outcomes}}

{{#if hasQuote}}
Include a pull quote. Write it as a placeholder: "[QUOTE PLACEHOLDER: client first name, job title, and a 1–2 sentence quote reflecting one specific outcome.]" Do not write it as a real attributed quote.
{{/if}}

Structure the case study as follows:
1. **Client overview**, 2–3 sentences: who they are, their industry, and their scale or context
2. **The challenge**, the specific problem and its business impact before the solution
3. **The solution**, what was done, in plain language (avoid jargon; explain each step)
4. **Results**, outcomes with numbers where provided; flag unconfirmed figures as [CLIENT TO CONFIRM]
5. **Key takeaway**, one sentence: the core lesson another reader can apply

Rules:
1. Do not invent client details, revenue figures, or outcome metrics beyond what is in the inputs.
2. Flag any result that was not explicitly provided with [CLIENT TO CONFIRM] before the figure.
3. Pull quotes must be clearly labeled as placeholders, never attribute words to a named person unless the user provides the actual quote.
4. Never fabricate statistics, testimonials, or business metrics.`,

    variables: [
      {
        key: 'clientName',
        label: 'Client or subject company name',
        type: 'text',
        required: true,
        helpText: 'The name of the company or individual the case study is about.',
        group: 'Case study basics',
      },
      {
        key: 'challengeDescription',
        label: 'The challenge',
        type: 'multiline',
        required: true,
        helpText: 'What problem did the client face before the solution? Include context on why it mattered.',
        group: 'Case study basics',
      },
      {
        key: 'solutionApplied',
        label: 'Solution applied',
        type: 'multiline',
        required: true,
        helpText: 'What was done? Describe the approach, steps taken, or product/service used.',
        group: 'Case study basics',
      },
      {
        key: 'outcomes',
        label: 'Outcomes and results',
        type: 'multiline',
        required: true,
        helpText: 'What changed? Include numbers where you have them, e.g. "reduced processing time by 40%." Flag anything that still needs client confirmation.',
        group: 'Case study basics',
      },
      {
        key: 'hasQuote',
        label: 'Include a pull quote',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to include a pull quote placeholder. Claude will write a template you fill in with the real quote from the client.',
        group: 'Options',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Case study structure reference card',
        purpose:
          'Standard case study structure, results-writing guidance, and a pre-publication checklist ' +
          'so every case study is factually accurate, consistently structured, and client-approved before use.',
        kind: 'starter',
        content: `# Case Study Structure Reference Card

## Standard structure (600–1,200 words)

### 1. Client overview (~100 words)
Who they are, what they do, their industry, and their scale.
Write for a reader who does not know this client, do not assume familiarity.

### 2. The challenge (~200 words)
- What specific problem did they face?
- What was the business impact of that problem? (Cost, time, missed revenue, team friction)
- Why was the status quo not sustainable?

Avoid: generic statements like "they needed to be more efficient." Be specific.

### 3. The solution (~250 words)
- What was done, in chronological or logical order?
- Who was involved?
- How long did it take?

Write for a business reader, not a technical one, explain any jargon in plain terms.

### 4. Results (~200 words)
- Lead with the most impressive or most important outcome.
- Use numbers wherever available: percentages, time saved, revenue gained.
- Flag any unconfirmed figure with [CLIENT TO CONFIRM].
- Do not round aggressively, "reduced by 40%" is more credible than "almost halved."

### 5. Key takeaway (~100 words)
One sentence the reader can apply to their own situation.
Optional: a short next step or CTA.

## Pull quote guidelines
- Use a real quote from a client interview, not a fabricated one.
- Place after the results section for maximum impact.
- Format: "[Quote text]", [First name], [Job title], [Company]
- Use the QUOTE PLACEHOLDER format until the real quote is approved.

## Pre-publication checklist
- [ ] All figures marked [CLIENT TO CONFIRM] have been verified?
- [ ] Pull quote has real attribution (name, title, company)?
- [ ] Client has reviewed and approved the draft?
- [ ] No fabricated metrics, testimonials, or product claims?
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'content-writer-case-study-writer-scenario-1',
        title: 'Write a case study from challenge and outcome notes',
        userInput:
          'Write a case study for Meridian Logistics, a freight brokerage with 80 employees. ' +
          'Challenge: their sales team was spending 3 hours per day manually entering shipment quotes ' +
          'into their CRM, causing delays and data errors. Solution: they implemented an automated ' +
          'quote-entry tool that integrated directly with their CRM. ' +
          'Outcomes: quote entry time dropped from 3 hours to 20 minutes per day; ' +
          'data error rate fell by 60%. Include a pull quote.',
        expectedBehavior:
          'Claude should produce a complete case study with all five sections: client overview ' +
          '(naming Meridian Logistics, freight brokerage, 80 employees), challenge (3 hours of ' +
          'manual quote entry and its impact), solution (automated quote-entry tool with CRM integration), ' +
          'results (3 hours to 20 minutes; 60% error reduction), and a key takeaway. ' +
          'A pull quote placeholder should be included. No metrics should be added beyond those in the input.',
        mustContain: ['Meridian Logistics', 'quote entry', '60%', 'CRM'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'content-writer-case-study-writer-scenario-2',
        title: 'Write a case study with unconfirmed figures flagged',
        userInput:
          'Write a case study for Brightwell Academy, an online education startup. ' +
          'Challenge: low course completion rates were hurting their renewal revenue. ' +
          'Solution: they redesigned their course onboarding flow and added weekly check-in emails. ' +
          'Outcomes: completion rates improved significantly, though the exact percentage is still ' +
          'being calculated. Renewal revenue increased. No pull quote needed.',
        expectedBehavior:
          'Claude should write a complete case study and correctly flag unconfirmed outcome figures ' +
          'with [CLIENT TO CONFIRM]. It should not invent a specific completion percentage or renewal ' +
          'revenue figure. The results section should acknowledge the improvement while clearly ' +
          'marking what needs verification. No fabricated metrics.',
        mustContain: ['Brightwell Academy', 'completion rate', 'onboarding', 'renewal'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 7. Product Description ───────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-content-writer-product-description-v1',
    slug: 'content-writer-product-description',
    name: 'Product Description',
    tagline: 'Write benefit-first product descriptions tailored to the buyer and desired length',
    description:
      'Converts product features and specifications into a description written for the actual ' +
      'buyer, leading with the benefit they get, not the feature list. ' +
      'Respects the requested length and writing style, and never invents specifications.',
    role: 'Content Writer',
    industry: 'Media & Creative',
    tags: ['product-description', 'ecommerce', 'copywriting', 'conversion', 'b2c'],
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

    instructionTemplate: `You write product descriptions for {{targetBuyer}}.

Product: {{productName}}

Key features and specifications: {{keyFeatures}}

Description length: {{descriptionLength}}

Writing style: {{writingStyle}}

Write a product description that:
1. Opens with the primary benefit the buyer gets, not the product category or the product name
2. Covers the features from the inputs, translating technical specifications into buyer benefits where possible
3. Stays within the specified length and applies the writing style consistently throughout
4. Ends with a brief buying prompt or a statement of confidence (not a hard CTA like "Buy now")

Rules:
1. Do not invent features, specifications, or compatibility claims not stated in the inputs.
2. Translate technical specifications into plain-language benefits for the target buyer.
3. Do not use superlatives such as "best," "world-class," or "unrivaled" without factual backing provided by the user.
4. Never fabricate brand claims, competitor comparisons, or customer reviews.`,

    variables: [
      {
        key: 'productName',
        label: 'Product name',
        type: 'text',
        required: true,
        helpText: 'The exact name of the product as it appears on the listing.',
        group: 'Product basics',
      },
      {
        key: 'targetBuyer',
        label: 'Target buyer',
        type: 'text',
        required: true,
        helpText: 'Who is buying this? E.g. "home bakers who want precise measurements without the mess."',
        group: 'Product basics',
      },
      {
        key: 'keyFeatures',
        label: 'Key features and specifications',
        type: 'multiline',
        required: true,
        helpText: 'List the features, materials, dimensions, or specs you want covered. Only what you list will be used, nothing will be invented.',
        group: 'Product basics',
      },
      {
        key: 'descriptionLength',
        label: 'Description length',
        type: 'select',
        options: ['Short (50–100 words)', 'Medium (100–200 words)', 'Long (200–400 words)'],
        default: 'Medium (100–200 words)',
        required: true,
        helpText: 'Short suits a product card or mobile listing; medium fits a standard e-commerce page; long works for a hero product with a detailed page.',
        group: 'Output',
      },
      {
        key: 'writingStyle',
        label: 'Writing style',
        type: 'select',
        options: ['Benefit-led', 'Feature-led', 'Storytelling', 'Minimalist'],
        default: 'Benefit-led',
        required: true,
        helpText:
          'Benefit-led = outcomes first, specs in support; Feature-led = specs prominent with brief benefits; ' +
          'Storytelling = narrative that places the product in context; Minimalist = spare, no adjective excess.',
        group: 'Output',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Product description reference card',
        purpose:
          'Feature-to-benefit translation patterns, length guidelines, style examples, and ' +
          'a list of banned phrases so every description is specific to the buyer and free of empty adjectives.',
        kind: 'starter',
        content: `# Product Description Reference Card

## Feature-to-benefit translation
Always ask: "So what does this mean for the buyer?"
| Feature | Benefit framing |
|---------|----------------|
| 304 stainless steel | Stays rust-free after years of daily use |
| 10,000 mAh battery | Powers a full workday away from any outlet |
| Machine washable | Throw it in the wash, no dry-cleaning bills |
| 4K resolution | Every detail sharp enough to read across the room |
| Adjustable lumbar support | Your lower back stays comfortable through a full 8-hour day |

## Length guidance
- **Short (50–100 words):** One benefit + 2–3 features + buying prompt. Used on product cards, ads, and mobile listings.
- **Medium (100–200 words):** Lead benefit + 3–5 features with brief benefit translations + closing confidence statement. Standard e-commerce PDP.
- **Long (200–400 words):** Full benefit story + all key features + social proof placeholder + CTA. Hero products, dedicated landing pages.

## Writing style examples

### Benefit-led
"Sleep through the night without the 3 a.m. check-your-phone reflex. The [Product] tracks your schedule and sends a single morning summary, no noise during working hours, no interruptions on weekends."

### Feature-led
"[Product], 10,000 mAh battery, USB-C 65W fast charge, dual-port output. Charges a laptop from 0–80% in 45 minutes. Weighs 198 g."

### Storytelling
"You're halfway through the trail when your phone battery drops to 3%. [Product] clips to your pack strap. By the time you reach the summit, you're back to 90%."

### Minimalist
"Solid brass. Hand-finished. Fits any standard door. Lasts longer than the door."

## Banned phrases (remove every time)
- "world-class" / "best-in-class" (unless you can prove it)
- "game-changer" / "revolutionary"
- "innovative" / "cutting-edge" (generic filler)
- "perfect for everyone"
- "you won't be disappointed"
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'content-writer-product-description-scenario-1',
        title: 'Write a medium benefit-led description for a standing desk converter',
        userInput:
          'Write a medium-length (100–200 word), benefit-led product description for a standing ' +
          'desk converter called the RiseDesk Pro. Target buyer: office workers who sit all day and ' +
          'experience lower back pain. Key features: adjustable height range 4–16 inches, ' +
          'fits desks up to 30 inches wide, holds up to 22 lbs, no assembly required, ' +
          'matte black finish.',
        expectedBehavior:
          'Claude should open with the primary benefit for the target buyer, relief from sitting ' +
          'all day and lower back pain, not with the product name or category. The description ' +
          'should cover all five listed features with benefit translations (e.g., "no assembly ' +
          'required" → "set up in under 60 seconds"). It should stay within 100–200 words and use ' +
          'benefit-led style throughout. No invented specs or competitor comparisons.',
        mustContain: ['RiseDesk Pro', 'lower back', 'standing', '22 lbs'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'content-writer-product-description-scenario-2',
        title: 'Write a short minimalist description for a leather notebook',
        userInput:
          'Write a short (50–100 word), minimalist product description for a leather notebook ' +
          'called the Fieldnote Journal. Target buyer: professionals who want a premium everyday carry ' +
          'notebook. Key features: full-grain leather cover, 192 dot-grid pages, lay-flat binding, ' +
          'A5 size, pen loop on the inside cover.',
        expectedBehavior:
          'Claude should write a spare, adjective-light description under 100 words. Minimalist style ' +
          'means no filler adjectives, no exclamation marks, and no generic praise. The description ' +
          'should name or translate all five features. No invented certifications, user reviews, ' +
          'or claims beyond the inputs.',
        mustContain: ['Fieldnote Journal', 'leather', 'dot-grid', 'A5'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 8. Repurpose to Social ───────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-content-writer-repurpose-to-social-v1',
    slug: 'content-writer-repurpose-to-social',
    name: 'Repurpose to Social',
    tagline: 'Extract the sharpest insight from long-form content and rewrite it for social',
    description:
      'Takes a long-form piece, blog post, article, newsletter, or video transcript, and ' +
      'produces one platform-native post for each selected social channel. ' +
      'Each post leads with the core insight rather than announcing the original content.',
    role: 'Content Writer',
    industry: 'Media & Creative',
    tags: ['repurposing', 'social-media', 'content-distribution', 'copywriting', 'efficiency'],
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

    instructionTemplate: `You repurpose long-form content into social media posts for {{brandName}}.

Platforms: {{platforms}}

Tone adjustment: {{socialTone}}

{{#if includeHashtags}}
Add platform-appropriate hashtags at the end of each post: 3–5 for LinkedIn, 10–15 for Instagram, 1–2 for X (Twitter), 2–3 for Facebook and Threads.
{{/if}}

When given a piece of long-form content, extract the single most shareable insight and write one post per platform. For each post:
- Label the platform clearly
- Lead with the core insight, never open with "We just published…" or "New post:"
- Stay within the platform's standard length:
  - LinkedIn: ≤300 words
  - Instagram: ≤150 words
  - X (Twitter): ≤280 characters
  - Facebook: ≤200 words
  - Threads: ≤500 characters
- Adapt the hook, structure, and formatting norms for each platform

Rules:
1. Write only for the platforms listed in the inputs.
2. Do not add statistics or quotes that are not present in the source content provided.
3. Each post must have a meaningfully different opening line even when the core insight is the same.
4. Never fabricate engagement data, follower counts, or platform performance claims.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand or publication name',
        type: 'text',
        required: true,
        helpText: 'The brand, creator, or publication posting this content.',
        group: 'Brand',
      },
      {
        key: 'platforms',
        label: 'Platforms to post on',
        type: 'multiselect',
        options: ['LinkedIn', 'Instagram', 'X (Twitter)', 'Facebook', 'Threads'],
        required: true,
        helpText: 'Select every platform you need posts for. One post will be written per platform.',
        group: 'Platforms',
      },
      {
        key: 'socialTone',
        label: 'Tone adjustment',
        type: 'select',
        options: ['Match the original content', 'More conversational', 'More concise', 'More punchy'],
        default: 'Match the original content',
        required: true,
        helpText:
          'Match = maintain the source tone across platforms; More conversational = loosen formality; ' +
          'More concise = cut to the single sharpest point; More punchy = lead with a bold or provocative line.',
        group: 'Content',
      },
      {
        key: 'includeHashtags',
        label: 'Include hashtags',
        type: 'boolean',
        default: true,
        required: false,
        helpText: 'Turn on to add platform-appropriate hashtags to each post. Turn off for a clean post without tags.',
        group: 'Content',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Social platform repurposing reference card',
        purpose:
          'Platform-by-platform formatting norms, length limits, hashtag guidance, and opening hook ' +
          'rules for repurposed content so every post is native to its channel.',
        kind: 'starter',
        content: `# Social Platform Repurposing Reference Card

## Platform norms for repurposed content

### LinkedIn (≤300 words)
- Hook: first line must stand alone before "see more", make it a bold claim or a question.
- Structure: hook → core insight → 1–2 supporting points → takeaway or question to drive comments.
- Hashtags: 3–5, placed at the very end.
- Avoid: "We just published a blog post about…", lead with the idea, not the announcement.

### Instagram (≤150 words in caption)
- Hook: first 125 characters appear before "more", earn the tap.
- Structure: hook → expanded insight → question to drive comments → hashtags in a separate block.
- Hashtags: 10–15 niche-relevant tags in a line break after the caption.
- Works well: a single sharp quote, a short numbered list, or a relatable observation.

### X / Twitter (≤280 characters, count carefully)
- Write the whole post first, then cut to 280 characters.
- Lead with the insight, not context. No em-dashes.
- Hashtags: 1–2 inline; use only if they add context.
- Threads: lead tweet must work alone; number each subsequent tweet.

### Facebook (≤200 words)
- Warm, community tone. Open with a question or relatable moment.
- Hashtags: 2–3 max; Facebook users do not follow hashtags like Instagram users do.
- Works well: a story, a list, or a question that prompts personal responses.

### Threads (≤500 characters)
- Casual, opinionated voice. Less polished than LinkedIn.
- No hashtags needed; they are not algorithmically significant on Threads yet.
- Works well: a single take, a reaction, or a short point that invites a reply.

## Repurposing rules
- One insight per post, do not compress the whole article.
- Never start with "We just published," "New post," or "Check out our latest."
- Different hook for each platform even when the insight is the same.
- Pull direct quotes only if they appeared in the source content.
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'content-writer-repurpose-to-social-scenario-1',
        title: 'Repurpose a blog post on async communication to LinkedIn and X',
        userInput:
          'Repurpose this blog post excerpt for LinkedIn and X (Twitter). Brand: WorkAsync. ' +
          'Tone: more punchy. Include hashtags. ' +
          'Source content: "Async communication does not mean slow communication. ' +
          'Teams that document decisions well move faster than those that rely on real-time meetings, ' +
          'because nobody has to wait for the next available slot to get an answer. ' +
          'The bottleneck is rarely the async format, it is the absence of clear decisions in writing."',
        expectedBehavior:
          'Claude should produce two distinct posts, one for LinkedIn (≤300 words) and one for X ' +
          '(≤280 characters). Each must open with a different hook and lead with the core insight ' +
          'from the source (async ≠ slow; documented decisions enable speed). Neither should open ' +
          'with "We just published" or a variation. Hashtags should be platform-appropriate. ' +
          'No invented statistics beyond what is in the source content.',
        mustContain: ['WorkAsync', 'async', 'decisions', 'LinkedIn'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'content-writer-repurpose-to-social-scenario-2',
        title: 'Repurpose a newsletter excerpt to Instagram and Threads',
        userInput:
          'Repurpose the following newsletter excerpt for Instagram and Threads. Brand: The Craft Letter. ' +
          'Tone: match the original content. No hashtags. ' +
          'Source content: "The best first sentence you will ever write is the one you write second. ' +
          'Most writers spend the most energy on their opening line and never revisit it after the draft is done. ' +
          'Go back. Your second draft always has a better opening hiding two paragraphs in."',
        expectedBehavior:
          'Claude should produce one Instagram caption (≤150 words, no hashtags) and one Threads post ' +
          '(≤500 characters, no hashtags). Both should match the warm, editorial tone of the source. ' +
          'Each must open differently, the Instagram post and the Threads post cannot have the same ' +
          'opening line. No invented writing advice beyond what appears in the source excerpt.',
        mustContain: ['The Craft Letter', 'first sentence', 'Instagram', 'Threads'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 9. Editing & Proofreading Pass ──────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-content-writer-editing-proofreading-pass-v1',
    slug: 'content-writer-editing-proofreading-pass',
    name: 'Editing & Proofreading Pass',
    tagline: 'Review and improve a draft at the depth you choose, proofread, line edit, or structural',
    description:
      'Applies a structured editorial pass at one of three depths: proofread only, line edit, or ' +
      'structural edit. Names every change made and why, so the author retains full control ' +
      'and nothing is deleted silently.',
    role: 'Content Writer',
    industry: 'Media & Creative',
    tags: ['editing', 'proofreading', 'line-editing', 'revision', 'quality-control'],
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

    instructionTemplate: `You perform editorial reviews on content written for {{targetAudience}}.

Editing depth: {{editingDepth}}

Style guide: {{styleGuide}}

{{#if contentType}}
Content type being edited: {{contentType}}
{{/if}}

Apply the editing depth strictly:
- **Proofread only:** Fix spelling, grammar, and punctuation errors. Do not change sentence structure, word choice, or content.
- **Line edit:** Improve clarity and flow, tighten redundant phrases, improve transitions, fix sentence rhythm. Keep all content; do not cut sections.
- **Structural edit:** Reorganize sections if needed for logical flow. Before making any structural change, state what you are moving and why, then show the result.

After completing the pass:
- List the categories of changes made (one line per change type, not per individual word)
- Note the word count before and after
- Flag any factual claim that looks unsupported with [VERIFY], do not remove it

Rules:
1. Do not cut content silently, name what was removed and the reason.
2. Preserve the author's voice, distinctive phrases, and intentional stylistic choices.
3. Never expand the scope beyond the stated editing depth without asking first.
4. Never fabricate replacement facts, statistics, or quotes.`,

    variables: [
      {
        key: 'editingDepth',
        label: 'Editing depth',
        type: 'select',
        options: [
          'Proofread only (errors only)',
          'Line edit (clarity and flow)',
          'Structural edit (reorganize if needed)',
        ],
        default: 'Line edit (clarity and flow)',
        required: true,
        helpText:
          'Proofread = fix errors, touch nothing else; Line edit = improve clarity without cutting; ' +
          'Structural edit = reorganize sections if the logic is off (changes named before made).',
        group: 'Edit settings',
      },
      {
        key: 'targetAudience',
        label: 'Target audience',
        type: 'text',
        required: true,
        helpText: 'Who is this content written for? Knowing the reader helps calibrate vocabulary and complexity.',
        group: 'Edit settings',
      },
      {
        key: 'styleGuide',
        label: 'Style guide',
        type: 'select',
        options: [
          'AP Style',
          'Chicago Manual of Style',
          'House style (from knowledge file)',
          'No specific guide',
        ],
        required: true,
        helpText:
          'AP Style = journalism; Chicago = books and academic; House style = upload your own guide to the knowledge file; ' +
          'No specific guide = apply general editorial best practice.',
        group: 'Edit settings',
      },
      {
        key: 'contentType',
        label: 'Content type (optional)',
        type: 'select',
        options: ['Blog post', 'Newsletter', 'White paper', 'Case study', 'Email', 'Product description'],
        required: false,
        helpText: 'Naming the content type helps Claude apply format-appropriate conventions (e.g., short paragraphs for newsletters).',
        group: 'Edit settings',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Editorial pass reference card',
        purpose:
          'Scope definitions for each editing depth, a line-editing checklist, and common style-guide ' +
          'rules so every editorial pass is applied consistently at the right level.',
        kind: 'starter',
        content: `# Editorial Pass Reference Card

## Editing depth definitions

### Proofread only
Fix and fix only:
- Spelling errors
- Grammatical errors (subject-verb agreement, tense consistency, pronoun agreement)
- Punctuation errors (comma splices, missing apostrophes, incorrect semicolons)
- Capitalization errors

Do NOT: rewrite sentences, change word choice, reorganize, or cut content.

### Line edit
Fix everything in proofread, PLUS:
- Redundant phrases (e.g., "past history" → "history"; "very unique" → "unique")
- Unclear pronoun references ("This shows that…", what does "this" refer to?)
- Weak transition words replaced with stronger connectives
- Sentences over 30 words split or tightened
- Passive voice converted to active where clearer

Do NOT: cut whole sections, move paragraphs, or change the argument.

### Structural edit
Fix everything in line edit, PLUS:
- Reorder sections where the logic is unclear or the reader is asked to hold too much before the payoff
- Merge sections that cover the same idea
- Flag sections that could be cut (propose, do not execute without consent)
- Check that the headline / opener promise matches the body's delivery

ALWAYS name what you are moving and why before making the change.

## Line-editing checklist
- [ ] No sentence longer than 30 words without a clear reason
- [ ] No paragraph longer than 5 lines (3 lines for newsletters and emails)
- [ ] Adjective audit: remove adjectives that add no information
- [ ] Every [VERIFY] flag noted for the author to resolve
- [ ] Consistent terminology: one term per concept throughout

## AP Style quick reference (most common)
- Months with 6+ letters abbreviated before a date: Jan., Feb., Aug., Sept., Oct., Nov., Dec.
- Use numerals for 10 and above; spell out one through nine
- No Oxford comma (AP Style)
- Job titles: lowercase when following a name; capitalize as a formal title before a name

## Chicago Style quick reference
- Oxford comma required
- Spell out numbers one through one hundred; use numerals above
- Book, film, and album titles in italics (not quotes)
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'content-writer-editing-proofreading-pass-scenario-1',
        title: 'Line edit a blog post draft on productivity habits',
        userInput:
          'Please do a line edit on this blog post draft written for busy managers. ' +
          'Style guide: AP Style. Content type: blog post. ' +
          'Here is the draft: "There are a lot of productivity habits that very successful people ' +
          'tend to use on a daily basis. One of the most popular and well-known ones is time blocking. ' +
          'Time blocking is where you block out specific chunks of time in your calendar for specific ' +
          'tasks. Many people find that this is very helpful for them in terms of getting things done ' +
          'without interruptions from colleagues or other distractions that come up during the day."',
        expectedBehavior:
          'Claude should return a tightened version of the paragraph, removing redundant phrases ' +
          '("a lot of," "very successful," "on a daily basis," "popular and well-known"), converting ' +
          'passive-voice constructions, and cutting the repetitive "time blocking is where" definition. ' +
          'It should note the categories of changes made (e.g., redundancy removal, passive-to-active) ' +
          'and provide a before/after word count. It must not cut the concept or rewrite the topic. ' +
          'No fabricated productivity statistics.',
        mustContain: ['time blocking', 'line edit', 'AP Style', 'blog post'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'content-writer-editing-proofreading-pass-scenario-2',
        title: 'Proofread a short newsletter email for errors only',
        userInput:
          'Proofread only, fix errors, do not change anything else. Style guide: no specific guide. ' +
          'Content type: newsletter. Target audience: small business owners. ' +
          'Here is the draft: "This week we\'re looking at why you\'re email open rates might be falling. ' +
          'There\'s three main culprits: a subject line that doesnt create curiosity, a sender name ' +
          'no-one recognises, and preview text that just repeats the subject line. ' +
          'Each of these are fixable in under an hour."',
        expectedBehavior:
          'Claude should correct only the grammar, spelling, and punctuation errors: ' +
          '"you\'re" → "your," "There\'s three" → "There are three," "doesnt" → "doesn\'t," ' +
          '"no-one recognises" → "no one recognizes" (or "recognises" if British English is the intended variant). ' +
          'It must not rewrite sentences, change the argument, or alter the tone. ' +
          'A list of corrections should be provided. No new content invented.',
        mustContain: ['Proofread', 'email open rates', 'subject line', 'newsletter'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ─── 10. Content Brief Writer ─────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-content-writer-content-brief-writer-v1',
    slug: 'content-writer-content-brief-writer',
    name: 'Content Brief Writer',
    tagline: 'Build a complete content brief a writer can act on without a follow-up meeting',
    description:
      'Generates a structured content brief from your goal, audience, keyword, and content type. ' +
      'The output covers purpose, key points, points to avoid, word count, internal links, and ' +
      'success criteria, everything a writer needs to start without re-asking questions.',
    role: 'Content Writer',
    industry: 'Media & Creative',
    tags: ['content-brief', 'editorial-planning', 'content-strategy', 'seo', 'writing'],
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

    instructionTemplate: `You write content briefs for {{contentType}} pieces.

Content goal: {{contentGoal}}

Target audience: {{targetAudience}}

Primary keyword or topic: {{primaryKeyword}}

{{#if hasCompetitorContext}}
Include a "Competitor gap" section in the brief: a short note on what competing content on this topic commonly covers and what angle or depth this piece should do differently to stand out.
{{/if}}

Write a complete content brief with these sections:
1. **Purpose**, one sentence: what the reader should know, feel, or do after reading
2. **Target reader**, role, industry, pain point, and assumed prior knowledge level
3. **Primary keyword / topic and semantic variants**, the main keyword plus 3–5 related terms or angles to weave in
4. **Key points to cover**, bulleted list in priority order (most important first)
5. **Points to avoid**, topics, claims, or angles to exclude
6. **Recommended word count and format**, with a one-sentence rationale
7. **Internal links to consider**, types of related pages to link to (not fabricated URLs)
8. **Success criteria**, how to know if this piece achieved its goal

Rules:
1. Key points must be specific to the stated goal and audience, no generic filler like "explain the basics."
2. Do not invent search volume data, competitor domain authority, or content performance benchmarks.
3. Flag any section where the user needs to supply information before a writer can start (mark with [OWNER TO FILL]).
4. Never fabricate brand facts, competitor names, or product claims.`,

    variables: [
      {
        key: 'contentType',
        label: 'Content type',
        type: 'select',
        options: ['Blog post', 'White paper', 'Case study', 'Newsletter', 'eBook', 'Landing page'],
        required: true,
        helpText: 'The format affects the recommended word count, structure, and success criteria.',
        group: 'Brief basics',
      },
      {
        key: 'contentGoal',
        label: 'Content goal',
        type: 'multiline',
        required: true,
        helpText: 'What should this piece achieve? E.g. "Drive trial signups from readers who are comparing project management tools."',
        group: 'Brief basics',
      },
      {
        key: 'targetAudience',
        label: 'Target audience',
        type: 'text',
        required: true,
        helpText: 'Who will read this? Be specific, role, industry, experience level, and the pain point that brought them here.',
        group: 'Brief basics',
      },
      {
        key: 'primaryKeyword',
        label: 'Primary keyword or topic',
        type: 'text',
        required: true,
        helpText: 'The main search term or topic focus. Use the exact phrasing you want the piece to rank for or be discovered around.',
        group: 'SEO',
      },
      {
        key: 'hasCompetitorContext',
        label: 'Include competitor gap section',
        type: 'boolean',
        default: false,
        required: false,
        helpText: 'Turn on to add a section that identifies what competing content covers and how this piece should differentiate.',
        group: 'SEO',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Content brief template and reference card',
        purpose:
          'A fillable content brief template with all eight sections pre-structured, ' +
          'plus guidance on writing specific (not generic) key points and measurable success criteria.',
        kind: 'starter',
        content: `# Content Brief Template and Reference Card

## Fillable brief (complete before assigning to a writer)

### 1. Purpose
One sentence: [What the reader should know / feel / do after reading.]

### 2. Target reader
- Role / job title: ___
- Industry: ___
- Pain point that brought them here: ___
- Prior knowledge level: [Beginner / Intermediate / Expert]

### 3. Primary keyword and semantic variants
- Primary: ___
- Variant 1: ___
- Variant 2: ___
- Variant 3: ___

### 4. Key points to cover (in priority order)
1. [Most important, the reader cannot finish this piece without understanding this]
2. ___
3. ___
4. ___

### 5. Points to avoid
- [Topic or claim to exclude]:
- [Competitor names to avoid mentioning]:
- [Angle that misrepresents the product / service]:

### 6. Word count and format
- Recommended word count: ___
- Rationale: ___
- Format: [Standard article / Listicle / How-to / Q&A / Data-led]

### 7. Internal links to consider
- Link to: [type of related page], anchor text suggestion: ___
- Link to: ___, anchor text: ___

### 8. Success criteria
- Primary: [How will you know this piece worked?]
- Secondary: ___

---

## Writing specific key points (not generic ones)

Generic (bad): "Explain what project management software is."
Specific (good): "Explain how project management software reduces the number of status-update meetings a team needs, because that is the specific pain point our reader has."

The test: can a writer start this section without re-reading the rest of the brief? If yes, the key point is specific enough.

## Measurable success criteria
- Organic ranking: "Rank on page 1 for primary keyword within 6 months"
- Engagement: "Average time on page >3 minutes"
- Conversion: "5% of readers click through to the free trial page"
- Shares: "Shared by at least 3 industry newsletter curators within 30 days"

Vague criteria to avoid: "perform well," "get good results," "be shared widely."
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'content-writer-content-brief-writer-scenario-1',
        title: 'Write a content brief for a blog post on managing remote design teams',
        userInput:
          'Write a content brief for a blog post on managing remote design teams. ' +
          'Content goal: help engineering and product managers who suddenly have design reports ' +
          'understand how to give effective design feedback without micromanaging. ' +
          'Target audience: product managers at tech startups with 2–5 direct design reports. ' +
          'Primary keyword: "how to give design feedback." Include a competitor gap section.',
        expectedBehavior:
          'Claude should produce a complete content brief with all eight sections. Key points must ' +
          'be specific to the engineering/product manager audience giving design feedback, not generic ' +
          'management advice. The competitor gap section should note what common articles on design ' +
          'feedback cover (e.g., visual vs. verbal feedback, timing) and what angle this piece should ' +
          'take differently. Success criteria should be measurable. No fabricated search volume data.',
        mustContain: ['design feedback', 'product manager', 'remote', 'competitor gap'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'content-writer-content-brief-writer-scenario-2',
        title: 'Write a content brief for an eBook on B2B email list growth',
        userInput:
          'Write a content brief for an eBook on growing a B2B email list. ' +
          'Content goal: generate leads for a marketing automation platform by giving B2B marketers ' +
          'a practical playbook they can implement in 30 days. ' +
          'Target audience: marketing managers at B2B software companies with lists under 5,000 subscribers. ' +
          'Primary keyword: "B2B email list growth." No competitor gap section needed.',
        expectedBehavior:
          'Claude should produce a complete brief with all eight sections. The eBook format should ' +
          'result in a higher word count recommendation (5,000+ words) with a rationale. Key points ' +
          'should be specific to B2B marketers with small lists, not general email marketing advice. ' +
          'Success criteria should reflect the lead-generation goal. No fabricated benchmark data.',
        mustContain: ['eBook', 'B2B', 'email list', '5,000 subscribers'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },
];
