// SERVER-ONLY. Never import this module from client components — it must not be
// bundled into the browser. The treasury address is the single source of truth
// for payment routing and must never appear in the UI, prompt text, or any
// downloaded artifact.

import { chainById } from '../chains';

export const TREASURY = process.env.TREASURY || '0xe3624Efa7df6d5db7C315992A5530318418b5c60';
export const VERIFY_SECRET = process.env.VERIFY_SECRET || 'dev-only-insecure-secret';

// Confirmations required before an unlock is accepted. 1 is sufficient for a
// microtransaction (the sender/to/value are the real proofs); raise via
// MIN_CONFIRMATIONS env var if you want stronger reorg resistance.
export const MIN_CONFIRMATIONS = Math.max(1, parseInt(process.env.MIN_CONFIRMATIONS || '1', 10) || 1);

// ---------------------------------------------------------------------------
// Multi-chain pricing. The base price is exactly 1 CRO (100 CRO for unlock-all)
// on Cronos. On every other network the user pays the same USD value in that
// network's native token:  priceWei = (1 CRO in USD) / (native token in USD).
// These are reference USD prices, kept in one place so they're trivial to
// update (or override via env) as markets move. Keep it simple by design.
// ---------------------------------------------------------------------------

// Reference USD price of 1 CRO.
export const CRO_USD = parseFloat(process.env.CRO_USD || '0.08');

// Reference USD price of one native token, keyed by chain id.
const NATIVE_USD: Record<number, number> = {
  1: 2200,        // Ethereum ETH
  25: CRO_USD,    // Cronos CRO (base)
  137: 0.35,      // Polygon POL
  42161: 2200,    // Arbitrum ETH
  10: 2200,       // Optimism ETH
  8453: 2200,     // Base ETH
  56: 600,        // BNB
  43114: 25,      // Avalanche AVAX
  42220: 0.5,     // Celo CELO
  4663: 2200,     // Robinhood Chain ETH
  988: 1,         // Stable USDT0 (~$1)
};

export function nativeUsdFor(chainId: number): number {
  return NATIVE_USD[chainId] ?? 1;
}

// 1 CRO-equivalent in the given chain's native token, in wei.
export function priceWeiFor(chainId: number): bigint {
  if (chainId === 25) return 10n ** 18n; // exactly 1 CRO
  const nativeUsd = nativeUsdFor(chainId);
  const units = (CRO_USD / nativeUsd) * 1e18;
  // floor to an integer wei amount; at least 1 wei
  const wei = BigInt(Math.floor(units));
  return wei > 0n ? wei : 1n;
}

// 100 CRO-equivalent (unlock-all).
export function priceAllWeiFor(chainId: number): bigint {
  return priceWeiFor(chainId) * 100n;
}

export interface PaymentQuote {
  address: string;
  chainId: number;
  chainName: string;
  symbol: string;
  priceWei: string;
  priceAllWei: string;
  // human-readable "≈ 0.000036 ETH" for the UI
  priceLabel: string;
  priceAllLabel: string;
  // 1 CRO USD reference (so the client can show "≈ $0.08")
  usdValue: string;
}

// Produce the full payment quote for a given chain id.
export function quoteForChain(chainId: number): PaymentQuote {
  const chain = chainById(chainId) || chainById(25)!;
  const p = priceWeiFor(chain.id);
  const pa = priceAllWeiFor(chain.id);
  const dec = chain.nativeCurrency.decimals;
  const fmt = (wei: bigint) => {
    const whole = Number(wei) / 10 ** dec;
    return `${whole.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${chain.nativeCurrency.symbol}`;
  };
  return {
    address: TREASURY,
    chainId: chain.id,
    chainName: chain.name,
    symbol: chain.nativeCurrency.symbol,
    priceWei: p.toString(),
    priceAllWei: pa.toString(),
    priceLabel: `≈ ${fmt(p)}`,
    priceAllLabel: `≈ ${fmt(pa)}`,
    usdValue: CRO_USD.toFixed(4),
  };
}
