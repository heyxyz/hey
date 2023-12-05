import type { FC, ReactNode } from 'react';

import { APP_NAME, WALLETCONNECT_PROJECT_ID } from '@hey/data/constants';
import { CoinbaseWalletConnector } from '@wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from '@wagmi/connectors/injected';
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';
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

const { chains, publicClient } = configureChains(
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

const connectors: any = [
  new InjectedConnector({ chains, options: { shimDisconnect: true } }),
  new CoinbaseWalletConnector({ options: { appName: APP_NAME } }),
  new WalletConnectConnector({
    chains,
    options: { projectId: WALLETCONNECT_PROJECT_ID }
  })
];

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};

export default Web3Provider;
