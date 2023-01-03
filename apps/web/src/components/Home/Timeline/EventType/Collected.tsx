import { CollectionIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { CollectedEvent } from 'lens';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  collects: Array<CollectedEvent>;
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
    <div className="flex items-center pb-4 space-x-1 lt-text-gray-500 text-[13px]">
      <CollectionIcon className="w-4 h-4" />
      <ProfileCircles profiles={getCollectedProfiles()} context={t`Collected by`} />
    </div>
  );
};

export default Collected;
