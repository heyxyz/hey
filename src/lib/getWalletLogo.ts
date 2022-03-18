export const getWalletLogo = (name: string) => {
  switch (name) {
    case 'MetaMask':
      return '/wallet/metamask.svg'
    case 'WalletConnect':
      return '/wallet/walletconnect.svg'
    case 'Coinbase Wallet':
      return '/wallet/coinbase.svg'
    default:
      return '/wallet/metamask.svg'
  }
}
