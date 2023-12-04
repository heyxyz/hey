import type { ZoraNft } from '@hey/types/nft';

import { HEY_API_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseZoraNftProps {
  address: string;
  chain: string;
  enabled?: boolean;
  token: string;
}

const useZoraNft = ({
  address,
  chain,
  enabled,
  token
}: UseZoraNftProps): {
  data: ZoraNft;
  error: unknown;
  loading: boolean;
} => {
  const getZoraNftDetails = async () => {
    const response = await axios.get(`${HEY_API_URL}/nft/getZoraNft`, {
      params: { address, chain, token }
    });

    return response.data?.nft;
  };

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: getZoraNftDetails,
    queryKey: ['getZoraNftDetails', chain, address, token]
  });

  return { data, error, loading: isLoading };
};

export default useZoraNft;
