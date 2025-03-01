import { heyFont } from "@helpers/fonts";
import {
  APP_NAME,
  BRAND_COLOR,
  DESCRIPTION,
  STATIC_IMAGES_URL,
  WALLETCONNECT_PROJECT_ID
} from "@hey/data/constants";
import { LENS_TESTNET_RPCS } from "@hey/data/rpcs";
import { chains } from "@lens-network/sdk/viem";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import type { FC, ReactNode } from "react";
import { createConfig, fallback, http, WagmiProvider } from "wagmi";

const config = createConfig(
  getDefaultConfig({
    chains: [chains.testnet, chains.testnet],
    transports: {
      [chains.testnet.id]: fallback(
        LENS_TESTNET_RPCS.map((rpc) => http(rpc, { batch: true }))
      ),
      [chains.testnet.id]: fallback(
        LENS_TESTNET_RPCS.map((rpc) => http(rpc, { batch: true }))
      )
    },
    walletConnectProjectId: WALLETCONNECT_PROJECT_ID,
    appName: APP_NAME,
    appDescription: DESCRIPTION,
    appUrl: "https://hey.xyz",
    appIcon: `${STATIC_IMAGES_URL}/app-icon/0.png`
  })
);

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <ConnectKitProvider
        theme="soft"
        options={{
          hideNoWalletCTA: true,
          hideQuestionMarkCTA: true
        }}
        customTheme={{
          "--ck-font-family": heyFont.style.fontFamily,
          "--ck-border-radius": "12px",
          "--ck-body-background": "#ffffff",
          "--ck-focus-color": BRAND_COLOR
        }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
