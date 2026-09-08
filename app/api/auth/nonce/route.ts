import { NextResponse } from 'next/server';
import { issueNonce, buildMessage } from '@/lib/server/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const address: string = (body?.address || '').toString();
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ error: 'invalid address' }, { status: 400 });
  }
  const { nonce } = issueNonce(address);
  return NextResponse.json({ nonce, message: buildMessage(address, nonce) });
}

export const dynamic = 'force-dynamic';
