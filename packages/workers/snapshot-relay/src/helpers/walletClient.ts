import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon } from 'viem/chains';

const walletClient = (privateKey: string): any => {
  const account = privateKeyToAccount(`0x${privateKey}`);

  return createWalletClient({
    account,
    chain: polygon,
    transport: http()
  });
};

export default walletClient;
