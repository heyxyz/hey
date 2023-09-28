import { ZORA_WORKER_URL } from '@hey/data/constants';
import type { ZoraNft } from '@hey/types/zora-nft';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseZoraNftProps {
  chain: string;
  address: string;
  token: string;
  enabled?: boolean;
}

const useZoraNft = ({
  chain,
  address,
  token,
  enabled
}: UseZoraNftProps): {
  data: ZoraNft;
  loading: boolean;
  error: unknown;
} => {
  const loadNftDetails = async () => {
    const response = await axios.get(`${ZORA_WORKER_URL}/nft`, {
      params: { chain, address, token }
    });

    return response.data?.nft;
  };

  const { data, isLoading, error } = useQuery(
    ['nftMetadata', chain, address, token],
    () => loadNftDetails().then((res) => res),
    { enabled }
  );

  return { data, loading: isLoading, error };
};

export default useZoraNft;
