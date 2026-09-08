'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { cronos } from './chains';

// Note: `projectId` is used by WalletConnect. For a production deployment,
// obtain a real projectId from cloud.walletconnect.com. Injected wallets
// (MetaMask etc.) work regardless.
export const config = getDefaultConfig({
  appName: 'AQELVYN Studio',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'aqelvyn-studio-demo',
  chains: [cronos],
  ssr: true,
});
