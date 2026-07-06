/**
 * Content validation suite for ALL_LESSONS.
 *
 * Every lesson in the registry must:
 *   - pass validateLesson (zero structural errors)
 *   - have every hotspotDiagram diagramId and hotspot ids match DIAGRAM_MANIFEST exactly
 *   - have every customWidget widgetId registered in WIDGET_IDS
 *   - have every applyCta href start with '/'
 *
 * validateLessonSet must also pass (no duplicate slugs, contiguous per-track order).
 *
 * Foundations-specific case: exactly three lessons in slug order
 *   how-ai-chat-works → context-window → instructions-steering.
 *
 * This file is the base suite — Tasks 10–12 extend it by registering their tracks;
 * these tests will automatically cover new lessons once they appear in ALL_LESSONS.
 */

import { describe, it, expect } from 'vitest';
import { ALL_LESSONS } from '@/data/lessons/index';
import { validateLesson, validateLessonSet } from '@/lib/learn/validator';
import { DIAGRAM_MANIFEST } from '@/lib/learn/diagramManifest';
import { WIDGET_IDS } from '@/lib/learn/types';

// ─── Cross-lesson set checks ───────────────────────────────────────────────────

describe('ALL_LESSONS registry', () => {
  it('validateLessonSet passes (no duplicate slugs, contiguous per-track order)', () => {
    const result = validateLessonSet(ALL_LESSONS);
    expect(
      result.errors,
      `validateLessonSet errors:\n${JSON.stringify(result.errors, null, 2)}`,
    ).toEqual([]);
    expect(result.valid).toBe(true);
  });
});

// ─── Per-lesson structural checks ─────────────────────────────────────────────

describe('each lesson passes validateLesson', () => {
  if (ALL_LESSONS.length === 0) {
    it.todo('no lessons registered yet');
  }

  for (const lesson of ALL_LESSONS) {
    it(`lesson "${lesson.slug}" has zero validation errors`, () => {
      const result = validateLesson(lesson);
      expect(
        result.errors,
        `validateLesson errors for "${lesson.slug}":\n${JSON.stringify(result.errors, null, 2)}`,
      ).toEqual([]);
      expect(result.valid).toBe(true);
    });
  }
});

// ─── Diagram manifest integrity ────────────────────────────────────────────────

describe('hotspotDiagram blocks reference registered ids', () => {
  it('every hotspotDiagram uses a registered diagramId with exactly matching hotspot ids', () => {
    for (const lesson of ALL_LESSONS) {
      for (const block of lesson.blocks) {
        if (block.type !== 'hotspotDiagram') continue;

        const manifestIds = DIAGRAM_MANIFEST[block.diagramId as keyof typeof DIAGRAM_MANIFEST];
        expect(
          manifestIds,
          `Lesson "${lesson.slug}": unknown diagramId "${block.diagramId}"`,
        ).toBeDefined();

        const provided = [...block.hotspots.map(h => h.id)].sort();
        const declared = [...manifestIds].sort();
        expect(
          provided,
          `Lesson "${lesson.slug}" / diagramId "${block.diagramId}": hotspot ids mismatch`,
        ).toEqual(declared);
      }
    }
  });
});

// ─── Widget registry integrity ─────────────────────────────────────────────────

describe('customWidget blocks reference registered widget ids', () => {
  it('every customWidget uses a widgetId listed in WIDGET_IDS', () => {
    for (const lesson of ALL_LESSONS) {
      for (const block of lesson.blocks) {
        if (block.type !== 'customWidget') continue;
        expect(
          WIDGET_IDS as ReadonlyArray<string>,
          `Lesson "${lesson.slug}": unknown widgetId "${block.widgetId}"`,
        ).toContain(block.widgetId);
      }
    }
  });
});

// ─── CTA href safety ─────────────────────────────────────────────────────────

