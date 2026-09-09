// Central SEO module — embedded in the codebase (head metadata, JSON-LD
// structured data, sitemap/robots), never rendered as visible UI.

import { CATEGORIES, APPS, REPO_CATEGORIES, REPOS } from './data/apps';
import { YT_GENRES, YT_CHANNELS } from './data/youtube';
import { BRAND_SECTORS, BRANDS } from './data/brands';
import { WEB3_CATEGORIES, WEB3_PROMPTS } from './data/web3';

export const SITE_NAME = 'AQELVYN Studio';
export const SLOGAN = 'From Prompt to Power';
// Canonical site URL. Resolution order:
//   1. NEXT_PUBLIC_SITE_URL (set explicitly, e.g. for a custom domain)
//   2. Vercel's auto-injected VERCEL_URL (so every deploy "just works")
//   3. fallback default
const VERCEL_AUTO = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || VERCEL_AUTO || 'https://aqelvyn.studio';
export const TAGLINE =
  'One studio to mold any app, brand, or channel into a complete, AI-powered, Web3-native product — built, owned & scaled by you.';
export const DESCRIPTION =
  `${TAGLINE} The #1 AI prompt library & web3 app-builder: 615+ master build-prompts, an AI prompt enhancer, and an on-chain prompt marketplace. Turn any idea into a production-grade app with built-in AI + native web3.`;

// ---------------------------------------------------------------------------
// Viral / high-intent keywords — what the target audience actually searches for.
// Consolidated, de-duplicated keyword bank shared across meta + JSON-LD.
// ---------------------------------------------------------------------------
export const KEYWORDS: string[] = [
  // AI prompts / prompt engineering (high-volume evergreen)
  'best AI prompts', 'AI prompt library', 'prompt marketplace', 'prompt database',
  'ChatGPT prompts', 'Claude prompts', 'Gemini prompts', 'GPT-4 prompts',
  'prompt engineering', 'prompt generator', 'AI prompt generator', 'prompt enhancer',
  'mega prompts', 'master prompts', 'super prompts', 'prompt templates',
  'AI prompt collections', 'premium prompts', 'free AI prompts', 'advanced prompts',
  'prompt engineering guide', 'prompt to code', 'prompt to app', 'text to app',
  // AI app building
  'build an app with AI', 'AI app builder', 'AI app generator', 'no-code AI app builder',
  'AI coding prompts', 'AI software generator', 'AI SaaS builder', 'app idea generator',
  'SaaS ideas', 'startup ideas', 'app blueprints', 'app clone prompts',
  'clone app prompts', 'build a clone of', 'rebuild an app with AI',
  'AI MVP builder', 'generate an app', 'AI full-stack builder',
  // Web3 / crypto
  'web3 app builder', 'blockchain app prompts', 'crypto app ideas', 'dApp builder',
  'build a dApp', 'DeFi app prompts', 'NFT app prompts', 'smart contract app',
  'web3 startup ideas', 'crypto startup ideas', 'token-gated app', 'on-chain app',
  'web3 SaaS', 'blockchain development prompts', 'crypto AI app', 'web3 AI tools',
  // Prompt NFTs / monetization
  'prompt NFTs', 'NFT prompts', 'mint a prompt', 'sell AI prompts', 'prompt monetization',
  'AI prompt marketplace crypto', 'tokenized prompts',
  // YouTube / content
  'YouTube content ideas', 'YouTube channel prompts', 'viral video prompts',
  'YouTube growth prompts', 'content generation prompts', 'AI content prompts',
  'viral content prompts', 'YouTube script prompts', 'content creator prompts',
  // Brand building
  'brand app builder', 'brand app prompts', 'build an app for a brand',
  'brand AI app', 'web3 brand app', 'app for my business',
  // Category long-tails (generated per entity)
  'AI productivity apps', 'AI messaging apps', 'AI social media apps',
  'AI finance apps', 'AI ecommerce apps', 'AI education apps', 'AI travel apps',
  'AI food delivery apps', 'AI streaming apps', 'AI music apps', 'AI crypto apps',
  'AI editing apps', 'AI healthcare apps', 'AI gaming apps',
];

// ---------------------------------------------------------------------------
// Entity model — resolves a catalog key to a rich, SEO-friendly descriptor.
// The actual paywalled prompt text is NEVER included here.
// ---------------------------------------------------------------------------
export type Kind = 'app' | 'repo' | 'yt' | 'brand' | 'web3';

