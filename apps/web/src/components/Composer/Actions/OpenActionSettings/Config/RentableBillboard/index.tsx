import type { FC } from 'react';
import type { Address } from 'viem';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { createTrackedSelector } from 'react-tracked';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { encodeAbiParameters, isAddress, toBytes, toHex } from 'viem';
import { create } from 'zustand';

import SaveOrCancel from '../../SaveOrCancel';
import CostConfig from './CostConfig';
import TimeConfig from './TimeConfig';
import TokenConfig from './TokenConfig';

interface State {
  costPerSecond: number;
  currency: {
    decimals: number;
    token: Address;
  };
  enabled: boolean;
  expiresAt: Date;
  reset: () => void;
  setCostPerSecond: (costPerSecond: number) => void;
  setCurrency: (currency: Address, decimals: number) => void;
  setEnabled: (enabled: boolean) => void;
  setExpiresAt: (expiresAt: Date) => void;
}

const store = create<State>((set) => ({
  costPerSecond: 0.5,
  currency: {
    decimals: 18,
    token: DEFAULT_COLLECT_TOKEN as Address
  },
  enabled: false,
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  reset: () =>
    set({
      costPerSecond: 0.5,
      currency: {
        decimals: 18,
        token: DEFAULT_COLLECT_TOKEN as Address
      },
      enabled: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }),
  rewardsPoolId: null,
  setCostPerSecond: (costPerSecond) => set({ costPerSecond }),
  setCurrency: (currency, decimals) =>
    set({ currency: { decimals, token: currency } }),
  setEnabled: (enabled) => set({ enabled }),
  setExpiresAt: (expiresAt) => set({ expiresAt })
}));

export const useRentableBillboardActionStore = createTrackedSelector(store);

const RentableBillboardConfig: FC = () => {
  const { setOpenAction, setShowModal } = useOpenActionStore();
  const { costPerSecond, currency, enabled, expiresAt, reset, setEnabled } =
    useRentableBillboardActionStore();

  const onSave = () => {
    setOpenAction({
      address: VerifiedOpenActionModules.RentableBillboard,
      data: encodeAbiParameters(
        [
          { name: 'currency', type: 'address' },
          { name: 'allowOpenAction', type: 'bool' },
          { name: 'expireAt', type: 'uint16' },
          { name: 'costPerSecond', type: 'uint256' },
          { name: 'clientFeePerActBps', type: 'uint16' },
          { name: 'referralFeePerActBps', type: 'uint16' },
          { name: 'interestMerkleRoot', type: 'bytes32' }
        ],
        [
          currency.token as Address,
          false,
          0,
          10n,
          0,
          0,
          toHex(toBytes('', { size: 32 }))
        ]
      )
    });
    setShowModal(false);
  };

  return (
    <>
      <div className="p-5">
        <ToggleWithHelper
          description="Rentable billboard lets users to promote on your post."
          heading="Enable rentable billboard"
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
            <TokenConfig />
            <CostConfig />
            <TimeConfig />
          </div>
          <div className="divider" />
          <div className="m-5">
            <SaveOrCancel
              onSave={onSave}
              saveDisabled={
                !isAddress(currency.token) ||
                expiresAt.getTime() < Date.now() ||
                costPerSecond <= 0
              }
            />
          </div>
        </>
      )}
    </>
  );
};

export default RentableBillboardConfig;
