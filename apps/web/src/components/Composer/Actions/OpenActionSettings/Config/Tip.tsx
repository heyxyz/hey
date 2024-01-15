import type { Address } from 'viem';

import SearchProfiles from '@components/Shared/SearchProfiles';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { ADDRESS_PLACEHOLDER } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { Card } from '@hey/ui';
import { type FC, useEffect } from 'react';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';
import { encodeAbiParameters, isAddress } from 'viem';
import { create } from 'zustand';

import SaveOrCancel from '../SaveOrCancel';

interface OpenActionState {
  recipient: string;
  reset: () => void;
  setRecipient: (recipient: string) => void;
}

const useTipActionStore = create<OpenActionState>((set) => ({
  recipient: '',
  reset: () => set({ recipient: '' }),
  setRecipient: (recipient) => set({ recipient })
}));

const TipConfig: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { recipient, reset, setRecipient } = useTipActionStore();
  const openAction = useOpenActionStore((state) => state.openAction);
  const setShowModal = useOpenActionStore((state) => state.setShowModal);
  const setOpenAction = useOpenActionStore((state) => state.setOpenAction);

  const isSelfTip = recipient === currentProfile?.ownedBy.address;

  useEffectOnce(() => {
    if (!openAction) {
      reset();
    }
  });

  useEffect(() => {
    if (!recipient || isSelfTip) {
      setRecipient(currentProfile?.ownedBy.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  const onSave = () => {
    setOpenAction({
      address: VerifiedOpenActionModules.Tip,
      data: encodeAbiParameters(
        [{ name: 'tipReceiver', type: 'address' }],
        [recipient as Address]
      )
    });
    setShowModal(false);
  };

  return (
    <div>
      <Card forceRounded>
        <div className="flex items-center space-x-2 px-5 py-3 font-bold">
          <CurrencyDollarIcon className="text-brand-500 size-5" />
          <div>Tip Config</div>
        </div>
        <div className="divider" />
        <div className="p-5">
          <ToggleWithHelper
            description="Allow people to tip you"
            heading="Self Tip"
            on={isSelfTip}
            setOn={() =>
              setRecipient(recipient ? '' : currentProfile?.ownedBy.address)
            }
          />
          {!isSelfTip && (
            <div className="mt-3">
              <SearchProfiles
                error={recipient.length > 0 && !isAddress(recipient)}
                hideDropdown={isAddress(recipient)}
                onChange={(event) => setRecipient(event.target.value)}
                onProfileSelected={(profile) =>
                  setRecipient(profile.ownedBy.address)
                }
                placeholder={`(Tip Recipient) ${ADDRESS_PLACEHOLDER} or wagmi`}
                value={recipient}
              />
            </div>
          )}
        </div>
      </Card>
      <SaveOrCancel
        onSave={onSave}
        saveDisabled={recipient.length === 0 || !isAddress(recipient)}
      />
    </div>
  );
};

export default TipConfig;
