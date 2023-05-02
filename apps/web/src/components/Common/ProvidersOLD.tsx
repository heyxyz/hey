// import React from 'react';
// import getLivepeerTheme from '@lib/getLivepeerTheme';
// import { initLocale } from '@lib/i18n';
// import { i18n } from '@lingui/core';
// import { I18nProvider } from '@lingui/react';
// import { createReactClient, LivepeerConfig, studioProvider } from '@livepeer/react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { IS_MAINNET, LIVEPEER_TOKEN } from 'data/constants';
// import { ApolloProvider, webClient } from 'lens/apollo';
// import { ThemeProvider } from 'next-themes';
// import type { ReactNode } from 'react';
// import { useEffect } from 'react';
// import { configureChains, createClient, WagmiConfig } from 'wagmi';
// import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
// import { InjectedConnector } from 'wagmi/connectors/injected';
// import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

// import ErrorBoundary from '../ErrorBoundary';
// import Layout from '../Layout';
// import FeatureFlagsProvider from './FeatureFlagsProvider';
// import TelemetryProvider from './TelemetryProvider';

// const { chains, provider } = configureChains(
//   [IS_MAINNET ? polygon : polygonMumbai, mainnet],
//   [
//     jsonRpcProvider({
//       rpc: (chain) => ({ http: `https://rpc.brovider.xyz/${chain.id}` })
//     })
//   ]
// );

// const connectors = () => {
//   return [
//     new InjectedConnector({ chains, options: { shimDisconnect: true } }),
//     new WalletConnectLegacyConnector({ chains, options: {} })
//   ];
// };

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider
// });

// const livepeerClient = createReactClient({
//   provider: studioProvider({ apiKey: LIVEPEER_TOKEN })
// });

// const queryClient = new QueryClient();
// const apolloClient = webClient;

// const Providers = ({ children }: { children: ReactNode }) => {
//   useEffect(() => {
//     initLocale();
//   }, []);

//   return (
//     <I18nProvider i18n={i18n}>
//       <ErrorBoundary>
//         <FeatureFlagsProvider>
//           <TelemetryProvider />
//           <WagmiConfig client={wagmiClient}>
//             <ApolloProvider client={apolloClient}>
//               <QueryClientProvider client={queryClient}>
//                 <LivepeerConfig client={livepeerClient} theme={getLivepeerTheme}>
//                   <ThemeProvider defaultTheme="light" attribute="class">
//                     <Layout>{children}</Layout>
//                   </ThemeProvider>
//                 </LivepeerConfig>
//               </QueryClientProvider>
//             </ApolloProvider>
//           </WagmiConfig>
//         </FeatureFlagsProvider>
//       </ErrorBoundary>
//     </I18nProvider>
//   );
// };

// export default Providers;
