import GroupProfile from '@components/Shared/GroupProfile';
import GroupProfileShimmer from '@components/Shared/Shimmer/GroupProfileShimmer';
import { GROUPS_WORKER_URL } from '@hey/data/constants';
import type { Group } from '@hey/types/hey';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';

interface StaffPickedGroupProps {
  id: string;
}

const StaffPickedGroup: FC<StaffPickedGroupProps> = ({ id }) => {
  const fetchGroup = async (): Promise<Group> => {
    const response: {
      data: { result: Group };
    } = await axios.get(`${GROUPS_WORKER_URL}/get/${id}`);

    return response.data?.result;
  };

  const { data: group, isLoading } = useQuery(['fetchGroup', id], () =>
    fetchGroup().then((res) => res)
  );

  if (isLoading) {
    return <GroupProfileShimmer />;
  }

  if (!group) {
    return null;
  }

  return <GroupProfile group={group} />;
};

export default StaffPickedGroup;
