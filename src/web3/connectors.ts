/**
 * Define the properties for the metamask connnector
 */
import { InjectedConnector } from '@web3-react/injected-connector'

const SUPPORTED_CHAIN_IDS = [
  1, //for mainnet
  4, //for ropsten
  42 //for kovan
]

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS
})
