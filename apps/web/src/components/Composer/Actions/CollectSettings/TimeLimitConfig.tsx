import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { ClockIcon } from '@heroicons/react/24/outline';
import type { CollectModuleType } from '@hey/types/hey';
import { Input } from '@hey/ui';
import { getNumberOfDaysFromDate, getTimeAddedNDay } from '@lib/formatTime';
import { type FC } from 'react';
import { useCollectModuleStore } from 'src/store/useCollectModuleStore';

interface TimeLimitConfigProps {
  setCollectType: (data: CollectModuleType) => void;
}

const TimeLimitConfig: FC<TimeLimitConfigProps> = ({ setCollectType }) => {
  const collectModule = useCollectModuleStore((state) => state.collectModule);

  return (
    <div className="pt-5">
      <ToggleWithHelper
        on={Boolean(collectModule.endsAt)}
        setOn={() =>
          setCollectType({
            endsAt: Boolean(collectModule.endsAt) ? null : getTimeAddedNDay(1)
          })
        }
        heading="Time limit"
        description="Limit collecting to specific period of time"
        icon={<ClockIcon className="h-4 w-4" />}
      />
      {collectModule.endsAt ? (
        <div className="pt-4 text-sm">
          <Input
            label="Number of days"
            type="number"
            placeholder="5"
            min="1"
            max="100"
            value={getNumberOfDaysFromDate(new Date(collectModule.endsAt))}
            onChange={(event) => {
              setCollectType({
                endsAt: getTimeAddedNDay(Number(event.target.value))
              });
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TimeLimitConfig;
