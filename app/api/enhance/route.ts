import { NextResponse } from 'next/server';
import { getSessionAddress } from '@/lib/server/auth';
import { verifyPaymentTx } from '@/lib/server/verifyTx';
import { PRICE_WEI } from '@/lib/server/treasury';
import { enhancePrompt } from '@/lib/server/prompts';

// POST { txHash, text, wallet, chain }
// Per-attempt AI Enhancer: verifies a fresh 1 CRO payment, then returns the
// enhanced prompt.
export async function POST(req: Request) {
  const address = getSessionAddress(req);
  if (!address) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const txHash: string = (body?.txHash || '').toString();
  const text: string = (body?.text || '').toString();
  if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    return NextResponse.json({ error: 'invalid tx' }, { status: 400 });
  }
  if (!text.trim()) {
    return NextResponse.json({ error: 'empty prompt' }, { status: 400 });
  }

  const v = await verifyPaymentTx(txHash, address, PRICE_WEI);
  if (!v.ok) {
    return NextResponse.json({ error: v.error || 'not verified', pending: !!v.pending }, { status: 402 });
  }

  const wallet = (body?.wallet || '').toString().trim();
  const chain = (body?.chain || 'cronos').toString();
  return NextResponse.json({ prompt: enhancePrompt(text, chain, wallet) });
}

export const dynamic = 'force-dynamic';
