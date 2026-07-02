'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Variable, Answers } from '@/lib/setup/types';
import TextField from './fields/TextField';
import MultilineField from './fields/MultilineField';
import SelectField from './fields/SelectField';
import MultiselectField from './fields/MultiselectField';
import NumberField from './fields/NumberField';
import BooleanField from './fields/BooleanField';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Validity {
  complete: boolean;
}

interface Props {
  slug: string;
  variables: Variable[];
  onAnswersChange: (answers: Answers, validity: Validity) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildDefaults(variables: Variable[]): Answers {
  const defaults: Answers = {};
  for (const v of variables) {
    if (v.default !== undefined) {
      defaults[v.key] = v.default;
    } else {
      switch (v.type) {
        case 'text':
        case 'multiline':
        case 'select':
          defaults[v.key] = '';
          break;
        case 'multiselect':
          defaults[v.key] = [];
          break;
        case 'number':
          defaults[v.key] = '';
          break;
        case 'boolean':
          defaults[v.key] = false;
          break;
      }
    }
  }
  return defaults;
}

function isAnswerEmpty(value: string | number | boolean | string[] | undefined): boolean {
  if (value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'number') return false; // 0 is valid
  if (typeof value === 'boolean') return false; // false is valid
  return true;
}

function computeComplete(variables: Variable[], answers: Answers): boolean {
  return variables
    .filter((v) => v.required)
    .every((v) => !isAnswerEmpty(answers[v.key]));
}

function storageKey(slug: string) {
  return `armory:answers:${slug}`;
}

function saveToStorage(slug: string, answers: Answers) {
  try {
    sessionStorage.setItem(storageKey(slug), JSON.stringify(answers));
  } catch {
    // Silently ignore (e.g. private browsing quota exceeded)
  }
}

function loadFromStorage(slug: string): Answers | null {
  try {
    const raw = sessionStorage.getItem(storageKey(slug));
    return raw ? (JSON.parse(raw) as Answers) : null;
  } catch {
    return null;
  }
}

// ─── Group utilities ─────────────────────────────────────────────────────────

interface VariableGroup {
  name: string | null;
  variables: Variable[];
}

function groupVariables(variables: Variable[]): VariableGroup[] {
  const ungrouped: Variable[] = [];
  const grouped = new Map<string, Variable[]>();
  const order: string[] = [];

  for (const v of variables) {
    if (!v.group) {
      ungrouped.push(v);
    } else {
      if (!grouped.has(v.group)) {
        grouped.set(v.group, []);
        order.push(v.group);
      }
      grouped.get(v.group)!.push(v);
    }
  }

  const result: VariableGroup[] = [];
  if (ungrouped.length > 0) {
    result.push({ name: null, variables: ungrouped });
  }
  for (const name of order) {
    result.push({ name, variables: grouped.get(name)! });
  }
  return result;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SetupForm({ slug, variables, onAnswersChange }: Props) {
  const [answers, setAnswers] = useState<Answers>(() => {
    const stored = loadFromStorage(slug);
    if (stored) return stored;
    return buildDefaults(variables);
  });

  // Track which fields have been blurred (to show errors only after interaction)
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Emit initial state on mount
  useEffect(() => {
    onAnswersChange(answers, { complete: computeComplete(variables, answers) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback(
    (key: string, value: string | number | boolean | string[]) => {
      setAnswers((prev) => {
        const next = { ...prev, [key]: value };
        saveToStorage(slug, next);
        onAnswersChange(next, { complete: computeComplete(variables, next) });
        return next;
      });
    },
    [slug, variables, onAnswersChange],
  );

  const markTouched = useCallback((key: string) => {
    setTouched((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  const groups = groupVariables(variables);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'system-ui, sans-serif' }}
    >
      {groups.map((group) => (
        <div key={group.name ?? '__ungrouped__'}>
          {group.name && (
            <h3
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#555',
                marginBottom: '0.75rem',
                marginTop: '0.5rem',
              }}
            >
              {group.name}
            </h3>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {group.variables.map((v) => {
              const showError =
                v.required &&
                touched.has(v.key) &&
                isAnswerEmpty(answers[v.key]);

              switch (v.type) {
                case 'text':
                  return (
                    <div key={v.key} onBlur={() => markTouched(v.key)}>
                      <TextField
                        variable={v}
                        value={(answers[v.key] as string) ?? ''}
                        onChange={(val) => update(v.key, val)}
                        showError={showError}
                      />
                    </div>
                  );
                case 'multiline':
                  return (
                    <div key={v.key} onBlur={() => markTouched(v.key)}>
                      <MultilineField
                        variable={v}
                        value={(answers[v.key] as string) ?? ''}
                        onChange={(val) => update(v.key, val)}
                        showError={showError}
                      />
                    </div>
                  );
                case 'select':
                  return (
                    <div key={v.key} onBlur={() => markTouched(v.key)}>
                      <SelectField
                        variable={v}
                        value={(answers[v.key] as string) ?? ''}
                        onChange={(val) => update(v.key, val)}
                        showError={showError}
                      />
                    </div>
                  );
                case 'multiselect':
                  return (
                    <div key={v.key} onBlur={() => markTouched(v.key)}>
                      <MultiselectField
                        variable={v}
                        value={(answers[v.key] as string[]) ?? []}
                        onChange={(val) => update(v.key, val)}
                        showError={showError}
                      />
                    </div>
                  );
                case 'number':
                  return (
                    <div key={v.key} onBlur={() => markTouched(v.key)}>
                      <NumberField
                        variable={v}
                        value={(answers[v.key] as number | '') ?? ''}
                        onChange={(val) => update(v.key, val === '' ? '' : val)}
                        showError={showError}
                      />
                    </div>
                  );
                case 'boolean':
                  return (
                    <BooleanField
                      key={v.key}
                      variable={v}
                      value={(answers[v.key] as boolean) ?? false}
                      onChange={(val) => update(v.key, val)}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      ))}
    </form>
  );
}
