# AQELVYN — Discord Server Setup Guide (discord.md)

> Complete, step-by-step instructions to build and run the AQELVYN community
> Discord — the home of the **$AQEL** token and the **FlipSuit** shilling engine.
> Follow every section in order; each one builds on the last.

**Invite link:** `https://discord.gg/WUxR2w8zM7`

---

## 0. What you're building (the blueprint)

> **Intro.** This server is not a chat room — it is a conversion engine. Every
> channel, role, and bot exists to turn a stranger into a member, a member into
> a $AQEL holder, and a holder into a FlipSuit who markets the brand for free.
> Build it with that intent and every section below makes sense.

A Discord server that does four jobs at once:

1. **Onboard** new members and convert them into $AQEL holders.
2. **Gate** premium areas by token holding (the FlipSuit economy).
3. **Reward shilling** so the community promotes the brand for you.
4. **Educate & support** builders using AQELVYN Studio.

**Details — the member journey you are designing:**

| Stage | Where it happens | What must happen there |
|---|---|---|
| 1. Land | `#welcome` | See rules + verify button + one clear next step |
| 2. Taste value | `#free-prompts` | Get a free prompt → feel the product → want more |
| 3. Build | `#builders`, `#showcase` | Build something real, post proof-of-work |
| 4. Buy | `#token-talk`, `#official-links` | Understand $AQEL, buy, verify → get a role |
| 5. Shill | `#shill-zone` | Earn $AQEL by promoting; compound toward FlipSuit |

---

## 1. Create the server (5 minutes)

> **Intro.** Everything below assumes a blank server you own. If you already
> have one, skip to §2 — the channel and role structure works on any server.

1. Open Discord → click the **+** (Add a Server) → **Create My Own** → **For a club or community**.
2. Name it **AQELVYN**.
3. Upload the logo: `public/logo-main.png` (the square teal/orange logo) as the server icon.
4. Set a **server banner** (Boost level 2+ or Server Subscription required) using `public/og-banner.png`.
5. Settings → **Community** → enable **Community** (this unlocks announcements, welcome screen, rules).

> 💡 If you already have a server at `discord.gg/WUxR2w8zM7`, skip creation and
> go straight to §2 — this guide works for existing servers too.

**Details — what to configure right after creation:**

- **Welcome Screen** (Community tab) → point new members to `#welcome` first,
  then `#free-prompts` and `#official-links`.
- **Server boost / subscription** → unlock the banner + more emoji slots early.
- **Discovery** (optional, later) → turn on Server Discovery once the server is
  active and has healthy retention, to pull in organic members.

---

## 2. Channel structure (copy exactly)

> **Intro.** Create these channels **in this order**, grouped under the
> categories below. The order matters: new members read top-to-bottom, so
> official info sits first, free value second, and the gated stuff last —
> it gives a reason to climb. There are **7 categories / 28 channels** total.

### 📢 OFFICIAL

> **Intro.** The trust layer. This is where members verify they are in the real,
> official server and find everything they need to act. Keep it clean and
> read-only wherever possible — it is a noticeboard, not a discussion.

| Channel | Type | Purpose |
|---|---|---|
| `#welcome` | text | First channel new members see; rules + verify button |
| `#announcements` | announcement | Official news, new prompts, listings, token updates |
| `#roadmap` | text (read-only) | The 5-phase roadmap (from the whitepaper) |
| `#official-links` | text (read-only) | Website, whitepaper, Twitter, contract, DEX link |

**Details:**

- **`#welcome`** — pin two messages: (1) a welcome embed with the mission + a
  "verify here" button, (2) a "start here" message linking the first free prompt.
- **`#announcements`** — only staff post. One pinned message per major milestone
  (listing, FlipSuit launch, weekly leaderboard). Cross-post to Twitter.
- **`#roadmap`** — paste the 5-phase roadmap from `AQEL_WHITEPAPER.md`, one
  message per phase, pinned as a thread.
- **`#official-links`** — pin a single message listing website, whitepaper,
  Twitter/X, Discord, contract address, and DEX pair. Update it whenever any link
  changes. Add *"Team will NEVER DM you first."*

### ⚡ FREE VALUE

> **Intro.** The funnel's front door. Give members real value for free so they
> trust the product before they ever spend. This category does the heavy lifting
> on conversion — it turns lurker into builder.

