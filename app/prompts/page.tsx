import type { Metadata } from 'next';
import Link from 'next/link';
import { listAll, titleFor, SITE_NAME, DESCRIPTION } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'All AI Prompts & Master Build Blueprints',
  description: `Browse every master build-prompt in ${SITE_NAME}: 615+ AI + web3 app, repo, YouTube, and brand blueprints. ${DESCRIPTION}`,
  alternates: { canonical: '/prompts' },
};

export default function PromptsIndex() {
  const all = listAll();
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#041414,#062a2a 55%,#0b1f1f)', color: '#e8f6f4', fontFamily: 'ui-sans-serif, system-ui, sans-serif', padding: '24px 20px 60px' }}>
      <main style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 6px' }}>
          <span style={{ color: '#2dd4bf' }}>AQELVYN</span> — All Master Build Prompts
        </h1>
        <p style={{ color: '#8ab6b0', margin: '0 0 24px' }}>{all.length} AI + web3 master build-prompts. Click any to open its blueprint.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {all.map((e) => (
            <Link
              key={e.kind + e.id}
              href={`/p/${e.kind}/${e.id}`}
              title={titleFor(e)}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px', textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ fontSize: 20 }}>{e.emoji}</div>
              <div style={{ fontWeight: 700, marginTop: 6 }}>{e.name}</div>
              <div style={{ color: '#8ab6b0', fontSize: 12 }}>{e.category}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
