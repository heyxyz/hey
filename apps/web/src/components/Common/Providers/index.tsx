import authLink from "@helpers/authLink";
import getLivepeerTheme from "@helpers/getLivepeerTheme";
import { LIVEPEER_KEY } from "@hey/data/constants";
import { ApolloProvider, apolloClient } from "@hey/lens/apollo";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider
} from "@livepeer/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { FC, ReactNode } from "react";
import ErrorBoundary from "../ErrorBoundary";
import Layout from "../Layout";
import FeatureFlagProvider from "./FeatureFlagProvider";
import LeafwatchProvider from "./LeafwatchProvider";
import LensSubscriptionsProvider from "./LensSubscriptionsProvider";
import OptimisticTransactionsProvider from "./OptimisticTransactionsProvider";
import PreferencesProvider from "./PreferencesProvider";
import ServiceWorkerProvider from "./ServiceWorkerProvider";
import Web3Provider from "./Web3Provider";

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
      <ServiceWorkerProvider />
      <LeafwatchProvider />
      <Web3Provider>
        <ApolloProvider client={lensApolloClient}>
          <FeatureFlagProvider>
            <LensSubscriptionsProvider />
            <OptimisticTransactionsProvider />
            <QueryClientProvider client={queryClient}>
              <PreferencesProvider />
              <LivepeerConfig client={livepeerClient} theme={getLivepeerTheme}>
                <ThemeProvider attribute="class" defaultTheme="light">
                  <Layout>{children}</Layout>
                </ThemeProvider>
              </LivepeerConfig>
            </QueryClientProvider>
          </FeatureFlagProvider>
        </ApolloProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
};

export default Providers;
