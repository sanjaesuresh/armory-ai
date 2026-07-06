/**
 * Lesson: Skills — reusable procedures for Claude Code
 * Track: claude-code | Order: 2 | Slug: claude-code-skills
 *
 * Teaches what a skill is (a folder with an instructions file), how the trigger
 * mechanism works (description matching), and why writing reusable skills once
 * is better than prompting the same procedure from scratch every time.
 */

import type { Lesson } from '@/lib/learn/types';

export const claudeCodeSkills: Lesson = {
  slug: 'claude-code-skills',
  track: 'claude-code',
  title: 'Skills — reusable procedures for Claude Code',
  tagline: 'Write a procedure once as a skill, and Claude loads it automatically whenever it fits.',
  minutes: 6,
  order: 2,

  blocks: [
    // ─── Prose: what a skill is ───────────────────────────────────────────────
    {
      type: 'prose',
      heading: 'A skill is a folder with an instructions file',
      paragraphs: [
        'Every time you ask Claude Code to review a pull request, write a commit message, or run a specific kind of analysis, you are describing a repeatable procedure. A skill makes that procedure permanent: you write it out once in a plain text file, place it in a folder Claude Code knows to look in, and Claude reads and follows it automatically every time a matching request comes in.',
        'The folder structure is straightforward. A skill typically lives in the .claude/skills/ folder of your project (or a global skills location in your home directory). Each skill is its own subfolder. Inside that subfolder there is at minimum one file — typically SKILL.md — that contains the instructions: the skill\'s purpose, its trigger description, the steps it should follow, and any output format rules.',
        'Think of a skill as a standing procedure stored in writing. The Commit Message skill in Armory\'s registry, for example, is a SKILL.md that tells Claude exactly how to read a staged diff, what format to use, how long the subject line should be, and what the body should explain. You install it once; every commit message session follows the same discipline without you re-explaining it.',
      ],
    },

    // ─── Custom widget: skill-trigger ─────────────────────────────────────────
    {
      type: 'customWidget',
      widgetId: 'skill-trigger',
    },

    // ─── Prose: how triggering works ──────────────────────────────────────────
    {
      type: 'prose',
      heading: 'How a skill gets loaded',
      paragraphs: [
        'Each skill has a description field in its instructions file — a sentence or two that says when this skill applies. When you send a request, Claude Code matches your phrasing against the descriptions of all installed skills. If a match is found, that skill\'s full instructions are loaded into the context alongside your request, and Claude follows them.',
        'The match is semantic, not keyword-based. A skill described as "use this when writing or drafting a commit message" will fire when you say "can you draft a commit for these changes," even though none of those exact words overlap. The model understands intent.',
        'If no skill matches, Claude handles the request using only its general knowledge and whatever context is already loaded — CLAUDE.md, open files, conversation history. Skills layer on top; they do not replace Claude\'s base behaviour.',
      ],
    },

    // ─── Callout: description is the trigger ──────────────────────────────────
    {
      type: 'callout',
      tone: 'tip',
      passage: 'A skill\'s description determines when it fires — write it like a trigger condition, not a title. "Use this skill when asked to write or suggest a commit message" is a trigger. "Commit Message Skill" is a title. The first one works; the second one might not.',
    },
  ],

  quiz: {
    questions: [
      {
        prompt: 'What does a Claude Code skill consist of, at its core?',
        choices: [
          'A Python script that runs as a subprocess during the agent loop',
          'A folder containing at minimum an instructions file — typically SKILL.md — with the skill\'s purpose, trigger, and procedure',
          'A custom model fine-tuned on examples of the task you want it to do',
        ],
        correctIndex: 1,
        explanation:
          'A skill is a folder with an instructions file — plain text, usually SKILL.md. It describes what the skill is for, when to use it, and how to carry out the procedure. No code, no training, no compilation — just written instructions that Claude reads.',
      },
      {
        prompt: 'How does Claude Code decide which skill to load for a given request?',
        choices: [
          'It scans the skill folder names for an exact keyword match with your message',
          'You must explicitly name the skill in your request with a slash command',
          'It matches the meaning of your request against each skill\'s description field, then loads the best match',
        ],
        correctIndex: 2,
        explanation:
          'Skill selection is based on semantic matching between your request and each skill\'s description field. You do not have to use the skill\'s exact name — if your request matches the intent the description describes, the skill loads. This is why the description matters so much: it is the trigger condition.',
      },
      {
        prompt: 'Why write a repeatable task as a skill rather than just prompting from scratch each time?',
        choices: [
          'Skills execute faster because they bypass the model',
          'Skills encode the procedure once — so every run follows the same steps, format, and constraints without re-explaining them',
          'You must use skills for anything that touches the filesystem',
        ],
        correctIndex: 1,
        explanation:
          'Writing a skill turns a repeatable procedure into a permanent asset. Instead of re-typing "follow these steps, use this format, enforce these constraints" every session, you write it once in SKILL.md. Every time the skill fires, Claude follows the same discipline — consistent, reliable, no drift from session to session.',
      },
      {
        prompt: 'What happens when you send a request and no installed skill matches?',
        choices: [
          'Claude Code returns an error asking you to name a skill explicitly',
          'Claude handles the request using its general capabilities and whatever context is already loaded — CLAUDE.md, open files, conversation history',
          'Claude asks you to install a skill before proceeding',
        ],
        correctIndex: 1,
        explanation:
          'Skills are additive — they layer on top of Claude\'s base behaviour when they match. If nothing matches, Claude still works: it uses its general knowledge and whatever is already in context. Skills improve consistency for known procedures; they do not block Claude from handling novel requests.',
      },
    ],
  },

  applyCta: {
    label: 'Browse skills in the registry',
    href: '/developers',
  },
};
