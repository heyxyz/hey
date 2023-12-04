import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useTbaStatusStore } from 'src/store/persisted/useTbaStatusStore';

const TbaStatusProvider: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const setIsTba = useTbaStatusStore((state) => state.setIsTba);

  // Fetch TBA status
  const fetchTbaStatus = async () => {
    try {
      if (Boolean(currentProfile?.ownedBy.address)) {
        const response = await axios.get(`${HEY_API_URL}/tba/isTba`, {
          params: { address: currentProfile?.ownedBy.address }
        });
        const { data } = response;
        setIsTba(data.isTba);
      }
      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: fetchTbaStatus,
    queryKey: ['fetchTbaStatus', currentProfile?.ownedBy.address]
  });

  return null;
};

export default TbaStatusProvider;
