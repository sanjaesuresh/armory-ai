/**
 * Role list for Armory's recommender.
 *
 * Each entry has:
 *   id          — kebab-case identifier used as the `role` param in recommend()
 *   label       — human-readable string; must match Setup.role (case-insensitive)
 *   description — one-line explanation shown in the UI
 *   icon        — emoji (no icon library — YAGNI)
 */

export interface Role {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const ROLES: Role[] = [
  {
    id: 'marketing-manager',
    label: 'Marketing Manager',
    description: 'Plan campaigns, write copy, and manage brand voice across every channel.',
    icon: '📣',
  },
  {
    id: 'small-business-owner',
    label: 'Small Business Owner',
    description: 'Run day-to-day operations, handle customers, and grow your business.',
    icon: '🏪',
  },
  {
    id: 'customer-support',
    label: 'Customer Support',
    description: 'Resolve tickets faster, draft replies, and keep customers happy.',
    icon: '🎧',
  },
  {
    id: 'recruiter',
    label: 'Recruiter',
    description: 'Source candidates, write job descriptions, and manage the hiring pipeline.',
    icon: '🔍',
  },
  {
    id: 'sales-rep',
    label: 'Sales Rep',
    description: 'Write outreach emails, follow-ups, and proposals that close deals.',
    icon: '💼',
  },
  {
    id: 'operations',
    label: 'Operations',
    description: 'Streamline processes, document workflows, and keep the team aligned.',
    icon: '⚙️',
  },
  {
    id: 'founder-generalist',
    label: 'Founder / Generalist',
    description: 'Switch between strategy, writing, research, and execution all in one day.',
    icon: '🚀',
  },
];

// ─── Related-roles map ────────────────────────────────────────────────────────

/**
 * For each role id, an ordered list of related role ids that earn partial credit
 * in the scored recommender. Ordered from most to least related.
 *
 * Reasoning:
 *   marketing-manager  → sales (shared outreach/copy work) + founder (wears both hats)
 *   small-business-owner → founder (same "wear every hat" reality) + operations
 *   customer-support   → (no strong overlap with the other roles in this set)
 *   recruiter          → operations (hiring is an ops function) + founder (early-stage)
 *   sales-rep          → marketing (shared messaging/outreach) + founder (selling is founder work)
 *   operations         → founder (ops is central to founder work) + small-business-owner
 *   founder-generalist → marketing + sales + operations (a founder does all three)
 */
export const RELATED_ROLES: Record<string, string[]> = {
  'marketing-manager': ['sales-rep', 'founder-generalist'],
  'small-business-owner': ['founder-generalist', 'operations'],
  'customer-support': [],
  recruiter: ['operations', 'founder-generalist'],
  'sales-rep': ['marketing-manager', 'founder-generalist'],
  operations: ['founder-generalist', 'small-business-owner'],
  'founder-generalist': ['marketing-manager', 'sales-rep', 'operations'],
};

// ─── Goal-tag list ────────────────────────────────────────────────────────────

/**
 * Curated plain-language goal chips presented to the user after role selection.
 * Each id corresponds to tags actually used on curated setups so tag-overlap
 * scoring can fire.  Labels are intentionally plain — no jargon.
 */
export interface GoalTag {
  id: string;
  label: string;
}

export const GOAL_TAGS: GoalTag[] = [
  { id: 'write-emails', label: 'Write emails' },
  { id: 'social-media', label: 'Social media' },
  { id: 'copywriting', label: 'Write copy' },
  { id: 'content', label: 'Create content' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'customer-support', label: 'Customer support' },
  { id: 'hiring', label: 'Hiring' },
  { id: 'reporting', label: 'Reporting & analysis' },
  { id: 'brand', label: 'Brand & voice' },
  { id: 'spreadsheets', label: 'Analyze spreadsheets' },
];