| Channel | Type | Purpose |
|---|---|---|
| `#free-prompts` | text | Daily free prompt drops (value-first funnel) |
| `#web3-kit` | text | The 100 free web3 prompts, one thread per category |
| `#ai-tools` | text | AI tips, ChatGPT/Claude usage, prompt engineering |

**Details:**

- **`#free-prompts`** — one prompt per day (see §5 daily bot). Pin the current
  week's drops. End each drop with a CTA to unlock the full library.
- **`#web3-kit`** — create one thread per vertical (DeFi, GameFi, SocialFi,
  etc.), each linking its prompts. This is your permanent lead magnet.
- **`#ai-tools`** — share prompt-engineering tips, AI news, and AQELVYN enhancer
  walkthroughs. Encourage members to post their best prompts here.

### 🛠️ BUILDERS

> **Intro.** Where the product is used in public. Builders post what they made
> with AQELVYN prompts, get help, and show the world the prompts actually ship
> real apps. This category is your best social proof.

| Channel | Type | Purpose |
|---|---|---|
| `#builders` | text | Members building apps with $AQEL prompts |
| `#showcase` | text | Proof-of-work: post what you built |
| `#help` | text | Support + troubleshooting |
| `#feedback` | text | Feature requests & bug reports |

**Details:**

- **`#builders`** — let members share progress logs ("day 1 of building X").
  Weekly "builder of the week" spotlight goes here, then to `#announcements`.
- **`#showcase`** — proof-of-work only: screenshots, live links, demos. Reaction
  roles / points for quality posts. This channel fuels Twitter content.
- **`#help`** — staff + community answer. Pin a FAQ. Tag common issues so
  answers are searchable.
- **`#feedback`** — route feature requests to the team; acknowledge each one so
  members feel heard. Best ideas feed the roadmap in `#roadmap`.

### 🚀 SHILL & GROW (holders only)

> **Intro.** The gated engine room. Only verified holders see these channels —
> this is the *incentive* to hold. Here the community coordinates promotion and
> earns rewards, but none of it leaks to lurkers.

| Channel | Type | Purpose |
|---|---|---|
| `#shill-zone` | text (gated) | Coordinated shilling drops (FlipSuit + Architect) |
| `#alpha` | text (gated) | Early news, pre-announcements |
| `#vip-lounge` | text (gated) | FlipSuit-only chat |

**Details:**

- **`#shill-zone`** — the core growth loop (see §7). Members post their shill
  proof in the SHILL format; moderators score with ✅.
- **`#alpha`** — drop news here 24–48h before `#announcements`. Makes holding
  feel like an edge. Never leak partner announcements prematurely.
- **`#vip-lounge`** — FlipSuit-only. Casual, high-trust. Used for direct team
  chats, governance pre-discussion, and reward announcements.

### 💰 TOKEN

> **Intro.** Where the economics live. Everything about $AQEL — price, staking,
  governance — is discussed and explained here, in the open, so holders always
  know what is happening and why.

| Channel | Type | Purpose |
|---|---|---|
| `#token-talk` | text | Price, tokenomics, governance discussion |
| `#staking` | text | Staking guides, rewards, FAQ |
| `#dao-votes` | text (announcement) | Governance proposals + vote links |

**Details:**

- **`#token-talk`** — general discussion; keep price talk here (never in
  `#general-chat`). Pin the tokenomics table from the whitepaper.
- **`#staking`** — pin a step-by-step staking guide. Announce reward schedules
  and APRs here.
- **`#dao-votes`** — proposals only. Each proposal = one message with a voting
  link, posted by staff. Lock old votes with a ✅/❌ reaction summary.

### 🎮 SOCIAL

> **Intro.** The human layer. Memes, intros, and casual chat build the culture
> and retention that make people *stay* — which is what makes them keep holding.

| Channel | Type | Purpose |
|---|---|---|
| `#general-chat` | text | Off-topic |
| `#memes` | text | Memes (huge for organic growth) |
| `#introductions` | text | New members introduce themselves |
| `#media` | text | Share images/videos |

**Details:**

- **`#general-chat`** — the community living room. Enable slowmode (5s) during
  growth. Keep token/price talk out of here.
