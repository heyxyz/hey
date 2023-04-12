import { initLocale } from '@lib/i18n';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { WALLETCONNECT_PROJECT_ID } from 'data/constants';
import { ApolloProvider, webClient } from 'lens/apollo';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { Chain } from 'wagmi';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import ErrorBoundary from './ErrorBoundary';
import Layout from './Layout';

export const linea = {
  id: 59_140,
  name: 'Linea',
  network: 'linea',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH'
  },
  rpcUrls: {
    public: { http: ['https://rpc.goerli.linea.build'] },
    default: { http: ['https://rpc.goerli.linea.build'] }
  },
  blockExplorers: {
    etherscan: { name: 'BlockScout', url: 'https://explorer.goerli.linea.build/' },
    default: { name: 'BlockScout', url: 'https://explorer.goerli.linea.build/' }
  }
} as const satisfies Chain;

const { chains, provider } = configureChains(
  [linea],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://consensys-zkevm-goerli-prealpha.infura.io/v3/c546cdaea46c411888b5ddf00dd2e77c`
      })
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
