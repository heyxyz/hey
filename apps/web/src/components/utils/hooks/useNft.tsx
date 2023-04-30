import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ALCHEMY_KEY } from 'data/constants';

interface UseNftProps {
  address: string;
  chainId: number;
  enabled?: boolean;
}

const useNft = ({
  address,
  chainId,
  enabled
}: UseNftProps): {
  data: { contractMetadata: { name: string; symbol: string } };
  error: unknown;
} => {
  const getAlchemyChainName = () => {
    switch (chainId) {
      case 1:
        return 'eth-mainnet';
      case 5:
        return 'eth-goerli';
      case 137:
        return 'polygon-mainnet';
      case 80001:
        return 'polygon-mumbai';
      default:
        return 'eth-mainnet';
    }
  };

  const loadContractDetails = async () => {
    const response = await axios({
      method: 'GET',
      url: `https://${getAlchemyChainName()}.g.alchemy.com/nft/v2/${ALCHEMY_KEY}/getContractMetadata`,
      params: { contractAddress: address }
    });
    return response.data;
  };

  const { data, error } = useQuery(
    ['nftData'],
    () => loadContractDetails().then((res) => res),
    {
      enabled
    }
  );

  return { data, error };
};

export default useNft;
