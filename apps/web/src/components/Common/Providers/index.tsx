import type { FC, ReactNode } from 'react';

import authLink from '@helpers/authLink';
import getLivepeerTheme from '@helpers/getLivepeerTheme';
import { LIVEPEER_KEY } from '@hey/data/constants';
import { apolloClient, ApolloProvider } from '@hey/lens/apollo';
import {
  createReactClient,
  LivepeerConfig,
  studioProvider
} from '@livepeer/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import ErrorBoundary from '../ErrorBoundary';
import Layout from '../Layout';
import Web3Provider from './Web3Provider';

const lensApolloClient = apolloClient(authLink);
const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: LIVEPEER_KEY })
});
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      {/* <ServiceWorkerProvider /> */}
      <Web3Provider>
        <ApolloProvider client={lensApolloClient}>
          {/* <LeafwatchProvider />
          <LensAuthProvider />
          <LensSubscriptionsProvider />
          <OptimisticTransactionsProvider /> */}
          <QueryClientProvider client={queryClient}>
            {/* <PreferencesProvider /> */}
            {/* <ProProvider /> */}
            <LivepeerConfig client={livepeerClient} theme={getLivepeerTheme}>
              <ThemeProvider attribute="class" defaultTheme="light">
                <Layout>{children}</Layout>
              </ThemeProvider>
            </LivepeerConfig>
          </QueryClientProvider>
        </ApolloProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
};

export default Providers;
