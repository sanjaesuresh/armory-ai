/**
 * Structural validator for Setup objects.
 *
 * validateSetup() → ValidationResult
 *   - errors: structural violations that block export/use
 *   - warnings: issues the user should fix but that don't block
 *
 * Also exports:
 *   RESERVED_SLUGS  — slugs that are off-limits for user-authored setups
 *   sanitizeTag     — trims, strips HTML, and caps tag length
 */

import type { Setup, Category, CompiledSetup, ExportTarget, ValidationResult } from '@/lib/setup/types';
import { isRegistryKind, ARTIFACT_FILE_LIMITS } from '@/lib/setup/types';
import { collectReferencedKeys, hasNestedIfBlock } from '@/lib/setup/tokens';
import {
  CLAUDE_APP_INSTRUCTION_MAX_CHARS,
  CLAUDE_APP_MAX_FILES,
  CLAUDE_APP_MAX_FILE_BYTES,
  CHATGPT_INSTRUCTION_MAX_CHARS,
  CHATGPT_MAX_FILES,
  CHATGPT_MAX_FILE_BYTES,
  CLAUDE_CODE_INSTRUCTION_MAX_CHARS,
  CLAUDE_CODE_MAX_FILES,
  CLAUDE_CODE_MAX_FILE_BYTES,
} from '@/lib/setup/limits';

// ─── Constants ───────────────────────────────────────────────────────────────

const VALID_CATEGORIES: ReadonlyArray<Category> = [
  'content',
  'marketing',
  'engineering',
  'design',
  'product',
  'sales',
  'customer-support',
  'finance',
  'legal',
  'hr',
  'operations',
  'research',
  'education',
  'writing',
  'data',
  'devops',
  'general',
];

/**
 * Slugs that are reserved for app routes and cannot be used by authored setups.
 * Includes obvious auth/admin paths plus the top-level route roots in the app.
 */
export const RESERVED_SLUGS: string[] = [
  'api',
  'admin',
  'settings',
  'login',
  'signup',
  'start',
  'catalog',
  'setup',
  'export',
];

/** Slug must be all lowercase letters, digits, and internal hyphens (no leading/trailing hyphens). */
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Maximum length for a sanitized tag string. */
const TAG_MAX_LENGTH = 50;

/** Maximum number of tags per setup (anti-gaming cap for community submissions). */
const TAG_MAX_COUNT = 10;

// ─── sanitizeTag ─────────────────────────────────────────────────────────────

/**
 * Returns a clean tag string: HTML tags stripped, whitespace trimmed, length capped.
 *
 * Two-pass strip:
 *  1. Remove complete `<...>` tags (handles well-formed tags).
 *  2. Remove any remaining stray `<` or `>` characters so unclosed/malformed
 *     tags (e.g. `<script`, bare `<`, or `<scr<script>ipt>` residue) cannot survive.
 */
export function sanitizeTag(tag: string): string {
  const noTags = tag.replace(/<[^>]*>/g, '');   // strip complete <…> sequences
  const noStray = noTags.replace(/[<>]/g, '');  // remove leftover < or >
  const trimmed = noStray.trim();
  return trimmed.slice(0, TAG_MAX_LENGTH);
}

// ─── Shared checks (both setup and registry kinds) ───────────────────────────

function validateCommonFields(
  setup: Setup,
  errors: Array<{ code: string; message: string; path: string }>,
  _warnings: Array<{ code: string; message: string; path: string }>,
): void {
  // ── Required non-empty string fields ────────────────────────────────────────
  const requiredStringFields = [
    'id',
    'slug',
    'name',
    'tagline',
    'description',
    'role',
    'version',
    'createdAt',
    'updatedAt',
  ] as const satisfies ReadonlyArray<keyof Setup>;

  for (const field of requiredStringFields) {
    const val = setup[field];
    if (typeof val !== 'string' || val.trim() === '') {
      errors.push({
        code: 'MISSING_REQUIRED_FIELD',
        message: `"${field}" is required and must be a non-empty string.`,
        path: field,
      });
    }
  }

  // ── Category ────────────────────────────────────────────────────────────────
  if (!(VALID_CATEGORIES as readonly string[]).includes(setup.category)) {
    errors.push({
      code: 'INVALID_CATEGORY',
      message: `"${setup.category}" is not a valid category.`,
      path: 'category',
    });
  }

  // ── Slug ────────────────────────────────────────────────────────────────────
  if (setup.slug && !SLUG_PATTERN.test(setup.slug)) {
    errors.push({
      code: 'INVALID_SLUG_PATTERN',
      message: `Slug "${setup.slug}" must use only lowercase letters, digits, and internal hyphens.`,
      path: 'slug',
    });
  }
  if (RESERVED_SLUGS.includes(setup.slug)) {
    errors.push({
      code: 'RESERVED_SLUG',
      message: `Slug "${setup.slug}" is reserved and cannot be used.`,
      path: 'slug',
    });
  }

  // ── Tags ────────────────────────────────────────────────────────────────────
  if (setup.tags.length > TAG_MAX_COUNT) {
    errors.push({
      code: 'TOO_MANY_TAGS',
      message: `${setup.tags.length} tags exceed the maximum of ${TAG_MAX_COUNT}.`,
      path: 'tags',
    });
  }
}

