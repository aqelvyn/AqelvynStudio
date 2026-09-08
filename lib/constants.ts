// Shared, client-safe constants. No secrets, no treasury address.

export const CHAIN_NAMES: Record<string, string> = {
  cronos: 'Cronos',
  custom: 'your preferred network (specify in the prompt)',
  ethereum: 'Ethereum (Mainnet)', polygon: 'Polygon', arbitrum: 'Arbitrum', optimism: 'Optimism',
  base: 'Base', bnb: 'BNB Chain', avalanche: 'Avalanche', solana: 'Solana', celo: 'Celo'
};

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
