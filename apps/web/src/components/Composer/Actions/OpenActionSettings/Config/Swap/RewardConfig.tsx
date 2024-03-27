import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Input } from '@hey/ui';

import { useSwapActionStore } from '.';

const RewardConfig: FC = () => {
  const { setSharedRewardPercent, sharedRewardPercent } = useSwapActionStore();

  return (
    <div>
      <ToggleWithHelper
        description="Enable swap reward for your post"
        heading="Swap Reward"
        icon={<ArrowsRightLeftIcon className="size-5" />}
        on={sharedRewardPercent > 0}
        setOn={() => setSharedRewardPercent(sharedRewardPercent ? 0 : 25)}
      />
      {sharedRewardPercent > 0 ? (
        <div className="ml-8 mt-4 flex space-x-2 text-sm">
          <Input
            iconRight="%"
            label="Reward percent"
            max="100"
            min="1"
            onChange={(event) => {
              setSharedRewardPercent(
                parseInt(event.target.value ? event.target.value : '0')
              );
            }}
            placeholder="5"
            type="number"
            value={sharedRewardPercent}
          />
        </div>
      ) : null}
    </div>
  );
};

export default RewardConfig;
