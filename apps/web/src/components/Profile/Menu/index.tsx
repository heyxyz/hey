import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
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
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="More"
          className="rounded-full p-1.5 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          type="button"
        >
          <EllipsisVerticalIcon className="ld-text-gray-500 size-5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align={'start'}
        className="menu-transition absolute -left-2 z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
      >
        <Share profile={profile} />
        {currentProfile && currentProfile?.id !== profile.id ? (
          <>
            <Block profile={profile} />
            <Report profile={profile} />
          </>
        ) : null}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ProfileMenu;
