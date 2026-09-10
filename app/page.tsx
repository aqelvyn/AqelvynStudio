'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useSendTransaction, useSignMessage } from 'wagmi';

import { PAYMENT_CHAINS } from '@/lib/chains';
import { CATEGORIES, APPS, REPO_CATEGORIES, REPOS } from '@/lib/data/apps';
import { YT_GENRES, YT_CHANNELS } from '@/lib/data/youtube';
import { BRAND_SECTORS, BRANDS } from '@/lib/data/brands';
import { WEB3_CATEGORIES, WEB3_PROMPTS } from '@/lib/data/web3';
import { CHAIN_NAMES, EXTRAS, NETWORK_OPTIONS } from '@/lib/constants';

const SUPPORTED_CHAIN_IDS = new Set<number>(PAYMENT_CHAINS.map((c) => c.id));

// $AQEL token (public info — shown in the info popup, never the treasury address).
const AQEL_CONTRACT = '0xeC3Ff43D94B8cF631F62c2E3a201178C0178E11D';
const AQEL_WOLFSWAP = `https://wolfswap.app/launcher/${AQEL_CONTRACT}?chainId=25`;

const TABS = [
  { id: 'library', label: '📚 Library' },
  { id: 'free', label: '⚡ Free Kit' },
  { id: 'repos', label: '📦 Open Source' },
  { id: 'youtube', label: '🎬 YouTube' },
  { id: 'brands', label: '🏢 Brands' },
  { id: 'generator', label: '🧬 Generator' },
  { id: 'enhancer', label: '✨ AI Enhancer' },
  { id: 'vault', label: '🔐 My Vault' },
];

