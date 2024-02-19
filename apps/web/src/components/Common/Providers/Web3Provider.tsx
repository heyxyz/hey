import type { FC, ReactNode } from 'react';

import { WALLETCONNECT_PROJECT_ID } from '@hey/data/constants';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const connectors = [
  injected(),
  walletConnect({ projectId: WALLETCONNECT_PROJECT_ID })
];

const wagmiConfig = createConfig({
  chains: [polygon, polygonMumbai],
  connectors,
  transports: {
    [polygon.id]: http(),
    [polygonMumbai.id]: http()
  }
});

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

export default Web3Provider;
