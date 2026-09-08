import { NextResponse } from 'next/server';
import { listUnlocks } from '@/lib/server/store';

// GET /api/unlocks?address=0x... -> server-side unlock list for a wallet.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const address = (url.searchParams.get('address') || '').toLowerCase();
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ unlocks: [] });
  }
  const unlocks = await listUnlocks(address);
  return NextResponse.json({ unlocks });
}

export const dynamic = 'force-dynamic';
