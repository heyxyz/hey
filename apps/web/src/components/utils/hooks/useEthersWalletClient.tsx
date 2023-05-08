import axios from 'axios';
import { IS_MAINNET, SNAPSHOR_RELAY_WORKER_URL, ZERO_ADDRESS } from 'data';
import { useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';
import { useWalletClient } from 'wagmi';

const useEthersWalletClient = (): any => {
  const walletClient = useWalletClient();

  const ethersWalletClient = {
    getAddress: async (): Promise<`0x${string}`> => {
      return (await walletClient.data?.account.address) ?? ZERO_ADDRESS;
    },
    signMessage: async (message: string): Promise<string> => {
      const signature = await walletClient.data?.signMessage({
        message: message
      });
      return signature ?? '';
    }
  };

  // remove signMessage from walletClient
  const mergedWalletClient = {
    ...ethersWalletClient,
    walletClient: {
      data: {
        ...walletClient.data,
        signMessage: undefined
      }
    }
  };

  return mergedWalletClient;
};

export default useEthersWalletClient;
