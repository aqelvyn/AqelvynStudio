import { NextResponse } from 'next/server';
import { TREASURY, PRICE_WEI, PRICE_ALL_WEI } from '@/lib/server/treasury';

// The client fetches the payment destination + prices here, so the treasury
// address is never baked into the client bundle.
export async function GET() {
  return NextResponse.json({
    address: TREASURY,
    chainId: 25,
    chainName: 'Cronos',
    symbol: 'CRO',
    priceWei: PRICE_WEI.toString(),
    priceAllWei: PRICE_ALL_WEI.toString(),
  });
}

export const dynamic = 'force-dynamic';
