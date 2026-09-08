// SERVER-ONLY. Shared on-chain payment verification used by /api/verify and the
// gated generation endpoints (/api/generate, /api/enhance).

import { createPublicClient, http } from 'viem';
import { TREASURY, RPC_URL, MIN_CONFIRMATIONS } from './treasury';

const client = createPublicClient({ transport: http(RPC_URL) });

export interface VerifyResult {
  ok: boolean;
  pending?: boolean; // retry later (not yet mined / not yet confirmed / transient)
  error?: string;    // definitive failure
}

function isNotFound(e: any): boolean {
  const msg = (e?.message || e?.shortMessage || '').toLowerCase();
  return msg.includes('not found') || msg.includes('could not be found') || msg.includes('notfound');
}

// Verifies that `txHash` is a real Cronos transaction where the sender is
// `address`, the recipient is the treasury, and the value is >= requiredWei,
// with >= MIN_CONFIRMATIONS confirmations.
export async function verifyPaymentTx(
  txHash: string,
  address: string,
  requiredWei: bigint,
): Promise<VerifyResult> {
  let tx: any;
  try {
    tx = await client.getTransaction({ hash: txHash as `0x${string}` });
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
    const current = await client.getBlockNumber();
    const confs = current - tx.blockNumber + 1n;
    if (confs < BigInt(MIN_CONFIRMATIONS)) return { ok: false, pending: true };
  } catch {
    // Could not read the latest block (transient) — treat as pending, not fatal.
    return { ok: false, pending: true };
  }

  return { ok: true };
}
