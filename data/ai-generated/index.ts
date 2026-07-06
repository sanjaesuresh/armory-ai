/**
 * AI-generated role setups seeded into the Professionals catalog.
 *
 * Authored by the model (source: 'ai-generated'), reviewed before seeding —
 * the same pre-reviewed path as data/curated/ and data/community-picks/.
 * Add new entries here and they flow into supabase/seed.sql via `npm run seed`.
 */

import type { Setup } from '@/lib/setup/types';
import { salesAccountExecutiveSetup } from './sales-account-executive';
import { customerSupportLeadSetup } from './customer-support-lead';
import { recruiterSetup } from './recruiter';
import { financialAnalystSetup } from './financial-analyst';
import { contractsParalegalSetup } from './contracts-paralegal';
import { productManagerSetup } from './product-manager';
import { uxDesignerSetup } from './ux-designer';
import { dataAnalystSetup } from './data-analyst';
import { operationsManagerSetup } from './operations-manager';
import { contentWriterSetup } from './content-writer';
import { classroomTeacherSetup } from './classroom-teacher';
import { marketResearcherSetup } from './market-researcher';
import { executiveAssistantSetup } from './executive-assistant';
import { smallBusinessOwnerSetup } from './small-business-owner';
import { projectManagerSetup } from './project-manager';

export const aiGeneratedSetups: Setup[] = [
  salesAccountExecutiveSetup,
  customerSupportLeadSetup,
  recruiterSetup,
  financialAnalystSetup,
  contractsParalegalSetup,
  productManagerSetup,
  uxDesignerSetup,
  dataAnalystSetup,
  operationsManagerSetup,
  contentWriterSetup,
  classroomTeacherSetup,
  marketResearcherSetup,
  executiveAssistantSetup,
  smallBusinessOwnerSetup,
  projectManagerSetup,
];
