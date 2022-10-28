import type { ReactionEvent } from '@generated/types';
import { HeartIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  reactions: Array<ReactionEvent>;
}

const Liked: FC<Props> = ({ reactions }) => {
  const getLikedProfiles = () => {
    let profiles = reactions.map((event) => event.profile);
    profiles = profiles.filter(
      (profile, index, self) => index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div className={'flex items-center pb-4 space-x-1 text-gray-500 text-[13px]'}>
      <HeartIcon className="w-4 h-4" />
      <ProfileCircles profiles={getLikedProfiles()} context="Liked by" />
    </div>
  );
};

export default Liked;
