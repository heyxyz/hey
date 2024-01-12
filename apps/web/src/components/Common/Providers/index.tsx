import type { ReactNode } from 'react';

import { LIVEPEER_KEY } from '@hey/data/constants';
import { apolloClient, ApolloProvider } from '@hey/lens/apollo';
import authLink from '@lib/authLink';
import getLivepeerTheme from '@lib/getLivepeerTheme';
import {
  createReactClient,
  LivepeerConfig,
  studioProvider
} from '@livepeer/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import ErrorBoundary from '../ErrorBoundary';
import Layout from '../Layout';
import FeaturedGroupsProvider from './FeaturedGroupsProvider';
import LeafwatchProvider from './LeafwatchProvider';
import LensSubscriptionsProvider from './LensSubscriptionsProvider';
import PreferencesProvider from './PreferencesProvider';
import ServiceWorkerProvider from './ServiceWorkerProvider';
import TbaStatusProvider from './TbaStatusProvider';
import Web3Provider from './Web3Provider';

const lensApolloClient = apolloClient(authLink);
const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: LIVEPEER_KEY })
});
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <ServiceWorkerProvider />
      <LeafwatchProvider />
      <Web3Provider>
        <ApolloProvider client={lensApolloClient}>
          <LensSubscriptionsProvider />
          <QueryClientProvider client={queryClient}>
            <PreferencesProvider />
            <TbaStatusProvider />
            <FeaturedGroupsProvider />
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
