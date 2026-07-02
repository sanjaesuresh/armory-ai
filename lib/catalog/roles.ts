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
