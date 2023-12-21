import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { StarIcon } from '@heroicons/react/24/outline';
import { Input } from '@hey/ui';
import { useCollectModuleStore } from 'src/store/non-persisted/useCollectModuleStore';

interface CollectLimitConfigProps {
  setCollectType: (data: any) => void;
}

const CollectLimitConfig: FC<CollectLimitConfigProps> = ({
  setCollectType
}) => {
  const collectModule = useCollectModuleStore((state) => state.collectModule);

  return (
    <div className="pt-5">
      <ToggleWithHelper
        description="Make the collects exclusive"
        heading="Limited edition"
        icon={<StarIcon className="size-4" />}
        on={Boolean(collectModule.collectLimit)}
        setOn={() =>
          setCollectType({
            collectLimit: collectModule.collectLimit ? null : '1'
          })
        }
      />
      {collectModule.collectLimit ? (
        <div className="pt-4 text-sm">
          <Input
            label="Collect limit"
            max="100000"
            min="1"
            onChange={(event) => {
              setCollectType({
                collectLimit: event.target.value ? event.target.value : '1'
              });
            }}
            placeholder="5"
            type="number"
            value={collectModule.collectLimit}
          />
        </div>
      ) : null}
    </div>
  );
};

export default CollectLimitConfig;
