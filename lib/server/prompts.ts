// @ts-nocheck
// SERVER-ONLY prompt builders. Do NOT import from client components — these
// produce the gated (paid) content and must never be bundled into the browser.

import { CATEGORIES, REPO_CATEGORIES, APPS } from '../data/apps';
import { YT_GENRES } from '../data/youtube';
import { BRAND_SECTORS } from '../data/brands';
import { CHAIN_NAMES } from '../constants';
import { WEB3_CATEGORIES } from '../data/web3';

export function buildMasterPrompt(app: any, opts: any = {}) {
  const cat = CATEGORIES[app.cat];
  const name = opts.name || app.name;
  const chain = opts.chain || 'cronos';
  const chainName = CHAIN_NAMES[chain] || chain;
  const tagline = opts.tagline || app.tagline;
  const aiSel = opts.ai || cat.ai;
  const web3Sel = opts.web3 || cat.web3;
  const rev = opts.rev || cat.rev;
  const extras = opts.extras || [];

  const L: string[] = [];
  const hr = () => L.push('');

  L.push(`You are a world-class senior full-stack engineer, product designer, and Web3 architect. Build "${name}" — a production-grade, futuristic ${cat.name.toLowerCase()} application — from scratch, complete and deployable. Treat this spec as the single source of truth.`);
  hr();

  L.push(`# 1. PRODUCT IDENTITY`);
  L.push(`- Name: ${name}`);
  L.push(`- Category: ${cat.name} (${cat.emoji})`);
  L.push(`- One-liner: ${tagline}`);
  L.push(`- Positioning: the definitive ${app.name}-class product, but reinvented — faster, smarter, and natively web3.`);
  L.push(`- Tone: futuristic, premium, obsessively polished (dark UI with glassmorphism, neon accents, smooth 60fps motion).`);
  hr();

  L.push(`# 2. CORE FEATURES (from the ${app.name} blueprint)`);
  app.features.forEach((f: string) => L.push(`- ${f}`));
  L.push(`- Onboarding: email + social + wallet (SiWE / SIWS) sign-in, walkthrough, and a personalized setup flow.`);
  L.push(`- Profiles, settings, notifications (push + in-app), search with typeahead, and offline-first data sync.`);
  hr();

  L.push(`# 3. BUILT-IN AI — an AI copilot embedded in EVERY feature`);
  L.push(`Provide a context-aware "AI Assistant" reachable from anywhere in the app (floating action + command palette ⌘K). Wire AI into the following, with the assistant able to EXECUTE actions on the user's behalf (not just chat):`);
  aiSel.forEach((x: string) => L.push(`- ${x} — exposed as both an in-app surface and an API.`));
  L.push(`- Assistant capabilities: multi-step task execution, tool-use (call app APIs), memory of user context, undo/confirm for destructive actions.`);
  L.push(`- Implementation: pluggable LLM provider (default OpenAI-compatible endpoint) with a local fallback for offline basics; streaming responses; usage metering & quotas.`);
  hr();

  L.push(`# 4. BLOCKCHAIN & WEB3 — a TRUE web3 app, not a bolt-on`);
  L.push(`Target network: ${chainName}. Abstract complexity behind a wallet-connector that supports ${chain === 'solana' ? 'Phantom/Solana wallets (SPL tokens, Metaplex NFTs)' : 'EVM wallets via WalletConnect + injected (ERC-20/721/1155, EIP-712 signatures)'}. Key requirements:`);
  web3Sel.forEach((x: string) => L.push(`- ${x}`));
  L.push(`- Non-custodial by default; users own their assets, identity, and data. Private keys never touch your server.`);
  L.push(`- Gas-free UX where possible (meta-transactions / relayers / L2), with transparent fee previews.`);
  L.push(`- On-chain proof & verifiability for key actions; off-chain data on IPFS/Arweave with on-chain content hashes.`);
  hr();

  L.push(`# 5. MONETIZATION / REVENUE SHARE`);
  L.push(`Implement a transparent revenue model with configurable splits (creator/platform/affiliate), visible in an in-app dashboard:`);
  rev.forEach((x: string) => L.push(`- ${x}`));
  L.push(`- Revenue-share engine: on-chain escrow smart contract that auto-splits earnings per configured percentages; downloadable statements.`);
  if (opts.wallet) {
    L.push(`- REVENUE TREASURY (single source of truth): route 100% of ALL revenue — fees, subscriptions, commissions, revenue-share proceeds, tips — to this wallet address: ${opts.wallet} (on ${chainName}). The escrow/splitter contract MUST send every platform/owner payout to this exact address, hard-coded as the treasury. Surface this treasury address and its live balance + transaction history in the admin dashboard, and never derive or hard-code any other payout wallet.`);
  } else {
    L.push(`- REVENUE TREASURY: designate a single treasury wallet for all revenue and hard-code it into the escrow/splitter contract; surface its balance + history in the admin dashboard.`);
  }
  hr();

  L.push(`# 6. DESIGN SYSTEM`);
  L.push(`- Dark-first futuristic theme with light mode; CSS variables; glassmorphism panels; gradient accents (teal→orange).`);
  L.push(`- Component library (buttons, cards, modals, toasts, tables, charts) + design tokens; fully responsive & accessible (WCAG AA).`);
  L.push(`- Micro-interactions, skeleton loaders, empty states, error states, and a delightful loading experience.`);
  hr();

  L.push(`# 7. TECH STACK`);
  L.push(`- Frontend: React + TypeScript + Vite + Tailwind, or Next.js (App Router).`);
  L.push(`- Backend: Node.js (NestJS/Fastify) or serverless; Postgres + Prisma/Drizzle; Redis for cache/queues; S3-compatible storage.`);
  L.push(`- Realtime: WebSockets (or Socket.io) for live features; push via FCM/APNs.`);
  L.push(`- AI: OpenAI-compatible LLM + embeddings (pgvector); optional RAG over user data.`);
  L.push(`- Web3: ethers.js / viem ${chain === 'solana' ? '+ @solana/web3.js + Metaplex' : ''}; smart contracts in Solidity (or Rust/Anchor if Solana) with full test coverage (Hardhat/Foundry).`);
  L.push(`- Infra: Docker, CI/CD, monitoring (Sentry, Grafana), and a hosted preview URL.`);
  hr();

  if (extras.length) {
    L.push(`# 8. CUSTOMIZATION EXTRAS`);
    extras.forEach((x: string) => L.push(`- ${x}`));
    hr();
  }

  L.push(`# ${extras.length ? '9' : '8'}. DELIVERABLES & ACCEPTANCE CRITERIA`);
  L.push(`1. Fully working, deployable codebase with README, env.example, and seed data.`);
  L.push(`2. Working demo of every feature listed above, including AI execution and on-chain flows.`);
  L.push(`3. Smart contracts deployed to a testnet with verified source and a write-up of the token economics.`);
  L.push(`4. API docs (OpenAPI) and an admin dashboard for moderation, analytics, and revenue-split configuration.`);
  L.push(`5. A short product one-pager + roadmap (v1, v2, v3) to exceed its potential over time.`);
  L.push(`Build it completely — no placeholders, no TODOs. Where a choice is ambiguous, make the best product decision and document it.`);
  return L.join('\n');
}

