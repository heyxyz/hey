import type { FC } from 'react';
import type { Address } from 'viem';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { useEffect } from 'react';
import { createTrackedSelector } from 'react-tracked';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { encodeAbiParameters } from 'viem';
import { create } from 'zustand';

import SaveOrCancel from '../../SaveOrCancel';
import PoolConfig from './PoolConfig';
import RewardConfig from './RewardConfig';

interface State {
  enabled: boolean;
  reset: () => void;
  rewardsPoolId: null | number;
  setEnabled: (enabled: boolean) => void;
  setRewardsPoolId: (rewardsPoolId: null | number) => void;
  setSharedRewardPercent: (sharedRewardPercent: number) => void;
  setToken: (token: Address) => void;
  sharedRewardPercent: number;
  token: Address;
}

const store = create<State>((set) => ({
  enabled: false,
  reset: () =>
    set({
      enabled: false,
      sharedRewardPercent: 0,
      token: '0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa' as Address
    }),
  rewardsPoolId: null,
  setEnabled: (enabled) => set({ enabled }),
  setRewardsPoolId: (rewardsPoolId) => set({ rewardsPoolId }),
  setSharedRewardPercent: (sharedRewardPercent) => set({ sharedRewardPercent }),
  setToken: (token) => set({ token }),
  sharedRewardPercent: 0,
  token: '0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa' as Address
}));

export const useSwapActionStore = createTrackedSelector(store);

const SwapConfig: FC = () => {
  const { currentProfile } = useProfileStore();
  const { openAction, setOpenAction, setShowModal } = useOpenActionStore();
  const {
    enabled,
    reset,
    rewardsPoolId,
    setEnabled,
    sharedRewardPercent,
    token
  } = useSwapActionStore();

  useEffect(() => {
    if (!openAction) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSave = () => {
    setOpenAction({
      address: VerifiedOpenActionModules.Swap,
      data: encodeAbiParameters(
        [
          { name: 'isDirectPromotion', type: 'bool' },
          { name: 'sharedRewardPercent', type: 'uint16' },
          { name: 'recipient', type: 'address' },
          { name: 'rewardsPoolId', type: 'uint256' },
          { name: 'token', type: 'address' }
        ],
        [
          (rewardsPoolId || 0) <= 0,
          sharedRewardPercent * 100,
          currentProfile?.ownedBy.address as Address,
          BigInt(rewardsPoolId || 0),
          token as Address
        ]
      )
    });
    setShowModal(false);
  };

  return (
    <>
      <div className="p-5">
        <ToggleWithHelper
          description="Token Swap lets you embed a swap widget in a post."
          heading="Enable swap"
          on={enabled}
          setOn={() => {
            setEnabled(!enabled);
            if (enabled) {
              reset();
            }
          }}
        />
      </div>
      {enabled && (
        <>
          <div className="divider" />
          <div className="m-5">
            <RewardConfig />
            <PoolConfig />
          </div>
          <div className="divider" />
          <div className="m-5">
            <SaveOrCancel onSave={onSave} saveDisabled={token.length === 0} />
          </div>
        </>
      )}
    </>
  );
};

export default SwapConfig;
