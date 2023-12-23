import type { CollectModuleType } from '@hey/types/hey';
import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { ClockIcon } from '@heroicons/react/24/outline';
import getNumberOfDaysFromDate from '@hey/lib/datetime/getNumberOfDaysFromDate';
import getTimeAddedNDay from '@hey/lib/datetime/getTimeAddedNDay';
import { Input } from '@hey/ui';
import { useCollectModuleStore } from 'src/store/non-persisted/useCollectModuleStore';

interface TimeLimitConfigProps {
  setCollectType: (data: CollectModuleType) => void;
}

const TimeLimitConfig: FC<TimeLimitConfigProps> = ({ setCollectType }) => {
  const collectModule = useCollectModuleStore((state) => state.collectModule);

  return (
    <div className="pt-5">
      <ToggleWithHelper
        description="Limit collecting to specific period of time"
        heading="Time limit"
        icon={<ClockIcon className="size-4" />}
        on={Boolean(collectModule.endsAt)}
        setOn={() =>
          setCollectType({
            endsAt: collectModule.endsAt ? null : getTimeAddedNDay(1)
          })
        }
      />
      {collectModule.endsAt ? (
        <div className="pt-4 text-sm">
          <Input
            label="Number of days"
            max="100"
            min="1"
            onChange={(event) => {
              setCollectType({
                endsAt: getTimeAddedNDay(Number(event.target.value))
              });
            }}
            placeholder="5"
            type="number"
            value={getNumberOfDaysFromDate(new Date(collectModule.endsAt))}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TimeLimitConfig;