export function buildRepoPrompt(repo: any, opts: any = {}) {
  const chainName = CHAIN_NAMES[opts.chain || 'cronos'] || opts.chain || 'Cronos';
  const rc = REPO_CATEGORIES[repo.cat];
  const L: string[] = [];
  L.push(`You are a world-class senior full-stack engineer. Integrate the open-source project "${repo.name}" (github.com/${repo.slug}) — a leading ${rc.name.toLowerCase()} tool — as a core building block of a production-grade app. Treat this spec as the single source of truth.`);
  L.push(``);
  L.push(`# 1. PROJECT`);
  L.push(`- Repo: github.com/${repo.slug}`);
  L.push(`- What it is: ${repo.desc}`);
  L.push(`- Language: ${repo.lang} · Popularity: ${repo.stars} stars · Use-case: ${rc.name}`);
  L.push(`- Key concepts: ${repo.tags.join(', ')}`);
  L.push(``);
  L.push(`# 2. INTEGRATION PLAN`);
  L.push(`- Install, configure, and vendor ${repo.name} into the app's stack following its official best practices and docs.`);
  L.push(`- Wire it into a working feature end-to-end (not a toy demo): auth, data flow, error handling, caching, and tests.`);
  L.push(`- Optimize for production: security, performance, observability, and cost.`);
  L.push(``);
  L.push(`# 3. AI & WEB3 (built-in)`);
  L.push(`- Add an AI copilot that executes actions and answers questions about the ${repo.name} integration (RAG over its docs + repo).`);
  L.push(`- On-chain where relevant: target ${chainName}; log build/config provenance and revenue events on-chain.`);
  if (opts.wallet) L.push(`- Route all revenue to treasury wallet: ${opts.wallet}.`);
  L.push(``);
  L.push(`# 4. DELIVERABLES`);
  L.push(`1. Working app with ${repo.name} integrated, deployable (README + env.example). 2. A concise "how it fits the architecture" write-up. 3. Config as code, CI, and tests. 4. Version/upgrade path and pinned versions. Build completely — no placeholders.`);
  return L.join('\n');
}

