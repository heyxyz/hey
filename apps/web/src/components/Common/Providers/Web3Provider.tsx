import { APP_NAME, WALLETCONNECT_PROJECT_ID } from "@hey/data/constants";
import { LENS_TESTNET_RPCS } from "@hey/data/rpcs";
import { chains } from "@lens-network/sdk/viem";
import type { FC, ReactNode } from "react";
import { createConfig, fallback, http, WagmiProvider } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const connectors = [
  injected(),
  coinbaseWallet({ appName: APP_NAME }),
  walletConnect({ projectId: WALLETCONNECT_PROJECT_ID })
];

const wagmiConfig = createConfig({
  chains: [chains.testnet, chains.testnet],
  connectors,
  transports: {
    [chains.testnet.id]: fallback(LENS_TESTNET_RPCS.map((rpc) => http(rpc))),
    [chains.testnet.id]: fallback(LENS_TESTNET_RPCS.map((rpc) => http(rpc)))
  }
});

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

export default Web3Provider;
