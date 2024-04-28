import { STATIC_IMAGES_URL } from '@hey/data/constants';

interface WalletDetails {
  logo: string;
  name: string;
}

/**
 * Returns an object with the name and logo URL for the specified wallet name.
 *
 * @param name The wallet name.
 * @returns An object with the name and logo URL.
 */
const getWalletDetails = (name: string): WalletDetails => {
  const walletDetails: Record<string, WalletDetails> = {
    'Coinbase Wallet': {
      logo: `${STATIC_IMAGES_URL}/wallets/coinbase.svg`,
      name: 'Coinbase Wallet'
    },
    WalletConnect: {
      logo: `${STATIC_IMAGES_URL}/wallets/walletconnect.svg`,
      name: 'WalletConnect'
    }
  };
  const defaultDetails: WalletDetails = {
    logo: `${STATIC_IMAGES_URL}/wallets/browser-wallet.svg`,
    name
  };

  return walletDetails[name] || defaultDetails;
};

export default getWalletDetails;