const YT_GOALS: Record<string, string[]> = {
  grow: ["Prioritize subscriber conversion: end every video with a strong subscribe CTA tied to a reason", "Create a content funnel (Shorts → long-form → series)", "Run weekly collabs & community calls-to-action", "Double down on the 1–2 formats driving the most subs"],
  monetize: ["Maximize RPM: longer videos, high watch time, advertiser-friendly topics", "Layer revenue streams: sponsorships, memberships, merch, affiliates", "Add mid-roll-friendly structure to every video", "Optimize sponsorship integration points (natural, non-skippable)", "Drive affiliate/product links in description & pinned comment"],
  authority: ["Position as the go-to expert: deep, well-researched, cite-backed content", "Build a signature series or framework people quote", "Publish evergreen pillar content that ranks for years", "Secure guest appearances & collaborations with authorities in the niche"],
  launch: ["Phase 1 (wk 1–2): define niche, 10-video backlog, brand kit", "Phase 2 (wk 3–4): launch with 3 videos + daily Shorts, target a specific audience", "Phase 3 (month 2): analyze retention, double down on what works", "Set 90-day milestones: 100 subs, 1k views/video, then scale"],
};

export function buildYTPrompt(opts: any) {
  const g = YT_GENRES.find((x: any) => x.id === opts.genreId) || YT_GENRES[0];
  const ch = opts.channel || null;
  const name = opts.name || (ch ? ch.name : 'My Channel');
  const goal = opts.goal || 'grow';
  const gLabel = g.name.replace(/\s*channel$/i, '').toLowerCase();
  const L: string[] = [];
  const push = (s: string) => L.push(s);
  push(`You are an elite YouTube strategist, scriptwriter, and content producer. Create a COMPLETE content-generation system for the YouTube channel "${name}" — a ${gLabel} channel. This is for CONTENT CREATION (planning & making videos), NOT for building an app.`);
  push(``);
  push(`# 1. CHANNEL IDENTITY`);
  push(`- Channel: ${name}`);
  push(`- Genre: ${g.name} ${g.emoji} — ${g.desc}`);
  push(`- Niche/topic: ${opts.niche || (ch ? "match the original channel's niche" : 'define your specific niche')}`);
  push(`- Target audience: ${g.audience}`);
  push(`- Value proposition: ${g.value_prop}`);
  if (ch) push(`- Signature style (to match): ${ch.style}`);
  push(`- Brand voice & visual identity: consistent logo, colors, fonts, intro/outro, and on-screen persona. Define the exact vibe a viewer should feel in the first 3 seconds.`);
  push(``);
  push(`# 2. CONTENT PILLARS & FORMATS`);
  push(`Content pillars (recurring themes every video falls into):`);
  const pillars = (ch && ch.pillars && ch.pillars.length) ? ch.pillars : g.pillars;
  pillars.forEach((p: string) => push(`- ${p}`));
  push(`Formats & content mix (long-form / Shorts / live / community):`);
  g.formats.forEach((f: string) => push(`- ${f}`));
  push(``);
  push(`# 3. STYLE BLUEPRINT (match this channel's signature style)`);
  g.style.forEach((s: string) => push(`- ${s}`));
  if (ch && ch.signatures && ch.signatures.length) {
    push(`Signature elements to preserve:`);
    ch.signatures.forEach((s: string) => push(`- ${s}`));
  }
  push(``);
  push(`# 4. VIDEO PRODUCTION PIPELINE (every aspect, end-to-end)`);
  push(`- Ideation: maintain a 50-idea backlog sourced from trends, comments, competitors, and the pillars above.`);
  push(`- Research & validation: check search demand, competitor performance, and the exact angle that differentiates you.`);
  push(`- Scripting: write a beat-by-beat script with a timed retention map (what happens at 0:00, 0:15, 1:00, etc.).`);
  push(`- Hooks & retention: front-load the payoff, state stakes early, and re-hook every 60–90 seconds.`);
  push(`- Filming: shot list, lighting, audio, and b-roll plan; capture 2–3x more footage than needed.`);
  push(`- Editing: cut ruthlessly for pacing, add motion graphics/SFX, color grade to a consistent look.`);
  push(`- Packaging: title, thumbnail, description, chapters, tags, pinned comment, and end screens.`);
  push(`- Post & distribution: schedule, publish, community post, Shorts cut-downs, and reply-to-comments sprint.`);
  push(``);
  push(`# 5. HOOKS, RETENTION & STORYTELLING`);
  g.hook.forEach((h: string) => push(`- ${h}`));
  push(`- Story structure: tension → escalation → payoff; never let the middle sag.`);
  push(``);
  push(`# 6. TITLES, THUMBNAILS & SEO`);
  g.seo.forEach((s: string) => push(`- ${s}`));
  push(``);
  push(`# 7. AI-ASSISTED WORKFLOW (built-in AI for the creator)`);
  g.ai_workflow.forEach((a: string) => push(`- ${a}`));
  push(``);
  push(`# 8. UPLOAD SCHEDULE & CADENCE`);
  push(`- ${g.schedule}`);
  push(``);
  push(`# 9. GROWTH & ENGAGEMENT STRATEGY`);
  g.growth.forEach((x: string) => push(`- ${x}`));
  push(`- Primary goal focus — ${YT_GOALS[goal][0]}:`);
  YT_GOALS[goal].forEach((x: string) => push(`- ${x}`));
  push(``);
  push(`# 10. MONETIZATION`);
  g.monetize.forEach((m: string) => push(`- ${m}`));
  push(``);
  push(`# 11. ANALYTICS & OPTIMIZATION (track & iterate)`);
  g.metrics.forEach((m: string) => push(`- ${m}`));
  push(`- Weekly review: drop the bottom 20% of videos' formats, double the top 20%.`);
  push(``);
  push(`# 12. WORKED EXAMPLE`);
  push(`- Title: ${g.example.title}`);
  push(`- Hook: ${g.example.hook}`);
  push(`- Outline:`);
  g.example.outline.forEach((o: string) => push(`  ${o}`));
  push(``);
  push(`Generate the full video plan, 5 ready-to-script title/hook options, and a 30-day content calendar for "${name}" based on all of the above. Be specific and complete — no placeholders.`);
  return L.join('\n');
}

