import Profiles from '@components/Shared/Profiles';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import type { OpenActionProfileActed } from '@lenster/lens';
import { t } from '@lingui/macro';
import type { FC } from 'react';

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
    <div className="lt-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]">
      <RectangleStackIcon className="h-4 w-4" />
      <Profiles profiles={getCollectedProfiles()} context={t`acted`} />
    </div>
  );
};

export default Acted;
