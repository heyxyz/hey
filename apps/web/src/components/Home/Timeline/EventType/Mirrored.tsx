import type { Mirror } from '@hey/lens';
import type { FC } from 'react';

import Profiles from '@components/Shared/Profiles';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

interface MirroredProps {
  mirrors: Mirror[];
}

const Mirrored: FC<MirroredProps> = ({ mirrors }) => {
  const getMirroredProfiles = () => {
    let profiles = mirrors.map((mirror) => mirror.by);
    profiles = profiles.filter(
      (profile, index, self) =>
        index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]">
      <ArrowsRightLeftIcon className="size-4" />
      <Profiles context="mirrored" profiles={getMirroredProfiles()} />
    </div>
  );
};

export default Mirrored;
