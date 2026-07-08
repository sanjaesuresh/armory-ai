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
// ── 2026-07 breadth expansion: new industries + roles ────────────────────────
// Healthcare
import { clinicalAssistantSetup } from './clinical-assistant';
import { medicalScribeSetup } from './medical-scribe';
import { practiceManagerSetup } from './practice-manager';
import { patientCoordinatorSetup } from './patient-coordinator';
// Real Estate
import { realEstateAgentSetup } from './real-estate-agent';
import { propertyManagerSetup } from './property-manager';
import { mortgageBrokerSetup } from './mortgage-broker';
import { leasingConsultantSetup } from './leasing-consultant';
// Hospitality & Events
import { restaurantManagerSetup } from './restaurant-manager';
import { hotelFrontDeskManagerSetup } from './hotel-front-desk-manager';
import { eventPlannerSetup } from './event-planner';
// Retail & E-commerce
import { storeManagerSetup } from './store-manager';
import { ecommerceMerchandiserSetup } from './ecommerce-merchandiser';
import { customerExperienceLeadSetup } from './customer-experience-lead';
// Nonprofit
import { grantWriterSetup } from './grant-writer';
import { fundraisingManagerSetup } from './fundraising-manager';
import { volunteerCoordinatorSetup } from './volunteer-coordinator';
// Construction & Trades
import { generalContractorSetup } from './general-contractor';
import { projectEstimatorSetup } from './project-estimator';
import { siteSupervisorSetup } from './site-supervisor';
// Accounting & Finance
import { bookkeeperSetup } from './bookkeeper';
import { taxPreparerSetup } from './tax-preparer';
import { accountsPayableSpecialistSetup } from './accounts-payable-specialist';
// HR & People
import { hrGeneralistSetup } from './hr-generalist';
import { peopleOpsManagerSetup } from './people-ops-manager';
import { learningDevelopmentSpecialistSetup } from './learning-development-specialist';
// Consulting & Professional Services
import { managementConsultantSetup } from './management-consultant';
import { businessAnalystSetup } from './business-analyst';
import { executiveCoachSetup } from './executive-coach';
// Media & Creative
import { socialMediaManagerSetup } from './social-media-manager';
import { videoProducerSetup } from './video-producer';
import { podcastProducerSetup } from './podcast-producer';

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
  // Healthcare
  clinicalAssistantSetup,
  medicalScribeSetup,
  practiceManagerSetup,
  patientCoordinatorSetup,
  // Real Estate
  realEstateAgentSetup,
  propertyManagerSetup,
  mortgageBrokerSetup,
  leasingConsultantSetup,
  // Hospitality & Events
  restaurantManagerSetup,
  hotelFrontDeskManagerSetup,
  eventPlannerSetup,
  // Retail & E-commerce
  storeManagerSetup,
  ecommerceMerchandiserSetup,
  customerExperienceLeadSetup,
  // Nonprofit
  grantWriterSetup,
  fundraisingManagerSetup,
  volunteerCoordinatorSetup,
  // Construction & Trades
  generalContractorSetup,
  projectEstimatorSetup,
  siteSupervisorSetup,
  // Accounting & Finance
  bookkeeperSetup,
  taxPreparerSetup,
  accountsPayableSpecialistSetup,
  // HR & People
  hrGeneralistSetup,
  peopleOpsManagerSetup,
  learningDevelopmentSpecialistSetup,
  // Consulting & Professional Services
  managementConsultantSetup,
  businessAnalystSetup,
  executiveCoachSetup,
  // Media & Creative
  socialMediaManagerSetup,
  videoProducerSetup,
  podcastProducerSetup,
];