export interface SeoEntity {
  kind: Kind;
  id: string;
  name: string;
  emoji: string;
  category: string;      // human category name
  categoryEmoji: string;
  tagline: string;
  tags: string[];        // keyword-rich feature/topic tags
  color: string;
}

function appEntity(a: any): SeoEntity {
  const c = CATEGORIES[a.cat];
  return {
    kind: 'app', id: a.id, name: a.name, emoji: a.emoji,
    category: c.name, categoryEmoji: c.emoji, tagline: a.tagline,
    tags: a.features || [], color: c.color,
  };
}
function repoEntity(r: any): SeoEntity {
  const c = REPO_CATEGORIES[r.cat];
  return {
    kind: 'repo', id: r.id, name: r.name, emoji: r.emoji,
    category: c.name, categoryEmoji: c.emoji,
    tagline: r.desc || '', tags: r.tags || [r.lang], color: c.color,
  };
}
function ytEntity(ch: any): SeoEntity {
  const g = YT_GENRES.find((x: any) => x.id === ch.genre);
  return {
    kind: 'yt', id: ch.id, name: ch.name, emoji: ch.emoji,
    category: g?.name || 'YouTube', categoryEmoji: g?.emoji || '🎬',
    tagline: ch.style || '', tags: ch.pillars || [], color: g?.color || '#f43f5e',
  };
}
function brandEntity(b: any): SeoEntity {
  const s = BRAND_SECTORS[b.sector];
  return {
    kind: 'brand', id: b.id, name: b.name, emoji: b.emoji,
    category: s.name, categoryEmoji: s.emoji, tagline: b.tagline || '',
    tags: b.features || [], color: s.color,
  };
}
function web3Entity(w: any): SeoEntity {
  const c = WEB3_CATEGORIES[w.cat];
  return {
    kind: 'web3', id: w.id, name: w.name, emoji: w.emoji,
    category: c.name, categoryEmoji: c.emoji, tagline: w.tagline || '',
    tags: w.features || [], color: c.color,
  };
}

export function resolveKey(kind: Kind, id: string): SeoEntity | null {
  if (kind === 'app') { const a = APPS.find((x: any) => x.id === id); return a ? appEntity(a) : null; }
  if (kind === 'repo') { const r = REPOS.find((x: any) => x.id === id); return r ? repoEntity(r) : null; }
  if (kind === 'yt') { const c = YT_CHANNELS.find((x: any) => x.id === id); return c ? ytEntity(c) : null; }
  if (kind === 'brand') { const b = BRANDS.find((x: any) => x.id === id); return b ? brandEntity(b) : null; }
  if (kind === 'web3') { const w = WEB3_PROMPTS.find((x: any) => x.id === id); return w ? web3Entity(w) : null; }
  return null;
}

export function listAll(): SeoEntity[] {
  return [
    ...APPS.map(appEntity),
    ...REPOS.map(repoEntity),
    ...YT_CHANNELS.map(ytEntity),
    ...BRANDS.map(brandEntity),
    ...WEB3_PROMPTS.map(web3Entity),
  ];
}

export const kindLabel: Record<Kind, string> = {
  app: 'App Blueprint Prompt',
  repo: 'Open-Source Repo Prompt',
  yt: 'YouTube Content Prompt',
  brand: 'Brand App Prompt',
  web3: 'Free Web3 Build Prompt',
};

// ---------------------------------------------------------------------------
// Per-entity title / description / keywords / URL — tuned for CTR + relevance.
// ---------------------------------------------------------------------------
export function slugFor(e: SeoEntity): string {
  return `${e.id}`;
}
export function urlFor(e: SeoEntity): string {
  return `${SITE_URL}/p/${e.kind}/${e.id}`;
}

export function titleFor(e: SeoEntity): string {
  const n = e.name;
  if (e.kind === 'app') return `${n} Clone & AI App Blueprint | Master Build Prompt`;
  if (e.kind === 'repo') return `${n} (${e.category}) — Master Build Prompt`;
  if (e.kind === 'yt') return `${n} YouTube Content Prompt & Growth System`;
  if (e.kind === 'brand') return `${n} App — AI + Web3 Brand Blueprint Prompt`;
  return `${n} — Free Web3 Build Prompt (${e.category})`;
}

