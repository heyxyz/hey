import type { ReactionEvent } from '@generated/types';
import { HeartIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  reactions: Array<ReactionEvent>;
}

const Reacted: FC<Props> = ({ reactions }) => {
  const getReactedProfiles = () => {
    let profiles = reactions.map((event) => event.profile);
    profiles = profiles.filter(
      (profile, index, self) => index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div className={'flex items-center pb-4 space-x-1 text-gray-500 text-[13px]'}>
      <HeartIcon className="w-4 h-4" />
      <ProfileCircles profiles={getReactedProfiles()} context="Reacted by" />
    </div>
  );
};

export default Reacted;
