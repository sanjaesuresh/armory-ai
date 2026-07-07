'use client';

/**
 * HomePipeline — interactive 4-stage compiler demo for the homepage.
 *
 * Layout: 4 stage cards + 3 connector arrows, horizontal on desktop / stacked on mobile.
 * Interactivity:
 *   Stage 1 — role chips (roving tabindex, arrow-key nav, aria-pressed).
 *   Stage 2 — 2-3 per-role form controls (text input + radio tone + checkbox).
 *   Stage 3 — live monospace config preview (pure string template, illustrative).
 *   Stage 4 — copy button with clipboard API + copied state feedback.
 * Motion: all transitions are CSS-only and stripped by the global
 *   @media (prefers-reduced-motion: reduce) rule in globals.css.
 * id="roles" lives on the role-jump nav in Landing.tsx, NOT here.
 */

import { useState, useRef, useCallback } from 'react';
import { ROLES, type Role } from '@/lib/catalog/roles';
import StepIcon from '@/components/icons/StepIcon';

// ─── Pipeline-local role extension ───────────────────────────────────────────
// The developer entry is ONLY for this interactive demo. It does NOT appear in
// lib/catalog/roles.ts, the #roles jump nav, or the catalog.

type PipelineRole = Pick<Role, 'id' | 'label'>;

const DEV_PIPELINE_ROLE: PipelineRole = {
  id: 'claude-code-dev',
  label: 'Claude Code Dev',
};

// Extend the catalog ROLES array with the pipeline-only developer role.
const PIPELINE_ROLES: PipelineRole[] = [...ROLES, DEV_PIPELINE_ROLE];

// ─── Role accent dots ─────────────────────────────────────────────────────────

const ROLE_DOT: Record<string, string> = {
  'marketing-manager':    'var(--accent-butter)',
  'small-business-owner': 'var(--accent-sage)',
  'customer-support':     'var(--accent-sky)',
  'recruiter':            'var(--accent-lilac)',
  'sales-rep':            'var(--accent-mint)',
  'operations':           'var(--accent-sage)',
  'founder-generalist':   'var(--accent-butter)',
  'claude-code-dev':      'var(--accent-lilac)',
};

// ─── Grammatically-correct self-descriptions for each role ────────────────────
// Fixes the compiled-config output so "You are a Customer Support" → grammatical.

const ROLE_SELF_DESC: Record<string, string> = {
  'marketing-manager':    'a marketing manager',
  'small-business-owner': 'a small-business owner',
  'customer-support':     'a customer support lead',
  'recruiter':            'a recruiter',
  'sales-rep':            'a sales representative',
  'operations':           'an operations lead',
  'founder-generalist':   'a founder-generalist',
  'claude-code-dev':      'a senior software engineer',
};

// ─── Per-role question config ─────────────────────────────────────────────────

interface RoleCfg {
  tone: [string, string];
  ctaLabel: string;
  fieldLabel: string;
  fieldPlaceholder: string;
}

const ROLE_CFG: Record<string, RoleCfg> = {
  'marketing-manager': {
    tone: ['Friendly', 'Formal'],
    ctaLabel: 'Always end with a call to action',
    fieldLabel: 'Brand name',
    fieldPlaceholder: 'e.g. Acme Co.',
  },
  'small-business-owner': {
    tone: ['Conversational', 'Professional'],
    ctaLabel: 'Include business hours in replies',
    fieldLabel: 'Business name',
    fieldPlaceholder: 'e.g. Oak Street Bakery',
  },
  'customer-support': {
    tone: ['Empathetic', 'Efficient'],
    ctaLabel: 'Mention escalation steps when needed',
    fieldLabel: 'Company name',
    fieldPlaceholder: 'e.g. TechFlow',
  },
  'recruiter': {
    tone: ['Warm', 'Professional'],
    ctaLabel: 'Include salary range when available',
    fieldLabel: 'Company name',
    fieldPlaceholder: 'e.g. BuildCo',
  },
  'sales-rep': {
    tone: ['Consultative', 'Direct'],
    ctaLabel: 'Include social proof in outreach',
    fieldLabel: 'Product or service',
    fieldPlaceholder: 'e.g. SaaS platform',
  },
  'operations': {
    tone: ['Formal', 'Casual'],
    ctaLabel: 'Always include due dates and owners',
    fieldLabel: 'Team or department',
    fieldPlaceholder: 'e.g. Ops team',
  },
  'founder-generalist': {
    tone: ['Direct', 'Narrative'],
    ctaLabel: 'Include company vision when relevant',
    fieldLabel: 'Company name',
    fieldPlaceholder: 'e.g. Launchpad Inc.',
  },
  // Developer role — pipeline-local only
  'claude-code-dev': {
    tone: ['Ship fast', 'Rigorous'],
    ctaLabel: 'Write tests first (TDD)',
    fieldLabel: 'Primary language',
    fieldPlaceholder: 'e.g. TypeScript',
  },
};

