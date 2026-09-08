import { NextResponse } from 'next/server';
import { recoverMessageAddress } from 'viem';
import { verifyNonce, issueSession, buildMessage } from '@/lib/server/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const address: string = (body?.address || '').toString();
  const signature: string = (body?.signature || '').toString();
  const nonce: string = (body?.nonce || '').toString();
  const message: string = (body?.message || '').toString();

  if (!/^0x[0-9a-fA-F]{40}$/.test(address) || !signature) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
  if (!verifyNonce(address, nonce)) {
    return NextResponse.json({ error: 'invalid or expired nonce' }, { status: 401 });
  }
  const expected = buildMessage(address, nonce);
  if (message && message !== expected) {
    return NextResponse.json({ error: 'message mismatch' }, { status: 401 });
  }

  let recovered: string;
  try {
    recovered = await recoverMessageAddress({ message: expected, signature: signature as `0x${string}` });
  } catch {
    return NextResponse.json({ error: 'bad signature' }, { status: 401 });
  }
  if (recovered.toLowerCase() !== address.toLowerCase()) {
    return NextResponse.json({ error: 'signer mismatch' }, { status: 401 });
  }

  return NextResponse.json({ token: issueSession(address) });
}

export const dynamic = 'force-dynamic';
