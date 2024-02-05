import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useFeaturedGroupsStore } from 'src/store/persisted/useFeaturedGroupsStore';

const FeaturedGroupsProvider: FC = () => {
  const setFeaturedGroups = useFeaturedGroupsStore(
    (state) => state.setFeaturedGroups
  );

  const fetchFeaturedGroups = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/groups/all`, {
        params: { featured: true }
      });
      const { data } = response;
      setFeaturedGroups(data.result.groups || []);
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: fetchFeaturedGroups,
    queryKey: ['fetchFeaturedGroups']
  });

  return null;
};

export default FeaturedGroupsProvider;
