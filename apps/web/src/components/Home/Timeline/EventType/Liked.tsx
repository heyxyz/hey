import { HeartIcon } from '@heroicons/react/24/outline';
import type { ReactionEvent } from '@hey/lens';
import { type FC } from 'react';

import Profiles from '@/components/Shared/Profiles';

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
      <HeartIcon className="h-4 w-4" />
      <Profiles profiles={getLikedProfiles()} context="liked" />
    </div>
  );
};

export default Liked;
