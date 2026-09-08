import { NextResponse } from 'next/server';
import { getSessionAddress } from '@/lib/server/auth';
import { verifyPaymentTx } from '@/lib/server/verifyTx';
import { PRICE_WEI } from '@/lib/server/treasury';
import { APPS } from '@/lib/data/apps';
import { buildMasterPrompt } from '@/lib/server/prompts';

// POST { txHash, appId, name, tagline, extras, wallet, chain }
// Per-attempt Generator: verifies a fresh 1 CRO payment, then returns the
// generated prompt. Content never ships without a verified payment.
export async function POST(req: Request) {
  const address = getSessionAddress(req);
  if (!address) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const txHash: string = (body?.txHash || '').toString();
  if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    return NextResponse.json({ error: 'invalid tx' }, { status: 400 });
  }

  const v = await verifyPaymentTx(txHash, address, PRICE_WEI);
  if (!v.ok) {
    return NextResponse.json({ error: v.error || 'not verified', pending: !!v.pending }, { status: 402 });
  }

  const app = APPS.find((a) => a.id === body?.appId) || null;
  const name = (body?.name || app?.name || 'My App').toString().slice(0, 80);
  const tagline = (body?.tagline || app?.tagline || 'A complete, AI-powered, web3-native product').toString();
  const extras = Array.isArray(body?.extras) ? body.extras.map((x: any) => x.toString()).slice(0, 30) : [];
  const wallet = (body?.wallet || '').toString().trim();
  const chain = (body?.chain || 'cronos').toString();

  const prompt = buildMasterPrompt(
    app || { cat: 'ai', name, tagline, emoji: '🤖', features: [], platforms: [] },
    { name, tagline, chain, wallet, extras },
  );

  return NextResponse.json({ prompt });
}

export const dynamic = 'force-dynamic';
