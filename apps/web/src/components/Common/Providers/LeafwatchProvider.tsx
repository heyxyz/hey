import { type FC } from 'react';
import { useLeafwatchPersistStore } from 'src/store/useLeafwatchPersistStore';
import { useEffectOnce } from 'usehooks-ts';
import { v4 as uuid } from 'uuid';

const LeafwatchProvider: FC = () => {
  const anonymousId = useLeafwatchPersistStore((state) => state.anonymousId);
  const setAnonymousId = useLeafwatchPersistStore(
    (state) => state.setAnonymousId
  );

  useEffectOnce(() => {
    if (!anonymousId) {
      setAnonymousId(uuid());
    }
  });

  return null;
};

export default LeafwatchProvider;
