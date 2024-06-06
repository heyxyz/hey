import type { Profile } from '@good/lens';
import type { FC } from 'react';

import MenuTransition from '@components/Shared/MenuTransition';
import stopEventPropagation from '@good/helpers/stopEventPropagation';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Block from './Block';
import Report from './Report';
import Share from './Share';

interface ProfileMenuProps {
  profile: Profile;
}

const ProfileMenu: FC<ProfileMenuProps> = ({ profile }) => {
  const { currentProfile } = useProfileStore();

  return (
    <Menu as="div" className="relative">
      <MenuButton as={Fragment}>
        <button
          aria-label="More"
          className="rounded-full p-1.5 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          type="button"
        >
          <EllipsisVerticalIcon className="ld-text-gray-500 size-5" />
        </button>
      </MenuButton>
      <MenuTransition>
        <MenuItems
          className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          <Share profile={profile} />
          {currentProfile && currentProfile?.id !== profile.id ? (
            <>
              <Block profile={profile} />
              <Report profile={profile} />
            </>
          ) : null}
        </MenuItems>
      </MenuTransition>
    </Menu>
  );
};

export default ProfileMenu;