// ─── Per-role body lines ──────────────────────────────────────────────────────

const ROLE_BODY: Record<string, (entity: string) => string> = {
  'marketing-manager': (e) =>
    `# Responsibilities\n- Develop campaigns and copy for ${e}.\n- Maintain consistent brand voice.`,
  'small-business-owner': (e) =>
    `# Context\nHelp ${e} run daily operations and grow the business.`,
  'customer-support': (e) =>
    `# Role\nResolve support tickets for ${e} customers efficiently.`,
  'recruiter': (e) =>
    `# Role\nManage the hiring pipeline for ${e}.`,
  'sales-rep': (e) =>
    `# Goal\nWrite outreach and proposals that close deals for ${e}.`,
  'operations': (e) =>
    `# Scope\nStreamline processes and workflows for ${e}.`,
  'founder-generalist': (e) =>
    `# Context\nSupport the founding team at ${e} across strategy, writing, and execution.`,
  // Developer role body uses the field value as the primary language, not a company name.
  'claude-code-dev': (lang) =>
    `# Stack\nPrimary language: ${lang}.\n\n# Principles\n- Smallest correct change. Do not refactor beyond the task.\n- Verify before done: confirm output works before declaring complete.`,
};

// ─── Compiler (pure, illustrative) ───────────────────────────────────────────

function buildConfig(
  roleId: string,
  tone: string,
  cta: boolean,
  field: string,
): string {
  const role = PIPELINE_ROLES.find((r) => r.id === roleId);
  const cfg  = ROLE_CFG[roleId];
  if (!role || !cfg) return '';

  const selfDesc = ROLE_SELF_DESC[roleId] ?? `a ${role.label.toLowerCase()}`;

  // Developer role: field = primary language; compiled output has an engineering flavour.
  if (roleId === 'claude-code-dev') {
    const lang = field.trim() || 'TypeScript';
    const body = ROLE_BODY[roleId]?.(lang) ?? '';
    const styleLine =
      tone === 'Rigorous'
        ? '# Style\nFavour correctness: prefer rigorous, well-tested solutions over speed.'
        : '# Style\nFavour momentum: ship pragmatic, working solutions; refine iteratively.';
    const testsLine = cta ? '\n- Write tests first (TDD): red → green → refactor.' : '';
    // Inline the tests-first bullet into the Principles block
    const bodyWithTests = body.replace(
      '- Verify before done: confirm output works before declaring complete.',
      `- Verify before done: confirm output works before declaring complete.${testsLine}`,
    );
    return `You are ${selfDesc} working in ${lang}.\n\n${bodyWithTests}\n\n${styleLine}`;
  }

  // Professional roles: field = company / brand name.
  const entity = field.trim() || '[your company]';
  const body   = ROLE_BODY[roleId]?.(entity) ?? '';
  const ctaLine = cta ? `\n# Behavior\n${cfg.ctaLabel}.` : '';
  return `You are ${selfDesc} for ${entity}.\n\nTone: ${tone}\n${body}${ctaLine}`;
}

// ─── Connector arrow ──────────────────────────────────────────────────────────

