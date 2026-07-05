import type { SetupKind } from '@/lib/setup/types';
import { isRegistryKind } from '@/lib/setup/types';

interface KindBadgeProps {
  kind: SetupKind;
}

/**
 * Small labelled pill for a registry item's kind, following the existing
 * `.badge` visual pattern from SetupCard. Renders nothing for kind='setup'
 * (a plain setup carries a source badge, never a kind badge).
 *
 * Tints are applied inline (on top of the global `.badge` base) so the
 * component is self-contained. Colour/background pairs meet WCAG AA on their
 * tint (mirrors the mock's kind badges and the app's badge-ai guidance).
 */
const KIND_LABEL: Record<'agent' | 'skill' | 'harness', string> = {
  agent: 'Agent',
  skill: 'Skill',
  harness: 'Harness',
};

const KIND_TINT: Record<'agent' | 'skill' | 'harness', { background: string; color: string }> = {
  agent: { background: 'var(--sky)', color: '#1c4a6b' },
  skill: { background: 'var(--mint)', color: '#1c6650' },
  harness: { background: 'var(--butter)', color: '#7a5414' },
};

export default function KindBadge({ kind }: KindBadgeProps) {
  if (!isRegistryKind(kind)) return null;

  return (
    <span
      className="badge"
      data-testid={`kind-badge-${kind}`}
      style={KIND_TINT[kind]}
    >
      {KIND_LABEL[kind]}
    </span>
  );
}
