import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { GiftIcon } from '@heroicons/react/24/outline';
import { Input } from '@hey/ui';

import { useSwapActionStore } from '.';

const PoolConfig: FC = () => {
  const { rewardsPoolId, setRewardsPoolId } = useSwapActionStore();

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Tap into an incentive pool"
        heading="Use a rewards pool"
        icon={<GiftIcon className="size-5" />}
        on={rewardsPoolId !== null}
        setOn={() => setRewardsPoolId(rewardsPoolId === null ? 0 : null)}
      />
      {rewardsPoolId !== null ? (
        <div className="ml-8 mt-4 flex space-x-2 text-sm">
          <Input
            label="Pool ID"
            min="1"
            onChange={(event) => {
              setRewardsPoolId(
                parseInt(event.target.value ? event.target.value : '0')
              );
            }}
            placeholder="5"
            type="number"
            value={rewardsPoolId}
          />
        </div>
      ) : null}
    </div>
  );
};

export default PoolConfig;
