import { expect, test } from '@playwright/test';
import { STATIC_IMAGES_URL } from 'data/constants';
import getWalletDetails from 'lib/getWalletDetails';

test.describe('getWalletDetails', () => {
  test('should return correct details for WalletConnect', () => {
    const walletDetails = getWalletDetails('WalletConnect');
    expect(walletDetails.name).toBe('Wallet Connect');
    expect(walletDetails.logo).toBe(`${STATIC_IMAGES_URL}/wallets/walletconnect.svg`);
  });

  test('should return correct details for name other than WalletConnect', () => {
    const walletDetails = getWalletDetails('MetaMask');
    expect(walletDetails.name).toBe('MetaMask');
    expect(walletDetails.logo).toBe(`/logo_metamask.svg`);
  });

  test('should handle empty string as input', () => {
    const walletDetails = getWalletDetails('');
    expect(walletDetails.name).toBe('');
    expect(walletDetails.logo).toBe(`/logo_metamask.svg`);
  });
});
