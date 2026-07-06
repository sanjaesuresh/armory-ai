/**
 * Category → tint and icon helpers.
 * Deterministic, pure — no side-effects.
 * All mappings live here so SetupCard and BrowseSetups stay thin.
 */

import type { Category } from '@/lib/setup/types';
import { ROLES } from './roles';

// ─── Tint ─────────────────────────────────────────────────────────────────────

/** Maps every Category value to one of the eight pastel tint CSS classes. */
const CATEGORY_TINT: Record<Category, string> = {
  marketing:          'tint-butter',
  sales:              'tint-mint',
  'customer-support': 'tint-sky',
  operations:         'tint-sage',
  hr:                 'tint-lilac',
  content:            'tint-peach',
  research:           'tint-sky',
  product:            'tint-blush',
  engineering:        'tint-lilac',
  design:             'tint-blush',
  finance:            'tint-sand',
  legal:              'tint-sand',
  education:          'tint-mint',
  writing:            'tint-peach',
  data:               'tint-sky',
  devops:             'tint-sage',
  general:            'tint-butter',
};

export function getCategoryTint(category: Category): string {
  return CATEGORY_TINT[category] ?? 'tint-sand';
}

// ─── Labels ───────────────────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
  marketing:          'Marketing',
  sales:              'Sales',
  'customer-support': 'Customer Support',
  operations:         'Operations',
  hr:                 'HR',
  content:            'Content',
  research:           'Research',
  product:            'Product',
  engineering:        'Engineering',
  design:             'Design',
  finance:            'Finance',
  legal:              'Legal',
  education:          'Education',
  writing:            'Writing',
  data:               'Data',
  devops:             'DevOps',
  general:            'General',
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABEL[category] ?? category;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const CATEGORY_ICON: Record<string, string> = {
  marketing:          '📣',
  sales:              '💼',
  'customer-support': '🎧',
  operations:         '⚙️',
  hr:                 '🔍',
  content:            '✏️',
  research:           '📚',
  product:            '🧭',
  engineering:        '🔧',
  design:             '🎨',
  finance:            '💰',
  legal:              '⚖️',
  education:          '🎓',
  writing:            '✍️',
  data:               '📊',
  devops:             '🚀',
  general:            '⚡',
};

/**
 * Returns an emoji icon for a setup.
 * Prefers the emoji already on the matching ROLE entry; falls back to
 * the category's default glyph.
 */
export function getSetupIcon(role: string, category: Category): string {
  const roleEntry = ROLES.find(
    (r) => r.label.toLowerCase() === role.toLowerCase(),
  );
  if (roleEntry) return roleEntry.icon;
  return CATEGORY_ICON[category] ?? '⚙️';
}

// ─── Accent map ───────────────────────────────────────────────────────────────

/**
 * Maps every Category to its saturated accent companion CSS var.
 * Each value passes WCAG 2.2 AA (≥ 4.5:1) as a glyph on its own tint, and
 * ≥ 3:1 as a UI edge/pill on --paper. See app/globals.css for the ratios.
 */
export const CATEGORY_ACCENT: Record<Category, string> = {
  marketing:          'var(--accent-butter)',
  sales:              'var(--accent-mint)',
  'customer-support': 'var(--accent-sky)',
  operations:         'var(--accent-sage)',
  hr:                 'var(--accent-lilac)',
  content:            'var(--accent-peach)',
  research:           'var(--accent-sky)',
  product:            'var(--accent-blush)',
  engineering:        'var(--accent-lilac)',
  design:             'var(--accent-blush)',
  finance:            'var(--accent-sand)',
  legal:              'var(--accent-sand)',
  education:          'var(--accent-mint)',
  writing:            'var(--accent-peach)',
  data:               'var(--accent-sky)',
  devops:             'var(--accent-sage)',
  general:            'var(--accent-butter)',
};

export function getCategoryAccent(category: Category): string {
  return CATEGORY_ACCENT[category] ?? 'var(--accent-sand)';
}

// ─── Browse order ─────────────────────────────────────────────────────────────

/**
 * Curated display order for the "browse by category" zone.
 * Common professional roles first, then specialist roles.
 */
export const CATEGORY_BROWSE_ORDER: Category[] = [
  'marketing',
  'sales',
  'customer-support',
  'operations',
  'content',
  'product',
  'hr',
  'finance',
  'research',
  'data',
  'design',
  'engineering',
  'devops',
  'legal',
  'education',
  'general',
];

// ─── Blurbs ──────────────────────────────────────────────────────────────────

/** One-line descriptor for each category card (≤ ~34 chars). */
const CATEGORY_BLURB: Record<Category, string> = {
  marketing:          'Campaigns, copy & content ops',
  sales:              'Outreach, proposals & follow-ups',
  'customer-support': 'Replies, tickets & escalations',
  operations:         'SOPs, workflows & process docs',
  hr:                 'Job posts, screening & onboarding',
  content:            'Drafts, edits & publishing flows',
  research:           'Summaries, comparisons & briefs',
  product:            'Specs, roadmaps & user insights',
  engineering:        'Code review, debugging & docs',
  design:             'Briefs, feedback & copy review',
  finance:            'Reports, models & commentary',
  legal:              'Contracts, policies & plain language',
  education:          'Lesson plans, quizzes & feedback',
  writing:            'Long-form, editing & style guides',
  data:               'Analysis, queries & visualisation',
  devops:             'CI/CD, infra & release notes',
  general:            'Everyday tasks across any role',
};

export function getCategoryBlurb(category: Category): string {
  return CATEGORY_BLURB[category] ?? '';
}
