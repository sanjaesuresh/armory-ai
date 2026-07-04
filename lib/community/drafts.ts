/**
 * Community draft/submission data access + lifecycle (Phase 5 Tasks 1 & 4).
 *
 * A community submission is a plain `setups` row with source='community' and the
 * author's uid. The builder edits drafts; submit runs the review gate. Two rules
 * are load-bearing and server-enforced here (never trusted from the client):
 *   - The author id, source, review_status, and version are set server-side. A
 *     client-supplied author/source/status is ignored.
 *   - Submit RE-VALIDATES with the shared `validateSetup` and runs the safety
 *     screen server-side; a dirty draft never becomes pending, whatever the
 *     client claims. The safety-screen result is stored with the submission and
 *     a flagged one is marked needs-attention for the moderator queue.
 *
 * Lifecycle boundary: `submitDraft` (and anything that runs the safety screen
 * or the model client) is server-only. The pure helpers (`buildDraftRow`,
 * `buildDraftUpdate`, `sanitizeDraftTags`, transition guards) and
 * `createSupabaseDraftsStore` are browser-safe — they call no model APIs and
 * carry no server-only imports.
 */

import type { Setup, ValidationResult } from '@/lib/setup/types';
import type { ModelClient } from '@/lib/testdrive/runner';
import { validateSetup, sanitizeTag } from '@/lib/setup/validator';
import { rowToSetup, type SetupRow } from '@/lib/catalog/repository';
import { runSafetyScreen, type SafetyScreenResult } from './safetyScreen';

// ─── Errors ───────────────────────────────────────────────────────────────────

/**
 * Thrown when a draft/submission row cannot be found (or the caller lacks
 * access via RLS). A distinct class lets callers distinguish "not found" from
 * unrelated DB/library errors rather than matching on a raw message string.
 */
