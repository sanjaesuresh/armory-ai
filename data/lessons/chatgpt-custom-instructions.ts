/**
 * Lesson: Custom instructions: set once, steer every chat
 * Track: chatgpt | Order: 1 | Slug: chatgpt-custom-instructions
 *
 * Teaches what custom instructions are, how to set them,
 * and how they shape every new ChatGPT chat automatically.
 */

import type { Lesson } from '@/lib/learn/types';

export const chatgptCustomInstructions: Lesson = {
  slug: 'chatgpt-custom-instructions',
  track: 'chatgpt',
  title: 'Custom instructions',
  tagline: 'Tell ChatGPT who you are and how you want it to respond once, every new chat picks it up automatically, no re-typing needed.',
  minutes: 5,
  order: 1,

  blocks: [
    // ─── Prose: what custom instructions are ─────────────────────────────────
    {
      type: 'prose',
      heading: 'Custom instructions are your standing order',
      paragraphs: [
        'By default, every new ChatGPT chat starts completely blank. The model knows nothing about you, your job, your preferences, how you like information formatted. You end up explaining the same context in every session.',
        'Custom instructions fix this. They are a short block of text you write once and save in your settings. Whenever you start a new regular chat, ChatGPT automatically includes your instructions before the conversation begins, you never have to repeat yourself.',
        'There are two parts: who you are and what you do (background, role, relevant context), and how you want ChatGPT to respond (tone, length, format, things to avoid). Neither part is required, fill in whatever actually matters for your work.',
      ],
    },

    // ─── Step-through: settings walkthrough ──────────────────────────────────
    {
      type: 'stepThrough',
      intro: 'Setting up custom instructions takes about two minutes. Follow these four steps.',
      steps: [
        {
          title: 'Open Settings',
          body: 'Click on your profile icon or name in ChatGPT, usually found in the top-right or bottom-left corner of the screen. From the menu that appears, select Settings.',
        },
        {
          title: 'Go to Personalization',
          body: 'Inside Settings, look for a section called Personalization or Custom Instructions. The exact label may vary slightly depending on which version or plan of ChatGPT you are using.',
        },
        {
          title: 'Fill in both boxes',
          body: 'The first box is for who you are and what you do, your role, industry, and anything ChatGPT should always know as background. The second box is for how you want it to respond, tone, level of detail, and anything it should always or never include.',
        },
        {
          title: 'Save and start a new chat',
          body: 'Save your instructions, then open a fresh chat to see them in action. Custom instructions apply to new chats only, any conversation that was already open before you saved will not pick them up.',
        },
      ],
    },

    // ─── Before/after: same request, different results ────────────────────────
    {
      type: 'beforeAfter',
      beforeLabel: 'Without custom instructions',
      afterLabel: 'With custom instructions',
      beforeExchanges: [
        {
          speaker: 'user',
          text: 'Summarize the key risks in this vendor contract.',
        },
        {
          speaker: 'ai',
          text: 'Here is a summary of key risks typically found in vendor contracts:\n\n1. Liability limitations, the vendor may cap their liability at a low amount.\n2. Indemnification, check who is responsible if a third party brings a claim.\n3. Termination clauses, understand the notice period and exit conditions.\n4. Intellectual property, confirm you own any work product produced for you.\n5. Data handling, verify how the vendor stores and protects your information.\n\nLet me know if you would like me to look at any section in more detail.',
        },
      ],
      afterExchanges: [
        {
          speaker: 'user',
          text: 'Summarize the key risks in this vendor contract.',
        },
        {
          speaker: 'ai',
          text: 'Three risks worth flagging to your legal team:\n\n1. Liability cap, vendor limits exposure to one month of fees, which is low for a data-processing agreement.\n2. Auto-renewal, contract renews for 12 months unless cancelled 60 days before the anniversary date.\n3. Data deletion, no explicit timeline for data deletion after termination; worth specifying.\n\nWant me to draft suggested language for any of these?',
        },
      ],
    },

    // ─── Callout: instructions as a baseline, projects for specifics ──────────
    {
      type: 'callout',
      tone: 'tip',
      passage: 'Custom instructions are a great default baseline, they shape every regular chat you have. But when you are doing a specific type of work (a writing project, a research task, a client engagement), a ChatGPT Project can apply its own instructions scoped to that workspace, which can override or extend your global custom instructions. The next lesson covers Projects.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'When do custom instructions take effect?',
        choices: [
          'In every chat, including ones you already had open',
          'Only in new chats started after you saved the instructions',
          'Only when you manually paste them at the start of a message',
        ],
        correctIndex: 1,
        explanation:
          'Custom instructions are added automatically to new chats only. Any conversation already open before you saved them will not receive the update, you need to start a fresh chat.',
      },
      {
        prompt: 'What are the two parts of ChatGPT\'s custom instructions?',
        choices: [
          'A topic list and a language preference',
          'Who you are and what you do, plus how you want ChatGPT to respond',
          'A tone setting and a word-count limit',
          'A short instruction and a long instruction',
        ],
        correctIndex: 1,
        explanation:
          'The first part covers background, who you are, your role, relevant context. The second part covers behavior, tone, format, things to always or never do. You can fill in as much or as little as is actually useful.',
      },
      {
        prompt: 'Why does the vendor-contract summary look different in the "with instructions" example?',
        choices: [
          'ChatGPT accessed the actual contract text automatically',
          'The instructions told ChatGPT the user\'s role and preferred output style',
          'The second response used a different, more advanced model',
        ],
        correctIndex: 1,
        explanation:
          'The custom instructions gave ChatGPT context: the user\'s role and how they want output formatted. With that steering in place, ChatGPT produced a short, prioritized list aimed at a legal handoff, instead of a generic overview that fits no one in particular.',
      },
      {
        prompt: 'If you want a custom setup for one specific project without changing your global defaults, what should you use?',
        choices: [
          'Write the instructions in the first message of every chat',
          'A ChatGPT Project, which can have its own instructions scoped to that workspace',
          'A separate ChatGPT account for each project',
        ],
        correctIndex: 1,
        explanation:
          'Custom instructions apply globally to all new chats. ChatGPT Projects let you set separate instructions scoped to a specific workspace, they can override or extend your global custom instructions just for chats inside that project.',
      },
    ],
  },

  applyCta: null,
};
