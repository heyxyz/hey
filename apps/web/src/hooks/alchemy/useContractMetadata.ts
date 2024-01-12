import type { NftContract } from 'alchemy-sdk';

import { ALCHEMY_API_KEY } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import { Alchemy } from 'alchemy-sdk';

import getAlchemyNetwork from './getAlchemyNetwork';

interface UseContractMetadataProps {
  address: string;
  chain: string;
  enabled?: boolean;
}

const useContractMetadata = ({
  address,
  chain,
  enabled
}: UseContractMetadataProps): {
  data: NftContract | undefined;
  error: unknown;
  loading: boolean;
} => {
  const settings = {
    apiKey: ALCHEMY_API_KEY,
    network: getAlchemyNetwork(Number(chain))
  };
  const alchemy = new Alchemy(settings);

  const getContractMetadata = async (): Promise<NftContract> => {
    return await alchemy.nft.getContractMetadata(address);
  };

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: getContractMetadata,
    queryKey: ['getContractMetadata', chain, address]
  });

  return { data, error, loading: isLoading };
};

export default useContractMetadata;
