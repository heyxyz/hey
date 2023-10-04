import { ZERO_ADDRESS } from '@hey/data/constants';
import { CHAIN_ID } from 'src/constants';
import type { Address } from 'viem';
import { useWalletClient } from 'wagmi';

const useEthersWalletClient = (): {
  data: {
    getAddress: () => Promise<Address>;
    signMessage: (message: string) => Promise<string>;
  };
  isLoading: boolean;
} => {
  const { data, isLoading } = useWalletClient({ chainId: CHAIN_ID });

  const ethersWalletClient = {
    getAddress: async (): Promise<Address> => {
      return (await data?.account.address) ?? ZERO_ADDRESS;
    },
    signMessage: async (message: string): Promise<string> => {
      const signature = await data?.signMessage({ message });
      return signature ?? '';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signMessage, ...rest } = data ?? {};

  const mergedWalletClient = {
    data: {
      ...ethersWalletClient,
      ...{ ...rest }
    }
  };

  return { data: mergedWalletClient.data, isLoading };
};

export default useEthersWalletClient;
