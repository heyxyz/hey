import type { MirrorEvent } from '@generated/types';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  mirrors: Array<MirrorEvent>;
  isComment?: boolean;
}

const Mirrored: FC<Props> = ({ mirrors, isComment }) => {
  const getMirroredProfiles = () => {
    let profiles = mirrors.map((event) => event.profile);
    profiles = profiles.filter(
      (profile, index, self) => index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div
      className={clsx('flex items-center pb-4 space-x-1 text-gray-500 text-[13px]', {
        'ml-[45px] !pb-2': isComment
      })}
    >
      <SwitchHorizontalIcon className="w-4 h-4" />
      <ProfileCircles
        profiles={getMirroredProfiles()}
        context="Mirrored by"
        totalCount={getMirroredProfiles().length}
      />
    </div>
  );
};

export default Mirrored;