export class DraftNotFoundError extends Error {
  override name = 'DraftNotFoundError';
  constructor(id: string) {
    super(`draft ${id} not found`);
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Max tags kept on a draft (mirrors the validator's TAG_MAX_COUNT). */
export const DRAFT_TAG_MAX = 10;

/** Starting version for a new community draft. */
export const INITIAL_VERSION = '0.1.0';

// ─── Editable fields ──────────────────────────────────────────────────────────

/** The fields the builder controls. Everything else is set server-side. */
export interface DraftInput {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  industry?: string | null;
  category: string;
  tags?: string[];
  targets?: string[];
  tier?: 'core' | 'advanced';
  instructionTemplate: string;
  variables?: unknown[];
  knowledgeFiles?: unknown[];
  scenarios?: unknown[];
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/** Sanitizes and caps draft tags: trims via sanitizeTag, drops empties, caps count. */
export function sanitizeDraftTags(tags: readonly string[] | undefined): string[] {
  return (tags ?? [])
    .map((t) => sanitizeTag(t))
    .filter((t) => t.length > 0)
    .slice(0, DRAFT_TAG_MAX);
}

/**
 * Builds the snake_case `setups` insert payload for a NEW draft. Pure: the
 * caller supplies id and now. author/source/review_status/version/upvotes are
 * fixed here — any client-supplied value for them is ignored by construction.
 */
export function buildDraftRow(params: {
  id: string;
  authorId: string;
  now: string;
  input: DraftInput;
}): Record<string, unknown> {
  const { id, authorId, now, input } = params;
  return {
    id,
    slug: input.slug,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    role: input.role,
    industry: input.industry ?? null,
    category: input.category,
    tags: sanitizeDraftTags(input.tags),
    // Server-owned fields — never from the client.
    source: 'community',
    author: authorId,
    review_status: 'draft',
    version: INITIAL_VERSION,
    upvotes: 0,
    featured: null,
    popularity: 0,
    targets: input.targets ?? ['claude-app'],
    tier: input.tier ?? 'core',
    instruction_template: input.instructionTemplate,
    variables: input.variables ?? [],
    knowledge_files: input.knowledgeFiles ?? [],
    scenarios: input.scenarios ?? [],
    safety_screen: null,
    created_at: now,
    updated_at: now,
  };
}

/** Builds the editable-field update payload for an existing draft (never touches ownership/status). */
export function buildDraftUpdate(input: Partial<DraftInput>, now: string): Record<string, unknown> {
  const patch: Record<string, unknown> = { updated_at: now };
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.name !== undefined) patch.name = input.name;
  if (input.tagline !== undefined) patch.tagline = input.tagline;
  if (input.description !== undefined) patch.description = input.description;
  if (input.role !== undefined) patch.role = input.role;
  if (input.industry !== undefined) patch.industry = input.industry;
  if (input.category !== undefined) patch.category = input.category;
  if (input.tags !== undefined) patch.tags = sanitizeDraftTags(input.tags);
  if (input.targets !== undefined) patch.targets = input.targets;
  if (input.tier !== undefined) patch.tier = input.tier;
  if (input.instructionTemplate !== undefined) patch.instruction_template = input.instructionTemplate;
  if (input.variables !== undefined) patch.variables = input.variables;
  if (input.knowledgeFiles !== undefined) patch.knowledge_files = input.knowledgeFiles;
  if (input.scenarios !== undefined) patch.scenarios = input.scenarios;
  return patch;
}

/** Content edits are allowed only while a draft is in the `draft` state. */
export function isContentEditable(reviewStatus: string): boolean {
  return reviewStatus === 'draft';
}

// ─── Store ────────────────────────────────────────────────────────────────────

export interface DraftsStore {
  insertRow(row: Record<string, unknown>): Promise<SetupRow>;
  getRow(id: string): Promise<SetupRow | null>;
  listByAuthor(): Promise<SetupRow[]>;
  updateRow(id: string, patch: Record<string, unknown>): Promise<void>;
  /**
   * Content-locked update: applies `patch` only when the row's review_status is
   * 'draft'. Throws 'draft not editable' if the row is pending/approved/rejected
   * (defense-in-depth against the two-tab race; the page-level redirect is the
   * first layer).
   */
  updateDraftFields(id: string, patch: Record<string, unknown>): Promise<void>;
}

// ─── Lifecycle transitions ────────────────────────────────────────────────────

export type SubmitResult =
  | { ok: true; screen: SafetyScreenResult }
  | { ok: false; validation: ValidationResult }
  | { ok: false; notDraft: true };

/**
 * Submit: draft → pending. Re-validates server-side (a dirty draft is refused
 * and its status is untouched), runs the safety screen, then flips to pending
 * with the screen result stored. The client cannot bypass this.
 */
export async function submitDraft(
  id: string,
  store: DraftsStore,
  modelClient: ModelClient,
  now: string,
): Promise<SubmitResult> {
  const row = await store.getRow(id);
  if (!row) throw new DraftNotFoundError(id);

  // Guard: only a row in the 'draft' state may be submitted. A pending row is
  // already in the queue; a rejected or approved row must be reopened first.
  // Checked before validateSetup/the safety screen so no model call is made.
  if (row.review_status !== 'draft') {
    return { ok: false, notDraft: true };
  }

  const setup: Setup = rowToSetup(row);
  const validation = validateSetup(setup);
  if (!validation.valid) {
    return { ok: false, validation };
  }

  const screen = await runSafetyScreen(setup, modelClient);
  await store.updateRow(id, {
    review_status: 'pending',
    safety_screen: screen,
    // Clear any stale rejection note from a previous review cycle.
    review_note: null,
    updated_at: now,
  });
  return { ok: true, screen };
}

/** Withdraw a pending submission back to draft so the author can edit it. */
export async function withdrawSubmission(id: string, store: DraftsStore, now: string): Promise<void> {
  const row = await store.getRow(id);
  if (!row) throw new DraftNotFoundError(id);
  if (row.review_status !== 'pending') {
    throw new Error(`only pending submissions can be withdrawn (was ${row.review_status})`);
  }
  await store.updateRow(id, { review_status: 'draft', updated_at: now });
}

/** Reopen a rejected submission for editing (rejected → draft). */
export async function reopenRejected(id: string, store: DraftsStore, now: string): Promise<void> {
  const row = await store.getRow(id);
  if (!row) throw new DraftNotFoundError(id);
  if (row.review_status !== 'rejected') {
    throw new Error(`only rejected submissions can be reopened (was ${row.review_status})`);
  }
  await store.updateRow(id, { review_status: 'draft', review_note: null, updated_at: now });
}

// ─── Supabase-backed store ────────────────────────────────────────────────────

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Author-scoped store bound to the author's session client (RLS enforces that
 * they touch only their own non-approved rows). Use the request-scoped server
 * client or the browser client.
 */
export function createSupabaseDraftsStore(client: SupabaseClient): DraftsStore {
  return {
    async insertRow(row) {
      const { data, error } = await client.from('setups').insert(row).select().single();
      if (error) throw new Error(`draft insert failed: ${error.message}`);
      return data as SetupRow;
    },
    async getRow(id) {
      const { data, error } = await client.from('setups').select('*').eq('id', id).maybeSingle();
      if (error) throw new Error(`draft load failed: ${error.message}`);
      return (data as SetupRow) ?? null;
    },
    async listByAuthor() {
      const { data, error } = await client
        .from('setups')
        .select('*')
        .eq('source', 'community')
        .order('updated_at', { ascending: false });
      if (error) throw new Error(`draft list failed: ${error.message}`);
      return data as SetupRow[];
    },
    async updateRow(id, patch) {
      // Pass count:'exact' to update() — the only correct way to get a row count
      // from a PATCH in Supabase JS v2. The select() overload after update() only
      // accepts a single columns argument and cannot carry count options.
      const { error, count } = await client
        .from('setups')
        .update(patch, { count: 'exact' })
        .eq('id', id);
      if (error) throw new Error(`draft update failed: ${error.message}`);
      if (!count) throw new Error('draft update matched no rows');
    },
    async updateDraftFields(id, patch) {
      // Scoped to review_status='draft' — no content write goes through when the
      // row is pending/approved/rejected (defense-in-depth; the page-level
      // redirect in /build/[id] is the first layer).
      const { error, count } = await client
        .from('setups')
        .update(patch, { count: 'exact' })
        .eq('id', id)
        .eq('review_status', 'draft');
      if (error) throw new Error(`draft update failed: ${error.message}`);
      if (!count) throw new Error('draft not editable');
    },
  };
}
