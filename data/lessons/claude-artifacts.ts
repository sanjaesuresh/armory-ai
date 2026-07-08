/**
 * Lesson: Artifacts: when Claude builds you a thing
 * Track: claude-app | Order: 3 | Slug: claude-artifacts
 *
 * Teaches what an artifact is, when Claude creates one, the four main kinds,
 * and how to ask for and iterate on artifacts explicitly.
 */

import type { Lesson } from '@/lib/learn/types';

export const claudeArtifacts: Lesson = {
  slug: 'claude-artifacts',
  track: 'claude-app',
  title: 'Claude Artifacts',
  tagline:
    'Ask Claude for a standalone deliverable and it opens in a side panel — ask for changes and Claude updates it in place.',
  minutes: 4,
  order: 3,

  blocks: [
    // ─── Prose: what an artifact is ───────────────────────────────────────────
    {
      type: 'prose',
      heading: 'An artifact is a deliverable, not just a reply',
      paragraphs: [
        'When you ask Claude for something that stands on its own — a document, a piece of code, a web page — Claude can produce it as an artifact. An artifact appears in a side panel alongside the chat, not inside the message flow. This matters because you can edit it, ask Claude to revise it, and copy it without digging back through the conversation.',
        'Artifacts are iterative. Once Claude creates one, you can ask follow-up requests — "make the intro shorter," "add a section on pricing," "change the button color to blue" — and Claude updates the same artifact rather than producing a new one. The side panel tracks the current version.',
        'You can ask Claude to create an artifact explicitly by saying something like "write this as a document" or "put the code in an artifact." You can also just make a request naturally — Claude will use an artifact when the output is the kind of thing that benefits from being separate from the chat.',
      ],
    },

    // ─── Flip cards: the four artifact kinds ──────────────────────────────────
    {
      type: 'flipCards',
      intro:
        'Claude produces four main kinds of artifacts. Click each card to see when it appears and an example ask.',
      cards: [
        {
          front: 'Document',
          back: 'A standalone piece of prose — a report, plan, letter, or set of instructions. Example ask: "Write me a one-page project overview I can share with the team as a document."',
        },
        {
          front: 'Code',
          back: 'A script, function, or program in any language. The code sits in a side panel you can copy or edit directly. Example ask: "Write a Python script that reads a CSV and prints a summary."',
        },
        {
          front: 'Web page',
          back: 'HTML output with a live preview in the panel — useful for landing pages, forms, or UI mockups. Example ask: "Build a one-page site for my bakery with a header and contact form."',
        },
        {
          front: 'Diagram',
          back: 'A flowchart, timeline, or similar visual, written in a plain-text chart notation and rendered in the panel. Example ask: "Draw a flowchart of our customer onboarding process."',
        },
      ],
    },

    // ─── Callout: ask explicitly; ask for edits ────────────────────────────────
    {
      type: 'callout',
      tone: 'tip',
      passage:
        'You can ask for an artifact explicitly — "put this in a document" or "write this as code" — and you can ask for edits directly: "shorten the second paragraph" or "rename the function to processOrder." Claude updates the artifact in place rather than starting over.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What is the main advantage of an artifact over a regular chat reply?',
        choices: [
          'Artifacts are processed by a more capable version of Claude',
          'Artifacts appear in a side panel where you can edit and iterate on them, separate from the scroll',
          'Artifacts are automatically saved to your device',
          'Artifacts can be shared publicly with a direct link',
        ],
        correctIndex: 1,
        explanation:
          'An artifact appears in a side panel alongside the chat. This keeps the deliverable separate from the conversation, makes it easy to edit and iterate, and means you can copy the final result without hunting through the message history.',
      },
      {
        prompt:
          'You ask Claude to "write a Python script that converts a folder of images to JPEG." What type of artifact would Claude most likely produce?',
        choices: [
          'A document artifact',
          'A web page artifact',
          'A code artifact',
        ],
        correctIndex: 2,
        explanation:
          'A Python script is code, so Claude produces a code artifact — the script appears in a side panel where you can copy it or keep refining it with follow-up requests.',
      },
      {
        prompt:
          'Claude just created a document artifact for you. You want the introduction to be shorter. What should you do?',
        choices: [
          'Start a new chat and ask Claude to write a shorter version from scratch',
          'Tell Claude "make the intro shorter" — it will update the existing artifact in place',
          'Copy the artifact, edit it yourself, and paste it back into the chat',
        ],
        correctIndex: 1,
        explanation:
          'Artifacts are iterative. Ask Claude for the change — "make the intro shorter" — and Claude updates the artifact in the side panel. You do not need to start over or copy-paste manually.',
      },
      {
        prompt: 'You want Claude to produce a flowchart of your team\'s approval process. What artifact type would this be?',
        choices: [
          'A document artifact, since it is reference material',
          'A diagram artifact, rendered as a visual in the side panel',
          'A web page artifact, since flowcharts need HTML to display',
        ],
        correctIndex: 1,
        explanation:
          'Flowcharts are diagram artifacts. Claude writes them in a plain-text chart notation and renders a visual in the side panel. You can ask Claude to add, remove, or rearrange steps, and it updates the diagram.',
      },
    ],
  },

  applyCta: null,
};
