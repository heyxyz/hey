import type { FC } from 'react';
import type { Address } from 'viem';

import Loader from '@components/Shared/Loader';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { useModuleMetadataQuery } from '@hey/lens';
import { ErrorMessage } from '@hey/ui';
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

  const { data, error, loading } = useModuleMetadataQuery({
    skip: !enabled,
    variables: {
      request: { implementation: VerifiedOpenActionModules.RentableBillboard }
    }
  });

  const onSave = () => {
    setOpenAction({
      address: VerifiedOpenActionModules.RentableBillboard,
      data: encodeAbiParameters(
        JSON.parse(data?.moduleMetadata?.metadata.initializeCalldataABI),
        [
          currency.token as Address,
          false,
          '1000',
          '0',
          '500',
          '0',
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
          {loading ? (
            <Loader className="my-10" />
          ) : error ? (
            <ErrorMessage
              className="m-5"
              error={error}
              title="Failed to load module"
            />
          ) : (
            <>
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
      )}
    </>
  );
};

export default RentableBillboardConfig;
