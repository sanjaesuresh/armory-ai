/**
 * Lesson: Prompt engineering, the anatomy of a good prompt
 * Track: engineering | Order: 2 | Slug: prompt-engineering
 *
 * Deep dive on the first of the three levers from ai-engineering-types: what
 * you say. Breaks a prompt into five parts (role, task, constraints, format,
 * examples), then rewrites a vague marketing-email request into a structured
 * one so the improvement is concrete, not abstract.
 */

import type { Lesson } from '@/lib/learn/types';

export const promptEngineering: Lesson = {
  slug: 'prompt-engineering',
  track: 'engineering',
  title: 'Prompt engineering',
  tagline: 'The words you choose are the most visible lever on AI output, and often the least powerful one, so use them well.',
  minutes: 6,
  order: 2,

  blocks: [
    // ─── Prose: what prompt engineering is ─────────────────────────────────────
    {
      type: 'prose',
      heading: 'The lever everyone reaches for first',
      paragraphs: [
        'Prompt engineering is the practice of shaping your request itself: the phrasing, the examples you give, the constraints you state, the format you ask for. It is the first thing most people try when an AI output disappoints them, and for good reason, it is the only lever you touch directly, in the same box where you type.',
        'It is also, on its own, the weakest of the three levers. A model can only work with what you tell it and what it can see. Rewriting your prompt fixes an ambiguous or underspecified request; it cannot fix a model that is missing the right file, and it cannot add a verification step that catches a wrong answer. Prompt engineering is necessary, not sufficient.',
        'Where it does matter is a lot: most everyday requests fail not because the model lacks information, but because the request itself is vague. "Make this better" and "write something for our customers" leave the model guessing at what better means and who the customers are. A prompt with a clear role, task, constraints, format, and examples removes the guessing.',
      ],
    },

    // ─── Hotspot diagram: anatomy of a prompt ──────────────────────────────────
    {
      type: 'hotspotDiagram',
      diagramId: 'prompt-anatomy',
      hotspots: [
        {
          id: 'role',
          title: 'Role',
          body: 'Who the model should act as. "You are a senior copy editor" sets a frame the model reasons from for the rest of the request, tone, judgment calls, and priorities all shift once a role is named.',
        },
        {
          id: 'task',
          title: 'Task',
          body: 'The core instruction, stated as a concrete action rather than a vague goal. "Rewrite this paragraph" is a task; "make this better" is not, because "better" is undefined.',
        },
        {
          id: 'constraints',
          title: 'Constraints',
          body: 'The rules and limits the output has to respect: length, tone, what must stay unchanged, what to avoid. Constraints narrow the space of acceptable answers so the model does not have to guess your preferences.',
        },
        {
          id: 'format',
          title: 'Format',
          body: 'The shape the output should take: a bulleted list, a table, plain prose, a specific word count. Naming the format up front saves a round trip where you ask the model to reformat what it already wrote.',
        },
        {
          id: 'examples',
          title: 'Examples',
          body: 'A sample of the style or output you want, also called few-shot. One good example often communicates a tone or pattern faster and more reliably than a paragraph describing it.',
        },
      ],
    },

    // ─── Worked example: vague request rewritten into a structured prompt ─────
    {
      type: 'stepThrough',
      intro: 'Same request, "write a marketing email", improved by adding one part of the prompt at a time.',
      steps: [
        {
          title: 'Vague: no role, no constraints',
          body: 'Original request: "Write a marketing email about our new project templates feature."\n\nResult: three generic paragraphs, an exclamation point in every sentence, a subject line like "Exciting News!", no sense of who is sending it or who is reading it. Nothing is wrong exactly, but nothing is usable without a rewrite.',
        },
        {
          title: 'Add role and task',
          body: 'Improved: "You are a product marketer at a B2B software company. Write a launch email announcing our new project templates feature to existing customers."\n\nWhat changed: the model now has a professional frame (B2B, existing customers, not cold prospects) instead of writing generic ad copy. What improved: the tone settled down, the email assumes the reader already knows the product, and it stopped over-selling basics they already know.',
        },
        {
          title: 'Add constraints and format',
          body: 'Improved further: "...Keep it under 120 words. One clear call to action: try the feature this week. No exclamation points, no \'exciting news\' framing. Return a subject line, then the email body as plain paragraphs, no bullet list."\n\nWhat changed: length, tone limits, and a single desired action are now explicit, and the output shape is named instead of left to the model\'s default. What improved: the draft arrived at the length and structure needed for an actual send, not a first draft that still needed trimming and restructuring.',
        },
        {
          title: 'Add an example',
          body: 'Final addition: "Match this tone: \'Your dashboard just got faster. No setup, no new tab, it is already there.\' Direct, short sentences, no fluff."\n\nWhat changed: instead of describing the tone in the abstract ("direct", "no fluff"), the prompt shows a sentence in that tone. What improved: the model\'s draft matched the target voice on the first attempt, the kind of close, specific match that takes several rounds of description to reach without an example.',
        },
      ],
    },

    // ─── Callout: rule of thumb ─────────────────────────────────────────────────
    {
      type: 'callout',
      tone: 'tip',
      passage: 'When a result feels off, check whether your prompt actually named a role, a concrete task, real constraints, and a format, before assuming the model got it wrong. Show, do not just describe: one example of the tone or structure you want usually beats a paragraph explaining it. Specific beats polite every time.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'Why is prompt engineering described as necessary but not sufficient?',
        choices: [
          'Because it only works for coding tasks, not writing or marketing tasks',
          'Because it shapes what you say, but it cannot fix a model missing the right information or a loop with no verification step',
          'Because most models ignore explicit instructions and rely on training data instead',
        ],
        correctIndex: 1,
        explanation:
          'A well-built prompt removes ambiguity in the request itself, but it cannot compensate for the model working without the right files or context, and it cannot add a check that catches a wrong answer after the fact. Those gaps need context engineering and loop engineering respectively.',
      },
      {
        prompt: 'In the worked example, what specifically improved when the role and task were added to "write a marketing email"?',
        choices: [
          'The email got noticeably longer and covered more features',
          'The tone settled and the email stopped over-explaining basics, because it now assumed an existing-customer audience rather than a cold prospect',
          'The model added an exclamation point to every sentence for emphasis',
        ],
        correctIndex: 1,
        explanation:
          'Naming the role (a B2B product marketer) and the audience (existing customers) gave the model a frame to write from. Without it, the model defaulted to generic, over-selling ad copy aimed at an unknown reader.',
      },
      {
        prompt: 'What is the purpose of the "examples" part of a prompt?',
        choices: [
          'To pad the prompt so the model treats the request as more important',
          'To show, not just describe, the desired tone or output pattern, since one concrete sample often communicates style faster than a description of it',
          'To give the model a fallback answer to copy if it cannot complete the task',
        ],
        correctIndex: 1,
        explanation:
          'Words like "direct" or "no fluff" are open to interpretation. A single sentence written in the target tone removes that ambiguity, the model matches a pattern it can see instead of guessing at an adjective.',
      },
      {
        prompt: 'Scenario: You ask for "a summary of this document" and get three paragraphs when you needed five bullet points under 50 words. What part of the prompt was missing?',
        choices: [
          'Role, the model needed to be told to act as a summarizer',
          'Format, the request never specified the output shape or a length limit',
          'Examples, the request needed a sample summary to copy',
        ],
        correctIndex: 1,
        explanation:
          'The request was clear on the task (summarize) but silent on shape and length, so the model defaulted to prose paragraphs. Naming the format ("five bullet points, under 50 words") would have produced the right shape on the first try.',
      },
    ],
  },

  applyCta: null,
};
