import { STATIC_ASSETS } from 'src/constants'

export const getWalletLogo = (name: string) => {
  switch (name) {
    case 'MetaMask':
      return `${STATIC_ASSETS}/wallets/metamask.svg`
    case 'WalletConnect':
      return `${STATIC_ASSETS}/wallets/walletconnect.svg`
    case 'Coinbase Wallet':
      return `${STATIC_ASSETS}/wallets/coinbase.svg`
    default:
      return `${STATIC_ASSETS}/wallets/metamask.svg`
  }
}
