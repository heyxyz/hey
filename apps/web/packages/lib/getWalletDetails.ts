import { STATIC_IMAGES_URL } from 'data/constants';

interface WalletDetails {
  name: string;
  logo: string;
}

/**
 * Returns an object with the name and logo URL for the specified wallet name.
 *
 * @param name The wallet name.
 * @returns An object with the name and logo URL.
 */
const getWalletDetails = (name: string): WalletDetails => {
  const walletDetails: Record<string, WalletDetails> = {
    WalletConnect: {
      name: 'Wallet Connect',
      logo: `${STATIC_IMAGES_URL}/wallets/walletconnect.svg`
    },
    WalletConnectLegacy: {
      name: 'Wallet Connect',
      logo: `${STATIC_IMAGES_URL}/wallets/walletconnect.svg`
    }
  };
  const defaultDetails: WalletDetails = {
    name,
    logo: `/logo_metamask.svg`
  };
  return walletDetails[name] || defaultDetails;
};

export default getWalletDetails;
