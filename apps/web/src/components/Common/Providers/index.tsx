import { ApolloProvider, lensApolloWebClient } from '@hey/lens/apollo';
import getLivepeerTheme from '@lib/getLivepeerTheme';
import {
  createReactClient,
  LivepeerConfig,
  studioProvider
} from '@livepeer/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import ErrorBoundary from '../ErrorBoundary';
import Layout from '../Layout';
import FeaturedGroupsProvider from './FeaturedGroupsProvider';
import LanguageProvider from './LanguageProvider';
import PreferencesProvider from './PreferencesProvider';
import UserSigNoncesProvider from './UserSigNoncesProvider';
import Web3Provider from './Web3Provider';

const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: '' })
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Web3Provider>
          <ApolloProvider client={lensApolloWebClient}>
            <UserSigNoncesProvider />
            <QueryClientProvider client={queryClient}>
              <PreferencesProvider />
              <FeaturedGroupsProvider />
              <LivepeerConfig client={livepeerClient} theme={getLivepeerTheme}>
                <ThemeProvider defaultTheme="light" attribute="class">
                  <Layout>{children}</Layout>
                </ThemeProvider>
              </LivepeerConfig>
            </QueryClientProvider>
          </ApolloProvider>
        </Web3Provider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default Providers;
