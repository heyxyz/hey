import { STATIC_IMAGES_URL } from 'src/constants';

/**
 *
 * @param name - Wallet name
 * @returns wallet logo url
 */
const getWalletLogo = (name: string): string => {
  if (name === 'WalletConnect') {
    return `${STATIC_IMAGES_URL}/wallets/walletconnect.svg`;
  }

  return `${STATIC_IMAGES_URL}/wallets/browser-wallet.svg`;
};

export default getWalletLogo;
