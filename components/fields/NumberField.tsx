'use client';

import type { Variable } from '@/lib/setup/types';

interface Props {
  variable: Variable;
  value: number | '';
  onChange: (value: number | '') => void;
  showError: boolean;
}

export default function NumberField({ variable, value, onChange, showError }: Props) {
  const id = `field-${variable.key}`;
  const errorId = `${id}-error`;
  const helpId = variable.helpText ? `${id}-help` : undefined;
  const describedBy =
    [helpId, showError ? errorId : undefined].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${showError ? ' invalid' : ''}`}>
      {/* Label and required indicator must be separate so label text = variable.label exactly */}
      <label htmlFor={id}>{variable.label}</label>
      {variable.required && <span className="req" aria-hidden="true">*</span>}
      {variable.helpText && <p id={helpId} className="help">{variable.helpText}</p>}
      <input
        id={id}
        className="input"
        type="number"
        value={value === '' ? '' : value}
        required={variable.required}
        aria-required={variable.required}
        aria-describedby={describedBy}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === '' ? '' : Number(raw));
        }}
        style={{ width: '8rem' }}
      />
      {showError && (
        <span id={errorId} role="alert" className="error-msg">
          This field is required.
        </span>
      )}
    </div>
  );
}
