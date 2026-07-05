import Link from 'next/link';
import { ROLES } from '@/lib/catalog/roles';

// Inline SVG icons per role — line style, aria-hidden (decorative)
function RoleIcon({ roleId }: { roleId: string }) {
  switch (roleId) {
    case 'marketing-manager':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8h9l6-4v16l-6-4H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
          <path d="M7 8v8"/>
          <path d="M18 8a4 4 0 0 1 0 8"/>
        </svg>
      );
    case 'small-business-owner':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
          <path d="M3 9l2-4h14l2 4"/>
          <path d="M9 9v12M15 9v12"/>
          <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>
        </svg>
      );
    case 'customer-support':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
          <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
      );
    case 'recruiter':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      );
    case 'sales-rep':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          <path d="M2 12h20"/>
        </svg>
      );
    case 'operations':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      );
    case 'founder-generalist':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
        </svg>
      );
    default:
      return null;
  }
}

// Inline shield icon — reused in hero trust cue and export section
function ShieldIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

export default function Landing() {
  return (
    <main>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="wrap hero-grid">

          {/* Left copy column */}
          <div>
            <span className="eyebrow">Works with Claude · ChatGPT coming soon</span>
            <h1>
              AI setups that just{' '}
              <span className="underline-wrap">
                make&nbsp;sense.
                <svg
                  className="scribble"
                  viewBox="0 0 220 14"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 9C40 3 70 13 110 7S190 4 216 8"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="hero-sub">
              Pick a role. Answer a few plain-English questions. Export to Claude —
              ChatGPT coming soon. No prompt engineering required.
            </p>
            <div className="hero-ctas">
              <Link className="btn btn-primary btn-lg" href="/start">
                Find my setup
              </Link>
              <Link className="btn btn-outline btn-lg" href="/professionals">
                Browse all setups
              </Link>
            </div>
            <div className="export-flags">
              <span className="export-flag">
                <span className="dot-ok">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8l3.5 3.5L13 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Exports to Claude Projects
              </span>
              <span className="export-flag">
                <span className="dot-soon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path
                      d="M8 5v3.5l2 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                ChatGPT coming soon
              </span>
            </div>
            <p style={{ marginTop: '20px', marginBottom: 0 }}>
              <span className="trust-cue">
                <ShieldIcon />
                Curated and reviewed by the Armory team
              </span>
            </p>
          </div>

          {/* Right illustration */}
          <div className="hero-art">
            <svg
              viewBox="0 0 440 380"
              fill="none"
              role="img"
              aria-label="Illustration of the Armory flow: your answer becomes a compiled setup, ready to paste into Claude"
            >
              {/* backdrop */}
              <rect x="60" y="40" width="320" height="300" rx="48" fill="#FBF1D3" transform="rotate(-6 220 190)"/>
              <circle cx="86" cy="322" r="26" fill="#E2EEF8"/>
              <circle cx="392" cy="84" r="10" fill="#DFF2EB"/>
              <g fill="#D9D1C2">
                <circle cx="366" cy="300" r="1.8"/><circle cx="378" cy="300" r="1.8"/><circle cx="390" cy="300" r="1.8"/>
                <circle cx="366" cy="312" r="1.8"/><circle cx="378" cy="312" r="1.8"/><circle cx="390" cy="312" r="1.8"/>
                <circle cx="366" cy="324" r="1.8"/><circle cx="378" cy="324" r="1.8"/><circle cx="390" cy="324" r="1.8"/>
              </g>

              {/* card 1: your answer */}
              <g className="hero-float-2">
                <g transform="rotate(-5 161 94)">
                  <rect x="82" y="56" width="170" height="92" rx="14" fill="#E9E3D8"/>
                  <rect x="76" y="48" width="170" height="92" rx="14" fill="#fff" stroke="#EFE9DC" strokeWidth="1.5"/>
                  <text x="92" y="71" fontSize="9" fontWeight="700" letterSpacing="1.5" fill="#756C5C">YOUR BRAND</text>
                  <rect x="90" y="78" width="142" height="26" rx="8" fill="#FAF7F1" stroke="#D9D1C2" strokeWidth="1.5"/>
                  <text x="100" y="95.5" fontSize="12.5" fontWeight="600" fill="#272319">Brightwave</text>
                  <rect x="172" y="83" width="1.8" height="16" fill="#5B50C8"/>
                  <rect x="90" y="112" width="94" height="20" rx="10" fill="#EFEDFB" stroke="#5B50C8" strokeWidth="1.5"/>
                  <text x="100" y="126" fontSize="10.5" fontWeight="700" fill="#453CA8">Conversational</text>
                  <rect x="190" y="112" width="46" height="20" rx="10" fill="#fff" stroke="#D9D1C2" strokeWidth="1.5"/>
                  <text x="198" y="126" fontSize="10.5" fontWeight="600" fill="#756C5C">Playful</text>
                </g>
              </g>

              {/* flow 1 */}
              <path d="M250 122c14 10 18 22 12 36" stroke="#5B50C8" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="1 8"/>
              <path d="m262 158-6-7M262 158l-9 1" stroke="#5B50C8" strokeWidth="2.4" strokeLinecap="round"/>

              {/* card 2: compiled setup */}
              <g className="hero-float">
                <g transform="rotate(3 268 213)">
                  <rect x="186" y="162" width="176" height="118" rx="16" fill="#E9E3D8"/>
                  <rect x="180" y="154" width="176" height="118" rx="16" fill="#fff" stroke="#EFE9DC" strokeWidth="1.5"/>
                  <rect x="194" y="168" width="26" height="26" rx="9" fill="#5B50C8"/>
                  <path d="m201 187.5 6-13.5 6 13.5M203.6 183h6.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <text x="228" y="180" fontSize="12.5" fontWeight="800" fill="#272319">Marketing Manager</text>
                  <text x="228" y="193" fontSize="10" fontWeight="600" fill="#756C5C">Built from your answers</text>
                  <path d="M194 204h148" stroke="#EFE9DC" strokeWidth="1.5"/>
                  <rect x="194" y="212" width="148" height="7" rx="3.5" fill="#EDE7DC"/>
                  <rect x="194" y="225" width="118" height="7" rx="3.5" fill="#DCD7F5"/>
                  <rect x="194" y="238" width="136" height="7" rx="3.5" fill="#EDE7DC"/>
                  <circle cx="336" cy="258" r="9" fill="#E3F2E8"/>
                  <path d="m331.5 258 3 3 6-6.5" stroke="#27713F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <g transform="rotate(3 229 270)">
                  <rect x="170" y="258" width="118" height="25" rx="12.5" fill="#272319"/>
                  <circle cx="184" cy="270.5" r="4" fill="#7ED09A"/>
                  <text x="194" y="274.5" fontSize="11.5" fontWeight="700" fill="#fff">Ready to paste</text>
                </g>
              </g>

              {/* flow 2 */}
              <path d="M302 284c-8 8-20 14-34 17" stroke="#5B50C8" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="1 8"/>
              <path d="m268 301 8-4M268 301l6 6" stroke="#5B50C8" strokeWidth="2.4" strokeLinecap="round"/>

              {/* card 3: pasted into Claude */}
              <g transform="rotate(-4 218 330)">
                <rect x="124" y="299" width="200" height="76" rx="12" fill="#E9E3D8"/>
                <rect x="118" y="292" width="200" height="76" rx="12" fill="#fff" stroke="#EFE9DC" strokeWidth="1.5"/>
                <circle cx="133" cy="305" r="3" fill="#F4B8AE"/>
                <circle cx="144" cy="305" r="3" fill="#F5D57C"/>
                <circle cx="155" cy="305" r="3" fill="#A8D8B0"/>
                <rect x="120" y="316" width="38" height="50" fill="#FAF7F1"/>
                <rect x="168" y="322" width="136" height="20" rx="7" fill="#EFEDFB" stroke="#5B50C8" strokeWidth="1.5" strokeDasharray="4 3"/>
                <text x="180" y="335.5" fontSize="9.5" fontWeight="600" fill="#756C5C">Paste your setup…</text>
                <rect x="173" y="327" width="1.8" height="10" fill="#5B50C8"/>
                <rect x="168" y="350" width="100" height="6" rx="3" fill="#F0EAE0"/>
              </g>
            </svg>
          </div>

        </div>
      </section>

      {/* ── Role section ──────────────────────────────────────────── */}
      <section className="section-tight" id="roles">
        <div className="wrap">
          <span className="eyebrow">Start with your role</span>
          <h2 style={{ marginBottom: '24px' }}>Setups built around real jobs</h2>
          <div className="role-grid">
            {ROLES.map((role) => (
              <Link
                key={role.id}
                className="role-card"
                href={`/professionals?role=${role.id}`}
              >
                <span className="icon-badge">
                  <RoleIcon roleId={role.id} />
                </span>
                <strong>{role.label}</strong>
                <span>{role.description}</span>
              </Link>
            ))}
            <Link
              className="role-card role-card--browse"
              href="/professionals"
            >
              <strong>Browse everything →</strong>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section className="section section-oat" id="how">
        <div className="wrap">
          <span className="eyebrow">How it works</span>
          <h2 style={{ marginBottom: '8px' }}>Useful in the first ten minutes</h2>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '38em', marginBottom: '32px' }}>
            A setup is a ready-made set of instructions you paste into Claude to make it act
            like a specialist for your role — no technical knowledge needed.
          </p>
          <div className="steps-4">
            <div className="step-card">
              <h3>Pick a setup</h3>
              <p>Browse setups built for real roles. See exactly what each one generates before you pick.</p>
            </div>
            <div className="step-card">
              <h3>Answer a few plain-English questions</h3>
              <p>Your brand name, your channels, your tone. A short form — not a configuration panel.</p>
            </div>
            <div className="step-card">
              <h3>Preview your setup</h3>
              <p>See the full instructions before you export. Inspect every word, then make it yours.</p>
            </div>
            <div className="step-card">
              <h3>Export to Claude</h3>
              <p>Copy the finished setup into your own Claude with a step-by-step walkthrough. You own it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What you actually get ─────────────────────────────────── */}
      <section className="section">
        <div className="wrap two-col">
          <div>
            <span className="eyebrow">What you actually get</span>
            <h2>A finished setup, not a blank chatbox</h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '32em' }}>
              Armory writes the instructions; you paste them into your Claude. Every export
              includes everything Claude needs to act like a specialist for you.
            </p>
            <ul className="included-list" style={{ marginTop: '20px' }}>
              <li>
                <span className="icon-badge">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </span>
                <div>
                  <strong>Custom instructions, written for you</strong>
                  <span>Compiled from your answers — inspect every word before you use it.</span>
                </div>
              </li>
              <li>
                <span className="icon-badge">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </span>
                <div>
                  <strong>A starter knowledge file</strong>
                  <span>A quick-facts sheet about your brand that Claude can reference.</span>
                </div>
              </li>
              <li>
                <span className="icon-badge">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </span>
                <div>
                  <strong>A step-by-step install walkthrough</strong>
                  <span>Annotated screens for Claude Projects — or a free-plan path.</span>
                </div>
              </li>
            </ul>
            <p style={{ marginTop: '20px', marginBottom: 0 }}>
              <span className="trust-cue">
                <ShieldIcon />
                Curated setups are reviewed by the Armory team
              </span>
            </p>
          </div>
          <div className="copyblock" aria-hidden="true">
            <div className="copyblock-head">
              <span>custom-instructions.md</span>
              <span className="copy-btn">Copy</span>
            </div>
            <pre className="code">{`You are a senior Marketing Manager working
exclusively for Brightwave.

Your responsibilities:
- Develop and execute marketing campaigns…
- Write compelling copy tailored to each
  channel's audience and format.
- Maintain a consistent brand voice in every
  piece of content you produce.

Active channels for Brightwave:
- Email
- Instagram
- LinkedIn

Tone of voice: Conversational`}</pre>
          </div>
        </div>
      </section>

      {/* ── Export, don't host ────────────────────────────────────── */}
      <section className="section section-oat">
        <div className="wrap center" style={{ maxWidth: '640px' }}>
          <ShieldIcon size={40} className="shield-lg" />
          <h2 style={{ marginTop: '14px' }}>Export, don&apos;t host</h2>
          <p style={{ color: 'var(--ink-soft)' }}>
            Your setup lives in your Claude, not ours. Armory never runs your assistant,
            never sees your conversations, and never holds your data hostage. We generate
            the setup — you own it.
          </p>
          <Link className="btn btn-primary" href="/start">
            Find my setup
          </Link>
        </div>
      </section>

    </main>
  );
}
