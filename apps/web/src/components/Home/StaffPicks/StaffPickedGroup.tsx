import GroupProfile from '@components/Shared/GroupProfile';
import GroupProfileShimmer from '@components/Shared/Shimmer/GroupProfileShimmer';
import { CHANNELS_WORKER_URL } from '@hey/data/constants';
import type { Channel } from '@hey/types/hey';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';

interface StaffPickedGroupProps {
  id: string;
}

const StaffPickedGroup: FC<StaffPickedGroupProps> = ({ id }) => {
  const fetchCommunity = async (): Promise<Channel> => {
    const response: {
      data: { result: Channel };
    } = await axios.get(`${CHANNELS_WORKER_URL}/get/${id}`);

    return response.data?.result;
  };

  const { data: channel, isLoading } = useQuery(['group', id], () =>
    fetchCommunity().then((res) => res)
  );

  if (isLoading) {
    return <GroupProfileShimmer />;
  }

  if (!channel) {
    return null;
  }

  return <GroupProfile group={channel} />;
};

export default StaffPickedGroup;
