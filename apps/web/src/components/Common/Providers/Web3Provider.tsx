import type { FC, ReactNode } from 'react';

import {
  APP_NAME,
  HEY_API_URL,
  WALLETCONNECT_PROJECT_ID
} from '@hey/data/constants';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

const connectors = [
  injected(),
  coinbaseWallet({ appName: APP_NAME }),
  walletConnect({ projectId: WALLETCONNECT_PROJECT_ID })
];

export const wagmiConfig = createConfig({
  chains: [polygon, polygonAmoy],
  connectors,
  transports: {
    [polygon.id]: http(`${HEY_API_URL}/rpc?chain=${polygon.id}`),
    [polygonAmoy.id]: http(`${HEY_API_URL}/rpc?chain=${polygonAmoy.id}`)
  }
});

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

export default Web3Provider;
