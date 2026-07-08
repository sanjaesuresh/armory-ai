/**
 * Lesson: From chat to agent — how Claude Code acts
 * Track: claude-code | Order: 1 | Slug: claude-code-intro
 *
 * Teaches how an agentic model differs from a chat model: it reads files,
 * runs commands, edits code, and checks its own results by feeding tool
 * output back into the context. Explains the agent loop in plain terms.
 */

import type { Lesson } from '@/lib/learn/types';

export const claudeCodeIntro: Lesson = {
  slug: 'claude-code-intro',
  track: 'claude-code',
  title: 'From chat to agent',
  tagline: 'Claude Code is an agent: it reads files, runs commands, and checks its own work, then keeps going until the task is done.',
  minutes: 6,
  order: 1,

  blocks: [
    // ─── Prose: chat vs. agent ────────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'A chat AI answers. An agent acts.',
      paragraphs: [
        'When you type a question into Claude.ai or ChatGPT, the model reads your message and writes a reply. That is the whole loop: one turn, one response, done. The model never touches your files, runs a command, or checks whether its answer was actually correct.',
        'Claude Code is different. It is an agent, a model that can use tools. A tool is a specific action the model can invoke: read a file, write a file, run a shell command, search the web, call an API. When Claude Code needs to understand your codebase, it reads the relevant files. When it makes an edit, it writes the change directly to disk. When it wants to confirm the change worked, it runs your test suite.',
        'The key difference is not raw intelligence, it is the ability to take real actions and see real results, without you copy-pasting anything.',
      ],
    },

    // ─── Custom widget: agent-loop ────────────────────────────────────────────
    {
      type: 'customWidget',
      widgetId: 'agent-loop',
    },

    // ─── Prose: the loop in words ─────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'The loop, in plain English',
      paragraphs: [
        'The widget above shows the loop in its simplest form: two trips around the cycle, one to read the file, one to write the edit. For a straightforward change, that is enough. For tasks that need verification, like fixing a bug, the loop continues further. After writing the edit, the model calls a tool to run the tests. The test output comes back as context. If the tests pass, the model responds to you with a summary. If they fail, the loop continues: read the failure output, decide what is still wrong, write another edit, run the tests again.',
        'Each tool result feeds back into the model\'s context. That is why the loop beats copy-pasting output from a chat: the model sees the actual file content, the actual test output, and the actual error messages, not a paraphrased version you typed by hand. Nothing is lost in translation.',
        'The loop stops when the model decides the task is done, when it hits a permission boundary (an action it is not allowed to take), or when it asks you for input because it needs a decision only you can make.',
      ],
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What is a "tool call" in an agent loop?',
        choices: [
          'A specific action the model can invoke, like reading a file, running a command, or writing an edit',
          'A special prompt you type to make the AI use its full capabilities',
          'A paid API feature that unlocks Claude\'s reasoning mode',
        ],
        correctIndex: 0,
        explanation:
          'A tool call is a specific, named action the model can request during a session, reading a file, executing a command, writing code to disk, calling an API. The model decides when to call which tool; you do not invoke them manually.',
      },
      {
        prompt: 'Why does tool output feed back into the model\'s context?',
        choices: [
          'To fill the context window so the model has more to work with',
          'So the model can read the actual result, not a paraphrased version, and decide the next step',
          'Because the model cannot make decisions without seeing its own previous replies',
        ],
        correctIndex: 1,
        explanation:
          'When a tool runs, its output, the real file contents, the actual test results, the exact error message, comes back as context. The model reads it and decides what to do next. This is why the agent loop beats copy-pasting from a chat window: nothing is lost in translation between what happened and what the model sees.',
      },
      {
        prompt: 'How does Claude Code differ from using Claude in a regular chat?',
        choices: [
          'Claude Code uses a smarter model trained specifically for software',
          'Claude Code can take real actions, read files, run commands, write edits, rather than just composing a text reply',
          'Claude Code only responds to code-related questions',
        ],
        correctIndex: 1,
        explanation:
          'The model capability can be similar, but Claude Code has tools attached: it can read your files, write code directly to disk, and run your test suite. A regular chat session can only produce text for you to act on. The agent acts itself.',
      },
      {
        prompt: 'When does the agent loop stop?',
        choices: [
          'After exactly one tool call per user message',
          'Only when the user types "stop" or closes the window',
          'When the model decides the task is done, hits a permission boundary, or needs a decision from you',
        ],
        correctIndex: 2,
        explanation:
          'The loop runs until one of three things happens: the model concludes the task is complete (and summarises for you), it hits something it is not permitted to do (and pauses to ask), or it reaches a decision point where you are the right person to choose the next step. There is no fixed number of tool calls per message.',
      },
    ],
  },

  applyCta: null,
};
