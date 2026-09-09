import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg,#041414,#062a2a 55%,#0b1f1f)',
        color: '#e8f6f4',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        padding: 24,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <div style={{ fontSize: 96, lineHeight: 1, fontWeight: 800, background: 'linear-gradient(135deg,#2dd4bf,#fb923c)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          404
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '12px 0 8px' }}>This prompt has vanished into the void</h1>
        <p style={{ color: '#8ab6b0', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }}>
          The page you&apos;re looking for doesn&apos;t exist — or it never got minted on-chain. Let&apos;s get you back to the studio.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{ background: 'linear-gradient(135deg,#2dd4bf,#fb923c)', color: '#041414', fontWeight: 700, padding: '12px 22px', borderRadius: 12, textDecoration: 'none' }}
          >
            ⚡ Back to AQELVYN Studio
          </Link>
          <Link
            href="/prompts"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#e8f6f4', fontWeight: 700, padding: '12px 22px', borderRadius: 12, textDecoration: 'none' }}
          >
            Browse all prompts
          </Link>
        </div>
      </div>
    </div>
  );
}