// ─── Setup-kind-specific validation ──────────────────────────────────────────

/** File extension check: returns true if the name ends with a known allowed extension. */
function hasAllowedExtension(name: string): boolean {
  const lower = name.toLowerCase();
  return (ARTIFACT_FILE_LIMITS.allowedExtensions as ReadonlyArray<string>).some((ext) =>
    lower.endsWith(ext),
  );
}

function validateSetupKind(
  setup: Setup,
  errors: Array<{ code: string; message: string; path: string }>,
  warnings: Array<{ code: string; message: string; path: string }>,
): void {
  // ── KIND_FIELD_MISMATCH: setup must not carry registry-only content ──────────
  const hasArtifactFiles = setup.artifactFiles.length > 0;
  const hasCapabilities = setup.capabilities.length > 0;
  const hasRepoUrl = setup.repoUrl !== null;
  if (hasArtifactFiles || hasCapabilities || hasRepoUrl) {
    errors.push({
      code: 'KIND_FIELD_MISMATCH',
      message:
        'A setup (kind=\'setup\') must not carry registry-only fields: artifactFiles, capabilities, or repoUrl.',
      path: 'kind',
    });
  }

  // ── instructionTemplate ─────────────────────────────────────────────────────
  if (
    typeof setup.instructionTemplate !== 'string' ||
    setup.instructionTemplate.trim() === ''
  ) {
    errors.push({
      code: 'EMPTY_INSTRUCTION_TEMPLATE',
      message: 'instructionTemplate must be a non-empty string.',
      path: 'instructionTemplate',
    });
  } else {
    // Nested {{#if}} blocks render incorrectly (the lazy block regex closes the
    // outer block at the first {{/if}}), so they are rejected outright.
    if (hasNestedIfBlock(setup.instructionTemplate)) {
      errors.push({
        code: 'NESTED_IF_BLOCK',
        message:
          'instructionTemplate contains a {{#if}} block nested inside another. Nested conditionals are not supported.',
        path: 'instructionTemplate',
      });
    }

    const referencedKeys = new Set(collectReferencedKeys(setup.instructionTemplate));
    const declaredKeys = new Set(setup.variables.map((v) => v.key));

    // Token in template that has no matching declared variable → error
    for (const key of referencedKeys) {
      if (!declaredKeys.has(key)) {
        errors.push({
          code: 'UNDEFINED_VARIABLE_REFERENCE',
          message: `Template references "{{${key}}}" but no variable with that key is declared.`,
          path: 'instructionTemplate',
        });
      }
    }

    // Declared variable never used in the template → warning
    for (const key of declaredKeys) {
      if (!referencedKeys.has(key)) {
        warnings.push({
          code: 'ORPHAN_VARIABLE',
          message: `Variable "${key}" is declared but never referenced in instructionTemplate.`,
          path: `variables.${key}`,
        });
      }
    }
  }

  // ── select / multiselect must have options ──────────────────────────────────
  for (let i = 0; i < setup.variables.length; i++) {
    const variable = setup.variables[i];
    if (variable.type === 'select' || variable.type === 'multiselect') {
      if (!variable.options || variable.options.length === 0) {
        errors.push({
          code: 'MISSING_SELECT_OPTIONS',
          message: `Variable "${variable.key}" has type "${variable.type}" but declares no options.`,
          path: `variables[${i}].options`,
        });
      }
    }
  }

  // ── Knowledge files ─────────────────────────────────────────────────────────
  for (let i = 0; i < setup.knowledgeFiles.length; i++) {
    const file = setup.knowledgeFiles[i];
    if (file.kind === 'starter') {
      if (typeof file.content !== 'string' || file.content.trim() === '') {
        errors.push({
          code: 'MISSING_STARTER_CONTENT',
          message: `Knowledge file "${file.name}" (kind: starter) must have non-empty content.`,
          path: `knowledgeFiles[${i}].content`,
        });
      }
    } else if (file.kind === 'user-provided') {
      if (typeof file.guidance !== 'string' || file.guidance.trim() === '') {
        errors.push({
          code: 'MISSING_USER_PROVIDED_GUIDANCE',
          message: `Knowledge file "${file.name}" (kind: user-provided) must have non-empty guidance.`,
          path: `knowledgeFiles[${i}].guidance`,
        });
      }
    }
  }
}

