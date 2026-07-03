/**
 * Tests for the related-roles map and goal-tag list added to roles.ts.
 */

import { describe, it, expect } from 'vitest';
import { ROLES, RELATED_ROLES, GOAL_TAGS } from './roles';

// Small list of jargon words that must not appear in plain-language goal-tag labels
const JARGON_DENYLIST = ['NLP', 'ML', 'AI', 'vector', 'embedding', 'LLM', 'API', 'SDK', 'CLI'];

// ─── RELATED_ROLES ────────────────────────────────────────────────────────────

describe('RELATED_ROLES', () => {
  const roleIds = new Set(ROLES.map((r) => r.id));

  it('every related role id in the map exists in ROLES', () => {
    for (const [, relatedIds] of Object.entries(RELATED_ROLES)) {
      for (const relatedId of relatedIds) {
        expect(roleIds.has(relatedId), `"${relatedId}" is not a valid ROLES id`).toBe(true);
      }
    }
  });

  it('no role lists itself as a related role', () => {
    for (const [roleId, relatedIds] of Object.entries(RELATED_ROLES)) {
      expect(relatedIds, `role "${roleId}" lists itself`).not.toContain(roleId);
    }
  });

  it('every ROLES id has an entry in RELATED_ROLES (even if empty)', () => {
    for (const role of ROLES) {
      expect(
        Object.prototype.hasOwnProperty.call(RELATED_ROLES, role.id),
        `RELATED_ROLES missing key "${role.id}"`,
      ).toBe(true);
    }
  });
});

// ─── GOAL_TAGS ────────────────────────────────────────────────────────────────

describe('GOAL_TAGS', () => {
  it('is non-empty', () => {
    expect(GOAL_TAGS.length).toBeGreaterThan(0);
  });

  it('each entry has a non-empty id and label', () => {
    for (const tag of GOAL_TAGS) {
      expect(typeof tag.id).toBe('string');
      expect(tag.id.length).toBeGreaterThan(0);
      expect(typeof tag.label).toBe('string');
      expect(tag.label.length).toBeGreaterThan(0);
    }
  });

  it('ids are unique', () => {
    const ids = GOAL_TAGS.map((t) => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('labels are plain-language (no jargon from denylist)', () => {
    for (const tag of GOAL_TAGS) {
      for (const jargon of JARGON_DENYLIST) {
        // Use word-boundary regex so "AI" doesn't match inside "emails"
        const pattern = new RegExp(`\\b${jargon}\\b`, 'i');
        expect(
          pattern.test(tag.label),
          `tag label "${tag.label}" contains jargon word "${jargon}"`,
        ).toBe(false);
      }
    }
  });

  it('has roughly 10 tags (8–12)', () => {
    expect(GOAL_TAGS.length).toBeGreaterThanOrEqual(8);
    expect(GOAL_TAGS.length).toBeLessThanOrEqual(12);
  });
});
