import type { FC, ReactNode } from 'react';

import { WALLETCONNECT_PROJECT_ID } from '@hey/data/constants';
import heyFont from '@lib/heyFont';
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
    alchemyId: process.env.ALCHEMY_ID,
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
        customTheme={{
          '--ck-font-family': heyFont.style.fontFamily
        }}
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
