import '../styles.css'

import { ApolloProvider } from '@apollo/client'
import SiteLayout from '@components/SiteLayout'
import { providers } from 'ethers'
import { AppProps } from 'next/app'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'
import {
  CHAIN_ID,
  INFURA_ID,
  IS_MAINNET,
  IS_PRODUCTION,
  POLYGON_MAINNET,
  POLYGON_MUMBAI
} from 'src/constants'
import { createClient, Provider } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import client from '../apollo'

const supportedChains = IS_MAINNET ? [POLYGON_MAINNET] : [POLYGON_MUMBAI]
const defaultChain = IS_MAINNET ? POLYGON_MAINNET : POLYGON_MUMBAI

type ConnectorsConfig = { chainId?: number }

const connectors = ({ chainId }: ConnectorsConfig) => {
  const rpcUrl =
    supportedChains.find((x) => x.id === chainId)?.rpcUrls?.default?.[0] ??
    defaultChain.rpcUrls.default[0]

  return [
    new InjectedConnector({
      chains: supportedChains,
      options: { shimDisconnect: true }
    }),
    new WalletConnectConnector({
      options: {
        infuraId: INFURA_ID,
        chainId: CHAIN_ID
      }
    }),
    new CoinbaseWalletConnector({
      options: {
        appName: 'Lenster',
        jsonRpcUrl: `${rpcUrl}/${INFURA_ID}`
      }
    })
  ]
}

const wagmiClient = createClient({
  autoConnect: true,
  provider(config) {
    try {
      return new providers.InfuraProvider(config.chainId, INFURA_ID)
    } catch {
      throw new Error(
        `Wrong network, please change to ${IS_MAINNET ? 'Polygon' : 'Mumbai'}`
      )
    }
  },
  connectors
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider client={wagmiClient}>
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
    </Provider>
  )
}

export default App
