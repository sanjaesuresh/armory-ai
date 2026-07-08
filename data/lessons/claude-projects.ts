/**
 * Lesson: Claude Projects: instructions plus knowledge
 * Track: claude-app | Order: 1 | Slug: claude-projects
 *
 * Teaches what a Claude Project is, how it pairs project instructions with
 * knowledge files, and how to set one up — aligned with the InstallView
 * walkthrough stages (Create a new Project → Name your Project →
 * Paste custom instructions → Upload knowledge files).
 */

import type { Lesson } from '@/lib/learn/types';

export const claudeProjects: Lesson = {
  slug: 'claude-projects',
  track: 'claude-app',
  title: 'Claude Projects',
  tagline:
    'A Claude Project pairs persistent instructions with knowledge files — every chat inside the Project inherits both automatically.',
  minutes: 6,
  order: 1,

  blocks: [
    // ─── Prose: what a Claude Project is ─────────────────────────────────────
    {
      type: 'prose',
      heading: 'A Project is a workspace with a brain',
      paragraphs: [
        'A Claude Project pairs two things: project instructions and knowledge files. Project instructions are the persistent rules you set for how Claude should behave inside this workspace — its role, its tone, what it should and should not do. Knowledge files are documents you upload — a style guide, a product spec, a reference sheet — that Claude reads before every answer.',
        'Every chat you start inside the Project sees both. You do not have to paste your instructions at the top of each message or re-upload a file each session. Claude carries the full context into every conversation automatically.',
        'Projects are separate from your regular Claude chats. Think of each Project as a tuned assistant for a specific job: one for your marketing work, another for your research, another for a client. Each one keeps its own instructions and files, and they do not bleed into each other.',
      ],
    },

    // ─── Hotspot diagram: anatomy of a Claude Project ────────────────────────
    {
      type: 'hotspotDiagram',
      diagramId: 'claude-project-anatomy',
      hotspots: [
        {
          id: 'project-instructions',
          title: 'Project Instructions',
          body: 'The persistent rules for this workspace. Written once in the Project settings, they are sent automatically at the start of every chat. This is where you set the role, the tone, and any specific rules you want Claude to follow in this Project.',
        },
        {
          id: 'knowledge-files',
          title: 'Knowledge Files',
          body: 'Documents you upload into the Project — a brand guide, a FAQ, a reference sheet. Claude reads these before it answers. You can have multiple files and update or replace them at any time without touching the instructions.',
        },
        {
          id: 'project-chats',
          title: 'Project Chats',
          body: 'Each conversation you start inside the Project automatically receives the project instructions and any knowledge files. Start a new chat at any time — the context is always there. Chats are separate from each other but share the same project setup.',
        },
      ],
    },

    // ─── Step-through: create a Project ──────────────────────────────────────
    // Aligned with the InstallView walkthrough stages for the claude-app path.
    {
      type: 'stepThrough',
      intro:
        'Here is how to set up a Claude Project. These four steps match the install walkthrough Armory generates when you export a setup for the Claude app.',
      steps: [
        {
          title: 'Create a new Project',
          body: 'Open Claude and look for Projects in the sidebar. Click New Project. If you do not see a Projects section, you may be on a plan that does not include Projects — check your account settings.',
        },
        {
          title: 'Name your Project',
          body: 'Give your Project a clear name — something like "Marketing Work" or "Client Research." The name is just for your own reference and does not change how Claude behaves.',
        },
        {
          title: 'Paste custom instructions',
          body: 'Inside your new Project, open Set custom instructions. Paste the instructions for this workspace: the role Claude should play, the tone it should use, and any rules it must follow. This is the heart of your Project — the part Armory generates for you when you export a setup.',
        },
        {
          title: 'Upload knowledge files',
          body: 'Under Project knowledge, upload any reference documents Claude should always have available — a style guide, a product spec, a voice guide. Claude reads these before every answer in this Project. You can skip this step now and add files later.',
        },
      ],
    },

    // ─── Callout: Armory exports exactly this shape ───────────────────────────
    {
      type: 'callout',
      tone: 'tip',
      passage:
        'This is exactly the shape Armory setups export. When you customize a setup in Armory and download it for the Claude app, you get a project-instructions block and, where relevant, knowledge files — built to paste straight into these two slots.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What two components does a Claude Project combine?',
        choices: [
          'A chat history and a shareable link',
          'Project instructions and knowledge files',
          'A voice style and a model version',
          'An API key and a system prompt',
        ],
        correctIndex: 1,
        explanation:
          'A Claude Project pairs project instructions (persistent rules for how Claude should behave) with knowledge files (documents Claude reads before every answer). Every chat inside the Project gets both automatically.',
      },
      {
        prompt:
          'You want Claude to always write in a formal tone when helping with client emails. Where do you put this rule?',
        choices: [
          'At the top of each individual chat message',
          'In the Project Instructions — set once, applied to every chat in the Project',
          'In a knowledge file, as a separate document',
          'In your Claude account preferences',
        ],
        correctIndex: 1,
        explanation:
          'Project Instructions are persistent. Write the rule once in the Project settings and Claude applies it to every chat inside that Project — no need to repeat it in each message.',
      },
      {
        prompt:
          'You start a brand-new chat inside an existing Project. Does Claude see the project instructions?',
        choices: [
          'No — you need to paste the instructions into the first message of each new chat',
          'Yes — every chat inside a Project automatically inherits the project instructions and knowledge files',
          'Only if you pin the instructions manually before starting the chat',
        ],
        correctIndex: 1,
        explanation:
          'Every chat inside a Project inherits both the project instructions and any knowledge files automatically. That is the core benefit: you set the context once and every new conversation starts with it already in place.',
      },
      {
        prompt: 'What happens if you update a knowledge file inside a Project?',
        choices: [
          'Nothing changes — you must create a new Project to use updated files',
          'Future chats in the Project will use the updated file; the old version is replaced',
          'You must also update the project instructions to match the new file',
        ],
        correctIndex: 1,
        explanation:
          'Knowledge files are managed independently of the instructions. Replace or update a file and the next chat in the Project picks it up automatically. You do not need to touch the instructions.',
      },
    ],
  },

  applyCta: {
    label: 'Set up your first Claude Project',
    href: '/install',
  },
};
