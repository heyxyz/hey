import type { FC } from 'react';

import getTbaStatus from '@hey/lib/api/getTbaStatus';
import { useQuery } from '@tanstack/react-query';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useTbaStatusStore } from 'src/store/persisted/useTbaStatusStore';

const TbaStatusProvider: FC = () => {
  const { currentProfile } = useProfileStore();
  const { setIsTba } = useTbaStatusStore();

  useQuery({
    queryFn: () =>
      getTbaStatus(currentProfile?.ownedBy.address, (deployed) =>
        setIsTba(deployed)
      ),
    queryKey: ['getTbaStatus', currentProfile?.ownedBy.address]
  });

  return null;
};

export default TbaStatusProvider;
