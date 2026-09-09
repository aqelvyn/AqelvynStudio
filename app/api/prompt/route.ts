import { NextResponse } from 'next/server';
import { getSessionAddress } from '@/lib/server/auth';
import { getUnlock } from '@/lib/server/store';
import { verifyPaymentTx } from '@/lib/server/verifyTx';
import { PRICE_WEI, PRICE_ALL_WEI } from '@/lib/server/treasury';
import { APPS, REPOS } from '@/lib/data/apps';
import { YT_CHANNELS } from '@/lib/data/youtube';
import { BRANDS } from '@/lib/data/brands';
import { buildMasterPrompt, buildRepoPrompt, buildYTPrompt, buildBrandPrompt } from '@/lib/server/prompts';

// POST { key, wallet, chain, receipts? }  (Authorization: Bearer <session>)
// Returns the master build-prompt ONLY if the authenticated wallet has unlocked
// this key — either via the server ledger OR via an on-chain-verifiable payment
// receipt. Content never ships to the client otherwise.
export async function POST(req: Request) {
  const address = getSessionAddress(req);
  if (!address) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const key: string = (body?.key || '').toString();
  const wallet: string = (body?.wallet || '').toString().trim();
  const chain: string = (body?.chain || 'cronos').toString();

  if (!key) return NextResponse.json({ error: 'missing key' }, { status: 400 });

  // 1) ledger (fast path)
  let unlocked = !!(await getUnlock(address, key));

  // 2) blockchain-backed receipts (durable proof of payment)
  if (!unlocked) {
    const receipts: { key: string; txHash: string }[] = Array.isArray(body?.receipts)
      ? body.receipts.filter((r: any) => r && r.key && r.txHash)
      : [];
    for (const r of receipts) {
      const relevant = r.key === key || r.key === 'unlock-all';
      if (!relevant) continue;
      if (!/^0x[0-9a-fA-F]{64}$/.test(r.txHash)) continue;
      const required = r.key === 'unlock-all' ? PRICE_ALL_WEI : PRICE_WEI;
      const v = await verifyPaymentTx(r.txHash, address, required);
      if (v.ok) { unlocked = true; break; }
    }
  }

  if (!unlocked) return NextResponse.json({ error: 'locked' }, { status: 403 });

  let prompt: string | null = null;
  try {
    if (key.startsWith('app:')) {
      const app = APPS.find((a) => a.id === key.slice(4));
      if (!app) throw new Error('unknown app');
      prompt = buildMasterPrompt(app, { chain, wallet });
    } else if (key.startsWith('repo:')) {
      const repo = REPOS.find((r) => r.id === key.slice(5));
      if (!repo) throw new Error('unknown repo');
      prompt = buildRepoPrompt(repo, { chain, wallet });
    } else if (key.startsWith('yt:')) {
      const ch = YT_CHANNELS.find((c) => c.id === key.slice(3));
      if (!ch) throw new Error('unknown channel');
      prompt = buildYTPrompt({ channel: ch, genreId: ch.genre, name: ch.name, goal: 'grow' });
    } else if (key.startsWith('brand:')) {
      const br = BRANDS.find((b) => b.id === key.slice(6));
      if (!br) throw new Error('unknown brand');
      prompt = buildBrandPrompt({ brand: br, sectorId: br.sector, name: br.name, desc: br.tagline, goal: 'engagement', chain, wallet });
    } else {
      return NextResponse.json({ error: 'unknown key' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  return NextResponse.json({ prompt });
}

export const dynamic = 'force-dynamic';
