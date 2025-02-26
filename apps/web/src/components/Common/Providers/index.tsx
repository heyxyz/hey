import { ApolloProvider } from "@apollo/client";
import authLink from "@helpers/authLink";
import apolloClient from "@hey/indexer/apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { FC, ReactNode } from "react";
import ErrorBoundary from "../ErrorBoundary";
import Layout from "../Layout";
import FeatureFlagProvider from "./FeatureFlagProvider";
import OptimisticPublicationProvider from "./OptimisticPublicationProvider";
import PreferencesProvider from "./PreferencesProvider";
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
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <ApolloProvider client={lensApolloClient}>
            <FeatureFlagProvider>
              <OptimisticPublicationProvider />
              <PreferencesProvider />
              <ThemeProvider attribute="class" defaultTheme="light">
                <Layout>{children}</Layout>
              </ThemeProvider>
            </FeatureFlagProvider>
          </ApolloProvider>
        </Web3Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default Providers;
