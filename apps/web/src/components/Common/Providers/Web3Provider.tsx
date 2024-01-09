import type { FC, ReactNode } from 'react';

import { APP_NAME, WALLETCONNECT_PROJECT_ID } from '@hey/data/constants';
import { createConfig, http, WagmiProvider } from 'wagmi';
import {
  base,
  baseGoerli,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  zora,
  zoraTestnet
} from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

const connectors = [
  injected(),
  coinbaseWallet({ appName: APP_NAME }),
  walletConnect({ projectId: WALLETCONNECT_PROJECT_ID })
];

const wagmiConfig = createConfig({
  chains: [
    base,
    baseGoerli,
    goerli,
    mainnet,
    optimism,
    optimismGoerli,
    polygon,
    polygonMumbai,
    zora,
    zoraTestnet
  ],
  connectors,
  transports: {
    [base.id]: http(),
    [baseGoerli.id]: http(),
    [goerli.id]: http(),
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [optimismGoerli.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
    [zora.id]: http(),
    [zoraTestnet.id]: http()
  }
});

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

export default Web3Provider;
