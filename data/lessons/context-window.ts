/**
 * Lesson: Context: your AI's working memory
 * Track: foundations | Order: 2 | Slug: context-window
 *
 * Teaches what the context window is, what fills it, what happens when it fills,
 * and why a fresh chat sometimes beats a very long one.
 */

import type { Lesson } from '@/lib/learn/types';

export const contextWindow: Lesson = {
  slug: 'context-window',
  track: 'foundations',
  title: 'The context window',
  tagline: 'The context window is how much text the model can see at once — fill it and quality degrades, so start a fresh chat when it runs low.',
  minutes: 6,
  order: 2,

  blocks: [
    // ─── Prose: what the context window is ───────────────────────────────────
    {
      type: 'prose',
      heading: 'The context window is everything the model can see right now',
      paragraphs: [
        'Every time the model generates a reply, it works from a fixed-size window of text — the context window. Anything inside that window the model can use. Anything outside it, the model cannot see at all.',
        'Context is measured in tokens. A token is roughly 3–4 characters of ordinary English text, so a token is usually shorter than a word. "context window" is two tokens. A typical page of text is around 500–700 tokens. Current models have context windows ranging from around 100,000 to 200,000 tokens — enough to hold a very long conversation, but not unlimited.',
      ],
    },

    // ─── Custom widget: context meter ─────────────────────────────────────────
    {
      type: 'customWidget',
      widgetId: 'context-meter',
    },

    // ─── Prose: what fills the window ────────────────────────────────────────
    {
      type: 'prose',
      heading: 'What fills the window',
      paragraphs: [
        'The context window is not just your latest message. It holds everything the model receives for this turn: any instructions you or the app has set (system prompt), every message in this conversation — both yours and the AI\'s replies — and any files or documents you have attached.',
        'That "context usage" percentage or bar some tools show is telling you what fraction of the total window is occupied. At 20%, you have plenty of room. At 90%, the window is nearly full.',
        'When the window fills, one of two things happens depending on the model and app: either the oldest messages are silently dropped so new ones can fit, or the model starts to lose coherence as it tries to compress too much into too little space. Either way, very long chats tend to get worse — the model forgets what you said at the start, loses the thread, or starts giving generic answers.',
      ],
    },

    // ─── Callout: fresh chat tip ──────────────────────────────────────────────
    {
      type: 'callout',
      tone: 'warning',
      passage: 'A fresh chat with a short summary often beats a very long chat. If a conversation has gone on for dozens of turns, start a new one and paste in the two or three sentences that matter. You will get a sharper response because the model\'s full attention goes to what\'s relevant, not to sifting through everything that came before.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What counts toward your context usage?',
        choices: [
          'Only the messages you have sent — not the AI\'s replies',
          'Everything in the window: your messages, the AI\'s replies, any instructions, and attached files',
          'Only text you have typed, not any uploaded files',
        ],
        correctIndex: 1,
        explanation:
          'The context window holds everything: your messages, the AI\'s replies, system instructions, and any files you have attached. All of it occupies space and counts toward the limit.',
      },
      {
        prompt: 'What tends to happen when the context window fills up?',
        choices: [
          'The chat stops working entirely and you get an error',
          'The AI charges you more per message',
          'Oldest content is dropped or response quality starts to degrade',
        ],
        correctIndex: 2,
        explanation:
          'When the window fills, models either silently drop the oldest messages to make room, or start losing coherence as they try to work with too much compressed context. Response quality suffers — the model forgets earlier details, loses the thread, or gives generic answers.',
      },
      {
        prompt: 'Why can starting a new chat help when a conversation gets very long?',
        choices: [
          'New chats use a faster server so responses come quicker',
          'It resets the context window, so the model\'s full attention goes to what you paste in now',
          'The model uses a newer, smarter version in new chats',
        ],
        correctIndex: 1,
        explanation:
          'A new chat starts with an empty context window. If you paste a short, focused summary of what matters, the model sees only that — no noise from dozens of earlier turns. You often get a sharper answer than you would from continuing an overstuffed conversation.',
      },
      {
        prompt: 'Roughly what is a "token" in AI terms?',
        choices: [
          'One complete word',
          'About 3–4 characters of text on average',
          'A payment unit that costs money per request',
        ],
        correctIndex: 1,
        explanation:
          'A token is roughly 3–4 characters of ordinary text — usually shorter than a word. "token" itself is one token. A typical page of text is around 500–700 tokens. Models use token counts to measure and limit context size.',
      },
    ],
  },

  applyCta: null,
};
