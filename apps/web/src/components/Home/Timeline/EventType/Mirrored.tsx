import Profiles from '@components/Shared/Profiles';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import type { Mirror } from '@lenster/lens';
import { t } from '@lingui/macro';
import type { FC } from 'react';

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
    <div className="lt-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]">
      <ArrowsRightLeftIcon className="h-4 w-4" />
      <Profiles profiles={getMirroredProfiles()} context={t`mirrored`} />
    </div>
  );
};

export default Mirrored;
