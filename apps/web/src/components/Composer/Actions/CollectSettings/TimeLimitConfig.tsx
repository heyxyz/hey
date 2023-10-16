import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { ClockIcon } from '@heroicons/react/24/outline';
import { getTimeAddedNDay } from '@lib/formatTime';
import type { FC } from 'react';
import type { CollectModuleType } from 'src/store/collect-module';
import { useCollectModuleStore } from 'src/store/collect-module';

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
        description="Limit collecting to the first 24h"
        icon={<ClockIcon className="h-4 w-4" />}
      />
    </div>
  );
};

export default TimeLimitConfig;
