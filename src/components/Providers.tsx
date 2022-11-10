import { ApolloProvider } from '@apollo/client';
import { connectorsForWallets, darkTheme, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import { ThemeProvider, useTheme } from 'next-themes';
import type { ReactNode } from 'react';
import { ALCHEMY_KEY, IS_MAINNET } from 'src/constants';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import client from '../apollo';

const { chains, provider } = configureChains(
  [IS_MAINNET ? chain.polygon : chain.polygonMumbai],
  [alchemyProvider({ apiKey: ALCHEMY_KEY })]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      metaMaskWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ chains }),
      walletConnectWallet({ chains })
    ]
  }
]);

const RainbowKitProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  return (
    <RainbowKitProvider
      modalSize="compact"
      chains={chains}
      theme={theme === 'dark' ? darkTheme() : lightTheme()}
    >
      {children}
    </RainbowKitProvider>
  );
};

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <RainbowKitProviderWrapper>
          <ApolloProvider client={client}>{children}</ApolloProvider>
        </RainbowKitProviderWrapper>
      </ThemeProvider>
    </WagmiConfig>
  );
};

export default Providers;