function Connector() {
  return (
    <div className="land-connector" aria-hidden="true">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomePipeline() {
  const [roleId, setRoleId]   = useState('marketing-manager');
  const [tone, setTone]       = useState<string>(ROLE_CFG['marketing-manager'].tone[0]);
  const [cta, setCta]         = useState(false);
  const [field, setField]     = useState('');
  const [copied, setCopied]   = useState(false);

  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const cfg    = ROLE_CFG[roleId];
  const config = buildConfig(roleId, tone, cta, field);

  // Stage activation: stage 1 always on; 2 always on (default role);
  // 3+4 light up once user has interacted with the form.
  const stage3On = field.trim().length > 0 || tone !== cfg?.tone[0] || cta;
  const stage4On = stage3On;

  const selectRole = useCallback((id: string) => {
    const next = ROLE_CFG[id];
    setRoleId(id);
    setTone(next?.tone[0] ?? 'Friendly');
    setCta(false);
    setField('');
  }, []);

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      const len = PIPELINE_ROLES.length;
      let target = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        target = (idx + 1) % len;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        target = (idx - 1 + len) % len;
      }
      if (target >= 0) {
        selectRole(PIPELINE_ROLES[target].id);
        chipRefs.current[target]?.focus();
      }
    },
    [selectRole],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(config);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (non-HTTPS / permission denied) — silent fail.
      // User can still manually select + copy from the preview.
    }
  }, [config]);

  return (
    <section id="see-it-compile" className="land-pipeline" aria-label="Interactive compiler demo">
      <div className="wrap">
        <div className="land-pipeline-hd">
          <p className="eyebrow">See it compile</p>
          <h2 className="land-pipeline-title">
            Pick a role. Answer a few questions. Done.
          </h2>
          <p className="land-pipeline-sub">
            A live illustration — the real export includes the full compiled
            setup you paste into Claude or ChatGPT.
          </p>
        </div>

        <div className="land-stages">

          {/* ── Stage 1: Pick role ─────────────────────────────────────── */}
          <div className="land-stage land-stage--on">
            <div className="land-stage-hd">
              <span className="land-stage-num">1</span>
              <span className="land-stage-lbl">
                <StepIcon name="role" size={15} className="land-stage-icon" />
                Pick your role
              </span>
            </div>
            <div
              className="land-role-grid"
              role="group"
              aria-label="Select a role"
            >
              {PIPELINE_ROLES.map((role, idx) => (
                <button
                  key={role.id}
                  ref={(el) => { chipRefs.current[idx] = el; }}
                  className="land-role-btn"
                  aria-pressed={roleId === role.id}
                  tabIndex={roleId === role.id ? 0 : -1}
                  onClick={() => selectRole(role.id)}
                  onKeyDown={(e) => handleKey(e, idx)}
                >
                  <span
                    className="land-rdot"
                    style={{ background: ROLE_DOT[role.id] ?? 'var(--accent-sand)' }}
                    aria-hidden="true"
                  />
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <Connector />

          {/* ── Stage 2: Answer questions ──────────────────────────────── */}
          <div className="land-stage land-stage--on">
            <div className="land-stage-hd">
              <span className="land-stage-num">2</span>
              <span className="land-stage-lbl">
                <StepIcon name="questions" size={15} className="land-stage-icon" />
                Answer a few questions
              </span>
            </div>

            {cfg && (
              <div className="land-form">
                <div className="land-field">
                  <label className="land-field-lbl" htmlFor="pipe-field">
                    {cfg.fieldLabel}
                  </label>
                  <input
                    id="pipe-field"
                    type="text"
                    className="land-field-inp"
                    placeholder={cfg.fieldPlaceholder}
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    autoComplete="organization"
                    maxLength={60}
                    aria-describedby="pipe-field-hint"
                  />
                  <span id="pipe-field-hint" className="sr-only">
                    Used to personalise your compiled setup
                  </span>
                </div>

                <fieldset className="land-fieldset">
                  <legend className="land-field-lbl">Tone</legend>
                  <div className="land-tone-row">
                    {cfg.tone.map((t) => (
                      <label key={t} className="land-tone-opt">
                        <input
                          type="radio"
                          name="pipe-tone"
                          value={t}
                          checked={tone === t}
                          onChange={() => setTone(t)}
                        />
                        <span className="land-tone-lbl">{t}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="land-check">
                  <input
                    type="checkbox"
                    checked={cta}
                    onChange={(e) => setCta(e.target.checked)}
                  />
                  <span className="land-check-lbl">{cfg.ctaLabel}</span>
                </label>
              </div>
            )}
          </div>

          <Connector />

          {/* ── Stage 3: Compiled config ───────────────────────────────── */}
          <div className={`land-stage${stage3On ? ' land-stage--on' : ''}`}>
            <div className="land-stage-hd">
              <span className="land-stage-num">3</span>
              <span className="land-stage-lbl">
                <StepIcon name="compiled" size={15} className="land-stage-icon" />
                Compiled config
              </span>
            </div>
            <pre className="land-config" aria-label="Compiled setup preview">
              {config}
            </pre>
          </div>

          <Connector />

          {/* ── Stage 4: Paste into Claude ─────────────────────────────── */}
          <div className={`land-stage${stage4On ? ' land-stage--on' : ''}`}>
            <div className="land-stage-hd">
              <span className="land-stage-num">4</span>
              <span className="land-stage-lbl">
                <StepIcon name="paste" size={15} className="land-stage-icon" />
                Paste into Claude
              </span>
            </div>
            <div className="land-copy-area">
              <p className="land-copy-hint">
                Copy the finished setup and paste it into Claude Projects or
                ChatGPT custom instructions. You own it entirely.
              </p>
              <button
                className={`land-copy-btn${copied ? ' land-copy-btn--done' : ''}`}
                onClick={handleCopy}
                aria-label={copied ? 'Copied to clipboard' : 'Copy config to clipboard'}
              >
                <StepIcon name="paste" size={14} />
                {/* aria-live so screen readers announce the state change */}
                <span aria-live="polite" aria-atomic="true">
                  {copied ? 'Copied' : 'Copy config'}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