describe('applyCta hrefs are internal', () => {
  it('every applyCta href starts with /', () => {
    for (const lesson of ALL_LESSONS) {
      if (lesson.applyCta === null) continue;
      expect(
        lesson.applyCta.href,
        `Lesson "${lesson.slug}": applyCta.href "${lesson.applyCta.href}" must start with "/"`,
      ).toMatch(/^\//);
    }
  });
});

// ─── Foundations track ────────────────────────────────────────────────────────

describe('foundations track', () => {
  it('contains exactly three lessons', () => {
    const found = ALL_LESSONS.filter(l => l.track === 'foundations');
    expect(found).toHaveLength(3);
  });

  it('contains the three expected slugs in order: how-ai-chat-works → context-window → instructions-steering', () => {
    const found = ALL_LESSONS
      .filter(l => l.track === 'foundations')
      .sort((a, b) => a.order - b.order);

    expect(found[0]?.slug).toBe('how-ai-chat-works');
    expect(found[1]?.slug).toBe('context-window');
    expect(found[2]?.slug).toBe('instructions-steering');
  });
});

// ─── ChatGPT track ────────────────────────────────────────────────────────────

describe('chatgpt track', () => {
  it('contains exactly four lessons', () => {
    const found = ALL_LESSONS.filter(l => l.track === 'chatgpt');
    expect(found).toHaveLength(4);
  });

  it('contains the four expected slugs in order', () => {
    const found = ALL_LESSONS
      .filter(l => l.track === 'chatgpt')
      .sort((a, b) => a.order - b.order);

    expect(found[0]?.slug).toBe('chatgpt-custom-instructions');
    expect(found[1]?.slug).toBe('chatgpt-projects');
    expect(found[2]?.slug).toBe('chatgpt-knowledge-files');
    expect(found[3]?.slug).toBe('chatgpt-gpts-vs-projects');
  });
});

// ─── Claude App track ─────────────────────────────────────────────────────────

describe('claude-app track', () => {
  it('contains exactly four lessons', () => {
    const found = ALL_LESSONS.filter(l => l.track === 'claude-app');
    expect(found).toHaveLength(4);
  });

  it('contains the four expected slugs in order', () => {
    const found = ALL_LESSONS
      .filter(l => l.track === 'claude-app')
      .sort((a, b) => a.order - b.order);

    expect(found[0]?.slug).toBe('claude-projects');
    expect(found[1]?.slug).toBe('claude-styles');
    expect(found[2]?.slug).toBe('claude-artifacts');
    expect(found[3]?.slug).toBe('claude-vs-chatgpt-map');
  });
});

// ─── Claude Code track ────────────────────────────────────────────────────────

describe('claude-code track', () => {
  it('contains exactly five lessons', () => {
    const found = ALL_LESSONS.filter(l => l.track === 'claude-code');
    expect(found).toHaveLength(5);
  });

  it('contains the five expected slugs in order', () => {
    const found = ALL_LESSONS
      .filter(l => l.track === 'claude-code')
      .sort((a, b) => a.order - b.order);

    expect(found[0]?.slug).toBe('claude-code-intro');
    expect(found[1]?.slug).toBe('claude-code-skills');
    expect(found[2]?.slug).toBe('claude-code-agents');
    expect(found[3]?.slug).toBe('claude-code-harness');
    expect(found[4]?.slug).toBe('ai-engineering-types');
  });
});

// ─── Total registry size ──────────────────────────────────────────────────────

describe('ALL_LESSONS total count', () => {
  it('contains exactly 16 lessons (3 foundations + 4 chatgpt + 4 claude-app + 5 claude-code)', () => {
    expect(ALL_LESSONS).toHaveLength(16);
    expect(ALL_LESSONS.filter(l => l.track === 'foundations')).toHaveLength(3);
    expect(ALL_LESSONS.filter(l => l.track === 'chatgpt')).toHaveLength(4);
    expect(ALL_LESSONS.filter(l => l.track === 'claude-app')).toHaveLength(4);
    expect(ALL_LESSONS.filter(l => l.track === 'claude-code')).toHaveLength(5);
  });
});
