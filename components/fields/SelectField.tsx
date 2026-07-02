'use client';

import type { Variable } from '@/lib/setup/types';

interface Props {
  variable: Variable;
  value: string;
  onChange: (value: string) => void;
  showError: boolean;
}

export default function SelectField({ variable, value, onChange, showError }: Props) {
  const id = `field-${variable.key}`;
  const errorId = `${id}-error`;
  const helpId = variable.helpText ? `${id}-help` : undefined;
  const describedBy =
    [helpId, showError ? errorId : undefined].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${showError ? ' invalid' : ''}`}>
      <label htmlFor={id}>{variable.label}</label>
      {variable.required && <span className="req" aria-hidden="true">*</span>}
      {variable.helpText && <p id={helpId} className="help">{variable.helpText}</p>}
      <select
        id={id}
        className="select-el"
        value={value}
        required={variable.required}
        aria-required={variable.required}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
      >
        {!value && <option value="">Select one…</option>}
        {(variable.options ?? []).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {showError && (
        <span id={errorId} role="alert" className="error-msg">
          This field is required.
        </span>
      )}
    </div>
  );
}