function esc(s: any) {
  return (s ?? '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

function readCachedSession(address: string): string | null {
  try {
    const raw = localStorage.getItem('aq_session');
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (o.address !== address.toLowerCase()) return null;
    if (!o.exp || o.exp < Date.now()) return null;
    return o.token;
  } catch { return null; }
}
function cacheSession(address: string, token: string) {
  try { localStorage.setItem('aq_session', JSON.stringify({ address: address.toLowerCase(), token, exp: Date.now() + SESSION_TTL })); } catch {}
}

// ---- unlock receipts (blockchain-backed, survives serverless cold starts) ----
// The on-chain transaction is the durable proof of payment. We keep each paid
// tx hash locally and re-verify it against the chain on every load, so unlocks
// survive page reloads AND serverless restarts with no database required.
interface Receipt { key: string; txHash: string; chainId?: number; }
function readReceipts(): Receipt[] {
  try {
    const raw = localStorage.getItem('aq_receipts');
    if (!raw) return [];
    const a = JSON.parse(raw);
    return Array.isArray(a) ? a : [];
  } catch { return []; }
}
function saveReceipt(key: string, txHash: string, chainId?: number) {
  try {
    const list = readReceipts().filter((r) => r.key !== key);
    list.push({ key, txHash, chainId });
    localStorage.setItem('aq_receipts', JSON.stringify(list));
  } catch {}
}

interface ModalState {
  key: string;
  emoji: string;
  name: string;
  tag: string;
  chips: string[];
  prompt: string | null;
  loading: boolean;
  free?: boolean;
}

// Multi-select target-network picker (single / multiple / custom).
function NetworkSelector({ networks, customNetwork, onNetworks, onCustom }: {
  networks: string[]; customNetwork: string;
  onNetworks: (n: string[]) => void; onCustom: (s: string) => void;
}) {
  const toggle = (id: string) => {
    if (networks.includes(id)) {
      const next = networks.filter((x) => x !== id);
      onNetworks(next.length ? next : ['cronos']);
    } else {
      onNetworks([...networks, id]);
    }
  };
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Target network(s) — pick one or many</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {NETWORK_OPTIONS.map((o) => {
          const on = networks.includes(o.id);
          return (
            <button key={o.id} type="button" onClick={() => toggle(o.id)}
              style={{ background: on ? 'var(--acc)' : 'var(--panel)', border: '1px solid ' + (on ? 'var(--acc)' : 'var(--line)'), color: on ? '#041414' : 'var(--text)', borderRadius: 999, padding: '5px 11px', fontSize: 12, fontWeight: on ? 700 : 400, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {o.img
                ? <img src={o.img} alt="" style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                : <span>{o.emoji}</span>}
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>
      {networks.includes('custom') && (
        <input placeholder="Custom network name (e.g. 'My L2')" value={customNetwork} onChange={(e) => onCustom(e.target.value)}
          style={{ marginTop: 8, width: '100%', boxSizing: 'border-box', background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: '9px 14px', color: 'var(--text)' }} />
      )}
    </div>
  );
}

export default function Studio() {
  // ---- ui state ----
  const [tab, setTab] = useState('library');
  const [splash, setSplash] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [chain, setChain] = useState('cronos');
  const [networks, setNetworks] = useState<string[]>(['cronos']);
  const [customNetwork, setCustomNetwork] = useState('');
  const [nameOverride, setNameOverride] = useState('');
  const [quote, setQuote] = useState<any>(null);

  const [modal, setModal] = useState<ModalState | null>(null);
  const [userWallet, setUserWallet] = useState('');
  const [unlockedKeys, setUnlockedKeys] = useState<Set<string>>(new Set());
  const [unlockedAll, setUnlockedAll] = useState(false);
  const [paying, setPaying] = useState(false);
  const walletDebounce = useRef<any>(null);
  // Latest-value refs so debounced re-loads always read the freshest options.
  const networksRef = useRef(networks); networksRef.current = networks;
  const customNetworkRef = useRef(customNetwork); customNetworkRef.current = customNetwork;
  const nameOverrideRef = useRef(nameOverride); nameOverrideRef.current = nameOverride;

  const [genName, setGenName] = useState('');
  const [genAppId, setGenAppId] = useState('');
  const [genExtras, setGenExtras] = useState<string[]>([]);
  const [genOutput, setGenOutput] = useState('');
  const [enhInput, setEnhInput] = useState('');
  const [enhOutput, setEnhOutput] = useState('');
  const [vault, setVault] = useState<any[]>([]);

  // ---- wallet ----
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { sendTransactionAsync } = useSendTransaction();
  const { signMessageAsync } = useSignMessage();

  // Live payment quote for the connected chain (for price labels).
  useEffect(() => {
    const cid = chainId || 25;
    fetch(`/api/payment?chainId=${cid}`).then((r) => r.json()).then(setQuote).catch(() => {});
  }, [chainId]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      const w = localStorage.getItem('aq_user_wallet');
      if (w) setUserWallet(w);
      const v = localStorage.getItem('aq_vault');
      if (v) setVault(JSON.parse(v));
    } catch {}
  }, []);

  useEffect(() => {
    if (!address) { setUnlockedKeys(new Set()); setUnlockedAll(false); return; }
    (async () => {
      const keys = new Set<string>();
      let all = false;
      // 1) ledger (fast path; works when KV is configured)
      try {
        const r = await fetch(`/api/unlocks?address=${address}`);
        const d = await r.json();
        for (const u of d.unlocks || []) {
          if (u.key === 'unlock-all') all = true;
          else keys.add(u.key);
        }
      } catch {}
      // 2) blockchain-backed receipts (durable proof of payment — survives
      //    serverless restarts; re-verified on-chain every load)
      const receipts = readReceipts();
      if (receipts.length) {
        try {
          const r = await fetch('/api/unlocks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, receipts }),
          });
          const d = await r.json();
          for (const u of d.unlocks || []) {
            if (u.key === 'unlock-all') all = true;
            else keys.add(u.key);
          }
        } catch {}
      }
      setUnlockedKeys(keys);
      setUnlockedAll(all);
    })();
  }, [address]);

  const isUnlocked = useCallback(
    (key: string) => unlockedAll || unlockedKeys.has(key),
    [unlockedAll, unlockedKeys]
  );

  // ---- SiWE sign-in (stateless session) ----
  const signIn = useCallback(async (): Promise<string | null> => {
    if (!address || !signMessageAsync) return null;
    const cached = readCachedSession(address);
    if (cached) return cached;
    try {
      const nr = await fetch('/api/auth/nonce', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      }).then((r) => r.json());
      if (!nr.nonce) return null;
      showToast('✍️ Sign in to verify your wallet…');
      const signature = await signMessageAsync({ account: address, message: nr.message });
      const vr = await fetch('/api/auth/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, nonce: nr.nonce, message: nr.message }),
      }).then((r) => r.json());
      if (vr.token) { cacheSession(address, vr.token); return vr.token; }
      return null;
    } catch {
      return null;
    }
  }, [address, signMessageAsync, showToast]);

  const authedFetch = useCallback(async (url: string, init: RequestInit = {}): Promise<Response> => {
    let token = readCachedSession(address || '');
    if (!token) token = await signIn();
    const doFetch = (t: string) =>
      fetch(url, { ...init, headers: { ...(init.headers || {}), 'Content-Type': 'application/json', Authorization: 'Bearer ' + t } });
    let res = await doFetch(token || '');
    if (res.status === 401) {
      const t2 = await signIn();
      if (t2) res = await doFetch(t2);
    }
    return res;
  }, [address, signIn]);

  // ---- payment (multi-chain) ----
  const pay = useCallback(async (which: 'single' | 'all'): Promise<{ hash: string; chainId: number } | null> => {
    if (!address) { showToast('🔒 Connect your wallet first'); return null; }
    const cid = chainId || 25;
    if (!SUPPORTED_CHAIN_IDS.has(cid)) {
      showToast('⚠️ Switch to a supported network (Cronos, Ethereum, Base, Robinhood, Stable…)');
      return null;
    }
    const payRes = await fetch(`/api/payment?chainId=${cid}`).then((r) => r.json());
    const value = which === 'all' ? BigInt(payRes.priceAllWei) : BigInt(payRes.priceWei);
    try {
      // Send native tokens on the user's current chain and return the hash
      // immediately — the server polls confirmations on its own.
      const hash = await sendTransactionAsync({ to: payRes.address as `0x${string}`, value, chainId: cid as any });
      return { hash, chainId: cid };
    } catch (e: any) {
      if (e?.message?.includes('rejected') || e?.name === 'UserRejectedRequestError' || e?.code === 4001) {
        showToast('⚠️ Transaction rejected — nothing charged');
      } else {
        showToast('⚠️ Payment failed: ' + ((e?.shortMessage || e?.message) || 'unknown error'));
      }
      return null;
    }
  }, [address, chainId, sendTransactionAsync, showToast]);

  // Poll /api/verify until the tx is confirmed (or a definitive error).
  const verify = useCallback(async (txHash: string, txChainId: number, key: string): Promise<{ ok: boolean; error?: string }> => {
    const definitive = new Set(['sender mismatch', 'not treasury', 'insufficient payment']);
    for (let i = 0; i < 40; i++) {
      let d: any = { pending: true };
      try {
        const r = await fetch('/api/verify', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ txHash, key, address, chainId: txChainId }),
        });
        d = await r.json();
      } catch {
        d = { pending: true }; // network error -> keep polling
      }
      if (d.verified) return { ok: true };
      if (d.error && definitive.has(d.error)) return { ok: false, error: d.error };
      // otherwise (pending, not mined, rpc error, rate limited) -> keep trying
      await new Promise((r) => setTimeout(r, 3000));
    }
    return { ok: false, error: 'timeout' };
  }, [address]);

  // ---- load a gated prompt from the server ----
  const loadPrompt = useCallback(async (key: string, wallet: string) => {
    setModal((m) => (m ? { ...m, loading: true } : m));
    try {
      // Attach the unlock receipt(s) so the server can re-verify payment
      // on-chain even if its (ephemeral) ledger has no record of the unlock.
      const receipts = readReceipts();
      const res = await authedFetch('/api/prompt', {
        method: 'POST', body: JSON.stringify({
          key, wallet, chain,
          networks: networksRef.current,
          customNetwork: customNetworkRef.current,
          name: nameOverrideRef.current,
          receipts,
        }),
      });
      const d = await res.json();
      if (res.ok && d.prompt) {
        setModal((m) => (m ? { ...m, prompt: d.prompt, loading: false } : m));
      } else {
        setModal((m) => (m ? { ...m, prompt: null, loading: false } : m));
        showToast('🔒 This prompt is still locked');
      }
    } catch {
      setModal((m) => (m ? { ...m, prompt: null, loading: false } : m));
    }
  }, [authedFetch, chain, showToast]);

  // ---- free prompts (no payment, no wallet) ----
  const loadFreePrompt = useCallback(async (id: string, wallet: string) => {
    setModal((m) => (m ? { ...m, loading: true } : m));
    try {
      const qs = `?chain=${encodeURIComponent(chain)}&wallet=${encodeURIComponent(wallet)}`;
      const res = await fetch(`/api/free/${id}${qs}`);
      const d = await res.json();
      setModal((m) => (m ? { ...m, prompt: d.prompt || null, loading: false } : m));
    } catch {
      setModal((m) => (m ? { ...m, prompt: null, loading: false } : m));
    }
  }, [chain]);

  const openFreePrompt = useCallback((w: any) => {
    const c = WEB3_CATEGORIES[w.cat];
    setNameOverride(''); setNetworks(['cronos']); setCustomNetwork('');
    setModal({ key: 'free:' + w.id, emoji: w.emoji, name: w.name, tag: c.name + ' — free prompt', chips: [c.name, ...w.features.slice(0, 3)], prompt: null, loading: false, free: true });
  }, []);

  const unlockKey = useCallback(async (key: string) => {
    setPaying(true);
    try {
      // Establish the SiWE session up front so prompt delivery works instantly.
      await signIn();
      const tx = await pay('single');
      if (!tx) return false;
      // Persist the receipt immediately so a reload can re-verify it on-chain
      // even if this confirmation poll is interrupted.
      saveReceipt(key, tx.hash, tx.chainId);
      const v = await verify(tx.hash, tx.chainId, key);
      if (v.ok) {
        setUnlockedKeys((s) => new Set(s).add(key));
        showToast('🔓 Unlocked (verified on-chain)');
        return true;
      }
      showToast('⚠️ ' + (v.error && v.error !== 'timeout' ? `Payment not accepted: ${v.error}` : 'Payment sent — still confirming on-chain. Reload the page (no need to pay again).'));
      return false;
    } finally {
      setPaying(false);
    }
  }, [pay, verify, signIn, showToast]);

  const unlockAll = useCallback(async () => {
    setPaying(true);
    try {
      await signIn();
      const tx = await pay('all');
      if (!tx) return false;
      saveReceipt('unlock-all', tx.hash, tx.chainId);
      const v = await verify(tx.hash, tx.chainId, 'unlock-all');
      if (v.ok) {
        setUnlockedAll(true);
        showToast('✅ All prompts unlocked (verified on-chain)');
        return true;
      }
      showToast('⚠️ ' + (v.error && v.error !== 'timeout' ? `Payment not accepted: ${v.error}` : 'Payment sent — still confirming on-chain. Reload the page (no need to pay again).'));
      return false;
    } finally {
      setPaying(false);
    }
  }, [pay, verify, signIn, showToast]);

  // ---- per-attempt charged generation (generator + enhancer) ----
  const chargeAndCall = useCallback(async (url: string, extraBody: any): Promise<{ ok: boolean; prompt?: string; error?: string }> => {
    const tx = await pay('single');
    if (!tx) return { ok: false, error: 'payment' };
    const definitive = new Set(['sender mismatch', 'not treasury', 'insufficient payment']);
    for (let i = 0; i < 40; i++) {
      let d: any = { pending: true };
      try {
        const res = await authedFetch(url, { method: 'POST', body: JSON.stringify({ txHash: tx.hash, chainId: tx.chainId, ...extraBody }) });
        d = await res.json();
        if (res.ok && d.prompt) return { ok: true, prompt: d.prompt };
      } catch {
        d = { pending: true };
      }
      if (d.error && definitive.has(d.error)) return { ok: false, error: d.error };
      await new Promise((r) => setTimeout(r, 3000));
    }
    return { ok: false, error: 'timeout' };
  }, [pay, authedFetch]);

  // ---- open a prompt modal (metadata only; content fetched server-side) ----
  const openPrompt = useCallback((key: string, emoji: string, name: string, tag: string, chips: string[]) => {
    setNameOverride(''); setNetworks(['cronos']); setCustomNetwork('');
    setModal({ key, emoji, name, tag, chips, prompt: null, loading: false });
  }, []);

  // when a modal opens on an already-unlocked key (or a free prompt), load it
  useEffect(() => {
    if (modal && modal.prompt === null && !modal.loading) {
      if (modal.free) {
        loadFreePrompt(modal.key.slice(5), userWallet.trim());
      } else if (isUnlocked(modal.key)) {
        loadPrompt(modal.key, userWallet.trim());
      }
    }
  }, [modal, isUnlocked, loadPrompt, loadFreePrompt, userWallet]);

  const saveToVault = useCallback((entry: any) => {
    setVault((v) => {
      const next = [{ id: 'p' + Date.now(), date: new Date().toISOString(), ...entry }, ...v];
      try { localStorage.setItem('aq_vault', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // ---- data views ----
  const appList = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = APPS.filter((a) => cat === 'all' || a.cat === cat);
    if (q) list = list.filter((a) => a.name.toLowerCase().includes(q) || a.tagline.toLowerCase().includes(q) || a.features.some((f) => f.toLowerCase().includes(q)));
    return list;
  }, [cat, query]);

  const repoList = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = REPOS.filter((r) => cat === 'all' || r.cat === cat);
    if (q) list = list.filter((r) => r.name.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q));
    return list;
  }, [cat, query]);

  const ytList = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = YT_CHANNELS.filter((c) => cat === 'all' || c.genre === cat);
    if (q) list = list.filter((c) => c.name.toLowerCase().includes(q) || c.style.toLowerCase().includes(q));
    return list;
  }, [cat, query]);

  const brandList = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = BRANDS.filter((b) => cat === 'all' || b.sector === cat);
    if (q) list = list.filter((b) => b.name.toLowerCase().includes(q) || b.tagline.toLowerCase().includes(q));
    return list;
  }, [cat, query]);

  const freeList = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = WEB3_PROMPTS.filter((p) => cat === 'all' || p.cat === cat);
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.features.some((f) => f.toLowerCase().includes(q)));
    return list;
  }, [cat, query]);

  const catDefs = useMemo(() => {
    if (tab === 'free') return [['all', 'All Free Prompts', '⚡', WEB3_PROMPTS.length], ...Object.entries(WEB3_CATEGORIES).map(([id, c]) => [id, c.name, c.emoji, WEB3_PROMPTS.filter((p) => p.cat === id).length] as [string, string, string, number])];
    if (tab === 'repos') return [['all', 'All Repos', '🧩', REPOS.length], ...Object.entries(REPO_CATEGORIES).map(([id, c]) => [id, c.name, c.emoji, REPOS.filter((r) => r.cat === id).length] as [string, string, string, number])];
    if (tab === 'youtube') return [['all', 'All Channels', '🎬', YT_CHANNELS.length], ...YT_GENRES.map((g) => [g.id, g.name, g.emoji, YT_CHANNELS.filter((c) => c.genre === g.id).length] as [string, string, string, number])];
    if (tab === 'brands') return [['all', 'All Brands', '🏢', BRANDS.length], ...Object.entries(BRAND_SECTORS).map(([id, s]) => [id, s.name, s.emoji, BRANDS.filter((b) => b.sector === id).length] as [string, string, string, number])];
    return [['all', 'All Apps', '🧩', APPS.length], ...Object.entries(CATEGORIES).map(([id, c]) => [id, c.name, c.emoji, APPS.filter((a) => a.cat === id).length] as [string, string, string, number])];
  }, [tab]);

  const switchTab = (id: string) => { setTab(id); setCat('all'); setQuery(''); setMenuOpen(false); };

  const onWalletInput = useCallback((v: string) => {
    setUserWallet(v);
    try { localStorage.setItem('aq_user_wallet', v); } catch {}
    if (walletDebounce.current) clearTimeout(walletDebounce.current);
    walletDebounce.current = setTimeout(() => {
      setModal((m) => {
        if (!m) return m;
        if (m.free) loadFreePrompt(m.key.slice(5), v.trim());
        else if (isUnlocked(m.key)) loadPrompt(m.key, v.trim());
        return m;
      });
    }, 500);
  }, [isUnlocked, loadPrompt, loadFreePrompt]);

  // Debounced re-load when the user edits name / target networks on an open prompt.
  const scheduleReload = useCallback(() => {
    if (walletDebounce.current) clearTimeout(walletDebounce.current);
    walletDebounce.current = setTimeout(() => {
      setModal((m) => {
        if (!m) return m;
        if (m.free) loadFreePrompt(m.key.slice(5), userWallet.trim());
        else if (isUnlocked(m.key)) loadPrompt(m.key, userWallet.trim());
        return m;
      });
    }, 400);
  }, [isUnlocked, loadPrompt, loadFreePrompt, userWallet]);

  return (
    <>
      <div className="bg-grid" />
      <div className="bg-glow bg-glow-a" />
      <div className="bg-glow bg-glow-b" />

      {/* splash */}
      {splash && (
        <div className="splash">
          <div className="splash-bg" />
          <div className="splash-inner">
            <div className="splash-logo"><img src="/logo-splash.png" alt="AQELVYN" /></div>
            <div className="splash-catch">From Prompt to Power</div>
            <div className="splash-tag">One studio to mold any app, brand, or channel into a complete, AI-powered, Web3-native product — built, owned &amp; scaled by you.</div>
            <div className="splash-bar"><div className="splash-bar-fill" /></div>
          </div>
        </div>
      )}

      {/* topbar */}
      <header className="topbar">
        <button className="menu-btn" aria-label="Menu" onClick={() => setMenuOpen(true)}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
        <div className="brand">
          <span className="brand-logo"><img src="/logo-main.png" alt="AQELVYN logo" /></span>
          <span className="brand-name">AQELVYN</span>
        </div>
        <div style={{ flex: 1 }} />
        <div className="connect-wrap">
          <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
        </div>
      </header>

      {/* tabs (desktop) */}
      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => switchTab(t.id)}>
            {t.label}
            {t.id === 'vault' && vault.length > 0 && <span className="pill">{vault.length}</span>}
          </button>
        ))}
      </nav>

      {/* hamburger drawer (mobile) */}
      <div className={`drawer-backdrop ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-head">
          <span className="brand-name">AQELVYN</span>
          <button className="btn drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close">×</button>
        </div>
        <nav className="drawer-tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`drawer-tab ${tab === t.id ? 'active' : ''}`} onClick={() => switchTab(t.id)}>
              <span>{t.label}</span>
              {t.id === 'vault' && vault.length > 0 && <span className="pill">{vault.length}</span>}
            </button>
          ))}
        </nav>
        {['library', 'free', 'repos', 'youtube', 'brands'].includes(tab) && (
          <div className="drawer-cats">
            <div className="drawer-cats-title">Categories</div>
            {catDefs.map(([id, name, emoji, count]) => (
              <button
                key={id}
                className={`drawer-cat ${cat === id ? 'active' : ''}`}
                onClick={() => { setCat(id as string); setMenuOpen(false); }}
              >
                <span>{emoji}</span>
                <span>{name}</span>
                <span className="cc">{count}</span>
              </button>
            ))}
          </div>
        )}
      </aside>

      <main>
        {['library', 'free', 'repos', 'youtube', 'brands'].includes(tab) && (
          <div className="layout">
            <aside className="cats">
              {catDefs.map(([id, name, emoji, count]) => (
                <button key={id} className={`cat-btn ${cat === id ? 'active' : ''}`} onClick={() => setCat(id as string)}>
                  <span>{emoji}</span><span>{name}</span><span className="cc">{count}</span>
                </button>
              ))}
            </aside>

            <section>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                <input
                  style={{ flex: 1, background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: '9px 14px', color: 'var(--text)' }}
                  placeholder={tab === 'library' ? 'Search apps…' : tab === 'free' ? 'Search free web3 prompts…' : tab === 'repos' ? 'Search repos…' : tab === 'youtube' ? 'Search channels…' : 'Search brands…'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <span className="meta" style={{ color: 'var(--dim)', fontSize: 13 }}>
                  {tab === 'library' ? appList.length + ' apps' : tab === 'free' ? freeList.length + ' free prompts' : tab === 'repos' ? repoList.length + ' repos' : tab === 'youtube' ? ytList.length + ' channels' : brandList.length + ' brands'}
                </span>
              </div>

              <div className="grid">
                {tab === 'library' && appList.map((a) => {
                  const c = CATEGORIES[a.cat];
                  return (
                    <div key={a.id} className="card" onClick={() => openPrompt('app:' + a.id, a.emoji, a.name, c.name, [c.name, ...a.platforms])}>
                      {!isUnlocked('app:' + a.id) && <span className="lock">🔒</span>}
                      <div className="c-top"><span className="c-emoji" style={{ color: c.color }}>{a.emoji}</span><div><h3>{esc(a.name)}</h3><div className="c-cat">{esc(c.name)}</div></div></div>
                      <p className="c-tag">{esc(a.tagline)}</p>
                      <div className="c-feats">{a.features.slice(0, 3).map((f) => <span key={f}>{esc(f)}</span>)}</div>
                    </div>
                  );
                })}

                {tab === 'repos' && repoList.map((r) => {
                  const c = REPO_CATEGORIES[r.cat];
                  return (
                    <div key={r.id} className="card" onClick={() => openPrompt('repo:' + r.id, r.emoji, r.name, 'github.com/' + r.slug, [c.name, r.lang, r.stars + ' ⭐'])}>
                      {!isUnlocked('repo:' + r.id) && <span className="lock">🔒</span>}
                      <div className="c-top"><span className="c-emoji" style={{ color: c.color }}>{r.emoji}</span><div><h3>{esc(r.name)}</h3><div className="c-lang">{esc(r.lang)} · {esc(c.name)}</div></div></div>
                      <p className="c-desc">{esc(r.desc)}</p>
                      <div className="c-stars">⭐ {esc(r.stars)} stars</div>
                      <div className="c-slug">github.com/{esc(r.slug)}</div>
                    </div>
                  );
                })}

                {tab === 'youtube' && ytList.map((c) => {
                  const g = YT_GENRES.find((x) => x.id === c.genre)!;
                  return (
                    <div key={c.id} className="card" onClick={() => openPrompt('yt:' + c.id, c.emoji, c.name, g.name + ' — content generation', [g.name, ...c.pillars.slice(0, 3)])}>
                      {!isUnlocked('yt:' + c.id) && <span className="lock">🔒</span>}
                      <div className="c-top"><span className="c-emoji" style={{ color: g.color }}>{c.emoji}</span><div><h3>{esc(c.name)}</h3><div className="c-genre">{esc(g.name)}</div></div></div>
                      <p className="c-style">{esc(c.style)}</p>
                    </div>
                  );
                })}

                {tab === 'brands' && brandList.map((b) => {
                  const s = BRAND_SECTORS[b.sector];
                  return (
                    <div key={b.id} className="card" onClick={() => openPrompt('brand:' + b.id, b.emoji, b.name, s.name + ' — brand app prompt', [s.name, ...b.features.slice(0, 3)])}>
                      {!isUnlocked('brand:' + b.id) && <span className="lock">🔒</span>}
                      <div className="c-top"><span className="c-emoji" style={{ color: s.color }}>{b.emoji}</span><div><h3>{esc(b.name)}</h3><div className="c-sector">{esc(s.name)}</div></div></div>
                      <p className="c-tagline">{esc(b.tagline)}</p>
                    </div>
                  );
                })}

                {tab === 'free' && freeList.map((w) => {
                  const c = WEB3_CATEGORIES[w.cat];
                  return (
                    <div key={w.id} className="card free-card" onClick={() => openFreePrompt(w)}>
                      <span className="free-badge">FREE</span>
                      <div className="c-top"><span className="c-emoji" style={{ color: c.color }}>{w.emoji}</span><div><h3>{esc(w.name)}</h3><div className="c-cat">{esc(c.name)}</div></div></div>
                      <p className="c-tag">{esc(w.tagline)}</p>
                      <div className="c-feats">{w.features.slice(0, 3).map((f) => <span key={f}>{esc(f)}</span>)}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ---- generator ---- */}
        {tab === 'generator' && (
          <div className="layout">
            <aside className="cats">
              <button className="cat-btn active" onClick={() => setGenAppId('')}><span>✨</span><span>Start fresh</span></button>
              {APPS.map((a) => (
                <button key={a.id} className={`cat-btn ${genAppId === a.id ? 'active' : ''}`} onClick={() => setGenAppId(a.id)}>
                  <span>{a.emoji}</span><span>{esc(a.name)}</span>
                </button>
              ))}
            </aside>
            <section>
              <div className="section-head"><h2>Generate a master build-prompt</h2></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640 }}>
                <input placeholder="App name (blank = use blueprint name)" value={genName} onChange={(e) => setGenName(e.target.value)} style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: '10px 14px', color: 'var(--text)' }} />
                <NetworkSelector networks={networks} customNetwork={customNetwork} onNetworks={setNetworks} onCustom={setCustomNetwork} />
                <input placeholder="Your revenue wallet (engraved into the prompt)" value={userWallet} onChange={(e) => onWalletInput(e.target.value)} style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: '10px 14px', color: 'var(--text)', fontFamily: 'monospace' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {EXTRAS.map((x) => (
                    <label key={x} style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input type="checkbox" checked={genExtras.includes(x)} onChange={(e) => setGenExtras(e.target.checked ? [...genExtras, x] : genExtras.filter((i) => i !== x))} />{x}
                    </label>
                  ))}
                </div>
                <button className="btn primary" disabled={paying} onClick={async () => {
                  const app = APPS.find((a) => a.id === genAppId);
                  setPaying(true);
                  const r = await chargeAndCall('/api/generate', {
                    appId: genAppId,
                    name: genName.trim(),
                    tagline: app?.tagline,
                    extras: genExtras,
                    wallet: userWallet.trim(),
                    chain,
                    networks,
                    customNetwork,
                  });
                  setPaying(false);
                  if (r.ok) { setGenOutput(r.prompt || ''); showToast('✅ Paid · prompt generated'); }
                  else showToast('⚠️ Payment not verified — no prompt generated');
                }}>{paying ? '⏳ Paying…' : `⬡ Generate (${quote?.priceLabel || '1 CRO'})`}</button>
              </div>
              {genOutput && <div className="prompt-box" style={{ marginTop: 16, maxHeight: 60 + 'vh' }}>{genOutput}</div>}
            </section>
          </div>
        )}

        {/* ---- enhancer ---- */}
        {tab === 'enhancer' && (
          <div style={{ maxWidth: 760 }}>
            <div className="section-head"><h2>AI Enhancer</h2></div>
            <textarea rows={8} placeholder="Paste a rough prompt / idea — the enhancer turns it into a complete build-blueprint…" value={enhInput} onChange={(e) => setEnhInput(e.target.value)} style={{ width: '100%', background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: 14, color: 'var(--text)', font: 'inherit' }} />
            <button className="btn primary" style={{ marginTop: 12 }} disabled={paying} onClick={async () => {
              if (!enhInput.trim()) { showToast('Paste a prompt first'); return; }
              setPaying(true);
              const r = await chargeAndCall('/api/enhance', { text: enhInput, wallet: userWallet.trim(), chain });
              setPaying(false);
              if (r.ok) { setEnhOutput(r.prompt || ''); showToast('✅ Paid · prompt enhanced'); }
              else showToast('⚠️ Payment not verified — no prompt generated');
            }}>{paying ? '⏳ Paying…' : `✨ Enhance (${quote?.priceLabel || '1 CRO'})`}</button>
            {enhOutput && <div className="prompt-box" style={{ marginTop: 16 }}>{enhOutput}</div>}
          </div>
        )}

        {/* ---- vault ---- */}
        {tab === 'vault' && (
          <div>
            <div className="section-head"><h2>My Vault</h2></div>
            {vault.length === 0 && <p className="meta" style={{ color: 'var(--dim)' }}>Your vault is empty. Save or sign prompts to see them here.</p>}
            {vault.map((it, i) => (
              <div key={it.id} style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{it.emoji}</span>
                  <b>{esc(it.name)}</b>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{it.tx ? 'tx: ' + esc(it.tx.slice(0, 12) + '…') : ''}</span>
                  <div style={{ flex: 1 }} />
                  <button className="btn" onClick={async () => { try { await navigator.clipboard.writeText(it.prompt); showToast('📋 Copied'); } catch { showToast('Copy failed'); } }}>📋 Copy</button>
                  <button className="btn" onClick={() => { setVault((v) => { const n = v.filter((_, j) => j !== i); try { localStorage.setItem('aq_vault', JSON.stringify(n)); } catch {} return n; }); }}>🗑 Delete</button>
                </div>
                <div className="prompt-box">{esc(it.prompt)}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ---- prompt modal ---- */}
      {modal && (
        <div className="backdrop" onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="modal">
            <div className="modal-head">
              <h2>{modal.emoji} {esc(modal.name)}</h2>
              <button className="btn" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>{esc(modal.tag)}</div>
              <div className="chips">{modal.chips.map((c, i) => <span key={i}>{esc(c)}</span>)}</div>

              {!modal.free && !isUnlocked(modal.key) ? (
                <div className="paywall">
                  <h3>🔒 This prompt is locked</h3>
                  <p>Pay <b>{quote?.priceLabel || '1 CRO'}</b> on {quote?.chainName || 'Cronos'} to unlock this master build-prompt — verified on-chain before it opens. Pay on any network.</p>
                  <div className="actions" style={{ justifyContent: 'center' }}>
                    <button className="btn primary" disabled={paying || !isConnected} onClick={async () => { const ok = await unlockKey(modal.key); if (ok) loadPrompt(modal.key, userWallet.trim()); }}>
                      {paying ? '⏳ Paying…' : `🔓 Unlock (${quote?.priceLabel || '1 CRO'})`}
                    </button>
                    {!unlockedAll && (
                      <button className="btn mint" disabled={paying || !isConnected} onClick={async () => { const ok = await unlockAll(); if (ok) loadPrompt(modal.key, userWallet.trim()); }}>
                        {paying ? '⏳ Paying…' : `⬡ Unlock All (${quote?.priceAllLabel || '100 CRO'})`}
                      </button>
                    )}
                  </div>
                  {!isConnected && <p style={{ marginTop: 12, fontSize: 12, color: 'var(--dim)' }}>Connect your wallet to unlock.</p>}
                </div>
              ) : (
                <>
                  <div className="wallet-row">
                    <label>App name (blank = use the blueprint name)</label>
                    <input placeholder={modal.name} value={nameOverride} onChange={(e) => { setNameOverride(e.target.value); scheduleReload(); }} />
                  </div>
                  <div className="wallet-row" style={{ marginTop: 10 }}>
                    <label>Target network(s)</label>
                    <NetworkSelector networks={networks} customNetwork={customNetwork} onNetworks={(n) => { setNetworks(n); scheduleReload(); }} onCustom={(s) => { setCustomNetwork(s); scheduleReload(); }} />
                  </div>
                  <div className="wallet-row" style={{ marginTop: 10 }}>
                    <label>Your revenue wallet</label>
                    <input placeholder="Engrave your wallet into the prompt (optional)" value={userWallet} onChange={(e) => onWalletInput(e.target.value)} />
                  </div>
                  {modal.loading && <p style={{ color: 'var(--dim)', fontSize: 13, padding: '20px 0' }}>⏳ Loading prompt…</p>}
                  {!modal.loading && modal.prompt && (
                    <>
                      <div className="prompt-box">{modal.prompt}</div>
                      <div className="actions">
                        <button className="btn primary" onClick={async () => { try { await navigator.clipboard.writeText(modal.prompt!); showToast('📋 Copied'); } catch { showToast('Copy failed'); } }}>📋 Copy</button>
                        <button className="btn mint" onClick={() => { saveToVault({ name: modal.name, emoji: modal.emoji, prompt: modal.prompt, tx: '', chain: CHAIN_NAMES[chain] }); showToast('💾 Saved to vault'); }}>💾 Save</button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---- info popup ---- */}
      <button className="info-btn" onClick={() => setInfoOpen(true)} title="Tokenomics & Whitepaper" aria-label="Tokenomics & Whitepaper">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M12 11.2v5" /></svg>
      </button>
      {infoOpen && (
        <div className="info-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setInfoOpen(false); }}>
          <div className="modal" style={{ width: 'min(600px,100%)', maxHeight: '92vh', overflowY: 'auto' }}>
            <div className="modal-head"><h2>🐺 Token &amp; WhitePaper</h2><button className="btn" onClick={() => setInfoOpen(false)}>×</button></div>
            <div className="modal-body">

              {/* $AQEL token — live */}
              <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src="/logo-main.png" alt="AQELVYN" style={{ width: 34, height: 34, objectFit: 'contain' }} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17 }}>Aqelvyn <span style={{ color: 'var(--acc)' }}>($AQEL)</span></div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>LIVE on WolfSwap · Cronos — From Prompt to Power</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Contract address</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <code style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line)', borderRadius: 10, padding: '8px 10px', fontSize: 12, wordBreak: 'break-all', color: 'var(--text)' }}>{AQEL_CONTRACT}</code>
                  <button className="btn" onClick={async () => { try { await navigator.clipboard.writeText(AQEL_CONTRACT); showToast('📋 Contract copied'); } catch { showToast('Copy failed'); } }}>📋</button>
                </div>
                <a className="discord-btn" style={{ marginTop: 12 }} href={AQEL_WOLFSWAP} target="_blank" rel="noopener noreferrer">
                  🚀 View live chart on WolfSwap ↗
                </a>
              </div>

              {/* live graph (embed) */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Live chart — WolfSwap</div>
                <iframe
                  src={AQEL_WOLFSWAP}
                  title="AQEL live chart"
                  style={{ width: '100%', height: 420, border: '1px solid var(--line)', borderRadius: 12, background: '#041414' }}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Chart loads here on the deployed site. If it doesn&apos;t appear, use the “View live chart” button above.</div>
              </div>

              <p className="info-body">Tokenomics / WhitePaper — Coming Soon — Right After Graduation from the street of Wolfies.</p>
              <p className="info-body">Until then, for more info visit the project Discord.</p>
              <a className="discord-btn" href="https://discord.gg/WUxR2w8zM7" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.865-.608 1.25a18.16 18.16 0 00-5.487 0 12.6 12.6 0 00-.617-1.25.077.077 0 00-.079-.037A19.74 19.74 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 00.031.056c2.053 1.508 4.041 2.423 5.993 3.03a.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.042-.106 13.1 13.1 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.009c.12.099.246.198.373.292a.077.077 0 01-.006.128 12.3 12.3 0 01-1.873.891.077.077 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 00.084.028c1.961-.607 3.95-1.522 6.002-3.03a.077.077 0 00.031-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.029zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419z" /></svg>
                Join the Project Discord
              </a>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && <div className="toast show">{toast}</div>}
    </>
  );
}
