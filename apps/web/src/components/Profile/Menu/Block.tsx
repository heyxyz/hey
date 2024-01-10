import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { NoSymbolIcon } from '@heroicons/react/24/outline';
import getProfile from '@hey/lib/getProfile';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
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
    <DropdownMenuItem
      className="m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
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
    </DropdownMenuItem>
  );
};

export default Block;
