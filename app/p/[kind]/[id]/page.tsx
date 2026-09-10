import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  resolveKey, listAll, titleFor, descriptionFor, keywordsFor,
  entityJsonLd, urlFor, kindLabel, SITE_NAME, SITE_URL, Kind,
} from '@/lib/seo';
import { WEB3_PROMPTS } from '@/lib/data/web3';
import { buildWeb3Prompt } from '@/lib/server/prompts';

export function generateStaticParams() {
  return listAll().map((e) => ({ kind: e.kind, id: e.id }));
}

export function generateMetadata({ params }: { params: { kind: string; id: string } }): Metadata {
  const e = resolveKey(params.kind as Kind, params.id);
  if (!e) return { title: SITE_NAME };
  const title = titleFor(e);
  const desc = descriptionFor(e);
  return {
    title,
    description: desc,
    keywords: keywordsFor(e),
    alternates: { canonical: urlFor(e) },
    openGraph: {
      title, description: desc, url: urlFor(e), type: 'website',
      siteName: SITE_NAME, images: [{ url: `${SITE_URL}/api/og/${e.kind}/${e.id}`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [`${SITE_URL}/api/og/${e.kind}/${e.id}`] },
  };
}

const text = '#e8f6f4';
const dim = '#8ab6b0';
const accent = '#2dd4bf';

export default function PromptPage({ params }: { params: { kind: string; id: string } }) {
  const e = resolveKey(params.kind as Kind, params.id);
  if (!e) notFound();

  const isFree = params.kind === 'web3';
  const freePrompt = isFree
    ? buildWeb3Prompt(WEB3_PROMPTS.find((w) => w.id === params.id), { chain: 'cronos', wallet: '' })
    : null;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#041414,#062a2a 55%,#0b1f1f)', color: text, fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: '24px 20px 60px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entityJsonLd(e)) }} />

      <main style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 34 }}>{e.emoji}</span>
          <span style={{ fontWeight: 800, letterSpacing: '0.05em', fontSize: 18, color: accent }}>AQELVYN</span>
        </div>
        <p style={{ color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: 12, fontWeight: 700, margin: 0 }}>
          {kindLabel[e.kind]} · {e.category}
        </p>
        <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: '8px 0 12px', fontWeight: 800 }}>
          {e.name} — {isFree ? 'Free Web3 Build Prompt' : 'Master Build Prompt'}
        </h1>
        <p style={{ fontSize: 17, color: '#cfe3e6', lineHeight: 1.6, margin: '0 0 20px' }}>{descriptionFor(e)}</p>

        {e.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {e.tags.slice(0, 8).map((t) => (
              <span key={t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, padding: '6px 12px', fontSize: 13, color: dim }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {isFree && freePrompt ? (
          <>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 22px', marginBottom: 20 }}>
              <div style={{ color: '#fb923c', fontWeight: 700, letterSpacing: '0.08em', fontSize: 12, marginBottom: 14, textTransform: 'uppercase' }}>
                ⚡ Free prompt — copy & paste into ChatGPT, Claude or Gemini
              </div>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13.5, lineHeight: 1.6, color: text, margin: 0 }}>
                {freePrompt}
              </pre>
            </div>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: accent, color: '#041414', fontWeight: 700, padding: '12px 20px', borderRadius: 12, textDecoration: 'none' }}>
              ⚡ Get all 100 free web3 prompts in {SITE_NAME} →
            </a>
          </>
        ) : (
          <div style={{ background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.25)', borderRadius: 16, padding: '22px', marginTop: 4 }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 8px' }}>🔒 Unlock the full prompt</h2>
            <p style={{ color: dim, fontSize: 14.5, lineHeight: 1.6, margin: '0 0 16px' }}>
              The complete, deployable master build-prompt is unlocked on-chain for <b style={{ color: text }}>1 CRO</b> on Cronos — or unlock all 615+ prompts once for <b style={{ color: text }}>100 CRO</b>. Your payment is verified on the blockchain before the prompt opens.
            </p>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: accent, color: '#041414', fontWeight: 700, padding: '12px 20px', borderRadius: 12, textDecoration: 'none' }}>
              🔓 Unlock this prompt in {SITE_NAME} →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
