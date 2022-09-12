import { STATIC_ASSETS } from 'src/constants';

/**
 *
 * @param name - Wallet name
 * @returns wallet logo url
 */
const getWalletLogo = (name: string): string => {
  switch (name) {
    case 'WalletConnect':
      return `${STATIC_ASSETS}/wallets/walletconnect.svg`;
    default:
      return `${STATIC_ASSETS}/wallets/browser-wallet.svg`;
  }
};

export default getWalletLogo;
