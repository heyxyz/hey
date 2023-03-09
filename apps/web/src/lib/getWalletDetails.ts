import { STATIC_IMAGES_URL } from 'data/constants';

/**
 *
 * @param name - Wallet name
 * @returns wallet logo url
 */
const getWalletDetails = (
  name: string
): {
  name: string;
  logo: string;
} => {
  if (name === 'WalletConnectLegacy') {
    return {
      name: 'Wallet Connect',
      logo: `${STATIC_IMAGES_URL}/wallets/walletconnect.svg`
    };
  }

  return { name, logo: `${STATIC_IMAGES_URL}/wallets/browser-wallet.svg` };
};

export default getWalletDetails;
