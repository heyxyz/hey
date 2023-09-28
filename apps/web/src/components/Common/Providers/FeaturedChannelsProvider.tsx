import { CHANNELS_WORKER_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const FeaturedChannelsProvider: FC = () => {
  const setFeaturedChannels = useAppStore((state) => state.setFeaturedChannels);

  const fetchFeaturedChannels = async () => {
    try {
      const response = await axios.get(`${CHANNELS_WORKER_URL}/featured`);
      const { data } = response;
      setFeaturedChannels(data.result || []);
    } catch {}
  };

  useQuery(['featuredChannels'], () => fetchFeaturedChannels());

  return null;
};

export default FeaturedChannelsProvider;
