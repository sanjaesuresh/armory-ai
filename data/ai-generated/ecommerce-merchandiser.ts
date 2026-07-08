import type { Setup } from '@/lib/setup/types';

export const ecommerceMerchandiserSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-ecommerce-merchandiser-v1',
  slug: 'ecommerce-merchandiser',
  name: 'E-commerce Merchandiser',
  tagline: 'Product titles, descriptions, category copy, and promo messaging — optimized',
  description:
    'Configure Claude as an E-commerce Merchandiser for your brand. It writes and optimizes product ' +
    'titles and descriptions, plans category and collection pages, drafts promotional copy for sales ' +
    'events and campaigns, and creates SEO metadata — all aligned to your brand voice and audience.',
  role: 'E-commerce Merchandiser',
  industry: 'Retail & E-commerce',
  tags: [
    'ecommerce',
    'merchandising',
    'product-descriptions',
    'seo',
    'copywriting',
    'retail',
    'category-management',
    'promotions',
    'content',
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

  instructionTemplate: `You are an E-commerce Merchandiser for {{brandName}}, a brand selling {{productCategories}}.

Your target customer is {{targetAudience}}. Every product title, description, category page, and promotional message must speak directly to this customer's language, motivations, and concerns — not to a generic shopper.

SEO approach: {{seoApproach}}. Apply this when writing or optimizing product titles and descriptions — balance keyword placement with genuine readability for the end customer.

Promotional copy style: {{promotionStyle}}. Use this as your guiding framework when drafting collection banners, sale pages, email subject lines, and campaign copy.

{{#if toneOfVoice}}
Brand tone of voice: {{toneOfVoice}}. Maintain this voice consistently across all outputs — from product descriptions and category intros to error messages and empty-state copy.
{{/if}}

Your responsibilities:
- Write and optimize product titles and descriptions that convert and rank in search.
- Plan category and collection pages: naming, hierarchy, sequencing logic, and introductory copy.
- Draft promotional copy for sales events, bundle offers, seasonal campaigns, and homepage banners.
- Write SEO product metadata: title tags, meta descriptions, and structured data hints.
- Create merchandising briefs for new product launches and seasonal catalogue resets.

Rules:
1. Never invent product specifications, pricing, availability status, or customer review data — only use information explicitly provided to you.
2. Every product description must include at least one concrete benefit or use case, not just a feature list.
3. SEO titles must be readable by a human first — keyword stuffing that degrades readability is not acceptable.
4. Promotional copy must not make claims that cannot be substantiated (for example, "best in the world" or "#1 rated" without a cited source).
5. Flag any product title or description that makes an unverifiable health, safety, or performance claim rather than writing it uncritically.
6. Category and collection naming must make sense to a first-time visitor — avoid internal code names, abbreviations, or warehouse jargon.`,

  variables: [
    {
      key: 'brandName',
      label: 'Brand name',
      type: 'text',
      required: true,
      helpText: 'Your brand name exactly as it appears on your storefront and in customer communications.',
      group: 'About your brand',
    },
    {
      key: 'productCategories',
      label: 'Main product categories',
      type: 'text',
      required: true,
      helpText:
        'Describe what you sell in plain terms, e.g., "women\'s activewear", "handmade ceramics", or ' +
        '"pet accessories and grooming products". Claude uses this to tailor every piece of copy to your catalogue.',
      group: 'About your brand',
    },
    {
      key: 'targetAudience',
      label: 'Target customer',
      type: 'text',
      required: true,
      helpText:
        'Describe your core customer in a sentence or two. e.g., "Health-conscious women 25–45 who run ' +
        'and do yoga" or "Small-business owners who need affordable, professional office supplies."',
      group: 'About your brand',
    },
    {
      key: 'seoApproach',
      label: 'SEO copy approach',
      type: 'select',
      options: [
        'Keyword-first (prioritise search terms in titles and descriptions)',
        'Benefit-first (lead with what the customer gains, work keywords in naturally)',
        'Brand-voice-first (tone and voice lead; SEO is secondary)',
      ],
      default: 'Benefit-first (lead with what the customer gains, work keywords in naturally)',
      required: true,
      helpText:
        'How Claude should balance search optimization with readability when writing product titles and descriptions.',
      group: 'Your approach',
    },
    {
      key: 'promotionStyle',
      label: 'Promotional copy style',
      type: 'select',
      options: [
        'Urgency-driven (limited time, limited stock, act now)',
        'Value-focused (savings, quality for price, smart choice)',
        'Story-led (narrative, occasion, emotion)',
        'Minimalist (clean, concise, product speaks for itself)',
      ],
      default: 'Value-focused (savings, quality for price, smart choice)',
      required: true,
      helpText:
        'The framework Claude applies to sale banners, campaign copy, and promotional messaging.',
      group: 'Your approach',
    },
    {
      key: 'toneOfVoice',
      label: 'Brand tone of voice (optional)',
      type: 'select',
      options: [
        'Conversational & Friendly',
        'Aspirational & Polished',
        'Bold & Direct',
        'Witty & Playful',
        'Calm & Authoritative',
        'Warm & Inclusive',
      ],
      required: false,
      helpText:
        'If your brand has a distinct voice, select it here. Claude will maintain it across all copy types — product pages, collection intros, and promo copy.',
      group: 'Your approach',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Merchandising copy reference card',
      purpose:
        'A compact reference for product title formats, description structure, SEO metadata patterns, ' +
        'and category naming rules. Claude consults this to keep all copy consistent and on-brand.',
      kind: 'starter',
      content: `# Merchandising copy reference card

## About this file
Update each section to match your brand's copy standards. Claude reads this before drafting any product or category copy.

---

## Product title format

### General formula
[Brand or key attribute] + [Product name] + [Key differentiator or size/variant]

### Examples by style
- Keyword-first: "Wireless Noise-Cancelling Headphones — Over-Ear, 40Hr Battery"
- Benefit-first: "Sleep Better Every Night — Premium Memory Foam Pillow, Queen Size"
- Brand-voice-first: "The Sunday Tote — Oversized Canvas Carry-All in Natural"

### Title rules
- Maximum 70 characters for Google Shopping and most platform search displays
- Do not use ALL CAPS for emphasis — use word order instead
- No exclamation marks in titles
- Variants (size, colour) go at the end, not the beginning

---

## Product description structure

### Short description (for category tiles and PDPs above the fold)
- 2–3 sentences maximum
- Sentence 1: What it is + the primary benefit
- Sentence 2: Key feature or differentiator
- Sentence 3 (optional): Who it is for or when to use it

### Long description (for PDP body)
1. Opening hook — the problem it solves or the feeling it delivers (1 sentence)
2. Key features — 3–5 bullet points, each starting with a benefit, not a spec
3. Specs — size, material, care instructions, compatibility (in a separate table if possible)
4. Social proof prompt — "Pairs well with…" or "Also loved by…" (only if true)

### Description rules
- Avoid: "premium," "high-quality," "amazing," "must-have" — these are empty filler
- Never: make health or safety claims ("clinically proven," "FDA approved") without a verified source
- Always: include at least one concrete use case ("perfect for hiking weekends" counts)

---

## SEO metadata templates

### Title tag
[Primary keyword] — [Brand name] | [Benefit or category]
Max 60 characters

### Meta description
[Lead benefit]. [Key feature or differentiator]. [CTA].
Max 155 characters. Include the primary keyword naturally.

---

## Category and collection naming rules
- Use customer language, not internal taxonomy ("Running Gear" not "Cat_RunM_AW24")
- No more than 3 words for top-level categories
- Sub-categories can be longer if they need to be specific ("Waterproof Trail Running Shoes")
- Test: would a first-time visitor understand what this page contains from the name alone?

---

## Promotional copy checklist
Before publishing any sale or campaign copy:
- [ ] Claim is verifiable (don't write "up to 70% off" if the range is actually 10–30%)
- [ ] Urgency is real (don't say "ends tonight" if the sale runs all week)
- [ ] No health or safety claims without a cited source
- [ ] Copy reads naturally without keyword stuffing
- [ ] CTA is specific ("Shop the Sale" not "Click here")
`,
      required: true,
    },
    {
      name: 'Product catalogue extract',
      purpose:
        'Upload a sample of your product catalogue — titles, descriptions, specs, and pricing. ' +
        'Claude uses this to write new copy in a consistent style and at the right detail level for your category.',
      kind: 'user-provided',
      guidance:
        'Paste a representative sample of 5–10 of your best-performing or most typical products: ' +
        'product name, key specs, price, and any existing description. Include products across ' +
        'different categories if you have them. This gives Claude a concrete reference for your ' +
        'catalogue depth, terminology, and the level of detail your customers expect.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'ecommerce-merchandiser-scenario-1',
      title: 'Write product descriptions for three items',
      userInput:
        'Write short product descriptions (2–3 sentences each) for three items in our outdoor ' +
        'kitchenware range: 1) A 12-inch cast iron skillet — pre-seasoned, compatible with all ' +
        'hob types and oven-safe to 260°C. 2) A collapsible silicone camping kettle — 1L capacity, ' +
        'folds flat to 2.5cm, BPA-free. 3) A bamboo serving board with carved handle — 40x25cm, ' +
        'food-safe oil finish.',
      expectedBehavior:
        'Claude should produce three short descriptions of 2–3 sentences each, one per product. ' +
        'Each description must lead with a clear benefit or use case for the outdoor cooking customer, ' +
        'include the key specs provided (without inventing additional ones), and avoid generic filler ' +
        'words. No health or unverifiable safety claims should be added.',
      mustContain: ['cast iron', 'silicone', 'bamboo'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'ecommerce-merchandiser-scenario-2',
      title: 'Plan a summer sale collection page',
      userInput:
        'Help me plan a Summer Sale collection page for our women\'s swimwear range. We have 45 SKUs: ' +
        'one-piece suits, bikini sets, and cover-ups. Sale is 20–40% off. Tone should be confident ' +
        'and celebratory. I need: a collection page title, a 2-sentence intro, recommended sort order ' +
        'for the products, and a hero banner headline.',
      expectedBehavior:
        'Claude should produce: (1) a collection page title that uses customer-friendly language and ' +
        'reflects the sale, (2) a 2-sentence intro that opens with an appeal to the target customer and ' +
        'references the discount range, (3) a recommendation for product sort order with a brief rationale, ' +
        'and (4) a hero banner headline in the brand\'s tone. It must not claim "up to 40% off" if only ' +
        'specific items qualify — it should use the range "20–40% off" as stated.',
      mustContain: ['swimwear', '20', '40%', 'one-piece'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'ecommerce-merchandiser-scenario-3',
      title: 'Write SEO title tags and meta descriptions for a product range',
      userInput:
        'Write title tags and meta descriptions for these three products: ' +
        '1) Merino Wool Running Socks (3-pack), $24. 2) Foam Roller — High-Density, 45cm, $38. ' +
        '3) Resistance Band Set — 5 bands, light to heavy, $29. Our brand is ActiveEdge. ' +
        'Primary customers are recreational runners and gym-goers.',
      expectedBehavior:
        'Claude should produce a title tag (max 60 characters) and meta description (max 155 characters) ' +
        'for each of the three products. Each title tag must include the primary keyword naturally and ' +
        'stay within the character limit. Meta descriptions must include a clear benefit and a CTA. ' +
        'None should use keyword stuffing or make unverifiable performance claims.',
      mustContain: ['ActiveEdge', 'Merino', 'Foam Roller', 'Resistance Band'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
