import type { CollectModuleType } from '@hey/types/hey';
import type { FC } from 'react';

import New from '@components/Shared/Badges/New';
import SearchProfiles from '@components/Shared/SearchProfiles';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { UserIcon } from '@heroicons/react/24/outline';
import { ADDRESS_PLACEHOLDER } from '@hey/data/constants';
import { useEffect, useState } from 'react';
import { useCollectModuleStore } from 'src/store/non-persisted/publication/useCollectModuleStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { isAddress } from 'viem';

interface RecipientConfigProps {
  setCollectType: (data: CollectModuleType) => void;
}

const RecipientConfig: FC<RecipientConfigProps> = ({ setCollectType }) => {
  const { currentProfile } = useProfileStore();
  const { collectModule } = useCollectModuleStore((state) => state);
  const [value, setValue] = useState(currentProfile?.ownedBy.address);
  const [enabled, setEnabled] = useState(false);

  const { recipient } = collectModule;

  useEffect(() => {
    setEnabled(recipient !== currentProfile?.ownedBy.address);
  }, [recipient, currentProfile]);

  const handleToggle = () => {
    const newRecipient = enabled ? currentProfile?.ownedBy.address : null;
    setCollectType({ recipient: newRecipient });
    setEnabled(!enabled);

    if (!enabled) {
      setValue('');
    }
  };

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Set the recipient for the collect fee"
        heading={
          <div className="flex items-center space-x-2">
            <span>Recipient</span>
            <New />
          </div>
        }
        icon={<UserIcon className="size-5" />}
        on={enabled}
        setOn={handleToggle}
      />
      {enabled ? (
        <div className="ml-8 mt-4 space-y-3">
          <SearchProfiles
            error={value.length && !isAddress(value)}
            hideDropdown={isAddress(value)}
            onChange={(event) => setValue(event.target.value)}
            onProfileSelected={(profile) => {
              setValue(profile.ownedBy.address);
              setCollectType({ recipient: profile.ownedBy.address });
            }}
            placeholder={`${ADDRESS_PLACEHOLDER} or wagmi`}
            value={value}
          />
        </div>
      ) : null}
    </div>
  );
};

export default RecipientConfig;
