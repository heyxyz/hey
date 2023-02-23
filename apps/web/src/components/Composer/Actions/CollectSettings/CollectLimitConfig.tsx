import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { Input } from '@components/UI/Input';
import { StarIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';
import { PUBLICATION } from 'src/tracking';

const CollectLimitConfig: FC = () => {
  const collectLimit = useCollectModuleStore((state) => state.collectLimit);
  const setCollectLimit = useCollectModuleStore((state) => state.setCollectLimit);

  return (
    <div className="pt-5">
      <ToggleWithHelper
        on={Boolean(collectLimit)}
        setOn={() => {
          setCollectLimit(collectLimit ? null : '1');
          Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_LIMITED_EDITION_COLLECT);
        }}
        heading={t`Limited edition`}
        description={t`Make the collects exclusive`}
        icon={<StarIcon className="h-4 w-4" />}
      />
      {collectLimit ? (
        <div className="pt-4 text-sm">
          <Input
            label={t`Collect limit`}
            type="number"
            placeholder="5"
            min="1"
            max="100000"
            value={parseFloat(collectLimit)}
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
