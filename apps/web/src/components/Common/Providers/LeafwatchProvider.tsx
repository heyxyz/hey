import { type FC, useEffect } from 'react';
import { useLeafwatchStore } from 'src/store/persisted/useLeafwatchStore';
import { v4 as uuid } from 'uuid';

const LeafwatchProvider: FC = () => {
  const anonymousId = useLeafwatchStore((state) => state.anonymousId);
  const setAnonymousId = useLeafwatchStore((state) => state.setAnonymousId);

  useEffect(() => {
    if (!anonymousId) {
      setAnonymousId(uuid());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default LeafwatchProvider;
