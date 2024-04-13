import type { FC, ReactNode } from 'react';

import { APP_NAME, WALLETCONNECT_PROJECT_ID } from '@hey/data/constants';
import { POLYGON_AMOY_RPCS, POLYGON_RPCS } from '@hey/data/rpcs';
import { createConfig, fallback, http, WagmiProvider } from 'wagmi';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

const connectors = [
  injected(),
  coinbaseWallet({ appName: APP_NAME }),
  walletConnect({ projectId: WALLETCONNECT_PROJECT_ID })
];

const wagmiConfig = createConfig({
  chains: [polygon, polygonAmoy],
  connectors,
  transports: {
    [polygon.id]: fallback(POLYGON_RPCS.map((rpc) => http(rpc))),
    [polygonAmoy.id]: fallback(POLYGON_AMOY_RPCS.map((rpc) => http(rpc)))
  }
});

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

export default Web3Provider;
