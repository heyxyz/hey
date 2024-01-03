import type { FC, ReactNode } from 'react';

import { ALCHEMY_API_KEY, WALLETCONNECT_PROJECT_ID } from '@hey/data/constants';
import connectkitTheme from '@lib/connectkitTheme';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { createConfig, WagmiConfig } from 'wagmi';
import {
  base,
  baseGoerli,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  zora,
  zoraTestnet
} from 'wagmi/chains';

const config = createConfig(
  getDefaultConfig({
    alchemyId: ALCHEMY_API_KEY,
    appIcon: '/logo.png',
    appName: 'Hey',
    chains: [
      polygon,
      polygonMumbai,
      mainnet,
      goerli,
      zora,
      zoraTestnet,
      optimism,
      optimismGoerli,
      base,
      baseGoerli
    ],
    walletConnectProjectId: WALLETCONNECT_PROJECT_ID
  })
);

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider
        customTheme={connectkitTheme}
        options={{
          hideNoWalletCTA: true,
          hideTooltips: true,
          initialChainId: polygon.id,
          reducedMotion: true
        }}
        theme="soft"
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
