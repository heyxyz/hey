import { ZERO_ADDRESS } from '@lenster/data';
import { CHAIN_ID } from 'src/constants';
import { useWalletClient } from 'wagmi';

const useEthersWalletClient = (): {
  data: {
    getAddress: () => Promise<`0x${string}`>;
    signMessage: (message: string) => Promise<string>;
  };
  isLoading: boolean;
} => {
  const { data, isLoading } = useWalletClient({ chainId: CHAIN_ID });

  const ethersWalletClient = {
    getAddress: async (): Promise<`0x${string}`> => {
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