- **`#memes`** — run weekly meme contests with small $AQEL prizes; repost the
  winners on Twitter. Memes are your cheapest virality.
- **`#introductions`** — ask members to share who they are + what they build.
  Staff welcome every new intro (retention gold).
- **`#media`** — screenshots, videos, design drafts. Keep NSFW out (rule 7).

---

## 3. Roles & permissions

> **Intro.** Roles are the token economy made visible. The higher the role, the
> more a member has proven they hold — and the more access they unlock. The
> **FlipSuit** role is the flagship: it is both a status symbol and a revenue
> engine.

Create these roles **bottom-to-top** (Discord stacks roles; the highest role on
the list wins).

| Role | Color | Purpose | Gated by |
|---|---|---|---|
| `@everyone` | — | base | — |
| `Wanderer` | grey | default member (auto-assigned) | joining |
| `Builder` | teal `#2dd4bf` | 1,000+ $AQEL | token verify |
| `Architect` | cyan `#38bdf8` | 10,000+ $AQEL | token verify |
| **`FlipSuit`** | orange `#fb923c` | 100,000+ $AQEL — the flagship | token verify |
| `Shiller` | purple `#a855f7` | active contributor (earned) | manual/promotion |
| `Moderator` | blue `#60a5fa` | staff | manual |
| `Core Team` | gold `#fbbf24` | founders | manual |
| `Bot` | — | bots | auto |

**Details — what each role actually unlocks:**

- **Wanderer** — the starting role; read/write in public channels only. Gives
  everyone a named identity on day one.
- **Builder (1k)** — first verification tier; signals a real holder. Gains
  access to holder-only threads and shill rewards entry.
- **Architect (10k)** — serious holder; gains `#shill-zone` access and higher
  shill-reward weight.
- **FlipSuit (100k)** — the flagship. `#vip-lounge`, `#alpha`, `#shill-zone`,
  boosted governance weight, weekly revenue-share, hoisted (separately
  displayed) position with a distinct orange color.
- **Shiller** — earned by consistent, high-quality shilling (manual award).
  Grants `#shill-zone` access even below the full token threshold.
- **Moderator / Core Team** — staff roles; keep the count small and trusted.

### Key permission rules
- **`@everyone`**: can read/write `#welcome`, `#free-prompts`, `#general-chat`,
  `#introductions`, `#help`, `#memes`. **Cannot** see `#shill-zone`, `#alpha`,
  `#vip-lounge`.
- **`FlipSuit`**: everything above **plus** access to `#shill-zone`, `#alpha`,
  `#vip-lounge`, and a hoisted (separately displayed) position.
- **`Architect` / `Builder`**: access to `#shill-zone` (Architect only) as a
  stepping stone.
- **`Shiller`**: access to `#shill-zone` even without full token threshold
  (earned contributors).

> To gate a channel: right-click the channel → **Edit Channel** → **Permissions**
> → add the role with ✅ **View Channel**, and set `@everyone` to ❌ **View Channel**.

---

## 4. The verification system (on-chain token gating)

> **Intro.** Gating is worthless unless it is **verified on-chain**. Anyone can
> fake a screenshot, but no one can fake a wallet balance on Cronos. This
> section makes the FlipSuit tiers real.

The FlipSuit economy **must** be verified on-chain, or anyone can claim the role.
Two options:

### Option A — Collab.Land (easiest, recommended to start)
1. Invite **Collab.Land** bot → https://collab.land
2. Add the **Token Permissioned Role (TPR)** integration for Cronos.
3. Create three rules, one per role:
   - `Builder` → hold **≥ 1,000 $AQEL**
   - `Architect` → hold **≥ 10,000 $AQEL**
   - `FlipSuit` → hold **≥ 100,000 $AQEL**
4. The bot auto-assigns the role when a member verifies their wallet (connect →
   sign a message → bot checks the balance on Cronos).
5. Roles auto-remove if the holder sells below the threshold.

**Details — Collab.Land tips:**
- Verify one wallet yourself first, end-to-end, before announcing gating.
- Set the TPR rules to re-check balances periodically so roles stay accurate.
- Put a "Verify your wallet" button in `#welcome` that launches the flow.