// ─── Registry-kind-specific validation ───────────────────────────────────────

function validateRegistryKind(
  setup: Setup,
  errors: Array<{ code: string; message: string; path: string }>,
): void {
  // ── KIND_FIELD_MISMATCH: registry must not carry setup-only content ──────────
  const hasTemplate = typeof setup.instructionTemplate === 'string' && setup.instructionTemplate.trim() !== '';
  const hasVariables = setup.variables.length > 0;
  const hasScenarios = setup.scenarios.length > 0;
  const hasTargets = setup.targets.length > 0;
  if (hasTemplate || hasVariables || hasScenarios || hasTargets) {
    errors.push({
      code: 'KIND_FIELD_MISMATCH',
      message:
        `A registry item (kind='${setup.kind}') must not carry setup-only fields: ` +
        'instructionTemplate, variables, scenarios, or targets.',
      path: 'kind',
    });
  }

  // ── Artifact files ───────────────────────────────────────────────────────────
  const files = setup.artifactFiles;

  // (a) At least one artifact file required
  if (files.length === 0) {
    errors.push({
      code: 'ARTIFACT_FILES_REQUIRED',
      message: `Registry item (kind='${setup.kind}') must include at least one artifact file.`,
      path: 'artifactFiles',
    });
    // Skip remaining artifact-file checks — nothing to validate.
    return;
  }

  // (b) File count limit
  if (files.length > ARTIFACT_FILE_LIMITS.maxFiles) {
    errors.push({
      code: 'TOO_MANY_ARTIFACT_FILES',
      message: `${files.length} artifact files exceed the maximum of ${ARTIFACT_FILE_LIMITS.maxFiles}.`,
      path: 'artifactFiles',
    });
  }

  // Per-file checks
  let primaryCount = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // (e) Name: no path separators, max 100 chars
    if (file.name.includes('/') || file.name.includes('\\') || file.name.length > 100) {
      errors.push({
        code: 'ARTIFACT_FILE_BAD_NAME',
        message:
          `Artifact file "${file.name}" has an invalid name: must not contain path separators and must be ≤ 100 characters.`,
        path: `artifactFiles[${i}].name`,
      });
    }

    // (d) Allowed extension
    if (!hasAllowedExtension(file.name)) {
      errors.push({
        code: 'ARTIFACT_FILE_BAD_TYPE',
        message:
          `Artifact file "${file.name}" has a disallowed extension. Allowed: ${ARTIFACT_FILE_LIMITS.allowedExtensions.join(', ')}.`,
        path: `artifactFiles[${i}].name`,
      });
    }

    // (c) File content size
    const byteLength =
      typeof Buffer !== 'undefined'
        ? Buffer.byteLength(file.content, 'utf8')
        : new TextEncoder().encode(file.content).length;
    if (byteLength > ARTIFACT_FILE_LIMITS.maxBytesPerFile) {
      errors.push({
        code: 'ARTIFACT_FILE_TOO_LARGE',
        message: `Artifact file "${file.name}" is ${byteLength} bytes, exceeding the limit of ${ARTIFACT_FILE_LIMITS.maxBytesPerFile} bytes.`,
        path: `artifactFiles[${i}].content`,
      });
    }

    if (file.isPrimary) primaryCount++;
  }

  // (f) Exactly one primary file
  if (primaryCount !== 1) {
    errors.push({
      code: 'PRIMARY_FILE_REQUIRED',
      message: `Exactly one artifact file must be marked isPrimary=true; found ${primaryCount}.`,
      path: 'artifactFiles',
    });
  }

  // ── repoUrl ──────────────────────────────────────────────────────────────────
  // (g) If present (non-null), must start with the GitHub HTTPS prefix.
  if (setup.repoUrl !== null && !setup.repoUrl.startsWith('https://github.com/')) {
    errors.push({
      code: 'REPO_URL_INVALID',
      message: `repoUrl must be a GitHub HTTPS URL (starting with "https://github.com/") or null. Got: "${setup.repoUrl}".`,
      path: 'repoUrl',
    });
  }

  // ── Capabilities ─────────────────────────────────────────────────────────────
  // (h) Each capability must have a non-empty command and description.
  for (let i = 0; i < setup.capabilities.length; i++) {
    const cap = setup.capabilities[i];
    if (!cap.command || cap.command.trim() === '' || !cap.description || cap.description.trim() === '') {
      errors.push({
        code: 'CAPABILITY_INVALID',
        message: `Capability at index ${i} must have a non-empty command and description.`,
        path: `capabilities[${i}]`,
      });
    }
  }
}

