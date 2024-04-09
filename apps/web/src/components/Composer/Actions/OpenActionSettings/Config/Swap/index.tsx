import type { FC } from 'react';
import type { Address } from 'viem';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { DEFAULT_COLLECT_TOKEN, KNOWN_ATTRIBUTES } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { useEffect } from 'react';
import { createTrackedSelector } from 'react-tracked';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { usePublicationAttributesStore } from 'src/store/non-persisted/publication/usePublicationAttributesStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { encodeAbiParameters, isAddress } from 'viem';
import { create } from 'zustand';

import SaveOrCancel from '../../SaveOrCancel';
import DefaultAmountConfig from './DefaultAmountConfig';
import PoolConfig from './PoolConfig';
import RewardConfig from './RewardConfig';
import TokenConfig from './TokenConfig';

interface State {
  canSwap: boolean;
  decimals: number;
  enabled: boolean;
  reset: () => void;
  rewardsPoolId: null | number;
  setCanSwap: (canSwap: boolean) => void;
  setDecimals: (decimals: number) => void;
  setEnabled: (enabled: boolean) => void;
  setRewardsPoolId: (rewardsPoolId: null | number) => void;
  setSharedRewardPercent: (sharedRewardPercent: number) => void;
  setSymbol: (symbol: string) => void;
  setToken: (token: Address | null) => void;
  sharedRewardPercent: number;
  symbol: string;
  token: Address | null;
}

const store = create<State>((set) => ({
  canSwap: false,
  decimals: 18,
  enabled: false,
  reset: () =>
    set({
      enabled: false,
      rewardsPoolId: null,
      sharedRewardPercent: 0,
      token: DEFAULT_COLLECT_TOKEN as Address
    }),
  rewardsPoolId: null,
  setCanSwap: (canSwap) => set({ canSwap }),
  setDecimals: (decimals) => set({ decimals }),
  setEnabled: (enabled) => set({ enabled }),
  setRewardsPoolId: (rewardsPoolId) => set({ rewardsPoolId }),
  setSharedRewardPercent: (sharedRewardPercent) => set({ sharedRewardPercent }),
  setSymbol: (symbol) => set({ symbol }),
  setToken: (token) => set({ token }),
  sharedRewardPercent: 0,
  symbol: 'BONSAI',
  token: DEFAULT_COLLECT_TOKEN as Address
}));

export const useSwapActionStore = createTrackedSelector(store);

const SwapConfig: FC = () => {
  const { currentProfile } = useProfileStore();
  const { openAction, setOpenAction, setShowModal } = useOpenActionStore();
  const {
    canSwap,
    enabled,
    reset,
    rewardsPoolId,
    setEnabled,
    sharedRewardPercent,
    token
  } = useSwapActionStore();
  const { removeAttribute } = usePublicationAttributesStore();

  const resetOpenAction = () => {
    removeAttribute(KNOWN_ATTRIBUTES.SWAP_OA_DEFAULT_AMOUNT);
    reset();
  };

  useEffect(() => {
    if (!openAction) {
      removeAttribute(KNOWN_ATTRIBUTES.SWAP_OA_DEFAULT_AMOUNT);
      resetOpenAction();
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
              resetOpenAction();
            }
          }}
        />
      </div>
      {enabled && (
        <>
          <div className="divider" />
          <div className="m-5">
            <TokenConfig />
            <PoolConfig />
            <RewardConfig />
            <DefaultAmountConfig />
          </div>
          <div className="divider" />
          <div className="m-5">
            <SaveOrCancel
              onSave={onSave}
              saveDisabled={
                token
                  ? token.length === 0 || !isAddress(token) || !canSwap
                  : true
              }
            />
          </div>
        </>
      )}
    </>
  );
};

export default SwapConfig;
