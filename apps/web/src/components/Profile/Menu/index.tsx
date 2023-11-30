import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import type { Profile } from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import useProfileStore from '@persisted/useProfileStore';
import type { FC } from 'react';
import { Fragment } from 'react';

import Block from './Block';
import Report from './Report';
import Share from './Share';

interface ProfileMenuProps {
  profile: Profile;
}

const ProfileMenu: FC<ProfileMenuProps> = ({ profile }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  return (
    <Menu as="div" className="relative">
      <Menu.Button as={Fragment}>
        <button
          className="rounded-full p-1.5 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          aria-label="More"
        >
          <EllipsisVerticalIcon className="ld-text-gray-500 h-5 w-5" />
        </button>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          <Share profile={profile} />
          {currentProfile && currentProfile?.id !== profile.id ? (
            <>
              <Block profile={profile} />
              <Report profile={profile} />
            </>
          ) : null}
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default ProfileMenu;
