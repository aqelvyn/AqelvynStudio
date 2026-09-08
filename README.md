# AQELVYN Studio (Next.js)

The React/Next.js rebuild of AQELVYN Studio — a web3/AI-enabled prompt studio with
**615 master build-prompts** across Apps, Open-Source Repos, YouTube channels, and
Brands, plus a Generator and AI Enhancer.

> "From Prompt to Power" — one studio to mold any app, brand, or channel into a
> complete, AI-powered, Web3-native product.

Includes **100 free Web3 build prompts** ("⚡ Free Kit") covering DeFi, DEX &
liquidity, GameFi, gamification, SocialFi, launchpads, asset/RWA tokenization
(asset-to-token converters), NFT marketplaces, wallets & identity, and
infrastructure — full master prompts, **no payment or wallet required**.

## Stack

- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript.
- **Wallet:** wagmi 2 + viem 2 + RainbowKit (Cronos chain, injected + WalletConnect).
- **Backend:** Next.js API routes — on-chain payment verification + a server-side
  unlock ledger.

## Security architecture (enforcement is server-side)

The 1 CRO / 100 CRO paywall **and the prompt content itself** are enforced by the
backend, never the browser.

**Wallet auth (SiWE).** Every privileged API call first requires a
Sign-In-with-Ethereum session: the client requests a nonce (`/api/auth/nonce`),
signs the message with the connected wallet, and POSTs the signature to
`/api/auth/verify`, which recovers the signer on-chain-side and issues a short-lived
HMAC-signed session token. This cryptographically proves the caller owns the wallet,
so unlocks bind to a real identity — an attacker cannot just claim someone else's
address.

**Server-side prompt generation.** Prompt templates are built **only** on the server
(`lib/server/prompts.ts`) and returned through gated routes — they are **not** in the
client bundle, so a non-payer cannot read the paywalled content from the JS. The
client ships only public catalog metadata (names, emojis, feature tags).

Payment + content flow:

1. Client fetches `/api/payment` → gets the treasury address + prices (the treasury
   is **never** baked into the client bundle).
2. Client signs in (SiWE) to obtain a session token.
3. Client sends the CRO transaction and POSTs the tx hash to `/api/verify`.
4. `/api/verify` checks the Cronos transaction on-chain and enforces **all** of:
   - `tx.from == claimed address` (the payer must be the wallet claiming the unlock)
   - `tx.to == treasury`
   - `tx.value >= price` (1 CRO per prompt; **100 CRO for unlock-all**)
   - `confirmations >= 3`
   Only then does it record the unlock in the server-side ledger and return an
   HMAC-signed token.
5. To read a prompt, the client POSTs the key to `/api/prompt` (with the session
   token); the server returns the built prompt **only if** that identity has an
   unlock on record. Generator (`/api/generate`) and Enhancer (`/api/enhance`)
   verify a fresh 1 CRO payment per attempt before returning anything.
6. `/api/unlocks?address=…` returns the wallet's unlocks so the UI reflects only
   what the server has verified.

The unlock ledger uses a portable backend: **Upstash/Vercel KV** if configured
(persists on serverless hosts), else a **local JSON file** (for hosts with a disk),
else in-memory. See `lib/server/store.ts`.

The treasury address (`lib/server/treasury.ts`) is **server-only** — it is never
in the UI, never in prompt text, and never in the client bundle (verified at build
time). Prompts engrave the user's own wallet via the "Your revenue wallet" field.

## SEO (embedded in the codebase, not the UI)

Technical SEO is baked in at the source level so the app is maximally
discoverable for high-intent searches ("best AI prompts", "web3 app builder",
"build an app with AI", "master build prompts", …):

- **Head metadata** (`app/layout.tsx`) — title, description, keyword bank, Open
  Graph + Twitter cards, canonical URLs, and an OG banner image
  (`public/og-banner.png`).
- **JSON-LD structured data** — `WebSite` (with SearchAction), `Organization`,
  `SoftwareApplication` (with offer + aggregate rating), and `FAQPage`, plus a
  per-prompt `SoftwareApplication` + `BreadcrumbList`.
- **615 static, indexable prompt pages** (`/p/[kind]/[id]`) — one unique,
  keyword-optimized, server-rendered landing page per catalog entry (apps,
  repos, YouTube, brands). These carry the public metadata only — **the paid
  prompt text stays gated server-side** and never appears on them.
- **`/prompts` index** — a crawlable hub linking all 615 prompt pages.
- **`sitemap.xml`** (617 URLs), **`robots.txt`**, and a **PWA `manifest`** —
  auto-generated from `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`.

The keyword bank and all title/description/JSON-LD generators live in
`lib/seo.ts`. Set `NEXT_PUBLIC_SITE_URL` to your real domain so sitemap,
canonical links, and JSON-LD resolve correctly.

> Note: on-page/technical SEO is the foundation. Ranking #1 for competitive
> terms also requires off-page signals (backlinks, domain authority, and content
> marketing) that no code can generate — but this gives the app the strongest
> possible technical starting position.

## Run

```bash
npm install
npm run dev      # http://localhost:3000  (development)
npm run build && npm run start   # production
```

## Environment (`.env.local`)

```bash
KV_REST_API_URL=…                   # Upstash/Vercel KV (persist unlocks on serverless)
KV_REST_API_TOKEN=…
CRONOS_RPC_URL=https://evm.cronos.org
TREASURY=0x...                        # optional override
VERIFY_SECRET=long-random-string      # HMAC secret for unlock tokens
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=…  # for WalletConnect (injected wallets work without it)
```

## Notes

- Unlock persistence: use Upstash KV on serverless hosts (Vercel/Netlify/Cloudflare);
  the local JSON file works on hosts with a persistent disk (Render/Railway/Fly).
- SiWE sessions are stateless HMAC tokens (no server session store required); set
  `VERIFY_SECRET` to a long random value in production.

## Deployment

See **DEPLOYMENT_GUIDE.md** for free hosting walkthroughs (Vercel, Netlify, Render,
Railway, Fly.io) and the exact env-variable steps for each.
