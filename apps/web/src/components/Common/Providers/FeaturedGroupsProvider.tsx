import { GROUPS_WORKER_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const FeaturedGroupsProvider: FC = () => {
  const setFeaturedGroups = useAppStore((state) => state.setFeaturedGroups);

  const fetchFeaturedGroups = async () => {
    try {
      const response = await axios.get(`${GROUPS_WORKER_URL}/featured`);
      const { data } = response;
      setFeaturedGroups(data.result || []);
    } catch {}
  };

  useQuery(['fetchFeaturedGroups'], () => fetchFeaturedGroups());

  return null;
};

export default FeaturedGroupsProvider;
