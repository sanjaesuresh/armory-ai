/**
 * Core Setup types for Armory.
 * No runtime dependencies — plain TypeScript interfaces and string-literal unions.
 */

// ─── SetupKind ───────────────────────────────────────────────────────────────

/** Discriminator for catalog items: 'setup' is the default; the other three are registry kinds. */
export type SetupKind = 'setup' | 'agent' | 'skill' | 'harness';

/**
 * The three registry kinds (non-setup). Used to branch validation logic and
 * to filter the catalog. Every later Phase 8 task imports this constant.
 */
export const REGISTRY_KINDS = ['agent', 'skill', 'harness'] as const satisfies ReadonlyArray<SetupKind>;

/** Returns true when kind is one of the registry kinds (agent, skill, harness). */
export function isRegistryKind(kind: SetupKind): kind is 'agent' | 'skill' | 'harness' {
  return (REGISTRY_KINDS as ReadonlyArray<string>).includes(kind);
}

// ─── ArtifactFile ─────────────────────────────────────────────────────────────

/** A file bundled with a registry item (agent, skill, or harness). */
export interface ArtifactFile {
  /** Plain file name, no path separators, max 100 chars. */
  name: string;
  /** Raw UTF-8 content, max ARTIFACT_FILE_LIMITS.maxBytesPerFile bytes. */
  content: string;
  /** Exactly one file per registry item must have isPrimary=true. */
  isPrimary: boolean;
}

// ─── Capability ───────────────────────────────────────────────────────────────

/** A CLI/slash-command capability exposed by a registry item. */
export interface Capability {
  /** The command string (e.g. "/help"). Must be non-empty. */
  command: string;
  /** Human-readable description. Must be non-empty. */
  description: string;
}

// ─── ARTIFACT_FILE_LIMITS ─────────────────────────────────────────────────────

/**
 * Shared limits for registry artifact files.
 * Exported so the builder UI, describe route, and validator all reference
 * the same numbers — no magic literals scattered across the codebase.
 */
export const ARTIFACT_FILE_LIMITS = {
  maxFiles: 10,
  maxBytesPerFile: 102_400,
  allowedExtensions: [
    '.md',
    '.markdown',
    '.txt',
    '.json',
    '.yaml',
    '.yml',
    '.toml',
  ] as const,
} as const;

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

export type ExportTarget = 'claude-app' | 'chatgpt' | 'claude-code';

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
  /**
   * Discriminator for the kind of catalog item.
   * 'setup'   — standard setup (instruction + knowledge layer, compilable).
   * 'agent'   — a bundled Claude agent (artifact files + capabilities).
   * 'skill'   — a reusable skill definition.
   * 'harness' — a test harness or evaluation scaffold.
   */
  kind: SetupKind;
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
  /**
   * Nightly-refreshed count of 'done' export events in the trailing 30 days.
   * Written by scripts/refresh-popularity.ts. Optional so existing fixtures
   * and community-submitted setups remain valid before the column is populated;
   * callers should treat absent values as 0.
   */
  popularity?: number;
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
  // ── Registry-only fields (empty for kind='setup') ───────────────────────────
  /** Files bundled with the registry item. Empty array for kind='setup'. */
  artifactFiles: ArtifactFile[];
  /** GitHub HTTPS URL for the registry item's source repo, or null. */
  repoUrl: string | null;
  /** CLI/slash-command capabilities exposed by the registry item. Empty for kind='setup'. */
  capabilities: Capability[];
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
