import '../styles.css'

import { ApolloProvider } from '@apollo/client'
import SiteLayout from '@components/SiteLayout'
import { providers } from 'ethers'
import { AppProps } from 'next/app'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'
import {
  ALCHEMY_KEY,
  ALCHEMY_RPC,
  CHAIN_ID,
  IS_MAINNET,
  IS_PRODUCTION,
  POLYGON_MAINNET,
  POLYGON_MUMBAI
} from 'src/constants'
import { createClient, WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import client from '../apollo'

const supportedChains = IS_MAINNET ? [POLYGON_MAINNET] : [POLYGON_MUMBAI]

const connectors = () => {
  return [
    new InjectedConnector({
      chains: supportedChains,
      options: { shimDisconnect: true }
    }),
    new WalletConnectConnector({
      options: {
        rpc: { [CHAIN_ID]: ALCHEMY_RPC }
      }
    }),
    new CoinbaseWalletConnector({
      options: {
        appName: 'Lenster',
        jsonRpcUrl: ALCHEMY_RPC
      }
    })
  ]
}

const wagmiClient = createClient({
  autoConnect: true,
  provider(config) {
    try {
      return new providers.AlchemyProvider(config.chainId, ALCHEMY_KEY)
    } catch {
      throw new Error(
        `Wrong network, please switch to ${IS_MAINNET ? 'Polygon' : 'Mumbai'}`
      )
    }
  },
  connectors
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={client}>
        <ThemeProvider defaultTheme="light" attribute="class">
          <SiteLayout>
            <Component {...pageProps} />
          </SiteLayout>
        </ThemeProvider>
      </ApolloProvider>
      {IS_PRODUCTION && (
        <Script
          data-website-id="680b8704-0981-4cfd-8577-e5bdf5f77df8"
          src="https://analytics.lenster.xyz/umami.js"
          async
          defer
        />
      )}
    </WagmiConfig>
  )
}

export default App
