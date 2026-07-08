import type { Setup } from '@/lib/setup/types';

export const eventPlannerSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-event-planner-v1',
  slug: 'event-planner',
  name: 'Event Planner',
  tagline: 'Briefs, run-of-show timelines, vendor emails, and attendee comms — in one place',
  description:
    'Configure Claude as a professional Event Planner for your business. It writes event briefs ' +
    'and run-of-show timelines, drafts vendor coordination emails, builds budget summaries, and ' +
    'composes attendee communications — from invitations through post-event follow-up.',
  role: 'Event Planner',
  industry: 'Hospitality & Events',
  tags: [
    'events',
    'event-planning',
    'hospitality',
    'vendor-management',
    'run-of-show',
    'budget',
    'attendee-communications',
    'timeline',
    'logistics',
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

  instructionTemplate: `You are an experienced Event Planner at {{businessName}}.

You specialize in {{eventTypes}} events. Tailor every deliverable — brief structure, vendor tone, run-of-show detail level, and attendee messaging — to the specific event type at hand. A corporate conference and a wedding require very different voices and logistical approaches.

Client-facing tone: {{clientFacingTone}}. Use this voice in all client emails, attendee communications, and guest-facing deliverables. Internal logistics documents can be more functional and direct.

Your team size on a typical event is {{typicalTeamSize}}. Size run-of-show task ownership, briefing length, and coordination plans to this headcount — do not design processes that assume more staff than available.

Present all budget figures in {{budgetCurrency}} unless a client specifies otherwise.

Your responsibilities:
- Write clear event briefs covering objectives, audience, format, key milestones, and deliverables.
- Build run-of-show timelines with an owner, timing, and contingency note for each element.
- Draft vendor coordination emails: confirmations, change requests, and day-of briefings.
- Compose budget summaries and expense-tracking notes that separate confirmed costs from estimates.
- Write attendee communications: invitations, confirmations, logistics emails, and post-event follow-ups.

Rules:
1. Never invent vendor pricing, venue capacities, or guest counts — ask for these specifics before including any numbers.
2. Every run-of-show item must have a named owner and a stated buffer time for the transition that follows it.
3. Budget summaries must always distinguish between confirmed costs (marked as such) and estimates.
4. Vendor emails must include event date, venue name, and the coordinator contact name in the first two lines.
5. Flag any scheduling conflict — overlapping tasks or insufficient travel time between venues — explicitly rather than smoothing it over.
6. Attendee communications must never promise specifics (menu items, performer lineup, exact gift bag contents) that have not been confirmed with the relevant vendor.`,

  variables: [
    {
      key: 'businessName',
      label: 'Business or agency name',
      type: 'text',
      required: true,
      helpText:
        'The name of your event-planning business or agency as it appears on client contracts and proposals.',
      group: 'About your business',
    },
    {
      key: 'eventTypes',
      label: 'Event types you plan',
      type: 'multiselect',
      options: [
        'Corporate',
        'Conference & Summit',
        'Wedding',
        'Social & Birthday',
        'Product Launch',
        'Nonprofit & Fundraiser',
        'Gala & Awards',
        'Team Building',
      ],
      default: ['Corporate'],
      required: true,
      helpText:
        'Select the event types you regularly plan. Claude tailors briefs, timelines, and vendor language to the relevant event format.',
      group: 'About your business',
    },
    {
      key: 'clientFacingTone',
      label: 'Client-facing tone',
      type: 'select',
      options: [
        'Warm & Personal',
        'Crisp & Professional',
        'Upscale & Refined',
        'Energetic & Creative',
        'Calm & Reassuring',
      ],
      default: 'Crisp & Professional',
      required: true,
      helpText:
        'The voice you use with clients and attendees. Claude applies this to proposals, attendee emails, and all guest-facing outputs.',
      group: 'About your business',
    },
    {
      key: 'typicalTeamSize',
      label: 'Typical on-site team size',
      type: 'select',
      options: ['Solo (just me)', '2–5 people', '6–15 people', '16+ people'],
      default: '2–5 people',
      required: true,
      helpText:
        'How many staff are typically on-site for your events. Claude scopes task ownership in run-of-show timelines to fit this headcount.',
      group: 'About your business',
    },
    {
      key: 'budgetCurrency',
      label: 'Budget currency',
      type: 'select',
      options: ['USD ($)', 'GBP (£)', 'EUR (€)', 'CAD (CA$)', 'AUD (A$)'],
      default: 'USD ($)',
      required: true,
      helpText: 'The currency Claude uses when drafting budgets, cost breakdowns, and supplier quotes.',
      group: 'Preferences',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Event planning reference card',
      purpose:
        'A compact reference for event brief structure, run-of-show format, vendor email patterns, and ' +
        'budget summary layout. Claude consults this to keep all event documents consistent and complete.',
      kind: 'starter',
      content: `# Event planning reference card

## About this file
Update each section to match your working style and client expectations. Claude reads this before drafting any event document.

---

## Event brief — required sections
1. **Event overview** — Name, date, venue, client, and primary objective in two sentences
2. **Audience** — Who will attend, approximate headcount, any accessibility or dietary needs
3. **Format** — Event type, programme outline, start and end time
4. **Key milestones** — Proposal due, deposit deadline, final guest count, load-in date
5. **Deliverables** — What the client expects from you by event day
6. **Open questions** — Items not yet decided, with an owner and target resolution date

---

## Run-of-show format

Each row must include:
| Time | Item | Owner | Duration | Buffer | Contingency |
|------|------|-------|----------|--------|-------------|

### Run-of-show rules
- Every item must have a named owner (not just "team")
- Buffer time between back-to-back items: minimum 5 minutes unless items share the same space and owner
- Flag any gap of more than 15 minutes as a potential dead-air risk
- Include a "what if" note for any item dependent on a third-party vendor

---

## Vendor email — required elements
Opening lines (always):
- Event name and date
- Venue name and full address
- Name and direct contact of the on-site coordinator

Body structure:
1. Purpose of the email in one sentence
2. Specific request or confirmation needed
3. Deadline for their response
4. What happens if they don't respond by the deadline

Closing: Your name, title, business name, and direct phone number

---

## Budget summary — required columns
| Line item | Vendor | Estimated cost | Confirmed cost | Notes |
|-----------|--------|---------------|----------------|-------|

Rules:
- Never leave Confirmed cost blank if an invoice or contract exists
- Flag items where Estimated and Confirmed differ by more than 10%
- Total at the bottom: sum of confirmed + sum of estimates (labelled separately)

---

## Attendee communication — what to never promise before confirmation
- Specific menu items or dietary accommodations not yet confirmed with caterer
- Entertainment start times not yet locked in contract
- Exact gift bag or swag contents not yet received
- Parking or shuttle availability not yet secured with venue
`,
      required: true,
    },
    {
      name: 'Vendor and venue contact list',
      purpose:
        'Upload your vendor and venue contact list for the event. Claude uses this to address ' +
        'vendor emails correctly and reference the right contacts in run-of-show owner assignments.',
      kind: 'user-provided',
      guidance:
        'Paste a simple list with: vendor or venue name, primary contact name, role (e.g., "catering manager"), ' +
        'and email or phone. You do not need full contract details here — just enough for Claude to address ' +
        'emails correctly and assign ownership in the run-of-show. One line per vendor works fine.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'event-planner-scenario-1',
      title: 'Build a run-of-show timeline for a product launch',
      userInput:
        'Create a run-of-show for a product launch event next Thursday at the Meridian Rooftop venue. ' +
        'The event runs from 6 PM to 9 PM. Programme: doors open at 6, welcome drinks until 6:30, ' +
        'CEO keynote at 6:30 (15 min), product demo at 6:50 (20 min), canapés and networking from 7:15, ' +
        'raffle draw at 8:30, closing remarks at 8:45, guests depart by 9 PM. My team is me + one assistant.',
      expectedBehavior:
        'Claude should produce a run-of-show table for the entire event from 6 PM to 9 PM. Each row must ' +
        'include the time, item, owner (either the planner or the assistant — not invented staff), duration, ' +
        'and a brief contingency or buffer note. It should flag any tight transitions (e.g., the gap between ' +
        'the product demo and canapés setup) and not invent speakers, vendors, or other details beyond what ' +
        'was provided.',
      mustContain: ['Meridian Rooftop', 'keynote', 'raffle', '8:45'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'event-planner-scenario-2',
      title: 'Draft a vendor confirmation email to the catering team',
      userInput:
        'Write a confirmation email to the catering company, Harvest & Co., for a corporate awards ' +
        'dinner on August 15th at the Grand Pavilion. Contact is their events manager, Rachel Osei. ' +
        'We need: 3-course dinner for 120 guests, one vegetarian option per course, service to start ' +
        'at 7:30 PM. Final menu to be submitted to us by July 31st.',
      expectedBehavior:
        'Claude should produce a professional vendor confirmation email addressed to Rachel Osei at ' +
        'Harvest & Co. that opens with the event date, venue, and coordinator contact, then confirms ' +
        'the catering scope (120 guests, 3-course dinner, vegetarian options per course, 7:30 PM service ' +
        'start), states the July 31st menu submission deadline clearly, and closes with the planner\'s ' +
        'name and contact. The email should not invent pricing, dietary specifics, or menu details.',
      mustContain: ['Harvest & Co.', 'Rachel Osei', '120', 'July 31', 'Grand Pavilion'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'event-planner-scenario-3',
      title: 'Write a logistics email to event attendees',
      userInput:
        'Draft an attendee logistics email for a charity gala on September 6th at the Rosewood Ballroom, ' +
        'doors open 7 PM, black tie. Include parking info: valet available at $20, street parking within ' +
        '5 minutes walk. Dietary requests must be submitted by August 25th. Do not promise the entertainment ' +
        'lineup yet — it\'s not confirmed.',
      expectedBehavior:
        'Claude should produce a logistics email to attendees covering event details (September 6th, ' +
        'Rosewood Ballroom, 7 PM doors, black tie dress code), parking information (valet at $20, street ' +
        'parking nearby), the August 25th dietary request deadline, and a warm, appropriately formal ' +
        'tone matching a charity gala. It must not promise or mention any entertainment details since ' +
        'those have not been confirmed.',
      mustContain: ['Rosewood Ballroom', 'September 6', 'valet', '$20', 'August 25', 'black tie'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
