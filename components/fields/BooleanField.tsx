'use client';

import type { Variable } from '@/lib/setup/types';

interface Props {
  variable: Variable;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function BooleanField({ variable, value, onChange }: Props) {
  const id = `field-${variable.key}`;
  const helpId = variable.helpText ? `${id}-help` : undefined;
  return (
    <div className="field">
      <label className="toggle">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={value}
          aria-describedby={helpId}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="track" aria-hidden="true" />
        <span className="t-label">{variable.label}</span>
      </label>
      {variable.helpText && <p id={helpId} className="help" style={{ marginTop: '6px' }}>{variable.helpText}</p>}
    </div>
  );
}
