/**
 * Lesson: Agents and subagents — how Claude delegates work
 * Track: claude-code | Order: 3 | Slug: claude-code-agents
 *
 * Teaches the difference between an agent and a subagent: what context
 * isolation means, why parallel and large tasks benefit from delegation,
 * and — critically — that a subagent returns a summary, not its transcript.
 */

import type { Lesson } from '@/lib/learn/types';

export const claudeCodeAgents: Lesson = {
  slug: 'claude-code-agents',
  track: 'claude-code',
  title: 'Agents and subagents — how Claude delegates work',
  tagline: 'A subagent takes one task, works in its own context window, and returns a summary — not a transcript.',
  minutes: 6,
  order: 3,

  blocks: [
    // ─── Prose: what an agent is ──────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'An agent is a model with tools and its own context',
      paragraphs: [
        'An agent is not a special mode or a separate product — it is the combination of a model, the tools it can call, and the context it is working from. Every Claude Code session is already an agent: you, the model, and the tools (read, write, run) sharing a context window.',
        'The main agent — the one you are talking to — handles the overall task. But some tasks are large enough, or independent enough, that handling them inside the main conversation is expensive or impractical. That is where subagents come in.',
        'A subagent is a second agent that the main agent spawns to handle one specific piece of work. The main agent hands off a clearly scoped task — "explore this directory and summarise what each module does" — and the subagent goes off and works through it in its own separate context window.',
      ],
    },

    // ─── Hotspot diagram: subagent-delegation ─────────────────────────────────
    {
      type: 'hotspotDiagram',
      diagramId: 'subagent-delegation',
      hotspots: [
        {
          id: 'main-agent',
          title: 'Main agent',
          body: 'The primary agent handling your overall session. It manages the big picture, decides when to delegate, and synthesises results from any subagents it spawned. Its context window stays relatively small because the heavy exploration happens elsewhere.',
        },
        {
          id: 'task-handoff',
          title: 'Task handoff',
          body: 'The main agent passes a clearly scoped task to the subagent — for example, "read all files under /src/api and write a summary of each module\'s purpose." The handoff includes the task description and any context the subagent needs to start. Nothing more.',
        },
        {
          id: 'subagent-context',
          title: 'Subagent context (separate window)',
          body: 'The subagent runs in its own, fresh context window — completely separate from the main conversation. All the reading, tool calls, intermediate reasoning, and file exploration happen here. This is where the expensive, noisy work lives. It never touches the main agent\'s context.',
        },
        {
          id: 'returned-summary',
          title: 'Returned summary',
          body: 'When the subagent finishes, it returns a concise summary of what it found or did — not a transcript of its work. The main agent receives this summary, adds it to its own context, and continues. The main context stays clean: only the result comes back, not the pages of intermediate steps.',
        },
      ],
    },

    // ─── Prose: why delegate ──────────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'Why delegate at all?',
      paragraphs: [
        'Context isolation is the main reason. A large codebase exploration — reading dozens of files, following imports, mapping dependencies — can easily consume tens of thousands of tokens. If that exploration happened in the main conversation, it would crowd out the task you actually care about. The main agent\'s context window would be full of intermediate steps before the real work even began.',
        'By delegating to a subagent, the heavy work happens in a separate context that is discarded when the task is done. Only the summary comes back. The main conversation stays compact and focused.',
        'The second reason is parallelism. Independent tasks — "review these three modules separately and report back" — can each go to their own subagent and run at the same time. Sequential handling of the same work in the main thread would take three times as long.',
        'One thing to be clear about: what comes back is always a summary, not a transcript. The subagent\'s full chain of tool calls, intermediate reasoning, and file reads stays in its own context window, which is discarded when it finishes. The main agent sees only the result. This is by design — the whole point is to keep the main conversation uncluttered.',
      ],
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'Why does the main agent delegate a task to a subagent?',
        choices: [
          'Because subagents have access to different tools that the main agent cannot use',
          'To keep the main context window small — the expensive exploration happens in the subagent\'s separate context, not the main conversation',
          'Because the main agent cannot read files directly; only subagents can',
        ],
        correctIndex: 1,
        explanation:
          'Context isolation is the key reason. A large exploration — reading dozens of files, tracing dependencies — consumes a lot of tokens. Delegating to a subagent means that work happens in a separate context window, which is discarded when done. Only the summary returns to the main conversation, keeping it focused and compact.',
      },
      {
        prompt: 'When a subagent finishes its task, what does it return to the main agent?',
        choices: [
          'A full transcript of every tool call and intermediate reasoning step',
          'A concise summary of what it found or did — not the raw intermediate work',
          'The files it read, appended directly to the main context',
        ],
        correctIndex: 1,
        explanation:
          'A subagent returns a summary — the result of its work — not a transcript. All the intermediate tool calls, file reads, and reasoning stay in the subagent\'s own context window, which is discarded when it finishes. This is by design: the whole benefit of delegation is keeping the main conversation uncluttered by intermediate steps.',
      },
      {
        prompt: 'Which of these tasks is a good candidate for delegation to a subagent?',
        choices: [
          'Reformatting a single short function according to a style guide',
          'Exploring a large directory to map what each module does — a big read-heavy job that would flood the main context',
          'Asking a follow-up question about the last reply',
        ],
        correctIndex: 1,
        explanation:
          'Large, bounded, read-heavy tasks are ideal for subagents: the exploration is expensive (lots of tokens) and independent (the main agent can keep working while it runs). Single small edits and follow-up questions belong in the main conversation — spawning a subagent for trivial tasks adds overhead without benefit.',
      },
      {
        prompt: 'What does "context isolation" mean in the context of subagents?',
        choices: [
          'The subagent is isolated from the internet so it cannot make network calls',
          'The subagent works in its own separate context window — the main conversation\'s context is not affected by the subagent\'s work',
          'Subagents cannot see the user\'s messages for privacy reasons',
        ],
        correctIndex: 1,
        explanation:
          'Context isolation means the subagent runs in its own, fresh context window that is entirely separate from the main conversation. Everything it does — tool calls, reasoning, file reads — lives in that separate window. The main agent never sees the intermediate steps; it only receives the summary when the subagent is done.',
      },
    ],
  },

  applyCta: null,
};
