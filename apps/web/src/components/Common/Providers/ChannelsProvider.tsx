import { CHANNELS_WORKER_URL } from '@lenster/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const ChannelsProvider: FC = () => {
  const setChannels = useAppStore((state) => state.setChannels);

  const fetchChannels = async () => {
    try {
      const response = await axios.get(`${CHANNELS_WORKER_URL}/all`);
      const { data } = response;
      setChannels(data.result || []);
    } catch {}
  };

  useQuery(['channels'], () => fetchChannels());

  return null;
};

export default ChannelsProvider;
