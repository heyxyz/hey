import type { OpenSeaNft } from '@hey/types/opensea-nft';

import { OPENSEA_KEY } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import urlcat from 'urlcat';

interface UseOpenseaNftProps {
  address: string;
  chain: number;
  enabled?: boolean;
  token: string;
}

const useOpenseaNft = ({
  address,
  chain,
  enabled,
  token
}: UseOpenseaNftProps): {
  data: OpenSeaNft;
  error: unknown;
  loading: boolean;
} => {
  const getOpenSeaChainName = () => {
    switch (chain) {
      case 1:
        return 'ethereum';
      case 5:
        return 'goerli';
      case 137:
        return 'matic';
      case 80001:
        return 'mumbai';
      default:
        return 'ethereum';
    }
  };

  const getOpenseaNftDetails = async () => {
    const response = await axios.get(
      urlcat(
        'https://api.opensea.io/v2/chains/:chain/contract/:address/nfts/:token',
        {
          address,
          chain: getOpenSeaChainName(),
          format: 'json',
          token
        }
      ),
      { headers: { 'X-API-KEY': OPENSEA_KEY } }
    );

    return response.data?.nft;
  };

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: getOpenseaNftDetails,
    queryKey: ['getOpenseaNftDetails', chain, address, token]
  });

  return { data, error, loading: isLoading };
};

export default useOpenseaNft;