const BRAND_GOALS: Record<string, string[]> = {
  engagement: ["Lead with immersive, engaging experiences (AR try-on, interactive content, community)", "Personalize every surface to the individual", "Surface the brand's story & values throughout", "Add social & shareable moments to drive word-of-mouth"],
  revenue: ["Optimize every flow for conversion & transaction", "Build seamless checkout/payment/booking", "Layer upsell, cross-sell & subscriptions", "Drive repeat purchase with smart offers"],
  loyalty: ["Design a best-in-class loyalty & rewards program", "Personalized tiers, streaks & milestones", "Exclusive member-only experiences & drops", "Reduce churn with proactive retention"],
  launch: ["Scope a focused MVP that nails the core value prop", "Ship fast with a modern stack", "Instrument analytics from day one", "Plan a 90-day roadmap to product-market fit"],
};

export function buildBrandPrompt(opts: any) {
  const sec = BRAND_SECTORS[opts.sectorId] || (BRAND_SECTORS as any).tech;
  const br = opts.brand || null;
  const name = opts.name || (br ? br.name : 'My Brand');
  const goal = opts.goal || 'engagement';
  const chainName = CHAIN_NAMES[opts.chain || 'cronos'] || opts.chain || 'Cronos';
  const L: string[] = [];
  const push = (s: string) => L.push(s);

  push(`You are a world-class senior full-stack engineer, product designer, and Web3 architect. Build "${name}" — a production-grade, futuristic app for the ${sec.name.toLowerCase()} brand "${name}", with built-in AI and native web3 perfectly wired to its exact use case. Treat this spec as the single source of truth.`);
  push(``);
  push(`# 1. BRAND IDENTITY`);
  push(`- Brand: ${name}`);
  push(`- Sector: ${sec.name} ${sec.emoji} — ${sec.desc}`);
  push(`- What it does: ${opts.desc || (br ? br.tagline : "define the brand's core business")}`);
  if (br && br.tagline && br.tagline !== opts.desc) push(`- One-liner: ${br.tagline}`);
  push(`- Target audience: ${sec.audience}`);
  push(`- Positioning: the definitive ${name} digital experience — premium, integrated, and natively AI + web3. Tone: polished, on-brand, futuristic (dark UI with glassmorphism + brand-accurate accents).`);
  push(``);
  push(`# 2. CORE APP FEATURES`);
  if (br && br.features && br.features.length) {
    push(`Brand-specific features (from the ${name} blueprint):`);
    br.features.forEach((f: string) => push(`- ${f}`));
  }
  push(`Sector-standard capabilities:`);
  sec.features.forEach((f: string) => push(`- ${f}`));
  push(`- Authentication & onboarding (email, social, wallet via SiWE/SIWS); profiles; notifications; search; offline-first sync.`);
  push(``);
  push(`# 3. BUILT-IN AI — an AI copilot embedded in every feature`);
  push(`Provide a context-aware "${name} AI Assistant" reachable everywhere (floating action + ⌘K) that can EXECUTE actions on the user's behalf. Wire AI into the brand's real use cases:`);
  sec.ai.forEach((x: string) => push(`- ${x}`));
  push(`- Pluggable LLM provider (OpenAI-compatible) + on-device privacy-preserving models for sensitive data; streaming; usage quotas; RAG over the brand's own content/catalog.`);
  push(``);
  push(`# 4. BLOCKCHAIN & WEB3 — a TRUE web3 app, wired to the brand`);
  push(`Target network: ${chainName}. Abstract complexity behind one wallet connector (EVM via WalletConnect + ${chainName.toLowerCase().includes('solana') ? 'Solana/Phantom' : 'Solana optional'}). Requirements:`);
  sec.web3.forEach((x: string) => push(`- ${x}`));
  push(`- Non-custodial by default; users own their identity, assets & data. Gas-free UX (relayers/L2) with transparent fee previews. On-chain proofs for key actions; off-chain data on IPFS/Arweave with content hashes.`);
  push(``);
  push(`# 5. MONETIZATION / REVENUE`);
  push(`Transparent revenue model with configurable splits (brand/partner/creator), visible in an admin dashboard:`);
  sec.rev.forEach((x: string) => push(`- ${x}`));
  if (opts.wallet) {
    push(`- REVENUE TREASURY (single source of truth): route 100% of ALL revenue to wallet ${opts.wallet} (on ${chainName}); hard-code it into the escrow/splitter contract and surface balance + history in the admin dashboard.`);
  } else {
    push(`- REVENUE TREASURY: designate a single treasury wallet for all revenue, hard-coded into the escrow/splitter contract.`);
  }
  push(``);
  push(`# 6. DESIGN SYSTEM`);
  push(`- Dark-first futuristic theme with light mode; CSS variables; glassmorphism; brand-accurate accent colors; full responsiveness & WCAG AA; micro-interactions, skeleton/empty/error states.`);
  push(`- Preserve the brand's visual identity (logo, typography, palette) so the app feels unmistakably "${name}".`);
  push(``);
  push(`# 7. TECH STACK`);
  push(`- Frontend: React + TypeScript + Vite/Next.js + Tailwind. Backend: Node.js (NestJS/Fastify) or serverless; Postgres + Prisma; Redis; S3. Realtime: WebSockets. AI: LLM + embeddings (pgvector). Web3: ethers.js/viem + Solidity (Hardhat/Foundry). Docker, CI/CD, monitoring.`);
  push(``);
  push(`# 8. PRIMARY GOAL — ${goal}`);
  BRAND_GOALS[goal].forEach((x: string) => push(`- ${x}`));
  push(``);
  push(`# 9. DELIVERABLES & ACCEPTANCE CRITERIA`);
  push(`1. Fully working, deployable codebase (README, env.example, seed data). 2. Working demo of every feature incl. AI execution and on-chain flows. 3. Smart contracts on testnet (verified) + token-economics write-up. 4. API docs + admin dashboard (incl. revenue-split config). 5. One-pager + roadmap (v1/v2/v3). Build completely — no placeholders or TODOs.`);
  return L.join('\n');
}

