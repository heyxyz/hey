import { ALCHEMY_KEY } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseContractMetadataProps {
  address: string;
  chainId: number;
  enabled?: boolean;
}

const useContractMetadata = ({
  address,
  chainId,
  enabled
}: UseContractMetadataProps): {
  data: { name: string; symbol: string };
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
    const response = await axios.get(
      `https://${getAlchemyChainName()}.g.alchemy.com/nft/v2/${ALCHEMY_KEY}/getContractMetadata`,
      { params: { contractAddress: address } }
    );

    return response.data?.contractMetadata;
  };

  const { data, error } = useQuery(
    ['contractMetadata', address],
    () => loadContractDetails().then((res) => res),
    { enabled }
  );

  return { data, error };
};

export default useContractMetadata;
