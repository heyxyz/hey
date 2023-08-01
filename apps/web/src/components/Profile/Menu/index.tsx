import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import type { Profile } from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import type { FC } from 'react';
import { Fragment } from 'react';
import { useAppStore } from 'src/store/app';

import Report from './Report';
import Share from './Share';

interface ProfileMenuProps {
  profile: Profile;
}

const ProfileMenu: FC<ProfileMenuProps> = ({ profile }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <Menu as="div" className="relative">
      <Menu.Button as={Fragment}>
        <button
          className="rounded-full p-1.5 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          aria-label="More"
          data-testid={`profile-${profile.id}-menu`}
        >
          <DotsVerticalIcon className="lt-text-gray-500 h-5 w-5" />
        </button>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          data-testid={`profile-${profile.id}-menu-items`}
        >
          <Share profile={profile} />
          {currentProfile && currentProfile?.id !== profile.id && (
            <Report profile={profile} />
          )}
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default ProfileMenu;
