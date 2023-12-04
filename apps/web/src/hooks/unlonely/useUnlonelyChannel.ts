import type { UnlonelyChannel } from '@hey/types/nft';

import { HEY_API_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseUnlonelyChannelProps {
  enabled?: boolean;
  slug: string;
}

const useUnlonelyChannel = ({
  enabled,
  slug
}: UseUnlonelyChannelProps): {
  data: UnlonelyChannel;
  error: unknown;
  loading: boolean;
} => {
  const getUnlonelyChannelDetails = async () => {
    const response = await axios.get(
      `${HEY_API_URL}/nft/unlonely/getUnlonelyChannel`,
      { params: { slug } }
    );

    return response.data?.channel;
  };

  const { data, error, isLoading } = useQuery({
    enabled,
    queryFn: getUnlonelyChannelDetails,
    queryKey: ['getUnlonelyChannelDetails', slug]
  });

  return { data, error, loading: isLoading };
};

export default useUnlonelyChannel;
