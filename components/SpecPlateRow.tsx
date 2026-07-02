import type { Setup } from '@/lib/setup/types';

interface Props {
  setup: Setup;
}

export default function SpecPlateRow({ setup }: Props) {
  const worksWith = setup.targets.includes('claude-app')
    ? 'Claude Projects · ChatGPT soon'
    : 'ChatGPT soon';

  const kfCount = setup.knowledgeFiles.length;
  const generates =
    kfCount === 0
      ? 'Custom instructions'
      : `Custom instructions + ${kfCount} knowledge file${kfCount === 1 ? '' : 's'}`;

  const bestFor = setup.tags.slice(0, 3).join(' · ');

  const plates = [
    { label: 'Built for', value: setup.role },
    { label: 'Works with', value: worksWith },
    { label: 'Generates', value: generates },
    { label: 'Time to set up', value: 'About 5 minutes' },
    { label: 'Best for', value: bestFor },
  ] as const;

  return (
    <div className="spec-row" role="list" aria-label="Setup specifications">
      {plates.map(({ label, value }) => (
        <div key={label} className="spec-card" role="listitem">
          <span className="spec-label">{label}</span>
          <span className="spec-value">{value}</span>
        </div>
      ))}
    </div>
  );
}
