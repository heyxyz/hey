import { type FC } from 'react';
import { useLeafwatchPersistStore } from 'src/store/useLeafwatchPersistStore';
import { useEffectOnce } from 'usehooks-ts';
import { v4 as uuid } from 'uuid';

const LeafwatchProvider: FC = () => {
  const viewerId = useLeafwatchPersistStore((state) => state.viewerId);
  const setViewerId = useLeafwatchPersistStore((state) => state.setViewerId);

  useEffectOnce(() => {
    if (!viewerId) {
      setViewerId(uuid());
    }
  });

  return null;
};

export default LeafwatchProvider;
