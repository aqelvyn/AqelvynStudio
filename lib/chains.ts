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
  iconUrl: 'data:image/png;base64,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',
  iconBackground: '#21ce99',
});

// Stable — Tenor's USDT0-native Layer 1, chain id 988.
export const stable = defineChain({
  id: 988,
  name: 'Stable (Tenor)',
  nativeCurrency: { name: 'USDT0', symbol: 'USDT0', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.stable.xyz'] } },
  blockExplorers: { default: { name: 'Stablescan', url: 'https://stablescan.xyz' } },
  iconUrl: 'data:image/png;base64,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',
  iconBackground: '#26a17b',
});

// Chains a user can PAY on (EVM native-token checkout). Solana is excluded —
// it is not EVM and needs a separate signing stack.
export const PAYMENT_CHAINS = [
  cronos, ethereum, polygon, arbitrum, optimism, base, bnb, avalanche, celo, robinhood, stable,
] as const;

export const chainById = (id: number) =>
  (PAYMENT_CHAINS as readonly any[]).find((c) => c.id === id) || null;
