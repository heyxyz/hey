import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ALCHEMY_KEY, IS_MAINNET } from 'data/constants';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import client from '../../apollo';
import ErrorBoundary from './ErrorBoundary';
import Layout from './Layout';

const { chains, provider } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai, mainnet],
  [alchemyProvider({ apiKey: ALCHEMY_KEY })]
);

const connectors = () => {
  return [
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new WalletConnectConnector({ chains, options: {} })
  ];
};

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <WagmiConfig client={wagmiClient}>
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" attribute="class">
              <Layout>{children}</Layout>
            </ThemeProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </WagmiConfig>
    </ErrorBoundary>
  );
};

export default Providers;
