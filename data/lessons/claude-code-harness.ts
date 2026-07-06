/**
 * Lesson: The harness — everything around the model
 * Track: claude-code | Order: 4 | Slug: claude-code-harness
 *
 * Teaches that the model is one part of Claude Code; the harness is the loop,
 * tools, permission rules, CLAUDE.md, and hooks that shape how the model
 * operates in a project. Covers the anatomy of the harness and its components.
 */

import type { Lesson } from '@/lib/learn/types';

export const claudeCodeHarness: Lesson = {
  slug: 'claude-code-harness',
  track: 'claude-code',
  title: 'The harness — everything around the model',
  tagline: 'The model is one part. The loop, tools, permissions, memory, and hooks are the harness that shapes what it does.',
  minutes: 7,
  order: 4,

  blocks: [
    // ─── Prose: the model is one part ────────────────────────────────────────
    {
      type: 'prose',
      heading: 'The model alone does not make an agent',
      paragraphs: [
        'When people say "Claude Code," they often mean the AI that reads and edits their code. But the model is only one component. What actually determines how Claude Code behaves in your project is the harness around the model: the loop that drives it, the tools it can call, the permission rules that limit what those tools can do, the memory files it reads at startup, and the hooks that fire when specific events occur.',
        'Think of a racing car: the engine is extraordinary, but the suspension, brakes, and transmission determine what the car actually does on a track. Changing any of those changes the outcome, even if the engine stays the same. The harness is the rest of the car.',
        'The practical implication: if you want Claude Code to behave differently in a project — more cautiously, in a specific style, following a particular workflow — you configure the harness, not the model. Most of the configuration is plain text and JSON files that live in your project directory.',
      ],
    },

    // ─── Hotspot diagram: harness-anatomy ────────────────────────────────────
    {
      type: 'hotspotDiagram',
      diagramId: 'harness-anatomy',
      hotspots: [
        {
          id: 'model',
          title: 'Model',
          body: 'The language model at the center of the agent — in Claude Code\'s case, Claude. It reads all context in the current window, decides which tools to call and in what order, and composes the final reply. The model\'s behaviour is shaped by everything else in the harness.',
        },
        {
          id: 'tools',
          title: 'Tools',
          body: 'The specific actions the model can call: read a file, write a file, run a shell command, search the web, call an MCP server. Each tool has a name, a description, and a schema for its arguments. The model picks which tool to call based on what the task requires.',
        },
        {
          id: 'permissions',
          title: 'Permissions',
          body: 'Rules that control which tools the model can use without asking, and which require your approval. Defined in .claude/settings.json. Tight permissions (read-only, no network) mean Claude always asks before acting; broader permissions let it work autonomously. Getting permissions right is key to a harness that is both useful and safe.',
        },
        {
          id: 'claude-md',
          title: 'CLAUDE.md',
          body: 'A plain text file at the root of your project that the model reads at the start of every session. Write your standing instructions here — coding conventions, architecture rules, team workflow, things Claude should always do or never do in this project. CLAUDE.md is the harness\'s long-term memory.',
        },
        {
          id: 'hooks',
          title: 'Hooks',
          body: 'Shell scripts that run automatically when specific events occur during a session. A PostToolUse hook fires after every tool call — useful for running tests after every file write. A PreToolUse hook fires before an action — useful for flagging or discouraging certain commands. Hard blocking is handled by the permissions deny list (see the Permissions hotspot above). Hooks let you add verification or guardrails without changing the model\'s instructions.',
        },
        {
          id: 'loop',
          title: 'Loop',
          body: 'The orchestration layer that drives the agent: send context to the model, receive a tool call or a final response, execute the tool call and append the result to context, then repeat. The loop is what turns a single model call into a multi-step agent that can read, think, act, and check its own work.',
        },
      ],
    },

    // ─── Flip cards ───────────────────────────────────────────────────────────
    {
      type: 'flipCards',
      intro: 'Tap each card to see its one-line role in the harness.',
      cards: [
        {
          front: 'CLAUDE.md',
          back: 'A plain text file at your project root that Claude reads every session. Write your project\'s standing rules, conventions, and instructions here — they persist across all sessions without you repeating them.',
        },
        {
          front: 'Hooks',
          back: 'Shell scripts that run automatically on specific events — for example, running your test suite after every file write. Hooks add verification and guardrails outside the model\'s instructions.',
        },
        {
          front: 'Permission modes',
          back: 'Settings in .claude/settings.json that control which tools Claude can use without asking first. Tighter permissions mean Claude always confirms before acting; broader ones allow autonomous operation.',
        },
        {
          front: 'Slash commands',
          back: 'Named shortcuts starting with /, such as /review or /commit-msg, that invoke a specific procedure. Defined per-project or per-skill, they save you from writing the same full prompt every time.',
        },
      ],
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What is "the harness" in Claude Code?',
        choices: [
          'A safety filter that prevents the model from producing harmful output',
          'The loop, tools, permission rules, memory files, and hooks that surround the model and shape its behaviour',
          'The model\'s internal reasoning process, which users cannot configure',
        ],
        correctIndex: 1,
        explanation:
          'The harness is everything around the model: the loop that drives it, the tools it can call, the permission rules that scope those tools, CLAUDE.md (the persistent memory file), and hooks (event-triggered scripts). The model is one component; the harness shapes what it actually does in your project.',
      },
      {
        prompt: 'What is CLAUDE.md?',
        choices: [
          'The official Claude Code documentation, downloaded automatically when you install the tool',
          'A plain text file at your project root that Claude reads at the start of every session — your project\'s durable standing instructions',
          'A file you only need when you are building a custom agent from scratch',
        ],
        correctIndex: 1,
        explanation:
          'CLAUDE.md is a plain text file at the root of your project. Claude reads it at the start of every session — not just the first one. Write your coding conventions, architecture rules, and workflow instructions there and Claude will follow them without you repeating them each time. It is the harness\'s long-term memory.',
      },
      {
        prompt: 'What do hooks do in the harness?',
        choices: [
          'They connect Claude Code to external APIs and services',
          'They are shell scripts that run automatically when specific events occur — like running tests after every file write',
          'They are the visual UI elements that display tool call results',
        ],
        correctIndex: 1,
        explanation:
          'Hooks are shell scripts triggered by events during a session. A PostToolUse hook can run your test suite after every file write, ensuring Claude sees whether its edit broke anything. A PreToolUse hook can flag or discourage certain actions before they happen — hard blocking is handled by the permissions deny list, not hooks. Hooks add verification and guardrails without changing the model\'s prompt.',
      },
      {
        prompt: 'If you want Claude Code to always follow your team\'s code style in a project, what is the right place to record that rule?',
        choices: [
          'CLAUDE.md — write the style rules once there, and Claude reads them every session',
          'Each individual message — repeat the style requirements at the start of every request',
          'A hook — hooks are the only way to enforce persistent rules',
        ],
        correctIndex: 0,
        explanation:
          'CLAUDE.md is exactly right for persistent project rules like code style conventions. Write them once and Claude reads that file at the start of every session. You do not need to repeat yourself in each message, and you do not need a hook — hooks are for event-triggered actions (like running tests), not standing instructions.',
      },
    ],
  },

  applyCta: {
    label: 'Browse harnesses in the registry',
    href: '/developers',
  },
};
