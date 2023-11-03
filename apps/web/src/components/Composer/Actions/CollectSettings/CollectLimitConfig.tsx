import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { StarIcon } from '@heroicons/react/24/outline';
import { Input } from '@hey/ui';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/useCollectModuleStore';

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
        on={Boolean(collectModule.collectLimit)}
        setOn={() =>
          setCollectType({
            collectLimit: collectModule.collectLimit ? null : '1'
          })
        }
        heading="Limited edition"
        description="Make the collects exclusive"
        icon={<StarIcon className="h-4 w-4" />}
      />
      {collectModule.collectLimit ? (
        <div className="pt-4 text-sm">
          <Input
            label="Collect limit"
            type="number"
            placeholder="5"
            min="1"
            max="100000"
            value={collectModule.collectLimit}
            onChange={(event) => {
              setCollectType({
                collectLimit: event.target.value ? event.target.value : '1'
              });
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default CollectLimitConfig;
