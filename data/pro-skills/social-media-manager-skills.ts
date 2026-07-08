import type { Setup } from '@/lib/setup/types';

export const socialMediaManagerSkills: Setup[] = [
  // ── 1. Content Calendar ───────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-social-media-manager-content-calendar-v1',
    slug: 'social-media-manager-content-calendar',
    name: 'Content Calendar',
    tagline: 'Build a themed posting schedule your whole team can execute from',
    description:
      'Generates a structured content calendar for a set period, with post ideas, ' +
      'formats, and copy direction for every slot. Keeps output tied to a single ' +
      'campaign theme so the feed stays coherent across channels.',
    role: 'Social Media Manager',
    industry: 'Media & Creative',
    tags: [
      'content-calendar',
      'social-media',
      'planning',
      'scheduling',
      'instagram',
      'tiktok',
      'linkedin',
    ],
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

    instructionTemplate: `You are a social media content strategist for {{brandName}}.

Build content calendars for the following platforms: {{platforms}}. Plan {{postsPerWeek}} posts per week, spanning {{calendarPeriod}}.

The theme for this period is: {{contentTheme}}. Every post idea must connect to this theme — either directly or by contrast. Do not drift into generic content that could belong to any brand.

Your output for each day's post:
- Date and platform
- Format (carousel, single image, Reel, text post, etc.)
- Hook or headline (one line)
- Caption direction (2–3 sentences, not a finished caption — save that for the Caption Writer setup)
- Suggested hashtag tier (niche / mid / broad — counts only, not specific tags)

Rules:
1. Rotate formats across the week — do not stack the same format on consecutive days.
2. Vary content pillars (educational, inspirational, promotional, community) so no pillar dominates two days in a row.
3. Never fabricate brand facts, past performance, or audience data. If context is missing, flag it.
4. Stay on-brand: every idea must be executable by {{brandName}} without a rewrite.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'The exact brand name as it appears on your social profiles.',
        group: 'About your brand',
      },
      {
        key: 'platforms',
        label: 'Platforms to cover',
        type: 'multiselect',
        options: ['Instagram', 'TikTok', 'LinkedIn', 'Facebook', 'X/Twitter', 'YouTube Shorts'],
        default: ['Instagram'],
        required: true,
        helpText: 'Select every platform this calendar should include.',
        group: 'About your brand',
      },
      {
        key: 'calendarPeriod',
        label: 'Calendar period',
        type: 'select',
        options: ['One week', 'Two weeks', 'One month'],
        default: 'One week',
        required: true,
        helpText: 'How many days should the calendar span?',
        group: 'Planning',
      },
      {
        key: 'contentTheme',
        label: 'Content theme',
        type: 'text',
        required: true,
        helpText:
          'The unifying theme for this period — e.g. "summer refresh", "product launch", "back to school".',
        group: 'Planning',
      },
      {
        key: 'postsPerWeek',
        label: 'Posts per week',
        type: 'number',
        default: 5,
        required: true,
        helpText: 'Target number of posts per week across all selected platforms combined.',
        group: 'Planning',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Brand content pillars and formats reference',
        purpose:
          'Gives Claude a compact reference for your brand\'s content pillars, preferred formats, ' +
          'and any platform-specific constraints — so every calendar slot fits your actual strategy.',
        kind: 'starter',
        content: `# Brand content pillars and formats reference

## Content pillars (edit to match your brand)
- Educational — how-tos, tips, explainers
- Inspirational — brand values, stories, community spotlights
- Promotional — product features, offers, launches
- Community — UGC reposts, polls, Q&A, behind-the-scenes

## Preferred post formats by platform
| Platform | Preferred formats |
|----------|------------------|
| Instagram | Carousel, Reel, single image |
| TikTok | Short-form video (15–60 s) |
| LinkedIn | Text post, article, document carousel |
| Facebook | Single image, link post, short video |
| X/Twitter | Text thread, image + text |
| YouTube Shorts | Vertical video (up to 60 s) |

## Platform-specific notes
- Instagram: optimal caption length ≈ 150–300 chars for feed; longer for carousels
- TikTok: hook must land in the first 2 seconds
- LinkedIn: posts with a clear opinion or data point outperform generic advice
- X/Twitter: keep the first tweet punchy; expand in a thread if needed

## Scheduling constraints
- Do not post promotional content more than 2× per week
- Allow 48 h between posts in the same format on the same platform
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'social-media-manager-content-calendar-scenario-1',
        title: 'One-week calendar for a fitness brand launch',
        userInput:
          'Build a one-week content calendar for our brand FitForge. The theme is "New Year, New Strength" ' +
          'and we need 5 posts across Instagram and TikTok. We launch a resistance-band kit on day 3.',
        expectedBehavior:
          'Claude should produce a day-by-day calendar for seven days covering Instagram and TikTok, ' +
          'with five posts distributed across both platforms. Each entry must name the date/day, platform, ' +
          'format, a one-line hook, and 2–3 sentences of caption direction. The day-3 slot must include ' +
          'the resistance-band kit launch. Formats should vary — no two consecutive days should share the ' +
          'same format on the same platform. Promotional posts should not dominate the week.',
        mustContain: ['FitForge', 'New Year, New Strength', 'Instagram', 'TikTok', 'resistance-band'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'social-media-manager-content-calendar-scenario-2',
        title: 'Two-week LinkedIn and Instagram calendar for a sustainability consultancy',
        userInput:
          'Create a two-week calendar for GreenPivot Consulting. Theme is "Decarbonize by Default." ' +
          'We post 3 times per week on LinkedIn and twice per week on Instagram.',
        expectedBehavior:
          'Claude should produce a 14-day calendar with entries split across LinkedIn and Instagram, ' +
          'totalling 3 LinkedIn posts and 2 Instagram posts per week. Each entry must include date, ' +
          'platform, format, hook, and caption direction tied to the decarbonization theme. Educational ' +
          'and thought-leadership formats should dominate LinkedIn; visual storytelling should anchor ' +
          'Instagram. No promotional content should appear unless GreenPivot services are clearly described.',
        mustContain: ['GreenPivot', 'Decarbonize by Default', 'LinkedIn', 'Instagram'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 2. Caption Writer ─────────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-social-media-manager-caption-writer-v1',
    slug: 'social-media-manager-caption-writer',
    name: 'Caption Writer',
    tagline: 'Platform-tailored captions that match your brand voice and drive action',
    description:
      'Drafts finished captions optimised for a specific platform, voice, and call to action. ' +
      'Respects character limits, emoji preferences, and CTA placement conventions ' +
      'for each channel so captions never need a manual rewrite before posting.',
    role: 'Social Media Manager',
    industry: 'Media & Creative',
    tags: ['caption', 'copywriting', 'instagram', 'linkedin', 'tiktok', 'brand-voice', 'cta'],
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

    instructionTemplate: `You are a caption writer for {{brandName}}.

Platform: {{platform}}. Every caption you write must fit the norms of this specific platform — length, line breaks, and CTA placement all differ by channel.

Brand voice: {{brandVoice}}. This is non-negotiable. A caption that gets the facts right but sounds wrong is unusable.

{{#if includeEmojis}}
Use emojis to reinforce key points and match the platform's visual energy. Place them at natural pause points, not randomly. Never use more than 5 in a single caption.
{{/if}}

The desired call to action for every post: {{callToAction}}. Place the CTA at the end of the caption — never bury it mid-text.

Rules:
1. Write exactly one finished caption per request. Offer a shorter variant only if the user asks.
2. Match the hook to the asset described — if you do not know the visual, ask before writing.
3. Never fabricate brand facts, product claims, or customer testimonials.
4. On-brand voice takes priority over trend language that does not fit {{brandName}}.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'Your brand name, exactly as it appears on your social profiles.',
        group: 'About your brand',
      },
      {
        key: 'brandVoice',
        label: 'Brand voice',
        type: 'select',
        options: ['Professional', 'Playful', 'Inspirational', 'Educational', 'Witty'],
        default: 'Playful',
        required: true,
        helpText: 'The tone that every caption must match.',
        group: 'About your brand',
      },
      {
        key: 'platform',
        label: 'Platform',
        type: 'select',
        options: ['Instagram', 'TikTok', 'LinkedIn', 'Facebook', 'X/Twitter'],
        default: 'Instagram',
        required: true,
        helpText: 'The platform this caption will be published on.',
        group: 'Post details',
      },
      {
        key: 'includeEmojis',
        label: 'Include emojis?',
        type: 'boolean',
        default: true,
        required: false,
        helpText: 'Turn off if your brand style avoids emojis.',
        group: 'Post details',
      },
      {
        key: 'callToAction',
        label: 'Call to action',
        type: 'text',
        required: true,
        helpText:
          'What action should readers take? e.g. "Shop the link in bio", "Drop a comment below", "Save this for later".',
        group: 'Post details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Caption style guide and platform limits',
        purpose:
          'A compact reference card with your brand voice guidelines, character limits per platform, ' +
          'and CTA phrasing examples — so every caption is on-brand without manual editing.',
        kind: 'starter',
        content: `# Caption style guide and platform limits

## Platform character and format guidelines
| Platform | Recommended length | Hard limit | Line breaks |
|----------|--------------------|------------|-------------|
| Instagram | 125–150 chars visible; up to 2,200 total | 2,200 chars | Use line breaks; 3 dots then "more" hides text after ~3 lines |
| TikTok | Under 150 chars | 2,200 chars | Short, punchy; the video carries the message |
| LinkedIn | 150–300 chars for feed; up to 3,000 for articles | 3,000 chars | Single-line opener, then expand |
| Facebook | 40–80 chars for highest reach | 63,206 chars | Keep it short for organic; longer for community posts |
| X/Twitter | Under 240 chars (leave room for links) | 280 chars | One punchy statement or short thread opener |

## Brand voice anchors (fill in for your brand)
- Words we always use: [add your list]
- Words we never use: [add your list]
- Sentence style: [short / medium / long]
- Formality level: [formal / semi-formal / casual]

## CTA phrasing bank
- Shop now: "Shop the link in bio →"
- Engagement: "What's your take? Drop it below 👇"
- Save: "Save this post for later"
- DM: "DM us the word [KEYWORD] for details"
- Learn more: "Tap the link in bio to learn more"

## Emoji usage rules
- Max 5 emojis per caption
- Use at natural pause points (end of sentence or list item)
- Avoid emojis that distort meaning in screen-readers
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'social-media-manager-caption-writer-scenario-1',
        title: 'Instagram caption for a new skincare product photo',
        userInput:
          'Write an Instagram caption for a flat-lay photo of our new Vitamin C serum next to a halved orange. ' +
          'The post goes live during our summer glow campaign. CTA is "Shop the link in bio."',
        expectedBehavior:
          'Claude should produce one finished Instagram caption in a Playful or brand-matched tone. ' +
          'The caption should open with a hook tied to the visual (flat-lay, Vitamin C, summer), ' +
          'stay within the recommended 150-char visible window before the fold, and end with ' +
          '"Shop the link in bio" or a close variant. If emojis are enabled, they should appear ' +
          'at natural pause points. No fabricated product claims (e.g. "dermatologist-approved") ' +
          'should appear unless the user provides that information.',
        mustContain: ['Vitamin C', 'summer', 'link in bio'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'social-media-manager-caption-writer-scenario-2',
        title: 'LinkedIn caption for a thought leadership video',
        userInput:
          'Write a LinkedIn caption for a 60-second video where our CEO talks about why most companies ' +
          'fail at remote work. We want people to watch the full video and comment with their experience.',
        expectedBehavior:
          'Claude should write a LinkedIn caption with a strong single-line opener that creates curiosity ' +
          'about the CEO\'s take on remote work failure. The caption should expand in 2–3 short paragraphs, ' +
          'then close with a direct prompt for viewers to comment with their experience. Tone should match ' +
          'the selected brand voice. Emojis should be absent or minimal given the professional context. ' +
          'The caption must not invent a specific statistic or quote from the CEO.',
        mustContain: ['remote work', 'CEO', 'comment'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 3. Hashtag Strategy ───────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-social-media-manager-hashtag-strategy-v1',
    slug: 'social-media-manager-hashtag-strategy',
    name: 'Hashtag Strategy',
    tagline: 'A tiered hashtag mix that balances reach with discoverability for your niche',
    description:
      'Builds a structured hashtag strategy for a campaign or ongoing content program. ' +
      'Organises tags into reach tiers (niche, mid, broad) so every post has the right ' +
      'mix of discoverability and competition. Explains the rationale behind each tier.',
    role: 'Social Media Manager',
    industry: 'Media & Creative',
    tags: ['hashtags', 'reach', 'discoverability', 'instagram', 'tiktok', 'linkedin', 'strategy'],
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

    instructionTemplate: `You are a hashtag strategist for {{brandName}}, a brand in the {{industry}} space.

Target platform: {{platform}}. Hashtag mechanics differ significantly across platforms — respect them. Instagram supports up to 30 tags; TikTok rewards 3–5 targeted tags; LinkedIn hashtags surface content in feed subscriptions.

Target audience: {{audienceDescription}}.

Campaign goal: {{campaignGoal}}. The tag mix must serve this goal — a brand-awareness strategy uses broader tags than a conversion campaign.

Your output must include:
1. A tiered hashtag set: niche (under 50 k posts/uses), mid (50 k–500 k), broad (500 k+)
2. The recommended number of tags per post for this platform
3. A short sentence explaining why each tier earns its slot
4. A rotating bank of 3 tag sets so the same combination is never repeated post-to-post

Rules:
1. Do not fabricate hashtag follower or post counts — describe tiers by relative size only.
2. Never recommend banned or shadowbanned tags. Flag any tag that commonly triggers shadowbanning on this platform.
3. Stay on-brand: every tag must be relevant to {{brandName}} and {{industry}}.
4. On {{platform}}, recommend the number of tags that the platform algorithm currently rewards — not the maximum allowed.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'Your brand name as it appears on social media.',
        group: 'About your brand',
      },
      {
        key: 'industry',
        label: 'Industry or niche',
        type: 'text',
        required: true,
        helpText:
          'The category your brand competes in — e.g. "sustainable fashion", "B2B SaaS", "plant-based food".',
        group: 'About your brand',
      },
      {
        key: 'platform',
        label: 'Platform',
        type: 'select',
        options: ['Instagram', 'TikTok', 'LinkedIn', 'X/Twitter'],
        default: 'Instagram',
        required: true,
        helpText: 'The platform this hashtag strategy is for.',
        group: 'Strategy details',
      },
      {
        key: 'audienceDescription',
        label: 'Audience description',
        type: 'multiline',
        required: true,
        helpText:
          'Describe your target audience in 2–4 sentences: who they are, what they care about, and where they hang out online.',
        group: 'Strategy details',
      },
      {
        key: 'campaignGoal',
        label: 'Campaign goal',
        type: 'select',
        options: [
          'Brand awareness',
          'Lead generation',
          'Community building',
          'Sales',
          'Event promotion',
        ],
        default: 'Brand awareness',
        required: true,
        helpText: 'What this hashtag strategy is trying to achieve.',
        group: 'Strategy details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Hashtag strategy reference card',
        purpose:
          'A reference card covering platform hashtag limits, tier definitions, and a starter ' +
          'list of evergreen tags for your industry — so every strategy output is grounded in ' +
          'your brand\'s actual context.',
        kind: 'starter',
        content: `# Hashtag strategy reference card

## Platform hashtag guidelines
| Platform | Recommended count | Max allowed | Notes |
|----------|------------------|-------------|-------|
| Instagram | 5–10 per post | 30 | Place in caption or first comment; avoid identical sets on every post |
| TikTok | 3–5 per video | No hard limit | Use 1 broad + 2–3 niche; trending sounds matter more than tags |
| LinkedIn | 3–5 per post | No hard limit | Hashtags surface posts to followers of those tags |
| X/Twitter | 1–2 per tweet | No hard limit | Overuse hurts reach; treat tags as topic signals, not discovery tools |

## Tier definitions
- **Niche** (under 50 k uses/posts): low competition, highly targeted audience; builds community
- **Mid** (50 k–500 k uses): balance of reach and specificity; core of most strategies
- **Broad** (500 k+): high competition, large audience; use sparingly as visibility boosts

## Evergreen industry tags (fill in for your brand)
- Niche tags: [add 5–10 tags specific to your product category]
- Mid tags: [add 5–10 tags for your industry vertical]
- Broad tags: [add 3–5 high-reach tags you rotate in occasionally]

## Shadowban risk note
- Avoid generic lifestyle tags that are frequently abused (#love, #instagood)
- Rotate tag sets across posts to prevent repetitive-tag penalties
- Check platform-specific banned-tag lists before adding any new tag
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'social-media-manager-hashtag-strategy-scenario-1',
        title: 'Instagram hashtag strategy for a sustainable fashion brand',
        userInput:
          'Build a hashtag strategy for EcoThreads, a sustainable fashion brand on Instagram. ' +
          'Our audience is eco-conscious women aged 25–40 who follow slow-fashion creators. Goal is brand awareness.',
        expectedBehavior:
          'Claude should produce a tiered hashtag strategy for Instagram with three tiers (niche, mid, broad), ' +
          'a recommended per-post count, a rationale sentence for each tier, and three rotating tag sets. ' +
          'All tags should be relevant to sustainable or slow fashion. The strategy should acknowledge ' +
          'Instagram\'s algorithm preference for mid-tier tags and warn against overusing broad lifestyle tags. ' +
          'No fabricated post-count numbers should appear.',
        mustContain: ['EcoThreads', 'Instagram', 'sustainable', 'niche', 'brand awareness'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'social-media-manager-hashtag-strategy-scenario-2',
        title: 'LinkedIn hashtag strategy for a B2B SaaS company targeting lead generation',
        userInput:
          'Create a LinkedIn hashtag strategy for PipelineIQ, a B2B SaaS that helps sales teams ' +
          'automate prospecting. We target VP-level sales leaders in mid-market tech companies. ' +
          'Goal is lead generation.',
        expectedBehavior:
          'Claude should output a LinkedIn-specific hashtag strategy with 3–5 tags per post ' +
          'and three rotating sets. Tags must be relevant to sales, SaaS, and prospecting. ' +
          'The strategy should explain that LinkedIn hashtags reach followers of those topics, ' +
          'not random discovery pools, and should bias toward mid-tier professional tags over ' +
          'generic broad ones. The output must not invent engagement statistics.',
        mustContain: ['PipelineIQ', 'LinkedIn', 'sales', 'lead generation'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 4. Reel & Short Script ────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-social-media-manager-reel-script-v1',
    slug: 'social-media-manager-reel-script',
    name: 'Reel & Short Script',
    tagline: 'Short-form video scripts with a hook that earns the watch in the first two seconds',
    description:
      'Writes scene-by-scene scripts for Reels, TikToks, and YouTube Shorts — including the ' +
      'opening hook, on-screen text cues, voiceover lines, and a closing CTA. Keeps scripts ' +
      'within the chosen duration and paced for the chosen platform\'s retention curve.',
    role: 'Social Media Manager',
    industry: 'Media & Creative',
    tags: ['reels', 'tiktok', 'short-form-video', 'script', 'hook', 'youtube-shorts', 'video-content'],
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

    instructionTemplate: `You are a short-form video scriptwriter for {{brandName}}.

Platform: {{platform}}. Scripts must be paced and formatted for this platform's viewer behaviour. TikTok drops 60 % of viewers in the first 3 seconds; Reels are similar. YouTube Shorts viewers finish more if the loop is clean.

Topic or product: {{productOrTopic}}.

Video duration: {{videoDuration}}. Do not write more than this duration allows. Err on the side of slightly shorter.

Hook style: {{hookStyle}}. The first line must use this hook style — this is the only thing the algorithm judges before deciding whether to distribute the video.

Script format:
[HOOK] — the opening 2 seconds: one line, delivered fast
[SCENE n] — each beat: action note | on-screen text | voiceover or spoken line
[CTA] — the last 3 seconds: one clear action for the viewer

Rules:
1. The hook must create a reason to keep watching — a question unanswered, a claim to be proved, a story begun.
2. Every scene must advance the point — no filler transitions.
3. Never fabricate product results, testimonials, or statistics.
4. Stay on-brand: the tone of the script must match {{brandName}}'s voice, not generic creator language.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'Your brand name, as it should appear in on-screen text.',
        group: 'About your brand',
      },
      {
        key: 'productOrTopic',
        label: 'Product or topic',
        type: 'text',
        required: true,
        helpText:
          'What is this video about? e.g. "our new oat milk latte", "5 morning routine hacks", "behind the scenes at our studio".',
        group: 'Video details',
      },
      {
        key: 'platform',
        label: 'Platform',
        type: 'select',
        options: ['Instagram Reels', 'TikTok', 'YouTube Shorts'],
        default: 'Instagram Reels',
        required: true,
        helpText: 'The platform this video will be published on.',
        group: 'Video details',
      },
      {
        key: 'videoDuration',
        label: 'Video duration',
        type: 'select',
        options: ['15 seconds', '30 seconds', '60 seconds'],
        default: '30 seconds',
        required: true,
        helpText: 'Target length. Shorter scripts perform better when the content is tight.',
        group: 'Video details',
      },
      {
        key: 'hookStyle',
        label: 'Hook style',
        type: 'select',
        options: ['Question', 'Bold statement', 'Surprising fact', 'Story opener'],
        default: 'Bold statement',
        required: true,
        helpText: 'The opening technique. This determines whether the algorithm keeps showing the video.',
        group: 'Video details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Short-form video script reference card',
        purpose:
          'A compact guide covering script format conventions, retention benchmarks by platform, ' +
          'and hook formulas — so every script is built for watch-time, not just content.',
        kind: 'starter',
        content: `# Short-form video script reference card

## Script format template
\`\`\`
[HOOK] (0–2 s)
  Action: what the creator does
  On-screen text: (optional — large, readable)
  Spoken: one punchy line

[SCENE 1] (2–X s)
  Action: visual beat
  On-screen text: (optional)
  Spoken: supporting line

[SCENE n] ...

[CTA] (last 2–3 s)
  Action: ...
  On-screen text: ...
  Spoken: one clear action
\`\`\`

## Duration pacing guide
| Duration | Max scenes | Words (approx.) |
|----------|-----------|-----------------|
| 15 s | 3 | ~40 words |
| 30 s | 5–6 | ~80 words |
| 60 s | 9–12 | ~160 words |

## Hook formula bank
- Question: "Did you know [counterintuitive fact]?"
- Bold statement: "Stop doing [common thing]. Here's why."
- Surprising fact: "[Number] % of [audience] don't know this."
- Story opener: "Last [day], [something unexpected happened]."

## Retention benchmarks (approximate)
- TikTok: 60 % drop in first 3 s; aim for loop completion
- Instagram Reels: similar drop pattern; looping boosts ranking
- YouTube Shorts: viewers who finish are 40 % more likely to see your next Short

## CTA phrasing bank
- Follow: "Follow for more [topic] tips"
- Save: "Save this before you forget"
- Comment: "Comment [word] if this helped"
- Shop: "Link in bio — tap to shop"
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'social-media-manager-reel-script-scenario-1',
        title: '30-second Reel script for a skincare serum demo',
        userInput:
          'Write a 30-second Instagram Reels script for our Glow Drop vitamin C serum. ' +
          'Use a bold statement hook. Show the before-and-after application. CTA is to shop the link in bio.',
        expectedBehavior:
          'Claude should produce a scene-by-scene script with clearly labelled [HOOK], [SCENE], and [CTA] sections ' +
          'totalling approximately 30 seconds of content. The hook must be a bold statement, not a question. ' +
          'Scenes should walk through an application demo visually. The CTA must direct viewers to the link in bio. ' +
          'No fabricated clinical claims about the serum (e.g. "reduces wrinkles by 30 %") should appear.',
        mustContain: ['Glow Drop', 'bold statement', 'link in bio', 'HOOK', 'CTA'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'social-media-manager-reel-script-scenario-2',
        title: '15-second TikTok script for a productivity tip',
        userInput:
          'Write a 15-second TikTok script for TaskNest, our productivity app. Topic is the 2-minute rule. ' +
          'Use a question hook. Ask viewers to follow for more tips.',
        expectedBehavior:
          'Claude should produce a tight script with a [HOOK], one or two [SCENE] beats, and a [CTA], ' +
          'all fitting within 15 seconds (~40 words spoken). The hook must be a question that creates ' +
          'curiosity about the 2-minute rule without answering it immediately. The CTA must be to follow ' +
          'for more tips. The script should be written at the pacing expected on TikTok — short sentences, ' +
          'fast delivery.',
        mustContain: ['TaskNest', '2-minute rule', 'question', 'follow', 'HOOK'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 5. Community Reply Templates ──────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-social-media-manager-community-replies-v1',
    slug: 'social-media-manager-community-replies',
    name: 'Community Reply Templates',
    tagline: 'On-brand reply templates for comments and DMs that scale without sounding canned',
    description:
      'Generates a set of ready-to-use reply templates for common comment and DM scenarios. ' +
      'Each template is built around your brand voice and designed to feel personal, not ' +
      'copy-pasted — so your team can respond faster without sacrificing authenticity.',
    role: 'Social Media Manager',
    industry: 'Media & Creative',
    tags: ['community-management', 'reply-templates', 'comments', 'dm', 'brand-voice', 'engagement'],
    category: 'customer-support',
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

    instructionTemplate: `You are a community manager for {{brandName}}.

Brand voice: {{brandVoice}}. Every reply must sound like {{brandName}} — not like a support bot or a generic "Thanks for reaching out!" response.

Generate on-brand reply templates for the following scenarios: {{replyScenarios}}. For each scenario, produce 3 variants so the team can rotate and avoid repetition.

For any complaint or escalation scenario, the template must include a clear redirect to {{escalationContact}} — never promise resolution directly in a public comment.

Reply template format:
[Scenario name]
Variant 1: [reply text] (max 3 sentences)
Variant 2: [reply text]
Variant 3: [reply text]

Rules:
1. Templates must feel human. Avoid "We apologise for any inconvenience" and similar corporate filler.
2. Every variant for a given scenario must convey the same core message but differ in wording and energy.
3. Never fabricate product information, policies, or timelines in a template. Use [placeholder] for specifics the team must fill in.
4. Complaint templates must de-escalate first, then redirect — never argue with the commenter.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'Your brand name as it should appear in replies.',
        group: 'About your brand',
      },
      {
        key: 'brandVoice',
        label: 'Brand voice',
        type: 'select',
        options: ['Warm & friendly', 'Professional', 'Playful', 'Empathetic'],
        default: 'Warm & friendly',
        required: true,
        helpText: 'The tone every reply template must match.',
        group: 'About your brand',
      },
      {
        key: 'replyScenarios',
        label: 'Scenarios to cover',
        type: 'multiselect',
        options: [
          'Positive review',
          'Complaint',
          'Question about product',
          'Spam or irrelevant comment',
          'Partnership request',
        ],
        default: ['Positive review', 'Complaint', 'Question about product'],
        required: true,
        helpText: 'Select the comment or DM types your team handles most often.',
        group: 'Reply scenarios',
      },
      {
        key: 'escalationContact',
        label: 'Escalation contact',
        type: 'text',
        required: true,
        helpText:
          'Where serious complaints should be directed — e.g. "our DMs", "support@example.com", "the link in our bio".',
        group: 'Reply scenarios',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Community reply guide and tone reference',
        purpose:
          'A compact guide covering escalation rules, tone anchors, and fill-in-the-blank ' +
          'placeholder conventions — so every reply sounds human and on-brand without requiring ' +
          'a manager review before posting.',
        kind: 'starter',
        content: `# Community reply guide and tone reference

## Core reply principles
1. **Acknowledge first.** Before solving or redirecting, show you heard the person.
2. **Be specific.** Generic replies ("Thanks for your feedback!") signal a bot. Reference something in the comment.
3. **One action per reply.** Don't ask the person to do three things at once.
4. **Keep it short.** Comments are not support tickets. Three sentences max for public replies.

## Escalation rules
- Never promise a specific resolution in a public comment.
- Never share order numbers, account details, or prices in a public reply — move to DM or email.
- Use [placeholder] for any specific detail the team must fill in before sending.

## Placeholder conventions
- [NAME] — commenter's first name if visible
- [PRODUCT] — the specific product or service mentioned
- [CONTACT] — escalation contact (DM, email, link)
- [DATE] — a date range the team will fill in
- [DETAIL] — any specific detail that varies per reply

## De-escalation phrases (on-brand swaps)
| Corporate filler | Human alternative |
|------------------|-------------------|
| "We apologise for any inconvenience" | "That's really frustrating — I'm sorry you hit that." |
| "Thank you for your feedback" | "Genuinely appreciate you flagging this." |
| "Please be assured" | "Here's what we can do:" |

## Tone anchors by voice
- Warm & friendly: contractions, first names, a touch of warmth but never saccharine
- Professional: clear, direct, no slang — but still human
- Playful: wit allowed, but dial it back for complaints
- Empathetic: lead with feeling before logic; validate before solving
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'social-media-manager-community-replies-scenario-1',
        title: 'Reply templates for a restaurant\'s Instagram page',
        userInput:
          'Write reply templates for BurgerBarn, a casual burger joint on Instagram. Voice is Warm & friendly. ' +
          'We need templates for: positive review, complaint, and question about product. ' +
          'Escalate complaints to our DMs.',
        expectedBehavior:
          'Claude should produce three scenarios (positive review, complaint, product question), each with ' +
          '3 rotating variants. Every variant must sound warm and friendly — contractions, first-name use ' +
          'where appropriate, no corporate boilerplate. The complaint templates must de-escalate first, then ' +
          'redirect to DMs. The positive-review templates must reference something specific (using a placeholder) ' +
          'rather than being fully generic.',
        mustContain: ['BurgerBarn', 'Warm', 'positive review', 'complaint', 'DMs'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'social-media-manager-community-replies-scenario-2',
        title: 'Partnership request and spam templates for a software brand',
        userInput:
          'Create reply templates for DevFlow, a project management SaaS. Voice is Professional. ' +
          'We need templates for: partnership request and spam or irrelevant comment. ' +
          'Escalation contact is partnerships@devflow.io.',
        expectedBehavior:
          'Claude should produce two scenario blocks — partnership request and spam/irrelevant comment — ' +
          'each with 3 variants. Partnership request variants must be polite and direct the sender to the ' +
          'partnerships email without committing to a deal in the comment. Spam variants must neutrally ' +
          'dismiss or ignore without engaging the content or calling out the commenter publicly. ' +
          'All variants must sound professional, not automated.',
        mustContain: ['DevFlow', 'Professional', 'partnership', 'partnerships@devflow.io'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 6. Campaign Brief ─────────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-social-media-manager-campaign-brief-v1',
    slug: 'social-media-manager-campaign-brief',
    name: 'Campaign Brief',
    tagline: 'A structured social campaign brief your designers, writers, and agency can execute from',
    description:
      'Produces a complete campaign brief — objective, audience, key messages, platform plan, ' +
      'creative direction, timeline, and success metrics — in a format any creative partner can ' +
      'act on without a follow-up meeting. Keeps the brief scoped to what is in scope and flags what is not.',
    role: 'Social Media Manager',
    industry: 'Media & Creative',
    tags: [
      'campaign-brief',
      'campaign-planning',
      'creative-brief',
      'social-media',
      'marketing-strategy',
    ],
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

    instructionTemplate: `You are a social media campaign strategist for {{brandName}}.

Campaign name: {{campaignName}}
Campaign goal: {{campaignGoal}}
Target audience: {{targetAudience}}
Budget range: {{budget}}

Write a campaign brief that a creative team, an agency, or a freelancer can execute from without a follow-up call. Include:
1. Campaign objective (one sentence, tied to a measurable outcome)
2. Target audience (distilled from the description above — the most actionable version)
3. Key messages (3 max — what should someone remember after seeing this campaign?)
4. Platform and format plan (which platforms, which formats, how many posts/assets)
5. Creative direction (visual tone, copy tone, do's and don'ts)
6. Campaign timeline (phase names and relative durations — use weeks, not absolute dates)
7. Success metrics (2–3 KPIs tied to {{campaignGoal}})
8. Out of scope (explicitly list what this brief does not cover)

Rules:
1. The brief must be self-contained — no assumptions that the reader knows the brand context.
2. Never fabricate budgets, timelines, or benchmarks that were not provided. Use [TBD] for gaps.
3. Flag any conflict between the budget range and the scope described.
4. Keep it tight: a brief that runs longer than two pages is too long.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'The brand this campaign is for.',
        group: 'Campaign basics',
      },
      {
        key: 'campaignName',
        label: 'Campaign name',
        type: 'text',
        required: true,
        helpText:
          'The working name for this campaign — e.g. "Summer Glow 2026", "Product Launch Q3", "Back to School".',
        group: 'Campaign basics',
      },
      {
        key: 'campaignGoal',
        label: 'Campaign goal',
        type: 'select',
        options: [
          'Brand awareness',
          'Product launch',
          'Seasonal promotion',
          'Lead generation',
          'Community growth',
        ],
        default: 'Brand awareness',
        required: true,
        helpText: 'The primary business objective this campaign serves.',
        group: 'Campaign basics',
      },
      {
        key: 'targetAudience',
        label: 'Target audience',
        type: 'multiline',
        required: true,
        helpText:
          'Describe who this campaign is for: demographics, interests, pain points, and where they spend time online.',
        group: 'Campaign details',
      },
      {
        key: 'budget',
        label: 'Budget range',
        type: 'select',
        options: [
          'Under $1,000',
          '$1,000–$5,000',
          '$5,000–$20,000',
          'Over $20,000',
          'Not specified',
        ],
        default: 'Not specified',
        required: true,
        helpText:
          'Approximate budget. Claude will flag scope conflicts if the stated goal does not match the range.',
        group: 'Campaign details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Campaign brief template and brand context',
        purpose:
          'A fillable brief template and key brand context (voice, visual style, past campaign results) ' +
          'so every brief Claude produces is grounded in your brand\'s actual history and standards.',
        kind: 'starter',
        content: `# Campaign brief template and brand context

## Brand context (fill in before use)
- Brand positioning: [one sentence — what we are and for whom]
- Visual style: [e.g. "clean, minimal, warm tones; no stock photography"]
- Copy tone: [e.g. "direct, warm, no corporate jargon"]
- Past campaign that worked: [name + one line on why it worked]
- Past campaign that failed: [name + one line on why it failed]

## Campaign brief structure
### 1. Campaign objective
[One sentence, measurable outcome]

### 2. Target audience
[Distilled from the audience description — 3–5 bullet points maximum]

### 3. Key messages
1. [Message 1]
2. [Message 2]
3. [Message 3 — max 3]

### 4. Platform and format plan
| Platform | Format | Volume | Notes |
|----------|--------|--------|-------|
| [Platform] | [Format] | [Count] | [Any constraint] |

### 5. Creative direction
- Visual tone: ...
- Copy tone: ...
- Do: ...
- Don't: ...

### 6. Timeline (relative, in weeks)
- Week 1: Pre-launch / teaser
- Week 2–3: Launch
- Week 4: Wind-down / results collection

### 7. Success metrics
| KPI | Target | Tool |
|-----|--------|------|
| [KPI] | [TBD] | [Analytics tool] |

### 8. Out of scope
- [List explicitly]
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'social-media-manager-campaign-brief-scenario-1',
        title: 'Summer sale campaign brief for a fashion retailer',
        userInput:
          'Write a campaign brief for StyleNest\'s "End of Summer Edit" campaign. Goal is seasonal promotion. ' +
          'Target audience: millennial women who follow fashion influencers. Budget is $5,000–$20,000. ' +
          'We want to run it across Instagram and TikTok for 3 weeks.',
        expectedBehavior:
          'Claude should produce a complete campaign brief following the eight-section structure. ' +
          'The objective must be tied to a seasonal promotion outcome (e.g. sales volume or revenue lift). ' +
          'The platform plan must cover Instagram and TikTok with format and volume suggestions. ' +
          'KPIs should be relevant to a seasonal sale (e.g. conversion rate, click-through, revenue). ' +
          'The brief must flag any scope that exceeds the stated budget. No fabricated benchmarks.',
        mustContain: ['StyleNest', 'End of Summer Edit', 'Instagram', 'TikTok', 'seasonal promotion'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'social-media-manager-campaign-brief-scenario-2',
        title: 'Product launch brief for a DTC supplement brand',
        userInput:
          'Create a campaign brief for NovaBiotics\' launch of a new probiotic powder — campaign name "Gut Reset." ' +
          'Goal is product launch. Audience: health-conscious adults 30–50 who follow wellness creators on Instagram. ' +
          'Budget under $5,000.',
        expectedBehavior:
          'Claude should produce a brief covering all eight sections. The objective must relate to ' +
          'product launch metrics (awareness, trial, first purchase). The budget ($1,000–$5,000 range) ' +
          'should prompt a note about scope constraints — e.g. limiting paid spend or asset production. ' +
          'Creative direction must align with a wellness brand. No fabricated health claims about the ' +
          'probiotic product should appear.',
        mustContain: ['NovaBiotics', 'Gut Reset', 'probiotic', 'product launch', 'wellness'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 7. Engagement Report Summary ─────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-social-media-manager-engagement-report-v1',
    slug: 'social-media-manager-engagement-report',
    name: 'Engagement Report Summary',
    tagline: 'Turn raw social metrics into a plain-language summary stakeholders can actually act on',
    description:
      'Transforms a dump of social media metrics into a concise, readable report with ' +
      'trend callouts, wins, problem areas, and a short recommended action list. ' +
      'Written for non-technical stakeholders — no charts, no jargon, just what happened and what to do.',
    role: 'Social Media Manager',
    industry: 'Media & Creative',
    tags: ['analytics', 'reporting', 'engagement', 'metrics', 'social-media', 'roi', 'insights'],
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

    instructionTemplate: `You are a social media analyst for {{brandName}}.

Report period: {{reportPeriod}}.
Platforms covered: {{platforms}}.
Primary metric to highlight: {{primaryMetric}}.

When given a set of social metrics, produce a summary report in this structure:
1. Headline numbers — 3–4 metrics that tell the period's story in one glance
2. What worked — the 2–3 posts or tactics that outperformed, with a sentence on why
3. What to watch — the 1–2 metrics trending in the wrong direction, with a possible reason
4. Recommendations — 3 specific, actionable changes for the next period, tied to the data
5. Open questions — data gaps or anomalies that need a follow-up investigation

Rules:
1. Never invent numbers. If a metric is not in the data provided, say it is missing.
2. Percentage changes must be calculated from the numbers given — do not estimate.
3. Recommendations must be specific: "Post Reels on Tuesday and Thursday" not "post more video."
4. Write for a non-technical reader: no platform-specific jargon without a parenthetical definition.
5. Keep the summary under 400 words. Stakeholders who want detail will ask for it.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'The brand whose metrics are being summarised.',
        group: 'About your brand',
      },
      {
        key: 'reportPeriod',
        label: 'Report period',
        type: 'select',
        options: ['Weekly', 'Monthly', 'Quarterly'],
        default: 'Monthly',
        required: true,
        helpText: 'The time window these metrics cover.',
        group: 'Report details',
      },
      {
        key: 'platforms',
        label: 'Platforms covered',
        type: 'multiselect',
        options: ['Instagram', 'TikTok', 'LinkedIn', 'Facebook', 'X/Twitter'],
        default: ['Instagram'],
        required: true,
        helpText: 'Select every platform included in this report.',
        group: 'Report details',
      },
      {
        key: 'primaryMetric',
        label: 'Primary metric',
        type: 'select',
        options: [
          'Reach',
          'Engagement rate',
          'Follower growth',
          'Website clicks',
          'Conversions',
        ],
        default: 'Engagement rate',
        required: true,
        helpText: 'The single metric that matters most to your stakeholders this period.',
        group: 'Report details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Metrics glossary and reporting benchmarks',
        purpose:
          'A glossary of common social metrics and industry benchmark ranges so Claude\'s report ' +
          'can contextualise your numbers against realistic expectations — not just compare to last period.',
        kind: 'starter',
        content: `# Metrics glossary and reporting benchmarks

## Key metric definitions
- **Reach**: unique accounts that saw at least one of your posts in the period
- **Impressions**: total number of times your content was displayed (one account can generate multiple impressions)
- **Engagement rate**: (likes + comments + shares + saves) ÷ reach × 100
- **Follower growth rate**: (new followers − lost followers) ÷ starting follower count × 100
- **Website clicks**: link-in-bio or swipe-up clicks tracked via UTM or platform analytics
- **Conversions**: actions completed on your site that started from a social click (purchase, sign-up, etc.)
- **Save rate**: saves ÷ reach × 100 — high save rate = high perceived value

## Industry benchmark ranges (approximate, vary by niche and following size)
| Metric | Low | Average | Strong |
|--------|-----|---------|--------|
| Instagram engagement rate | < 1 % | 1–3 % | > 5 % |
| TikTok engagement rate | < 4 % | 4–8 % | > 10 % |
| LinkedIn engagement rate | < 1 % | 1–2 % | > 3 % |
| Follower growth rate (monthly) | < 1 % | 1–5 % | > 5 % |

## Report interpretation rules
- Always compare to the previous equivalent period (last month, not last week)
- A single viral post can skew averages — note outliers separately
- Reach and impressions drop is not always bad if conversion rate went up
- Fill in brand-specific baselines below:

## Brand baselines (fill in)
- Average monthly reach: [X]
- Average engagement rate: [X %]
- Average monthly follower growth: [X]
- Primary conversion goal: [purchase / sign-up / download]
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'social-media-manager-engagement-report-scenario-1',
        title: 'Monthly Instagram report summary for a retail brand',
        userInput:
          'Summarise this month\'s Instagram results for LuxeHome. ' +
          'Reach: 82,000 (up from 71,000 last month). Engagement rate: 3.2 % (up from 2.7 %). ' +
          'Follower growth: +420. Top post: a Reel showing kitchen styling tips (14,200 reach, 5.8 % ER). ' +
          'Worst performer: a product flatlay (1,100 reach, 0.6 % ER). Website clicks: 1,340.',
        expectedBehavior:
          'Claude should produce a five-section report (headline numbers, what worked, what to watch, ' +
          'recommendations, open questions) in under 400 words. The headline numbers must include reach, ' +
          'engagement rate, and follower growth. The Reel must be called out as the top performer with ' +
          'a reason. The flatlay underperformance should appear in "what to watch." Recommendations must ' +
          'be specific — e.g. "produce more Reels in the kitchen styling format." No invented numbers.',
        mustContain: ['LuxeHome', 'Reel', '3.2', 'engagement rate', 'website clicks'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'social-media-manager-engagement-report-scenario-2',
        title: 'Weekly LinkedIn summary for a B2B consultancy',
        userInput:
          'Summarise this week\'s LinkedIn results for StratEdge Consulting. ' +
          'Reach: 4,200. Engagement rate: 2.1 %. Follower growth: +38. ' +
          'Top post: a text post about hiring trends (1,800 reach, 4.3 % ER). ' +
          'Worst: a company update post (310 reach, 0.5 % ER). No website clicks tracked.',
        expectedBehavior:
          'Claude should write a concise weekly summary covering the five sections. The hiring-trends ' +
          'text post should anchor the "what worked" section with a note on why opinion-led content ' +
          'outperforms company updates on LinkedIn. The missing website clicks data should appear as an ' +
          'open question. Recommendations must be LinkedIn-specific and actionable.',
        mustContain: ['StratEdge', 'LinkedIn', 'hiring trends', 'engagement rate', 'website clicks'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 8. Influencer Outreach ────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-social-media-manager-influencer-outreach-v1',
    slug: 'social-media-manager-influencer-outreach',
    name: 'Influencer Outreach',
    tagline: 'First-touch messages that creators actually open — specific, respectful, and brand-right',
    description:
      'Drafts personalised first-contact outreach messages to creators or influencers for ' +
      'gifting, paid partnerships, ambassador, or affiliate collaborations. Built to feel like ' +
      'a human wrote it — referencing the creator\'s niche and keeping the ask clear up front.',
    role: 'Social Media Manager',
    industry: 'Media & Creative',
    tags: [
      'influencer-marketing',
      'creator-outreach',
      'partnership',
      'gifting',
      'brand-ambassador',
      'affiliate',
    ],
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

    instructionTemplate: `You are an influencer partnerships manager for {{brandName}}.

You are reaching out to creators in the {{creatorNiche}} space for a {{collaborationType}} collaboration.

Outreach tone: {{outreachTone}}. The message must feel like it was written by a real person who has seen the creator's work — not a bulk DM blast.

Produce 3 outreach message variants for the collaboration around {{productOrService}}. Each variant must:
- Open by referencing something specific about the creator's niche or content style (use a [CREATOR DETAIL] placeholder the team fills in)
- Name the brand and product clearly in the first 2 sentences
- State the collaboration type explicitly — what it is, what we are asking the creator to do
- Close with a clear next step (reply, book a call, or click a link)

Format:
Variant 1 (tone: {{outreachTone}}):
[message body — max 120 words]

Variant 2 (same tone, different angle):
[message body — max 120 words]

Variant 3 (shorter, optimised for DM on mobile):
[message body — max 60 words]

Rules:
1. Never fabricate follower counts, engagement rates, or past brand partnerships in the message.
2. Do not over-promise compensation or exclusivity unless the user specifies this.
3. The message must not read like a template — vary sentence structure across variants.
4. Respect the creator's time: get to the ask within the first 3 sentences.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'The brand the message is being sent on behalf of.',
        group: 'About your brand',
      },
      {
        key: 'productOrService',
        label: 'Product or service',
        type: 'text',
        required: true,
        helpText:
          'What you are promoting in this collaboration — e.g. "our new matcha powder", "our habit-tracking app".',
        group: 'Partnership details',
      },
      {
        key: 'collaborationType',
        label: 'Collaboration type',
        type: 'select',
        options: ['Gifting', 'Paid partnership', 'Brand ambassador', 'Affiliate'],
        default: 'Gifting',
        required: true,
        helpText: 'The commercial arrangement you are proposing.',
        group: 'Partnership details',
      },
      {
        key: 'creatorNiche',
        label: 'Creator niche',
        type: 'text',
        required: true,
        helpText:
          'The content space this creator operates in — e.g. "sustainable living", "tech reviews", "fitness motivation".',
        group: 'Partnership details',
      },
      {
        key: 'outreachTone',
        label: 'Outreach tone',
        type: 'select',
        options: ['Formal', 'Casual & friendly', 'Enthusiastic'],
        default: 'Casual & friendly',
        required: true,
        helpText: 'The overall register of the message.',
        group: 'Partnership details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Influencer outreach playbook',
        purpose:
          'A reference card with outreach best practices, compensation range guidance, and ' +
          'follow-up cadence — so every message is optimised for reply rate, not just sent.',
        kind: 'starter',
        content: `# Influencer outreach playbook

## What makes a creator open and reply
1. **Specific reference to their work.** Mention a post, a series, or a topic they cover. Do not say "I love your content."
2. **Clear ask in the first 2 sentences.** State the brand, the product, and the collaboration type immediately.
3. **Respect their time.** The message should take under 30 seconds to read. Long pitches get skipped.
4. **A clear next step.** End with one action — not three options.

## Collaboration type quick guide
| Type | What it means | What to include in the ask |
|------|---------------|---------------------------|
| Gifting | Send product in exchange for an honest post (if they choose) | Mention there is no obligation to post |
| Paid partnership | Agreed fee for agreed deliverables | State deliverable count (e.g. "1 Reel, 3 Stories") |
| Brand ambassador | Ongoing relationship, usually 3–12 months | Mention the term and rough commitment level |
| Affiliate | Performance-based commission on tracked sales | Name the commission % and tracking method |

## Compensation ranges (fill in or leave as [TBD])
- Micro-influencer (10 k–50 k): $[X]–$[Y] per post
- Mid-tier (50 k–500 k): $[X]–$[Y] per post
- Macro (500 k+): $[X]–$[Y] per post

## Follow-up cadence
- First outreach: [Day 1]
- First follow-up: [Day 5] — one short sentence, no new pitch
- Second follow-up: [Day 10] — final, then close the thread

## [CREATOR DETAIL] placeholder convention
When Claude writes a [CREATOR DETAIL] placeholder, the team should fill in:
- A specific recent post title or topic
- A content series the creator runs
- A value or opinion the creator often expresses
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'social-media-manager-influencer-outreach-scenario-1',
        title: 'Gifting outreach to a micro-influencer for a beauty brand',
        userInput:
          'Write outreach messages for GlowLab reaching out to skincare micro-influencers on Instagram ' +
          'for a gifting collaboration on our new Hydra-Boost moisturiser. Tone is Casual & friendly.',
        expectedBehavior:
          'Claude should produce 3 variants — two full-length (under 120 words) and one DM-short ' +
          '(under 60 words). Each variant must open with a [CREATOR DETAIL] placeholder, name GlowLab ' +
          'and the Hydra-Boost moisturiser within the first 2 sentences, state that this is a gifting ' +
          'collaboration (with no obligation to post), and close with a clear next step. Tone must be ' +
          'casual and friendly throughout — no formal salutations. No fabricated follower counts.',
        mustContain: ['GlowLab', 'Hydra-Boost', 'gifting', '[CREATOR DETAIL]', 'Casual'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'social-media-manager-influencer-outreach-scenario-2',
        title: 'Paid partnership outreach for a productivity app targeting tech creators',
        userInput:
          'Write outreach messages from FocusStack to tech and productivity YouTube creators for a paid partnership. ' +
          'We want 1 integration video and 2 community posts per creator. Tone: Enthusiastic. ' +
          'Product: our AI-powered focus timer app.',
        expectedBehavior:
          'Claude should produce 3 message variants. Each must mention FocusStack, the AI-powered focus timer app, ' +
          'and clearly state the deliverables (1 video integration, 2 community posts). The paid partnership ' +
          'arrangement must be named explicitly. Tone must be enthusiastic without feeling like spam. ' +
          'Compensation details should use [TBD] or ask the user to fill them in. No invented stats.',
        mustContain: ['FocusStack', 'paid partnership', 'focus timer', '1 integration', '2 community'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 9. Post A/B Variants ──────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-social-media-manager-ab-variants-v1',
    slug: 'social-media-manager-ab-variants',
    name: 'Post A/B Variants',
    tagline: 'Structured post variants that isolate one variable so your tests actually teach you something',
    description:
      'Generates 2 or 3 post variants that differ on exactly one testable dimension — hook, CTA, ' +
      'tone, or caption angle. Each variant is labelled and documented so the test result is ' +
      'interpretable: you know why one variant won.',
    role: 'Social Media Manager',
    industry: 'Media & Creative',
    tags: [
      'ab-testing',
      'post-variants',
      'copy-testing',
      'caption',
      'social-media',
      'optimization',
      'conversion',
    ],
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

    instructionTemplate: `You are a social media copy tester for {{brandName}}.

Platform: {{platform}}. All variants must be formatted for this platform's norms.

Post purpose: {{postPurpose}}. Every variant must serve the same underlying goal — only the test element changes.

Number of variants: {{numberOfVariants}}.

Test element: {{testElement}}. This is the ONLY dimension that changes across variants. Everything else — the product, the CTA, the core message — stays identical. A test that changes two things teaches you nothing.

For each variant:
Label: Variant [letter] — [what is different about this one]
Post copy: [finished post copy, platform-appropriate length]
Hypothesis: [one sentence — why this version might outperform the others]

After the variants, add a short testing note:
- What metric to use to declare a winner
- Minimum run time before reading results (to avoid premature conclusions)

Rules:
1. Isolate one variable only. If the user asks to test two things, produce two separate A/B sets.
2. Never fabricate expected performance numbers.
3. Every variant must be a complete, ready-to-post caption — not a direction note.
4. Stay on-brand: all variants must sound like {{brandName}}, not generic post copy.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'Your brand name, so variants stay on-brand.',
        group: 'About your brand',
      },
      {
        key: 'platform',
        label: 'Platform',
        type: 'select',
        options: ['Instagram', 'LinkedIn', 'Facebook', 'X/Twitter', 'TikTok'],
        default: 'Instagram',
        required: true,
        helpText: 'The platform these variants will run on.',
        group: 'Test details',
      },
      {
        key: 'postPurpose',
        label: 'Post purpose',
        type: 'text',
        required: true,
        helpText:
          'What this post is trying to achieve — e.g. "drive link-in-bio clicks", "increase saves", "promote our summer sale".',
        group: 'Test details',
      },
      {
        key: 'numberOfVariants',
        label: 'Number of variants',
        type: 'select',
        options: ['2', '3'],
        default: '2',
        required: true,
        helpText: '2 variants is the minimum for a clean A/B test. 3 variants require a larger audience to reach significance.',
        group: 'Test details',
      },
      {
        key: 'testElement',
        label: 'Element to test',
        type: 'select',
        options: ['Caption angle', 'Call to action', 'Tone', 'Opening hook'],
        default: 'Opening hook',
        required: true,
        helpText: 'The single dimension that changes across variants. Only one thing should differ.',
        group: 'Test details',
      },
    ],

    knowledgeFiles: [
      {
        name: 'A/B testing guide for social posts',
        purpose:
          'A reference card covering test design principles, minimum sample sizes, and how to ' +
          'read results — so every test you run produces a usable insight, not just noise.',
        kind: 'starter',
        content: `# A/B testing guide for social posts

## Core rule of social A/B testing
**Change exactly one thing.** If two variants differ in hook AND CTA, you cannot know which change drove the result.

## Testable elements and what they reveal
| Element | What you learn |
|---------|----------------|
| Opening hook | Which angle gets more clicks/watch-time |
| Call to action | Which ask drives more of the desired action |
| Tone | Whether your audience prefers formal or casual for this topic |
| Caption angle | Which framing of the same message resonates more |

## Sample size and run time
- Minimum impressions per variant before reading results: ~1,000
- Minimum run time: 48–72 hours (to capture different posting-time audiences)
- Do not read results mid-run — early data is misleading

## How to pick a winner
- Define the primary metric before you run the test (not after)
- Common primary metrics: engagement rate, link clicks, saves, profile visits
- A winner needs at least a 10 % relative difference to be worth acting on

## What to do with the winner
- Roll the winning element into your default template for that post type
- Document the losing variant and your hypothesis about why it lost
- Run the next test with the winner as the new baseline

## Common mistakes
- Running variants at different times of day (confounds the test)
- Declaring a winner too early (under 48 h or under 500 impressions)
- Testing two things at once
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'social-media-manager-ab-variants-scenario-1',
        title: 'Two Instagram caption variants testing the opening hook for a product promotion',
        userInput:
          'Write 2 Instagram caption variants for NovaBrew coffee to test the opening hook. ' +
          'Post purpose: drive link-in-bio clicks to shop our cold brew kit. ' +
          'Keep the CTA identical across both: "Shop the link in bio."',
        expectedBehavior:
          'Claude should produce 2 variants, each labelled with the hook type used and a one-sentence ' +
          'hypothesis. The only difference between variants must be the opening hook — the product, ' +
          'CTA ("Shop the link in bio"), and core message must stay identical. Each variant must be ' +
          'a complete, ready-to-post Instagram caption. The testing note at the end must name the ' +
          'primary metric (link clicks) and a minimum run time.',
        mustContain: ['NovaBrew', 'cold brew', 'opening hook', 'link in bio', 'Variant'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'social-media-manager-ab-variants-scenario-2',
        title: 'Three LinkedIn caption variants testing tone for a thought leadership post',
        userInput:
          'Generate 3 LinkedIn caption variants for StratEdge Consulting testing tone. ' +
          'Post purpose: increase post saves and comments on a hiring-trends article. ' +
          'Use the same core message and opening line across all three.',
        expectedBehavior:
          'Claude should produce 3 variants, each with a label indicating the tone (e.g. Authoritative, ' +
          'Conversational, Provocative) and a one-sentence hypothesis. The opening line must be identical ' +
          'across all three, with only the tone changing in the body and CTA phrasing. Each variant must ' +
          'be a complete LinkedIn caption. The testing note must name saves and comments as the metrics ' +
          'and specify a run time of at least 48 hours.',
        mustContain: ['StratEdge', 'tone', 'hiring', 'saves', 'Variant'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },

  // ── 10. Trend Angle Finder ────────────────────────────────────────────────────
  {
    kind: 'setup',
    id: 'pro-skill-social-media-manager-trend-angles-v1',
    slug: 'social-media-manager-trend-angles',
    name: 'Trend Angle Finder',
    tagline: 'Find the brand-relevant angle on a trending topic before the moment passes',
    description:
      'Takes a current trend, meme, or news event and identifies the most credible, on-brand ' +
      'angles your account can use. Filters out angles that would feel forced or damage brand ' +
      'trust, and surfaces the 2–3 that are worth executing right now.',
    role: 'Social Media Manager',
    industry: 'Media & Creative',
    tags: [
      'trending-topics',
      'newsjacking',
      'content-strategy',
      'social-media',
      'brand-relevance',
      'real-time-marketing',
    ],
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

    instructionTemplate: `You are a real-time content strategist for {{brandName}}, a brand in the {{industry}} space.

Brand personality: {{brandPersonality}}. Only angles that are authentic to this personality should be recommended. An angle that requires {{brandName}} to act out of character is not worth the engagement.

Platforms: {{platforms}}.

Current trend to analyse: {{currentTrend}}.

Your output:
1. Trend summary — what is this trend about and why is it spreading? (3–4 sentences)
2. Brand-fit score — rate the fit between this trend and {{brandName}} on a scale of 1–5, with a one-line reason
3. Recommended angles (max 3) — for each angle:
   - Angle name (3–5 words)
   - Platform best suited for this angle
   - Post format (Reel, text post, carousel, etc.)
   - One-sentence pitch: why this specific angle works for {{brandName}}
   - Risk flag: any reason this angle could misfire
4. Angles to avoid — 1–2 approaches that would feel forced or off-brand for {{brandName}}, with a brief reason

Rules:
1. Never recommend an angle that requires {{brandName}} to comment on politics, religion, or tragedy — unless {{industry}} makes that unavoidable and the brand has a stated position.
2. Flag if the trend is too early (still evolving) or too late (peak already passed).
3. Never fabricate trend data, search volume, or engagement predictions.
4. If the trend has no credible brand-fit angle, say so clearly instead of stretching to find one.`,

    variables: [
      {
        key: 'brandName',
        label: 'Brand name',
        type: 'text',
        required: true,
        helpText: 'Your brand name. Only angles authentic to this brand will be recommended.',
        group: 'About your brand',
      },
      {
        key: 'industry',
        label: 'Industry or niche',
        type: 'text',
        required: true,
        helpText:
          'The space your brand operates in — e.g. "sustainable beauty", "fintech", "fitness apparel".',
        group: 'About your brand',
      },
      {
        key: 'currentTrend',
        label: 'Current trend',
        type: 'text',
        required: true,
        helpText:
          'The trend, meme, viral moment, or news topic you want to evaluate — e.g. "the quiet luxury aesthetic", "AI art backlash", "Brat Summer".',
        group: 'Trend details',
      },
      {
        key: 'platforms',
        label: 'Platforms',
        type: 'multiselect',
        options: ['Instagram', 'TikTok', 'LinkedIn', 'X/Twitter'],
        default: ['Instagram', 'TikTok'],
        required: true,
        helpText: 'The platforms where you might use this trend.',
        group: 'Trend details',
      },
      {
        key: 'brandPersonality',
        label: 'Brand personality',
        type: 'select',
        options: ['Authoritative', 'Playful', 'Inspirational', 'Educational', 'Relatable'],
        default: 'Relatable',
        required: true,
        helpText: 'The dominant personality trait of your brand. Angles will be filtered to match.',
        group: 'About your brand',
      },
    ],

    knowledgeFiles: [
      {
        name: 'Brand trend filter and personality guide',
        purpose:
          'A reference card with your brand\'s content red lines, personality anchors, and past ' +
          'examples of trend participation that worked or failed — so Claude evaluates fit, not just virality.',
        kind: 'starter',
        content: `# Brand trend filter and personality guide

## Brand red lines (fill in — these are trends or topics we never touch)
- We never comment on: [e.g. party politics, religious topics, competitor controversies]
- We never use humour about: [e.g. mental health, personal finance struggles]
- We never jump on: [e.g. tragedy-adjacent memes, polarising social movements]

## Personality anchors (fill in for your brand)
- We always sound: [e.g. warm, direct, a bit self-aware]
- We never sound: [e.g. preachy, desperate to seem young, corporate]
- Our tone on trends: [e.g. "we engage if it fits naturally; we never force it"]

## Past trend examples
| Trend | Did we participate? | Result | What we learned |
|-------|--------------------|---------|--------------—--|
| [Trend name] | Yes / No | [Good / Poor] | [One sentence] |

## Trend timing guide
- Early (< 48 h trending): high reward, high execution risk — move fast or skip
- Peak (day 2–5): largest audience, most competition — angle must be tight
- Late (week 2+): mostly pass unless you have a genuinely fresh take
- Evergreen spin-off: a trend that has spawned a lasting format (e.g. "POV" videos)

## Brand-fit scoring guide
| Score | Meaning |
|-------|---------|
| 5 | Perfect fit — feels natural, no stretch required |
| 4 | Good fit — minor adaptation needed |
| 3 | Possible — requires a clever angle to avoid feeling forced |
| 2 | Weak fit — risk of looking opportunistic |
| 1 | No fit — skip entirely |
`,
        required: true,
      },
    ],

    scenarios: [
      {
        id: 'social-media-manager-trend-angles-scenario-1',
        title: 'Brand angles on a viral fitness challenge for a gym-wear brand',
        userInput:
          'Evaluate the "75 Hard Challenge" trend for ActiveForm, a fitness apparel brand. ' +
          'Industry is fitness apparel. Brand personality is Inspirational. Platforms: Instagram and TikTok.',
        expectedBehavior:
          'Claude should produce a trend summary (3–4 sentences explaining 75 Hard), a brand-fit score ' +
          '(1–5) with a one-line rationale, up to 3 recommended angles each with platform, format, pitch, ' +
          'and a risk flag, and 1–2 angles to avoid. Angles must be authentic to an Inspirational fitness ' +
          'apparel brand — they should not require ActiveForm to make health claims or mock the challenge. ' +
          'No fabricated engagement statistics.',
        mustContain: ['ActiveForm', '75 Hard', 'Instagram', 'TikTok', 'Inspirational'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
      {
        id: 'social-media-manager-trend-angles-scenario-2',
        title: 'Trend angles on AI job-displacement discourse for a financial planning firm',
        userInput:
          'Analyse the "AI will replace white-collar jobs" trending topic for WealthPath Financial. ' +
          'Industry is personal finance. Brand personality is Authoritative. Platforms: LinkedIn and X/Twitter.',
        expectedBehavior:
          'Claude should produce a trend summary contextualising the AI job discourse, a brand-fit score ' +
          'with rationale, and up to 3 angles appropriate for an authoritative personal finance brand on ' +
          'LinkedIn and X/Twitter. At least one angle should address the financial planning implications of ' +
          'career disruption — a natural fit. Angles requiring WealthPath to take a political stance on AI ' +
          'policy should appear in the "angles to avoid" section. No fabricated statistics.',
        mustContain: ['WealthPath', 'AI', 'LinkedIn', 'Authoritative', 'financial'],
        mustNotContain: ['I cannot help', 'As an AI'],
      },
    ],

    artifactFiles: [],
    repoUrl: null,
    capabilities: [],
  },
];
