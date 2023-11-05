import { Menu } from '@headlessui/react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, memo } from 'react';
import toast from 'react-hot-toast';

interface ShareProps {
  profile: Profile;
}

const Share: FC<ShareProps> = ({ profile }) => {
  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
        )
      }
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
      <div className="flex items-center space-x-2">
        <ClipboardDocumentIcon className="h-4 w-4" />
        <div>Copy link</div>
      </div>
    </Menu.Item>
  );
};

export default memo(Share);
