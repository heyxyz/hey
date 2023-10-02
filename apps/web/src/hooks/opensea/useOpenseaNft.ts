import { OPENSEA_KEY } from '@hey/data/constants';
import type { OpenSeaNft } from '@hey/types/opensea-nft';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseOpenseaNftProps {
  chain: number;
  address: string;
  token: string;
  enabled?: boolean;
}

const useOpenseaNft = ({
  chain,
  address,
  token,
  enabled
}: UseOpenseaNftProps): {
  data: OpenSeaNft;
  loading: boolean;
  error: unknown;
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

  const loadNftDetails = async () => {
    const response = await axios.get(
      `https://api.opensea.io/v2/chain/${getOpenSeaChainName()}/contract/${address}/nfts/${token}`,
      { headers: { 'X-API-KEY': OPENSEA_KEY } }
    );

    return response.data?.nft;
  };

  const { data, isLoading, error } = useQuery(
    ['nftMetadata', chain, address, token],
    () => loadNftDetails().then((res) => res),
    { enabled }
  );

  return { data, loading: isLoading, error };
};

export default useOpenseaNft;
