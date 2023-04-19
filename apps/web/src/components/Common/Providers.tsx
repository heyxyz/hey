import { initLocale } from '@lib/i18n';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IS_MAINNET, WALLETCONNECT_PROJECT_ID } from 'data/constants';
import { ApolloProvider, webClient } from 'lens/apollo';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import ErrorBoundary from './ErrorBoundary';
import Layout from './Layout';

const { chains, provider } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai, mainnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: `https://rpc.brovider.xyz/${chain.id}` })
    })
  ]
);

const connectors = () => {
  return [
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new WalletConnectConnector({
      options: {
        projectId: WALLETCONNECT_PROJECT_ID,
        showQrModal: true
      }
    })
  ];
};

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const queryClient = new QueryClient();
const apolloClient = webClient;

const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    initLocale();
  }, []);

  return (
    <I18nProvider i18n={i18n}>
      <ErrorBoundary>
        <WagmiConfig client={wagmiClient}>
          <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider defaultTheme="light" attribute="class">
                <Layout>{children}</Layout>
              </ThemeProvider>
            </QueryClientProvider>
          </ApolloProvider>
        </WagmiConfig>
      </ErrorBoundary>
    </I18nProvider>
  );
};

export default Providers;
