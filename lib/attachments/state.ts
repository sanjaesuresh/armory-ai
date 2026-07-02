/**
 * Browser-only attachment state helpers.
 * Pure functions — no React, no side effects.
 * Attachments are held in memory only; nothing is uploaded or persisted.
 */

import type { KnowledgeFile } from '@/lib/setup/types';

/** Map from knowledge-file name to the user-attached text content. */
export type AttachmentsMap = Record<string, string>;

/** Return a new map with the given file's content set. */
export function setAttachment(map: AttachmentsMap, name: string, content: string): AttachmentsMap {
  return { ...map, [name]: content };
}

/** Return a new map with the given file removed. */
export function removeAttachment(map: AttachmentsMap, name: string): AttachmentsMap {
  const next = { ...map };
  delete next[name];
  return next;
}

/**
 * Return the names of user-provided knowledge files that are required
 * but have no non-empty content in the attachments map.
 */
export function missingRequiredAttachments(
  knowledgeFiles: KnowledgeFile[],
  map: AttachmentsMap
): string[] {
  return knowledgeFiles
    .filter(
      (f) => f.kind === 'user-provided' && f.required && !map[f.name]
    )
    .map((f) => f.name);
}
