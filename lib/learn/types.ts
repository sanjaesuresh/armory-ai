/**
 * Lesson data model types for the Learn AI feature.
 *
 * Self-contained — no imports from lib/setup/ or any model/metering module.
 */

import type { DiagramId } from '@/lib/learn/diagramManifest';

// ─── Track ────────────────────────────────────────────────────────────────────

export type LearnTrack = 'foundations' | 'chatgpt' | 'claude-app' | 'claude-code' | 'engineering';

export interface TrackDescriptor {
  slug: LearnTrack;
  title: string;
  intro: string;
}

export const TRACKS: ReadonlyArray<TrackDescriptor> = [
  {
    slug: 'foundations',
    title: 'Foundations',
    intro: 'Understand how AI chat works — context, instructions, and why setup matters.',
  },
  {
    slug: 'chatgpt',
    title: 'ChatGPT',
    intro: 'Set up custom instructions, projects, and knowledge files to get consistent results.',
  },
  {
    slug: 'claude-app',
    title: 'Claude App',
    intro: 'Use Claude Projects and styles to turn the app into a tuned assistant for your work.',
  },
  {
    slug: 'claude-code',
    title: 'Claude Code',
    intro: 'Understand agents, skills, harnesses, and the loop that powers agentic coding.',
  },
  {
    slug: 'engineering',
    title: 'AI Engineering',
    intro: 'The three levers behind good AI output, prompt, context, and loop engineering, and how to pull each one.',
  },
] as const;

// ─── Blocks ───────────────────────────────────────────────────────────────────

export interface ProseBlock {
  type: 'prose';
  heading?: string;
  paragraphs: string[];
}

export interface CalloutBlock {
  type: 'callout';
  tone: 'tip' | 'warning';
  passage: string;
}

export interface Hotspot {
  id: string;
  title: string;
  body: string;
}

export interface HotspotDiagramBlock {
  type: 'hotspotDiagram';
  diagramId: DiagramId;
  hotspots: Hotspot[];
}

export interface FlipCard {
  front: string;
  back: string;
}

export interface FlipCardsBlock {
  type: 'flipCards';
  intro?: string;
  cards: FlipCard[];
}

export interface Step {
  title: string;
  body: string;
}

export interface StepThroughBlock {
  type: 'stepThrough';
  intro?: string;
  steps: Step[];
}

export interface Exchange {
  speaker: 'user' | 'ai';
  text: string;
}

export interface BeforeAfterBlock {
  type: 'beforeAfter';
  beforeLabel: string;
  afterLabel: string;
  beforeExchanges: Exchange[];
  afterExchanges: Exchange[];
}

export interface ComparisonTableBlock {
  type: 'comparisonTable';
  headers: string[];
  rows: string[][];
}

export const WIDGET_IDS = [
  'context-meter',
  'agent-loop',
  'skill-trigger',
  'vendor-map',
  'instruction-steering',
  'style-switcher',
  'artifact-vs-chat',
  'knowledge-context',
  'gpt-vs-project-picker',
  'projects-switcher',
] as const;
export type WidgetId = (typeof WIDGET_IDS)[number];

export interface CustomWidgetBlock {
  type: 'customWidget';
  widgetId: WidgetId;
}

export type Block =
  | ProseBlock
  | CalloutBlock
  | HotspotDiagramBlock
  | FlipCardsBlock
  | StepThroughBlock
  | BeforeAfterBlock
  | ComparisonTableBlock
  | CustomWidgetBlock;

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

// ─── Lesson ───────────────────────────────────────────────────────────────────

export interface ApplyCta {
  label: string;
  href: string;
}

export interface Lesson {
  slug: string;
  track: LearnTrack;
  title: string;
  tagline: string;
  minutes: number;
  order: number;
  blocks: Block[];
  quiz: Quiz;
  applyCta: ApplyCta | null;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export type LessonProgressStatus = 'not-started' | 'in-progress' | 'completed';

export interface LessonProgress {
  status: LessonProgressStatus;
  bestScorePct: number | null;
  completedAt: string | null;
}

export type ProgressMap = Record<string, LessonProgress>;

// ─── Storage key ─────────────────────────────────────────────────────────────

export const LEARN_PROGRESS_STORAGE_KEY = 'armory:learn:progress' as const;

// ─── ValidationResult (local shape — mirrors lib/setup/validator convention) ──

export interface LearnValidationError {
  code: string;
  message: string;
  path: string;
}

export interface LearnValidationResult {
  valid: boolean;
  errors: LearnValidationError[];
}
