import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Fragment } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

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
          aria-label="More"
          className="rounded-full p-1.5 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          type="button"
        >
          <EllipsisVerticalIcon className="ld-text-gray-500 size-5" />
        </button>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
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
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default ProfileMenu;
