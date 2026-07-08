import type { Setup } from '@/lib/setup/types';

export const siteSupervisorSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-site-supervisor-v1',
  slug: 'site-supervisor',
  name: 'Site Supervisor',
  tagline: 'Daily logs, toolbox talks, crew schedules, and incident reports, drafted on site',
  description:
    'Configure Claude as a field documentation partner for your construction site. It drafts daily ' +
    'site logs, safety-briefing notes (toolbox talks), crew schedules, and incident report outlines, ' +
    'while deferring all engineering, permit, and code compliance decisions to licensed professionals.',
  role: 'Site Supervisor',
  industry: 'Construction & Trades',
  tags: ['construction', 'site-supervision', 'safety', 'daily-logs', 'toolbox-talks', 'crew-management', 'incident-reporting'],
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

  instructionTemplate: `You are a field documentation partner for {{companyName}}, supporting the {{projectName}} project.

Trade scope on this project: {{tradeScope}}

Safety standard: {{safetyStandard}}

Your responsibilities:
- Draft daily site logs that record weather, crew counts, work completed, materials received, equipment used, visitors, and any delays or issues, accurately based on the information you are given.
- Write toolbox talk outlines (safety briefings) covering a specific hazard or topic, using language a crew will understand on site.
- Draft crew schedules showing who is assigned to which work area or task for the day or week.
- Prepare incident report outlines that capture the facts of an event (who, what, when, where, how) without making legal admissions or conclusions.
- Draft routine site correspondence: subcontractor coordination notes, inspection-ready notifications, and safety violation notices.

{{#if crewSize}}
Typical crew size: {{crewSize}} workers on site. When writing schedules and daily logs, calibrate the level of detail to a crew of this size.
{{/if}}

{{#if dailyLogFormat}}
Daily log format: {{dailyLogFormat}}. Use this format consistently for all site logs unless a specific situation requires a different structure.
{{/if}}

Rules:
1. Never fabricate names, headcounts, incident facts, inspection results, or work quantities, use only the information you are given.
2. Incident reports must record facts only; never include fault determinations, legal admissions, or speculation about cause, those belong to an investigation, not the initial report.
3. Toolbox talk content on specific OSHA regulations, code requirements, or safety thresholds must be verified by a safety professional before use, present the topic accurately and note when crew should confirm technical details with the competent person on site.
4. Defer all structural, engineering, and code compliance questions to the licensed engineer, architect, or authority having jurisdiction (AHJ), never advise directly on these matters.
5. Daily logs must record delays, safety events, and inspection failures honestly, do not soften or omit facts that could be relevant to claims or disputes later.
6. Crew schedule drafts must note any apparent conflicts (overtime, certifications required, trade sequencing) so the supervisor can resolve them before posting.
7. Never fabricate figures, safety-code specifications, or engineering facts; defer all permit and code sign-off to licensed professionals.`,

  variables: [
    {
      key: 'companyName',
      label: 'Company name',
      type: 'text',
      required: true,
      helpText: 'Your company name as it should appear on daily logs, reports, and safety documents.',
      group: 'About your project',
    },
    {
      key: 'projectName',
      label: 'Project name',
      type: 'text',
      required: true,
      helpText:
        'The name or address of the project, e.g., "Oakdale Community Center" or "1420 River Rd, Phase 2". ' +
        'Claude uses this on every document it drafts.',
      group: 'About your project',
    },
    {
      key: 'tradeScope',
      label: 'Trade scope on site',
      type: 'multiselect',
      options: [
        'Concrete and masonry',
        'Structural steel and framing',
        'Electrical',
        'Plumbing',
        'HVAC and mechanical',
        'Roofing',
        'Drywall and finishes',
        'Earthwork and grading',
        'Landscaping and site work',
        'General labor and cleanup',
      ],
      required: true,
      helpText:
        'The trades currently active on your site. Claude references these when drafting schedules, ' +
        'coordination notes, and toolbox talks.',
      group: 'About your project',
    },
    {
      key: 'crewSize',
      label: 'Typical crew size (optional)',
      type: 'number',
      required: false,
      helpText:
        'Approximate number of workers on site on a typical day. Claude uses this to calibrate ' +
        'the detail level of daily logs and schedule drafts.',
      group: 'About your project',
    },
    {
      key: 'safetyStandard',
      label: 'Safety standard',
      type: 'select',
      options: [
        'OSHA 10',
        'OSHA 30',
        'Company-specific safety plan',
        'OSHA 10 + company safety plan',
        'OSHA 30 + company safety plan',
      ],
      required: true,
      helpText:
        'The safety training or plan standard your crew follows. Claude references this when ' +
        'drafting toolbox talks and incident report outlines.',
      group: 'Safety',
    },
    {
      key: 'dailyLogFormat',
      label: 'Daily log format (optional)',
      type: 'select',
      options: ['Bullet summary', 'Structured form (section headings)', 'Narrative paragraph'],
      required: false,
      helpText:
        'How you prefer your daily site logs structured. Leave blank to let Claude choose based ' +
        'on the information provided.',
      group: 'Preferences',
    },
  ],

  knowledgeFiles: [
    {
      name: 'Site documentation reference card',
      purpose:
        'A compact reference Claude uses when drafting daily logs, toolbox talks, and incident ' +
        'reports. Covers required log sections, toolbox talk structure, incident report fields, ' +
        'and a daily safety checklist.',
      kind: 'starter',
      content: `# Site documentation reference card

## About this file
Update each section with your project's real details and company standards. Claude reads this before drafting any site document.

---

## Project quick facts

- Project name / address: [fill in]
- Owner / client: [fill in]
- General contractor: [fill in]
- Project manager contact: [fill in]
- Safety officer / competent person on site: [fill in]
- Emergency contact and nearest hospital: [fill in]
- Project start date and scheduled completion: [fill in]

---

## Daily site log, required sections

1. **Date, day, and weather**, Temperature (high/low), precipitation, wind; note if weather affected work
2. **Crew on site**, Total headcount by trade; note any absences or short staffing
3. **Work completed today**, Specific tasks finished, areas worked, quantities if known
4. **Materials received**, Delivery details: supplier, material, quantity, condition on arrival
5. **Equipment on site**, Major equipment active or idle, any breakdowns
6. **Inspections and visitors**, Inspector name, agency, result; owner or architect visits
7. **Delays and issues**, Cause, duration, impact on schedule; do not soften or omit
8. **Safety events**, Near-misses, incidents, first aid; brief factual note; full incident report separate
9. **Open items / tomorrow's plan**, What must happen next and who is responsible

---

## Toolbox talk structure (10–15 minutes)

1. **Topic**, Name the specific hazard or safety subject
2. **Why it matters today**, Connect the topic to actual work happening on site this shift
3. **The hazard**, What can go wrong; describe plainly without jargon
4. **Controls**, What we do to reduce the risk (PPE, procedures, equipment guards, buddy system, etc.)
5. **What to do if something goes wrong**, Stop work authority, who to notify, emergency contacts
6. **Sign-in sheet**, Date, topic, supervisor signature, each attendee prints and signs name

> Note: For specific OSHA regulation numbers, permissible exposure limits, or engineering controls, confirm with your competent person or safety officer before citing figures.

---

## Incident report, required fields (initial report only)

- Date, time, and exact location of incident
- Names of all persons involved (injured, witnesses)
- Description of what happened, facts only, sequence of events
- Type of incident (injury, near-miss, property damage, environmental)
- Body part and nature of injury (if applicable)
- First aid or medical treatment provided
- Equipment or materials involved
- Photos taken (yes/no; attach)
- Reported to: [name, title, time]

**Do not include:** fault determinations, legal admissions, speculation, or opinions in the initial report. Those belong in a formal investigation.

---

## Daily safety checklist

- [ ] Morning safety briefing held; attendees documented
- [ ] PPE in use and in good condition (hard hats, vests, boots, gloves, eye protection)
- [ ] Fall protection in place for any work above 6 feet
- [ ] Excavations inspected by competent person (if applicable)
- [ ] Scaffold tagged and inspected (if applicable)
- [ ] Housekeeping: walkways clear, materials stacked safely
- [ ] Hot work permits in place (if welding, cutting, or grinding)
- [ ] Tool and equipment inspections current
`,
      required: true,
    },
    {
      name: 'Project schedule and crew roster',
      purpose:
        'Upload your current project schedule, crew roster, and any open safety items or upcoming ' +
        'inspections. Claude uses this to draft accurate daily logs, schedules, and safety briefings.',
      kind: 'user-provided',
      guidance:
        'Paste your project milestone schedule (key dates and activities), the current crew roster ' +
        '(names, trade, and typical work area, no sensitive personal data), and any upcoming ' +
        'inspections, deadlines, or safety concerns. A simple list or schedule export from your ' +
        'project management tool works well.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'site-supervisor-scenario-daily-log',
      title: 'Draft a daily site log',
      userInput:
        'Write today\'s daily log for the Thornton Medical Office Build-Out. Date: July 7. Weather: ' +
        'partly cloudy, 84°F, no rain. Crew: 14 workers, 6 framers, 5 drywall, 3 electricians. ' +
        'Work completed: framing finished in suites 101 and 102; drywall hanging started in suite 103. ' +
        'A delivery of 200 sheets of 5/8" drywall arrived from Pacific Supply at 10am, all in good ' +
        'condition. No inspections, no incidents. Tomorrow: rough electrical inspection in suites 101/102.',
      expectedBehavior:
        'Claude should produce a structured daily site log for July 7, covering all provided sections: ' +
        'date and weather (84°F, partly cloudy), crew count (14 by trade breakdown), work completed ' +
        '(framing suites 101/102, drywall hanging suite 103), materials received (200 sheets 5/8" ' +
        'drywall from Pacific Supply at 10am, good condition), no incidents or inspections, and a ' +
        'tomorrow plan noting the rough electrical inspection. The log must not fabricate any details ' +
        'beyond what was provided.',
      mustContain: ['Thornton', 'July 7', '14', 'Pacific Supply', 'suite 101', 'electrical inspection'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'site-supervisor-scenario-toolbox-talk',
      title: 'Write a toolbox talk on heat illness prevention',
      userInput:
        'Write a toolbox talk outline on heat illness prevention for my crew. We are doing exterior ' +
        'framing in Phoenix in July, temperatures are hitting 105°F. I need something I can read ' +
        'through in about 10 minutes that covers the warning signs, what to do if someone goes down, ' +
        'and our site hydration policy (water every 20 minutes, shade available).',
      expectedBehavior:
        'Claude should produce a toolbox talk outline covering: why heat illness matters for this ' +
        'specific job (exterior framing, Phoenix, July, 105°F), the three types of heat illness ' +
        '(heat cramps, heat exhaustion, heat stroke) and their warning signs, the site hydration ' +
        'policy (water every 20 minutes, shade available), the emergency response (stop work, move ' +
        'to shade, call 911 for heat stroke), and a sign-in section. It should note that specific ' +
        'OSHA thresholds should be confirmed with the competent person. The content must be in plain ' +
        'language a field crew can follow.',
      mustContain: ['Phoenix', '105', 'heat stroke', 'water', '20 minutes', 'shade'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'site-supervisor-scenario-incident-report',
      title: 'Draft an initial incident report',
      userInput:
        'Help me write an initial incident report. At 2:15pm today, a framer named Carlos Medina ' +
        'on the Barton Creek project stepped on a nail that went through his boot. He was working ' +
        'in Building B, second floor. He was taken to Urgent Care at Barton Creek Medical. Two ' +
        'coworkers, José Reyes and Dana Park, witnessed the incident. No other injuries.',
      expectedBehavior:
        'Claude should produce an initial incident report with separate fields for: date and time ' +
        '(2:15pm), location (Barton Creek project, Building B, second floor), injured party ' +
        '(Carlos Medina), nature of injury (nail through boot/foot), witnesses (José Reyes and ' +
        'Dana Park), medical treatment (Urgent Care at Barton Creek Medical), and a factual ' +
        'sequence of events. The report must record facts only, it must not assign fault, make ' +
        'legal conclusions, or speculate on cause. It should include a note that a full investigation ' +
        'follows.',
      mustContain: ['Carlos Medina', 'Barton Creek', 'Building B', 'José Reyes', 'Dana Park', 'Urgent Care'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
