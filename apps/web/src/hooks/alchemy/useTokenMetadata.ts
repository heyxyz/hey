import type { TokenMetadataResponse } from 'alchemy-sdk';
import type { Address } from 'viem';

import { ALCHEMY_API_KEY } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import { Alchemy } from 'alchemy-sdk';

import getAlchemyNetwork from './getAlchemyNetwork';

interface UseTokenMetadataProps {
  address: Address;
  chain: number;
  enabled?: boolean;
}

const useTokenMetadata = ({
  address,
  chain,
  enabled
}: UseTokenMetadataProps): {
  data: TokenMetadataResponse | undefined;
  error: unknown;
  loading: boolean;
} => {
  const settings = {
    apiKey: ALCHEMY_API_KEY,
    network: getAlchemyNetwork(chain)
  };
  const alchemy = new Alchemy(settings);

  const getTokenMetadata = async (): Promise<TokenMetadataResponse> => {
    return await alchemy.core.getTokenMetadata(address);
  };

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: getTokenMetadata,
    queryKey: ['getTokenMetadata', chain, address]
  });

  return { data, error, loading: isLoading };
};

export default useTokenMetadata;
