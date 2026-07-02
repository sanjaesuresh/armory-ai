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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <label htmlFor={id} style={{ fontWeight: 500, fontSize: '0.9rem' }}>
          {variable.label}
        </label>
        {variable.required && (
          <span aria-hidden="true" style={{ color: '#c00', fontSize: '0.85rem' }}>*</span>
        )}
      </div>
      <input
        id={id}
        type="number"
        value={value === '' ? '' : value}
        required={variable.required}
        aria-required={variable.required}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === '' ? '' : Number(raw));
        }}
        style={{
          padding: '0.5rem 0.625rem',
          border: showError ? '1px solid #c00' : '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontFamily: 'inherit',
          width: '8rem',
        }}
      />
      {variable.helpText && (
        <span style={{ color: '#666', fontSize: '0.8rem' }}>{variable.helpText}</span>
      )}
      {showError && (
        <span role="alert" style={{ color: '#c00', fontSize: '0.8rem' }}>
          This field is required.
        </span>
      )}
    </div>
  );
}
