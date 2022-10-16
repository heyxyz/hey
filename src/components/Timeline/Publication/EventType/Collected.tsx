import type { CollectedEvent } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  collects: Array<CollectedEvent>;
  isComment?: boolean;
}

const Collected: FC<Props> = ({ collects, isComment }) => {
  const getCollectedProfiles = () => {
    let profiles = collects.map((event) => event.profile);
    profiles = profiles.filter(
      (profile, index, self) => index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div
      className={clsx('flex items-center pb-4 space-x-1 text-gray-500 text-[13px]', {
        'ml-[45px] !pb-2': isComment
      })}
    >
      <CollectionIcon className="w-4 h-4" />
      <ProfileCircles
        profiles={getCollectedProfiles()}
        context="Collected by"
        totalCount={getCollectedProfiles().length}
      />
    </div>
  );
};

export default Collected;
