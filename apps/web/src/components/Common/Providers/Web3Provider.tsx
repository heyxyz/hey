import {
  APP_NAME,
  IS_MAINNET,
  WALLETCONNECT_PROJECT_ID
} from '@lenster/data/constants';
import getRpc from '@lenster/lib/getRpc';
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import type { ThemeOptions } from '@rainbow-me/rainbowkit/dist/themes/baseTheme';
import {
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import { useTheme } from 'next-themes';
import type { FC, ReactNode } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains, publicClient } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai, mainnet],
  [jsonRpcProvider({ rpc: (chain) => ({ http: getRpc(chain.id) }) })]
);

const defaultWalletOption = { chains, projectId: WALLETCONNECT_PROJECT_ID };
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      rainbowWallet(defaultWalletOption),
      ledgerWallet(defaultWalletOption),
      coinbaseWallet({ appName: APP_NAME, ...defaultWalletOption }),
      walletConnectWallet({
        ...defaultWalletOption,
        options: {
          qrModalOptions: {
            explorerExcludedWalletIds: 'ALL'
          },
          projectId: WALLETCONNECT_PROJECT_ID
        }
      })
    ]
  }
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  const { theme } = useTheme();
  const themeOptions: ThemeOptions = {
    fontStack: 'system',
    overlayBlur: 'small',
    accentColor: '#6366f1'
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        appInfo={{ appName: APP_NAME }}
        modalSize="compact"
        chains={chains}
        theme={
          theme === 'dark' ? darkTheme(themeOptions) : lightTheme(themeOptions)
        }
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
