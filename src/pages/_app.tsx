import '../styles.css'

import { ApolloProvider } from '@apollo/client'
import SiteLayout from '@components/SiteLayout'
import { AppProps } from 'next/app'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'
import {
  ALCHEMY_KEY,
  ALCHEMY_RPC,
  CHAIN_ID,
  IS_MAINNET,
  IS_PRODUCTION
} from 'src/constants'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import client from '../apollo'

const { chains, provider } = configureChains(
  [IS_MAINNET ? chain.polygon : chain.polygonMumbai, chain.mainnet],
  [alchemyProvider({ alchemyId: ALCHEMY_KEY })]
)

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
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
  connectors,
  provider
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
