import { CollectionIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { CollectedEvent } from 'lens';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  collects: CollectedEvent[];
}

const Collected: FC<Props> = ({ collects }) => {
  const getCollectedProfiles = () => {
    let profiles = collects.map((event) => event.profile);
    profiles = profiles.filter(
      (profile, index, self) => index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div className="lt-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]">
      <CollectionIcon className="h-4 w-4" />
      <ProfileCircles profiles={getCollectedProfiles()} context={t`Collected by`} />
    </div>
  );
};

export default Collected;
