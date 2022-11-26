import { ApolloProvider } from '@apollo/client';
import { IS_MAINNET, RPC_URL } from 'data/constants';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { CHAIN_ID } from 'src/constants';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import client from '../../apollo';

const { chains, provider } = configureChains(
  [IS_MAINNET ? chain.polygon : chain.polygonMumbai],
  [jsonRpcProvider({ rpc: () => ({ http: RPC_URL }) })]
);

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true }
    }),
    new WalletConnectConnector({
      chains,
      options: { rpc: { [CHAIN_ID]: RPC_URL } }
    })
  ];
};

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={client}>
        <ThemeProvider defaultTheme="light" attribute="class">
          {children}
        </ThemeProvider>
      </ApolloProvider>
    </WagmiConfig>
  );
};

export default Providers;
