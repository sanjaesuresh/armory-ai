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
              <Link className="btn btn-outline btn-lg" href="/catalog">
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
              viewBox="0 0 440 340"
              fill="none"
              role="img"
              aria-label="Hand-drawn illustration of a person at a laptop, with a finished AI setup card floating above the screen"
            >
              {/* backdrop blobs */}
              <path
                d="M250 28c82-4 146 50 150 124 4 76-58 134-148 138-86 4-148-48-150-128C100 84 166 32 250 28Z"
                fill="#ECE9FA"
              />
              <circle cx="116" cy="64" r="30" fill="#FBF1D3"/>
              <circle cx="404" cy="222" r="12" fill="#DFF2EB"/>
              <g fill="#D9D1C2">
                <circle cx="58" cy="182" r="1.7"/><circle cx="70" cy="182" r="1.7"/><circle cx="82" cy="182" r="1.7"/>
                <circle cx="58" cy="194" r="1.7"/><circle cx="70" cy="194" r="1.7"/><circle cx="82" cy="194" r="1.7"/>
                <circle cx="58" cy="206" r="1.7"/><circle cx="70" cy="206" r="1.7"/><circle cx="82" cy="206" r="1.7"/>
              </g>
              <path d="M60 262q6-9 12 0t12 0" stroke="#5B50C8" strokeWidth="2.4" strokeLinecap="round"/>
              <ellipse cx="228" cy="308" rx="152" ry="9" fill="#F3EDE2"/>

              {/* chair back */}
              <rect x="134" y="178" width="13" height="58" rx="6.5" fill="#F3EDE2" stroke="#272319" strokeWidth="2.6"/>

              {/* person body */}
              <path d="M146 236c0-40 10-70 31-70s31 30 31 70" fill="#E6F0E0" stroke="#272319" strokeWidth="3"/>
              <path d="M168 170c4 5 14 5 18 0" stroke="#272319" strokeWidth="2.4" strokeLinecap="round"/>
              <circle cx="176" cy="132" r="27" fill="#fff" stroke="#272319" strokeWidth="3"/>
              <path
                d="M150 130c-1-22 11-34 27-34s27 12 26 32c-6-14-15-20-26.5-20S156 116 150 130Z"
                fill="#272319"
              />
              <circle cx="200" cy="96" r="8.5" fill="#272319"/>
              <path d="M192 102a10 10 0 0 0 7 4" stroke="#5B50C8" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="168" cy="131" r="1.8" fill="#272319"/>
              <circle cx="185" cy="131" r="1.8" fill="#272319"/>
              <path d="M171 140c3.5 3 9 3 12.5 0" stroke="#272319" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="161" cy="139" r="4" fill="#F6CDBD" opacity=".7"/>
              <circle cx="193" cy="139" r="4" fill="#F6CDBD" opacity=".7"/>

              {/* left arm + mug */}
              <path d="M159 190c-12-4-22-12-26-21" stroke="#272319" strokeWidth="3" strokeLinecap="round"/>
              <rect x="112" y="148" width="26" height="20" rx="5" fill="#FAE7E1" stroke="#272319" strokeWidth="3"/>
              <path d="M112 153a7 7 0 0 0 0 13" stroke="#272319" strokeWidth="3" fill="none"/>
              <circle cx="135" cy="167" r="4" fill="#fff" stroke="#272319" strokeWidth="2.6"/>
              <path d="M120 140c-2-4 2-6 0-10M129 140c-2-4 2-6 0-10" stroke="#756C5C" strokeWidth="2.4" strokeLinecap="round"/>

              {/* right arm */}
              <path d="M197 194c17 12 33 20 49 25" stroke="#272319" strokeWidth="3" strokeLinecap="round"/>

              {/* desk */}
              <rect x="94" y="230" width="272" height="11" rx="5.5" fill="#fff" stroke="#272319" strokeWidth="3"/>
              <path d="m116 241-8 64M344 241l8 64" stroke="#272319" strokeWidth="3" strokeLinecap="round"/>

              {/* laptop */}
              <rect x="246" y="150" width="98" height="68" rx="8" fill="#fff" stroke="#272319" strokeWidth="3"/>
              <path d="M260 168h34" stroke="#5B50C8" strokeWidth="5" strokeLinecap="round"/>
              <path d="M260 184h62M260 198h50" stroke="#D9D1C2" strokeWidth="5" strokeLinecap="round"/>
              <circle cx="326" cy="168" r="8" fill="#E3F2E8" stroke="#2E7D4F" strokeWidth="2.2"/>
              <path d="m322.5 168 2.5 2.5 4.5-5" stroke="#2E7D4F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M240 218h110l9 13H231z" fill="#F3EDE2" stroke="#272319" strokeWidth="3" strokeLinejoin="round"/>

              {/* plant */}
              <path d="m372 305-4-19h30l-4 19z" fill="#FCEBDB" stroke="#272319" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M383 286c-2-18-11-28-21-32 4 14 10 24 21 32Z" fill="#E6F0E0" stroke="#272319" strokeWidth="2.4" strokeLinejoin="round"/>
              <path d="M385 286c2-20 11-30 21-34-4 14-10 26-21 34Z" fill="#E6F0E0" stroke="#272319" strokeWidth="2.4" strokeLinejoin="round"/>
              <path d="M384 284c0-14 2-22 6-28" stroke="#272319" strokeWidth="2.4" strokeLinecap="round"/>

              {/* dotted connector: screen → floating card */}
              <path
                d="M330 148c8-10 16-18 22-22"
                stroke="#5B50C8"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeDasharray=".5 8"
              />

              {/* floating setup card */}
              <g className="hero-float">
                <g transform="rotate(-5 362 96)">
                  <rect x="316" y="74" width="100" height="62" rx="12" fill="#E9E3D8"/>
                  <rect x="310" y="66" width="100" height="62" rx="12" fill="#fff" stroke="#272319" strokeWidth="3"/>
                  <rect x="320" y="76" width="20" height="20" rx="6" fill="#FBF1D3" stroke="#272319" strokeWidth="2"/>
                  <path
                    d="m325.5 91 4.5-10 4.5 10M327.5 87h5"
                    stroke="#272319"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M348 82h52" stroke="#756C5C" strokeWidth="4.5" strokeLinecap="round"/>
                  <path d="M348 92h36" stroke="#D9D1C2" strokeWidth="4.5" strokeLinecap="round"/>
                  <circle cx="327" cy="114" r="7.5" fill="#E3F2E8" stroke="#2E7D4F" strokeWidth="2.2"/>
                  <path
                    d="m323.5 114 2.5 2.5 4.5-5"
                    stroke="#2E7D4F"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M340 114h40" stroke="#D9D1C2" strokeWidth="4.5" strokeLinecap="round"/>
                </g>
              </g>

              {/* paper plane */}
              <g className="hero-float-2">
                <path
                  d="M100 70 52 88l19 4z"
                  fill="#ECE9FA"
                  stroke="#272319"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M100 70 71 92l7 16z"
                  fill="#fff"
                  stroke="#272319"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M96 86c14 16 30 26 48 32"
                  stroke="#B9B1E8"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeDasharray="3 7"
                />
              </g>
            </svg>
            <span className="doodle-note doodle-note--hero">
              your setup, ready to paste
              <svg
                width="46"
                height="42"
                viewBox="0 0 46 42"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M40 4C30 12 20 24 10 36"/>
                <path d="M10 36l1.5-9M10 36l9-1"/>
              </svg>
            </span>
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
                href={`/catalog?role=${role.id}`}
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
              href="/catalog"
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
