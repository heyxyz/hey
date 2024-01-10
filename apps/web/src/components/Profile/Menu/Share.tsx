import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import getProfile from '@hey/lib/getProfile';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Leafwatch } from '@lib/leafwatch';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import toast from 'react-hot-toast';

interface ShareProps {
  profile: Profile;
}

const Share: FC<ShareProps> = ({ profile }) => {
  return (
    <DropdownMenuItem
      className="m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
      onClick={async (event) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(
          `${location.origin}${getProfile(profile).link}`
        );
        toast.success('Copied to clipboard!');
        Leafwatch.track(PROFILE.COPY_PROFILE_LINK, {
          profile_id: profile.id
        });
      }}
    >
      <ClipboardDocumentIcon className="size-4" />
      <div>Copy link</div>
    </DropdownMenuItem>
  );
};

export default Share;
