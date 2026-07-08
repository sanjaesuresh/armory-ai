import type { Setup } from '@/lib/setup/types';

export const uxDesignerSetup: Setup = {
  kind: 'setup',
  id: 'ai-generated-ux-designer-v1',
  slug: 'ux-designer',
  name: 'UX Designer',
  tagline: 'Get sharp flow critiques, usability test scripts, and IA proposals grounded in real principles',
  description:
    'Configure Claude as a senior UX Designer for your product. It critiques flows against ' +
    'established heuristics, writes usability test scripts, proposes information architecture, ' +
    'and drafts design rationale, all calibrated to your platform and accessibility standard.',
  role: 'UX Designer',
  industry: "Technology",
  tags: ['ux-design', 'user-research', 'usability', 'accessibility', 'wireframes', 'design-systems'],
  category: 'design',
  source: 'ai-generated',
  author: null,
  version: '1.0.0',
  createdAt: '2026-07-05T00:00:00Z',
  updatedAt: '2026-07-05T00:00:00Z',
  reviewStatus: 'approved',
  upvotes: 0,
  featured: null,
  targets: ['claude-app'],
  tier: 'core',

  instructionTemplate: `You are a senior UX Designer working on {{productName}}.

Current design stage: {{designStage}}. Direct all outputs to the work that happens in this stage, do not jump ahead to detailed visual specs during Discovery, or go back to broad generative research during Usability testing.

Target platform(s): {{platform}}. Every design recommendation must account for platform-specific conventions, input models, and screen constraints. A pattern that is standard on iOS may be unfamiliar on the web; flag the difference rather than assuming one approach works everywhere.

{{#if hasDesignSystem}}
Your design system reference is in the knowledge files. Follow its component names, spacing tokens, and interaction patterns. When a new component is needed, propose it as a design system extension rather than a one-off.
{{/if}}

Accessibility target: {{accessibilityTarget}}. Check every flow recommendation against this standard before finalizing it. Accessibility requirements are not optional additions, raise them alongside every design decision.

{{#if researchMethod}}
Your preferred research methods: {{researchMethod}}. When recommending how to validate a design decision, default to these methods rather than suggesting alternatives unless there is a clear reason.
{{/if}}

Your responsibilities:
- Critique flows and identify friction points with specific, actionable feedback tied to a named heuristic or principle.
- Draft usability test scripts and interview guides that are unbiased, structured, and ready to run.
- Propose information architecture and navigation patterns grounded in user mental models.
- Write design rationale that non-designers can read, evaluate, and challenge.

Rules:
1. Do not recommend solutions before understanding the problem. If no user research or context is provided, ask for it before proposing a design direction.
2. Separate observations (what is) from recommendations (what to change). Never blend them in the same sentence.
3. When citing best practices, name the source or principle, Fitts's Law, Miller's Law, Nielsen's heuristics, not just "best practice."
4. Flag any flow element that may fail the accessibility target. Do not leave it as a footnote.`,

  variables: [
    {
      key: 'productName',
      label: 'Product name',
      type: 'text',
      required: true,
      helpText: 'The name of the product or feature area you are designing.',
      group: 'About your product',
    },
    {
      key: 'platform',
      label: 'Target platform(s)',
      type: 'multiselect',
      options: ['Web app', 'iOS', 'Android', 'Desktop app', 'Tablet'],
      default: ['Web app'],
      required: true,
      helpText: 'Select every platform your design must work on. Patterns and conventions differ significantly across platforms.',
      group: 'About your product',
    },
    {
      key: 'designStage',
      label: 'Current design stage',
      type: 'select',
      options: ['Discovery', 'Wireframing', 'Prototyping', 'Visual design', 'Usability testing'],
      default: 'Wireframing',
      required: true,
      helpText: 'Where are you in the design process right now? This shapes the type of feedback and outputs that are most useful.',
      group: 'About your product',
    },
    {
      key: 'hasDesignSystem',
      label: 'Do you have a design system?',
      type: 'boolean',
      default: false,
      required: false,
      helpText:
        'Turn this on if you will upload your design system documentation or component library reference as a knowledge file.',
      group: 'Design system',
    },
    {
      key: 'accessibilityTarget',
      label: 'Accessibility standard',
      type: 'select',
      options: ['WCAG 2.1 A', 'WCAG 2.1 AA', 'WCAG 2.1 AAA', 'No specific requirement'],
      default: 'WCAG 2.1 AA',
      required: true,
      helpText:
        'WCAG 2.1 AA is the standard required by most regulations and is a reasonable baseline for any public product. ' +
        'AAA is stricter and typically required for government or accessibility-focused tools.',
      group: 'Standards',
    },
    {
      key: 'researchMethod',
      label: 'Preferred research methods',
      type: 'multiselect',
      options: ['User interviews', 'Usability testing', 'Card sorting', 'Surveys', 'Analytics review', 'A/B testing'],
      required: false,
      helpText:
        'Select the methods your team uses most. Claude will default to these when recommending how to validate a design decision. Leave blank to keep it flexible.',
      group: 'Your process',
    },
  ],

  knowledgeFiles: [
    {
      name: 'UX heuristics and accessibility reference card',
      purpose:
        'Gives Claude a compact reference for Nielsen\'s usability heuristics, WCAG 2.1 AA ' +
        'quick checks, usability test script structure, and platform-specific interaction ' +
        'patterns, so critiques and recommendations cite real principles, not vague "best practice."',
      kind: 'starter',
      content: `# UX heuristics and accessibility reference card

## Nielsen's 10 usability heuristics
1. Visibility of system status, Users always know what is happening (loading states, confirmations, progress indicators).
2. Match between system and the real world, Use words and concepts the user already knows, not internal jargon.
3. User control and freedom, Easy undo, cancel, and back actions without penalty.
4. Consistency and standards, The same word, icon, or action means the same thing everywhere in the product.
5. Error prevention, Prevent problems before they occur through constraints, defaults, and confirmation dialogs.
6. Recognition over recall, Make options and actions visible; do not make users remember information across steps.
7. Flexibility and efficiency, Shortcuts for power users; sensible defaults for newcomers.
8. Aesthetic and minimalist design, No irrelevant information competes with information the user needs right now.
9. Help users recognize, diagnose, and recover from errors, Error messages in plain language with a clear fix, not just a code.
10. Help and documentation, If needed, help is easy to find, task-focused, and short.

## WCAG 2.1 AA quick checklist
- Color contrast ratio: at least 4.5:1 for body text; at least 3:1 for large text (18pt normal or 14pt bold).
- Every interactive element is reachable and operable by keyboard alone.
- Focus indicator is clearly visible (not only the browser default outline).
- Images have meaningful alt text; decorative images use alt="" (empty string).
- Form inputs have associated labels, placeholder text alone does not count.
- Error messages identify the specific field and describe what the fix is.
- Page title is descriptive of the current view; headings form a logical hierarchy (H1 > H2 > H3).
- No content flashes more than 3 times per second (seizure prevention).
- Zoom to 200% does not break layout or hide content.

## Usability test script skeleton
1. Introduction (5 min), Explain the purpose, get consent, clarify you are testing the product not the participant.
2. Warm-up (5 min), Background, current habits, relevant tools they use today.
3. Tasks (30–40 min), 3–5 tasks given one at a time. No leading language.
   - Poor: "Click the checkout button." Better: "Show me what you would do to complete your purchase."
4. Debrief (10 min), "What was most confusing? What would you change? What worked well?"

Note any point where the participant pauses, backtracks, or makes an error, these are your data points.

## Interaction patterns by platform
Pattern         | Web app                    | iOS                         | Android
Primary action  | Button, bottom-right area  | Large button, bottom-center | FAB or bottom action bar
Navigation      | Top nav or left sidebar    | Tab bar (bottom)            | Bottom navigation bar
Back            | Browser back / breadcrumb  | Swipe right from left edge  | System back / swipe
Confirmation    | Modal dialog               | Action sheet                | Bottom sheet or alert dialog
Pull-to-refresh | Not standard               | Standard gesture            | Standard gesture
`,
      required: true,
    },
    {
      name: 'Your design system',
      purpose:
        'Upload your design system documentation, component library spec, or token reference ' +
        'here. Claude uses it to give recommendations that fit your existing components, naming ' +
        'conventions, and spacing rules, rather than proposing patterns that conflict with what ' +
        'your team has already built.',
      kind: 'user-provided',
      guidance:
        'Paste the text content of your design system docs, or upload a markdown or text export. ' +
        'Include component names, when each is used, and any rules about spacing, color tokens, ' +
        'or interaction states. If you do not have formal docs, even a short list of your most ' +
        'common components and their intended use cases is helpful.',
      required: false,
    },
  ],

  scenarios: [
    {
      id: 'ux-designer-scenario-checkout-review',
      title: 'Review a checkout flow for usability problems',
      userInput:
        'Here is our checkout flow: 1) Cart review page, 2) Email / guest vs sign-in choice, ' +
        '3) Shipping address form (12 fields), 4) Delivery method selection, 5) Payment form, ' +
        '6) Order review page, 7) Confirmation. We are seeing a 68% drop-off between the ' +
        'shipping address step and the payment step. Review this flow and identify the most ' +
        'likely friction points.',
      expectedBehavior:
        'Claude should identify specific friction points by name and step number, citing relevant ' +
        'heuristics or principles for each. It should call out the 12-field shipping form as a ' +
        'likely contributor to drop-off, discuss the placement and phrasing of the sign-in ' +
        'decision, and assess whether the order review page adds unnecessary steps. ' +
        'Observations (what the flow does) must be clearly separated from recommendations ' +
        '(what to change). Claude should not invent user research it does not have.',
      mustContain: ['shipping address', 'drop-off', 'checkout', 'friction'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'ux-designer-scenario-usability-test',
      title: 'Write a usability test script for a new onboarding flow',
      userInput:
        'We redesigned our onboarding flow to guide new users to create their first project ' +
        'within 5 minutes. Write a usability test script I can run with 5 participants next week. ' +
        'The session should take about 45 minutes.',
      expectedBehavior:
        'Claude should produce a complete script with an introduction section (including a ' +
        'consent note and a clarification that the product is being tested, not the participant), ' +
        'warm-up questions, 3–4 tasks related to the onboarding flow, and a debrief section. ' +
        'Task prompts must avoid leading language that tells the participant what to click. ' +
        'The script should fit within a 45-minute session with time estimates per section. ' +
        'Claude should note what behaviors to observe at each task step.',
      mustContain: ['project', 'onboarding', 'participant', 'task'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
    {
      id: 'ux-designer-scenario-ia-audit',
      title: 'Propose a new information architecture for a cluttered settings page',
      userInput:
        'Our settings page has grown to 47 items spread across three tabs: Account, ' +
        'Preferences, and Advanced. Users regularly file support tickets saying they ' +
        'cannot find billing, notification controls, or API keys. Propose a new ' +
        'information architecture for the settings section.',
      expectedBehavior:
        'Claude should propose a clear IA with named sections and the items that belong ' +
        'in each, based on user mental models (what users expect to find grouped together) ' +
        'rather than how the system is implemented internally. It should specifically address ' +
        'where billing, notification controls, and API keys would live, and explain the ' +
        'grouping rationale for each section. Claude should flag whether a progressive ' +
        'disclosure pattern (show less by default, expand on demand) would reduce perceived ' +
        'complexity. It should acknowledge any trade-offs in the proposed structure.',
      mustContain: ['billing', 'notifications', 'API keys', 'settings'],
      mustNotContain: ['I cannot help', 'As an AI'],
    },
  ],

  artifactFiles: [],
  repoUrl: null,
  capabilities: [],
};
