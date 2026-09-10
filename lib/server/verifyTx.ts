// SERVER-ONLY. Shared on-chain payment verification used by /api/verify and the
// gated generation endpoints (/api/generate, /api/enhance). Multi-chain: verifies
// the transaction on the network it was actually sent on.

import { createPublicClient, http } from 'viem';
import { TREASURY, MIN_CONFIRMATIONS } from './treasury';
import { chainById } from '../chains';

function rpcsFor(chainId: number): string[] {
  const chain = chainById(chainId);
  if (!chain) return [];
  return (chain.rpcUrls?.default?.http || []) as string[];
}

export interface VerifyResult {
  ok: boolean;
  pending?: boolean; // retry later (not yet mined / not yet confirmed / transient)
  error?: string;    // definitive failure
}

function isNotFound(e: any): boolean {
  const msg = (e?.message || e?.shortMessage || '').toLowerCase();
  return msg.includes('not found') || msg.includes('could not be found') || msg.includes('notfound');
}

// Verifies that `txHash` is a real transaction on `chainId` where the sender is
// `address`, the recipient is the treasury, and the value is >= requiredWei,
// with >= MIN_CONFIRMATIONS confirmations.
export async function verifyPaymentTx(
  txHash: string,
  address: string,
  requiredWei: bigint,
  chainId: number = 25,
): Promise<VerifyResult> {
  const rpcs = rpcsFor(chainId);
  if (rpcs.length === 0) return { ok: false, error: 'unsupported chain' };

  const clients = rpcs.map((u) => createPublicClient({ transport: http(u) }));

  async function tryAll<T>(fn: (c: any) => Promise<T>): Promise<T> {
    let lastErr: any;
    for (const c of clients) {
      try { return await fn(c); } catch (e) { lastErr = e; }
    }
    throw lastErr;
  }

  let tx: any;
  try {
    tx = await tryAll((c) => c.getTransaction({ hash: txHash as `0x${string}` }));
  } catch (e: any) {
    // If the RPC hasn't indexed the transaction yet, treat it as "pending" so
    // the client keeps polling instead of failing outright.
    if (isNotFound(e)) return { ok: false, pending: true };
    return { ok: false, error: 'rpc error' };
  }

  if (!tx) return { ok: false, pending: true };
  if (!tx.blockNumber) return { ok: false, pending: true }; // mined but not yet reflected

  if (!tx.from || tx.from.toLowerCase() !== address.toLowerCase()) {
    return { ok: false, error: 'sender mismatch' };
  }
  if ((tx.to || '').toLowerCase() !== TREASURY.toLowerCase()) {
    return { ok: false, error: 'not treasury' };
  }
  if ((tx.value || 0n) < requiredWei) {
    return { ok: false, error: 'insufficient payment' };
  }

  try {
    const current: bigint = await tryAll((c: any) => c.getBlockNumber() as Promise<bigint>);
    const confs = current - tx.blockNumber + 1n;
    if (confs < BigInt(MIN_CONFIRMATIONS)) return { ok: false, pending: true };
  } catch {
    // Could not read the latest block (transient) — treat as pending, not fatal.
    return { ok: false, pending: true };
  }

  return { ok: true };
}