export function descriptionFor(e: SeoEntity): string {
  const n = e.name;
  const cat = e.category;
  const base = `Get the production-grade master build-prompt for ${n} (${cat}).`;
  if (e.kind === 'app')
    return `${base} Rebuild ${n} from scratch with built-in AI + native web3, monetization, and revenue-share — a complete, deployable blueprint.`;
  if (e.kind === 'repo')
    return `${base} Rebuild & extend ${n} with built-in AI + native web3 — the definitive open-source master prompt for ${e.tagline || n}.`;
  if (e.kind === 'yt')
    return `${base} A complete content-generation system — viral ideas, scripts, formats & growth playbook for the ${n} channel.`;
  if (e.kind === 'brand')
    return `${base} Build a full app for ${n} with built-in AI + native web3 wired to its exact use case.`;
  return `Free master build-prompt for a ${e.name} (${cat}). Build it from scratch with built-in AI + native web3, smart contracts, tokenomics & security — no payment required.`;
}

export function keywordsFor(e: SeoEntity): string[] {
  const k: string[] = [
    `${e.name.toLowerCase()} prompt`, `${e.name.toLowerCase()} ai prompt`,
    `${e.name.toLowerCase()} app`, `build ${e.name.toLowerCase()} with ai`,
    `${e.name.toLowerCase()} clone prompt`, `${e.category.toLowerCase()} prompt`,
    `${e.category.toLowerCase()} app prompt`, `master build prompt`,
    'ai prompt', 'web3 app', 'blockchain app', 'prompt library',
  ];
  if (e.kind === 'web3') {
    k.push('free web3 prompts', 'defi app prompt', 'dex prompt', 'gamefi prompt',
      'tokenization prompt', 'smart contract prompt', 'web3 build prompt',
      'nft app prompt', 'dao prompt', 'crypto app prompt');
  }
  return k.concat(e.tags.slice(0, 5).map((t) => `${t.toLowerCase()} prompt`));
}

// ---------------------------------------------------------------------------
// JSON-LD structured data builders (schema.org) — embedded in <head>, not UI.
// ---------------------------------------------------------------------------
export function websiteJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'AQELVYN',
    url: SITE_URL,
    description: DESCRIPTION,
    slogan: SLOGAN,
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-main.png`,
    slogan: SLOGAN,
    description: DESCRIPTION,
    sameAs: [
      'https://discord.gg/WUxR2w8zM7',
      'https://twitter.com/aqelvyn',
      'https://x.com/aqelvyn',
      'https://www.instagram.com/aqelvyn',
      'https://www.tiktok.com/@aqelvyn',
      'https://www.facebook.com/aqelvyn',
      'https://www.youtube.com/@aqelvyn',
      'https://www.linkedin.com/company/aqelvyn',
    ],
  };
}

export function softwareAppJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${SITE_NAME} — AI + Web3 Prompt Library`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description: DESCRIPTION,
    offers: { '@type': 'Offer', price: '1', priceCurrency: 'CRO' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '1284' },
    keywords: KEYWORDS.join(', '),
  };
}

export function entityJsonLd(e: SeoEntity): object {
  const url = urlFor(e);
  const kw = keywordsFor(e);
  const main: Record<string, any> = {
    '@type': 'SoftwareApplication',
    name: `${e.name} — ${kindLabel[e.kind]}`,
    url,
    description: descriptionFor(e),
    applicationCategory: e.kind === 'yt' ? 'MultimediaApplication' : 'DeveloperApplication',
    operatingSystem: 'Web',
    keywords: kw.join(', '),
    about: e.tags.slice(0, 6).map((t) => ({ '@type': 'Thing', name: t })),
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      main,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: e.category, item: `${SITE_URL}/#${e.kind}` },
          { '@type': 'ListItem', position: 3, name: e.name, item: url },
        ],
      },
    ],
  };
}

export function faqJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question', name: 'What is AQELVYN Studio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AQELVYN Studio is an AI prompt library and web3 app-builder with 615+ master build-prompts that turn any app, brand, or YouTube channel into a complete, AI-powered, Web3-native product.',
        },
      },
      {
        '@type': 'Question', name: 'How do the prompts work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Each master prompt is a complete, deployable blueprint covering product identity, core features, built-in AI, native web3, monetization, and security. Paste it into ChatGPT, Claude, or Gemini to generate a full app.',
        },
      },
      {
        '@type': 'Question', name: 'Are the prompts web3-native?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every prompt wires in native web3 — on-chain identity, token/NFT utilities, crypto payments, and smart-contract revenue-share — and is chain-agnostic so you pick the network.',
        },
      },
      {
        '@type': 'Question', name: 'How much does it cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Each prompt unlocks for 1 CRO on Cronos, verified on-chain, or unlock the entire library once for 100 CRO.',
        },
      },
    ],
  };
}
