/**
 * Account-stored user files (Phase 4 Task 5) — the Section 2 deferral.
 *
 * A signed-in user may OPT IN to persist a `user-provided` knowledge file to
 * their account. The default stays browser-only: nothing uploads without the
 * explicit per-file action. Bytes live in a private Supabase Storage bucket under
 * a per-user path; the `stored_files` table indexes them. Both are owner-scoped
 * by RLS.
 *
 * Two pure helpers carry the load-bearing rules and are unit-tested directly:
 *   - storagePathFor(): the per-user object path (also the RLS ownership key).
 *   - resolveExportContent(): fresh in-browser content always wins; a stored copy
 *     is the fallback, tagged so export can show a "using your saved file" note.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

// ─── Domain + row types ───────────────────────────────────────────────────────

export interface StoredFileMeta {
  id: string;
  knowledgeFileName: string;
  storagePath: string;
  sizeBytes: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoredFileRow {
  id: string;
  knowledge_file_name: string;
  storage_path: string;
  size_bytes: number | null;
  created_at: string;
  updated_at: string;
}

/** The default private bucket for account-stored user files. */
export const STORED_FILES_BUCKET = 'user-files';

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/**
 * Sanitizes a knowledge-file name into a safe object key segment: keeps
 * word chars, dot, dash; collapses everything else (incl. path separators and
 * `..`) to underscores. Prevents any path traversal out of the user's folder.
 */
export function sanitizeFileName(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/\.{2,}/g, '_');
  return cleaned.replace(/^_+|_+$/g, '') || 'file';
}

/** Per-user object path: `${userId}/${safeName}`. The first segment is the RLS key. */
export function storagePathFor(userId: string, knowledgeFileName: string): string {
  return `${userId}/${sanitizeFileName(knowledgeFileName)}`;
}

export function rowToStoredFile(row: StoredFileRow): StoredFileMeta {
  return {
    id: row.id,
    knowledgeFileName: row.knowledge_file_name,
    storagePath: row.storage_path,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type ExportContentSource = 'fresh' | 'stored' | 'none';

export interface ResolvedExportContent {
  content: string;
  source: ExportContentSource;
  /** ISO timestamp of the stored copy, present only when source is 'stored'. */
  savedAt?: string;
}

/**
 * Resolves the content to export for one user-provided knowledge file. Fresh
 * in-browser content (a re-attachment this session) always wins; a stored copy
 * is used only when there is no fresh content, and is tagged with its saved date
 * so export can surface the "using your saved file from <date>" note. Empty
 * strings count as absent.
 */
export function resolveExportContent(
  freshContent: string | undefined,
  storedCopy: { content: string; savedAt: string } | undefined,
): ResolvedExportContent {
  if (typeof freshContent === 'string' && freshContent.trim() !== '') {
    return { content: freshContent, source: 'fresh' };
  }
  if (storedCopy && storedCopy.content.trim() !== '') {
    return { content: storedCopy.content, source: 'stored', savedAt: storedCopy.savedAt };
  }
  return { content: '', source: 'none' };
}

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export interface SaveStoredFileInput {
  userId: string;
  knowledgeFileName: string;
  content: string;
}

export interface StoredFilesStore {
  /** Upload (or replace) a file's bytes and upsert its metadata. Returns the metadata. */
  save(input: SaveStoredFileInput): Promise<StoredFileMeta>;
  /** The current user's stored-file metadata (RLS-scoped). */
  list(): Promise<StoredFileMeta[]>;
  /** Download a stored file's text content by its storage path. */
  fetchContent(storagePath: string): Promise<string>;
  /** Delete both the storage object and the metadata row. */
  remove(file: { id: string; storagePath: string }): Promise<void>;
}

const TABLE = 'stored_files';

/**
 * Supabase-backed store. Pass the browser client for the signed-in user's opt-in
 * actions, or the request-scoped server client for reads. Storage + metadata are
 * both owner-scoped by RLS.
 */
export function createSupabaseStoredFilesStore(
  client: SupabaseClient,
  bucket: string = STORED_FILES_BUCKET,
): StoredFilesStore {
  return {
    async save(input) {
      const storagePath = storagePathFor(input.userId, input.knowledgeFileName);
      const blob = new Blob([input.content], { type: 'text/plain; charset=utf-8' });

      const up = await client.storage.from(bucket).upload(storagePath, blob, {
        upsert: true,
        contentType: 'text/plain; charset=utf-8',
      });
      if (up.error) throw new Error(`stored file upload failed: ${up.error.message}`);

      const nowIso = new Date().toISOString();
      const { data, error } = await client
        .from(TABLE)
        .upsert(
          {
            user_id: input.userId,
            knowledge_file_name: input.knowledgeFileName,
            storage_path: storagePath,
            size_bytes: byteLength(input.content),
            updated_at: nowIso,
          },
          { onConflict: 'user_id,knowledge_file_name' },
        )
        .select()
        .single();
      if (error) throw new Error(`stored file metadata upsert failed: ${error.message}`);
      return rowToStoredFile(data as StoredFileRow);
    },

    async list() {
      const { data, error } = await client
        .from(TABLE)
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw new Error(`stored files list failed: ${error.message}`);
      return (data as StoredFileRow[]).map(rowToStoredFile);
    },

    async fetchContent(storagePath) {
      const { data, error } = await client.storage.from(bucket).download(storagePath);
      if (error) throw new Error(`stored file download failed: ${error.message}`);
      return await data.text();
    },

    async remove(file) {
      const rm = await client.storage.from(bucket).remove([file.storagePath]);
      if (rm.error) throw new Error(`stored file delete failed: ${rm.error.message}`);
      const { error } = await client.from(TABLE).delete().eq('id', file.id);
      if (error) throw new Error(`stored file metadata delete failed: ${error.message}`);
    },
  };
}
