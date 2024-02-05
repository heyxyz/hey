import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

const KillSwitchProvider: FC = () => {
  const setKillSwitches = useFeatureFlagsStore(
    (state) => state.setKillSwitches
  );

  const fetchKillSwitches = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/misc/switches`);
      const { data } = response;
      setKillSwitches(data.result || []);
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: fetchKillSwitches,
    queryKey: ['fetchKillSwitches']
  });

  return null;
};

export default KillSwitchProvider;
