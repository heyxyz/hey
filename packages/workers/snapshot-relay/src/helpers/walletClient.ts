import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon, polygonMumbai } from 'viem/chains';

const walletClient = (privateKey: string, isMainnet: boolean): any => {
  const account = privateKeyToAccount(`0x${privateKey}`);

  return createWalletClient({
    account,
    chain: isMainnet ? polygon : polygonMumbai,
    transport: http()
  });
};

export default walletClient;
