/**
 * Lesson: Projects: give a workspace its own brain
 * Track: chatgpt | Order: 2 | Slug: chatgpt-projects
 *
 * Teaches what ChatGPT Projects are, how they differ from plain chats,
 * and how project instructions and custom instructions interact.
 */

import type { Lesson } from '@/lib/learn/types';

export const chatgptProjects: Lesson = {
  slug: 'chatgpt-projects',
  track: 'chatgpt',
  title: 'Projects: give a workspace its own brain',
  tagline: 'Group related chats and give them shared instructions and files — once.',
  minutes: 6,
  order: 2,

  blocks: [
    // ─── Prose: what a project is ─────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'A project is a container with a memory',
      paragraphs: [
        'A plain ChatGPT chat is self-contained. Each one starts fresh, with no connection to the others. That is fine for one-off questions but limiting for ongoing work — a writing project, a research effort, a client engagement — where you want consistent context every time.',
        'A ChatGPT Project groups related chats under a shared roof. Every chat inside the project automatically receives the same instructions and can access the same uploaded files. You write the instructions once, upload your files once, and every chat inside inherits them — no pasting or re-setup required. Whether you see the Projects option in your account may depend on which version or plan of ChatGPT you are using.',
        'Chats outside a project do not see the project\'s instructions or files. The boundary is real: stepping outside the project means stepping outside its context.',
      ],
    },

    // ─── Hotspot diagram: project anatomy ────────────────────────────────────
    {
      type: 'hotspotDiagram',
      diagramId: 'chatgpt-project-anatomy',
      hotspots: [
        {
          id: 'project-instructions',
          title: 'Project instructions',
          body: 'Steering for every chat inside the project. You write these once for the workspace — role, tone, what the AI should focus on — and every chat inside automatically receives them. These can be more specific than your global custom instructions.',
        },
        {
          id: 'project-files',
          title: 'Project files',
          body: 'Knowledge every chat inside the project can use. Upload a document, set of notes, or reference material once and every chat in the project can draw on it — no re-uploading to each new conversation.',
        },
        {
          id: 'chats',
          title: 'Chats',
          body: 'The individual conversations inside the project, each one inheriting both the project instructions and access to the project files automatically. You can have many chats inside a single project, keeping related work organized in one place.',
        },
        {
          id: 'outside-chat',
          title: 'Outside the project',
          body: 'Any chat started outside this project — in the main chat area or a different project — gets neither the project instructions nor the project files. The boundary is clear: context lives inside the project and nowhere else.',
        },
      ],
    },

    // ─── Comparison table: plain chat vs project ──────────────────────────────
    {
      type: 'comparisonTable',
      headers: ['', 'Plain chat', 'Project'],
      rows: [
        ['Instructions', 'Global custom instructions only', 'Project instructions (override or extend your global ones)'],
        ['Shared files', 'None — upload per chat', 'Uploaded once; every chat inside can use them'],
        ['Organization', 'All chats in one long list', 'Grouped under the project, separate from other chats'],
        ['Best for', 'Quick, unrelated questions', 'Ongoing work that needs consistent context'],
      ],
    },

    // ─── Callout: instructions stack ─────────────────────────────────────────
    {
      type: 'callout',
      tone: 'tip',
      passage: 'Project instructions and global custom instructions both apply inside a project — they stack. Your global instructions set a general baseline (your role, your preferred tone), and the project instructions add or adjust specifics for that workspace. When they conflict, the project instructions typically take precedence.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What makes a ChatGPT Project different from a plain chat?',
        choices: [
          'Projects use a smarter, more capable model',
          'A project groups chats and gives every chat inside shared instructions and access to uploaded files',
          'Projects save your conversation history automatically; plain chats delete it',
        ],
        correctIndex: 1,
        explanation:
          'A project is a container. Every chat inside it automatically receives the same project instructions and can access the same uploaded files. Plain chats start fresh every time — there is no shared context between them.',
      },
      {
        prompt: 'If you upload a file to a project, which chats can use it?',
        choices: [
          'Any chat in ChatGPT, regardless of which project it is in',
          'Only the chat where you did the uploading',
          'Every chat inside that project, without needing to re-upload',
        ],
        correctIndex: 2,
        explanation:
          'Files uploaded to a project are available to every chat inside that project — you do not need to re-upload them for each new conversation. Chats outside the project cannot access those files.',
      },
      {
        prompt: 'What happens when you start a chat outside a project?',
        choices: [
          'The project instructions follow you and still apply',
          'That chat gets neither the project instructions nor the project files',
          'Only the project files are available; the instructions do not apply',
        ],
        correctIndex: 1,
        explanation:
          'Project instructions and files are scoped to the project. Any chat outside the project boundary starts with only your global custom instructions — it has no access to what is inside the project.',
      },
      {
        prompt: 'How do global custom instructions and project instructions interact inside a project?',
        choices: [
          'Only the project instructions apply; global ones are ignored entirely',
          'Only the global instructions apply; you have to paste project ones manually',
          'Both apply together; project instructions take precedence when there is a conflict',
        ],
        correctIndex: 2,
        explanation:
          'Inside a project, both layers are active. Your global custom instructions provide a baseline, and the project instructions add or override specifics for that workspace. When they conflict, the project-level instructions generally win.',
      },
    ],
  },

  applyCta: null,
};
