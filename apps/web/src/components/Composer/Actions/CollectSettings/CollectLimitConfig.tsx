import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { StarIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';
import { Input } from 'ui';

interface CollectLimitConfigProps {
  setCollectType: (data: any) => void;
}

const CollectLimitConfig: FC<CollectLimitConfigProps> = ({
  setCollectType
}) => {
  const collectModule = useCollectModuleStore((state) => state.collectModule);
  const setCollectLimit = useCollectModuleStore(
    (state) => state.setCollectLimit
  );

  return (
    <div className="pt-5">
      <ToggleWithHelper
        on={Boolean(collectModule.collectLimit)}
        setOn={() =>
          setCollectType({
            collectLimit: collectModule.collectLimit ? null : 1
          })
        }
        heading={t`Limited edition`}
        description={t`Make the collects exclusive`}
        icon={<StarIcon className="h-4 w-4" />}
      />
      {collectModule.collectLimit ? (
        <div className="pt-4 text-sm">
          <Input
            label={t`Collect limit`}
            type="number"
            placeholder="5"
            min="1"
            max="100000"
            value={parseFloat(collectModule.collectLimit)}
            onChange={(event) => {
              setCollectLimit(event.target.value ? event.target.value : '1');
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default CollectLimitConfig;
