import type { Setup } from '@/lib/setup/types';

/**
 * Canonical curated fixture: Marketing Manager.
 * Used as the shared test input for validator, compiler, and exporter tasks.
 */
export const marketingManagerSetup: Setup = {
  kind: 'setup',
  id: 'curated-marketing-manager-v1',
  slug: 'marketing-manager',
  name: 'Marketing Manager',
  tagline: 'Your always-on marketing strategist and content partner',
  description:
    'Configure Claude as a senior marketing manager for your brand. It drafts campaigns, ' +
    'writes copy, suggests channel strategies, and keeps your voice consistent across ' +
    'every touchpoint.',
  role: 'Marketing Manager',
  industry: null,
  tags: ['marketing', 'content', 'brand', 'social-media', 'copywriting'],
  category: 'marketing',
  source: 'curated',
  author: null,
  version: '1.0.0',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  reviewStatus: 'approved',
  upvotes: 0,
  featured: null,
  targets: ['claude-app'],
  tier: 'core',

  instructionTemplate: `You are a senior Marketing Manager working exclusively for {{brandName}}.

Your responsibilities:
- Develop and execute marketing campaigns that grow brand awareness and drive conversions.
- Write compelling copy tailored to each channel's audience and format.
- Maintain a consistent brand voice in every piece of content you produce.

{{#if hasBrandVoice}}
Brand voice guidelines are provided in the knowledge files. Read them carefully before writing anything — every output must reflect {{brandName}}'s established voice, tone, and style.
{{/if}}

Active channels for {{brandName}}:
{{channels}}

When writing for any of these channels, adapt the format, length, and tone to suit the platform while keeping the core message on-brand.

Tone of voice: {{tone}}

Rules:
1. Never invent facts about {{brandName}}, its products, or its competitors.
2. If you are uncertain about something, ask a clarifying question rather than guessing.
3. Always suggest A/B variants when writing ad copy or subject lines.
4. If asked to write for a channel not listed above, flag it and confirm before proceeding.`,

  variables: [
    {
      key: 'brandName',
      label: 'Brand name',
      type: 'text',
      required: true,
      helpText: 'The exact name of your brand as it should appear in all outputs.',
      group: 'About your brand',
    },
    {
      key: 'hasBrandVoice',
      label: 'Do you have brand voice guidelines?',
      type: 'boolean',
      default: false,
      required: false,
      helpText:
        'Turn this on if you will upload a brand voice or style guide as a knowledge file.',
      group: 'About your brand',
    },
    {
      key: 'channels',
      label: 'Active marketing channels',
      type: 'multiselect',
      options: ['Email', 'Instagram', 'LinkedIn', 'X (Twitter)', 'Facebook', 'TikTok', 'Blog'],
      default: ['Email', 'Instagram', 'LinkedIn'],
      required: true,
      helpText: 'Select every channel your marketing team actively publishes to.',
      group: 'Your channels',
    },
    {
      key: 'tone',
      label: 'Overall tone of voice',
      type: 'select',
      options: ['Professional', 'Conversational', 'Playful', 'Authoritative', 'Inspirational'],
      default: 'Professional',
      required: true,
      helpText: 'Pick the single tone that best describes your brand personality.',
      group: 'Tone & style',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Brand quick-facts',
      purpose:
        'Gives Claude a compact reference card with your brand\'s positioning, mission, ' +
        'key differentiators, and product or service overview so it can answer questions ' +
        'and write copy without you repeating the basics.',
      kind: 'starter',
      content: `# Brand quick-facts

## About this file
Fill in each section below. Claude will consult this file every time it writes copy or answers a marketing question for your brand.

---

## Company overview
- **Brand name:** [Your brand name]
- **Founded:** [Year]
- **What we do:** [One sentence]
- **Primary audience:** [Who you serve]

## Positioning
- **Category:** [The market category you compete in]
- **Key differentiator:** [What makes you meaningfully different]
- **Tagline / slogan:** [If you have one]

## Products / services
| Name | One-line description | Price point |
|------|----------------------|-------------|
| [Product 1] | | |
| [Product 2] | | |

## Competitors to be aware of
- [Competitor A] — [How we differ]
- [Competitor B] — [How we differ]

## Things we never say
- [Off-brand phrase or claim]
- [Competitor name we avoid mentioning]
`,
      required: true,
    },
    {
      name: 'Your brand guidelines',
      purpose:
        'Upload your full brand voice, tone, and style guide here. Claude uses it to ' +
        'match your established writing conventions — word choices, sentence structure, ' +
        'punctuation preferences, and anything else that makes your brand sound like you.',
      kind: 'user-provided',
      guidance:
        'Upload a PDF or paste the text of your brand voice guide. ' +
        'If you do not have a formal guide, write a few paragraphs describing how your brand ' +
        'sounds, words it uses often, and words it avoids. Even a short description helps Claude ' +
        'stay consistent.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'scenario-launch-tweet',
      title: 'Write a product launch post',
      userInput:
        'We are launching a new feature called Smart Scheduling next Tuesday. ' +
        'Write a post for Instagram and one for LinkedIn announcing it.',
      expectedBehavior:
        'Claude should produce two distinct posts — one optimised for Instagram ' +
        '(concise, visual language, emoji-friendly, hashtags) and one for LinkedIn ' +
        '(more professional, slightly longer, benefit-led). Both must mention the brand ' +
        'name and the feature name "Smart Scheduling," and both must match the configured ' +
        'tone of voice. Claude should offer at least one variant per platform.',
      mustContain: ['Smart Scheduling', 'Instagram', 'LinkedIn'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'scenario-email-subject-lines',
      title: 'Generate A/B email subject lines',
      userInput:
        'I need five subject line options for a promotional email about our summer sale. ' +
        'Discounts go up to 30%.',
      expectedBehavior:
        'Claude should return at least five distinct subject line options that vary in ' +
        'approach (curiosity-driven, urgency-based, benefit-led, etc.). Each should be ' +
        'under 50 characters. Claude should briefly note the angle for each line so the ' +
        'user can make an informed A/B testing decision.',
      mustContain: ['30%'],
    },
  ],
  // Registry-only fields — empty for kind='setup'.
  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
