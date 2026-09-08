# AQELVYN Studio — Free Deployment Guide

This guide walks you through deploying the app **completely free** on the most
popular hosts, with every feature (wallet connect, CRO paywall, unlock
persistence, generator, enhancer, vault) working as intended.

> **The one thing to understand:** the 1 CRO / 100 CRO paywall is verified
> **server-side** against the Cronos blockchain. For unlocks to *persist* (so a
> user doesn't lose access on refresh), the app needs a tiny bit of storage.
> Serverless hosts (Vercel, Netlify, Cloudflare) don't have a disk, so you point
> the app at a free **Upstash KV** database. Hosts with a real disk (Render,
> Railway, Fly.io) work with the built-in file store. Both paths are covered below.

---

## 0. What you'll need

1. The app source (this folder / the zip).
2. A **GitHub account** (Vercel, Netlify, Render, Railway all deploy from a repo).
3. *(Recommended)* A free **Upstash** account for unlock persistence on serverless hosts.
4. *(Optional)* A free **WalletConnect** project id (only needed for the fancy
   RainbowKit QR/phone connectors — plain MetaMask works without it).

---

## 1. Push the app to GitHub

```bash
# inside the app folder
git init
git add -A
git commit -m "AQELVYN Studio"
# create a new empty repo on github.com, then:
git remote add origin https://github.com/YOUR_USER/aqelvyn-studio.git
git branch -M main
git push -u origin main
```

> `node_modules/`, `.next/`, and `data/` are already in `.gitignore` — do **not**
> commit them.

---

## 2. (Recommended) Create a free Upstash KV database

This makes unlocks persist on Vercel/Netlify/Cloudflare. Skip if you only deploy
on Render/Railway/Fly with a disk.

1. Go to **https://upstash.com** → Sign up (free tier is generous).
2. Create a **Redis** database (the free tier is enough).
3. On the database page, choose **REST API** and copy:
   - `UPSTASH_REDIS_REST_URL`  →  this is your `KV_REST_API_URL`
   - `UPSTASH_REDIS_REST_TOKEN` →  this is your `KV_REST_API_TOKEN`

Keep these handy — you'll paste them as environment variables below.

---

## 3. Deploy — pick a host

### 🟢 Vercel (easiest — recommended)

1. Go to **https://vercel.com** → Sign up with GitHub.
2. **Add New → Project** → import `aqelvyn-studio`.
3. Vercel auto-detects Next.js (`vercel.json` is already in the repo). Click **Deploy**.
4. After the first deploy, open **Settings → Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `KV_REST_API_URL` | your Upstash REST URL |
   | `KV_REST_API_TOKEN` | your Upstash REST token |
   | `CRONOS_RPC_URL` | `https://evm.cronos.org` |
   | `VERIFY_SECRET` | any long random string |
   | `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | *(optional)* your WalletConnect id |
   | `NEXT_PUBLIC_SITE_URL` | your live domain (e.g. `https://your-app.vercel.app`) — powers sitemap/canonical/JSON-LD |

5. **Redeploy** (Deployments → ⋯ → Redeploy) so the env vars take effect.
6. Done — your app is live at `https://your-app.vercel.app`.

### 🟢 Netlify

1. Go to **https://netlify.com** → Sign up with GitHub.
2. **Add new site → Import an existing project** → pick the repo.
3. Netlify auto-detects Next.js via the `netlify.toml` already included. Deploy.
4. **Site configuration → Environment variables** — add the same vars as Vercel
   (table above).
5. Redeploy. Live at `https://your-app.netlify.app`.

### 🟢 Render

1. Go to **https://render.com** → Sign up with GitHub.
2. **New → Web Service** → connect the repo.
3. Set:
   - **Runtime:** Docker
   - **Build command:** *(auto from Dockerfile)*
   - **Start command:** *(auto — the Dockerfile runs `next start`)*
   - **Instance type:** Free
4. Under **Environment**, add `KV_REST_API_URL`, `KV_REST_API_TOKEN`,
   `CRONOS_RPC_URL`, `VERIFY_SECRET`.
5. Create. Live at `https://your-app.onrender.com`.

> Note: Render free services spin down after ~15 min idle and the disk is
> ephemeral, so **use Upstash KV** (not the file store) for unlock persistence.

### 🟢 Railway

1. Go to **https://railway.app** → Sign up with GitHub.
2. **New Project → Deploy from GitHub repo**.
3. Railway detects the Dockerfile. Deploy.
4. **Variables** tab → add the same four env vars.
5. Live at a `*.up.railway.app` URL.

> Railway offers a persistent **Volume** if you prefer the file store over
> Upstash: attach a volume at `/app/data`.

### 🟢 Fly.io

1. Install the CLI: `curl -L https://fly.io/install.sh | sh`, then `fly auth signup`.
2. ```bash
   fly launch --no-deploy   # it detects the Dockerfile
   fly secrets set KV_REST_API_URL=... KV_REST_API_TOKEN=... CRONOS_RPC_URL=https://evm.cronos.org VERIFY_SECRET=...
   fly deploy
   ```
3. Live at `https://your-app.fly.dev`.

---

## 4. Verify everything works

1. **Splash + catalog** load (325 apps + repos + channels + brands).
2. **Connect Wallet** opens RainbowKit; switch to **Cronos** when prompted.
3. The first unlock prompts a **sign-in (SiWE)** — approve the signature in your
   wallet to verify your identity.
4. Open any app → **Unlock (1 CRO)** → approve in wallet → after ~3 confirmations
   the prompt opens (fetched from the server only after verification).
5. **Unlock All (100 CRO)** correctly asks for 100 CRO.
6. Refresh the page — the unlock is still there (this confirms KV/disk persistence).
7. **Generator / Enhancer** charge 1 CRO per run and produce output.
8. **Vault** saves/copies prompts.
9. **SEO:** `/sitemap.xml` (617 URLs), `/robots.txt`, and the 615 `/p/…` landing
   pages + `/prompts` index are live — submit `sitemap.xml` in Google Search
   Console after the site is indexed.

---

## 5. Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Unlock works but is gone after refresh | Unlock store isn't persisting — set `KV_REST_API_URL` + `KV_REST_API_TOKEN` and redeploy. |
| "Switch to Cronos" keeps failing | Your wallet may not have Cronos added — click the chain icon in RainbowKit to add it, or the app auto-adds it. |
| Wallet modal shows only "Injected" | Normal — set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` for the full connector list. |
| Build fails with a BigInt error | Node < 18 — use Node 20 (set in `netlify.toml`/host settings). |
| `/api/verify` returns 429 | Rate limiting (30/min) — normal; wait a minute. |

---

## 6. Security posture (what's protected, what to know)

- ✅ Payments are real on-chain CRO transfers, verified server-side (sender,
  recipient, amount, confirmations).
- ✅ Unlock state is **server-authoritative** (can't be forged via localStorage).
- ✅ **Prompt content is generated server-side** and returned only to a verified,
  paid identity — the template text is **not** present in the client bundle.
- ✅ **SiWE wallet auth** binds unlocks to a cryptographic identity: the server
  recovers the message signer, so an attacker can't claim someone else's address.
- ✅ Treasury address never appears in the UI, prompt text, or client bundle.
- ✅ Unlock-all strictly requires 100 CRO; per-prompt requires 1 CRO.
- ✅ Rate-limited verification endpoint; strict input validation.
- ⚠️ Production hardening still recommended: rotate `VERIFY_SECRET` to a long
  random value, and optionally move the KV/JSON ledger to a per-user database.
