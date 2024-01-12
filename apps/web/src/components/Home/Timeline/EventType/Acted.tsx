import type { OpenActionProfileActed } from '@hey/lens';
import type { FC } from 'react';

import Profiles from '@components/Shared/Profiles';
import { RectangleStackIcon } from '@heroicons/react/24/outline';

interface ActedProps {
  acted: OpenActionProfileActed[];
}

const Acted: FC<ActedProps> = ({ acted }) => {
  const getCollectedProfiles = () => {
    let profiles = acted.map((event) => event.by);
    profiles = profiles.filter(
      (profile, index, self) =>
        index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]">
      <RectangleStackIcon className="size-4" />
      <Profiles context="acted" profiles={getCollectedProfiles()} />
    </div>
  );
};

export default Acted;
