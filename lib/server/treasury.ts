// SERVER-ONLY. Never import this module from client components — it must not be
// bundled into the browser. The treasury address is the single source of truth
// for Cronos payment routing and must never appear in the UI, prompt text, or
// any downloaded artifact.

export const TREASURY = process.env.TREASURY || '0xe3624Efa7df6d5db7C315992A5530318418b5c60';
export const RPC_URL = process.env.CRONOS_RPC_URL || 'https://evm.cronos.org';
export const VERIFY_SECRET = process.env.VERIFY_SECRET || 'dev-only-insecure-secret';

export const PRICE_WEI = 10n ** 18n;            // 1 CRO
export const PRICE_ALL_WEI = 100n * 10n ** 18n; // 100 CRO
// Confirmations required before an unlock is accepted. 1 is sufficient for a
// 1-CRO microtransaction (the sender/to/value are the real proofs); raise via
// MIN_CONFIRMATIONS env var if you want stronger reorg resistance.
export const MIN_CONFIRMATIONS = Math.max(1, parseInt(process.env.MIN_CONFIRMATIONS || '1', 10) || 1);
