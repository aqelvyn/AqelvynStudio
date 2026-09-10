// Shared, client-safe constants. No secrets, no treasury address.

export const CHAIN_NAMES: Record<string, string> = {
  cronos: 'Cronos',
  custom: 'your preferred network (specify in the prompt)',
  ethereum: 'Ethereum (Mainnet)', polygon: 'Polygon', arbitrum: 'Arbitrum', optimism: 'Optimism',
  base: 'Base', bnb: 'BNB Chain', avalanche: 'Avalanche', solana: 'Solana', celo: 'Celo',
  robinhood: 'Robinhood Chain', stable: 'Stable (Tenor)'
};

// Network options the user can pick as the build target for a prompt
// (single, multiple, or a custom network they name themselves).
export const NETWORK_OPTIONS: { id: string; label: string; emoji: string; img?: string }[] = [
  { id: 'cronos', label: 'Cronos', emoji: '🟣' },
  { id: 'ethereum', label: 'Ethereum', emoji: '⬛' },
  { id: 'polygon', label: 'Polygon', emoji: '🟪' },
  { id: 'arbitrum', label: 'Arbitrum', emoji: '🔵' },
  { id: 'optimism', label: 'Optimism', emoji: '🔴' },
  { id: 'base', label: 'Base', emoji: '🔷' },
  { id: 'bnb', label: 'BNB Chain', emoji: '🟡' },
  { id: 'avalanche', label: 'Avalanche', emoji: '🔺' },
  { id: 'celo', label: 'Celo', emoji: '🟢' },
  { id: 'robinhood', label: 'Robinhood Chain', emoji: '💹', img: '/chain-robinhood.png' },
  { id: 'stable', label: 'Stable (Tenor)', emoji: '💵', img: '/chain-stable.png' },
  { id: 'solana', label: 'Solana', emoji: '🟩' },
  { id: 'custom', label: 'Custom network', emoji: '🛠️' },
];

export const EXTRAS = [
  'PWA + installable + offline-first',
  'iOS & Android native wrappers (Capacitor/React Native)',
  'Multi-language (i18n) & localization',
  'Gamification & streak/reward system',
  'Referral & viral growth loop',
  'Social features (follow, share, activity feed)',
  'Analytics dashboard & event tracking',
  'Admin/creator console',
  'AI voice + text (multimodal) interface',
  'Marketplace for creators/templates',
];
