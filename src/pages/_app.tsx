import '../styles.css'

import { ApolloProvider } from '@apollo/client'
import SiteLayout from '@components/SiteLayout'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { ALCHEMY_KEY, ALCHEMY_RPC, CHAIN_ID, IS_MAINNET } from 'src/constants'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import client from '../apollo'

const { chains, provider } = configureChains(
  [IS_MAINNET ? chain.polygon : chain.polygonMumbai],
  [alchemyProvider({ apiKey: ALCHEMY_KEY })]
)

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true }
    }),
    new WalletConnectConnector({
      chains,
      options: { rpc: { [CHAIN_ID]: ALCHEMY_RPC } }
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
    </WagmiConfig>
  )
}

export default App
