import type { Mirror } from '@hey/lens';
import type { FC } from 'react';

import Profiles from '@components/Shared/Profiles';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

interface MirroredProps {
  publication: Mirror;
}

const Mirrored: FC<MirroredProps> = ({ publication }) => {
  return (
    <div className="ld-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]">
      <ArrowsRightLeftIcon className="size-4" />
      <Profiles context="mirrored" profiles={[publication.by]} />
    </div>
  );
};

export default Mirrored;
