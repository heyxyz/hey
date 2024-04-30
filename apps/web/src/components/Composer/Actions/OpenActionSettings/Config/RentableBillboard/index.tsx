import type { FC } from 'react';
import type { Address } from 'viem';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { createTrackedSelector } from 'react-tracked';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { isAddress } from 'viem';
import { create } from 'zustand';

import SaveOrCancel from '../../SaveOrCancel';
import TimeConfig from './TimeConfig';
import TokenConfig from './TokenConfig';

interface State {
  enabled: boolean;
  expiresAt: Date;
  reset: () => void;
  setEnabled: (enabled: boolean) => void;
  setExpiresAt: (expiresAt: Date) => void;
  setToken: (token: Address | null) => void;
  token: Address | null;
}

const store = create<State>((set) => ({
  enabled: false,
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  reset: () =>
    set({
      enabled: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      token: DEFAULT_COLLECT_TOKEN as Address
    }),
  rewardsPoolId: null,
  setEnabled: (enabled) => set({ enabled }),
  setExpiresAt: (expiresAt) => set({ expiresAt }),
  setToken: (token) => set({ token }),
  token: DEFAULT_COLLECT_TOKEN as Address
}));

export const useRentableBillboardActionStore = createTrackedSelector(store);

const RentableBillboardConfig: FC = () => {
  const { setShowModal } = useOpenActionStore();
  const { enabled, expiresAt, reset, setEnabled, token } =
    useRentableBillboardActionStore();

  const onSave = () => {
    // setOpenAction({
    //   address: VerifiedOpenActionModules.RentableBillboard,
    //   data: encodeAbiParameters([])
    // });
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
            <TimeConfig />
          </div>
          <div className="divider" />
          <div className="m-5">
            <SaveOrCancel
              onSave={onSave}
              saveDisabled={
                (token ? token.length === 0 || !isAddress(token) : true) ||
                expiresAt.getTime() < Date.now()
              }
            />
          </div>
        </>
      )}
    </>
  );
};

export default RentableBillboardConfig;
