import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import getProfile from '@hey/lib/getProfile';
import humanize from '@hey/lib/humanize';
import Link from 'next/link';
import plur from 'plur';

interface FolloweringsProps {
  profile: Profile;
}

const Followerings: FC<FolloweringsProps> = ({ profile }) => {
  return (
    <div className="flex gap-8">
      <Link
        className="text-left outline-offset-4"
        href={`${getProfile(profile).link}/following`}
      >
        <div className="text-xl">{humanize(profile.stats.following)}</div>
        <div className="ld-text-gray-500">Following</div>
      </Link>
      <Link
        className="text-left outline-offset-4"
        href={`${getProfile(profile).link}/followers`}
      >
        <div className="text-xl">{humanize(profile.stats.followers)}</div>
        <div className="ld-text-gray-500">
          {plur('Follower', profile.stats.followers)}
        </div>
      </Link>
    </div>
  );
};

export default Followerings;
