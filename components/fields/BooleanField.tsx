'use client';

import type { Variable } from '@/lib/setup/types';

interface Props {
  variable: Variable;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function BooleanField({ variable, value, onChange }: Props) {
  const id = `field-${variable.key}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <label
        htmlFor={id}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
      >
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: '1rem', height: '1rem' }}
        />
        {variable.label}
      </label>
      {variable.helpText && (
        <span style={{ color: '#666', fontSize: '0.8rem', marginLeft: '1.5rem' }}>{variable.helpText}</span>
      )}
    </div>
  );
}
