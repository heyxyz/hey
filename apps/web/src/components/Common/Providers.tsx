import { ApolloProvider } from '@apollo/client';
import { initLocale } from '@lib/i18n';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ALCHEMY_KEY, APP_NAME, IS_MAINNET } from 'data/constants';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import client from '../../apollo';
import ErrorBoundary from './ErrorBoundary';
import Layout from './Layout';

const { chains, provider } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai, mainnet],
  [alchemyProvider({ apiKey: ALCHEMY_KEY })]
);

const { connectors } = getDefaultWallets({
  appName: APP_NAME,
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    initLocale();
  }, []);

  return (
    <I18nProvider i18n={i18n}>
      <ErrorBoundary>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} modalSize="compact">
            <ApolloProvider client={client}>
              <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="light" attribute="class">
                  <Layout>{children}</Layout>
                </ThemeProvider>
              </QueryClientProvider>
            </ApolloProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </ErrorBoundary>
    </I18nProvider>
  );
};

export default Providers;
