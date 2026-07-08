import type { Setup } from '@/lib/setup/types';

export const videoProducerSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-video-producer-v1',
  slug: 'video-producer',
  name: 'Video Producer',
  tagline: 'From concept to camera-ready: shot lists, scripts, schedules, and YouTube copy',
  description:
    'Configure Claude as a senior Video Producer supporting your production workflow. ' +
    'It drafts shot lists, writes script outlines and storyboard notes, builds production ' +
    'schedules, composes shoot briefs for crew and talent, and writes YouTube titles and ' +
    'descriptions optimized for the platform.',
  role: 'Video Producer',
  industry: 'Media & Creative',
  tags: [
    'video-production',
    'shot-list',
    'scriptwriting',
    'storyboard',
    'production-schedule',
    'youtube',
    'content-creation',
    'pre-production',
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

  instructionTemplate: `You are a senior Video Producer at {{productionCompany}}, specializing in {{videoType}} production for delivery on {{targetPlatform}}.

Your responsibilities:
- Write detailed shot lists that cover every scene: shot number, shot type (wide/medium/close-up/insert), movement, subject, notes for director or operator.
- Draft script outlines and scene-by-scene breakdowns that give the director a clear through-line; full scripts when requested.
- Build production schedules that allocate realistic time blocks for setup, shooting, and breakdown, do not assume everything runs on time.
- Write shoot briefs that give crew, talent, and clients everything they need before arriving on set: concept, look and feel, call times, location notes, wardrobe, and shot priorities.
- Compose YouTube titles, thumbnails descriptions, and video descriptions with retention and discoverability in mind.

Your production scale is {{productionScale}}. Calibrate recommendations to this scale, a solo creator does not need a 20-person call sheet, and a full production does not operate with a single-camera run-and-gun approach.

{{#if clientIndustry}}
Client industry: {{clientIndustry}}. Factor in industry-specific considerations, tone, compliance sensitivities, or audience expectations, when drafting scripts, briefs, and on-screen copy.
{{/if}}

{{#if deliveryFormat}}
Primary delivery format: {{deliveryFormat}}. All shot lists and framing notes must be consistent with this aspect ratio and delivery context.
{{/if}}

Rules:
1. Never invent location permits, union rules, or equipment availability. If production logistics depend on unknown variables, flag them explicitly and ask the user to confirm.
2. Shot lists must be internally consistent, continuity errors (wrong side of the line, mismatched eyelines, continuity in props) should be flagged, not silently accepted.
3. YouTube titles must be under 60 characters to avoid truncation in search results. Descriptions must open with a keyword-rich first sentence within the first 150 characters.
4. Keep all client briefs, scripts, and creative strategies shared in this conversation confidential.
5. When writing scripts that include claims about a product or service, note any claim that requires legal or compliance review before broadcast.
6. Production schedules must include buffer time. Never build a schedule where every block runs back-to-back with zero contingency.`,

  variables: [
    {
      key: 'productionCompany',
      label: 'Production company or studio name',
      type: 'text',
      required: true,
      helpText: 'Your company, studio, or freelance brand name, used in call sheets, briefs, and documents.',
      group: 'About you',
    },
    {
      key: 'videoType',
      label: 'Primary video type',
      type: 'select',
      options: [
        'YouTube / long-form content',
        'Corporate / brand film',
        'Commercial / advertisement',
        'Documentary',
        'Social media short-form',
        'Event recap / highlight reel',
        'Training & e-learning',
        'Music video',
      ],
      default: 'YouTube / long-form content',
      required: true,
      helpText: 'The type of video this setup will primarily support. Shapes how Claude approaches scripting, shot lists, and delivery specs.',
      group: 'About your work',
    },
    {
      key: 'targetPlatform',
      label: 'Target delivery platform(s)',
      type: 'multiselect',
      options: [
        'YouTube',
        'Instagram / Reels',
        'TikTok',
        'LinkedIn',
        'Broadcast / TV',
        'Corporate intranet',
        'Client presentation',
        'Cinema / festival',
      ],
      default: ['YouTube'],
      required: true,
      helpText: 'Where the finished video will be published or screened. Claude tailors aspect ratio guidance, length, and format to these platforms.',
      group: 'About your work',
    },
    {
      key: 'productionScale',
      label: 'Production scale',
      type: 'select',
      options: [
        'Solo creator (one person, minimal gear)',
        'Small crew (2–5 people)',
        'Mid-size production (6–15 people)',
        'Full production (15+ people, full department structure)',
      ],
      default: 'Small crew (2–5 people)',
      required: true,
      helpText: 'How large is your typical production? Claude scales call sheets, schedules, and logistics to match your crew size.',
      group: 'About your work',
    },
    {
      key: 'clientIndustry',
      label: 'Client industry (optional)',
      type: 'text',
      required: false,
      helpText: 'The industry your current client or project is in. e.g., "Healthcare," "SaaS technology," "Consumer food & beverage." Claude uses this to calibrate tone and flag compliance considerations.',
      group: 'About the project',
    },
    {
      key: 'deliveryFormat',
      label: 'Primary delivery format (optional)',
      type: 'select',
      options: [
        '16:9 horizontal (standard)',
        '9:16 vertical (mobile/Reels/TikTok)',
        '1:1 square',
        '4:3 (broadcast legacy)',
        'Mixed (produce for multiple formats)',
      ],
      required: false,
      helpText: 'The aspect ratio and framing context for finished deliverables. Claude notes format-specific shot constraints in shot lists and briefs.',
      group: 'About the project',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Production reference card',
      purpose:
        'A compact reference Claude uses when building shot lists, schedules, and YouTube copy. ' +
        'Covers shot type abbreviations, production schedule time-block defaults, and YouTube ' +
        'title and description best practices.',
      kind: 'starter',
      content: `# Production reference card

## About this file
Update the project-specific sections with your active brief, location details, and schedule constraints. Claude reads this before producing any production document.

---

## Shot type abbreviations

| Code | Shot type | Description |
|------|-----------|-------------|
| EWS | Extreme wide shot | Full location; establishes geography |
| WS | Wide shot | Full subject in environment |
| MS | Medium shot | Waist-up; most common interview frame |
| MCU | Medium close-up | Chest-up; conversational, intimate |
| CU | Close-up | Face or key detail |
| ECU | Extreme close-up | Single feature, eye, hands, product detail |
| OTS | Over-the-shoulder | Classic two-person dialogue frame |
| POV | Point of view | Subjective camera from character's perspective |
| INSERT | Insert / cutaway | Object, screen, hands, covers edit points |
| B-ROLL | B-roll | Supplemental footage to cover narration |

---

## Shot list columns (standard)

| Shot # | Scene | Type | Movement | Subject / Action | Audio | Notes |
|--------|-------|------|----------|-----------------|-------|-------|

Movement options: Static / Handheld / Dolly in / Dolly out / Pan L-R / Pan R-L / Tilt up / Tilt down / Crane up / Crane down / Gimbal follow

---

## Production schedule, time-block defaults

Use these as starting points; adjust to location and crew size. Never schedule back-to-back without buffer.

| Activity | Default time |
|----------|-------------|
| Crew arrival + setup | 45–90 min |
| Talent arrival + hair/makeup | 30–60 min |
| Camera + lighting setup per scene | 20–45 min |
| Interview / dialogue scene | 30–60 min per subject |
| B-roll block | 30–60 min per location |
| Set strike + pack-out | 30–60 min |
| Buffer between scenes | 15–20 min minimum |

**Golden rule:** Build a schedule you can actually hit. If it looks tight on paper, it is too tight on the day.

---

## YouTube title rules

- Under 60 characters (longer gets truncated in search results)
- Lead with the keyword or the strongest hook word
- Include a number or time frame when relevant ("5 Ways…", "In 10 Minutes")
- Do not write in ALL CAPS, use title case
- Avoid clickbait that the video cannot deliver

## YouTube description structure

**First 150 characters** (visible before "Show more"):
→ One keyword-rich sentence that states clearly what the video covers.

**Full description:**
1. Expanded summary (2–3 sentences)
2. Timestamps (if video is 10+ minutes)
3. Links and resources mentioned
4. CTA (subscribe, follow, related video)
5. Hashtags (3–5, at the end)
`,
      required: true,
    },
    {
      name: 'Creative brief and project context',
      purpose:
        'Upload your client brief, creative treatment, or project overview here. Claude uses this ' +
        'to keep shot lists, scripts, and schedules grounded in the actual project rather than a ' +
        'generic production template.',
      kind: 'user-provided',
      guidance:
        'Paste the project brief or creative treatment: the video concept, target audience, ' +
        'key message, approved look and feel references, confirmed locations, and any must-include ' +
        'scenes or deliverables the client has signed off on. A one-page brief is ideal. If you ' +
        'have a storyboard or mood board, describe the key frames in plain text.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'video-producer-scenario-shot-list',
      title: 'Build a shot list for a brand film interview sequence',
      userInput:
        'I am shooting a two-minute brand film for Meridian Coffee, a specialty roaster. ' +
        'The main sequence is a 90-second sit-down interview with the founder talking about ' +
        'how he sources beans directly from farmers in Ethiopia. I have two cameras, a small ' +
        'crew of four, and a clean warehouse location. Build a shot list for the interview sequence.',
      expectedBehavior:
        'Claude should produce a structured shot list covering the full interview sequence. ' +
        'It should include a primary camera angle (likely a medium or medium close-up), a ' +
        'secondary camera for variety cuts, and a set of B-roll inserts relevant to the ' +
        'founder\'s story (beans, hands, roasting equipment, packaging). Each row in the list ' +
        'should include: shot number, type, movement, subject/action, and notes. Claude should ' +
        'note the two-camera setup and suggest complementary angles rather than identical frames. ' +
        'It should not invent equipment or location details beyond what was provided.',
      mustContain: ['Meridian Coffee', 'Ethiopia', 'interview', 'B-roll'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'video-producer-scenario-production-schedule',
      title: 'Build a single-day production schedule',
      userInput:
        'Build a production schedule for a single shoot day for Meridian Coffee. ' +
        'We need to shoot the founder interview (90 sec finished), a product beauty sequence ' +
        'with coffee bags and brewing equipment, and exterior B-roll of the warehouse. ' +
        'Call time is 7 AM. We need to wrap by 5 PM. Crew of four plus the founder as talent.',
      expectedBehavior:
        'Claude should produce a detailed hour-by-hour (or 30-minute block) schedule for ' +
        'the full shoot day, starting at 7 AM and wrapping by 5 PM. The schedule must include: ' +
        'crew setup and camera/lighting prep, founder arrival and any prep time, the interview ' +
        'sequence, the product beauty sequence, the exterior B-roll block, buffer time between ' +
        'setups, and a pack-out block before 5 PM. It should flag if the day is too tight ' +
        'and suggest what to cut or compress rather than pretending it all fits comfortably.',
      mustContain: ['Meridian Coffee', '7 AM', '5 PM', 'founder'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'video-producer-scenario-youtube-copy',
      title: 'Write a YouTube title and description',
      userInput:
        'Write a YouTube title and description for the finished Meridian Coffee brand film. ' +
        'The video is 2 minutes long, tells the story of how founder Marcus Chen sources ' +
        'single-origin beans directly from small farms in Ethiopia, and ends with a shot ' +
        'of the finished bag with the line "Every bag tells a story." Target audience is ' +
        'specialty coffee enthusiasts.',
      expectedBehavior:
        'Claude should produce one YouTube title (under 60 characters, keyword-first, ' +
        'hook-driven) and a full video description. The description must open with a ' +
        'keyword-rich sentence in the first 150 characters (visible before "Show more"). ' +
        'The body should include an expanded summary, a call to action, and 3–5 relevant ' +
        'hashtags at the end. The title and description must reference the Ethiopian sourcing ' +
        'story and the specialty coffee angle. Claude should not fabricate view count ' +
        'promises or misleading claims.',
      mustContain: ['Meridian Coffee', 'Ethiopia', 'Marcus Chen', 'single-origin'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
