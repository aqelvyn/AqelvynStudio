import { NextResponse } from 'next/server';
import { listUnlocks } from '@/lib/server/store';
import { verifyPaymentTx } from '@/lib/server/verifyTx';
import { PRICE_WEI, PRICE_ALL_WEI } from '@/lib/server/treasury';

// GET /api/unlocks?address=0x... -> server-side ledger unlock list (fast path).
// POST { address, receipts: [{key, txHash}] } -> re-verifies each payment
// on-chain (durable proof; works on serverless hosts with no database).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const address = (url.searchParams.get('address') || '').toLowerCase();
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ unlocks: [] });
  }
  const unlocks = await listUnlocks(address);
  return NextResponse.json({ unlocks });
}

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { body = {}; }
  const address: string = (body?.address || '').toString();
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ unlocks: [] });
  }
  const receipts: { key: string; txHash: string }[] = Array.isArray(body?.receipts)
    ? body.receipts.filter((r: any) => r && r.key && r.txHash)
    : [];

  const unlocks: { key: string; tx: string }[] = [];
  const seen = new Set<string>();
  for (const r of receipts) {
    if (seen.has(r.key)) continue;
    if (!/^0x[0-9a-fA-F]{64}$/.test(r.txHash)) continue;
    const required = r.key === 'unlock-all' ? PRICE_ALL_WEI : PRICE_WEI;
    const v = await verifyPaymentTx(r.txHash, address, required);
    if (v.ok) {
      seen.add(r.key);
      unlocks.push({ key: r.key, tx: r.txHash });
    }
  }
  return NextResponse.json({ unlocks });
}

export const dynamic = 'force-dynamic';
export const maxDuration = 30;
