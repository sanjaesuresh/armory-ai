/**
 * Lesson: Loop engineering, shaping what happens around each response
 * Track: engineering | Order: 4 | Slug: loop-engineering
 *
 * Extends ai-engineering-types' overview of the three levers by going deep on
 * the third one: loop engineering. Walks the agent loop as a five-stage cycle
 * (decide, act, observe, verify, iterate) and shows a concrete case where a
 * verification step catches a wrong result before the user ever sees it.
 * Different worked example from ai-engineering-types (that one fixes a failing
 * test; this one catches a silently-wrong data migration).
 */

import type { Lesson } from '@/lib/learn/types';

export const loopEngineering: Lesson = {
  slug: 'loop-engineering',
  track: 'engineering',
  title: 'Loop engineering',
  tagline: 'The third lever is not what you say or what the model sees, it is what happens around each response, and it is where most silent failures get caught or missed.',
  minutes: 7,
  order: 4,

  blocks: [
    // ─── Prose: what loop engineering actually is ────────────────────────────
    {
      type: 'prose',
      heading: 'Engineering the loop, not the prompt',
      paragraphs: [
        'Prompt engineering changes what you say. Context engineering changes what the model can see. Loop engineering is different again: it changes what happens around each response, before the model acts and after it acts, without touching the prompt or the context at all.',
        'An agent does not produce one answer and stop. It runs a loop: decide on a next step, act by calling a tool, observe the result, and decide again. Left alone, that loop will happily stop as soon as it produces something that looks finished. Looking finished and being correct are not the same thing, and the gap between them is exactly what loop engineering closes.',
        'The concrete moves are the tools you give the agent, the hooks that fire automatically on events like a file write, the subagents you send off to check a result independently, and the retry logic that sends the agent back around the loop when a check fails instead of accepting the first attempt. None of these change what the model was told or what it could read. They change the system the model operates inside.',
        'This matters because it is a system-level decision, not a per-message one. You configure loop engineering once, in a hook script or a subagent definition or a settings file, and it applies to every request that follows. A sharper prompt only helps the one time you type it.',
      ],
    },

    // ─── Hotspot diagram: loop-cycle ──────────────────────────────────────────
    {
      type: 'hotspotDiagram',
      diagramId: 'loop-cycle',
      hotspots: [
        {
          id: 'decide',
          title: 'Decide',
          body: 'The model looks at the current context, the request, the files it has read, the results of any earlier steps, and picks what to do next: call a tool, ask a question, or give a final answer. This step is where the model\'s judgment lives, and it is only as good as what came before it in the loop.',
        },
        {
          id: 'act',
          title: 'Act',
          body: 'The agent executes the chosen action through a tool: edit a file, run a shell command, search the codebase, call an API. This is the only point where the agent actually changes something in the world; everything else in the loop is reading, thinking, or checking.',
        },
        {
          id: 'observe',
          title: 'Observe',
          body: 'The result of the action, a file diff, command output, search results, gets appended back into the model\'s context. The next "decide" step reasons over this new information along with everything before it. A loop that never lets the model observe its own actions cannot correct course.',
        },
        {
          id: 'verify',
          title: 'Verify',
          body: 'The engineering lever. A verification step you deliberately add: a hook that runs the test suite after a file write, a subagent that reviews a change with fresh eyes, an explicit instruction to check output against a spec before reporting done. Without this step the loop stops at "looks right." With it, the loop stops at "checked and right."',
        },
        {
          id: 'iterate',
          title: 'Iterate',
          body: 'If verification fails, the loop feeds that failure back in and runs another pass, decide again with the new information that the last attempt did not hold up. If verification passes, the loop stops and reports the result. Iteration only works if there was a verify step to fail against; without one, the loop has nothing to iterate on and just stops at the first attempt.',
        },
      ],
    },

    // ─── Step-through: a plausible but wrong migration, caught by verify ─────
    {
      type: 'stepThrough',
      intro: 'A data migration task, walked through the loop, showing where a verify step catches a wrong result before anyone ships it.',
      steps: [
        {
          title: 'Step 1: The request',
          body: 'You ask Claude Code to write a migration script that backfills a new `display_name` column on the `users` table, using `first_name` and `last_name` where both exist, falling back to `email` (the part before the @) otherwise.\n\nDecide: Claude reads the schema, sees the three columns, and plans a single UPDATE statement with a CASE expression.',
        },
        {
          title: 'Step 2: Act, then observe',
          body: 'Claude writes the migration file and, without a verify step, would normally report it done here. Act: it creates the SQL file with the CASE logic. Observe: the file write succeeds and the linter passes. Nothing so far has touched real data or checked the logic against real rows, a syntactically valid migration can still be behaviourally wrong.',
        },
        {
          title: 'Step 3: A verify step catches the bug',
          body: 'A PostToolUse hook is configured to run the migration against a snapshot of the staging database and diff a sample of rows against expected output whenever a file under migrations/ is written. It fires automatically.\n\nThe check fails: for users where `first_name` and `last_name` are both empty strings (not null, empty strings), Claude\'s CASE expression treated them as present because it only checked for NULL. Those rows get a blank `display_name` instead of falling back to the email-derived name.\n\nWithout this step, the migration looks complete: valid SQL, no lint errors, ran without an error. It would have shipped a silent data bug that only shows up later as blank names in the product.',
        },
        {
          title: 'Step 4: Iterate',
          body: 'The hook\'s failure output, which rows mismatched and why, gets appended back into Claude\'s context. Decide, again: Claude reads the diff, sees that empty strings were not being treated as missing, and rewrites the CASE expression to check for both NULL and empty string. Act: it rewrites the file. Observe and verify run again, this time the row diff matches. The loop stops here, at verified, not at the first plausible draft.',
        },
      ],
    },

    // ─── Callout: the rule of thumb ───────────────────────────────────────────
    {
      type: 'callout',
      tone: 'tip',
      passage: 'Rule of thumb: make the agent stop at verified, not at plausible. If a task has a way to check correctness, a test, a schema, a diff against expected output, wire that check into the loop as a hook or a reviewing subagent, rather than trusting that a clean-looking result is a correct one. The check costs a few seconds per run; a silent wrong answer costs whatever it takes to find and undo it later.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What distinguishes loop engineering from prompt engineering and context engineering?',
        choices: [
          'Loop engineering is just a more advanced way of phrasing the same request',
          'Loop engineering changes what happens around each response, tools, hooks, verification, retries, rather than what you say or what the model can see',
          'Loop engineering only applies to coding agents, not to chat-based assistants',
        ],
        correctIndex: 1,
        explanation:
          'Prompt engineering changes the words in your request. Context engineering changes which files and information the model can see. Loop engineering changes neither, it changes the system around the model\'s responses: what tools it has, whether a hook runs after an action, whether a subagent checks the result, whether the loop retries on failure. It is a system-level configuration, not a per-message one.',
      },
      {
        prompt: 'In the five-stage loop (decide, act, observe, verify, iterate), which stage is described as "the engineering lever"?',
        choices: [
          'Act, because it is the only stage that changes something in the world',
          'Observe, because it feeds the tool result back into context',
          'Verify, because it is the deliberately added check that catches a plausible-but-wrong result before it ships',
        ],
        correctIndex: 2,
        explanation:
          'Decide, act, and observe happen in some form in any agent loop, they are not optional. Verify is the stage you deliberately design in: a hook, a subagent review, an explicit check against a spec. Without it the loop stops as soon as a result looks finished. With it, the loop only stops once the result has actually been checked.',
      },
      {
        prompt: 'In the migration example, what would have happened if the PostToolUse hook running a row diff against staging had not been configured?',
        choices: [
          'Claude would have caught its own mistake anyway, since it always double-checks CASE expressions',
          'The migration would have shipped with a silent bug, blank display names for users with empty-string first and last names, because the SQL was syntactically valid and passed the linter',
          'The task would have failed immediately, since Claude cannot write SQL without a verify step',
        ],
        correctIndex: 1,
        explanation:
          'The bug was not a syntax error or a lint failure, it was a logic gap: the CASE expression checked for NULL but not for empty strings. A clean-looking, lint-passing migration is not the same as a correct one. Without the row-diff hook, that gap would have shipped silently and only surfaced later as bad data in production.',
      },
      {
        prompt: 'Scenario: A team\'s agent keeps producing refactors that pass a quick visual read but occasionally break an untested edge case that nobody notices until a user reports it. Which change most directly closes this gap?',
        choices: [
          'Ask the agent to "please double-check your work" at the end of every prompt',
          'Give the agent more files to read before it starts the refactor',
          'Add a verification step, a hook that runs the full test suite (or a reviewing subagent) after every refactor, so failures surface before the result reaches a person',
        ],
        correctIndex: 2,
        explanation:
          'Asking the model to "double-check" is still a prompt-level fix, it relies on the same pass that already missed the edge case, no new information enters the loop. More files is a context fix and does not address a missed edge case in already-visible code. The actual gap is that nothing after the refactor checks it against real behaviour. A hook or subagent that runs the test suite closes that gap at the system level, catching the same class of failure on every future run, not just this one.',
      },
    ],
  },

  applyCta: null,
};
