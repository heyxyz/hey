import Profiles from '@components/Shared/Profiles';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { MirrorEvent } from 'lens';
import type { FC } from 'react';

interface MirroredProps {
  mirrors: MirrorEvent[];
}

const Mirrored: FC<MirroredProps> = ({ mirrors }) => {
  const getMirroredProfiles = () => {
    let profiles = mirrors.map((event) => event.profile);
    profiles = profiles.filter(
      (profile, index, self) => index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div className="lt-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]">
      <SwitchHorizontalIcon className="h-4 w-4" />
      <Profiles profiles={getMirroredProfiles()} context={t`mirrored`} />
    </div>
  );
};

export default Mirrored;
