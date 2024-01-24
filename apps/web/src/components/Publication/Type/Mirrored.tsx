import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import Profiles from '@components/Shared/Profiles';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

interface MirroredProps {
  profile: Profile;
}

const Mirrored: FC<MirroredProps> = ({ profile }) => {
  return (
    <div className="ld-text-gray-500 mb-3 flex items-center space-x-1 text-[13px]">
      <ArrowsRightLeftIcon className="size-4" />
      <Profiles context="mirrored" profiles={[profile]} />
    </div>
  );
};

export default Mirrored;
