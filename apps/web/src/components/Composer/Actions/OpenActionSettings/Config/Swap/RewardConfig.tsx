import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { Input } from '@hey/ui';

import { useSwapActionStore } from '.';

const RewardConfig: FC = () => {
  const { setSharedRewardPercent, sharedRewardPercent } = useSwapActionStore();

  return (
    <div className="ml-8 mt-4">
      <ToggleWithHelper
        description="Split this reward with the swappers"
        heading="Split reward"
        on={sharedRewardPercent > 0}
        setOn={() => setSharedRewardPercent(sharedRewardPercent ? 0 : 5)}
      />
      {sharedRewardPercent > 0 ? (
        <div className="mt-4 flex space-x-2 text-sm">
          <Input
            iconRight="%"
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
