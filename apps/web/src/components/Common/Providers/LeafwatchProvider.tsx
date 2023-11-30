import { useLeafwatchStore } from '@persisted/useLeafwatchStore';
import { type FC } from 'react';
import { useEffectOnce } from 'usehooks-ts';
import { v4 as uuid } from 'uuid';

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
