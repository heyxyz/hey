import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { MirrorEvent } from 'lens';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  mirrors: MirrorEvent[];
}

const Mirrored: FC<Props> = ({ mirrors }) => {
  const getMirroredProfiles = () => {
    let profiles = mirrors.map((event) => event.profile);
    profiles = profiles.filter(
      (profile, index, self) => index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div className="flex items-center pb-4 space-x-1 lt-text-gray-500 text-[13px]">
      <SwitchHorizontalIcon className="w-4 h-4" />
      <ProfileCircles profiles={getMirroredProfiles()} context={t`Mirrored by`} />
    </div>
  );
};

export default Mirrored;
