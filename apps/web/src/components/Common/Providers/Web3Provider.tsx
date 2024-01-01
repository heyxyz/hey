import type { FC, ReactNode } from 'react';

import { ALCHEMY_API_KEY, WALLETCONNECT_PROJECT_ID } from '@hey/data/constants';
import connectkitTheme from '@lib/connectkitTheme';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
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
import { publicProvider } from 'wagmi/providers/public';

const { chains } = configureChains(
  [
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
  [publicProvider()]
);

const config = createConfig(
  getDefaultConfig({
    alchemyId: ALCHEMY_API_KEY,
    appIcon: '/logo.png',
    appName: 'Hey',
    chains,
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
        debugMode
        options={{
          hideNoWalletCTA: true,
          hideQuestionMarkCTA: true,
          hideTooltips: true,
          initialChainId: polygon.id,
          reducedMotion: true
        }}
        theme="minimal"
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
