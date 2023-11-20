import { HEY_API_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import { useAppStore } from 'src/store/non-persisted/useAppStore';

const FeaturedGroupsProvider: FC = () => {
  const setFeaturedGroups = useAppStore((state) => state.setFeaturedGroups);

  const fetchFeaturedGroups = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/group/featuredGroups`);
      const { data } = response;
      setFeaturedGroups(data.result || []);
    } catch {}
  };

  useQuery({
    queryKey: ['fetchFeaturedGroups'],
    queryFn: fetchFeaturedGroups
  });

  return null;
};

export default FeaturedGroupsProvider;
