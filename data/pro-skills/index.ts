/**
 * Granular per-job task-skills for the Professionals catalog.
 *
 * Each entry is a small, single-task setup (kind:'setup', tier:'core') grouped
 * to its parent job via the `role` field — the per-job hub at /jobs/[role] lists
 * every setup sharing that role. Add a role's skills file here and it flows into
 * supabase/seed.sql via `npm run seed`.
 *
 * Depth wave 1 covers 10 high-value jobs (100 skills). Later waves can extend
 * depth to the remaining roles.
 */

import type { Setup } from '@/lib/setup/types';
import { marketingManagerSkills } from './marketing-manager-skills';
import { salesAccountExecutiveSkills } from './sales-account-executive-skills';
import { recruiterSkills } from './recruiter-skills';
import { socialMediaManagerSkills } from './social-media-manager-skills';
import { customerSupportLeadSkills } from './customer-support-lead-skills';
import { dataAnalystSkills } from './data-analyst-skills';
import { projectManagerSkills } from './project-manager-skills';
import { productManagerSkills } from './product-manager-skills';
import { contentWriterSkills } from './content-writer-skills';
import { executiveAssistantSkills } from './executive-assistant-skills';

export const proSkills: Setup[] = [
  ...marketingManagerSkills,
  ...salesAccountExecutiveSkills,
  ...recruiterSkills,
  ...socialMediaManagerSkills,
  ...customerSupportLeadSkills,
  ...dataAnalystSkills,
  ...projectManagerSkills,
  ...productManagerSkills,
  ...contentWriterSkills,
  ...executiveAssistantSkills,
];
