import { NextResponse } from 'next/server';
import { quoteForChain } from '@/lib/server/treasury';

// The client fetches the payment destination + prices here, so the treasury
// address is never baked into the client bundle. Multi-chain: pass `chainId`
// (defaults to Cronos) to get that network's native-token price.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const chainId = parseInt(url.searchParams.get('chainId') || '25', 10) || 25;
  return NextResponse.json(quoteForChain(chainId));
}

export const dynamic = 'force-dynamic';