function detectAppType(text: string) {
  const t = text.toLowerCase();
  let best: any = null, score = 0;
  for (const a of APPS) {
    if (t.includes(a.name.toLowerCase())) { const s = a.name.length; if (s > score) { score = s; best = a; } }
  }
  return best;
}

export function enhancePrompt(raw: string, chain: string, userWallet: string) {
  const text = raw.trim();
  const app = detectAppType(text);
  const cat = app ? CATEGORIES[app.cat] : null;
  const out: string[] = [];
  const has = (s: string) => new RegExp(s, 'i').test(text);

  out.push('You are a world-class senior full-stack engineer, product designer, and Web3 architect. Build a complete, production-grade, futuristic application from scratch based on the spec below. Make the best product decision wherever the spec is ambiguous, and document it.');

  if (!has('name|identity|product name')) {
    const cls = app ? app.name + '-class product' : 'product';
    const space = cat ? ' in the ' + cat.name.toLowerCase() + ' space' : '';
    out.push('\n# PRODUCT IDENTITY\n- Build a ' + cls + space + '. Infer a compelling brand name if none is given.');
    out.push('- Positioning: futuristic, premium, natively AI and web3. Tone: polished dark UI with glassmorphism and neon accents.');
  }
  if (!has('feature|core feature')) {
    out.push(`\n# CORE FEATURES`);
    if (app) {
      out.push(`Model the core feature set on ${app.name} (${app.tagline}):`);
      app.features.forEach((f: string) => out.push(`- ${f}`));
    } else {
      out.push(`- Authentication & onboarding; user profiles; the primary workflow end-to-end; search & discovery; notifications; settings.`);
      out.push(`- Elaborate the primary user workflow into a detailed feature list.`);
    }
  }
  if (!has('artificial intelligence| AI |AI copilot|built-in ai|machine learning')) {
    out.push(`\n# BUILT-IN AI (an AI copilot embedded in every feature)`);
    const pts = cat ? cat.ai : ['AI recommendations & personalization', "AI assistant that can EXECUTE actions on the user's behalf", 'Smart search & content generation', 'AI-powered moderation & insights'];
    out.push(`Provide a context-aware AI assistant reachable everywhere (floating action + ⌘K) that can execute actions, not just chat. Wire AI into:`);
    pts.forEach((x: string) => out.push(`- ${x}`));
    out.push(`- Pluggable LLM provider (OpenAI-compatible) + local offline fallback; streaming; usage quotas.`);
  }
  if (!has('web3|blockchain|on-chain|smart contract|nft|crypto|token')) {
    out.push(`\n# BLOCKCHAIN & WEB3 (a TRUE web3 app, not a bolt-on)`);
    const pts = cat ? cat.web3 : ['Non-custodial wallet sign-in (SiWE / SIWS)', 'Token rewards & on-chain loyalty', 'NFT collectibles & token-gated access', 'On-chain provenance & verifiable data'];
    out.push(`Support EVM + Solana wallets behind one connector. Target network: ${CHAIN_NAMES[chain] || chain}. Requirements:`);
    pts.forEach((x: string) => out.push(`- ${x}`));
    out.push(`- Non-custodial; users own assets, identity & data. Gas-free UX via relayers/L2; on-chain escrow for transparent revenue splits.`);
  }
  if (!has('revenue|monet|pricing|business model')) {
    out.push(`\n# MONETIZATION & REVENUE SHARE`);
    const pts = cat ? cat.rev : ['Subscription tiers', 'Freemium + premium', 'Transaction fees', 'Marketplace commission'];
    out.push(`Transparent revenue model with configurable splits (creator/platform/affiliate) surfaced in an in-app dashboard:`);
    pts.forEach((x: string) => out.push(`- ${x}`));
  }
  if (userWallet) {
    out.push(`- REVENUE TREASURY (single source of truth): route 100% of ALL revenue to wallet ${userWallet} on ${CHAIN_NAMES[chain] || chain}; hard-code it into the escrow/splitter contract and surface balance + history in the admin dashboard.`);
  }
  if (!has('design|UI|UX|theme')) {
    out.push(`\n# DESIGN SYSTEM\n- Dark-first futuristic theme (light mode too), CSS variables, glassmorphism, gradient accents (teal→orange), full responsiveness, WCAG AA, micro-interactions, skeleton/empty/error states.`);
  }
  if (!has('tech stack|stack|react|next|node|postgres')) {
    out.push(`\n# TECH STACK\n- Frontend: React + TypeScript + Vite/Next.js + Tailwind. Backend: Node.js (NestJS/Fastify) or serverless; Postgres + Prisma; Redis; S3. Realtime: WebSockets. AI: LLM + embeddings (pgvector). Web3: ethers.js/viem + Solidity (Hardhat/Foundry). Docker, CI/CD, monitoring.`);
  }
  if (!has('deliver|acceptance|deploy|roadmap')) {
    out.push(`\n# DELIVERABLES & ACCEPTANCE CRITERIA\n1. Fully working, deployable codebase (README, env.example, seed data). 2. Working demo of every feature incl. AI execution and on-chain flows. 3. Smart contracts on testnet (verified) + token-economics write-up. 4. API docs + admin dashboard. 5. One-pager + roadmap (v1/v2/v3). Build completely — no placeholders or TODOs.`);
  }
  out.push(`\n# ORIGINAL SPEC (source of truth)\n${text}`);
  return out.join('\n');
}