### Option B — Custom bot (full control, later phase)
Use the `/api/unlocks` + a wallet-verification endpoint in the AQELVYN app to
verify holdings and assign roles via the Discord API. (We can build this into
the studio when the token is live.)

**Details — why go custom later:**
- Combine on-chain unlock receipts with role assignment in one flow.
- Add custom logic (e.g. staked $AQEL counts toward tiers).
- Brand the verification modal with the AQELVYN logo and copy.

---

## 5. Bots to add (in order)

> **Intro.** Bots automate the repetitive work — welcomes, roles, moderation,
> daily drops — so the team spends time on community, not chores. Add them in
> this order.

| Bot | Purpose | Notes |
|---|---|---|
| **MEE6** or **Carl-bot** | Welcome messages, reaction roles, moderation, auto-role | Free tier is enough to start |
| **Collab.Land** | On-chain role gating (FlipSuit tiers) | Required for token-gated roles |
| **Dyno** or **MEE6** | Moderation, anti-spam, raids | Optional but recommended |
| **A custom AQELVYN bot** | Daily free-prompt drops, price alerts, leaderboards | Build later; high ROI |

### MEE6 setup
1. Invite → https://mee6.xyz
2. **Welcome**: send a DM + message in `#welcome` to each new member:
   > "Welcome to AQELVYN ⚡ Hold $AQEL to unlock FlipSuit perks. Start with a
   > free prompt → aqelvyn.studio/p/web3/w3-000"
3. **Reaction roles**: pin a message in `#welcome` with reactions to self-assign
   interest roles (Builder, DeFi, GameFi, SocialFi, Meme-lord).

### Daily free-prompt bot
1. Create a simple webhook (Settings → Integrations → Webhooks → New).
2. Post 1 free prompt/day to `#free-prompts` with its deep link
   (`https://aqelvyn.studio/p/web3/w3-XXX`).
3. Rotate through the 100 free prompts (100 days of content, then repeat).

**Details — make the bot feel human:**
- Vary the drop time so it feels organic (not a 9:00am cron).
- Add a one-line "why this prompt matters" teaser above each link.
- End each drop with a CTA to the full library.

---

## 6. Rules (paste into the Community rules channel)

> **Intro.** Clear rules protect the community and give moderators a clean
> escalation path. Paste this block verbatim into the rules channel.

```
1. Be respectful. No hate, harassment, or discrimination.
2. No spam, scams, or unsolicited DMs to members.
3. No impersonation of team or moderators.
4. Shilling is welcome ONLY in #shill-zone — never spam other servers.
5. Do not post fake screenshots, fake P&L, or manipulated numbers.
6. DYOR. Nothing here is financial advice; $AQEL is a utility token.
7. No NSFW content.
8. Follow Discord ToS. Breaking rules = warning → mute → ban.
```

**Details:**
- Enable Discord's built-in **Rules Screening** so members accept the rules
  before they can post.
- Mirror these rules on the website/Twitter so enforcement is consistent.

---

## 7. The FlipSuit Shilling Engine (step-by-step)

> **Intro.** The growth loop that turns holders into a free marketing army.
> Every step is measurable, so you can tune rewards until the loop compounds on
> its own.

This is the core growth loop from the whitepaper. Set it up like this:

1. **Define the reward:** e.g. weekly **$AQEL payout** for shilling, funded from
   the Ecosystem & Rewards allocation (35% of supply).
2. **Track contributions:** a `#shill-zone` message format where members post
   their proof (screenshot of the tweet/thread). Format:
   > ```
   > 📣 SHILL
   > Link: https://twitter.com/…/status/…
   > Type: [tweet | thread | meme]
   > ```
3. **Score it:** moderators (or a bot) react ✅ and log it. Points = engagement
   quality (impressions, replies, retweets).
4. **Distribute weekly:** top shillers get $AQEL + a chance at the **Shiller**
   role. Leaderboard posted in `#announcements`.
5. **The loop:** hold → shill → earn $AQEL → compound → rise to FlipSuit.

**Details — make the engine actually run:**
- Post the weekly leaderboard on a fixed day/time (e.g. Sunday 6pm UTC).
- Award the `Shiller` role to consistent top performers (monthly).
- Start rewards small; raise them as the treasury's revenue-share grows.
- Publish a simple points table so everyone knows how to score.

