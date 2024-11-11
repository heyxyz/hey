import { ApolloProvider } from "@apollo/client";
import authLink from "@helpers/authLink";
import apolloClient from "@hey/lens/apollo/client";
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
              <ThemeProvider attribute="class" defaultTheme="light">
                <Layout>{children}</Layout>
              </ThemeProvider>
            </QueryClientProvider>
          </FeatureFlagProvider>
        </ApolloProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
};

export default Providers;
