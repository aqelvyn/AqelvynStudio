// SERVER-ONLY. Shared on-chain payment verification used by /api/verify and the
// gated generation endpoints (/api/generate, /api/enhance).

import { createPublicClient, http } from 'viem';
import { TREASURY, RPC_URL, MIN_CONFIRMATIONS } from './treasury';

const client = createPublicClient({ transport: http(RPC_URL) });

export interface VerifyResult {
  ok: boolean;
  pending?: boolean;
  error?: string;
}

// Verifies that `txHash` is a real Cronos transaction where the sender is
// `address`, the recipient is the treasury, and the value is >= requiredWei,
// with >= MIN_CONFIRMATIONS confirmations.
export async function verifyPaymentTx(
  txHash: string,
  address: string,
  requiredWei: bigint,
): Promise<VerifyResult> {
  try {
    const tx = await client.getTransaction({ hash: txHash as `0x${string}` });
    if (!tx.blockNumber) return { ok: false, error: 'not mined' };
    if (!tx.from || tx.from.toLowerCase() !== address.toLowerCase()) {
      return { ok: false, error: 'sender mismatch' };
    }
    if ((tx.to || '').toLowerCase() !== TREASURY.toLowerCase()) {
      return { ok: false, error: 'not treasury' };
    }
    if ((tx.value || 0n) < requiredWei) {
      return { ok: false, error: 'insufficient payment' };
    }
    const current = await client.getBlockNumber();
    if (current - tx.blockNumber + 1n < BigInt(MIN_CONFIRMATIONS)) {
      return { ok: false, pending: true };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'rpc error' };
  }
}
