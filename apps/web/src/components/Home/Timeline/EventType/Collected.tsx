import Profiles from '@components/Shared/Profiles';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import type { CollectedEvent } from '@hey/lens';
import { t } from '@lingui/macro';
import type { FC } from 'react';

interface CollectedProps {
  collects: CollectedEvent[];
}

const Collected: FC<CollectedProps> = ({ collects }) => {
  const getCollectedProfiles = () => {
    let profiles = collects.map((event) => event.profile);
    profiles = profiles.filter(
      (profile, index, self) =>
        index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div className="lt-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]">
      <RectangleStackIcon className="h-4 w-4" />
      <Profiles profiles={getCollectedProfiles()} context={t`collected`} />
    </div>
  );
};

export default Collected;
