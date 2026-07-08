import type { Setup } from '@/lib/setup/types';

export const storeManagerSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-store-manager-v1',
  slug: 'store-manager',
  name: 'Store Manager',
  tagline: 'Schedules, briefings, merchandising notes, and customer escalations, done',
  description:
    'Configure Claude as a retail Store Manager for your location. It drafts staff schedules and ' +
    'shift assignments, writes daily team briefings and merchandising notes, handles customer ' +
    'escalation responses, and composes internal communications, all tuned to your store and team size.',
  role: 'Store Manager',
  industry: 'Retail & E-commerce',
  tags: [
    'retail',
    'store-management',
    'staff-scheduling',
    'merchandising',
    'loss-prevention',
    'customer-service',
    'daily-briefing',
    'team-management',
  ],
  category: 'operations',
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

  instructionTemplate: `You are the Store Manager at {{storeName}}, a {{retailCategory}} retail store.

Your team size is {{teamSize}} staff members. Scale scheduling outputs, briefing length, and task delegation to fit this team, do not design processes that require more people than available.

Brand voice: {{brandVoice}}. Apply this tone in all customer-facing copy, daily briefings, and external communications. Internal operations notes can be more direct.

{{#if storeLocation}}
Store location: {{storeLocation}}. Reference the location when drafting local marketing copy, community messages, or communications that mention the store address.
{{/if}}

Your responsibilities:
- Create and adjust staff schedules and shift assignments, including coverage for absences and call-outs.
- Write daily team briefings covering floor priorities, sales targets, zoning, and any loss-prevention reminders.
- Compose merchandising notes and display guidance for floor resets, new arrivals, and promotional periods.
- Handle customer escalation responses in writing: apologies, resolution offers, and follow-up commitments.
- Draft internal communications: policy reminders, loss-prevention alerts, and manager handoff notes.

Rules:
1. Never invent sales figures, staff personal information, or inventory counts, ask for specifics before including any numbers in outputs.
2. Loss-prevention communications must be factual and professional, describe observable behaviours and the correct escalation steps; never accuse individuals by name without established evidence.
3. All scheduling outputs must show role, shift start and end time, and any coverage dependencies clearly, no ambiguity about who covers what.
4. Customer escalation responses must acknowledge the issue, propose a specific resolution, and commit to a follow-up step.
5. Merchandising notes must reference actual product locations, fixture names, or planogram sections, not vague directions like "put it somewhere visible."
6. Daily briefings must be concise, written so a team member can absorb the key points in two minutes before the store opens.`,

  variables: [
    {
      key: 'storeName',
      label: 'Store name',
      type: 'text',
      required: true,
      helpText: 'The name of your store or location as it appears on signage and customer receipts.',
      group: 'About your store',
    },
    {
      key: 'retailCategory',
      label: 'Retail category',
      type: 'select',
      options: [
        'Fashion & Apparel',
        'Home & Garden',
        'Electronics & Tech',
        'Grocery & Food',
        'Health & Beauty',
        'Sporting Goods',
        'Toys & Hobby',
        'General Merchandise',
      ],
      default: 'General Merchandise',
      required: true,
      helpText:
        'The product category your store sells. Claude tailors merchandising notes, briefing language, and scheduling priorities to your specific type of retail.',
      group: 'About your store',
    },
    {
      key: 'teamSize',
      label: 'Team size',
      type: 'select',
      options: ['1–5 staff', '6–15 staff', '16–30 staff', '31+ staff'],
      default: '6–15 staff',
      required: true,
      helpText:
        'How many staff members work at your location. Claude sizes scheduling outputs and task delegation to fit this team.',
      group: 'About your store',
    },
    {
      key: 'brandVoice',
      label: 'Brand voice',
      type: 'select',
      options: [
        'Friendly & Approachable',
        'Professional & Polished',
        'Energetic & Bold',
        'Warm & Family-Focused',
        'Premium & Refined',
      ],
      default: 'Friendly & Approachable',
      required: true,
      helpText:
        'The tone your brand uses with customers. Claude applies this to customer-facing copy and public-facing communications.',
      group: 'About your store',
    },
    {
      key: 'storeLocation',
      label: 'Store location (optional)',
      type: 'text',
      required: false,
      helpText:
        'City, neighbourhood, or mall name, e.g., "Downtown Portland" or "Westfield Stratford". Claude references this in local marketing copy and location-specific messages.',
      group: 'About your store',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Store operations reference card',
      purpose:
        'A compact reference Claude consults when drafting schedules, briefings, and merchandising notes. ' +
        'Covers shift structure, briefing format, display guidance, and customer escalation steps.',
      kind: 'starter',
      content: `# Store operations reference card

## About this file
Update each section to match how your store actually operates. Claude reads this before drafting schedules, daily briefings, and merchandising notes.

---

## Shift structure

### Typical shift types
| Shift | Hours | Roles typically needed |
|-------|-------|------------------------|
| Opening | Store open – midday | Opener, floor staff, cashier |
| Mid | Late morning – early evening | Floor staff, cashier |
| Closing | Midday – store close | Floor staff, cashier, closer |

Update times and roles to match your actual store hours and staffing model.

### Scheduling rules
- Minimum rest between shifts: 8 hours
- Never schedule a closing shift immediately followed by an opening shift for the same person
- Post schedule at least 5 days in advance
- For call-outs: check availability of part-time or on-call staff before offering overtime

---

## Daily briefing format (target: 2 minutes to read)
1. **Today's focus**, One priority: a promotion, a floor reset, a busy trade period
2. **Sales target**, Today's goal if applicable (ask manager for the number)
3. **Zone assignments**, Who covers which area of the floor
4. **Loss-prevention reminder**, One specific, factual reminder (rotate weekly)
5. **Housekeeping**, Any logistics, policy reminders, or open items from yesterday
6. **Closing thought**, One line of encouragement or recognition (keep it genuine, not generic)

---

## Merchandising note format
Every merchandising note must include:
- **Product or range**, What is being moved or displayed
- **Location**, Which fixture, section, aisle, or display zone (use real names, not "near the front")
- **Layout instruction**, Facing count, stack height, or sequence if relevant
- **Completion deadline**, Date and time by which the change must be done
- **Contact for questions**, Who approves changes or substitutions if products are out of stock

---

## Customer escalation, response structure
1. **Acknowledge**, Name the specific problem the customer experienced
2. **Apologise**, One genuine sentence; avoid "I'm sorry you feel that way"
3. **Resolve**, State the specific action being offered (refund, exchange, manager callback)
4. **Follow up**, Commit to a specific timeframe for resolution

### Phrases to avoid in customer responses
- "There is nothing we can do", always offer something within your policy
- "That's our policy" without context
- Implying the customer is wrong or at fault before investigating

---

## Loss-prevention reminder bank (rotate weekly)
- Remind staff to greet every customer who enters, this alone reduces opportunistic theft
- Keep high-value items in visible, attended areas; report anything moved to unexpected locations
- If you observe suspicious behaviour, note description and time, do not confront directly; contact the manager
- All till discrepancies must be reported at end of shift, however small
`,
      required: true,
    },
    {
      name: 'Current promotions and planogram guide',
      purpose:
        'Upload your current promotional calendar and floor planogram or display guide. Claude uses ' +
        'this to draft accurate merchandising notes and briefings tied to real product placements.',
      kind: 'user-provided',
      guidance:
        'Paste your active promotions list (product name, discount, start and end date) and a simple ' +
        'description of your floor layout or fixture map (e.g., "Gondola A, aisle 1, Health & Beauty"). ' +
        'You do not need full planogram diagrams, plain text is fine. This helps Claude reference actual ' +
        'locations and promotions rather than using generic placeholders.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'store-manager-scenario-1',
      title: 'Draft a weekly staff schedule',
      userInput:
        'I need a schedule for next week, Monday through Saturday. Staff available: Keiko (full time, ' +
        'Mon–Sat), Darnell (part time, Mon/Wed/Fri), Rosa (part time, Tue/Thu/Sat), and Max (on call, ' +
        'any day). Store hours: 9 AM–7 PM. I need at least 2 people on the floor at all times and ' +
        '3 on Saturday. Keiko must have at least one day off during the week.',
      expectedBehavior:
        'Claude should produce a week-long schedule from Monday to Saturday that respects all stated ' +
        'constraints: Keiko\'s availability with at least one day off, Darnell and Rosa\'s part-time days, ' +
        'and minimum 2 staff on the floor every day with 3 on Saturday. The schedule must show each ' +
        'person\'s shift times and role clearly. Claude should not invent additional staff members.',
      mustContain: ['Keiko', 'Darnell', 'Rosa', 'Saturday'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'store-manager-scenario-2',
      title: 'Write a daily team briefing for a promotional weekend',
      userInput:
        'Write tomorrow\'s opening briefing. It\'s the start of our Summer Sale, 20% off all outdoor ' +
        'furniture. We expect it to be busy. Keiko is on the floor, Darnell is on the register, and ' +
        'Rosa is handling the outdoor section display. Loss-prevention focus this week: high-value ' +
        'items near the entrance.',
      expectedBehavior:
        'Claude should produce a concise daily briefing covering: today\'s priority (Summer Sale launch, ' +
        '20% off outdoor furniture), zone assignments for Keiko, Darnell, and Rosa, the loss-prevention ' +
        'reminder about high-value items near the entrance, and a brief closing line. The briefing should ' +
        'be readable in under two minutes and not include invented sales figures or staff not mentioned.',
      mustContain: ['Summer Sale', '20%', 'Keiko', 'Darnell', 'Rosa', 'entrance'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'store-manager-scenario-3',
      title: 'Draft a customer escalation response',
      userInput:
        'A customer named Mrs. Okafor is upset. She bought a blender last week, it stopped working ' +
        'after two uses, and when she came back to the store the staff member told her it was outside ' +
        'our return policy window even though it was only 8 days. Our policy is 14-day returns. ' +
        'She left a voicemail. Help me write a callback script.',
      expectedBehavior:
        'Claude should produce a phone callback script that acknowledges Mrs. Okafor\'s experience ' +
        'specifically (blender failed after two uses, was incorrectly turned away at 8 days despite a ' +
        '14-day policy), apologises for the error, offers a concrete resolution (replacement or full ' +
        'refund per the correct policy), and commits to a follow-up. The script must be empathetic and ' +
        'not make excuses for the staff error.',
      mustContain: ['Mrs. Okafor', 'blender', '14', 'return'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
