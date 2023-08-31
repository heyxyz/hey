import { OPENSEA_KEY } from '@lenster/data/constants';
import type { OpenSeaNft } from '@lenster/types/opensea-nft';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseNftMetadataProps {
  chain: number;
  address: string;
  token: string;
  enabled?: boolean;
}

const useNftMetadata = ({
  chain,
  address,
  token,
  enabled
}: UseNftMetadataProps): {
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

export default useNftMetadata;
