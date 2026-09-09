import { ImageResponse } from 'next/og';
import { resolveKey, kindLabel, descriptionFor, SLOGAN, SITE_URL, Kind } from '@/lib/seo';

export const revalidate = 86400; // cache 24h

// GET /api/og/[kind]/[id] -> branded 1200x630 share image, generated per prompt.
export async function GET(
  _req: Request,
  { params }: { params: { kind: string; id: string } },
) {
  const e = resolveKey(params.kind as Kind, params.id);
  if (!e) {
    return new Response('Prompt not found', { status: 404 });
  }

  const isFree = e.kind === 'web3';
  const badge = isFree ? 'FREE WEB3 PROMPT' : kindLabel[e.kind].toUpperCase();
  const badgeColor = isFree ? '#34d399' : '#fb923c';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #041414 0%, #062a2a 55%, #0b1f1f 100%)',
          color: '#e8f6f4',
          padding: '64px 72px',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          position: 'relative',
        }}
      >
        {/* glow accents */}
        <div style={{ position: 'absolute', top: -140, left: -120, width: 420, height: 420, borderRadius: '50%', background: '#2dd4bf22', filter: 'blur(90px)' }} />
        <div style={{ position: 'absolute', bottom: -160, right: -120, width: 420, height: 420, borderRadius: '50%', background: '#fb923c1f', filter: 'blur(90px)' }} />

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: 6, background: 'linear-gradient(135deg,#2dd4bf,#fb923c)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              AQELVYN
            </span>
          </div>
          <span style={{ fontSize: 22, color: '#8ab6b0', letterSpacing: 1 }}>{SLOGAN}</span>
        </div>

        {/* body */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, position: 'relative' }}>
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 82,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              flexShrink: 0,
            }}
          >
            {e.emoji}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
            <span
              style={{
                alignSelf: 'flex-start',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 2,
                color: '#041414',
                background: badgeColor,
                borderRadius: 999,
                padding: '8px 20px',
              }}
            >
              {badge}
            </span>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1 }}>
              {e.name}
            </div>
            <div style={{ fontSize: 26, color: '#8ab6b0' }}>{e.category}</div>
          </div>
        </div>

        {/* footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', color: '#8ab6b0', fontSize: 20 }}>
          <span style={{ maxWidth: 720, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {descriptionFor(e)}
          </span>
          <span style={{ fontWeight: 600, color: '#2dd4bf' }}>{SITE_URL.replace(/^https?:\/\//, '')}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
