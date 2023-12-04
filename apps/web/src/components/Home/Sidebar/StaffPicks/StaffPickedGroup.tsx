import type { Group } from '@hey/types/hey';

import GroupProfile from '@components/Shared/GroupProfile';
import GroupProfileShimmer from '@components/Shared/Shimmer/GroupProfileShimmer';
import { HEY_API_URL } from '@hey/data/constants';
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
    } = await axios.get(`${HEY_API_URL}/group/getGroup`, {
      params: { slug: id }
    });

    return response.data?.result;
  };

  const { data: group, isLoading } = useQuery({
    queryFn: fetchGroup,
    queryKey: ['fetchGroup', id]
  });

  if (isLoading) {
    return <GroupProfileShimmer />;
  }

  if (!group) {
    return null;
  }

  return <GroupProfile group={group} />;
};

export default StaffPickedGroup;
