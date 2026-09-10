import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { VERIFY_SECRET } from '@/lib/server/treasury';
import { priceWeiFor, priceAllWeiFor } from '@/lib/server/treasury';
import { verifyPaymentTx } from '@/lib/server/verifyTx';
import { setUnlock } from '@/lib/server/store';

// Lightweight in-memory rate limiter (per-process; best-effort in serverless).
const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const cur = hits.get(key);
  if (!cur || cur.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  cur.count += 1;
  return cur.count > max;
}

// POST { txHash, key, address, chainId } -> verifies the tx on-chain (on the
// network it was sent on) and records the unlock server-side.
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (rateLimited(ip, 30, 60_000)) {
    return NextResponse.json({ verified: false, error: 'rate limited' }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  const txHash: string = (body?.txHash || '').toString();
  const key: string = (body?.key || '').toString();
  const address: string = (body?.address || '').toString();
  const chainId: number = parseInt(body?.chainId || '25', 10) || 25;

  if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    return NextResponse.json({ verified: false });
  }
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ verified: false });
  }
  if (!key || key.length > 200) {
    return NextResponse.json({ verified: false });
  }

  // per-key price: unlock-all costs 100 CRO-equivalent, everything else 1.
  const required = key === 'unlock-all' ? priceAllWeiFor(chainId) : priceWeiFor(chainId);

  const v = await verifyPaymentTx(txHash, address, required, chainId);
  if (!v.ok) {
    return NextResponse.json({ verified: false, pending: !!v.pending, error: v.error });
  }

  // record the unlock server-side
  await setUnlock({ address, key, tx: txHash, at: Date.now() });

  const token = createHmac('sha256', VERIFY_SECRET)
    .update(`${txHash}:${key}:${address.toLowerCase()}`)
    .digest('hex');

  return NextResponse.json({ verified: true, token });
}

export const dynamic = 'force-dynamic';
export const maxDuration = 30;
