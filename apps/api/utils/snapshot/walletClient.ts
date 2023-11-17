import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon } from 'viem/chains';

/**
 * Create a wallet client for Polygon and Polygon Mumbai
 * @param privateKey Private key
 * @returns Wallet viem client
 */
const walletClient = (privateKey: string): any => {
  const account = privateKeyToAccount(`0x${privateKey}`);

  return createWalletClient({
    account,
    chain: polygon,
    transport: http()
  });
};

export default walletClient;
