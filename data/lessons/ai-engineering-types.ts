/**
 * Lesson: Three levers — prompt, context, and loop engineering
 * Track: claude-code | Order: 5 | Slug: ai-engineering-types
 *
 * Teaches the three levers for getting better results from an AI agent:
 * what you say (prompt engineering), what the model sees (context engineering),
 * and what happens around each response (loop engineering). Uses a concrete
 * step-through: one task improved three ways.
 */

import type { Lesson } from '@/lib/learn/types';

export const aiEngineeringTypes: Lesson = {
  slug: 'ai-engineering-types',
  track: 'claude-code',
  title: 'The three levers',
  tagline: 'Better prompts are just one of three levers — what the model can see and what happens after its reply often matter more.',
  minutes: 7,
  order: 5,

  blocks: [
    // ─── Prose: three levers ──────────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'Three levers for better results',
      paragraphs: [
        'When an AI agent gives you a bad result, people usually blame the model. In practice, the model is rarely the bottleneck. There are three distinct levers that shape what the agent produces — and only one of them is what you wrote in your message.',
        'The first lever is what you say: the phrasing, examples, and constraints in your request. This is prompt engineering — the most visible but often the least powerful of the three.',
        'The second lever is what the model sees: which files, documents, and memory are loaded into the context when your request is processed. Even a perfectly phrased prompt produces a mediocre result if the model is working without the relevant information.',
        'The third lever is what happens around each response: the tools available, the verification steps built into the loop, whether subagents run independent checks, whether the agent retries on failure. This is loop engineering — shaping the agent\'s behaviour at the system level rather than the prompt level.',
        'All three levers interact. A sharp prompt with the wrong files in context still fails. The right files with a loop that never verifies its own output produces confident mistakes. Getting good results consistently means thinking about all three.',
      ],
    },

    // ─── Comparison table ─────────────────────────────────────────────────────
    {
      type: 'comparisonTable',
      headers: ['Lever', 'What it means', 'Example move'],
      rows: [
        [
          'Prompt engineering',
          'Changing how you phrase the request — adding examples, specifying format, stating constraints',
          'Replace "fix this bug" with "fix the null-check bug in parseUser(); the function should return null, not throw, when the input is undefined"',
        ],
        [
          'Context engineering',
          'Controlling which files, docs, and memory files are loaded when the model processes your request',
          'Before asking for a refactor, open the relevant module and its tests so the model sees the actual code — not a stale cached version',
        ],
        [
          'Loop engineering',
          'Shaping what happens around each response: tools available, verification steps, hooks, subagents, retry logic',
          'Add a PostToolUse hook that runs the test suite after every file write, so the agent sees immediately whether its edit broke anything',
        ],
      ],
    },

    // ─── Step-through: fix a failing test, three ways ─────────────────────────
    {
      type: 'stepThrough',
      intro: 'One task — "fix a failing test" — improved three ways. Each step names what changed and why the output got better.',
      steps: [
        {
          title: 'Step 1: Sharper prompt',
          body: 'Original request: "fix the failing test." Result: Claude guesses which test, reads a generic file, suggests a change that does not address the root cause.\n\nImproved: "The test parseUser_returns_null_on_missing_email in src/auth/parseUser.test.ts is failing with TypeError: Cannot read property \'email\' of undefined. Fix the parseUser function so it returns null instead of throwing when input is undefined."\n\nWhat changed: the prompt named the exact test, the exact error, and the exact expected behaviour. What improved: Claude went directly to the right file with the right goal — no guessing.',
        },
        {
          title: 'Step 2: Right files in context',
          body: 'Even with a sharper prompt, Claude can still work from stale or incomplete information if the relevant files are not open. Before the request, open src/auth/parseUser.ts and src/auth/parseUser.test.ts so they are in the active context.\n\nWhat changed: the model now sees the actual current implementation alongside the actual failing test — not inferred versions reconstructed from memory or a previous read. What improved: the suggested fix targets the real code, not a guess about what the code might say.',
        },
        {
          title: 'Step 3: A loop that runs the test',
          body: 'A sharp prompt and the right files get Claude to a plausible fix — but plausible is not the same as correct. Add a PostToolUse hook (or instruct Claude explicitly) to run the failing test suite after every edit.\n\nWhat changed: the agent loop now includes a verification step. After writing the fix, Claude runs the test, reads the result, and either confirms success or continues iterating. What improved: the loop catches the cases where the first fix was wrong — before you ever see the output. The agent does not stop at a plausible answer; it stops at a verified one.',
        },
      ],
    },

    // ─── Callout: most complaints are context problems ────────────────────────
    {
      type: 'callout',
      tone: 'tip',
      passage: 'Most "the AI is bad at this" complaints are actually context problems — the model was working without the information it needed to do the task correctly. Before rewriting your prompt, ask: does the model have the right files open? Is CLAUDE.md up to date for this project? Is there relevant background it has never seen? Context fixes often outperform prompt rewrites.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What is the difference between prompt engineering and context engineering?',
        choices: [
          'Prompt engineering changes what you say; context engineering changes what the model can see when it processes your request',
          'Prompt engineering is for beginners; context engineering is an advanced technique only developers use',
          'They are the same thing — "context" just refers to the conversation history created by your prompts',
        ],
        correctIndex: 0,
        explanation:
          'Prompt engineering is about phrasing — how you describe the task, the constraints, the format you want. Context engineering is about information — which files, documents, and memory files are loaded into the context window when the model works on your request. A perfect prompt still fails if the model is missing the relevant code or documentation.',
      },
      {
        prompt: 'What does "loop engineering" mean?',
        choices: [
          'Writing prompts that include explicit loops, like "repeat this step three times"',
          'Shaping what happens around each response — tools, verification steps, hooks, subagents, and retry logic',
          'Optimising the speed of the agent loop to reduce response time',
        ],
        correctIndex: 1,
        explanation:
          'Loop engineering operates at the system level: what tools the agent has access to, whether a hook runs the test suite after every edit, whether a subagent independently verifies the result, whether the loop retries on a failure signal. It shapes the agent\'s behaviour without changing the prompt or the model.',
      },
      {
        prompt: 'Scenario: You ask Claude Code to refactor a module. The result looks plausible but breaks three tests you did not notice. Which lever most directly addresses this failure?',
        choices: [
          'Prompt engineering — ask more clearly for a correct refactor',
          'Loop engineering — add a step that runs the tests after every edit so the agent sees failures before you do',
          'Context engineering — open more files so the model has better background',
        ],
        correctIndex: 1,
        explanation:
          'This is a verification gap — the agent produced a plausible-looking result without checking whether it was actually correct. The fix is loop engineering: add a hook or explicit instruction to run the test suite after every edit. The agent then sees the test failures itself and continues iterating until they pass, rather than stopping at "plausible."',
      },
      {
        prompt: 'Scenario: You ask Claude Code to update `parseUser` — you name the function explicitly in your request. It still rewrites the wrong `parseUser` — there are two functions with that name in different modules, and the wrong file was already in the model\'s view. Which lever most directly addresses this failure?',
        choices: [
          'Loop engineering — add a verification step after the edit',
          'Prompt engineering — mention the exact function name in your request',
          'Context engineering — open the correct file before making the request, so the model sees the right code',
        ],
        correctIndex: 2,
        explanation:
          'The model rewrote the wrong `parseUser` even though the prompt named the function exactly — because two functions share that name in different modules, and naming it alone cannot resolve the ambiguity when the wrong file is in view. The model edits what it can see. Opening the correct file before your request gives the model unambiguous evidence of which `parseUser` you mean. Context engineering solves this; prompt engineering cannot compensate when the file in view is wrong.',
      },
      {
        prompt: 'In the step-through example, what did adding a "loop that runs the test" improve specifically?',
        choices: [
          'It made the request faster by pre-loading the test results before Claude started working',
          'It let the agent verify its own fix — by running the test after each edit, it caught wrong fixes before you ever saw the output',
          'It prevented Claude from touching any files the test did not cover',
        ],
        correctIndex: 1,
        explanation:
          'Running the test suite inside the loop turns "plausible fix" into "verified fix." The agent writes the change, runs the test, reads the result, and either confirms the fix worked or continues iterating. You see the output only after the test passes — not every intermediate attempt. This is the key benefit of loop engineering over just writing a better prompt.',
      },
    ],
  },

  applyCta: null,
};
