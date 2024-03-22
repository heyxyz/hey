import type { FC } from 'react';
import type { Address } from 'viem';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { Input } from '@hey/ui';
import { useEffect } from 'react';
import { createTrackedSelector } from 'react-tracked';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { encodeAbiParameters } from 'viem';
import { create } from 'zustand';

import SaveOrCancel from '../SaveOrCancel';

interface State {
  enabled: boolean;
  reset: () => void;
  setEnabled: (enabled: boolean) => void;
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
      token: DEFAULT_COLLECT_TOKEN as Address
    }),
  setEnabled: (enabled) => set({ enabled }),
  setSharedRewardPercent: (sharedRewardPercent) => set({ sharedRewardPercent }),
  setToken: (token) => set({ token }),
  sharedRewardPercent: 0,
  token: DEFAULT_COLLECT_TOKEN as Address
}));

export const useSwapActionStore = createTrackedSelector(store);

const SwapConfig: FC = () => {
  const { currentProfile } = useProfileStore();
  const { openAction, setOpenAction, setShowModal } = useOpenActionStore();
  const {
    enabled,
    reset,
    setEnabled,
    setSharedRewardPercent,
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
          true,
          sharedRewardPercent * 100,
          currentProfile?.ownedBy.address as Address,
          0n,
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
