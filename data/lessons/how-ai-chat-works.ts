/**
 * Lesson: What happens when you press send
 * Track: foundations | Order: 1 | Slug: how-ai-chat-works
 *
 * Teaches what a chat AI actually does with your message, what it sees each turn,
 * and why it has no memory between separate chats.
 */

import type { Lesson } from '@/lib/learn/types';

export const howAiChatWorks: Lesson = {
  slug: 'how-ai-chat-works',
  track: 'foundations',
  title: 'How AI chat works',
  tagline: 'Each reply is predicted from the full conversation so far, the model does not reason, and without memory features it starts completely fresh in every new chat.',
  minutes: 5,
  order: 1,

  blocks: [
    // ─── Prose: what a chat AI is ────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'A chat AI is a text-prediction machine',
      paragraphs: [
        'When you send a message, a chat AI does one thing: it predicts the most likely next words based on everything it has been given. At its core, it is not reasoning the way a person does, and it is not looking things up in real time by itself. When an app has web search or other tools turned on, the app runs the search and feeds the results to the model as more text to work from. It is generating text that fits the pattern of the conversation so far.',
        'That prediction ability comes from training. Before you ever touched it, the model was trained on an enormous collection of text, books, websites, code, and more. That training is where all its apparent "knowledge" comes from. Your conversation today is not part of that training; it is just live input for this session.',
      ],
    },

    // ─── Hotspot diagram: the message flow ───────────────────────────────────
    {
      type: 'hotspotDiagram',
      diagramId: 'chat-flow',
      hotspots: [
        {
          id: 'your-message',
          title: 'Your message',
          body: 'The text you just typed. This is the newest addition to the conversation. On its own, it is a small piece of what the model receives.',
        },
        {
          id: 'conversation-history',
          title: 'Conversation history',
          body: 'Every message from earlier in this chat, both yours and the AI\'s, is packaged up and sent along with your new message. The model does not remember past turns on its own; the history is sent to it fresh every time.',
        },
        {
          id: 'the-model',
          title: 'The model',
          body: 'The AI software that receives the full package, your new message plus all prior turns, and predicts the most fitting reply. It has no memory of its own; the conversation history is its only context.',
        },
        {
          id: 'response',
          title: 'Response',
          body: 'The reply the model generates. Once it arrives, this response is added to the conversation history, so it becomes part of what gets sent on the next turn.',
        },
      ],
    },

    // ─── Flip cards: key terms ────────────────────────────────────────────────
    {
      type: 'flipCards',
      intro: 'Four terms worth knowing. Tap each card to see the definition.',
      cards: [
        {
          front: 'Model',
          back: 'The AI software that predicts text. It was trained on a large collection of writing before you ever used it. It does not look things up in real time, it generates replies from patterns learned during training.',
        },
        {
          front: 'Prompt',
          back: 'Everything the model receives in a single turn: your new message, all the earlier turns in the conversation, and any instructions you have set. Not just your question, the whole package.',
        },
        {
          front: 'Response',
          back: 'The text the model generates in reply to a prompt. Once it arrives, it joins the conversation history and becomes part of the next prompt the model sees.',
        },
        {
          front: 'Training data',
          back: 'The text a model learned from during its training period, books, websites, code, and more. This is fixed. Your live conversation is not training data, and the model does not learn from your chats unless you have explicitly opted in.',
        },
      ],
    },

    // ─── Callout: no memory between chats ────────────────────────────────────
    {
      type: 'callout',
      tone: 'tip',
      passage: 'The model itself starts fresh with every new conversation, it has no built-in memory between chats. Some apps layer memory features on top (like ChatGPT\'s optional Memory, or a Claude project\'s knowledge), which can carry notes into new conversations, but that is the app doing it, not the model. Without such a feature, you bring the continuity yourself: paste in a summary of the earlier chat.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'When you send a message, what does the model actually receive?',
        choices: [
          'Only your latest message',
          'Your new message plus the full conversation history so far',
          'A summary that the app generates from your message',
          'Only the most recent three messages',
        ],
        correctIndex: 1,
        explanation:
          'Every turn, the app packages your new message together with all prior turns in the conversation and sends the whole thing to the model. The model has no memory of its own, the history is sent to it fresh each time.',
      },
      {
        prompt: 'If you had a chat yesterday, will the AI remember it today in a new chat?',
        choices: [
          'Yes, it stores all your past conversations automatically',
          'Not by default, the model starts fresh each time, though some apps add memory features on top',
          'Only if you are signed in to an account',
        ],
        correctIndex: 1,
        explanation:
          'The model itself has no built-in memory between conversations, it starts fresh every time. Some apps (like ChatGPT with Memory enabled, or a Claude project) can carry notes into new chats, but that is the app doing it, not the model. Without such a feature, you bring the continuity yourself: paste in a summary of what was discussed.',
      },
      {
        prompt: 'In AI terms, what is a "prompt"?',
        choices: [
          'A question you type, and nothing else',
          'A reminder you give the AI to stay on topic',
          'Everything the model receives in a single turn, your message plus the conversation history and any instructions',
        ],
        correctIndex: 2,
        explanation:
          'A prompt is the full package sent to the model for each turn: your message, all previous turns, and any system instructions that are set. Just your question is only one part of it.',
      },
      {
        prompt: 'What is the difference between training data and your conversation?',
        choices: [
          'There is no difference, the AI learns from your messages',
          'Training data is what the model learned from before release; your conversation is live input for this session only',
          'Training data is stored in the cloud; your conversation is kept locally on your device',
        ],
        correctIndex: 1,
        explanation:
          'Training data is fixed, the text the model learned from during its training period, before it was released. Your conversation is live input that the model uses right now, in this session. The model does not update its training from your chats.',
      },
    ],
  },

  applyCta: null,
};