### FlipSuit role perks (make these real)
- 🔶 Distinct orange role + hoisted position (status).
- 🔶 Access to `#vip-lounge`, `#alpha`, `#shill-zone`.
- 🔶 Weekly revenue-share + shill rewards.
- 🔶 Boosted governance voting weight.
- 🔶 Early access to new prompts & the AI enhancer.

---

## 8. Twitter/X shilling (paired with Discord)

> **Intro.** Discord is where the community lives; Twitter is where it grows.
> The two feed each other — Discord fuels Twitter content, and Twitter pulls
> new members back into Discord.

| Element | Detail |
|---|---|
| Handle | `@aqelvyn` |
| Hashtags | `#AQEL #AQELVYN #Cronos #web3 #AI #promptengineering` |
| Daily rhythm | free-prompt drop → build-in-public → meme → community spotlight |
| CTA | every post links a deep prompt page (`/p/web3/w3-000`, etc.) |
| KOLs | funded from the Marketing allocation (8%) |
| Rule | never shill in others' servers — only `#shill-zone` + your own posts |

**Details — a sample weekly cadence:**

| Day | Post |
|---|---|
| Mon | Free-prompt drop + thread on how to use it |
| Tue | Build-in-public (screenshot of a showcase build) |
| Wed | AI/web3 tip or prompt-engineering nugget |
| Thu | Meme (from `#memes`) + winner shoutout |
| Fri | Community spotlight (top builder / shiller) |
| Sat | Token/roadmap update or governance recap |
| Sun | Weekly shill leaderboard + FlipSuit perk reminder |

---

## 9. Launch checklist (30-day sprint)

> **Intro.** A 30-day sequence that takes you from empty server to a running
> shilling engine. Do each week's tasks in order — later weeks depend on
> earlier ones.

**Week 1 — Foundation**
- [ ] Create server + all channels + roles
- [ ] Add MEE6 + Collab.Land + moderation bot
- [ ] Write rules, welcome message, reaction roles
- [ ] Pin the whitepaper + official links

**Week 2 — Funnel**
- [ ] Daily free-prompt bot live
- [ ] Post the "100 free web3 prompts" thread
- [ ] Start `#showcase` with your own first build

**Week 3 — Token gating**
- [ ] Deploy $AQEL on Cronos (or testnet first)
- [ ] Configure Collab.Land TPR rules for Builder/Architect/FlipSuit
- [ ] Announce the FlipSuit role + perks

**Week 4 — Shilling engine**
- [ ] Launch `#shill-zone` + the SHILL post format
- [ ] First weekly shill reward distribution
- [ ] Leaderboard + first community spotlight

**Details — success signals to watch each week:**
- W1: 100+ members, all channels populated, welcome flow works.
- W2: daily prompt drops getting reactions; first `#showcase` posts.
- W3: first verified Builder/Architect roles appear.
- W4: shill posts repeat week-over-week; at least one FlipSuit verified.

---

## 10. Moderation & safety

> **Intro.** One scam or raid can erase months of trust. Keep the server locked
> down with these defaults, and tighten during growth spikes.

- Add a **raid mode** bot (MEE6/Dyno) with auto-ban for mass-joins.
- Enable **slowmode** (5s) in `#general-chat` and `#token-talk`.
- Enable **verification level** "Medium" (Settings → Safety Setup) to filter
  bots/raids.
- Keep `#announcements` read-only; only staff post there.
- Watch for scam "support" accounts — add a note: *"Team will NEVER DM you
  first."*

**Details:**
- Assign at least 2 active moderators across time zones.
- Log every moderation action (mute/ban) in a private staff channel.
- Never click or approve wallet-connection links posted by members; official
  links live only in `#official-links`.

---

## 11. Quick reference

| Item | Value |
|---|---|
| Invite | discord.gg/WUxR2w8zM7 |
| Server name | AQELVYN |
| Token | $AQEL (Cronos, 100M supply) |
| Flagship role | FlipSuit (100,000 $AQEL) |
| Website | aqelvyn.studio |
| Twitter | @aqelvyn |
| Whitepaper | AQEL_WHITEPAPER.md (in the repo) |

---

*Start with Week 1. Consistency beats perfection — a daily free-prompt drop and
a live FlipSuit loop will compound faster than any big-bang launch.*
