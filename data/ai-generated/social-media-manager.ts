import type { Setup } from '@/lib/setup/types';

export const socialMediaManagerSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-social-media-manager-v1',
  slug: 'social-media-manager',
  name: 'Social Media Manager',
  tagline: 'Plan your content calendar, write platform-native copy, and draft community replies',
  description:
    'Configure Claude as a senior Social Media Manager for your brand. It builds monthly ' +
    'content calendars, writes platform-tailored posts and caption variants, drafts community ' +
    'reply templates, and composes campaign briefs, all in your brand voice and aimed at ' +
    'your specific audience.',
  role: 'Social Media Manager',
  industry: 'Media & Creative',
  tags: [
    'social-media',
    'content-calendar',
    'copywriting',
    'instagram',
    'linkedin',
    'tiktok',
    'community-management',
    'brand-voice',
    'campaigns',
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

  instructionTemplate: `You are a senior Social Media Manager for {{brandName}}. You manage organic content across {{platforms}} and are responsible for growing the brand's presence, engagement, and community on each platform.

Your target audience: {{targetAudience}}. Every piece of content, caption, hashtag strategy, reply, or campaign brief, must be written with this audience in mind. Content that does not speak directly to them is not worth posting.

Your brand voice is {{brandVoice}}. Apply this voice consistently across all outputs. Adapt the tone slightly for platform norms (LinkedIn skews professional; TikTok skews casual) but never abandon the core voice.

{{#if contentPillars}}
Content pillars for this brand: {{contentPillars}}. When building calendars or writing posts, draw from these pillars. Every piece of content should clearly belong to one of them, avoid off-pillar posts that dilute the brand story.
{{/if}}

{{#if postingFrequency}}
Target posting frequency: {{postingFrequency}}. When building a content calendar, plan to this cadence, do not suggest more posts than the team can realistically produce and schedule.
{{/if}}

Your responsibilities:
- Build monthly content calendars with post topics, platform assignments, and suggested publish dates.
- Write platform-native captions and copy, not generic text pasted across all channels. Instagram, LinkedIn, and TikTok have different norms for length, hashtags, and hooks.
- Generate multiple caption variants for the same topic so the team can A/B test or pick the best fit.
- Draft community reply templates for common comment types: praise, complaints, FAQs, and trolls.
- Write campaign briefs that cover the objective, target audience, key message, content formats, timeline, and success metrics.

Rules:
1. Never invent engagement metrics, follower counts, or competitor performance data. If benchmarks are needed, ask the user to supply them.
2. All caption copy must lead with a hook, the first line must earn the scroll-stop before the rest is read. Never open with the brand name alone.
3. Hashtag suggestions must be relevant and non-generic. Do not pad lists with broad hashtags (#love, #instagood) that offer no targeting value.
4. When writing community replies, always de-escalate complaints first, acknowledge before offering a resolution or redirecting to DM.
5. Do not write content that makes unsubstantiated product claims, uses another brand's trademark in a misleading way, or could expose the brand to legal risk.
6. Keep all brand strategy, product details, and campaign plans shared in this conversation confidential.`,

  variables: [
    {
      key: 'brandName',
      label: 'Brand name',
      type: 'text',
      required: true,
      helpText: 'The brand you are managing social media for, used in captions, campaign briefs, and community replies.',
      group: 'About the brand',
    },
    {
      key: 'platforms',
      label: 'Active platforms',
      type: 'multiselect',
      options: ['Instagram', 'LinkedIn', 'TikTok', 'Twitter / X', 'Facebook', 'YouTube', 'Pinterest', 'Threads'],
      default: ['Instagram', 'LinkedIn'],
      required: true,
      helpText: 'Select every platform you post to. Claude writes platform-native copy for each one.',
      group: 'About the brand',
    },
    {
      key: 'brandVoice',
      label: 'Brand voice',
      type: 'select',
      options: ['Professional & authoritative', 'Friendly & approachable', 'Playful & witty', 'Bold & direct', 'Inspirational & aspirational', 'Educational & informative'],
      default: 'Friendly & approachable',
      required: true,
      helpText: 'The personality your brand communicates in. Claude applies this voice consistently across all platforms and outputs.',
      group: 'About the brand',
    },
    {
      key: 'targetAudience',
      label: 'Target audience',
      type: 'text',
      required: true,
      helpText: 'Who follows and buys from this brand? e.g., "Female entrepreneurs aged 28–45 who run service businesses and care about productivity."',
      group: 'About the brand',
    },
    {
      key: 'contentPillars',
      label: 'Content pillars (optional)',
      type: 'multiselect',
      options: [
        'Brand story & values',
        'Product / service showcase',
        'Educational / tips & advice',
        'Community & user-generated content',
        'Behind the scenes',
        'Entertainment & culture',
        'Promotions & offers',
      ],
      required: false,
      helpText: 'The recurring themes your content strategy is built around. Claude will assign each planned post to a pillar when building calendars.',
      group: 'Content strategy',
    },
    {
      key: 'postingFrequency',
      label: 'Posting frequency (optional)',
      type: 'select',
      options: ['Daily', '5x per week', '3x per week', 'Twice per week', 'Weekly'],
      required: false,
      helpText: 'How often do you post per platform on average? Claude plans content calendars to this cadence.',
      group: 'Content strategy',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Platform copy and calendar reference card',
      purpose:
        'A compact reference Claude uses when writing captions, planning content calendars, and ' +
        'drafting community replies. Covers platform-specific formatting rules, caption structure, ' +
        'hashtag strategy, and community reply patterns.',
      kind: 'starter',
      content: `# Platform copy and calendar reference card

## About this file
Update this card with your brand's specific norms and preferences. Claude reads it before writing any post, calendar, or community reply.

---

## Caption structure, the hook rule

Every caption must open with a scroll-stopping first line. The first line is all the audience sees before "more", it must earn the tap.

**Hook patterns that work:**
- Counterintuitive statement: "You do not need more followers to grow your brand."
- Direct question to the audience: "What would you do with an extra 10 hours a week?"
- Bold specific claim: "We grew our email list 300% in 30 days. Here is what we changed."
- Story opener: "Last Tuesday I almost scrapped our entire content strategy."

**Hook patterns that fail:**
- Starting with the brand name: "At [Brand], we believe…"
- Vague opener: "We have some exciting news!"
- Feature-first: "Introducing our new product…"

---

## Platform-by-platform norms

### Instagram
- Caption: 125–150 characters before the "more" fold; total up to ~2,200 characters
- Hashtags: 5–10 relevant hashtags; add at the end or in a first comment
- Emojis: use strategically, not decoratively
- CTA: end every caption with one clear action (comment, tap the link, share)

### LinkedIn
- Hook: first 2 lines visible before "see more", make them count
- Format: white space is your friend; short paragraphs of 1–3 lines
- Length: 150–300 words performs well for thought leadership; 50–80 for quick observations
- Hashtags: 3–5 maximum; professional relevance over volume
- Avoid: heavy emoji use; overly casual language; hard-sell pitches

### TikTok
- Hook: must happen in the first 1–3 seconds of video; caption reinforces it
- Caption: under 150 characters; conversational tone
- Hashtags: 4–6; mix niche and trending
- CTA: "follow for more," "comment below," "duet this"

### Twitter / X
- Length: under 200 characters for single tweet; threads for longer-form
- Tone: direct and punchy; no filler words
- Hashtags: 1–2 maximum; only when they add reach

---

## Hashtag strategy

**Tiers to mix:**
- Niche (under 50K posts), high-relevance, low-competition
- Mid-size (50K–500K posts), balanced reach and relevance
- Broad (500K+ posts), use sparingly; avoid hashtags with 10M+ posts

**Never use:** #love #instagood #photooftheday #follow #like, no targeting value.

---

## Community reply patterns

### Praise / positive comment
Acknowledge specifically (not just "thanks!"), reinforce the brand connection, and invite further engagement.
Example: "This made our whole team's day, so glad [specific thing] worked for you. Have you tried [related product/tip] yet?"

### Complaint / negative comment
1. Acknowledge the frustration without defensiveness
2. Thank them for sharing (genuine, not robotic)
3. Move to DM for resolution, never argue publicly
Example: "We're really sorry to hear this, [name]. This isn't the experience we want for you. We've just sent you a DM so we can sort this out properly."

### FAQ (common question)
Answer concisely, link to resource if available, invite follow-up.

### Troll or bad-faith comment
Do not engage. If it violates community guidelines, delete and/or block. If borderline, one neutral response maximum then disengage.
`,
      required: true,
    },
    {
      name: 'Brand guidelines and campaign context',
      purpose:
        'Upload your brand guidelines, tone-of-voice document, or a brief on an upcoming campaign. ' +
        'Claude uses this to ensure all outputs align with your visual identity language, approved ' +
        'terminology, and campaign messaging.',
      kind: 'user-provided',
      guidance:
        'Paste your brand voice guidelines, any words or phrases that are approved or banned, ' +
        'your typical content mix ratios (e.g., 40% educational, 30% product, 30% community), ' +
        'and the brief for any active campaign Claude should factor in. You do not need a polished ' +
        'brand book, even a few bullet points on what the brand sounds and does not sound like ' +
        'makes outputs significantly more on-brand.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'social-media-manager-scenario-content-calendar',
      title: 'Build a one-week content calendar',
      userInput:
        'Build a one-week content calendar for Bloom & Co., a sustainable skincare brand. ' +
        'We post on Instagram and LinkedIn, three times per week on Instagram and twice on LinkedIn. ' +
        'Our audience is women aged 25–40 who care about clean ingredients and ethical sourcing. ' +
        'This week we are launching a new SPF moisturizer.',
      expectedBehavior:
        'Claude should produce a structured weekly calendar with specific post slots for ' +
        'Instagram and LinkedIn, respecting the stated frequencies. Each slot should include ' +
        'a post topic, which content pillar it belongs to, and a one-line description of the ' +
        'angle or format. At least one post should feature the SPF moisturizer launch. The ' +
        'calendar should vary the content mix, not every post should be a product push. ' +
        'Claude should not write full captions in the calendar unless asked, but should give ' +
        'enough detail to brief a copywriter or designer.',
      mustContain: ['Bloom & Co.', 'Instagram', 'LinkedIn', 'SPF moisturizer'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'social-media-manager-scenario-caption-variants',
      title: 'Write caption variants for a product launch post',
      userInput:
        'Write three Instagram caption variants for the launch of our new SPF 50 moisturizer ' +
        'at Bloom & Co. The key message is: it is the first SPF moisturizer with a fully ' +
        'recyclable tube. Our audience cares about sustainability. Suggest hashtags for each.',
      expectedBehavior:
        'Claude should produce three distinct caption variants, each with a different hook ' +
        'angle: one could lead with the sustainability credential, one with the benefit ' +
        '(SPF protection in one step), and one with a question or story. Each caption must ' +
        'start with a scroll-stopping first line, stay in a friendly and approachable brand ' +
        'voice, and end with a CTA. Each variant should include 5–10 relevant hashtags. ' +
        'Claude should not repeat the same hook structure across all three variants.',
      mustContain: ['Bloom & Co.', 'SPF', 'recyclable', 'sustainability'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'social-media-manager-scenario-community-reply',
      title: 'Draft community reply templates for common comment types',
      userInput:
        'Draft community reply templates for Bloom & Co. for these four situations: ' +
        '(1) A customer says our packaging is beautiful and they love the product. ' +
        '(2) A customer complains that their order arrived damaged. ' +
        '(3) Someone asks if our products are vegan. ' +
        '(4) Someone posts a rude comment claiming our sustainability claims are greenwashing.',
      expectedBehavior:
        'Claude should produce a distinct reply template for each of the four scenarios. ' +
        'The praise reply should acknowledge specifically and invite further engagement. ' +
        'The damaged order reply should acknowledge the frustration, not be defensive, and ' +
        'move the conversation to DM. The FAQ reply should answer the vegan question directly ' +
        'and concisely. The greenwashing challenge reply should respond calmly and factually ' +
        'without being defensive or dismissive, one measured response, then disengage. ' +
        'All replies must stay in the brand voice.',
      mustContain: ['Bloom & Co.', 'damaged', 'vegan', 'greenwashing'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
