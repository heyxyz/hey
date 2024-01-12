import type { ReactionEvent } from '@hey/lens';
import type { FC } from 'react';

import Profiles from '@components/Shared/Profiles';
import { HeartIcon } from '@heroicons/react/24/outline';

interface LikedProps {
  reactions: ReactionEvent[];
}

const Liked: FC<LikedProps> = ({ reactions }) => {
  const getLikedProfiles = () => {
    let profiles = reactions.map((event) => event.by);
    profiles = profiles.filter(
      (profile, index, self) =>
        index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div
      className={
        'ld-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]'
      }
    >
      <HeartIcon className="size-4" />
      <Profiles context="liked" profiles={getLikedProfiles()} />
    </div>
  );
};

export default Liked;
