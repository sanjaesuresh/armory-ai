/**
 * Lesson: Custom GPTs vs Projects: which one do you need?
 * Track: chatgpt | Order: 4 | Slug: chatgpt-gpts-vs-projects
 *
 * Teaches the difference between custom GPTs (shareable assistants) and
 * Projects (personal workspaces), with a comparison table, decision
 * step-through, and two scenario quiz questions.
 */

import type { Lesson } from '@/lib/learn/types';

export const chatgptGptsVsProjects: Lesson = {
  slug: 'chatgpt-gpts-vs-projects',
  track: 'chatgpt',
  title: 'GPTs vs Projects',
  tagline: 'A custom GPT is a shareable assistant you publish for others; a Project is a personal workspace for your own ongoing work.',
  minutes: 5,
  order: 4,

  blocks: [
    // ─── Prose: same ingredients, different purposes ──────────────────────────
    {
      type: 'prose',
      heading: 'Same ingredients, very different purposes',
      paragraphs: [
        'Both custom GPTs and Projects let you bundle instructions and files with a version of ChatGPT. From the outside they look similar, but they are built for completely different situations.',
        'A custom GPT is a shareable assistant. You configure it, give it a name, and publish it. Others can open your GPT and start chatting right away, without writing any instructions themselves. The instructions and files you set are baked in for everyone who uses it. Creating and publishing custom GPTs may not be available on all ChatGPT plans, the option may vary depending on which version you are using.',
        'A Project is a personal workspace. You create it to organize your own ongoing work, group related chats, share a consistent set of instructions and files across those chats, and keep everything in one place. A Project is for you, not for publishing to others.',
      ],
    },

    // ─── Comparison table: GPT vs Project ────────────────────────────────────
    {
      type: 'comparisonTable',
      headers: ['', 'Custom GPT', 'Project'],
      rows: [
        ['Sharing', 'Can be published for others to find and use', 'Private to you, not shareable'],
        ['Personal organization', 'Not designed as a personal workspace', 'Groups your related chats in one place'],
        ['Files', 'Baked in for all users of the GPT', 'Your own files, available to your chats'],
        ['Who it is for', 'Building a helper others will use', 'Organizing your own ongoing work'],
      ],
    },

    // ─── Custom widget: GPT vs Project picker ─────────────────────────────────
    {
      type: 'customWidget',
      widgetId: 'gpt-vs-project-picker',
    },

    // ─── Step-through: decision guide ────────────────────────────────────────
    {
      type: 'stepThrough',
      intro: 'Three scenarios to help you pick the right tool.',
      steps: [
        {
          title: 'It is just for you',
          body: 'If you want a consistent setup for your own ongoing work, a writing project, a research effort, a client engagement, use a Project. It organizes your chats, applies shared instructions, and keeps your files in one place, all privately.',
        },
        {
          title: 'You are sharing a helper with others',
          body: 'If you want to create something others can use, an onboarding assistant for your team, a tool for clients, or a publicly available GPT, build a custom GPT. You configure it once; everyone who opens it gets the same experience, no setup required on their end.',
        },
        {
          title: 'It is a quick one-off task',
          body: 'If it is a single task that does not belong in a project and you do not need to share anything, a plain chat with your global custom instructions already set is usually enough. Start a new chat, send your request, and move on.',
        },
      ],
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'A marketing manager wants to create a writing assistant for her ten-person team. Each teammate should be able to open it and get help with campaign copy in the company\'s brand voice. Which tool fits?',
        choices: [
          'A ChatGPT Project, she invites the team to join it',
          'A custom GPT, she configures it once and teammates open it to use it',
          'Global custom instructions, everyone on the team sets the same ones',
        ],
        correctIndex: 1,
        explanation:
          'A custom GPT is the right tool for a shareable assistant. She writes the instructions, uploads brand guidelines, and publishes the GPT. Her teammates open it and get a consistent, preconfigured experience, no setup required on their end.',
      },
      {
        prompt: 'A consultant manages three ongoing client accounts and wants each one to have its own instructions and files in ChatGPT, without mixing things up. What should she use?',
        choices: [
          'Three separate custom GPTs, one per client',
          'Three ChatGPT Projects, one per client',
          'One project with clearly named files for each client',
        ],
        correctIndex: 1,
        explanation:
          'Projects are designed for exactly this. She creates one project per client, uploads each client\'s files to the right project, and writes client-specific instructions for each. Chats inside each project stay separate and see only that client\'s context.',
      },
      {
        prompt: 'What does publishing a custom GPT allow?',
        choices: [
          'Saving your project files to a cloud backup',
          'Other people to find and use the GPT, with your instructions already baked in',
          'Sending your instructions to OpenAI for official review',
        ],
        correctIndex: 1,
        explanation:
          'Publishing makes a GPT accessible to others, via a shared link or, if you choose, through the GPT Store. Your instructions and files come with it; users do not need to configure anything themselves.',
      },
      {
        prompt: 'Which of these is something only a Project can do, not a custom GPT?',
        choices: [
          'Apply a consistent set of instructions across multiple chats',
          'Organize your own private chats in a grouped, personal workspace',
          'Draw on uploaded files when answering questions',
        ],
        correctIndex: 1,
        explanation:
          'Both custom GPTs and Projects can apply instructions and use files. What only a Project does is organize your own private conversations in one grouped place. A custom GPT is a configured assistant you publish for others, it is not a personal workspace for managing your own chats.',
      },
    ],
  },

  applyCta: {
    label: 'Find ready-made setups exportable to ChatGPT',
    href: '/professionals',
  },
};
