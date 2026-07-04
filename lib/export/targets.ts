import type { ExportTarget } from '@/lib/setup/types';

/**
 * Human-readable label for each export target.
 * Shared between ExportView and InstallView — single source of truth.
 */
export function targetLabel(t: ExportTarget): string {
  switch (t) {
    case 'chatgpt':    return 'ChatGPT';
    case 'claude-code': return 'Claude Code';
    case 'claude-app': return 'Claude';
  }
}
