import { HEY_API_URL } from '@hey/data/constants';
import type { UnlonelyChannel } from '@hey/types/nft';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseUnlonelyChannelProps {
  slug: string;
  enabled?: boolean;
}

const useUnlonelyChannel = ({
  slug,
  enabled
}: UseUnlonelyChannelProps): {
  data: UnlonelyChannel;
  loading: boolean;
  error: unknown;
} => {
  const getUnlonelyChannelDetails = async () => {
    const response = await axios.get(
      `${HEY_API_URL}/nft/unlonely/getUnlonelyChannel`,
      { params: { slug } }
    );

    return response.data?.channel;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['getUnlonelyChannelDetails', slug],
    queryFn: getUnlonelyChannelDetails,
    enabled
  });

  return { data, loading: isLoading, error };
};

export default useUnlonelyChannel;
