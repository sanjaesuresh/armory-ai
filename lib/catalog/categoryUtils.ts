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
