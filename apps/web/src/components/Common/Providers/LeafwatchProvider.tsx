import { type FC } from 'react';
import { useEffectOnce } from 'usehooks-ts';
import { v4 as uuid } from 'uuid';

import { useLeafwatchStore } from '@/store/persisted/useLeafwatchStore';

const LeafwatchProvider: FC = () => {
  const anonymousId = useLeafwatchStore((state) => state.anonymousId);
  const setAnonymousId = useLeafwatchStore((state) => state.setAnonymousId);

  useEffectOnce(() => {
    if (!anonymousId) {
      setAnonymousId(uuid());
    }
  });

  return null;
};

export default LeafwatchProvider;
