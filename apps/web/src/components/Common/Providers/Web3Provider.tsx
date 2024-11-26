import { lensTestnet } from "@helpers/chains";
import { APP_NAME, WALLETCONNECT_PROJECT_ID } from "@hey/data/constants";
import { LENS_TESTNET_RPCS, POLYGON_RPCS } from "@hey/data/rpcs";
import type { FC, ReactNode } from "react";
import { http, WagmiProvider, createConfig, fallback } from "wagmi";
import { polygon } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const connectors = [
  injected(),
  coinbaseWallet({ appName: APP_NAME }),
  walletConnect({ projectId: WALLETCONNECT_PROJECT_ID })
];

const wagmiConfig = createConfig({
  chains: [polygon, lensTestnet],
  connectors,
  transports: {
    [polygon.id]: fallback(POLYGON_RPCS.map((rpc) => http(rpc))),
    [lensTestnet.id]: fallback(LENS_TESTNET_RPCS.map((rpc) => http(rpc)))
  }
});

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};

export default Web3Provider;
