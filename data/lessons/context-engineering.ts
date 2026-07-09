/**
 * Lesson: Context engineering — controlling what the model can see
 * Track: engineering | Order: 3 | Slug: context-engineering
 *
 * Deep-dives the "context" lever introduced in ai-engineering-types.ts.
 * Teaches what gets assembled into the context window each turn, a worked
 * example distinct from that lesson's parseUser case, and a rule of thumb
 * for diagnosing context problems before rewriting a prompt.
 */

import type { Lesson } from '@/lib/learn/types';

export const contextEngineering: Lesson = {
  slug: 'context-engineering',
  track: 'engineering',
  title: 'Context engineering',
  tagline: 'Controlling what the model can see when it answers often matters more than how you phrase the question.',
  minutes: 6,
  order: 3,

  blocks: [
    // ─── Prose: what context engineering is ──────────────────────────────────
    {
      type: 'prose',
      heading: 'What the model can see, not just what you say',
      paragraphs: [
        'Context engineering is the practice of controlling what information is loaded into the model\'s context window before it answers. It is not about phrasing your request more cleverly, that is prompt engineering. It is about making sure the model has the actual, relevant material in front of it: the right file, the right document, the right prior decision, at the moment it needs to reason about your request.',
        'This matters because a model cannot use information it never received. It does not know your codebase, your company\'s policies, or yesterday\'s decisions unless those things are somewhere in the current context window. A beautifully worded prompt aimed at a model working blind still produces a guess, not an answer.',
        'In practice, context engineering often outperforms prompt engineering. Rewriting a request five different ways rarely helps if the underlying problem is that the model never saw the one document that contained the answer. Loading that document once tends to fix the output immediately, no matter how the question is phrased.',
      ],
    },

    // ─── Hotspot diagram: context assembly ────────────────────────────────────
    {
      type: 'hotspotDiagram',
      diagramId: 'context-assembly',
      hotspots: [
        {
          id: 'instructions',
          title: 'Instructions',
          body: 'The system prompt, custom instructions, or a CLAUDE.md file, standing guidance that applies to every turn, not just this one. It sets tone, constraints, and defaults before the model even sees your message.',
        },
        {
          id: 'files',
          title: 'Files',
          body: 'Documents, code, or other material attached or open in the session, the knowledge base for this task. If the file the model needs is not attached, the model cannot read it, no matter how the question is worded.',
        },
        {
          id: 'history',
          title: 'History',
          body: 'The conversation so far: everything you and the model have said in this session. Earlier decisions, corrections, and clarifications live here, and they shape how the model interprets your next message.',
        },
        {
          id: 'retrieval',
          title: 'Retrieval',
          body: 'For sources too large to fit whole, a retrieval step searches and pulls in only the passages judged most relevant to the current question. The model sees those excerpts, not the full source, so a vague question can miss what it needed.',
        },
        {
          id: 'window',
          title: 'Context window',
          body: 'The point where instructions, files, history, and retrieved passages all converge. This is what the model actually reads before it answers, everything else, no matter how true or relevant, is invisible to it.',
        },
      ],
    },

    // ─── Step-through: a task that fails, then succeeds, on context alone ────
    {
      type: 'stepThrough',
      intro: 'Same request, same phrasing, two outcomes. The only thing that changes is what is in the context window when the model answers.',
      steps: [
        {
          title: 'Step 1: The request, without the right context',
          body: 'A support team asks an AI assistant: "Can we offer this customer a refund outside the normal 30-day window?" With no company policy loaded, the model has nothing to reason from except general norms. It gives a generic, hedged answer: "This depends on your company\'s policy, you may want to check with a manager."\n\nThe request was clear. The model was not incapable. It simply had no source of truth about this company\'s actual refund rules, so it could not do better than a guess dressed up as caution.',
        },
        {
          title: 'Step 2: Add the actual policy document',
          body: 'The team attaches the current refund policy document to the conversation before asking again. The document states exceptions are allowed within 45 days for defective items, with manager sign-off logged in the ticket.\n\nWhat changed: the policy text is now inside the context window alongside the question. What improved: the model can quote the actual exception clause, state the 45-day defective-item allowance, and note the sign-off requirement, a specific, checkable answer instead of a hedge.',
        },
        {
          title: 'Step 3: Notice the fix was not the prompt',
          body: 'The question was worded identically in both steps. Nothing about phrasing, examples, or format changed between the generic answer and the specific one. The only variable was whether the refund policy existed inside the context window at the moment the model answered.\n\nThis is the signature of a context problem: the same prompt produces a bad answer without the source material and a good answer with it. When you see that pattern, adding the right document fixes it faster than any amount of prompt rewriting.',
        },
      ],
    },

    // ─── Callout: rule of thumb ───────────────────────────────────────────────
    {
      type: 'callout',
      tone: 'tip',
      passage: 'Before you rewrite a prompt, check what the model can actually see. Ask yourself: is the relevant file attached? Is the standing instruction document current? Does the model have any way to know the fact I am assuming it knows? If the answer is no, that is a context problem, and no amount of clever phrasing will fix it. Load the missing material first, then judge whether the prompt still needs work.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What does context engineering control?',
        choices: [
          'How persuasively or clearly a request is phrased',
          'Which information, files, instructions, history, and retrieved passages are loaded into the context window before the model answers',
          'How fast the model generates its response',
        ],
        correctIndex: 1,
        explanation:
          'Context engineering is about the information available to the model, not the wording of the request. It covers what gets loaded into the context window: standing instructions, attached files, prior conversation, and retrieved passages. Prompt engineering, by contrast, is about phrasing.',
      },
      {
        prompt: 'In the refund policy example, why did the model give a generic, hedged answer the first time?',
        choices: [
          'The question was too vague and needed to be reworded',
          'The model does not understand refund policies as a concept',
          'The actual company refund policy was not in the context window, so the model had nothing specific to reason from',
        ],
        correctIndex: 2,
        explanation:
          'The question was clear both times, and the wording never changed. The model gave a generic answer the first time because the company\'s actual policy document was not loaded into context, it had no source of truth to check against, so it fell back on a general hedge. Once the document was attached, the same question got a specific, checkable answer.',
      },
      {
        prompt: 'What is the diagnostic signal that a bad AI answer is a context problem rather than a prompt problem?',
        choices: [
          'The model responds slowly',
          'The same prompt produces a vague or wrong answer without a key document or file, and a specific, correct answer once that material is loaded, with no change in wording',
          'The answer contains a spelling mistake',
        ],
        correctIndex: 1,
        explanation:
          'If identical phrasing produces a bad answer without the relevant source and a good answer with it, wording was never the issue. That pattern points directly at context: the model lacked information it needed, and no rewrite of the question could have supplied it. The fix is loading the missing material, not iterating on the prompt.',
      },
      {
        prompt: 'Why does retrieval sometimes cause a model to miss information that technically exists in an attached source?',
        choices: [
          'Retrieval deletes parts of the file permanently',
          'Retrieval pulls in only the passages judged most relevant to the current question; if the question does not surface the right passage, the model never sees it',
          'Retrieval only works on files smaller than one page',
        ],
        correctIndex: 1,
        explanation:
          'When a source is too large to fit in the window whole, retrieval searches it and selects the passages it judges most relevant to the question, adding only those to context. The full source still exists, but the model only reads what retrieval selected. A vague or oddly worded question can cause the wrong passages to be pulled, so the model answers from an incomplete slice even though the information is technically present in the source.',
      },
    ],
  },

  applyCta: null,
};
