import { HEY_API_URL } from '@hey/data/constants';
import type { ZoraNft } from '@hey/types/nft';
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
  const getZoraNftDetails = async () => {
    const response = await axios.get(`${HEY_API_URL}/nft/getZoraNft`, {
      params: { chain, address, token }
    });

    return response.data?.nft;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['getZoraNftDetails', chain, address, token],
    queryFn: getZoraNftDetails,
    enabled
  });

  return { data, loading: isLoading, error };
};

export default useZoraNft;
