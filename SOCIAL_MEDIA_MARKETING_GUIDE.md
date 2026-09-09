# AQELVYN Studio — Social Media Marketing & SEO Playbook

> A complete, step-by-step launch-and-growth plan across X (Twitter), Facebook,
> TikTok, Instagram, YouTube, Discord, and LinkedIn — engineered to feed the
> site's SEO and rank #1 for "best AI prompts", "web3 app builder",
> "master build prompts", and related searches.

**Product to market:** AQELVYN Studio — 615+ master build-prompts (apps, repos,
YouTube channels, brands) + 100 free Web3 build prompts (DeFi, DEX, GameFi,
SocialFi, launchpads, RWA tokenization, NFTs, wallets) + AI Enhancer + on-chain
prompt marketplace (1 CRO / 100 CRO on Cronos).

**The one strategy that ties everything together:** every social post links to a
*deep page* on the site (e.g. `aqelvyn.studio/p/app/app-000`), not just the
homepage. Deep links build page-level authority, and every backlink + social
signal raises the whole domain. This is the fastest path to ranking #1.

---

## 0. Before you post anything (30 minutes, do once)

1. **Buy the domain** `aqelvyn.studio` (or your chosen domain) and set
   `NEXT_PUBLIC_SITE_URL` in your Vercel env vars to it. (Already in the codebase.)
2. **Register the same handle everywhere** so you're findable and consistent:
   - X: `@aqelvyn`
   - Instagram: `@aqelvyn`
   - TikTok: `@aqelvyn`
   - Facebook: `facebook.com/aqelvyn`
   - YouTube: `youtube.com/@aqelvyn`
   - Discord: `discord.gg/WUxR2w8zM7` (already live — reuse it)
   - LinkedIn: `linkedin.com/company/aqelvyn`
3. **Create the visual kit** (reuse what you already have):
   - Profile photo: `public/logo-main.png` (the square logo).
   - Cover/banner: `public/og-banner.png` (1200×630) — resize per platform.
   - Bio photo for TikTok/IG: `logo-splash.png`.
4. **Wire the profiles into the site's JSON-LD** so Google links your socials to
   your domain (this is a real SEO signal). In `lib/seo.ts`, update the
   `organizationJsonLd()` `sameAs` array to list ALL your profile URLs:

   ```ts
   sameAs: [
     'https://discord.gg/WUxR2w8zM7',
     'https://twitter.com/aqelvyn',
     'https://www.instagram.com/aqelvyn',
     'https://www.tiktok.com/@aqelvyn',
     'https://www.facebook.com/aqelvyn',
     'https://www.youtube.com/@aqelvyn',
     'https://www.linkedin.com/company/aqelvyn',
   ],
   ```

   Then `npm run build` and redeploy. (I can do this for you — say the word.)
5. **Set up Google Search Console + Bing Webmaster Tools** and submit
   `https://aqelvyn.studio/sitemap.xml` (717 URLs). This is the #1 thing that
   gets you indexed and ranking.
6. **Install a link-in-bio** (Linktree/Beacons, or a custom page) pointing to:
   Home → Free Kit (`/`), one flagship prompt page, Discord, and the sitemap.

---

## 1. X / Twitter — the #1 channel for web3 + AI

**Why it matters:** crypto/AI audiences live here. This is where the "viral
prompt" content spreads fastest and where search + discovery overlap.

### Setup
- Handle: `@aqelvyn` · Bio template:
  > "615+ AI master build-prompts + 100 FREE Web3 prompts. Build any app with
  > AI + native web3. From Prompt to Power ⚡ discord.gg/WUxR2w8zM7"
- Pin a thread that links the Free Kit + a flagship prompt page.
- Enable Professional mode → set category "Software" / "AI".

### What to post (weekly rhythm)
| Day | Post type | Example |
|---|---|---|
| Mon | **Free prompt drop** | "Here's a FREE master prompt: build a full DeFi lending protocol (smart contracts + AI risk engine). Grab it → [deep link]" |
| Tue | **Prompt thread** 🧵 | "10 prompts to build a DEX from scratch. 1/11 →" each tweet links a `/p/` page |
| Wed | **Build-in-public** | Screenshot of the app + what you shipped |
| Thu | **Hot take / education** | "You don't need to code to ship a web3 app in 2026. Here's how." |
| Fri | **Community** | RT a builder using a prompt + Q&A |
| Sat | **Meme / relatable** | "When your prompt finally compiles" |
| Sun | **Recap + CTA** | "This week's 7 best prompts → [link]" |

### Hashtags (rotate 3–5 per post)
```
#AIprompts #web3 #promptengineering #buildinpublic #crypto #DeFi #GameFi
#SmartContracts #appbuilder #nocode #AI #ChatGPT #Claude #megaPrompt
```

