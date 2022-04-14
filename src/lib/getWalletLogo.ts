import { STATIC_ASSETS } from 'src/constants'

const getWalletLogo = (name: string) => {
  switch (name) {
    case 'WalletConnect':
      return `${STATIC_ASSETS}/wallets/walletconnect.svg`
    case 'Coinbase Wallet':
      return `${STATIC_ASSETS}/wallets/coinbase.svg`
    default:
      return `${STATIC_ASSETS}/wallets/browser-wallet.svg`
  }
}

export default getWalletLogo
