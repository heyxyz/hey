import { HeartIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { ReactionEvent } from 'lens';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  reactions: ReactionEvent[];
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
    <div className={'lt-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]'}>
      <HeartIcon className="h-4 w-4" />
      <ProfileCircles profiles={getLikedProfiles()} context={t`Liked by`} />
    </div>
  );
};

export default Liked;