### SEO tie-in
- Every link uses a **deep URL** (`/p/app/app-000`, `/p/web3/w3-000`) — never
  only the homepage. Google counts each as a distinct signal.
- Pin the tweet that links your **sitemap-heavy pages** (Free Kit, `/prompts`).

### KPIs
- 1 thread + 1 prompt drop per week minimum.
- Target: 3–5% engagement rate; 50+ link clicks/week.

---

## 2. Facebook — reach + a community hub

**Why it matters:** broad demographic, strong for building a *named* page that
Google ranks and that feeds SEO via page links.

### Setup
- Create a **Page** (not profile): `facebook.com/aqelvyn`, category "Software".
- Profile = logo, cover = og-banner. Add the website URL in the About section
  (this is a direct backlink).
- Add the "Sign Up" button → link to the Free Kit page.

### What to post
- **Carousel posts**: "5 prompts to build a tokenization app" — each slide a
  screenshot, final slide → deep link.
- **Video** (upload natively, 60–90s): "What is AQELVYN Studio?"
- **Groups**: join AI + web3 Facebook Groups and answer questions by linking
  relevant prompts (soft sell, high trust).

### SEO tie-in
- The About → website link + every post's link add to your backlink profile.
- Share your `/prompts` index and each new free prompt page as it ships.

### KPIs
- 3 posts/week; join 3 relevant groups/week and add value before linking.

---

## 3. TikTok — virality engine

**Why it matters:** TikTok's algorithm can make a single video explode, and
TikTok search is a *real* search engine now (Gen Z "searches" TikTok first).

### Setup
- `@aqelvyn` bio: "Build any app with AI + web3 ⚡ 100 FREE prompts ↓ link in bio".
- Link the Free Kit in bio.

### Content formats (native, vertical 9:16, 15–40s)
1. **"Prompt → result"** — screen-record pasting a prompt into ChatGPT, show the
   app idea it generates.
2. **Listicle voiceover** — "3 prompts to build a crypto app (no code)".
3. **Reaction/duet** to AI + crypto trends.
4. **Hook-first educational** — "This prompt replaces a $50k dev team."
5. **Behind the scenes** — building AQELVYN itself (build-in-public pulls huge).

### Formula that works
- Hook in first 1.5s ("This free prompt builds a whole DEX").
- Mid: show the prompt being used, tease 2 more.
- End: "All 100 free prompts → link in bio."

### Hashtags
```
#ai #web3 #crypto #prompts #chatgpt #nocode #tech #buildinpublic #defi #gamefi
```

### SEO tie-in
- TikTok links are no-follow but drive **direct traffic** (a ranking signal) and
  branded searches ("aqelvyn") which Google rewards.
- Put the exact prompt page URL in your bio link + video captions.

### KPIs
- 1 video/day for 30 days; watch 3 viral formats and double down.

---

## 4. Instagram — visual brand + Reels

**Why it matters:** Reels = TikTok's algorithm; IG bio link + link stickers
drive traffic; strong for the "premium dark UI" aesthetic.

### Setup
- `@aqelvyn` bio: "⚡ 615+ AI master prompts + 100 FREE web3 prompts · link in bio".
- Highlight covers: "Free Kit", "Web3", "Apps", "Brands".

### Content
- **Carousels** (high saves = algorithm boost): "7 prompts to build a GameFi app".
- **Reels** (cross-post your TikToks).
- **Story polls/quiz**: "Which should we drop next — DeFi or SocialFi prompt?"
- **Quote cards**: one powerful line from a prompt per post (branded, teal/orange).

### SEO tie-in
- Link in bio + Story link stickers → deep pages.
- Geotag + alt-text on every image (IG alt-text is indexed).

