'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for observability; never surface raw details to the user.
    console.error('[AQELVYN] client error:', error);
  }, [error]);

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
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 60 }}>⚠️</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '12px 0 8px' }}>Something went wrong</h1>
        <p style={{ color: '#8ab6b0', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }}>
          An unexpected error occurred. Your data is safe — try again.
        </p>
        <button
          onClick={reset}
          style={{ background: 'linear-gradient(135deg,#2dd4bf,#fb923c)', color: '#041414', fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 15 }}
        >
          ↻ Try again
        </button>
      </div>
    </div>
  );
}
