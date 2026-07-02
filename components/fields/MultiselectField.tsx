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

  function toggle(opt: string) {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  }

  return (
    <fieldset
      style={{
        border: showError ? '1px solid #c00' : '1px solid #ccc',
        borderRadius: '6px',
        padding: '0.5rem 0.75rem',
      }}
    >
      <legend style={{ fontWeight: 500, fontSize: '0.9rem', padding: '0 0.25rem' }}>
        {variable.label}
        {variable.required && <span aria-hidden="true" style={{ color: '#c00', marginLeft: '0.2rem' }}>*</span>}
      </legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {(variable.options ?? []).map((opt) => {
          const id = `${groupId}-${opt}`;
          return (
            <label key={opt} htmlFor={id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                id={id}
                type="checkbox"
                checked={value.includes(opt)}
                onChange={() => toggle(opt)}
              />
              {opt}
            </label>
          );
        })}
      </div>
      {variable.helpText && (
        <span style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>{variable.helpText}</span>
      )}
      {showError && (
        <span role="alert" style={{ color: '#c00', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
          Please select at least one option.
        </span>
      )}
    </fieldset>
  );
}
