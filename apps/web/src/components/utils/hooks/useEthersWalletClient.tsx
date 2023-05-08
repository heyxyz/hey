import { ZERO_ADDRESS } from 'data';
import { useWalletClient } from 'wagmi';

const useEthersWalletClient = (): any => {
  const { data, isLoading } = useWalletClient();

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
