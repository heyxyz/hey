import type { Address } from 'viem';

import SearchProfiles from '@components/Shared/SearchProfiles';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { ADDRESS_PLACEHOLDER } from '@hey/data/constants';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { Card } from '@hey/ui';
import { type FC, useState } from 'react';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { encodeAbiParameters, isAddress } from 'viem';

import SaveOrCancel from '../SaveOrCancel';

const TipConfig: FC = () => {
  const [recipient, setRecipient] = useState<string>('');
  const setShowModal = useOpenActionStore((state) => state.setShowModal);
  const setOpenAction = useOpenActionStore((state) => state.setOpenAction);

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
      </Card>
      <SaveOrCancel onSave={onSave} />
    </div>
  );
};

export default TipConfig;
