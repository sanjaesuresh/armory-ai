import Link from 'next/link';

export default function Landing() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
        Pick a ready-made AI setup for your role and paste it into Claude or ChatGPT
      </h1>
      <p
        data-testid="example-line"
        style={{ color: '#555', marginBottom: '2rem', fontSize: '1.1rem' }}
      >
        e.g. a ready-made setup that turns Claude into your marketing assistant
      </p>
      <Link
        href="/start"
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          background: '#1a1a1a',
          color: '#fff',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: 600,
        }}
      >
        Get started
      </Link>
    </main>
  );
}
