/**
 * Core Setup types for Armory.
 * No runtime dependencies — plain TypeScript interfaces and string-literal unions.
 */

// ─── Primitive unions ────────────────────────────────────────────────────────

export type Category =
  | 'content'
  | 'marketing'
  | 'engineering'
  | 'design'
  | 'product'
  | 'sales'
  | 'customer-support'
  | 'finance'
  | 'legal'
  | 'hr'
  | 'operations'
  | 'research'
  | 'education'
  | 'writing'
  | 'data'
  | 'devops'
  | 'general';

export type ExportTarget = 'claude-app' | 'chatgpt';

// ─── Variable ────────────────────────────────────────────────────────────────

export interface Variable {
  key: string;
  label: string;
  type: 'text' | 'multiline' | 'select' | 'multiselect' | 'number' | 'boolean';
  /** Required when type is 'select' or 'multiselect'. */
  options?: string[];
  default?: string | number | boolean | string[];
  required: boolean;
  helpText?: string;
  group?: string;
}

// ─── KnowledgeFile (discriminated on kind) ───────────────────────────────────

export type KnowledgeFile =
  | {
      name: string;
      purpose: string;
      kind: 'starter';
      /** Bundled content shown immediately in Claude Projects. */
      content: string;
      required: boolean;
    }
  | {
      name: string;
      purpose: string;
      kind: 'user-provided';
      /** Instructions telling the user what to put in this file. */
      guidance: string;
      required: boolean;
    };

// ─── Scenario ────────────────────────────────────────────────────────────────

export interface Scenario {
  id: string;
  title: string;
  userInput: string;
  /** Prose description of the expected assistant response. */
  expectedBehavior: string;
  mustContain?: string[];
  mustNotContain?: string[];
}

// ─── Setup ───────────────────────────────────────────────────────────────────

export interface Setup {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  industry: string | null;
  tags: string[];
  category: Category;
  source: 'curated' | 'ai-generated' | 'community';
  author: string | null;
  /** Semantic version string, e.g. "1.0.0". */
  version: string;
  /** ISO 8601 date-time string. */
  createdAt: string;
  /** ISO 8601 date-time string. */
  updatedAt: string;
  reviewStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  upvotes: number;
  featured: number | null;
  targets: ExportTarget[];
  tier: 'core' | 'advanced';
  /**
   * Handlebars-style template string.
   * Supports {{variable}}, {{#if variable}}…{{/if}}, multiselect placeholders.
   */
  instructionTemplate: string;
  variables: Variable[];
  knowledgeFiles: KnowledgeFile[];
  scenarios: Scenario[];
}

// ─── Answers ─────────────────────────────────────────────────────────────────

/** Map from variable key to the user-supplied value. */
export type Answers = Record<string, string | number | boolean | string[]>;

// ─── CompiledSetup ───────────────────────────────────────────────────────────

export interface CompiledSetup {
  instruction: string;
  knowledgeFiles: Array<{
    name: string;
    content: string;
    kind: 'starter' | 'user-provided';
  }>;
  summary: string;
  meta: {
    setupId: string;
    name: string;
    version: string;
    target: ExportTarget;
  };
  inputs: Answers;
}

// ─── ValidationResult ────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: Array<{ code: string; message: string; path: string }>;
  warnings: Array<{ code: string; message: string; path: string }>;
}
