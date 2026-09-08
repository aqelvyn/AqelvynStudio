import { NextResponse } from 'next/server';
import { WEB3_PROMPTS } from '@/lib/data/web3';
import { buildWeb3Prompt } from '@/lib/server/prompts';

// Lightweight in-memory rate limit (public free content — generous ceiling).
const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const cur = hits.get(key);
  if (!cur || cur.resetAt < now) { hits.set(key, { count: 1, resetAt: now + windowMs }); return false; }
  cur.count += 1;
  return cur.count > max;
}

// GET /api/free/[id]?chain=...&wallet=...
// Returns a full free master build-prompt. No payment, no wallet, no unlock.
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (rateLimited(ip, 120, 60_000)) {
    return NextResponse.json({ error: 'rate limited' }, { status: 429 });
  }

  const id = params.id;
  const e = WEB3_PROMPTS.find((p) => p.id === id);
  if (!e) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const url = new URL(req.url);
  const chain = url.searchParams.get('chain') || 'cronos';
  const wallet = url.searchParams.get('wallet') || '';

  const prompt = buildWeb3Prompt(e, { chain, wallet });
  return NextResponse.json({ prompt });
}

export const dynamic = 'force-dynamic';
