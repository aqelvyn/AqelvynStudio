import { defineChain } from 'viem';

// Every EVM network AQELVYN Studio supports for PAYMENT (multi-chain checkout)
// and as a build target for the generated prompts. Each chain carries multiple
// RPC fallbacks so on-chain verification survives a flaky public endpoint.

export const cronos = defineChain({
  id: 25,
  name: 'Cronos',
  nativeCurrency: { name: 'Cronos', symbol: 'CRO', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://evm.cronos.org',
        'https://cronos-evm.publicnode.com',
        'https://cronos-rpc.elk.finance',
      ],
    },
  },
  blockExplorers: {
    default: { name: 'Cronos Explorer', url: 'https://explorer.cronos.org' },
  },
});

export const ethereum = defineChain({
  id: 1,
  name: 'Ethereum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://eth.llamarpc.com', 'https://cloudflare-eth.com'] } },
  blockExplorers: { default: { name: 'Etherscan', url: 'https://etherscan.io' } },
});

export const polygon = defineChain({
  id: 137,
  name: 'Polygon',
  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
  rpcUrls: { default: { http: ['https://polygon-rpc.com', 'https://polygon-bor-rpc.publicnode.com'] } },
  blockExplorers: { default: { name: 'PolygonScan', url: 'https://polygonscan.com' } },
});

export const arbitrum = defineChain({
  id: 42161,
  name: 'Arbitrum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://arb1.arbitrum.io/rpc', 'https://arbitrum-one-rpc.publicnode.com'] } },
  blockExplorers: { default: { name: 'Arbiscan', url: 'https://arbiscan.io' } },
});

export const optimism = defineChain({
  id: 10,
  name: 'Optimism',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://mainnet.optimism.io', 'https://optimism-rpc.publicnode.com'] } },
  blockExplorers: { default: { name: 'Optimism Explorer', url: 'https://optimistic.etherscan.io' } },
});

export const base = defineChain({
  id: 8453,
  name: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://mainnet.base.org', 'https://base-rpc.publicnode.com'] } },
  blockExplorers: { default: { name: 'BaseScan', url: 'https://basescan.org' } },
});

export const bnb = defineChain({
  id: 56,
  name: 'BNB Chain',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: { default: { http: ['https://bsc-dataseed.binance.org', 'https://bsc-rpc.publicnode.com'] } },
  blockExplorers: { default: { name: 'BscScan', url: 'https://bscscan.com' } },
});

export const avalanche = defineChain({
  id: 43114,
  name: 'Avalanche',
  nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  rpcUrls: { default: { http: ['https://api.avax.network/ext/bc/C/rpc', 'https://avalanche-c-chain-rpc.publicnode.com'] } },
  blockExplorers: { default: { name: 'Snowtrace', url: 'https://snowtrace.io' } },
});

export const celo = defineChain({
  id: 42220,
  name: 'Celo',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: { default: { http: ['https://forno.celo.org', 'https://1rpc.io/celo'] } },
  blockExplorers: { default: { name: 'CeloScan', url: 'https://celoscan.io' } },
});

// Robinhood Chain — Arbitrum Orbit L2, ETH gas, chain id 4663.
export const robinhood = defineChain({
  id: 4663,
  name: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.mainnet.chain.robinhood.com'] } },
  blockExplorers: { default: { name: 'Robinhood Explorer', url: 'https://robinhoodchain.blockscout.com' } },
});

// Stable — Tenor's USDT0-native Layer 1, chain id 988.
export const stable = defineChain({
  id: 988,
  name: 'Stable (Tenor)',
  nativeCurrency: { name: 'USDT0', symbol: 'USDT0', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.stable.xyz'] } },
  blockExplorers: { default: { name: 'Stablescan', url: 'https://stablescan.xyz' } },
});

// Chains a user can PAY on (EVM native-token checkout). Solana is excluded —
// it is not EVM and needs a separate signing stack.
export const PAYMENT_CHAINS = [
  cronos, ethereum, polygon, arbitrum, optimism, base, bnb, avalanche, celo, robinhood, stable,
] as const;

export const chainById = (id: number) =>
  (PAYMENT_CHAINS as readonly any[]).find((c) => c.id === id) || null;
