import getLivepeerTheme from '@lib/getLivepeerTheme';
import {
  createReactClient,
  LivepeerConfig,
  studioProvider
} from '@livepeer/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IS_MAINNET, WALLETCONNECT_PROJECT_ID } from 'data/constants';
import { ApolloProvider, webClient } from 'lens/apollo';
import getRpc from 'lib/getRpc';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import ErrorBoundary from '../ErrorBoundary';
import Layout from '../Layout';
import FeatureFlagsProvider from './FeatureFlagsProvider';
import LanguageProvider from './LanguageProvider';
import LeafwatchProvider from './LeafwatchProvider';
import UserSigNoncesProvider from './UserSigNoncesProvider';

const { chains, publicClient } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai, mainnet],
  [jsonRpcProvider({ rpc: (chain) => ({ http: getRpc(chain.id) }) })]
);

const connectors = [
  new InjectedConnector({ chains, options: { shimDisconnect: true } }),
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

const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: '' })
});

const queryClient = new QueryClient();
const apolloClient = webClient;

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <FeatureFlagsProvider />
        <LeafwatchProvider />
        <WagmiConfig config={wagmiConfig}>
          <ApolloProvider client={apolloClient}>
            <UserSigNoncesProvider />
            <QueryClientProvider client={queryClient}>
              <LivepeerConfig client={livepeerClient} theme={getLivepeerTheme}>
                <ThemeProvider defaultTheme="light" attribute="class">
                  <Layout>{children}</Layout>
                </ThemeProvider>
              </LivepeerConfig>
            </QueryClientProvider>
          </ApolloProvider>
        </WagmiConfig>
      </ErrorBoundary>
    </LanguageProvider>
  );
};

export default Providers;
