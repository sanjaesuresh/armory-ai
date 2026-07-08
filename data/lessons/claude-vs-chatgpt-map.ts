/**
 * Lesson: Where things live: Claude ↔ ChatGPT
 * Track: claude-app | Order: 4 | Slug: claude-vs-chatgpt-map
 *
 * Maps the same concepts across Claude and ChatGPT — honestly noting where
 * the mapping is imperfect or where one app has no direct equivalent.
 * Accuracy hedged for mid-2026; both products evolve.
 */

import type { Lesson } from '@/lib/learn/types';

export const claudeVsChatgptMap: Lesson = {
  slug: 'claude-vs-chatgpt-map',
  track: 'claude-app',
  title: 'Claude vs ChatGPT',
  tagline:
    'Claude and ChatGPT share the same core concepts but use different names — this lesson maps them side by side, including gaps where one has no equivalent.',
  minutes: 4,
  order: 4,

  blocks: [
    // ─── Prose: framing ────────────────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'Same ideas, different words',
      paragraphs: [
        'If you have used ChatGPT and are now setting up Claude — or if you use both — the feature names can be disorienting. The underlying ideas are often the same: persistent instructions, a workspace with files, a way to shape the AI\'s voice. The names and locations differ.',
        'This lesson maps the key concepts side by side. Where the mapping is clean, we say so. Where it is imperfect — a feature that exists in one app but has no real equivalent in the other — we flag that honestly rather than pretending the apps are identical.',
        'Both products are evolving quickly. Some of the gaps below may close; some new ones may open. We hedge on anything that is likely to have changed since this was written.',
      ],
    },

    // ─── Comparison table: concept map ────────────────────────────────────────
    {
      type: 'comparisonTable',
      headers: ['Concept', 'In ChatGPT', 'In Claude App'],
      rows: [
        [
          'Always-on instructions',
          'Custom Instructions — set in Settings, applied to all your chats',
          'Profile preferences (Settings) — set once, applied across all your chats; closest scope match to Custom Instructions, though less structured. Projects add a separate per-workspace instruction layer on top.',
        ],
        [
          'Workspace with files',
          'Projects — a named workspace with its own files and memory',
          'Claude Projects — a named workspace with its own instructions and files',
        ],
        [
          'Shareable AI assistant',
          'Custom GPT — build one and optionally share it publicly or with your team',
          'No direct equivalent as of mid-2026 — Projects are private per-user',
        ],
        [
          'Voice and style control',
          'Tone guidance added inside Custom Instructions',
          'Styles — a switchable global setting that shapes how Claude writes across all chats',
        ],
      ],
    },

    // ─── Flip cards: quick translations ───────────────────────────────────────
    {
      type: 'flipCards',
      intro:
        'Quick translations — flip each card to see what it maps to in the other app, with honest caveats.',
      cards: [
        {
          front: 'Custom GPT',
          back: 'Nearest Claude equivalent: a Project. Both give a workspace its own instructions and files. Key difference: Custom GPTs can be shared publicly; Claude Projects are private to you as of mid-2026.',
        },
        {
          front: 'Custom Instructions (ChatGPT)',
          back: 'Nearest Claude equivalent: profile preferences in Settings, which apply across all your chats. Project Instructions add per-workspace rules on top. The mapping is imperfect — Custom Instructions have more structure and prominence than Claude\'s profile preferences as of mid-2026.',
        },
        {
          front: 'ChatGPT Projects',
          back: 'Same idea as Claude Projects — a named workspace with files and a custom setup. Names match and the concept is the same; specific behavior details may differ as both products evolve.',
        },
        {
          front: 'Claude Styles',
          back: 'ChatGPT has no direct equivalent. Closest workaround: add tone guidance to Custom Instructions. Unlike Styles, this is not a switchable setting — it applies to all chats and cannot be toggled.',
        },
      ],
    },
  ],

  quiz: {
    questions: [
      {
        prompt:
          'You use ChatGPT and want instructions applied to every chat you start. Where do you set this?',
        choices: [
          'In a ChatGPT Project configuration',
          'In Custom Instructions, found in Settings under Personalization',
          'By typing them at the top of each chat',
          'In a Custom GPT on the Configure tab',
        ],
        correctIndex: 1,
        explanation:
          'In ChatGPT, Custom Instructions (Settings → Personalization) are applied to all your chats. A ChatGPT Project is a workspace for a specific topic, not a setting for all chats. A Custom GPT is a shareable assistant, not a global instructions setting.',
      },
      {
        prompt: 'You want a private workspace with knowledge files in Claude. What do you use?',
        choices: [
          'A Style — global settings that control how Claude writes',
          'Claude Projects — a workspace with its own instructions and files',
          'Custom Instructions — applied to all Claude chats like ChatGPT',
        ],
        correctIndex: 1,
        explanation:
          'Claude Projects are the workspace-with-files feature. Create a Project, add Project Instructions, and upload knowledge files. Every chat inside inherits both. Styles control voice. Claude also has profile preferences in Settings that apply across all chats, but they do not add a workspace with files — that distinction belongs to Projects.',
      },
      {
        prompt:
          'A colleague shares a Custom GPT with you. You want to explain the closest Claude equivalent. What do you say?',
        choices: [
          'The closest thing is a Claude Style — both control how the AI behaves',
          'There is no equivalent — Claude does not support configured assistants',
          'The closest thing is a Claude Project, though Projects are private rather than shareable as of mid-2026',
        ],
        correctIndex: 2,
        explanation:
          'A Claude Project is the nearest structural equivalent to a Custom GPT — both give a workspace its own instructions and files. The honest gap: Claude Projects are private per-user; there is no built-in way to share one the way you can publish a Custom GPT.',
      },
      {
        prompt:
          'You had ChatGPT Custom Instructions that applied to all your chats. You now use Claude. What is the most honest statement about the Claude equivalent?',
        choices: [
          'Project Instructions are a direct drop-in — the behavior is identical',
          'Claude Styles replace Custom Instructions and work the same way',
          'Claude\'s profile preferences (Settings) are the closest scope match — both apply across all chats — though the format differs from Custom Instructions',
        ],
        correctIndex: 2,
        explanation:
          'Claude\'s profile preferences in Settings are the closest scope match to ChatGPT\'s Custom Instructions — both apply across all your chats without any extra setup per conversation. The mapping is imperfect: Claude\'s profile preferences are less structured and less prominent than Custom Instructions. Project Instructions add per-workspace rules on top but are scoped to one Project, not all chats.',
      },
    ],
  },

  applyCta: null,
};