// ---------------- FREE Web3 build-kit prompts (no payment required) ----------------
export function buildWeb3Prompt(e: any, opts: any = {}) {
  const c = WEB3_CATEGORIES[e.cat];
  const chain = opts.chain || 'cronos';
  const chainName = CHAIN_NAMES[chain] || chain;
  const wallet = (opts.wallet || '').toString().trim();
  const L: string[] = [];
  const hr = () => L.push('');

  L.push(`You are a world-class senior Web3 architect, smart-contract engineer (Solidity/Rust), full-stack developer, and tokenomics designer. Build "${e.name}" — a production-grade ${c.name} application — from scratch, complete and deployable. Treat this spec as the single source of truth; wherever it is ambiguous, make the best product decision and document it.`);
  hr();

  L.push(`# 1. PRODUCT IDENTITY`);
  L.push(`- Name: ${e.name}`);
  L.push(`- Category: ${c.name} ${c.emoji}`);
  L.push(`- One-liner: ${e.tagline}`);
  L.push(`- Target audience: ${c.audience}`);
  L.push(`- Tone: futuristic, premium, obsessively polished (dark UI with glassmorphism, neon accents, 60fps motion).`);
  hr();

  L.push(`# 2. CORE FEATURES`);
  e.features.forEach((f: string) => L.push(`- ${f}`));
  L.push(`- Onboarding: wallet connect (EVM via WalletConnect + injected; SVM via Phantom) or email/social login via account abstraction, plus a guided walkthrough.`);
  L.push(`- Dashboards: live portfolio, activity feed, transaction history with on-chain proof, and in-app notifications (push + email).`);
  hr();

  L.push(`# 3. BUILT-IN AI — an AI copilot embedded in EVERY feature`);
  L.push(`Provide a context-aware "AI Assistant" reachable from anywhere (floating action + ⌘K) that can EXECUTE on-chain actions, not just chat:`);
  c.ai.forEach((x: string) => L.push(`- ${x}`));
  L.push(`- Assistant capabilities: multi-step task execution, tool-use (call contract functions via a safe abstraction layer), memory of user context, and undo/confirm for irreversible actions.`);
  L.push(`- Implementation: pluggable LLM provider (OpenAI-compatible) with streaming responses, usage metering, and per-user quotas.`);
  hr();

  L.push(`# 4. WEB3 ARCHITECTURE & SMART CONTRACTS`);
  L.push(`Target network: ${chainName}. Design the contracts to be chain-agnostic and upgradeable where appropriate (proxy / diamond pattern), with a clear separation between core protocol and periphery:`);
  e.contracts.forEach((x: string) => L.push(`- ${x}`));
  L.push(`- Non-custodial by default; users own their assets, identity, and data. Private keys never touch your server.`);
  L.push(`- Gasless UX where possible (meta-transactions / ERC-4337 bundler + paymaster).`);
  L.push(`- On-chain proof & verifiability for key actions; off-chain data on IPFS/Arweave with on-chain content hashes.`);
  L.push(`- Emit rich events + a public subgraph/indexer so every state change is queryable.`);
  hr();

  L.push(`# 5. TOKENOMICS & MONETIZATION`);
  L.push(`Design a transparent token model with configurable splits, visible in an in-app dashboard:`);
  c.rev.forEach((x: string) => L.push(`- ${x}`));
  L.push(`- Revenue-share engine: on-chain escrow smart contract that auto-splits earnings per configured percentages; downloadable statements.`);
  if (wallet) {
    L.push(`- IMPORTANT: the treasury / revenue destination for ALL revenue, fees, and revenue-share must be the single wallet address: ${wallet}. Route every stream there — do not hard-code any other address.`);
  } else {
    L.push(`- Revenue destination: designate a single treasury wallet for ALL revenue streams (fees, splits, royalties). Make it a constructor/initializer argument so the deployer supplies it.`);
  }
  hr();

  L.push(`# 6. SECURITY (non-negotiable)`);
  L.push(`- Reentrancy guards (CEI pattern + ReentrancyGuard), overflow-checked math, and access-control (Ownable/RBAC).`);
  L.push(`- Oracle safety: staleness checks, deviation bounds, and circuit breakers for extreme moves.`);
  L.push(`- Rate limits, pause/emergency-withdraw, and a multisig (2-of-3) for admin keys.`);
  L.push(`- Comprehensive test suite (unit + integration + fork tests) targeting 90%+ coverage, plus a third-party audit checklist and a public bug-bounty policy.`);
  L.push(`- User-facing risk disclosures for every risky action (leverage, liquidation, impermanent loss).`);
  hr();

  L.push(`# 7. TECH STACK & DEPLOYMENT`);
  L.push(`- Frontend: Next.js 14 + TypeScript + Tailwind, wagmi/viem + RainbowKit (EVM) and/or @solana/web3.js + wallet adapter.`);
  L.push(`- Contracts: Solidity (Foundry/Hardhat) for EVM; Rust/Anchor for SVM.`);
  L.push(`- Indexing: The Graph / a custom indexer; RPC via a provider with fallbacks.`);
  L.push(`- Deploy with a script that REFUSES to run if the treasury wallet is unset or malformed.`);
  L.push(`- Ship as PWA + responsive; optional iOS/Android wrappers (Capacitor/React Native).`);
  hr();

  L.push(`# 8. LAUNCH & SUCCESS METRICS`);
  L.push(`- Ship an MVP within 4 weeks: core flow + one "wow" moment, then iterate weekly.`);
  L.push(`- Track: active users, volume, retention (D7/D30), TVL, and protocol revenue — with a public analytics dashboard.`);
  L.push(`- Growth loops: referral rewards, token incentives, and community (Discord/quests).`);

  return L.join('\n');
}
