import '../styles.css'

import { ApolloProvider } from '@apollo/client'
import SiteLayout from '@components/SiteLayout'
import SEO from '@components/utils/SEO'
import { providers } from 'ethers'
import { AppProps } from 'next/app'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'
import { INFURA_ID, IS_PRODUCTION } from 'src/constants'
import { chain, Connector, Provider } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'

import client from '../apollo'

const supportedChains = [chain.polygonTestnetMumbai]
const defaultChain = chain.polygonTestnetMumbai

type ConnectorsConfig = { chainId?: number }

const connectors = ({ chainId }: ConnectorsConfig) => {
  const rpcUrl =
    supportedChains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    defaultChain.rpcUrls[0]

  return [
    new InjectedConnector({
      chains: supportedChains,
      options: { shimDisconnect: true }
    }),
    new WalletConnectConnector({
      options: {
        infuraId: INFURA_ID,
        chainId: chain.polygonTestnetMumbai.id
      }
    }),
    new WalletLinkConnector({
      options: {
        appName: 'Lenster',
        jsonRpcUrl: `${rpcUrl}/${INFURA_ID}`
      }
    })
  ]
}

type ProviderConfig = { chainId?: number; connector?: Connector }
const provider = ({ chainId }: ProviderConfig) =>
  new providers.InfuraProvider(chainId, INFURA_ID)

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider
      autoConnect
      connectorStorageKey="lenster.wallet"
      connectors={connectors}
      provider={provider}
    >
      <ApolloProvider client={client}>
        <ThemeProvider defaultTheme="light" attribute="class">
          <SEO />
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
