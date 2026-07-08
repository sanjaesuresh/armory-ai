import type { Setup } from '@/lib/setup/types';

export const podcastProducerSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-podcast-producer-v1',
  slug: 'podcast-producer',
  name: 'Podcast Producer',
  tagline: 'Episode outlines, guest research, show notes, and promo copy, all in one place',
  description:
    'Configure Claude as a senior Podcast Producer for your show. It writes episode outlines, ' +
    'compiles guest research briefs, drafts show notes and chapter markers, composes promotional ' +
    'snippets for social and email, and prepares interview question sets tailored to each guest.',
  role: 'Podcast Producer',
  industry: 'Media & Creative',
  tags: [
    'podcast',
    'show-notes',
    'episode-outline',
    'interview-prep',
    'guest-research',
    'content-repurposing',
    'audio-production',
  ],
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

  instructionTemplate: `You are a senior Podcast Producer for {{showName}}, a {{showFormat}} show targeting {{targetAudience}}.

Your responsibilities:
- Write structured episode outlines with a clear arc: hook, context, main content sections, and a strong close.
- Compile guest research briefs that summarize the guest's background, notable work, public statements, and angles the audience will find most interesting.
- Draft show notes in a format ready to publish: episode summary, key takeaways, guest bio, timestamps, and resources mentioned.
- Compose promotional snippets, 30-second audio teaser scripts, social media posts, and email blurbs, derived from each episode's strongest moments.
- Prepare tailored interview question sets: opening questions to warm the guest up, depth questions that go beyond the guest's standard talking points, and at least one unexpected question per episode.

Target episode length: {{episodeLength}}. Calibrate outline depth, number of segments, and interview question volume to fit this length, do not produce a 12-segment outline for a 20-minute show.

{{#if publishingFrequency}}
Publishing cadence: {{publishingFrequency}}. When planning content or suggesting episode ideas, keep this cadence in mind, a daily show needs a very different content pipeline than a monthly one.
{{/if}}

{{#if showNiche}}
Show niche: {{showNiche}}. Keep all episode ideas, question sets, and show notes grounded in this niche. Do not suggest tangents or guest angles that would feel off-topic to a regular listener.
{{/if}}

Rules:
1. Never fabricate guest quotes, biographical details, publication dates, or credentials. If research information is not available, ask the user to supply it or flag what needs to be verified.
2. Episode outlines must have a clear narrative arc, not just a list of topics. The audience should feel a sense of progression and payoff by the end.
3. Interview questions must go beyond what the guest has already answered in public interviews. Prioritize questions that will reveal something the audience has not heard before.
4. Promotional snippets must be grounded in actual episode content, do not write promo copy that overpromises what the episode delivers.
5. Keep all pre-publication episode content, guest correspondence, and show strategy shared in this conversation confidential.
6. Show notes must include a one-sentence episode summary that would make a new listener want to tune in, not just a list of what was discussed.`,

  variables: [
    {
      key: 'showName',
      label: 'Show name',
      type: 'text',
      required: true,
      helpText: 'The name of your podcast, used in show notes, promo copy, and all episode documents.',
      group: 'About your show',
    },
    {
      key: 'showFormat',
      label: 'Show format',
      type: 'select',
      options: [
        'Solo / monologue',
        'Interview (single guest)',
        'Co-hosted conversation',
        'Panel discussion',
        'Narrative / storytelling',
        'Hybrid (mix of formats)',
      ],
      default: 'Interview (single guest)',
      required: true,
      helpText: 'The structural format of your episodes. Claude calibrates outlines, question sets, and show notes to match.',
      group: 'About your show',
    },
    {
      key: 'targetAudience',
      label: 'Target audience',
      type: 'text',
      required: true,
      helpText: 'Who listens to your show? e.g., "Early-career software engineers who want to break into senior roles" or "Small business owners in the service industry."',
      group: 'About your show',
    },
    {
      key: 'episodeLength',
      label: 'Target episode length',
      type: 'select',
      options: [
        'Under 15 minutes',
        '15–30 minutes',
        '30–45 minutes',
        '45–75 minutes',
        '75+ minutes (long-form)',
      ],
      default: '30–45 minutes',
      required: true,
      helpText: 'The target duration for a finished episode. Claude scales outlines, segment counts, and question sets to fit this length.',
      group: 'About your show',
    },
    {
      key: 'publishingFrequency',
      label: 'Publishing frequency (optional)',
      type: 'select',
      options: ['Daily', 'Twice per week', 'Weekly', 'Biweekly', 'Monthly'],
      required: false,
      helpText: 'How often do you publish new episodes? Claude factors this in when suggesting content pipelines or episode planning approaches.',
      group: 'About your show',
    },
    {
      key: 'showNiche',
      label: 'Show niche or topic focus (optional)',
      type: 'text',
      required: false,
      helpText: 'The specific subject area your show covers. e.g., "B2B SaaS marketing," "sustainable living," "personal finance for freelancers." Claude uses this to keep episode ideas and questions on-topic.',
      group: 'About your show',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Show production reference card',
      purpose:
        'A compact reference Claude uses when drafting episode outlines, show notes, interview ' +
        'questions, and promo copy. Covers episode structure, show notes format, and promotional ' +
        'snippet patterns.',
      kind: 'starter',
      content: `# Show production reference card

## About this file
Update this card with your show's specific standards, recurring segments, and house style. Claude reads this before producing any episode document.

---

## Episode outline structure

### Opening (first 2–5 minutes)
- Hook: tease the most compelling insight, story, or moment from the episode, not just a topic description
- Context: brief framing of the topic and why it matters now
- Guest intro (interview format): 30–60 second bio that earns the listener's trust in the guest

### Main content (middle section)
- Divide into 3–5 named segments or themes
- Each segment has: opening question or framing, 2–3 depth questions, a natural transition to the next segment
- Label estimated time per segment so the host can pace live

### Close (final 3–5 minutes)
- Rapid-fire or signature question (if applicable)
- Guest's call to action: where to find them, what they want the audience to do
- Host outro: episode summary in one sentence, next episode tease, CTA (subscribe, review, share)

---

## Interview question principles

**Open, not closed:** Questions should start with "What," "How," "Tell me about," or "Walk me through", not "Do you" or "Did you."

**Beyond the talking points:** Research what the guest typically says in interviews and go one level deeper. If they always say "focus on the user," ask: "Tell me about a time focusing on the user led you to a decision your team pushed back on."

**The unexpected question:** Every interview should include at least one question the guest clearly has not been asked before. Source it from a niche interview, an old blog post, or an underexplored part of their background.

**Silence is a tool:** Leave space after the guest answers. Hosts who jump in immediately get surface answers. Silence invites depth.

---

## Show notes format (standard)

**[Episode number and title]**

**One-sentence hook:** The sentence a new listener reads to decide if this episode is for them.

**Episode summary (2–3 sentences):**
What the episode covers and what the listener will take away.

**Guest bio (2–3 sentences):**
Who they are and why their perspective is worth 45 minutes of your time.

**Key takeaways (3–5 bullets):**
The most actionable or memorable points from the conversation.

**Timestamps:**
00:00, Introduction
[xx:xx], [Topic or segment name]
...

**Resources and links:**
- [Book / tool / site mentioned]

**Connect with [Guest]:**
- [LinkedIn / website / social]

---

## Promotional snippet patterns

### 30-second audio teaser script
Pull the strongest 20–25 second soundbite from the episode. Frame it with:
- Intro line (5 sec): "In this week's episode, [guest] says something I have not heard before."
- Soundbite (20–25 sec)
- CTA (5 sec): "Full episode out [day], subscribe so you don't miss it."

### Social media post (from show notes)
- Open with the most provocative or counterintuitive takeaway
- 2–3 lines of context
- "Full episode: [link in bio / link]"
- 3–5 relevant hashtags

### Email subject line options (A/B test two)
- Curiosity gap: "[Guest] told me something I wasn't expecting…"
- Benefit-direct: "How [guest] [specific outcome], new episode"
`,
      required: true,
    },
    {
      name: 'Guest research and show history',
      purpose:
        'Upload the guest\'s bio, links to their notable work, or a summary of their public ' +
        'interviews. Claude uses this to write more targeted research briefs, spot gaps in the ' +
        'standard talking points, and suggest questions the guest has not been asked before.',
      kind: 'user-provided',
      guidance:
        'For each upcoming guest, paste: their current bio, 3–5 links to their best-known ' +
        'interviews, articles, or talks, a note on their current focus or latest project, ' +
        'and any topics that are off-limits or sensitive. You can also paste a list of previous ' +
        'episode topics so Claude can avoid repetition and build a show history context over time.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'podcast-producer-scenario-episode-outline',
      title: 'Write an episode outline for a guest interview',
      userInput:
        'Write an episode outline for an interview with Priya Desai, a venture capitalist ' +
        'who has backed 12 B2B SaaS companies. The episode focus is how founders make the ' +
        'mistake of raising money before they have found product-market fit. My show targets ' +
        'early-stage founders. The episode should run about 45 minutes.',
      expectedBehavior:
        'Claude should produce a full episode outline with a hook, opening segment, 3–4 main ' +
        'content segments with named themes, and a closing section. The outline should have a ' +
        'clear narrative arc, not just a list of topics, moving from the common mistake through ' +
        'how to diagnose it and what to do differently. Each segment should include 2–3 example ' +
        'questions. The total should be calibrated for a 45-minute episode. Claude should not ' +
        'fabricate specific portfolio companies or investment details for Priya Desai.',
      mustContain: ['Priya Desai', 'product-market fit', 'founders', '45'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'podcast-producer-scenario-show-notes',
      title: 'Draft show notes for a published episode',
      userInput:
        'Write show notes for an episode titled "Why Most B2B Founders Raise Too Early" with ' +
        'guest Priya Desai. Key takeaways from the episode: (1) Most founders confuse investor ' +
        'excitement with product-market fit signal. (2) The right time to raise is when you ' +
        'have three customers who pay full price and would be devastated if you shut down. ' +
        '(3) Raising early slows you down because board accountability replaces customer accountability.',
      expectedBehavior:
        'Claude should produce a complete set of show notes using the standard format: episode ' +
        'title, one-sentence hook, episode summary, guest bio (brief, based on what was provided), ' +
        'three key takeaways using the exact points given, placeholder timestamps, placeholder ' +
        'links, and a guest connect section. The one-sentence hook must make a new listener want ' +
        'to tune in, it should not just describe what was discussed. Claude must not invent ' +
        'additional takeaways beyond the three provided.',
      mustContain: ['Priya Desai', 'product-market fit', 'raise', 'founders'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'podcast-producer-scenario-interview-questions',
      title: 'Prepare a tailored interview question set',
      userInput:
        'Prepare an interview question set for Priya Desai. She always talks about the ' +
        '"three paying customers" test in every interview she does. I want to go deeper than ' +
        'that, find the edges of her thinking and ask about times the test failed or did not ' +
        'apply. The interview is for a founder audience, 45 minutes, and I want 15 questions ' +
        'organized into four sections.',
      expectedBehavior:
        'Claude should produce 15 interview questions organized into four named sections. ' +
        'Questions must go beyond the guest\'s standard talking points about the three-customer ' +
        'test, at least three questions should probe exceptions, failure cases, or tensions in ' +
        'her framework. The questions should be open-ended (not yes/no), get progressively deeper ' +
        'toward the middle of the interview, and include at least one unexpected question that ' +
        'she likely has not been asked before. Questions should be appropriate for a founder audience.',
      mustContain: ['Priya Desai', 'three', 'founders', 'question'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
