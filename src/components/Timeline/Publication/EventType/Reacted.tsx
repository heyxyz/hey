import type { ReactionEvent } from '@generated/types';
import { HeartIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  reactions: Array<ReactionEvent>;
  isComment?: boolean;
}

const Reacted: FC<Props> = ({ reactions, isComment }) => {
  const getReactedProfiles = () => {
    let profiles = reactions.map((event) => event.profile);
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
      <HeartIcon className="w-4 h-4" />
      <ProfileCircles
        profiles={getReactedProfiles()}
        context="Reacted by"
        totalCount={getReactedProfiles().length}
      />
    </div>
  );
};

export default Reacted;
