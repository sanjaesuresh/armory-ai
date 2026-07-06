/**
 * Lesson: Instructions are steering
 * Track: foundations | Order: 3 | Slug: instructions-steering
 *
 * Teaches the difference between instructions (persistent behavior steering)
 * and messages (individual requests), with a before/after example and a map
 * of where durable instructions live in ChatGPT, Claude app, and Claude Code.
 */

import type { Lesson } from '@/lib/learn/types';

export const instructionsSteering: Lesson = {
  slug: 'instructions-steering',
  track: 'foundations',
  title: 'Instructions are steering',
  tagline: 'Set the role, tone, and rules once — and every reply follows them.',
  minutes: 5,
  order: 3,

  blocks: [
    // ─── Prose: two kinds of text ─────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'Two kinds of text you give an AI',
      paragraphs: [
        'Every time you interact with a chat AI, you are giving it two different kinds of text — but most people treat them as the same thing.',
        'A message is a one-off request: "Summarize this article." "Write a reply to this email." Each message is answered in isolation unless the conversation history carries some context forward.',
        'Instructions are different. Instructions steer the AI\'s behavior across everything it does: who it is, how it writes, what it should and should not include. Set them once, and every reply that follows is shaped by them — you do not have to repeat yourself.',
        'The difference matters because the AI cannot guess your preferences from a message alone. "Write an update email about our project delay" produces a generic draft. Add instructions that say you are a project manager writing for a senior leadership audience in a concise, direct style, and the same request produces something usable.',
        'In the "with instructions" example below, the imagined user\'s instructions specified their role, audience, tone, and current project context — including the dates and the integration name. That context is what produces the specific reply; the AI did not invent those details.',
      ],
    },

    // ─── Before/after: update email example ──────────────────────────────────
    {
      type: 'beforeAfter',
      beforeLabel: 'No instructions',
      afterLabel: 'With instructions',
      beforeExchanges: [
        {
          speaker: 'user',
          text: 'Write an update email about our project delay.',
        },
        {
          speaker: 'ai',
          text: 'Subject: Project Update — Timeline Adjustment\n\nHi team,\n\nI wanted to reach out with an update on our project. We have run into some delays and the original timeline will need to be adjusted. We are working hard to resolve the situation and will keep everyone informed as things progress.\n\nThank you for your patience and understanding.\n\nBest regards,\n[Your name]',
        },
      ],
      afterExchanges: [
        {
          speaker: 'user',
          text: 'Write an update email about our project delay.',
        },
        {
          speaker: 'ai',
          text: 'Subject: Launch timeline update — 2 weeks\n\nTeam,\n\nLaunch moves from March 14 to March 28. Root cause: the payment-API integration took longer than scoped. No further slippage expected.\n\nWhat this means for you: the revised go/no-go is March 25. I\'ll send the updated schedule by Friday.\n\n— [Your name]',
        },
      ],
    },

    // ─── Prose: where instructions live ──────────────────────────────────────
    {
      type: 'prose',
      heading: 'Where durable instructions live',
      paragraphs: [
        'Each major AI tool has its own place to store instructions that persist across conversations. You set them once; the tool sends them automatically with every message.',
        'In ChatGPT, go to Settings → Personalization → Custom Instructions. Whatever you write there is sent to every chat. The ChatGPT track covers this in detail.',
        'In the Claude app, create a Project and write instructions in the Project Instructions field. Every chat inside that project inherits them. The Claude App track walks you through setup.',
        'In Claude Code, a file called CLAUDE.md in your project folder acts as persistent instructions. The model reads it at the start of every session. The Claude Code track explains the full pattern.',
        'Armory\'s library gives you ready-made instruction sets for common roles — so you can start with something proven rather than writing from scratch.',
      ],
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What is the key difference between an instruction and a message?',
        choices: [
          'Instructions are longer; messages are shorter',
          'Instructions steer the AI\'s behavior persistently; messages are individual one-off requests',
          'There is no real difference — the AI treats all text the same way',
        ],
        correctIndex: 1,
        explanation:
          'Instructions set ongoing rules for how the AI behaves — role, tone, what to include or avoid. Messages are individual requests. Set the instructions once and every message that follows is shaped by them, without repeating yourself.',
      },
      {
        prompt: 'In the update-email example, why does the version with instructions produce a better result?',
        choices: [
          'It is longer and gives the AI more material to work with',
          'It names a role, audience, and tone, so the AI knows exactly what style and format to use',
          'The AI guessed the user\'s preferences from earlier conversations',
        ],
        correctIndex: 1,
        explanation:
          'The instruction set told the AI it was writing as a project manager, for a senior leadership audience, in a concise and direct style. With those constraints in place, the same four-word request produced a short, specific, actionable email instead of a generic one.',
      },
      {
        prompt: 'Do you need to repeat your instructions at the start of every message?',
        choices: [
          'Yes — the AI forgets instructions after each reply',
          'No — durable instructions are sent automatically with every message once you have set them',
          'Only if you start a new topic within the same chat',
        ],
        correctIndex: 1,
        explanation:
          'Durable instructions — stored in Custom Instructions (ChatGPT), Project Instructions (Claude app), or CLAUDE.md (Claude Code) — are sent automatically with every turn. You write them once and do not repeat them.',
      },
      {
        prompt: 'Where do you store persistent instructions in the Claude app?',
        choices: [
          'In each individual message, at the top',
          'In a Claude Project\'s instructions field — set once, applied to every chat in that project',
          'On Anthropic\'s servers — you cannot set them yourself',
        ],
        correctIndex: 1,
        explanation:
          'In the Claude app, create a Project and write your instructions in the Project Instructions field. Every conversation inside that project automatically receives those instructions. You do not need to repeat them in each message.',
      },
    ],
  },

  applyCta: {
    label: 'Browse ready-made instruction setups',
    href: '/professionals',
  },
};