### KPIs
- 3 Reels + 2 carousels/week; aim for saves (they're the strongest IG signal).

---

## 5. YouTube — long-form authority (feeds Google directly)

**Why it matters:** YouTube is the #2 search engine and owned by Google — videos
rank in Google Search and build massive topical authority.

### Setup
- `youtube.com/@aqelvyn`, channel art = og-banner, watermark = logo.
- Every description: first line = hook + link, then 3–5 links to prompt pages.

### Content
1. "Build a DEX with AI (step-by-step, no code)" — 10–15 min.
2. "100 free web3 prompts — every category explained."
3. Prompt walkthroughs for each of the 10 Free Kit categories.

### SEO tie-in
- YouTube descriptions + cards + pinned comments → deep links.
- Transcribe videos (auto-captions) — the transcript text is indexed.

### KPIs
- 1 video/week; every video links 3 prompt pages.

---

## 6. Discord — retention & community (the moat)

**Why it matters:** your CTA everywhere funnels here; a live community = repeat
traffic, social proof, and word-of-mouth that compounds SEO.

### Setup (your server `discord.gg/WUxR2w8zM7`)
1. Channels: `#welcome`, `#announcements`, `#free-prompts`, `#builders`,
   `#showcase`, `#support`, `#token-talk`.
2. A **welcome bot** (MEE6/Carl-bot) that DMs new members a free prompt link.
3. A **daily prompt bot** (can be a simple webhook) posting 1 free prompt/day
   with its deep link.
4. Onboarding: reaction-role → unlock `#builders`.

### SEO tie-in
- The Discord URL is already in your JSON-LD `sameAs`.
- Announce every new prompt page in `#announcements` → members click → direct
  traffic + social signals.

### KPIs
- 100 members in 30 days; 1 daily prompt post; weekly AMA.

---

## 7. LinkedIn — B2B / founder credibility

**Why it matters:** high domain authority; company page + founder posts rank well
in Google and attract builders/investors.

### Setup
- Company page `linkedin.com/company/aqelvyn`, category "Software Development".
- Founder posts weekly build-in-public + "AI × web3" thought leadership.

### Content
- "How I built a web3 app with one prompt" (carousel PDF).
- Link company page → website in every post.

---

## 8. Bonus channels that boost SEO fastest

- **Medium / dev.to / Hashnode** — republish each prompt guide as an article with
  a do-follow link back to the matching `/p/` page. *This is the single highest-ROI
  backlink play.* 2 articles/week.
- **Product Hunt** — launch AQELVYN (a launch = huge referral traffic + backlinks).
- **Reddit** — r/web3, r/ChatGPT, r/PromptEngineering, r/artificial: share the
  Free Kit where self-promotion is allowed; answer questions with links.
- **Linktree** — consolidate bio links (done in step 0).
- **Web directories** — submit to AI/web3 directories (Futurepedia, There's An
  AI For That, DappRadar).

---

## 9. 30-day content calendar (copy-paste ready)

**Week 1 — Launch**
- Mon: Launch post on X + IG + FB (same copy, native formats).
- Tue: "What is AQELVYN?" explainer video → YouTube + TikTok + Reels.
- Wed: Free prompt #1 thread (DeFi) → X + LinkedIn article.
- Thu: Discord grand opening announcement.
- Fri: "100 free prompts" carousel → IG + FB.
- Sat/Sun: engage, reply to every comment, join 3 groups.

**Week 2 — Authority**
- Daily free-prompt drop (rotate platforms).
- 2 Medium/dev.to articles → backlinks.
- 1 Product Hunt launch prep.

**Week 3 — Virality**
- Post your best 3 "prompt → result" TikToks/Reels.
- Run a challenge: "Build an app with this free prompt, tag us" (UGC + backlinks).

**Week 4 — Compound**
- Analyze: double down on the top 3 posts by clicks.
- Guest-post or collaborate with 1 crypto/AI creator.
- Submit to directories + set up Google Alerts for "aqelvyn".

---

## 10. SEO linkage checklist (the whole point)

| Signal | Where | Status |
|---|---|---|
| Sitemap submitted | Google Search Console | ☐ |
| `sameAs` socials in JSON-LD | `lib/seo.ts` | ☐ |
| Deep links in every post | all platforms | ☐ |
| Bio/About backlinks | FB, LinkedIn, YT, IG | ☐ |
| do-follow article links | Medium/dev.to/Hashnode | ☐ |
| Branded searches ("aqelvyn") | driven by all of the above | ☐ |
| Discord in `sameAs` | already live | ✅ |

> **Golden rule:** every piece of content = one deep link to a specific prompt
> page. 30 days × 1–3 deep links/day = hundreds of topical backlinks pointing at
> pages Google can rank. That is how you get to #1.

---

## 11. Quick-reference: post copy (ready to paste)

**X launch post:**
> ⚡ AQELVYN Studio is live.
> 615+ AI master build-prompts + 100 FREE web3 prompts (DeFi, DEX, GameFi, RWA,
> NFTs…). Build any app with AI + native web3. No code required.
> Start free → aqelvyn.studio

**Free prompt drop (X/TikTok voiceover):**
> This free prompt builds a complete lending protocol — smart contracts, AI risk
> engine, tokenomics. Copy → paste → ship. 99 more free → aqelvyn.studio/p/web3/w3-000

**Discord welcome DM:**
> Welcome to AQELVYN ⚡ Here's a free web3 prompt to start:
> aqelvyn.studio/p/web3/w3-000 — grab all 100 in #free-prompts.

**IG carousel caption:**
> 7 prompts to build a DEX from scratch 🧠⛓️ Swipe → save → build.
> All free in the Free Kit. Link in bio.

---

*End of playbook. Start with section 0 (30 min), then run the Week 1 calendar.
Consistency beats perfection — one deep-linked post a day beats a weekly burst.*
