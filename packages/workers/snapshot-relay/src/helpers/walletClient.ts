import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon, polygonMumbai } from 'viem/chains';

/**
 * Create a wallet client for Polygon and Polygon Mumbai
 * @param privateKey Private key
 * @param isMainnet Is mainnet
 * @returns Wallet viem client
 */
const walletClient = (privateKey: string, isMainnet: boolean): any => {
  const account = privateKeyToAccount(`0x${privateKey}`);

  return createWalletClient({
    account,
    chain: isMainnet ? polygon : polygonMumbai,
    transport: http()
  });
};

export default walletClient;
