import Profiles from '@components/Shared/Profiles';
import { HeartIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { ReactionEvent } from 'lens';
import type { FC } from 'react';

interface LikedProps {
  reactions: ReactionEvent[];
}

const Liked: FC<LikedProps> = ({ reactions }) => {
  const getLikedProfiles = () => {
    let profiles = reactions.map((event) => event.profile);
    profiles = profiles.filter(
      (profile, index, self) => index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div className={'lt-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]'}>
      <HeartIcon className="h-4 w-4" />
      <Profiles profiles={getLikedProfiles()} context={t`liked`} />
    </div>
  );
};

export default Liked;
