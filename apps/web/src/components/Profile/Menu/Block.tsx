import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { Menu } from '@headlessui/react';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import getProfile from '@hey/lib/getProfile';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

interface BlockProps {
  profile: Profile;
}

const Block: FC<BlockProps> = ({ profile }) => {
  const setShowBlockOrUnblockAlert = useGlobalAlertStateStore(
    (state) => state.setShowBlockOrUnblockAlert
  );
  const isBlockedByMe = profile.operations.isBlockedByMe.value;

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm'
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        setShowBlockOrUnblockAlert(true, profile);
      }}
    >
      <NoSymbolIcon className="size-4" />
      <div>
        {isBlockedByMe ? 'Unblock' : 'Block'}{' '}
        {getProfile(profile).slugWithPrefix}
      </div>
    </Menu.Item>
  );
};

export default Block;
