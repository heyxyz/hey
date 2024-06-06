import type { Profile } from '@good/lens';
import type { FC } from 'react';

import { PROFILE } from '@good/data/tracking';
import getProfile from '@good/helpers/getProfile';
import stopEventPropagation from '@good/helpers/stopEventPropagation';
import cn from '@good/ui/cn';
import { MenuItem } from '@headlessui/react';
import { Leafwatch } from '@helpers/leafwatch';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ShareProps {
  profile: Profile;
}

const Share: FC<ShareProps> = ({ profile }) => {
  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { 'dropdown-active': focus },
          'm-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm'
        )
      }
      onClick={async (event) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(
          `${location.origin}${getProfile(profile).link}`
        );
        toast.success('Copied to clipboard!');
        Leafwatch.track(PROFILE.COPY_PROFILE_LINK, { profile_id: profile.id });
      }}
    >
      <ClipboardDocumentIcon className="size-4" />
      <div>Copy link</div>
    </MenuItem>
  );
};

export default Share;
