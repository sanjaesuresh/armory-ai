'use client';

import type { Variable } from '@/lib/setup/types';

interface Props {
  variable: Variable;
  value: string[];
  onChange: (value: string[]) => void;
  showError: boolean;
}

export default function MultiselectField({ variable, value, onChange, showError }: Props) {
  const groupId = `field-${variable.key}`;
  const errorId = `${groupId}-error`;
  const helpId = variable.helpText ? `${groupId}-help` : undefined;
  const describedBy =
    [helpId, showError ? errorId : undefined].filter(Boolean).join(' ') || undefined;

  function toggle(opt: string) {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  }

  return (
    <fieldset className={`field${showError ? ' invalid' : ''}`} aria-describedby={describedBy}>
      <legend className="label">
        {variable.label}
        {variable.required && <span className="req" aria-hidden="true"> *</span>}
      </legend>
      {variable.helpText && <p id={helpId} className="help">{variable.helpText}</p>}
      <div className="checks">
        {(variable.options ?? []).map((opt) => {
          const id = `${groupId}-${opt}`;
          return (
            <label key={opt} className="check">
              <input
                id={id}
                type="checkbox"
                checked={value.includes(opt)}
                onChange={() => toggle(opt)}
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
      {showError && (
        <span id={errorId} role="alert" className="error-msg">
          Please select at least one option.
        </span>
      )}
    </fieldset>
  );
}
