import { ApolloProvider } from '@apollo/client';
import type { LensConfig } from '@lens-protocol/react';
import { LensProvider, production } from '@lens-protocol/react';
import { localStorage } from '@lens-protocol/react/web';
import { bindings as wagmiBindings } from '@lens-protocol/wagmi';
import { initLocale } from '@lib/i18n';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ALCHEMY_KEY, IS_MAINNET } from 'data/constants';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
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

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: production,
  storage: localStorage()
};

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    initLocale();
  }, []);

  return (
    <I18nProvider i18n={i18n}>
      <ErrorBoundary>
        <WagmiConfig client={wagmiClient}>
          <LensProvider config={lensConfig}>
            <ApolloProvider client={client}>
              <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="light" attribute="class">
                  <Layout>{children}</Layout>
                </ThemeProvider>
              </QueryClientProvider>
            </ApolloProvider>
          </LensProvider>
        </WagmiConfig>
      </ErrorBoundary>
    </I18nProvider>
  );
};

export default Providers;
