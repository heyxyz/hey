import {
  APP_NAME,
  IS_MAINNET,
  WALLETCONNECT_PROJECT_ID
} from '@lenster/data/constants';
import getRpc from '@lenster/lib/getRpc';
import type { FC, ReactNode } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains, publicClient } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai, mainnet],
  [jsonRpcProvider({ rpc: (chain) => ({ http: getRpc(chain.id) }) })]
);

const connectors: any = [
  new InjectedConnector({ chains, options: { shimDisconnect: true } }),
  new CoinbaseWalletConnector({ options: { appName: APP_NAME } }),
  new WalletConnectConnector({
    options: { projectId: WALLETCONNECT_PROJECT_ID },
    chains
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
