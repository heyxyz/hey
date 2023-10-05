import { NFT_WORKER_URL } from '@hey/data/constants';
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
  const loadUnlonelyChannelDetails = async () => {
    const response = await axios.get(`${NFT_WORKER_URL}/unlonely/channel`, {
      params: { slug }
    });

    return response.data?.channel;
  };

  const { data, isLoading, error } = useQuery(
    ['loadUnlonelyChannelDetails', slug],
    () => loadUnlonelyChannelDetails().then((res) => res),
    { enabled }
  );

  return { data, loading: isLoading, error };
};

export default useUnlonelyChannel;
