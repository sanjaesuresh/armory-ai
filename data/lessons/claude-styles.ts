/**
 * Lesson: Styles: control the voice
 * Track: claude-app | Order: 2 | Slug: claude-styles
 *
 * Teaches what Claude Styles are, how they differ from project instructions,
 * and when to use each. Style availability may vary by plan and is hedged
 * accordingly — behavior was accurate as of mid-2026.
 */

import type { Lesson } from '@/lib/learn/types';

export const claudeStyles: Lesson = {
  slug: 'claude-styles',
  track: 'claude-app',
  title: 'Claude Styles',
  tagline: 'Claude Styles set tone, length, and formality across all your chats at once — use a preset or describe your own in plain English.',
  minutes: 4,
  order: 2,

  blocks: [
    // ─── Prose: what styles are ───────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'Styles change the voice, not the knowledge',
      paragraphs: [
        'Claude Styles control how Claude writes — its tone, length, and formality. They do not change what Claude knows or how it reasons; they change how it expresses the answer.',
        'The Claude app comes with a set of preset styles — options like a more concise mode or a more formal mode — and lets you define a custom style using plain English. For example: "Write like a direct executive — short paragraphs, no filler, end with a clear action." You can switch styles at any time. Style availability may depend on your plan; check the Styles menu in the Claude app sidebar.',
        'Styles are separate from your Project Instructions. A style applies across the whole Claude app, not just one Project. If you open a Project that has its own instructions and you have a style active, both are in effect: the style shapes how Claude writes, and the Project Instructions shape the role and the rules.',
      ],
    },

    // ─── Before/after: same request, different style ──────────────────────────
    {
      type: 'beforeAfter',
      beforeLabel: 'Default style',
      afterLabel: 'Concise + direct style',
      beforeExchanges: [
        {
          speaker: 'user',
          text: "Give me three ways to improve this week's email open rate.",
        },
        {
          speaker: 'ai',
          text: "Here are three ways to improve your email open rate this week:\n\n1. Test a different subject line. Subject lines have a significant impact on whether people open your emails — try a question or a specific number to draw curiosity.\n\n2. Check your send time. Timing can affect open rates meaningfully; many audiences respond better to emails sent on Tuesday or Wednesday morning.\n\n3. Segment your list. Sending to a smaller, more targeted group tends to improve relevance and, with it, open rates.",
        },
      ],
      afterExchanges: [
        {
          speaker: 'user',
          text: "Give me three ways to improve this week's email open rate.",
        },
        {
          speaker: 'ai',
          text: 'Three levers this week:\n\n1. Rewrite the subject line — test a question or a specific number ("3 things you missed").\n2. Move the send time — try Tuesday or Wednesday, 8–10 AM.\n3. Narrow the segment — email the 20% who opened last time before blasting the full list.\n\nStart with subject line; it has the fastest feedback loop.',
        },
      ],
    },

    // ─── Callout: styles vs project instructions ──────────────────────────────
    {
      type: 'callout',
      tone: 'tip',
      passage:
        'Styles versus Project Instructions: a Style is the voice everywhere — it follows you across all chats and Projects. Project Instructions are behavior rules for one specific workspace. If you want Claude to always write briefly, set a Style. If you want Claude to act as your legal reviewer only when you are inside that one Project, put it in Project Instructions.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What does a Claude Style control?',
        choices: [
          'Which Claude model version handles your chats',
          'How Claude writes — tone, length, and formality — not what it knows',
          'Which knowledge files Claude reads before answering',
          'Whether Claude can access tools like web search',
        ],
        correctIndex: 1,
        explanation:
          'Styles control the voice: how Claude expresses its answers — how long, how formal, how direct. They do not change the model, the knowledge, or the reasoning. Only the output style changes.',
      },
      {
        prompt:
          'You are inside a Project with its own instructions. You also have a custom Style active. What happens?',
        choices: [
          'The Style is ignored — Project Instructions always take priority',
          'Both apply: the Style shapes the voice, the Project Instructions shape the role and rules',
          'You must disable the Style before entering a Project with instructions',
        ],
        correctIndex: 1,
        explanation:
          'Styles and Project Instructions stack. The Style controls how Claude writes; the Project Instructions control what Claude does and what role it plays. Both are in effect at the same time.',
      },
      {
        prompt:
          'You want Claude to always write in short, punchy sentences — inside Projects and in regular chats. What is the right approach?',
        choices: [
          'Add a tone rule to every Project\'s instructions separately',
          'Set a Style — it applies across the whole app, not just one Project',
          'Type a tone preference at the start of each new chat',
        ],
        correctIndex: 1,
        explanation:
          'A Style is global — it follows you across all chats and all Projects. If you want a consistent voice everywhere, set it once as a Style. Adding it to each Project\'s instructions separately would work but is unnecessary extra effort.',
      },
      {
        prompt: 'Which of these is best suited as a Style rather than a Project Instruction?',
        choices: [
          '"Always respond in Spanish."',
          '"Never include pricing information."',
          '"Write in a concise, direct style — short paragraphs, no filler phrases."',
          '"You are a financial analyst reviewing investor documents."',
        ],
        correctIndex: 2,
        explanation:
          'The concise, direct writing rule is about voice — how Claude writes. That is what Styles are for. The other options define role, language, or content constraints; those belong in Project Instructions because they define what Claude does in that specific workspace, not just how it writes.',
      },
    ],
  },

  applyCta: null,
};
