import type { FC } from 'react';

import { useEffect } from 'react';
import { useLeafwatchStore } from 'src/store/persisted/useLeafwatchStore';
import { v4 as uuid } from 'uuid';

const LeafwatchProvider: FC = () => {
  const { anonymousId, setAnonymousId } = useLeafwatchStore();

  useEffect(() => {
    if (!anonymousId) {
      setAnonymousId(uuid());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default LeafwatchProvider;