// ─── validateSetup ────────────────────────────────────────────────────────────

export function validateSetup(setup: Setup): ValidationResult {
  const errors: Array<{ code: string; message: string; path: string }> = [];
  const warnings: Array<{ code: string; message: string; path: string }> = [];

  // Common checks apply regardless of kind.
  validateCommonFields(setup, errors, warnings);

  if (isRegistryKind(setup.kind)) {
    validateRegistryKind(setup, errors);
  } else {
    // kind === 'setup'
    validateSetupKind(setup, errors, warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ─── validateCompiledForTarget ────────────────────────────────────────────────

/**
 * Validates a CompiledSetup against the hard limits of the given export target.
 *
 * Supports 'claude-app', 'chatgpt', and 'claude-code'. Each target branch
 * checks the same three kinds of violation:
 *
 *   INSTRUCTION_TOO_LONG — instruction.length > the target's max chars
 *   TOO_MANY_FILES       — knowledgeFiles.length > the target's max file count
 *   FILE_TOO_LARGE       — any file's UTF-8 byte length > the target's per-file limit
 */
export function validateCompiledForTarget(
  compiled: CompiledSetup,
  target: ExportTarget
): ValidationResult {
  const errors: Array<{ code: string; message: string; path: string }> = [];
  const warnings: Array<{ code: string; message: string; path: string }> = [];

  if (target === 'claude-app') {
    // Instruction character limit
    if (compiled.instruction.length > CLAUDE_APP_INSTRUCTION_MAX_CHARS) {
      const excessChars = compiled.instruction.length - CLAUDE_APP_INSTRUCTION_MAX_CHARS;
      errors.push({
        code: 'INSTRUCTION_TOO_LONG',
        message: `Your instructions are ${excessChars} character${excessChars === 1 ? '' : 's'} over the ${CLAUDE_APP_INSTRUCTION_MAX_CHARS}-character limit for Claude Projects.`,
        path: 'instruction',
      });
    }

    // Knowledge-file count limit
    if (compiled.knowledgeFiles.length > CLAUDE_APP_MAX_FILES) {
      const excessFiles = compiled.knowledgeFiles.length - CLAUDE_APP_MAX_FILES;
      errors.push({
        code: 'TOO_MANY_FILES',
        message: `You have ${excessFiles} knowledge file${excessFiles === 1 ? '' : 's'} over the limit of ${CLAUDE_APP_MAX_FILES} for Claude Projects.`,
        path: 'knowledgeFiles',
      });
    }

    // Per-file byte-size limit (UTF-8 byte length, not character count)
    for (let i = 0; i < compiled.knowledgeFiles.length; i++) {
      const file = compiled.knowledgeFiles[i];
      // Use Buffer in Node.js environments; fall back to TextEncoder in the browser.
      const byteLength =
        typeof Buffer !== 'undefined'
          ? Buffer.byteLength(file.content, 'utf8')
          : new TextEncoder().encode(file.content).length;
      if (byteLength > CLAUDE_APP_MAX_FILE_BYTES) {
        const excessBytes = byteLength - CLAUDE_APP_MAX_FILE_BYTES;
        errors.push({
          code: 'FILE_TOO_LARGE',
          message: `Knowledge file "${file.name}" is ${excessBytes} byte${excessBytes === 1 ? '' : 's'} over the ${CLAUDE_APP_MAX_FILE_BYTES}-byte limit for Claude Projects.`,
          path: `knowledgeFiles[${i}].content`,
        });
      }
    }
  } else if (target === 'chatgpt') {
    // Instruction character limit (Custom GPT Instructions field).
    if (compiled.instruction.length > CHATGPT_INSTRUCTION_MAX_CHARS) {
      const excessChars = compiled.instruction.length - CHATGPT_INSTRUCTION_MAX_CHARS;
      errors.push({
        code: 'INSTRUCTION_TOO_LONG',
        message: `Your instructions are ${excessChars} character${excessChars === 1 ? '' : 's'} over the ${CHATGPT_INSTRUCTION_MAX_CHARS}-character limit for a Custom GPT.`,
        path: 'instruction',
      });
    }

    // Knowledge-file count limit.
    if (compiled.knowledgeFiles.length > CHATGPT_MAX_FILES) {
      const excessFiles = compiled.knowledgeFiles.length - CHATGPT_MAX_FILES;
      errors.push({
        code: 'TOO_MANY_FILES',
        message: `You have ${excessFiles} knowledge file${excessFiles === 1 ? '' : 's'} over the limit of ${CHATGPT_MAX_FILES} for a Custom GPT.`,
        path: 'knowledgeFiles',
      });
    }

    // Per-file byte-size limit (UTF-8 byte length, not character count).
    for (let i = 0; i < compiled.knowledgeFiles.length; i++) {
      const file = compiled.knowledgeFiles[i];
      const byteLength =
        typeof Buffer !== 'undefined'
          ? Buffer.byteLength(file.content, 'utf8')
          : new TextEncoder().encode(file.content).length;
      if (byteLength > CHATGPT_MAX_FILE_BYTES) {
        const excessBytes = byteLength - CHATGPT_MAX_FILE_BYTES;
        errors.push({
          code: 'FILE_TOO_LARGE',
          message: `Knowledge file "${file.name}" is ${excessBytes} byte${excessBytes === 1 ? '' : 's'} over the ${CHATGPT_MAX_FILE_BYTES}-byte limit for a Custom GPT.`,
          path: `knowledgeFiles[${i}].content`,
        });
      }
    }
  } else if (target === 'claude-code') {
    // Instruction character limit (Claude Code project memory file / CLAUDE.md).
    if (compiled.instruction.length > CLAUDE_CODE_INSTRUCTION_MAX_CHARS) {
      const excessChars = compiled.instruction.length - CLAUDE_CODE_INSTRUCTION_MAX_CHARS;
      errors.push({
        code: 'INSTRUCTION_TOO_LONG',
        message: `Your instructions are ${excessChars} character${excessChars === 1 ? '' : 's'} over the ${CLAUDE_CODE_INSTRUCTION_MAX_CHARS}-character limit for a Claude Code memory file.`,
        path: 'instruction',
      });
    }

    // Knowledge-file count limit.
    if (compiled.knowledgeFiles.length > CLAUDE_CODE_MAX_FILES) {
      const excessFiles = compiled.knowledgeFiles.length - CLAUDE_CODE_MAX_FILES;
      errors.push({
        code: 'TOO_MANY_FILES',
        message: `You have ${excessFiles} knowledge file${excessFiles === 1 ? '' : 's'} over the limit of ${CLAUDE_CODE_MAX_FILES} for a Claude Code project.`,
        path: 'knowledgeFiles',
      });
    }

    // Per-file byte-size limit (UTF-8 byte length, not character count).
    for (let i = 0; i < compiled.knowledgeFiles.length; i++) {
      const file = compiled.knowledgeFiles[i];
      const byteLength =
        typeof Buffer !== 'undefined'
          ? Buffer.byteLength(file.content, 'utf8')
          : new TextEncoder().encode(file.content).length;
      if (byteLength > CLAUDE_CODE_MAX_FILE_BYTES) {
        const excessBytes = byteLength - CLAUDE_CODE_MAX_FILE_BYTES;
        errors.push({
          code: 'FILE_TOO_LARGE',
          message: `Knowledge file "${file.name}" is ${excessBytes} byte${excessBytes === 1 ? '' : 's'} over the ${CLAUDE_CODE_MAX_FILE_BYTES}-byte limit for a Claude Code project.`,
          path: `knowledgeFiles[${i}].content`,
        });
      }
    }
  } else {
    // Exhaustiveness guard: if a new ExportTarget member is ever added without a
    // corresponding branch here, TypeScript will fail to compile this assignment
    // (target will no longer narrow to never).
    const _exhaustive: never = target;
    throw new Error(`validateCompiledForTarget: unhandled export target "${_exhaustive}"`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
